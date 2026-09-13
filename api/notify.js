/* ────────────────────────────────────────────────────────────────
   Telegram notification proxy — Bode Conversion Lab

   The site's visitor/form/payment notifications used to call
   Telegram's API directly from the BROWSER, with the bot token
   embedded in the public JS bundle (via VITE_TELEGRAM_TOKEN) — which
   means anyone who opened dev tools could read the full token and
   send messages as that bot, to that chat, indefinitely. This
   endpoint moves the actual Telegram call server-side; the browser
   only ever sends the message text here, never the token.

   ENVIRONMENT VARIABLES NEEDED:
   - TELEGRAM_TOKEN     → same bot token as before, just re-added
                           WITHOUT the VITE_ prefix this time (that
                           prefix is what was making Vite bundle it
                           into public client code in the first
                           place — a plain server-only env var never
                           reaches the browser).
   - TELEGRAM_CHAT_ID   → was hardcoded as "7016026848" before;
                           moved here too since there's no reason for
                           it to be public either, even though it's
                           lower-risk than the token itself.

   Place this file at: /api/notify.js
──────────────────────────────────────────────────────────────────── */

const TELEGRAM_TOKEN   = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "7016026848";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!TELEGRAM_TOKEN) return res.status(200).json({ ok: false }); // silently skip, same as before

  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "message is required" });

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "HTML" }),
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    // Never break the site for a notification failure — same behavior as before.
    console.error("notify error:", err.message);
    res.status(200).json({ ok: false });
  }
}
