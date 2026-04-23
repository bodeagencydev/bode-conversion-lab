import { Link } from "react-router-dom";
import { G, GG, TESTIMONIALS, ECOM_PLATFORMS, AD_PLATFORMS, PARTNERS, CASE_STUDIES } from "../data.js";
import { Particles, Typewriter, ContinuousTicker, TestimonialTicker, Section, SectionLabel, Heading, GradText, AnimNum, useInView } from "../components.jsx";
import { PageWrapper } from "../components.jsx";

export default function Home() {
  const [heroRef, heroInView] = useInView(0.05);
  const [statsRef, statsInView] = useInView(0.2);

  return (
    <PageWrapper>
      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8rem 2rem 5rem", overflow: "hidden" }}>
        <Particles />
        <div style={{ position: "absolute", width: 700, height: 700, top: -200, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle at 40% 40%,rgba(0,255,136,.18),rgba(0,180,80,.05) 55%,transparent 75%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,255,136,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,.022) 1px,transparent 1px)", backgroundSize: "44px 44px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%,black 40%,transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%,black 40%,transparent 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(0,255,136,.7),transparent)", animation: "scan 5s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "13%", right: "5%", width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle at 33% 28%,rgba(0,255,136,.85),rgba(0,180,80,.3) 45%,transparent 70%)", boxShadow: "inset -14px -14px 28px rgba(0,0,0,.55),inset 8px 8px 20px rgba(0,255,136,.28),0 0 40px rgba(0,255,136,.2)", animation: "float1 7s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "22%", left: "4%", width: 65, height: 65, background: "linear-gradient(135deg,rgba(0,255,136,.14),rgba(0,204,106,.04))", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 14, animation: "float2 9s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "32%", left: "6%", width: 72, height: 72, borderRadius: "50%", border: "1.5px solid rgba(0,255,136,.2)", animation: "float1 11s ease-in-out infinite 2s", pointerEvents: "none" }} />

        <div style={{ maxWidth: 780, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ animation: "heroFadeUp .7s ease both", marginBottom: "1.5rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: G, fontWeight: 500, letterSpacing: ".04em" }}>
              <span style={{ width: 6, height: 6, background: G, borderRadius: "50%", animation: "pulse 2s ease-in-out infinite" }} />
              Store Optimization & Ads Engineering
            </span>
          </div>
          <h1 className="hero-t" style={{ fontFamily: "'Syne',sans-serif", fontSize: "3.7rem", fontWeight: 800, lineHeight: 1.07, letterSpacing: "-.03em", marginBottom: "1.2rem", color: "#fff", animation: "heroFadeUp .8s .1s ease both", animationFillMode: "forwards", opacity: 0 }}>
            We turn your store into a<br />
            <Typewriter words={["revenue machine.", "conversion engine.", "ROAS monster.", "scaling system."]} />
          </h1>
          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,.45)", lineHeight: 1.75, maxWidth: 540, margin: "0 auto 2rem", animation: "heroFadeUp .8s .2s ease both", animationFillMode: "forwards", opacity: 0 }}>
            Bode Conversion Lab engineers your ROAS from the ground up — ads, landing pages, checkout. One system. Compounding results every month.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: "3.5rem", animation: "heroFadeUp .8s .3s ease both", animationFillMode: "forwards", opacity: 0 }}>
            <Link to="/contact" className="btn-g">See if your store qualifies →</Link>
            <Link to="/case-studies" className="btn-ghost">View client results</Link>
          </div>
          <div className="hero-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, animation: "heroFadeUp .8s .45s ease both", animationFillMode: "forwards", opacity: 0 }}>
            {[{ n: "70x", l: "Revenue growth\nin 90 days" }, { n: "4x+", l: "Average ROAS\nimprovement" }, { n: "$0", l: "Extra ad spend\nrequired" }].map((c, i) => (
              <div key={i} className="card3d" style={{ background: "linear-gradient(135deg,rgba(0,255,136,.09),rgba(0,204,106,.03))", border: ".5px solid rgba(0,255,136,.22)", borderTop: ".5px solid rgba(0,255,136,.38)", borderRadius: 16, padding: "1.3rem 1rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)" }} />
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.9rem", fontWeight: 800, background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1.1, marginBottom: 6 }}>{c.n}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", lineHeight: 1.5, whiteSpace: "pre-line" }}>{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKERS */}
      <div style={{ borderTop: ".5px solid rgba(255,255,255,.06)", borderBottom: ".5px solid rgba(255,255,255,.06)", background: "rgba(255,255,255,.01)", padding: "1rem 0" }}>
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,.25)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".8rem" }}>Trusted by stores on</p>
        <ContinuousTicker items={ECOM_PLATFORMS} speed={30} />
      </div>
      <div style={{ borderBottom: ".5px solid rgba(255,255,255,.06)", background: "rgba(255,255,255,.01)", padding: "1rem 0" }}>
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,.25)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".8rem" }}>We run ads on</p>
        <ContinuousTicker items={AD_PLATFORMS} speed={25} reverse={true} />
      </div>

      {/* STATS */}
      <Section id="results">
        <div ref={statsRef} style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>Proven results</SectionLabel>
            <Heading>Same product. Same budget.<br /><GradText>70x the revenue.</GradText></Heading>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
            {[{ n: 70, s: "x", l: "Revenue multiplier" }, { n: 90, s: " days", l: "Time to results" }, { n: 4, s: "x+", l: "ROAS improvement" }].map((s, i) => (
              <div key={i} className="stat-card">
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.8rem", fontWeight: 800, background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1, marginBottom: 8 }}>
                  {statsInView ? <AnimNum target={s.n} suffix={s.s} /> : `0${s.s}`}
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* HOW IT WORKS */}
      <Section id="how">
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <SectionLabel>The system</SectionLabel>
            <Heading>We don't run ads.<br /><GradText>We engineer ROAS.</GradText></Heading>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem" }} className="how-grid">
            {[
              { n: "01", t: "Deep-dive audit", d: "We dissect your store, ads, and full funnel. Every leak mapped in 48 hours." },
              { n: "02", t: "Conversion architecture", d: "We rebuild your pages to convert more of the traffic you already have." },
              { n: "03", t: "Ad engineering", d: "Precision creatives and targeting that compound — not spray-and-pray." },
              { n: "04", t: "Scale & compound", d: "Once ROAS target is hit, we scale. $1k/mo becomes $70k/mo." },
            ].map((item, i) => (
              <div key={i} className="glass card3d" style={{ padding: "2rem" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.5rem", fontWeight: 800, background: "linear-gradient(135deg,rgba(0,255,136,.55),rgba(0,255,136,.15))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: ".75rem" }}>{item.n}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.05rem", fontWeight: 700, marginBottom: ".5rem", color: "#fff" }}>{item.t}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", lineHeight: 1.75 }}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* TESTIMONIALS */}
      <Section id="testimonials">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>Client results</SectionLabel>
            <Heading>Real stores. <GradText>Real numbers.</GradText></Heading>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.3)", marginTop: ".75rem" }}>Hover to pause</p>
          </div>
          <TestimonialTicker items={TESTIMONIALS} />
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link to="/case-studies" className="btn-ghost">Read full case studies →</Link>
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* PARTNERS */}
      <Section>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>Official partnerships</SectionLabel>
            <Heading>Platform <GradText>partners</GradText></Heading>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }} className="partner-grid">
            {PARTNERS.map((p, i) => (
              <div key={i} className="partner-card">
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,rgba(0,255,136,.15),rgba(0,204,106,.05))", border: ".5px solid rgba(0,255,136,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: G, flexShrink: 0 }}>{p.icon}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", margin: 0 }}>Certified partner</p>
                </div>
                <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: G, animation: "pulse 2s ease-in-out infinite" }} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* CTA BANNER */}
      <Section>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ background: "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 24, padding: "4rem 2rem" }}>
            <SectionLabel>Ready to scale?</SectionLabel>
            <Heading size="clamp(1.6rem, 6vw, 2.6rem)">Stop burning money.<br /><GradText>Start compounding it.</GradText></Heading>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.45)", lineHeight: 1.7, margin: "1.5rem auto", maxWidth: 440 }}>Join stores that went from struggling to scaling. Apply today and find out if your store qualifies.</p>
            <Link to="/contact" className="btn-g" style={{ display: "inline-block" }}>Apply for your free audit →</Link>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}