import { useState, Suspense, lazy, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav, Footer, WhatsAppButton, ThemeToggle, ThemeContext } from "./components.jsx";
import { CursorSystem, MorphOrbs, ClickRipple, ScrollProgress, NoiseOverlay } from "./AnimationSystem.jsx";
import { usePageTracking } from "./NotificationSystem.js";
import NotFound from "./NotFound.jsx";
import PopupSystem from "./PopupSystem.jsx";

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

function PageSkeleton() {
  return (
    <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:30, height:30, borderRadius:"50%", border:"2px solid rgba(0,255,136,.15)", borderTopColor:"#00ff88", animation:"spin 1s linear infinite" }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const toggle = () => setDark(!dark);

  // Syncs the dynamic background toggle without overriding your layout styles
  useEffect(() => {
    document.documentElement.style.setProperty('--bg-color', dark ? '#040608' : '#F8F9FA');
    document.documentElement.style.setProperty('--text-color', dark ? '#f0f0f0' : '#0A0F12');
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

function AppInner() {
  const { dark } = useContext(ThemeContext);
  usePageTracking();

  return (
    <div style={{ position:"relative", overflow:"hidden", minHeight:"100vh" }}>
      <ScrollProgress />
      <CursorSystem />
      <NoiseOverlay />
      <ClickRipple />
      <MorphOrbs dark={dark} />

      <style>{`
        /* Your Global Brand Utilities */
        .glass {
          background: ${dark ? "linear-gradient(135deg,rgba(255,255,255,.03),rgba(255,255,255,.01))" : "linear-gradient(135deg,rgba(255,255,255,.8),rgba(255,255,255,.4))"};
          backdrop-filter: blur(16px);
          border: .5px solid ${dark ? "rgba(255,255,255,.06)" : "rgba(10,15,18,.08)"};
        }
        .btn-g {
          background: ${dark ? "linear-gradient(135deg,#00ff88,#00e676,#00cc6a)" : "linear-gradient(135deg,#00A35C,#00b869,#009957)"};
          color: ${dark ? "#040608" : "#ffffff"} !important;
          font-weight: 700;
          padding: .75rem 1.8rem;
          border-radius: 12px;
          text-decoration: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          transition: transform .2s, box-shadow .2s;
          box-shadow: ${dark ? "0 4px 20px rgba(0,255,136,.3)" : "0 4px 14px rgba(0,163,92,.2)"};
        }
        .btn-g:hover {
          transform: translateY(-2px);
          box-shadow: ${dark ? "0 8px 32px rgba(0,255,136,.5)" : "0 6px 20px rgba(0,163,92,.35)"};
        }
        .btn-ghost {
          background: none;
          border: .5px solid ${dark ? "rgba(0,255,136,.4)" : "rgba(0,163,92,.4)"};
          color: ${dark ? "#00ff88" : "#00A35C"} !important;
          font-weight: 600;
          padding: .72rem 1.6rem;
          border-radius: 12px;
          text-decoration: none;
          font-size: 13.5px;
          display: inline-flex;
          align-items: center;
          transition: all .2s;
        }
        .btn-ghost:hover {
          background: ${dark ? "rgba(0,255,136,.08)" : "rgba(0,163,92,.05)"};
          transform: translateY(-1px);
        }
        .divider {
          border: 0;
          height: .5px;
          background: ${dark ? "linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent)" : "linear-gradient(90deg,transparent,rgba(10,15,18,.1),transparent)"};
          margin: 0;
        }
        .stat-card {
          padding: 2rem;
          background: ${dark ? "rgba(255,255,255,.01)" : "rgba(255,255,255,.6)"};
          border: .5px solid ${dark ? "rgba(255,255,255,.05)" : "rgba(10,15,18,.08)"};
          border-radius: 20px;
          text-align: center;
          backdrop-filter: blur(10px);
        }
        .partner-card {
          display: flex;
          align-items: center;
          gap: .9rem;
          padding: 1.1rem;
          background: ${dark ? "rgba(0,255,136,.04)" : "rgba(255,255,255,.6)"};
          border: .5px solid ${dark ? "rgba(0,255,136,.14)" : "rgba(10,15,18,.08)"};
          border-radius: 14px;
          transition: all .25s cubic-bezier(.22,1,.36,1);
        }
        @media(max-width:768px){
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