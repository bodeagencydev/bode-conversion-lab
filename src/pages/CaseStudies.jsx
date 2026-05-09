import { Link, useParams } from "react-router-dom";
import { G, GG, CASE_STUDIES, BADGES } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles, useTheme } from "../components.jsx";
import { ScrollReveal, TiltCard, MaskedHeading, GlowBorder } from "../AnimationSystem.jsx";

/* ══════════════════════════════════════
   REALISTIC SHOPIFY DASHBOARD MOCKUP
   Shows before → after as a real-looking
   analytics screenshot
══════════════════════════════════════ */
function ShopifyDashboardMockup({ cs, dark }) {
  const before = cs.result1.beforeNum;
  const after  = cs.result1.afterNum;
  const roas_b = cs.result2.beforeNum;
  const roas_a = cs.result2.afterNum;
  const cvr_b  = cs.result3.beforeNum;
  const cvr_a  = cs.result3.afterNum;

  // Generate a simple bar chart path for the "after" revenue trend
  const chartPoints = [
    { x:0,   y:90 },
    { x:16,  y:82 },
    { x:32,  y:75 },
    { x:48,  y:68 },
    { x:64,  y:55 },
    { x:80,  y:42 },
    { x:96,  y:30 },
    { x:112, y:18 },
    { x:128, y:10 },
    { x:144, y:4  },
    { x:160, y:2  },
  ];
  const linePath = chartPoints.map((p,i) => `${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
  const areaPath = linePath + ` L160,100 L0,100 Z`;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:"1.5rem" }}>

      {/* ── BEFORE: Red/broken dashboard ── */}
      <div>
        <div style={{ fontSize:11, color:"rgba(255,100,100,.8)", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"#FF3B3B", display:"inline-block" }}/>
          BEFORE
        </div>
        <div style={{ background:dark?"#0d1117":"#1a1a2e", borderRadius:12, overflow:"hidden", border:"1px solid rgba(255,59,59,.3)", boxShadow:"0 4px 24px rgba(255,59,59,.15)" }}>
          {/* Browser bar */}
          <div style={{ background:dark?"#161b22":"#252545", padding:"8px 12px", display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ display:"flex", gap:4 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#FF5F56" }}/>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#FFBD2E" }}/>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#27C93F" }}/>
            </div>
            <div style={{ flex:1, height:14, background:"rgba(255,255,255,.06)", borderRadius:4, marginLeft:4 }}/>
          </div>
          {/* Dashboard content */}
          <div style={{ padding:"10px 12px" }}>
            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ fontSize:9, color:"rgba(255,255,255,.4)", fontFamily:"monospace" }}>shopify.com/admin/analytics</div>
              <div style={{ fontSize:8, color:"rgba(255,100,100,.7)", background:"rgba(255,59,59,.15)", padding:"2px 6px", borderRadius:4 }}>↓ Declining</div>
            </div>
            {/* Stat cards */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
              {[
                { label:"Revenue",  val:`$${(before/1000).toFixed(1)}k`, color:"#FF6B6B", trend:"↓ -12%" },
                { label:"ROAS",     val:`${roas_b}x`,                    color:"#FF9900", trend:"↓ -8%" },
                { label:"CVR",      val:`${cvr_b}%`,                     color:"#FF6B6B", trend:"↓ -5%" },
                { label:"Sessions", val:"12.4k",                          color:"rgba(255,255,255,.5)", trend:"→ Flat" },
              ].map((s, i) => (
                <div key={i} style={{ background:"rgba(255,255,255,.04)", borderRadius:6, padding:"6px 8px", border:"1px solid rgba(255,59,59,.15)" }}>
                  <p style={{ fontSize:7, color:"rgba(255,255,255,.35)", margin:"0 0 2px", textTransform:"uppercase", letterSpacing:".04em" }}>{s.label}</p>
                  <p style={{ fontSize:12, fontWeight:700, color:s.color, margin:"0 0 1px", fontFamily:"monospace" }}>{s.val}</p>
                  <p style={{ fontSize:7, color:"rgba(255,100,100,.6)", margin:0 }}>{s.trend}</p>
                </div>
              ))}
            </div>
            {/* Chart — flat/declining */}
            <div style={{ background:"rgba(255,255,255,.03)", borderRadius:6, padding:"6px", border:"1px solid rgba(255,255,255,.06)" }}>
              <p style={{ fontSize:7, color:"rgba(255,255,255,.3)", margin:"0 0 4px" }}>Revenue (30 days)</p>
              <svg viewBox="0 0 160 60" style={{ width:"100%", height:40, display:"block" }}>
                <defs>
                  <linearGradient id="badArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF3B3B" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#FF3B3B" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Flat/declining line */}
                <path d="M0,15 L20,18 L40,22 L60,25 L80,28 L100,32 L120,35 L140,40 L160,45 L160,60 L0,60 Z" fill="url(#badArea)"/>
                <path d="M0,15 L20,18 L40,22 L60,25 L80,28 L100,32 L120,35 L140,40 L160,45" fill="none" stroke="#FF3B3B" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── AFTER: Green/thriving dashboard ── */}
      <div>
        <div style={{ fontSize:11, color:"#00ff88", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"#00ff88", boxShadow:"0 0 8px rgba(0,255,136,.6)", display:"inline-block" }}/>
          AFTER
        </div>
        <div style={{ background:dark?"#0d1117":"#0d1a0d", borderRadius:12, overflow:"hidden", border:"1px solid rgba(0,255,136,.3)", boxShadow:"0 4px 24px rgba(0,255,136,.2)" }}>
          {/* Browser bar */}
          <div style={{ background:dark?"#161b22":"#0d1f0d", padding:"8px 12px", display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ display:"flex", gap:4 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#FF5F56" }}/>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#FFBD2E" }}/>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#27C93F" }}/>
            </div>
            <div style={{ flex:1, height:14, background:"rgba(0,255,136,.08)", borderRadius:4, marginLeft:4 }}/>
          </div>
          {/* Dashboard content */}
          <div style={{ padding:"10px 12px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ fontSize:9, color:"rgba(0,255,136,.5)", fontFamily:"monospace" }}>shopify.com/admin/analytics</div>
              <div style={{ fontSize:8, color:"#00ff88", background:"rgba(0,255,136,.12)", padding:"2px 6px", borderRadius:4 }}>↑ Growing</div>
            </div>
            {/* Stat cards */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
              {[
                { label:"Revenue",  val:`$${(after/1000).toFixed(0)}k`,  color:"#00ff88", trend:`↑ +${Math.round((after/before-1)*100)}%` },
                { label:"ROAS",     val:`${roas_a}x`,                    color:"#00ff88", trend:`↑ +${Math.round((roas_a/roas_b-1)*100)}%` },
                { label:"CVR",      val:`${cvr_a}%`,                     color:"#00ff88", trend:`↑ +${Math.round((cvr_a/cvr_b-1)*100)}%` },
                { label:"Sessions", val:"12.4k",                          color:"rgba(255,255,255,.6)", trend:"→ Same traffic" },
              ].map((s, i) => (
                <div key={i} style={{ background:"rgba(0,255,136,.06)", borderRadius:6, padding:"6px 8px", border:"1px solid rgba(0,255,136,.2)" }}>
                  <p style={{ fontSize:7, color:"rgba(0,255,136,.5)", margin:"0 0 2px", textTransform:"uppercase", letterSpacing:".04em" }}>{s.label}</p>
                  <p style={{ fontSize:12, fontWeight:700, color:s.color, margin:"0 0 1px", fontFamily:"monospace", textShadow:i<3?"0 0 8px rgba(0,255,136,.4)":"none" }}>{s.val}</p>
                  <p style={{ fontSize:7, color:"rgba(0,255,136,.6)", margin:0 }}>{s.trend}</p>
                </div>
              ))}
            </div>
            {/* Chart — rising */}
            <div style={{ background:"rgba(0,255,136,.04)", borderRadius:6, padding:"6px", border:"1px solid rgba(0,255,136,.12)" }}>
              <p style={{ fontSize:7, color:"rgba(0,255,136,.5)", margin:"0 0 4px" }}>Revenue (30 days)</p>
              <svg viewBox="0 0 160 60" style={{ width:"100%", height:40, display:"block" }}>
                <defs>
                  <linearGradient id="goodArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity="0.35"/>
                    <stop offset="100%" stopColor="#00ff88" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Rising curve */}
                <path d="M0,55 L20,50 L40,44 L60,36 L80,27 L100,18 L120,12 L140,7 L160,3 L160,60 L0,60 Z" fill="url(#goodArea)"/>
                <path d="M0,55 L20,50 L40,44 L60,36 L80,27 L100,18 L120,12 L140,7 L160,3" fill="none" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" style={{ filter:"drop-shadow(0 0 4px rgba(0,255,136,.5))" }}/>
                {/* Highlight dot at peak */}
                <circle cx="160" cy="3" r="3" fill="#00ff88" style={{ filter:"drop-shadow(0 0 4px rgba(0,255,136,.8))" }}/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Visual Before/After Metric Bars ── */
function BeforeAfterBar({ label, before, after, beforeNum, afterNum, unit, suffix, dark }) {
  const mutedText = dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)";
  const lowerIsBetter = label === "CPA" || label === "Spend";
  const improvement = lowerIsBetter
    ? Math.round((1 - afterNum / beforeNum) * 100)
    : afterNum > beforeNum ? Math.round(((afterNum - beforeNum) / beforeNum) * 100) : 0;
  const beforePct = lowerIsBetter
    ? Math.round((afterNum / beforeNum) * 100)
    : Math.round((beforeNum / Math.max(afterNum, beforeNum)) * 100);

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
        <span style={{ fontSize:10, color:"rgba(255,100,100,.7)", fontWeight:600, minWidth:36, textAlign:"right" }}>WAS</span>
        <div style={{ flex:1, height:6, background:dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)", borderRadius:6, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${Math.max(beforePct, 5)}%`, background:"linear-gradient(90deg,rgba(255,100,100,.5),rgba(255,80,80,.3))", borderRadius:6, transition:"width 1.2s cubic-bezier(.22,1,.36,1)" }}/>
        </div>
        <span style={{ fontSize:11, color:"rgba(255,100,100,.9)", fontWeight:700, minWidth:64 }}>{unit}{before}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:10, color:G, fontWeight:600, minWidth:36, textAlign:"right" }}>NOW</span>
        <div style={{ flex:1, height:6, background:dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)", borderRadius:6, overflow:"hidden" }}>
          <div style={{ height:"100%", width:"100%", background:"linear-gradient(90deg,#00ff88,#00cc6a)", borderRadius:6, boxShadow:"0 0 8px rgba(0,255,136,.4)", transition:"width 1.4s cubic-bezier(.22,1,.36,1)" }}/>
        </div>
        <span style={{ fontSize:12, color:G, fontWeight:800, minWidth:64, textShadow:"0 0 8px rgba(0,255,136,.4)" }}>{unit}{after}</span>
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

/* ════════════════════════════════════
   CASE STUDIES LIST
════════════════════════════════════ */
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
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"1rem" }}>
                    <span style={{ background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.25)", borderRadius:100, padding:"3px 10px", fontSize:11, color:G, fontWeight:600 }}>{cs.category}</span>
                    {cs.tags.map(t => <span key={t} style={{ background:tagBg, border:`.5px solid ${tagBorder}`, borderRadius:100, padding:"3px 10px", fontSize:11, color:mutedText2 }}>{t}</span>)}
                    <span style={{ marginLeft:"auto", background:"rgba(0,255,136,.08)", border:".5px solid rgba(0,255,136,.2)", borderRadius:100, padding:"3px 10px", fontSize:11, color:G }}>{cs.timeframe}</span>
                  </div>
                  <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.1rem,4vw,1.5rem)", fontWeight:800, color:headingColor, marginBottom:".75rem", lineHeight:1.2, wordBreak:"break-word" }}>{cs.headline}</h2>
                  <p style={{ fontSize:"clamp(13px,3vw,14px)", color:mutedText, lineHeight:1.7, marginBottom:"1.5rem" }}>{cs.summary}</p>
                  {/* Mobile-safe result grid */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"clamp(6px,2vw,12px)", marginBottom:"1.2rem" }}>
                    {[cs.result1, cs.result2, cs.result3].map((r, j) => (
                      <div key={j} style={{ textAlign:"center", background:"rgba(0,255,136,.06)", border:".5px solid rgba(0,255,136,.18)", borderRadius:12, padding:"clamp(8px,2vw,14px) clamp(4px,2vw,10px)" }}>
                        <p style={{ fontSize:"clamp(9px,2vw,11px)", color:mutedText2, marginBottom:4, fontWeight:600, textTransform:"uppercase", letterSpacing:".04em" }}>{r.label}</p>
                        <p style={{ fontSize:"clamp(9px,2.5vw,12px)", color:"rgba(255,100,100,.8)", marginBottom:2, fontWeight:600 }}>{r.before}</p>
                        <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(11px,3vw,15px)", fontWeight:800, background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", wordBreak:"break-word" }}>{r.after}</p>
                      </div>
                    ))}
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

/* ════════════════════════════════════
   CASE STUDY DETAIL
════════════════════════════════════ */
export function CaseStudyDetail() {
  const { id }   = useParams();
  const { dark } = useTheme();
  const cs = CASE_STUDIES.find(c => c.id === id);

  const headingColor = dark ? "#fff"  : "#0a0a0a";
  const mutedText    = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const mutedText2   = dark ? "rgba(255,255,255,.3)"  : "rgba(0,0,0,.35)";
  const mutedText3   = dark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.58)";
  const cardBg       = dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))";
  const cardBorder   = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)";
  const tagBg        = dark ? "rgba(255,255,255,.05)"  : "rgba(0,0,0,.05)";
  const tagBorder    = dark ? "rgba(255,255,255,.1)"   : "rgba(0,0,0,.08)";
  const backLink     = dark ? "rgba(255,255,255,.4)"   : "rgba(0,0,0,.4)";

  if (!cs) return (
    <PageWrapper>
      <Section>
        <div style={{ textAlign:"center" }}>
          <h1 style={{ color:headingColor, fontFamily:"'Syne',sans-serif", fontSize:"2rem", marginBottom:"1rem" }}>Case study not found</h1>
          <Link to="/case-studies" className="btn-g" style={{ display:"inline-block" }}>← Back to case studies</Link>
        </div>
      </Section>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <section style={{ position:"relative", padding:"clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) 3rem", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:400, height:400, top:-80, left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
        <div style={{ maxWidth:820, margin:"0 auto", position:"relative", zIndex:1 }}>
          <ScrollReveal delay={0}>
            <Link to="/case-studies" style={{ display:"inline-flex", alignItems:"center", gap:6, color:backLink, textDecoration:"none", fontSize:13, marginBottom:"1.5rem", minHeight:44 }}>← Back to case studies</Link>
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

          {/* ── REAL VISUAL PROOF — Dashboard mockup ── */}
          <ScrollReveal delay={0}>
            <div style={{ marginBottom:"1.5rem" }}>
              <p style={{ fontSize:11, color:G, letterSpacing:".1em", textTransform:"uppercase", fontWeight:700, marginBottom:"1rem" }}>
                📱 Real Dashboard Comparison
              </p>
              <ShopifyDashboardMockup cs={cs} dark={dark}/>
            </div>
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
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(0,255,136,.15)", border:".5px solid rgba(0,255,136,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:G, flexShrink:0 }}>
                    {cs.clientName?.[0]}
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:headingColor, margin:0 }}>{cs.clientName}</p>
                    <p style={{ fontSize:11, color:mutedText2, margin:0 }}>{cs.clientRole}</p>
                  </div>
                  <div style={{ marginLeft:"auto", display:"flex", gap:2 }}>
                    {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize:13, color:"#FFD700" }}>★</span>)}
                  </div>
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