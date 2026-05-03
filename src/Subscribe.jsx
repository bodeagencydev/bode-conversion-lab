import { useState } from "react";
import { G, GG } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles } from "../components.jsx";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("https://formspree.io/f/xaqadyal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, _subject: "New Newsletter Subscriber" }),
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <PageWrapper>
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem)", overflow: "hidden" }}>
        <Particles />
        <div style={{ position: "absolute", width: 600, height: 600, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ maxWidth: 560, width: "100%", position: "relative", zIndex: 1 }}>
          {!submitted ? (
            <div style={{ background: "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))", border: ".5px solid rgba(255,255,255,.12)", borderTop: ".5px solid rgba(255,255,255,.22)", borderRadius: 28, padding: "clamp(2rem,5vw,3.5rem)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)" }} />

              {/* Icon */}
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", animation: "glow 3s ease-in-out infinite" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: G, fontWeight: 500, marginBottom: "1rem" }}>
                  <span style={{ width: 6, height: 6, background: G, borderRadius: "50%", animation: "pulse 2s infinite" }} /> Free weekly insights
                </span>
                <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.8rem,6vw,2.6rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: "1rem", wordBreak: "break-word" }}>
                  Get the tactics that<br /><GradText>scale stores to $70k/mo</GradText>
                </h1>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,.45)", lineHeight: 1.7 }}>
                  Every week: one actionable tip from inside our client work. CRO wins, ad strategies, email flows that print money. No fluff. No recycled advice.
                </p>
              </div>

              {/* What you get */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "2rem" }}>
                {[
                  "Weekly CRO tip you can implement in under an hour",
                  "Real case studies with actual numbers",
                  "Ad strategy breakdowns from live campaigns",
                  "Early access to free tools and audits",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="rgba(0,255,136,.15)" /><path d="M5 8L7 10L11 6" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>{item}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: "1.2rem" }}>
                  <input
                    type="text"
                    placeholder="Your first name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    style={{ width: "100%", background: "rgba(255,255,255,.06)", border: ".5px solid rgba(255,255,255,.12)", borderRadius: 10, padding: ".85rem 1rem", color: "#f0f0f0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = "rgba(0,255,136,.5)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.12)"}
                  />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ width: "100%", background: "rgba(255,255,255,.06)", border: ".5px solid rgba(255,255,255,.12)", borderRadius: 10, padding: ".85rem 1rem", color: "#f0f0f0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = "rgba(0,255,136,.5)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.12)"}
                  />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: "100%", background: GG, color: "#040608", border: "none", borderRadius: 10, padding: "1rem", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1, transition: "transform .15s, box-shadow .15s", boxShadow: "0 4px 22px rgba(0,255,136,.35)" }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 34px rgba(0,255,136,.55)"; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 22px rgba(0,255,136,.35)"; }}>
                  {loading ? "Subscribing..." : "Subscribe — it's free →"}
                </button>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,.25)", textAlign: "center", marginTop: "1rem" }}>
                  No spam. Unsubscribe anytime. Read by 1,000+ store owners.
                </p>
              </form>
            </div>
          ) : (
            <div style={{ background: "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border: ".5px solid rgba(0,255,136,.35)", borderRadius: 28, padding: "3.5rem", textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", animation: "glow 3s ease-in-out infinite" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.6rem,5vw,2.2rem)", fontWeight: 800, color: "#fff", marginBottom: "1rem" }}>
                You're in! Welcome to the lab. 🧪
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.5)", lineHeight: 1.7, marginBottom: "2rem" }}>
                Check your inbox — your first insight is on its way. While you wait, audit your store for free.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/audit" className="btn-g" style={{ display: "inline-block", textDecoration: "none" }}>Audit my store free →</a>
                <a href="/" className="btn-ghost" style={{ display: "inline-block", textDecoration: "none" }}>Back to home</a>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}