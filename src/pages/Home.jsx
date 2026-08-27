import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { G, GG, TESTIMONIALS, ECOM_PLATFORMS, AD_PLATFORMS, PARTNERS, VIDEO_TIPS } from "../data.js";
import { Typewriter, ContinuousTicker, TestimonialTicker, VideoTips, PartnerCard, Section, SectionLabel, Heading, GradText, useInView, useTheme, PageWrapper, SEO } from "../components.jsx";
import { ScrollReveal, TiltCard, Magnetic, GlowBorder, SpringCounter, MaskedHeading, ParallaxGrid } from "../AnimationSystem.jsx";

const REDESIGN_DEADLINE_KEY = "bcl_redesign_deadline";
const REDESIGN_STATUS_KEY = "bcl_redesign_status"; // 'active' | 'expired' | 'gone'
const REDESIGN_CODE_KEY = "bcl_redesign_code";
const OFFER_WINDOW_MS = 48 * 60 * 60 * 1000; // 48 hours — one shot per visitor, never resets

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let out = "SRS-";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function FreeRedesignOffer() {
  const [status, setStatus] = useState(null); // null while loading from localStorage
  const [timeLeft, setTimeLeft] = useState("48:00:00");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let deadline = Number(localStorage.getItem(REDESIGN_DEADLINE_KEY));
    let savedStatus = localStorage.getItem(REDESIGN_STATUS_KEY);
    let savedCode = localStorage.getItem(REDESIGN_CODE_KEY);

    if (!deadline) {
      deadline = Date.now() + OFFER_WINDOW_MS;
      savedCode = generateCode();
      localStorage.setItem(REDESIGN_DEADLINE_KEY, String(deadline));
      localStorage.setItem(REDESIGN_CODE_KEY, savedCode);
      savedStatus = "active";
      localStorage.setItem(REDESIGN_STATUS_KEY, "active");
    }
    if (!savedStatus) savedStatus = "active";
    if (!savedCode) { savedCode = generateCode(); localStorage.setItem(REDESIGN_CODE_KEY, savedCode); }

    setCode(savedCode);
    setStatus(savedStatus);

    if (savedStatus === "active") {
      const tick = () => {
        const remaining = deadline - Date.now();
        if (remaining <= 0) {
          localStorage.setItem(REDESIGN_STATUS_KEY, "expired");
          setStatus("expired");
        } else {
          const totalSec = Math.floor(remaining / 1000);
          const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
          const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
          const sec = String(totalSec % 60).padStart(2, "0");
          setTimeLeft(`${h}:${m}:${sec}`);
        }
      };
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }
  }, []);

  function handleCancel() {
    localStorage.setItem(REDESIGN_STATUS_KEY, "gone");
    setStatus("gone");
  }

  function handleDismissExpired() {
    localStorage.setItem(REDESIGN_STATUS_KEY, "gone");
    setStatus("gone");
  }

  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (status === null || status === "gone") return null;

  const mutedText = "rgba(255,255,255,.65)";

  if (status === "expired") {
    return (
      <div style={{
        position: "sticky", top: 60, zIndex: 900, width: "100%",
        background: "linear-gradient(90deg, rgba(255,90,90,.15), rgba(255,90,90,.08))",
        borderBottom: "1px solid rgba(255,90,90,.3)", padding: "12px clamp(1rem,4vw,2rem)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap", textAlign: "center",
      }}>
        <span style={{ fontSize: 13, color: "#fff" }}>
          <strong style={{ color: "#FF5A5A" }}>Offer expired</strong> — you missed your free redesign consultation window. It won't return for this browser.
        </span>
        <button
          onClick={handleDismissExpired}
          style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: "sticky", top: 60, zIndex: 900, width: "100%",
      background: "linear-gradient(90deg, rgba(0,255,136,.16), rgba(0,255,136,.08))",
      borderBottom: "1px solid rgba(0,255,136,.35)", padding: "10px clamp(1rem,4vw,2rem)",
      display: "flex", alignItems: "center", justifyContent: "center", gap: "1.2rem", flexWrap: "wrap",
    }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
        🎁 Free Website Redesign Consultation
      </span>

      <span style={{ display: "inline-flex", gap: 6, alignItems: "center", background: "rgba(0,0,0,.35)", borderRadius: 8, padding: "5px 12px" }}>
        <span style={{ fontSize: 11, color: mutedText }}>Ends in</span>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: "#00D97E" }}>{timeLeft}</span>
      </span>

      <span style={{ display: "inline-flex", gap: 6, alignItems: "center", background: "rgba(0,0,0,.35)", borderRadius: 8, padding: "5px 8px 5px 12px" }}>
        <span style={{ fontSize: 11, color: mutedText }}>Your code:</span>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: ".03em" }}>{code}</span>
        <button
          onClick={copyCode}
          style={{ padding: "3px 10px", borderRadius: 6, border: "none", background: copied ? "#00D97E" : "rgba(255,255,255,.12)", color: copied ? "#0A0A0A" : "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </span>

      <a
        href={"https://wa.me/19454076473?text=" + encodeURIComponent(`Hi! I'd like to claim my free redesign consultation. My code: ${code}`)}
        target="_blank" rel="noopener noreferrer"
        style={{ padding: "6px 16px", borderRadius: 8, background: "#00FF88", color: "#0A0A0A", fontWeight: 700, fontSize: 12, textDecoration: "none", whiteSpace: "nowrap" }}
      >
        Claim on WhatsApp →
      </a>

      <a
        href={`mailto:bodeagencyofficial@gmail.com?subject=${encodeURIComponent("Claim my free redesign consultation")}&body=${encodeURIComponent(`My code: ${code}`)}`}
        style={{ fontSize: 12, color: mutedText, textDecoration: "underline", whiteSpace: "nowrap" }}
      >
        or email us
      </a>

      <button
        onClick={handleCancel}
        aria-label="Cancel offer"
        style={{ background: "none", border: "none", color: mutedText, fontSize: 18, cursor: "pointer", lineHeight: 1, padding: 0 }}
      >×</button>
    </div>
  );
}


export default function Home() {
  const { dark } = useTheme();
  const [statsRef, statsInView] = useInView(0.2);

  const mutedText    = dark ? "rgba(255,255,255,.45)" : "rgba(26,20,8,.6)";
  const mutedText2   = dark ? "rgba(255,255,255,.4)"  : "rgba(26,20,8,.55)";
  const mutedText3   = dark ? "rgba(255,255,255,.3)"  : "rgba(26,20,8,.45)";
  const borderCol    = dark ? "rgba(255,255,255,.06)"  : "rgba(26,20,8,.12)";
  const tickerBg     = dark ? "rgba(255,255,255,.01)"  : "rgba(26,20,8,.03)";
  const headingColor = dark ? "#fff" : "#1A1408";

  return (
    <PageWrapper>
      <FreeRedesignOffer />
      <SEO
        title="Shopify Conversion Rate Optimization & Ad Management Agency"
        description="Bode Conversion Lab fixes store leaks, engineers ROAS-positive ad campaigns, and scales e-commerce brands using the SRS (Sales Recovery System) methodology. Free store audit available."
        path="/"
      />

      {/* ── HERO ── */}
      <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"clamp(5rem,10vw,8rem) clamp(1rem,4vw,2rem) 4rem", overflow:"hidden" }}>
        <ParallaxGrid dark={dark} />

        {/* Radial glow */}
        <div style={{ position:"absolute", width:"min(700px,100%)", height:"min(700px,100vw)", top:-200, left:"50%", transform:"translateX(-50%)", background: dark ? "radial-gradient(circle at 40% 40%,rgba(0,255,136,.18),rgba(0,180,80,.05) 55%,transparent 75%)" : "radial-gradient(circle at 40% 40%,rgba(0,255,136,.08),rgba(0,163,92,.03) 55%,transparent 75%)", borderRadius:"50%", pointerEvents:"none" }}/>

        {/* Floating shape — one restrained accent, not a stack of them */}
        <div className="float-shape" style={{ position:"absolute", top:"32%", left:"6%", width:72, height:72, borderRadius:"50%", border: dark ? "1.5px solid rgba(0,255,136,.2)" : "1.5px solid rgba(0,163,92,.15)", animation:"float1 11s ease-in-out infinite 2s", pointerEvents:"none" }}/>

        <div style={{ maxWidth:780, textAlign:"center", position:"relative", zIndex:1, width:"100%" }}>

          {/* Badge */}
          <ScrollReveal delay={0}>
            <span style={{
              display:"inline-flex", alignItems:"center", gap:6,
              background: dark ? "rgba(0,255,136,.1)" : "#1A1408",
              border: dark ? ".5px solid rgba(0,255,136,.28)" : "none",
              borderRadius:100, padding:"6px 16px",
              fontSize:11, color: dark ? G : "#FFEFC2",
              fontWeight:600, letterSpacing:".05em", marginBottom:"1.4rem"
            }}>
              <span style={{ width:6, height:6, background: dark ? G : "#00ff88", borderRadius:"50%", animation:"pulse 2s ease-in-out infinite" }}/>
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
              <Typewriter words={["revenue machine.", "conversion engine.", "ROAS multiplier.", "scaling system."]} />
            </div>
          </div>

          <ScrollReveal delay={0.3}>
            <p style={{ fontSize:"clamp(0.9rem,2vw,1.05rem)", color:mutedText, lineHeight:1.75, maxWidth:540, margin:"0 auto 2rem" }}>
              Bode Conversion Lab engineers your ROAS from the ground up — ads, landing pages, checkout. One system. Compounding results every month.
            </p>
          </ScrollReveal>

          {/* ── SINGLE PRIMARY CTA ── */}
          <ScrollReveal delay={0.4}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, marginBottom:"3.5rem" }}>
              <Magnetic>
                <Link to="/contact" className="btn-g" data-cursor="Apply">
                  Apply for a free strategy call →
                </Link>
              </Magnetic>
              <Link
                to="/case-studies"
                style={{ fontSize:13, color:mutedText2, textDecoration:"none", borderBottom:`.5px solid ${mutedText3}`, paddingBottom:1, transition:"color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color = G}
                onMouseLeave={e => e.currentTarget.style.color = mutedText2}>
                See what we've done for other stores →
              </Link>
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
                <TiltCard key={i} style={{ background: dark ? "linear-gradient(135deg,rgba(0,255,136,.09),rgba(0,204,106,.03))" : "linear-gradient(135deg,rgba(255,255,255,.5),rgba(255,255,255,.25))", border: dark ? ".5px solid rgba(0,255,136,.22)" : ".5px solid rgba(26,20,8,.15)", borderTop: dark ? ".5px solid rgba(0,255,136,.38)" : ".5px solid rgba(255,255,255,.7)", borderRadius:16, padding:"1.3rem 1rem", textAlign:"center" }}>
                  <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background: dark ? "linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)" : "linear-gradient(90deg,transparent,rgba(255,255,255,.8),transparent)" }}/>
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

      {/* ── STATS ── */}
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
              { n:70,  s:"x",    l:"Revenue multiplier" },
              { n:90,  s:" days", l:"Time to results" },
              { n:4,   s:"x+",   l:"ROAS improvement" },
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.12}>
                <div className="stat-card">
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(2rem,5vw,3rem)", fontWeight:800, background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1, marginBottom:8 }}>
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

      {/* ── SRS STRATEGY (compact) ── */}
      <Section id="cgo">
        <div style={{ maxWidth:980, margin:"0 auto" }}>
          <ScrollReveal delay={0}>
            <div style={{ textAlign:"center", marginBottom:"2rem" }}>
              <SectionLabel>The Methodology</SectionLabel>
              <Heading size="2rem">What is <GradText>SRS?</GradText></Heading>
              <p style={{ fontSize:14.5, color:mutedText, maxWidth:640, margin:"1rem auto 0", lineHeight:1.8 }}>
                <strong style={{ color:headingColor }}>SRS — Sales Recovery System</strong> is the system behind everything we do. Most agencies run ads first. We fix the store first — because sending traffic to a leaky funnel just burns your budget faster. SRS fixes what's broken, proves what works, then scales only what's earned it.
              </p>
            </div>
          </ScrollReveal>

          <div className="how-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem" }}>
            {[
              { phase:"01", t:"Foundation Fix",   d:"Fix leaks & trust signals first." },
              { phase:"02", t:"Traffic Ignition", d:"Controlled ad tests find winners." },
              { phase:"03", t:"Scale & Compound", d:"Double down on what's proven." },
              { phase:"04", t:"Systemize",        d:"Document it so it runs itself." },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <TiltCard className="glass" style={{ padding:"1.4rem 1.2rem", height:"100%" }}>
                  <p style={{ fontSize:10, fontWeight:700, color:G, letterSpacing:".06em", marginBottom:".4rem" }}>PHASE {item.phase}</p>
                  <h4 style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, marginBottom:".35rem", color:headingColor }}>{item.t}</h4>
                  <p style={{ fontSize:12, color:mutedText, lineHeight:1.6 }}>{item.d}</p>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.1}>
            <div style={{ textAlign:"center", marginTop:"1.6rem" }}>
              <Magnetic>
                <Link to="/audit" className="btn-ghost" style={{ textDecoration:"none", display:"inline-block" }}>See the full SRS breakdown →</Link>
              </Magnetic>
            </div>
          </ScrollReveal>
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
              style={{ background: dark ? "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))" : "linear-gradient(135deg,rgba(255,255,255,.5),rgba(255,255,255,.25))", border:".5px solid rgba(0,255,136,.25)", borderRadius:24, padding:"clamp(2.5rem,5vw,5rem) clamp(1.5rem,4vw,3rem)" }}>
              <SectionLabel>Ready to scale?</SectionLabel>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.6rem,4vw,2.8rem)", fontWeight:800, letterSpacing:"-.02em", color:headingColor, lineHeight:1.2, wordBreak:"break-word", overflowWrap:"break-word" }}>
                Stop burning money.<br /><GradText>Start compounding it.</GradText>
              </h2>
              <p style={{ fontSize:"clamp(0.9rem,2vw,1rem)", color:mutedText, lineHeight:1.7, margin:"1.5rem auto", maxWidth:480 }}>
                Join stores that went from struggling to scaling. Get your free store audit today — no commitment needed.
              </p>
              <Magnetic>
                <Link to="/contact" className="btn-g" style={{ display:"inline-block" }} data-cursor="Apply">
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