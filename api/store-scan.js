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

    /* ── Payment methods detected ── */
    const paymentSignatures = {
      "Shopify Payments / Stripe": ["stripe.com", "shopify_pay", "shop-pay"],
      "PayPal": ["paypal.com", "paypalobjects"],
      "Klarna": ["klarna"],
      "Afterpay / Clearpay": ["afterpay", "clearpay"],
      "Google Pay": ["googlepay", "google-pay"],
      "Apple Pay": ["apple-pay", "applepay"],
      "Paystack": ["paystack"],
      "Flutterwave": ["flutterwave"],
    };
    const paymentMethods = Object.entries(paymentSignatures)
      .filter(([, needles]) => hasLink(...needles))
      .map(([name]) => name);

    /* ── Checkout friction signals (heuristic, not a live crawl —
         checkout pages usually require an active cart/session) ── */
    const hasGuestCheckout = hasLink("guest checkout", "checkout as guest", "continue as guest");
    const forcesAccountCreation = hasLink("create an account to checkout", "you must be logged in to checkout", "sign in to checkout");

    /* ── Broken internal links (checks first 15 found on the homepage) ── */
    const origin = new URL(target).origin;
    const hrefMatches = [...html.matchAll(/href=["']([^"'#][^"']*)["']/gi)]
      .map(m => m[1])
      .filter(href => href.startsWith("/") || href.startsWith(origin))
      .map(href => href.startsWith("/") ? origin + href : href);
    const uniqueLinks = [...new Set(hrefMatches)].slice(0, 15);

    const brokenLinks = [];
    await Promise.all(uniqueLinks.map(async (link) => {
      try {
        const linkRes = await fetch(link, {
          method: "HEAD", redirect: "follow",
          signal: AbortSignal.timeout(6000),
          headers: { "User-Agent": "Mozilla/5.0 (compatible; BCLStoreScan/1.0)" },
        });
        if (linkRes.status >= 400) brokenLinks.push({ url: link, status: linkRes.status });
      } catch {
        // Timeouts/network errors on individual links are skipped, not
        // reported as broken — too unreliable to flag with confidence.
      }
    }));

    res.status(200).json({
      ok: true,
      passwordProtected,
      policies,
      hasReviews,
      hasLiveChat,
      hasOG,
      hasSchema,
      paymentMethods,
      checkout: { hasGuestCheckout, forcesAccountCreation },
      brokenLinks,
      linksChecked: uniqueLinks.length,
    });
  } catch (err) {
    // Fail soft — a failed scan here should never block the rest of the
    // PageSpeed-based audit from completing.
    res.status(200).json({ ok: false, error: err.message });
  }
}
