import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   1. CURSOR SYSTEM  (Active Theory + Lusion + Eszterbial)
   - Custom cursor dot that follows mouse
   - Trailing "ghost" ring that lags behind
   - Cursor morphs into a circle with text on hover over buttons
   - Leaves a fading particle trail on fast movement
═══════════════════════════════════════════════════ */
export function CursorSystem() {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const labelRef = useRef(null);
  const pos      = useRef({ x: -200, y: -200 });
  const ring     = useRef({ x: -200, y: -200 });
  const vel      = useRef({ x: 0, y: 0 });
  const prevPos  = useRef({ x: -200, y: -200 });
  const raf      = useRef(null);
  const [trail, setTrail]   = useState([]);
  const [label, setLabel]   = useState("");
  const [big, setBig]       = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Only desktop
    if (window.matchMedia("(pointer:coarse)").matches) return;

    const onMove = e => {
      prevPos.current = { ...pos.current };
      pos.current = { x: e.clientX, y: e.clientY };
      vel.current = { x: e.clientX - prevPos.current.x, y: e.clientY - prevPos.current.y };
      if (hidden) setHidden(false);

      // Particle trail on fast movement
      const speed = Math.hypot(vel.current.x, vel.current.y);
      if (speed > 12) {
        const id = Date.now() + Math.random();
        setTrail(t => [...t.slice(-12), { id, x: e.clientX, y: e.clientY, size: Math.random() * 4 + 2 }]);
        setTimeout(() => setTrail(t => t.filter(p => p.id !== id)), 500);
      }
    };

    // Grow + show label on interactive elements
    const onEnter = e => {
      setBig(true);
      const txt = e.target.closest("[data-cursor]")?.dataset.cursor || "";
      setLabel(txt);
    };
    const onLeave = () => { setBig(false); setLabel(""); };

    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("a,button,[data-cursor]").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // MutationObserver re-binds on DOM changes
    const obs = new MutationObserver(() => {
      document.querySelectorAll("a,button,[data-cursor]").forEach(el => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });

    // Animation loop
    const animate = () => {
      // Ring lags (spring)
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px,${pos.current.y - 4}px)`;
      }
      if (ringRef.current) {
        const s = big ? 52 : 28;
        ringRef.current.style.width  = `${s}px`;
        ringRef.current.style.height = `${s}px`;
        ringRef.current.style.transform = `translate(${ring.current.x - s/2}px,${ring.current.y - s/2}px)`;
        ringRef.current.style.opacity = big ? "0.6" : "0.3";
        ringRef.current.style.borderColor = big ? "#00ff88" : "rgba(0,255,136,.5)";
        ringRef.current.style.background  = big ? "rgba(0,255,136,.08)" : "transparent";
      }
      if (labelRef.current) {
        const s = 52;
        labelRef.current.style.opacity  = label ? "1" : "0";
        labelRef.current.style.transform = `translate(${ring.current.x - s/2}px,${ring.current.y - s/2}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      obs.disconnect();
    };
  }, [hidden, big, label]);

  if (hidden) return null;

  return (
    <>
      {/* Trail particles */}
      {trail.map(p => (
        <div key={p.id} style={{
          position: "fixed", left: p.x - p.size/2, top: p.y - p.size/2,
          width: p.size, height: p.size, borderRadius: "50%",
          background: "#00ff88", pointerEvents: "none", zIndex: 99996,
          animation: "trailFade .5s ease-out forwards",
        }}/>
      ))}
      {/* Dot */}
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0, width: 8, height: 8,
        borderRadius: "50%", background: "#00ff88",
        pointerEvents: "none", zIndex: 99999, willChange: "transform",
        boxShadow: "0 0 12px rgba(0,255,136,.9), 0 0 24px rgba(0,255,136,.4)",
        transition: "opacity .3s",
      }}/>
      {/* Ring */}
      <div ref={ringRef} style={{
        position: "fixed", top: 0, left: 0, width: 28, height: 28,
        borderRadius: "50%", border: "1.5px solid rgba(0,255,136,.5)",
        pointerEvents: "none", zIndex: 99998, willChange: "transform",
        transition: "width .3s cubic-bezier(.16,1,.3,1), height .3s cubic-bezier(.16,1,.3,1), opacity .3s, border-color .3s, background .3s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}/>
      {/* Label inside ring */}
      <div ref={labelRef} style={{
        position: "fixed", top: 0, left: 0, width: 52, height: 52,
        borderRadius: "50%", pointerEvents: "none", zIndex: 99999,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 8, fontWeight: 700, color: "#00ff88", letterSpacing: ".05em",
        textTransform: "uppercase", transition: "opacity .2s", opacity: 0,
        willChange: "transform",
      }}>{label}</div>
      <style>{`
        @keyframes trailFade { from{opacity:.7;transform:scale(1);} to{opacity:0;transform:scale(.2);} }
        * { cursor: none !important; }
      `}</style>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   2. SCROLL PROGRESS BAR  (Dropbox Motion — purposeful)
═══════════════════════════════════════════════════ */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const u = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setPct(scrollHeight - clientHeight > 0 ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0);
    };
    window.addEventListener("scroll", u, { passive: true });
    return () => window.removeEventListener("scroll", u);
  }, []);
  return (
    <div style={{ position:"fixed",top:0,left:0,right:0,height:2,zIndex:10001,pointerEvents:"none",background:"rgba(0,255,136,.08)" }}>
      <div style={{ height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#00ff88,#00cc6a)",boxShadow:"0 0 10px rgba(0,255,136,.7)",transition:"width .08s linear" }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   3. SPLIT TEXT  (Eszterbial + Uncommon Design)
   Each letter animates in independently with stagger
   Usage: <SplitText text="Hello" className="..." style={...} tag="h1" />
═══════════════════════════════════════════════════ */
export function SplitText({ text, tag: Tag = "span", style = {}, className = "", delay = 0, stagger = 0.04, once = true }) {
  const ref    = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); if (once) obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [once]);

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className} style={{ display:"inline", ...style }}>
      <style>{`
        @keyframes letterIn {
          from { opacity:0; transform:translateY(60%) rotate(8deg); }
          to   { opacity:1; transform:none; }
        }
      `}</style>
      {words.map((word, wi) => (
        <span key={wi} style={{ display:"inline-block", overflow:"hidden", marginRight:".25em" }}>
          {word.split("").map((char, ci) => {
            const i = words.slice(0,wi).join("").length + wi + ci;
            return (
              <span key={ci} style={{
                display: "inline-block",
                opacity: vis ? 1 : 0,
                animation: vis ? `letterIn .6s cubic-bezier(.16,1,.3,1) ${delay + i * stagger}s both` : "none",
              }}>{char}</span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/* ═══════════════════════════════════════════════════
   4. MAGNETIC ELEMENT  (Lusion)
   Wraps any element — it pulls toward cursor on hover
   Usage: <Magnetic><button>Click me</button></Magnetic>
═══════════════════════════════════════════════════ */
export function Magnetic({ children, strength = 0.35, style = {} }) {
  const ref = useRef(null);

  const onMove = useCallback(e => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const cx = left + width/2, cy = top + height/2;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  }, [strength]);

  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }, []);

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ display:"inline-block", transition:"transform .4s cubic-bezier(.16,1,.3,1)", ...style }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   5. TILT CARD  (Active Theory)
   3D perspective tilt on mouse move
   Usage: <TiltCard><div className="glass">...</div></TiltCard>
═══════════════════════════════════════════════════ */
export function TiltCard({ children, style = {}, className = "", intensity = 12 }) {
  const ref = useRef(null);
  const glowRef = useRef(null);

  const onMove = e => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5;
    const y = (e.clientY - top)  / height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x*intensity}deg) rotateX(${-y*intensity}deg) scale(1.02)`;
    el.style.boxShadow = `${-x*20}px ${-y*20}px 50px rgba(0,255,136,.12), 0 8px 32px rgba(0,0,0,.2)`;
    // Moving glow spot
    if (glowRef.current) {
      glowRef.current.style.left   = `${(x+0.5)*100}%`;
      glowRef.current.style.top    = `${(y+0.5)*100}%`;
      glowRef.current.style.opacity = "1";
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0) rotateX(0) scale(1)";
    el.style.boxShadow = "none";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <div ref={ref} className={className}
      onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition:"transform .15s ease, box-shadow .15s ease", willChange:"transform", position:"relative", overflow:"hidden", ...style }}>
      {/* Spotlight glow that follows cursor */}
      <div ref={glowRef} style={{
        position:"absolute", width:160, height:160, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(0,255,136,.15) 0%, transparent 70%)",
        transform:"translate(-50%,-50%)", pointerEvents:"none", opacity:0,
        transition:"opacity .3s", zIndex:0,
      }}/>
      <div style={{ position:"relative", zIndex:1 }}>{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   6. SCROLL REVEAL  (Unseen.co — cinematic, weighted)
   Elements slide in with spring physics + blur
   Usage: <ScrollReveal delay={0.1}>...</ScrollReveal>
═══════════════════════════════════════════════════ */
export function ScrollReveal({ children, delay = 0, direction = "up", style = {}, once = true }) {
  const ref    = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); if (once) obs.disconnect(); }
    }, { threshold: 0.08 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [once]);

  const transforms = {
    up:    `translateY(${vis?0:48}px)`,
    down:  `translateY(${vis?0:-48}px)`,
    left:  `translateX(${vis?0:48}px)`,
    right: `translateX(${vis?0:-48}px)`,
    scale: `scale(${vis?1:.88})`,
  };

  return (
    <div ref={ref} style={{
      opacity:    vis ? 1 : 0,
      transform:  transforms[direction] || transforms.up,
      filter:     `blur(${vis?0:4}px)`,
      transition: `opacity .9s ${delay}s cubic-bezier(.16,1,.3,1), transform .9s ${delay}s cubic-bezier(.16,1,.3,1), filter .6s ${delay}s ease`,
      willChange: "opacity, transform, filter",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   7. CLICK RIPPLE  (Rive — state-machine reactive)
   Green ripple bursts from every click
═══════════════════════════════════════════════════ */
export function ClickRipple() {
  const [ripples, setRipples] = useState([]);
  useEffect(() => {
    const h = e => {
      const id = Date.now() + Math.random();
      setRipples(r => [...r.slice(-6), { id, x:e.clientX, y:e.clientY }]);
      setTimeout(() => setRipples(r => r.filter(rp=>rp.id!==id)), 700);
    };
    window.addEventListener("click", h);
    return () => window.removeEventListener("click", h);
  }, []);
  return (
    <>
      <style>{`
        @keyframes rippleOut {
          0%   { width:0;height:0;opacity:.55;transform:translate(-50%,-50%); }
          100% { width:100px;height:100px;opacity:0;transform:translate(-50%,-50%); }
        }
        @keyframes rippleOut2 {
          0%   { width:0;height:0;opacity:.25;transform:translate(-50%,-50%); }
          100% { width:160px;height:160px;opacity:0;transform:translate(-50%,-50%); }
        }
      `}</style>
      {ripples.map(rp=>(
        <div key={rp.id}>
          <div style={{ position:"fixed",left:rp.x,top:rp.y,borderRadius:"50%",border:"1.5px solid rgba(0,255,136,.55)",pointerEvents:"none",zIndex:99995,animation:"rippleOut .7s ease-out forwards" }}/>
          <div style={{ position:"fixed",left:rp.x,top:rp.y,borderRadius:"50%",border:"1px solid rgba(0,255,136,.2)",pointerEvents:"none",zIndex:99994,animation:"rippleOut2 .7s .1s ease-out forwards" }}/>
        </div>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════
   8. MORPHING BACKGROUND ORBS  (Lusion + Dropbox)
   Slow-morphing blobs in the page background
═══════════════════════════════════════════════════ */
export function MorphOrbs() {
  return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      <style>{`
        @keyframes morph1 {
          0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 70%;transform:translate(0,0) scale(1);}
          25%    {border-radius:40% 60% 30% 70%/60% 40% 70% 30%;transform:translate(30px,-40px) scale(1.04);}
          50%    {border-radius:70% 30% 50% 50%/30% 70% 60% 40%;transform:translate(-20px,-60px) scale(.97);}
          75%    {border-radius:30% 70% 40% 60%/70% 30% 50% 50%;transform:translate(50px,-20px) scale(1.02);}
        }
        @keyframes morph2 {
          0%,100%{border-radius:40% 60% 30% 70%/60% 40% 70% 30%;transform:translate(0,0);}
          33%    {border-radius:60% 40% 70% 30%/40% 60% 30% 70%;transform:translate(-40px,30px);}
          66%    {border-radius:70% 30% 60% 40%/30% 70% 40% 60%;transform:translate(20px,50px);}
        }
        @keyframes morph3 {
          0%,100%{border-radius:50% 50% 60% 40%/40% 60% 50% 50%;transform:translate(0,0) rotate(0deg);}
          50%    {border-radius:40% 60% 40% 60%/60% 40% 60% 40%;transform:translate(-30px,-40px) rotate(15deg);}
        }
      `}</style>
      <div style={{ position:"absolute",top:"-12%",left:"-8%",width:"clamp(260px,38vw,520px)",height:"clamp(260px,38vw,520px)",background:"radial-gradient(circle at 40% 40%,rgba(0,255,136,.075),rgba(0,180,80,.03) 55%,transparent 80%)",animation:"morph1 20s ease-in-out infinite",willChange:"transform,border-radius" }}/>
      <div style={{ position:"absolute",bottom:"2%",right:"-8%",width:"clamp(220px,30vw,420px)",height:"clamp(220px,30vw,420px)",background:"radial-gradient(circle at 60% 60%,rgba(0,255,136,.055),rgba(0,150,70,.02) 55%,transparent 80%)",animation:"morph2 25s ease-in-out infinite 4s",willChange:"transform,border-radius" }}/>
      <div style={{ position:"absolute",top:"38%",right:"3%",width:"clamp(140px,18vw,260px)",height:"clamp(140px,18vw,260px)",background:"radial-gradient(circle,rgba(0,255,136,.04),transparent 70%)",animation:"morph3 16s ease-in-out infinite 2s",willChange:"transform,border-radius" }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   9. COUNTER  (Uncommon Design — typographic drama)
   Counts up with spring easing when in view
═══════════════════════════════════════════════════ */
export function Counter({ from=0, to, suffix="", prefix="", duration=2200, style={} }) {
  const [val, setVal] = useState(from);
  const ref           = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(()=>{
    if(!ref.current)return;
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting&&!started){setStarted(true);obs.disconnect();} },{threshold:.3});
    obs.observe(ref.current);
    return()=>obs.disconnect();
  },[started]);

  useEffect(()=>{
    if(!started)return;
    let s=null;
    const step=ts=>{
      if(!s)s=ts;
      const p=Math.min((ts-s)/duration,1);
      const ease=p===1?1:1-Math.pow(2,-10*p); // expo ease-out
      setVal(Math.round(from+ease*(to-from)));
      if(p<1)requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },[started,from,to,duration]);

  return <span ref={ref} style={style}>{prefix}{val}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════
   10. HOVER GLOW BORDER  (Unseen.co)
   A card whose border glows and traces on hover
   Usage: <GlowBorder>...</GlowBorder>
═══════════════════════════════════════════════════ */
export function GlowBorder({ children, color="#00ff88", style={}, className="" }) {
  const ref    = useRef(null);
  const glowEl = useRef(null);

  const onMove = e => {
    const el = ref.current;
    if (!el||!glowEl.current) return;
    const { left, top } = el.getBoundingClientRect();
    glowEl.current.style.left = `${e.clientX - left}px`;
    glowEl.current.style.top  = `${e.clientY - top}px`;
    glowEl.current.style.opacity = "1";
  };
  const onLeave = () => { if (glowEl.current) glowEl.current.style.opacity = "0"; };

  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ position:"relative", overflow:"hidden", ...style }}>
      {/* Chasing glow */}
      <div ref={glowEl} style={{
        position:"absolute", width:200, height:200, borderRadius:"50%",
        background:`radial-gradient(circle, ${color}22 0%, transparent 65%)`,
        transform:"translate(-50%,-50%)", pointerEvents:"none",
        opacity:0, transition:"opacity .3s", zIndex:0,
      }}/>
      <div style={{ position:"relative", zIndex:1 }}>{children}</div>
    </div>
  );
}