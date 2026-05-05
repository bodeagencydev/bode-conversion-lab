import { Link, useParams } from "react-router-dom";
import { G, GG, CASE_STUDIES } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles, useTheme } from "../components.jsx";

export function CaseStudies() {
  const { dark } = useTheme();
  const headingColor = dark ? "#fff" : "#0a0a0a";
  const mutedText = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const mutedText2 = dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)";
  const tagBg = dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.05)";
  const tagBorder = dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.08)";
  const resultLabel = dark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.35)";
  const resultBefore = dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)";

  return (
    <PageWrapper>
      <section style={{ position: "relative", padding: "clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) 3rem", overflow: "hidden" }}>
        <Particles />
        <div style={{ position: "absolute", width: 400, height: 400, top: -100, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: G, fontWeight: 500 }}>
              <span style={{ width: 6, height: 6, background: G, borderRadius: "50%" }} /> Real results
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(2rem,7vw,3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.03em", color: headingColor, marginBottom: "1.2rem", wordBreak: "break-word" }}>
            Case <GradText>Studies</GradText>
          </h1>
          <p style={{ fontSize: "clamp(0.9rem,3vw,1.05rem)", color: mutedText, lineHeight: 1.75 }}>
            Real stores. Real problems. Real results. These are the transformations our system delivers.
          </p>
        </div>
      </section>

      <hr className="divider" />

      <Section>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {CASE_STUDIES.map((cs) => (
            <Link key={cs.id} to={`/case-studies/${cs.id}`} style={{ textDecoration: "none", display: "block" }}>
              <div className="glass" style={{ padding: "clamp(1.2rem,4vw,2.5rem)", cursor: "pointer", transition: "border-color .3s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,255,136,.4)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1rem" }}>
                  <span style={{ background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: G, fontWeight: 600 }}>{cs.category}</span>
                  {cs.tags.map(t => <span key={t} style={{ background: tagBg, border: `.5px solid ${tagBorder}`, borderRadius: 100, padding: "3px 10px", fontSize: 11, color: mutedText2 }}>{t}</span>)}
                </div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.1rem,4vw,1.5rem)", fontWeight: 800, color: headingColor, marginBottom: ".75rem", lineHeight: 1.2, wordBreak: "break-word" }}>{cs.headline}</h2>
                <p style={{ fontSize: "clamp(13px,3vw,14px)", color: mutedText, lineHeight: 1.7, marginBottom: "1.5rem" }}>{cs.summary}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.2rem" }}>
                  {[cs.result1, cs.result2, cs.result3].map((r, j) => (
                    <div key={j} style={{ textAlign: "center", background: "rgba(0,255,136,.06)", border: ".5px solid rgba(0,255,136,.18)", borderRadius: 12, padding: "clamp(0.6rem,2vw,1rem) clamp(0.5rem,2vw,1.2rem)" }}>
                      <p style={{ fontSize: "clamp(9px,2.5vw,11px)", color: resultLabel, marginBottom: 4 }}>{r.label}</p>
                      <p style={{ fontSize: "clamp(10px,2.5vw,13px)", color: resultBefore, marginBottom: 2 }}>{r.before}</p>
                      <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(12px,3.5vw,16px)", fontWeight: 800, background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{r.after}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: G, fontSize: 13, fontWeight: 600 }}>
                  Read full case study <span style={{ fontSize: 16 }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <hr className="divider" />

      <Section style={{ paddingBottom: "6rem" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel>Your turn</SectionLabel>
          <Heading size="2.4rem">Want to be our<br /><GradText>next case study?</GradText></Heading>
          <p style={{ fontSize: 15, color: mutedText, lineHeight: 1.7, margin: "1.5rem 0" }}>Apply for a free audit and see exactly what we'd fix in your store.</p>
          <Link to="/contact" className="btn-g" style={{ display: "inline-block" }}>Apply for your free audit →</Link>
        </div>
      </Section>
    </PageWrapper>
  );
}

export function CaseStudyDetail() {
  const { id } = useParams();
  const { dark } = useTheme();
  const cs = CASE_STUDIES.find(c => c.id === id);

  const headingColor = dark ? "#fff" : "#0a0a0a";
  const mutedText = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const mutedText2 = dark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.55)";
  const mutedText3 = dark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.35)";
  const mutedText4 = dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)";
  const tagBg = dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.05)";
  const tagBorder = dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.08)";
  const backLink = dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)";

  if (!cs) return (
    <PageWrapper>
      <Section>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: headingColor, fontFamily: "'Syne',sans-serif", fontSize: "2rem" }}>Case study not found</h1>
          <Link to="/case-studies" className="btn-g" style={{ display: "inline-block", marginTop: "2rem" }}>← Back to case studies</Link>
        </div>
      </Section>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <section style={{ position: "relative", padding: "clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) 3rem", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 400, height: 400, top: -80, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Link to="/case-studies" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: backLink, textDecoration: "none", fontSize: 13, marginBottom: "2rem" }}>← Back to case studies</Link>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.2rem" }}>
            <span style={{ background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: G, fontWeight: 600 }}>{cs.category}</span>
            {cs.tags.map(t => <span key={t} style={{ background: tagBg, border: `.5px solid ${tagBorder}`, borderRadius: 100, padding: "3px 10px", fontSize: 11, color: mutedText4 }}>{t}</span>)}
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.6rem,5vw,2.8rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", color: headingColor, marginBottom: "1rem", wordBreak: "break-word" }}>{cs.headline}</h1>
          <p style={{ fontSize: "clamp(0.9rem,3vw,1.05rem)", color: mutedText, lineHeight: 1.75 }}>{cs.summary}</p>
        </div>
      </section>

      <hr className="divider" />

      <Section>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "4rem" }}>
            {[cs.result1, cs.result2, cs.result3].map((r, i) => (
              <div key={i} className="stat-card" style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, color: mutedText3, marginBottom: 8 }}>{r.label}</p>
                <p style={{ fontSize: "clamp(11px,3vw,14px)", color: mutedText4, marginBottom: 4 }}>Before: <span style={{ color: "#ff6b6b" }}>{r.before}</span></p>
                <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.2rem,4vw,1.8rem)", fontWeight: 800, background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>After: {r.after}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {cs.story.map((s, i) => (
              <div key={i} style={{ borderLeft: `2px solid rgba(0,255,136,0.3)`, paddingLeft: "clamp(1rem,4vw,2rem)" }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1rem,4vw,1.2rem)", fontWeight: 800, color: headingColor, marginBottom: "1rem" }}>{s.heading}</h3>
                <p style={{ fontSize: "clamp(13px,3vw,15px)", color: mutedText2, lineHeight: 1.85 }}>{s.body}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 20, padding: "clamp(1.5rem,4vw,2.5rem)", textAlign: "center", marginTop: "4rem" }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.2rem,4vw,1.5rem)", fontWeight: 800, color: headingColor, marginBottom: ".75rem" }}>Want results like these?</h3>
            <p style={{ fontSize: 14, color: mutedText, marginBottom: "1.5rem", lineHeight: 1.7 }}>Apply for a free store audit and see exactly what we'd fix in your funnel.</p>
            <Link to="/contact" className="btn-g" style={{ display: "inline-block" }}>Apply for your free audit →</Link>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}