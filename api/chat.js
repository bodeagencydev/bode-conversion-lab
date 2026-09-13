/* ────────────────────────────────────────────────────────────────
   Site chat widget backend — Bode Conversion Lab

   POST { messages: [{role, content}, ...] } → calls Google's Gemini
   API server-side (so the key never reaches the browser) and returns
   the assistant's reply.

   Using Gemini instead of the Claude/Anthropic API on purpose: Gemini
   currently has a genuine standing free tier (current Flash models,
   no credit card required) — the Anthropic API is pay-per-use with
   no free tier, and cost was the deciding factor here. If that ever
   changes and paying becomes worth it for quality, swapping this
   file for an Anthropic call is a small, contained change — nothing
   else in the app talks to this API directly.

   ENVIRONMENT VARIABLES NEEDED:
   - GEMINI_API_KEY  → aistudio.google.com/apikey — sign in with any
                        Google account, click "Create API key". No
                        card required for the free tier.

   Place this file at: /api/chat.js
──────────────────────────────────────────────────────────────────── */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are the assistant on the Bode Conversion Lab website (bodeconversionlab.vercel.app) — a Shopify conversion-rate-optimization and ads-engineering agency run by Fiyin (a former 4-year e-commerce store operator, now running this agency). You should behave like a genuinely capable, direct, helpful assistant — think and reason things through properly, don't just pattern-match to a script — and proactively tell people what to actually do next rather than just answering and stopping.

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

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!GEMINI_API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not set — add it in Vercel env vars first" });

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 600 },
        }),
      }
    );

    if (!r.ok) {
      const errText = await r.text();
      console.error("Gemini API error:", errText);
      return res.status(502).json({ error: "Chat service unavailable right now" });
    }

    const data = await r.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("chat handler error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
}
