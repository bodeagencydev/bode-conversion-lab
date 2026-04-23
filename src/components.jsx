import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { G, GG, NAV_LINKS } from "./data.js";

/* ── HOOKS ── */
export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

export function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export function AnimNum({ target, suffix = "" }) {
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
export function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.25, dy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.4 + 0.08,
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
        if (d < 90) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,255,136,${0.06 * (1 - d / 90)})`; ctx.lineWidth = 0.5; ctx.stroke();
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
export function Typewriter({ words }) {
  const [wi, setWi] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wi];
    let timeout;
    if (!deleting && text.length < word.length) timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), 80);
    else if (!deleting && text.length === word.length) timeout = setTimeout(() => setDeleting(true), 2200);
    else if (deleting && text.length > 0) timeout = setTimeout(() => setText(text.slice(0, -1)), 45);
    else if (deleting && text.length === 0) { setDeleting(false); setWi((wi + 1) % words.length); }
    return () => clearTimeout(timeout);
  }, [text, deleting, wi, words]);
  return (
    <span style={{ background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
      {text}<span style={{ color: G }}>|</span>
    </span>
  );
}

/* ── CONTINUOUS TICKER ── */
export function ContinuousTicker({ items, speed = 35, reverse = false }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ display: "flex", gap: "2rem", width: "max-content", animation: `${reverse ? "tickerR" : "ticker"} ${speed}s linear infinite`, animationPlayState: paused ? "paused" : "running" }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.6rem 1.4rem", background: "rgba(255,255,255,.04)", border: ".5px solid rgba(255,255,255,.1)", borderRadius: 100, whiteSpace: "nowrap", cursor: "default", transition: "border-color .2s, background .2s" }}
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

/* ── TESTIMONIAL TICKER ── */
export function TestimonialTicker({ items }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ display: "flex", gap: "1.5rem", width: "max-content", animation: "ticker 40s linear infinite", animationPlayState: paused ? "paused" : "running" }}>
        {doubled.map((t, i) => (
          <div key={i} style={{ width: 340, flexShrink: 0, background: "linear-gradient(135deg,rgba(0,255,136,.07),rgba(0,204,106,.02))", border: ".5px solid rgba(0,255,136,.18)", borderTop: ".5px solid rgba(0,255,136,.3)", borderRadius: 20, padding: "1.6rem", position: "relative", overflow: "hidden", transition: "transform .3s, border-color .3s", cursor: "default" }}
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

/* ── SECTION WRAPPER ── */
export function Section({ id, children, style = {} }) {
  const [ref, inView] = useInView(0.06);
  return (
    <section id={id} ref={ref} style={{ padding: "6rem 2rem", position: "relative", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(28px)", transition: "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)", ...style }}>
      {children}
    </section>
  );
}

export function SectionLabel({ children }) {
  return <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".75rem" }}>{children}</p>;
}

export function Heading({ children, size = "2.3rem" }) {
  return <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: size, fontWeight: 800, letterSpacing: "-.02em", color: "#fff", lineHeight: 1.15 }}>{children}</h2>;
}

export function GradText({ children }) {
  return <span style={{ background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{children}</span>;
}

/* ── NAV ── */
export function Nav() {
  const scrollY = useScrollY();
  const loc = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navH = scrollY > 40;

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: navH ? "rgba(4,6,8,.92)" : "rgba(4,6,8,.6)", backdropFilter: "blur(20px)", borderBottom: navH ? ".5px solid rgba(255,255,255,.08)" : ".5px solid rgba(255,255,255,.04)", transition: "all .3s" }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <div style={{ width: 30, height: 30, background: GG, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 14px rgba(0,255,136,.4)" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10L7 3L12 10" stroke="#040608" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M4.5 7.5L9.5 7.5" stroke="#040608" strokeWidth="2" strokeLinecap="round" /></svg>
        </div>
        <span style={{ fontWeight: 800, fontSize: 15, fontFamily: "'Syne',sans-serif", color: "#fff" }}>Bode Conversion Lab</span>
      </Link>
      <div style={{ display: "flex", gap: "1.8rem", alignItems: "center" }} className="nav-links">
        {NAV_LINKS.map(l => (
          <Link key={l.path} to={l.path} style={{ color: loc.pathname === l.path ? G : "rgba(255,255,255,.5)", textDecoration: "none", fontSize: 14, fontWeight: loc.pathname === l.path ? 600 : 400, transition: "color .2s" }}>{l.label}</Link>
        ))}
      </div>
      <Link to="/contact" style={{ background: GG, color: "#040608", border: "none", borderRadius: 10, padding: ".5rem 1.2rem", fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none", boxShadow: "0 4px 22px rgba(0,255,136,.35)" }}>
        Apply Now
      </Link>
    </nav>
  );
}

/* ── FOOTER ── */
export function Footer() {
  return (
    <footer style={{ padding: "3rem 2rem", borderTop: ".5px solid rgba(255,255,255,.06)", background: "rgba(0,0,0,.2)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
        <div>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: "1rem" }}>
            <div style={{ width: 24, height: 24, background: GG, borderRadius: 6 }} />
            <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: "#fff" }}>Bode Conversion Lab</span>
          </Link>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.35)", lineHeight: 1.7 }}>We don't run ads. We engineer ROAS.</p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "1rem" }}>Pages</p>
          {NAV_LINKS.map(l => <Link key={l.path} to={l.path} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,.4)", textDecoration: "none", marginBottom: ".5rem", transition: "color .2s" }} onMouseEnter={e => e.target.style.color = G} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.4)"}>{l.label}</Link>)}
        </div>
        <div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "1rem" }}>Services</p>
          {["Store Audit", "Ad Management", "CRO Optimization", "Landing Pages", "Email Flows"].map(s => <p key={s} style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginBottom: ".5rem" }}>{s}</p>)}
        </div>
        <div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "1rem" }}>Contact</p>
          <Link to="/contact" style={{ display: "inline-block", background: GG, color: "#040608", borderRadius: 8, padding: ".6rem 1.2rem", fontSize: 13, fontWeight: 700, textDecoration: "none", marginBottom: "1rem" }}>Apply Now →</Link>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.35)" }}>We respond within 24 hours.</p>
        </div>
      </div>
      <div style={{ borderTop: ".5px solid rgba(255,255,255,.06)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.2)" }}>© 2025 Bode Conversion Lab. All rights reserved.</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.2)" }}>Built to convert. Engineered to scale.</p>
      </div>
    </footer>
  );
}

/* ── PAGE WRAPPER ── */
export function PageWrapper({ children }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ paddingTop: "72px" }}>
      {children}
    </div>
  );
}