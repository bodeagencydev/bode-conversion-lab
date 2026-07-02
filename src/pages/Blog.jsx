import { Link, useParams } from "react-router-dom";
import { G, GG, BLOG_POSTS } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles, useTheme } from "../components.jsx";

export function Blog() {
  const { dark } = useTheme();

  const headingColor = dark ? "#fff"                 : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.5)"  : "rgba(26,20,8,.65)";
  const mutedText2   = dark ? "rgba(255,255,255,.45)" : "rgba(26,20,8,.6)";
  const mutedText3   = dark ? "rgba(255,255,255,.4)"  : "rgba(26,20,8,.55)";
  const mutedText4   = dark ? "rgba(255,255,255,.3)"  : "rgba(26,20,8,.45)";
  const mutedText5   = dark ? "rgba(255,255,255,.25)" : "rgba(26,20,8,.38)";
  const cardBorder   = dark ? "rgba(255,255,255,.12)" : "rgba(26,20,8,.18)";

  return (
    <PageWrapper>

      {/* ── HERO ── */}
      <section style={{ position:"relative", padding:"7rem 2rem 5rem", overflow:"hidden" }}>
        <Particles />
        <div style={{ position:"absolute", width:600, height:600, top:-150, left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
        <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.28)", borderRadius:100, padding:"5px 16px", fontSize:11, color:G, fontWeight:600, letterSpacing:".05em", marginBottom:"1.6rem" }}>
            <span style={{ width:6, height:6, background:G, borderRadius:"50%", animation:"pulse 2s ease-in-out infinite" }}/> Free resources
          </span>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(2.2rem,6vw,3.8rem)", fontWeight:800, lineHeight:1.08, letterSpacing:"-.03em", color:headingColor, marginBottom:"1.2rem" }}>
            The Conversion<br /><GradText>Lab Blog</GradText>
          </h1>
          <p style={{ fontSize:"clamp(0.95rem,2vw,1.1rem)", color:mutedText2, lineHeight:1.8, maxWidth:520, margin:"0 auto" }}>
            No fluff. No recycled advice. Operator-tested tactics, frameworks, and systems we use to grow stores worldwide.
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* ── FEATURED POST ── */}
      <Section>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <p style={{ fontSize:11, color:mutedText4, letterSpacing:".12em", textTransform:"uppercase", fontWeight:700, marginBottom:"1.2rem" }}>Featured</p>
          <Link to={`/blog/${BLOG_POSTS[0].id}`} style={{ textDecoration:"none", display:"block" }}>
            <div style={{
              background: dark
                ? "linear-gradient(135deg,rgba(0,255,136,.07),rgba(0,204,106,.02))"
                : "linear-gradient(135deg,rgba(255,255,255,.55),rgba(255,255,255,.25))",
              border:`.5px solid ${dark?"rgba(0,255,136,.22)":"rgba(26,20,8,.18)"}`,
              borderTop:`.5px solid ${dark?"rgba(0,255,136,.4)":"rgba(255,255,255,.7)"}`,
              borderRadius:24, padding:"clamp(2rem,5vw,3.5rem)",
              position:"relative", overflow:"hidden",
              transition:"transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow=dark?"0 32px 64px rgba(0,255,136,.1)":"0 32px 64px rgba(26,20,8,.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>

              {/* Top shimmer */}
              <div style={{ position:"absolute", top:0, left:"8%", right:"8%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)", pointerEvents:"none" }}/>

              {/* Glow orb */}
              <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, background:"radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>

              <div style={{ display:"flex", gap:"clamp(1.5rem,4vw,3rem)", alignItems:"flex-start", flexWrap:"wrap" }}>
                {/* Left content */}
                <div style={{ flex:1, minWidth:280 }}>
                  <div style={{ display:"flex", gap:8, marginBottom:"1.4rem", flexWrap:"wrap" }}>
                    <span style={{ background:"rgba(0,255,136,.12)", border:".5px solid rgba(0,255,136,.35)", borderRadius:100, padding:"4px 12px", fontSize:11, color:G, fontWeight:700, letterSpacing:".04em" }}>Featured</span>
                    <span style={{ background:dark?"rgba(255,255,255,.06)":"rgba(26,20,8,.06)", border:dark?".5px solid rgba(255,255,255,.12)":".5px solid rgba(26,20,8,.14)", borderRadius:100, padding:"4px 12px", fontSize:11, color:mutedText3, fontWeight:500 }}>{BLOG_POSTS[0].category}</span>
                  </div>
                  <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:800, color:headingColor, marginBottom:"1rem", lineHeight:1.2 }}>{BLOG_POSTS[0].title}</h2>
                  <p style={{ fontSize:15, color:mutedText, lineHeight:1.8, marginBottom:"2rem" }}>{BLOG_POSTS[0].excerpt}</p>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                    <div style={{ display:"flex", gap:"1.5rem" }}>
                      <span style={{ fontSize:12, color:mutedText4 }}>{BLOG_POSTS[0].date}</span>
                      <span style={{ fontSize:12, color:mutedText4 }}>{BLOG_POSTS[0].readTime}</span>
                    </div>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:6, color:G, fontSize:13, fontWeight:700, background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.28)", borderRadius:100, padding:"6px 16px" }}>
                      Read article →
                    </span>
                  </div>
                </div>

                {/* Right — article preview */}
                <div style={{ width:"min(260px,100%)", background:dark?"rgba(0,0,0,.25)":"rgba(26,20,8,.04)", border:dark?".5px solid rgba(255,255,255,.08)":".5px solid rgba(26,20,8,.12)", borderRadius:16, padding:"1.5rem", flexShrink:0 }}>
                  <p style={{ fontSize:11, color:mutedText4, letterSpacing:".08em", textTransform:"uppercase", fontWeight:600, marginBottom:"1rem" }}>In this article</p>
                  {BLOG_POSTS[0].content.map((s, i) => (
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:".75rem" }}>
                      <span style={{ width:18, height:18, borderRadius:"50%", background:"rgba(0,255,136,.12)", border:".5px solid rgba(0,255,136,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:G, flexShrink:0 }}>{i+1}</span>
                      <span style={{ fontSize:12, color:mutedText3, lineHeight:1.5 }}>{s.heading}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </Section>

      <hr className="divider" />

      {/* ── MORE POSTS ── */}
      <Section>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <p style={{ fontSize:11, color:mutedText4, letterSpacing:".12em", textTransform:"uppercase", fontWeight:700, marginBottom:"1.8rem" }}>More articles</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.2rem" }} className="how-grid">
            {BLOG_POSTS.slice(1).map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} style={{ textDecoration:"none" }}>
                <div style={{
                  background: dark
                    ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))"
                    : "linear-gradient(135deg,rgba(255,255,255,.5),rgba(255,255,255,.2))",
                  border:`.5px solid ${cardBorder}`,
                  borderTop:dark?".5px solid rgba(255,255,255,.18)":".5px solid rgba(255,255,255,.7)",
                  borderRadius:18, padding:"1.8rem", height:"100%", cursor:"pointer",
                  display:"flex", flexDirection:"column", position:"relative", overflow:"hidden",
                  transition:"transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s, border-color .3s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px) scale(1.01)"; e.currentTarget.style.boxShadow=dark?"0 24px 48px rgba(0,255,136,.08)":"0 24px 48px rgba(26,20,8,.1)"; e.currentTarget.style.borderColor="rgba(0,255,136,.35)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=cardBorder; }}>

                  {/* Shimmer */}
                  <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.35),transparent)", pointerEvents:"none" }}/>

                  <span style={{ display:"inline-block", background:"rgba(0,255,136,.08)", border:".5px solid rgba(0,255,136,.2)", borderRadius:100, padding:"3px 10px", fontSize:10, color:G, fontWeight:700, letterSpacing:".04em", marginBottom:"1.2rem", alignSelf:"flex-start" }}>{post.category}</span>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.05rem", fontWeight:800, color:headingColor, marginBottom:".75rem", lineHeight:1.3, flex:1 }}>{post.title}</h3>
                  <p style={{ fontSize:13, color:mutedText3, lineHeight:1.65, marginBottom:"1.5rem" }}>{post.excerpt.slice(0,110)}...</p>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"auto" }}>
                    <span style={{ fontSize:11, color:mutedText5 }}>{post.readTime}</span>
                    <span style={{ color:G, fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:4 }}>Read → </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* ── CTA ── */}
      <Section style={{ paddingBottom:"8rem" }}>
        <div style={{ maxWidth:640, margin:"0 auto" }}>
          <div style={{
            background: dark
              ? "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))"
              : "linear-gradient(135deg,rgba(255,255,255,.55),rgba(255,255,255,.25))",
            border:".5px solid rgba(0,255,136,.25)",
            borderTop:".5px solid rgba(0,255,136,.45)",
            borderRadius:24,
            padding:"clamp(2.5rem,5vw,4rem) clamp(1.5rem,4vw,3rem)",
            textAlign:"center",
            position:"relative", overflow:"hidden",
          }}>
            <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)", pointerEvents:"none" }}/>
            <div style={{ position:"absolute", top:-40, left:"50%", transform:"translateX(-50%)", width:160, height:160, background:"radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
            <SectionLabel>Want results, not just reading?</SectionLabel>
            <Heading size="2rem">Apply these tactics<br /><GradText>with our help</GradText></Heading>
            <p style={{ fontSize:15, color:mutedText2, lineHeight:1.75, margin:"1.5rem auto 2rem", maxWidth:420 }}>
              The fastest way to implement what you've read is with an operator who's done it 40+ times across real stores.
            </p>
            {/* ── CENTERED CTA ── */}
            <div style={{ display:"flex", justifyContent:"center" }}>
              <Link to="/contact" className="btn-g" style={{ display:"inline-block" }}>
                Apply for your free audit →
              </Link>
            </div>
          </div>
        </div>
      </Section>

    </PageWrapper>
  );
}

export function BlogPost() {
  const { id } = useParams();
  const { dark } = useTheme();
  const post = BLOG_POSTS.find(p => p.id === id);

  const headingColor = dark ? "#fff"                 : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.55)" : "rgba(26,20,8,.65)";
  const mutedText2   = dark ? "rgba(255,255,255,.45)" : "rgba(26,20,8,.6)";
  const mutedText3   = dark ? "rgba(255,255,255,.3)"  : "rgba(26,20,8,.45)";
  const cardBorder   = dark ? "rgba(255,255,255,.12)" : "rgba(26,20,8,.18)";

  if (!post) return (
    <PageWrapper>
      <Section>
        <div style={{ textAlign:"center" }}>
          <h1 style={{ color:headingColor, fontFamily:"'Syne',sans-serif" }}>Post not found</h1>
          <Link to="/blog" className="btn-g" style={{ display:"inline-block", marginTop:"2rem" }}>← Back to blog</Link>
        </div>
      </Section>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <section style={{ padding:"7rem 2rem 4rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:400, height:400, top:-80, left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle,rgba(0,255,136,.1),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
        <div style={{ maxWidth:720, margin:"0 auto", position:"relative", zIndex:1 }}>
          <Link to="/blog" style={{ display:"inline-flex", alignItems:"center", gap:6, color:mutedText3, textDecoration:"none", fontSize:13, fontWeight:500, marginBottom:"2rem", transition:"color .2s" }}
            onMouseEnter={e => e.currentTarget.style.color=G}
            onMouseLeave={e => e.currentTarget.style.color=mutedText3}>
            ← Back to blog
          </Link>
          <div style={{ display:"flex", gap:8, marginBottom:"1.4rem" }}>
            <span style={{ background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.25)", borderRadius:100, padding:"4px 12px", fontSize:11, color:G, fontWeight:700 }}>{post.category}</span>
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.8rem,5vw,2.8rem)", fontWeight:800, lineHeight:1.15, letterSpacing:"-.02em", color:headingColor, marginBottom:"1rem" }}>{post.title}</h1>
          <div style={{ display:"flex", gap:"1.5rem", marginBottom:"2.5rem" }}>
            <span style={{ fontSize:13, color:mutedText3 }}>{post.date}</span>
            <span style={{ fontSize:13, color:mutedText3 }}>{post.readTime}</span>
          </div>
          <p style={{ fontSize:"1.1rem", color:mutedText, lineHeight:1.8, fontStyle:"italic", borderLeft:`2px solid ${G}`, paddingLeft:"1.5rem", marginBottom:0 }}>{post.excerpt}</p>
        </div>
      </section>

      <hr className="divider" />

      {/* ── ARTICLE BODY ── */}
      <Section>
        <div style={{ maxWidth:720, margin:"0 auto" }}>

          {/* Table of contents */}
          <div style={{ background:dark?"rgba(0,255,136,.04)":"rgba(255,255,255,.45)", border:dark?".5px solid rgba(0,255,136,.18)":".5px solid rgba(26,20,8,.14)", borderRadius:14, padding:"1.4rem 1.6rem", marginBottom:"3rem" }}>
            <p style={{ fontSize:11, color:mutedText3, letterSpacing:".08em", textTransform:"uppercase", fontWeight:700, marginBottom:"1rem" }}>In this article</p>
            {post.content.map((s, i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"center", padding:"5px 0" }}>
                <span style={{ width:18, height:18, borderRadius:"50%", background:"rgba(0,255,136,.12)", border:".5px solid rgba(0,255,136,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:G, flexShrink:0 }}>{i+1}</span>
                <span style={{ fontSize:13, color:mutedText2, fontWeight:500 }}>{s.heading}</span>
              </div>
            ))}
          </div>

          {/* Content sections */}
          <div style={{ display:"flex", flexDirection:"column", gap:"3rem" }}>
            {post.content.map((section, i) => (
              <div key={i} style={{ borderLeft:`2px solid rgba(0,255,136,.25)`, paddingLeft:"1.5rem" }}>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.3rem", fontWeight:800, color:headingColor, marginBottom:"1rem" }}>{section.heading}</h2>
                <p style={{ fontSize:15, color:mutedText, lineHeight:1.9 }}>{section.body}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background:"linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border:".5px solid rgba(0,255,136,.25)", borderTop:".5px solid rgba(0,255,136,.45)", borderRadius:20, padding:"2.5rem", textAlign:"center", marginTop:"4rem", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)", pointerEvents:"none" }}/>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.4rem", fontWeight:800, color:headingColor, marginBottom:".75rem" }}>Want us to implement this for you?</h3>
            <p style={{ fontSize:14, color:mutedText2, marginBottom:"1.5rem", lineHeight:1.7, maxWidth:400, margin:"0 auto 1.5rem" }}>Apply for a free store audit. We'll identify your biggest opportunities and build the system to capture them.</p>
            <div style={{ display:"flex", justifyContent:"center" }}>
              <Link to="/contact" className="btn-g" style={{ display:"inline-block" }}>Apply for your free audit →</Link>
            </div>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}