import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav, Footer, WhatsAppButton, ThemeToggle, ThemeContext } from "./components.jsx";
import { CursorSystem, MorphOrbs, ClickRipple, ScrollProgress } from "./AnimationSystem.jsx";
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
      const s = localStorage.getItem("bcl-theme");
      if (s !== null) return s === "dark";
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
    <div style={{ fontFamily:"'Inter','Helvetica Neue',sans-serif", background:bg, color:fg, overflowX:"hidden", minHeight:"100vh", transition:"background .4s, color .4s", position:"relative" }}>

      {/* ── GLOBAL ANIMATION LAYER ── */}
      <CursorSystem />
      <MorphOrbs />
      <ClickRipple />
      <ScrollProgress />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        ::selection { background:#00ff88; color:#040608; }
        div::-webkit-scrollbar { display:none; }

        /* ── KEYFRAMES ── */
        @keyframes float1 {
          0%,100%{ transform:translateY(0) rotate(0deg); }
          33%    { transform:translateY(-22px) rotate(8deg); }
          66%    { transform:translateY(-10px) rotate(-5deg); }
        }
        @keyframes float2 {
          0%,100%{ transform:translateY(0) translateX(0); }
          50%    { transform:translateY(-16px) translateX(8px); }
        }
        @keyframes breathe {
          0%,100%{ transform:scale(1); opacity:.88; }
          50%    { transform:scale(1.045); opacity:1; }
        }
        @keyframes pulse {
          0%,100%{ opacity:.4; }
          50%    { opacity:1; }
        }
        @keyframes glowPulse {
          0%,100%{ box-shadow:0 0 18px rgba(0,255,136,.18), 0 4px 22px rgba(0,255,136,.25); }
          50%    { box-shadow:0 0 38px rgba(0,255,136,.45), 0 8px 40px rgba(0,255,136,.45); }
        }
        @keyframes shimmer {
          0%  { background-position:200% center; }
          100%{ background-position:-200% center; }
        }
        @keyframes ticker  { 0%{transform:translateX(0);}    100%{transform:translateX(-50%);} }
        @keyframes tickerR { 0%{transform:translateX(-50%);} 100%{transform:translateX(0);}    }
        @keyframes scan    { 0%{top:0%;opacity:0;} 10%{opacity:1;} 90%{opacity:.15;} 100%{top:100%;opacity:0;} }
        @keyframes heroFadeUp { from{opacity:0;transform:translateY(36px) scale(.97);} to{opacity:1;transform:none;} }
        @keyframes glow    { 0%,100%{box-shadow:0 0 18px rgba(0,255,136,.22);} 50%{box-shadow:0 0 40px rgba(0,255,136,.55);} }
        @keyframes countPop{ 0%{transform:scale(1);} 40%{transform:scale(1.1);} 100%{transform:scale(1);} }
        @keyframes spinSlow{ to{transform:rotate(360deg);} }

        /* ── BUTTONS ── */
        .btn-g {
          background:linear-gradient(135deg,#00ff88,#00cc6a);
          color:#040608; border:none; border-radius:10px;
          padding:.85rem 1.8rem; font-size:15px; font-weight:700;
          cursor:pointer; font-family:inherit;
          box-shadow:0 4px 22px rgba(0,255,136,.35);
          display:inline-block; text-decoration:none;
          animation:glowPulse 3s ease-in-out infinite;
          transition:transform .15s, box-shadow .15s;
          position:relative; overflow:hidden;
        }
        /* Shine sweep */
        .btn-g::after {
          content:''; position:absolute; top:0; left:-100%;
          width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
          transition:left .5s ease;
        }
        .btn-g:hover { transform:translateY(-3px) scale(1.03); box-shadow:0 12px 40px rgba(0,255,136,.65); animation:none; }
        .btn-g:hover::after { left:140%; }

        .btn-ghost {
          background:${dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)"};
          color:${dark?"rgba(255,255,255,.7)":"rgba(0,0,0,.65)"};
          border:.5px solid ${dark?"rgba(255,255,255,.15)":"rgba(0,0,0,.15)"};
          border-radius:10px; padding:.85rem 1.8rem; font-size:15px; font-weight:500;
          cursor:pointer; font-family:inherit; transition:all .25s;
          display:inline-block; text-decoration:none;
        }
        .btn-ghost:hover {
          background:${dark?"rgba(255,255,255,.1)":"rgba(0,0,0,.1)"};
          border-color:rgba(0,255,136,.4); color:${dark?"#fff":"#000"};
          transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.12);
        }

        /* ── DIVIDER ── */
        .divider { border:none; border-top:.5px solid ${dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.1)"}; }

        /* ── GLASS CARDS ── */
        .glass {
          background:${dark?"linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.02))":"linear-gradient(135deg,rgba(0,0,0,.04),rgba(0,0,0,.01))"};
          border:.5px solid ${dark?"rgba(255,255,255,.12)":"rgba(0,0,0,.12)"};
          border-top:.5px solid ${dark?"rgba(255,255,255,.22)":"rgba(0,0,0,.18)"};
          border-radius:16px; position:relative; overflow:hidden;
          transition:transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s, border-color .3s;
        }
        .glass::before {
          content:''; position:absolute; top:0; left:10%; right:10%; height:1px;
          background:${dark?"linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent)":"linear-gradient(90deg,transparent,rgba(0,0,0,.14),transparent)"};
        }
        .glass:hover {
          transform:translateY(-6px) scale(1.01);
          box-shadow:0 24px 56px rgba(0,255,136,.1), 0 4px 16px rgba(0,0,0,.14);
          border-color:rgba(0,255,136,.28) !important;
        }

        /* ── 3D CARD ── */
        .card3d { transition:transform .35s ease, box-shadow .35s; }
        .card3d:hover {
          transform:perspective(900px) rotateY(6deg) rotateX(-4deg) scale(1.03);
          box-shadow:0 24px 64px rgba(0,0,0,.22), 0 0 0 1px rgba(0,255,136,.18);
        }

        /* ── STAT CARDS ── */
        .stat-card {
          background:${dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)"};
          border:.5px solid ${dark?"rgba(255,255,255,.08)":"rgba(0,0,0,.1)"};
          border-radius:16px; padding:1.8rem 1.2rem; text-align:center;
          animation:breathe 4.5s ease-in-out infinite;
          transition:border-color .3s, transform .35s cubic-bezier(.16,1,.3,1), box-shadow .3s;
        }
        .stat-card:nth-child(2){ animation-delay:1s; }
        .stat-card:nth-child(3){ animation-delay:2s; }
        .stat-card:hover {
          border-color:rgba(0,255,136,.5); transform:translateY(-8px) scale(1.04);
          box-shadow:0 20px 50px rgba(0,255,136,.15); animation:none;
        }

        /* ── OFFER CARDS ── */
        .offer-card {
          background:${dark?"linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02))":"linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))"};
          border:.5px solid ${dark?"rgba(255,255,255,.1)":"rgba(0,0,0,.1)"};
          border-radius:20px; padding:2rem;
          transition:transform .35s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .35s;
          position:relative; overflow:hidden;
        }
        .offer-card:hover { transform:translateY(-8px) scale(1.01); box-shadow:0 24px 60px rgba(0,0,0,.18); }
        .offer-card.feat {
          border-color:rgba(0,255,136,.45) !important;
          background:linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03)) !important;
          animation:glowPulse 3s ease-in-out infinite;
        }
        .offer-card.feat:hover { animation:none; }

        /* ── PARTNER CARDS ── */
        .partner-card {
          background:${dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.03)"};
          border:.5px solid ${dark?"rgba(255,255,255,.1)":"rgba(0,0,0,.08)"};
          border-radius:14px; padding:1rem 1.5rem;
          display:flex; align-items:center; gap:10px;
          animation:breathe 5.5s ease-in-out infinite;
          transition:all .35s cubic-bezier(.16,1,.3,1);
        }
        .partner-card:nth-child(2){ animation-delay:1.1s; }
        .partner-card:nth-child(3){ animation-delay:2.2s; }
        .partner-card:hover {
          background:rgba(0,255,136,.07) !important; border-color:rgba(0,255,136,.4) !important;
          transform:translateY(-5px) scale(1.02); box-shadow:0 14px 36px rgba(0,255,136,.12); animation:none;
        }

        /* ── TICKER ITEMS ── */
        .ticker-item { transition:transform .25s, background .25s, border-color .25s; }
        .ticker-item:hover {
          transform:translateY(-3px) scale(1.06) !important;
          border-color:rgba(0,255,136,.35) !important;
          background:rgba(0,255,136,.07) !important;
        }

        /* ── TYPE ── */
        h1,h2,h3,h4,p,span,li { color:inherit; }

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
      <div style={{ position:"relative", zIndex:1 }}>
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