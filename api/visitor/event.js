/* ────────────────────────────────────────────────────────────────
   Visitor event — Bode Conversion Lab

   POST { visitorId, eventType, page } — appends to this visitor's
   page-view history (capped at the most recent 50, plenty for intent
   scoring without the record growing forever) and recomputes their
   intent score.

   Place this file at: /api/visitor/event.js
──────────────────────────────────────────────────────────────────── */

import { getRedisClient } from "../_redis.js";
import { computeIntentScore } from "../_lead.js";

const VISITOR_KEY = id => `bcl:visitor:${id}`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { visitorId, page } = req.body || {};
  if (!visitorId) return res.status(400).json({ error: "visitorId is required" });

  try {
    const redis = await getRedisClient();
    const raw = await redis.get(VISITOR_KEY(visitorId));
    if (!raw) return res.status(200).json({ ok: false }); // unknown visitor, nothing to update — fail soft

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
    console.error("visitor/event error:", err.message);
    res.status(200).json({ ok: false });
  }
}
