import { Link } from "react-router-dom";
import { G, GG } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles } from "../components.jsx";

export default function About() {
  return (
    <PageWrapper>
      {/* HERO */}
      <section style={{ position: "relative", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 2rem 4rem", overflow: "hidden" }}>
        <Particles />
        <div style={{ position: "absolute", width: 600, height: 600, top: -150, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.14),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: G, fontWeight: 500 }}>
              <span style={{ width: 6, height: 6, background: G, borderRadius: "50%" }} /> About us
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "3.2rem", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.03em", color: "#fff", marginBottom: "1.2rem" }}>
            Built by a marketer who got<br /><GradText>tired of excuses.</GradText>
          </h1>
          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,.45)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto" }}>
            Most agencies hide behind vanity metrics. We only care about one number: revenue in your bank account.
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* STORY */}
      <Section>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="about-grid">
          <div>
            <SectionLabel>Our story</SectionLabel>
            <Heading>We fix what agencies ignore.</Heading>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.5)", lineHeight: 1.85, marginTop: "1.5rem" }}>
              Bode Conversion Lab was born out of frustration. After seeing store after store burn money on ads while the real problems — slow pages, broken checkouts, wrong audiences — went untouched, we built a different kind of service.
            </p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.5)", lineHeight: 1.85, marginTop: "1rem" }}>
              We don't start with ads. We start with an audit. We find every single place your funnel is leaking money. Then we fix it. Then we scale it.
            </p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.5)", lineHeight: 1.85, marginTop: "1rem" }}>
              The result is a system that compounds — not a campaign that runs until the budget runs out.
            </p>
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
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{s.label}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)", margin: 0 }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* VALUES */}
      <Section>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>What we believe</SectionLabel>
            <Heading>Our <GradText>values</GradText></Heading>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }} className="how-grid">
            {[
              { icon: "01", title: "Revenue over vanity", desc: "Impressions, reach, and engagement don't pay your bills. We only celebrate when your bank account grows." },
              { icon: "02", title: "Systems over campaigns", desc: "Campaigns end. Systems compound. We build infrastructure that makes every future dollar you spend more efficient." },
              { icon: "03", title: "Honesty over comfort", desc: "If your product page is broken, we'll tell you. If your ads are wasting money, we'll tell you. You hired us to fix problems, not validate them." },
              { icon: "04", title: "Data over opinion", desc: "Every recommendation we make is backed by data from your store, your audience, and 40+ audits. We don't guess." },
              { icon: "05", title: "Speed over perfection", desc: "A good test running today beats a perfect campaign launching next month. We move fast and iterate faster." },
              { icon: "06", title: "Partnership over transaction", desc: "We don't take clients we can't help. When you win, we win. That alignment is why our clients stay month after month." },
            ].map((v, i) => (
              <div key={i} className="glass card3d" style={{ padding: "2rem" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", fontWeight: 800, background: "linear-gradient(135deg,rgba(0,255,136,.55),rgba(0,255,136,.15))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: ".75rem" }}>{v.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: ".5rem" }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* CTA */}
      <Section style={{ paddingBottom: "8rem" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel>Work with us</SectionLabel>
          <Heading size="2.4rem">Ready to build a<br /><GradText>system that scales?</GradText></Heading>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.45)", lineHeight: 1.7, margin: "1.5rem 0" }}>Apply for a free store audit and find out exactly where your funnel is leaking money.</p>
          <Link to="/contact" className="btn-g" style={{ display: "inline-block" }}>Apply for your free audit →</Link>
        </div>
      </Section>
    </PageWrapper>
  );
}