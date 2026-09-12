/* ────────────────────────────────────────────────────────────────
   Admin: list all subscribers — Bode Conversion Lab

   GET, returns every email captured via /api/subscribe.js. Protected
   by the x-admin-password header, checked against the same password
   Admin.jsx already gates its UI with (VITE_ADMIN_PASSWORD).

   Place this file at: /api/admin/emails.js
──────────────────────────────────────────────────────────────────── */

import { getRedisClient, isAdminAuthed } from "../_redis.js";

const SUBSCRIBERS_KEY = "bcl:subscribers";

export default async function handler(req, res) {
  if (!isAdminAuthed(req)) return res.status(401).json({ error: "Unauthorized" });
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const redis = await getRedisClient();
    const all = await redis.hGetAll(SUBSCRIBERS_KEY);
    const subscribers = Object.values(all)
      .map(raw => JSON.parse(raw))
      .sort((a, b) => new Date(b.firstSeen) - new Date(a.firstSeen));
    res.status(200).json({ ok: true, subscribers, count: subscribers.length });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
