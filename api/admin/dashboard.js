/* ────────────────────────────────────────────────────────────────
   Admin: dashboard — Bode Conversion Lab

   GET, password-protected (session token, see login.js and
   ../../lib/redis.js). Returns BOTH subscribers and leads in one
   response — merged from two separate endpoints (emails.js + leads.js)
   specifically to stay under Vercel Hobby's 12-serverless-function
   limit per deployment. Admin.jsx already loaded both right after
   each other on mount anyway, so this also just means one network
   round trip instead of two.

   Place this file at: /api/admin/dashboard.js
──────────────────────────────────────────────────────────────────── */

import { getRedisClient, isAdminAuthed } from "../../lib/redis.js";
import { intentLabel } from "../../lib/lead.js";

const SUBSCRIBERS_KEY = "bcl:subscribers";
const VISITOR_KEY = id => `bcl:visitor:${id}`;
const VISITOR_INDEX = "bcl:visitor_ids";
const CONTACT_KEY = email => `bcl:contact:${email}`;

export default async function handler(req, res) {
  if (!(await isAdminAuthed(req))) return res.status(401).json({ error: "Unauthorized" });
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const redis = await getRedisClient();

    const allSubs = await redis.hGetAll(SUBSCRIBERS_KEY);
    const subscribers = Object.values(allSubs)
      .map(raw => JSON.parse(raw))
      .sort((a, b) => new Date(b.firstSeen) - new Date(a.firstSeen));

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
        company: v.company || null, // { companyName, country, confidence, source } or null — see lib/business-id.js
        contact: contact ? { email: contact.email, emailType: contact.emailType, emailSource: contact.emailSource, emailConfidence: contact.emailConfidence, name: contact.name } : null,
        intentScore: v.intentScore || 5,
        intentLabel: intentLabel(v.intentScore || 5),
      });
    }
    visitors.sort((a, b) => b.intentScore - a.intentScore);

    res.status(200).json({ ok: true, subscribers, visitors });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
