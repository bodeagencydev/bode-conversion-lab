/* ────────────────────────────────────────────────────────────────
   Contact capture — Bode Conversion Lab

   POST { visitorId, email, name } — this is the moment an anonymous
   visitor becomes a known lead. Classifies the email (business/
   personal/unknown), creates or updates the contact record, and links
   it back to the visitor so their prior anonymous browsing history is
   preserved rather than lost.

   Runs ALONGSIDE /api/subscribe.js (which still feeds the simple
   marketing-email list used for campaigns) — this is the richer,
   lead-intelligence side of the same submission, not a replacement.

   Place this file at: /api/contact/capture.js
──────────────────────────────────────────────────────────────────── */

import { getRedisClient } from "../_redis.js";
import { classifyEmail, normalizeEmail, isValidEmail, computeIntentScore } from "../_lead.js";

const VISITOR_KEY = id => `bcl:visitor:${id}`;
const CONTACT_KEY = email => `bcl:contact:${email}`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { visitorId, name } = req.body || {};
  const email = normalizeEmail(req.body?.email);
  if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email" });

  try {
    const redis = await getRedisClient();
    let visitor = null;
    if (visitorId) {
      const raw = await redis.get(VISITOR_KEY(visitorId));
      if (raw) visitor = JSON.parse(raw);
    }

    const companyDomain = visitor?.company?.domain || null;
    const emailType = classifyEmail(email, companyDomain);

    const existingRaw = await redis.get(CONTACT_KEY(email));
    const existing = existingRaw ? JSON.parse(existingRaw) : null;

    // Data-quality rule from the spec: a visitor-submitted email is
    // confidence 1.0 and never gets overwritten by anything lower-quality
    // later — since this endpoint IS the visitor submitting it directly,
    // that's already the highest tier, so this always wins going forward.
    const contact = {
      contactId: email,
      visitorId: visitorId || existing?.visitorId || null,
      email,
      emailType,
      emailSource: "visitor_submitted",
      emailConfidence: 1.0,
      name: name || existing?.name || "",
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await redis.set(CONTACT_KEY(email), JSON.stringify(contact));

    if (visitor) {
      visitor.contactId = email;
      visitor.intentScore = computeIntentScore({
        sessionCount: visitor.sessionCount,
        pageViews: visitor.pageViews,
        hasEmail: true,
      });
      await redis.set(VISITOR_KEY(visitorId), JSON.stringify(visitor));
    }

    res.status(200).json({ success: true, contact });
  } catch (err) {
    console.error("contact/capture error:", err.message);
    res.status(500).json({ success: false, reason: "provider_unavailable" });
  }
}
