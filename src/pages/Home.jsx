import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { G, GG, TESTIMONIALS, ECOM_PLATFORMS, AD_PLATFORMS, PARTNERS, VIDEO_TIPS } from "../data.js";
import { Typewriter, ContinuousTicker, TestimonialTicker, VideoTips, PartnerCard, Section, SectionLabel, Heading, GradText, useInView, useTheme, PageWrapper, SEO } from "../components.jsx";
import { ScrollReveal, TiltCard, Magnetic, GlowBorder, SpringCounter, MaskedHeading } from "../AnimationSystem.jsx";

const REDESIGN_STATUS_KEY = "bcl_redesign_status"; // 'active' | 'gone'
const REDESIGN_CODE_KEY = "bcl_redesign_code";
// Days of the week (0=Sun...6=Sat) the offer is visible. Monday+Tuesday
// treated as "first 2 days of the week" (standard Mon–Sun business week).
const OFFER_DAYS = [1, 2];

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let out = "SRS-";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function FreeRedesignOffer() {
  const [status, setStatus] = useState(null); // null while loading from localStorage
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  const isOfferDay = OFFER_DAYS.includes(new Date().getDay());

  useEffect(() => {
    let savedStatus = localStorage.getItem(REDESIGN_STATUS_KEY);
    let savedCode = localStorage.getItem(REDESIGN_CODE_KEY);

    if (!savedCode) { savedCode = generateCode(); localStorage.setItem(REDESIGN_CODE_KEY, savedCode); }
    if (!savedStatus) { savedStatus = "active"; localStorage.setItem(REDESIGN_STATUS_KEY, "active"); }

    setCode(savedCode);
    setStatus(savedStatus);
  }, []);

  function handleCancel() {
    localStorage.setItem(REDESIGN_STATUS_KEY, "gone");
    setStatus("gone");
  }

  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Dismissed forever, or not one of this week's 2 offer days — render nothing.
  if (status === null || status === "gone" || !isOfferDay) return null;

  const mutedText = "rgba(255,255,255,.65)";

  return (
    <div className="free-redesign-bar" style={{
      position: "sticky", top: 60, zIndex: 900, width: "100%",
      background: "linear-gradient(90deg, rgba(0,255,136,.16), rgba(0,255,136,.08))",
      borderBottom: "1px solid rgba(0,255,136,.35)", padding: "12px clamp(1rem,4vw,2rem) 10px",
      boxSizing: "border-box",
    }}>
      <style>{`
        .free-redesign-bar .frb-row { display:flex; align-items:center; justify-content:center; gap:.6rem; flex-wrap:wrap; }
        .free-redesign-bar .frb-claim-row { margin-top:8px; }
        @media (max-width: 560px) {
          .free-redesign-bar { padding-top: 34px !important; }
          .free-redesign-bar .frb-row { justify-content:flex-start; text-align:left; }
          .free-redesign-bar .frb-claim-row { justify-content:flex-start; }
        }
      `}</style>

      <button
        onClick={handleCancel}
        aria-label="Cancel offer"
        style={{ position: "absolute", top: 6, right: 8, width: 32, height: 32, display:"flex", alignItems:"center", justifyContent:"center", background: "none", border: "none", color: mutedText, fontSize: 20, cursor: "pointer", lineHeight: 1 }}
      >×</button>

      <div className="frb-row">
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
          🎁 Free Website Redesign Consultation
        </span>

        <span style={{ display: "inline-flex", gap: 6, alignItems: "center", background: "rgba(0,0,0,.35)", borderRadius: 8, padding: "5px 12px" }}>
          <span style={{ fontSize: 11, color: mutedText }}>Available today & tomorrow</span>
        </span>

        <span style={{ display: "inline-flex", gap: 6, alignItems: "center", background: "rgba(0,0,0,.35)", borderRadius: 8, padding: "5px 8px 5px 12px" }}>
          <span style={{ fontSize: 11, color: mutedText }}>Your code:</span>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: ".03em" }}>{code}</span>
          <button
            onClick={copyCode}
            style={{ padding: "3px 10px", borderRadius: 6, border: "none", background: copied ? "#00D97E" : "rgba(255,255,255,.12)", color: copied ? "#0A0A0A" : "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </span>
      </div>

      <div className="frb-row frb-claim-row">
        <span style={{ fontSize: 12, color: mutedText }}>
          Send this code to us to claim it —
        </span>

        <a
          href={"https://wa.me/19454076473?text=" + encodeURIComponent(`Hi! I'd like to claim my free redesign consultation. My code: ${code}`)}
          target="_blank" rel="noopener noreferrer"
          onClick={handleCancel}
          style={{ display:"inline-flex", alignItems:"center", lineHeight:1, padding: "8px 16px", borderRadius: 8, background: "#00FF88", color: "#0A0A0A", fontWeight: 700, fontSize: 12, textDecoration: "none", whiteSpace: "nowrap" }}
        >
          Claim on WhatsApp →
        </a>

        <span style={{ fontSize: 12, color: mutedText, lineHeight:1 }}>or</span>

        <a
          href={`mailto:bodeagencyofficial@gmail.com?subject=${encodeURIComponent("Claim my free redesign consultation")}&body=${encodeURIComponent(`My code: ${code}`)}`}
          onClick={handleCancel}
          style={{ display:"inline-flex", alignItems:"center", lineHeight:1, fontSize: 12, color: "#fff", textDecoration: "underline", whiteSpace: "nowrap" }}
        >
          email us
        </a>
      </div>
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
      <section style={{ position:"relative", minHeight:"92vh", display:"flex", alignItems:"center", padding:"clamp(4rem,9vw,6rem) clamp(1.2rem,4vw,2rem) 3rem", overflow:"hidden" }}>
        <div style={{ maxWidth:1180, margin:"0 auto", width:"100%", display:"grid", gridTemplateColumns:"1.05fr 0.95fr", gap:"clamp(2rem,5vw,4rem)", alignItems:"center" }} className="hero-split">

          {/* ── LEFT: copy ── */}
          <div style={{ position:"relative", zIndex:1 }}>
            <ScrollReveal delay={0}>
              <span style={{
                display:"inline-flex", alignItems:"center", gap:8,
                border: `1px solid ${dark ? "rgba(239,236,230,.18)" : "rgba(23,20,15,.2)"}`,
                borderRadius:4, padding:"5px 12px",
                fontSize:11, color: mutedText2, fontFamily:"'IBM Plex Mono',monospace",
                letterSpacing:".03em", marginBottom:"1.6rem"
              }}>
                <span style={{ width:6, height:6, background:G, borderRadius:"50%" }}/>
                STORE_AUDIT.STATUS — ACTIVE
              </span>
            </ScrollReveal>

            <div style={{ marginBottom:"1.2rem" }}>
              <MaskedHeading
                text="We turn your store into a"
                tag="h1"
                className="hero-t"
                delay={0.1}
                stagger={0.06}
                style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(2rem,4.6vw,3.3rem)", fontWeight:700, lineHeight:1.1, letterSpacing:"-.02em", color:headingColor, wordBreak:"break-word", textAlign:"left", justifyContent:"flex-start" }}
              />
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(2rem,4.6vw,3.3rem)", fontWeight:700, lineHeight:1.1, letterSpacing:"-.02em", color:G, animation:"heroFadeUp .8s .5s ease both", animationFillMode:"forwards", opacity:0, textAlign:"left" }}>
                <Typewriter words={["revenue machine.", "conversion engine.", "ROAS multiplier.", "scaling system."]} />
              </div>
            </div>

            <ScrollReveal delay={0.3}>
              <p style={{ fontSize:"clamp(0.9rem,1.6vw,1.02rem)", color:mutedText, lineHeight:1.75, maxWidth:460, margin:"0 0 2rem" }}>
                We don't run ads. We engineer ROAS — auditing every leak in your store, ads, and checkout, then fixing it as one compounding system.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:14, marginBottom:"2.8rem" }}>
                <Magnetic>
                  <a href="https://calendly.com/bodeagencyofficial/30min" target="_blank" rel="noopener noreferrer" className="btn-g" data-cursor="Apply">
                    Apply for a free strategy call →
                  </a>
                </Magnetic>
                <Link
                  to="/past-projects"
                  style={{ fontSize:13, color:mutedText2, textDecoration:"none", borderBottom:`.5px solid ${mutedText3}`, paddingBottom:1, transition:"color .2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = G}
                  onMouseLeave={e => e.currentTarget.style.color = mutedText2}>
                  See our past work →
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="hero-cards" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, maxWidth:460 }}>
                {[
                  { n:"70x", l:"Revenue growth\nin 90 days" },
                  { n:"4x+", l:"Average ROAS\nimprovement" },
                  { n:"$0",  l:"Extra ad spend\nrequired" },
                ].map((c, i) => (
                  <div key={i} style={{ borderLeft:`2px solid ${G}`, paddingLeft:10 }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"clamp(1.2rem,3vw,1.5rem)", fontWeight:600, color:headingColor, lineHeight:1.1, marginBottom:4 }}>{c.n}</div>
                    <div style={{ fontSize:10.5, color:mutedText3, lineHeight:1.4, whiteSpace:"pre-line" }}>{c.l}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* ── RIGHT: signature element — annotated store-scan readout ── */}
          <div className="hero-scan-wrap">
          <ScrollReveal delay={0.25}>
            <div style={{ position:"relative" }}>
              <div style={{
                border:`1px solid ${dark ? "rgba(239,236,230,.14)" : "rgba(23,20,15,.16)"}`,
                borderRadius:8, background: dark ? "rgba(239,236,230,.025)" : "rgba(23,20,15,.02)",
                padding:"1.1rem 1.2rem", fontFamily:"'IBM Plex Mono',monospace",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem", paddingBottom:"0.8rem", borderBottom:`1px solid ${dark ? "rgba(239,236,230,.1)" : "rgba(23,20,15,.1)"}` }}>
                  <span style={{ fontSize:11, color:mutedText3, letterSpacing:".04em" }}>SCAN://your-store.myshopify.com</span>
                  <span style={{ fontSize:10, color:G }}>● LIVE</span>
                </div>

                {[
                  { label:"Checkout friction",   status:"3 issues found", tone:"rust" },
                  { label:"Mobile page speed",   status:"2.1s → 0.6s",    tone:"good" },
                  { label:"Ad account targeting",status:"Rebuilt",        tone:"good" },
                  { label:"Trust signals",       status:"Missing",        tone:"rust" },
                  { label:"ROAS",                status:"0.8x → 4.2x",    tone:"good" },
                ].map((row, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, padding:"9px 0", borderBottom: i < 4 ? `1px solid ${dark ? "rgba(239,236,230,.06)" : "rgba(23,20,15,.06)"}` : "none" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ width:6, height:6, borderRadius:"50%", background: row.tone === "rust" ? "var(--rust)" : G, flexShrink:0 }}/>
                      <span style={{ fontSize:12.5, color: dark ? "rgba(239,236,230,.75)" : "rgba(23,20,15,.75)" }}>{row.label}</span>
                    </div>
                    <span style={{ fontSize:12, fontWeight:600, color: row.tone === "rust" ? "var(--rust)" : G, whiteSpace:"nowrap" }}>{row.status}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:10.5, color:mutedText3, marginTop:10, fontFamily:"'IBM Plex Mono',monospace", textAlign:"center" }}>
                — sample output from a real store audit —
              </p>
            </div>
          </ScrollReveal>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:900px){ .hero-split{grid-template-columns:1fr!important;} .hero-scan-wrap{order:-1;max-width:460px;margin:0 auto 1rem;} }
      `}</style>


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
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(2rem,5vw,3rem)", fontWeight:800, background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1, marginBottom:8 }}>
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
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"1.8rem", fontWeight:800, background:"linear-gradient(135deg,rgba(0,255,136,.55),rgba(0,255,136,.15))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", marginBottom:".75rem" }}>{item.n}</div>
                  <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"1.15rem", fontWeight:700, marginBottom:".6rem", color:headingColor }}>{item.t}</h3>
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
                  <h4 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:700, marginBottom:".35rem", color:headingColor }}>{item.t}</h4>
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
                <Link to="/past-projects" className="btn-ghost">See our past projects →</Link>
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
              <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(1.6rem,4vw,2.8rem)", fontWeight:800, letterSpacing:"-.02em", color:headingColor, lineHeight:1.2, wordBreak:"break-word", overflowWrap:"break-word" }}>
                Stop burning money.<br /><GradText>Start compounding it.</GradText>
              </h2>
              <p style={{ fontSize:"clamp(0.9rem,2vw,1rem)", color:mutedText, lineHeight:1.7, margin:"1.5rem auto", maxWidth:480 }}>
                Join stores that went from struggling to scaling. Get your free store audit today — no commitment needed.
              </p>
              <Magnetic>
                <Link to="/audit" className="btn-g" style={{ display:"inline-block" }} data-cursor="Apply">
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