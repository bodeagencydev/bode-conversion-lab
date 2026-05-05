import { useState } from "react";
import { Link } from "react-router-dom";
import { G, GG, SERVICES } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles, useTheme } from "../components.jsx";

export default function About() {
  const { dark } = useTheme();
  const [activeService, setActiveService] = useState(null);

  const headingColor = dark ? "#fff" : "#0a0a0a";
  const mutedText = dark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.5)";
  const mutedText2 = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const mutedText3 = dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)";
  const mutedText4 = dark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.35)";

  return (
    <PageWrapper>
      <section style={{ position: "relative", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) 3rem", overflow: "hidden" }}>
        <Particles />
        <div style={{ position: "absolute", width: 600, height: 600, top: -150, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.14),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: G, fontWeight: 500 }}>
              <span style={{ width: 6, height: 6, background: G, borderRadius: "50%" }} /> About us
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(2rem,7vw,3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.03em", color: headingColor, marginBottom: "1.2rem", wordBreak: "break-word" }}>
            Built by a marketer who got<br /><GradText>tired of excuses.</GradText>
          </h1>
          <p style={{ fontSize: "clamp(0.9rem,3vw,1.05rem)", color: mutedText2, lineHeight: 1.75, maxWidth: 520, margin: "0 auto" }}>
            Most agencies hide behind vanity metrics. We only care about one number: revenue in your bank account.
          </p>
        </div>
      </section>

      <hr className="divider" />

      <Section>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,5vw,5rem)", alignItems: "center" }} className="about-grid">
          <div>
            <SectionLabel>Our story</SectionLabel>
            <Heading>We fix what agencies ignore.</Heading>
            <p style={{ fontSize: 15, color: mutedText, lineHeight: 1.85, marginTop: "1.5rem" }}>Bode Conversion Lab was born out of frustration. After seeing store after store burn money on ads while the real problems went untouched, we built a different kind of service.</p>
            <p style={{ fontSize: 15, color: mutedText, lineHeight: 1.85, marginTop: "1rem" }}>We don't start with ads. We start with an audit. We find every single place your funnel is leaking money. Then we fix it. Then we scale it.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { n: "70x", label: "Best revenue result", sub: "$1k → $70k in 90 days" },
              { n: "60%", label: "Avg CPA reduction", sub: "Across all active clients" },
              { n: "48h", label: "Audit turnaround", sub: "Full report in 2 business days" },
              { n: "100%", label: "Client retention", sub: "Month-to-month, no contracts" },
            ].map((s, i) => (
              <div key={i} className="glass card3d" style={{ padding: "1.4rem 1.6rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.8rem", fontWeight: 800, background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", minWidth: 70 }}>{s.n}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: headingColor, margin: 0 }}>{s.label}</p>
                  <p style={{ fontSize: 12, color: mutedText4, margin: 0 }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      <Section>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>What we do</SectionLabel>
            <Heading size="2.4rem">Our <GradText>services</GradText></Heading>
            <p style={{ fontSize: 14, color: mutedText3, marginTop: ".75rem" }}>Tap any service to see what's included</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem" }}>
            {SERVICES.map((s) => (
              <div key={s.id}
                onClick={() => setActiveService(activeService === s.id ? null : s.id)}
                style={{
                  background: activeService === s.id
                    ? "linear-gradient(135deg,rgba(0,255,136,.1),rgba(0,204,106,.04))"
                    : (dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))"),
                  border: activeService === s.id ? `.5px solid rgba(0,255,136,.45)` : (dark ? ".5px solid rgba(255,255,255,.12)" : ".5px solid rgba(0,0,0,.1)"),
                  borderRadius: 16, padding: "1.5rem", cursor: "pointer", transition: "all .3s"
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <span style={{ fontSize: 24, display: "block", marginBottom: ".5rem" }}>{s.icon}</span>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.1rem", fontWeight: 800, color: headingColor, margin: 0 }}>{s.title}</h3>
                    <p style={{ fontSize: 12, color: G, margin: "4px 0 0", fontWeight: 500 }}>{s.tagline}</p>
                  </div>
                  <span style={{ color: G, fontSize: 20, transition: "transform .3s", transform: activeService === s.id ? "rotate(45deg)" : "none", display: "block", flexShrink: 0, marginLeft: 8 }}>+</span>
                </div>
                <p style={{ fontSize: 13, color: mutedText2, lineHeight: 1.7, marginBottom: activeService === s.id ? "1rem" : 0 }}>{s.desc}</p>
                {activeService === s.id && (
                  <div>
                    <ul style={{ listStyle: "none", marginBottom: "1.2rem" }}>
                      {s.bullets.map((b, j) => (
                        <li key={j} style={{ fontSize: 13, color: dark ? "rgba(255,255,255,.6)" : "rgba(0,0,0,.6)", padding: "6px 0", borderBottom: dark ? ".5px solid rgba(255,255,255,.06)" : ".5px solid rgba(0,0,0,.06)", display: "flex", gap: 8, alignItems: "center" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: G }}>{s.price}</span>
                      <Link to="/contact" onClick={e => e.stopPropagation()} style={{ background: GG, color: "#040608", borderRadius: 8, padding: ".5rem 1.2rem", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Apply →</Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      <Section>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>What we believe</SectionLabel>
            <Heading>Our <GradText>values</GradText></Heading>
          </div>
          <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
            {[
              { icon: "01", title: "Revenue over vanity", desc: "Impressions and reach don't pay your bills. We only celebrate when your bank account grows." },
              { icon: "02", title: "Systems over campaigns", desc: "Campaigns end. Systems compound. We build infrastructure that makes every future dollar more efficient." },
              { icon: "03", title: "Honesty over comfort", desc: "If your product page is broken, we'll tell you. You hired us to fix problems, not validate them." },
              { icon: "04", title: "Data over opinion", desc: "Every recommendation we make is backed by data from your store, your audience, and 40+ audits." },
              { icon: "05", title: "Speed over perfection", desc: "A good test running today beats a perfect campaign launching next month." },
              { icon: "06", title: "Partnership over transaction", desc: "We don't take clients we can't help. When you win, we win." },
            ].map((v, i) => (
              <div key={i} className="glass card3d" style={{ padding: "2rem" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", fontWeight: 800, background: "linear-gradient(135deg,rgba(0,255,136,.55),rgba(0,255,136,.15))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: ".75rem" }}>{v.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, color: headingColor, marginBottom: ".5rem" }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: mutedText3, lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      <Section style={{ paddingBottom: "6rem" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel>Work with us</SectionLabel>
          <Heading size="2.4rem">Ready to build a<br /><GradText>system that scales?</GradText></Heading>
          <p style={{ fontSize: 15, color: mutedText2, lineHeight: 1.7, margin: "1.5rem 0" }}>Apply for a free store audit and find out exactly where your funnel is leaking money.</p>
          <Link to="/contact" className="btn-g" style={{ display: "inline-block" }}>Apply for your free audit →</Link>
        </div>
      </Section>
    </PageWrapper>
  );
}