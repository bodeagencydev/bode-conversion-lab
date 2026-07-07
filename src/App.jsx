import { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav, Footer, WhatsAppButton, ThemeToggle, ThemeContext } from "./components.jsx";
import { CursorSystem, MorphOrbs, ClickRipple, ScrollProgress, NoiseOverlay } from "./AnimationSystem.jsx";
import { usePageTracking } from "./NotificationSystem.js";
import NotFound from "./NotFound.jsx";
import PopupSystem from "./PopupSystem.jsx";

const Home        = lazy(() => import("./pages/Home.jsx"));
const About       = lazy(() => import("./pages/About.jsx"));
const CaseStudies = lazy(() => import("./pages/CaseStudies.jsx").then(m => ({ default: m.CaseStudies })));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudies.jsx").then(m => ({ default: m.CaseStudyDetail })));
const Pricing     = lazy(() => import("./pages/Pricing.jsx"));
const Blog        = lazy(() => import("./pages/Blog.jsx").then(m => ({ default: m.Blog })));
const BlogPost    = lazy(() => import("./pages/Blog.jsx").then(m => ({ default: m.BlogPost })));
const Contact     = lazy(() => import("./pages/Contact.jsx"));
const Audit       = lazy(() => import("./pages/Audit.jsx"));
const Subscribe   = lazy(() => import("./pages/Subscribe.jsx"));
const Admin       = lazy(() => import("./pages/Admin.jsx"));

function PageSkeleton() {
  return (
    <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
        <div style={{ width:40, height:40, position:"relative" }}>
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid #00ff88", borderTopColor:"transparent", animation:"auditSpin .8s linear infinite" }}/>
          <div style={{ position:"absolute", inset:6, borderRadius:"50%", border:"1px solid #00ff88", borderBottomColor:"transparent", animation:"auditSpin 1.2s linear infinite reverse" }}/>
        </div>
        <p style={{ fontSize:12, color:"#00ff88", fontFamily:"'Syne',sans-serif", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase" }}>Loading...</p>
      </div>
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

  const bg = dark ? "#040608" : "#F8F9FA"; 
  const fg = dark ? "#f0f0f0" : "#0A0F12"; 
  const G = dark ? "#00FF88" : "#00A35C";

  // Force document background color directly via effect safely
  useEffect(() => {
    document.body.style.backgroundColor = bg;
  }, [bg]);

  return (
    <div
      data-theme={dark ? "dark" : "light"}
      style={{ fontFamily:"'Inter','Helvetica Neue',sans-serif", background:bg, color:fg, overflowX:"hidden", minHeight:"100vh", transition:"background .4s,color .4s", position:"relative" }}>

      <CursorSystem />
      <MorphOrbs />
      <ClickRipple />
      <ScrollProgress />
      <NoiseOverlay opacity={dark ? 0.025 : 0.015} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; overflow-x:hidden; }
        [lang], font { color:inherit !important; }
        ::selection { background:${G}; color:${dark ? "#040608" : "#ffffff"}; }
        div::-webkit-scrollbar { display:none; }

        @keyframes float1{0%,100%{transform:translateY(0) rotate(0deg);}33%{transform:translateY(-22px) rotate(8deg);}66%{transform:translateY(-10px) rotate(-5deg);}}
        @keyframes float2{0%,100%{transform:translateY(0) translateX(0);}50%{transform:translateY(-16px) translateX(8px);}}
        @keyframes breathe{0%,100%{transform:scale(1);opacity:.88;}50%{transform:scale(1.045);opacity:1;}}
        @keyframes pulse{0%,100%{opacity:.4;}50%{opacity:1;}}
        @keyframes ticker{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
        @keyframes tickerR{0%{transform:translateX(-50%);}100%{transform:translateX(0);}}
        @keyframes heroFadeUp{from{opacity:0;transform:translateY(36px) scale(.97);}to{opacity:1;transform:none;}}
        @keyframes auditSpin{to{transform:rotate(360deg);}}

        .green-text { color:${G} !important; }
        .green-border { border-color:${G} !important; }

        .btn-g{
          background:linear-gradient(135deg, ${G}, ${dark ? "#00e676" : "#00b869"});
          color:${dark ? "#040608" : "#ffffff"};border:none;border-radius:10px;
          padding:.85rem 1.8rem;font-size:15px;font-weight:700;
          cursor:pointer;display:inline-block;text-decoration:none;
          box-shadow:0 4px 28px ${dark ? "rgba(0,255,136,.4)" : "rgba(0,163,92,.3)"};
          transition:transform .5s cubic-bezier(.22,1,.36,1);
        }
        .btn-g:hover{transform:translateY(-3px) scale(1.03);}

        .btn-ghost{
          background:${dark ? "rgba(255,255,255,.06)" : "rgba(10,15,18,.04)"};
          color:${dark ? "rgba(255,255,255,.7)" : "rgba(10,15,18,.75)"};
          border:.5px solid ${dark ? "rgba(255,255,255,.15)" : "rgba(10,15,18,.15)"};
          border-radius:10px;padding:.85rem 1.8rem;font-size:15px;
          transition:all .5s cubic-bezier(.22,1,.36,1);
          display:inline-block;text-decoration:none;
        }

        .glass{
          background:${dark ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.85)"};
          border:.5px solid ${dark ? "rgba(0,255,136,.18)" : "rgba(10,15,18,.08)"};
          border-radius:16px;position:relative;
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