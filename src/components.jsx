import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* ── THEME & CONSTANTS ── */
export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "Pricing", path: "/pricing" },
  { label: "Blog", path: "/blog" }
];

/* ── HELPERS ── */
export function useInView(threshold = 0.1) {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        observer.unobserve(entry.target);
      }
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, isIntersecting];
}

/* ── UI COMPONENTS ── */
export const PageWrapper = ({ children }) => (
  <div style={{ minHeight: "100vh" }}>{children}</div>
);

export const Section = ({ children, id, style }) => (
  <section id={id} style={{ padding: "5rem 1.2rem", maxWidth: 1100, margin: "0 auto", position: "relative", ...style }}>
    {children}
  </section>
);

export const SectionLabel = ({ children }) => (
  <span style={{ 
    display: "inline-block", fontSize: 10, fontWeight: 700, 
    textTransform: "uppercase", letterSpacing: ".12em", 
    color: "rgba(0,255,136,0.8)", marginBottom: "1rem" 
  }}>{children}</span>
);

export const Heading = ({ children, style, size }) => (
  <h2 style={{ 
    fontFamily: "'Syne', sans-serif", fontSize: size || "clamp(2rem, 5vw, 3.5rem)", 
    fontWeight: 800, marginBottom: "1.5rem", lineHeight: 1.1, ...style 
  }}>{children}</h2>
);

export const GradText = ({ children }) => (
  <span style={{ 
    background: "linear-gradient(135deg,#00ff88,#00cc6a)", 
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" 
  }}>{children}</span>
);

export function Logo({ size = 36, textSize = 13 }) {
  const { dark } = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ 
        width: size, height: size, borderRadius: "25%", 
        background: "linear-gradient(135deg, #00ff88, #00cc6a)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, color: "#040608", fontSize: size * 0.5 
      }}>B</div>
      <span style={{ fontSize: textSize, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: dark ? "#fff" : "#000" }}>Bode Conversion Lab</span>
    </div>
  );
}

/* ── LAYOUT COMPONENTS ── */
export function Nav() {
  const { dark } = useTheme();
  return (
    <nav style={{ 
      padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", 
      alignItems: "center", position: "sticky", top: 0, zIndex: 1000,
      background: dark ? "rgba(4,6,8,0.8)" : "rgba(248,248,245,0.8)",
      backdropFilter: "blur(12px)"
    }}>
      <Link to="/" style={{ textDecoration: "none" }}><Logo /></Link>
      <div className="nav-links" style={{ display: "flex", gap: "2rem" }}>
        {NAV_LINKS.map(link => (
          <Link key={link.path} to={link.path} style={{ textDecoration: "none", color: dark ? "#fff" : "#000", fontSize: 14, fontWeight: 500 }}>{link.label}</Link>
        ))}
      </div>
    </nav>
  );
}

export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle} style={{
      position: "fixed", bottom: 24, left: 24, zIndex: 9999,
      width: 44, height: 44, borderRadius: "50%", cursor: "pointer",
      background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      border: "1px solid rgba(0,255,136,0.3)", color: dark ? "#00ff88" : "#000",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>{dark ? "☀" : "🌙"}</button>
  );
}

export function WhatsAppButton() {
  const msg = encodeURIComponent("Hi there! I would love to be part of your growth journey 🚀");
  return (
    <a href={`https://wa.me/19454076473?text=${msg}`} target="_blank" rel="noopener noreferrer" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, width: 56, height: 56, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", boxShadow: "0 4px 20px rgba(37,211,102,.5)" }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  );
}

export function Footer() {
  const { dark } = useTheme();
  return (
    <footer style={{ padding: "2.5rem 1.2rem", borderTop: ".5px solid rgba(0,255,136,0.1)", background: dark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.03)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Logo />
        <p style={{ fontSize: 13, marginTop: "1rem", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
          © 2026 Bode Conversion Lab. Engineered to scale.
        </p>
      </div>
    </footer>
  );
}

/* ── ANIMATION COMPONENTS (Required by Home.jsx) ── */
export const Particles = () => <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
export const Typewriter = ({ words }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex(prev => (prev + 1) % words.length), 3000);
    return () => clearInterval(timer);
  }, [words]);
  return <span style={{ color: "#00ff88" }}>{words[index]}</span>;
};

export const ContinuousTicker = ({ items }) => (
  <div style={{ display: "flex", gap: "2rem", overflow: "hidden", whiteSpace: "nowrap", padding: "10px 0" }}>
    {items.map((item, i) => <span key={i} style={{ opacity: 0.5 }}>{item.name || item}</span>)}
  </div>
);

export const TestimonialTicker = ({ items }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
    {items.slice(0, 3).map((item, i) => (
      <div key={i} style={{ padding: "1.5rem", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 12 }}>
        <p>"{item.text}"</p>
        <cite>— {item.author}</cite>
      </div>
    ))}
  </div>
);

export const VideoTips = () => <div style={{ padding: "2rem", textAlign: "center", opacity: 0.7 }}>[Video Lab Insights Loading...]</div>;
export const PartnerCard = ({ partner }) => (
  <div className="partner-card">
    <span>{partner.name}</span>
  </div>
);