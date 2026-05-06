import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav, Footer, WhatsAppButton, ThemeToggle, ThemeContext } from "./components.jsx";
import { MagneticCursor, FloatingOrbs, ClickRipple, ScrollProgress } from "./AnimationSystem.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import { CaseStudies, CaseStudyDetail } from "./pages/CaseStudies.jsx";
import Pricing from "./pages/Pricing.jsx";
import { Blog, BlogPost } from "./pages/Blog.jsx";
import Contact from "./pages/Contact.jsx";
import Audit from "./pages/Audit.jsx";
import Subscribe from "./pages/Subscribe.jsx";

export default function App() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("bcl-theme");
      if (saved !== null) return saved === "dark";
    } catch {}
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
  const bg = dark ? "#040608" : "#f8f8f5";
  const fg = dark ? "#f0f0f0" : "#0a0a0a";

  return (
    <div style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", background: bg, color: fg, overflowX: "hidden", minHeight: "100vh", transition: "background .4s, color .4s", position: "relative" }}>

      {/* ── GLOBAL ANIMATION LAYER ── */}
      <MagneticCursor />
      <FloatingOrbs />
      <ClickRipple />
      <ScrollProgress />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500&display=swap');
        *{ box-sizing:border-box; margin:0; padding:0; }
        html{ scroll-behavior:smooth; cursor:none; }
        a, button, [role=button] { cursor: none; }
        ::selection{ background:#00ff88; color:#040608; }

        /* ── KEYFRAMES ── */
        @keyframes float1{
          0%,100%{ transform:translateY(0) rotate(0deg); }
          33%    { transform:translateY(-20px) rotate(8deg); }
          66%    { transform:translateY(-10px) rotate(-5deg); }
        }
        @keyframes float2{
          0%,100%{ transform:translateY(0) translateX(0); }
          50%    { transform:translateY(-16px) translateX(6px); }
        }
        @keyframes float3{
          0%,100%{ transform:translateY(0) rotate(0deg) scale(1); }
          25%    { transform:translateY(-8px) rotate(4deg) scale(1.04); }
          75%    { transform:translateY(-14px) rotate(-4deg) scale(.97); }
        }
        @keyframes breathe{
          0%,100%{ transform:scale(1); opacity:.88; }
          50%    { transform:scale(1.04); opacity:1; }
        }
        @keyframes pulse{
          0%,100%{ opacity:.45; }
          50%    { opacity:1; }
        }
        @keyframes glowPulse{
          0%,100%{ box-shadow:0 0 20px rgba(0,255,136,.2), 0 4px 22px rgba(0,255,136,.3); }
          50%    { box-shadow:0 0 40px rgba(0,255,136,.5), 0 8px 40px rgba(0,255,136,.5); }
        }
        @keyframes ticker { 0%{transform:translateX(0);}    100%{transform:translateX(-50%);} }
        @keyframes tickerR{ 0%{transform:translateX(-50%);} 100%{transform:translateX(0);}    }
        @keyframes scan{
          0%  { top:0%;  opacity:0; }
          10% { opacity:1; }
          90% { opacity:.15; }
          100%{ top:100%; opacity:0; }
        }
        @keyframes heroFadeUp{
          from{ opacity:0; transform:translateY(34px) scale(.97); }
          to  { opacity:1; transform:none; }
        }
        @keyframes shimmerBg{
          0%  { background-position: 200% center; }
          100%{ background-position:-200% center; }
        }
        @keyframes glow{
          0%,100%{ box-shadow:0 0 18px rgba(0,255,136,.22); }
          50%    { box-shadow:0 0 40px rgba(0,255,136,.55); }
        }
        @keyframes borderDance{
          0%,100%{ border-color:rgba(0,255,136,.22); }
          50%    { border-color:rgba(0,255,136,.55); }
        }
        @keyframes countPop{
          0%  { transform:scale(1); }
          40% { transform:scale(1.12); }
          100%{ transform:scale(1); }
        }
        @keyframes spinSlow{ to{ transform:rotate(360deg); } }

        /* ── INTERACTIVE ELEMENTS ── */
        .btn-g{
          background: linear-gradient(135deg,#00ff88,#00cc6a);
          color:#040608; border:none; border-radius:10px;
          padding:.85rem 1.8rem; font-size:15px; font-weight:700;
          cursor:none; font-family:inherit;
          box-shadow:0 4px 22px rgba(0,255,136,.35);
          display:inline-block; text-decoration:none;
          animation: glowPulse 3s ease-in-out infinite;
          transition: transform .15s, box-shadow .15s;
          position: relative; overflow: hidden;
        }
        .btn-g::after{
          content:'';
          position:absolute; top:0; left:-100%; width:100%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);
          transition:left .4s;
        }
        .btn-g:hover{ transform:translateY(-3px) scale(1.03); box-shadow:0 12px 40px rgba(0,255,136,.65); animation:none; }
        .btn-g:hover::after{ left:100%; }

        .btn-ghost{
          background:${dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)"};
          color:${dark?"rgba(255,255,255,.7)":"rgba(0,0,0,.65)"};
          border:.5px solid ${dark?"rgba(255,255,255,.15)":"rgba(0,0,0,.15)"};
          border-radius:10px; padding:.85rem 1.8rem; font-size:15px; font-weight:500;
          cursor:none; font-family:inherit;
          transition:all .2s; display:inline-block; text-decoration:none;
        }
        .btn-ghost:hover{
          background:${dark?"rgba(255,255,255,.1)":"rgba(0,0,0,.1)"};
          border-color:rgba(0,255,136,.4); color:${dark?"#fff":"#000"};
          transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.15);
        }

        /* ── DIVIDER ── */
        .divider{ border:none; border-top:.5px solid ${dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.1)"}; }

        /* ── GLASS CARDS ── */
        .glass{
          background:${dark?"linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.02))":"linear-gradient(135deg,rgba(0,0,0,.04),rgba(0,0,0,.01))"};
          border:.5px solid ${dark?"rgba(255,255,255,.12)":"rgba(0,0,0,.12)"};
          border-top:.5px solid ${dark?"rgba(255,255,255,.22)":"rgba(0,0,0,.18)"};
          border-radius:16px; position:relative; overflow:hidden;
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s;
        }
        .glass::before{
          content:''; position:absolute; top:0; left:10%; right:10%; height:1px;
          background:${dark?"linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent)":"linear-gradient(90deg,transparent,rgba(0,0,0,.14),transparent)"};
        }
        .glass:hover{
          transform:translateY(-6px) scale(1.01);
          box-shadow: 0 20px 50px rgba(0,255,136,.1), 0 4px 16px rgba(0,0,0,.12);
          border-color: rgba(0,255,136,.3) !important;
        }

        /* ── 3D TILT (legacy fallback if TiltCard not used) ── */
        .card3d{ transition:transform .35s ease, box-shadow .35s; }
        .card3d:hover{
          transform:perspective(900px) rotateY(6deg) rotateX(-4deg) scale(1.03);
          box-shadow:0 24px 64px rgba(0,0,0,.22), 0 0 0 1px rgba(0,255,136,.2);
        }

        /* ── STAT CARDS — breathe + hover lift ── */
        .stat-card{
          background:${dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)"};
          border:.5px solid ${dark?"rgba(255,255,255,.08)":"rgba(0,0,0,.1)"};
          border-radius:16px; padding:1.8rem 1.2rem; text-align:center;
          animation: breathe 4s ease-in-out infinite;
          transition: border-color .3s, transform .3s, box-shadow .3s;
        }
        .stat-card:nth-child(2){ animation-delay:.9s; }
        .stat-card:nth-child(3){ animation-delay:1.8s; }
        .stat-card:hover{
          border-color:rgba(0,255,136,.45);
          transform:translateY(-6px) scale(1.03);
          box-shadow:0 16px 44px rgba(0,255,136,.14);
          animation:none;
        }

        /* ── OFFER CARDS ── */
        .offer-card{
          background:${dark?"linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02))":"linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))"};
          border:.5px solid ${dark?"rgba(255,255,255,.1)":"rgba(0,0,0,.1)"};
          border-radius:20px; padding:2rem;
          transition:transform .3s, border-color .3s, box-shadow .3s;
          position:relative; overflow:hidden;
        }
        .offer-card:hover{ transform:translateY(-8px) scale(1.01); box-shadow:0 24px 60px rgba(0,0,0,.18); }
        .offer-card.feat{
          border-color:rgba(0,255,136,.45) !important;
          background:linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03)) !important;
          animation: glowPulse 3s ease-in-out infinite;
        }
        .offer-card.feat:hover{ animation:none; }

        /* ── PARTNER CARDS ── */
        .partner-card{
          background:${dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.03)"};
          border:.5px solid ${dark?"rgba(255,255,255,.1)":"rgba(0,0,0,.08)"};
          border-radius:14px; padding:1rem 1.5rem;
          display:flex; align-items:center; gap:10px;
          animation: breathe 5s ease-in-out infinite;
          transition: all .3s;
        }
        .partner-card:nth-child(2){ animation-delay:1s; }
        .partner-card:nth-child(3){ animation-delay:2s; }
        .partner-card:hover{
          background:rgba(0,255,136,.07) !important;
          border-color:rgba(0,255,136,.4) !important;
          transform:translateY(-5px) scale(1.02);
          box-shadow:0 12px 32px rgba(0,255,136,.12);
          animation:none;
        }

        /* ── TYPOGRAPHY ── */
        h1,h2,h3,h4,p,span,li{ color:inherit; }

        /* ── SCROLLBAR ── */
        div::-webkit-scrollbar{ display:none; }

        /* ── TICKER ITEMS HOVER ── */
        .ticker-item{
          transition: transform .2s, background .2s, border-color .2s;
        }
        .ticker-item:hover{
          transform: translateY(-3px) scale(1.06);
          border-color: rgba(0,255,136,.35) !important;
          background: rgba(0,255,136,.06) !important;
        }

        /* ── RESPONSIVE ── */
        @media(min-width:769px) { .nav-links{display:flex!important;} .hamburger{display:none!important;} }
        @media(max-width:768px) {
          .nav-links{display:none!important;} .hamburger{display:flex!important;}
          .hero-t{font-size:clamp(1.8rem,7vw,2.5rem)!important;}
          .how-grid,.about-grid,.offer-grid,.partner-grid,.stat-grid,.hero-cards{grid-template-columns:1fr!important;}
          .float-shape{display:none!important;}
          .btn-g,.btn-ghost{width:100%!important;text-align:center!important;display:block!important;margin-bottom:8px;}
        }
      `}</style>

      <Nav />
      <div style={{ position: "relative", zIndex: 1 }}>
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
        </Routes>
      </div>
      <Footer />
      <WhatsAppButton />
      <ThemeToggle />
    </div>
  );
}