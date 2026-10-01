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

import { askGemini, BODE_SYSTEM_PROMPT } from "../lib/gemini.js";

/* Builds a short context block from what the browser already knows —
   the page they're on, and (if they ran one) their own audit result —
   so the assistant can talk about THEIR store instead of generic CRO
   advice. Both inputs are optional and this never throws on bad input. */
function contextAddendum(page, auditSummary) {
  const lines = [];
  if (typeof page === "string" && page) lines.push(`PAGE: the visitor is currently on ${page}`);
  if (auditSummary && typeof auditSummary === "object") {
    const { url, grade, overall, topIssues } = auditSummary;
    if (url) {
      const issues = Array.isArray(topIssues) ? topIssues.slice(0, 3).join("; ") : "";
      lines.push(`AUDIT_SUMMARY: this visitor already ran a free audit on ${url}. Grade: ${grade || "?"} (${overall ?? "?"}/100). Top issues found: ${issues || "none logged"}.`);
    }
  }
  if (!lines.length) return "";
  return `\n\n${lines.join("\n")}\nIf PAGE is given, answer with that context in mind. If AUDIT_SUMMARY is given, talk about THEIR store specifically using these details, not generic CRO advice. Recommend one next step only: running the audit, applying on /contact, or messaging on WhatsApp — never all three at once.`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not set — add it in Vercel env vars first" });

  const { messages, page, auditSummary } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const result = await askGemini(
    messages.map((m) => ({ role: m.role, content: String(m.content ?? "") })),
    { system: BODE_SYSTEM_PROMPT + contextAddendum(page, auditSummary), maxOutputTokens: 800, budgetMs: 20000 }
  );

  if (result.ok) return res.status(200).json({ reply: result.reply });
  res.status(502).json({ error: "Chat service unavailable right now", detail: result.error });
}
