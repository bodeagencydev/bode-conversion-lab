import { useState, useEffect, useRef, createContext, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { G, GG, NAV_LINKS } from "./data.js";

/* ── THEME CONTEXT ── */
export const ThemeContext = createContext({ dark: true, toggle: () => {} });
export function useTheme() { return useContext(ThemeContext); }

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

/* ── STAR RATING ── */
function StarRating({ rating }) {
  const { dark } = useTheme();
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map(star => {
        const full = rating >= star;
        const half = !full && rating >= star - 0.5;
        return (
          <svg key={star} width="14" height="14" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`half-${star}`}>
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="50%" stopColor={dark ? "#444" : "#ccc"} />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={full ? "#FFD700" : half ? `url(#half-${star})` : (dark ? "#444" : "#ccc")}
            />
          </svg>
        );
      })}
      <span style={{ fontSize: 11, color: dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)", marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </div>
  );
}

/* ── BRAND ICON using Google favicon ── */
function BrandIcon({ name, slug, color, size = 20 }) {
  const { dark } = useTheme();
  const [failed, setFailed] = useState(false);
  const domainMap = {
    shopify: "shopify.com", woocommerce: "woocommerce.com", magento: "magento.com",
    bigcommerce: "bigcommerce.com", wix: "wix.com", squarespace: "squarespace.com",
    prestashop: "prestashop.com", opencart: "opencart.com", ecwid: "ecwid.com",
    meta: "meta.com", tiktok: "tiktok.com", google: "google.com",
    pinterest: "pinterest.com", snapchat: "snapchat.com", youtube: "youtube.com",
    x: "x.com", linkedin: "linkedin.com", amazon: "amazon.com",
    klaviyo: "klaviyo.com", triplewhale: "triplewhale.com",
  };
  const domain = domainMap[slug?.toLowerCase()];
  if (failed || !domain) {
    return (
      <div style={{ width: size, height: size, borderRadius: size * 0.25, background: color ? `${color}33` : (dark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.1)"), border: `1px solid ${color || (dark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.15)")}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.5, fontWeight: 700, color: color || (dark ? "#fff" : "#000") }}>{name?.[0] || "?"}</span>
      </div>
    );
  }
  return (
    <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt={name}
      width={size} height={size}
      style={{ borderRadius: size * 0.2, flexShrink: 0, display: "block", objectFit: "contain" }}
      onError={() => setFailed(true)} />
  );
}

/* ── VIDEO PLAYER ── */
function VideoCard({ v }) {
  const { dark } = useTheme();
  const [playing, setPlaying] = useState(false);
  return (
    <div style={{
      flexShrink: 0, width: 250, scrollSnapAlign: "start",
      background: dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(0,0,0,.04),rgba(0,0,0,.01))",
      border: dark ? ".5px solid rgba(255,255,255,.12)" : ".5px solid rgba(0,0,0,.1)",
      borderTop: dark ? ".5px solid rgba(255,255,255,.2)" : ".5px solid rgba(0,0,0,.15)",
      borderRadius: 20, overflow: "hidden", transition: "transform .3s, border-color .3s"
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(0,255,136,.4)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"; }}>
      <div style={{ width: "100%", aspectRatio: "9/16", position: "relative", overflow: "hidden", background: "#000" }}>
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${v.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={v.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: "none", position: "absolute", inset: 0 }}
          />
        ) : (
          <>
            <img src={v.thumb} alt={v.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              onClick={() => setPlaying(true)}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,0,0,.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 24px rgba(255,0,0,.5)", transition: "transform .2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <svg width="22" height="22" viewBox="0 0 20 20" fill="white"><path d="M6 4L16 10L6 16Z" /></svg>
              </div>
            </div>
            <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,.75)", border: ".5px solid rgba(0,255,136,.5)", borderRadius: 100, padding: "3px 10px", fontSize: 10, color: G, fontWeight: 600, pointerEvents: "none" }}>{v.tag}</div>
          </>
        )}
      </div>
      <div style={{ padding: "1rem" }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.9rem", fontWeight: 700, color: dark ? "#fff" : "#0a0a0a", marginBottom: ".4rem", lineHeight: 1.4 }}>{v.title}</h3>
        <p style={{ fontSize: 12, color: dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.45)", lineHeight: 1.5 }}>{v.desc}</p>
      </div>
    </div>
  );
}

export function VideoTips({ items }) {
  const { dark } = useTheme();
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => scroll(-1)} style={{ position: "absolute", left: -16, top: "40%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.4)", color: G, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
      <button onClick={() => scroll(1)} style={{ position: "absolute", right: -16, top: "40%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.4)", color: G, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
      <div ref={scrollRef} style={{ display: "flex", gap: "1.5rem", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "1rem", scrollbarWidth: "none" }}>
        {items.map((v, i) => <VideoCard key={i} v={v} />)}
      </div>
    </div>
  );
}

/* ── TICKER ── */
export function ContinuousTicker({ items, speed = 35, reverse = false }) {
  const { dark } = useTheme();
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
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "0.5rem 1.2rem",
              background: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)",
              border: dark ? ".5px solid rgba(255,255,255,.1)" : ".5px solid rgba(0,0,0,.1)",
              borderRadius: 100, whiteSpace: "nowrap", cursor: "default", transition: "all .2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.2)"; e.currentTarget.style.background = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"; e.currentTarget.style.background = dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)"; }}>
              <BrandIcon name={name} slug={slug} color={color} size={18} />
              <span style={{ fontSize: 13, color: dark ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.65)", fontWeight: 500 }}>{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── TESTIMONIAL TICKER ── */
export function TestimonialTicker({ items }) {
  const { dark } = useTheme();
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ display: "flex", gap: "1.5rem", width: "max-content", animation: "ticker 40s linear infinite", animationPlayState: paused ? "paused" : "running" }}>
        {doubled.map((t, i) => (
          <a key={i} href={t.storeUrl || "#"} target={t.storeUrl ? "_blank" : "_self"} rel="noopener noreferrer"
            style={{
              width: 320, flexShrink: 0,
              background: dark ? "linear-gradient(135deg,rgba(0,255,136,.07),rgba(0,204,106,.02))" : "linear-gradient(135deg,rgba(0,200,100,.06),rgba(0,180,80,.02))",
              border: dark ? ".5px solid rgba(0,255,136,.18)" : ".5px solid rgba(0,180,80,.2)",
              borderTop: dark ? ".5px solid rgba(0,255,136,.3)" : ".5px solid rgba(0,200,100,.3)",
              borderRadius: 20, padding: "1.4rem", position: "relative", overflow: "hidden",
              cursor: t.storeUrl ? "pointer" : "default", textDecoration: "none", display: "block", transition: "transform .3s, border-color .3s"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(0,255,136,.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = dark ? "rgba(0,255,136,.18)" : "rgba(0,180,80,.2)"; }}>
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,255,136,.45),transparent)" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {t.storeLogo && (
                  <img src={t.storeLogo} alt={t.storeName} width="22" height="22"
                    style={{ borderRadius: 4, objectFit: "contain", background: "#fff", padding: "2px", flexShrink: 0 }}
                    onError={e => e.target.style.display = "none"} />
                )}
                <span style={{ fontSize: 11, color: dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.45)", fontWeight: 500 }}>{t.storeName}</span>
              </div>
              <div style={{ background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 100, padding: "2px 8px", fontSize: 10, color: G, fontWeight: 600, whiteSpace: "nowrap" }}>{t.result}</div>
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <StarRating rating={t.rating || 5} />
            </div>
            <p style={{ fontSize: 13, color: dark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)", lineHeight: 1.7, marginBottom: "1rem", fontStyle: "italic" }}>"{t.text}"</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} width="34" height="34"
                    style={{ borderRadius: "50%", objectFit: "cover", border: ".5px solid rgba(0,255,136,.3)", flexShrink: 0 }}
                    onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                ) : null}
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.3)", display: t.avatar ? "none" : "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: G, flexShrink: 0 }}>{t.init}</div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: dark ? "#fff" : "#0a0a0a", margin: 0 }}>{t.name}</p>
                  <p style={{ fontSize: 10, color: dark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.4)", margin: 0 }}>{t.storeCategory || t.role}</p>
                </div>
              </div>
              {t.storeUrl && <span style={{ fontSize: 10, color: G, fontWeight: 500 }}>Visit →</span>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function PartnerCard({ partner }) {
  const { dark } = useTheme();
  return (
    <div style={{
      background: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)",
      border: dark ? ".5px solid rgba(255,255,255,.1)" : ".5px solid rgba(0,0,0,.08)",
      borderRadius: 14, padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: 12, transition: "all .25s", cursor: "default"
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,136,.07)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(0,255,136,.35)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.08)"; }}>
      <BrandIcon name={partner.name} slug={partner.slug} color={partner.color} size={28} />
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "#0a0a0a", margin: 0 }}>{partner.name}</p>
        <p style={{ fontSize: 11, color: dark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.4)", margin: 0 }}>Certified partner</p>
      </div>
      <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: partner.color || G, animation: "pulse 2s ease-in-out infinite", flexShrink: 0 }} />
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
  const { dark } = useTheme();
  return <p style={{ fontSize: 11, color: dark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.4)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".75rem" }}>{children}</p>;
}

export function Heading({ children, size = "2.3rem" }) {
  const { dark } = useTheme();
  return <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: `clamp(1.4rem, 4vw, ${size})`, fontWeight: 800, letterSpacing: "-.02em", color: dark ? "#fff" : "#0a0a0a", lineHeight: 1.15, wordBreak: "break-word", overflowWrap: "break-word" }}>{children}</h2>;
}

export function GradText({ children }) {
  return <span style={{ background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{children}</span>;
}

export function Logo({ size = 32, showText = true, textSize = 13 }) {
  const { dark } = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
      <img src="/logo.jpeg" alt="Bode Conversion Lab" width={size} height={size}
        style={{ borderRadius: size * 0.2, objectFit: "cover", flexShrink: 0, display: "block" }} />
      {showText && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
          <span style={{ fontWeight: 800, fontSize: textSize, fontFamily: "'Syne',sans-serif", color: dark ? "#fff" : "#0a0a0a", whiteSpace: "nowrap" }}>Bode Conversion</span>
          <span style={{ fontWeight: 600, fontSize: textSize * 0.82, fontFamily: "'Syne',sans-serif", color: G, whiteSpace: "nowrap", letterSpacing: ".08em", textTransform: "uppercase" }}>Lab</span>
        </div>
      )}
    </div>
  );
}

export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle}
      style={{ position: "fixed", bottom: 24, left: 24, zIndex: 9999, width: 56, height: 56, borderRadius: "50%", background: dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)", border: dark ? ".5px solid rgba(255,255,255,.2)" : ".5px solid rgba(0,0,0,.15)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .3s", fontSize: 22 }}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.background = dark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.2)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"; }}>
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

export function WhatsAppButton() {
  return (
    <a href="https://wa.me/19454076473?text=Hi%20Bode%20Conversion%20Lab%2C%20I%27d%20like%20to%20know%20more"
      target="_blank" rel="noopener noreferrer"
      style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, width: 56, height: 56, borderRadius: "50%", background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,.5)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "transform .2s" }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
    </a>
  );
}

export function Nav() {
  const scrollY = useScrollY();
  const loc = useLocation();
  const { dark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navH = scrollY > 40;
  useEffect(() => { setMenuOpen(false); }, [loc.pathname]);

  const bg = dark
    ? (navH ? "rgba(4,6,8,.97)" : "rgba(4,6,8,.8)")
    : (navH ? "rgba(248,248,245,.97)" : "rgba(248,248,245,.85)");

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0.65rem 1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: bg, backdropFilter: "blur(20px)", borderBottom: `.5px solid ${dark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)"}`, transition: "background .3s", gap: 8 }}>
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <Logo size={32} textSize={12} />
        </Link>
        <div style={{ display: "flex", gap: "1.4rem", alignItems: "center", flex: 1, justifyContent: "center" }} className="nav-links">
          {NAV_LINKS.map(l => (
            <Link key={l.path} to={l.path} style={{ color: loc.pathname === l.path ? G : (dark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)"), textDecoration: "none", fontSize: 14, fontWeight: loc.pathname === l.path ? 600 : 400, transition: "color .2s", whiteSpace: "nowrap" }}
              onMouseEnter={e => e.target.style.color = G}
              onMouseLeave={e => e.target.style.color = loc.pathname === l.path ? G : (dark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)")}>{l.label}</Link>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Link to="/contact" style={{ background: GG, color: "#040608", borderRadius: 8, padding: "0.5rem 1.1rem", fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>Apply Now</Link>
          <button onClick={() => setMenuOpen(v => !v)} className="hamburger"
            style={{ background: dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.08)", border: `.5px solid ${dark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.15)"}`, cursor: "pointer", padding: "8px 10px", flexDirection: "column", gap: 5, borderRadius: 6, flexShrink: 0, display: "none" }}>
            <span style={{ display: "block", width: 20, height: 2, background: dark ? "#fff" : "#0a0a0a", borderRadius: 2, transition: "all .3s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ display: "block", width: 20, height: 2, background: dark ? "#fff" : "#0a0a0a", borderRadius: 2, transition: "opacity .3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 20, height: 2, background: dark ? "#fff" : "#0a0a0a", borderRadius: 2, transition: "all .3s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div style={{ position: "fixed", top: 56, left: 0, right: 0, zIndex: 98, background: dark ? "rgba(4,6,8,.99)" : "rgba(248,248,245,.99)", backdropFilter: "blur(24px)", borderBottom: `.5px solid ${dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`, padding: "0.5rem 1.4rem 1.4rem" }}>
          {NAV_LINKS.map(l => (
            <Link key={l.path} to={l.path} onClick={() => setMenuOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: 10, color: loc.pathname === l.path ? G : (dark ? "rgba(255,255,255,.8)" : "rgba(0,0,0,.7)"), textDecoration: "none", fontSize: 16, fontWeight: loc.pathname === l.path ? 700 : 400, padding: "0.85rem 0", borderBottom: `.5px solid ${dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"}` }}>
              {loc.pathname === l.path && <span style={{ width: 6, height: 6, borderRadius: "50%", background: G, flexShrink: 0 }} />}
              {l.label}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setMenuOpen(false)}
            style={{ display: "block", background: GG, color: "#040608", borderRadius: 10, padding: ".85rem", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: "1rem" }}>
            Apply Now →
          </Link>
        </div>
      )}
    </>
  );
}

export function Footer() {
  const { dark } = useTheme();
  const tc = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const tc2 = dark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.35)";
  return (
    <footer style={{ padding: "3rem 1.5rem 2rem", borderTop: `.5px solid ${dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)"}`, background: dark ? "rgba(0,0,0,.3)" : "rgba(0,0,0,.04)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: "2.5rem", paddingBottom: "2rem", borderBottom: `.5px solid ${dark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.07)"}` }}>
          <Link to="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: "1rem" }}>
            <Logo size={44} textSize={15} />
          </Link>
          <p style={{ fontSize: 14, color: tc, lineHeight: 1.7, maxWidth: 340, marginTop: 10 }}>
            We don't run ads. We engineer ROAS.<br />One system. Compounding results every month.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "2rem", marginBottom: "2.5rem" }}>
          <div>
            <p style={{ fontSize: 11, color: tc2, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "1.2rem", fontWeight: 600 }}>Pages</p>
            {NAV_LINKS.map(l => (
              <Link key={l.path} to={l.path} style={{ display: "block", fontSize: 14, color: tc, textDecoration: "none", marginBottom: ".7rem", transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = G}
                onMouseLeave={e => e.target.style.color = tc}>{l.label}</Link>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 11, color: tc2, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "1.2rem", fontWeight: 600 }}>Services</p>
            {["Store Audit", "Ad Management", "CRO Optimization", "Landing Pages", "Email Flows"].map(s => (
              <Link key={s} to="/about" style={{ display: "block", fontSize: 14, color: tc, textDecoration: "none", marginBottom: ".7rem", transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = G}
                onMouseLeave={e => e.target.style.color = tc}>{s}</Link>
            ))}
            <p style={{ fontSize: 11, color: tc2, letterSpacing: ".1em", textTransform: "uppercase", margin: "1.2rem 0", fontWeight: 600 }}>Free Tools</p>
            <Link to="/audit" style={{ display: "block", fontSize: 14, color: tc, textDecoration: "none", marginBottom: ".7rem", transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color = G}
              onMouseLeave={e => e.target.style.color = tc}>Free Store Audit</Link>
            <Link to="/subscribe" style={{ display: "block", fontSize: 14, color: tc, textDecoration: "none", marginBottom: ".7rem", transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color = G}
              onMouseLeave={e => e.target.style.color = tc}>Newsletter</Link>
          </div>
          <div>
            <p style={{ fontSize: 11, color: tc2, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "1.2rem", fontWeight: 600 }}>Contact</p>
            <Link to="/contact" style={{ display: "inline-block", background: GG, color: "#040608", borderRadius: 8, padding: ".7rem 1.4rem", fontSize: 14, fontWeight: 700, textDecoration: "none", marginBottom: "1rem" }}>Apply Now →</Link>
            <p style={{ fontSize: 13, color: tc, marginTop: 8 }}>Response within 24 hours.</p>
            <a href="https://wa.me/19454076473" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#25D366", textDecoration: "none", marginTop: 12 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              WhatsApp us
            </a>
          </div>
        </div>
        <div style={{ borderTop: `.5px solid ${dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"}`, paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <p style={{ fontSize: 12, color: tc2 }}>© 2025 Bode Conversion Lab. All rights reserved.</p>
          <p style={{ fontSize: 12, color: tc2 }}>Built to convert. Engineered to scale.</p>
        </div>
      </div>
    </footer>
  );
}

export function PageWrapper({ children }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return <div style={{ paddingTop: "56px" }}>{children}</div>;
}