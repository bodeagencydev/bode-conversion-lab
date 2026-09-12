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

const SYSTEM_PROMPT = `You are the chat assistant on the Bode Conversion Lab website (bodeconversionlab.vercel.app), a Shopify conversion-rate-optimization and ads-engineering agency run by Fiyin. The company's positioning: "We don't run ads. We engineer ROAS" — they audit and fix a store's checkout, trust signals, and site performance before ever scaling ad spend, using their Sales Recovery System (SRS).

You're a general, genuinely helpful assistant — not a narrow scripted bot. Answer whatever the visitor actually asks, on any topic. When the conversation is about the visitor's store, ads, or conversion problems, you can naturally mention Bode's services (Store Audit, Conversion Fix, The Lab, Full Stack — see /pricing) or suggest they reach out via WhatsApp or the Free Audit page, but don't force it into unrelated conversations. Be concise, warm, and direct. If someone wants to talk to a real person, point them to the WhatsApp link or /contact.`;

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
