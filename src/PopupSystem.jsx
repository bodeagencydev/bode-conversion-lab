import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "./components.jsx";
import { notifyPopupCapture } from "./NotificationSystem.js";

const DISCOUNT_CODE = "SCALE7";

const LS_STORE_SUBDOMAIN     = "bodeconversionlab";
const LS_CHECKLIST_VARIANT_ID = "1899985"; // The Store Leak Finder — free checklist

function loadLemonSqueezy() {
  return new Promise((resolve) => {
    if (window.LemonSqueezy) return resolve();
    const script = document.createElement("script");
    script.src = "https://assets.lemonsqueezy.com/lemon.js";
    script.defer = true;
    script.onload = () => {
      window.createLemonSqueezy();
      resolve();
    };
    document.head.appendChild(script);
  });
}

function Popup({ visible, onClose, children, dark }) {
  const [mounted, setMounted] = useState(false);
  const currentG = dark ? "#00ff88" : "#00A35C";

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
        position:"fixed", inset:0, zIndex:99000,
        background: "rgba(4,6,8,.4)",
        backdropFilter:"blur(8px)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"1rem",
        opacity: mounted ? 1 : 0,
        transition:"opacity .4s ease",
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: dark ? "rgba(4,6,8,.97)" : "#ffffff",
          border: dark ? ".5px solid rgba(255,255,255,.12)" : ".5px solid rgba(10,15,18,.1)",
          borderTop:`.5px solid ${currentG}`,
          borderRadius:24,
          padding:"clamp(1.8rem,4vw,2.8rem)",
          width:"100%", maxWidth:480,
          position:"relative", overflow:"hidden",
          transform: mounted ? "translateY(0) scale(1)" : "translateY(40px) scale(.96)",
          transition:"transform .5s cubic-bezier(.22,1,.36,1), opacity .4s ease",
          opacity: mounted ? 1 : 0,
          boxShadow: dark ? "0 20px 50px rgba(0,0,0,.3)" : "0 20px 50px rgba(10,15,18,.05)"
        }}>
        <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:`linear-gradient(90deg,transparent,${currentG},transparent)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:-60, right:-40, width:180, height:180, background:dark?"radial-gradient(circle,rgba(0,255,136,.15),transparent 70%)":"radial-gradient(circle,rgba(0,163,92,.06),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
        <button
          onClick={onClose}
          style={{ position:"absolute", top:14, right:16, background:"transparent", border:"none", cursor:"pointer", fontSize:20, lineHeight:1, color:dark?"rgba(255,255,255,.4)":"rgba(10,15,18,.4)", zIndex:1 }}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

function EmailForm({ onSubmit, dark, submitLabel, mutedText, headingColor, inputBg, inputBorder, doneMessage }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const currentG = dark ? "#00ff88" : "#00A35C";

  async function handleSubmit() {
    if (!email || !email.includes("@")) return setErr("Please enter a valid email.");
    setErr("");
    await onSubmit(email);
    setDone(true);
  }

  if (done) return (
    <div style={{ textAlign:"center", padding:"1rem 0" }}>
      <div style={{ width:52, height:52, borderRadius:"50%", background:dark?"rgba(0,255,136,.15)":"rgba(0,163,92,.1)", border:`.5px solid ${currentG}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke={currentG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <p style={{ fontSize:15, fontWeight:700, color:headingColor, marginBottom:".5rem" }}>You're in!</p>
      <p style={{ fontSize:13, color:mutedText, lineHeight:1.6 }}>{doneMessage || "Check your inbox. We'll be in touch soon."}</p>
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
        onFocus={e => e.target.style.borderColor=currentG}
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

function GeneralPopup({ dark }) {
  const [visible, setVisible] = useState(false);
  const currentG = dark ? "#00ff88" : "#00A35C";
  
  const headingColor = dark ? "#fff"                 : "#0A0F12";
  const mutedText    = dark ? "rgba(255,255,255,.5)"  : "rgba(10,15,18,.6)";
  const inputBg      = dark ? "rgba(255,255,255,.05)" : "#F8F9FA";
  const inputBorder  = dark ? "rgba(255,255,255,.12)" : "rgba(10,15,18,.12)";

  useEffect(() => {
    if (sessionStorage.getItem("bcl_popup_general")) return;
    const t = setTimeout(() => setVisible(true), 1 * 60 * 1000);
    return () => clearTimeout(t);
  }, []);

  function close() {
    sessionStorage.setItem("bcl_popup_general", "1");
    setVisible(false);
  }

  async function submit(email) {
    sessionStorage.setItem("bcl_popup_general", "1");
    await notifyPopupCapture(email, "General — 1min popup — Store Leak Finder");

    // Deliver the actual PDF via a free Lemon Squeezy checkout — $0, no card
    // required, but it's Lemon Squeezy's own order flow so the download link
    // lands reliably in their inbox (and shows up in your LS dashboard as a lead).
    await loadLemonSqueezy();
    window.LemonSqueezy.Setup({ eventHandler: () => {} });
    const checkoutUrl =
      `https://${LS_STORE_SUBDOMAIN}.lemonsqueezy.com/checkout/buy/${LS_CHECKLIST_VARIANT_ID}` +
      `?embed=1&media=0&desc=0&discount=0` +
      `&checkout[email]=${encodeURIComponent(email)}`;
    window.LemonSqueezy.Url.Open(checkoutUrl);
  }

  return (
    <Popup visible={visible} onClose={close} dark={dark}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:"1.2rem" }}>
        <span style={{ width:8, height:8, borderRadius:"50%", background:currentG }}/>
        <span style={{ fontSize:11, color:currentG, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase" }}>Free resource</span>
      </div>
      <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(1.3rem,4vw,1.7rem)", fontWeight:800, color:headingColor, lineHeight:1.2, marginBottom:".75rem" }}>
        Is your store leaking money right now?
      </h2>
      <p style={{ fontSize:14, color:mutedText, lineHeight:1.7, marginBottom:"1.4rem" }}>
        Get our free <strong style={{ color:headingColor }}>Store Leak Finder checklist</strong> — the exact 12-point framework we use on every audit. Takes 10 minutes, finds thousands in lost revenue.
      </p>
      <EmailForm
        onSubmit={submit}
        dark={dark}
        submitLabel="Send me the checklist →"
        doneMessage="Complete the free checkout that just opened to get your download — check your email for the link too."
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

function PricingPopup({ dark }) {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  
  const currentG  = dark ? "#00ff88" : "#00A35C";
  const currentGG = dark ? "linear-gradient(135deg,#00ff88,#00e676,#00cc6a)" : "linear-gradient(135deg,#00A35C,#00b869,#009957)";

  const headingColor = dark ? "#fff"                 : "#0A0F12";
  const mutedText    = dark ? "rgba(255,255,255,.5)"  : "rgba(10,15,18,.6)";
  const inputBg      = dark ? "rgba(255,255,255,.05)" : "#F8F9FA";
  const inputBorder  = dark ? "rgba(255,255,255,.12)" : "rgba(10,15,18,.12)";

  useEffect(() => {
    if (location.pathname !== "/pricing") return;
    if (sessionStorage.getItem("bcl_popup_pricing")) return;
    const t = setTimeout(() => setVisible(true), 3 * 60 * 1000);
    return () => clearTimeout(t);
  }, [location.pathname]);

  function close() {
    sessionStorage.setItem("bcl_popup_pricing", "1");
    setVisible(false);
  }

  async function submit(email) {
    sessionStorage.setItem("bcl_popup_pricing", "1");
    setSubmitted(true);
    await notifyPopupCapture(email, `Pricing discount — 3min popup — ${DISCOUNT_CODE}`);
  }

  function copyCode() {
    navigator.clipboard.writeText(DISCOUNT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Popup visible={visible} onClose={close} dark={dark}>
      <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:dark?"rgba(0,255,136,.1)":"rgba(0,163,92,.08)", border:dark?".5px solid rgba(0,255,136,.28)":".5px solid rgba(0,163,92,.25)", borderRadius:100, padding:"4px 12px", marginBottom:"1.2rem" }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:currentG, display:"inline-block" }} />
        <span style={{ fontSize:11, color:currentG, fontWeight:700, letterSpacing:".05em", textTransform:"uppercase" }}>Limited offer — just for you</span>
      </div>

      <div style={{ textAlign:"center", margin:"1rem 0 1.4rem" }}>
        <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"5rem", fontWeight:800, background:currentGG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1, margin:0 }}>7%</p>
        <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"1.2rem", fontWeight:700, color:headingColor, marginTop:".25rem" }}>off any package</p>
      </div>

      {!submitted ? (
        <>
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
        </>
      ) : (
        <>
          <p style={{ fontSize:14, color:mutedText, lineHeight:1.7, marginBottom:"1rem", textAlign:"center" }}>
            Your code is ready. Copy it and use it at checkout.
          </p>
          <div
            onClick={copyCode}
            style={{ background:dark?"rgba(0,255,136,.08)":"rgba(0,163,92,.04)", border:dark?".5px solid rgba(0,255,136,.3)":".5px solid rgba(0,163,92,.3)", borderRadius:12, padding:"1.2rem", textAlign:"center", cursor:"pointer", transition:"background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background=dark?"rgba(0,255,136,.14)":"rgba(0,163,92,.08)"}
            onMouseLeave={e => e.currentTarget.style.background=dark?"rgba(0,255,136,.08)":"rgba(0,163,92,.04)"}>
            <p style={{ fontSize:11, color:mutedText, marginBottom:6 }}>Your discount code — click to copy</p>
            <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"2rem", fontWeight:800, color:currentG, letterSpacing:".15em", margin:0 }}>{DISCOUNT_CODE}</p>
            <p style={{ fontSize:12, color:copied?currentG:mutedText, marginTop:6, fontWeight:copied?700:400 }}>
              {copied ? "Copied to clipboard" : "Tap to copy"}
            </p>
          </div>
        </>
      )}

      <p style={{ fontSize:11, color:mutedText, textAlign:"center", marginTop:".75rem" }}>
        Valid for 48 hours. Apply at checkout.
      </p>
    </Popup>
  );
}

export default function PopupSystem() {
  const { dark } = useTheme();
  return (
    <>
      <GeneralPopup dark={dark} />
      <PricingPopup dark={dark} />
    </>
  );
}