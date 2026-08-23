import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { G, GG, BLOG_POSTS } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, useTheme, SEO } from "../components.jsx";

export function Blog() {
  const { dark } = useTheme();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...new Set(BLOG_POSTS.map(p => p.category))];
  const restPosts = BLOG_POSTS.slice(1);
  const filteredPosts = activeCategory === "All" ? restPosts : restPosts.filter(p => p.category === activeCategory);

  const headingColor = dark ? "#fff"                 : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.5)"  : "rgba(26,20,8,.65)";
  const mutedText2   = dark ? "rgba(255,255,255,.45)" : "rgba(26,20,8,.6)";
  const mutedText3   = dark ? "rgba(255,255,255,.4)"  : "rgba(26,20,8,.55)";
  const mutedText4   = dark ? "rgba(255,255,255,.3)"  : "rgba(26,20,8,.45)";
  const mutedText5   = dark ? "rgba(255,255,255,.25)" : "rgba(26,20,8,.38)";
  const cardBorder   = dark ? "rgba(255,255,255,.12)" : "rgba(26,20,8,.18)";

  return (
    <PageWrapper>
      <SEO
        title="Blog — E-commerce Conversion & Ads Tips"
        description="Operator-tested tactics on ROAS, checkout optimization, ad strategy, and email flows — no fluff, no recycled advice. From the team behind the CGO methodology."
        path="/blog"
      />

      {/* ── HERO ── */}
      <section style={{ position:"relative", padding:"7rem 2rem 5rem", overflow:"hidden" }}>
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
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem", marginBottom:"1.8rem" }}>
            <p style={{ fontSize:11, color:mutedText4, letterSpacing:".12em", textTransform:"uppercase", fontWeight:700, margin:0 }}>More articles</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{
                    background: activeCategory===cat ? "rgba(0,255,136,.14)" : "transparent",
                    border: activeCategory===cat ? ".5px solid rgba(0,255,136,.45)" : `.5px solid ${cardBorder}`,
                    color: activeCategory===cat ? G : mutedText3,
                    borderRadius:100, padding:"5px 14px", fontSize:12, fontWeight:600,
                    cursor:"pointer", fontFamily:"inherit", transition:"all .2s",
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.2rem" }} className="how-grid">
            {filteredPosts.length === 0 ? (
              <p style={{ fontSize:14, color:mutedText3, gridColumn:"1/-1", textAlign:"center", padding:"2rem 0" }}>No articles in this category yet.</p>
            ) : filteredPosts.map((post) => (
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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      setProgress(scrollable > 0 ? Math.min(100, (h.scrollTop / scrollable) * 100) : 0);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <PageWrapper>
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.id}`}
        article={{ datePublished: post.date ? new Date(post.date).toISOString().slice(0, 10) : undefined }}
      />
      <div style={{ position:"fixed", top:0, left:0, right:0, height:3, zIndex:9999, background:dark?"rgba(255,255,255,.06)":"rgba(26,20,8,.08)" }}>
        <div style={{ height:"100%", width:`${progress}%`, background:GG, transition:"width .1s linear" }}/>
      </div>
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
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.8rem,5vw,2.8rem)", fontWeight:800, lineHeight:1.15, letterSpacing:"-.02em", color:headingColor, marginBottom:"1.4rem" }}>{post.title}</h1>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem", marginBottom:"2.5rem", paddingBottom:"1.4rem", borderBottom:`.5px solid ${cardBorder}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(0,255,136,.15)", border:".5px solid rgba(0,255,136,.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:G, fontFamily:"'Syne',sans-serif", flexShrink:0 }}>F</div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:headingColor, margin:0 }}>Fiyin — Founder, Bode Conversion Lab</p>
                <div style={{ display:"flex", gap:10 }}>
                  <span style={{ fontSize:12, color:mutedText3 }}>{post.date}</span>
                  <span style={{ fontSize:12, color:mutedText3 }}>{post.readTime}</span>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <a
                href={"https://wa.me/?text=" + encodeURIComponent(`${post.title} — ${shareUrl}`)}
                target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", justifyContent:"center", width:34, height:34, borderRadius:"50%", background:dark?"rgba(255,255,255,.06)":"rgba(26,20,8,.06)", border:`.5px solid ${cardBorder}`, color:mutedText3, textDecoration:"none", transition:"all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(0,255,136,.4)"; e.currentTarget.style.color=G; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=cardBorder; e.currentTarget.style.color=mutedText3; }}
                title="Share on WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 0 0 3.85 1h0a7.94 7.94 0 0 0 5.55-13.58zM12.05 18.4a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.65.67-2.43-.16-.25a6.6 6.6 0 1 1 5.6 3.09zm3.6-4.94c-.2-.1-1.17-.58-1.35-.64s-.32-.1-.45.1-.5.64-.62.77-.23.15-.43.05a5.4 5.4 0 0 1-2.7-2.36c-.2-.35.2-.32.58-1.08.06-.13.03-.24-.02-.34s-.45-1.08-.62-1.48-.33-.34-.45-.34h-.4a.75.75 0 0 0-.55.26 2.3 2.3 0 0 0-.72 1.7 4 4 0 0 0 .85 2.13 9.1 9.1 0 0 0 3.5 3.1c.49.21.87.34 1.17.43.49.16.94.13 1.29.08.4-.06 1.17-.48 1.33-.94s.17-.87.12-.95-.18-.14-.38-.24z"/></svg>
              </a>
              <button
                onClick={() => { navigator.clipboard.writeText(shareUrl); }}
                style={{ display:"flex", alignItems:"center", justifyContent:"center", width:34, height:34, borderRadius:"50%", background:dark?"rgba(255,255,255,.06)":"rgba(26,20,8,.06)", border:`.5px solid ${cardBorder}`, color:mutedText3, cursor:"pointer", transition:"all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(0,255,136,.4)"; e.currentTarget.style.color=G; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=cardBorder; e.currentTarget.style.color=mutedText3; }}
                title="Copy link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </button>
            </div>
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

          {relatedPosts.length > 0 && (
            <div style={{ marginTop:"4rem" }}>
              <p style={{ fontSize:11, color:mutedText3, letterSpacing:".1em", textTransform:"uppercase", fontWeight:700, marginBottom:"1.2rem" }}>Related articles</p>
              <div style={{ display:"grid", gridTemplateColumns:`repeat(${relatedPosts.length},1fr)`, gap:"1rem" }} className="how-grid">
                {relatedPosts.map(rp => (
                  <Link key={rp.id} to={`/blog/${rp.id}`} style={{ textDecoration:"none" }}>
                    <div style={{
                      background: dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(255,255,255,.5),rgba(255,255,255,.2))",
                      border:`.5px solid ${cardBorder}`, borderRadius:14, padding:"1.2rem",
                      transition:"transform .3s cubic-bezier(.22,1,.36,1), border-color .3s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.borderColor="rgba(0,255,136,.35)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor=cardBorder; }}>
                      <h4 style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:headingColor, marginBottom:6, lineHeight:1.4 }}>{rp.title}</h4>
                      <span style={{ fontSize:11, color:G, fontWeight:700 }}>Read →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

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