/* ────────────────────────────────────────────────────────────────
   Visitor session — Bode Conversion Lab

   POST { visitorId, page, referrer, utmSource, utmMedium, utmCampaign }
   Creates a visitor record on first contact, or updates an existing
   one on return. A "session" here means: more than 30 minutes since
   this visitor's last recorded activity — that's the usual definition
   analytics tools use to decide a new visit vs. continuing the same one.

   Business identification (free tier, see _business-id.js) only runs
   ONCE per visitor, on their first-ever session — no point re-running
   it on every page load once we already have a result (or already know
   there wasn't one).

   Place this file at: /api/visitor/session.js
──────────────────────────────────────────────────────────────────── */

import { getRedisClient } from "../_redis.js";
import { identifyBusinessFromIP } from "../_business-id.js";
import { newVisitorId } from "../_lead.js";

const VISITOR_KEY = id => `bcl:visitor:${id}`;
const VISITOR_INDEX = "bcl:visitor_ids";
const SESSION_GAP_MS = 30 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { page, referrer, utmSource, utmMedium, utmCampaign } = req.body || {};
  let { visitorId } = req.body || {};
  const now = new Date().toISOString();
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress;

  try {
    const redis = await getRedisClient();
    let isNew = !visitorId;
    let visitor = null;

    if (visitorId) {
      const raw = await redis.get(VISITOR_KEY(visitorId));
      if (raw) visitor = JSON.parse(raw);
      else isNew = true; // client had an id from a previous deploy/clear that we don't recognize
    }
    if (isNew) visitorId = visitorId || newVisitorId();

    const isNewSession = !visitor || (Date.now() - new Date(visitor.lastSeenAt).getTime() > SESSION_GAP_MS);

    if (!visitor) {
      visitor = {
        visitorId, firstSeenAt: now, lastSeenAt: now,
        sessionCount: 1, firstPage: page, lastPage: page,
        referrer: referrer || null, utmSource: utmSource || null, utmMedium: utmMedium || null, utmCampaign: utmCampaign || null,
        pageViews: page ? [page] : [],
        companyId: null, contactId: null, isReturning: false,
        intentScore: 5,
      };
      // Only attempt this once, ever, per visitor — see file header.
      const business = await identifyBusinessFromIP(ip);
      if (business) visitor.company = business;
      await redis.sAdd(VISITOR_INDEX, visitorId);
    } else {
      visitor.lastSeenAt = now;
      visitor.lastPage = page || visitor.lastPage;
      if (isNewSession) { visitor.sessionCount = (visitor.sessionCount || 1) + 1; visitor.isReturning = true; }
    }

    await redis.set(VISITOR_KEY(visitorId), JSON.stringify(visitor));
    res.status(200).json({ visitorId, returning: visitor.isReturning || false, sessionCount: visitor.sessionCount });
  } catch (err) {
    // Tracking should never be the reason a page fails to load.
    console.error("visitor/session error:", err.message);
    res.status(200).json({ visitorId: visitorId || newVisitorId(), returning: false, sessionCount: 1 });
  }
}
