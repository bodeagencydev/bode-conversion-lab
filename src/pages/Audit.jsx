import { useState, useEffect, createElement } from "react";
import { Link } from "react-router-dom";
import { G, GG } from "../data.js";
import { PageWrapper, GradText, useTheme, SEO } from "../components.jsx";
import { TiltCard } from "../AnimationSystem.jsx";
/* @react-pdf/renderer is ~500kB gzipped — loaded on demand (see handleDownload)
   so it never ships in the initial Audit page bundle. */

/* ─── CONFIG ─── */
const PSI_KEY     = "AIzaSyCAnT0GIpN-3OVQkP3fPJBwhl6pTU0BN8k";
const ADMIN_EMAIL = "bodeagencyofficial@gmail.com";

/* ─── HELPERS ─── */
const clamp     = v => Math.max(0, Math.min(100, Math.round(v || 0)));
const pct       = v => v != null ? clamp(v * 100) : null;
const ms        = v => v != null ? (v / 1000).toFixed(1) + "s" : "—";
const sevColor  = s => s==="critical"?"#FF3B3B":s==="high"?"#FF9900":s==="medium"?"#FFD700":"#00ff88";

/* Simple line-style lock icons — replaces emoji glyphs for a cleaner, tool-grade look */
function LockIcon({ size = 32, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="11" width="16" height="10" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function UnlockIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="11" width="16" height="10" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M7.5 11V7.5a4.5 4.5 0 0 1 8.5-2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ─── GET ACCESS CODES FROM ADMIN PANEL ─── */
function getAccessCodes() {
  try {
    const stored = JSON.parse(localStorage.getItem("bcl_access_codes") || "[]");
    const map = {};
    stored.forEach(entry => {
      if (entry.active) map[entry.code] = { tier:entry.tier, client:entry.clientName };
    });
    return map;
  } catch { return {}; }
}

/* ─── RING SVG ─── */
function Ring({ score, size=90, color=G }) {
  const r    = size/2 - 7;
  const circ = 2 * Math.PI * r;
  const dash = (clamp(score)/100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform:"rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={6}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition:"stroke-dasharray 1.2s cubic-bezier(.22,1,.36,1)" }}/>
    </svg>
  );
}

/* ─── FETCH PSI ─── */
async function fetchPSI(url, strategy) {
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=seo&category=best-practices&category=accessibility&key=${PSI_KEY}`;
  const res = await fetch(endpoint, { signal:AbortSignal.timeout(45000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data?.error) throw new Error(data.error.message);
  return data;
}

/* ─── BUILD ANALYSIS ─── */
function buildAnalysis(desktop, mobile, storeUrl, scan) {
  const lh   = mobile?.lighthouseResult;
  const lhD  = desktop?.lighthouseResult;
  const aud  = lh?.audits  || {};
  const audD = lhD?.audits || {};

  const rawMPerf = pct(lh?.categories?.performance?.score);
  const rawDPerf = pct(lhD?.categories?.performance?.score);
  const rawSeo   = pct(lh?.categories?.seo?.score);
  const rawAcc   = pct(lh?.categories?.accessibility?.score);
  const rawBest  = pct(lh?.categories?.["best-practices"]?.score);

  const lcpMs  = parseFloat(aud["largest-contentful-paint"]?.numericValue || 9999);
  const clsVal = parseFloat(aud["cumulative-layout-shift"]?.numericValue  || 1);
  const tbtMs  = parseFloat(aud["total-blocking-time"]?.numericValue      || 999);
  const fcpMs  = parseFloat(aud["first-contentful-paint"]?.numericValue   || 9999);
  const siMs   = parseFloat(aud["speed-index"]?.numericValue              || 9999);
  const ttibMs = parseFloat(aud["interactive"]?.numericValue              || 9999);
  const serverRespMs = parseFloat(aud["server-response-time"]?.numericValue || 0);

  const mobileScore  = clamp((rawMPerf ?? 30) - 12);
  const desktopScore = clamp((rawDPerf ?? 40) - 8);

  let vitRaw = 100;
  if (lcpMs > 4000) vitRaw -= 45; else if (lcpMs > 2500) vitRaw -= 28; else if (lcpMs > 1800) vitRaw -= 12;
  if (clsVal > 0.25) vitRaw -= 38; else if (clsVal > 0.1) vitRaw -= 22; else if (clsVal > 0.05) vitRaw -= 8;
  if (tbtMs > 600)   vitRaw -= 32; else if (tbtMs > 300)  vitRaw -= 18; else if (tbtMs > 200)  vitRaw -= 8;
  const vitScore = clamp(vitRaw - 8);

  const seoScore    = clamp((rawSeo  ?? 40) - 10);
  const accessScore = clamp((rawAcc  ?? 50) - 8);
  const bestScore   = clamp((rawBest ?? 50) - 8);

  const imgOptScore  = aud["uses-optimized-images"]?.score;
  const imgWebpScore = aud["uses-webp-images"]?.score;
  const imgRespScore = aud["uses-responsive-images"]?.score;
  const imgLazy      = aud["offscreen-images"]?.score;
  const imageScore   = clamp(80 - (imgOptScore===0?25:0) - (imgWebpScore===0?20:0) - (imgRespScore===0?15:0) - (imgLazy===0?10:0));

  const hasSSL       = aud["is-on-https"]?.score === 1;
  const hasHTTP2     = aud["uses-http2"]?.score === 1;
  const hasGzip      = aud["uses-text-compression"]?.score === 1;
  const hasCaching   = aud["uses-long-cache-ttl"]?.score === 1;
  const hasUnusedCSS = aud["unused-css-rules"]?.score === 0;
  const hasUnusedJS  = aud["unused-javascript"]?.score === 0;
  const hasFontOpt   = aud["font-display"]?.score === 1;

  const techScore = clamp(
    70
    - (!hasSSL     ? 15 : 0)
    - (!hasHTTP2   ? 8  : 0)
    - (!hasGzip    ? 10 : 0)
    - (!hasCaching ? 8  : 0)
    - (hasUnusedCSS? 6  : 0)
    - (hasUnusedJS ? 8  : 0)
    - (!hasFontOpt ? 5  : 0)
    - (serverRespMs > 600 ? 12 : serverRespMs > 200 ? 5 : 0)
  );

  const hasMeta       = aud["meta-description"]?.score === 1;
  const hasTitle      = aud["document-title"]?.score   === 1;
  const hasCanon      = aud["canonical"]?.score        === 1;
  const hasAltText    = aud["image-alt"]?.score        === 1;
  const hasCrawl      = aud["is-crawlable"]?.score     === 1;
  const hasRobots     = aud["robots-txt"]?.score       === 1;
  const hasStructured = aud["structured-data"]?.score  === 1;
  const hasContrast   = aud["color-contrast"]?.score   === 1;
  const hasInputLabels= aud["label"]?.score            === 1;
  const hasButtonNames= aud["button-name"]?.score      === 1;
  const hasViewport   = aud["viewport"]?.score         === 1;
  const hasTapTargets = aud["tap-targets"]?.score      === 1;
  const hasLang       = aud["html-has-lang"]?.score    === 1;

  /* Extra signals already returned by PageSpeed Insights but not
     previously used — none of these need a new fetch. */
  const hasConsoleErrors = (aud["errors-in-console"]?.details?.items?.length || 0) > 0;
  const hasVulnLibs      = (aud["no-vulnerable-libraries"]?.details?.items?.length || 0) > 0;
  const redirectWasteMs  = parseFloat(aud["redirects"]?.numericValue || 0);
  const thirdPartyMs     = parseFloat(aud["bootup-time"]?.details?.summary?.wastedMs || 0);

  const weights = [
    { score:mobileScore,  w:0.22 },
    { score:vitScore,     w:0.20 },
    { score:desktopScore, w:0.12 },
    { score:seoScore,     w:0.14 },
    { score:imageScore,   w:0.10 },
    { score:techScore,    w:0.10 },
    { score:accessScore,  w:0.07 },
    { score:bestScore,    w:0.05 },
  ];
  const overall = clamp(weights.reduce((acc, w) => acc + w.score * w.w, 0));

  /* ─── FINDINGS ─── */
  const findings = [];
  const add = (id, severity, category, title, finding, impact, fix) =>
    findings.push({ id, severity, category, title, finding, impact, fix });

  /* Mobile */
  if (mobileScore < 50)
    add("mob1","critical","Mobile Performance","Mobile experience is critically broken",
      `Your mobile performance score is ${mobileScore}/100. Most e-commerce traffic is mobile — a score this low means buyers are bouncing before they even see your product. Every ad you run is sending people to a broken experience.`,
      `Estimated ${Math.round((100-mobileScore)*0.4)}% of mobile visitors leave before converting`,
      `Compress all images to WebP, eliminate render-blocking JavaScript, enable lazy loading for below-fold content, and reduce server response time. This single area of improvement typically recovers 20-40% of mobile conversions.`);
  else if (mobileScore < 75)
    add("mob2","high","Mobile Performance","Mobile performance below acceptable threshold",
      `Mobile score: ${mobileScore}/100. Over 60% of your traffic likely arrives on mobile. Sub-75 performance is actively suppressing your conversion rate.`,
      `Estimated 15-25% mobile conversion suppression`,
      `Prioritize image optimization and JavaScript deferral. Run your store through Google PageSpeed and fix the top 3 opportunities listed.`);

  /* LCP */
  if (lcpMs > 4000)
    add("lcp1","critical","Core Web Vitals","Largest Contentful Paint is critically slow",
      `LCP: ${ms(lcpMs)}. Google's threshold for "good" is under 2.5s. At ${ms(lcpMs)}, your main content takes so long to appear that buyers assume the page is broken and leave. This directly increases your ad costs by lowering your Google Quality Score.`,
      `High ad costs + high bounce rate + Google ranking penalty`,
      `Optimize your hero image — it's almost certainly your LCP element. Convert to WebP, add explicit dimensions, preload it with <link rel="preload">. Also check for render-blocking resources in the head.`);
  else if (lcpMs > 2500)
    add("lcp2","high","Core Web Vitals","LCP needs improvement",
      `LCP: ${ms(lcpMs)}. You're in Google's "Needs Improvement" zone. This affects your search ranking and user experience.`,
      `Moderate ranking suppression and conversion loss`,
      `Preload your LCP element, compress the hero image, ensure your hosting responds fast. Target under 2.5s.`);

  /* CLS */
  if (clsVal > 0.25)
    add("cls1","critical","Core Web Vitals","Layout shift is severe — buttons are moving",
      `CLS: ${clsVal.toFixed(3)}. Your page elements are jumping around as the page loads. When a buyer is about to click "Add to Cart" and the button shifts position, they either mis-click or abandon entirely.`,
      `Direct lost conversions from mis-clicks and user frustration`,
      `Add explicit width and height attributes to all images and videos. Avoid injecting content above existing content. Reserve space for ads and embeds with CSS aspect-ratio boxes.`);
  else if (clsVal > 0.1)
    add("cls2","high","Core Web Vitals","Significant layout instability detected",
      `CLS: ${clsVal.toFixed(3)}. Above Google's 0.1 "good" threshold. Page elements are shifting during load.`,
      `User frustration and Google ranking impact`,
      `Identify shifting elements using Chrome DevTools → Performance tab. Most common causes: images without dimensions, web fonts loading late, dynamically injected content.`);

  /* TBT */
  if (tbtMs > 600)
    add("tbt1","critical","Core Web Vitals","Page is freezing — Total Blocking Time critical",
      `TBT: ${Math.round(tbtMs)}ms. Your page blocks the main thread for ${(tbtMs/1000).toFixed(1)} seconds during load. During this time the page appears loaded but is completely unresponsive — clicks do nothing, Add to Cart doesn't fire. Buyers think your site is broken.`,
      `Silent conversions lost — buyers click but nothing happens`,
      `Audit your JavaScript. Remove or defer any third-party scripts (chat widgets, analytics, pixels) that aren't critical to the initial load. Break up long tasks.`);
  else if (tbtMs > 300)
    add("tbt2","high","Core Web Vitals","JavaScript is blocking page interaction",
      `TBT: ${Math.round(tbtMs)}ms. Above the 200ms good threshold. The page is sluggish to respond to user input.`,
      `Sluggish user experience and conversion friction`,
      `Defer non-critical JavaScript, remove unused scripts, audit third-party tag loading order.`);

  /* FCP */
  if (fcpMs > 3000)
    add("fcp1","high","Core Web Vitals","First Contentful Paint is too slow",
      `FCP: ${ms(fcpMs)}. Users see a blank screen for ${ms(fcpMs)} before anything appears. First impressions determine whether buyers stay.`,
      `High bounce rate — users assume the site is down`,
      `Reduce server response time, eliminate render-blocking resources in the HTML head, inline critical CSS.`);

  /* TTI */
  if (ttibMs > 5000)
    add("tti1","high","Technical","Page takes too long to become interactive",
      `Time to Interactive: ${ms(ttibMs)}. The gap between when the page looks ready and when it actually works is dangerously large.`,
      `Silent UX failures during the "dead zone" after visual load`,
      `Split JavaScript bundles, use code splitting if on React/Next.js, defer all non-critical scripts.`);

  /* SEO */
  if (!hasMeta)
    add("seo1","critical","SEO","Missing meta description — invisible in search",
      `No meta description found. When your store appears in Google, searchers see nothing or auto-generated text. A well-crafted meta description is free click-through-rate optimization that costs nothing to fix.`,
      `Lower CTR from every search result you appear in`,
      `Write a compelling meta description (150-160 characters) for every page. For product pages: lead with the key benefit, include the product name, end with a call to action.`);
  if (!hasTitle)
    add("seo2","critical","SEO","Missing or broken title tag",
      `Title tag issue detected. The title tag is the single most important on-page SEO element — it determines your search ranking for target keywords and your click-through rate.`,
      `Critical ranking loss for all target keywords`,
      `Ensure every page has a unique, keyword-rich title tag (50-60 characters). Format: [Primary Keyword] — [Brand Name].`);
  if (!hasCanon)
    add("seo3","high","SEO","No canonical tags — duplicate content risk",
      `Missing canonical tags. Without canonicals, Google may index duplicate versions of your pages, splitting your ranking power across multiple URLs.`,
      `Diluted search ranking from duplicate content signals`,
      `Add canonical tags to all pages pointing to the preferred URL version. On Shopify this is often handled in theme settings.`);
  if (!hasAltText)
    add("seo4","high","SEO","Images missing alt text",
      `Product images without alt text. Alt text tells Google what your images contain — this is how you rank in Google Image Search and how screen readers describe images to visually impaired users.`,
      `Missing Google Image Search traffic + accessibility barrier`,
      `Add descriptive alt text to every product image. Be specific: "Navy cotton hoodie front view" beats "img-001.jpg".`);
  if (!hasCrawl)
    add("seo5","critical","SEO","Search engines may be blocked from your store",
      `Crawlability issue detected. Part or all of your store may have a noindex directive preventing Google from indexing your pages. If Google cannot crawl your store, you rank for nothing.`,
      `Pages may not appear in Google search at all`,
      `Check your robots.txt and meta robots tags. Ensure no pages you want indexed have noindex directives. In Shopify check store preferences for password page settings.`);
  if (!hasRobots)
    add("seo6","medium","SEO","Robots.txt not properly configured",
      `Robots.txt issues detected. This file controls what search engines can crawl. Misconfiguration can accidentally block important pages.`,
      `Crawling inefficiency or accidental page blocking`,
      `Allow all content pages, block checkout/cart/account pages. Submit your sitemap URL in robots.txt.`);
  if (!hasStructured)
    add("seo7","medium","SEO","No structured data — missing rich search results",
      `No structured data (schema markup) detected. Without schema, your products can't appear with star ratings, price, and availability directly in search results.`,
      `Missing rich snippets that drive 20-30% higher CTR`,
      `Implement Product schema on all product pages. Most Shopify themes have this built in — check your theme settings.`);
  if (!hasLang)
    add("seo8","medium","SEO","Missing HTML lang attribute",
      `Your HTML tag is missing a lang attribute. Search engines and screen readers use this to understand the language of your content.`,
      `Minor SEO and accessibility impact`,
      `Add lang="en" (or your store's primary language) to your HTML tag.`);

  /* Technical */
  if (!hasSSL)
    add("tech1","critical","Technical","HTTPS not properly configured",
      `The site is not fully on HTTPS. Modern browsers display security warnings, payment processors refuse to work, and Google penalizes non-HTTPS sites in rankings.`,
      `Browser warnings actively driving visitors away — payment failures`,
      `Force HTTPS across your entire domain. In Shopify this is one toggle in Settings → Domains.`);
  if (!hasGzip)
    add("tech2","high","Technical","Text compression not enabled",
      `Your server sends uncompressed HTML, CSS, and JavaScript to browsers. Enabling GZIP or Brotli typically reduces transfer sizes by 70-80%.`,
      `Unnecessarily large page sizes slowing every page load`,
      `Enable GZIP compression on your server. On most hosts this is a server-level setting or .htaccess configuration.`);
  if (!hasCaching)
    add("tech3","high","Technical","Browser caching not configured",
      `Static assets are not being cached by browsers. Returning visitors — your warmest leads — download everything fresh on every visit.`,
      `Slower experience for returning visitors`,
      `Set cache-control headers with long TTLs (1 year) for static assets. Use versioned file names to force cache busting on updates.`);
  if (hasUnusedCSS)
    add("tech4","medium","Technical","Significant unused CSS detected",
      `Pages are loading CSS code that is never used. This adds to page weight and parse time with no benefit.`,
      `Unnecessary page weight increasing load time`,
      `Audit your CSS and remove unused styles. Tools like PurgeCSS can automate this.`);
  if (hasUnusedJS)
    add("tech5","high","Technical","Significant unused JavaScript detected",
      `Pages are loading JavaScript that is never executed. Third-party scripts from analytics, chat, and marketing pixels are common culprits.`,
      `Major contributor to TBT and slow interactivity`,
      `Audit all installed apps and scripts. Remove any you don't actively use. Load analytics and pixels asynchronously after page becomes interactive.`);
  if (!hasFontOpt)
    add("tech6","medium","Technical","Web fonts causing render blocking",
      `Font loading is blocking page rendering. Users see invisible or unstyled text during load.`,
      `Text invisible during load — poor first impression`,
      `Add font-display: swap to all @font-face declarations. Preload your most critical font file. Consider system fonts for body text.`);
  if (serverRespMs > 600)
    add("tech7","critical","Technical","Server response time is critically slow",
      `Server response: ${Math.round(serverRespMs)}ms. Google recommends under 200ms. Your server takes ${(serverRespMs/1000).toFixed(1)}s just to respond before sending any content.`,
      `Every other performance metric is degraded by slow server response`,
      `Upgrade your hosting, enable a CDN (Cloudflare is free), enable server-side caching, optimize database queries on WooCommerce/custom platforms.`);
  else if (serverRespMs > 200)
    add("tech8","medium","Technical","Server response time needs improvement",
      `Server response: ${Math.round(serverRespMs)}ms. Above the 200ms recommended threshold.`,
      `Added latency on every page load`,
      `Enable server-level caching, use a CDN for static assets, consider upgrading hosting from shared plans.`);
  if (!hasHTTP2)
    add("tech9","medium","Technical","HTTP/2 not enabled",
      `Your server uses an older HTTP protocol. HTTP/2 allows parallel resource loading, significantly improving performance for pages with many assets.`,
      `Sequential resource loading slowing page assembly`,
      `Ensure your hosting supports HTTP/2. Most modern hosts support it — check your CDN settings or contact your provider.`);

  /* Images */
  if (imgWebpScore === 0)
    add("img1","high","Image Optimization","Images not in modern WebP format",
      `All or most images are JPEG or PNG instead of WebP. WebP images are 25-35% smaller at equivalent quality — directly improving load speed on every page.`,
      `Every page load is heavier than it needs to be`,
      `Convert all product images to WebP. Shopify automatically serves WebP when supported. On WooCommerce use Imagify or ShortPixel plugin.`);
  if (imgOptScore === 0)
    add("img2","high","Image Optimization","Images are not optimized",
      `Image optimization issues detected. Oversized images are the most common cause of slow e-commerce stores — and the fastest to fix.`,
      `Page weight bloat reducing speed for all visitors`,
      `Compress all images before uploading. Target: under 100KB for product images, under 200KB for hero images. Use TinyPNG or Squoosh.`);
  if (imgLazy === 0)
    add("img3","medium","Image Optimization","Below-fold images loading immediately",
      `Images not visible on initial load are being downloaded immediately, wasting bandwidth and slowing initial page render.`,
      `Unnecessary bandwidth use slowing first paint`,
      `Add loading="lazy" to all below-fold image tags. This is a one-attribute fix per image.`);

  /* Accessibility */
  if (!hasContrast)
    add("acc1","high","Accessibility","Text contrast too low",
      `Color contrast failures detected. Text that doesn't meet WCAG AA contrast ratios is harder to read for all users — not just those with visual impairments — especially on mobile in bright light.`,
      `Reduced readability reducing time-on-page and conversion`,
      `Check all text against backgrounds using the WebAIM Contrast Checker. Aim for 4.5:1 ratio for body text, 3:1 for large text.`);
  if (!hasInputLabels)
    add("acc2","medium","Accessibility","Form inputs missing labels",
      `Input fields without proper labels confuse screen reader users and voice control users. On checkout forms this can prevent purchases.`,
      `Checkout friction for users with accessibility needs`,
      `Add explicit <label> elements to all form inputs or use aria-label attributes. Never rely on placeholder text alone as a label.`);
  if (!hasButtonNames)
    add("acc3","medium","Accessibility","Buttons missing accessible names",
      `Buttons without accessible names are invisible to screen readers. If your Add to Cart button has this issue, you have a silent purchase blocker.`,
      `Silent barrier for assistive technology users`,
      `Ensure all buttons have visible text or an aria-label attribute. Icon-only buttons must always have an aria-label.`);
  if (!hasViewport)
    add("acc4","critical","Mobile","Viewport meta tag missing or broken",
      `Viewport configuration issue. Without proper viewport settings, your page won't scale correctly on mobile — it will appear zoomed out and unreadable.`,
      `Mobile layout broken across many device sizes`,
      `Add or fix: <meta name="viewport" content="width=device-width, initial-scale=1"> in your HTML head.`);
  if (!hasTapTargets)
    add("acc5","high","Mobile","Tap targets too small for mobile",
      `Interactive elements (buttons, links) are too small or too close together for reliable tapping on mobile. This causes mis-taps and abandoned purchases.`,
      `Direct mobile conversion friction on every page`,
      `Ensure all clickable elements are at least 48×48px with 8px spacing between them. Critical for your Add to Cart button and checkout flow.`);

  /* JS errors, vulnerable libraries, redirects, third-party bloat —
     already inside the PSI response, just unused until now */
  if (hasConsoleErrors)
    add("tech-err","critical","Technical",`JavaScript errors detected on page load`,
      `Your site is throwing errors in the browser console. This is often invisible to a human just scrolling the page, but errors like this frequently break interactive elements — including cart, checkout, and payment scripts — silently, with no visible warning to the shopper.`,
      `Potentially breaks checkout, cart, or apps for a share of visitors`,
      `Open your browser's DevTools console on the live site and reproduce the error. Common culprits: a third-party app script conflicting with your theme, or an outdated Shopify app.`);
  if (hasVulnLibs)
    add("tech-vuln","medium","Technical",`Outdated JavaScript library with known vulnerabilities`,
      `Your site is loading a JavaScript library version with publicly known security vulnerabilities. This is a trust and security issue, not just a performance one.`,
      `Security risk; can also affect trust signals in some browsers`,
      `Identify and update the flagged library to its latest version, or remove it if it's from an unused app.`);
  if (redirectWasteMs > 200)
    add("tech-redir","medium","Technical",`Redirect chain slowing every page load`,
      `Your store's URL passes through ${redirectWasteMs > 600 ? "multiple redirects" : "a redirect"} before the page actually loads, adding ${Math.round(redirectWasteMs)}ms of pure waiting before anything appears.`,
      `Every visitor waits longer than necessary, on every single page`,
      `Point your domain/DNS directly at the final URL instead of routing through an intermediate redirect.`);
  if (thirdPartyMs > 600)
    add("tech-3p","high","Technical",`Third-party scripts blocking the page`,
      `Apps and trackers installed on your store (reviews, chat, analytics, upsells, etc.) are consuming ${Math.round(thirdPartyMs)}ms of main-thread time before the page becomes responsive. The more apps installed, the slower — and often the more fragile — checkout becomes.`,
      `Slower interactivity; more moving parts that can silently break`,
      `Audit every installed app — remove any that aren't actively earning their keep, and load the rest asynchronously where the app allows it.`);

  /* Trust & conversion signals — from a direct server-side scan of the
     store's HTML, since these are things PageSpeed Insights structurally
     cannot see (it only scores load performance/SEO/accessibility). */
  if (scan?.ok) {
    if (scan.passwordProtected)
      add("trust-locked","critical","Store Access",`Your store is password-protected — visitors can't get in at all`,
        `The page is showing a password / "opening soon" screen instead of your actual storefront. Every single visitor — from ads, search, or a direct link — is hitting a locked door instead of your products. This alone can explain a total absence of sales regardless of anything else on this report.`,
        `100% of traffic blocked from purchasing`,
        `Go to Shopify Admin → Online Store → Preferences, and disable password protection once your store is ready for real visitors.`);

    const missingPolicies = Object.entries(scan.policies || {}).filter(([,present]) => !present).map(([k]) => k);
    if (missingPolicies.length)
      add("trust-policy","high","Trust Signals",`Missing ${missingPolicies.length} of 4 standard store policy pages`,
        `No visible link to a ${missingPolicies.map(p => ({privacy:"Privacy Policy",terms:"Terms of Service",refund:"Refund Policy",shipping:"Shipping Policy"}[p])).join(", ")} was found on the page. Shoppers actively look for these before entering card details — their absence is one of the most common reasons a stranger abandons checkout on a store they've never bought from before.`,
        `Directly suppresses first-time-buyer conversion`,
        `Add all four policy pages (Shopify generates templates for these automatically under Settings → Policies) and link them in your footer.`);

    if (!scan.hasReviews)
      add("trust-reviews","medium","Trust Signals",`No product reviews or social proof detected`,
        `No review app (Judge.me, Loox, Yotpo, Stamped, or similar) was detected on the page. Shoppers overwhelmingly check reviews before buying from a store they don't recognize — without any visible social proof, you're asking for trust with nothing to back it up.`,
        `Lower conversion specifically among first-time visitors`,
        `Install a reviews app and get at least a handful of reviews live before running paid traffic — even a small number of genuine reviews outperforms having none.`);

    if (!scan.hasLiveChat)
      add("trust-contact","low","Trust Signals",`No live chat or direct contact method visible`,
        `No chat widget or WhatsApp/contact link was detected. A shopper with a last-minute question (sizing, shipping time, etc.) who can't get a quick answer often just leaves instead of buying.`,
        `Loses hesitant buyers at the final decision point`,
        `Add a WhatsApp button or a chat widget (Tidio, Crisp, Gorgias) so hesitant buyers have somewhere to ask before abandoning.`);

    if (!scan.hasOG)
      add("trust-og","low","Trust Signals",`Missing social share preview tags`,
        `No Open Graph tags were found. When your store link is shared or pasted into WhatsApp, Instagram, or Facebook, it shows a blank or broken preview instead of your product image and name — quietly hurting click-through from every share.`,
        `Reduced click-through from social/word-of-mouth shares`,
        `Add og:title, og:description, and og:image meta tags to your theme's <head> — most Shopify themes support this natively via a few lines in theme.liquid.`);
  }

  /* Sort */
  const sevOrder = { critical:0, high:1, medium:2, low:3 };
  findings.sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity]);

  const leak = overall < 40 ? "50-70% of potential revenue" : overall < 55 ? "30-50%" : overall < 70 ? "15-30%" : overall < 85 ? "5-15%" : "Under 5%";
  const grade = overall >= 90 ? "A" : overall >= 78 ? "B" : overall >= 63 ? "C" : overall >= 45 ? "D" : "F";
  const verdictMap = {
    F: "Critically broken. Every visitor — paid or organic — is experiencing a degraded journey. This is a rebuilding problem, not a tweaking problem.",
    D: "Significant revenue leaks across multiple areas. Functional but underperforming in ways that compound daily. These are fixable problems.",
    C: "Foundation exists but specific high-impact issues are suppressing your conversion rate. Targeted fixes will have disproportionate revenue impact.",
    B: "Solid baseline. Remaining issues are optimization opportunities. Small improvements here compound meaningfully over time.",
    A: "Strong technical foundation. Focus should shift to conversion optimization and growth rather than technical repair.",
  };

  return {
    overall, grade, leak,
    verdict: verdictMap[grade],
    isCritical: overall < 50 || mobileScore < 45 || vitScore < 35 || scan?.passwordProtected,
    domain: storeUrl.replace(/https?:\/\//,"").split("/")[0].split("?")[0],
    metrics: {
      mobile:  { score:mobileScore,  label:"Mobile Performance" },
      vitals:  { score:vitScore,     label:"Core Web Vitals" },
      desktop: { score:desktopScore, label:"Desktop Speed" },
      seo:     { score:seoScore,     label:"SEO Health" },
      images:  { score:imageScore,   label:"Image Optimization" },
      tech:    { score:techScore,    label:"Technical Health" },
      access:  { score:accessScore,  label:"Accessibility" },
      best:    { score:bestScore,    label:"Best Practices" },
    },
    vitals: {
      lcp: { value:ms(lcpMs),              status:lcpMs<2500?"good":lcpMs<4000?"warn":"fail", label:"LCP" },
      cls: { value:clsVal.toFixed(3),      status:clsVal<0.1?"good":clsVal<0.25?"warn":"fail", label:"CLS" },
      tbt: { value:Math.round(tbtMs)+"ms", status:tbtMs<200?"good":tbtMs<600?"warn":"fail",    label:"TBT" },
      fcp: { value:ms(fcpMs),              status:fcpMs<1800?"good":fcpMs<3000?"warn":"fail",   label:"FCP" },
      si:  { value:ms(siMs),               status:siMs<3400?"good":siMs<5800?"warn":"fail",     label:"Speed Index" },
    },
    raw: { mPerf:rawMPerf, dPerf:rawDPerf },
    findings,
    topIssues: findings.slice(0,3).map(f => f.title),
  };
}

/* ─── BUILD SOLUTION PLAN ─── */
function buildSolutionPlan(analysis) {
  const { findings, metrics } = analysis;
  const criticals = findings.filter(f => f.severity==="critical");
  const highs     = findings.filter(f => f.severity==="high");
  const mediums   = findings.filter(f => f.severity==="medium");

  return {
    fixing: {
      title:"Fixing Plan", subtitle:"Stop the bleeding — in priority order",
      phases: [
        { phase:"Phase 1 — Critical Fixes (Week 1)", items:criticals.map(f => ({ title:f.title, action:f.fix, metric:"Critical revenue recovery — implement immediately" })).slice(0,6) },
        { phase:"Phase 2 — High Impact (Week 2-3)",  items:highs.map(f => ({ title:f.title, action:f.fix, metric:"High conversion lift — do not skip" })).slice(0,6) },
        { phase:"Phase 3 — Optimization (Month 2)",  items:[
          ...mediums.map(f => ({ title:f.title, action:f.fix, metric:"Incremental improvement" })).slice(0,3),
          { title:"A/B test product page layout", action:"Test two variants: current layout vs. simplified layout with CTA above the fold. Run for minimum 500 visitors per variant.", metric:"Target: 15-30% CVR lift" },
          { title:"Implement performance monitoring", action:"Set up Google Search Console and PageSpeed monitoring alerts. Know when performance degrades before your customers do.", metric:"Long-term protection" },
        ].slice(0,6) },
      ],
    },
    growth: {
      title:"Growth Plan", subtitle:"Build the system that compounds revenue",
      phases: [
        { phase:"Traffic Architecture", items:[
          { title:"SEO content engine", action:"Publish 2 buyer-intent articles per week targeting long-tail keywords. Each article compounds in ranking over 3-6 months and sends free traffic forever.", metric:"Target: 3,000 organic visitors/month within 6 months" },
          { title:"Fix ads foundation first", action:"Do not scale paid ads until technical fixes from Phase 1 are complete. A fast converting store turns $1 into $4+. A slow broken store turns $1 into $0.60.", metric:"Prerequisite: Mobile score above 70 before scaling" },
          { title:"Organic social strategy", action:"Post 3x/week on TikTok and Instagram Reels. Raw authentic content beats produced content on both platforms. Behind-the-scenes and before/after content performs best.", metric:"Target: 1 post with 10k+ views per month" },
          { title:"Email list building engine", action:"Add exit-intent popup (10% for email), inline capture on blog posts, post-purchase opt-in. Your email list is the only channel immune to algorithm changes.", metric:"Target: 500 new subscribers/month" },
        ]},
        { phase:"Conversion Compounding", items:[
          { title:"Abandoned cart recovery", action:"70% of shoppers who add to cart don't buy on first visit. A 3-email sequence (1hr reminder → 24hr objection handler → 72hr urgency) recovers 15-20% of these.", metric:"Target: 15-20% cart recovery rate" },
          { title:"Post-purchase maximization", action:"One-click post-purchase upsell immediately after payment converts at 15-25%. Build: confirmation → shipping → delivery check → review request (day 7) → related product (day 14).", metric:"Target: 15% upsell take rate" },
          { title:"Bundle and AOV strategy", action:"Create 3 strategic bundles at 10% discount vs individual pricing. Bundles reduce decision fatigue, increase AOV, and make price comparison harder.", metric:"Target: 25% of orders include a bundle" },
          { title:"Social proof architecture", action:"Reviews above fold on product pages, real customer photos in UGC gallery, trust badges near checkout. Every unanswered buyer objection is a lost sale.", metric:"Target: 4.5+ stars displayed, 10+ reviews per product" },
        ]},
        { phase:"Scale Infrastructure", items:[
          { title:"Attribution and profit tracking", action:"Track MER (total revenue / total ad spend) across all channels, true CAC, and LTV. A customer worth $200 LTV can sustain a $40 CAC — but only if you know their LTV.", metric:"Target: Clear view of CAC, LTV, MER by channel" },
          { title:"Subscription revenue layer", action:"If your product is consumable, introduce a subscription option. Even 10% of customers on subscription transforms revenue predictability and increases average customer value by 2-3x.", metric:"Target: 10% subscription penetration within 90 days" },
          { title:"Referral programme", action:"Existing customers are your cheapest acquisition channel. Give 10%, get 10%. Build this after post-purchase flows are working.", metric:"Target: 15% of new customers via referral within 6 months" },
        ]},
      ],
    },
    marketing: {
      title:"Marketing Plan", subtitle:"Build the brand that doesn't compete on price",
      commitment: {
        title:"Our Commitment To You",
        body:"We're not going to hand you a fake number and call it a guarantee — no agency can honestly promise a specific sales outcome, because your results depend on things outside our control too: your product, your market, your pricing, and how closely you follow the plan. What we will commit to is this: if you implement every step in this plan, in order, and don't see measurable movement in your numbers within 90 days, we keep working with you at no additional cost until you do. We stay accountable to the same finish line you are — that's the actual guarantee.",
      },
      phases: [
        { phase:"Brand Foundation", items:[
          { title:"Define your singular position", action:"One sentence no honest competitor can say. Not 'high quality' — a specific verifiable claim tied to a specific customer outcome. Build every creative around this one sentence.", metric:"Deliverable: Brand positioning statement in 1 sentence" },
          { title:"Customer intelligence audit", action:"Interview 5 existing customers. Ask: Why did you almost not buy? What would have made you buy faster? Their exact language is your ad copy — not yours.", metric:"Deliverable: Customer voice document with 20+ direct quotes" },
          { title:"Content pillars", action:"Define 4 content themes reflecting your brand values. Every post, email, and ad fits one pillar. Consistency is what builds brand memory. Without it you're starting from zero every week.", metric:"Deliverable: 4 pillars × 10 content ideas = 40-post content bank" },
        ]},
        { phase:"Paid Media Architecture", items:[
          { title:"Full-funnel Meta structure", action:"TOF (awareness): broad/interest, problem-awareness video. MOF (consideration): page visitors + video viewers, social proof creative. BOF (conversion): cart/checkout abandoners, urgency + offer creative.", metric:"Target: 4x+ blended ROAS within 60 days" },
          { title:"Platform-specific creative strategy", action:"Meta: Problem → Agitate → Solve, 15-30s video or carousel. TikTok: native, trend-aware, never repurpose Meta ads. Google Shopping: feed optimization, clean titles. Each platform needs its own creative language.", metric:"Target: Platform CTR benchmarks hit within 30 days" },
          { title:"Creative testing system", action:"20% of ad budget weekly to new creative tests. Isolate one variable per test. Document winners and the insight behind each win. After 90 days you'll have a playbook competitors cannot replicate.", metric:"Target: 1 new proven creative insight per week" },
          { title:"Seasonal revenue calendar", action:"Map your top 8 revenue events for the year. Brief creatives and offers 6 weeks before each. The brands that win Black Friday planned in September.", metric:"Deliverable: 12-month promotional calendar" },
        ]},
        { phase:"Email and Retention", items:[
          { title:"Core flow hierarchy", action:"Build in this order: 1. Abandoned Cart (highest ROI) 2. Post-Purchase (highest trust moment) 3. Welcome Series 4. Win-Back. Each is an automated revenue engine that runs 24/7.", metric:"Target: Email contributes 30%+ of total revenue" },
          { title:"Segmentation strategy", action:"Segment by: purchase frequency, AOV tier, product category, acquisition source. One-size-fits-all email kills deliverability. Your best customers deserve different messaging than first-time buyers.", metric:"Target: 25%+ open rate, 3%+ click rate" },
          { title:"SMS as conversion layer", action:"SMS open rates are 98% vs 20% for email. Use for time-sensitive messages only: abandoned cart (30min), flash sale launch, back-in-stock. Never use SMS for newsletters — it destroys opt-out rates.", metric:"Target: SMS adds 5-8% incremental revenue" },
        ]},
      ],
    },
  };
}

/* ─── GENERATE & DOWNLOAD PDF ───
   Three separate PDF documents instead of one HTML file:
   Problems (diagnosis only, no fixes) · Fixes · Growth & Marketing.
   See AuditPDFs.jsx for the actual report layout/design. */
async function downloadPDF(element, filename) {
  const { pdf }  = await import("@react-pdf/renderer");
  const blob     = await pdf(element).toBlob();
  const a        = document.createElement("a");
  a.href         = URL.createObjectURL(blob);
  a.download     = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

const SCAN_STAGES = [
  { msg:"Connecting to store...",          sub:"Establishing secure connection" },
  { msg:"Scanning mobile performance...",   sub:"Where most stores fail" },
  { msg:"Measuring Core Web Vitals...",     sub:"LCP, CLS, TBT — the big three" },
  { msg:"Auditing SEO signals...",          sub:"Checking 12 ranking factors" },
  { msg:"Detecting technical issues...",    sub:"Server, caching, compression" },
  { msg:"Analysing image optimisation...", sub:"Biggest quick-win opportunity" },
  { msg:"Checking accessibility...",       sub:"Silent conversion barriers" },
  { msg:"Compiling your report...",         sub:"Building your full analysis" },
];

/* ═══════════════════════════════
   MAIN COMPONENT
═══════════════════════════════ */
export default function Audit() {
  const { dark } = useTheme();
  const seoTag = (
    <SEO
      title="Free Shopify Store Audit - Find the Leaks Costing You Sales"
      description="Run a free 12-point audit of your e-commerce store and ads in under a minute. Find the exact leaks costing you sales before you spend another dollar on traffic."
      path="/audit"
    />
  );
  const [url,        setUrl]        = useState("");
  const [email,      setEmail]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [stageIdx,   setStageIdx]   = useState(0);
  const [error,      setError]      = useState("");
  const [analysis,   setAnalysis]   = useState(null);
  const [solution,   setSolution]   = useState(null);
  const [revealed,   setRevealed]   = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [accessTier, setAccessTier] = useState(null);
  const [accessErr,  setAccessErr]  = useState("");
  const [showModal,  setShowModal]  = useState(false);
  const [downloading,setDownloading]= useState(null);

  const headingColor = dark?"#fff":"#1A1408";
  const mutedText    = dark?"rgba(255,255,255,.5)":"rgba(26,20,8,.65)";
  const mutedText2   = dark?"rgba(255,255,255,.4)":"rgba(26,20,8,.55)";
  const mutedText3   = dark?"rgba(255,255,255,.3)":"rgba(26,20,8,.45)";
  const cardBg       = dark?"linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))":"linear-gradient(135deg,rgba(255,255,255,.5),rgba(255,255,255,.2))";
  const cardBorder   = dark?"rgba(255,255,255,.1)":"rgba(26,20,8,.15)";
  const inputBg      = dark?"rgba(255,255,255,.05)":"rgba(255,255,255,.55)";
  const inputBorder  = dark?"rgba(255,255,255,.12)":"rgba(26,20,8,.18)";
  const trackBg      = dark?"rgba(255,255,255,.08)":"rgba(26,20,8,.1)";
  const vitC         = s => s==="good"?"#00ff88":s==="warn"?"#FF9900":"#FF3B3B";

  async function handleScan() {
    if (!url.trim()) return setError("Please enter your store URL.");
    if (!email.trim() || !email.includes("@")) return setError("Please enter your email address.");
    setError(""); setLoading(true); setStageIdx(0);
    setAnalysis(null); setSolution(null); setRevealed(false);
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) setAccessTier("admin");

    let stage = 0;
    const interval = setInterval(() => {
      stage = Math.min(stage + 1, SCAN_STAGES.length - 1);
      setStageIdx(stage);
    }, 3200);

    try {
      const storeUrl = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;
      const [desktop, mobile, scan] = await Promise.all([
        fetchPSI(storeUrl,"desktop").catch(() => null),
        fetchPSI(storeUrl,"mobile").catch(() => null),
        fetch(`/api/store-scan?url=${encodeURIComponent(storeUrl)}`).then(r => r.json()).catch(() => null),
      ]);
      clearInterval(interval);
      if (!desktop && !mobile) throw new Error("Could not reach store");
      const result = buildAnalysis(desktop, mobile, storeUrl, scan);
      const plan   = buildSolutionPlan(result);
      setAnalysis(result); setSolution(plan); setLoading(false);
      setTimeout(() => setRevealed(true), 100);
    } catch {
      clearInterval(interval); setLoading(false);
      setError("Could not analyse that URL. Please check it's correct and publicly accessible.");
    }
  }

  function verifyAccess() {
    const code  = accessCode.trim().toUpperCase();
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      setAccessTier("admin"); setShowModal(false); return;
    }
    const codes = getAccessCodes();
    const entry = codes[code];
    if (entry) { setAccessTier(entry.tier); setShowModal(false); setAccessErr(""); }
    else        setAccessErr("Invalid code. Check your payment confirmation or WhatsApp us.");
  }

  async function handleDownload(type) {
    if (!accessTier) { setShowModal(true); return; }
    if (type !== "problems" && accessTier === "diagnosis") {
      alert("Your Store Diagnosis package includes the Problem Report only. Upgrade to Conversion Fix or higher to unlock the Fixes and Growth & Marketing reports.");
      return;
    }
    const domain = analysis.domain;
    const date = new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });

    setDownloading(type);
    try {
      const { ProblemsPDF, FixesPDF, GrowthMarketingPDF } = await import("./AuditPDFs.jsx");
      if (type === "problems") {
        await downloadPDF(createElement(ProblemsPDF, { storeUrl:url, analysis, date }), `BCL-Problems-${domain}.pdf`);
      } else if (type === "fixes") {
        await downloadPDF(createElement(FixesPDF, { analysis, solution, date }), `BCL-Fixes-${domain}.pdf`);
      } else {
        await downloadPDF(createElement(GrowthMarketingPDF, { analysis, solution, date }), `BCL-GrowthMarketing-${domain}.pdf`);
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert(`Couldn't generate the PDF: ${err?.message || "unknown error"}\n\nThis usually means the report's font couldn't load — check your internet connection and try again. If it keeps happening, screenshot this message.`);
    } finally {
      setDownloading(null);
    }
  }

  return (
    <PageWrapper>
      {seoTag}

      {/* ── ACCESS MODAL ── */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position:"fixed", inset:0, zIndex:99000, background:"rgba(0,0,0,.75)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background:dark?"rgba(4,6,8,.97)":"rgba(255,248,210,.98)", border:dark?".5px solid rgba(255,255,255,.12)":".5px solid rgba(26,20,8,.18)", borderTop:".5px solid rgba(0,255,136,.4)", borderRadius:24, padding:"2rem", maxWidth:420, width:"100%", position:"relative" }}>
            <button onClick={() => setShowModal(false)} style={{ position:"absolute", top:14, right:16, background:"transparent", border:"none", cursor:"pointer", fontSize:20, color:mutedText3 }}>×</button>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:headingColor, marginBottom:".75rem" }}>Unlock Download</h3>
            <p style={{ fontSize:13, color:mutedText, lineHeight:1.7, marginBottom:"1rem" }}>Enter your payment access code from your confirmation email.</p>
            <input type="text" placeholder="e.g. BCL-X7K2P9" value={accessCode}
              onChange={e => setAccessCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key==="Enter" && verifyAccess()}
              style={{ width:"100%", background:inputBg, border:`.5px solid ${inputBorder}`, borderRadius:10, padding:".8rem 1rem", color:headingColor, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box", marginBottom:8, letterSpacing:".1em" }}
              onFocus={e => e.target.style.borderColor="rgba(0,255,136,.5)"}
              onBlur={e => e.target.style.borderColor=inputBorder}
            />
            {accessErr && <p style={{ fontSize:12, color:"#FF6B6B", marginBottom:8 }}>{accessErr}</p>}
            <button onClick={verifyAccess} className="btn-g" style={{ width:"100%", fontFamily:"inherit", cursor:"pointer", marginBottom:"1rem" }}>Unlock →</button>
            <p style={{ fontSize:12, color:mutedText3, textAlign:"center" }}>
              No code?{" "}
              <a href={"https://wa.me/2349064885280?text="+encodeURIComponent("Hi, I need my audit access code.")} target="_blank" rel="noopener noreferrer" style={{ color:G, textDecoration:"none", fontWeight:600 }}>WhatsApp us</a>
            </p>
          </div>
        </div>
      )}

      {/* ── HERO / INPUT ── */}
      {!loading && !analysis && (
        <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"clamp(5rem,10vw,7rem) clamp(1rem,4vw,2rem) 4rem", overflow:"hidden" }}>
          <div style={{ position:"absolute", width:"min(600px,100%)", height:"min(600px,100vw)", top:-150, left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle,rgba(0,255,136,.14),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
          <div style={{ maxWidth:640, width:"100%", textAlign:"center", position:"relative", zIndex:1 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:dark?"rgba(0,255,136,.1)":"#1A1408", border:dark?".5px solid rgba(0,255,136,.28)":"none", borderRadius:100, padding:"6px 16px", fontSize:11, color:dark?G:"#F5C518", fontWeight:600, letterSpacing:".05em", marginBottom:"1.6rem" }}>
              <span style={{ width:6, height:6, background:G, borderRadius:"50%", animation:"pulse 2s ease-in-out infinite" }}/> Automatic store diagnostic
            </span>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(2rem,6vw,3.5rem)", fontWeight:800, lineHeight:1.08, letterSpacing:"-.03em", color:headingColor, marginBottom:"1rem" }}>
              Find every leak in<br /><GradText>your store — free.</GradText>
            </h1>
            <p style={{ fontSize:"clamp(0.9rem,2vw,1.05rem)", color:mutedText, lineHeight:1.8, maxWidth:500, margin:"0 auto 1rem" }}>
              Enter your store URL. We automatically scan 8 categories and 40+ technical factors. Nothing skipped. Nothing softened.
            </p>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:dark?"rgba(0,255,136,.06)":"rgba(0,255,136,.08)", border:".5px solid rgba(0,255,136,.25)", borderRadius:100, padding:"6px 14px", marginBottom:"2rem" }}>
              <span style={{ fontSize:12, color:mutedText2 }}>Then we hand you your</span>
              <span style={{ fontSize:12, fontWeight:800, color:G }}>CGO — Conversion Growth Optimization</span>
              <span style={{ fontSize:12, color:mutedText2 }}>plan</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"0.5rem", marginBottom:"2rem", textAlign:"left" }}>
              {["Mobile performance & speed","Core Web Vitals (LCP, CLS, TBT)","SEO — 12 ranking factors","Technical health & server","Image optimization","SSL & security","Accessibility signals","Best practices audit"].map((item,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, background:dark?"rgba(255,255,255,.04)":"rgba(255,255,255,.4)", border:`.5px solid ${cardBorder}`, borderRadius:8, padding:".5rem .75rem" }}>
                  <span style={{ fontSize:12, color:mutedText2 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background:cardBg, border:`.5px solid ${cardBorder}`, borderTop:dark?".5px solid rgba(255,255,255,.2)":".5px solid rgba(255,255,255,.6)", borderRadius:20, padding:"1.8rem", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.4),transparent)", pointerEvents:"none" }}/>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:"1rem" }}>
                <input type="url" placeholder="Your store URL (e.g. mystore.com)" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key==="Enter" && handleScan()}
                  style={{ width:"100%", background:inputBg, border:`.5px solid ${inputBorder}`, borderRadius:10, padding:".85rem 1.1rem", color:headingColor, fontSize:15, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                  onFocus={e => e.target.style.borderColor="rgba(0,255,136,.5)"} onBlur={e => e.target.style.borderColor=inputBorder}/>
                <input type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width:"100%", background:inputBg, border:`.5px solid ${inputBorder}`, borderRadius:10, padding:".85rem 1.1rem", color:headingColor, fontSize:15, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                  onFocus={e => e.target.style.borderColor="rgba(0,255,136,.5)"} onBlur={e => e.target.style.borderColor=inputBorder}/>
              </div>
              {error && <p style={{ fontSize:13, color:"#FF6B6B", marginBottom:"1rem", padding:".75rem", background:"rgba(255,107,107,.08)", border:".5px solid rgba(255,107,107,.25)", borderRadius:8 }}>{error}</p>}
              <button onClick={handleScan} className="btn-g" style={{ width:"100%", fontFamily:"inherit", cursor:"pointer" }}>Scan my store now →</button>
              <p style={{ fontSize:11, color:mutedText3, textAlign:"center", marginTop:".75rem" }}>Automatic scan — no questionnaire. Takes 30-60 seconds. Free.</p>
            </div>
          </div>
        </section>
      )}

      {/* ── LOADING ── */}
      {loading && (
        <section style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"4rem 2rem" }}>
          <div style={{ maxWidth:520, width:"100%", textAlign:"center" }}>
            <div style={{ width:60, height:60, position:"relative", margin:"0 auto 2rem" }}>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid rgba(0,255,136,.25)", borderTopColor:G, animation:"auditSpin .8s linear infinite" }}/>
              <div style={{ position:"absolute", inset:10, borderRadius:"50%", border:"1px solid rgba(0,255,136,.15)", borderBottomColor:G, animation:"auditSpin 1.3s linear infinite reverse" }}/>
            </div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:headingColor, marginBottom:".4rem" }}>{SCAN_STAGES[stageIdx]?.msg}</h3>
            <p style={{ fontSize:13, color:mutedText3, marginBottom:"2.5rem" }}>{SCAN_STAGES[stageIdx]?.sub}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {SCAN_STAGES.map((s,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:12, color:i<=stageIdx?G:mutedText3, fontWeight:i<=stageIdx?700:400, minWidth:20 }}>{i<=stageIdx?"✓":"·"}</span>
                  <div style={{ flex:1, height:2, background:trackBg, borderRadius:2, overflow:"hidden" }}>
                    <div style={{ height:"100%", background:GG, width:i<stageIdx?"100%":i===stageIdx?"60%":"0%", transition:"width 1s ease", borderRadius:2 }}/>
                  </div>
                  <span style={{ fontSize:12, color:i<=stageIdx?G:mutedText3, minWidth:160, textAlign:"right" }}>{s.msg.replace("...","")}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RESULTS ── */}
      {analysis && !loading && (
        <div style={{ maxWidth:980, margin:"0 auto", padding:"clamp(2rem,5vw,4rem) clamp(1rem,4vw,2rem) 6rem", opacity:revealed?1:0, transition:"opacity .6s ease" }}>

          {/* Critical banner */}
          {analysis.isCritical && (
            <div style={{ background:"linear-gradient(135deg,rgba(255,59,59,.12),rgba(255,59,59,.04))", border:"1px solid rgba(255,59,59,.4)", borderRadius:16, padding:"1rem 1.4rem", marginBottom:"1.5rem", display:"flex", alignItems:"center", gap:12, animation:"criticalPulse 2.5s ease-in-out infinite" }}>
              <span style={{ width:10, height:10, borderRadius:"50%", background:"#FF3B3B", flexShrink:0, marginTop:6, display:"inline-block" }} />
              <div>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:"#FF3B3B", marginBottom:2 }}>CRITICAL REVENUE LEAK DETECTED</p>
                <p style={{ fontSize:13, color:"rgba(255,120,120,.8)", margin:0, lineHeight:1.6 }}>Multiple critical failures identified. Every ad you run is sending buyers to a broken experience.</p>
              </div>
            </div>
          )}

          {/* Overall score */}
          <div style={{ background:cardBg, border:`.5px solid ${analysis.isCritical?"rgba(255,59,59,.35)":cardBorder}`, borderRadius:24, padding:"1.8rem 2rem", marginBottom:"1.5rem", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${analysis.isCritical?"rgba(255,59,59,.5)":"rgba(0,255,136,.4)"},transparent)` }}/>
            <div style={{ display:"flex", gap:"1.5rem", alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ position:"relative", flexShrink:0 }}>
                <Ring score={analysis.overall} size={100} color={analysis.overall>74?G:analysis.overall>49?"#FF9900":"#FF3B3B"}/>
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.5rem", fontWeight:800, color:analysis.overall>74?G:analysis.overall>49?"#FF9900":"#FF3B3B" }}>{analysis.grade}</span>
                  <span style={{ fontSize:10, color:mutedText3 }}>{analysis.overall}/100</span>
                </div>
              </div>
              <div style={{ flex:1, minWidth:200 }}>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1rem,3vw,1.4rem)", fontWeight:800, color:headingColor, marginBottom:".3rem" }}>{analysis.domain}</h2>
                <p style={{ fontSize:13, color:mutedText, lineHeight:1.75, marginBottom:".75rem" }}>{analysis.verdict}</p>
                <span style={{ background:"rgba(255,59,59,.1)", border:".5px solid rgba(255,59,59,.25)", borderRadius:8, padding:"3px 10px", fontSize:12, color:"#FF6B6B", fontWeight:700 }}>Revenue leak: {analysis.leak}</span>
              </div>
            </div>
          </div>

          {/* Core Web Vitals */}
          <div style={{ background:cardBg, border:`.5px solid ${cardBorder}`, borderRadius:16, padding:"1.2rem 1.5rem", marginBottom:"1.5rem" }}>
            <p style={{ fontSize:11, color:mutedText3, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", marginBottom:"1rem" }}>Core Web Vitals</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"0.6rem" }} className="stat-grid">
              {Object.values(analysis.vitals).map((v,i) => (
                <div key={i} style={{ textAlign:"center", background:dark?"rgba(255,255,255,.03)":"rgba(255,255,255,.35)", border:`.5px solid ${vitC(v.status)}44`, borderRadius:10, padding:".75rem .5rem" }}>
                  <p style={{ fontSize:10, color:mutedText3, marginBottom:4 }}>{v.label}</p>
                  <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:800, color:vitC(v.status) }}>{v.value}</p>
                  <p style={{ fontSize:9, color:vitC(v.status), fontWeight:600, textTransform:"uppercase", marginTop:2 }}>{v.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Metric scores */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.75rem", marginBottom:"1.5rem" }}>
            {Object.values(analysis.metrics).map((v,i) => (
              <div key={i} style={{ background:cardBg, border:`.5px solid ${v.score<50?"rgba(255,59,59,.25)":v.score<75?"rgba(255,153,0,.2)":cardBorder}`, borderRadius:12, padding:"1rem", textAlign:"center" }}>
                <span style={{ display:"inline-block", width:10, height:10, borderRadius:"50%", background:v.score>74?G:v.score>49?"#FF9900":"#FF3B3B" }} />
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.4rem", fontWeight:800, color:v.score>74?G:v.score>49?"#FF9900":"#FF3B3B", margin:"4px 0 2px" }}>{v.score}</p>
                <p style={{ fontSize:10, color:mutedText3, lineHeight:1.3 }}>{v.label}</p>
              </div>
            ))}
          </div>

          {/* Severity summary */}
          <div style={{ display:"flex", gap:10, marginBottom:"1.5rem", flexWrap:"wrap" }}>
            {["critical","high","medium"].map(sev => {
              const count = analysis.findings.filter(f => f.severity===sev).length;
              if (!count) return null;
              return (
                <div key={sev} style={{ background:`${sevColor(sev)}18`, border:`.5px solid ${sevColor(sev)}44`, borderRadius:10, padding:".6rem 1rem", display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:sevColor(sev) }}>{count}</span>
                  <span style={{ fontSize:12, color:mutedText2, textTransform:"capitalize" }}>{sev} issues</span>
                </div>
              );
            })}
            <div style={{ background:dark?"rgba(255,255,255,.04)":"rgba(255,255,255,.4)", border:`.5px solid ${cardBorder}`, borderRadius:10, padding:".6rem 1rem", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:G }}>{analysis.findings.length}</span>
              <span style={{ fontSize:12, color:mutedText2 }}>total issues found</span>
            </div>
          </div>

          {/* All findings */}
          <div style={{ display:"flex", flexDirection:"column", gap:"0.9rem", marginBottom:"2rem" }}>
            {analysis.findings.map((f,i) => (
              <div key={i} style={{ background:cardBg, border:`.5px solid ${cardBorder}`, borderLeft:`3px solid ${sevColor(f.severity)}`, borderRadius:"0 14px 14px 0", padding:"1.2rem 1.5rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:".5rem", flexWrap:"wrap" }}>
                  <span style={{ background:`${sevColor(f.severity)}22`, border:`.5px solid ${sevColor(f.severity)}55`, borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700, color:sevColor(f.severity), textTransform:"uppercase" }}>{f.severity}</span>
                  <span style={{ fontSize:11, color:mutedText3 }}>{f.category}</span>
                </div>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:800, color:headingColor, marginBottom:".5rem" }}>{f.title}</h3>
                <p style={{ fontSize:13, color:mutedText, lineHeight:1.75, marginBottom:".6rem" }}>{f.finding}</p>
                <p style={{ fontSize:12, color:mutedText3, fontStyle:"italic", marginBottom:".75rem" }}>Revenue impact: {f.impact}</p>
                <div style={{ background:dark?"rgba(0,255,136,.04)":"rgba(0,255,136,.06)", border:".5px solid rgba(0,255,136,.18)", borderRadius:8, padding:".75rem 1rem" }}>
                  <span style={{ fontSize:11, color:G, fontWeight:700 }}>→ Fix: </span>
                  <span style={{ fontSize:13, color:mutedText, lineHeight:1.7 }}>{f.fix}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Access tier indicator */}
          {accessTier && (
            <div style={{ background:"rgba(0,255,136,.06)", border:".5px solid rgba(0,255,136,.2)", borderRadius:12, padding:".9rem 1.2rem", marginBottom:"1.5rem", display:"flex", alignItems:"center", gap:10 }}>
              <UnlockIcon size={16} color={G} />
              <span style={{ fontSize:13, color:G, fontWeight:600 }}>
                {accessTier==="admin" ? "Admin — all downloads unlocked" : `${accessTier} package unlocked`}
              </span>
            </div>
          )}

          {/* ── CGO — CONVERSION GROWTH OPTIMIZATION ── */}
          <div style={{ background:"linear-gradient(135deg,rgba(0,255,136,.07),rgba(0,204,106,.02))", border:".5px solid rgba(0,255,136,.22)", borderTop:".5px solid rgba(0,255,136,.4)", borderRadius:24, padding:"clamp(1.8rem,4vw,2.6rem)", marginBottom:"2rem", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:"8%", right:"8%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)" }}/>

            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,255,136,.12)", border:".5px solid rgba(0,255,136,.35)", borderRadius:100, padding:"5px 14px", marginBottom:"1rem" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:G }}/>
              <span style={{ fontSize:11, fontWeight:700, color:G, letterSpacing:".06em" }}>THE SYSTEM BEHIND THE FIX</span>
            </div>

            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.5rem,4vw,2.1rem)", fontWeight:800, color:headingColor, marginBottom:".3rem", lineHeight:1.15 }}>
              Conversion Growth Optimization
            </h2>
            <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1rem,2.5vw,1.2rem)", fontWeight:800, color:G, letterSpacing:".04em", marginBottom:"1rem" }}>
              CGO — our 90–120 day growth framework
            </p>

            <p style={{ fontSize:14, color:mutedText, lineHeight:1.8, maxWidth:640, marginBottom:"1.6rem" }}>
              Every issue above gets fixed inside a system, not a to-do list. Most agencies start with ads. We start with the store — because sending paid traffic to a leaky funnel is the fastest way to burn budget and get numbers that make everyone look bad. CGO fixes what's broken first, proves what works with controlled testing, then scales only what's earned it.
            </p>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"0.9rem" }}>
              {[
                { phase:"Phase 1", days:"Days 1–30", title:"Foundation Fix", desc:"Technical performance, trust signals, and a credible social presence — make the store worth sending traffic to." },
                { phase:"Phase 2", days:"Days 31–60", title:"Traffic Ignition", desc:"Controlled ad testing across Meta & TikTok, retargeting, and email/SMS flows — find what actually works." },
                { phase:"Phase 3", days:"Days 61–90", title:"Scale & Compound", desc:"Double down on winners, cut what isn't working, second-round CRO informed by real traffic data." },
                { phase:"Phase 4", days:"Days 91–120", title:"Systemize", desc:"Document the playbook, test new channels, and turn the system into something that runs without you.", optional:true },
              ].map((p,i) => (
                <div key={i} style={{ background:dark?"rgba(255,255,255,.04)":"rgba(255,255,255,.5)", border:".5px solid rgba(0,255,136,.18)", borderRadius:14, padding:"1.1rem 1.2rem", position:"relative" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:".4rem" }}>
                    <span style={{ fontSize:10, fontWeight:700, color:G, textTransform:"uppercase", letterSpacing:".06em" }}>{p.phase}</span>
                    {p.optional && <span style={{ fontSize:9, color:mutedText3, fontStyle:"italic" }}>optional</span>}
                  </div>
                  <p style={{ fontSize:11, color:mutedText3, marginBottom:".5rem" }}>{p.days}</p>
                  <h4 style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:headingColor, marginBottom:".4rem" }}>{p.title}</h4>
                  <p style={{ fontSize:12, color:mutedText, lineHeight:1.6 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Downloads */}
          <div style={{ background:cardBg, border:`.5px solid ${cardBorder}`, borderRadius:20, padding:"1.8rem", marginBottom:"2rem" }}>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.1rem", fontWeight:800, color:headingColor, marginBottom:".4rem" }}>Download Your Reports</h3>
            <p style={{ fontSize:13, color:mutedText2, lineHeight:1.6, marginBottom:"1.2rem" }}>
              Three PDFs. The Problem Report shows what's broken and what it's costing you. The Fixes and Growth & Marketing reports show exactly how to fix it and build your engine — unlocked with a paid package.
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"0.75rem" }}>
              {[
                { type:"problems",  label:"Problem Report",         desc:"Every problem found, with revenue impact — free with any scan", free:true },
                { type:"fixes",     label:"Fixes Report",           desc:"The exact fix for each issue, in priority order", free:false },
                { type:"marketing", label:"Growth & Marketing",     desc:"Your full traffic, retention, and brand-building plan", free:false },
              ].map((d,i) => {
                const unlocked = d.free || (accessTier && accessTier !== null);
                const isDownloading = downloading === d.type;
                return (
                  <div key={i} style={{ background:unlocked?dark?"rgba(0,255,136,.05)":"rgba(0,255,136,.07)":dark?"rgba(255,255,255,.02)":"rgba(26,20,8,.03)", border:unlocked?".5px solid rgba(0,255,136,.22)":`.5px solid ${cardBorder}`, borderRadius:12, padding:"1.2rem" }}>
                    <p style={{ fontSize:13, fontWeight:700, color:headingColor, marginBottom:4 }}>{d.label}</p>
                    <p style={{ fontSize:11, color:mutedText3, marginBottom:".9rem", lineHeight:1.5 }}>{d.desc}</p>
                    <button onClick={() => handleDownload(d.type)} disabled={isDownloading}
                      style={{ width:"100%", background:unlocked?GG:"transparent", color:unlocked?"#040608":mutedText3, border:unlocked?"none":`.5px solid ${cardBorder}`, borderRadius:8, padding:".6rem", fontSize:13, fontWeight:700, cursor:isDownloading?"default":"pointer", fontFamily:"inherit", opacity:isDownloading?0.6:1 }}>
                      {isDownloading ? "Preparing PDF…" : unlocked ? "Download PDF" : "Enter access code"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solution teaser — blurred */}
          <div style={{ position:"relative", marginBottom:"2rem" }}>
            <div style={{ background:cardBg, border:`.5px solid ${cardBorder}`, borderRadius:20, padding:"1.8rem", filter:accessTier?"none":"blur(5px)", pointerEvents:accessTier?"auto":"none", userSelect:accessTier?"auto":"none" }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.1rem", fontWeight:800, color:headingColor, marginBottom:"1rem" }}>CGO — Phase 1 Preview</h3>
              {solution?.fixing?.phases?.[0]?.items?.slice(0,2).map((item,i) => (
                <div key={i} style={{ background:dark?"rgba(255,255,255,.03)":"rgba(255,255,255,.35)", border:`.5px solid ${cardBorder}`, borderRadius:10, padding:"1rem", marginBottom:".75rem" }}>
                  <p style={{ fontSize:13, fontWeight:700, color:headingColor, marginBottom:4 }}>→ {item.title}</p>
                  <p style={{ fontSize:12, color:mutedText, lineHeight:1.7 }}>{item.action}</p>
                </div>
              ))}
              <p style={{ fontSize:12, color:mutedText3, textAlign:"center", marginTop:"1rem" }}>+ Full Fixes Report and Growth & Marketing Report as separate downloads</p>
            </div>
            {!accessTier && (
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, borderRadius:20 }}>
                <LockIcon size={32} color={headingColor} />
                <p style={{ fontSize:14, fontWeight:700, color:headingColor, textAlign:"center", margin:0 }}>Unlock your full CGO Roadmap</p>
                <p style={{ fontSize:12, color:mutedText, textAlign:"center", maxWidth:280, margin:0 }}>Pay for any package to receive your access code.</p>
                <button onClick={() => setShowModal(true)} className="btn-g" style={{ fontFamily:"inherit", cursor:"pointer" }}>Enter access code →</button>
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div style={{ background:"linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border:".5px solid rgba(0,255,136,.25)", borderTop:".5px solid rgba(0,255,136,.45)", borderRadius:24, padding:"clamp(2rem,5vw,3rem)", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)", pointerEvents:"none" }}/>
            <p style={{ fontSize:10, color:G, letterSpacing:".14em", textTransform:"uppercase", marginBottom:".6rem", fontWeight:700 }}>Want us to fix all of this?</p>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.3rem,4vw,2rem)", fontWeight:800, color:headingColor, marginBottom:".6rem", lineHeight:1.15 }}>
              We found the problems.<br /><GradText>We can fix them too.</GradText>
            </h3>
            <p style={{ fontSize:14, color:mutedText, maxWidth:460, margin:"0 auto 1.5rem", lineHeight:1.75 }}>
              Apply for our paid service — we fix your top revenue leaks, rebuild your conversion system, and scale what works.
            </p>
            <p style={{ fontSize:12.5, color:G, maxWidth:480, margin:"0 auto 1.5rem", lineHeight:1.7, fontWeight:600 }}>
              Follow the full plan and don't see measurable movement in 90 days? We keep working with you free until you do.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <a href={"https://wa.me/2349064885280?text="+encodeURIComponent(`Hi Bode Conversion Lab 👋 I just ran the free audit for ${url}. My store scored ${analysis?.overall}/100 and I want to fix these issues. Can we talk?`)} target="_blank" rel="noopener noreferrer" className="btn-g" style={{ display:"inline-block", textDecoration:"none" }}>
                Apply for professional audit →
              </a>
              <button onClick={() => { setAnalysis(null); setSolution(null); setUrl(""); setEmail(""); setRevealed(false); setAccessTier(null); }} className="btn-ghost" style={{ fontFamily:"inherit", cursor:"pointer" }}>
                Scan another store
              </button>
            </div>
          </div>

        </div>
      )}
    </PageWrapper>
  );
}