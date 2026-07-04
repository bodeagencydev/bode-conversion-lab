import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { G, GG } from "./data.js";
import { useTheme } from "./components.jsx";
import { notifyPopupCapture } from "./NotificationSystem.js";

/* ── Discount code ── */
const DISCOUNT_CODE = "SCALE7";

/* ── Animated popup base ── */
function Popup({ visible, onClose, children, dark }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setTimeout(() => setMounted(true), 10);
    } else {
      setMounted(false);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 99000,
        background: "rgba(0,0,0,.65)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        opacity: mounted ? 1 : 0,
        transition: "opacity .4s ease",
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: dark ? "rgba(4,6,8,.97)" : "rgba(255,248,225,.98)",
          border: dark ? ".5px solid rgba(255,255,255,.12)" : ".5px solid rgba(26,20,8,.18)",
          borderTop: ".5px solid rgba(0,255,136,.4)",
          borderRadius: 24,
          padding: "clamp(1.8rem,4vw,2.8rem)",
          width: "100%", maxWidth: 480,
          position: "relative", overflow: "hidden",
          transform: mounted ? "translateY(0) scale(1)" : "translateY(40px) scale(.96)",
          transition: "transform .5s cubic-bezier(.22,1,.36,1), opacity .4s ease",
          opacity: mounted ? 1 : 0,
        }}>
        <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:-60, right:-40, width:180, height:180, background:"radial-gradient(circle,rgba(0,255,136,.15),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
        <button
          onClick={onClose}
          style={{ position:"absolute", top:14, right:16, background:"transparent", border:"none", cursor:"pointer", fontSize:20, lineHeight:1, color: dark?"rgba(255,255,255,.4)":"rgba(26,20,8,.4)", zIndex:1 }}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

/* ── Email input form ── */
function EmailForm({ onSubmit, dark, submitLabel, mutedText, headingColor, inputBg, inputBorder }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit() {
    if (!email || !email.includes("@")) return setErr("Please enter a valid email.");
    setErr("");
    await onSubmit(email);
    setDone(true);
  }

  if (done) return (
    <div style={{ textAlign:"center", padding:"1rem 0" }}>
      <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(0,255,136,.15)", border:".5px solid rgba(0,255,136,.4)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <p style={{ fontSize:15, fontWeight:700, color:headingColor, marginBottom:".5rem" }}>You're in!</p>
      <p style={{ fontSize:13, color:mutedText, lineHeight:1.6 }}>Check your inbox. We'll be in touch soon.</p>
    </div>
  );

  return (
    <div>
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        style={{ width:"100%", background:inputBg, border:`.5px solid ${inputBorder}`, borderRadius:10, padding:".8rem 1rem", color:headingColor, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box", marginBottom:8 }}
        onFocus={e => e.target.style.borderColor="rgba(0,255,136,.5)"}
        onBlur={e => e.target.style.borderColor=inputBorder}
      />
      {err && <p style={{ fontSize:12, color:"#FF6B6B", marginBottom:8 }}>{err}</p>}
      <button
        onClick={handleSubmit}
        className="btn-g"
        style={{ width:"100%", fontFamily:"inherit", cursor:"pointer" }}>
        {submitLabel}
      </button>
    </div>
  );
}

/* ── POPUP 1 — General (fires 1 min after page load) ── */
function GeneralPopup({ dark }) {
  const [visible, setVisible] = useState(false);
  const headingColor = dark ? "#fff"                  : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.5)"   : "rgba(26,20,8,.62)";
  const inputBg      = dark ? "rgba(255,255,255,.05)"  : "rgba(255,255,255,.6)";
  const inputBorder  = dark ? "rgba(255,255,255,.12)"  : "rgba(26,20,8,.18)";

  useEffect(() => {
    if (sessionStorage.getItem("bcl_popup_general")) return;
    const t = setTimeout(() => setVisible(true), 1 * 60 * 1000); // 1 minute
    return () => clearTimeout(t);
  }, []);

  function close() {
    sessionStorage.setItem("bcl_popup_general", "1");
    setVisible(false);
  }

  async function submit(email) {
    sessionStorage.setItem("bcl_popup_general", "1");
    await notifyPopupCapture(email, "General — 1min popup");
  }

  return (
    <Popup visible={visible} onClose={close} dark={dark}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:"1.2rem" }}>
        <span style={{ width:8, height:8, borderRadius:"50%", background:G }}/>
        <span style={{ fontSize:11, color:G, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase" }}>Free resource</span>
      </div>

      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.3rem,4vw,1.7rem)", fontWeight:800, color:headingColor, lineHeight:1.2, marginBottom:".75rem" }}>
        Is your store leaking money right now?
      </h2>
      <p style={{ fontSize:14, color:mutedText, lineHeight:1.7, marginBottom:"1.4rem" }}>
        Get our free <strong style={{ color:headingColor }}>Store Leak Finder checklist</strong> — the exact 12-point framework we use on every audit. Takes 10 minutes, finds thousands in lost revenue.
      </p>

      <EmailForm
        onSubmit={submit}
        dark={dark}
        submitLabel="Send me the checklist →"
        mutedText={mutedText}
        headingColor={headingColor}
        inputBg={inputBg}
        inputBorder={inputBorder}
      />

      <p style={{ fontSize:11, color:mutedText, textAlign:"center", marginTop:".75rem" }}>
        No spam. Unsubscribe anytime.
      </p>
    </Popup>
  );
}

/* ── POPUP 2 — Pricing discount (fires 3 min on /pricing) ── */
function PricingPopup({ dark }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const headingColor = dark ? "#fff"                  : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.5)"   : "rgba(26,20,8,.62)";
  const inputBg      = dark ? "rgba(255,255,255,.05)"  : "rgba(255,255,255,.6)";
  const inputBorder  = dark ? "rgba(255,255,255,.12)"  : "rgba(26,20,8,.18)";

  useEffect(() => {
    if (location.pathname !== "/pricing") return;
    if (sessionStorage.getItem("bcl_popup_pricing")) return;
    const t = setTimeout(() => setVisible(true), 3 * 60 * 1000); // 3 minutes
    return () => clearTimeout(t);
  }, [location.pathname]);

  function close() {
    sessionStorage.setItem("bcl_popup_pricing", "1");
    setVisible(false);
  }

  async function submit(email) {
    sessionStorage.setItem("bcl_popup_pricing", "1");
    await notifyPopupCapture(email, `Pricing discount — 3min popup — ${DISCOUNT_CODE}`);
  }

  function copyCode() {
    navigator.clipboard.writeText(DISCOUNT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Popup visible={visible} onClose={close} dark={dark}>
      <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.28)", borderRadius:100, padding:"4px 12px", marginBottom:"1.2rem" }}>
        <span style={{ fontSize:14 }}>⚡</span>
        <span style={{ fontSize:11, color:G, fontWeight:700, letterSpacing:".05em", textTransform:"uppercase" }}>Limited offer — just for you</span>
      </div>

      <div style={{ textAlign:"center", margin:"1rem 0 1.4rem" }}>
        <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"5rem", fontWeight:800, background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1, margin:0 }}>7%</p>
        <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:700, color:headingColor, marginTop:".25rem" }}>off any package</p>
      </div>

      <p style={{ fontSize:14, color:mutedText, lineHeight:1.7, marginBottom:"1.4rem", textAlign:"center" }}>
        You've been on this page a while — we can see you're serious. Enter your email to unlock your discount code.
      </p>

      <EmailForm
        onSubmit={submit}
        dark={dark}
        submitLabel="Unlock my 7% discount →"
        mutedText={mutedText}
        headingColor={headingColor}
        inputBg={inputBg}
        inputBorder={inputBorder}
      />

      {sessionStorage.getItem("bcl_popup_pricing") === "1" && (
        <div
          onClick={copyCode}
          style={{ marginTop:"1rem", background:"rgba(0,255,136,.08)", border:".5px solid rgba(0,255,136,.3)", borderRadius:10, padding:".9rem", textAlign:"center", cursor:"pointer" }}>
          <p style={{ fontSize:11, color:mutedText, marginBottom:4 }}>Your discount code (click to copy)</p>
          <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.4rem", fontWeight:800, color:G, letterSpacing:".1em" }}>{DISCOUNT_CODE}</p>
          <p style={{ fontSize:11, color:mutedText, marginTop:4 }}>{copied ? "✅ Copied!" : "Click to copy"}</p>
        </div>
      )}

      <p style={{ fontSize:11, color:mutedText, textAlign:"center", marginTop:".75rem" }}>
        Valid for 48 hours. Apply at checkout.
      </p>
    </Popup>
  );
}

/* ── MAIN EXPORT ── */
export default function PopupSystem() {
  const { dark } = useTheme();
  return (
    <>
      <GeneralPopup dark={dark} />
      <PricingPopup dark={dark} />
    </>
  );
}