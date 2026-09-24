/* ────────────────────────────────────────────────────────────────
   Site chat widget backend — Bode Conversion Lab

   POST { messages: [{role, content}, ...] } → calls Google's Gemini
   API server-side (so the key never reaches the browser) and returns
   the assistant's reply.

   The model fallback chain and the brand system prompt live in
   lib/gemini.js, shared with the WhatsApp webhook.

   ENVIRONMENT VARIABLES NEEDED:
   - GEMINI_API_KEY  → aistudio.google.com/apikey (free tier, no card)

   Place this file at: /api/chat.js
──────────────────────────────────────────────────────────────────── */

import { askGemini } from "../lib/gemini.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not set — add it in Vercel env vars first" });

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const result = await askGemini(
    messages.map((m) => ({ role: m.role, content: String(m.content ?? "") })),
    { maxOutputTokens: 800, budgetMs: 20000 }
  );

  if (result.ok) return res.status(200).json({ reply: result.reply });
  res.status(502).json({ error: "Chat service unavailable right now", detail: result.error });
}
