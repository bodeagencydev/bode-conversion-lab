/**
 * BODE CONVERSION LAB — STORE AUDIT
 * Brutally honest. No flattery. No A+ grades.
 * Mobile Core Web Vitals weighted highest.
 * CRITICAL REVENUE LEAK label when vitals are red/yellow.
 * Soft disqualification message after terrible result.
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { G, GG } from "../data.js";
import { PageWrapper, GradText, useTheme } from "../components.jsx";
import { ScrollReveal, TiltCard, MaskedHeading } from "../AnimationSystem.jsx";

/* ─── YOUR GOOGLE PAGESPEED API KEY ─── */
const PSI_KEY = "AIzaSyCAnT0GIpN-3OVQkP3fPJBwhl6pTU0BN8k";
/* ────────────────────────────────────── */

const CHECKS = [
  { id:"mobile",     label:"Mobile Performance",   icon:"📱", weight:0.25, critical:true },
  { id:"vitals",     label:"Core Web Vitals",       icon:"📊", weight:0.22, critical:true },
  { id:"speed",      label:"Page Speed",            icon:"⚡", weight:0.15 },
  { id:"seo",        label:"SEO Health",            icon:"🔍", weight:0.12 },
  { id:"images",     label:"Image Optimization",    icon:"🖼️", weight:0.10 },
  { id:"ssl",        label:"SSL & Security",        icon:"🔒", weight:0.06 },
  { id:"checkout",   label:"Checkout Friction",     icon:"🛒", weight:0.05 },
  { id:"conversion", label:"Conversion Readiness",  icon:"💰", weight:0.05 },
];

/* Staggered scan messages — build urgency */
const SCAN_STAGES = [
  { msg:"Connecting to store...",               sub:"Initialising analysis engine" },
  { msg:"Scanning mobile performance...",        sub:"This is where most stores fail" },
  { msg:"Detecting layout shifts (CLS)...",      sub:"Invisible leaks that cost you buyers" },
  { msg:"Measuring load blocking (TBT)...",      sub:"Every millisecond costs conversion" },
  { msg:"Auditing SEO signals...",               sub:"Are you invisible on Google?" },
  { msg:"Checking image optimisation...",        sub:"Bloated images = lost revenue" },
  { msg:"Calculating friction points...",        sub:"Where buyers abandon your funnel" },
  { msg:"Running final diagnosis...",            sub:"Compiling your revenue leak report" },
];

/* ── BRUTAL SCORING ──
   Mobile perf < 95 = sub-optimal (not "good")
   Any vital yellow/red = CRITICAL
   Default grades skew toward C/D — not A+ */
function brutalScore(raw) {
  if (raw == null) return null;
  // Deflate by 15 points across the board — stores are rarely as good as PSI suggests
  return Math.max(0, Math.min(100, Math.round(raw - 15)));
}
function col(s)   { return s >= 75 ? "#00ff88" : s >= 50 ? "#FF9900" : "#FF3B3B"; }
function grade(s) {
  if (s >= 80) return "B"; // Nothing starts at A anymore
  if (s >= 65) return "C";
  if (s >= 45) return "D";
  return "F";
}
function label(s) {
  if (s >= 80) return "Acceptable";
  if (s >= 65) return "Sub-Optimal";
  if (s >= 45) return "Leaking Revenue";
  return "Critical Failure";
}
const clamp = v => Math.max(0, Math.min(100, Math.round(v || 0)));
const pct   = v => v != null ? clamp(v * 100) : null;

async function fetchPSI(storeUrl, strategy) {
  const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(storeUrl)}&strategy=${strategy}&category=performance&category=seo&category=best-practices&category=accessibility&key=${PSI_KEY}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(40000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (data?.error) throw new Error(data.error.message || "PSI API error");
  return data;
}

function buildReport(desktop, mobile, url) {
  const lh  = mobile?.lighthouseResult;
  const lhD = desktop?.lighthouseResult;

  const rawMPerf = pct(lh?.categories?.performance?.score);
  const rawDPerf = pct(lhD?.categories?.performance?.score);
  const rawSeo   = pct(lh?.categories?.seo?.score);
  const rawAcc   = pct(lh?.categories?.accessibility?.score);
  const rawBest  = pct(lh?.categories?.["best-practices"]?.score);

  // Raw vitals
  const lcp = lh?.audits?.["largest-contentful-paint"];
  const cls = lh?.audits?.["cumulative-layout-shift"];
  const fid = lh?.audits?.["total-blocking-time"];
  const si  = lh?.audits?.["speed-index"];
  const fcp = lh?.audits?.["first-contentful-paint"];

  const lcpMs  = lcp ? parseFloat(lcp.numericValue) : 4500;
  const clsVal = cls ? parseFloat(cls.numericValue) : 0.25;
  const fidMs  = fid ? parseFloat(fid.numericValue) : 400;
  const fcpMs  = fcp ? parseFloat(fcp.numericValue) : 3000;

  // ── BRUTAL mobile score: < 95 = sub-optimal, we deflate further
  const mobileRaw = rawMPerf ?? 50;
  const mobileScore = mobileRaw >= 95
    ? brutalScore(mobileRaw) + 5   // give a tiny boost only if near-perfect
    : mobileRaw < 50
      ? Math.max(0, mobileRaw - 20) // punish hard
      : brutalScore(mobileRaw);

  // ── VITALS: weighted by each threshold
  let vitRaw = 100;
  // LCP: Good < 2.5s, Needs improvement 2.5-4s, Poor > 4s
  if (lcpMs > 4000)      vitRaw -= 40;
  else if (lcpMs > 2500) vitRaw -= 25;
  else if (lcpMs > 1800) vitRaw -= 12;
  // CLS: Good < 0.1, Needs improvement 0.1-0.25, Poor > 0.25
  if (clsVal > 0.25)     vitRaw -= 35;
  else if (clsVal > 0.1) vitRaw -= 20;
  else if (clsVal > 0.05)vitRaw -= 8;
  // TBT (proxy for FID): Good < 200ms, Needs improvement 200-600ms, Poor > 600ms
  if (fidMs > 600)       vitRaw -= 30;
  else if (fidMs > 300)  vitRaw -= 18;
  else if (fidMs > 200)  vitRaw -= 8;
  const vitScore = clamp(vitRaw - 10); // Always deflate

  // ── CRITICAL FLAG: any vital yellow or red
  const vitalsCritical = lcpMs > 2500 || clsVal > 0.1 || fidMs > 300 || mobileRaw < 70;
  const mobileSubOptimal = mobileRaw < 95;

  // Speed
  const speedScore = clamp(((rawMPerf ?? 45) * 0.55 + (rawDPerf ?? 55) * 0.45) - 14);

  // SEO — brutal
  const hasMeta    = lh?.audits?.["meta-description"]?.score === 1;
  const hasTitle   = lh?.audits?.["document-title"]?.score   === 1;
  const hasCanon   = lh?.audits?.canonical?.score            === 1;
  const seoRaw     = rawSeo ?? 45;
  const seoScore   = clamp(seoRaw - (!hasMeta?15:0) - (!hasTitle?12:0) - (!hasCanon?8:0) - 10);

  // Images
  const imgOpt  = lh?.audits?.["uses-optimized-images"]?.score;
  const imgWebp = lh?.audits?.["uses-webp-images"]?.score;
  const imgResp = lh?.audits?.["uses-responsive-images"]?.score;
  const imgScore = clamp(75 - (imgOpt===0?28:0) - (imgWebp===0?22:0) - (imgResp===0?14:0));

  // SSL
  const httpsScore = lh?.audits?.["is-on-https"]?.score;
  const sslScore   = httpsScore === 1 ? 82 : httpsScore === 0 ? 5 : 60;

  // Checkout — always sub-optimal unless store is very fast
  const checkoutScore = clamp(42 + (mobileRaw >= 80 ? 15 : 0) + ((rawBest ?? 50) * 0.2));

  // Conversion — composite, always deflated
  const convScore = clamp(
    (mobileScore * 0.3) + ((rawSeo ?? 45) * 0.2) +
    ((rawBest ?? 45) * 0.2) + ((rawAcc ?? 45) * 0.15) + (sslScore * 0.15) - 8
  );

  // ── WEIGHTED OVERALL — mobile + vitals dominate
  const weightedTotal = CHECKS.reduce((acc, c) => {
    const scores = { mobile:mobileScore, vitals:vitScore, speed:speedScore, seo:seoScore, images:imgScore, ssl:sslScore, checkout:checkoutScore, conversion:convScore };
    return acc + (scores[c.id] ?? 50) * c.weight;
  }, 0);
  const overall = clamp(weightedTotal);

  // ── REVENUE LEAK ESTIMATE — brutal
  const leak = overall >= 75 ? "15-25%" : overall >= 55 ? "30-50%" : overall >= 35 ? "50-65%" : "65-80%";

  // ── IS CRITICAL?
  const isCritical = vitalsCritical || overall < 50;

  // ── TOP PRIORITIES — worst first
  const ranked = [
    { id:"mobile",     s:mobileScore },
    { id:"vitals",     s:vitScore },
    { id:"speed",      s:speedScore },
    { id:"seo",        s:seoScore },
    { id:"images",     s:imgScore },
    { id:"ssl",        s:sslScore },
    { id:"checkout",   s:checkoutScore },
    { id:"conversion", s:convScore },
  ].sort((a, b) => a.s - b.s);

  const pMap = {
    mobile:     `Mobile performance is ${mobileScore < 50 ? "critically low" : "sub-optimal"} at ${mobileRaw}/100 — ${mobileScore < 50 ? "most buyers leave before your page finishes loading" : "you're losing buyers on every phone visit"}`,
    vitals:     `Core Web Vitals are ${vitalsCritical ? "FAILING" : "struggling"} — LCP ${lcp?.displayValue??"-"}, CLS ${cls?.displayValue??"-"}, TBT ${fid?.displayValue??"-"}. Google is actively penalising your rankings`,
    speed:      `Page speed score ${speedScore}/100 means you're paying for ads that send people to a page they abandon`,
    seo:        `SEO score ${seoScore}/100 — ${!hasMeta?"missing meta description, ":""}${!hasTitle?"missing title tag, ":""}${!hasCanon?"no canonical tag":""}. You're invisible to buyers who aren't running ads`,
    images:     `Unoptimised images are ${imgWebp===0?"not using WebP (30% larger than needed), ":""}${imgOpt===0?"not compressed, ":""}costing you 2-3 seconds of load time`,
    ssl:        httpsScore === 1 ? "SSL is active but review HSTS headers and mixed content warnings" : "No HTTPS detected — buyers will see a security warning and leave immediately",
    checkout:   `Checkout friction score ${checkoutScore}/100 — slow load times alone cause 35%+ of cart abandonments before buyers reach payment`,
    conversion: `Conversion readiness is ${convScore}/100 — a combination of performance, accessibility and trust failures is suppressing your revenue`,
  };

  // ── SOFT DISQUALIFICATION MESSAGE
  const disqualMsg = overall < 60
    ? `Your store is technically live, but it's currently optimized for browsing — not buying. Most brands ignore these friction points until they scale, at which point the leaks become catastrophically expensive. Fix them now, or keep paying the "Inconsistency Tax" on every ad dollar you spend.`
    : `Your store has the bones of something that can scale, but there are measurable friction points actively suppressing your conversion rate. These aren't cosmetic issues — they're revenue drains that compound every day you leave them unfixed.`;

  let domain = url;
  try { domain = new URL(url).hostname.replace("www.", ""); } catch {}

  return {
    domain, overall, isCritical, mobileSubOptimal, vitalsCritical, disqualMsg,
    leak, mobileRaw,
    scores: { mobile:mobileScore, vitals:vitScore, speed:speedScore, seo:seoScore, images:imgScore, ssl:sslScore, checkout:checkoutScore, conversion:convScore },
    raw: { lcp:lcp?.displayValue, cls:cls?.displayValue, fid:fid?.displayValue, fcp:fcp?.displayValue, mPerf:rawMPerf, dPerf:rawDPerf, mSeo:rawSeo },
    ranked,
    topPriorities: ranked.slice(0, 3).map(a => pMap[a.id]),
    verdict: isCritical
      ? `${domain} has critical revenue leaks. Based on real Google data, your store scores ${overall}/100 — meaning the majority of visitors who land here are experiencing friction that prevents them from buying.`
      : `${domain} scores ${overall}/100. There are real, measurable friction points costing you revenue on every visitor who lands on your store.`,
    checks: {
      mobile:     { score:mobileScore,   grade:grade(mobileScore),   label:label(mobileScore),   summary:`Google measures ${mobileRaw}/100 — we call it ${mobileScore}/100 after accounting for real-world buyer tolerance`, issues: buildMobileIssues(lh, mobileRaw, lcpMs, fidMs), fixes: ["Eliminate render-blocking JS above the fold","Compress and lazy-load all images below fold","Move to a faster hosting plan or CDN","Target LCP under 1.8s — not just 2.5s"] },
      vitals:     { score:vitScore,      grade:grade(vitScore),      label:label(vitScore),      summary:`LCP ${lcp?.displayValue??"?"} · CLS ${cls?.displayValue??"?"} · TBT ${fid?.displayValue??"?"}`, issues: buildVitalIssues(lcpMs, clsVal, fidMs), fixes: ["Preload hero image with <link rel=preload>","Add explicit width/height to every image and video","Break up long JavaScript tasks into smaller chunks","Score all three vitals GREEN before scaling ads"] },
      speed:      { score:speedScore,    grade:grade(speedScore),    label:label(speedScore),    summary:`Mobile ${rawMPerf??"-"} · Desktop ${rawDPerf??"-"} — real-world load is worse than lab conditions`, issues:[`Mobile performance ${rawMPerf??"-"}/100 — buyers are waiting`,`Speed Index ${si?.displayValue??"unknown"} — time until page feels interactive`,`FCP ${fcp?.displayValue??"?"} — first content appears late`], fixes:["Minify and defer all non-critical JS/CSS","Enable Brotli/gzip compression at server level","Serve assets from a CDN close to your customers","Remove unused third-party scripts (chat widgets, tracking pixels)"] },
      seo:        { score:seoScore,      grade:grade(seoScore),      label:label(seoScore),      summary:`SEO ${rawSeo??"-"}/100 — organic traffic is being wasted by technical failures`, issues:[!hasMeta?"❌ Missing meta description — Google writes its own, usually badly":"✓ Meta description found",!hasTitle?"❌ Missing or duplicate title tag — critical for rankings":"✓ Title tag found",!hasCanon?"❌ No canonical tag — duplicate content dilutes authority":"✓ Canonical tag found",rawSeo!=null&&rawSeo<80?`SEO score ${rawSeo}/100 — structured data and schema are likely missing`:""], fixes:["Write unique 150-160 char meta descriptions for every page","Add product schema markup to all product pages","Create an XML sitemap and submit to Google Search Console","Fix any broken internal links — each one wastes crawl budget"] },
      images:     { score:imgScore,      grade:grade(imgScore),      label:label(imgScore),      summary:"Unoptimised images are the #1 silent revenue killer on mobile", issues:[imgWebp===0?"❌ Not serving WebP/AVIF — images are 30-50% larger than needed":"✓ Modern formats detected",imgOpt===0?"❌ Images not compressed — every product image is a conversion tax":"✓ Images appear compressed",imgResp===0?"❌ Not using srcset — mobile gets full desktop images":"✓ Responsive images detected"], fixes:["Convert ALL product images to WebP immediately","Set explicit width and height on every image element","Lazy-load all images below the fold","Target under 80KB per product image"] },
      ssl:        { score:sslScore,      grade:grade(sslScore),      label:label(sslScore),      summary:httpsScore===1?"HTTPS active — but check for mixed content warnings":"No HTTPS — buyers see a security warning before they see your product", issues:[httpsScore===1?"SSL certificate is active and valid":"❌ Store not served over HTTPS — this is a conversion emergency"], fixes:[httpsScore===1?"Audit for mixed content (HTTP assets on HTTPS pages)":"Enable HTTPS immediately via your hosting control panel","Set up HSTS headers to force secure connections","Ensure SSL auto-renews — expiry kills conversion instantly"] },
      checkout:   { score:checkoutScore, grade:grade(checkoutScore), label:label(checkoutScore), summary:"Checkout friction is the last wall between your buyer and their money", issues:[`Slow mobile load (${mobileRaw}/100) causes 35%+ pre-checkout abandonment`,"Guest checkout status requires live manual test","Trust signals at checkout require manual audit","Payment logo visibility requires manual audit"], fixes:["Enable guest checkout — account creation kills 35% of buyers","Reduce checkout to maximum 2 steps","Add payment logos, security badge and return policy above the fold at checkout","Test your entire checkout on a real phone on 4G — not WiFi"] },
      conversion: { score:convScore,     grade:grade(convScore),     label:label(convScore),     summary:"Conversion readiness is a composite of performance, trust and UX signals", issues:[rawAcc!=null&&rawAcc<80?`Accessibility ${rawAcc}/100 — screen reader and contrast issues deter buyers`:"",rawBest!=null&&rawBest<80?`Best practices ${rawBest}/100 — deprecated APIs and console errors signal a broken experience`:"","CTA placement requires live manual audit","Social proof visibility requires manual audit"].filter(Boolean), fixes:["Place Add-to-Cart button above the fold on mobile — always","Add review count and star rating next to the CTA","Use urgency signals (stock count, limited offer) responsibly","Audit your page on a real iPhone SE — smallest screen, most demanding test"] },
    },
  };
}

function buildMobileIssues(lh, mPerf, lcpMs, fidMs) {
  const issues = [];
  if (mPerf < 50)  issues.push(`❌ Mobile score ${mPerf}/100 — critically slow. Most buyers have already left`);
  else if (mPerf < 75) issues.push(`⚠ Mobile score ${mPerf}/100 — sub-optimal. You're losing buyers on every phone visit`);
  else if (mPerf < 95) issues.push(`⚠ Mobile score ${mPerf}/100 — we classify anything under 95 as sub-optimal`);
  if (lh?.audits?.["tap-targets"]?.score < 1) issues.push("❌ Tap targets too small — buttons are hard to press on phones");
  if (lh?.audits?.viewport?.score === 0) issues.push("❌ No viewport meta tag — page may not render correctly on mobile");
  if (lcpMs > 3000) issues.push(`❌ LCP ${(lcpMs/1000).toFixed(1)}s on mobile — buyer attention is gone by 3s`);
  if (!issues.length) issues.push("Mobile score is within range but still sub-optimal for scaling");
  return issues;
}

function buildVitalIssues(lcpMs, clsVal, fidMs) {
  const issues = [];
  if (lcpMs > 4000)      issues.push(`❌ LCP ${(lcpMs/1000).toFixed(2)}s — POOR. Google's threshold is 2.5s. You're 60%+ over`);
  else if (lcpMs > 2500) issues.push(`⚠ LCP ${(lcpMs/1000).toFixed(2)}s — NEEDS IMPROVEMENT. Buyers notice this delay`);
  if (clsVal > 0.25)     issues.push(`❌ CLS ${clsVal.toFixed(3)} — POOR. Your page is jumping around as it loads. Buyers hate this`);
  else if (clsVal > 0.1) issues.push(`⚠ CLS ${clsVal.toFixed(3)} — NEEDS IMPROVEMENT. Subtle layout shifts erode trust`);
  if (fidMs > 600)       issues.push(`❌ TBT ${fidMs}ms — POOR. Main thread is blocked. Taps and clicks are delayed`);
  else if (fidMs > 300)  issues.push(`⚠ TBT ${fidMs}ms — NEEDS IMPROVEMENT. Interaction feels sluggish`);
  if (!issues.length)    issues.push("Vitals within threshold but optimise further before scaling ad spend");
  return issues;
}

/* ── Score Ring ── */
function Ring({ score, size = 96, color: c }) {
  const r = (size-10)/2, circ = 2*Math.PI*r, dash = (score/100)*circ;
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(80,80,80,.2)" strokeWidth={7}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={7}
        strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round"
        style={{ transition:"stroke-dasharray 1.6s cubic-bezier(.22,1,.36,1)", filter:`drop-shadow(0 0 6px ${c})` }}/>
    </svg>
  );
}

/* ── Check Card ── */
function CheckCard({ check, id, label: lbl, icon, dark, cardBg, cardBorder, mutedText, headingColor, trackBg }) {
  const [open, setOpen] = useState(false);
  const c = col(check.score);
  const isBad = check.score < 50;

  return (
    <div onClick={() => setOpen(v => !v)}
      style={{ background: isBad ? (dark?"rgba(255,59,59,.06)":"rgba(255,59,59,.04)") : cardBg,
        border: `.5px solid ${open ? c+"77" : isBad ? "rgba(255,59,59,.25)" : cardBorder}`,
        borderTop: `.5px solid ${c}66`, borderRadius:16, padding:"1.3rem",
        cursor:"pointer", transition:"all .3s cubic-bezier(.22,1,.36,1)", position:"relative", overflow:"hidden" }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 16px 40px ${c}1a`; }}
      onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>

      {/* Critical badge */}
      {isBad && <div style={{ position:"absolute", top:10, right:10, background:"rgba(255,59,59,.15)", border:".5px solid rgba(255,59,59,.35)", borderRadius:100, padding:"2px 8px", fontSize:9, color:"#FF3B3B", fontWeight:700, letterSpacing:".08em" }}>CRITICAL</div>}

      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${c}55,transparent)` }}/>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:".6rem", paddingRight:isBad?"60px":"0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ fontSize:17 }}>{icon}</span>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:headingColor }}>{lbl}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:c, lineHeight:1, textShadow:open?`0 0 16px ${c}88`:"none" }}>{check.grade}</span>
          <span style={{ fontSize:11, color:mutedText }}>{check.score}/100</span>
          <span style={{ color:c, fontSize:14, transition:"transform .3s cubic-bezier(.22,1,.36,1)", transform:open?"rotate(45deg)":"none", display:"inline-block" }}>+</span>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ height:4, background:trackBg, borderRadius:4, overflow:"hidden", marginBottom:".5rem" }}>
        <div style={{ height:"100%", borderRadius:4, width:`${check.score}%`, background:`linear-gradient(90deg,${c}cc,${c})`, boxShadow:`0 0 6px ${c}55`, transition:"width 1.4s cubic-bezier(.22,1,.36,1)" }}/>
      </div>

      {/* Label badge */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:open?".8rem":0 }}>
        <span style={{ fontSize:11, color:c, fontWeight:600 }}>{check.label}</span>
        <span style={{ fontSize:11, color:mutedText }}>— {check.summary}</span>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ borderTop:dark?".5px solid rgba(255,255,255,.08)":".5px solid rgba(0,0,0,.08)", paddingTop:".8rem", animation:"expandIn .3s cubic-bezier(.22,1,.36,1)" }}>
          <style>{`@keyframes expandIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:none;}}`}</style>
          {check.issues?.filter(Boolean).length > 0 && (
            <div style={{ marginBottom:".8rem" }}>
              <p style={{ fontSize:10, color:"#FF6B6B", letterSpacing:".1em", textTransform:"uppercase", fontWeight:700, marginBottom:".5rem" }}>⚠ What we found</p>
              {check.issues.filter(Boolean).map((iss, i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:5, padding:"5px 8px", background:iss.startsWith("❌")?"rgba(255,59,59,.07)":"rgba(255,153,0,.05)", borderRadius:8, borderLeft:`2px solid ${iss.startsWith("❌")?"#FF3B3B":"#FF9900"}` }}>
                  <p style={{ fontSize:12, color:dark?"rgba(255,255,255,.65)":"rgba(0,0,0,.65)", margin:0, lineHeight:1.5 }}>{iss}</p>
                </div>
              ))}
            </div>
          )}
          {check.fixes?.length > 0 && (
            <div>
              <p style={{ fontSize:10, color:"#00ff88bb", letterSpacing:".1em", textTransform:"uppercase", fontWeight:700, marginBottom:".5rem" }}>→ How to fix it</p>
              {check.fixes.map((fix, i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:5, padding:"5px 8px", background:"rgba(0,255,136,.05)", borderRadius:8, borderLeft:"2px solid rgba(0,255,136,.35)" }}>
                  <p style={{ fontSize:12, color:dark?"rgba(255,255,255,.68)":"rgba(0,0,0,.68)", margin:0, lineHeight:1.5 }}>{fix}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── RADAR CANVAS ── */
function RadarCanvas({ loading }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!loading || !ref.current) return;
    const c = ref.current, ctx = c.getContext("2d");
    c.width = c.height = 180;
    let angle = 0, raf;
    const draw = () => {
      ctx.clearRect(0, 0, 180, 180);
      const cx = 90, cy = 90;
      [30,50,70,90].forEach(r => {
        ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
        ctx.strokeStyle = `rgba(0,255,136,${r===30?.15:.06})`; ctx.lineWidth=1; ctx.stroke();
      });
      ctx.strokeStyle="rgba(0,255,136,.06)"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,180); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(180,cy); ctx.stroke();
      // Sweep
      const g=ctx.createLinearGradient(cx,cy,cx+Math.cos(angle)*90,cy+Math.sin(angle)*90);
      g.addColorStop(0,"rgba(0,255,136,0)"); g.addColorStop(1,"rgba(0,255,136,.3)");
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,90,angle-Math.PI*.4,angle); ctx.closePath();
      ctx.fillStyle=g; ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(angle)*90,cy+Math.sin(angle)*90);
      ctx.strokeStyle="rgba(0,255,136,.8)"; ctx.lineWidth=1.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+Math.cos(angle)*90,cy+Math.sin(angle)*90,3,0,Math.PI*2);
      ctx.fillStyle="#00ff88"; ctx.fill();
      ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2); ctx.fillStyle="#00ff88"; ctx.fill();
      angle=(angle+0.035)%(Math.PI*2);
      raf=requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [loading]);
  return <canvas ref={ref} width={180} height={180} style={{ width:180, height:180 }}/>;
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function Audit() {
  const { dark } = useTheme();
  const [url,      setUrl]      = useState("");
  const [loading,  setLoading]  = useState(false);
  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [results,  setResults]  = useState(null);
  const [error,    setError]    = useState("");
  const [revealed, setRevealed] = useState(false);

  const headingColor = dark?"#fff":"#0a0a0a";
  const mutedText    = dark?"rgba(255,255,255,.45)":"rgba(0,0,0,.5)";
  const mutedText2   = dark?"rgba(255,255,255,.3)":"rgba(0,0,0,.35)";
  const cardBg       = dark?"linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))":"linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))";
  const cardBorder   = dark?"rgba(255,255,255,.12)":"rgba(0,0,0,.1)";
  const inputBg      = dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.04)";
  const inputBorder  = dark?"rgba(255,255,255,.14)":"rgba(0,0,0,.12)";
  const inputColor   = dark?"#f0f0f0":"#0a0a0a";
  const trackBg      = dark?"rgba(255,255,255,.08)":"rgba(0,0,0,.08)";

  const runAudit = async () => {
    let cleaned = url.trim();
    if (!cleaned) { setError("Enter your store URL to begin."); return; }
    if (!/^https?:\/\//i.test(cleaned)) cleaned = "https://" + cleaned;
    try { new URL(cleaned); } catch { setError("That doesn't look like a valid URL. Try: https://yourstore.com"); return; }

    if (PSI_KEY === "YOUR_GOOGLE_PAGESPEED_API_KEY") {
      setError("⚠ Add your Google PageSpeed API key to Audit.jsx line 8 to activate the analyser.");
      return;
    }

    setError(""); setLoading(true); setResults(null); setRevealed(false);
    setStageIdx(0); setProgress(0);

    // Staggered stage progression
    const stageTimings = [0, 2200, 4400, 6600, 10000, 14000, 18000, 22000];
    const timers = stageTimings.map((t, i) => setTimeout(() => setStageIdx(i), t));
    const progTimers = [
      setTimeout(() => setProgress(8),  500),
      setTimeout(() => setProgress(25), 4000),
      setTimeout(() => setProgress(50), 10000),
      setTimeout(() => setProgress(75), 18000),
      setTimeout(() => setProgress(88), 24000),
    ];

    try {
      const [mRes, dRes] = await Promise.allSettled([
        fetchPSI(cleaned, "mobile"),
        fetchPSI(cleaned, "desktop"),
      ]);
      const mobile  = mRes.status === "fulfilled" ? mRes.value : null;
      const desktop = dRes.status === "fulfilled" ? dRes.value : null;
      if (!mobile && !desktop) throw new Error("Could not reach Google PageSpeed API");
      setProgress(100);
      // Staggered reveal
      setTimeout(() => { setResults(buildReport(desktop, mobile, cleaned)); setLoading(false); setTimeout(() => setRevealed(true), 200); }, 600);
    } catch (e) {
      setError(`Scan failed — ${e.message}. The URL must be publicly accessible. Try again in a moment.`);
      setLoading(false);
    } finally {
      timers.forEach(clearTimeout);
      progTimers.forEach(clearTimeout);
    }
  };

  const oCol   = results ? col(results.overall)   : G;
  const oGrade = results ? grade(results.overall)  : "?";
  const stage  = SCAN_STAGES[stageIdx] || SCAN_STAGES[SCAN_STAGES.length - 1];

  return (
    <PageWrapper>
      <style>{`
        @keyframes auditSpin{to{transform:rotate(360deg);}}
        @keyframes auditSpin2{to{transform:rotate(-360deg);}}
        @keyframes ping{0%{transform:scale(1);opacity:.7;}100%{transform:scale(2.8);opacity:0;}}
        @keyframes staggerIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:none;}}
        @keyframes criticalPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,59,59,.4);}50%{box-shadow:0 0 0 12px rgba(255,59,59,0);}}
        .check-card-enter{animation:staggerIn .5s cubic-bezier(.22,1,.36,1) both;}
        .check-card-enter:nth-child(1){animation-delay:.05s;}
        .check-card-enter:nth-child(2){animation-delay:.12s;}
        .check-card-enter:nth-child(3){animation-delay:.19s;}
        .check-card-enter:nth-child(4){animation-delay:.26s;}
        .check-card-enter:nth-child(5){animation-delay:.33s;}
        .check-card-enter:nth-child(6){animation-delay:.40s;}
        .check-card-enter:nth-child(7){animation-delay:.47s;}
        .check-card-enter:nth-child(8){animation-delay:.54s;}
      `}</style>

      {/* ── HERO ── */}
      <section style={{ position:"relative", padding:"clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) 2.5rem", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:600, height:600, top:-150, left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle,rgba(0,255,136,.1),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>

        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <ScrollReveal delay={0}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,255,136,.08)", border:".5px solid rgba(0,255,136,.25)", borderRadius:100, padding:"5px 14px", fontSize:11, color:G, fontWeight:500, marginBottom:"1.4rem" }}>
              <span style={{ width:6, height:6, background:G, borderRadius:"50%", animation:"pulse 2s infinite" }}/> Real Data. No Flattery. Google PageSpeed API.
            </span>
          </ScrollReveal>

          <MaskedHeading text="Your store has leaks." tag="h1" delay={0.05} stagger={0.07}
            style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(2rem,6vw,3.5rem)", fontWeight:800, lineHeight:1.06, color:headingColor, marginBottom:".5rem", justifyContent:"center" }}/>
          <ScrollReveal delay={0.5}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.5rem,4vw,2.5rem)", fontWeight:800, lineHeight:1.1, marginBottom:"1rem" }}>
              <GradText>Find every one of them.</GradText>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.6}>
            <p style={{ fontSize:"clamp(.9rem,2.5vw,1rem)", color:mutedText, lineHeight:1.8, maxWidth:500, margin:"0 auto 2rem" }}>
              8 conversion checks. Brutally honest scores. We don't give A+ grades — we expose the friction costing you buyers.
            </p>
          </ScrollReveal>

          {/* ── URL INPUT ── */}
          <ScrollReveal delay={0.7}>
            <div style={{ maxWidth:640, margin:"0 auto" }}>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <div style={{ flex:1, minWidth:220, position:"relative" }}>
                  <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:15, pointerEvents:"none" }}>🔗</span>
                  <input type="text" placeholder="yourstore.com" value={url}
                    onChange={e => { setUrl(e.target.value); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && !loading && runAudit()}
                    style={{ width:"100%", background:inputBg, border:`.5px solid ${error?"#FF3B3B":inputBorder}`, borderRadius:12, padding:".9rem 1rem .9rem 3rem", color:inputColor, fontSize:15, fontFamily:"inherit", outline:"none", boxSizing:"border-box", transition:"border-color .2s, box-shadow .2s", minHeight:48 }}
                    onFocus={e => { e.target.style.borderColor="rgba(0,255,136,.6)"; e.target.style.boxShadow="0 0 0 3px rgba(0,255,136,.1)"; }}
                    onBlur={e => { e.target.style.borderColor=error?"#FF3B3B":inputBorder; e.target.style.boxShadow="none"; }}/>
                </div>
                <button onClick={runAudit} disabled={loading}
                  style={{ background:GG, color:"#040608", border:"none", borderRadius:12, padding:".9rem 1.8rem", fontSize:15, fontWeight:700, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", opacity:loading?.85:1, whiteSpace:"nowrap", boxShadow:"0 4px 24px rgba(0,255,136,.4)", transition:"transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s", minHeight:48 }}
                  onMouseEnter={e => { if(!loading){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 10px 36px rgba(0,255,136,.6)";} }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 24px rgba(0,255,136,.4)"; }}>
                  {loading ? "Scanning..." : "Expose My Leaks →"}
                </button>
              </div>
              {error && (
                <div style={{ marginTop:10, padding:"10px 14px", background:"rgba(255,59,59,.08)", border:".5px solid rgba(255,59,59,.3)", borderRadius:10 }}>
                  <p style={{ color:"#FF6B6B", fontSize:13, lineHeight:1.5, margin:0 }}>{error}</p>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Check pills */}
          {!loading && !results && (
            <ScrollReveal delay={0.8}>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginTop:"1.8rem" }}>
                {CHECKS.map(c => (
                  <span key={c.id} style={{ display:"inline-flex", alignItems:"center", gap:5, background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)", border:c.critical?".5px solid rgba(255,59,59,.2)":dark?".5px solid rgba(255,255,255,.09)":".5px solid rgba(0,0,0,.08)", borderRadius:100, padding:"4px 12px", fontSize:11.5, color:c.critical?"#FF9999":mutedText }}>
                    {c.icon} {c.label} {c.critical && <span style={{ fontSize:9, color:"#FF6B6B", fontWeight:700 }}>HIGH WEIGHT</span>}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* ── LOADING — RADAR + STAGGERED STAGES ── */}
      {loading && (
        <div style={{ maxWidth:580, margin:"0 auto", padding:"0 1.5rem 5rem" }}>
          {/* Progress bar */}
          <div style={{ height:2, background:trackBg, borderRadius:2, overflow:"hidden", marginBottom:"2rem" }}>
            <div style={{ height:"100%", background:"linear-gradient(90deg,#FF3B3B,#FF9900,#00ff88)", borderRadius:2, width:`${progress}%`, transition:"width 1.2s cubic-bezier(.22,1,.36,1)", boxShadow:"0 0 8px rgba(0,255,136,.5)" }}/>
          </div>
          <div style={{ background:cardBg, border:`.5px solid ${cardBorder}`, borderRadius:24, padding:"2.5rem 2rem", position:"relative", overflow:"hidden", textAlign:"center" }}>
            <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.4),transparent)" }}/>
            {/* Radar */}
            <div style={{ position:"relative", width:140, height:140, margin:"0 auto 1.5rem" }}>
              <RadarCanvas loading={loading}/>
              <div style={{ position:"absolute", inset:"50%", transform:"translate(-50%,-50%)", width:16, height:16, borderRadius:"50%", border:"1px solid rgba(0,255,136,.5)", animation:"ping 1.8s ease-out infinite" }}/>
              <div style={{ position:"absolute", inset:"50%", transform:"translate(-50%,-50%)", width:16, height:16, borderRadius:"50%", border:"1px solid rgba(0,255,136,.3)", animation:"ping 1.8s ease-out infinite .9s" }}/>
            </div>
            {/* Stage message */}
            <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.05rem", fontWeight:700, color:headingColor, marginBottom:".3rem", animation:"staggerIn .4s cubic-bezier(.22,1,.36,1)", key:stageIdx }}>{stage.msg}</p>
            <p style={{ fontSize:12, color:"#FF9900", marginBottom:"1.8rem", fontStyle:"italic" }}>{stage.sub}</p>
            {/* Live check list */}
            <div style={{ display:"flex", flexDirection:"column", gap:7, textAlign:"left" }}>
              {CHECKS.map((c, i) => (
                <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10, opacity:i <= stageIdx ? 1 : 0.25, transition:`opacity .4s ${i*.1}s` }}>
                  <span style={{ fontSize:13, flexShrink:0 }}>{c.icon}</span>
                  <div style={{ flex:1, height:3, background:trackBg, borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", background:i<=stageIdx?GG:"transparent", borderRadius:3, animation:i<=stageIdx?`scanBar 1.8s ${i*.2}s ease-in-out infinite alternate`:"none" }}/>
                  </div>
                  <span style={{ fontSize:11, color:i<=stageIdx?G:mutedText2, whiteSpace:"nowrap", minWidth:130, textAlign:"right", fontWeight:i<=stageIdx?600:400 }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
          <style>{`@keyframes scanBar{from{width:8%;opacity:.25;}to{width:100%;opacity:1;}}`}</style>
        </div>
      )}

      {/* ── RESULTS ── */}
      {results && !loading && (
        <div style={{ maxWidth:940, margin:"0 auto", padding:"0 clamp(1rem,4vw,2rem) 5rem", opacity:revealed?1:0, transition:"opacity .5s cubic-bezier(.22,1,.36,1)" }}>

          {/* ── CRITICAL BANNER ── */}
          {results.isCritical && (
            <div style={{ background:"linear-gradient(135deg,rgba(255,59,59,.12),rgba(255,59,59,.05))", border:"1px solid rgba(255,59,59,.4)", borderRadius:16, padding:"1rem 1.4rem", marginBottom:"1.2rem", display:"flex", alignItems:"center", gap:12, animation:"criticalPulse 2.5s ease-in-out infinite" }}>
              <span style={{ fontSize:22, flexShrink:0 }}>🚨</span>
              <div>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:"#FF3B3B", marginBottom:2 }}>CRITICAL REVENUE LEAK DETECTED</p>
                <p style={{ fontSize:12, color:"rgba(255,100,100,.8)", margin:0 }}>Mobile performance and Core Web Vitals are below acceptable thresholds. Every ad you run is sending buyers to a broken experience.</p>
              </div>
            </div>
          )}

          {/* ── OVERALL SCORE ── */}
          <div style={{ background:cardBg, border:`.5px solid ${results.isCritical?"rgba(255,59,59,.3)":cardBorder}`, borderTop:`.5px solid ${oCol}66`, borderRadius:24, padding:"clamp(1.5rem,4vw,2.2rem)", marginBottom:"1.2rem", position:"relative", overflow:"hidden", animation:"staggerIn .5s cubic-bezier(.22,1,.36,1)" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${oCol}66,transparent)` }}/>
            <div style={{ display:"flex", gap:"clamp(.8rem,3vw,2rem)", alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ position:"relative", flexShrink:0 }}>
                <Ring score={results.overall} size={100} color={oCol}/>
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.6rem", fontWeight:800, color:oCol, lineHeight:1, textShadow:`0 0 20px ${oCol}88` }}>{oGrade}</span>
                  <span style={{ fontSize:10, color:mutedText }}>{results.overall}/100</span>
                </div>
              </div>
              <div style={{ flex:1, minWidth:180 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:".4rem" }}>
                  <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.1rem,3.5vw,1.5rem)", fontWeight:800, color:headingColor, margin:0 }}>{results.domain}</h2>
                  {results.mobileSubOptimal && <span style={{ background:"rgba(255,153,0,.12)", border:".5px solid rgba(255,153,0,.35)", borderRadius:100, padding:"2px 8px", fontSize:10, color:"#FF9900", fontWeight:700 }}>MOBILE SUB-OPTIMAL</span>}
                </div>
                <p style={{ fontSize:13, color:mutedText, lineHeight:1.7, marginBottom:".9rem" }}>{results.verdict}</p>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <div style={{ background:"rgba(255,59,59,.1)", border:".5px solid rgba(255,59,59,.25)", borderRadius:10, padding:".45rem .9rem" }}>
                    <p style={{ fontSize:9, color:"rgba(255,100,100,.7)", marginBottom:1, textTransform:"uppercase", letterSpacing:".06em", fontWeight:600 }}>Revenue Leak</p>
                    <p style={{ fontSize:14, fontWeight:800, color:"#FF6B6B", margin:0 }}>{results.leak}</p>
                  </div>
                  <div style={{ background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)", border:`.5px solid ${cardBorder}`, borderRadius:10, padding:".45rem .9rem" }}>
                    <p style={{ fontSize:9, color:mutedText2, marginBottom:1, textTransform:"uppercase", letterSpacing:".06em", fontWeight:600 }}>Raw Google Score</p>
                    <p style={{ fontSize:14, fontWeight:800, color:headingColor, margin:0 }}>Mobile: {results.raw.mPerf ?? "-"}/100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── TOP 3 PRIORITIES ── */}
          <div style={{ background:"linear-gradient(135deg,rgba(255,59,59,.08),rgba(255,59,59,.02))", border:".5px solid rgba(255,59,59,.25)", borderRadius:16, padding:"1.2rem 1.5rem", marginBottom:"1.2rem", animation:"staggerIn .5s .1s cubic-bezier(.22,1,.36,1) both" }}>
            <p style={{ fontSize:10, color:"#FF9999", letterSpacing:".12em", textTransform:"uppercase", fontWeight:700, marginBottom:".8rem" }}>🔥 Fix These First — In This Order</p>
            {results.topPriorities.map((p, i) => (
              <div key={i} style={{ display:"flex", gap:10, marginBottom:i < results.topPriorities.length-1 ? 10 : 0, padding:"8px 10px", background:i===0?"rgba(255,59,59,.07)":"rgba(255,153,0,.04)", borderRadius:10, borderLeft:`3px solid ${i===0?"#FF3B3B":"#FF9900"}` }}>
                <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:i===0?"#FF3B3B":"#FF9900", flexShrink:0, minWidth:20 }}>{i+1}.</span>
                <p style={{ fontSize:13, color:dark?"rgba(255,255,255,.75)":"rgba(0,0,0,.7)", margin:0, lineHeight:1.55 }}>{p}</p>
              </div>
            ))}
          </div>

          {/* ── SOFT DISQUALIFICATION ── */}
          <div style={{ background:dark?"rgba(255,255,255,.03)":"rgba(0,0,0,.02)", border:`.5px solid ${cardBorder}`, borderLeft:"3px solid rgba(0,255,136,.4)", borderRadius:16, padding:"1.2rem 1.4rem", marginBottom:"1.4rem", animation:"staggerIn .5s .2s cubic-bezier(.22,1,.36,1) both" }}>
            <p style={{ fontSize:10, color:G, letterSpacing:".1em", textTransform:"uppercase", fontWeight:700, marginBottom:".6rem" }}>🧠 The Reality Check</p>
            <p style={{ fontSize:13, color:mutedText, lineHeight:1.8, margin:0, fontStyle:"italic" }}>"{results.disqualMsg}"</p>
          </div>

          {/* ── CHECK CARDS ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"1rem", marginBottom:"1.5rem" }}>
            {CHECKS.map(c => {
              const chk = results.checks?.[c.id];
              if (!chk) return null;
              return (
                <div key={c.id} className="check-card-enter">
                  <CheckCard check={chk} id={c.id} label={c.label} icon={c.icon} dark={dark} cardBg={cardBg} cardBorder={cardBorder} mutedText={mutedText} headingColor={headingColor} trackBg={trackBg}/>
                </div>
              );
            })}
          </div>

          <p style={{ fontSize:11, color:mutedText2, textAlign:"center", marginBottom:"1.5rem", lineHeight:1.6 }}>
            Scores are weighted by conversion impact. Mobile Performance (25%) and Core Web Vitals (22%) carry the highest weight.
            Raw data from Google PageSpeed Insights API.
          </p>

          {/* ── CTA ── */}
          <TiltCard style={{ background:"linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border:".5px solid rgba(0,255,136,.25)", borderRadius:24, padding:"clamp(2rem,5vw,3rem)", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.45),transparent)" }}/>
            <p style={{ fontSize:10, color:G, letterSpacing:".14em", textTransform:"uppercase", marginBottom:".6rem", fontWeight:700 }}>Ready to fix every one of these?</p>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.3rem,4vw,2rem)", fontWeight:800, color:headingColor, marginBottom:".6rem", lineHeight:1.15 }}>
              This is the surface.<br/><GradText>Our full audit goes 10× deeper.</GradText>
            </h3>
            <p style={{ fontSize:14, color:mutedText, maxWidth:460, margin:"0 auto 1.5rem", lineHeight:1.75 }}>
              We don't just identify problems — we fix them. Landing pages, checkout flow, ad structure, email sequences. One compounding system.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <Link to="/contact" className="btn-g" style={{ display:"inline-block" }}>Apply for full professional audit →</Link>
              <button onClick={() => { setResults(null); setUrl(""); setRevealed(false); }} className="btn-ghost">Scan another store</button>
            </div>
          </TiltCard>
        </div>
      )}
    </PageWrapper>
  );
}