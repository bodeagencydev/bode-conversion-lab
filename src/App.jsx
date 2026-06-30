function AppInner({ dark }) {
  /* ── Page tracking — fires on every route change ── */
  usePageTracking();

  const bg = dark ? "#040608" : "#FAF5E9";
  const fg = dark ? "#f0f0f0" : "#241D14";

  return (
    <div
      data-theme={dark ? "dark" : "light"}
      style={{ fontFamily:"'Inter','Helvetica Neue',sans-serif", background:bg, color:fg, overflowX:"hidden", minHeight:"100vh", transition:"background .4s,color .4s", position:"relative" }}>

      {/* ── GLOBAL ANIMATION LAYER ── */}
      <CursorSystem />
      <MorphOrbs />
      <ClickRipple />
      <ScrollProgress />
      <NoiseOverlay opacity={dark ? 0.025 : 0.015} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; overflow-x:hidden; }
        body { overflow-x:hidden; }
        [lang], font { color:inherit !important; }
        ::selection { background:#00ff88; color:#040608; }
        div::-webkit-scrollbar { display:none; }

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

        /* ── BUTTONS ── */
        .btn-g{
          background:linear-gradient(135deg,#00ff88,#00cc6a);
          color:#040608;border:none;border-radius:10px;
          padding:.85rem 1.8rem;font-size:15px;font-weight:700;
          cursor:pointer;font-family:inherit;
          box-shadow:0 4px 22px rgba(0,255,136,.35);
          display:inline-block;text-decoration:none;
          transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s;
          position:relative;overflow:hidden;
          animation:mobilePulse 3s ease-in-out infinite;
          min-height:44px;
        }
        .btn-g::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.32),transparent);transition:left .55s cubic-bezier(.22,1,.36,1);}
        .btn-g:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 14px 44px rgba(0,255,136,.65);animation:none;}
        .btn-g:hover::after{left:140%;}
        @media(hover:hover){.btn-g{animation:glowPulse 3s ease-in-out infinite;}}

        .btn-ghost{
          background:${dark?"rgba(255,255,255,.06)":"rgba(120,90,40,.06)"};
          color:${dark?"rgba(255,255,255,.7)":"rgba(60,45,25,.72)"};
          border:.5px solid ${dark?"rgba(255,255,255,.15)":"rgba(120,90,40,.18)"};
          border-radius:10px;padding:.85rem 1.8rem;font-size:15px;font-weight:500;
          cursor:pointer;font-family:inherit;
          transition:all .5s cubic-bezier(.22,1,.36,1);
          display:inline-block;text-decoration:none;min-height:44px;
        }
        .btn-ghost:hover{background:${dark?"rgba(255,255,255,.1)":"rgba(120,90,40,.1)"};border-color:rgba(0,255,136,.4);color:${dark?"#fff":"#241D14"};transform:translateY(-2px);}

        /* ── DIVIDER ── */
        .divider{border:none;border-top:.5px solid ${dark?"rgba(255,255,255,.06)":"rgba(120,90,40,.14)"};}

        /* ── GLASS CARDS ── */
        .glass{
          background:${dark?"linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.02))":"linear-gradient(135deg,rgba(255,250,235,.85),rgba(245,230,200,.4))"};
          border:.5px solid ${dark?"rgba(255,255,255,.12)":"rgba(120,90,40,.16)"};
          border-top:.5px solid ${dark?"rgba(255,255,255,.22)":"rgba(160,120,55,.22)"};
          border-radius:16px;position:relative;overflow:hidden;
          transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s,border-color .3s;
        }
        .glass::before{content:'';position:absolute;top:0;left:10%;right:10%;height:1px;background:${dark?"linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent)":"linear-gradient(90deg,transparent,rgba(160,120,55,.2),transparent)"};}
        .glass:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 24px 56px rgba(0,255,136,.1),0 4px 16px rgba(0,0,0,.08);border-color:rgba(0,255,136,.28)!important;}

        /* ── STAT CARDS ── */
        .stat-card{
          background:${dark?"rgba(255,255,255,.04)":"rgba(250,240,215,.6)"};
          border:.5px solid ${dark?"rgba(255,255,255,.08)":"rgba(120,90,40,.14)"};
          border-radius:16px;padding:1.8rem 1.2rem;text-align:center;
          animation:breathe 4.5s ease-in-out infinite;
          transition:border-color .3s,transform .5s cubic-bezier(.22,1,.36,1),box-shadow .3s;
        }
        .stat-card:nth-child(2){animation-delay:1s;}
        .stat-card:nth-child(3){animation-delay:2s;}
        .stat-card:hover{border-color:rgba(0,255,136,.5);transform:translateY(-8px) scale(1.04);box-shadow:0 20px 50px rgba(0,255,136,.15);animation:none;}

        /* ── OFFER CARDS ── */
        .offer-card{
          background:${dark?"linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02))":"linear-gradient(135deg,rgba(250,240,215,.7),rgba(245,225,190,.3))"};
          border:.5px solid ${dark?"rgba(255,255,255,.1)":"rgba(120,90,40,.16)"};
          border-radius:20px;padding:2rem;
          transition:transform .5s cubic-bezier(.22,1,.36,1),border-color .3s,box-shadow .5s;
          position:relative;overflow:hidden;
        }
        .offer-card:hover{transform:translateY(-8px) scale(1.01);box-shadow:0 24px 60px rgba(0,0,0,.1);}
        .offer-card.feat{border-color:rgba(0,255,136,.45)!important;background:linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))!important;animation:glowPulse 3s ease-in-out infinite;}
        .offer-card.feat:hover{animation:none;}

        /* ── PARTNER CARDS ── */
        .partner-card{
          background:${dark?"rgba(255,255,255,.04)":"rgba(250,240,215,.55)"};
          border:.5px solid ${dark?"rgba(255,255,255,.1)":"rgba(120,90,40,.13)"};
          border-radius:14px;padding:1rem 1.5rem;
          display:flex;align-items:center;gap:10px;
          animation:breathe 5.5s ease-in-out infinite;
          transition:all .5s cubic-bezier(.22,1,.36,1);
          min-height:44px;
        }
        .partner-card:nth-child(2){animation-delay:1.1s;}
        .partner-card:nth-child(3){animation-delay:2.2s;}
        .partner-card:hover{background:rgba(0,255,136,.07)!important;border-color:rgba(0,255,136,.4)!important;transform:translateY(-5px) scale(1.02);box-shadow:0 14px 36px rgba(0,255,136,.12);animation:none;}

        /* ── CARD 3D ── */
        .card3d{transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s;}
        .card3d:hover{transform:perspective(900px) rotateY(6deg) rotateX(-4deg) scale(1.03);box-shadow:0 24px 64px rgba(0,0,0,.18),0 0 0 1px rgba(0,255,136,.18);}

        /* ── GPU HINTS ── */
        .glass,.card3d,.stat-card,.offer-card,.partner-card,.btn-g,.btn-ghost{will-change:transform;}

        /* ── TOUCH TARGETS ── */
        a,button,[role=button]{min-height:44px;}
        @media(max-width:768px){a,button{min-height:48px;}}

        /* ── TYPOGRAPHY ── */
        h1,h2,h3,h4,p,span,li{color:inherit;}

        /* ── RESPONSIVE ── */
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
            <Route path="*"                 element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
      <WhatsAppButton />
      <ThemeToggle />
    </div>
  );
}