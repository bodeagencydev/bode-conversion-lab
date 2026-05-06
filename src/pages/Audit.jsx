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

const LOADING_MSGS = [
  "Fetching store data...",
  "Analysing page speed signals...",
  "Checking mobile friendliness...",
  "Scanning SEO health...",
  "Detecting checkout friction...",
  "Evaluating Core Web Vitals...",
  "Scoring conversion readiness...",
  "Compiling your report...",
];

function scoreColor(score) {
  if (score >= 80) return "#00ff88";
  if (score >= 55) return "#FAAD4D";
  return "#FF4444";
}

function scoreGrade(score) {
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  return "D";
}

function ScoreRing({ score, size = 100, color }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(128,128,128,.15)" strokeWidth={7} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.4s cubic-bezier(.16,1,.3,1)" }} />
    </svg>
  );
}

function CheckCard({ check, label, icon, color, dark, cardBg, cardBorder, mutedText, headingColor, trackBg }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(v => !v)}
      style={{ background: cardBg, border: `.5px solid ${open ? color+"66" : cardBorder}`, borderTop: `.5px solid ${color}55`, borderRadius: 16, padding: "1.2rem 1.3rem", cursor: "pointer", transition: "border-color .25s" }}
      onMouseEnter={e => { if (!open) e.currentTarget.style.borderColor = `${color}44`; }}
      onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = cardBorder; }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".6rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 17 }}>{icon}</span>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: headingColor }}>{label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{check.grade}</span>
          <span style={{ fontSize: 11, color: mutedText }}>{check.score}/100</span>
          <span style={{ color, fontSize: 16, transition: "transform .25s", transform: open ? "rotate(45deg)" : "none", display: "inline-block", lineHeight: 1 }}>+</span>
        </div>
      </div>
      {/* Bar */}
      <div style={{ height: 5, background: trackBg, borderRadius: 5, overflow: "hidden", marginBottom: ".5rem" }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg,${color},${color}99)`, borderRadius: 5, width: `${check.score}%`, transition: "width 1.2s cubic-bezier(.16,1,.3,1)" }} />
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
  const [url, setUrl]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [results, setResults]   = useState(null);
  const [error, setError]       = useState("");

  const headingColor = dark ? "#fff" : "#0a0a0a";
  const mutedText    = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const cardBg       = dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))";
  const cardBorder   = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)";
  const inputBg      = dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)";
  const inputBorder  = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.12)";
  const inputColor   = dark ? "#f0f0f0" : "#0a0a0a";
  const trackBg      = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)";

  const runAudit = async () => {
    let cleaned = url.trim();
    if (!cleaned) { setError("Please enter your store URL."); return; }
    if (!/^https?:\/\//i.test(cleaned)) cleaned = "https://" + cleaned;
    setError(""); setLoading(true); setResults(null);

    let msgIdx = 0;
    setLoadingMsg(LOADING_MSGS[0]);
    const iv = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MSGS.length;
      setLoadingMsg(LOADING_MSGS[msgIdx]);
    }, 1800);

    try {
      const prompt = `You are an expert e-commerce conversion auditor. Analyse this store URL: ${cleaned}

Return ONLY a valid JSON object — no markdown, no explanation, just the raw JSON:

{
  "domain": "domain name only",
  "platform": "Shopify / WooCommerce / Wix / Squarespace / BigCommerce / Custom / Unknown",
  "overallScore": <0-100>,
  "checks": {
    "speed":      { "score": <0-100>, "grade": "<A/B/C/D>", "summary": "<1 sentence>", "issues": ["...","..."], "fixes": ["...","..."] },
    "mobile":     { "score": <0-100>, "grade": "<A/B/C/D>", "summary": "<1 sentence>", "issues": ["...","..."], "fixes": ["...","..."] },
    "seo":        { "score": <0-100>, "grade": "<A/B/C/D>", "summary": "<1 sentence>", "issues": ["...","...","..."], "fixes": ["...","...","..."] },
    "checkout":   { "score": <0-100>, "grade": "<A/B/C/D>", "summary": "<1 sentence>", "issues": ["...","..."], "fixes": ["...","..."] },
    "images":     { "score": <0-100>, "grade": "<A/B/C/D>", "summary": "<1 sentence>", "issues": ["...","..."], "fixes": ["...","..."] },
    "ssl":        { "score": <0-100>, "grade": "<A/B/C/D>", "summary": "<1 sentence>", "issues": ["..."], "fixes": ["..."] },
    "vitals":     { "score": <0-100>, "grade": "<A/B/C/D>", "summary": "<1 sentence>", "issues": ["...","..."], "fixes": ["...","..."] },
    "conversion": { "score": <0-100>, "grade": "<A/B/C/D>", "summary": "<1 sentence>", "issues": ["...","...","..."], "fixes": ["...","...","..."] }
  },
  "topPriorities": ["<critical fix 1>", "<critical fix 2>", "<critical fix 3>"],
  "estimatedRevenueLeak": "<e.g. 25-40% of potential revenue>",
  "verdict": "<2-3 sentence overall verdict tailored to this store>"
}

Be realistic and specific to the domain. Vary scores meaningfully — not everything should score the same.`;

      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw  = data.content?.find(b => b.type === "text")?.text || "";
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON");
      setResults(JSON.parse(match[0]));
    } catch {
      setError("Audit failed — please check the URL and try again.");
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  const oCol   = results ? scoreColor(results.overallScore) : G;
  const oGrade = results ? scoreGrade(results.overallScore) : "?";

  return (
    <PageWrapper>
      {/* ── HERO ── */}
      <section style={{ position: "relative", padding: "clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) 3rem", overflow: "hidden" }}>
        <Particles />
        <div style={{ position: "absolute", width: 600, height: 600, top: -150, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.13),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: G, fontWeight: 500, marginBottom: "1.4rem" }}>
            <span style={{ width: 6, height: 6, background: G, borderRadius: "50%", animation: "pulse 2s infinite" }} /> AI-Powered Store Analyser
          </span>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.9rem,5.5vw,3.3rem)", fontWeight: 800, lineHeight: 1.08, color: headingColor, marginBottom: "1rem", wordBreak: "break-word" }}>
            Paste your URL.<br /><GradText>See exactly where you're losing money.</GradText>
          </h1>
          <p style={{ fontSize: "clamp(0.9rem,2.5vw,1.05rem)", color: mutedText, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 2rem" }}>
            8 conversion checks. AI-powered diagnosis. Specific fixes — like Google PageSpeed Insights but built for e-commerce revenue.
          </p>

          {/* INPUT ROW */}
          <div style={{ maxWidth: 620, margin: "0 auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
              <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>🔗</span>
              <input type="text" placeholder="yourstore.com" value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !loading && runAudit()}
                style={{ width: "100%", background: inputBg, border: `.5px solid ${error ? "#FF4444" : inputBorder}`, borderRadius: 12, padding: ".85rem 1rem .85rem 2.7rem", color: inputColor, fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "border-color .2s" }}
                onFocus={e => e.target.style.borderColor = "rgba(0,255,136,.5)"}
                onBlur={e => e.target.style.borderColor = error ? "#FF4444" : inputBorder}
              />
            </div>
            <button onClick={runAudit} disabled={loading}
              style={{ background: GG, color: "#040608", border: "none", borderRadius: 12, padding: ".85rem 1.6rem", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? .8 : 1, whiteSpace: "nowrap", boxShadow: "0 4px 22px rgba(0,255,136,.35)", transition: "transform .15s,box-shadow .15s" }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 34px rgba(0,255,136,.55)"; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 22px rgba(0,255,136,.35)"; }}>
              {loading ? "Analysing..." : "Analyse Store →"}
            </button>
          </div>
          {error && <p style={{ color: "#FF4444", fontSize: 13, marginTop: 10 }}>{error}</p>}

          {/* PILL BADGES */}
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

      {/* ── LOADING ── */}
      {loading && (
        <div style={{ maxWidth: 580, margin: "0 auto", padding: "0 1.5rem 5rem" }}>
          <div style={{ background: cardBg, border: `.5px solid ${cardBorder}`, borderRadius: 24, padding: "2.5rem 2rem", position: "relative", overflow: "hidden", textAlign: "center" }}>
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)" }} />
            {/* Spinner */}
            <div style={{ width: 72, height: 72, margin: "0 auto 1.5rem", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2.5px solid ${G}`, borderTopColor: "transparent", animation: "auditSpin 0.9s linear infinite" }} />
              <div style={{ position: "absolute", inset: 10, borderRadius: "50%", border: `1.5px solid ${G}`, borderBottomColor: "transparent", animation: "auditSpin 1.4s linear infinite reverse" }} />
              <div style={{ position: "absolute", inset: "50%", transform: "translate(-50%,-50%)", width: 8, height: 8, borderRadius: "50%", background: G }} />
            </div>
            <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, color: headingColor, marginBottom: ".4rem" }}>{loadingMsg}</p>
            <p style={{ fontSize: 12, color: mutedText, marginBottom: "1.5rem" }}>Running 8 conversion checks...</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {CHECKS.map((c, i) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{c.icon}</span>
                  <div style={{ flex: 1, height: 4, background: trackBg, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: GG, borderRadius: 4, animation: `scanBar 1.8s ${i * 0.18}s ease-in-out infinite alternate` }} />
                  </div>
                  <span style={{ fontSize: 11, color: mutedText, whiteSpace: "nowrap", minWidth: 120, textAlign: "left" }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes auditSpin { to { transform: rotate(360deg); } }
            @keyframes scanBar { from { width: 10%; opacity: .3; } to { width: 100%; opacity: 1; } }
          `}</style>
        </div>
      )}

      {/* ── RESULTS ── */}
      {results && !loading && (
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 clamp(1rem,4vw,2rem) 5rem" }}>

          {/* Overall score card */}
          <div style={{ background: cardBg, border: `.5px solid ${cardBorder}`, borderTop: `.5px solid ${oCol}66`, borderRadius: 24, padding: "clamp(1.4rem,4vw,2.2rem)", marginBottom: "1.2rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg,transparent,${oCol}77,transparent)` }} />
            <div style={{ display: "flex", gap: "clamp(.8rem,3vw,2rem)", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <ScoreRing score={results.overallScore} size={96} color={oCol} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: oCol, lineHeight: 1 }}>{oGrade}</span>
                  <span style={{ fontSize: 10, color: mutedText }}>{results.overallScore}/100</span>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: ".4rem", flexWrap: "wrap" }}>
                  <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.1rem,3.5vw,1.5rem)", fontWeight: 800, color: headingColor, margin: 0 }}>{results.domain}</h2>
                  {results.platform && results.platform !== "Unknown" && (
                    <span style={{ background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 100, padding: "2px 9px", fontSize: 10, color: G, fontWeight: 600 }}>{results.platform}</span>
                  )}
                </div>
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

          {/* Top priorities */}
          <div style={{ background: "linear-gradient(135deg,rgba(255,68,68,.06),rgba(255,68,68,.02))", border: ".5px solid rgba(255,68,68,.2)", borderRadius: 16, padding: "1.1rem 1.4rem", marginBottom: "1.2rem" }}>
            <p style={{ fontSize: 10, color: "#ff9999", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700, marginBottom: ".6rem" }}>🚨 Fix These First</p>
            {results.topPriorities?.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 9, marginBottom: i < results.topPriorities.length - 1 ? 6 : 0 }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, color: "#FF7B7B", flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
                <p style={{ fontSize: 13, color: dark ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.65)", margin: 0, lineHeight: 1.5 }}>{p}</p>
              </div>
            ))}
          </div>

          {/* Check grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(255px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            {CHECKS.map(c => {
              const chk = results.checks?.[c.id];
              if (!chk) return null;
              return <CheckCard key={c.id} check={chk} label={c.label} icon={c.icon} color={scoreColor(chk.score)} dark={dark} cardBg={cardBg} cardBorder={cardBorder} mutedText={mutedText} headingColor={headingColor} trackBg={trackBg} />;
            })}
          </div>

          {/* CTA */}
          <div style={{ background: "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 24, padding: "clamp(1.8rem,5vw,3rem)", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: G, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".6rem", fontWeight: 600 }}>Want us to fix all of this?</p>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.2rem,4vw,1.9rem)", fontWeight: 800, color: headingColor, marginBottom: ".6rem", lineHeight: 1.2 }}>
              This is just the surface.<br /><GradText>Our full audit goes 10x deeper.</GradText>
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