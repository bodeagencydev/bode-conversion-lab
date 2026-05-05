import { useState } from "react";
import { Link } from "react-router-dom";
import { G, GG, FAQS } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles, useTheme } from "../components.jsx";

export default function Pricing() {
  const { dark } = useTheme();
  const [pricingVisible, setPricingVisible] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  const headingColor = dark ? "#fff" : "#0a0a0a";
  const mutedText = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const mutedText2 = dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)";
  const mutedText3 = dark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.4)";
  const mutedText4 = dark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.35)";
  const mutedText5 = dark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.55)";
  const cardBg = dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))";
  const cardBorder = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)";
  const optionBg = dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)";
  const optionBorder = dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.08)";
  const faqBorder = dark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)";
  const itemBorder = dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.06)";

  return (
    <PageWrapper>
      <section style={{ position: "relative", padding: "6rem 2rem 4rem", overflow: "hidden" }}>
        <Particles />
        <div style={{ position: "absolute", width: 500, height: 500, top: -100, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: G, fontWeight: 500 }}>
              <span style={{ width: 6, height: 6, background: G, borderRadius: "50%" }} /> Investment
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "3.2rem", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.03em", color: headingColor, marginBottom: "1.2rem" }}>
            Serious about scaling?<br /><GradText>Here's how we work.</GradText>
          </h1>
          <p style={{ fontSize: "1.05rem", color: mutedText, lineHeight: 1.75 }}>
            We don't work with everyone. We work with stores that are ready to grow. Unlock pricing below after reading our commitment to you.
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* COMMITMENT SECTION */}
      <Section>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>Our commitment</SectionLabel>
            <Heading>What you get when you<br /><GradText>work with us</GradText></Heading>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem" }} className="how-grid">
            {[
              { icon: "→", title: "48-hour audit delivery", desc: "Every engagement starts with a full store and ads audit delivered within 48 business hours." },
              { icon: "→", title: "No fluff reporting", desc: "Weekly reports focused on revenue, ROAS, and CPA. Nothing else. We don't hide behind vanity metrics." },
              { icon: "→", title: "Month-to-month terms", desc: "No contracts. No lock-in. Stay because the results are there. Leave if they're not. We're that confident." },
              { icon: "→", title: "Direct access", desc: "Slack access to your dedicated strategist. Real responses within 4 business hours — not a ticket system." },
            ].map((item, i) => (
              <div key={i} className="glass" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ color: G, fontSize: 18, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                  <div>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, color: headingColor, marginBottom: ".4rem" }}>{item.title}</h3>
                    <p style={{ fontSize: 13, color: mutedText2, lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* PRICING UNLOCK */}
      <Section>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          {!pricingVisible ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "linear-gradient(135deg,rgba(0,255,136,.06),rgba(0,204,106,.02))", border: ".5px solid rgba(0,255,136,.2)", borderRadius: 24 }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", animation: "glow 3s ease-in-out infinite" }}>
                <svg width="28" height="28" viewBox="0 0 22 22" fill="none"><rect x="4" y="10" width="14" height="10" rx="3" stroke={G} strokeWidth="1.5" /><path d="M7 10V7a4 4 0 018 0v3" stroke={G} strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: headingColor, marginBottom: ".75rem" }}>Pricing is qualification-based</h3>
              <p style={{ fontSize: 15, color: mutedText2, marginBottom: "2rem", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 2rem" }}>We only work with stores that are the right fit. Not because we're exclusive — because we only take clients we can genuinely help.</p>
              <button className="btn-g" onClick={() => setPricingVisible(true)}>I'm ready — show me pricing →</button>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <SectionLabel>Three ways to work together</SectionLabel>
                <Heading>Pick your <GradText>entry point</GradText></Heading>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }} className="offer-grid">
                {[
                  { tier: "Entry", name: "The Audit", price: "$497", period: "one-time", desc: "For stores that want clarity before committing to a retainer.", items: ["Full store + ads audit", "30-page action report", "1 x 90-min strategy call", "Priority fix roadmap", "Roadmap to $10k/mo"], feat: false, cta: "Get started" },
                  { tier: "Most Popular", name: "The Lab", price: "$2,000", period: "/mo", desc: "For stores ready to systematically grow revenue month over month.", items: ["Everything in Audit", "Monthly ad management", "CRO optimization", "Weekly performance report", "Slack access (4hr response)", "Monthly strategy review"], feat: true, cta: "Apply for The Lab" },
                  { tier: "Premium", name: "Full Stack", price: "$4,500", period: "/mo", desc: "For stores that want everything handled — end to end.", items: ["Everything in The Lab", "Done-for-you landing pages", "Email flow builds", "Creative production", "Weekly strategy calls", "Priority 2hr response"], feat: false, cta: "Apply for Full Stack" },
                ].map((o, i) => (
                  <div key={i} className={`offer-card ${o.feat ? "feat" : ""}`}>
                    {o.feat
                      ? <div style={{ display: "inline-block", background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.4)", borderRadius: 100, padding: "3px 12px", fontSize: 11, color: G, marginBottom: "1rem" }}>{o.tier}</div>
                      : <p style={{ fontSize: 11, color: mutedText4, marginBottom: ".5rem" }}>{o.tier}</p>
                    }
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.3rem", fontWeight: 800, marginBottom: ".5rem", color: headingColor }}>{o.name}</h3>
                    <p style={{ fontSize: 12, color: mutedText3, marginBottom: "1.2rem", lineHeight: 1.5 }}>{o.desc}</p>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.2rem", fontWeight: 800, color: headingColor }}>{o.price}</span>
                      <span style={{ fontSize: 13, color: mutedText4 }}>{o.period}</span>
                    </div>
                    <ul style={{ listStyle: "none", marginBottom: "1.5rem" }}>
                      {o.items.map((item, j) => (
                        <li key={j} style={{ fontSize: 13, color: mutedText5, padding: "7px 0", borderBottom: `.5px solid ${itemBorder}`, display: "flex", gap: 8, alignItems: "center" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link to="/contact" className={o.feat ? "btn-g" : "btn-ghost"} style={{ display: "block", textAlign: "center", textDecoration: "none" }}>{o.cta}</Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      <hr className="divider" />

      {/* FAQ */}
      <Section style={{ paddingBottom: "8rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>Common questions</SectionLabel>
            <Heading>FAQ</Heading>
          </div>
          {FAQS.map((f, i) => (
            <div key={i}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", color: headingColor, fontSize: 15, fontWeight: 500, cursor: "pointer", padding: "1.2rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit", borderBottom: `.5px solid ${faqBorder}` }}>
                <span>{f.q}</span>
                <span style={{ color: G, fontSize: 18, transition: "transform .25s", transform: faqOpen === i ? "rotate(45deg)" : "none", display: "inline-block", flexShrink: 0, marginLeft: 12 }}>+</span>
              </button>
              {faqOpen === i && <p style={{ fontSize: 14, color: mutedText, lineHeight: 1.75, padding: "1rem 0 1.2rem", borderBottom: `.5px solid ${faqBorder}` }}>{f.a}</p>}
            </div>
          ))}
        </div>
      </Section>
    </PageWrapper>
  );
}