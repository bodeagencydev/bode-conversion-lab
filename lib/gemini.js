/* ────────────────────────────────────────────────────────────────
   Shared Gemini helper — Bode Conversion Lab

   One place for the model fallback chain, the brand system prompt, and
   the request logic, used by BOTH:
     - api/chat.js              (website chat widget)
     - api/whatsapp-webhook.js  (AI answers to WhatsApp follow-up questions)

   Lives in /lib (not /api) on purpose: every file directly under /api
   counts as a serverless function, and the Hobby plan caps those at 12.

   ENVIRONMENT VARIABLES NEEDED:
   - GEMINI_API_KEY  → aistudio.google.com/apikey (free tier, no card)
──────────────────────────────────────────────────────────────────── */

// A fallback chain, not a single hardcoded model: pinned model IDs get
// deprecated or go temporarily busy without warning. Try the pinned model
// first, then the alias. Only 404 (gone), 503 (busy) and 429 (rate limit)
// fall through; anything else would fail the same way on every model.
export const GEMINI_MODELS = ["gemini-3.6-flash", "gemini-flash-latest"];

export const BODE_SYSTEM_PROMPT = `You are the assistant on the Bode Conversion Lab website (bodeconversionlab.vercel.app) — a Shopify conversion-rate-optimization and ads-engineering agency run by Fiyin (a former 4-year e-commerce store operator, now running this agency). You should behave like a genuinely capable, direct, helpful assistant — think and reason things through properly, don't just pattern-match to a script — and proactively tell people what to actually do next rather than just answering and stopping.

COMPANY POSITIONING: "We don't run ads. We engineer ROAS." Most agencies run ads first; Bode fixes the store first (checkout friction, trust signals, site speed), because sending traffic to a leaky funnel just burns budget faster. This is called the Sales Recovery System (SRS), four phases:
1. Foundation Fix — fix leaks & trust signals first
2. Traffic Ignition — controlled ad tests find winners
3. Scale & Compound — double down on what's proven
4. Systemize — document it so it runs itself

PROOF POINT: best result so far took a client from $1k/month to $70k/month in 90 days (0.8x to 4.2x ROAS improvement, same product, same budget).

PRICING PACKAGES (see /pricing for full detail and checkout):
- Store Diagnosis — $175 — a lighter, fast starting point
- Conversion Fix — $497 — the full store/ads/funnel audit, 30-page action report + strategy call
- The Lab — $997/mo — ongoing retainer, month-to-month, no lock-in contract
- Full Stack — $1997 — the complete build/fix package

INDIVIDUAL SERVICES (see /pricing or ask about a specific one): Store Audit ($497, finds every leak in 48hrs), Ad Management (from $2,000/mo, Meta & TikTok), CRO Optimization (from $2,000/mo), Landing Pages (from $2,000/mo), Email Flows / Klaviyo (from $2,000/mo), SEO & Organic Growth (from $1,500/mo), SMS Marketing (from $1,200/mo), Retention & Loyalty (from $1,500/mo), Tracking & Analytics (from $997), Store Setup & Migration (from $1,997).

COMMON QUESTIONS, answer these directly and confidently:
- No big ad budget needed — works with clients at different budget levels; what matters is a proven product and willingness to act on findings.
- Most clients see measurable improvement within 30 days, bigger compounding by month 3.
- Works with Shopify, WooCommerce, Magento, BigCommerce; ad platforms Meta, TikTok, Google.
- What makes Bode different: fixes the whole system first (speed, product pages, checkout, email) before layering ads on top, rather than just running ads.
- The Lab retainer is month-to-month, no long-term contract.
- If someone's just starting out with little to no traffic yet, the Audit/Store Diagnosis is the right entry point.

BE PROACTIVE: when someone describes a problem or situation (e.g. "my conversion rate is low," "I'm just starting out," "my ads aren't profitable"), don't just explain — recommend the specific package or service that fits and tell them the concrete next step (which page to visit, or to message on WhatsApp / use the Free Audit page / go to /contact). Guide, don't just inform.

For anything outside Bode's world — general questions, unrelated topics — just be a genuinely good, helpful assistant about it, the way Claude would be. Don't force an unrelated conversation back to sales. Be concise, warm, and direct. If someone wants to talk to a real person, point them to the WhatsApp link or /contact.`;

/* Appended when the reply is going out over WhatsApp instead of the site chat. */
export const WHATSAPP_ADDENDUM = `

CHANNEL: WHATSAPP. You are now replying inside a WhatsApp chat, not on the website. Rules for this channel:
- Keep replies short: 40 to 80 words unless the person clearly needs more. One idea per message.
- Plain conversational text only. No markdown headings, no tables, no double asterisks. You may use *single asterisks* for the odd bold word.
- The person has already shared their details with Fiyin, who will follow up personally. Never re-ask for their name, store link or other intake details.
- Answer their follow-up question directly. If they ask for something you cannot know (their store's specific numbers, a custom quote, a timeline for their exact case), say Fiyin will confirm it personally rather than guessing.
- If they ask whether you are a bot or an AI, be honest: you are Bode's AI assistant, and Fiyin (a real person) will follow up personally.
- Point to a next step when it helps: the Free Audit page, the Pricing page, or tapping "Talk to Fiyin".`;

async function callGemini({ model, system, contents, maxOutputTokens, timeoutMs }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { maxOutputTokens },
        }),
        signal: controller.signal,
      }
    );
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Ask Gemini. `messages` is [{ role: "user" | "assistant", content }].
 * Returns { ok: true, reply } or { ok: false, error }. Never throws.
 *
 * budgetMs is the TOTAL time allowed across all fallback attempts, so a slow
 * first model cannot push a serverless function past its time limit.
 */
export async function askGemini(messages, opts = {}) {
  const { system = BODE_SYSTEM_PROMPT, maxOutputTokens = 800, budgetMs = 20000 } = opts;
  if (!process.env.GEMINI_API_KEY) return { ok: false, error: "GEMINI_API_KEY not set" };

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const deadline = Date.now() + budgetMs;
  let lastErr = null;

  for (const model of GEMINI_MODELS) {
    const remaining = deadline - Date.now();
    if (remaining < 1500) break; // not enough time left for another attempt
    try {
      const r = await callGemini({ model, system, contents, maxOutputTokens, timeoutMs: remaining });
      if (r.ok) {
        const data = await r.json();
        const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim();
        if (reply) return { ok: true, reply };
        lastErr = "empty response";
        continue;
      }
      const errText = await r.text();
      console.error(`Gemini API error (${model}):`, r.status, errText);
      lastErr = errText;
      if (![404, 503, 429].includes(r.status)) break;
    } catch (err) {
      console.error(`Gemini call error (${model}):`, err.name === "AbortError" ? "timed out" : err.message);
      lastErr = err.name === "AbortError" ? "timed out" : err.message;
      break;
    }
  }
  return { ok: false, error: lastErr || "unavailable" };
}

/**
 * Ask Gemini about an IMAGE (vision). Used for the audit tool's visual read of
 * a screenshot — everything else in this file is text-only.
 * imageBase64 is raw base64 (no "data:" prefix). Returns { ok, reply } or
 * { ok:false, error }, same contract as askGemini, never throws.
 */
export async function askGeminiVision({ imageBase64, mimeType = "image/png", prompt, system, maxOutputTokens = 500, budgetMs = 12000 }) {
  if (!process.env.GEMINI_API_KEY) return { ok: false, error: "GEMINI_API_KEY not set" };
  const contents = [{ role: "user", parts: [{ inline_data: { mime_type: mimeType, data: imageBase64 } }, { text: prompt }] }];

  const deadline = Date.now() + budgetMs;
  let lastErr = null;
  for (const model of GEMINI_MODELS) {
    const remaining = deadline - Date.now();
    if (remaining < 1500) break;
    try {
      const r = await callGemini({ model, system, contents, maxOutputTokens, timeoutMs: remaining });
      if (r.ok) {
        const data = await r.json();
        const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim();
        if (reply) return { ok: true, reply };
        lastErr = "empty response";
        continue;
      }
      const errText = await r.text();
      console.error(`Gemini vision error (${model}):`, r.status, errText);
      lastErr = errText;
      if (![404, 503, 429].includes(r.status)) break;
    } catch (err) {
      console.error(`Gemini vision call error (${model}):`, err.name === "AbortError" ? "timed out" : err.message);
      lastErr = err.name === "AbortError" ? "timed out" : err.message;
      break;
    }
  }
  return { ok: false, error: lastErr || "unavailable" };
}
