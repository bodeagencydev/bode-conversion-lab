import { Link, useParams } from "react-router-dom";
import { G, GG, CASE_STUDIES } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles } from "../components.jsx";

export function CaseStudies() {
  return (
    <PageWrapper>
      <section style={{ position: "relative", padding: "6rem 2rem 4rem", overflow: "hidden" }}>
        <Particles />
        <div style={{ position: "absolute", width: 500, height: 500, top: -100, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: G, fontWeight: 500 }}>
              <span style={{ width: 6, height: 6, background: G, borderRadius: "50%" }} /> Real results
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "3.2rem", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.03em", color: "#fff", marginBottom: "1.2rem" }}>
            Case <GradText>Studies</GradText>
          </h1>
          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,.45)", lineHeight: 1.75 }}>
            Real stores. Real problems. Real results. No cherry-picking — these are the transformations our system delivers.
          </p>
        </div>
      </section>

      <hr className="divider" />

      <Section>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {CASE_STUDIES.map((cs, i) => (
            <Link key={cs.id} to={`/case-studies/${cs.id}`} style={{ textDecoration: "none", display: "block" }}>
              <div className="glass card3d" style={{ padding: "2.5rem", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,255,136,.4)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.12)"}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1rem" }}>
                      <span style={{ background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: G, fontWeight: 600 }}>{cs.category}</span>
                      {cs.tags.map(t => <span key={t} style={{ background: "rgba(255,255,255,.05)", border: ".5px solid rgba(255,255,255,.1)", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: "rgba(255,255,255,.4)" }}>{t}</span>)}
                    </div>
                    <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: ".75rem", lineHeight: 1.2 }}>{cs.headline}</h2>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", lineHeight: 1.7 }}>{cs.summary}</p>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", flexShrink: 0, flexWrap: "wrap" }}>
                    {[cs.result1, cs.result2, cs.result3].map((r, j) => (
                      <div key={j} style={{ textAlign: "center", background: "rgba(0,255,136,.06)", border: ".5px solid rgba(0,255,136,.18)", borderRadius: 12, padding: "1rem 1.2rem", minWidth: 100 }}>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginBottom: 4 }}>{r.label}</p>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginBottom: 2 }}>{r.before}</p>
                        <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{r.after}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: 6, color: G, fontSize: 13, fontWeight: 600 }}>
                  Read full case study <span style={{ fontSize: 16 }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <hr className="divider" />

      <Section style={{ paddingBottom: "8rem" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel>Your turn</SectionLabel>
          <Heading size="2.4rem">Want to be our<br /><GradText>next case study?</GradText></Heading>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.45)", lineHeight: 1.7, margin: "1.5rem 0" }}>Apply for a free audit and see exactly what we'd fix in your store.</p>
          <Link to="/contact" className="btn-g" style={{ display: "inline-block" }}>Apply for your free audit →</Link>
        </div>
      </Section>
    </PageWrapper>
  );
}

export function CaseStudyDetail() {
  const { id } = useParams();
  const cs = CASE_STUDIES.find(c => c.id === id);

  if (!cs) return (
    <PageWrapper>
      <Section>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontSize: "2rem" }}>Case study not found</h1>
          <Link to="/case-studies" className="btn-g" style={{ display: "inline-block", marginTop: "2rem" }}>← Back to case studies</Link>
        </div>
      </Section>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <section style={{ position: "relative", padding: "6rem 2rem 4rem", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 500, height: 500, top: -100, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Link to="/case-studies" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.4)", textDecoration: "none", fontSize: 13, marginBottom: "2rem" }}>← Back to case studies</Link>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <span style={{ background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: G, fontWeight: 600 }}>{cs.category}</span>
            {cs.tags.map(t => <span key={t} style={{ background: "rgba(255,255,255,.05)", border: ".5px solid rgba(255,255,255,.1)", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: "rgba(255,255,255,.4)" }}>{t}</span>)}
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.8rem", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.03em", color: "#fff", marginBottom: "1rem" }}>{cs.headline}</h1>
          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,.45)", lineHeight: 1.75 }}>{cs.summary}</p>
        </div>
      </section>

      <hr className="divider" />

      <Section>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Results cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "4rem" }} className="stat-grid">
            {[cs.result1, cs.result2, cs.result3].map((r, i) => (
              <div key={i} className="stat-card" style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginBottom: 8 }}>{r.label}</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", marginBottom: 4 }}>Before: <span style={{ color: "#ff6b6b" }}>{r.before}</span></p>
                <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.8rem", fontWeight: 800, background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>After: {r.after}</p>
              </div>
            ))}
          </div>

          {/* Story */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {cs.story.map((s, i) => (
              <div key={i} style={{ borderLeft: `2px solid rgba(0,255,136,0.3)`, paddingLeft: "2rem" }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#fff", marginBottom: "1rem" }}>{s.heading}</h3>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,.5)", lineHeight: 1.85 }}>{s.body}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 20, padding: "2.5rem", textAlign: "center", marginTop: "4rem" }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: ".75rem" }}>Want results like these?</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", marginBottom: "1.5rem", lineHeight: 1.7 }}>Apply for a free store audit and see exactly what we'd fix in your funnel.</p>
            <Link to="/contact" className="btn-g" style={{ display: "inline-block" }}>Apply for your free audit →</Link>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}