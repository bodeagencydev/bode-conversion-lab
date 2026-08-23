import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { G, GG, CASE_STUDIES, BADGES } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, useTheme, SEO } from "../components.jsx";
import { ScrollReveal, TiltCard, GlowBorder } from "../AnimationSystem.jsx";

/* ── PROOF PANEL (Dynamically pulls the real images from your dataset) ── */
function ProofPanel({ cs, dark, mutedText, headingColor }) {
  // Fallback safely if there is no data or missing images
  if (!cs) return null;

  const beforeSrc = cs.beforeImg || "/proof/marcus-before.png";
  const afterSrc  = cs.afterImg  || "/proof/marcus-after.png";
  const caption   = cs.proofCaption || cs.headline || "Store Performance Proof";

  const containerStyle = (isAfter) => ({
    width: "100%", 
    aspectRatio: "16/9", 
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    background: isAfter ? "rgba(0,255,136,.05)" : dark ? "rgba(255,255,255,.03)" : "rgba(26,20,8,.04)",
    border: isAfter ? ".5px solid rgba(0,255,136,.25)" : `.5px solid ${dark ? "rgba(255,255,255,.1)" : "rgba(26,20,8,.12)"}`,
  });

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* BEFORE CONTAINER */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF3B3B", flexShrink: 0 }}/>
            <span style={{ fontSize: 11, fontWeight: 700, color: headingColor, textTransform: "uppercase", letterSpacing: ".05em" }}>Before</span>
          </div>
          <div style={containerStyle(false)}>
            <img
              src={beforeSrc}
              alt="Before performance proof"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => { 
                e.target.style.display = "none"; 
                e.target.nextSibling.style.display = "flex"; 
              }}
            />
            <div style={{ display: "none", position: "absolute", inset: 0, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "2rem", background: "rgba(0,0,0,0.3)" }}>
              <span style={{ width:10, height:10, borderRadius:"50%", background:"#FF3B3B", display:"inline-block" }} />
              <span style={{ fontSize: 12, color: mutedText, textAlign: "center" }}>Before image missing</span>
            </div>
          </div>
        </div>

        {/* AFTER CONTAINER */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: G, flexShrink: 0 }}/>
            <span style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: ".05em" }}>After</span>
          </div>
          <div style={containerStyle(true)}>
            <img
              src={afterSrc}
              alt="After performance proof"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => { 
                e.target.style.display = "none"; 
                e.target.nextSibling.style.display = "flex"; 
              }}
            />
            <div style={{ display: "none", position: "absolute", inset: 0, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "2rem", background: "rgba(0,0,0,0.3)" }}>
              <span style={{ width:10, height:10, borderRadius:"50%", background:G, display:"inline-block" }} />
              <span style={{ fontSize: 12, color: G, textAlign: "center" }}>After image missing</span>
            </div>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: mutedText, marginTop: ".75rem", fontStyle: "italic", textAlign: "center" }}>{caption}</p>
    </div>
  );
}

/* ── GALLERY ARRAY ── */
const GALLERY = [
  {
    type: "video",
    src:  "/proof/proof-1.png",
    videoSrc: "/proof/Videoproof1.mp4",
    label: "Stream Ride Store",
    tag:   "$36k sales",
    color: "#00ff88",
  },
  {
    type: "video",
    src:  "/proof/proof-2.png",
    videoSrc: "/proof/Videoproof2.mp4",
    label: "Novi Good store",
    tag:   "4.3x ROAS-$57k sales",
    color: "#0081FB",
  },
  {
    type: "video",
    src:  "/proof/proof-3.png",
    videoSrc: "/proof/Videoproof3.mp4",
    label: "Bomia Brand",
    tag:   "$0-$4k sales",
    color: "#4285F4",
  },
  {
    type: "video",
    src:  "/proof/proof-4.png",
    videoSrc: "/proof/Videoproof4.mp4",
    label: "Bomia Brand Store 2",
    tag:   "Roas 2x",
    color: "#FFD700",
  },
  {
    type: "video",
    src:  "/proof/proof-5.png",
    videoSrc: "/proof/Videoproof5.mp4",
    label: "Robin and Roobaby store",
    tag:   "$77k sales",
    color: "#00ff88",
  },
  {
    type: "video",
    src:  "/proof/proof-6.png",
    videoSrc: "/proof/Videoproof6.mp4",
    label: "Vista Market Online Store",
    tag:   "$41k sales",
    color: "#ffffff",
  },
]; 

/* ── GALLERY CARD ──
   No poster PNGs exist for these clips (the /proof folder only has the .mp4s),
   so the thumbnail is auto-captured client-side: a hidden <video> loads each
   clip's metadata, seeks to ~1s in, and draws that frame onto a canvas as a
   data URL. That becomes the thumbnail image — no extra asset files needed.
   Clicking swaps in the real, visible, controllable <video>.
──────────────────────────────────────────────────────────────────────────── */
function GalleryCard({ item, dark, mutedText, mutedText3, headingColor }) {
  const cardBorder = dark ? "rgba(255,255,255,.12)" : "rgba(26,20,8,.15)";
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb]     = useState(null);
  const [failed, setFailed]   = useState(false);
  const captureRef = useRef(null);

  useEffect(() => {
    const vid = captureRef.current;
    if (!vid || playing || thumb) return;

    const onLoadedMeta = () => {
      try { vid.currentTime = Math.min(1, (vid.duration || 2) / 4); }
      catch { setFailed(true); }
    };
    const onSeeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width  = vid.videoWidth  || 320;
        canvas.height = vid.videoHeight || 200;
        canvas.getContext("2d").drawImage(vid, 0, 0, canvas.width, canvas.height);
        setThumb(canvas.toDataURL("image/jpeg", 0.82));
      } catch { setFailed(true); }
    };
    const onError = () => setFailed(true);

    vid.addEventListener("loadedmetadata", onLoadedMeta);
    vid.addEventListener("seeked", onSeeked);
    vid.addEventListener("error", onError);
    return () => {
      vid.removeEventListener("loadedmetadata", onLoadedMeta);
      vid.removeEventListener("seeked", onSeeked);
      vid.removeEventListener("error", onError);
    };
  }, [playing, thumb]);

  return (
    <div style={{
      background: dark
        ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))"
        : "linear-gradient(135deg,rgba(255,255,255,.55),rgba(255,255,255,.25))",
      border: `.5px solid ${cardBorder}`,
      borderTop: dark ? ".5px solid rgba(255,255,255,.2)" : ".5px solid rgba(255,255,255,.7)",
      borderRadius: 16, overflow: "hidden", position: "relative",
      transition: "transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px) scale(1.01)"; e.currentTarget.style.boxShadow=dark?"0 24px 48px rgba(0,255,136,.1)":"0 24px 48px rgba(26,20,8,.1)"; e.currentTarget.style.borderColor="rgba(0,255,136,.35)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=cardBorder; }}>

      <div style={{ aspectRatio: "16/10", position: "relative", overflow: "hidden", background: dark ? "rgba(0,0,0,.4)" : "rgba(26,20,8,.06)" }}>

        {/* hidden capture video — only mounted while we still need a frame */}
        {!playing && !thumb && !failed && (
          <video
            ref={captureRef}
            src={item.videoSrc}
            muted
            playsInline
            preload="metadata"
            style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
          />
        )}

        {playing ? (
          <video
            src={item.videoSrc}
            autoPlay
            muted
            playsInline
            controls
            preload="auto"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", border: "none" }}
            onError={() => setFailed(true)}
          />
        ) : failed ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(0,0,0,0.5)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="14" rx="2"/><path d="M3 9h18M9 21h6M12 17v4"/>
            </svg>
            <span style={{ fontSize: 12, color: mutedText3, textAlign: "center", padding: "0 1.5rem" }}>{item.label} video missing</span>
          </div>
        ) : thumb ? (
          <>
            <img
              src={thumb}
              alt={item.label}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div
              onClick={() => setPlaying(true)}
              style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "rgba(0,0,0,.25)", transition: "background .2s" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(0,0,0,.4)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(0,0,0,.25)"}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(0,0,0,.55)", border: `1.5px solid ${item.color}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 24px ${item.color}55` }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill={item.color}><path d="M6 4L16 10L6 16Z"/></svg>
              </div>
            </div>
          </>
        ) : (
          <div style={{ position: "absolute", inset: 0, background: dark ? "rgba(255,255,255,.04)" : "rgba(26,20,8,.05)", animation: "pulse 1.6s ease-in-out infinite" }}/>
        )}

        {!playing && (
          <>
            <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,.75)", backdropFilter: "blur(8px)", borderRadius: 100, padding: "3px 10px", border: `.5px solid ${item.color}55`, zIndex: 2 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: item.color }}>{item.tag}</span>
            </div>

            <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.6)", borderRadius: 6, padding: "2px 8px", zIndex: 2 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,.8)", fontWeight: 600 }}>▶ Video Clip</span>
            </div>
          </>
        )}
      </div>

      <div style={{ padding: ".9rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: headingColor, lineHeight: 1.4 }}>{item.label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M7 17L17 7M7 7h10v10"/>
        </svg>
      </div>
    </div>
  );
}

export function CaseStudies() {
  const { dark } = useTheme();
  const seoTag = (
    <SEO
      title="Case Studies - Real Shopify Store Growth Results"
      description="See how Bode Conversion Lab took underperforming e-commerce stores from stalled sales to consistent, profitable growth using the CGO methodology."
      path="/case-studies"
    />
  );

  const headingColor = dark ? "#fff"                 : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.5)"  : "rgba(26,20,8,.65)";
  const mutedText2   = dark ? "rgba(255,255,255,.45)" : "rgba(26,20,8,.6)";
  const mutedText3   = dark ? "rgba(255,255,255,.35)" : "rgba(26,20,8,.5)";
  const cardBorder   = dark ? "rgba(255,255,255,.12)" : "rgba(26,20,8,.18)";

  return (
    <PageWrapper>
      {seoTag}
      {/* ── HERO ── */}
      <section style={{ position: "relative", padding: "7rem 2rem 5rem", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, top: -150, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }}/>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 16px", fontSize: 11, color: G, fontWeight: 600, letterSpacing: ".05em", marginBottom: "1.6rem" }}>
            <span style={{ width: 6, height: 6, background: G, borderRadius: "50%" }}/> Validated proof
          </span>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(2.2rem,6vw,3.8rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-.03em", color: headingColor, marginBottom: "1.2rem" }}>
            Real stores.<br /><GradText>Real scaled revenue.</GradText>
          </h1>
          <p style={{ fontSize: "clamp(0.95rem,2vw,1.1rem)", color: mutedText2, lineHeight: 1.8, maxWidth: 520, margin: "0 auto" }}>
            Every number here came from a real store, a real audit, and a real system we built. No mock-ups. No projections.
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* ── BADGES ── */}
      <Section>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 11, color: mutedText3, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700, marginBottom: "1.2rem" }}>
            Results delivered by
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {BADGES && BADGES.map((b, i) => (
              <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: dark ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.5)", border: dark ? ".5px solid rgba(255,255,255,.1)" : `.5px solid rgba(26,20,8,.15)`, borderRadius: 100, padding: ".5rem 1.1rem" }}>
                <span style={{ fontSize: 16 }}>{b.icon}</span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: headingColor, margin: 0 }}>{b.title}</p>
                  <p style={{ fontSize: 10, color: mutedText3, margin: 0 }}>{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* ── CASE STUDIES MAIN ── */}
      <Section>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: "5rem" }}>
          {CASE_STUDIES && CASE_STUDIES.map((cs, index) => (
            <ScrollReveal key={cs.id} delay={index * 0.05}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,5vw,4rem)", alignItems: "flex-start" }} className="about-grid">
                
                <TiltCard style={{ background: dark ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.5)", border: `.5px solid ${cardBorder}`, borderRadius: 20, padding: "1.8rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: "1.5rem" }}>
                    {[cs.result1, cs.result2, cs.result3].map((r, i) => r && (
                      <div key={i} style={{ background: dark ? "rgba(255,255,255,.04)" : "rgba(26,20,8,.04)", border: dark ? ".5px solid rgba(255,255,255,.08)" : ".5px solid rgba(26,20,8,.1)", borderRadius: 12, padding: "1rem .75rem", textAlign: "center" }}>
                        <p style={{ fontSize: 10, color: mutedText3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>{r.label}</p>
                        <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(.85rem,2vw,1.05rem)", fontWeight: 800, background: GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", margin: 0 }}>{r.after}</p>
                        <p style={{ fontSize: 10, color: mutedText3, marginTop: 2 }}>from {r.before}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.2rem" }}>
                    {cs.tags && cs.tags.map((t, i) => (
                      <span key={i} style={{ background: "rgba(0,255,136,.08)", border: ".5px solid rgba(0,255,136,.2)", borderRadius: 100, padding: "3px 10px", fontSize: 10, color: G, fontWeight: 600 }}>{t}</span>
                    ))}
                    <span style={{ background: dark ? "rgba(255,255,255,.05)" : "rgba(26,20,8,.05)", border: dark ? ".5px solid rgba(255,255,255,.1)" : ".5px solid rgba(26,20,8,.1)", borderRadius: 100, padding: "3px 10px", fontSize: 10, color: mutedText3, fontWeight: 500 }}>{cs.platform}</span>
                  </div>
                  
                  {/* Pass down the entire case study object so we pull your real images */}
                  <ProofPanel cs={cs} dark={dark} mutedText={mutedText} headingColor={headingColor} />
                </TiltCard>

                <div>
                  <p style={{ fontSize: 11, color: G, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".6rem" }}>{cs.category}</p>
                  <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, color: headingColor, lineHeight: 1.2, marginBottom: "1rem" }}>{cs.headline}</h2>
                  <p style={{ fontSize: 15, color: mutedText, lineHeight: 1.8, marginBottom: "1.8rem" }}>{cs.summary}</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "2rem" }}>
                    {cs.story && cs.story.map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.3)", display: "flex", alignItems: "center", center: "center", fontSize: 11, fontWeight: 800, color: G, flexShrink: 0 }}>
                          {String(i+1).padStart(2,"0")}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: headingColor, marginBottom: 4 }}>{s.heading}</p>
                          <p style={{ fontSize: 13, color: mutedText2, lineHeight: 1.7 }}>{s.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: dark ? "rgba(0,255,136,.05)" : "rgba(0,255,136,.06)", border: ".5px solid rgba(0,255,136,.18)", borderLeft: `3px solid ${G}`, borderRadius: "0 12px 12px 0", padding: "1.2rem 1.4rem", marginBottom: "1.8rem" }}>
                    <p style={{ fontSize: 14, color: mutedText, lineHeight: 1.7, fontStyle: "italic", marginBottom: ".6rem" }}>"{cs.testimonial}"</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: headingColor, margin: 0 }}>{cs.clientName} <span style={{ color: mutedText3, fontWeight: 400 }}>— {cs.clientRole}</span></p>
                  </div>

                  <Link to={`/case-studies/${cs.id}`} className="btn-ghost" style={{ display: "inline-block" }}>
                    Read full breakdown →
                  </Link>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <hr className="divider" />

      {/* ── PROOF GALLERY ── */}
      <Section>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <SectionLabel>Verified client results</SectionLabel>
            <Heading size="2rem">Check our clients' <GradText>sales proof</GradText></Heading>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.2rem" }} className="how-grid">
            {GALLERY.map((item, i) => (
              <GalleryCard
                key={i}
                item={item}
                dark={dark}
                mutedText={mutedText}
                mutedText3={mutedText3}
                headingColor={headingColor}
              />
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* ── BOTTOM CTA ── */}
      <Section style={{ paddingBottom: "8rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ background: "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 24, padding: "clamp(2.5rem,5vw,4rem) clamp(1.5rem,4vw,3rem)", textAlign: "center" }}>
            <SectionLabel>Ready for results like these?</SectionLabel>
            <Heading size="2rem">Your store could be<br /><GradText>the next case study.</GradText></Heading>
            <p style={{ fontSize: 15, color: mutedText2, margin: "1.5rem auto 2rem", maxWidth: 420 }}>
              Apply for a free store audit. We'll find your biggest leaks and hand you the roadmap to fix them.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap:"wrap" }}>
              <Link to="/contact" className="btn-g">Apply for your free audit →</Link>
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
  const cs = CASE_STUDIES?.find(item => item.id === id) || CASE_STUDIES?.[0];

  const headingColor = dark ? "#fff"                 : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.5)"  : "rgba(26,20,8,.65)";

  if (!cs) return <div style={{ padding: "10rem", textAlign: "center" }}>Loading breakdown...</div>;

  return (
    <PageWrapper>
      <SEO
        title={`${cs.headline} — ${cs.category} Case Study`}
        description={`How Bode Conversion Lab helped a ${cs.category} store: ${cs.headline}. Real numbers, real strategy, using the CGO methodology.`}
        path={`/case-studies/${cs.id}`}
      />
      <section style={{ padding: "7rem 2rem 4rem", textAlign: "center" }}>
        <Link to="/case-studies" style={{ color: G, textDecoration: "none" }}>← All case studies</Link>
        <h1 style={{ fontFamily: "'Syne',sans-serif", color: headingColor, marginTop: "1rem" }}>{cs.headline}</h1>
      </section>
      <Section>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Pass down the detail case study data dynamically here too */}
          <ProofPanel cs={cs} dark={dark} mutedText={mutedText} headingColor={headingColor} />
          
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", marginTop: "3rem" }}>
            {cs.story && cs.story.map((s, i) => (
              <div key={i} style={{ borderLeft: `2px solid rgba(0,255,136,.3)`, paddingLeft: "1.5rem" }}>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", color: headingColor, marginBottom: ".75rem" }}>{s.heading}</h2>
                <p style={{ fontSize: 15, color: mutedText, lineHeight: 1.9 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}