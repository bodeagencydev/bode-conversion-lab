/* ────────────────────────────────────────────────────────────────
   Visitor tracking — Bode Conversion Lab

   POST { type: "session", visitorId, page, referrer, utmSource, utmMedium, utmCampaign }
   POST { type: "event", visitorId, page }

   Merged from what used to be two separate files (visitor/session.js
   + visitor/event.js) specifically to stay under Vercel Hobby's
   12-serverless-function limit per deployment — dispatches on `type`
   instead. Behavior is otherwise identical to before.

   Place this file at: /api/visitor.js
──────────────────────────────────────────────────────────────────── */

import { getRedisClient } from "../lib/redis.js";
import { identifyBusinessFromIP } from "../lib/business-id.js";
import { newVisitorId, computeIntentScore } from "../lib/lead.js";

const VISITOR_KEY = id => `bcl:visitor:${id}`;
const VISITOR_INDEX = "bcl:visitor_ids";
const SESSION_GAP_MS = 30 * 60 * 1000;

async function handleSession(req, res) {
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
      else isNew = true;
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
    console.error("visitor session error:", err.message);
    res.status(200).json({ visitorId: visitorId || newVisitorId(), returning: false, sessionCount: 1 });
  }
}

async function handleEvent(req, res) {
  const { visitorId, page } = req.body || {};
  if (!visitorId) return res.status(400).json({ error: "visitorId is required" });

  try {
    const redis = await getRedisClient();
    const raw = await redis.get(VISITOR_KEY(visitorId));
    if (!raw) return res.status(200).json({ ok: false });

    const visitor = JSON.parse(raw);
    visitor.pageViews = [...(visitor.pageViews || []), page].slice(-50);
    visitor.lastPage = page;
    visitor.lastSeenAt = new Date().toISOString();
    visitor.intentScore = computeIntentScore({
      sessionCount: visitor.sessionCount,
      pageViews: visitor.pageViews,
      hasEmail: !!visitor.contactId,
    });
    await redis.set(VISITOR_KEY(visitorId), JSON.stringify(visitor));
    res.status(200).json({ ok: true, intentScore: visitor.intentScore });
  } catch (err) {
    console.error("visitor event error:", err.message);
    res.status(200).json({ ok: false });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { type } = req.body || {};
  if (type === "event") return handleEvent(req, res);
  return handleSession(req, res);
}
