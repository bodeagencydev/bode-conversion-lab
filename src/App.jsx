import { useState, useEffect, useRef } from "react";
import { useForm, ValidationError } from "@formspree/react";

const G = "#00ff88";
const GG = "linear-gradient(135deg,#00ff88,#00cc6a)";

const NAV_LINKS = [
  { label: "About", id: "about" },
  { label: "Results", id: "results" },
  { label: "How it works", id: "how" },
  { label: "Clients", id: "testimonials" },
  { label: "Pricing", id: "offers" },
  { label: "FAQ", id: "faq" },
  { label: "Apply", id: "apply" },
];

const QUIZ = [
  { id: "revenue", q: "What is your store's current monthly revenue?", opts: ["Under $1k", "$1k – $10k", "$10k – $50k", "$50k+"] },
  { id: "ads", q: "Are you currently running paid ads?", opts: ["Yes, actively", "No, not yet", "Used to, paused now"] },
  { id: "bottleneck", q: "What's your biggest bottleneck right now?", opts: ["Getting traffic", "Converting visitors", "Improving ROAS", "All of the above"] },
  { id: "budget", q: "Monthly investment budget for growth?", opts: ["Under $500", "$500 – $2k", "$2k – $5k", "$5k+"] },
];

const TESTIMONIALS = [
  { init: "MT", name: "Marcus T.", role: "Shopify Store Owner", result: "$1.2k → $38k/mo", text: "I'd been running ads for 2 years with nothing to show for it. Three months in, my ROAS went from 0.8x to 6.2x. The store rebuild alone doubled my conversion rate." },
  { init: "PS", name: "Priya S.", role: "DTC Brand Founder", result: "1.1% → 4.8% CVR", text: "They found 11 things wrong with my checkout in the first audit. I had no idea I was losing that many customers. Best investment I've made in the business." },
  { init: "JO", name: "James O.", role: "E-commerce Entrepreneur", result: "ROAS 0.6x → 5.4x", text: "Went from burning money on ads to finally being profitable in week 6. The system they built just keeps compounding. I wish I found them sooner." },
  { init: "AL", name: "Aisha L.", role: "Beauty Brand Owner", result: "$800 → $22k/mo", text: "Within 45 days they rebuilt my product page, rewrote my ad copy and my cost per purchase dropped by 60%. Insane results for a small brand." },
  { init: "RK", name: "Ryan K.", role: "Fitness Supplements", result: "CPA $42 → $11", text: "The audit alone was worth 10x the price. They identified a checkout friction point killing 40% of my sales. Fixed in a week, results were immediate." },
  { init: "TN", name: "Tunde N.", role: "Fashion E-commerce", result: "$3k → $41k/mo", text: "We were spending $5k/mo on ads and getting almost nothing back. Bode found the issue in 3 days. Now every dollar we spend returns four." },
];

const ECOM_PLATFORMS = ["Shopify", "WooCommerce", "Magento", "BigCommerce", "Wix", "Squarespace", "PrestaShop", "OpenCart", "Volusion", "Ecwid", "Salesforce Commerce", "Wix eCommerce"];
const AD_PLATFORMS = ["Meta Ads", "TikTok Ads", "Google Ads", "Pinterest Ads", "Snapchat Ads", "YouTube Ads", "Twitter/X Ads", "LinkedIn Ads", "Amazon Ads"];
const PARTNERS = [
  { name: "Meta", icon: "M" },
  { name: "Google", icon: "G" },
  { name: "TikTok", icon: "T" },
  { name: "Shopify", icon: "S" },
  { name: "Klaviyo", icon: "K" },
  { name: "Triple Whale", icon: "W" },
];

const FAQS = [
  { q: "Do I need a big ad budget to work with you?", a: "No. We work with clients at various stages. The most important thing is a proven product and willingness to optimize. We'll tell you the minimum viable budget on our discovery call." },
  { q: "How long before I see results?", a: "Most clients see measurable improvements within 30 days. Full revenue compounding typically kicks in by month 3. Our record is 90 days from $1k to $70k monthly revenue." },
  { q: "What platforms do you work with?", a: "Shopify, WooCommerce, Magento, BigCommerce and more. For ads: Meta, TikTok, and Google. We focus on wherever your customers actually are." },
  { q: "What makes you different from a regular ad agency?", a: "We don't just run ads. We fix the whole system — store speed, product pages, checkout flow, email sequences, then ads. Most agencies skip the 80% that makes ads actually work." },
  { q: "Is there a contract?", a: "Month-to-month on The Lab retainer. We don't believe in locking clients in — we believe in results that make you want to stay." },
  { q: "What if I'm just starting out?", a: "The Audit is the perfect entry point. We'll assess where you are, tell you exactly what to fix, and give you a clear roadmap to your first $10k month." },
];

/* ── HOOKS ── */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function AnimNum({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let s = null;
    const step = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / 2000, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── PARTICLES ── */
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.28, dy: (Math.random() - 0.5) * 0.28,
      o: Math.random() * 0.45 + 0.08,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,136,${p.o})`; ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 95) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,255,136,${0.07 * (1 - d / 95)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

/* ── TYPEWRITER ── */
function Typewriter({ words }) {
  const [wi, setWi] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wi];
    let timeout;
    if (!deleting && text.length < word.length) {
      timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), 80);
    } else if (!deleting && text.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 45);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setWi((wi + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, wi, words]);
  return (
    <span style={{ background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
      {text}<span style={{ opacity: Math.sin(Date.now() / 400) > 0 ? 1 : 0, color: G }}>|</span>
    </span>
  );
}

/* ── CONTINUOUS TICKER ── */
function ContinuousTicker({ items, speed = 35, reverse = false }) {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", position: "relative" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div ref={trackRef} style={{
        display: "flex", gap: "2rem", width: "max-content",
        animation: `${reverse ? "tickerR" : "ticker"} ${speed}s linear infinite`,
        animationPlayState: paused ? "paused" : "running",
      }}>
        {doubled.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "0.6rem 1.4rem",
            background: "rgba(255,255,255,.04)", border: ".5px solid rgba(255,255,255,.1)",
            borderRadius: 100, whiteSpace: "nowrap", cursor: "default",
            transition: "border-color .2s, background .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,255,136,.4)"; e.currentTarget.style.background = "rgba(0,255,136,.07)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.background = "rgba(255,255,255,.04)"; }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: G, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 500 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── CONTINUOUS TESTIMONIAL TICKER ── */
function TestimonialTicker({ items }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", position: "relative" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div style={{
        display: "flex", gap: "1.5rem", width: "max-content",
        animation: "ticker 40s linear infinite",
        animationPlayState: paused ? "paused" : "running",
      }}>
        {doubled.map((t, i) => (
          <div key={i} style={{
            width: 340, flexShrink: 0,
            background: "linear-gradient(135deg,rgba(0,255,136,.07),rgba(0,204,106,.02))",
            border: ".5px solid rgba(0,255,136,.18)",
            borderTop: ".5px solid rgba(0,255,136,.3)",
            borderRadius: 20, padding: "1.6rem",
            position: "relative", overflow: "hidden",
            transition: "transform .3s, border-color .3s",
            cursor: "default",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(0,255,136,.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(0,255,136,.18)"; }}>
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,255,136,.45),transparent)" }} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: G, fontWeight: 600, marginBottom: "1rem" }}>{t.result}</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.7, marginBottom: "1.2rem", fontStyle: "italic" }}>"{t.text}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: G, flexShrink: 0 }}>{t.init}</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0 }}>{t.name}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", margin: 0 }}>{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SECTION ── */
function Section({ id, children, style = {} }) {
  const [ref, inView] = useInView(0.06);
  return (
    <section id={id} ref={ref} style={{
      padding: "6rem 2rem", position: "relative",
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : "translateY(32px)",
      transition: "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)",
      ...style
    }}>
      {children}
    </section>
  );
}

/* ── LABEL ── */
function SectionLabel({ children }) {
  return <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".75rem" }}>{children}</p>;
}

function Heading({ children }) {
  return <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.3rem", fontWeight: 800, letterSpacing: "-.02em", color: "#fff", lineHeight: 1.15 }}>{children}</h2>;
}

/* ── APPLY FORM ── */
function ApplyForm() {
  const [state, handleSubmit] = useForm("xaqadyal");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const handleQ = (id, opt) => {
    const next = { ...answers, [id]: opt };
    setAnswers(next);
    if (step < QUIZ.length - 1) setStep(step + 1);
    else setDone(true);
  };

  if (state.succeeded) return (
    <div style={{ background: "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border: ".5px solid rgba(0,255,136,.35)", borderRadius: 20, padding: "2.5rem", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: ".75rem" }}>Application received!</h3>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", lineHeight: 1.7 }}>We've got your details and quiz answers. Expect a personalised response within 24 hours.</p>
    </div>
  );

  return (
    <div style={{ background: "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))", border: ".5px solid rgba(255,255,255,.12)", borderTop: ".5px solid rgba(255,255,255,.22)", borderRadius: 20, padding: "2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)" }} />
      {!done ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>Step {step + 1} of {QUIZ.length}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>{Math.round((step / QUIZ.length) * 100)}%</span>
          </div>
          <div style={{ height: 2, background: "rgba(255,255,255,.08)", borderRadius: 2, overflow: "hidden", marginBottom: "1.5rem" }}>
            <div style={{ height: "100%", background: GG, borderRadius: 2, width: `${(step / QUIZ.length) * 100}%`, transition: "width .4s" }} />
          </div>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "1.2rem", lineHeight: 1.4 }}>{QUIZ[step].q}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {QUIZ[step].opts.map((opt, i) => (
              <button key={i} onClick={() => handleQ(QUIZ[step].id, opt)}
                style={{ width: "100%", textAlign: "left", background: "rgba(255,255,255,.04)", border: ".5px solid rgba(255,255,255,.1)", borderRadius: 12, padding: ".9rem 1.2rem", color: "#f0f0f0", fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,136,.1)"; e.currentTarget.style.borderColor = "rgba(0,255,136,.5)"; e.currentTarget.style.transform = "translateX(5px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.transform = "none"; }}>
                <span style={{ color: "rgba(255,255,255,.25)", marginRight: 12, fontSize: 11 }}>{String.fromCharCode(65 + i)}</span>{opt}
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
          <div style={{ background: "rgba(0,255,136,.05)", border: ".5px solid rgba(0,255,136,.18)", borderRadius: 12, padding: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginBottom: 8, fontWeight: 500 }}>YOUR ANSWERS — delivered to us exactly as selected</p>
            {Object.entries(answers).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0", flexWrap: "wrap", gap: 4 }}>
                <span style={{ color: "rgba(255,255,255,.3)" }}>{QUIZ.find(q => q.id === k)?.q}</span>
                <span style={{ color: G, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: "1.5rem" }}>
            {[
              { name: "name", placeholder: "Your full name", type: "text", required: true },
              { name: "email", placeholder: "Email address", type: "email", required: true },
              { name: "store_url", placeholder: "Your store URL (e.g. mystore.com)", type: "text" },
              { name: "phone", placeholder: "WhatsApp / phone number (optional)", type: "text" },
            ].map(f => (
              <div key={f.name}>
                <input name={f.name} type={f.type} placeholder={f.placeholder} required={f.required}
                  style={{ width: "100%", background: "rgba(255,255,255,.05)", border: ".5px solid rgba(255,255,255,.12)", borderRadius: 10, padding: ".8rem 1rem", color: "#f0f0f0", fontSize: 14, fontFamily: "inherit", outline: "none" }}
                  onFocus={e => e.target.style.borderColor = "rgba(0,255,136,.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.12)"} />
                <ValidationError field={f.name} errors={state.errors} style={{ color: "#ff6b6b", fontSize: 12, marginTop: 4, display: "block" }} />
              </div>
            ))}
          </div>
          <button type="submit" disabled={state.submitting}
            style={{ width: "100%", background: GG, color: "#040608", border: "none", borderRadius: 10, padding: ".9rem", fontSize: 15, fontWeight: 700, cursor: state.submitting ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: state.submitting ? 0.7 : 1 }}>
            {state.submitting ? "Sending..." : "Submit my application →"}
          </button>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,.2)", textAlign: "center", marginTop: "1rem" }}>No spam. No commitment. We respond within 24 hours.</p>
        </form>
      )}
    </div>
  );
}

/* ── MAIN ── */
export default function App() {
  const scrollY = useScrollY();
  const [faqOpen, setFaqOpen] = useState(null);
  const [pricingVisible, setPricingVisible] = useState(false);
  const navH = scrollY > 40;
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", background: "#040608", color: "#f0f0f0", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::selection{background:#00ff88;color:#040608;}
        @keyframes float1{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-20px) rotate(10deg);}}
        @keyframes float2{0%,100%{transform:translateY(0);}50%{transform:translateY(-13px);}}
        @keyframes scan{0%{top:0%;opacity:0;}10%{opacity:1;}90%{opacity:.15;}100%{top:100%;opacity:0;}}
        @keyframes pulse{0%,100%{opacity:.5;}50%{opacity:1;}}
        @keyframes ticker{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
        @keyframes tickerR{0%{transform:translateX(-50%);}100%{transform:translateX(0);}}
        @keyframes glow{0%,100%{box-shadow:0 0 18px rgba(0,255,136,.25);}50%{box-shadow:0 0 38px rgba(0,255,136,.55);}}
        @keyframes heroFadeUp{from{opacity:0;transform:translateY(32px);}to{opacity:1;transform:none;}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
        nav a{color:rgba(255,255,255,.5);text-decoration:none;font-size:14px;transition:color .2s;cursor:pointer;}
        nav a:hover{color:#00ff88;}
        .divider{border:none;border-top:.5px solid rgba(255,255,255,.06);}
        .glass{background:linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.02));border:.5px solid rgba(255,255,255,.12);border-top:.5px solid rgba(255,255,255,.2);border-radius:16px;position:relative;overflow:hidden;}
        .glass::before{content:'';position:absolute;top:0;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);}
        .card3d{transition:transform .4s ease,box-shadow .4s;}
        .card3d:hover{transform:perspective(900px) rotateY(5deg) rotateX(-3deg) scale(1.02);box-shadow:0 20px 60px rgba(0,0,0,.4);}
        .btn-g{background:linear-gradient(135deg,#00ff88,#00cc6a);color:#040608;border:none;border-radius:10px;padding:.85rem 1.8rem;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .15s;box-shadow:0 4px 22px rgba(0,255,136,.35);}
        .btn-g:hover{transform:translateY(-2px);box-shadow:0 8px 34px rgba(0,255,136,.55);}
        .btn-ghost{background:rgba(255,255,255,.04);color:rgba(255,255,255,.65);border:.5px solid rgba(255,255,255,.15);border-radius:10px;padding:.85rem 1.8rem;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .15s;}
        .btn-ghost:hover{background:rgba(255,255,255,.08);border-color:rgba(0,255,136,.3);color:#fff;}
        .stat-card{background:rgba(255,255,255,.04);border:.5px solid rgba(255,255,255,.08);border-radius:16px;padding:1.8rem 1.2rem;text-align:center;transition:border-color .3s,transform .3s;}
        .stat-card:hover{border-color:rgba(0,255,136,.35);transform:translateY(-3px);}
        .offer-card{background:linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02));border:.5px solid rgba(255,255,255,.1);border-radius:20px;padding:2rem;transition:transform .25s,border-color .25s;position:relative;overflow:hidden;}
        .offer-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);}
        .offer-card:hover{transform:translateY(-5px);}
        .offer-card.feat{border-color:rgba(0,255,136,.45);background:linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03));}
        .offer-card.feat::before{background:linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent);}
        .partner-card{background:rgba(255,255,255,.04);border:.5px solid rgba(255,255,255,.1);border-radius:14px;padding:1rem 1.5rem;display:flex;align-items:center;gap:10px;transition:all .25s;cursor:default;}
        .partner-card:hover{background:rgba(0,255,136,.07);border-color:rgba(0,255,136,.35);transform:translateY(-2px);}
        @media(max-width:640px){
          .hero-t{font-size:2.3rem!important;}
          .stat-grid,.offer-grid,.how-grid,.partner-grid{grid-template-columns:1fr!important;}
          .nav-links{display:none!important;}
          .hero-cards{grid-template-columns:1fr 1fr!important;}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: navH ? "rgba(4,6,8,.92)" : "transparent", backdropFilter: navH ? "blur(20px)" : "none", borderBottom: navH ? ".5px solid rgba(255,255,255,.07)" : "none", transition: "all .3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, background: GG, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 14px rgba(0,255,136,.4)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10L7 3L12 10" stroke="#040608" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M4.5 7.5L9.5 7.5" stroke="#040608" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, fontFamily: "'Syne',sans-serif", color: "#fff" }}>Bode Conversion Lab</span>
        </div>
        <div className="nav-links" style={{ display: "flex", gap: "1.8rem" }}>
          {NAV_LINKS.map(l => <a key={l.id} onClick={() => scrollTo(l.id)}>{l.label}</a>)}
        </div>
        <button className="btn-g" style={{ padding: ".5rem 1.2rem", fontSize: 13 }} onClick={() => scrollTo("apply")}>Apply Now</button>
      </nav>

      {/* ══════════════════════════════════════
          HERO — full animated section
      ══════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8rem 2rem 5rem", overflow: "hidden" }}>
        <Particles />
        {/* Orbs */}
        <div style={{ position: "absolute", width: 700, height: 700, top: -200, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle at 40% 40%,rgba(0,255,136,.18),rgba(0,180,80,.05) 55%,transparent 75%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 280, height: 280, bottom: -60, left: "3%", background: "radial-gradient(circle,rgba(0,255,136,.09),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        {/* Grid bg */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,255,136,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,.022) 1px,transparent 1px)", backgroundSize: "44px 44px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%,black 40%,transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%,black 40%,transparent 100%)", pointerEvents: "none" }} />
        {/* Scan line */}
        <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(0,255,136,.7),transparent)", animation: "scan 5s ease-in-out infinite", pointerEvents: "none" }} />
        {/* 3D floating shapes */}
        <div style={{ position: "absolute", top: "13%", right: "5%", width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle at 33% 28%,rgba(0,255,136,.85),rgba(0,180,80,.3) 45%,rgba(0,60,30,.08) 70%,transparent)", boxShadow: "inset -14px -14px 28px rgba(0,0,0,.55),inset 8px 8px 20px rgba(0,255,136,.28),0 0 40px rgba(0,255,136,.2)", animation: "float1 7s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "22%", left: "4%", width: 65, height: 65, background: "linear-gradient(135deg,rgba(0,255,136,.14),rgba(0,204,106,.04))", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 14, boxShadow: "inset 0 1px 0 rgba(0,255,136,.35),0 0 24px rgba(0,255,136,.12)", transform: "rotate(16deg)", animation: "float2 9s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "32%", left: "6%", width: 72, height: 72, borderRadius: "50%", border: "1.5px solid rgba(0,255,136,.2)", boxShadow: "0 0 18px rgba(0,255,136,.1)", animation: "float1 11s ease-in-out infinite 2s", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "35%", right: "8%", width: 45, height: 45, background: "linear-gradient(135deg,rgba(0,255,136,.1),transparent)", border: ".5px solid rgba(0,255,136,.2)", borderRadius: 10, animation: "float2 8s ease-in-out infinite 1s", pointerEvents: "none" }} />

        <div style={{ maxWidth: 780, textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div style={{ animation: "heroFadeUp .7s ease both", marginBottom: "1.5rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.28)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: G, fontWeight: 500, letterSpacing: ".04em" }}>
              <span style={{ width: 6, height: 6, background: G, borderRadius: "50%", animation: "pulse 2s ease-in-out infinite" }} />
              Store Optimization & Ads Engineering
            </span>
          </div>
          {/* Headline with typewriter */}
          <h1 className="hero-t" style={{ fontFamily: "'Syne',sans-serif", fontSize: "3.7rem", fontWeight: 800, lineHeight: 1.07, letterSpacing: "-.03em", marginBottom: "1.2rem", color: "#fff", animation: "heroFadeUp .8s .1s ease both", opacity: 0, animationFillMode: "forwards" }}>
            We turn your store into a<br />
            <Typewriter words={["revenue machine.", "conversion engine.", "ROAS monster.", "scaling system."]} />
          </h1>
          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,.45)", lineHeight: 1.75, marginBottom: "2rem", maxWidth: 540, margin: "0 auto 2rem", animation: "heroFadeUp .8s .2s ease both", opacity: 0, animationFillMode: "forwards" }}>
            Bode Conversion Lab engineers your ROAS from the ground up — ads, landing pages, checkout. One system. Compounding results every month.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: "3.5rem", animation: "heroFadeUp .8s .3s ease both", opacity: 0, animationFillMode: "forwards" }}>
            <button className="btn-g" onClick={() => scrollTo("apply")}>See if your store qualifies →</button>
            <button className="btn-ghost" onClick={() => scrollTo("results")}>View client results</button>
          </div>
          {/* 3D glass stat cards */}
          <div className="hero-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, animation: "heroFadeUp .8s .45s ease both", opacity: 0, animationFillMode: "forwards" }}>
            {[{ n: "70x", l: "Revenue growth\nin 90 days" }, { n: "4x+", l: "Average ROAS\nimprovement" }, { n: "$0", l: "Extra ad spend\nrequired" }].map((c, i) => (
              <div key={i} className="card3d" style={{ background: "linear-gradient(135deg,rgba(0,255,136,.09),rgba(0,204,106,.03))", border: ".5px solid rgba(0,255,136,.22)", borderTop: ".5px solid rgba(0,255,136,.38)", borderRadius: 16, padding: "1.3rem 1rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(0,255,136,.05) 0%,transparent 60%)", pointerEvents: "none" }} />
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.9rem", fontWeight: 800, background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1.1, marginBottom: 6 }}>{c.n}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", lineHeight: 1.5, whiteSpace: "pre-line" }}>{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TRUSTED BY — e-commerce platforms continuous ticker ══ */}
      <div style={{ borderTop: ".5px solid rgba(255,255,255,.06)", borderBottom: ".5px solid rgba(255,255,255,.06)", background: "rgba(255,255,255,.01)", padding: "1rem 0" }}>
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,.25)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".8rem" }}>Trusted by stores on</p>
        <ContinuousTicker items={ECOM_PLATFORMS} speed={30} />
      </div>

      {/* ══ AD PLATFORMS TICKER (reverse direction) ══ */}
      <div style={{ borderBottom: ".5px solid rgba(255,255,255,.06)", background: "rgba(255,255,255,.01)", padding: "1rem 0" }}>
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,.25)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".8rem" }}>We run ads on</p>
        <ContinuousTicker items={AD_PLATFORMS} speed={25} reverse={true} />
      </div>

      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      <Section id="about">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <SectionLabel>About Bode Conversion Lab</SectionLabel>
              <Heading>
                Built by a marketer<br />
                <span style={{ background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>who got tired of excuses.</span>
              </Heading>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.45)", lineHeight: 1.85, marginTop: "1.5rem" }}>
                Most agencies hide behind vanity metrics — impressions, clicks, reach. We only care about one number: revenue in your bank account.
              </p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.45)", lineHeight: 1.85, marginTop: "1rem" }}>
                Bode Conversion Lab was built on one belief: that the gap between a struggling store and a thriving one is almost never the product. It's the system. The funnel. The ads. The page that doesn't convert.
              </p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.45)", lineHeight: 1.85, marginTop: "1rem" }}>
                We fix that system. And we don't stop until the numbers prove it.
              </p>
              <button className="btn-g" style={{ marginTop: "2rem" }} onClick={() => scrollTo("apply")}>Work with us →</button>
            </div>
            {/* Visual side */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { n: "70x", label: "Best revenue result", sub: "$1k → $70k in 90 days" },
                { n: "60%", label: "Avg CPA reduction", sub: "Across all active clients" },
                { n: "48h", label: "Audit turnaround", sub: "Full report in 2 business days" },
              ].map((s, i) => (
                <div key={i} className="glass card3d" style={{ padding: "1.4rem 1.6rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "2rem", fontWeight: 800, background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", minWidth: 70 }}>{s.n}</div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{s.label}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)", margin: 0 }}>{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* ══════════════════════════════════════
          RESULTS
      ══════════════════════════════════════ */}
      <Section id="results">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>Proven results</SectionLabel>
            <Heading>Same product. Same budget.<br /><span style={{ background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>70x the revenue.</span></Heading>
          </div>
          <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
            {[{ n: 70, s: "x", l: "Revenue multiplier" }, { n: 90, s: " days", l: "Time to results" }, { n: 4, s: "x+", l: "ROAS improvement" }].map((s, i) => (
              <div key={i} className="stat-card">
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.8rem", fontWeight: 800, background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1, marginBottom: 8 }}>
                  <AnimNum target={s.n} suffix={s.s} />
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <Section id="how">
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <SectionLabel>The system</SectionLabel>
            <Heading>We don't run ads.<br /><span style={{ background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>We engineer ROAS.</span></Heading>
          </div>
          <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem" }}>
            {[
              { n: "01", t: "Deep-dive audit", d: "We dissect your store, ads, and full funnel. Every leak, friction point, and missed revenue mapped in 48 hours." },
              { n: "02", t: "Conversion architecture", d: "We rebuild your landing pages and checkout to convert more of the traffic you already have — no extra spend required." },
              { n: "03", t: "Ad engineering", d: "Precision creatives, copy, and targeting built around your pain points. Every ad compounds — not spray-and-pray." },
              { n: "04", t: "Scale & compound", d: "Once we hit your ROAS floor, we scale. Same efficiency, more budget. $1k/mo becomes $70k/mo." },
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

      {/* ══════════════════════════════════════
          TESTIMONIALS — continuous auto-scroll
      ══════════════════════════════════════ */}
      <Section id="testimonials">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>Client results</SectionLabel>
            <Heading>Real stores. <span style={{ background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Real numbers.</span></Heading>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.3)", marginTop: ".75rem" }}>Hover to pause · profile photos updated at launch</p>
          </div>
          <TestimonialTicker items={TESTIMONIALS} />
        </div>
      </Section>

      <hr className="divider" />

      {/* ══════════════════════════════════════
          BUSINESS PARTNERS
      ══════════════════════════════════════ */}
      <Section id="partners">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>Official partnerships</SectionLabel>
            <Heading>Platform <span style={{ background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>partners</span></Heading>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.35)", marginTop: ".75rem", maxWidth: 500, margin: ".75rem auto 0" }}>We work as certified partners across the platforms your customers live on — so every campaign runs with full platform intelligence.</p>
          </div>
          <div className="partner-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "2rem" }}>
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

      {/* ══════════════════════════════════════
          PRICING — hidden until revealed
      ══════════════════════════════════════ */}
      <Section id="offers">
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>Investment</SectionLabel>
            <Heading>Serious about scaling?<br /><span style={{ background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Here's how we work.</span></Heading>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.35)", marginTop: "1rem", maxWidth: 480, margin: "1rem auto 0" }}>We don't list pricing publicly for everyone — only for stores that qualify. Complete the quiz below to unlock pricing.</p>
          </div>

          {!pricingVisible ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "linear-gradient(135deg,rgba(0,255,136,.06),rgba(0,204,106,.02))", border: ".5px solid rgba(0,255,136,.2)", borderRadius: 20 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", animation: "glow 3s ease-in-out infinite" }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="10" width="14" height="10" rx="3" stroke={G} strokeWidth="1.5" /><path d="M7 10V7a4 4 0 018 0v3" stroke={G} strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#fff", marginBottom: ".75rem" }}>Pricing is qualification-based</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", marginBottom: "1.5rem", lineHeight: 1.7 }}>We only work with stores that are the right fit. Complete the quiz to see which plan matches your stage.</p>
              <button className="btn-g" onClick={() => { setPricingVisible(true); setTimeout(() => scrollTo("pricing-cards"), 300); }}>
                Unlock pricing →
              </button>
            </div>
          ) : (
            <div id="pricing-cards">
              <div className="offer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
                {[
                  { tier: "Entry", name: "The Audit", price: "$497", period: "one-time", items: ["Full store + ads audit", "30-page action report", "1 strategy call", "Roadmap to $10k/mo"], feat: false },
                  { tier: "Most Popular", name: "The Lab", price: "$2,000", period: "/mo", items: ["Everything in Audit", "Monthly ad management", "CRO optimization", "Weekly reporting", "Slack access"], feat: true },
                  { tier: "Premium", name: "Full Stack", price: "$4,500", period: "/mo", items: ["Everything in The Lab", "Done-for-you builds", "Landing page rebuilds", "Weekly strategy calls", "Priority response"], feat: false },
                ].map((o, i) => (
                  <div key={i} className={`offer-card ${o.feat ? "feat" : ""}`}>
                    {o.feat && <div style={{ display: "inline-block", background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.4)", borderRadius: 100, padding: "3px 12px", fontSize: 11, color: G, marginBottom: "1rem" }}>{o.tier}</div>}
                    {!o.feat && <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginBottom: ".5rem" }}>{o.tier}</p>}
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", fontWeight: 800, marginBottom: ".75rem", color: "#fff" }}>{o.name}</h3>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "2rem", fontWeight: 800, color: "#fff" }}>{o.price}</span>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,.3)" }}>{o.period}</span>
                    </div>
                    <ul style={{ listStyle: "none", marginBottom: "1.5rem" }}>
                      {o.items.map((item, j) => (
                        <li key={j} style={{ fontSize: 13, color: "rgba(255,255,255,.5)", padding: "6px 0", borderBottom: ".5px solid rgba(255,255,255,.05)", display: "flex", gap: 8, alignItems: "center" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button className={o.feat ? "btn-g" : "btn-ghost"} style={{ width: "100%", textAlign: "center" }} onClick={() => scrollTo("apply")}>Apply now</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      <hr className="divider" />

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <Section id="faq">
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel>Common questions</SectionLabel>
            <Heading>FAQ</Heading>
          </div>
          {FAQS.map((f, i) => (
            <div key={i}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", color: "#f0f0f0", fontSize: 15, fontWeight: 500, cursor: "pointer", padding: "1.2rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit", borderBottom: ".5px solid rgba(255,255,255,.07)" }}>
                <span>{f.q}</span>
                <span style={{ color: G, fontSize: 18, transition: "transform .25s", transform: faqOpen === i ? "rotate(45deg)" : "none", display: "inline-block", flexShrink: 0, marginLeft: 12 }}>+</span>
              </button>
              {faqOpen === i && (
                <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", lineHeight: 1.75, padding: "1rem 0 1.2rem", borderBottom: ".5px solid rgba(255,255,255,.07)" }}>{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      <hr className="divider" />

      {/* ══════════════════════════════════════
          APPLY
      ══════════════════════════════════════ */}
      <Section id="apply" style={{ paddingBottom: "8rem" }}>
        <div style={{ position: "absolute", width: 500, height: 500, top: 0, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,rgba(0,255,136,.07),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <SectionLabel>Selective qualification</SectionLabel>
            <Heading>Is your store <span style={{ background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>ready to scale?</span></Heading>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.35)", marginTop: ".75rem" }}>4 questions + your details. Everything you select is delivered directly to us — exactly as you chose it.</p>
          </div>
          <ApplyForm />
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "2.5rem 2rem", borderTop: ".5px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, background: GG, borderRadius: 6 }} />
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Syne',sans-serif", color: "#fff" }}>Bode Conversion Lab</span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {NAV_LINKS.map(l => <a key={l.id} onClick={() => scrollTo(l.id)} style={{ fontSize: 12, color: "rgba(255,255,255,.25)", textDecoration: "none", cursor: "pointer" }}>{l.label}</a>)}
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.15)" }}>© 2025 Bode Conversion Lab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}