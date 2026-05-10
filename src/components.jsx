import React, { createContext, useContext, useState } from "react";
import { Link } from "react-router-dom";

/* ── THEME LOGIC ── */
export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

/* ── CONSTANTS & HELPERS ── */
const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "Pricing", path: "/pricing" },
  { label: "Blog", path: "/blog" }
];

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
      <span style={{ 
        fontSize: textSize, fontWeight: 800, letterSpacing: "0.1em", 
        textTransform: "uppercase", color: dark ? "#fff" : "#000" 
      }}>Bode Conversion Lab</span>
    </div>
  );
}

/* ── COMPONENTS ── */

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
          <Link key={link.path} to={link.path} style={{ 
            textDecoration: "none", color: dark ? "#fff" : "#000", fontSize: 14, fontWeight: 500 
          }}>{link.label}</Link>
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
    }}>
      {dark ? "☀" : "🌙"}
    </button>
  );
}

export function WhatsAppButton() {
  const msg = encodeURIComponent("Hi there! I would love to be part of your growth journey 🚀");
  return (
    <a
      href={`https://wa.me/19454076473?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 9999,
        width: 56, height: 56, borderRadius: "50%",
        background: "#25D366",
        boxShadow: "0 4px 20px rgba(37,211,102,.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        textDecoration: "none", transition: "transform .2s, box-shadow .2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.12)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,211,102,.65)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,.5)";
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}

export function Footer() {
  const { dark } = useTheme();
  const tc  = dark ? "rgba(255,255,255,.5)"  : "rgba(0,0,0,.55)";
  const tc2 = dark ? "rgba(255,255,255,.28)" : "rgba(0,0,0,.32)";
  const G   = "#00ff88";
  const GG  = "linear-gradient(135deg,#00ff88,#00cc6a)";

  const ColLink = ({ to, children }) => (
    <Link
      to={to}
      style={{
        display: "block", fontSize: 13.5, color: tc,
        textDecoration: "none", marginBottom: ".4rem",
        lineHeight: 1.4, transition: "color .2s, transform .15s",
        minHeight: 28,
      }}
      onMouseEnter={e => { e.target.style.color = G; e.target.style.transform = "translateX(3px)"; }}
      onMouseLeave={e => { e.target.style.color = tc; e.target.style.transform = "none"; }}
    >
      {children}
    </Link>
  );

  const ColHead = ({ children }) => (
    <p style={{
      fontSize: 10, color: tc2, letterSpacing: ".12em",
      textTransform: "uppercase", fontWeight: 700,
      marginBottom: ".65rem", lineHeight: 1,
    }}>
      {children}
    </p>
  );

  return (
    <footer style={{
      padding: "2.5rem 1.2rem 1.5rem",
      borderTop: `.5px solid ${dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)"}`,
      background: dark ? "rgba(0,0,0,.3)" : "rgba(0,0,0,.03)",
    }}>
      <style>{`
        .footer-inner { max-width: 1100px; margin: 0 auto; }
        .footer-brand {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 1.5rem; flex-wrap: wrap;
          margin-bottom: 1.8rem;
          padding-bottom: 1.4rem;
          border-bottom: .5px solid ${dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.07)"};
        }
        .footer-cols {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem 1.5rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 700px) {
          .footer-cols { grid-template-columns: repeat(2, 1fr); gap: .8rem 1.2rem; }
          .footer-brand { flex-direction: column; gap: 1rem; }
        }
      `}</style>

      <div className="footer-inner">
        <div className="footer-brand">
          <div style={{ flex: 1, minWidth: 180, maxWidth: 320 }}>
            <Link to="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: ".75rem" }}>
              <Logo size={36} textSize={13}/>
            </Link>
            <p style={{ fontSize: 13, color: tc, lineHeight: 1.65, marginBottom: ".85rem" }}>
              We don't run ads. We engineer ROAS.<br/>
              One system. Compounding results every month.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: ".5rem" }}>
            <Link to="/contact" className="btn-g" style={{ fontSize: 14, padding: ".65rem 1.4rem" }}>
              Apply Now →
            </Link>
            <p style={{ fontSize: 12, color: tc2, margin: 0 }}>Response within 24 hours.</p>
          </div>
        </div>

        <div className="footer-cols">
          <div>
            <ColHead>Pages</ColHead>
            {NAV_LINKS.map(l => <ColLink key={l.path} to={l.path}>{l.label}</ColLink>)}
          </div>
          <div>
            <ColHead>Services</ColHead>
            {["Store Audit","Ad Management","CRO Optimization"].map(s => <ColLink key={s} to="/about">{s}</ColLink>)}
          </div>
          <div>
            <ColHead>Free Tools</ColHead>
            <ColLink to="/audit">Free Store Audit</ColLink>
            <ColLink to="/subscribe">Newsletter</ColLink>
          </div>
          <div>
            <ColHead>Company</ColHead>
            <ColLink to="/about">About Us</ColLink>
            <ColLink to="/contact">Contact</ColLink>
          </div>
        </div>

        <div style={{
          borderTop: `.5px solid ${dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"}`,
          paddingTop: "1rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap"
        }}>
          <p style={{ fontSize: 11.5, color: tc2 }}>© 2025 Bode Conversion Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}