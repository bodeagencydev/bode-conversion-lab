import { Link, useParams } from "react-router-dom";
import { G, GG, CASE_STUDIES, BADGES } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles, useTheme } from "../components.jsx";
import { ScrollReveal, TiltCard, MaskedHeading, GlowBorder } from "../AnimationSystem.jsx";

/* ══════════════════════════════════════════
   REAL IMAGE PROOF COMPONENT
   Shows actual screenshots if available,
   falls back to the SVG mockup otherwise.
   
   TO ADD REAL IMAGES:
   1. Take screenshots of before/after dashboards
   2. Save them to your /public/proof/ folder like:
      /public/proof/marcus-before.jpg
      /public/proof/marcus-after.jpg
   3. Update the PROOF_IMAGES object below
══════════════════════════════════════════ */
const PROOF_IMAGES = {
  "marcus-fitness": {
    before: null, // Replace with: "/proof/marcus-before.jpg"
    after:  null, // Replace with: "/proof/marcus-after.jpg"
    caption: "Shopify Analytics — same traffic, 31× more revenue",
  },
  "priya-beauty": {
    before: null, // Replace with: "/proof/priya-before.jpg"
    after:  null, // Replace with: "/proof/priya-after.jpg"
    caption: "WooCommerce + Google Ads Manager — CVR jump from 1.1% to 4.8%",
  },
  "tunde-fashion": {
    before: null, // Replace with: "/proof/tunde-before.jpg"
    after:  null, // Replace with: "/proof/tunde-after.jpg"
    caption: "Shopify Analytics + Meta Ads — same budget, 4.3× ROAS",
  },
};

/* ── Format value without double symbols ── */
function fmtVal(unit, val, suffix) {
  // Fix: ensure unit and val don't duplicate symbols
  const v = String(val);
  const u = unit || "";
  const s = suffix || "";
  // Remove leading unit from val if it already starts with it
  const cleanVal = (u && v.startsWith(u)) ? v.slice(u.length) : v;
  return `${u}${cleanVal}${s}`;
}

/* ── Dashboard SVG Mockup (fallback when no real image) ── */
function DashboardMockup({ cs, dark, side }) {
  const isBefore = side === "before";
  const r1b = cs.result1.beforeNum, r1a = cs.result1.afterNum;
  const r2b = cs.result2.beforeNum, r2a = cs.result2.afterNum;
  const r3b = cs.result3.beforeNum, r3a = cs.result3.afterNum;

  const accentColor   = isBefore ? "#FF3B3B" : "#00ff88";
  const bgColor       = isBefore
    ? (dark ? "#110a0a" : "#1a0a0a")
    : (dark ? "#0a110a" : "#0a1a0a");
  const borderColor   = isBefore ? "rgba(255,59,59,.35)" : "rgba(0,255,136,.35)";
  const barBg         = dark ? "#161b22" : "#1a2a1a";

  const metrics = isBefore
    ? [
        { label:"Revenue",  val:`$${(r1b/1000).toFixed(1)}k`, color:"#FF6B6B", trend:`↓ -12%` },
        { label:"ROAS",     val:`${r2b}x`,                    color:"#FF9900", trend:`↓ -8%`  },
        { label:"CVR",      val:`${r3b}%`,                    color:"#FF6B6B", trend:`↓ -5%`  },
        { label:"Sessions", val:"12.4k",                       color:"rgba(255,255,255,.5)", trend:"→ Flat" },
      ]
    : [
        { label:"Revenue",  val:`$${r1a>=1000?(r1a/1000).toFixed(0)+"k":r1a}`, color:"#00ff88", trend:`↑ +${Math.round((r1a/r1b-1)*100)}%` },
        { label:"ROAS",     val:`${r2a}x`,                                       color:"#00ff88", trend:`↑ +${Math.round((r2a/r2b-1)*100)}%` },
        { label:"CVR",      val:`${r3a}%`,                                       color:"#00ff88", trend:`↑ +${Math.round((r3a/r3b-1)*100)}%` },
        { label:"Sessions", val:"12.4k",                                          color:"rgba(255,255,255,.6)", trend:"→ Same traffic" },
      ];

  return (
    <div style={{ background:bgColor, borderRadius:12, overflow:"hidden", border:`1px solid ${borderColor}`, boxShadow:`0 4px 24px ${isBefore?"rgba(255,59,59,.15)":"rgba(0,255,136,.2)"}` }}>
      {/* Browser chrome */}
      <div style={{ background:isBefore?(dark?"#161b22":"#1a1a2e"):(dark?"#0d1f0d":"#0a1a0a"), padding:"7px 10px", display:"flex", alignItems:"center", gap:5 }}>
        <div style={{ display:"flex", gap:3 }}>
          {["#FF5F56","#FFBD2E","#27C93F"].map((c,i) => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:c }}/>)}
        </div>
        <div style={{ flex:1, height:12, background:"rgba(255,255,255,.06)", borderRadius:3, marginLeft:4 }}/>
        <div style={{ fontSize:7, color:isBefore?"rgba(255,100,100,.6)":"rgba(0,255,136,.5)", background:isBefore?"rgba(255,59,59,.12)":"rgba(0,255,136,.1)", padding:"2px 5px", borderRadius:3, fontWeight:700 }}>
          {isBefore?"↓ Declining":"↑ Growing"}
        </div>
      </div>
      {/* Content */}
      <div style={{ padding:"8px 10px" }}>
        <div style={{ fontSize:7, color:isBefore?"rgba(255,100,100,.4)":"rgba(0,255,136,.4)", fontFamily:"monospace", marginBottom:6 }}>
          shopify.com/admin/analytics
        </div>
        {/* Metric grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginBottom:6 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ background:isBefore?"rgba(255,59,59,.06)":"rgba(0,255,136,.06)", borderRadius:5, padding:"5px 7px", border:`1px solid ${isBefore?"rgba(255,59,59,.15)":"rgba(0,255,136,.15)"}` }}>
              <p style={{ fontSize:6, color:isBefore?"rgba(255,100,100,.5)":"rgba(0,255,136,.5)", margin:"0 0 1px", textTransform:"uppercase", letterSpacing:".04em" }}>{m.label}</p>
              <p style={{ fontSize:11, fontWeight:800, color:m.color, margin:"0 0 1px", fontFamily:"monospace", textShadow:i<3?`0 0 6px ${m.color}44`:"none" }}>{m.val}</p>
              <p style={{ fontSize:6, color:isBefore?"rgba(255,80,80,.5)":"rgba(0,255,136,.6)", margin:0 }}>{m.trend}</p>
            </div>
          ))}
        </div>
        {/* Mini chart */}
        <div style={{ background:"rgba(255,255,255,.03)", borderRadius:5, padding:"5px", border:`1px solid ${isBefore?"rgba(255,59,59,.1)":"rgba(0,255,136,.1)"}` }}>
          <p style={{ fontSize:6, color:isBefore?"rgba(255,80,80,.4)":"rgba(0,255,136,.45)", margin:"0 0 3px" }}>Revenue (30 days)</p>
          <svg viewBox="0 0 140 48" style={{ width:"100%", height:32, display:"block" }}>
            <defs>
              <linearGradient id={`a${side}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity={isBefore?"0.25":"0.35"}/>
                <stop offset="100%" stopColor={accentColor} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {isBefore
              ? <>
                  <path d="M0,12 L20,15 L40,19 L60,22 L80,26 L100,30 L120,34 L140,40 L140,48 L0,48 Z" fill={`url(#a${side})`}/>
                  <path d="M0,12 L20,15 L40,19 L60,22 L80,26 L100,30 L120,34 L140,40" fill="none" stroke="#FF3B3B" strokeWidth="1.5" strokeLinecap="round"/>
                </>
              : <>
                  <path d="M0,44 L20,38 L40,30 L60,22 L80,15 L100,10 L120,6 L140,3 L140,48 L0,48 Z" fill={`url(#a${side})`}/>
                  <path d="M0,44 L20,38 L40,30 L60,22 L80,15 L100,10 L120,6 L140,3" fill="none" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" style={{ filter:"drop-shadow(0 0 3px rgba(0,255,136,.5))" }}/>
                  <circle cx="140" cy="3" r="2.5" fill="#00ff88" style={{ filter:"drop-shadow(0 0 4px rgba(0,255,136,.8))" }}/>
                </>
            }
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── Real Image OR Fallback Mockup ── */
function ProofVisual({ cs, dark }) {
  const proof = PROOF_IMAGES[cs.id];
  const hasReal = proof?.before && proof?.after;

  return (
    <div style={{ marginBottom:"1.5rem" }}>
      <p style={{ fontSize:11, color:G, letterSpacing:".1em", textTransform:"uppercase", fontWeight:700, marginBottom:"1rem" }}>
        {hasReal ? "📸 Real Client Dashboard Screenshots" : "📊 Dashboard Comparison"}
      </p>

      {hasReal ? (
        /* ── REAL SCREENSHOTS ── */
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { src:proof.before, label:"BEFORE", color:"rgba(255,59,59,.8)", dot:"#FF3B3B" },
            { src:proof.after,  label:"AFTER",  color:"#00ff88",            dot:"#00ff88", glow:true },
          ].map((p, i) => (
            <div key={i}>
              <div style={{ fontSize:11, color:p.color, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:p.dot, display:"inline-block", boxShadow:p.glow?`0 0 8px ${p.dot}`:""  }}/>
                {p.label}
              </div>
              <div style={{ borderRadius:12, overflow:"hidden", border:`1px solid ${i===0?"rgba(255,59,59,.3)":"rgba(0,255,136,.3)"}`, boxShadow:`0 4px 20px ${i===0?"rgba(255,59,59,.15)":"rgba(0,255,136,.18)"}` }}>
                <img src={p.src} alt={`${cs.client} ${p.label.toLowerCase()} results`} loading="lazy"
                  style={{ width:"100%", height:"auto", display:"block", objectFit:"cover" }}
                  onError={e => { e.target.style.display="none"; }}/>
              </div>
            </div>
          ))}
          {proof.caption && <p style={{ gridColumn:"1/-1", fontSize:11, color:dark?"rgba(255,255,255,.35)":"rgba(0,0,0,.35)", textAlign:"center", fontStyle:"italic", marginTop:4 }}>{proof.caption}</p>}
        </div>
      ) : (
        /* ── SVG FALLBACK — no real images yet ── */
        <>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <div style={{ fontSize:11, color:"rgba(255,100,100,.8)", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:"#FF3B3B", display:"inline-block" }}/>BEFORE
              </div>
              <DashboardMockup cs={cs} dark={dark} side="before"/>
            </div>
            <div>
              <div style={{ fontSize:11, color:"#00ff88", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:"#00ff88", boxShadow:"0 0 8px rgba(0,255,136,.6)", display:"inline-block" }}/>AFTER
              </div>
              <DashboardMockup cs={cs} dark={dark} side="after"/>
            </div>
          </div>
          {/* Placeholder notice */}
          <div style={{ marginTop:10, padding:"8px 12px", background:dark?"rgba(255,255,255,.03)":"rgba(0,0,0,.03)", border:dark?".5px solid rgba(255,255,255,.08)":".5px solid rgba(0,0,0,.07)", borderRadius:8, textAlign:"center" }}>
            <p style={{ fontSize:11, color:dark?"rgba(255,255,255,.3)":"rgba(0,0,0,.3)", margin:0 }}>
              💡 Add real screenshots: save client dashboard images to <code style={{ fontSize:10, color:G }}>/public/proof/{cs.id}-before.jpg</code> and update <code style={{ fontSize:10, color:G }}>PROOF_IMAGES</code> in CaseStudies.jsx
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Metric Bars — fixed double symbol ── */
function BeforeAfterBar({ label, before, after, beforeNum, afterNum, unit, suffix, dark }) {
  const mutedText = dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)";
  const lowerIsBetter = label === "CPA" || label === "Spend";
  const beforePct = lowerIsBetter
    ? Math.round((afterNum / beforeNum) * 100)
    : Math.round((beforeNum / Math.max(afterNum, beforeNum)) * 100);
  const improvement = lowerIsBetter
    ? Math.round((1 - afterNum / beforeNum) * 100)
    : afterNum > beforeNum ? Math.round(((afterNum - beforeNum) / beforeNum) * 100) : 0;

  // Clean display values — no double $ or %
  const cleanBefore = String(before).replace(/^\$\$/,"$").replace(/^%%/,"%");
  const cleanAfter  = String(after).replace(/^\$\$/,"$").replace(/^%%/,"%");

  return (
    <div style={{ marginBottom:"1rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={{ fontSize:12, color:mutedText, fontWeight:600, textTransform:"uppercase", letterSpacing:".05em" }}>{label}</span>
        {improvement > 0 && (
          <span style={{ fontSize:11, background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.3)", borderRadius:100, padding:"2px 8px", color:G, fontWeight:700 }}>
            {lowerIsBetter ? "−" : "+"}{improvement}%
          </span>
        )}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
        <span style={{ fontSize:10, color:"rgba(255,100,100,.7)", fontWeight:600, minWidth:32, textAlign:"right" }}>WAS</span>
        <div style={{ flex:1, height:6, background:dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)", borderRadius:6, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${Math.max(beforePct, 4)}%`, background:"linear-gradient(90deg,rgba(255,100,100,.5),rgba(255,80,80,.3))", borderRadius:6 }}/>
        </div>
        <span style={{ fontSize:11, color:"rgba(255,100,100,.9)", fontWeight:700, minWidth:72, textAlign:"right" }}>{cleanBefore}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:10, color:G, fontWeight:600, minWidth:32, textAlign:"right" }}>NOW</span>
        <div style={{ flex:1, height:6, background:dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)", borderRadius:6, overflow:"hidden" }}>
          <div style={{ height:"100%", width:"100%", background:"linear-gradient(90deg,#00ff88,#00cc6a)", borderRadius:6, boxShadow:"0 0 8px rgba(0,255,136,.4)" }}/>
        </div>
        <span style={{ fontSize:12, color:G, fontWeight:800, minWidth:72, textAlign:"right", textShadow:"0 0 8px rgba(0,255,136,.4)" }}>{cleanAfter}</span>
      </div>
    </div>
  );
}

/* ── Credibility Badges ── */
function BadgeRow({ dark }) {
  const mutedText = dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)";
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
      {BADGES.map((b, i) => (
        <ScrollReveal key={i} delay={i * 0.07}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 14px", background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.03)", border:`.5px solid ${b.color}44`, borderRadius:12, transition:"all .3s cubic-bezier(.22,1,.36,1)", minHeight:44 }}
            onMouseEnter={e => { e.currentTarget.style.background=`${b.color}11`; e.currentTarget.style.borderColor=`${b.color}66`; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 8px 24px ${b.color}18`; }}
            onMouseLeave={e => { e.currentTarget.style.background=dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.03)"; e.currentTarget.style.borderColor=`${b.color}44`; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
            <span style={{ fontSize:16 }}>{b.icon}</span>
            <div>
              <p style={{ fontSize:12, fontWeight:700, color:b.color, margin:0, lineHeight:1.2 }}>{b.title}</p>
              <p style={{ fontSize:10, color:mutedText, margin:0 }}>{b.sub}</p>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}

/* ════════════════════
   CASE STUDIES LIST
════════════════════ */
export function CaseStudies() {
  const { dark } = useTheme();
  const headingColor = dark ? "#fff" : "#0a0a0a";
  const mutedText    = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const mutedText2   = dark ? "rgba(255,255,255,.3)"  : "rgba(0,0,0,.35)";
  const tagBg        = dark ? "rgba(255,255,255,.05)"  : "rgba(0,0,0,.05)";
  const tagBorder    = dark ? "rgba(255,255,255,.1)"   : "rgba(0,0,0,.08)";

  return (
    <PageWrapper>
      <section style={{ position:"relative", padding:"clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) 3rem", overflow:"hidden" }}>
        <Particles/>
        <div style={{ position:"absolute", width:400, height:400, top:-100, left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <ScrollReveal delay={0}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.28)", borderRadius:100, padding:"5px 14px", fontSize:11, color:G, fontWeight:500, marginBottom:"1.4rem" }}>
              <span style={{ width:6, height:6, background:G, borderRadius:"50%", animation:"pulse 2s infinite" }}/> Real results
            </span>
          </ScrollReveal>
          <MaskedHeading text="Case Studies" tag="h1" delay={0.1} stagger={0.08}
            style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(2rem,7vw,3.2rem)", fontWeight:800, lineHeight:1.1, letterSpacing:"-.03em", color:headingColor, marginBottom:"1.2rem", justifyContent:"center" }}/>
          <ScrollReveal delay={0.4}>
            <p style={{ fontSize:"clamp(0.9rem,3vw,1.05rem)", color:mutedText, lineHeight:1.75 }}>
              Real stores. Real problems. Real results. No cherry-picked metrics.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Badges */}
      <div style={{ padding:"1.5rem clamp(1rem,4vw,2rem)", borderTop:dark?".5px solid rgba(255,255,255,.06)":".5px solid rgba(0,0,0,.08)", borderBottom:dark?".5px solid rgba(255,255,255,.06)":".5px solid rgba(0,0,0,.08)" }}>
        <ScrollReveal delay={0}>
          <p style={{ textAlign:"center", fontSize:11, color:mutedText2, letterSpacing:".1em", textTransform:"uppercase", marginBottom:"1rem", fontWeight:600 }}>Certified & recognised by</p>
        </ScrollReveal>
        <BadgeRow dark={dark}/>
      </div>
      <hr className="divider"/>

      <Section>
        <div style={{ maxWidth:960, margin:"0 auto", display:"flex", flexDirection:"column", gap:"1.5rem" }}>
          {CASE_STUDIES.map((cs, idx) => (
            <ScrollReveal key={cs.id} delay={idx * 0.1}>
              <Link to={`/case-studies/${cs.id}`} style={{ textDecoration:"none", display:"block" }}>
                <TiltCard className="glass" style={{ padding:"clamp(1.2rem,4vw,2rem)", cursor:"pointer" }}>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"1rem", alignItems:"center" }}>
                    <span style={{ background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.25)", borderRadius:100, padding:"3px 10px", fontSize:11, color:G, fontWeight:600 }}>{cs.category}</span>
                    {cs.tags.map(t => <span key={t} style={{ background:tagBg, border:`.5px solid ${tagBorder}`, borderRadius:100, padding:"3px 10px", fontSize:11, color:mutedText2 }}>{t}</span>)}
                    <span style={{ marginLeft:"auto", background:"rgba(0,255,136,.08)", border:".5px solid rgba(0,255,136,.2)", borderRadius:100, padding:"3px 10px", fontSize:11, color:G }}>{cs.timeframe}</span>
                  </div>
                  <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.1rem,4vw,1.5rem)", fontWeight:800, color:headingColor, marginBottom:".75rem", lineHeight:1.2, wordBreak:"break-word" }}>{cs.headline}</h2>
                  <p style={{ fontSize:"clamp(13px,3vw,14px)", color:mutedText, lineHeight:1.7, marginBottom:"1.5rem" }}>{cs.summary}</p>
                  {/* Mobile-safe result grid — 3 equal columns, clamp text */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"clamp(6px,2vw,12px)", marginBottom:"1.2rem" }}>
                    {[cs.result1, cs.result2, cs.result3].map((r, j) => {
                      const cleanB = String(r.before).replace(/^\$\$/,"$");
                      const cleanA = String(r.after).replace(/^\$\$/,"$");
                      return (
                        <div key={j} style={{ textAlign:"center", background:"rgba(0,255,136,.06)", border:".5px solid rgba(0,255,136,.18)", borderRadius:12, padding:"clamp(8px,2vw,14px) clamp(4px,1.5vw,10px)" }}>
                          <p style={{ fontSize:"clamp(8px,1.8vw,11px)", color:mutedText2, marginBottom:4, fontWeight:600, textTransform:"uppercase", letterSpacing:".04em" }}>{r.label}</p>
                          <p style={{ fontSize:"clamp(9px,2vw,12px)", color:"rgba(255,100,100,.8)", marginBottom:2, fontWeight:600, wordBreak:"break-word" }}>{cleanB}</p>
                          <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(10px,2.5vw,15px)", fontWeight:800, background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", wordBreak:"break-word" }}>{cleanA}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, color:G, fontSize:13, fontWeight:600 }}>
                    View full results + dashboard proof <span style={{ fontSize:16 }}>→</span>
                  </div>
                </TiltCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <hr className="divider"/>
      <Section style={{ paddingBottom:"6rem" }}>
        <ScrollReveal delay={0}>
          <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center" }}>
            <SectionLabel>Your turn</SectionLabel>
            <Heading size="2.4rem">Want to be our<br /><GradText>next case study?</GradText></Heading>
            <p style={{ fontSize:15, color:mutedText, lineHeight:1.7, margin:"1.5rem 0" }}>Apply for a free audit and see exactly what we'd fix in your store.</p>
            <Link to="/audit" className="btn-g" style={{ display:"inline-block" }}>Get your free store audit →</Link>
          </div>
        </ScrollReveal>
      </Section>
    </PageWrapper>
  );
}

/* ════════════════════
   CASE STUDY DETAIL
════════════════════ */
export function CaseStudyDetail() {
  const { id }   = useParams();
  const { dark } = useTheme();
  const cs = CASE_STUDIES.find(c => c.id === id);

  const headingColor = dark ? "#fff"  : "#0a0a0a";
  const mutedText    = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const mutedText2   = dark ? "rgba(255,255,255,.3)"  : "rgba(0,0,0,.35)";
  const mutedText3   = dark ? "rgba(255,255,255,.58)" : "rgba(0,0,0,.6)";
  const cardBg       = dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))";
  const cardBorder   = dark ? "rgba(255,255,255,.12)"  : "rgba(0,0,0,.1)";
  const tagBg        = dark ? "rgba(255,255,255,.05)"  : "rgba(0,0,0,.05)";
  const tagBorder    = dark ? "rgba(255,255,255,.1)"   : "rgba(0,0,0,.08)";

  if (!cs) return (
    <PageWrapper>
      <Section>
        <div style={{ textAlign:"center", padding:"4rem 1rem" }}>
          <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"4rem", marginBottom:"1rem" }}>🔍</p>
          <h1 style={{ color:headingColor, fontFamily:"'Syne',sans-serif", fontSize:"2rem", marginBottom:".75rem" }}>Case study not found</h1>
          <p style={{ color:mutedText, marginBottom:"2rem" }}>That page doesn't exist. Choose a case study below.</p>
          <Link to="/case-studies" className="btn-g" style={{ display:"inline-block" }}>← Back to case studies</Link>
        </div>
      </Section>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      {/* Hero */}
      <section style={{ position:"relative", padding:"clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) 3rem", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:400, height:400, top:-80, left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
        <div style={{ maxWidth:820, margin:"0 auto", position:"relative", zIndex:1 }}>
          <ScrollReveal delay={0}>
            <Link to="/case-studies" style={{ display:"inline-flex", alignItems:"center", gap:6, color:dark?"rgba(255,255,255,.4)":"rgba(0,0,0,.4)", textDecoration:"none", fontSize:13, marginBottom:"1.5rem", minHeight:44 }}>← Back to case studies</Link>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"1.2rem" }}>
              <span style={{ background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.25)", borderRadius:100, padding:"3px 10px", fontSize:11, color:G, fontWeight:600 }}>{cs.category}</span>
              {cs.tags.map(t => <span key={t} style={{ background:tagBg, border:`.5px solid ${tagBorder}`, borderRadius:100, padding:"3px 10px", fontSize:11, color:mutedText2 }}>{t}</span>)}
            </div>
          </ScrollReveal>
          <MaskedHeading text={cs.headline} tag="h1" delay={0.15} stagger={0.05}
            style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.5rem,5vw,2.6rem)", fontWeight:800, lineHeight:1.12, letterSpacing:"-.02em", color:headingColor, marginBottom:"1rem", wordBreak:"break-word" }}/>
          <ScrollReveal delay={0.5}>
            <p style={{ fontSize:"clamp(0.9rem,3vw,1.05rem)", color:mutedText, lineHeight:1.75, marginBottom:"1.5rem" }}>{cs.summary}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.6}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {[
                { icon:"⏱", label:"Timeframe", val:cs.timeframe },
                { icon:"🛒", label:"Platform",  val:cs.platform },
                { icon:"💸", label:"Ad Spend",  val:cs.adSpend },
              ].map((m, i) => (
                <div key={i} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 12px", background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)", border:dark?".5px solid rgba(255,255,255,.08)":".5px solid rgba(0,0,0,.07)", borderRadius:10, minHeight:44 }}>
                  <span style={{ fontSize:14 }}>{m.icon}</span>
                  <div>
                    <p style={{ fontSize:9, color:mutedText2, margin:0, textTransform:"uppercase", letterSpacing:".06em" }}>{m.label}</p>
                    <p style={{ fontSize:13, fontWeight:700, color:headingColor, margin:0 }}>{m.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <hr className="divider"/>

      <Section>
        <div style={{ maxWidth:820, margin:"0 auto" }}>

          {/* ── VISUAL PROOF ── */}
          <ScrollReveal delay={0}>
            <ProofVisual cs={cs} dark={dark}/>
          </ScrollReveal>

          {/* ── METRIC BARS ── */}
          <ScrollReveal delay={0.1}>
            <div style={{ background:cardBg, border:`.5px solid ${cardBorder}`, borderTop:".5px solid rgba(0,255,136,.3)", borderRadius:20, padding:"clamp(1.2rem,4vw,2rem)", marginBottom:"1.5rem", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.4),transparent)" }}/>
              <p style={{ fontSize:11, color:G, letterSpacing:".1em", textTransform:"uppercase", fontWeight:700, marginBottom:"1.2rem" }}>📊 Metric Breakdown</p>
              <BeforeAfterBar dark={dark} {...cs.result1}/>
              <BeforeAfterBar dark={dark} {...cs.result2}/>
              <BeforeAfterBar dark={dark} {...cs.result3}/>
            </div>
          </ScrollReveal>

          {/* ── TESTIMONIAL ── */}
          {cs.testimonial && (
            <ScrollReveal delay={0.15}>
              <div style={{ background:"linear-gradient(135deg,rgba(0,255,136,.06),rgba(0,204,106,.02))", border:".5px solid rgba(0,255,136,.2)", borderLeft:"3px solid rgba(0,255,136,.5)", borderRadius:16, padding:"1.5rem", marginBottom:"2rem" }}>
                <p style={{ fontSize:"clamp(14px,3vw,16px)", color:dark?"rgba(255,255,255,.78)":"rgba(0,0,0,.72)", lineHeight:1.8, fontStyle:"italic", marginBottom:"1rem" }}>
                  "{cs.testimonial}"
                </p>
                <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(0,255,136,.15)", border:".5px solid rgba(0,255,136,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:G, flexShrink:0 }}>{cs.clientName?.[0]}</div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:headingColor, margin:0 }}>{cs.clientName}</p>
                    <p style={{ fontSize:11, color:mutedText2, margin:0 }}>{cs.clientRole}</p>
                  </div>
                  <div style={{ marginLeft:"auto", display:"flex", gap:2 }}>{[1,2,3,4,5].map(s=><span key={s} style={{ fontSize:13, color:"#FFD700" }}>★</span>)}</div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* ── STORY ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:"2rem", marginBottom:"2.5rem" }}>
            {cs.story.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div style={{ borderLeft:"2px solid rgba(0,255,136,.3)", paddingLeft:"clamp(1rem,4vw,2rem)" }}>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1rem,4vw,1.2rem)", fontWeight:800, color:headingColor, marginBottom:"1rem" }}>{s.heading}</h3>
                  <p style={{ fontSize:"clamp(13px,3vw,15px)", color:mutedText3, lineHeight:1.85 }}>{s.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* ── BADGES ── */}
          <ScrollReveal delay={0}>
            <div style={{ marginBottom:"2rem" }}>
              <p style={{ fontSize:11, color:mutedText2, textTransform:"uppercase", letterSpacing:".1em", fontWeight:600, marginBottom:"1rem", textAlign:"center" }}>Results delivered by a certified team</p>
              <BadgeRow dark={dark}/>
            </div>
          </ScrollReveal>

          {/* ── CTA ── */}
          <ScrollReveal delay={0.1}>
            <GlowBorder style={{ background:"linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border:".5px solid rgba(0,255,136,.25)", borderRadius:20, padding:"clamp(1.5rem,4vw,2.5rem)", textAlign:"center" }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.2rem,4vw,1.5rem)", fontWeight:800, color:headingColor, marginBottom:".75rem" }}>Want results like these?</h3>
              <p style={{ fontSize:14, color:mutedText, marginBottom:"1.5rem", lineHeight:1.7 }}>Apply for a free store audit. We'll find your biggest leaks and build the system to fix them.</p>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                <Link to="/audit" className="btn-g" style={{ display:"inline-block" }}>Get my free store audit →</Link>
                <Link to="/case-studies" className="btn-ghost" style={{ display:"inline-block" }}>← More case studies</Link>
              </div>
            </GlowBorder>
          </ScrollReveal>
        </div>
      </Section>
    </PageWrapper>
  );
}