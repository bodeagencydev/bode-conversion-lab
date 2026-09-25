/* ────────────────────────────────────────────────────────────────
   Store Trust/Conversion Scan — Bode Conversion Lab
   Runs server-side (Vercel serverless function) specifically so it
   can fetch the target store's raw HTML directly — a browser can't
   do this itself for most storefronts because of CORS.

   This catches things PageSpeed Insights structurally cannot see,
   because PSI only scores load performance/SEO/accessibility — it
   never asks "does this page contain a policy link" or "is this
   store even open to visitors."

   Also does a lightweight AI read of the homepage copy (headline, hero text,
   call-to-action) via Gemini — scored for whether a first-time visitor can
   tell what's being sold and what to do next. This is the one thing PageSpeed
   structurally can't check: every other finding in this audit is a metric
   crossing a threshold, this is the only one that reads the actual page.
   Optional and fails soft: no GEMINI_API_KEY, a bad response, or a timeout
   all just mean `ai` comes back null — the rest of the scan still returns.

   Place this file at: /api/store-scan.js (project root's /api folder)
   ENVIRONMENT VARIABLES: GEMINI_API_KEY (optional — enables the "ai" field)
──────────────────────────────────────────────────────────────────── */

import { askGemini, askGeminiVision } from "../lib/gemini.js";

/* Very rough "visible text" extraction — no DOM, just regex. Good enough to
   give the model a sense of the page; not meant to be exact. Strips script/
   style/nav/header/svg content first so menu links don't dominate the sample. */
function extractPageSignals(html) {
  const grab = (re) => { const m = html.match(re); return m ? m[1].trim() : ""; };
  const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  const stripTags = (s) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

  const title = stripTags(grab(/<title[^>]*>([\s\S]*?)<\/title>/i));
  const metaDesc = decode(grab(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) || grab(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i));
  const h1 = stripTags(grab(/<h1[^>]*>([\s\S]*?)<\/h1>/i));

  let body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<(header|nav|footer)[\s\S]*?<\/\1>/gi, " ");
  const heroText = stripTags(body).slice(0, 900);

  // First button/link-like text on the page — a rough stand-in for the primary CTA.
  const ctaMatch = html.match(/<(?:button|a)[^>]*class=["'][^"']*(?:btn|cta|button)[^"']*["'][^>]*>([\s\S]{0,80}?)<\/(?:button|a)>/i);
  const ctaText = ctaMatch ? stripTags(ctaMatch[1]) : "";

  return { title, metaDesc, h1, heroText, ctaText };
}

const CLARITY_PROMPT = `You are a blunt conversion-rate consultant reviewing a store's homepage for one thing only: can a first-time visitor, in the first 5 seconds, tell (1) what is being sold, (2) who it's for, and (3) what to do next?

You will be given the page title, meta description, H1, a rough text sample of the visible homepage copy, and the first call-to-action text found (may be empty if not detected).

Respond with ONLY a JSON object, no markdown fences, no commentary, in exactly this shape:
{"clarityScore": <0-100 integer>, "headlineVerdict": "<one sentence>", "ctaVerdict": "<one sentence>", "findings": [{"severity": "critical|high|medium", "title": "<short title>", "finding": "<1-2 sentences, specific to what you were given, not generic advice>", "fix": "<1 sentence, concrete>"}]}

Rules: findings array has 0-3 items — only include a finding if there's a real, specific problem with THIS page's copy (vague headline, no clear offer, buried or generic CTA like "Learn More", mismatched title/H1, etc). If the copy is genuinely clear, return an empty findings array and a high clarityScore. Never invent details not implied by the given text. Keep everything short — this feeds a report, not an essay.`;

async function scoreClarity(signals) {
  if (!process.env.GEMINI_API_KEY) return null;
  const { title, metaDesc, h1, heroText, ctaText } = signals;
  if (!heroText && !h1) return null; // nothing meaningful to read
  const input = `PAGE TITLE: ${title || "(none)"}\nMETA DESCRIPTION: ${metaDesc || "(none)"}\nH1: ${h1 || "(none)"}\nFIRST CTA TEXT FOUND: ${ctaText || "(none detected)"}\nVISIBLE HOMEPAGE TEXT SAMPLE:\n${heroText || "(none extracted)"}`;
  const result = await askGemini([{ role: "user", content: input }], {
    system: CLARITY_PROMPT,
    maxOutputTokens: 500,
    budgetMs: 9000,
  });
  if (!result.ok) { console.error("CLARITY SCORE FAILED:", result.error); return null; }
  try {
    const cleaned = result.reply.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned);
    if (typeof parsed.clarityScore !== "number") return null;
    parsed.clarityScore = Math.max(0, Math.min(100, Math.round(parsed.clarityScore)));
    parsed.findings = Array.isArray(parsed.findings) ? parsed.findings.slice(0, 3) : [];
    return parsed;
  } catch (err) {
    console.error("CLARITY SCORE: could not parse model output:", err.message, "|", result.reply?.slice(0, 200));
    return null;
  }
}


/* ── Visual audit: real screenshots + AI vision read ─────────────────────
   Microlink (api.microlink.io) renders the page in a real browser and hosts
   the finished image — unlike some free screenshot services it does not
   stream a loading placeholder, so we always get the actual page, not a
   spinner. Free tier: 50 screenshots/day, no signup. If that's outgrown, add
   MICROLINK_API_KEY as an env var — the code below picks it up automatically.

   Captures the FULL scrollable page (fullPage:true), not just what's visible
   without scrolling, and does this for up to two pages: the homepage, plus
   one deeper page (a product or collection page) when one can be found in
   the homepage's own links — a second real page, not just a taller crop of
   the same one. Each screenshot gets its own AI vision pass that's told to
   read the image as multiple sections top to bottom (hero, main content,
   further down, footer) so the findings are specific to what's actually in
   that section rather than one generic comment about "the page".

   Fails soft at every step: no screenshot, a failed vision read, or no
   secondary page found just means fewer/emptier entries — the rest of the
   audit is always unaffected. ── */

const SECONDARY_PAGE_PATTERNS = [
  { label: "Product Page",    re: /\/(products?|item)\// },
  { label: "Collection Page", re: /\/(collections?|shop|store|catalog)(\/|$)/ },
];

/* Picks ONE other page worth screenshotting, preferring an actual product
   page over a generic collection/shop listing. Returns null if nothing
   matching was found among the homepage's own links — never guesses at a
   URL that wasn't actually linked from the page. */
function findSecondaryPageUrl(hrefMatches, origin, homepageUrl) {
  for (const { re } of SECONDARY_PAGE_PATTERNS) {
    const hit = hrefMatches.find((href) => re.test(href) && (href.startsWith("/") || href.startsWith(origin)));
    if (hit) {
      const abs = hit.startsWith("/") ? origin + hit : hit;
      if (abs !== homepageUrl) return abs;
    }
  }
  return null;
}

async function captureScreenshot(targetUrl) {
  const key = process.env.MICROLINK_API_KEY ? `&apiKey=${process.env.MICROLINK_API_KEY}` : "";
  const api = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot.fullPage=true&screenshot.type=jpeg&meta=false&waitUntil=networkidle2${key}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 18000); // full-page renders take longer than a viewport shot
  try {
    const r = await fetch(api, { signal: controller.signal });
    if (!r.ok) { console.error("MICROLINK REQUEST FAILED:", r.status, await r.text().catch(() => "")); return null; }
    const data = await r.json();
    const shot = data?.data?.screenshot;
    if (!shot?.url) { console.error("MICROLINK: no screenshot in response:", JSON.stringify(data).slice(0, 300)); return null; }
    return shot.url; // hosted image on Microlink's CDN — safe to hand straight to the browser (and to the PDF)
  } catch (err) {
    console.error("MICROLINK CALL FAILED:", err.name === "AbortError" ? "timed out" : err.message);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchAsBase64(imageUrl) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const r = await fetch(imageUrl, { signal: controller.signal });
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length > 8 * 1024 * 1024) return null; // keep the vision request a sane size
    const mimeType = r.headers.get("content-type")?.split(";")[0] || "image/jpeg";
    return { base64: buf.toString("base64"), mimeType };
  } catch (err) {
    console.error("SCREENSHOT FETCH FAILED:", err.name === "AbortError" ? "timed out" : err.message);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function visualPrompt(pageLabel) {
  return `You are a blunt conversion-rate consultant looking at a FULL-PAGE screenshot of a store's ${pageLabel} — the entire scrollable page from top to bottom, not just what's visible without scrolling. Judge ONLY what is visible in the image.

Read it top to bottom as distinct sections (hero/top of page, main content area, further down the page, footer) and give findings specific to what you actually see in each part — not one generic comment about "the page". Look for real, specific visual problems in any section: cluttered or busy layout, a call-to-action that's hard to spot (low contrast, wrong size, buried under something more prominent), unclear visual hierarchy, no visible trust signals (reviews, badges, guarantees), poor spacing/crowding, text that's hard to read against its background, imagery that looks low-quality or generic/stocky, dead space, or a section that doesn't clearly signal what it's for.

Respond with ONLY a JSON object, no markdown fences, no commentary, in exactly this shape:
{"visualScore": <0-100 integer>, "summary": "<one sentence overall impression of this specific page>", "findings": [{"severity": "critical|high|medium", "title": "<short title>", "finding": "<1-2 sentences — name WHERE on the page this is (e.g. \"in the hero\", \"further down near the product grid\", \"in the footer\") and what's actually wrong there>", "fix": "<1 sentence, concrete>"}]}

Rules: findings array has 0-4 items — only real, specific problems, never generic advice, and never invent a section that isn't in the image. If the page looks clean and clear throughout, return an empty findings array and a high visualScore. Keep everything short — this feeds a report, not an essay.`;
}

/* Screenshots + AI-scores ONE page. Returns null if the screenshot itself
   couldn't be captured; returns a scoreless entry (still with the screenshot
   URL, so the report can at least show the image) if only the AI read failed. */
async function scoreVisualForPage(pageUrl, label) {
  const screenshotUrl = await captureScreenshot(pageUrl);
  if (!screenshotUrl) return null;

  const base = { label, url: pageUrl, screenshotUrl, visualScore: null, summary: null, findings: [] };
  if (!process.env.GEMINI_API_KEY) return base;

  const image = await fetchAsBase64(screenshotUrl);
  if (!image) return base;

  const result = await askGeminiVision({
    imageBase64: image.base64,
    mimeType: image.mimeType,
    prompt: `Here is the full-page ${label} screenshot. Return the JSON as instructed.`,
    system: visualPrompt(label),
    maxOutputTokens: 600,
    budgetMs: 10000,
  });
  if (!result.ok) { console.error(`VISUAL SCORE FAILED (${label}):`, result.error); return base; }

  try {
    const cleaned = result.reply.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      ...base,
      visualScore: typeof parsed.visualScore === "number" ? Math.max(0, Math.min(100, Math.round(parsed.visualScore))) : null,
      summary: parsed.summary || null,
      findings: Array.isArray(parsed.findings) ? parsed.findings.slice(0, 4) : [],
    };
  } catch (err) {
    console.error(`VISUAL SCORE: could not parse model output (${label}):`, err.message, "|", result.reply?.slice(0, 200));
    return base;
  }
}

/* Runs the homepage screenshot and (when one was found) the secondary-page
   screenshot CONCURRENTLY — two independent Microlink + Gemini pipelines,
   so total time is set by the slower of the two, not their sum. */
async function scoreVisual(homepageUrl, secondaryPageUrl) {
  const jobs = [scoreVisualForPage(homepageUrl, "Homepage")];
  if (secondaryPageUrl) jobs.push(scoreVisualForPage(secondaryPageUrl, SECONDARY_PAGE_PATTERNS.find(p => p.re.test(secondaryPageUrl))?.label || "Other Page"));
  const results = (await Promise.all(jobs)).filter(Boolean);
  return results.length ? { pages: results } : null;
}

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
    const hasTwitterCard = hasLink('name="twitter:card"');

    const hasSchema = hasLink('application/ld+json');

    const pageSignals = extractPageSignals(html);

    /* ── Internal links (shared by the broken-link check below AND the secondary-page
         screenshot: the visual audit looks at the homepage plus, when one is findable,
         one deeper page like a product listing — that's a second real page, not just a
         taller crop of the same one). ── */
    const origin = new URL(target).origin;
    const hrefMatches = [...html.matchAll(/href=["']([^"'#][^"']*)["']/gi)]
      .map(m => m[1])
      .filter(href => href.startsWith("/") || href.startsWith(origin))
      .map(href => href.startsWith("/") ? origin + href : href);
    const uniqueLinks = [...new Set(hrefMatches)].slice(0, 15);
    const secondaryPageUrl = findSecondaryPageUrl(hrefMatches, origin, target);

    // Clarity (text), the visual read(s), and the broken-link check below all run
    // concurrently — total added time is set by the slowest of the three, not their sum.
    const aiPromise     = scoreClarity(pageSignals).catch((err) => { console.error("CLARITY SCORE THREW:", err.message); return null; });
    const visualPromise = scoreVisual(target, secondaryPageUrl).catch((err) => { console.error("VISUAL SCAN THREW:", err.message); return null; });

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

    const [ai, visual] = await Promise.all([aiPromise, visualPromise]);

    res.status(200).json({
      ok: true,
      passwordProtected,
      policies,
      hasReviews,
      hasLiveChat,
      hasOG,
      hasTwitterCard,
      hasSchema,
      ai,
      visual,
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
