import { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav, Footer, WhatsAppButton, ThemeToggle, ThemeContext, CookieConsent, hasCookieConsent } from "./components.jsx";
import { CursorSystem, ClickRipple, ScrollProgress, NoiseOverlay } from "./AnimationSystem.jsx";
import { usePageTracking } from "./NotificationSystem.js";
import NotFound from "./NotFound.jsx";
import PopupSystem from "./PopupSystem.jsx";

const Home            = lazy(() => import("./pages/Home.jsx"));
const About           = lazy(() => import("./pages/About.jsx"));
const ServiceDetail   = lazy(() => import("./pages/ServiceDetail.jsx"));
const PastProjects       = lazy(() => import("./pages/PastProjects.jsx").then(m => ({ default: m.PastProjects })));
const PastProjectDetail  = lazy(() => import("./pages/PastProjects.jsx").then(m => ({ default: m.PastProjectDetail })));
const Pricing         = lazy(() => import("./pages/Pricing.jsx"));
const Blog            = lazy(() => import("./pages/Blog.jsx").then(m => ({ default: m.Blog })));
const BlogPost        = lazy(() => import("./pages/Blog.jsx").then(m => ({ default: m.BlogPost })));
const Contact         = lazy(() => import("./pages/Contact.jsx"));
const Audit           = lazy(() => import("./pages/Audit.jsx"));
const Subscribe       = lazy(() => import("./pages/Subscribe.jsx"));
const Admin           = lazy(() => import("./pages/Admin.jsx"));
const Privacy         = lazy(() => import("./pages/Privacy.jsx"));
const Terms           = lazy(() => import("./pages/Terms.jsx"));

function PageSkeleton() {
  return (
    <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
        <div style={{ width:40, height:40, position:"relative" }}>
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid #00ff88", borderTopColor:"transparent", animation:"auditSpin .8s linear infinite" }}/>
          <div style={{ position:"absolute", inset:6, borderRadius:"50%", border:"1px solid #00ff88", borderBottomColor:"transparent", animation:"auditSpin 1.2s linear infinite reverse" }}/>
        </div>
        <p style={{ fontSize:12, color:"#00ff88", fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase" }}>Loading...</p>
      </div>
      <style>{`@keyframes auditSpin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => {
    try { const s = localStorage.getItem("bcl-theme"); if (s !== null) return s === "dark"; } catch {}
    return true;
  });
  const toggle = () => setDark(v => {
    const next = !v;
    // Only persist the theme choice once the visitor has accepted the
    // preference cookie — otherwise it just lives in memory for this visit.
    if (hasCookieConsent()) {
      try { localStorage.setItem("bcl-theme", next ? "dark" : "light"); } catch {}
    }
    return next;
  });
  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      <BrowserRouter>
        <AppInner dark={dark} />
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

function AppInner({ dark }) {
  usePageTracking();

  return (
    <div
      data-theme={dark ? "dark" : "light"}
      style={{ fontFamily:"'IBM Plex Sans','Helvetica Neue',sans-serif", background:"var(--bg)", color:"var(--fg)", overflowX:"hidden", minHeight:"100vh", transition:"background .4s,color .4s", position:"relative" }}>

      <CursorSystem />
      <ClickRipple />
      <ScrollProgress />
      <NoiseOverlay opacity={dark ? 0.02 : 0.012} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        :root {
          --bg:           #0B0D0C;
          --fg:           #EFECE6;
          --g:            #00ff88;
          --gg:           linear-gradient(135deg,#00ff88,#00cc6a);
          --rust:         #FF5A3C;
          --card-bg:      rgba(239,236,230,.05);
          --card-border:  rgba(239,236,230,.09);
          --muted:        rgba(239,236,230,.55);
          --muted2:       rgba(239,236,230,.42);
          --muted3:       rgba(239,236,230,.3);
          --ghost-bg:     rgba(239,236,230,.05);
          --ghost-fg:     rgba(239,236,230,.72);
          --ghost-border: rgba(239,236,230,.16);
          --divider:      rgba(239,236,230,.09);
        }

        [data-theme="light"] {
          --bg:           #EDEAE3;
          --fg:           #17140F;
          --g:            #00A35C;
          --gg:           linear-gradient(135deg,#00A35C,#00b869);
          --rust:         #C74B32;
          --card-bg:      rgba(23,20,15,.035);
          --card-border:  rgba(23,20,15,.1);
          --muted:        rgba(23,20,15,.62);
          --muted2:       rgba(23,20,15,.5);
          --muted3:       rgba(23,20,15,.4);
          --ghost-bg:     rgba(23,20,15,.045);
          --ghost-fg:     rgba(23,20,15,.75);
          --ghost-border: rgba(23,20,15,.16);
          --divider:      rgba(23,20,15,.1);
        }

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; overflow-x:hidden; }
        body { overflow-x:hidden; background:var(--bg) !important; color:var(--fg) !important; }
        [lang], font { color:inherit !important; }
        ::selection { background:#00ff88; color:#040608; }
        div::-webkit-scrollbar { display:none; }
        h1,h2,h3,h4,p,span,li { color:inherit; }

        @keyframes float1{0%,100%{transform:translateY(0) rotate(0deg);}33%{transform:translateY(-22px) rotate(8deg);}66%{transform:translateY(-10px) rotate(-5deg);}}
        @keyframes float2{0%,100%{transform:translateY(0) translateX(0);}50%{transform:translateY(-16px) translateX(8px);}}
        @keyframes breathe{0%,100%{transform:scale(1);opacity:.88;}50%{transform:scale(1.045);opacity:1;}}
        @keyframes pulse{0%,100%{opacity:.4;}50%{opacity:1;}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 18px rgba(0,255,136,.18),0 4px 22px rgba(0,255,136,.25);}50%{box-shadow:0 0 40px rgba(0,255,136,.48),0 8px 40px rgba(0,255,136,.48);}}
        @keyframes mobilePulse{0%,100%{box-shadow:0 0 14px rgba(0,255,136,.3);}50%{box-shadow:0 0 28px rgba(0,255,136,.6);}}
        @keyframes ticker{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
        @keyframes tickerR{0%{transform:translateX(-50%);}100%{transform:translateX(0);}}
        @keyframes scan{0%{top:0%;opacity:0;}10%{opacity:1;}90%{opacity:.15;}100%{top:100%;opacity:0;}}
        @keyframes heroFadeUp{from{opacity:0;transform:translateY(36px) scale(.97);}to{opacity:1;transform:none;}}
        @keyframes glow{0%,100%{box-shadow:0 0 18px rgba(0,255,136,.22);}50%{box-shadow:0 0 42px rgba(0,255,136,.55);}}
        @keyframes auditSpin{to{transform:rotate(360deg);}}
        @keyframes wordUp{from{opacity:0;transform:translateY(100%) rotate(3deg);}to{opacity:1;transform:none;}}
        @keyframes staggerIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:none;}}
        @keyframes criticalPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,59,59,.4);}50%{box-shadow:0 0 0 12px rgba(255,59,59,0);}}

        .btn-g{
          background:linear-gradient(135deg,#00ff88,#00e676,#00cc6a);
          color:#040608;border:none;border-radius:10px;
          padding:.85rem 1.8rem;font-size:15px;font-weight:700;
          cursor:pointer;font-family:inherit;
          box-shadow:0 4px 22px rgba(0,255,136,.35);
          display:inline-block;text-decoration:none;
          transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s;
          position:relative;overflow:hidden;min-height:44px;
        }
        .btn-g::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.32),transparent);transition:left .55s cubic-bezier(.22,1,.36,1);}
        .btn-g:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 14px 44px rgba(0,255,136,.5);}
        .btn-g:hover::after{left:140%;}

        .btn-ghost{
          background:var(--ghost-bg);
          color:var(--ghost-fg);
          border:.5px solid var(--ghost-border);
          border-radius:10px;padding:.85rem 1.8rem;font-size:15px;font-weight:500;
          cursor:pointer;font-family:inherit;
          transition:all .5s cubic-bezier(.22,1,.36,1);
          display:inline-block;text-decoration:none;min-height:44px;
        }
        .btn-ghost:hover{border-color:rgba(0,255,136,.4);color:var(--fg);transform:translateY(-2px);}

        .divider{border:none;border-top:.5px solid var(--divider);}

        .glass{
          background:var(--card-bg);
          border:.5px solid var(--card-border);
          border-radius:10px;position:relative;overflow:hidden;
          transition:transform .4s cubic-bezier(.22,1,.36,1),box-shadow .4s,border-color .3s;
        }
        .glass:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,255,136,.08);border-color:rgba(0,255,136,.28)!important;}

        .stat-card{
          background:var(--card-bg);
          border:.5px solid var(--card-border);
          border-radius:12px;padding:1.8rem 1.2rem;text-align:center;
          transition:border-color .3s,transform .5s cubic-bezier(.22,1,.36,1),box-shadow .3s;
        }
        .stat-card:hover{border-color:rgba(0,255,136,.5);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,255,136,.12);}

        .offer-card{
          background:var(--card-bg);
          border:.5px solid var(--card-border);
          border-radius:12px;padding:2rem;
          transition:transform .5s cubic-bezier(.22,1,.36,1),border-color .3s,box-shadow .5s;
          position:relative;overflow:hidden;
        }
        .offer-card:hover{transform:translateY(-6px);box-shadow:0 20px 50px rgba(0,0,0,.08);}
        .offer-card.feat{border-color:rgba(0,255,136,.45)!important;background:linear-gradient(135deg,rgba(0,255,136,.07),rgba(0,204,106,.025))!important;}

        .partner-card{
          background:var(--card-bg);
          border:.5px solid var(--card-border);
          border-radius:10px;padding:1rem 1.5rem;
          display:flex;align-items:center;gap:10px;
          transition:all .4s cubic-bezier(.22,1,.36,1);
          min-height:44px;
        }
        .partner-card:hover{background:rgba(0,255,136,.06)!important;border-color:rgba(0,255,136,.35)!important;transform:translateY(-3px);}

        .card3d{transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s;}
        .card3d:hover{transform:perspective(900px) rotateY(6deg) rotateX(-4deg) scale(1.03);box-shadow:0 24px 64px rgba(0,0,0,.18),0 0 0 1px rgba(0,255,136,.18);}

        .glass,.card3d,.stat-card,.offer-card,.partner-card,.btn-g,.btn-ghost{will-change:transform;}

        a,button,[role=button]{min-height:44px;}
        @media(max-width:768px){a,button{min-height:48px;}}

        @media(min-width:769px){.nav-desktop{display:flex!important;}.nav-hamburger{display:none!important;}}
        @media(max-width:768px){
          .nav-desktop{display:none!important;}.nav-hamburger{display:flex!important;}
          .hero-t{font-size:clamp(1.8rem,7vw,2.5rem)!important;}
          .how-grid,.about-grid,.offer-grid,.partner-grid,.stat-grid,.hero-cards{grid-template-columns:1fr!important;}
          .float-shape{display:none!important;}
          .btn-g,.btn-ghost{width:100%!important;text-align:center!important;display:block!important;margin-bottom:8px;}
        }
      `}</style>

      <Nav />
      <div style={{ position:"relative", zIndex:1 }}>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/"                 element={<Home />} />
            <Route path="/about"            element={<About />} />
            <Route path="/services/:id"     element={<ServiceDetail />} />
            <Route path="/past-projects"     element={<PastProjects />} />
            <Route path="/past-projects/:id" element={<PastProjectDetail />} />
            <Route path="/pricing"          element={<Pricing />} />
            <Route path="/blog"             element={<Blog />} />
            <Route path="/blog/:id"         element={<BlogPost />} />
            <Route path="/contact"          element={<Contact />} />
            <Route path="/audit"            element={<Audit />} />
            <Route path="/subscribe"        element={<Subscribe />} />
            <Route path="/admin"            element={<Admin />} />
            <Route path="/privacy"          element={<Privacy />} />
            <Route path="/terms"            element={<Terms />} />
            <Route path="*"                 element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
      <WhatsAppButton />
      <PopupSystem />
      <CookieConsent />
      <ThemeToggle />
    </div>
  );
}