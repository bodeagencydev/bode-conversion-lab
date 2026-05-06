import { useState } from "react";
import { Link } from "react-router-dom";
import { G, GG } from "../data.js";
import { PageWrapper, Particles, GradText, useTheme } from "../components.jsx";

const CHECKS = [
  { id: "speed",      label: "Page Speed",          icon: "⚡" },
  { id: "mobile",     label: "Mobile Friendliness",  icon: "📱" },
  { id: "seo",        label: "SEO Health",           icon: "🔍" },
  { id: "checkout",   label: "Checkout Friction",    icon: "🛒" },
  { id: "images",     label: "Image Optimization",   icon: "🖼️" },
  { id: "ssl",        label: "SSL & Security",       icon: "🔒" },
  { id: "vitals",     label: "Core Web Vitals",      icon: "📊" },
  { id: "conversion", label: "Conversion Readiness", icon: "💰" },
];

const MSGS = [
  "Connecting to store...",
  "Running PageSpeed analysis...",
  "Scanning mobile experience...",
  "Checking SEO signals...",
  "Analysing Core Web Vitals...",
  "Detecting friction points...",
  "Scoring conversion readiness...",
  "Building your report...",
];

function col(s)   { return s >= 80 ? "#00ff88" : s >= 50 ? "#FAAD4D" : "#FF4444"; }
function grade(s) { return s >= 80 ? "A" : s >= 65 ? "B" : s >= 50 ? "C" : "D"; }
function clamp(v) { return Math.max(0, Math.min(100, Math.round(v))); }
const pct = v => v != null ? clamp(v * 100) : null;

/* Fetch PSI through two fallback CORS proxies */
async function fetchPSI(storeUrl, strategy) {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(storeUrl)}&strategy=${strategy}&category=performance&category=seo&category=best-practices&category=accessibility`;

  /* Try direct first (works in some environments) */
  const proxies = [
    apiUrl, /* direct */
    `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`,
  ];

  for (const endpoint of proxies) {
    try {
      const res = await fetch(endpoint, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) continue;
      const raw = await res.json();
      /* allorigins wraps in { contents: "..." } */
      const data = raw.contents ? JSON.parse(raw.contents) : raw;
      if (data?.lighthouseResult) return data;
    } catch { /* try next */ }
  }
  return null;
}

function buildReport(desktop, mobile, url) {
  const lh  = mobile?.lighthouseResult;
  const lhD = desktop?.lighthouseResult;

  const mPerf = pct(lh?.categories?.performance?.score);
  const dPerf = pct(lhD?.categories?.performance?.score);
  const mSeo  = pct(lh?.categories?.seo?.score);
  const mAcc  = pct(lh?.categories?.accessibility?.score);
  const mBest = pct(lh?.categories?.["best-practices"]?.score);

  const lcp = lh?.audits?.["largest-contentful-paint"];
  const cls = lh?.audits?.["cumulative-layout-shift"];
  const fid = lh?.audits?.["total-blocking-time"];
  const si  = lh?.audits?.["speed-index"];

  /* Speed */
  const speedScore = clamp((mPerf ?? 45) * 0.6 + (dPerf ?? 55) * 0.4);
  const speedIssues = [], speedFixes = [];
  if (mPerf != null && mPerf < 90) { speedIssues.push(`Mobile performance score: ${mPerf}/100`); speedFixes.push("Minify JS/CSS and defer non-critical scripts"); }
  if (lcp && parseFloat(lcp.numericValue) > 2500) { speedIssues.push(`LCP is ${lcp.displayValue} — above 2.5s threshold`); speedFixes.push("Preload hero image and serve via CDN"); }
  if (si  && parseFloat(si.numericValue)  > 3400) { speedIssues.push(`Speed Index: ${si.displayValue}`); speedFixes.push("Eliminate render-blocking resources above the fold"); }
  if (!speedIssues.length) speedIssues.push("Page speed looks solid");
  if (!speedFixes.length)  speedFixes.push("Monitor with real-user metrics (CrUX data)");

  /* Mobile */
  const mobileScore = clamp(mPerf ?? 50);
  const mobileIssues = [], mobileFixes = [];
  const vp = lh?.audits?.viewport;
  if (vp?.score === 0) { mobileIssues.push("No viewport meta tag detected"); mobileFixes.push("Add <meta name='viewport' content='width=device-width,initial-scale=1'>"); }
  if (mPerf != null && mPerf < 75) { mobileIssues.push(`Mobile score ${mPerf}/100 vs desktop ${dPerf}/100`); mobileFixes.push("Prioritise mobile-first CSS and lazy-load images"); }
  const tap = lh?.audits?.["tap-targets"];
  if (tap?.score != null && tap.score < 1) { mobileIssues.push("Tap targets too small on mobile"); mobileFixes.push("Ensure all buttons/links are at least 48×48px"); }
  if (!mobileIssues.length) mobileIssues.push("Mobile experience appears solid");
  if (!mobileFixes.length)  mobileFixes.push("Test on real iOS and Android devices");

  /* SEO */
  const seoScore = clamp(mSeo ?? 55);
  const seoIssues = [], seoFixes = [];
  if (lh?.audits?.["meta-description"]?.score === 0) { seoIssues.push("Missing meta description tag"); seoFixes.push("Add a unique 150-160 char meta description per page"); }
  if (lh?.audits?.["document-title"]?.score     === 0) { seoIssues.push("Missing or empty title tag"); seoFixes.push("Add keyword-rich title tags under 60 characters"); }
  if (lh?.audits?.canonical?.score              === 0) { seoIssues.push("No canonical tag — duplicate content risk"); seoFixes.push("Add rel=canonical to all key pages"); }
  if (mSeo != null && mSeo < 80) { seoIssues.push(`SEO score ${mSeo}/100`); seoFixes.push("Add product schema markup and structured data"); }
  if (!seoIssues.length) seoIssues.push("SEO fundamentals look healthy");
  if (!seoFixes.length)  seoFixes.push("Add product schema and review Open Graph tags");

  /* Core Web Vitals */
  const lcpMs  = lcp ? parseFloat(lcp.numericValue) : 3500;
  const clsVal = cls ? parseFloat(cls.numericValue) : 0.18;
  const fidMs  = fid ? parseFloat(fid.numericValue) : 250;
  let vitScore = 100;
  if (lcpMs  > 4000) vitScore -= 35; else if (lcpMs > 2500) vitScore -= 20;
  if (clsVal > 0.25) vitScore -= 30; else if (clsVal > 0.1) vitScore -= 15;
  if (fidMs  > 600)  vitScore -= 25; else if (fidMs > 300)  vitScore -= 12;
  vitScore = clamp(vitScore);
  const vitIssues = [], vitFixes = [];
  if (lcpMs > 2500)  { vitIssues.push(`LCP ${lcp?.displayValue || ">2.5s"} exceeds threshold`); vitFixes.push("Compress & preload hero image — use WebP format"); }
  if (clsVal > 0.1)  { vitIssues.push(`CLS ${cls?.displayValue || ">0.1"} — layout shifts detected`); vitFixes.push("Set explicit width/height on images and reserve ad space"); }
  if (fidMs > 300)   { vitIssues.push(`TBT ${fid?.displayValue || ">300ms"} — main thread blocked`); vitFixes.push("Split large JS bundles and use code splitting"); }
  if (!vitIssues.length) vitIssues.push("Core Web Vitals are within Google's thresholds");
  if (!vitFixes.length)  vitFixes.push("Monitor vitals monthly — they shift with content updates");

  /* Images */
  const imgAudit  = lh?.audits?.["uses-optimized-images"];
  const modernImg = lh?.audits?.["uses-webp-images"];
  const imgSize   = lh?.audits?.["uses-responsive-images"];
  let imgScore = 82;
  if (imgAudit?.score  === 0) imgScore -= 25;
  if (modernImg?.score === 0) imgScore -= 20;
  if (imgSize?.score   === 0) imgScore -= 15;
  imgScore = clamp(imgScore);
  const imgIssues = [], imgFixes = [];
  if (imgAudit?.score  === 0) { imgIssues.push("Images not properly optimised"); imgFixes.push("Compress all product images under 100KB each"); }
  if (modernImg?.score === 0) { imgIssues.push("Not using WebP/AVIF formats"); imgFixes.push("Convert to WebP — typically 30% smaller than JPEG"); }
  if (imgSize?.score   === 0) { imgIssues.push("Images not sized for viewport"); imgFixes.push("Use srcset to serve different sizes per device"); }
  if (!imgIssues.length) imgIssues.push("Image optimisation looks good");
  if (!imgFixes.length)  imgFixes.push("Add lazy loading to below-fold product images");

  /* SSL */
  const httpsAudit = lh?.audits?.["is-on-https"];
  const sslScore   = httpsAudit?.score === 1 ? 98 : 15;
  const sslIssues  = [httpsAudit?.score === 1 ? "SSL certificate is active and valid" : "Store NOT served over HTTPS — critical trust issue"];
  const sslFixes   = [httpsAudit?.score === 1 ? "Ensure SSL auto-renews and HSTS headers are set" : "Enable HTTPS immediately via your hosting provider"];

  /* Checkout (inferred) */
  const checkoutScore = clamp(50 + (mPerf ?? 50) * 0.3 + (mBest ?? 50) * 0.2);
  const checkoutIssues = [
    mPerf != null && mPerf < 70 ? "Slow mobile load will cause checkout abandonment" : "Mobile load time appears acceptable for checkout",
    "Guest checkout availability requires live manual test",
    "Trust badges and payment logos not verifiable from URL alone",
  ];
  const checkoutFixes = [
    "Enable guest checkout — removes the #1 conversion killer",
    "Reduce checkout to 2 steps maximum",
    "Display SSL badge and payment logos at checkout",
  ];

  /* Conversion */
  const convScore = clamp((mPerf ?? 50) * 0.3 + (mSeo ?? 50) * 0.2 + (mBest ?? 50) * 0.2 + (mAcc ?? 50) * 0.15 + sslScore * 0.15);
  const convIssues = [], convFixes = [];
  if (mAcc  != null && mAcc  < 80) { convIssues.push(`Accessibility score ${mAcc}/100 — barriers may deter buyers`); convFixes.push("Fix contrast ratios and add alt text to all product images"); }
  if (mBest != null && mBest < 80) { convIssues.push(`Best-practices score ${mBest}/100`); convFixes.push("Remove deprecated APIs and fix any mixed-content warnings"); }
  convIssues.push("CTA placement requires manual review");
  convFixes.push("Ensure Add-to-Cart is above the fold on mobile");
  convFixes.push("Add social proof (reviews, sold count) near the CTA");

  /* Overall */
  const overall = clamp((speedScore + mobileScore + seoScore + vitScore + imgScore + sslScore + checkoutScore + convScore) / 8);

  /* Top 3 worst checks */
  const ranked = [
    { id: "speed",      score: speedScore },
    { id: "mobile",     score: mobileScore },
    { id: "seo",        score: seoScore },
    { id: "vitals",     score: vitScore },
    { id: "images",     score: imgScore },
    { id: "ssl",        score: sslScore },
    { id: "checkout",   score: checkoutScore },
    { id: "conversion", score: convScore },
  ].sort((a, b) => a.score - b.score);

  const pMap = {
    speed:      `Fix mobile page speed (${mobileScore}/100) — every 1s delay reduces conversions by 7%`,
    mobile:     `Optimise mobile experience — ${mPerf ?? "low"}/100 performance on phones`,
    seo:        `Fix SEO issues (${seoScore}/100) — missing tags reduce organic traffic`,
    vitals:     `Improve Core Web Vitals — Google uses these for search ranking`,
    images:     `Optimise product images — uncompressed images slow your store and kill ROAS`,
    ssl:        `Fix HTTPS immediately — buyers will not trust an unsecured checkout`,
    checkout:   `Audit checkout flow — enable guest checkout and add trust signals`,
    conversion: `Improve conversion readiness — review CTA placement and social proof`,
  };

  const leak = overall >= 80 ? "5-15%" : overall >= 60 ? "20-35%" : overall >= 40 ? "35-55%" : "55-70%";

  return {
    domain: (() => { try { return new URL(url).hostname.replace("www.",""); } catch { return url; } })(),
    overallScore: overall,
    checks: {
      speed:      { score: speedScore,    grade: grade(speedScore),    summary: `Mobile ${mPerf ?? "?"}  Desktop ${dPerf ?? "?"}  LCP ${lcp?.displayValue ?? "?"}`, issues: speedIssues,    fixes: speedFixes },
      mobile:     { score: mobileScore,   grade: grade(mobileScore),   summary: `Mobile performance ${mPerf ?? "?"}/100`, issues: mobileIssues,   fixes: mobileFixes },
      seo:        { score: seoScore,      grade: grade(seoScore),      summary: `SEO score ${mSeo ?? "?"}/100 from Google Lighthouse`, issues: seoIssues,      fixes: seoFixes },
      checkout:   { score: checkoutScore, grade: grade(checkoutScore), summary: "Inferred from speed, best-practices and security signals", issues: checkoutIssues, fixes: checkoutFixes },
      images:     { score: imgScore,      grade: grade(imgScore),      summary: "Checked for WebP, compression and responsive sizing", issues: imgIssues, fixes: imgFixes },
      ssl:        { score: sslScore,      grade: grade(sslScore),      summary: httpsAudit?.score === 1 ? "HTTPS active and valid" : "HTTPS not detected", issues: sslIssues, fixes: sslFixes },
      vitals:     { score: vitScore,      grade: grade(vitScore),      summary: `LCP ${lcp?.displayValue ?? "?"} · CLS ${cls?.displayValue ?? "?"} · TBT ${fid?.displayValue ?? "?"}`, issues: vitIssues, fixes: vitFixes },
      conversion: { score: convScore,     grade: grade(convScore),     summary: "Composite: performance + SEO + accessibility + best-practices", issues: convIssues, fixes: convFixes },
    },
    topPriorities: ranked.slice(0, 3).map(a => pMap[a.id]),
    estimatedRevenueLeak: `${leak} of potential revenue`,
    verdict: `Based on real Google data, ${(() => { try { return new URL(url).hostname; } catch { return url; } })()} scores ${overall}/100. ${overall >= 80 ? "Solid fundamentals — focus on scaling." : overall >= 60 ? "Clear friction points are costing you conversions daily." : "Multiple critical issues are actively losing you customers and revenue."}`,
  };
}

function Ring({ score, size = 96, color: c }) {
  const r    = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(128,128,128,.13)" strokeWidth={7}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={7}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.4s cubic-bezier(.16,1,.3,1)" }}/>
    </svg>
  );
}

function CheckCard({ check, label, icon, dark, cardBg, cardBorder, mutedText, headingColor, trackBg }) {
  const [open, setOpen] = useState(false);
  const c = col(check.score);
  return (
    <div onClick={() => setOpen(v => !v)}
      style={{ background: cardBg, border: `.5px solid ${open ? c+"66" : cardBorder}`, borderTop: `.5px solid ${c}55`, borderRadius: 16, padding: "1.2rem 1.3rem", cursor: "pointer", transition: "border-color .25s, transform .2s, box-shadow .2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${c}18`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".6rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 17 }}>{icon}</span>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: headingColor }}>{label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: c, lineHeight: 1 }}>{check.grade}</span>
          <span style={{ fontSize: 11, color: mutedText }}>{check.score}/100</span>
          <span style={{ color: c, fontSize: 16, transition: "transform .25s", transform: open ? "rotate(45deg)" : "none", display: "inline-block", lineHeight: 1 }}>+</span>
        </div>
      </div>
      <div style={{ height: 5, background: trackBg, borderRadius: 5, overflow: "hidden", marginBottom: ".5rem" }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg,${c},${c}99)`, borderRadius: 5, width: `${check.score}%`, transition: "width 1.2s cubic-bezier(.16,1,.3,1)" }}/>
      </div>
      <p style={{ fontSize: 12, color: mutedText, lineHeight: 1.55, marginBottom: open ? ".9rem" : 0 }}>{check.summary}</p>
      {open && (
        <div style={{ borderTop: dark ? ".5px solid rgba(255,255,255,.07)" : ".5px solid rgba(0,0,0,.07)", paddingTop: ".75rem" }}>
          {check.issues?.length > 0 && (
            <div style={{ marginBottom: ".75rem" }}>
              <p style={{ fontSize: 10, color: "#ff8888", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700, marginBottom: ".4rem" }}>⚠ Issues</p>
              {check.issues.map((iss, i) => (
                <div key={i} style={{ display: "flex", gap: 7, marginBottom: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink:0, marginTop:2 }}><path d="M3 3L9 9M9 3L3 9" stroke="#FF6400" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <p style={{ fontSize: 12, color: dark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)", margin: 0, lineHeight: 1.5 }}>{iss}</p>
                </div>
              ))}
            </div>
          )}
          {check.fixes?.length > 0 && (
            <div>
              <p style={{ fontSize: 10, color: "#00ff88aa", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700, marginBottom: ".4rem" }}>✓ Fixes</p>
              {check.fixes.map((fix, i) => (
                <div key={i} style={{ display: "flex", gap: 7, marginBottom: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink:0, marginTop:2 }}><path d="M2 6L5 9L10 3" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <p style={{ fontSize: 12, color: dark ? "rgba(255,255,255,.6)" : "rgba(0,0,0,.6)", margin: 0, lineHeight: 1.5 }}>{fix}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Audit() {
  const { dark } = useTheme();
  const [url,     setUrl]     = useState("");
  const [loading, setLoading] = useState(false);
  const [msgIdx,  setMsgIdx]  = useState(0);
  const [results, setResults] = useState(null);
  const [error,   setError]   = useState("");

  const headingColor = dark ? "#fff"  : "#0a0a0a";
  const mutedText    = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const cardBg       = dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))";
  const cardBorder   = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)";
  const inputBg      = dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)";
  const inputBorder  = dark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.12)";
  const inputColor   = dark ? "#f0f0f0" : "#0a0a0a";
  const trackBg      = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)";

  const runAudit = async () => {
    let cleaned = url.trim();
    if (!cleaned) { setError("Please enter your store URL."); return; }
    if (!/^https?:\/\//i.test(cleaned)) cleaned = "https://" + cleaned;
    try { new URL(cleaned); } catch { setError("That doesn't look like a valid URL."); return; }

    setError(""); setLoading(true); setResults(null); setMsgIdx(0);
    let idx = 0;
    const iv = setInterval(() => { idx = (idx + 1) % MSGS.length; setMsgIdx(idx); }, 1800);

    try {
      const [mData, dData] = await Promise.all([
        fetchPSI(cleaned, "mobile"),
        fetchPSI(cleaned, "desktop"),
      ]);

      if (!mData && !dData) throw new Error("No data");
      setResults(buildReport(dData, mData, cleaned));
    } catch {
      setError("Could not analyse that store. Please check the URL is correct and publicly accessible, then try again.");
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  const oCol   = results ? col(results.overallScore)   : G;
  const oGrade = results ? grade(results.overallScore) : "?";

  return (
    <PageWrapper>
      <section style={{ position: "relative", padding: "clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) 2.5rem", overflow: "hidden" }}>
        <Particles/>
        <div style={{ position: "absolute", width: 600, height: 600, top: -150, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.13),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }}/>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: G, fontWeight: 500, marginBottom: "1.4rem" }}>
            <span style={{ width: 6, height: 6, background: G, borderRadius: "50%", animation: "pulse 2s infinite" }}/> Powered by Google PageSpeed Insights
          </span>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.9rem,5.5vw,3.3rem)", fontWeight: 800, lineHeight: 1.08, color: headingColor, marginBottom: "1rem", wordBreak: "break-word" }}>
            Paste your URL.<br/><GradText>See exactly where you're losing money.</GradText>
          </h1>
          <p style={{ fontSize: "clamp(0.9rem,2.5vw,1rem)", color: mutedText, lineHeight: 1.75, maxWidth: 500, margin: "0 auto 2rem" }}>
            Real data from Google's API. 8 conversion checks. Specific fixes — like PageSpeed Insights but built for e-commerce revenue.
          </p>
          <div style={{ maxWidth: 620, margin: "0 auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
              <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>🔗</span>
              <input type="text" placeholder="yourstore.com" value={url}
                onChange={e => { setUrl(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && !loading && runAudit()}
                style={{ width: "100%", background: inputBg, border: `.5px solid ${error ? "#FF4444" : inputBorder}`, borderRadius: 12, padding: ".85rem 1rem .85rem 2.7rem", color: inputColor, fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "border-color .2s" }}
                onFocus={e => e.target.style.borderColor = "rgba(0,255,136,.5)"}
                onBlur={e => e.target.style.borderColor = error ? "#FF4444" : inputBorder}/>
            </div>
            <button onClick={runAudit} disabled={loading}
              style={{ background: GG, color: "#040608", border: "none", borderRadius: 12, padding: ".85rem 1.6rem", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? .8 : 1, whiteSpace: "nowrap", boxShadow: "0 4px 22px rgba(0,255,136,.35)", transition: "transform .15s,box-shadow .15s" }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 34px rgba(0,255,136,.55)"; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 22px rgba(0,255,136,.35)"; }}>
              {loading ? "Analysing..." : "Analyse Store →"}
            </button>
          </div>
          {error && <p style={{ color: "#FF4444", fontSize: 13, marginTop: 10 }}>{error}</p>}
          {!loading && !results && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: "1.8rem" }}>
              {CHECKS.map(c => (
                <span key={c.id} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)", border: dark ? ".5px solid rgba(255,255,255,.09)" : ".5px solid rgba(0,0,0,.08)", borderRadius: 100, padding: "4px 11px", fontSize: 11.5, color: mutedText }}>
                  {c.icon} {c.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {loading && (
        <div style={{ maxWidth: 580, margin: "0 auto", padding: "0 1.5rem 5rem" }}>
          <div style={{ background: cardBg, border: `.5px solid ${cardBorder}`, borderRadius: 24, padding: "2.5rem 2rem", position: "relative", overflow: "hidden", textAlign: "center" }}>
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)" }}/>
            <div style={{ width: 70, height: 70, margin: "0 auto 1.5rem", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2.5px solid ${G}`, borderTopColor: "transparent", animation: "auditSpin 0.9s linear infinite" }}/>
              <div style={{ position: "absolute", inset: 10, borderRadius: "50%", border: `1.5px solid ${G}`, borderBottomColor: "transparent", animation: "auditSpin 1.4s linear infinite reverse" }}/>
              <div style={{ position: "absolute", inset: "50%", transform: "translate(-50%,-50%)", width: 8, height: 8, borderRadius: "50%", background: G, animation: "pulse 1s ease-in-out infinite" }}/>
            </div>
            <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, color: headingColor, marginBottom: ".4rem" }}>{MSGS[msgIdx]}</p>
            <p style={{ fontSize: 12, color: mutedText, marginBottom: "1.5rem" }}>Fetching real data from Google PageSpeed API...</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {CHECKS.map((c, i) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{c.icon}</span>
                  <div style={{ flex: 1, height: 4, background: trackBg, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: GG, borderRadius: 4, animation: `scanBar 1.8s ${i * 0.18}s ease-in-out infinite alternate` }}/>
                  </div>
                  <span style={{ fontSize: 11, color: mutedText, whiteSpace: "nowrap", minWidth: 120, textAlign: "left" }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes auditSpin { to { transform: rotate(360deg); } }
            @keyframes scanBar { from { width:10%;opacity:.3; } to { width:100%;opacity:1; } }
          `}</style>
        </div>
      )}

      {results && !loading && (
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 clamp(1rem,4vw,2rem) 5rem" }}>
          <div style={{ background: cardBg, border: `.5px solid ${cardBorder}`, borderTop: `.5px solid ${oCol}66`, borderRadius: 24, padding: "clamp(1.4rem,4vw,2.2rem)", marginBottom: "1.2rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg,transparent,${oCol}77,transparent)` }}/>
            <div style={{ display: "flex", gap: "clamp(.8rem,3vw,2rem)", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Ring score={results.overallScore} size={96} color={oCol}/>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: oCol, lineHeight: 1 }}>{oGrade}</span>
                  <span style={{ fontSize: 10, color: mutedText }}>{results.overallScore}/100</span>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.1rem,3.5vw,1.5rem)", fontWeight: 800, color: headingColor, marginBottom: ".4rem" }}>{results.domain}</h2>
                <p style={{ fontSize: 13, color: mutedText, lineHeight: 1.65, marginBottom: ".9rem" }}>{results.verdict}</p>
                <div style={{ display: "inline-flex", background: "rgba(255,68,68,.1)", border: ".5px solid rgba(255,68,68,.22)", borderRadius: 10, padding: ".45rem .9rem" }}>
                  <div>
                    <p style={{ fontSize: 9, color: "rgba(255,100,100,.65)", marginBottom: 1, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>Estimated Revenue Leak</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#FF7B7B", margin: 0 }}>{results.estimatedRevenueLeak}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg,rgba(255,68,68,.06),rgba(255,68,68,.02))", border: ".5px solid rgba(255,68,68,.2)", borderRadius: 16, padding: "1.1rem 1.4rem", marginBottom: "1.2rem" }}>
            <p style={{ fontSize: 10, color: "#ff9999", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700, marginBottom: ".6rem" }}>🚨 Fix These First</p>
            {results.topPriorities?.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 9, marginBottom: i < results.topPriorities.length - 1 ? 6 : 0 }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, color: "#FF7B7B", flexShrink: 0, marginTop: 1 }}>{i+1}.</span>
                <p style={{ fontSize: 13, color: dark ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.65)", margin: 0, lineHeight: 1.5 }}>{p}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(255px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            {CHECKS.map(c => {
              const chk = results.checks?.[c.id];
              if (!chk) return null;
              return <CheckCard key={c.id} check={chk} label={c.label} icon={c.icon} dark={dark} cardBg={cardBg} cardBorder={cardBorder} mutedText={mutedText} headingColor={headingColor} trackBg={trackBg}/>;
            })}
          </div>

          <p style={{ fontSize: 11, color: dark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.25)", textAlign: "center", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Data from Google PageSpeed Insights API. Checkout & conversion scores inferred from technical signals.
          </p>

          <div style={{ background: "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 24, padding: "clamp(1.8rem,5vw,3rem)", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: G, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".6rem", fontWeight: 600 }}>Want us to fix all of this?</p>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.2rem,4vw,1.9rem)", fontWeight: 800, color: headingColor, marginBottom: ".6rem", lineHeight: 1.2 }}>
              This is just the surface.<br/><GradText>Our full audit goes 10x deeper.</GradText>
            </h3>
            <p style={{ fontSize: 14, color: mutedText, maxWidth: 460, margin: "0 auto 1.4rem", lineHeight: 1.7 }}>
              We don't just identify problems — we fix them. One system. Compounding results every month.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/contact" className="btn-g" style={{ display: "inline-block" }}>Apply for full professional audit →</Link>
              <button onClick={() => { setResults(null); setUrl(""); }} className="btn-ghost">Analyse another store</button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}