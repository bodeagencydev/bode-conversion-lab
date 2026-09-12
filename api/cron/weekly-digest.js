/* ────────────────────────────────────────────────────────────────
   Automatic weekly send — Bode Conversion Lab

   This is the fully "automated from the site" piece: Vercel's Cron
   Jobs hit this endpoint on the schedule set in vercel.json (weekly,
   by default) with no one having to click anything. It picks the
   next message from MESSAGES below (round-robin by week number, so
   it doesn't repeat until it's cycled through all of them) and sends
   it to everyone in the subscriber list.

   EDIT THE MESSAGES ARRAY to change what gets sent — this is a
   starting set, swap in your own tips/offers/updates whenever.

   ENVIRONMENT VARIABLES NEEDED:
   - RESEND_API_KEY, FROM_EMAIL  → same as send-campaign.js
   - CRON_SECRET  → any secret string you make up yourself. Set it in
                     Vercel env vars; Vercel automatically sends it
                     back as the Authorization header on every cron
                     trigger, which is what proves the request is
                     really from Vercel's scheduler and not a random
                     visitor hitting this URL.

   Place this file at: /api/cron/weekly-digest.js
   Schedule is set in vercel.json, not here.
──────────────────────────────────────────────────────────────────── */

import { getRedisClient } from "../_redis.js";

const SUBSCRIBERS_KEY = "bcl:subscribers";
const RESEND_API_KEY  = process.env.RESEND_API_KEY;
const FROM_EMAIL      = process.env.FROM_EMAIL || "Bode Conversion Lab <onboarding@resend.dev>";

const MESSAGES = [
  {
    subject: "The #1 reason stores lose sales at checkout",
    body: "Most stores lose more revenue to checkout friction than to bad ads.\n\nA missing guest-checkout option, a slow mobile load, or an account wall right before payment — any one of these can quietly cost you 20-30% of ready-to-buy customers.\n\nWant us to check yours? Reply to this email or grab a free audit: https://bodeconversionlab.vercel.app/audit",
  },
  {
    subject: "Same product. Same budget. Different result.",
    body: "We don't run ads first. We fix the store first — because sending traffic to a leaky funnel just burns your budget faster.\n\nThat one change is usually the difference between a 0.8x and a 4x+ ROAS on the exact same ad spend.\n\nCurious what SRS (our Sales Recovery System) would find in your store? https://bodeconversionlab.vercel.app",
  },
  {
    subject: "A 90-second trust-signal check for your store",
    body: "Missing reviews, no visible refund policy, no live chat — these quietly kill conversion even when your traffic and product are both fine.\n\nOpen your store right now and check: can a first-time visitor find your refund policy in under 10 seconds? If not, that's costing you sales today.",
  },
];

export default async function handler(req, res) {
  const authHeader = req.headers["authorization"] || "";
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ error: "Unauthorized" });
  if (!RESEND_API_KEY) return res.status(500).json({ error: "RESEND_API_KEY not set" });

  // ISO week number, so the rotation is stable and doesn't depend on when
  // this function happens to run.
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
  const msg = MESSAGES[week % MESSAGES.length];
  const html = `<div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#111;max-width:560px">${msg.body.replace(/\n/g, "<br>")}</div>`;

  try {
    const redis = await getRedisClient();
    const all = await redis.hGetAll(SUBSCRIBERS_KEY);
    const emails = Object.values(all).map(raw => JSON.parse(raw).email);

    let sent = 0;
    for (let i = 0; i < emails.length; i += 20) {
      const batch = emails.slice(i, i + 20);
      const results = await Promise.allSettled(batch.map(to =>
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: FROM_EMAIL, to, subject: msg.subject, html }),
        })
      ));
      sent += results.filter(r => r.status === "fulfilled").length;
    }
    res.status(200).json({ ok: true, subject: msg.subject, sent, total: emails.length });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
