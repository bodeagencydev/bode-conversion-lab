/* ────────────────────────────────────────────────────────────────
   Subscriber capture — Bode Conversion Lab

   Every email the site collects (newsletter signup, contact form,
   pricing enquiry) gets written here too, in ADDITION to whatever
   already goes to Formspree — this is what gives the admin panel an
   actual list to read, and what the campaign-send endpoint sends to.

   Stored as a single Redis hash, keyed by email — HSET is naturally
   idempotent per field, so re-submitting the same email just
   overwrites its record instead of creating a duplicate.

   ENVIRONMENT VARIABLES NEEDED: none new — reuses REDIS_URL, already
   set up for the WhatsApp webhook.

   Place this file at: /api/subscribe.js
──────────────────────────────────────────────────────────────────── */

import { getRedisClient } from "./_redis.js";

const SUBSCRIBERS_KEY = "bcl:subscribers";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, name = "", source = "unknown" } = req.body || {};
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    const redis = await getRedisClient();
    const existingRaw = await redis.hGet(SUBSCRIBERS_KEY, email.toLowerCase());
    const existing = existingRaw ? JSON.parse(existingRaw) : null;
    await redis.hSet(SUBSCRIBERS_KEY, email.toLowerCase(), JSON.stringify({
      email,
      name: name || existing?.name || "",
      source: existing ? `${existing.source}, ${source}` : source, // keep a trail of every place they signed up
      firstSeen: existing?.firstSeen || new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    }));
    res.status(200).json({ ok: true });
  } catch (err) {
    // Fail soft — this runs alongside Formspree, never in front of it, so a
    // Redis hiccup here should never be the reason a visitor's submission
    // looks like it failed.
    console.error("subscribe error:", err.message);
    res.status(200).json({ ok: false });
  }
}
