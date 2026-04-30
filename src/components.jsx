import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { G, GG, NAV_LINKS } from "./data.js";

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
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true);
    }, { threshold });
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

export function Particles() {
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

/* ── BRAND ICON with real colors ── */
function BrandIcon({ slug, color, size = 20 }) {
  const [failed, setFailed] = useState(false);
  if (failed || !slug) return <span style={{ width: size, height: size, borderRadius: "50%", background: `#${color || "ffffff"}22`, border: `1px solid #${color || "ffffff"}44`, flexShrink: 0, display: "inline-block" }} />;
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color || "ffffff"}`}
      alt={slug}
      width={size}
      height={size}
      style={{ flexShrink: 0, display: "block" }}
      onError={() => setFailed(true)}
    />
  );
}

/* ── TICKER with real brand colors ── */
export function ContinuousTicker({ items, speed = 35, reverse = false }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ display: "flex", gap: "1.5rem", width: "max-content", animation: `${reverse ? "tickerR" : "ticker"} ${speed}s linear infinite`, animationPlayState: paused ? "paused" : "running", padding: "0.3rem 0" }}>
        {doubled.map((item, i) => {
          const name = typeof item === "string" ? item : item.name;
          const slug = typeof item === "object" ? item.slug : null;
          const color = typeof item === "object" ? item.color : null;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.5rem 1.2rem", background: "rgba(255,255,255,.04)", border: ".5px solid rgba(255,255,255,.1)", borderRadius: 100, whiteSpace: "nowrap", cursor: "default", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.25)"; e.currentTarget.style.background = "rgba(255,255,255,.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.background = "rgba(255,255,255,.04)"; }}>
              <BrandIcon slug={slug} color={color} size={18} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.7)", fontWeight: 500 }}>{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TestimonialTicker({ items }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ display: "flex", gap: "1.5rem", width: "max-content", animation: "ticker 40s linear infinite", animationPlayState: paused ? "paused" : "running" }}>
        {doubled.map((t, i) => (
          <div key={i} style={{ width: 320, flexShrink: 0, background: "linear-gradient(135deg,rgba(0,255,136,.07),rgba(0,204,106,.02))", border: ".5px solid rgba(0,255,136,.18)", borderTop: ".5px solid rgba(0,255,136,.3)", borderRadius: 20, padding: "1.4rem", position: "relative", overflow: "hidden", cursor: "default" }}
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

/* ── VIDEO TIPS ── */
export function VideoTips({ items }) {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
  };
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => scroll(-1)} style={{ position: "absolute", left: -16, top: "40%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.4)", color: G, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
      <button onClick={() => scroll(1)} style={{ position: "absolute", right: -16, top: "40%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.4)", color: G, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
      <div ref={scrollRef} style={{ display: "flex", gap: "1.5rem", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "1rem", scrollbarWidth: "none" }}>
        {items.map((v, i) => (
          <div key={i} style={{ flexShrink: 0, width: 270, scrollSnapAlign: "start", background: "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))", border: ".5px solid rgba(255,255,255,.12)", borderTop: ".5px solid rgba(255,255,255,.2)", borderRadius: 20, overflow: "hidden" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(0,255,136,.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,.12)"; }}>
            <div style={{ width: "100%", aspectRatio: "9/16", position: "relative", background: "#000" }}>
              <iframe
                src={`https://www.youtube.com/embed/${v.videoId}?rel=0&modestbranding=1`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none", position: "absolute", inset: 0 }}
              />
              <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,.75)", border: ".5px solid rgba(0,255,136,.5)", borderRadius: 100, padding: "3px 10px", fontSize: 10, color: G, fontWeight: 600, zIndex: 2, pointerEvents: "none" }}>{v.tag}</div>
            </div>
            <div style={{ padding: "1rem" }}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#fff", marginBottom: ".4rem", lineHeight: 1.4 }}>{v.title}</h3>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)", lineHeight: 1.5 }}>{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Section({ id, children, style = {} }) {
  const [ref, inView] = useInView(0.06);
  return (
    <section id={id} ref={ref} style={{ padding: "clamp(3rem,6vw,6rem) clamp(1rem,4vw,2rem)", position: "relative", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(28px)", transition: "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)", ...style }}>
      {children}
    </section>
  );
}

export function SectionLabel({ children }) {
  return <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".75rem" }}>{children}</p>;
}

export function Heading({ children, size = "2.3rem" }) {
  return <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: `clamp(1.4rem, 4vw, ${size})`, fontWeight: 800, letterSpacing: "-.02em", color: "#fff", lineHeight: 1.15, wordBreak: "break-word", overflowWrap: "break-word" }}>{children}</h2>;
}

export function GradText({ children }) {
  return <span style={{ background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{children}</span>;
}

/* ── LOGO ── */
export function Logo({ size = 32, showText = true, textSize = 13 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
      <img src="/logo.jpeg" alt="Bode Conversion Lab" width={size} height={size} style={{ borderRadius: size * 0.2, objectFit: "cover", flexShrink: 0, display: "block" }} />
      {showText && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
          <span style={{ fontWeight: 800, fontSize: textSize, fontFamily: "'Syne',sans-serif", color: "#fff", whiteSpace: "nowrap", letterSpacing: "-.01em" }}>Bode Conversion</span>
          <span style={{ fontWeight: 600, fontSize: textSize * 0.82, fontFamily: "'Syne',sans-serif", color: G, whiteSpace: "nowrap", letterSpacing: ".08em", textTransform: "uppercase" }}>Lab</span>
        </div>
      )}
    </div>
  );
}

/* ── WHATSAPP ── */
export function WhatsAppButton() {
  return (
    <a href="https://wa.me/19454076473?text=Hi%20Bode%20Conversion%20Lab%2C%20I%27d%20like%20to%20know%20more" target="_blank" rel="noopener noreferrer"
      style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, width: 56, height: 56, borderRadius: "50%", background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,.5)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "transform .2s, box-shadow .2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(37,211,102,.7)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,.5)"; }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
    </a>
  );
}

/* ── PARTNER CARD with real colors ── */
export function PartnerCard({ partner }) {
  return (
    <div style={{ background: "rgba(255,255,255,.04)", border: ".5px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: 12, transition: "all .25s", cursor: "default" }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; e.currentTarget.style.borderColor = `#${partner.color}66`; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.transform = "none"; }}>
      <BrandIcon slug={partner.slug} color={partner.color} size={28} />
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{partner.name}</p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", margin: 0 }}>Certified partner</p>
      </div>
      <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: `#${partner.color}`, boxShadow: `0 0 8px #${partner.color}88`, animation: "pulse 2s ease-in-out infinite" }} />
    </div>
  );
}

/* ── NAV — fixed hamburger stays open ── */
export function Nav() {
  const scrollY = useScrollY();
  const loc = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navH = scrollY > 40;

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [loc.pathname]);

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0.65rem 1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: navH ? "rgba(4,6,8,.97)" : "rgba(4,6,8,.8)", backdropFilter: "blur(20px)", borderBottom: ".5px solid rgba(255,255,255,.07)", transition: "background .3s", gap: 8 }}>
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <Logo size={32} textSize={12} />
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "1.4rem", alignItems: "center", flex: 1, justifyContent: "center" }} className="nav-links">
          {NAV_LINKS.map(l => (
            <Link key={l.path} to={l.path} style={{ color: loc.pathname === l.path ? G : "rgba(255,255,255,.55)", textDecoration: "none", fontSize: 14, fontWeight: loc.pathname === l.path ? 600 : 400, transition: "color .2s", whiteSpace: "nowrap" }}
              onMouseEnter={e => e.target.style.color = G}
              onMouseLeave={e => e.target.style.color = loc.pathname === l.path ? G : "rgba(255,255,255,.55)"}>{l.label}</Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Link to="/contact" style={{ background: GG, color: "#040608", borderRadius: 8, padding: "0.5rem 1.1rem", fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>Apply Now</Link>
          {/* Hamburger */}
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(prev => !prev); }}
            className="hamburger"
            style={{ background: "rgba(255,255,255,.1)", border: ".5px solid rgba(255,255,255,.2)", cursor: "pointer", padding: "8px 10px", flexDirection: "column", gap: 5, borderRadius: 6, flexShrink: 0, display: "none" }}
            aria-label="Toggle menu"
          >
            <span style={{ display: "block", width: 20, height: 2, background: menuOpen ? G : "#fff", borderRadius: 2, transition: "all .3s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ display: "block", width: 20, height: 2, background: menuOpen ? G : "#fff", borderRadius: 2, transition: "opacity .3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 20, height: 2, background: menuOpen ? G : "#fff", borderRadius: 2, transition: "all .3s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu — always rendered, height animated */}
      <div
        style={{
          position: "fixed", top: 56, left: 0, right: 0, zIndex: 98,
          background: "rgba(4,6,8,.99)", backdropFilter: "blur(24px)",
          borderBottom: menuOpen ? ".5px solid rgba(255,255,255,.1)" : "none",
          maxHeight: menuOpen ? "500px" : "0",
          overflow: "hidden",
          transition: "max-height .4s cubic-bezier(.16,1,.3,1)",
          display: "block",
        }}
        className="mobile-menu"
      >
        <div style={{ padding: "0.5rem 1.4rem 1.4rem" }}>
          {NAV_LINKS.map(l => (
            <Link key={l.path} to={l.path} onClick={() => setMenuOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: 10, color: loc.pathname === l.path ? G : "rgba(255,255,255,.8)", textDecoration: "none", fontSize: 16, fontWeight: loc.pathname === l.path ? 700 : 400, padding: "0.85rem 0", borderBottom: ".5px solid rgba(255,255,255,.06)" }}>
              {loc.pathname === l.path && <span style={{ width: 6, height: 6, borderRadius: "50%", background: G, flexShrink: 0 }} />}
              {l.label}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setMenuOpen(false)}
            style={{ display: "block", background: GG, color: "#040608", borderRadius: 10, padding: ".85rem", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: "1rem" }}>
            Apply Now →
          </Link>
        </div>
      </div>
    </>
  );
}

/* ── FOOTER ── */
export function Footer() {
  return (
    <footer style={{ padding: "3rem 1.5rem 2rem", borderTop: ".5px solid rgba(255,255,255,.06)", background: "rgba(0,0,0,.3)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: "2.5rem", paddingBottom: "2rem", borderBottom: ".5px solid rgba(255,255,255,.07)" }}>
          <Link to="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: "1rem" }}>
            <Logo size={44} textSize={15} />
          </Link>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", lineHeight: 1.7, maxWidth: 340, marginTop: 10 }}>
            We don't run ads. We engineer ROAS.<br />One system. Compounding results every month.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "2rem", marginBottom: "2.5rem" }}>
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "1.2rem", fontWeight: 600 }}>Pages</p>
            {NAV_LINKS.map(l => (
              <Link key={l.path} to={l.path} style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,.45)", textDecoration: "none", marginBottom: ".7rem", transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = G}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.45)"}>{l.label}</Link>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "1.2rem", fontWeight: 600 }}>Services</p>
            {["Store Audit", "Ad Management", "CRO Optimization", "Landing Pages", "Email Flows"].map(s => (
              <p key={s} style={{ fontSize: 14, color: "rgba(255,255,255,.4)", marginBottom: ".7rem" }}>{s}</p>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "1.2rem", fontWeight: 600 }}>Contact</p>
            <Link to="/contact" style={{ display: "inline-block", background: GG, color: "#040608", borderRadius: 8, padding: ".7rem 1.4rem", fontSize: 14, fontWeight: 700, textDecoration: "none", marginBottom: "1rem" }}>Apply Now →</Link>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.35)", marginTop: 8 }}>Response within 24 hours.</p>
            <a href="https://wa.me/19454076473" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#25D366", textDecoration: "none", marginTop: 12 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              WhatsApp us
            </a>
          </div>
        </div>
        <div style={{ borderTop: ".5px solid rgba(255,255,255,.06)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.2)" }}>© 2025 Bode Conversion Lab. All rights reserved.</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.2)" }}>Built to convert. Engineered to scale.</p>
        </div>
      </div>
    </footer>
  );
}

export function PageWrapper({ children }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return <div style={{ paddingTop: "56px" }}>{children}</div>;
}