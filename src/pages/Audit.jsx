import { useState } from "react";
import { Link } from "react-router-dom";
import { G, GG } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles, useTheme } from "../components.jsx";

const QUESTIONS = [
  {
    id: "speed",
    question: "How fast does your store load on mobile?",
    options: [
      { label: "Under 2 seconds", score: 0, feedback: "Great! Speed is not your issue." },
      { label: "2-4 seconds", score: 20, feedback: "Borderline. You're losing some visitors." },
      { label: "4-6 seconds", score: 40, feedback: "Serious problem. 40% of visitors leave." },
      { label: "Over 6 seconds or I don't know", score: 60, feedback: "Critical. Most visitors leave before seeing anything." },
    ],
  },
  {
    id: "checkout",
    question: "Does your checkout require account creation before purchase?",
    options: [
      { label: "No, guest checkout available", score: 0, feedback: "Good — no forced friction." },
      { label: "Yes, customers must register", score: 35, feedback: "This kills 35% of buyers at checkout." },
      { label: "I'm not sure", score: 20, feedback: "Check immediately — this is a major leak." },
    ],
  },
  {
    id: "cta",
    question: "Is your 'Add to Cart' button visible without scrolling on mobile?",
    options: [
      { label: "Yes, visible immediately", score: 0, feedback: "Perfect placement." },
      { label: "No, they have to scroll down", score: 30, feedback: "60% of stores have this problem. Easy fix, big win." },
      { label: "I haven't checked on mobile", score: 25, feedback: "Check now — mobile is 70% of your traffic." },
    ],
  },
  {
    id: "roas",
    question: "What is your current average ROAS (Return on Ad Spend)?",
    options: [
      { label: "Above 4x", score: 0, feedback: "Solid. Room to scale." },
      { label: "2x-4x", score: 15, feedback: "Decent but improvable. Hidden leaks exist." },
      { label: "1x-2x", score: 35, feedback: "Breaking even at best. Funnel needs fixing." },
      { label: "Below 1x or not running ads", score: 50, feedback: "Critical — every ad dollar is losing money." },
    ],
  },
  {
    id: "email",
    question: "Do you have an abandoned cart email sequence?",
    options: [
      { label: "Yes, 3+ emails set up", score: 0, feedback: "Good — recovering revenue on autopilot." },
      { label: "Yes, 1 email only", score: 15, feedback: "You need at least 3. You're leaving 15% recovery on the table." },
      { label: "No abandoned cart emails", score: 40, feedback: "You're losing 15-20% of recoverable revenue every day." },
    ],
  },
  {
    id: "trust",
    question: "Does your product page have reviews, trust badges, and a clear return policy?",
    options: [
      { label: "All three present and visible", score: 0, feedback: "Trust signals in place." },
      { label: "Some but not all", score: 20, feedback: "Missing trust signals cost conversions." },
      { label: "None of these", score: 45, feedback: "Major conversion killer. Buyers need trust signals." },
    ],
  },
  {
    id: "tracking",
    question: "Are you tracking conversion rate, CPA, and LTV separately?",
    options: [
      { label: "Yes, all three", score: 0, feedback: "Data-driven — you can scale confidently." },
      { label: "Only ROAS", score: 20, feedback: "ROAS alone is misleading. You need the full picture." },
      { label: "Not really tracking metrics", score: 40, feedback: "You can't improve what you don't measure." },
    ],
  },
];

function getGrade(score) {
  if (score <= 30) return { grade: "A", label: "Strong Store", color: "#00ff88", desc: "Your store has solid fundamentals. Focus on scaling what's working." };
  if (score <= 80) return { grade: "B", label: "Room to Improve", color: "#FAAD4D", desc: "Good base but there are clear leaks costing you revenue every day." };
  if (score <= 140) return { grade: "C", label: "Significant Issues", color: "#FF9900", desc: "Multiple friction points are actively losing you customers and revenue." };
  return { grade: "D", label: "Store Needs Urgent Work", color: "#FF4444", desc: "Critical issues are costing you the majority of potential revenue. Act now." };
}

export default function Audit() {
  const { dark } = useTheme();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
  const grade = getGrade(totalScore);
  const maxScore = QUESTIONS.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.score)), 0);
  const healthPct = Math.max(0, Math.round((1 - totalScore / maxScore) * 100));

  const cardBg = dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))";
  const cardBorder = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)";
  const cardBorderTop = dark ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.16)";
  const mutedText = dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)";
  const headingColor = dark ? "#fff" : "#0a0a0a";
  const optionBg = dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)";
  const optionBorder = dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.08)";
  const optionText = dark ? "#f0f0f0" : "#0a0a0a";
  const progressTrack = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)";

  const handleAnswer = (opt) => {
    const next = [...answers, { score: opt.score, feedback: opt.feedback, question: QUESTIONS[step].question, answer: opt.label }];
    setAnswers(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else setDone(true);
  };

  return (
    <PageWrapper>
      <section style={{ position: "relative", padding: "clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) 3rem", overflow: "hidden" }}>
        <Particles />
        <div style={{ position: "absolute", width: 500, height: 500, top: -100, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: G, fontWeight: 500 }}>
              <span style={{ width: 6, height: 6, background: G, borderRadius: "50%", animation: "pulse 2s infinite" }} /> Free Store Audit Tool
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(2rem,7vw,3.2rem)", fontWeight: 800, lineHeight: 1.1, color: headingColor, marginBottom: "1rem", wordBreak: "break-word" }}>
            How healthy is<br /><GradText>your store?</GradText>
          </h1>
          <p style={{ fontSize: "clamp(0.9rem,3vw,1.05rem)", color: dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)", lineHeight: 1.75 }}>
            7 questions. 2 minutes. Instant diagnosis of where your store is leaking money.
          </p>
        </div>
      </section>

      <Section>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {!done ? (
            <div style={{ background: cardBg, border: `.5px solid ${cardBorder}`, borderTop: `.5px solid ${cardBorderTop}`, borderRadius: 24, padding: "clamp(1.5rem,4vw,2.5rem)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: dark ? "linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)" : "linear-gradient(90deg,transparent,rgba(0,0,0,.1),transparent)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: mutedText }}>Question {step + 1} of {QUESTIONS.length}</span>
                <span style={{ fontSize: 12, color: G }}>{Math.round((step / QUESTIONS.length) * 100)}% done</span>
              </div>
              <div style={{ height: 4, background: progressTrack, borderRadius: 4, overflow: "hidden", marginBottom: "2rem" }}>
                <div style={{ height: "100%", background: GG, borderRadius: 4, width: `${(step / QUESTIONS.length) * 100}%`, transition: "width .4s" }} />
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.1rem,4vw,1.3rem)", fontWeight: 700, color: headingColor, marginBottom: "1.5rem", lineHeight: 1.4 }}>{QUESTIONS[step].question}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {QUESTIONS[step].options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt)}
                    style={{ width: "100%", textAlign: "left", background: optionBg, border: `.5px solid ${optionBorder}`, borderRadius: 12, padding: "1rem 1.2rem", color: optionText, fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all .2s", display: "flex", alignItems: "center", gap: 12 }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,136,.1)"; e.currentTarget.style.borderColor = "rgba(0,255,136,.5)"; e.currentTarget.style.transform = "translateX(6px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = optionBg; e.currentTarget.style.borderColor = optionBorder; e.currentTarget.style.transform = "none"; }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: G, flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Score card */}
              <div style={{ background: cardBg, border: `.5px solid ${grade.color}44`, borderTop: `.5px solid ${grade.color}88`, borderRadius: 24, padding: "2.5rem", marginBottom: "1.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg,transparent,${grade.color}88,transparent)` }} />
                <div style={{ width: 100, height: 100, borderRadius: "50%", background: `${grade.color}18`, border: `3px solid ${grade.color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.5rem", fontWeight: 800, color: grade.color, lineHeight: 1 }}>{grade.grade}</span>
                </div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.4rem,5vw,2rem)", fontWeight: 800, color: headingColor, marginBottom: ".5rem" }}>{grade.label}</h2>
                <p style={{ fontSize: 14, color: dark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.5)", marginBottom: "1.5rem", lineHeight: 1.7 }}>{grade.desc}</p>
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: mutedText }}>Store Health Score</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: grade.color }}>{healthPct}%</span>
                  </div>
                  <div style={{ height: 10, background: progressTrack, borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: `linear-gradient(90deg,${grade.color},${grade.color}88)`, borderRadius: 10, width: `${healthPct}%`, transition: "width 1.5s cubic-bezier(.16,1,.3,1)" }} />
                  </div>
                </div>
                <Link to="/contact" className="btn-g" style={{ display: "inline-block" }}>Get a full professional audit →</Link>
              </div>

              {/* Issue breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.1rem", fontWeight: 700, color: headingColor }}>Your diagnosis:</h3>
                {answers.map((a, i) => (
                  <div key={i} style={{ background: a.score === 0 ? "rgba(0,255,136,.05)" : (dark ? "rgba(255,100,0,.05)" : "rgba(255,100,0,.04)"), border: `.5px solid ${a.score === 0 ? "rgba(0,255,136,.2)" : "rgba(255,100,0,.2)"}`, borderRadius: 12, padding: "1rem 1.2rem", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: a.score === 0 ? "rgba(0,255,136,.15)" : "rgba(255,100,0,.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      {a.score === 0
                        ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3L9 9M9 3L3 9" stroke="#FF6400" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      }
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: mutedText, marginBottom: 2 }}>{a.question}</p>
                      <p style={{ fontSize: 13, color: dark ? "rgba(255,255,255,.6)" : "rgba(0,0,0,.6)", marginBottom: 4 }}>Your answer: <strong style={{ color: headingColor }}>{a.answer}</strong></p>
                      <p style={{ fontSize: 12, color: a.score === 0 ? G : "#FF9900", fontStyle: "italic" }}>{a.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 20, padding: "2rem", textAlign: "center" }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.3rem", fontWeight: 800, color: headingColor, marginBottom: ".75rem" }}>Want us to fix every issue above?</h3>
                <p style={{ fontSize: 14, color: dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)", marginBottom: "1.5rem", lineHeight: 1.7 }}>Our full professional audit goes 10x deeper — and we don't just identify problems, we fix them.</p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link to="/contact" className="btn-g" style={{ display: "inline-block" }}>Apply for full audit →</Link>
                  <button onClick={() => { setStep(0); setAnswers([]); setDone(false); }} className="btn-ghost">Retake audit</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
    </PageWrapper>
  );
}