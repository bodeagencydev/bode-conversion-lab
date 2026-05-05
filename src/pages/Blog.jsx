import { Link, useParams } from "react-router-dom";
import { G, GG, BLOG_POSTS } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles, useTheme } from "../components.jsx";

export function Blog() {
  const { dark } = useTheme();
  const headingColor = dark ? "#fff" : "#0a0a0a";
  const mutedText = dark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.5)";
  const mutedText2 = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const mutedText3 = dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)";
  const mutedText4 = dark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.35)";
  const mutedText5 = dark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.3)";

  return (
    <PageWrapper>
      <section style={{ position: "relative", padding: "6rem 2rem 4rem", overflow: "hidden" }}>
        <Particles />
        <div style={{ position: "absolute", width: 500, height: 500, top: -100, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: G, fontWeight: 500 }}>
              <span style={{ width: 6, height: 6, background: G, borderRadius: "50%" }} /> Free resources
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "3.2rem", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.03em", color: headingColor, marginBottom: "1.2rem" }}>
            The Conversion <GradText>Lab Blog</GradText>
          </h1>
          <p style={{ fontSize: "1.05rem", color: mutedText2, lineHeight: 1.75 }}>
            No fluff. No recycled advice. Just the tactics, frameworks, and systems we use to grow our clients' stores.
          </p>
        </div>
      </section>

      <hr className="divider" />

      <Section>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Featured post */}
          <Link to={`/blog/${BLOG_POSTS[0].id}`} style={{ textDecoration: "none", display: "block", marginBottom: "2rem" }}>
            <div className="glass card3d" style={{ padding: "3rem", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,255,136,.4)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}>
              <div style={{ display: "flex", gap: 8, marginBottom: "1.2rem" }}>
                <span style={{ background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: G, fontWeight: 600 }}>Featured</span>
                <span style={{ background: dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.05)", border: dark ? ".5px solid rgba(255,255,255,.1)" : ".5px solid rgba(0,0,0,.08)", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: mutedText3 }}>{BLOG_POSTS[0].category}</span>
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.8rem", fontWeight: 800, color: headingColor, marginBottom: "1rem", lineHeight: 1.2 }}>{BLOG_POSTS[0].title}</h2>
              <p style={{ fontSize: 15, color: mutedText, lineHeight: 1.7, marginBottom: "1.5rem" }}>{BLOG_POSTS[0].excerpt}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  <span style={{ fontSize: 12, color: mutedText4 }}>{BLOG_POSTS[0].date}</span>
                  <span style={{ fontSize: 12, color: mutedText4 }}>{BLOG_POSTS[0].readTime}</span>
                </div>
                <span style={{ color: G, fontSize: 13, fontWeight: 600 }}>Read article →</span>
              </div>
            </div>
          </Link>

          {/* Other posts */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }} className="how-grid">
            {BLOG_POSTS.slice(1).map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} style={{ textDecoration: "none" }}>
                <div className="glass card3d" style={{ padding: "2rem", height: "100%", cursor: "pointer", display: "flex", flexDirection: "column" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,255,136,.4)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}>
                  <span style={{ display: "inline-block", background: "rgba(0,255,136,.08)", border: ".5px solid rgba(0,255,136,.2)", borderRadius: 100, padding: "2px 8px", fontSize: 10, color: G, fontWeight: 600, marginBottom: "1rem" }}>{post.category}</span>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.05rem", fontWeight: 800, color: headingColor, marginBottom: ".75rem", lineHeight: 1.3, flex: 1 }}>{post.title}</h3>
                  <p style={{ fontSize: 13, color: mutedText3, lineHeight: 1.6, marginBottom: "1.2rem" }}>{post.excerpt.slice(0, 100)}...</p>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: mutedText5 }}>{post.readTime}</span>
                    <span style={{ color: G, fontSize: 12, fontWeight: 600 }}>Read →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      <Section style={{ paddingBottom: "8rem" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel>Want results, not just reading?</SectionLabel>
          <Heading size="2.2rem">Apply these tactics<br /><GradText>with our help</GradText></Heading>
          <p style={{ fontSize: 15, color: mutedText2, lineHeight: 1.7, margin: "1.5rem 0" }}>The fastest way to implement what you've read is with an expert who's done it 40+ times.</p>
          <Link to="/contact" className="btn-g" style={{ display: "inline-block" }}>Apply for your free audit →</Link>
        </div>
      </Section>
    </PageWrapper>
  );
}

export function BlogPost() {
  const { id } = useParams();
  const { dark } = useTheme();
  const post = BLOG_POSTS.find(p => p.id === id);

  const headingColor = dark ? "#fff" : "#0a0a0a";
  const mutedText = dark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)";
  const mutedText2 = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const mutedText3 = dark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.35)";
  const backLink = dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)";

  if (!post) return (
    <PageWrapper>
      <Section>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: headingColor, fontFamily: "'Syne',sans-serif" }}>Post not found</h1>
          <Link to="/blog" className="btn-g" style={{ display: "inline-block", marginTop: "2rem" }}>← Back to blog</Link>
        </div>
      </Section>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <section style={{ padding: "6rem 2rem 4rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 400, height: 400, top: -80, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.1),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Link to="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: backLink, textDecoration: "none", fontSize: 13, marginBottom: "2rem" }}>← Back to blog</Link>
          <div style={{ display: "flex", gap: 8, marginBottom: "1.2rem" }}>
            <span style={{ background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: G, fontWeight: 600 }}>{post.category}</span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.6rem", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", color: headingColor, marginBottom: "1rem" }}>{post.title}</h1>
          <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem" }}>
            <span style={{ fontSize: 13, color: mutedText3 }}>{post.date}</span>
            <span style={{ fontSize: 13, color: mutedText3 }}>{post.readTime}</span>
          </div>
          <p style={{ fontSize: "1.1rem", color: mutedText, lineHeight: 1.75, fontStyle: "italic", borderLeft: `2px solid ${G}`, paddingLeft: "1.5rem" }}>{post.excerpt}</p>
        </div>
      </section>

      <hr className="divider" />

      <Section>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {post.content.map((section, i) => (
              <div key={i}>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.3rem", fontWeight: 800, color: headingColor, marginBottom: "1rem" }}>{section.heading}</h2>
                <p style={{ fontSize: 15, color: mutedText, lineHeight: 1.85 }}>{section.body}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 20, padding: "2.5rem", textAlign: "center", marginTop: "4rem" }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.4rem", fontWeight: 800, color: headingColor, marginBottom: ".75rem" }}>Want us to implement this for you?</h3>
            <p style={{ fontSize: 14, color: mutedText2, marginBottom: "1.5rem", lineHeight: 1.7 }}>Apply for a free store audit. We'll identify your biggest opportunities and build the system to capture them.</p>
            <Link to="/contact" className="btn-g" style={{ display: "inline-block" }}>Apply for your free audit →</Link>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}