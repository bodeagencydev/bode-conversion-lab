import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm, ValidationError } from "@formspree/react";
import { SERVICES } from "./data.js";

const G  = "#00ff88";
const GG = "linear-gradient(135deg,#00ff88,#00e676,#00cc6a)";

const DOMAIN_MAP = {
  shopify:"shopify.com", woocommerce:"woocommerce.com", magento:"magento.com",
  bigcommerce:"bigcommerce.com", wix:"wix.com", squarespace:"squarespace.com",
  prestashop:"prestashop.com", opencart:"opencart.com", ecwid:"ecwid.com",
  meta:"meta.com", tiktok:"tiktok.com", google:"google.com",
  pinterest:"pinterest.com", snapchat:"snapchat.com", youtube:"youtube.com",
  x:"x.com", linkedin:"linkedin.com", amazon:"amazon.com",
  klaviyo:"klaviyo.com", triplewhale:"triplewhale.com",
};

function PlatformLogo({ name, slug, color, size = 20 }) {
  const [failed, setFailed] = useState(false);
  const domain = DOMAIN_MAP[slug?.toLowerCase()];
  if (failed || !domain) {
    return (
      <div style={{ width:size, height:size, borderRadius:size*.25, background:`${color||G}22`, border:`.5px solid ${color||G}55`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:size*.55, fontWeight:800, color:color||G }}>{(name||"?")[0]}</span>
      </div>
    );
  }
  return (
    <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt={name} width={size} height={size}
      style={{ borderRadius:size*.2, flexShrink:0, display:"block", objectFit:"contain" }}
      onError={() => setFailed(true)}/>
  );
}

export const ThemeContext = createContext({ dark: true, toggle: () => {} });
export function useTheme() { return useContext(ThemeContext); }

/* ── Per-page SEO: sets title, meta description, canonical link, and
      OG/Twitter tags on mount. No new dependency — plain DOM updates.
      faq/service props add structured data (JSON-LD) — FAQPage schema
      can win a rich-result "People also ask" style listing directly in
      Google search, and Service schema helps each service page get
      understood as a distinct offer rather than generic text. ── */
const SITE_URL = "https://bodeconversionlab.vercel.app";
export function SEO({ title, description, path = "", article = null, faq = null, service = null }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Bode Conversion Lab` : "Bode Conversion Lab — Store Optimization & Ads Engineering";
    document.title = fullTitle;

    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const [, attrName, attrVal] = selector.match(/\[(\w+)="([^"]+)"\]/) || [];
        if (attrName) el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[name="twitter:description"]', "content", description);
    }
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);

    const url = `${SITE_URL}${path}`;
    setMeta('meta[property="og:url"]', "content", url);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // Optional Article/BlogPosting JSON-LD for blog posts and case studies
    const existingLd = document.getElementById("seo-article-jsonld");
    if (existingLd) existingLd.remove();
    if (article) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "seo-article-jsonld";
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: description,
        url,
        datePublished: article.datePublished || undefined,
        author: { "@type": "Organization", name: "Bode Conversion Lab" },
        publisher: { "@type": "Organization", name: "Bode Conversion Lab" },
      });
      document.head.appendChild(script);
    }

    // Optional FAQPage JSON-LD — pass an array of {q, a} objects
    const existingFaqLd = document.getElementById("seo-faq-jsonld");
    if (existingFaqLd) existingFaqLd.remove();
    if (faq && faq.length) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "seo-faq-jsonld";
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map(f => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      });
      document.head.appendChild(script);
    }

    // Optional Service JSON-LD — pass { name, description }
    const existingServiceLd = document.getElementById("seo-service-jsonld");
    if (existingServiceLd) existingServiceLd.remove();
    if (service) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "seo-service-jsonld";
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.name,
        description: service.description,
        provider: { "@type": "Organization", name: "Bode Conversion Lab", url: SITE_URL },
        areaServed: "Worldwide",
        url,
      });
      document.head.appendChild(script);
    }
  }, [title, description, path, article, faq, service]);

  return null;
}

const NAV_LINKS = [
  { path:"/",             label:"Home" },
  { path:"/about",        label:"About" },
  { path:"/past-projects", label:"Past Projects" },
  { path:"/pricing",      label:"Pricing" },
  { path:"/blog",         label:"Blog" },
  { path:"/audit",        label:"Free Audit" },
  { path:"/contact",      label:"Contact" },
];

export function Logo({ size = 40, textSize = 14 }) {
  const { dark } = useTheme();
  return (
    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
      <div style={{
        width:size, height:size, borderRadius:"30%",
        background: dark ? "linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,255,136,.02))" : "rgba(255,255,255,.9)",
        border: dark ? ".5px solid rgba(0,255,136,.25)" : ".5px solid rgba(10,15,18,.15)",
        display:"flex", alignItems:"center", justifyContent:"center",
        flexShrink:0, overflow:"hidden",
        boxShadow: dark ? "0 2px 14px rgba(0,255,136,.2)" : "0 2px 8px rgba(0,0,0,.1)",
      }}>
        <img src="/logo-mark.png" alt="Bode Conversion Lab" style={{ width:"64%", height:"64%", objectFit:"contain", display:"block" }}/>
      </div>
      <div style={{ lineHeight:1.1 }}>
        <p style={{ fontSize:textSize, fontWeight:800, color:"var(--fg)", margin:0, fontFamily:"'Space Grotesk',sans-serif", letterSpacing:"-0.02em" }}>Bode</p>
        <p style={{ fontSize:textSize*.78, fontWeight:700, color:"var(--g,#00ff88)", margin:0, letterSpacing:".06em", textTransform:"uppercase" }}>Conversion Lab</p>
      </div>
    </div>
  );
}

export function Nav() {
  const { dark } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible,  setVisible]  = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setVisible(y < lastY.current || y < 80);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const navBg = dark
    ? (scrolled ? "rgba(4,6,8,.96)"       : "rgba(4,6,8,.75)")
    : (scrolled ? "rgba(248,249,250,.97)" : "rgba(248,249,250,.88)");

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        padding:"0 clamp(1rem,4vw,2.5rem)", height:60,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:navBg, backdropFilter:"blur(20px)",
        borderBottom:".5px solid var(--divider,rgba(255,255,255,.06))",
        transition:"transform .35s cubic-bezier(.22,1,.36,1),background .3s",
        transform:visible?"translateY(0)":"translateY(-100%)"
      }}>
        <Link to="/" style={{ textDecoration:"none" }}><Logo size={34} textSize={13}/></Link>

        <div style={{ display:"flex", alignItems:"center", gap:"clamp(.6rem,2vw,1.6rem)" }} className="nav-desktop">
          {NAV_LINKS.filter(l => l.path !== "/contact").map(l => {
            const active = location.pathname === l.path;
            return (
              <Link key={l.path} to={l.path}
                style={{ fontSize:13.5, fontWeight:active?700:500, color:active?"var(--g,#00ff88)":"var(--muted,rgba(255,255,255,.5))", textDecoration:"none", transition:"color .2s", position:"relative", paddingBottom:2 }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color="var(--g,#00ff88)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color="var(--muted,rgba(255,255,255,.5))"; }}>
                {l.label}
                {active && <span style={{ position:"absolute", bottom:-2, left:0, right:0, height:2, background:GG, borderRadius:2 }}/>}
              </Link>
            );
          })}
          <a href="https://calendly.com/bodeagencyofficial/30min" target="_blank" rel="noopener noreferrer"
            style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", lineHeight:1, background:GG, color:"#040608", borderRadius:8, padding:".55rem 1.1rem", fontSize:13, fontWeight:700, textDecoration:"none", boxShadow:"0 2px 14px rgba(0,255,136,.3)", transition:"transform .2s,box-shadow .2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 6px 22px rgba(0,255,136,.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 2px 14px rgba(0,255,136,.3)"; }}>
            Apply Now →
          </a>
        </div>

        <button onClick={() => setMenuOpen(o => !o)} className="nav-hamburger"
          style={{ background:"none", border:"none", cursor:"pointer", padding:6, display:"none", flexDirection:"column", gap:5, alignItems:"center", justifyContent:"center" }}
          aria-label="Toggle menu">
          {[0,1,2].map(i => (
            <span key={i} style={{
              display:"block", width:22, height:2,
              background:"var(--fg,#f0f0f0)", borderRadius:2, transition:"all .25s",
              transform: menuOpen?(i===0?"rotate(45deg) translate(5px,5px)":i===2?"rotate(-45deg) translate(5px,-5px)":"scaleX(0)"):"none",
              opacity: menuOpen&&i===1?0:1
            }}/>
          ))}
        </button>
      </nav>

      <div style={{
        position:"fixed", top:60, left:0, right:0, zIndex:999,
        background: dark ? "rgba(4,6,8,.97)" : "rgba(248,249,250,.97)",
        backdropFilter:"blur(20px)",
        borderBottom:".5px solid var(--divider,rgba(255,255,255,.06))",
        padding:menuOpen?"1.2rem 1.5rem 1.5rem":"0 1.5rem",
        maxHeight:menuOpen?520:0, overflow:"hidden",
        transition:"max-height .35s cubic-bezier(.22,1,.36,1),padding .35s"
      }}>
        {NAV_LINKS.map(l => {
          const active = location.pathname === l.path;
          return (
            <Link key={l.path} to={l.path}
              style={{ display:"block", padding:".7rem 0", fontSize:15, fontWeight:active?700:500, color:active?"var(--g,#00ff88)":"var(--muted,rgba(255,255,255,.5))", textDecoration:"none", borderBottom:".5px solid var(--divider,rgba(255,255,255,.06))", transition:"color .2s" }}>
              {l.label}
            </Link>
          );
        })}
        <a href="https://calendly.com/bodeagencyofficial/30min" target="_blank" rel="noopener noreferrer" style={{ display:"inline-block", marginTop:"1rem", background:GG, color:"#040608", borderRadius:8, padding:".55rem 1.4rem", fontSize:14, fontWeight:700, textDecoration:"none" }}>
          Apply Now →
        </a>
      </div>

      <style>{`@media(max-width:768px){.nav-desktop{display:none!important;}.nav-hamburger{display:flex!important;}}`}</style>
    </>
  );
}

export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle}
      style={{
        position:"fixed", bottom:24, left:24, zIndex:9999,
        width:44, height:44, borderRadius:"50%",
        background: dark ? "rgba(0,255,136,.08)" : "rgba(10,15,18,.85)",
        border: dark ? ".5px solid rgba(0,255,136,.3)" : ".5px solid rgba(0,255,136,.4)",
        backdropFilter:"blur(12px)",
        display:"flex", alignItems:"center", justifyContent:"center",
        cursor:"pointer",
        transition:"transform .25s cubic-bezier(.22,1,.36,1),background .25s,box-shadow .25s",
        boxShadow: dark ? "0 2px 16px rgba(0,255,136,.15)" : "0 2px 20px rgba(0,0,0,.3)",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform="scale(1.12)"; e.currentTarget.style.boxShadow="0 4px 28px rgba(0,255,136,.5)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow=dark?"0 2px 16px rgba(0,255,136,.15)":"0 2px 20px rgba(0,0,0,.3)"; }}
      aria-label="Toggle theme">
      {dark ? (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4.5"/>
          <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      )}
    </button>
  );
}

/* ── Sitewide "what do you need" popup: fires once per session, ~7s
      after landing. A quick router to the right page instead of making
      people hunt the nav — dismiss and it won't reappear this session. ── */
function HelpMenuPopup() {
  const [show, setShow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (sessionStorage.getItem("bcl_help_popup_shown")) return;
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem("bcl_help_popup_shown")) {
        setShow(true);
        sessionStorage.setItem("bcl_help_popup_shown", "1");
      }
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  const options = [
    { label: "See what a free audit finds", to: "/audit" },
    { label: "Check pricing & packages", to: "/pricing" },
    { label: "Talk to a human on WhatsApp", href: "https://wa.me/19454076473?text=" + encodeURIComponent("Hi, I have a question before getting started.") },
    { label: "Just browsing for now", dismiss: true },
  ];

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:99998, background:"rgba(0,0,0,.65)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:"1.5rem",
    }} onClick={() => setShow(false)}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:"var(--bg,#0B0D0C)", border:"1px solid var(--card-border,rgba(255,255,255,.12))",
          borderRadius:14, padding:"1.8rem", maxWidth:400, width:"100%", position:"relative",
          boxShadow:"0 30px 80px rgba(0,0,0,.6)",
        }}
      >
        <button
          onClick={() => setShow(false)}
          style={{ position:"absolute", top:14, right:16, background:"none", border:"none", color:"var(--muted,rgba(255,255,255,.5))", fontSize:20, cursor:"pointer" }}
          aria-label="Close"
        >×</button>

        <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"1.15rem", fontWeight:700, color:"var(--fg,#fff)", marginBottom:"1.2rem" }}>
          What do you need help with?
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {options.map((opt, i) => {
            const shared = {
              key: i,
              style: {
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"12px 14px", borderRadius:9, textDecoration:"none",
                border:"1px solid var(--card-border,rgba(255,255,255,.1))",
                background:"var(--card-bg,rgba(255,255,255,.04))",
                color:"var(--fg,#fff)", fontSize:13.5, fontWeight:500, cursor:"pointer",
              },
            };
            if (opt.dismiss) return <button {...shared} onClick={() => setShow(false)}>{opt.label}</button>;
            if (opt.href)    return <a {...shared} href={opt.href} target="_blank" rel="noopener noreferrer" onClick={() => setShow(false)}>{opt.label} <span style={{ color:G }}>→</span></a>;
            return <Link {...shared} to={opt.to} onClick={() => setShow(false)}>{opt.label} <span style={{ color:G }}>→</span></Link>;
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Sitewide exit-intent popup: fires once per session when the mouse
      leaves toward the top of the viewport (classic "about to close tab"
      signal). Offers the free audit in exchange for an email, so visitors
      who leave without messaging aren't lost entirely. ── */
function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [state, handleSubmit] = useForm("xaqadyal");

  useEffect(() => {
    if (sessionStorage.getItem("bcl_exit_popup_shown")) return;
    let armed = false;
    const armTimer = setTimeout(() => { armed = true; }, 6000); // don't trigger in first 6s

    function onMouseOut(e) {
      if (!armed) return;
      if (e.clientY <= 0 && !sessionStorage.getItem("bcl_exit_popup_shown")) {
        setShow(true);
        sessionStorage.setItem("bcl_exit_popup_shown", "1");
      }
    }
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      clearTimeout(armTimer);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:99999, background:"rgba(0,0,0,.7)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:"1.5rem",
    }} onClick={() => setShow(false)}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:"#0A0A0A", border:"1px solid rgba(0,255,136,.3)", borderRadius:20,
          padding:"2.2rem", maxWidth:440, width:"100%", position:"relative",
          boxShadow:"0 30px 80px rgba(0,0,0,.6)",
        }}
      >
        <button
          onClick={() => setShow(false)}
          style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"rgba(255,255,255,.5)", fontSize:22, cursor:"pointer" }}
          aria-label="Close"
        >×</button>

        {state.succeeded ? (
          <div style={{ textAlign:"center", padding:"1.5rem 0" }}>
            <p style={{ fontSize:"1.1rem", fontWeight:700, color:"#00FF88", marginBottom:".5rem" }}>You're in! 🎉</p>
            <p style={{ fontSize:14, color:"rgba(255,255,255,.7)" }}>Check your inbox — the free audit checklist is on its way.</p>
          </div>
        ) : (
          <>
            <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"1.4rem", fontWeight:800, color:"#fff", marginBottom:".6rem", lineHeight:1.25 }}>
              Before you go — is your store leaking money?
            </p>
            <p style={{ fontSize:14, color:"rgba(255,255,255,.6)", marginBottom:"1.4rem", lineHeight:1.6 }}>
              Get our free Store Leak Finder checklist — the exact 12-point framework we use on every audit. Takes 10 minutes, finds thousands in lost revenue.
            </p>
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:".7rem" }}>
              <input
                type="email" name="email" required placeholder="Your email address"
                style={{
                  padding:"12px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,.15)",
                  background:"rgba(255,255,255,.04)", color:"#fff", fontSize:14, outline:"none",
                }}
              />
              <input type="hidden" name="source" value="exit_intent_popup" />
              <ValidationError prefix="Email" field="email" errors={state.errors} />
              <button
                type="submit" disabled={state.submitting}
                style={{
                  padding:"12px 16px", borderRadius:10, border:"none", background:"#00FF88",
                  color:"#0A0A0A", fontWeight:700, fontSize:14, cursor:"pointer",
                }}
              >
                Send me the checklist →
              </button>
            </form>
            <p style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginTop:".8rem", textAlign:"center" }}>
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const COOKIE_CONSENT_KEY = "bcl_cookie_consent";
const COOKIE_REOPEN_EVENT = "bcl-open-cookie-prefs";

/* ── Read the visitor's stored cookie choice. Used to gate any
      non-essential localStorage write (currently: theme preference)
      so it's only persisted after an actual "Accept". ── */
export function hasCookieConsent() {
  try { return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted"; } catch { return false; }
}

/* ── Cookie consent banner — bottom bar with equal-weight Accept /
      Decline buttons (no dark patterns), shown once until the visitor
      chooses, remembered in localStorage. Reopenable anytime via the
      "Cookie Preferences" link in the footer, which fires
      COOKIE_REOPEN_EVENT. Session-only popup dedupe (sessionStorage,
      cleared when the tab closes) is treated as strictly necessary and
      isn't gated here — only the theme-preference cookie is. ── */
export function CookieConsent() {
  const { dark } = useTheme();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try { if (!localStorage.getItem(COOKIE_CONSENT_KEY)) setShow(true); } catch { setShow(true); }
    function reopen() { setShow(true); }
    window.addEventListener(COOKIE_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_REOPEN_EVENT, reopen);
  }, []);

  function choose(value) {
    try { localStorage.setItem(COOKIE_CONSENT_KEY, value); } catch {}
    if (value === "declined") {
      // withdraw immediately — don't leave a stale preference cookie behind
      try { localStorage.removeItem("bcl-theme"); } catch {}
    }
    setShow(false);
  }

  if (!show) return null;

  const bg = dark ? "#0A0A0A" : "#FFFDF7";
  const border = dark ? "rgba(255,255,255,.12)" : "rgba(26,20,8,.15)";
  const text = dark ? "rgba(255,255,255,.72)" : "rgba(26,20,8,.72)";
  const declineBorder = dark ? "rgba(255,255,255,.22)" : "rgba(26,20,8,.28)";

  return (
    <div style={{
      position:"fixed", left:0, right:0, bottom:0, zIndex:9500,
      display:"flex", justifyContent:"center", padding:"14px",
      pointerEvents:"none",
    }}>
      <div style={{
        pointerEvents:"auto",
        display:"flex", flexWrap:"wrap", gap:"1rem", alignItems:"center",
        justifyContent:"space-between", width:"100%", maxWidth:920,
        background:bg, border:`.5px solid ${border}`, borderRadius:14,
        padding:"14px 18px", boxShadow:"0 12px 40px rgba(0,0,0,.25)",
      }}>
        <p style={{ fontSize:12.5, color:text, lineHeight:1.55, margin:0, flex:"1 1 320px", display:"flex", gap:8, alignItems:"flex-start" }}>
          <span style={{ fontSize:16, flexShrink:0 }}>🍪</span>
          <span>We use cookies to enhance your browsing experience and remember your preferences. By clicking "Accept", you consent to our use of cookies. Read our{" "}
          <a href="/privacy" style={{ color:G, fontWeight:600, textDecoration:"none" }}>Privacy Policy</a> to learn more.</span>
        </p>
        <div style={{ display:"flex", gap:".6rem", flexShrink:0 }}>
          <button
            onClick={() => choose("declined")}
            style={{
              background:"transparent", color:text, border:`.5px solid ${declineBorder}`,
              borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:700,
              cursor:"pointer", fontFamily:"inherit",
            }}>
            Decline
          </button>
          <button
            onClick={() => choose("accepted")}
            style={{
              background:GG, color:"#040608", border:"none",
              borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:700,
              cursor:"pointer", fontFamily:"inherit",
            }}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

export function PageWrapper({ children, style = {} }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{
      minHeight:"100vh",
      background:"var(--bg,#040608)",
      color:"var(--fg,#f0f0f0)",
      paddingTop:60,
      transition:"background .3s,color .3s",
      ...style
    }}>
      <HelpMenuPopup />
      <ExitIntentPopup />
      {children}
    </div>
  );
}

export function GradText({ children, style = {} }) {
  return (
    <span style={{ background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", ...style }}>
      {children}
    </span>
  );
}

export function Section({ id, children, style = {} }) {
  return (
    <section id={id} style={{ padding:"clamp(3rem,6vw,6rem) clamp(1rem,4vw,2rem)", position:"relative", ...style }}>
      {children}
    </section>
  );
}

export function SectionLabel({ children }) {
  return (
    <p style={{ fontSize:11, color:"var(--muted2,rgba(255,255,255,.4))", letterSpacing:".12em", textTransform:"uppercase", marginBottom:".75rem", fontWeight:600 }}>
      {children}
    </p>
  );
}

export function Heading({ children, size = "2.3rem" }) {
  return (
    <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:`clamp(1.4rem,4vw,${size})`, fontWeight:800, letterSpacing:"-.02em", color:"var(--fg,#f0f0f0)", lineHeight:1.15, wordBreak:"break-word" }}>
      {children}
    </h2>
  );
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
    const step = ts => { if (!s) s=ts; const p=Math.min((ts-s)/2000,1); setVal(Math.floor(p*target)); if(p<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width=c.offsetWidth; c.height=c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length:55 }, () => ({
      x:Math.random()*c.width, y:Math.random()*c.height,
      r:Math.random()*1.6+.4, dx:(Math.random()-.5)*.3, dy:(Math.random()-.5)*.3,
      o:Math.random()*.5+.1
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(p => {
        p.x+=p.dx; p.y+=p.dy;
        if(p.x<0) p.x=c.width; if(p.x>c.width) p.x=0;
        if(p.y<0) p.y=c.height; if(p.y>c.height) p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(0,255,136,${p.o})`; ctx.fill();
      });
      pts.forEach((a,i) => pts.slice(i+1).forEach(b => {
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<90){ ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle=`rgba(0,255,136,${.08*(1-d/90)})`; ctx.lineWidth=.6; ctx.stroke(); }
      }));
      raf=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}/>;
}

export function Typewriter({ words }) {
  const [wi, setWi]     = useState(0);
  const [text, setText] = useState("");
  const [del, setDel]   = useState(false);
  useEffect(() => {
    const word = words[wi]; let t;
    if (!del && text.length < word.length)       t = setTimeout(() => setText(word.slice(0,text.length+1)), 80);
    else if (!del && text.length === word.length) t = setTimeout(() => setDel(true), 2200);
    else if (del && text.length > 0)             t = setTimeout(() => setText(text.slice(0,-1)), 45);
    else if (del && text.length === 0)           { setDel(false); setWi((wi+1)%words.length); }
    return () => clearTimeout(t);
  }, [text, del, wi, words]);
  return (
    <span style={{ background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
      {text}<span style={{ color:G }}>|</span>
    </span>
  );
}

export function ContinuousTicker({ items = [], speed = 30, reverse = false }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow:"hidden", position:"relative", padding:".5rem 0" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div style={{
        display:"flex", gap:"1rem",
        animation:`${reverse?"tickerR":"ticker"} ${speed}s linear infinite`,
        animationPlayState:paused?"paused":"running",
        width:"max-content"
      }}>
        {doubled.map((item, i) => {
          const name  = typeof item==="string" ? item : item.name;
          const slug  = typeof item==="object" ? item.slug  : null;
          const color = typeof item==="object" ? item.color : null;
          return (
            <div key={i}
              style={{ display:"inline-flex", alignItems:"center", gap:8, padding:".45rem 1.1rem", background:"var(--card-bg,rgba(255,255,255,.06))", border:".5px solid var(--card-border,rgba(255,255,255,.1))", borderRadius:100, whiteSpace:"nowrap", transition:"all .25s", cursor:"default" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(0,255,136,.1)"; e.currentTarget.style.borderColor="rgba(0,255,136,.4)"; e.currentTarget.style.transform="translateY(-2px) scale(1.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="var(--card-bg,rgba(255,255,255,.06))"; e.currentTarget.style.borderColor="var(--card-border,rgba(255,255,255,.1))"; e.currentTarget.style.transform="none"; }}>
              <PlatformLogo name={name} slug={slug} color={color} size={18}/>
              <span style={{ fontSize:13, fontWeight:500, color:"var(--muted,rgba(255,255,255,.5))" }}>{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TestimonialTicker({ items = [] }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow:"hidden" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div style={{
        display:"flex", gap:"1.5rem",
        animation:"ticker 40s linear infinite",
        animationPlayState:paused?"paused":"running",
        width:"max-content"
      }}>
        {doubled.map((t, i) => (
          <a key={i} href={t.storeUrl||"#"} target={t.storeUrl?"_blank":"_self"} rel="noopener noreferrer"
            style={{
              width:310, flexShrink:0,
              background:"var(--card-bg,rgba(255,255,255,.06))",
              border:".5px solid rgba(0,255,136,.25)",
              borderTop:".5px solid rgba(0,255,136,.4)",
              borderRadius:16, padding:"1.2rem",
              textDecoration:"none", display:"block",
              transition:"transform .3s,border-color .3s,box-shadow .3s",
              position:"relative", overflow:"hidden"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-5px) scale(1.01)"; e.currentTarget.style.borderColor="rgba(0,255,136,.6)"; e.currentTarget.style.boxShadow="0 16px 40px rgba(0,255,136,.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor="rgba(0,255,136,.25)"; e.currentTarget.style.boxShadow="none"; }}>
            <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)", pointerEvents:"none" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".75rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                {t.storeLogo && <img src={t.storeLogo} alt={t.storeName} width="20" height="20" loading="lazy" style={{ borderRadius:4, objectFit:"contain", background:"#fff", padding:"2px", flexShrink:0 }} onError={e => e.target.style.display="none"}/>}
                <span style={{ fontSize:11, color:"var(--muted2,rgba(255,255,255,.4))", fontWeight:500 }}>{t.storeName}</span>
              </div>
              <span style={{ background:"rgba(0,255,136,.15)", border:".5px solid rgba(0,255,136,.5)", borderRadius:100, padding:"3px 10px", fontSize:10, color:"#00ff88", fontWeight:800 }}>{t.result}</span>
            </div>
            <div style={{ display:"flex", gap:2, marginBottom:".75rem" }}>
              {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize:13, color:"#FFD700" }}>★</span>)}
            </div>
            <p style={{ fontSize:13, color:"var(--muted,rgba(255,255,255,.5))", lineHeight:1.7, marginBottom:".9rem", fontStyle:"italic" }}>"{t.text}"</p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {t.avatar
                  ? <img src={t.avatar} alt={t.name} width="32" height="32" loading="lazy" style={{ borderRadius:"50%", objectFit:"cover", border:".5px solid rgba(0,255,136,.4)", flexShrink:0 }} onError={e => e.target.style.display="none"}/>
                  : <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(0,255,136,.15)", border:".5px solid rgba(0,255,136,.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:G, flexShrink:0 }}>{t.init||t.name?.[0]}</div>
                }
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:"var(--fg,#f0f0f0)", margin:0 }}>{t.name}</p>
                  <p style={{ fontSize:10, color:"var(--muted3,rgba(255,255,255,.3))", margin:0 }}>{t.storeCategory||t.role}</p>
                </div>
              </div>
              {t.storeUrl && <span style={{ fontSize:10, color:G, fontWeight:700 }}>Visit store →</span>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function VideoTips({ items = [] }) {
  const scrollRef = useRef(null);
  const [playing, setPlaying] = useState(null);
  const scroll = dir => { if (scrollRef.current) scrollRef.current.scrollBy({ left:dir*280, behavior:"smooth" }); };
  return (
    <div style={{ position:"relative" }}>
      <button onClick={() => scroll(-1)} style={{ position:"absolute", left:-16, top:"40%", transform:"translateY(-50%)", zIndex:10, width:36, height:36, borderRadius:"50%", background:"rgba(0,255,136,.12)", border:".5px solid rgba(0,255,136,.4)", color:G, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
      <button onClick={() => scroll(1)}  style={{ position:"absolute", right:-16, top:"40%", transform:"translateY(-50%)", zIndex:10, width:36, height:36, borderRadius:"50%", background:"rgba(0,255,136,.12)", border:".5px solid rgba(0,255,136,.4)", color:G, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
      <div ref={scrollRef} style={{ display:"flex", gap:"1.5rem", overflowX:"auto", scrollSnapType:"x mandatory", paddingBottom:"1rem", scrollbarWidth:"none" }}>
        {items.map((v, i) => (
          <div key={i}
            style={{ flexShrink:0, width:240, scrollSnapAlign:"start", background:"var(--card-bg,rgba(255,255,255,.06))", border:".5px solid var(--card-border,rgba(255,255,255,.1))", borderRadius:16, overflow:"hidden", transition:"transform .3s,border-color .3s" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.borderColor="rgba(0,255,136,.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor="var(--card-border,rgba(255,255,255,.1))"; }}>
            <div style={{ width:"100%", aspectRatio:"9/16", position:"relative", background:"#000" }}>
              {playing === i
                ? <iframe src={`https://www.youtube.com/embed/${v.videoId}?autoplay=1&rel=0`} title={v.title} allow="autoplay" allowFullScreen style={{ width:"100%", height:"100%", border:"none", position:"absolute", inset:0 }}/>
                : <>
                    <img src={v.thumb} alt={v.title} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", background:"rgba(0,0,0,.3)" }} onClick={() => setPlaying(i)}>
                      <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(255,0,0,.9)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="white"><path d="M6 4L16 10L6 16Z"/></svg>
                      </div>
                    </div>
                    <div style={{ position:"absolute", top:8, left:8, background:"rgba(0,0,0,.75)", borderRadius:100, padding:"2px 8px", fontSize:10, color:G, fontWeight:700 }}>{v.tag}</div>
                  </>
              }
            </div>
            <div style={{ padding:".9rem" }}>
              <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:".85rem", fontWeight:700, color:"var(--fg,#f0f0f0)", marginBottom:".3rem", lineHeight:1.4 }}>{v.title}</h3>
              <p style={{ fontSize:12, color:"var(--muted2,rgba(255,255,255,.4))", lineHeight:1.5, margin:0 }}>{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartnerCard({ partner }) {
  return (
    <div className="partner-card"
      onMouseEnter={e => { e.currentTarget.style.background="rgba(0,255,136,.08)"; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.borderColor="rgba(0,255,136,.4)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(0,255,136,.12)"; e.currentTarget.style.animation="none"; }}
      onMouseLeave={e => { e.currentTarget.style.background="var(--card-bg,rgba(255,255,255,.06))"; e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor="var(--card-border,rgba(255,255,255,.1))"; e.currentTarget.style.boxShadow="none"; }}>
      <PlatformLogo name={partner.name} slug={partner.slug} color={partner.color} size={28}/>
      <div>
        <p style={{ fontSize:14, fontWeight:600, color:"var(--fg,#f0f0f0)", margin:0 }}>{partner.name}</p>
        <p style={{ fontSize:11, color:"var(--muted3,rgba(255,255,255,.3))", margin:0 }}>Certified partner</p>
      </div>
      <div style={{ marginLeft:"auto", width:8, height:8, borderRadius:"50%", background:partner.color||G, animation:"pulse 2s ease-in-out infinite", flexShrink:0 }}/>
    </div>
  );
}

export function WhatsAppButton() {
  const msg = encodeURIComponent("Hi! I'd love to work with you.");
  return (
    <a href={`https://wa.me/19454076473?text=${msg}`} target="_blank" rel="noopener noreferrer"
      style={{ position:"fixed", bottom:24, right:24, zIndex:9999, width:56, height:56, borderRadius:"50%", background:"#25D366", boxShadow:"0 4px 20px rgba(37,211,102,.5)", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", transition:"transform .2s,box-shadow .2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform="scale(1.12)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(37,211,102,.65)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(37,211,102,.5)"; }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  );
}

export function Footer() {
  const ColLink = ({ to, children }) => (
    <Link to={to}
      style={{ display:"block", fontSize:13, color:"var(--muted,rgba(255,255,255,.5))", textDecoration:"none", marginBottom:".35rem", lineHeight:1.4, transition:"color .2s,transform .15s", minHeight:28 }}
      onMouseEnter={e => { e.target.style.color=G; e.target.style.transform="translateX(3px)"; }}
      onMouseLeave={e => { e.target.style.color="var(--muted,rgba(255,255,255,.5))"; e.target.style.transform="none"; }}>
      {children}
    </Link>
  );

  const ColHead = ({ children }) => (
    <p style={{ fontSize:10, color:"var(--muted3,rgba(255,255,255,.3))", letterSpacing:".12em", textTransform:"uppercase", fontWeight:700, marginBottom:".6rem", lineHeight:1 }}>{children}</p>
  );

  return (
    <footer style={{ padding:"2.5rem 1.2rem 1.5rem", borderTop:".5px solid var(--divider,rgba(255,255,255,.06))", background:"var(--bg,#040608)" }}>
      <style>{`
        .footer-inner{max-width:1100px;margin:0 auto;}
        .footer-brand{display:flex;align-items:flex-start;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;margin-bottom:1.6rem;padding-bottom:1.4rem;border-bottom:.5px solid var(--divider,rgba(255,255,255,.06));}
        .footer-cols{display:grid;grid-template-columns:1.1fr 1.4fr 1fr;gap:.8rem 2rem;margin-bottom:1.4rem;}
        .footer-legal{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;}
        @media(max-width:700px){.footer-cols{grid-template-columns:1fr;gap:1.6rem;}.footer-brand{flex-direction:column;gap:1rem;}}
      `}</style>
      <div className="footer-inner">
        <div className="footer-brand">
          <div style={{ flex:1, minWidth:180, maxWidth:300 }}>
            <Link to="/" style={{ textDecoration:"none", display:"inline-block", marginBottom:".7rem" }}><Logo size={36} textSize={13}/></Link>
            <p style={{ fontSize:13, color:"var(--muted,rgba(255,255,255,.5))", lineHeight:1.6, marginBottom:".8rem" }}>We don't run ads. We engineer ROAS.<br/>One system. Compounding results every month.</p>
            <a href={`https://wa.me/19454076473?text=${encodeURIComponent("Hi! I'd love to work with you.")}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:13, color:"#25D366", textDecoration:"none", transition:"transform .2s" }}
              onMouseEnter={e => e.currentTarget.style.transform="translateX(3px)"}
              onMouseLeave={e => e.currentTarget.style.transform="none"}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp us
            </a>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:".5rem" }}>
            <a href="https://calendly.com/bodeagencyofficial/30min" target="_blank" rel="noopener noreferrer"
              style={{ display:"inline-block", background:GG, color:"#040608", borderRadius:10, padding:".65rem 1.4rem", fontSize:14, fontWeight:700, textDecoration:"none", boxShadow:"0 4px 18px rgba(0,255,136,.35)", transition:"transform .2s,box-shadow .2s", whiteSpace:"nowrap" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(0,255,136,.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 18px rgba(0,255,136,.35)"; }}>
              Apply Now →
            </a>
            <p style={{ fontSize:12, color:"var(--muted3,rgba(255,255,255,.3))", margin:0 }}>Response within 24 hours.</p>
          </div>
        </div>
        <div className="footer-cols">
          <div>
            <ColHead>Pages</ColHead>
            <ColLink to="/">Home</ColLink>
            <ColLink to="/about">About</ColLink>
            <ColLink to="/pricing">Pricing</ColLink>
            <ColLink to="/past-projects">Past Projects</ColLink>
            <ColLink to="/blog">Blog</ColLink>
            <ColLink to="/contact">Contact</ColLink>
          </div>
          <div>
            <ColHead>Services</ColHead>
            {SERVICES.map(s => <ColLink key={s.id} to={`/services/${s.id}`}>{s.title}</ColLink>)}
          </div>
          <div>
            <ColHead>Get Started</ColHead>
            <ColLink to="/audit">Free Store Audit</ColLink>
            <ColLink to="/subscribe">Newsletter</ColLink>
            <a href="https://calendly.com/bodeagencyofficial/30min" target="_blank" rel="noopener noreferrer"
              style={{ display:"block", fontSize:13, color:"var(--muted,rgba(255,255,255,.5))", textDecoration:"none", marginBottom:".35rem", lineHeight:1.4, transition:"color .2s,transform .15s", minHeight:28 }}
              onMouseEnter={e => { e.currentTarget.style.color=G; e.currentTarget.style.transform="translateX(3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.color="var(--muted,rgba(255,255,255,.5))"; e.currentTarget.style.transform="none"; }}>
              Book a Call
            </a>
          </div>
        </div>
        <div style={{ borderTop:".5px solid var(--divider,rgba(255,255,255,.06))", paddingTop:"1rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".8rem" }}>
          <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:".5rem" }}>
            <p style={{ fontSize:11.5, color:"var(--muted3,rgba(255,255,255,.3))", margin:0 }}>© 2026 Bode Conversion Lab. All rights reserved.</p>
            <span style={{ fontSize:11.5, color:"var(--muted3,rgba(255,255,255,.3))" }}>·</span>
            <p style={{ fontSize:11.5, color:"var(--muted3,rgba(255,255,255,.3))", margin:0 }}>Built to convert. Engineered to scale.</p>
          </div>
          <div className="footer-legal">
            <Link to="/privacy"
              style={{ fontSize:11.5, color:"var(--muted3,rgba(255,255,255,.3))", textDecoration:"none", transition:"color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color=G}
              onMouseLeave={e => e.currentTarget.style.color="var(--muted3,rgba(255,255,255,.3))"}>
              Privacy Policy
            </Link>
            <span style={{ fontSize:11.5, color:"var(--muted3,rgba(255,255,255,.3))" }}>·</span>
            <Link to="/terms"
              style={{ fontSize:11.5, color:"var(--muted3,rgba(255,255,255,.3))", textDecoration:"none", transition:"color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color=G}
              onMouseLeave={e => e.currentTarget.style.color="var(--muted3,rgba(255,255,255,.3))"}>
              Terms of Service
            </Link>
            <span style={{ fontSize:11.5, color:"var(--muted3,rgba(255,255,255,.3))" }}>·</span>
            <button
              onClick={() => window.dispatchEvent(new Event("bcl-open-cookie-prefs"))}
              style={{ fontSize:11.5, color:"var(--muted3,rgba(255,255,255,.3))", textDecoration:"none", transition:"color .2s", background:"none", border:"none", padding:0, cursor:"pointer", fontFamily:"inherit" }}
              onMouseEnter={e => e.currentTarget.style.color=G}
              onMouseLeave={e => e.currentTarget.style.color="var(--muted3,rgba(255,255,255,.3))"}>
              Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
