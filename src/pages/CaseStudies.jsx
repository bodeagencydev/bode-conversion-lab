import { Link, useParams } from "react-router-dom";
import { G, GG, CASE_STUDIES, BADGES } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles, useTheme } from "../components.jsx";
import { ScrollReveal, TiltCard, GlowBorder } from "../AnimationSystem.jsx";

/* ── PROOF PLACEHOLDER — swap src with real screenshots when ready ── */
const PROOF = {
  "marcus-fitness": {
    before: "/proof/marcus-before.png",
    after:  "/proof/marcus-after.png",
    caption: "Shopify Analytics — same traffic, 31× more revenue",
  },
  "priya-beauty": {
    before: "/proof/priya-before.png",
    after:  "/proof/priya-after.png",
    caption: "WooCommerce + Google Ads — CVR jump from 1.1% to 4.8%",
  },
  "tunde-fashion": {
    before: "/proof/tunde-before.png",
    after:  "/proof/tunde-after.png",
    caption: "Meta Ads Manager — ROAS from 0.9x to 4.3x in 60 days",
  },
};

function ProofPanel({ studyId, dark, mutedText, headingColor }) {
  const proof = PROOF[studyId];
  if (!proof) return null;

  const imgStyle = {
    width: "100%", height: "100%",
    objectFit: "cover", display: "block",
    borderRadius: 10,
  };

  const placeholderStyle = (isAfter) => ({
    width: "100%", aspectRatio: "16/9",
    borderRadius: 10,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 8,
    background: isAfter
      ? "rgba(0,255,136,.05)"
      : dark ? "rgba(255,255,255,.03)" : "rgba(26,20,8,.04)",
    border: isAfter
      ? ".5px solid rgba(0,255,136,.25)"
      : `.5px solid ${dark ? "rgba(255,255,255,.1)" : "rgba(26,20,8,.12)"}`,
  });

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* BEFORE */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF3B3B", flexShrink: 0 }}/>
            <span style={{ fontSize: 11, fontWeight: 700, color: headingColor, textTransform: "uppercase", letterSpacing: ".05em" }}>Before</span>
          </div>
          <div style={placeholderStyle(false)}>
            <img
              src={proof.before}
              alt="Before analytics"
              style={imgStyle}
              onError={e => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div style={{ display: "none", flexDirection: "column", alignItems: "center", gap: 6, padding: "2rem" }}>
              <span style={{ fontSize: 24 }}>📉</span>
              <span style={{ fontSize: 12, color: mutedText, textAlign: "center" }}>Before screenshot<br/>coming soon</span>
            </div>
          </div>
        </div>

        {/* AFTER */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: G, flexShrink: 0 }}/>
            <span style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: ".05em" }}>After</span>
          </div>
          <div style={placeholderStyle(true)}>
            <img
              src={proof.after}
              alt="After analytics"
              style={imgStyle}
              onError={e => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div style={{ display: "none", flexDirection: "column", alignItems: "center", gap: 6, padding: "2rem" }}>
              <span style={{ fontSize: 24 }}>📈</span>
              <span style={{ fontSize: 12, color: G, textAlign: "center" }}>After screenshot<br/>coming soon</span>
            </div>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: mutedText, marginTop: ".75rem", fontStyle: "italic", textAlign: "center" }}>
        📊 {proof.caption}
      </p>
    </div>
  );
}

export function CaseStudies() {
  const { dark } = useTheme();

  const headingColor = dark ? "#fff"                 : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.5)"  : "rgba(26,20,8,.65)";
  const mutedText2   = dark ? "rgba(255,255,255,.45)" : "rgba(26,20,8,.6)";
  const mutedText3   = dark ? "rgba(255,255,255,.35)" : "rgba(26,20,8,.5)";
  const cardBorder   = dark ? "rgba(255,255,255,.12)" : "rgba(26,20,8,.18)";

  return (
    <PageWrapper>

      {/* ── HERO ── */}
      <section style={{ position:"relative", padding:"7rem 2rem 5rem", overflow:"hidden" }}>
        <Particles />
        <div style={{ position:"absolute", width:600, height:600, top:-150, left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
        <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.28)", borderRadius:100, padding:"5px 16px", fontSize:11, color:G, fontWeight:600, letterSpacing:".05em", marginBottom:"1.6rem" }}>
            <span style={{ width:6, height:6, background:G, borderRadius:"50%", animation:"pulse 2s ease-in-out infinite" }}/> Validated proof
          </span>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(2.2rem,6vw,3.8rem)", fontWeight:800, lineHeight:1.08, letterSpacing:"-.03em", color:headingColor, marginBottom:"1.2rem" }}>
            Real stores.<br /><GradText>Real scaled revenue.</GradText>
          </h1>
          <p style={{ fontSize:"clamp(0.95rem,2vw,1.1rem)", color:mutedText2, lineHeight:1.8, maxWidth:520, margin:"0 auto" }}>
            Every number here came from a real store, a real audit, and a real system we built. No mock-ups. No projections.
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* ── BADGES ── */}
      <Section>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <p style={{ textAlign:"center", fontSize:11, color:mutedText3, letterSpacing:".1em", textTransform:"uppercase", fontWeight:700, marginBottom:"1.2rem" }}>
            Results delivered by
          </p>
          <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
            {BADGES.map((b, i) => (
              <div key={i} style={{ display:"inline-flex", alignItems:"center", gap:8, background:dark?"rgba(255,255,255,.04)":"rgba(255,255,255,.5)", border:dark?".5px solid rgba(255,255,255,.1)":`.5px solid rgba(26,20,8,.15)`, borderRadius:100, padding:".5rem 1.1rem" }}>
                <span style={{ fontSize:16 }}>{b.icon}</span>
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:headingColor, margin:0 }}>{b.title}</p>
                  <p style={{ fontSize:10, color:mutedText3, margin:0 }}>{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* ── CASE STUDIES ── */}
      <Section>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", flexDirection:"column", gap:"5rem" }}>
          {CASE_STUDIES.map((cs, index) => (
            <ScrollReveal key={cs.id} delay={index * 0.05}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"clamp(2rem,5vw,4rem)", alignItems:"flex-start" }} className="about-grid">

                {/* ── LEFT: Proof panel ── */}
                <TiltCard style={{ background:dark?"rgba(255,255,255,.02)":"rgba(255,255,255,.5)", border:`.5px solid ${cardBorder}`, borderRadius:20, padding:"1.8rem" }}>

                  {/* Result stats */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:"1.5rem" }}>
                    {[cs.result1, cs.result2, cs.result3].map((r, i) => (
                      <div key={i} style={{ background:dark?"rgba(255,255,255,.04)":"rgba(26,20,8,.04)", border:dark?".5px solid rgba(255,255,255,.08)":".5px solid rgba(26,20,8,.1)", borderRadius:12, padding:"1rem .75rem", textAlign:"center" }}>
                        <p style={{ fontSize:10, color:mutedText3, textTransform:"uppercase", letterSpacing:".05em", marginBottom:4 }}>{r.label}</p>
                        <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(.85rem,2vw,1.05rem)", fontWeight:800, background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", margin:0 }}>{r.after}</p>
                        <p style={{ fontSize:10, color:mutedText3, marginTop:2 }}>from {r.before}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:"1.2rem" }}>
                    {cs.tags.map((t, i) => (
                      <span key={i} style={{ background:"rgba(0,255,136,.08)", border:".5px solid rgba(0,255,136,.2)", borderRadius:100, padding:"3px 10px", fontSize:10, color:G, fontWeight:600 }}>{t}</span>
                    ))}
                    <span style={{ background:dark?"rgba(255,255,255,.05)":"rgba(26,20,8,.05)", border:dark?".5px solid rgba(255,255,255,.1)":".5px solid rgba(26,20,8,.1)", borderRadius:100, padding:"3px 10px", fontSize:10, color:mutedText3, fontWeight:500 }}>{cs.platform}</span>
                    <span style={{ background:dark?"rgba(255,255,255,.05)":"rgba(26,20,8,.05)", border:dark?".5px solid rgba(255,255,255,.1)":".5px solid rgba(26,20,8,.1)", borderRadius:100, padding:"3px 10px", fontSize:10, color:mutedText3, fontWeight:500 }}>{cs.timeframe}</span>
                  </div>

                  {/* Before/After proof */}
                  <ProofPanel studyId={cs.id} dark={dark} mutedText={mutedText} headingColor={headingColor} />

                </TiltCard>

                {/* ── RIGHT: Story ── */}
                <div>
                  <p style={{ fontSize:11, color:G, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", marginBottom:".6rem" }}>{cs.category}</p>
                  <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:800, color:headingColor, lineHeight:1.2, marginBottom:"1rem" }}>{cs.headline}</h2>
                  <p style={{ fontSize:15, color:mutedText, lineHeight:1.8, marginBottom:"1.8rem" }}>{cs.summary}</p>

                  {/* Story steps */}
                  <div style={{ display:"flex", flexDirection:"column", gap:"1.2rem", marginBottom:"2rem" }}>
                    {cs.story.map((s, i) => (
                      <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                        <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:G, flexShrink:0, fontFamily:"'Syne',sans-serif" }}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <p style={{ fontSize:13, fontWeight:700, color:headingColor, marginBottom:4 }}>{s.heading}</p>
                          <p style={{ fontSize:13, color:mutedText2, lineHeight:1.7 }}>{s.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Testimonial pull quote */}
                  <div style={{ background:dark?"rgba(0,255,136,.05)":"rgba(0,255,136,.06)", border:".5px solid rgba(0,255,136,.18)", borderLeft:`3px solid ${G}`, borderRadius:"0 12px 12px 0", padding:"1.2rem 1.4rem", marginBottom:"1.8rem" }}>
                    <p style={{ fontSize:14, color:mutedText, lineHeight:1.7, fontStyle:"italic", marginBottom:".6rem" }}>"{cs.testimonial}"</p>
                    <p style={{ fontSize:12, fontWeight:700, color:headingColor, margin:0 }}>{cs.clientName} <span style={{ color:mutedText3, fontWeight:400 }}>— {cs.clientRole}</span></p>
                  </div>

                  <Link to={`/case-studies/${cs.id}`} className="btn-ghost" style={{ display:"inline-block" }}>
                    Read full breakdown →
                  </Link>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <hr className="divider" />

      {/* ── BOTTOM CTA ── */}
      <Section style={{ paddingBottom:"8rem" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ background:"linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border:".5px solid rgba(0,255,136,.25)", borderTop:".5px solid rgba(0,255,136,.45)", borderRadius:24, padding:"clamp(2.5rem,5vw,4rem) clamp(1.5rem,4vw,3rem)", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)", pointerEvents:"none" }}/>
            <SectionLabel>Ready for results like these?</SectionLabel>
            <Heading size="2rem">Your store could be<br /><GradText>the next case study.</GradText></Heading>
            <p style={{ fontSize:15, color:mutedText2, lineHeight:1.75, margin:"1.5rem auto 2rem", maxWidth:420 }}>
              Apply for a free store audit. We'll find your biggest leaks and hand you the roadmap to fix them.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <Link to="/contact" className="btn-g" style={{ display:"inline-block" }}>Apply for your free audit →</Link>
              <Link to="/pricing" className="btn-ghost" style={{ display:"inline-block" }}>See pricing →</Link>
            </div>
          </div>
        </div>
      </Section>

    </PageWrapper>
  );
}

export function CaseStudyDetail() {
  const { id } = useParams();
  const { dark } = useTheme();
  const cs = CASE_STUDIES.find(item => item.id === id) || CASE_STUDIES[0];

  const headingColor = dark ? "#fff"                 : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.5)"  : "rgba(26,20,8,.65)";
  const mutedText2   = dark ? "rgba(255,255,255,.45)" : "rgba(26,20,8,.6)";
  const mutedText3   = dark ? "rgba(255,255,255,.35)" : "rgba(26,20,8,.5)";
  const cardBorder   = dark ? "rgba(255,255,255,.12)" : "rgba(26,20,8,.18)";

  return (
    <PageWrapper>
      <section style={{ padding:"7rem 2rem 4rem", position:"relative", overflow:"hidden" }}>
        <Particles />
        <div style={{ position:"absolute", width:400, height:400, top:-80, left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle,rgba(0,255,136,.1),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
        <div style={{ maxWidth:800, margin:"0 auto", position:"relative", zIndex:1 }}>
          <Link to="/case-studies" style={{ display:"inline-flex", alignItems:"center", gap:6, color:mutedText3, textDecoration:"none", fontSize:13, fontWeight:500, marginBottom:"2rem", transition:"color .2s" }}
            onMouseEnter={e => e.currentTarget.style.color=G}
            onMouseLeave={e => e.currentTarget.style.color=mutedText3}>
            ← All case studies
          </Link>
          <p style={{ fontSize:11, color:G, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", marginBottom:".6rem" }}>{cs.category}</p>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.8rem,5vw,2.8rem)", fontWeight:800, lineHeight:1.15, letterSpacing:"-.02em", color:headingColor, marginBottom:"1rem" }}>{cs.headline}</h1>

          {/* Meta row */}
          <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap", marginBottom:"2.5rem" }}>
            {[{l:"Platform", v:cs.platform},{l:"Timeframe", v:cs.timeframe},{l:"Ad spend", v:cs.adSpend}].map((m,i) => (
              <div key={i}>
                <p style={{ fontSize:10, color:mutedText3, textTransform:"uppercase", letterSpacing:".06em", margin:0 }}>{m.l}</p>
                <p style={{ fontSize:14, fontWeight:700, color:headingColor, margin:0 }}>{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      <Section>
        <div style={{ maxWidth:800, margin:"0 auto" }}>

          {/* Result cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"3rem" }} className="stat-grid">
            {[cs.result1, cs.result2, cs.result3].map((r, i) => (
              <div key={i} className="stat-card">
                <p style={{ fontSize:10, color:mutedText3, textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>{r.label}</p>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.4rem,4vw,1.8rem)", fontWeight:800, background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1, marginBottom:4 }}>{r.after}</p>
                <p style={{ fontSize:12, color:mutedText3 }}>from {r.before}</p>
              </div>
            ))}
          </div>

          {/* Before/After proof */}
          <ProofPanel studyId={cs.id} dark={dark} mutedText={mutedText} headingColor={headingColor} />

          {/* Story */}
          <div style={{ display:"flex", flexDirection:"column", gap:"2.5rem", marginTop:"3rem" }}>
            {cs.story.map((s, i) => (
              <div key={i} style={{ borderLeft:`2px solid rgba(0,255,136,.3)`, paddingLeft:"1.5rem" }}>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:headingColor, marginBottom:".75rem" }}>{s.heading}</h2>
                <p style={{ fontSize:15, color:mutedText, lineHeight:1.9 }}>{s.body}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div style={{ background:dark?"rgba(0,255,136,.05)":"rgba(0,255,136,.06)", border:".5px solid rgba(0,255,136,.18)", borderLeft:`3px solid ${G}`, borderRadius:"0 16px 16px 0", padding:"1.8rem 2rem", margin:"3rem 0" }}>
            <p style={{ fontSize:16, color:mutedText, lineHeight:1.75, fontStyle:"italic", marginBottom:"1rem" }}>"{cs.testimonial}"</p>
            <p style={{ fontSize:13, fontWeight:700, color:headingColor, margin:0 }}>{cs.clientName} <span style={{ color:mutedText3, fontWeight:400 }}>— {cs.clientRole}</span></p>
          </div>

          {/* Tags */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"3rem" }}>
            {cs.tags.map((t, i) => (
              <span key={i} style={{ background:"rgba(0,255,136,.08)", border:".5px solid rgba(0,255,136,.2)", borderRadius:100, padding:"4px 12px", fontSize:11, color:G, fontWeight:600 }}>{t}</span>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background:"linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border:".5px solid rgba(0,255,136,.25)", borderTop:".5px solid rgba(0,255,136,.45)", borderRadius:20, padding:"2.5rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)", pointerEvents:"none" }}/>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.4rem", fontWeight:800, color:headingColor, marginBottom:".75rem" }}>Want results like {cs.clientName}?</h3>
            <p style={{ fontSize:14, color:mutedText2, lineHeight:1.7, maxWidth:400, margin:"0 auto 1.5rem" }}>
              Apply for a free store audit. We'll find your biggest leaks and show you exactly how to fix them.
            </p>
            <div style={{ display:"flex", justifyContent:"center" }}>
              <Link to="/contact" className="btn-g" style={{ display:"inline-block" }}>Apply for your free audit →</Link>
            </div>
          </div>

        </div>
      </Section>
    </PageWrapper>
  );
}