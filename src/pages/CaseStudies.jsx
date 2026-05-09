import { Link, useParams } from "react-router-dom";
import { G, GG, CASE_STUDIES, BADGES } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles, useTheme } from "../components.jsx";
import { ScrollReveal, TiltCard, MaskedHeading, GlowBorder } from "../AnimationSystem.jsx";

/* ── Visual Before/After Bar ── */
function BeforeAfterBar({ label, before, after, beforeNum, afterNum, unit, suffix, dark }) {
  const mutedText = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const headingColor = dark ? "#fff" : "#0a0a0a";
  // For CPA lower is better, for everything else higher is better
  const lowerIsBetter = label === "CPA";
  const improvement = lowerIsBetter
    ? Math.round((1 - afterNum / beforeNum) * 100)
    : Math.round(((afterNum - beforeNum) / beforeNum) * 100);

  const beforePct = lowerIsBetter
    ? (afterNum / beforeNum) * 100
    : (beforeNum / afterNum) * 100;

  return (
    <div style={{ marginBottom:"1.2rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".5rem" }}>
        <span style={{ fontSize:12, color:mutedText, fontWeight:600, textTransform:"uppercase", letterSpacing:".06em" }}>{label}</span>
        <span style={{ fontSize:11, background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.3)", borderRadius:100, padding:"2px 8px", color:G, fontWeight:700 }}>
          {lowerIsBetter ? "−" : "+"}{Math.abs(improvement)}%
        </span>
      </div>
      {/* Before bar */}
      <div style={{ marginBottom:6 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
          <span style={{ fontSize:11, color:"rgba(255,100,100,.7)", fontWeight:600 }}>BEFORE</span>
          <span style={{ fontSize:12, color:"rgba(255,100,100,.9)", fontWeight:700 }}>{unit}{before}{suffix?.replace("/mo","")}</span>
        </div>
        <div style={{ height:8, background:dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)", borderRadius:8, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${beforePct}%`, background:"linear-gradient(90deg,rgba(255,100,100,.5),rgba(255,100,100,.3))", borderRadius:8, transition:"width 1.2s cubic-bezier(.22,1,.36,1)" }}/>
        </div>
      </div>
      {/* After bar */}
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
          <span style={{ fontSize:11, color:G, fontWeight:600 }}>AFTER</span>
          <span style={{ fontSize:13, color:G, fontWeight:800 }}>{unit}{after}{suffix?.replace("/mo","")}</span>
        </div>
        <div style={{ height:8, background:dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)", borderRadius:8, overflow:"hidden" }}>
          <div style={{ height:"100%", width:"100%", background:`linear-gradient(90deg,#00ff88,#00cc6a)`, borderRadius:8, boxShadow:"0 0 8px rgba(0,255,136,.4)", transition:"width 1.4s cubic-bezier(.22,1,.36,1)" }}/>
        </div>
      </div>
    </div>
  );
}

/* ── Revenue Chart Visual ── */
function RevenueChart({ before, after, dark }) {
  const max = after;
  const beforeH = Math.round((before / max) * 100);
  const mutedText = dark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.3)";

  const months = [
    { label:"Month 1", val:before * 1.4,  active:false },
    { label:"Month 2", val:before * 2.2,  active:false },
    { label:"Month 3", val:after,          active:true  },
  ];

  return (
    <div style={{ padding:"1.2rem", background:dark?"rgba(255,255,255,.03)":"rgba(0,0,0,.02)", border:dark?".5px solid rgba(255,255,255,.08)":".5px solid rgba(0,0,0,.07)", borderRadius:14 }}>
      <p style={{ fontSize:10, color:mutedText, textTransform:"uppercase", letterSpacing:".1em", fontWeight:600, marginBottom:"1rem" }}>Revenue Trajectory</p>
      <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:80 }}>
        {/* Baseline */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flex:1 }}>
          <div style={{ width:"100%", background:"rgba(255,100,100,.3)", borderRadius:"4px 4px 0 0", height:`${beforeH}%`, minHeight:8, border:".5px solid rgba(255,100,100,.4)", transition:"height 1s cubic-bezier(.22,1,.36,1)" }}/>
          <span style={{ fontSize:9, color:mutedText, textAlign:"center" }}>Before</span>
        </div>
        {months.map((m, i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flex:1 }}>
            <div style={{ width:"100%", background:m.active?"linear-gradient(180deg,#00ff88,#00cc6a)":"rgba(0,255,136,.25)", borderRadius:"4px 4px 0 0", height:`${Math.round((m.val/max)*100)}%`, minHeight:8, boxShadow:m.active?"0 0 12px rgba(0,255,136,.5)":"none", transition:`height ${1+i*.2}s cubic-bezier(.22,1,.36,1)` }}/>
            <span style={{ fontSize:9, color:m.active?G:mutedText, textAlign:"center", fontWeight:m.active?700:400 }}>{m.label}</span>
          </div>
        ))}
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
        <ScrollReveal key={i} delay={i * 0.08}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 14px", background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.03)", border:`.5px solid ${b.color}33`, borderRadius:12, transition:"all .3s cubic-bezier(.22,1,.36,1)", minHeight:44 }}
            onMouseEnter={e => { e.currentTarget.style.background=`${b.color}11`; e.currentTarget.style.borderColor=`${b.color}66`; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 8px 24px ${b.color}18`; }}
            onMouseLeave={e => { e.currentTarget.style.background=dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.03)"; e.currentTarget.style.borderColor=`${b.color}33`; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
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
  const cardBg       = dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))";
  const cardBorder   = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)";
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
              Real stores. Real problems. Real results. No cherry-picked metrics — these are the full transformations.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CREDIBILITY BADGES ── */}
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
                  {/* Tags */}
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"1rem" }}>
                    <span style={{ background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.25)", borderRadius:100, padding:"3px 10px", fontSize:11, color:G, fontWeight:600 }}>{cs.category}</span>
                    {cs.tags.map(t => <span key={t} style={{ background:tagBg, border:`.5px solid ${tagBorder}`, borderRadius:100, padding:"3px 10px", fontSize:11, color:mutedText2 }}>{t}</span>)}
                    <span style={{ marginLeft:"auto", background:"rgba(0,255,136,.08)", border:".5px solid rgba(0,255,136,.2)", borderRadius:100, padding:"3px 10px", fontSize:11, color:G }}>{cs.timeframe}</span>
                  </div>

                  <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.1rem,4vw,1.5rem)", fontWeight:800, color:headingColor, marginBottom:".75rem", lineHeight:1.2, wordBreak:"break-word" }}>{cs.headline}</h2>
                  <p style={{ fontSize:"clamp(13px,3vw,14px)", color:mutedText, lineHeight:1.7, marginBottom:"1.5rem" }}>{cs.summary}</p>

                  {/* ── RESULT CARDS — stacked on mobile, 3-col on desktop ── */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"clamp(6px,2vw,12px)", marginBottom:"1.2rem" }}>
                    {[cs.result1, cs.result2, cs.result3].map((r, j) => (
                      <div key={j} style={{ textAlign:"center", background:"rgba(0,255,136,.06)", border:".5px solid rgba(0,255,136,.18)", borderRadius:12, padding:"clamp(8px,2vw,14px) clamp(6px,2vw,12px)" }}>
                        <p style={{ fontSize:"clamp(9px,2vw,11px)", color:mutedText2, marginBottom:4, fontWeight:600, textTransform:"uppercase", letterSpacing:".04em" }}>{r.label}</p>
                        <p style={{ fontSize:"clamp(10px,2.5vw,12px)", color:"rgba(255,100,100,.8)", marginBottom:2, fontWeight:600 }}>{r.before}</p>
                        <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(11px,3vw,15px)", fontWeight:800, background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{r.after}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display:"flex", alignItems:"center", gap:6, color:G, fontSize:13, fontWeight:600 }}>
                    Read full case study <span style={{ fontSize:16 }}>→</span>
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
   CASE STUDY DETAIL — fixed mobile layout + visual proof
════════════════════════════════════ */
export function CaseStudyDetail() {
  const { id } = useParams();
  const { dark } = useTheme();
  const cs = CASE_STUDIES.find(c => c.id === id);

  const headingColor = dark ? "#fff" : "#0a0a0a";
  const mutedText    = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const mutedText2   = dark ? "rgba(255,255,255,.3)"  : "rgba(0,0,0,.35)";
  const mutedText3   = dark ? "rgba(255,255,255,.5)"  : "rgba(0,0,0,.55)";
  const cardBg       = dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))";
  const cardBorder   = dark ? "rgba(255,255,255,.12)"  : "rgba(0,0,0,.1)";
  const tagBg        = dark ? "rgba(255,255,255,.05)"  : "rgba(0,0,0,.05)";
  const tagBorder    = dark ? "rgba(255,255,255,.1)"   : "rgba(0,0,0,.08)";
  const backLink     = dark ? "rgba(255,255,255,.4)"   : "rgba(0,0,0,.4)";

  if (!cs) return (
    <PageWrapper>
      <Section>
        <div style={{ textAlign:"center" }}>
          <h1 style={{ color:headingColor, fontFamily:"'Syne',sans-serif", fontSize:"2rem", marginBottom:"1rem" }}>Case study not found</h1>
          <p style={{ color:mutedText, marginBottom:"2rem" }}>That case study doesn't exist. Try one of the links below.</p>
          <Link to="/case-studies" className="btn-g" style={{ display:"inline-block" }}>← Back to case studies</Link>
        </div>
      </Section>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      {/* ── HERO ── */}
      <section style={{ position:"relative", padding:"clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) 3rem", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:400, height:400, top:-80, left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
        <div style={{ maxWidth:800, margin:"0 auto", position:"relative", zIndex:1 }}>
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

          {/* Meta info row */}
          <ScrollReveal delay={0.6}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {[
                { icon:"⏱", label:"Timeframe", val:cs.timeframe },
                { icon:"🛒", label:"Platform",  val:cs.platform },
                { icon:"💸", label:"Ad Spend",  val:cs.adSpend },
              ].map((m, i) => (
                <div key={i} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 12px", background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)", border:dark?".5px solid rgba(255,255,255,.08)":".5px solid rgba(0,0,0,.07)", borderRadius:10 }}>
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
        <div style={{ maxWidth:800, margin:"0 auto" }}>

          {/* ── VISUAL BEFORE/AFTER RESULTS ── */}
          <ScrollReveal delay={0}>
            <div style={{ background:cardBg, border:`.5px solid ${cardBorder}`, borderTop:".5px solid rgba(0,255,136,.3)", borderRadius:20, padding:"clamp(1.2rem,4vw,2rem)", marginBottom:"2rem", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.4),transparent)" }}/>
              <p style={{ fontSize:11, color:G, letterSpacing:".1em", textTransform:"uppercase", fontWeight:700, marginBottom:"1.2rem" }}>📊 Visual Results Breakdown</p>
              <BeforeAfterBar dark={dark} label={cs.result1.label} before={cs.result1.before} after={cs.result1.after} beforeNum={cs.result1.beforeNum} afterNum={cs.result1.afterNum} unit={cs.result1.unit} suffix={cs.result1.suffix}/>
              <BeforeAfterBar dark={dark} label={cs.result2.label} before={cs.result2.before} after={cs.result2.after} beforeNum={cs.result2.beforeNum} afterNum={cs.result2.afterNum} unit={cs.result2.unit} suffix={cs.result2.suffix}/>
              <BeforeAfterBar dark={dark} label={cs.result3.label} before={cs.result3.before} after={cs.result3.after} beforeNum={cs.result3.beforeNum} afterNum={cs.result3.afterNum} unit={cs.result3.unit} suffix={cs.result3.suffix}/>
            </div>
          </ScrollReveal>

          {/* ── REVENUE CHART ── */}
          {cs.result1.label === "Revenue" && (
            <ScrollReveal delay={0.1}>
              <div style={{ marginBottom:"2rem" }}>
                <RevenueChart before={cs.result1.beforeNum} after={cs.result1.afterNum} dark={dark}/>
              </div>
            </ScrollReveal>
          )}

          {/* ── TESTIMONIAL QUOTE ── */}
          {cs.testimonial && (
            <ScrollReveal delay={0.15}>
              <div style={{ background:"linear-gradient(135deg,rgba(0,255,136,.06),rgba(0,204,106,.02))", border:".5px solid rgba(0,255,136,.2)", borderLeft:"3px solid rgba(0,255,136,.5)", borderRadius:16, padding:"1.5rem", marginBottom:"2rem" }}>
                <p style={{ fontSize:"clamp(14px,3vw,16px)", color:dark?"rgba(255,255,255,.75)":"rgba(0,0,0,.72)", lineHeight:1.8, fontStyle:"italic", marginBottom:"1rem" }}>
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
                    {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize:12, color:"#FFD700" }}>★</span>)}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* ── STORY ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:"2rem", marginBottom:"3rem" }}>
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
              <p style={{ fontSize:11, color:mutedText2, textTransform:"uppercase", letterSpacing:".1em", fontWeight:600, marginBottom:"1rem", textAlign:"center" }}>Delivered by a certified team</p>
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