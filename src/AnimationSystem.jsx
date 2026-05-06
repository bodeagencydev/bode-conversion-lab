import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   1. MAGNETIC CURSOR
   A glowing green dot that follows the mouse
   and morphs bigger when near interactive items
───────────────────────────────────────────── */
export function MagneticCursor() {
  const dot   = useRef(null);
  const ring  = useRef(null);
  const pos   = useRef({ x: -100, y: -100 });
  const ring_ = useRef({ x: -100, y: -100 });
  const raf   = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = e => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };
    window.addEventListener("mousemove", move);

    const animate = () => {
      ring_.current.x += (pos.current.x - ring_.current.x) * 0.12;
      ring_.current.y += (pos.current.y - ring_.current.y) * 0.12;
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate(${ring_.current.x - 18}px, ${ring_.current.y - 18}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    // Grow ring on hover over interactive elements
    const grow = () => {
      if (ring.current) { ring.current.style.width = "52px"; ring.current.style.height = "52px"; ring.current.style.opacity = "0.5"; }
    };
    const shrink = () => {
      if (ring.current) { ring.current.style.width = "36px"; ring.current.style.height = "36px"; ring.current.style.opacity = "0.25"; }
    };
    document.querySelectorAll("a,button,[role=button]").forEach(el => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    // Re-bind on DOM changes
    const obs = new MutationObserver(() => {
      document.querySelectorAll("a,button,[role=button]").forEach(el => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf.current);
      obs.disconnect();
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Small dot — snappy */}
      <div ref={dot} style={{
        position: "fixed", top: 0, left: 0, width: 8, height: 8,
        borderRadius: "50%", background: "#00ff88",
        pointerEvents: "none", zIndex: 99999,
        boxShadow: "0 0 10px rgba(0,255,136,.8), 0 0 20px rgba(0,255,136,.4)",
        willChange: "transform",
      }}/>
      {/* Lagging ring */}
      <div ref={ring} style={{
        position: "fixed", top: 0, left: 0, width: 36, height: 36,
        borderRadius: "50%", border: "1.5px solid rgba(0,255,136,.4)",
        pointerEvents: "none", zIndex: 99998,
        transition: "width .2s, height .2s, opacity .2s",
        willChange: "transform",
        opacity: 0.25,
      }}/>
    </>
  );
}

/* ─────────────────────────────────────────────
   2. FLOATING MORPHING ORBS (background layer)
   Large blobs that drift & morph slowly
───────────────────────────────────────────── */
export function FloatingOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <style>{`
        @keyframes orbFloat1 {
          0%,100% { transform: translate(0,0) scale(1) rotate(0deg); border-radius: 60% 40% 70% 30% / 50% 60% 40% 70%; }
          25%     { transform: translate(40px,-60px) scale(1.05) rotate(5deg); border-radius: 40% 60% 30% 70% / 60% 40% 70% 30%; }
          50%     { transform: translate(-30px,-80px) scale(.96) rotate(-3deg); border-radius: 70% 30% 50% 50% / 30% 70% 60% 40%; }
          75%     { transform: translate(60px,-30px) scale(1.03) rotate(4deg); border-radius: 30% 70% 40% 60% / 70% 30% 50% 50%; }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0,0) scale(1); border-radius: 40% 60% 30% 70% / 60% 40% 70% 30%; }
          33%     { transform: translate(-50px,40px) scale(1.08); border-radius: 60% 40% 70% 30% / 40% 60% 30% 70%; }
          66%     { transform: translate(30px,60px) scale(.94); border-radius: 70% 30% 60% 40% / 30% 70% 40% 60%; }
        }
        @keyframes orbFloat3 {
          0%,100% { transform: translate(0,0) scale(1); border-radius: 50% 50% 60% 40% / 40% 60% 50% 50%; }
          50%     { transform: translate(-40px,-50px) scale(1.06); border-radius: 40% 60% 40% 60% / 60% 40% 60% 40%; }
        }
      `}</style>
      {/* Orb 1 — top left */}
      <div style={{
        position: "absolute", top: "-10%", left: "-8%",
        width: "clamp(280px,35vw,480px)", height: "clamp(280px,35vw,480px)",
        background: "radial-gradient(circle at 40% 40%, rgba(0,255,136,.07), rgba(0,180,80,.03) 55%, transparent 80%)",
        animation: "orbFloat1 18s ease-in-out infinite",
        willChange: "transform",
      }}/>
      {/* Orb 2 — bottom right */}
      <div style={{
        position: "absolute", bottom: "5%", right: "-10%",
        width: "clamp(240px,30vw,420px)", height: "clamp(240px,30vw,420px)",
        background: "radial-gradient(circle at 60% 60%, rgba(0,255,136,.06), rgba(0,150,70,.02) 55%, transparent 80%)",
        animation: "orbFloat2 22s ease-in-out infinite 3s",
        willChange: "transform",
      }}/>
      {/* Orb 3 — center right */}
      <div style={{
        position: "absolute", top: "40%", right: "5%",
        width: "clamp(160px,20vw,280px)", height: "clamp(160px,20vw,280px)",
        background: "radial-gradient(circle, rgba(0,255,136,.04), transparent 70%)",
        animation: "orbFloat3 14s ease-in-out infinite 1.5s",
        willChange: "transform",
      }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────
   3. CLICK RIPPLE
   Green ripple expands from every click
───────────────────────────────────────────── */
export function ClickRipple() {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const handler = e => {
      const id = Date.now() + Math.random();
      setRipples(r => [...r, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 800);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <style>{`
        @keyframes rippleOut {
          0%   { width:0; height:0; opacity:.6; transform:translate(-50%,-50%); }
          100% { width:120px; height:120px; opacity:0; transform:translate(-50%,-50%); }
        }
      `}</style>
      {ripples.map(rp => (
        <div key={rp.id} style={{
          position: "fixed", left: rp.x, top: rp.y,
          borderRadius: "50%", border: "1.5px solid rgba(0,255,136,.5)",
          pointerEvents: "none", zIndex: 99997,
          animation: "rippleOut .8s ease-out forwards",
        }}/>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   4. TILT CARD WRAPPER
   Wrap any card — it tilts toward the cursor
───────────────────────────────────────────── */
export function TiltCard({ children, style = {}, className = "" }) {
  const ref = useRef(null);

  const onMove = e => {
    const el   = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5;  // -0.5 … 0.5
    const y = (e.clientY - top)  / height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.02)`;
    el.style.boxShadow = `${-x * 18}px ${-y * 18}px 40px rgba(0,255,136,.12)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
    el.style.boxShadow = "none";
  };

  return (
    <div ref={ref} className={className}
      onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition: "transform .15s ease, box-shadow .15s ease", willChange: "transform", ...style }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   5. SPRING REVEAL
   Children fade+slide up when they enter viewport
   with spring-like overshoot
───────────────────────────────────────────── */
export function SpringReveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity:   vis ? 1 : 0,
      transform: vis ? "translateY(0) scale(1)" : "translateY(36px) scale(.97)",
      transition: `opacity .7s ${delay}s cubic-bezier(.16,1,.3,1), transform .7s ${delay}s cubic-bezier(.16,1,.3,1)`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   6. COUNTING NUMBER
   Animates from 0 → target when in view
───────────────────────────────────────────── */
export function CountUp({ target, suffix = "", prefix = "", duration = 2000 }) {
  const [val, setVal]   = useState(0);
  const ref             = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      // ease-out-expo
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   7. GLITCH TEXT
   Subtle glitch effect on headings (optional)
───────────────────────────────────────────── */
export function GlitchText({ children, style = {} }) {
  return (
    <>
      <style>{`
        .glitch-wrap { position: relative; display: inline-block; }
        .glitch-wrap::before,
        .glitch-wrap::after {
          content: attr(data-text);
          position: absolute; top: 0; left: 0;
          width: 100%; overflow: hidden;
          opacity: 0;
        }
        .glitch-wrap:hover::before {
          animation: glitchTop .3s steps(2) 1;
          color: #00ff88; clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
          left: 2px; opacity: 1;
        }
        .glitch-wrap:hover::after {
          animation: glitchBot .3s steps(2) 1;
          color: #0081fb; clip-path: polygon(0 66%, 100% 66%, 100% 100%, 0 100%);
          left: -2px; opacity: 1;
        }
        @keyframes glitchTop {
          0%  { transform: translate(-2px, -2px); }
          50% { transform: translate(2px, 2px);   }
          100%{ transform: translate(0, 0);        }
        }
        @keyframes glitchBot {
          0%  { transform: translate(2px, 2px);  }
          50% { transform: translate(-2px,-2px); }
          100%{ transform: translate(0, 0);       }
        }
      `}</style>
      <span className="glitch-wrap" data-text={typeof children === "string" ? children : ""} style={style}>
        {children}
      </span>
    </>
  );
}

/* ─────────────────────────────────────────────
   8. SCROLL PROGRESS BAR (top of page)
───────────────────────────────────────────── */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setPct(scrollHeight - clientHeight > 0 ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 2.5,
      background: "rgba(0,255,136,.12)", zIndex: 10000, pointerEvents: "none",
    }}>
      <div style={{
        height: "100%", width: `${pct}%`,
        background: "linear-gradient(90deg,#00ff88,#00cc6a)",
        boxShadow: "0 0 8px rgba(0,255,136,.6)",
        transition: "width .1s linear",
      }}/>
    </div>
  );
}
