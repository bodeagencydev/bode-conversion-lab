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

/* ── BRAND ICONS as proper React SVG components ── */
const ICONS = {
  shopify: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M15.337.276a.335.335 0 00-.33-.276c-.148 0-2.905.205-2.905.205S10.165.21 9.964.01V24l7.976-1.723S15.337.426 15.337.276z" fill="#96BF48"/><path d="M10.29 7.876l-.92 3.444s-1.02-.464-2.24-.387c-1.783.112-1.802 1.233-1.783 1.514.097 1.533 4.13 1.868 4.356 5.455.175 2.822-1.494 4.757-3.9 4.906-2.888.18-4.354-1.523-4.354-1.523l.595-2.527s1.51 1.14 2.716 1.064c.787-.05 1.07-.69 1.04-1.15-.126-2.002-3.413-1.884-3.62-5.173C1.993 10.07 3.87 7.26 7.823 7.01c1.554-.098 2.467.297 2.467.297z" fill="#96BF48"/></svg>,

  woocommerce: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#96588A"><path d="M2.047 0C.919 0 0 .92 0 2.047v13.838c0 1.128.92 2.047 2.047 2.047h6.91l-.636 3.683 4.591-3.683h9.041c1.128 0 2.047-.92 2.047-2.047V2.047C24 .919 23.08 0 21.953 0zm2.442 5.299h.843l1.028 4.584 1.139-4.584h.826l1.108 4.584 1.042-4.584h.82L8.97 11.16H8.18l-1.07-4.266-1.085 4.266h-.787zm7.73 0h3.04v.736h-2.27v1.642h2.055v.733H13.0v1.714h2.307v.736H12.22zm4.207 0h.77V8.41l2.254-3.111h.863l-2.778 3.836V11.16h-.77V8.135l-2.778-3.836h.87z"/></svg>,

  magento: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#EE672F"><path d="M12 0L1.608 6v12L12 24l10.392-6V6zm-.034 4.63l4.053 2.349v4.66l-1.36.786V7.762l-2.693-1.556-2.693 1.556v8.667l-1.36-.786V6.979zm-2.708 9.547V9.518l2.708-1.567 2.709 1.567v4.66l-1.348.778V10.29l-1.36-.786-1.362.786v4.663z"/></svg>,

  bigcommerce: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#a78bfa"><rect x="2" y="6" width="4" height="12" rx="1"/><rect x="8" y="10" width="4" height="8" rx="1"/><rect x="14" y="4" width="4" height="14" rx="1"/><rect x="20" y="8" width="4" height="10" rx="1"/></svg>,

  wix: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#FAAD4D"><path d="M3.516 7.5L0 16.5h3l1.5-4.5 1.5 4.5h3L5.484 7.5zm7.5 0v9h2.7V7.5zm4.5 0l2.25 4.5L20.016 7.5H23.5l-4.5 9h-2.5l-2.25-4.5L12 16.5H9.5l4.5-9z"/></svg>,

  squarespace: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff"><path d="M12 1L3 6.5v11L12 23l9-5.5v-11zm0 3.5l5.5 3.25v6.5L12 17.5 6.5 14.25v-6.5z"/></svg>,

  prestashop: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#DF0067"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.388 17.338c-2.994.648-5.88-1.25-6.44-4.248-.56-2.998 1.436-5.832 4.43-6.48 2.994-.648 5.88 1.25 6.44 4.248.56 2.998-1.436 5.832-4.43 6.48z"/></svg>,

  opencart: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#23AADF"><path d="M22.325 4.765a1.4 1.4 0 00-1.054-.48H3.35C2.605 4.285 2 4.89 2 5.635v.018c0 .372.148.727.412.99l4.65 4.65H5.28a1.4 1.4 0 000 2.8H7.2l4.25 4.25a1.4 1.4 0 001.98 0l4.24-4.24h1.925a1.4 1.4 0 000-2.8H17.72l4.24-4.24a1.4 1.4 0 00.365-1.298z"/></svg>,

  ecwid: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF6A00"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6" fill="#040608"/><circle cx="12" cy="12" r="2.5" fill="#FF6A00"/></svg>,

  meta: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#0081FB"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,

  tiktok: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>,

  google: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,

  pinterest: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#BD081C"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>,

  snapchat: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFFC00"><path d="M12.065.001C9.078.001 5.97 1.67 4.315 4.317c-.882 1.457-1.155 3.088-1.063 4.735C3.11 9.7 3.017 10.36 2.726 11c-.38.835-1.048 1.1-1.48 1.376-.432.277-.775.525-.73.995.045.47.485.838 1.09 1.018.607.18.907.252 1.12.69.284.574.142 1.45.59 1.866.33.306.793.177 1.284.126.49-.05 1.022.016 1.544.443.44.356.816 1.05 1.308 1.69.49.637 1.126 1.284 2.11 1.668C9.546 20.88 10.64 21 12 21c1.36 0 2.455-.12 3.44-.128.984-.385 1.62-1.032 2.11-1.668.49-.64.868-1.334 1.308-1.69.522-.427 1.054-.493 1.544-.443.49.05.954.18 1.284-.126.448-.416.306-1.292.59-1.866.213-.438.513-.51 1.12-.69.605-.18 1.045-.548 1.09-1.018.045-.47-.298-.718-.73-.995-.432-.276-1.1-.54-1.48-1.376-.29-.64-.384-1.3-.526-1.948.092-1.647-.18-3.278-1.063-4.735C18.03 1.67 14.922.001 11.935.001z"/></svg>,

  youtube: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF0000"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>,

  x: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,

  linkedin: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,

  amazon: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF9900"><path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.674-1.94 1.207-4.13 1.812-6.57 1.812-2.39 0-4.81-.548-7.25-1.642L4.09 19.93l-.045-.02c-.55-.314-1.07-.644-1.56-.99-.31-.21-.41-.5-.44-.9z"/><path d="M21.54 15.842c-.18-.23-.476-.255-.89-.073l-.03.015c-.8.44-1.663.617-2.592.533-1.185-.108-2.216-.61-3.09-1.505-.616-.637-1.047-1.36-1.295-2.17-.248-.808-.293-1.612-.134-2.41.157-.8.488-1.52.99-2.16.503-.64 1.12-1.142 1.85-1.505.73-.362 1.51-.543 2.342-.543 1.278 0 2.398.412 3.357 1.236.96.825 1.503 1.914 1.63 3.265.09.96-.04 1.92-.39 2.88l-.05.133c-.1.253-.03.43.21.54.24.11.43.02.57-.27.14-.29.25-.59.33-.9.51-1.91.19-3.63-.96-5.16-1.15-1.53-2.73-2.39-4.74-2.59-2.36-.23-4.41.54-6.15 2.31-1.31 1.34-1.97 2.92-1.97 4.74 0 1.57.52 2.98 1.56 4.23s2.35 2.04 3.93 2.38c1.06.23 2.11.19 3.15-.12 1.04-.31 1.96-.84 2.77-1.59.37-.33.4-.67.1-1.02z"/></svg>,

  klaviyo: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFD700"><rect x="2" y="2" width="20" height="20" rx="3"/><rect x="5" y="11" width="3" height="6" fill="#040608"/><rect x="9.5" y="7" width="3" height="10" fill="#040608"/><rect x="14" y="9" width="3" height="8" fill="#040608"/><path d="M18 5L21 8M21 8H18M21 8V5" stroke="#040608" strokeWidth="1.5" strokeLinecap="round"/></svg>,

  triplewhale: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#7B68EE"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3 13.5v-7l3 3.5 3-3.5v7l-3-3.5-3 3.5z"/></svg>,
};

function BrandIcon({ slug, size = 20 }) {
  const IconComp = ICONS[slug?.toLowerCase()];
  if (!IconComp) return <div style={{ width: size, height: size, borderRadius: 4, background: "rgba(255,255,255,.1)", flexShrink: 0 }} />;
  return <div style={{ width: size, height: size, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><IconComp size={size} /></div>;
}

/* ── TICKER with proper React SVG icons ── */
export function ContinuousTicker({ items, speed = 35, reverse = false }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ display: "flex", gap: "1.5rem", width: "max-content", animation: `${reverse ? "tickerR" : "ticker"} ${speed}s linear infinite`, animationPlayState: paused ? "paused" : "running", padding: "0.3rem 0" }}>
        {doubled.map((item, i) => {
          const name = typeof item === "string" ? item : item.name;
          const slug = typeof item === "object" ? item.slug : null;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.5rem 1.2rem", background: "rgba(255,255,255,.04)", border: ".5px solid rgba(255,255,255,.1)", borderRadius: 100, whiteSpace: "nowrap", cursor: "default", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.25)"; e.currentTarget.style.background = "rgba(255,255,255,.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.background = "rgba(255,255,255,.04)"; }}>
              <BrandIcon slug={slug} size={18} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.7)", fontWeight: 500 }}>{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── TESTIMONIAL TICKER — clickable cards with store logos ── */
export function TestimonialTicker({ items }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ display: "flex", gap: "1.5rem", width: "max-content", animation: "ticker 40s linear infinite", animationPlayState: paused ? "paused" : "running" }}>
        {doubled.map((t, i) => (
          <a key={i}
            href={t.storeUrl || "#"}
            target={t.storeUrl ? "_blank" : "_self"}
            rel="noopener noreferrer"
            style={{ width: 320, flexShrink: 0, background: "linear-gradient(135deg,rgba(0,255,136,.07),rgba(0,204,106,.02))", border: ".5px solid rgba(0,255,136,.18)", borderTop: ".5px solid rgba(0,255,136,.3)", borderRadius: 20, padding: "1.4rem", position: "relative", overflow: "hidden", cursor: t.storeUrl ? "pointer" : "default", textDecoration: "none", display: "block", transition: "transform .3s, border-color .3s, box-shadow .3s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(0,255,136,.45)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,255,136,.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(0,255,136,.18)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,255,136,.45),transparent)" }} />
            {/* Store info row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {t.storeLogo ? (
                  <img src={t.storeLogo} alt={t.storeName} width="28" height="28"
                    style={{ borderRadius: 6, objectFit: "contain", background: "#fff", padding: "2px", flexShrink: 0 }}
                    onError={e => { e.target.style.display = "none"; }} />
                ) : (
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: G, flexShrink: 0 }}>{t.init}</div>
                )}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.7)", margin: 0 }}>{t.storeName || t.name}</p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,.35)", margin: 0 }}>{t.storeCategory || t.role}</p>
                </div>
              </div>
              <div style={{ background: "rgba(0,255,136,.1)", border: ".5px solid rgba(0,255,136,.25)", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: G, fontWeight: 600, whiteSpace: "nowrap" }}>{t.result}</div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.7, marginBottom: "1rem", fontStyle: "italic" }}>"{t.text}"</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: G, flexShrink: 0 }}>{t.init}</div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", margin: 0 }}>{t.name}</p>
              </div>
              {t.storeUrl && (
                <span style={{ fontSize: 11, color: G, fontWeight: 500 }}>Visit store →</span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function VideoTips({ items }) {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => scroll(-1)} style={{ position: "absolute", left: -16, top: "40%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.4)", color: G, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
      <button onClick={() => scroll(1)} style={{ position: "absolute", right: -16, top: "40%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,255,136,.15)", border: ".5px solid rgba(0,255,136,.4)", color: G, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
      <div ref={scrollRef} style={{ display: "flex", gap: "1.5rem", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "1rem", scrollbarWidth: "none" }}>
        {items.map((v, i) => (
          <a key={i} href={`https://youtube.com/shorts/${v.videoId}`} target="_blank" rel="noopener noreferrer"
            style={{ flexShrink: 0, width: 250, scrollSnapAlign: "start", background: "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))", border: ".5px solid rgba(255,255,255,.12)", borderTop: ".5px solid rgba(255,255,255,.2)", borderRadius: 20, overflow: "hidden", textDecoration: "none", display: "block", transition: "transform .3s, border-color .3s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(0,255,136,.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,.12)"; }}>
            <div style={{ width: "100%", aspectRatio: "9/16", position: "relative", overflow: "hidden", background: "#000" }}>
              <img src={v.thumb} alt={v.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,0,0,.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="white"><path d="M6 4L16 10L6 16Z" /></svg>
                </div>
              </div>
              <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,.75)", border: ".5px solid rgba(0,255,136,.5)", borderRadius: 100, padding: "3px 10px", fontSize: 10, color: G, fontWeight: 600 }}>{v.tag}</div>
            </div>
            <div style={{ padding: "1rem" }}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#fff", marginBottom: ".4rem", lineHeight: 1.4 }}>{v.title}</h3>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)", lineHeight: 1.5 }}>{v.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function PartnerCard({ partner }) {
  return (
    <div style={{ background: "rgba(255,255,255,.04)", border: ".5px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: 12, transition: "all .25s", cursor: "default" }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.transform = "none"; }}>
      <BrandIcon slug={partner.slug} size={28} />
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{partner.name}</p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", margin: 0 }}>Certified partner</p>
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
  return <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".75rem" }}>{children}</p>;
}

export function Heading({ children, size = "2.3rem" }) {
  return <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: `clamp(1.4rem, 4vw, ${size})`, fontWeight: 800, letterSpacing: "-.02em", color: "#fff", lineHeight: 1.15, wordBreak: "break-word", overflowWrap: "break-word" }}>{children}</h2>;
}

export function GradText({ children }) {
  return <span style={{ background: GG, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{children}</span>;
}

export function Logo({ size = 32, showText = true, textSize = 13 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
      <img src="/logo.jpeg" alt="Bode Conversion Lab" width={size} height={size}
        style={{ borderRadius: size * 0.2, objectFit: "cover", flexShrink: 0, display: "block" }} />
      {showText && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
          <span style={{ fontWeight: 800, fontSize: textSize, fontFamily: "'Syne',sans-serif", color: "#fff", whiteSpace: "nowrap" }}>Bode Conversion</span>
          <span style={{ fontWeight: 600, fontSize: textSize * 0.82, fontFamily: "'Syne',sans-serif", color: G, whiteSpace: "nowrap", letterSpacing: ".08em", textTransform: "uppercase" }}>Lab</span>
        </div>
      )}
    </div>
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
  const [menuOpen, setMenuOpen] = useState(false);
  const navH = scrollY > 40;
  useEffect(() => { setMenuOpen(false); }, [loc.pathname]);

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0.65rem 1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: navH ? "rgba(4,6,8,.97)" : "rgba(4,6,8,.8)", backdropFilter: "blur(20px)", borderBottom: ".5px solid rgba(255,255,255,.07)", transition: "background .3s", gap: 8 }}>
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <Logo size={32} textSize={12} />
        </Link>
        <div style={{ display: "flex", gap: "1.4rem", alignItems: "center", flex: 1, justifyContent: "center" }} className="nav-links">
          {NAV_LINKS.map(l => (
            <Link key={l.path} to={l.path} style={{ color: loc.pathname === l.path ? G : "rgba(255,255,255,.55)", textDecoration: "none", fontSize: 14, fontWeight: loc.pathname === l.path ? 600 : 400, transition: "color .2s", whiteSpace: "nowrap" }}
              onMouseEnter={e => e.target.style.color = G}
              onMouseLeave={e => e.target.style.color = loc.pathname === l.path ? G : "rgba(255,255,255,.55)"}>{l.label}</Link>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Link to="/contact" style={{ background: GG, color: "#040608", borderRadius: 8, padding: "0.5rem 1.1rem", fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>Apply Now</Link>
          <button onClick={() => setMenuOpen(v => !v)} className="hamburger"
            style={{ background: "rgba(255,255,255,.1)", border: ".5px solid rgba(255,255,255,.2)", cursor: "pointer", padding: "8px 10px", flexDirection: "column", gap: 5, borderRadius: 6, flexShrink: 0, display: "none" }}>
            <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 2, transition: "all .3s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 2, transition: "opacity .3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 2, transition: "all .3s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div style={{ position: "fixed", top: 56, left: 0, right: 0, zIndex: 98, background: "rgba(4,6,8,.99)", backdropFilter: "blur(24px)", borderBottom: ".5px solid rgba(255,255,255,.1)", padding: "0.5rem 1.4rem 1.4rem" }}>
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
      )}
    </>
  );
}

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
            {[
              { label: "Store Audit", path: "/about#store-audit" },
              { label: "Ad Management", path: "/about#ad-management" },
              { label: "CRO Optimization", path: "/about#cro-optimization" },
              { label: "Landing Pages", path: "/about#landing-pages" },
              { label: "Email Flows", path: "/about#email-flows" },
            ].map(s => (
              <Link key={s.label} to={s.path} style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,.45)", textDecoration: "none", marginBottom: ".7rem", transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = G}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.45)"}>{s.label}</Link>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "1.2rem", fontWeight: 600 }}>Contact</p>
            <Link to="/contact" style={{ display: "inline-block", background: GG, color: "#040608", borderRadius: 8, padding: ".7rem 1.4rem", fontSize: 14, fontWeight: 700, textDecoration: "none", marginBottom: "1rem" }}>Apply Now →</Link>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.35)", marginTop: 8 }}>Response within 24 hours.</p>
            <a href="https://wa.me/19454076473" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#25D366", textDecoration: "none", marginTop: 12 }}>
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