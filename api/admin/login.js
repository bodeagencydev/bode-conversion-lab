/* ────────────────────────────────────────────────────────────────
   Admin: login — Bode Conversion Lab

   POST { password } → checks it against ADMIN_PASSWORD (server-only
   env var, never sent to the browser) and, if correct, issues a
   random session token stored in Redis for 24h. The browser holds
   onto that token afterward, not the password — see lib/redis.js for
   the reasoning.

   ENVIRONMENT VARIABLES NEEDED:
   - ADMIN_PASSWORD  → same password you were already using as
                        VITE_ADMIN_PASSWORD — just add it again under
                        this new name (no VITE_ prefix) and you can
                        remove the old one. Whatever value you pick,
                        this is the one that actually gates admin
                        access now.

   Place this file at: /api/admin/login.js
──────────────────────────────────────────────────────────────────── */

import { issueAdminSession } from "../../lib/redis.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: "password is required" });

  try {
    const token = await issueAdminSession(password);
    if (!token) return res.status(401).json({ error: "Invalid password" });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
