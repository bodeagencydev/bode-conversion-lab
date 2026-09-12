/* ────────────────────────────────────────────────────────────────
   Admin: send a campaign — Bode Conversion Lab

   POST { subject, body } — sends that email to every subscriber in
   Redis, via Resend. Protected by the same x-admin-password header
   as emails.js.

   ENVIRONMENT VARIABLES NEEDED:
   - RESEND_API_KEY  → from resend.com (free tier: 3,000 emails/mo,
                        100/day). Create an account, verify a sending
                        domain (or use their onboarding@resend.dev
                        test address while you're setting this up),
                        then Settings → API Keys → Create.
   - FROM_EMAIL      → e.g. "Bode Conversion Lab <updates@bodeconversionlab.com>"
                        — must be on a domain you've verified in Resend.
                        Falls back to Resend's test address if unset,
                        which only delivers to your own verified email
                        until you verify a real domain.

   Sends are batched (20 at a time) to stay comfortably inside a
   serverless function's execution time limit — fine for list sizes
   up to a few thousand; if this list gets much bigger than that,
   move to Resend's dedicated /emails/batch endpoint instead.

   Place this file at: /api/admin/send-campaign.js
──────────────────────────────────────────────────────────────────── */

import { getRedisClient, isAdminAuthed } from "../_redis.js";

const SUBSCRIBERS_KEY = "bcl:subscribers";
const RESEND_API_KEY  = process.env.RESEND_API_KEY;
const FROM_EMAIL       = process.env.FROM_EMAIL || "Bode Conversion Lab <onboarding@resend.dev>";
const BATCH_SIZE = 20;

async function sendOne(to, subject, html) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!r.ok) { const t = await r.text(); throw new Error(`${to}: ${t}`); }
}

export default async function handler(req, res) {
  if (!isAdminAuthed(req)) return res.status(401).json({ error: "Unauthorized" });
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!RESEND_API_KEY) return res.status(500).json({ error: "RESEND_API_KEY not set — add it in Vercel env vars first" });

  const { subject, body } = req.body || {};
  if (!subject || !body) return res.status(400).json({ error: "subject and body are required" });

  // Plain textarea input from the admin form, so line breaks need to become
  // real <br> tags for the HTML email — kept deliberately simple rather
  // than pulling in a rich-text editor for a v1.
  const html = `<div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#111;max-width:560px">${body.replace(/\n/g, "<br>")}</div>`;

  try {
    const redis = await getRedisClient();
    const all = await redis.hGetAll(SUBSCRIBERS_KEY);
    const emails = Object.values(all).map(raw => JSON.parse(raw).email);

    let sent = 0, failed = [];
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(batch.map(e => sendOne(e, subject, html)));
      results.forEach((r, idx) => { if (r.status === "fulfilled") sent++; else failed.push(batch[idx]); });
    }
    res.status(200).json({ ok: true, sent, failed, total: emails.length });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
