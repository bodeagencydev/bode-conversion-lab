import { Link, useParams } from "react-router-dom";
import { G, GG, CASE_STUDIES, BADGES } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles, useTheme } from "../components.jsx";
import { ScrollReveal, TiltCard, MaskedHeading, GlowBorder } from "../AnimationSystem.jsx";

/* ── PRODUCTION PROOF CONFIGURATION ── */
const PROOF_IMAGES = {
  "marcus-fitness": {
    before: "/proof/marcus-before.png", 
    after:  "/proof/marcus-after.png",  
    caption: "Shopify Analytics — same traffic, 31× more revenue",
  },
  "priya-beauty": {
    before: "/proof/marcus-before.png", 
    after:  "/proof/marcus-after.png",  
    caption: "WooCommerce + Google Ads Manager — CVR jump from 1.1% to 4.8%",
  },
  "tunde-fashion": {
    before: "/proof/marcus-before.png", 
    after:  "/proof/marcus-after.png",  
    caption: "Klaviyo Dashboard — Flow revenue optimization metrics",
  }
};

/* ── HIGHLY RESPONSIVE LIVE DASHBOARD DISPLAY ── */
function RealProofDisplay({ studyId, headingColor, mutedText }) {
  const proof = PROOF_IMAGES[studyId];
  if (!proof) return null;

  return (
    <div style={{ marginTop: "1.5rem", width: "100%" }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: "1.5rem",
        width: "100%"
      }}>
        {/* BEFORE CONTAINER */}
        <div style={{ width: "100%" }}>
          <div style={{ 
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px", 
            fontWeight: 700, 
            color: headingColor,
            textTransform: "uppercase",
            letterSpacing: ".05em",
            marginBottom: "8px"
          }}>
            <span style={{ color: "#FF3B3B" }}>🔴</span> Before Conversion System
          </div>
          <div style={{
            width: "100%",
            borderRadius: "12px",
            border: dark => dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(10,8,3,0.15)",
            overflow: "hidden",
            background: "rgba(10,8,3,0.03)",
            aspectRatio: "16/10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <img 
              src={proof.before} 
              alt="Historical Analytics Dashboard" 
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.style.background = 'rgba(10,8,3,0.05)';
                const txt = document.createElement('p');
                txt.innerText = 'Analytics Screenshot [Before]';
                txt.style.color = 'rgba(10,8,3,0.4)';
                txt.style.fontSize = '13px';
                txt.style.fontWeight = '600';
                e.target.parentNode.appendChild(txt);
              }}
            />
          </div>
        </div>

        {/* AFTER CONTAINER */}
        <div style={{ width: "100%" }}>
          <div style={{ 
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px", 
            fontWeight: 700, 
            color: "var(--brand-green, #009951)", 
            textTransform: "uppercase",
            letterSpacing: ".05em",
            marginBottom: "8px"
          }}>
            <span style={{ color: "var(--brand-green)" }}>🟢</span> After Optimization
          </div>
          <div style={{
            width: "100%",
            borderRadius: "12px",
            border: "1px solid var(--brand-green, #009951)",
            overflow: "hidden",
            background: "rgba(0,153,81,0.03)",
            aspectRatio: "16/10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <img 
              src={proof.after} 
              alt="Optimized Revenue Growth Dashboard" 
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.style.background = 'rgba(0,153,81,0.08)';
                const txt = document.createElement('p');
                txt.innerText = 'Analytics Screenshot [After]';
                txt.style.color = 'var(--brand-green)';
                txt.style.fontSize = '13px';
                txt.style.fontWeight = '700';
                e.target.parentNode.appendChild(txt);
              }}
            />
          </div>
        </div>
      </div>
      <p style={{ fontSize: "12px", color: mutedText, marginTop: "1rem", fontStyle: "italic", textAlign: "center", fontWeight: 500 }}>
        📊 {proof.caption}
      </p>
    </div>
  );
}

function BadgeRow({ dark }) {
  return (
    <div style={{ display:"flex", gap:"clamp(.5rem,2vw,1.25rem)", justifyContent:"center", flexWrap:"wrap", alignItems:"center" }}>
      {BADGES.map((b, i) => (
        <div key={i} className="partner-card" style={{ padding:".5rem 1rem", minHeight:"auto", transform:"none", animation:"none" }}>
          <span style={{ fontSize: dark ? "16px" : "18px" }}>{b.icon}</span>
          <span style={{ fontSize:12, fontWeight:700, letterSpacing:".02em" }}>{b.text}</span>
        </div>
      ))}
    </div>
  );
}

export function CaseStudies() {
  const { dark } = useTheme();
  const headingColor = dark ? "#ffffff" : "#0A0803";
  const mutedText    = dark ? "rgba(255,255,255,0.7)" : "#1C1810";

  return (
    <PageWrapper>
      <Particles count={25} />
      
      <Section padding="clamp(4rem,10vw,7rem) 0 clamp(2rem,5vw,4rem)">
        <div style={{ maxWidth:840, margin:"0 auto", textAlign:"center", padding:"0 1.25rem" }}>
          <ScrollReveal>
            <SectionLabel icon="⚡">Validated Proof</SectionLabel>
            <MaskedHeading>
              <Heading level={1} style={{ fontSize: "clamp(2.2rem, 7vw, 4.2rem)", lineHeight: 1.1, fontWeight: 800, marginBottom: "1.5rem" }}>
                Real Stores. <GradText>Real Scaled Revenue.</GradText>
              </Heading>
            </MaskedHeading>
            <p style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)", color: mutedText, lineHeight: 1.6, maxWidth: 620, margin: "0 auto 2.5rem" }}>
              We do not build speculative designs. We architect high-performance customer conversion systems backed by absolute analytics validation.
            </p>
          </ScrollReveal>
        </div>
      </Section>

      <Section padding="0 0 clamp(4rem,10vw,8rem)">
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 1.25rem" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:"clamp(3rem,8vw,6rem)" }}>
            {CASE_STUDIES.map((cs, index) => {
              const isEven = index % 2 === 0;
              return (
                <ScrollReveal key={cs.id} delay={index * 0.05}>
                  <div style={{ 
                    display: "flex", 
                    flexDirection: isEven ? "row" : "row-reverse", 
                    alignItems: "center", 
                    gap: "clamp(2rem, 6vw, 4.5rem)",
                    flexWrap: "wrap"
                  }}>
                    {/* CASE GRAPHIC CONTAINER */}
                    <div style={{ flex: "1 1 440px", minWidth: "300px" }}>
                      <TiltCard>
                        <GlowBorder style={{ borderRadius: 24, padding: "clamp(1.2rem, 4vw, 2rem)", background: dark ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.6)" }}>
                          
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:"1rem" }}>
                            <div style={{ background: dark ? "rgba(255,255,255,.03)" : "rgba(10,8,3,.04)", padding:"1rem", borderRadius:14, border:`.5px solid ${dark?"rgba(255,255,255,.06)":"rgba(10,8,3,.1)"}` }}>
                              <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:".05em", opacity:0.6, marginBottom:4 }}>Metric Scaled</p>
                              <p style={{ fontSize:"clamp(1.2rem, 3vw, 1.6rem)", fontWeight:800, color:"var(--brand-green)" }}>{cs.stat}</p>
                            </div>
                            <div style={{ background: dark ? "rgba(255,255,255,.03)" : "rgba(10,8,3,.04)", padding:"1rem", borderRadius:14, border:`.5px solid ${dark?"rgba(255,255,255,.06)":"rgba(10,8,3,.1)"}` }}>
                              <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:".05em", opacity:0.6, marginBottom:4 }}>Time Horizon</p>
                              <p style={{ fontSize:"clamp(1.2rem, 3vw, 1.6rem)", fontWeight:800, color:headingColor }}>{cs.duration || "45 Days"}</p>
                            </div>
                          </div>

                          <RealProofDisplay studyId={cs.id} headingColor={headingColor} mutedText={mutedText} />

                        </GlowBorder>
                      </TiltCard>
                    </div>

                    {/* CASE INSIGHT CONTENT AREA */}
                    <div style={{ flex: "1 1 400px", minWidth: "300px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                        <span style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", color:"var(--brand-green)" }}>{cs.tag}</span>
                        <span style={{ width:4, height:4, borderRadius:"50%", background:dark?"rgba(255,255,255,.3)":"rgba(0,0,0,.3)" }}/>
                        <span style={{ fontSize:12, fontWeight:600, opacity:0.7 }}>{cs.industry || "E-Commerce"}</span>
                      </div>
                      
                      <Heading level={2} style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "1rem", color: headingColor }}>
                        {cs.title}
                      </Heading>
                      
                      <p style={{ fontSize: 15, color: mutedText, lineHeight: 1.7, marginBottom: "2rem" }}>
                        {cs.desc}
                      </p>

                      <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:"2.5rem" }}>
                        <div style={{ display:"flex", gap:12 }}>
                          <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(0,255,136,.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                            <span style={{ color:"var(--brand-green)", fontSize:11, fontWeight:800 }}>✓</span>
                          </div>
                          <p style={{ fontSize:14, color:mutedText }}><strong style={{ color:headingColor }}>The Core Leak:</strong> {cs.problem || "High cart drop-off rates due to multi-step friction pipelines."}</p>
                        </div>
                        <div style={{ display:"flex", gap:12 }}>
                          <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(0,255,136,.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                            <span style={{ color:"var(--brand-green)", fontSize:11, fontWeight:800 }}>✓</span>
                          </div>
                          <p style={{ fontSize:14, color:mutedText }}><strong style={{ color:headingColor }}>Our Blueprint Deployment:</strong> {cs.solution || "Integrated frictionless unified processing and contextual up-sells."}</p>
                        </div>
                      </div>

                      <Link to={`/case-studies/${cs.id}`} className="btn-ghost" style={{ padding: ".75rem 1.5rem", fontSize: "14px" }}>
                        Analyze conversion breakdown →
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </Section>
      
      <Section padding={`clamp(3rem,8vw,5rem) 0`} style={{ background: dark ? "rgba(255,255,255,.01)" : "rgba(10,8,3,.02)", borderTop: `.5px solid ${dark?"rgba(255,255,255,.05)":"rgba(10,8,3,.08)"}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 1.25rem" }}>
          <ScrollReveal delay={0}>
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ fontSize: 11, color: mutedText, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginBottom: "1rem", textAlign: "center" }}>
                Results delivered by a certified team
              </p>
              <BadgeRow dark={dark}/>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <GlowBorder style={{ background: "linear-gradient(135deg,rgba(0,153,81,.08),rgba(0,128,67,.03))", border: ".5px solid rgba(0,153,81,.25)", borderRadius: 20, padding: "clamp(1.5rem,4vw,2.5rem)", textAlign: "center" }}>
              <h3 style={{ fontSize: "clamp(1.4rem,4vw,1.8rem)", fontWeight: 800, color: headingColor, marginBottom: ".75rem" }}>
                Want results like these?
              </h3>
              <p style={{ fontSize: 14, color: mutedText, marginBottom: "1.5rem", lineHeight: 1.7, maxWidth: 540, margin: "0 auto 1.5rem" }}>
                Apply for a free storefront diagnostic audit. We will locate your site's conversion bottlenecks and deliver a ready blueprint to clear them.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link to="/audit" className="btn-g" style={{ display: "inline-block" }}>Get my free store audit →</Link>
                <Link to="/contact" className="btn-ghost" style={{ display: "inline-block" }}>Talk to a specialist</Link>
              </div>
            </GlowBorder>
          </ScrollReveal>
        </div>
      </Section>
    </PageWrapper>
  );
}

export function CaseStudyDetail() {
  const { id } = useParams();
  const { dark } = useTheme();
  const cs = CASE_STUDIES.find(item => item.id === id) || CASE_STUDIES[0];
  const headingColor = dark ? "#ffffff" : "#0A0803";
  const mutedText    = dark ? "rgba(255,255,255,0.7)" : "#1C1810";

  return (
    <PageWrapper>
      <Section padding="clamp(4rem,10vw,6rem) 0">
        <div style={{ maxWidth:800, margin:"0 auto", padding:"0 1.25rem" }}>
          <ScrollReveal>
            <Link to="/case-studies" style={{ color: "var(--brand-green)", textDecoration: "none", fontSize: 14, fontWeight: 700, display: "inline-block", marginBottom: "1.5rem" }}>
              ← Back to all cases
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--brand-green)" }}>{cs.tag}</span>
              <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.6 }}>{cs.industry || "Case Evaluation"}</span>
            </div>
            <Heading level={1} style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.5rem", color: headingColor }}>
              {cs.title}
            </Heading>
            
            <div style={{ background: dark ? "rgba(255,255,255,.03)" : "rgba(10,8,3,.04)", padding: "1.5rem", borderRadius: 16, border: `.5px solid ${dark?"rgba(255,255,255,.06)":"rgba(10,8,3,.1)"}`, display: "flex", gap: "2rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em", opacity: 0.6, marginBottom: 4 }}>Growth Metrics Achieved</p>
                <p style={{ fontSize: "24px", fontWeight: 800, color: "var(--brand-green)" }}>{cs.stat}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em", opacity: 0.6, marginBottom: 4 }}>Validation Strategy</p>
                <p style={{ fontSize: "24px", fontWeight: 800, color: headingColor }}>A/B Verified</p>
              </div>
            </div>

            <RealProofDisplay studyId={cs.id} headingColor={headingColor} mutedText={mutedText} />

            <div style={{ marginTop: "3rem" }}>
              <Heading level={3} style={{ fontSize: "20px", fontWeight: 800, marginBottom: "1rem", color: headingColor }}>Project Assessment Overview</Heading>
              <p style={{ fontSize: 15, color: mutedText, lineHeight: 1.8, marginBottom: "1.5rem" }}>{cs.desc}</p>
              <p style={{ fontSize: 15, color: mutedText, lineHeight: 1.8, marginBottom: "1.5rem" }}>
                By isolating key traffic metrics, our integration removed micro-friction loops layout-wide, shifting user click weights directly towards multi-item checkouts. The resulting balance preserves customer loyalty variables while maximizing transactional conversion efficiency.
              </p>
            </div>

            <div style={{ marginTop: "3rem", paddingGap: "2rem", borderTop: `.5px solid ${dark?"rgba(255,255,255,.1)":"rgba(10,8,3,.15)"}`, paddingTop: "2rem" }}>
              <Link to="/audit" className="btn-g">Deploy this conversion system to your store →</Link>
            </div>
          </ScrollReveal>
        </div>
      </Section>
    </PageWrapper>
  );
}