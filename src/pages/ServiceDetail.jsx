import { useParams, Link, Navigate } from "react-router-dom";
import { SERVICES } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, useTheme, SEO } from "../components.jsx";

export default function ServiceDetail() {
  const { id } = useParams();
  const { dark } = useTheme();
  const service = SERVICES.find(s => s.id === id);

  if (!service) return <Navigate to="/pricing" replace />;

  const headingColor = dark ? "#fff" : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.6)"  : "rgba(26,20,8,.65)";
  const mutedText2   = dark ? "rgba(255,255,255,.45)" : "rgba(26,20,8,.55)";
  const borderCol    = dark ? "rgba(255,255,255,.1)"  : "rgba(26,20,8,.12)";
  const cardBg       = dark ? "rgba(255,255,255,.03)" : "rgba(26,20,8,.03)";

  const otherServices = SERVICES.filter(s => s.id !== service.id).slice(0, 3);

  return (
    <PageWrapper>
      <SEO
        title={service.seoTitle || service.title}
        description={service.seoDesc || service.desc}
        path={`/services/${service.id}`}
        service={{ name: service.title, description: service.seoDesc || service.desc }}
      />

      {/* ── HERO ── */}
      <section style={{ padding: "clamp(5rem,10vw,7rem) clamp(1rem,4vw,2rem) 3rem", maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: service.color, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".8rem" }}>
          Service {service.icon}
        </p>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: headingColor, lineHeight: 1.1, marginBottom: "1rem" }}>
          {service.title}
        </h1>
        <p style={{ fontSize: "1.2rem", color: service.color, fontWeight: 600, marginBottom: "1.2rem" }}>{service.tagline}</p>
        <p style={{ fontSize: 15, color: mutedText, lineHeight: 1.8, maxWidth: 640 }}>{service.desc}</p>

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
          <Link to="/audit" style={{ padding: "12px 28px", borderRadius: 10, background: service.color, color: "#0A0A0A", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Get your free audit →
          </Link>
          <Link to="/pricing" style={{ padding: "12px 28px", borderRadius: 10, border: `1px solid ${borderCol}`, color: headingColor, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            See pricing →
          </Link>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <Section>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionLabel>What's included</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1rem", marginTop: "1.5rem" }}>
            {service.bullets.map((b, i) => (
              <div key={i} style={{ padding: "1.2rem", borderRadius: 14, border: `1px solid ${borderCol}`, background: cardBg, display: "flex", gap: ".7rem", alignItems: "flex-start" }}>
                <span style={{ color: service.color, fontWeight: 800, fontSize: 14 }}>✓</span>
                <span style={{ fontSize: 14, color: headingColor, fontWeight: 500 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── HOW IT WORKS ── */}
      {service.process && (
        <Section>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <SectionLabel>How it works</SectionLabel>
            <Heading size="1.8rem">The process</Heading>
            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {service.process.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{
                    flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: service.color,
                    color: "#0A0A0A", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{i + 1}</span>
                  <p style={{ fontSize: 14.5, color: mutedText, lineHeight: 1.7, paddingTop: 4 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ── OTHER SERVICES ── */}
      <Section>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionLabel>Other ways we help</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem", marginTop: "1.5rem" }}>
            {otherServices.map(s => (
              <Link key={s.id} to={`/services/${s.id}`} style={{
                padding: "1.4rem", borderRadius: 14, border: `1px solid ${borderCol}`, background: cardBg,
                textDecoration: "none", display: "block",
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".4rem" }}>{s.tagline}</p>
                <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize: "1.1rem", fontWeight: 700, color: headingColor }}>{s.title} →</p>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <Heading size="1.8rem">Ready to fix this on <GradText>your store?</GradText></Heading>
          <p style={{ fontSize: 14, color: mutedText2, margin: "1rem 0 1.6rem" }}>
            Start with a free audit — we'll show you exactly where you're losing sales before you spend a dollar.
          </p>
          <Link to="/audit" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 10, background: service.color, color: "#0A0A0A", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Run my free audit →
          </Link>
        </div>
      </Section>
    </PageWrapper>
  );
}
