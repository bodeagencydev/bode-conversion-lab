import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

/* ─── BRAND CONSTANTS ─── */
const G  = "#00ff88";
const GG = "linear-gradient(135deg,#00ff88,#00cc6a)";

/* ─── THEME CONTEXT ─── */
export const ThemeContext = createContext({ dark: true, toggle: () => {} });
export function useTheme() { return useContext(ThemeContext); }

/* ─── NAV LINKS ─── */
const NAV_LINKS = [
  { path: "/",             label: "Home" },
  { path: "/about",        label: "About" },
  { path: "/case-studies", label: "Case Studies" },
  { path: "/pricing",      label: "Pricing" },
  { path: "/blog",         label: "Blog" },
  { path: "/audit",        label: "Free Audit" },
  { path: "/contact",      label: "Contact" },
];

/* ─── LOGO ─── */
export function Logo({ size = 40, textSize = 14 }) {
  const { dark } = useTheme();
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ width:size, height:size, borderRadius:"50%", background:GG, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 18px rgba(0,255,136,.35)", flexShrink:0 }}>
        <span style={{ fontSize:size*.42, fontWeight:900, color:"#040608", fontFamily:"'Syne',sans-serif" }}>B</span>
      </div>
      <div style={{ lineHeight:1.1 }}>
        <p style={{ fontSize:textSize, fontWeight:800, color:dark?"#fff":"#040608", margin:0, fontFamily:"'Syne',sans-serif" }}>Bode</p>
        <p style={{ fontSize:textSize*.78, fontWeight:600, color:G, margin:0, letterSpacing:".06em", textTransform:"uppercase" }}>Conversion Lab</p>
      </div>
    </div>
  );
}

/* ─── NAV ─── */
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

  const bg     = dark ? (scrolled?"rgba(4,6,8,.92)":"rgba(4,6,8,.6)") : (scrolled?"rgba(255,255,255,.92)":"rgba(255,255,255,.6)");
  const border = dark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.07)";
  const tc     = dark ? "rgba(255,255,255,.75)"  : "rgba(0,0,0,.7)";

  return (
    <>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, padding:"0 clamp(1rem,4vw,2.5rem)", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", background:bg, backdropFilter:"blur(18px)", borderBottom:`.5px solid ${border}`, transition:"transform .35s cubic-bezier(.22,1,.36,1), background .3s", transform:visible?"translateY(0)":"translateY(-100%)" }}>
        <Link to="/" style={{ textDecoration:"none" }}><Logo size={34} textSize={13}/></Link>
        <div style={{ display:"flex", alignItems:"center", gap:"clamp(.6rem,2vw,1.6rem)" }} className="nav-desktop">
          {NAV_LINKS.filter(l => l.path !== "/contact").map(l => {
            const active = location.pathname === l.path;
            return (
              <Link key={l.path} to={l.path}
                style={{ fontSize:13.5, fontWeight:active?700:500, color:active?G:tc, textDecoration:"none", transition:"color .2s", position:"relative", paddingBottom:2 }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = G; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = tc; }}>
                {l.label}
                {active && <span style={{ position:"absolute", bottom:-2, left:0, right:0, height:2, background:GG, borderRadius:2 }}/>}
              </Link>
            );
          })}
          <Link to="/contact" style={{ background:GG, color:"#040608", borderRadius:8, padding:".42rem 1.1rem", fontSize:13, fontWeight:700, textDecoration:"none", boxShadow:"0 2px 14px rgba(0,255,136,.3)", transition:"transform .2s,box-shadow .2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 6px 22px rgba(0,255,136,.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 2px 14px rgba(0,255,136,.3)"; }}>
            Apply Now →
          </Link>
        </div>
        <button onClick={() => setMenuOpen(o => !o)} className="nav-hamburger"
          style={{ background:"none", border:"none", cursor:"pointer", padding:6, display:"none", flexDirection:"column", gap:5, alignItems:"center", justifyContent:"center" }}
          aria-label="Toggle menu">
          {[0,1,2].map(i => (
            <span key={i} style={{ display:"block", width:22, height:2, background:dark?"#fff":"#040608", borderRadius:2, transition:"all .25s",
              transform: menuOpen ? (i===0?"rotate(45deg) translate(5px,5px)":i===2?"rotate(-45deg) translate(5px,-5px)":"scaleX(0)") : "none",
              opacity: menuOpen && i===1 ? 0 : 1 }}/>
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      <div style={{ position:"fixed", top:60, left:0, right:0, zIndex:999, background:dark?"rgba(4,6,8,.97)":"rgba(255,255,255,.97)", backdropFilter:"blur(18px)", borderBottom:`.5px solid ${border}`, padding:menuOpen?"1.2rem 1.5rem 1.5rem":"0 1.5rem", maxHeight:menuOpen?500:0, overflow:"hidden", transition:"max-height .35s cubic-bezier(.22,1,.36,1), padding .35s" }}>
        {NAV_LINKS.map(l => {
          const active = location.pathname === l.path;
          return (
            <Link key={l.path} to={l.path}
              style={{ display:"block", padding:".7rem 0", fontSize:15, fontWeight:active?700:500, color:active?G:tc, textDecoration:"none", borderBottom:`.5px solid ${border}`, transition:"color .2s" }}>
              {l.label}
            </Link>
          );
        })}
        <Link to="/contact" style={{ display:"inline-block", marginTop:"1rem", background:GG, color:"#040608", borderRadius:8, padding:".55rem 1.4rem", fontSize:14, fontWeight:700, textDecoration:"none" }}>
          Apply Now →
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) { .nav-desktop { display: none !important; } .nav-hamburger { display: flex !important; } }
      `}</style>
    </>
  );
}

/* ─── THEME TOGGLE ─── */
export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle}
      style={{ position:"fixed", bottom:24, left:24, zIndex:9999, width:44, height:44, borderRadius:"50%", background:dark?"rgba(255,255,255,.1)":"rgba(0,0,0,.08)", border:`.5px solid ${dark?"rgba(255,255,255,.15)":"rgba(0,0,0,.12)"}`, backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:18, transition:"transform .2s,background .2s", boxShadow:"0 2px 12px rgba(0,0,0,.15)" }}
      onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"}
      onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
      aria-label="Toggle theme">
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

/* ─── PAGE WRAPPER ─── */
export function PageWrapper({ children, style = {} }) {
  const { dark } = useTheme();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ minHeight:"100vh", background:dark?"#040608":"#f8f9fa", color:dark?"#fff":"#040608", paddingTop:60, transition:"background .3s,color .3s", ...style }}>
      {children}
    </div>
  );
}

/* ─── GRAD TEXT ─── */
export function GradText({ children, style = {} }) {
  return <span style={{ background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", ...style }}>{children}</span>;
}

/* ─── SECTION ─── */
export function Section({ id, children, style = {} }) {
  return (
    <section id={id} style={{ padding:"clamp(3rem,6vw,6rem) clamp(1rem,4vw,2rem)", position:"relative", ...style }}>
      {children}
    </section>
  );
}

/* ─── SECTION LABEL ─── */
export function SectionLabel({ children }) {
  const { dark } = useTheme();
  return <p style={{ fontSize:11, color:dark?"rgba(255,255,255,.3)":"rgba(0,0,0,.4)", letterSpacing:".12em", textTransform:"uppercase", marginBottom:".75rem" }}>{children}</p>;
}

/* ─── HEADING ─── */
export function Heading({ children, size = "2.3rem" }) {
  const { dark } = useTheme();
  return <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:`clamp(1.4rem,4vw,${size})`, fontWeight:800, letterSpacing:"-.02em", color:dark?"#fff":"#0a0a0a", lineHeight:1.15, wordBreak:"break-word" }}>{children}</h2>;
}

/* ─── USE IN VIEW ─── */
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

/* ─── PARTICLES ─── */
export function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length:55 }, () => ({ x:Math.random()*c.width, y:Math.random()*c.height, r:Math.random()*1.4+.3, dx:(Math.random()-.5)*.25, dy:(Math.random()-.5)*.25, o:Math.random()*.4+.08 }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(0,255,136,${p.o})`; ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i+1).forEach(b => {
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if (d < 90) { ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle=`rgba(0,255,136,${.06*(1-d/90)})`; ctx.lineWidth=.5; ctx.stroke(); }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}/>;
}

/* ─── TYPEWRITER ─── */
export function Typewriter({ words }) {
  const [wi, setWi]         = useState(0);
  const [text, setText]     = useState("");
  const [deleting, setDel]  = useState(false);
  useEffect(() => {
    const word = words[wi];
    let t;
    if (!deleting && text.length < word.length) t = setTimeout(() => setText(word.slice(0, text.length+1)), 80);
    else if (!deleting && text.length === word.length) t = setTimeout(() => setDel(true), 2200);
    else if (deleting && text.length > 0) t = setTimeout(() => setText(text.slice(0,-1)), 45);
    else if (deleting && text.length === 0) { setDel(false); setWi((wi+1)%words.length); }
    return () => clearTimeout(t);
  }, [text, deleting, wi, words]);
  return <span style={{ background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{text}<span style={{ color:G }}>|</span></span>;
}

/* ─── CONTINUOUS TICKER ─── */
export function ContinuousTicker({ items = [], speed = 30, reverse = false }) {
  const { dark } = useTheme();
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow:"hidden", position:"relative", padding:".5rem 0" }}>
      <div style={{ display:"flex", gap:"1.5rem", animation:`${reverse?"tickerR":"ticker"} ${speed}s linear infinite`, width:"max-content" }}>
        {doubled.map((item, i) => {
          const name = typeof item === "string" ? item : item.name;
          return (
            <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:".5rem 1.2rem", background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)", border:dark?".5px solid rgba(255,255,255,.1)":".5px solid rgba(0,0,0,.1)", borderRadius:100, whiteSpace:"nowrap", fontSize:13, fontWeight:600, color:dark?"rgba(255,255,255,.7)":"rgba(0,0,0,.65)" }}>
              {name} <span style={{ color:G, margin:"0 .25rem" }}>✦</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ─── TESTIMONIAL TICKER ─── */
export function TestimonialTicker({ items = [] }) {
  const { dark } = useTheme();
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow:"hidden" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ display:"flex", gap:"1.5rem", animation:"ticker 40s linear infinite", animationPlayState:paused?"paused":"running", width:"max-content" }}>
        {doubled.map((t, i) => (
          <a key={i} href={t.storeUrl||"#"} target={t.storeUrl?"_blank":"_self"} rel="noopener noreferrer"
            style={{ width:300, flexShrink:0, background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.03)", border:dark?".5px solid rgba(255,255,255,.08)":".5px solid rgba(0,0,0,.08)", borderTop:".5px solid rgba(0,255,136,.2)", borderRadius:16, padding:"1.2rem", textDecoration:"none", display:"block", transition:"transform .3s,border-color .3s", cursor:t.storeUrl?"pointer":"default" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.borderColor="rgba(0,255,136,.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor=dark?"rgba(255,255,255,.08)":"rgba(0,0,0,.08)"; }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".75rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                {t.storeLogo && <img src={t.storeLogo} alt={t.storeName} width="20" height="20" loading="lazy" style={{ borderRadius:3, objectFit:"contain", background:"#fff", padding:"2px", flexShrink:0 }} onError={e => e.target.style.display="none"}/>}
                <span style={{ fontSize:11, color:dark?"rgba(255,255,255,.4)":"rgba(0,0,0,.4)" }}>{t.storeName}</span>
              </div>
              <span style={{ background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.25)", borderRadius:100, padding:"2px 8px", fontSize:10, color:G, fontWeight:600 }}>{t.result}</span>
            </div>
            <div style={{ display:"flex", gap:2, marginBottom:".75rem" }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize:12, color:"#FFD700" }}>★</span>)}</div>
            <p style={{ fontSize:13, color:dark?"rgba(255,255,255,.55)":"rgba(0,0,0,.55)", lineHeight:1.7, marginBottom:"1rem", fontStyle:"italic" }}>"{t.text}"</p>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              {t.avatar && <img src={t.avatar} alt={t.name} width="32" height="32" loading="lazy" style={{ borderRadius:"50%", objectFit:"cover", border:".5px solid rgba(0,255,136,.3)", flexShrink:0 }} onError={e => e.target.style.display="none"}/>}
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:dark?"#fff":"#040608", margin:0 }}>{t.name}</p>
                <p style={{ fontSize:10, color:dark?"rgba(255,255,255,.35)":"rgba(0,0,0,.4)", margin:0 }}>{t.role}</p>
              </div>
              {t.storeUrl && <span style={{ marginLeft:"auto", fontSize:10, color:G }}>Visit →</span>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── VIDEO TIPS ─── */
export function VideoTips({ items = [] }) {
  const { dark } = useTheme();
  const scrollRef = useRef(null);
  const scroll = dir => { if (scrollRef.current) scrollRef.current.scrollBy({ left:dir*280, behavior:"smooth" }); };
  const [playing, setPlaying] = useState(null);
  return (
    <div style={{ position:"relative" }}>
      <button onClick={() => scroll(-1)} style={{ position:"absolute", left:-16, top:"40%", transform:"translateY(-50%)", zIndex:10, width:36, height:36, borderRadius:"50%", background:"rgba(0,255,136,.15)", border:".5px solid rgba(0,255,136,.4)", color:G, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
      <button onClick={() => scroll(1)}  style={{ position:"absolute", right:-16, top:"40%", transform:"translateY(-50%)", zIndex:10, width:36, height:36, borderRadius:"50%", background:"rgba(0,255,136,.15)", border:".5px solid rgba(0,255,136,.4)", color:G, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
      <div ref={scrollRef} style={{ display:"flex", gap:"1.5rem", overflowX:"auto", scrollSnapType:"x mandatory", paddingBottom:"1rem", scrollbarWidth:"none" }}>
        {items.map((v, i) => (
          <div key={i} style={{ flexShrink:0, width:240, scrollSnapAlign:"start", background:dark?"rgba(255,255,255,.05)":"rgba(0,0,0,.03)", border:dark?".5px solid rgba(255,255,255,.1)":".5px solid rgba(0,0,0,.08)", borderRadius:16, overflow:"hidden" }}>
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
                    <div style={{ position:"absolute", top:8, left:8, background:"rgba(0,0,0,.75)", borderRadius:100, padding:"2px 8px", fontSize:10, color:G, fontWeight:600 }}>{v.tag}</div>
                  </>
              }
            </div>
            <div style={{ padding:".9rem" }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:".85rem", fontWeight:700, color:dark?"#fff":"#040608", marginBottom:".3rem", lineHeight:1.4 }}>{v.title}</h3>
              <p style={{ fontSize:12, color:dark?"rgba(255,255,255,.4)":"rgba(0,0,0,.4)", lineHeight:1.5, margin:0 }}>{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PARTNER CARD ─── */
export function PartnerCard({ partner }) {
  const { dark } = useTheme();
  return (
    <div className="partner-card"
      onMouseEnter={e => { e.currentTarget.style.background="rgba(0,255,136,.07)"; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.borderColor="rgba(0,255,136,.35)"; }}
      onMouseLeave={e => { e.currentTarget.style.background=dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.03)"; e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor=dark?"rgba(255,255,255,.1)":"rgba(0,0,0,.08)"; }}>
      <div style={{ width:28, height:28, borderRadius:6, background:`${partner.color||G}22`, border:`.5px solid ${partner.color||G}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <span style={{ fontSize:11, fontWeight:800, color:partner.color||G }}>{(partner.name||"?")[0]}</span>
      </div>
      <div>
        <p style={{ fontSize:14, fontWeight:600, color:dark?"#fff":"#040608", margin:0 }}>{partner.name}</p>
        <p style={{ fontSize:11, color:dark?"rgba(255,255,255,.3)":"rgba(0,0,0,.4)", margin:0 }}>Certified partner</p>
      </div>
      <div style={{ marginLeft:"auto", width:8, height:8, borderRadius:"50%", background:partner.color||G, animation:"pulse 2s ease-in-out infinite", flexShrink:0 }}/>
    </div>
  );
}

/* ─── WHATSAPP BUTTON ─── */
export function WhatsAppButton() {
  const msg = encodeURIComponent("Hi there! I would love to be part of your growth journey 🚀");
  return (
    <a href={`https://wa.me/19454076473?text=${msg}`} target="_blank" rel="noopener noreferrer"
      style={{ position:"fixed", bottom:24, right:24, zIndex:9999, width:56, height:56, borderRadius:"50%", background:"#25D366", boxShadow:"0 4px 20px rgba(37,211,102,.5)", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", transition:"transform .2s,box-shadow .2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform="scale(1.12)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(37,211,102,.65)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(37,211,102,.5)"; }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  );
}

/* ─── FOOTER ─── */
export function Footer() {
  const { dark } = useTheme();
  const tc  = dark ? "rgba(255,255,255,.5)"  : "rgba(0,0,0,.55)";
  const tc2 = dark ? "rgba(255,255,255,.28)" : "rgba(0,0,0,.32)";

  const ColLink = ({ to, children }) => (
    <Link to={to}
      style={{ display:"block", fontSize:13, color:tc, textDecoration:"none", marginBottom:".35rem", lineHeight:1.4, transition:"color .2s,transform .15s", minHeight:28 }}
      onMouseEnter={e => { e.target.style.color=G; e.target.style.transform="translateX(3px)"; }}
      onMouseLeave={e => { e.target.style.color=tc; e.target.style.transform="none"; }}>
      {children}
    </Link>
  );

  const ColHead = ({ children }) => (
    <p style={{ fontSize:10, color:tc2, letterSpacing:".12em", textTransform:"uppercase", fontWeight:700, marginBottom:".6rem", lineHeight:1 }}>{children}</p>
  );

  return (
    <footer style={{ padding:"2.5rem 1.2rem 1.5rem", borderTop:`.5px solid ${dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.08)"}`, background:dark?"rgba(0,0,0,.3)":"rgba(0,0,0,.03)" }}>
      <style>{`
        .footer-inner{max-width:1100px;margin:0 auto;}
        .footer-brand{display:flex;align-items:flex-start;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;margin-bottom:1.6rem;padding-bottom:1.4rem;border-bottom:.5px solid ${dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.07)"};}
        .footer-cols{display:grid;grid-template-columns:repeat(4,1fr);gap:.8rem 1.5rem;margin-bottom:1.4rem;}
        @media(max-width:700px){.footer-cols{grid-template-columns:repeat(2,1fr);gap:.6rem 1rem;}.footer-brand{flex-direction:column;gap:1rem;}}
      `}</style>
      <div className="footer-inner">
        <div className="footer-brand">
          <div style={{ flex:1, minWidth:180, maxWidth:300 }}>
            <Link to="/" style={{ textDecoration:"none", display:"inline-block", marginBottom:".7rem" }}><Logo size={36} textSize={13}/></Link>
            <p style={{ fontSize:13, color:tc, lineHeight:1.6, marginBottom:".8rem" }}>We don't run ads. We engineer ROAS.<br/>One system. Compounding results every month.</p>
            <a href={`https://wa.me/19454076473?text=${encodeURIComponent("Hi there! I would love to be part of your growth journey 🚀")}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:13, color:"#25D366", textDecoration:"none", transition:"transform .2s" }}
              onMouseEnter={e => e.currentTarget.style.transform="translateX(3px)"}
              onMouseLeave={e => e.currentTarget.style.transform="none"}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp us
            </a>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:".5rem" }}>
            <Link to="/contact"
              style={{ display:"inline-block", background:GG, color:"#040608", borderRadius:10, padding:".65rem 1.4rem", fontSize:14, fontWeight:700, textDecoration:"none", boxShadow:"0 4px 18px rgba(0,255,136,.35)", transition:"transform .2s,box-shadow .2s", whiteSpace:"nowrap" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(0,255,136,.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 18px rgba(0,255,136,.35)"; }}>
              Apply Now →
            </Link>
            <p style={{ fontSize:12, color:tc2, margin:0 }}>Response within 24 hours.</p>
          </div>
        </div>
        <div className="footer-cols">
          <div>
            <ColHead>Pages</ColHead>
            {NAV_LINKS.map(l => <ColLink key={l.path} to={l.path}>{l.label}</ColLink>)}
          </div>
          <div>
            <ColHead>Services</ColHead>
            {["Store Audit","Ad Management","CRO Optimization","Landing Pages","Email Flows"].map(s => <ColLink key={s} to="/about">{s}</ColLink>)}
          </div>
          <div>
            <ColHead>Free Tools</ColHead>
            <ColLink to="/audit">Free Store Audit</ColLink>
            <ColLink to="/subscribe">Newsletter</ColLink>
          </div>
          <div>
            <ColHead>Company</ColHead>
            <ColLink to="/about">About Us</ColLink>
            <ColLink to="/case-studies">Case Studies</ColLink>
            <ColLink to="/blog">Blog</ColLink>
            <ColLink to="/contact">Contact</ColLink>
          </div>
        </div>
        <div style={{ borderTop:`.5px solid ${dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)"}`, paddingTop:"1rem", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:".4rem" }}>
          <p style={{ fontSize:11.5, color:tc2, margin:0 }}>© 2025 Bode Conversion Lab. All rights reserved.</p>
          <p style={{ fontSize:11.5, color:tc2, margin:0 }}>Built to convert. Engineered to scale.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── AnimNum ─── */
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
