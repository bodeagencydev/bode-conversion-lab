/* ────────────────────────────────────────────────────────────────
   Admin: leads dashboard — Bode Conversion Lab

   GET, password-protected (same session-token system as
   admin/emails.js). Returns every tracked visitor, joined with their
   contact record (if they've submitted an email) and business-ID
   guess (if the free lookup found one), sorted by intent score.

   Place this file at: /api/admin/leads.js
──────────────────────────────────────────────────────────────────── */

import { getRedisClient, isAdminAuthed } from "../_redis.js";
import { intentLabel } from "../_lead.js";

const VISITOR_KEY = id => `bcl:visitor:${id}`;
const VISITOR_INDEX = "bcl:visitor_ids";
const CONTACT_KEY = email => `bcl:contact:${email}`;

export default async function handler(req, res) {
  if (!(await isAdminAuthed(req))) return res.status(401).json({ error: "Unauthorized" });
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const redis = await getRedisClient();
    const ids = await redis.sMembers(VISITOR_INDEX);
    const visitors = [];

    for (const id of ids) {
      const raw = await redis.get(VISITOR_KEY(id));
      if (!raw) continue;
      const v = JSON.parse(raw);
      let contact = null;
      if (v.contactId) {
        const cRaw = await redis.get(CONTACT_KEY(v.contactId));
        if (cRaw) contact = JSON.parse(cRaw);
      }
      visitors.push({
        visitorId: v.visitorId,
        firstSeenAt: v.firstSeenAt,
        lastSeenAt: v.lastSeenAt,
        sessionCount: v.sessionCount || 1,
        pagesViewed: (v.pageViews || []).length,
        firstPage: v.firstPage,
        lastPage: v.lastPage,
        referrer: v.referrer,
        company: v.company || null, // { companyName, country, confidence, source } or null — see _business-id.js
        contact: contact ? { email: contact.email, emailType: contact.emailType, emailSource: contact.emailSource, emailConfidence: contact.emailConfidence, name: contact.name } : null,
        intentScore: v.intentScore || 5,
        intentLabel: intentLabel(v.intentScore || 5),
      });
    }

    visitors.sort((a, b) => b.intentScore - a.intentScore);
    res.status(200).json({ ok: true, visitors, count: visitors.length });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
