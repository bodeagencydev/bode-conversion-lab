import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { G, GG, PAST_PROJECTS, BADGES } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, useTheme, SEO } from "../components.jsx";
import { ScrollReveal, TiltCard, GlowBorder } from "../AnimationSystem.jsx";

/* ── GALLERY ARRAY ── */
const GALLERY = [
  { type: "video", src: "/proof/proof-1.png", videoSrc: "/proof/Videoproof1.mp4", label: "Stream Ride Store", tag: "$36k sales", color: "#00ff88" },
  { type: "video", src: "/proof/proof-2.png", videoSrc: "/proof/Videoproof2.mp4", label: "Novi Good store", tag: "4.3x ROAS-$57k sales", color: "#0081FB" },
  { type: "video", src: "/proof/proof-3.png", videoSrc: "/proof/Videoproof3.mp4", label: "Bomia Brand", tag: "$0-$4k sales", color: "#4285F4" },
  { type: "video", src: "/proof/proof-4.png", videoSrc: "/proof/Videoproof4.mp4", label: "Bomia Brand Store 2", tag: "Roas 2x", color: "#FFD700" },
  { type: "video", src: "/proof/proof-5.png", videoSrc: "/proof/Videoproof5.mp4", label: "Robin and Roobaby store", tag: "$77k sales", color: "#00ff88" },
  { type: "video", src: "/proof/proof-6.png", videoSrc: "/proof/Videoproof6.mp4", label: "Vista Market Online Store", tag: "$41k sales", color: "#ffffff" },
];

/* ── SHARED VIDEO-LOAD QUEUE ──
   Module-level, not per-component, so it actually caps how many videos
   decode at once across the whole gallery regardless of how many cards
   are simultaneously scrolled into view. The IntersectionObserver alone
   wasn't enough — a compact 3-column grid means most/all 6 cards can
   enter the viewport within milliseconds of each other on scroll, so
   they'd all still fire together without a real concurrency limit. ── */
const MAX_CONCURRENT_LOADS = 2;
let activeLoads = 0;
const loadQueue = [];
function requestLoadSlot(onGranted) {
  if (activeLoads < MAX_CONCURRENT_LOADS) {
    activeLoads++;
    onGranted();
  } else {
    loadQueue.push(onGranted);
  }
}
function releaseLoadSlot() {
  activeLoads = Math.max(0, activeLoads - 1);
  const next = loadQueue.shift();
  if (next) { activeLoads++; next(); }
}

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
  const [hasSlot, setHasSlot] = useState(false); // true once actually granted permission to load
  const captureRef = useRef(null);
  const wrapperRef = useRef(null);
  const releasedRef = useRef(false);

  // Step 1: only WANT to load once scrolled near view (cheap, no network cost).
  // Step 2: even then, only actually start decoding once a slot opens up in
  // the shared queue above — this is what stops a burst of simultaneous
  // decodes when several cards enter view together in a compact grid.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          requestLoadSlot(() => setHasSlot(true));
        }
      },
      { rootMargin: "150px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Release this card's slot exactly once, whether it finishes, fails, or
  // the user clicks play before it finished (no point holding a slot then).
  const releaseOnce = () => {
    if (!releasedRef.current) { releasedRef.current = true; releaseLoadSlot(); }
  };

  useEffect(() => {
    const vid = captureRef.current;
    if (!vid || !hasSlot || playing || thumb) return;

    const onLoadedMeta = () => {
      try { vid.currentTime = Math.min(1, (vid.duration || 2) / 4); }
      catch { setFailed(true); releaseOnce(); }
    };
    const onSeeked = () => {
      try {
        // Draw at a capped width instead of the video's native resolution
        // — these thumbnails render at maybe 300-400px wide on screen, so
        // capturing at full 1080p+ source resolution was pure waste, and
        // expensive waste at that (canvas draw + JPEG encode both scale
        // with pixel count).
        const nativeW = vid.videoWidth  || 320;
        const nativeH = vid.videoHeight || 200;
        const maxW = 480;
        const scale = Math.min(1, maxW / nativeW);
        const canvas = document.createElement("canvas");
        canvas.width  = Math.round(nativeW * scale);
        canvas.height = Math.round(nativeH * scale);
        canvas.getContext("2d").drawImage(vid, 0, 0, canvas.width, canvas.height);
        setThumb(canvas.toDataURL("image/jpeg", 0.78));
      } catch { setFailed(true); }
      releaseOnce();
    };
    const onError = () => { setFailed(true); releaseOnce(); };

    vid.addEventListener("loadedmetadata", onLoadedMeta);
    vid.addEventListener("seeked", onSeeked);
    vid.addEventListener("error", onError);
    return () => {
      vid.removeEventListener("loadedmetadata", onLoadedMeta);
      vid.removeEventListener("seeked", onSeeked);
      vid.removeEventListener("error", onError);
    };
  }, [hasSlot, playing, thumb]);

  // If the user clicks play before the background capture finished, give
  // the slot back immediately rather than holding it for a thumbnail
  // that's no longer needed.
  useEffect(() => { if (playing) releaseOnce(); }, [playing]);
  useEffect(() => () => releaseOnce(), []); // safety: release on unmount no matter what

  return (
    <div ref={wrapperRef} style={{
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
        {hasSlot && !playing && !thumb && !failed && (
          <video ref={captureRef} src={item.videoSrc} muted playsInline preload="metadata"
            style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }} />
        )}
        {playing ? (
          <video src={item.videoSrc} autoPlay muted playsInline controls preload="auto"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", border: "none" }}
            onError={() => setFailed(true)} />
        ) : failed ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(0,0,0,0.5)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="14" rx="2"/><path d="M3 9h18M9 21h6M12 17v4"/>
            </svg>
            <span style={{ fontSize: 12, color: mutedText3, textAlign: "center", padding: "0 1.5rem" }}>{item.label} video missing</span>
          </div>
        ) : thumb ? (
          <>
            <img src={thumb} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div onClick={() => setPlaying(true)}
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

export function PastProjects() {
  const { dark } = useTheme();
  // Only real, filled-in projects render publicly. Placeholder slots stay
  // in data.js for Fiyin to edit directly — see the comment there.
  const realProjects = PAST_PROJECTS.filter(p => !p.placeholder);
  const seoTag = (
    <SEO
      title="Past Projects — Real Work, Real Experience"
      description="A look at the actual work behind Bode Conversion Lab — client content projects and hands-on e-commerce operator experience."
      path="/past-projects"
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
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 16px", fontSize: 11, color: G, fontWeight: 600, letterSpacing: ".05em", marginBottom: "1.6rem" }}>
            <span style={{ width: 6, height: 6, background: G, borderRadius: "50%" }}/> Past work
          </span>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize: "clamp(2.2rem,6vw,3.8rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-.03em", color: headingColor, marginBottom: "1.2rem" }}>
            Real work.<br /><GradText>Real experience.</GradText>
          </h1>
          <p style={{ fontSize: "clamp(0.95rem,2vw,1.1rem)", color: mutedText2, lineHeight: 1.8, maxWidth: 520, margin: "0 auto 2rem" }}>
            What I've actually built and run — no invented numbers, no placeholder clients. Just the work, the tools, and how it went.
          </p>

          {realProjects.length > 0 && (
            <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:10 }}>
              {realProjects.map((p, i) => (
                <span key={p.id} style={{
                  fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:mutedText3,
                  border:`1px solid ${cardBorder}`, borderRadius:6, padding:"6px 12px",
                  display:"inline-flex", alignItems:"center", gap:8
                }}>
                  <span style={{ color:G }}>PROJECT_{String(i+1).padStart(2,"0")}</span>
                  <span>{p.category}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <hr className="divider" />

      {/* ── BADGES ── */}
      <Section>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 11, color: mutedText3, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700, marginBottom: "1.2rem" }}>
            Background
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

      {realProjects.length > 0 && (
        <>
          {/* ── PAST PROJECTS MAIN ── */}
          <Section>
            <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: "3rem" }}>
              {realProjects.map((p, index) => (
                <ScrollReveal key={p.id} delay={index * 0.05}>
                  <TiltCard style={{ background: dark ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.5)", border: `.5px solid ${cardBorder}`, borderRadius: 20, padding: "clamp(1.5rem,4vw,2.4rem)" }}>
                    <p style={{ fontSize: 11, color: G, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".6rem" }}>{p.category}</p>
                    <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize: "clamp(1.3rem,3vw,1.7rem)", fontWeight: 800, color: headingColor, lineHeight: 1.25, marginBottom: ".8rem" }}>{p.headline}</h2>
                    <p style={{ fontSize: 14.5, color: mutedText, lineHeight: 1.8, marginBottom: "1.4rem" }}>{p.summary}</p>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.4rem" }}>
                  {p.tags && p.tags.map((t, i) => (
                    <span key={i} style={{ background: "rgba(0,255,136,.08)", border: ".5px solid rgba(0,255,136,.2)", borderRadius: 100, padding: "3px 10px", fontSize: 10, color: G, fontWeight: 600 }}>{t}</span>
                  ))}
                  <span style={{ background: dark ? "rgba(255,255,255,.05)" : "rgba(26,20,8,.05)", border: dark ? ".5px solid rgba(255,255,255,.1)" : ".5px solid rgba(26,20,8,.1)", borderRadius: 100, padding: "3px 10px", fontSize: 10, color: mutedText3, fontWeight: 500 }}>{p.timeframe}</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.6rem" }} className="about-grid">
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: headingColor, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".6rem" }}>What I did</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {p.whatIDid && p.whatIDid.map((w, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ color: G, fontSize: 13, marginTop: 2, flexShrink: 0 }}>✓</span>
                          <p style={{ fontSize: 13, color: mutedText2, lineHeight: 1.7, margin: 0 }}>{w}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: headingColor, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".6rem" }}>Tools used</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {p.toolsUsed && p.toolsUsed.map((t, i) => (
                        <p key={i} style={{ fontSize: 13, color: mutedText2, lineHeight: 1.7, margin: 0 }}>{t}</p>
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: mutedText3, marginTop: "1rem" }}>Role: {p.role}</p>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
            </div>
          </Section>

          <hr className="divider" />
        </>
      )}

      {/* ── PROOF GALLERY ── */}
      <Section>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <SectionLabel>Client campaign clips</SectionLabel>
            <Heading size="2rem">Video work, <GradText>real results</GradText></Heading>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.2rem" }} className="how-grid">
            {GALLERY.map((item, i) => (
              <GalleryCard key={i} item={item} dark={dark} mutedText={mutedText} mutedText3={mutedText3} headingColor={headingColor} />
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* ── BOTTOM CTA ── */}
      <Section style={{ paddingBottom: "8rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ background: "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 24, padding: "clamp(2.5rem,5vw,4rem) clamp(1.5rem,4vw,3rem)", textAlign: "center" }}>
            <SectionLabel>Ready to work together?</SectionLabel>
            <Heading size="2rem">Your project could be<br /><GradText>the next one here.</GradText></Heading>
            <p style={{ fontSize: 15, color: mutedText2, margin: "1.5rem auto 2rem", maxWidth: 420 }}>
              Apply for a free store audit. We'll find your biggest leaks and hand you the roadmap to fix them.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap:"wrap" }}>
              <Link to="/audit" className="btn-g">Apply for your free audit →</Link>
            </div>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}

export function PastProjectDetail() {
  const { id } = useParams();
  const { dark } = useTheme();
  const p = PAST_PROJECTS?.find(item => item.id === id) || PAST_PROJECTS?.[0];

  const headingColor = dark ? "#fff"                 : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.5)"  : "rgba(26,20,8,.65)";
  const mutedText2   = dark ? "rgba(255,255,255,.45)" : "rgba(26,20,8,.6)";

  if (!p) return <div style={{ padding: "10rem", textAlign: "center" }}>Loading project...</div>;

  return (
    <PageWrapper>
      <SEO
        title={`${p.headline} — ${p.category}`}
        description={p.summary}
        path={`/past-projects/${p.id}`}
      />
      <section style={{ padding: "7rem 2rem 4rem", textAlign: "center" }}>
        <Link to="/past-projects" style={{ color: G, textDecoration: "none" }}>← All past projects</Link>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", color: headingColor, marginTop: "1rem" }}>{p.headline}</h1>
        <p style={{ fontSize: 14, color: mutedText, marginTop: ".5rem" }}>{p.category} · {p.timeframe}</p>
      </section>
      <Section>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontSize: 16, color: mutedText, lineHeight: 1.9, marginBottom: "2.5rem" }}>{p.summary}</p>

          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize: "1.1rem", color: headingColor, marginBottom: "1rem" }}>What I did</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "2.5rem" }}>
            {p.whatIDid && p.whatIDid.map((w, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: G, fontSize: 15, marginTop: 2 }}>✓</span>
                <p style={{ fontSize: 15, color: mutedText2, lineHeight: 1.8, margin: 0 }}>{w}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize: "1.1rem", color: headingColor, marginBottom: "1rem" }}>Tools used</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {p.toolsUsed && p.toolsUsed.map((t, i) => (
              <span key={i} style={{ background: "rgba(0,255,136,.08)", border: ".5px solid rgba(0,255,136,.2)", borderRadius: 100, padding: "5px 14px", fontSize: 12.5, color: G, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}
