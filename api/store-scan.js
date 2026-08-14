/* ────────────────────────────────────────────────────────────────
   Store Trust/Conversion Scan — Bode Conversion Lab
   Runs server-side (Vercel serverless function) specifically so it
   can fetch the target store's raw HTML directly — a browser can't
   do this itself for most storefronts because of CORS.

   This catches things PageSpeed Insights structurally cannot see,
   because PSI only scores load performance/SEO/accessibility — it
   never asks "does this page contain a policy link" or "is this
   store even open to visitors."

   Place this file at: /api/store-scan.js (project root's /api folder)
   No environment variables required.
──────────────────────────────────────────────────────────────────── */

export default async function handler(req, res) {
  const target = req.query.url;
  if (!target) return res.status(400).json({ error: "Missing url" });

  try {
    const r = await fetch(target, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BCLStoreScan/1.0)" },
    });
    const html = await r.text();
    const lower = html.toLowerCase();

    // Store closed to visitors entirely — the single biggest possible
    // "why customers left" answer, so it's checked first.
    const passwordProtected =
      /enter using password/.test(lower) ||
      /opening soon/.test(lower) ||
      (/name="password"/.test(lower) && /shopify/.test(lower));

    const hasLink = (...needles) => needles.some(n => lower.includes(n));

    const policies = {
      privacy:  hasLink("/policies/privacy-policy", "/privacy-policy", "/pages/privacy", "privacy policy"),
      terms:    hasLink("/policies/terms-of-service", "/terms-of-service", "/pages/terms", "terms of service", "terms & conditions"),
      refund:   hasLink("/policies/refund-policy", "/refund-policy", "/pages/refund", "refund policy", "return policy", "/policies/return"),
      shipping: hasLink("/policies/shipping-policy", "/shipping-policy", "/pages/shipping", "shipping policy", "shipping & delivery"),
    };

    const hasReviews = hasLink(
      "judge.me", "loox.io", "loox.app", "yotpo", "stamped.io", "okendo",
      "reviews.io", "trustpilot", "ali-reviews", "fera.ai"
    );

    const hasLiveChat = hasLink(
      "tidio", "intercom", "crisp.chat", "gorgias", "wa.me", "api.whatsapp.com",
      "tawk.to", "livechat", "zendesk"
    );

    const hasOG = hasLink('property="og:title"', 'property="og:image"', 'property="og:description"');

    const hasSchema = hasLink('application/ld+json');

    res.status(200).json({
      ok: true,
      passwordProtected,
      policies,
      hasReviews,
      hasLiveChat,
      hasOG,
      hasSchema,
    });
  } catch (err) {
    // Fail soft — a failed scan here should never block the rest of the
    // PageSpeed-based audit from completing.
    res.status(200).json({ ok: false, error: err.message });
  }
}
