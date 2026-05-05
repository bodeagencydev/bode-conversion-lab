import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, ValidationError } from "@formspree/react";
import { G, GG, QUIZ } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles, useTheme } from "../components.jsx";

function ApplyForm() {
  const { dark } = useTheme();
  const [state, handleSubmit] = useForm("xaqadyal");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const headingColor = dark ? "#fff" : "#0a0a0a";
  const mutedText = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const mutedText2 = dark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.35)";
  const mutedText3 = dark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.4)";
  const mutedText4 = dark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.3)";
  const cardBg = dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))";
  const cardBorder = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)";
  const cardBorderTop = dark ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.15)";
  const progressTrack = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)";
  const optionBg = dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)";
  const optionBorder = dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.08)";
  const optionText = dark ? "#f0f0f0" : "#0a0a0a";
  const optionLetter = dark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.3)";
  const inputBg = dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)";
  const inputBorder = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)";
  const inputColor = dark ? "#f0f0f0" : "#0a0a0a";
  const summaryBorder = dark ? "rgba(0,255,136,.18)" : "rgba(0,200,100,.2)";

  const handleQ = (id, opt) => {
    const next = { ...answers, [id]: opt };
    setAnswers(next);
    if (step < QUIZ.length - 1) setStep(step + 1);
    else setDone(true);
  };

  if (state.succeeded) return (
    <div style={{ background: "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border: ".5px solid rgba(0,255,136,.35)", borderRadius: 20, padding: "3rem", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.6rem", fontWeight: 800, color: headingColor, marginBottom: ".75rem" }}>Application received!</h3>
      <p style={{ fontSize: 15, color: mutedText, lineHeight: 1.7 }}>We've got your details. Expect a personalised response within 24 hours.</p>
    </div>
  );

  return (
    <div style={{ background: cardBg, border: `.5px solid ${cardBorder}`, borderTop: `.5px solid ${cardBorderTop}`, borderRadius: 20, padding: "2.5rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: dark ? "linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)" : "linear-gradient(90deg,transparent,rgba(0,0,0,.1),transparent)" }} />
      {!done ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: mutedText2 }}>Step {step + 1} of {QUIZ.length}</span>
            <span style={{ fontSize: 12, color: mutedText2 }}>{Math.round((step / QUIZ.length) * 100)}%</span>
          </div>
          <div style={{ height: 2, background: progressTrack, borderRadius: 2, overflow: "hidden", marginBottom: "1.5rem" }}>
            <div style={{ height: "100%", background: GG, borderRadius: 2, width: `${(step / QUIZ.length) * 100}%`, transition: "width .4s" }} />
          </div>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.05rem", fontWeight: 700, color: headingColor, marginBottom: "1.2rem", lineHeight: 1.4 }}>{QUIZ[step].q}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {QUIZ[step].opts.map((opt, i) => (
              <button key={i} onClick={() => handleQ(QUIZ[step].id, opt)}
                style={{ width: "100%", textAlign: "left", background: optionBg, border: `.5px solid ${optionBorder}`, borderRadius: 12, padding: ".9rem 1.2rem", color: optionText, fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,136,.1)"; e.currentTarget.style.borderColor = "rgba(0,255,136,.5)"; e.currentTarget.style.transform = "translateX(5px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = optionBg; e.currentTarget.style.borderColor = optionBorder; e.currentTarget.style.transform = "none"; }}>
                <span style={{ color: optionLetter, marginRight: 12, fontSize: 11 }}>{String.fromCharCode(65 + i)}</span>{opt}
              </button>
            ))}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          {Object.entries(answers).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.2rem" }}>
            <span style={{ width: 8, height: 8, background: G, borderRadius: "50%" }} />
            <span style={{ fontSize: 12, color: G, fontWeight: 500 }}>Quiz complete — leave your details</span>
          </div>
          <div style={{ background: "rgba(0,255,136,.05)", border: `.5px solid ${summaryBorder}`, borderRadius: 12, padding: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: 11, color: mutedText3, marginBottom: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".05em" }}>Your answers</p>
            {Object.entries(answers).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", flexWrap: "wrap", gap: 4 }}>
                <span style={{ color: mutedText2 }}>{QUIZ.find(q => q.id === k)?.q}</span>
                <span style={{ color: G, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: "1.5rem" }}>
            {[
              { name: "name", placeholder: "Your full name *", type: "text", required: true },
              { name: "email", placeholder: "Email address *", type: "email", required: true },
              { name: "store_url", placeholder: "Your store URL (e.g. mystore.com)", type: "text" },
              { name: "phone", placeholder: "WhatsApp / phone number (optional)", type: "text" },
            ].map(f => (
              <div key={f.name}>
                <input name={f.name} type={f.type} placeholder={f.placeholder} required={f.required}
                  style={{ width: "100%", background: inputBg, border: `.5px solid ${inputBorder}`, borderRadius: 10, padding: ".8rem 1rem", color: inputColor, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "rgba(0,255,136,.5)"}
                  onBlur={e => e.target.style.borderColor = inputBorder} />
                <ValidationError field={f.name} errors={state.errors} style={{ color: "#ff6b6b", fontSize: 12, marginTop: 4, display: "block" }} />
              </div>
            ))}
            <div>
              <textarea name="message" placeholder="Anything else you'd like to share? Questions, context, goals — the more you tell us, the better we can help." rows={4}
                style={{ width: "100%", background: inputBg, border: `.5px solid ${inputBorder}`, borderRadius: 10, padding: ".8rem 1rem", color: inputColor, fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = "rgba(0,255,136,.5)"}
                onBlur={e => e.target.style.borderColor = inputBorder} />
            </div>
          </div>
          <button type="submit" disabled={state.submitting}
            style={{ width: "100%", background: GG, color: "#040608", border: "none", borderRadius: 10, padding: ".9rem", fontSize: 15, fontWeight: 700, cursor: state.submitting ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: state.submitting ? 0.7 : 1 }}>
            {state.submitting ? "Sending..." : "Submit my application →"}
          </button>
          <p style={{ fontSize: 11, color: mutedText4, textAlign: "center", marginTop: "1rem" }}>No spam. No commitment. We respond within 24 hours.</p>
        </form>
      )}
    </div>
  );
}

export default function Contact() {
  const { dark } = useTheme();
  const headingColor = dark ? "#fff" : "#0a0a0a";
  const mutedText = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const mutedText2 = dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)";
  const stepNumColor = G;
  const noSellBg = dark ? "rgba(0,255,136,.05)" : "rgba(0,255,136,.04)";
  const noSellBorder = dark ? "rgba(0,255,136,.18)" : "rgba(0,200,100,.2)";

  return (
    <PageWrapper>
      <section style={{ position: "relative", padding: "clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) 3rem", overflow: "hidden" }}>
        <Particles />
        <div style={{ position: "absolute", width: 500, height: 500, top: -100, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.14),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: G, fontWeight: 500 }}>
              <span style={{ width: 6, height: 6, background: G, borderRadius: "50%", animation: "pulse 2s ease-in-out infinite" }} /> Selective qualification
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(2rem,7vw,3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.03em", color: headingColor, marginBottom: "1.2rem", wordBreak: "break-word" }}>
            Is your store <GradText>ready to scale?</GradText>
          </h1>
          <p style={{ fontSize: "clamp(0.9rem,3vw,1.05rem)", color: mutedText, lineHeight: 1.75 }}>
            4 quick questions + your details. We read every application personally and respond within 24 hours.
          </p>
        </div>
      </section>

      <hr className="divider" />

      <Section>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "4rem", alignItems: "flex-start" }} className="about-grid">
          <div>
            <SectionLabel>What happens next</SectionLabel>
            <Heading size="1.8rem">Three steps to<br /><GradText>your first results</GradText></Heading>
            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { n: "01", t: "You apply", d: "Fill out the form. Takes 2 minutes. We read every application personally." },
                { n: "02", t: "We review", d: "Within 24 hours, we send you a personalised response with initial observations about your store." },
                { n: "03", t: "Discovery call", d: "If it's a fit, we book a 30-minute call to walk through your biggest opportunities." },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: stepNumColor, flexShrink: 0, fontFamily: "'Syne',sans-serif" }}>{s.n}</div>
                  <div>
                    <h4 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, color: headingColor, marginBottom: ".3rem" }}>{s.t}</h4>
                    <p style={{ fontSize: 13, color: mutedText2, lineHeight: 1.7 }}>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "2.5rem", background: noSellBg, border: `.5px solid ${noSellBorder}`, borderRadius: 14, padding: "1.2rem 1.4rem" }}>
              <p style={{ fontSize: 13, color: mutedText, lineHeight: 1.7 }}>
                <span style={{ color: G, fontWeight: 600 }}>No hard sell.</span> If we don't think we can help you, we'll tell you — and point you toward what will.
              </p>
            </div>
          </div>
          <ApplyForm />
        </div>
      </Section>
    </PageWrapper>
  );
}