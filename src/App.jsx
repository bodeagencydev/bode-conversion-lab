import { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav, Footer, WhatsAppButton, ThemeToggle, ThemeContext } from "./components.jsx";
import { CursorSystem, MorphOrbs, ClickRipple, ScrollProgress, NoiseOverlay } from "./AnimationSystem.jsx";
import { usePageTracking } from "./NotificationSystem.js";
import NotFound from "./NotFound.jsx";
import PopupSystem from "./PopupSystem.jsx";

/* ── LAZY LOADING ── */
const Home            = lazy(() => import("./pages/Home.jsx"));
const About           = lazy(() => import("./pages/About.jsx"));
const CaseStudies     = lazy(() => import("./pages/CaseStudies.jsx").then(m => ({ default: m.CaseStudies })));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudies.jsx").then(m => ({ default: m.CaseStudyDetail })));
const Pricing         = lazy(() => import("./pages/Pricing.jsx"));
const Blog            = lazy(() => import("./pages/Blog.jsx").then(m => ({ default: m.Blog })));
const BlogPost        = lazy(() => import("./pages/Blog.jsx").then(m => ({ default: m.BlogPost })));
const Contact         = lazy(() => import("./pages/Contact.jsx"));
const Audit           = lazy(() => import("./pages/Audit.jsx"));
const Subscribe       = lazy(() => import("./pages/Subscribe.jsx"));
const Admin           = lazy(() => import("./pages/Admin.jsx"));

/* ── BRAND COLORS ── */
const NEON_GREEN  = "#00e676";  // richer, deeper neon — matches your reference
const GREEN_DARK  = "#00b85c";  // darker variant for gradients
const GOLD_LIGHT  = "#F5D020";  // bright molten gold center
const GOLD_DARK   = "#C8880A";  // deep amber for gradient edge

/* ── PAGE SKELETON ── */
function PageSkeleton() {
  return (
    <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
        <div style={{ width:40, height:40, position:"relative" }}>
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:`2px solid ${NEON_GREEN}`, borderTopColor:"transparent", animation:"auditSpin .8s linear infinite" }}/>
          <div style={{ position:"absolute", inset:6, borderRadius:"50%", border:`1px solid ${NEON_GREEN}`, borderBottomColor:"transparent", animation:"auditSpin 1.2s linear infinite reverse" }}/>
        </div>
        <p style={{ fontSize:12, color:`${NEON_GREEN}99`, fontFamily:"'Syne',sans-serif", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase" }}>Loading...</p>
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
    try { localStorage.setItem("bcl-theme", next ? "dark" : "light"); } catch {}
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

  /* ── Light theme: molten gold gradient ── */
  const bg = dark
    ? "#040608"
    : `radial-gradient(ellipse at 40% 30%, ${GOLD_LIGHT} 0%, #E8A800 45%, ${GOLD_DARK} 100%)`;
  const fg = dark ? "#f0f0f0" : "#1A1005";

  return (
    <div
      data-theme={dark ? "dark" : "light"}
      style={{
        fontFamily:"'Inter','Helvetica Neue',sans-serif",
        background: bg,
        color: fg,
        overflowX:"hidden",
        minHeight:"100vh",
        transition:"background .4s,color .4s",
        position:"relative"
      }}>

      <CursorSystem />
      <MorphOrbs />
      <ClickRipple />
      <ScrollProgress />
      <NoiseOverlay opacity={dark ? 0.025 : 0.02} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; overflow-x:hidden; }
        body {
          overflow-x:hidden;
          background: ${dark ? "#040608" : `radial-gradient(ellipse at 40% 30%, ${GOLD_LIGHT} 0%, #E8A800 45%, ${GOLD_DARK} 100%)`} !important;
          min-height: 100vh;
        }
        [lang], font { color:inherit !important; }
        ::selection { background:${NEON_GREEN}; color:#040608; }
        div::-webkit-scrollbar { display:none; }

        /* ── KEYFRAMES ── */
        @keyframes float1{0%,100%{transform:translateY(0) rotate(0deg);}33%{transform:translateY(-22px) rotate(8deg);}66%{transform:translateY(-10px) rotate(-5deg);}}
        @keyframes float2{0%,100%{transform:translateY(0) translateX(0);}50%{transform:translateY(-16px) translateX(8px);}}
        @keyframes breathe{0%,100%{transform:scale(1);opacity:.88;}50%{transform:scale(1.045);opacity:1;}}
        @keyframes pulse{0%,100%{opacity:.4;}50%{opacity:1;}}
        @keyframes glowPulse{
          0%,100%{box-shadow:0 0 18px rgba(0,230,118,.25),0 4px 22px rgba(0,230,118,.32);}
          50%{box-shadow:0 0 40px rgba(0,230,118,.6),0 8px 40px rgba(0,230,118,.6);}
        }
        @keyframes mobilePulse{
          0%,100%{box-shadow:0 0 14px rgba(0,230,118,.35);}
          50%{box-shadow:0 0 28px rgba(0,230,118,.7);}
        }
        @keyframes ticker{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
        @keyframes tickerR{0%{transform:translateX(-50%);}100%{transform:translateX(0);}}
        @keyframes scan{0%{top:0%;opacity:0;}10%{opacity:1;}90%{opacity:.15;}100%{top:100%;opacity:0;}}
        @keyframes heroFadeUp{from{opacity:0;transform:translateY(36px) scale(.97);}to{opacity:1;transform:none;}}
        @keyframes glow{
          0%,100%{box-shadow:0 0 18px rgba(0,230,118,.28);}
          50%{box-shadow:0 0 42px rgba(0,230,118,.65);}
        }
        @keyframes auditSpin{to{transform:rotate(360deg);}}
        @keyframes wordUp{from{opacity:0;transform:translateY(100%) rotate(3deg);}to{opacity:1;transform:none;}}
        @keyframes staggerIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:none;}}
        @keyframes criticalPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,59,59,.4);}50%{box-shadow:0 0 0 12px rgba(255,59,59,0);}}
        @keyframes greenGlow{
          0%,100%{box-shadow:0 0 20px rgba(0,230,118,.3),inset 0 0 20px rgba(0,230,118,.05);}
          50%{box-shadow:0 0 50px rgba(0,230,118,.6),inset 0 0 30px rgba(0,230,118,.1);}
        }

        /* ── BUTTONS ── */
        .btn-g{
          background:linear-gradient(135deg,${NEON_GREEN},${GREEN_DARK});
          color:#040608;border:none;border-radius:10px;
          padding:.85rem 1.8rem;font-size:15px;font-weight:700;
          cursor:pointer;font-family:inherit;
          box-shadow:0 4px 22px rgba(0,230,118,.4);
          display:inline-block;text-decoration:none;
          transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s;
          position:relative;overflow:hidden;
          min-height:44px;
        }
        .btn-g::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);transition:left .55s cubic-bezier(.22,1,.36,1);}
        .btn-g:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 14px 44px rgba(0,230,118,.7);}
        .btn-g:hover::after{left:140%;}
        @media(hover:hover){.btn-g{animation:glowPulse 3s ease-in-out infinite;}}
        .btn-g:hover{animation:none;}

        .btn-ghost{
          background:${dark?"rgba(255,255,255,.06)":"rgba(26,16,5,.07)"};
          color:${dark?"rgba(255,255,255,.7)":"rgba(26,16,5,.8)"};
          border:.5px solid ${dark?"rgba(255,255,255,.15)":"rgba(26,16,5,.25)"};
          border-radius:10px;padding:.85rem 1.8rem;font-size:15px;font-weight:500;
          cursor:pointer;font-family:inherit;
          transition:all .5s cubic-bezier(.22,1,.36,1);
          display:inline-block;text-decoration:none;min-height:44px;
        }
        .btn-ghost:hover{
          background:${dark?"rgba(255,255,255,.1)":"rgba(26,16,5,.12)"};
          border-color:${NEON_GREEN}66;
          color:${dark?"#fff":"#1A1005"};
          transform:translateY(-2px);
        }

        /* ── DIVIDER ── */
        .divider{border:none;border-top:.5px solid ${dark?"rgba(255,255,255,.06)":"rgba(26,16,5,.18)"};}

        /* ── GLASS CARDS ── */
        .glass{
          background:${dark
            ? "linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.02))"
            : "linear-gradient(135deg,rgba(255,255,255,.45),rgba(255,255,255,.18))"};
          border:.5px solid ${dark?"rgba(255,255,255,.12)":"rgba(26,16,5,.18)"};
          border-top:.5px solid ${dark?"rgba(255,255,255,.22)":"rgba(255,255,255,.75)"};
          border-radius:16px;position:relative;overflow:hidden;
          transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s,border-color .3s;
        }
        .glass::before{content:'';position:absolute;top:0;left:10%;right:10%;height:1px;
          background:${dark
            ? `linear-gradient(90deg,transparent,rgba(0,230,118,.3),transparent)`
            : "linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent)"};
        }
        .glass:hover{
          transform:translateY(-6px) scale(1.01);
          box-shadow:0 24px 56px rgba(0,230,118,.15),0 4px 16px rgba(0,0,0,.08);
          border-color:${NEON_GREEN}55 !important;
        }

        /* ── STAT CARDS ── */
        .stat-card{
          background:${dark?"rgba(255,255,255,.04)":"rgba(255,255,255,.32)"};
          border:.5px solid ${dark?"rgba(255,255,255,.08)":"rgba(26,16,5,.15)"};
          border-radius:16px;padding:1.8rem 1.2rem;text-align:center;
          animation:breathe 4.5s ease-in-out infinite;
          transition:border-color .3s,transform .5s cubic-bezier(.22,1,.36,1),box-shadow .3s;
        }
        .stat-card:nth-child(2){animation-delay:1s;}
        .stat-card:nth-child(3){animation-delay:2s;}
        .stat-card:hover{
          border-color:${NEON_GREEN}88;
          transform:translateY(-8px) scale(1.04);
          box-shadow:0 20px 50px rgba(0,230,118,.2);
          animation:none;
        }

        /* ── OFFER CARDS ── */
        .offer-card{
          background:${dark
            ? "linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02))"
            : "linear-gradient(135deg,rgba(255,255,255,.42),rgba(255,255,255,.18))"};
          border:.5px solid ${dark?"rgba(255,255,255,.1)":"rgba(26,16,5,.16)"};
          border-radius:20px;padding:2rem;
          transition:transform .5s cubic-bezier(.22,1,.36,1),border-color .3s,box-shadow .5s;
          position:relative;overflow:hidden;
        }
        .offer-card:hover{transform:translateY(-8px) scale(1.01);box-shadow:0 24px 60px rgba(0,0,0,.1);}
        .offer-card.feat{
          border-color:${NEON_GREEN}77 !important;
          background:linear-gradient(135deg,rgba(0,230,118,.1),rgba(0,184,92,.04)) !important;
          animation:glowPulse 3s ease-in-out infinite;
        }
        .offer-card.feat:hover{animation:none;}

        /* ── PARTNER CARDS ── */
        .partner-card{
          background:${dark?"rgba(255,255,255,.04)":"rgba(255,255,255,.32)"};
          border:.5px solid ${dark?"rgba(255,255,255,.1)":"rgba(26,16,5,.14)"};
          border-radius:14px;padding:1rem 1.5rem;
          display:flex;align-items:center;gap:10px;
          animation:breathe 5.5s ease-in-out infinite;
          transition:all .5s cubic-bezier(.22,1,.36,1);
          min-height:44px;
        }
        .partner-card:nth-child(2){animation-delay:1.1s;}
        .partner-card:nth-child(3){animation-delay:2.2s;}
        .partner-card:hover{
          background:rgba(0,230,118,.1) !important;
          border-color:${NEON_GREEN}66 !important;
          transform:translateY(-5px) scale(1.02);
          box-shadow:0 14px 36px rgba(0,230,118,.18);
          animation:none;
        }

        /* ── TESTIMONIAL / REVIEW CARDS ── */
        .testimonial-card{
          background:${dark
            ? "linear-gradient(135deg,rgba(0,230,118,.08),rgba(0,184,92,.03))"
            : "linear-gradient(135deg,rgba(0,200,90,.12),rgba(0,160,70,.06))"};
          border:.5px solid ${dark?"rgba(0,230,118,.2)":"rgba(0,180,80,.3)"};
          border-top:.5px solid ${dark?"rgba(0,230,118,.45)":"rgba(0,230,118,.55)"};
          border-radius:16px;
        }

        /* ── CARD 3D ── */
        .card3d{transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s;}
        .card3d:hover{
          transform:perspective(900px) rotateY(6deg) rotateX(-4deg) scale(1.03);
          box-shadow:0 24px 64px rgba(0,0,0,.22),0 0 0 1px ${NEON_GREEN}33;
        }

        /* ── GPU HINTS ── */
        .glass,.card3d,.stat-card,.offer-card,.partner-card,.btn-g,.btn-ghost{will-change:transform;}

        /* ── TOUCH TARGETS ── */
        a,button,[role=button]{min-height:44px;}
        @media(max-width:768px){a,button{min-height:48px;}}

        /* ── TYPOGRAPHY ── */
        h1,h2,h3,h4,p,span,li{color:inherit;}

        /* ── RESPONSIVE ── */
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
            <Route path="/case-studies"     element={<CaseStudies />} />
            <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
            <Route path="/pricing"          element={<Pricing />} />
            <Route path="/blog"             element={<Blog />} />
            <Route path="/blog/:id"         element={<BlogPost />} />
            <Route path="/contact"          element={<Contact />} />
            <Route path="/audit"            element={<Audit />} />
            <Route path="/subscribe"        element={<Subscribe />} />
            <Route path="/admin"            element={<Admin />} />
            <Route path="*"                 element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
      <WhatsAppButton />
      <PopupSystem />
      <ThemeToggle />
    </div>
  );
}