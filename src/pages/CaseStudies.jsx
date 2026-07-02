import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { G, GG, CASE_STUDIES, BADGES } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles, useTheme } from "../components.jsx";
import { ScrollReveal, TiltCard, GlowBorder } from "../AnimationSystem.jsx";

/* ── PROOF PLACEHOLDER — drop real files into /public/proof/ ── */
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

/* ── PROOF PANEL — before/after screenshots per case study ── */
function ProofPanel({ studyId, dark, mutedText, headingColor }) {
  const proof = PROOF[studyId];
  if (!proof) return null;

  const placeholderStyle = (isAfter) => ({
    width:"100%", aspectRatio:"16/9", borderRadius:10,
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8,
    background: isAfter ? "rgba(0,255,136,.05)" : dark ? "rgba(255,255,255,.03)" : "rgba(26,20,8,.04)",
    border: isAfter ? ".5px solid rgba(0,255,136,.25)" : `.5px solid ${dark?"rgba(255,255,255,.1)":"rgba(26,20,8,.12)"}`,
  });

  return (
    <div style={{ marginTop:"1.5rem" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#FF3B3B", flexShrink:0 }}/>
            <span style={{ fontSize:11, fontWeight:700, color:headingColor, textTransform:"uppercase", letterSpacing:".05em" }}>Before</span>
          </div>
          <div style={placeholderStyle(false)}>
            <img src={proof.before} alt="Before" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:10, display:"block" }}
              onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}/>
            <div style={{ display:"none", flexDirection:"column", alignItems:"center", gap:6, padding:"2rem" }}>
              <span style={{ fontSize:24 }}>📉</span>
              <span style={{ fontSize:12, color:mutedText, textAlign:"center" }}>Before screenshot<br/>coming soon</span>
            </div>
          </div>
        </div>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:G, flexShrink:0 }}/>
            <span style={{ fontSize:11, fontWeight:700, color:G, textTransform:"uppercase", letterSpacing:".05em" }}>After</span>
          </div>
          <div style={placeholderStyle(true)}>
            <img src={proof.after} alt="After" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:10, display:"block" }}
              onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}/>
            <div style={{ display:"none", flexDirection:"column", alignItems:"center", gap:6, padding:"2rem" }}>
              <span style={{ fontSize:24 }}>📈</span>
              <span style={{ fontSize:12, color:G, textAlign:"center" }}>After screenshot<br/>coming soon</span>
            </div>
          </div>
        </div>
      </div>
      <p style={{ fontSize:12, color:mutedText, marginTop:".75rem", fontStyle:"italic", textAlign:"center" }}>📊 {proof.caption}</p>
    </div>
  );
}

/* ── PROOF GALLERY ITEMS — update src with real files or YouTube embeds ── */
const GALLERY = [
  {
    type: "image",
    src:  "/proof/proof-1.png",
    videoId: null,
    label: "Shopify Revenue Dashboard",
    tag:   "Marcus T. — $38k/mo",
    color: "#00ff88",
  },
  {
    type: "video",
    src:  "/proof/proof-2.png",
    videoId: "HcNzgUUQI5g", // replace with real Loom/YouTube ID
    label: "Meta Ads Manager — ROAS Scale",
    tag:   "Tunde N. — 4.3x ROAS",
    color: "#0081FB",
  },
  {
    type: "image",
    src:  "/proof/proof-3.png",
    videoId: null,
    label: "Google Ads — CPA Reduction",
    tag:   "Priya S. — CPA $68→$19",
    color: "#4285F4",
  },
  {
    type: "video",
    src:  "/proof/proof-4.png",
    videoId: "SklDEDMQmmY", // replace with real Loom/YouTube ID
    label: "Klaviyo Email Flow Revenue",
    tag:   "Marcus T. — Email flows",
    color: "#FFD700",
  },
  {
    type: "image",
    src:  "/proof/proof-5.png",
    videoId: null,
    label: "Shopify Analytics — CVR Jump",
    tag:   "Priya S. — 4.8% CVR",
    color: "#00ff88",
  },
  {
    type: "video",
    src:  "/proof/proof-6.png",
    videoId: "vxmXlxLjDRY", // replace with real Loom/YouTube ID
    label: "TikTok Ads — Before & After",
    tag:   "Tunde N. — Same budget",
    color: "#ffffff",
  },
];

/* ── GALLERY CARD — handles both image and video ── */
function GalleryCard({ item, dark, mutedText, mutedText3, headingColor }) {
  const [playing, setPlaying] = useState(false);
  const cardBorder = dark ? "rgba(255,255,255,.12)" : "rgba(26,20,8,.15)";

  return (
    <div style={{
      background: dark
        ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))"
        : "linear-gradient(135deg,rgba(255,255,255,.55),rgba(255,255,255,.25))",
      border: `.5px solid ${cardBorder}`,
      borderTop: dark ? ".5px solid rgba(255,255,255,.2)" : ".5px solid rgba(255,255,255,.7)",
      borderRadius:16, overflow:"hidden", position:"relative",
      transition:"transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px) scale(1.01)"; e.currentTarget.style.boxShadow=dark?"0 24px 48px rgba(0,255,136,.1)":"0 24px 48px rgba(26,20,8,.1)"; e.currentTarget.style.borderColor="rgba(0,255,136,.35)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=cardBorder; }}>

      {/* Media area */}
      <div style={{ aspectRatio:"16/10", position:"relative", overflow:"hidden", background:dark?"rgba(0,0,0,.4)":"rgba(26,20,8,.06)", cursor: item.type==="video" ? "pointer" : "default" }}>

        {/* Playing state — YouTube/Loom embed */}
        {playing && item.videoId && (
          <iframe
            src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&rel=0`}
            title={item.label}
            allow="autoplay; fullscreen"
            allowFullScreen
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }}
          />
        )}

        {/* Thumbnail / image state */}
        {!playing && (
          <>
            <img
              src={item.src}
              alt={item.label}
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
              onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
            />
            {/* Placeholder */}
            <div style={{ display:"none", position:"absolute", inset:0, flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="14" rx="2"/><path d="M3 9h18M9 21h6M12 17v4"/>
              </svg>
              <span style={{ fontSize:12, color:mutedText3, textAlign:"center", padding:"0 1.5rem" }}>{item.label}</span>
              <span style={{ fontSize:10, color:mutedText3, opacity:.6 }}>Drop file in /public/proof/</span>
            </div>

            {/* Video play button overlay */}
            {item.type === "video" && item.videoId && (
              <div
                onClick={() => setPlaying(true)}
                style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,.35)", backdropFilter:"blur(2px)", transition:"background .2s" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(0,0,0,.5)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(0,0,0,.35)"}>
                <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(255,0,0,.9)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(0,0,0,.4)" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="white"><path d="M6 4L16 10L6 16Z"/></svg>
                </div>
              </div>
            )}
          </>
        )}

        {/* Result tag */}
        <div style={{ position:"absolute", bottom:8, left:8, background:"rgba(0,0,0,.75)", backdropFilter:"blur(8px)", borderRadius:100, padding:"3px 10px", border:`.5px solid ${item.color}55` }}>
          <span style={{ fontSize:10, fontWeight:700, color:item.color }}>{item.tag}</span>
        </div>

        {/* Video/Image type badge */}
        <div style={{ position:"absolute", top:8, right:8, background:"rgba(0,0,0,.6)", borderRadius:6, padding:"2px 8px" }}>
          <span style={{ fontSize:10, color:"rgba(255,255,255,.8)", fontWeight:600 }}>{item.type === "video" ? "▶ Video" : "📊 Screenshot"}</span>
        </div>
      </div>

      {/* Label */}
      <div style={{ padding:".9rem 1rem", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
        <span style={{ fontSize:12, fontWeight:600, color:headingColor, lineHeight:1.4 }}>{item.label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
          <path d="M7 17L17 7M7 7h10v10"/>
        </svg>
      </div>
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

                {/* LEFT: Proof panel */}
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
                  {/* Before/After */}
                  <ProofPanel studyId={cs.id} dark={dark} mutedText={mutedText} headingColor={headingColor} />
                </TiltCard>

                {/* RIGHT: Story */}
                <div>
                  <p style={{ fontSize:11, color:G, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", marginBottom:".6rem" }}>{cs.category}</p>
                  <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:800, color:headingColor, lineHeight:1.2, marginBottom:"1rem" }}>{cs.headline}</h2>
                  <p style={{ fontSize:15, color:mutedText, lineHeight:1.8, marginBottom:"1.8rem" }}>{cs.summary}</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"1.2rem", marginBottom:"2rem" }}>
                    {cs.story.map((s, i) => (
                      <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                        <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:G, flexShrink:0, fontFamily:"'Syne',sans-serif" }}>
                          {String(i+1).padStart(2,"0")}
                        </div>
                        <div>
                          <p style={{ fontSize:13, fontWeight:700, color:headingColor, marginBottom:4 }}>{s.heading}</p>
                          <p style={{ fontSize:13, color:mutedText2, lineHeight:1.7 }}>{s.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Testimonial */}
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

      {/* ── PROOF GALLERY — 6 boxes, images + videos ── */}
      <Section>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
            <SectionLabel>Verified client results</SectionLabel>
            <Heading size="2rem">Check our clients' <GradText>sales proof</GradText></Heading>
            <p style={{ fontSize:14, color:mutedText2, marginTop:".75rem", lineHeight:1.7, maxWidth:480, margin:".75rem auto 0" }}>
              Real dashboards. Real ad accounts. Every screenshot and recording is from an actual client.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.2rem" }} className="how-grid">
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

          <p style={{ textAlign:"center", fontSize:12, color:mutedText3, marginTop:"1.5rem", lineHeight:1.7 }}>
            All dashboards shown are from real client accounts. Client details shared with permission.
          </p>
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
          <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap", marginBottom:"2.5rem" }}>
            {[{l:"Platform",v:cs.platform},{l:"Timeframe",v:cs.timeframe},{l:"Ad spend",v:cs.adSpend}].map((m,i) => (
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