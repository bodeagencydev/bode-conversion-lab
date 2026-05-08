import { Link } from "react-router-dom";
import { G, GG, TESTIMONIALS, ECOM_PLATFORMS, AD_PLATFORMS, PARTNERS, VIDEO_TIPS } from "../data.js";
import { Particles, Typewriter, ContinuousTicker, TestimonialTicker, VideoTips, PartnerCard, Section, SectionLabel, Heading, GradText, useInView, useTheme, PageWrapper } from "../components.jsx";
import { ScrollReveal, TiltCard, Magnetic, GlowBorder, SpringCounter, MaskedHeading, ParallaxGrid } from "../AnimationSystem.jsx";

export default function Home() {
  const { dark } = useTheme();
  const [statsRef, statsInView] = useInView(0.2);

  const mutedText    = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const mutedText2   = dark ? "rgba(255,255,255,.4)"  : "rgba(0,0,0,.4)";
  const mutedText3   = dark ? "rgba(255,255,255,.3)"  : "rgba(0,0,0,.35)";
  const borderCol    = dark ? "rgba(255,255,255,.06)"  : "rgba(0,0,0,.08)";
  const tickerBg     = dark ? "rgba(255,255,255,.01)"  : "rgba(0,0,0,.02)";
  const headingColor = dark ? "#fff" : "#0a0a0a";

  return (
    <PageWrapper>

      {/* ── HERO ── */}
      <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"clamp(5rem,10vw,8rem) clamp(1rem,4vw,2rem) 4rem", overflow:"hidden" }}>
        <Particles />
        <ParallaxGrid />

        {/* Radial glow */}
        <div style={{ position:"absolute", width:"min(700px,100%)", height:"min(700px,100vw)", top:-200, left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle at 40% 40%,rgba(0,255,136,.18),rgba(0,180,80,.05) 55%,transparent 75%)", borderRadius:"50%", pointerEvents:"none" }}/>

        {/* Scan line */}
        <div style={{ position:"absolute", left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.7),transparent)", animation:"scan 5s ease-in-out infinite", pointerEvents:"none" }}/>

        {/* Floating shapes */}
        <div className="float-shape" style={{ position:"absolute", top:"13%", right:"5%", width:90, height:90, borderRadius:"50%", background:"radial-gradient(circle at 33% 28%,rgba(0,255,136,.85),rgba(0,180,80,.3) 45%,transparent 70%)", boxShadow:"inset -14px -14px 28px rgba(0,0,0,.55),inset 8px 8px 20px rgba(0,255,136,.28),0 0 40px rgba(0,255,136,.2)", animation:"float1 7s ease-in-out infinite", pointerEvents:"none" }}/>
        <div className="float-shape" style={{ position:"absolute", bottom:"22%", left:"4%", width:65, height:65, background:"linear-gradient(135deg,rgba(0,255,136,.14),rgba(0,204,106,.04))", border:".5px solid rgba(0,255,136,.28)", borderRadius:14, animation:"float2 9s ease-in-out infinite", pointerEvents:"none" }}/>
        <div className="float-shape" style={{ position:"absolute", top:"32%", left:"6%", width:72, height:72, borderRadius:"50%", border:"1.5px solid rgba(0,255,136,.2)", animation:"float1 11s ease-in-out infinite 2s", pointerEvents:"none" }}/>

        <div style={{ maxWidth:780, textAlign:"center", position:"relative", zIndex:1, width:"100%" }}>

          {/* Badge */}
          <ScrollReveal delay={0}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.28)", borderRadius:100, padding:"5px 14px", fontSize:11, color:G, fontWeight:500, letterSpacing:".04em", marginBottom:"1.4rem" }}>
              <span style={{ width:6, height:6, background:G, borderRadius:"50%", animation:"pulse 2s ease-in-out infinite" }}/>
              Store Optimization & Ads Engineering
            </span>
          </ScrollReveal>

          {/* ── MASKED STAGGER HEADLINE ── */}
          <div style={{ marginBottom:"1.2rem", marginTop:"1rem" }}>
            <MaskedHeading
              text="We turn your store into a"
              tag="h1"
              className="hero-t"
              delay={0.1}
              stagger={0.06}
              style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(2rem,5vw,3.7rem)", fontWeight:800, lineHeight:1.07, letterSpacing:"-.03em", color:headingColor, wordBreak:"break-word", justifyContent:"center" }}
            />
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(2rem,5vw,3.7rem)", fontWeight:800, lineHeight:1.07, letterSpacing:"-.03em", color:headingColor, animation:"heroFadeUp .8s .5s ease both", animationFillMode:"forwards", opacity:0 }}>
              <Typewriter words={["revenue machine.", "conversion engine.", "ROAS monster.", "scaling system."]} />
            </div>
          </div>

          <ScrollReveal delay={0.3}>
            <p style={{ fontSize:"clamp(0.9rem,2vw,1.05rem)", color:mutedText, lineHeight:1.75, maxWidth:540, margin:"0 auto 2rem" }}>
              Bode Conversion Lab engineers your ROAS from the ground up — ads, landing pages, checkout. One system. Compounding results every month.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:"3.5rem" }}>
              <Magnetic>
                <Link to="/audit" className="btn-g" data-cursor="Audit">See if your store qualifies →</Link>
              </Magnetic>
              <Magnetic>
                <Link to="/case-studies" className="btn-ghost">View client results</Link>
              </Magnetic>
            </div>
          </ScrollReveal>

          {/* Hero stat cards */}
          <ScrollReveal delay={0.5}>
            <div className="hero-cards" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
              {[
                { n:"70x", l:"Revenue growth\nin 90 days" },
                { n:"4x+", l:"Average ROAS\nimprovement" },
                { n:"$0",  l:"Extra ad spend\nrequired" },
              ].map((c, i) => (
                <TiltCard key={i} style={{ background:"linear-gradient(135deg,rgba(0,255,136,.09),rgba(0,204,106,.03))", border:".5px solid rgba(0,255,136,.22)", borderTop:".5px solid rgba(0,255,136,.38)", borderRadius:16, padding:"1.3rem 1rem", textAlign:"center" }}>
                  <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)" }}/>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.4rem,4vw,1.9rem)", fontWeight:800, background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1.1, marginBottom:6 }}>{c.n}</div>
                  <div style={{ fontSize:11, color:mutedText2, lineHeight:1.5, whiteSpace:"pre-line" }}>{c.l}</div>
                </TiltCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── TICKERS ── */}
      <div style={{ borderTop:`.5px solid ${borderCol}`, borderBottom:`.5px solid ${borderCol}`, background:tickerBg, padding:"1rem 0" }}>
        <p style={{ textAlign:"center", fontSize:11, color:mutedText3, letterSpacing:".1em", textTransform:"uppercase", marginBottom:".8rem" }}>Trusted by stores on</p>
        <ContinuousTicker items={ECOM_PLATFORMS} speed={30} />
      </div>
      <div style={{ borderBottom:`.5px solid ${borderCol}`, background:tickerBg, padding:"1rem 0" }}>
        <p style={{ textAlign:"center", fontSize:11, color:mutedText3, letterSpacing:".1em", textTransform:"uppercase", marginBottom:".8rem" }}>We run ads on</p>
        <ContinuousTicker items={AD_PLATFORMS} speed={25} reverse={true} />
      </div>

      {/* ── STATS — Spring Counter ── */}
      <Section id="results">
        <div ref={statsRef} style={{ maxWidth:960, margin:"0 auto" }}>
          <ScrollReveal delay={0}>
            <div style={{ textAlign:"center", marginBottom:"3rem" }}>
              <SectionLabel>Proven results</SectionLabel>
              <Heading size="2.4rem">Same product. Same budget.<br /><GradText>70x the revenue.</GradText></Heading>
            </div>
          </ScrollReveal>
          <div className="stat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem" }}>
            {[
              { n:70,  s:"x",   l:"Revenue multiplier" },
              { n:90,  s:" days", l:"Time to results" },
              { n:4,   s:"x+",  l:"ROAS improvement" },
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.12}>
                <div className="stat-card">
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(2rem,5vw,3rem)", fontWeight:800, background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1, marginBottom:8 }}>
                    {/* Spring physics counter — stiffness:100, damping:10 */}
                    {statsInView
                      ? <SpringCounter to={s.n} suffix={s.s} stiffness={100} damping={10} />
                      : `0${s.s}`}
                  </div>
                  <p style={{ fontSize:14, color:mutedText2 }}>{s.l}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* ── HOW IT WORKS ── */}
      <Section id="how">
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <ScrollReveal delay={0}>
            <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
              <SectionLabel>The system</SectionLabel>
              <Heading size="2.4rem">We don't run ads.<br /><GradText>We engineer ROAS.</GradText></Heading>
            </div>
          </ScrollReveal>
          <div className="how-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"1.5rem" }}>
            {[
              { n:"01", t:"Deep-dive audit",         d:"We dissect your store, ads, and full funnel. Every leak, every friction point, every missed dollar — mapped in 48 hours." },
              { n:"02", t:"Conversion architecture", d:"We rebuild your pages with one goal: turning browsers into buyers using the traffic you already have." },
              { n:"03", t:"Ad engineering",          d:"Precision creatives, copy and targeting built around your customer's real pain points. Every ad compounds." },
              { n:"04", t:"Scale & compound",        d:"Once ROAS target is hit, we scale. Same efficiency, more budget. $1k/mo becomes $70k/mo." },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <TiltCard className="glass" style={{ padding:"2.5rem", height:"100%" }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.8rem", fontWeight:800, background:"linear-gradient(135deg,rgba(0,255,136,.55),rgba(0,255,136,.15))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", marginBottom:".75rem" }}>{item.n}</div>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.15rem", fontWeight:700, marginBottom:".6rem", color:headingColor }}>{item.t}</h3>
                  <p style={{ fontSize:14, color:mutedText, lineHeight:1.75 }}>{item.d}</p>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* ── TESTIMONIALS ── */}
      <Section id="testimonials">
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <ScrollReveal delay={0}>
            <div style={{ textAlign:"center", marginBottom:"3rem" }}>
              <SectionLabel>Client results</SectionLabel>
              <Heading size="2.4rem">Real stores. <GradText>Real numbers.</GradText></Heading>
              <p style={{ fontSize:13, color:mutedText3, marginTop:".75rem" }}>Hover to pause · scroll to see more</p>
            </div>
          </ScrollReveal>
          <TestimonialTicker items={TESTIMONIALS} />
          <ScrollReveal delay={0.1}>
            <div style={{ textAlign:"center", marginTop:"2.5rem" }}>
              <Magnetic>
                <Link to="/case-studies" className="btn-ghost">Read full case studies →</Link>
              </Magnetic>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <hr className="divider" />

      {/* ── VIDEO TIPS ── */}
      <Section id="tips">
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <ScrollReveal delay={0}>
            <div style={{ textAlign:"center", marginBottom:"3rem" }}>
              <SectionLabel>Free tips & insights</SectionLabel>
              <Heading size="2.4rem">Learn from the <GradText>lab</GradText></Heading>
              <p style={{ fontSize:14, color:mutedText2, marginTop:".75rem" }}>Scroll through for free tips and insights from the lab.</p>
            </div>
          </ScrollReveal>
          <VideoTips items={VIDEO_TIPS} />
        </div>
      </Section>

      <hr className="divider" />

      {/* ── PARTNERS ── */}
      <Section>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <ScrollReveal delay={0}>
            <div style={{ textAlign:"center", marginBottom:"3rem" }}>
              <SectionLabel>Official partnerships</SectionLabel>
              <Heading size="2.2rem">Platform <GradText>partners</GradText></Heading>
            </div>
          </ScrollReveal>
          <div className="partner-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem" }}>
            {PARTNERS.map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <PartnerCard partner={p} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* ── CTA BANNER ── */}
      <Section>
        <ScrollReveal delay={0}>
          <div style={{ maxWidth:760, margin:"0 auto", textAlign:"center" }}>
            <GlowBorder
              style={{ background:"linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border:".5px solid rgba(0,255,136,.25)", borderRadius:24, padding:"clamp(2.5rem,5vw,5rem) clamp(1.5rem,4vw,3rem)" }}>
              <SectionLabel>Ready to scale?</SectionLabel>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.6rem,4vw,2.8rem)", fontWeight:800, letterSpacing:"-.02em", color:headingColor, lineHeight:1.2, wordBreak:"break-word", overflowWrap:"break-word" }}>
                Stop burning money.<br /><GradText>Start compounding it.</GradText>
              </h2>
              <p style={{ fontSize:"clamp(0.9rem,2vw,1rem)", color:mutedText, lineHeight:1.7, margin:"1.5rem auto", maxWidth:480 }}>
                Join stores that went from struggling to scaling. Get your free store audit today — no commitment needed.
              </p>
              <Magnetic>
                {/* ✅ Points to /audit */}
                <Link to="/audit" className="btn-g" style={{ display:"inline-block" }} data-cursor="Audit">
                  Apply for your free audit →
                </Link>
              </Magnetic>
            </GlowBorder>
          </div>
        </ScrollReveal>
      </Section>

    </PageWrapper>
  );
}