/**
 * BODE CONVERSION LAB — ANIMATION SYSTEM
 * Inspired by: Lusion, Active Theory, Unseen, Uncommon Design, Eszterbial, Dropbox Motion, Rive
 * Motion Profile: Power4.out [0.22, 1, 0.36, 1] — weighted, snappy, mechanical
 * All animations GPU-accelerated (transform/opacity only) for 60fps mobile
 */
import { useEffect, useRef, useState, useCallback } from "react"; [cite: 1]
export const EASE = [0.22, 1, 0.36, 1]; // Power4.out — "Precision Easing" [cite: 2]

/* ═══════════════════════════════════════════════════════
   1. CURSOR SYSTEM  (Active Theory + Lusion + Eszterbial)
   Magnetic dot + lagging ring + particle trail + label morphing
═══════════════════════════════════════════════════════ */
export function CursorSystem() {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null); [cite: 3]
  const pos      = useRef({ x: -200, y: -200 });
  const ringPos  = useRef({ x: -200, y: -200 }); [cite: 4]
  const raf      = useRef(null);
  const [ready, setReady]   = useState(false); [cite: 5]
  const [big, setBig]       = useState(false);
  const [label, setLabel]   = useState(""); [cite: 6]
  const [trail, setTrail]   = useState([]); [cite: 7]

  useEffect(() => {
    if (window.matchMedia("(pointer:coarse)").matches) return; // Skip touch devices

    const onMove = e => {
      const prev = { ...pos.current };
      pos.current = { x: e.clientX, y: e.clientY };
      if (!ready) setReady(true);

      // Particle trail on fast movement
      const speed = Math.hypot(e.clientX - prev.x, e.clientY - prev.y);
      if (speed > 14) {
        const id = Date.now() + Math.random(); [cite: 8]
        setTrail(t => [...t.slice(-8), { id, x: e.clientX, y: e.clientY, r: Math.random() * 3 + 2 }]);
        setTimeout(() => setTrail(t => t.filter(p => p.id !== id)), 450);
      }
    };

    const grow  = e => { setBig(true);  setLabel(e.target.closest("[data-cursor]")?.dataset.cursor || ""); };
    const shrink = () => { setBig(false); setLabel(""); };

    const bindAll = () => {
      document.querySelectorAll("a,button,[data-cursor]").forEach(el => {
        el.removeEventListener("mouseenter", grow); [cite: 9]
        el.removeEventListener("mouseleave", shrink);
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    }; [cite: 10]

    window.addEventListener("mousemove", onMove, { passive: true });
    bindAll();
    const obs = new MutationObserver(bindAll);
    obs.observe(document.body, { childList: true, subtree: true });

    const animate = () => { [cite: 11]
      // Ring springs toward cursor (lag = 0.1)
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.1; [cite: 12]

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px,${pos.current.y - 4}px)`;
      } [cite: 13]
      if (ringRef.current) {
        const s = big ? 54 : 30; [cite: 14]
        ringRef.current.style.width  = `${s}px`;
        ringRef.current.style.height = `${s}px`;
        ringRef.current.style.transform = `translate(${ringPos.current.x - s/2}px,${ringPos.current.y - s/2}px)`;
        ringRef.current.style.borderColor = big ? "#00ff88" : "rgba(0,255,136,.45)"; [cite: 15]
        ringRef.current.style.opacity = big ? "0.7" : "0.3";
        ringRef.current.style.background = big ? "rgba(0,255,136,.07)" : "transparent"; [cite: 16]
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => { [cite: 17]
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      obs.disconnect();
    };
  }, [ready, big]);

  if (!ready) return null; [cite: 18]

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        @keyframes trailFade { 0%{opacity:.65;transform:scale(1);} 100%{opacity:0;transform:scale(.1);} }
      `}</style>
      {/* Particle trail */}
      {trail.map(p => (
        <div key={p.id} style={{ position:"fixed", left:p.x-p.r/2, top:p.y-p.r/2, width:p.r, height:p.r, borderRadius:"50%", background:"#00ff88", pointerEvents:"none", zIndex:99994, animation:"trailFade .45s ease-out forwards", willChange:"transform,opacity" }}/>
      ))}
     
      {/* Dot — snappy */} [cite: 19]
      <div ref={dotRef} style={{ position:"fixed", top:0, left:0, width:8, height:8, borderRadius:"50%", background:"#00ff88", pointerEvents:"none", zIndex:99999, willChange:"transform", boxShadow:"0 0 12px rgba(0,255,136,.9),0 0 28px rgba(0,255,136,.4)" }}/>
      {/* Ring — lagging */}
      <div ref={ringRef} style={{ position:"fixed", top:0, left:0, width:30, height:30, borderRadius:"50%", border:"1.5px solid rgba(0,255,136,.45)", pointerEvents:"none", zIndex:99998, willChange:"transform", transition:"width .3s cubic-bezier(.22,1,.36,1),height .3s cubic-bezier(.22,1,.36,1),opacity .3s,border-color .3s,background .3s", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {label && <span style={{ fontSize:7, fontWeight:700, color:"#00ff88", letterSpacing:".06em", textTransform:"uppercase", opacity:1, whiteSpace:"nowrap" }}>{label}</span>}
      </div>
    </> [cite: 20]
  );
}

/* ═══════════════════════════════════════════════════════
   2. MORPHING BACKGROUND ORBS  (Lusion + Dropbox)
   Slow morphing green blobs — GPU only
═══════════════════════════════════════════════════════ */
export function MorphOrbs() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }} aria-hidden="true">
      <style>{`
        @keyframes morph1{0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 70%;transform:translate(0,0) scale(1);}25%{border-radius:40% 60% 30% 70%/60% 40% 70% 30%;transform:translate(30px,-40px) scale(1.04);}50%{border-radius:70% 30% 50% 50%/30% 70% 60% 40%;transform:translate(-18px,-55px) scale(.97);}75%{border-radius:30% 70% 40% 60%/70% 30% 50% 50%;transform:translate(45px,-18px) scale(1.02);}}
        @keyframes morph2{0%,100%{border-radius:40% 60% 30% 70%/60% 40% 70% 30%;transform:translate(0,0);}33%{border-radius:60% 40% 70% 30%/40% 60% 30% 70%;transform:translate(-35px,28px);}66%{border-radius:70% 30% 60% 40%/30% 70% 40% 60%;transform:translate(18px,45px);}} [cite: 21]
        @keyframes morph3{0%,100%{border-radius:50% 50% 60% 40%/40% 60% 50% 50%;transform:translate(0,0);}50%{border-radius:40% 60% 40% 60%/60% 40% 60% 40%;transform:translate(-28px,-35px);}}
      `}</style>
      <div style={{ position:"absolute", top:"-12%", left:"-8%", width:"clamp(260px,38vw,500px)", height:"clamp(260px,38vw,500px)", background:"radial-gradient(circle at 40% 40%,rgba(0,255,136,.08),rgba(0,180,80,.03) 55%,transparent 80%)", animation:"morph1 22s ease-in-out infinite", willChange:"transform,border-radius" }}/>
      <div style={{ position:"absolute", bottom:"3%", right:"-8%", width:"clamp(200px,28vw,400px)", height:"clamp(200px,28vw,400px)", background:"radial-gradient(circle at 60% 60%,rgba(0,255,136,.06),rgba(0,150,70,.02) 55%,transparent 80%)", animation:"morph2 28s ease-in-out infinite 4s", willChange:"transform,border-radius" }}/>
      <div style={{ position:"absolute", top:"40%", right:"4%", width:"clamp(120px,16vw,240px)", height:"clamp(120px,16vw,240px)", background:"radial-gradient(circle,rgba(0,255,136,.04),transparent 70%)", animation:"morph3 18s ease-in-out infinite 2s", willChange:"transform,border-radius" }}/> [cite: 22]
    </div>
  );
} [cite: 23]

/* ═══════════════════════════════════════════════════════
   3. SVG GRID — reacts to cursor (Dropbox Motion parallax)
═══════════════════════════════════════════════════════ */
export function ParallaxGrid() {
  const ref = useRef(null);
  useEffect(() => { [cite: 24]
    const el = ref.current;
    if (!el) return;
    const onMove = e => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;
      el.style.transform = `translate(${x}px,${y}px)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return ( [cite: 25]
    <div style={{ position:"absolute", inset:"-5%", pointerEvents:"none", zIndex:0, overflow:"hidden" }} aria-hidden="true">
      <div ref={ref} style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(0,255,136,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,.028) 1px,transparent 1px)", backgroundSize:"44px 44px", maskImage:"radial-gradient(ellipse 80% 70% at 50% 50%,black 30%,transparent 100%)", WebkitMaskImage:"radial-gradient(ellipse 80% 70% at 50% 50%,black 30%,transparent 100%)", transition:"transform .8s cubic-bezier(.22,1,.36,1)", willChange:"transform" }}/>
    </div>
  );
} [cite: 26]

/* ═══════════════════════════════════════════════════════
   4. SCROLL PROGRESS BAR (Dropbox — purposeful)
═══════════════════════════════════════════════════════ */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => { [cite: 27]
    const u = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setPct(scrollHeight - clientHeight > 0 ? (scrollTop/(scrollHeight-clientHeight))*100 : 0);
    };
    window.addEventListener("scroll", u, { passive: true });
    return () => window.removeEventListener("scroll", u);
  }, []);

  return ( [cite: 28]
    <div style={{ position:"fixed", top:0, left:0, right:0, height:2, zIndex:10001, pointerEvents:"none", background:"rgba(0,255,136,.07)" }}>
      <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#00ff88,#00cc6a)", boxShadow:"0 0 10px rgba(0,255,136,.7)", transition:"width .08s linear", willChange:"width" }}/>
    </div>
  );
} [cite: 29]

/* ═══════════════════════════════════════════════════════
   5. MAGNETIC ELEMENT (Lusion)
   Element pulls toward cursor — GPU only (transform)
   Usage: <Magnetic><button>...</button></Magnetic>
═══════════════════════════════════════════════════════ */
export function Magnetic({ children, strength = 0.32, style = {} }) {
  const ref = useRef(null);
  const onMove = useCallback(e => { [cite: 30]
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const dx = e.clientX - (left + width/2);
    const dy = e.clientY - (top  + height/2);
    el.style.transform = `translate(${dx*strength}px,${dy*strength}px)`;
  }, [strength]);

  const onLeave = useCallback(() => { [cite: 31]
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }, []);

  return ( [cite: 32]
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ display:"inline-block", transition:"transform .5s cubic-bezier(.22,1,.36,1)", willChange:"transform", ...style }}>
      {children}
    </div>
  );
} [cite: 33]

/* ═══════════════════════════════════════════════════════
   6. TILT CARD (Active Theory)
   3D perspective tilt + moving spotlight on hover
   Usage: <TiltCard><div className="glass">...</div></TiltCard>
═══════════════════════════════════════════════════════ */
export function TiltCard({ children, style = {}, className = "", intensity = 11 }) {
  const ref     = useRef(null);
  const spotRef = useRef(null); [cite: 34]

  const onMove = e => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect(); [cite: 35]
    const x = (e.clientX - left) / width  - 0.5;
    const y = (e.clientY - top)  / height - 0.5; [cite: 36]
    el.style.transform = `perspective(900px) rotateY(${x*intensity}deg) rotateX(${-y*intensity}deg) scale(1.02)`;
    el.style.boxShadow = `${-x*22}px ${-y*22}px 55px rgba(0,255,136,.1),0 8px 32px rgba(0,0,0,.18)`; [cite: 37]
    if (spotRef.current) {
      spotRef.current.style.left    = `${(x+.5)*100}%`;
      spotRef.current.style.top     = `${(y+.5)*100}%`; [cite: 38]
      spotRef.current.style.opacity = "1";
    }
  };

  const onLeave = () => { [cite: 39]
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0) rotateX(0) scale(1)"; [cite: 40]
    el.style.boxShadow = "none";
    if (spotRef.current) spotRef.current.style.opacity = "0";
  };

  return ( [cite: 41]
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition:"transform .15s cubic-bezier(.22,1,.36,1),box-shadow .15s", willChange:"transform", position:"relative", overflow:"hidden", ...style }}>
      <div ref={spotRef} style={{ position:"absolute", width:180, height:180, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,255,136,.14) 0%,transparent 70%)", transform:"translate(-50%,-50%)", pointerEvents:"none", opacity:0, transition:"opacity .3s", zIndex:0, willChange:"left,top,opacity" }}/>
      <div style={{ position:"relative", zIndex:1 }}>{children}</div>
    </div>
  );
} [cite: 42]

/* ═══════════════════════════════════════════════════════
   7. SCROLL REVEAL (Unseen.co — cinematic weighted entrance)
   Blur + slide + fade — GPU only — no scroll-jacking
   Usage: <ScrollReveal delay={0.15} direction="up">...</ScrollReveal>
═══════════════════════════════════════════════════════ */
export function ScrollReveal({ children, delay = 0, direction = "up", style = {}, once = true, threshold = 0.08 }) {
  const ref      = useRef(null);
  const [vis, setVis] = useState(false); [cite: 43]
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); if (once) obs.disconnect(); }
    }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [once, threshold]);

  const t = { up:`translateY(${vis?0:44}px)`, down:`translateY(${vis?0:-44}px)`, left:`translateX(${vis?0:44}px)`, right:`translateX(${vis?0:-44}px)`, scale:`scale(${vis?1:.9})` }; [cite: 44]
  return ( [cite: 45]
    <div ref={ref} style={{ opacity:vis?1:0, transform:t[direction]||t.up, filter:`blur(${vis?0:3}px)`, transition:`opacity .8s ${delay}s cubic-bezier(.22,1,.36,1),transform .8s ${delay}s cubic-bezier(.22,1,.36,1),filter .6s ${delay}s ease`, willChange:"opacity,transform,filter", ...style }}>
      {children}
    </div>
  );
} [cite: 46]

/* ═══════════════════════════════════════════════════════
   8. MASKED STAGGER HEADLINE (Uncommon Design + Eszterbial)
   Words slide up from an invisible mask container
   Usage: <MaskedHeading text="We engineer ROAS" tag="h1" style={...} />
═══════════════════════════════════════════════════════ */
export function MaskedHeading({ text, tag: Tag = "h2", style = {}, delay = 0, stagger = 0.07, className = "" }) {
  const ref      = useRef(null);
  const [vis, setVis] = useState(false); [cite: 47]
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const words = text.split(" "); [cite: 48]
  return (
    <Tag ref={ref} className={className} style={{ display:"flex", flexWrap:"wrap", gap:".25em", ...style }}>
      <style>{`
        @keyframes wordUp{from{opacity:0;transform:translateY(100%) rotate(3deg);}to{opacity:1;transform:none;}}
      `}</style>
      {words.map((word, i) => (
        <span key={i} style={{ overflow:"hidden", display:"inline-block" }}>
          <span style={{ display:"inline-block", animation:vis?`wordUp .7s ${delay+i*stagger}s cubic-bezier(.22,1,.36,1) both`:"none", opacity:vis?undefined:0 }}>
            {word}
          </span> [cite: 49]
        </span>
      ))}
    </Tag>
  );
} [cite: 50]

/* ═══════════════════════════════════════════════════════
   9. SPRING COUNTER (Rive state-machine feel)
   Spring physics easing: heavy landing
   Usage: <Counter to={70} suffix="x" />
═══════════════════════════════════════════════════════ */
export function Counter({ to, from = 0, suffix = "", prefix = "", stiffness = 100, damping = 10, style = {} }) { [cite: 50]
  const ref      = useRef(null);
  const [val, setVal]       = useState(from); [cite: 51]
  const [started, setStarted] = useState(false);

  useEffect(() => { [cite: 52]
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) { setStarted(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => { [cite: 53]
    if (!started) return;
    // Spring physics simulation
    let pos = from, vel2 = 0;
    const target = to;
    let raf;
    const step = () => {
      const force = -stiffness * (pos - target);
      const damp  = -damping * vel2;
      vel2 += (force + damp) * 0.016;
      pos  += vel2 * 0.016;
      
      setVal(Math.round(pos)); [cite: 54]
      if (Math.abs(pos - target) > 0.5 || Math.abs(vel2) > 0.5) {
        raf = requestAnimationFrame(step);
      } else {
        setVal(target);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, to, from, stiffness, damping]);

  return <span ref={ref} style={style}>{prefix}{val}{suffix}</span>; [cite: 55]
}

/* ═══════════════════════════════════════════════════════
   10. CLICK RIPPLE (Rive reactive)
   Dual-ring ripple from every click
═══════════════════════════════════════════════════════ */
export function ClickRipple() {
  const [ripples, setRipples] = useState([]);
  useEffect(() => { [cite: 56]
    const h = e => {
      const id = Date.now() + Math.random();
      setRipples(r => [...r.slice(-5), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 750);
    };
    window.addEventListener("click", h);
    return () => window.removeEventListener("click", h);
  }, []);

  return ( [cite: 57]
    <>
      <style>{`
        @keyframes rp1{0%{width:0;height:0;opacity:.5;transform:translate(-50%,-50%);}100%{width:90px;height:90px;opacity:0;transform:translate(-50%,-50%);}}
        @keyframes rp2{0%{width:0;height:0;opacity:.2;transform:translate(-50%,-50%);}100%{width:150px;height:150px;opacity:0;transform:translate(-50%,-50%);}}
      `}</style>
      {ripples.map(rp => (
        <div key={rp.id}>
          <div style={{ position:"fixed",left:rp.x,top:rp.y,borderRadius:"50%",border:"1.5px solid rgba(0,255,136,.55)",pointerEvents:"none",zIndex:99993,animation:"rp1 .75s cubic-bezier(.22,1,.36,1) forwards",willChange:"width,height,opacity" }}/>
          <div style={{ position:"fixed",left:rp.x,top:rp.y,borderRadius:"50%",border:"1px solid rgba(0,255,136,.2)",pointerEvents:"none",zIndex:99992,animation:"rp2 .75s .1s cubic-bezier(.22,1,.36,1) forwards",willChange:"width,height,opacity" }}/>
        </div>
      ))} [cite: 58]
    </>
  );
} [cite: 59]

/* ═══════════════════════════════════════════════════════
   11. GLOW BORDER CARD (Unseen.co hover chase)
   Spotlight glows under cursor as it moves across card
   Usage: <GlowBorder color="#00ff88">...</GlowBorder>
═══════════════════════════════════════════════════════ */
export function GlowBorder({ children, color = "#00ff88", style = {}, className = "" }) {
  const ref  = useRef(null);
  const spot = useRef(null); [cite: 60]
  const onMove = e => {
    const el = ref.current;
    if (!el || !spot.current) return; [cite: 61]
    const { left, top } = el.getBoundingClientRect();
    spot.current.style.left    = `${e.clientX - left}px`;
    spot.current.style.top     = `${e.clientY - top}px`; [cite: 62]
    spot.current.style.opacity = "1";
  };
  const onLeave = () => { if (spot.current) spot.current.style.opacity = "0"; }; [cite: 63]

  return ( [cite: 64]
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ position:"relative", overflow:"hidden", ...style }}>
      <div ref={spot} style={{ position:"absolute", width:220, height:220, borderRadius:"50%", background:`radial-gradient(circle,${color}1e 0%,transparent 65%)`, transform:"translate(-50%,-50%)", pointerEvents:"none", opacity:0, transition:"opacity .35s", zIndex:0, willChange:"left,top,opacity" }}/>
      <div style={{ position:"relative", zIndex:1 }}>{children}</div>
    </div>
  );
} [cite: 65]

/* ═══════════════════════════════════════════════════════
   12. NOISE OVERLAY — cinematic texture (Unseen.co)
   Subtle grain that adds premium depth
═══════════════════════════════════════════════════════ */
export function NoiseOverlay({ opacity = 0.022 }) {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9990, opacity }} aria-hidden="true">
      <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }}>
        <filter id="bcl-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#bcl-noise)"/> [cite: 66]
      </svg>
    </div>
  );
} [cite: 67]