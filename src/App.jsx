import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav } from "./components.jsx";
import { Footer } from "./components.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import { CaseStudies, CaseStudyDetail } from "./pages/CaseStudies.jsx";
import Pricing from "./pages/Pricing.jsx";
import { Blog, BlogPost } from "./pages/Blog.jsx";
import Contact from "./pages/Contact.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", background: "#040608", color: "#f0f0f0", overflowX: "hidden", minHeight: "100vh" }}>
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
          .divider{border:none;border-top:.5px solid rgba(255,255,255,.06);}
          .glass{background:linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.02));border:.5px solid rgba(255,255,255,.12);border-top:.5px solid rgba(255,255,255,.2);border-radius:16px;position:relative;overflow:hidden;}
          .glass::before{content:'';position:absolute;top:0;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);}
          .card3d{transition:transform .4s ease,box-shadow .4s;}
          .card3d:hover{transform:perspective(900px) rotateY(5deg) rotateX(-3deg) scale(1.02);box-shadow:0 20px 60px rgba(0,0,0,.4);}
          .btn-g{background:linear-gradient(135deg,#00ff88,#00cc6a);color:#040608;border:none;border-radius:10px;padding:.85rem 1.8rem;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .15s;box-shadow:0 4px 22px rgba(0,255,136,.35);display:inline-block;}
          .btn-g:hover{transform:translateY(-2px);box-shadow:0 8px 34px rgba(0,255,136,.55);}
          .btn-ghost{background:rgba(255,255,255,.04);color:rgba(255,255,255,.65);border:.5px solid rgba(255,255,255,.15);border-radius:10px;padding:.85rem 1.8rem;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .15s;display:inline-block;text-decoration:none;}
          .btn-ghost:hover{background:rgba(255,255,255,.08);border-color:rgba(0,255,136,.3);color:#fff;}
          .stat-card{background:rgba(255,255,255,.04);border:.5px solid rgba(255,255,255,.08);border-radius:16px;padding:1.8rem 1.2rem;text-align:center;transition:border-color .3s,transform .3s;}
          .stat-card:hover{border-color:rgba(0,255,136,.35);transform:translateY(-3px);}
          .offer-card{background:linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02));border:.5px solid rgba(255,255,255,.1);border-radius:20px;padding:2rem;transition:transform .25s,border-color .25s;position:relative;overflow:hidden;}
          .offer-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);}
          .offer-card:hover{transform:translateY(-5px);}
          .offer-card.feat{border-color:rgba(0,255,136,.45);background:linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03));}
          .offer-card.feat::before{background:linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent);}
          .partner-card{background:rgba(255,255,255,.04);border:.5px solid rgba(255,255,255,.1);border-radius:14px;padding:1rem 1.5rem;display:flex;align-items:center;gap:10px;transition:all .25s;cursor:default;}
          .partner-card:hover{background:rgba(0,255,136,.07);border-color:rgba(0,255,136,.35);transform:translateY(-2px);}
          nav a:hover{color:#00ff88;}
          @media(max-width:768px){
            .hero-t{font-size:2.3rem!important;}
            .how-grid,.about-grid,.offer-grid,.partner-grid,.stat-grid{grid-template-columns:1fr!important;}
            .hero-cards{grid-template-columns:1fr 1fr!important;}
            .nav-links{display:none!important;}
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
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}