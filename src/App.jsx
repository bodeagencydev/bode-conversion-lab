import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav, Footer, WhatsAppButton, ThemeToggle, ThemeContext } from "./components.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import { CaseStudies, CaseStudyDetail } from "./pages/CaseStudies.jsx";
import Pricing from "./pages/Pricing.jsx";
import { Blog, BlogPost } from "./pages/Blog.jsx";
import Contact from "./pages/Contact.jsx";
import Audit from "./pages/Audit.jsx";
import Subscribe from "./pages/Subscribe.jsx";

export default function App() {
  const [dark, setDark] = useState(true);
  const toggle = () => setDark(v => !v);

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
    <div style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", background: bg, color: fg, overflowX: "hidden", minHeight: "100vh", transition: "background .4s, color .4s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::selection{background:#00ff88;color:#040608;}
        @keyframes float1{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-20px) rotate(10deg);}}
        @keyframes float2{0%,100%{transform:translateY(0);}50%{transform:translateY(-13px);}}
        @keyframes scan{0%{top:0%;opacity:0;}10%{opacity:1;}90%{opacity:.15;}100%{top:100%;opacity:0;}}
        @keyframes pulse{0%,100%{opacity:.5;}50%{opacity:1;}}
        @keyframes ticker{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
        @keyframes tickerR{0%{transform:translateX(-50%);}100%{transform:translateX(0);}}
        @keyframes glow{0%,100%{box-shadow:0 0 18px rgba(0,255,136,.25);}50%{box-shadow:0 0 38px rgba(0,255,136,.55);}}
        @keyframes heroFadeUp{from{opacity:0;transform:translateY(32px);}to{opacity:1;transform:none;}}
        div::-webkit-scrollbar{display:none;}

        /* DARK MODE */
        .divider{border:none;border-top:.5px solid ${dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.1)"};}
        .glass{
          background:${dark ? "linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(0,0,0,.04),rgba(0,0,0,.01))"};
          border:.5px solid ${dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.12)"};
          border-top:.5px solid ${dark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.18)"};
          border-radius:16px;position:relative;overflow:hidden;
        }
        .glass::before{content:'';position:absolute;top:0;left:10%;right:10%;height:1px;background:${dark ? "linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)" : "linear-gradient(90deg,transparent,rgba(0,0,0,.12),transparent)"};}
        .card3d{transition:transform .4s ease,box-shadow .4s;}
        .card3d:hover{transform:perspective(900px) rotateY(5deg) rotateX(-3deg) scale(1.02);box-shadow:0 20px 60px rgba(0,0,0,.2);}
        .btn-g{background:linear-gradient(135deg,#00ff88,#00cc6a);color:#040608;border:none;border-radius:10px;padding:.85rem 1.8rem;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .15s;box-shadow:0 4px 22px rgba(0,255,136,.35);display:inline-block;text-decoration:none;}
        .btn-g:hover{transform:translateY(-2px);box-shadow:0 8px 34px rgba(0,255,136,.55);}
        .btn-ghost{
          background:${dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"};
          color:${dark ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.65)"};
          border:.5px solid ${dark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.15)"};
          border-radius:10px;padding:.85rem 1.8rem;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .15s;display:inline-block;text-decoration:none;
        }
        .btn-ghost:hover{background:${dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"};border-color:rgba(0,255,136,.3);color:${dark ? "#fff" : "#000"};}
        .stat-card{
          background:${dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)"};
          border:.5px solid ${dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.1)"};
          border-radius:16px;padding:1.8rem 1.2rem;text-align:center;transition:border-color .3s,transform .3s;
        }
        .stat-card:hover{border-color:rgba(0,255,136,.35);transform:translateY(-3px);}
        .offer-card{
          background:${dark ? "linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))"};
          border:.5px solid ${dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"};
          border-radius:20px;padding:2rem;transition:transform .25s,border-color .25s;position:relative;overflow:hidden;
        }
        .offer-card:hover{transform:translateY(-5px);}
        .offer-card.feat{border-color:rgba(0,255,136,.45)!important;background:linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))!important;}
        .partner-card{
          background:${dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)"};
          border:.5px solid ${dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.08)"};
          border-radius:14px;padding:1rem 1.5rem;display:flex;align-items:center;gap:10px;transition:all .25s;cursor:default;
        }
        .partner-card:hover{background:rgba(0,255,136,.07);border-color:rgba(0,255,136,.35);transform:translateY(-2px);}
        h1,h2,h3,h4,p,span,li{color:inherit;}
        @media(min-width:769px){.nav-links{display:flex!important;}.hamburger{display:none!important;}}
        @media(max-width:768px){
          .nav-links{display:none!important;}.hamburger{display:flex!important;}
          .hero-t{font-size:clamp(1.8rem,7vw,2.5rem)!important;}
          .how-grid,.about-grid,.offer-grid,.partner-grid,.stat-grid,.hero-cards{grid-template-columns:1fr!important;}
          .float-shape{display:none!important;}
          .btn-g,.btn-ghost{width:100%!important;text-align:center!important;display:block!important;margin-bottom:8px;}
        }
      `}</style>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/subscribe" element={<Subscribe />} />
      </Routes>
      <Footer />
      <WhatsAppButton />
      <ThemeToggle />
    </div>
  );
}