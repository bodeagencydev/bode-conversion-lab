import { Link } from "react-router-dom";
import { G, GG } from "./data.js";
import { GradText, useTheme } from "./components.jsx";
import { ScrollReveal, MaskedHeading, Magnetic } from "./AnimationSystem.jsx";

export default function NotFound() {
  const { dark } = useTheme();
  const mutedText  = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.5)";
  const mutedText2 = dark ? "rgba(255,255,255,.3)"  : "rgba(0,0,0,.35)";
  const headingColor = dark ? "#fff" : "#0a0a0a";
  const cardBg = dark
    ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))"
    : "linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))";

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem)", textAlign:"center", position:"relative", overflow:"hidden" }}>
      {/* Background glow */}
      <div style={{ position:"absolute", width:500, height:500, top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"radial-gradient(circle,rgba(0,255,136,.08),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>

      {/* Animated 404 */}
      <div style={{ position:"relative", marginBottom:"2rem" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(6rem,20vw,12rem)", fontWeight:800, lineHeight:1, background:GG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"heroFadeUp .6s cubic-bezier(.22,1,.36,1) both", opacity:0, filter:"drop-shadow(0 0 40px rgba(0,255,136,.3))" }}>
          404
        </div>
        {/* Scanning line over 404 */}
        <div style={{ position:"absolute", left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.6),transparent)", animation:"scan 3s ease-in-out infinite", pointerEvents:"none" }}/>
      </div>

      <ScrollReveal delay={0.2}>
        <div style={{ background:cardBg, border:`.5px solid rgba(0,255,136,.2)`, borderRadius:20, padding:"2rem 2.5rem", maxWidth:520, marginBottom:"2rem", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.4),transparent)" }}/>

          <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.28)", borderRadius:100, padding:"4px 12px", fontSize:11, color:G, fontWeight:600, marginBottom:"1rem", letterSpacing:".06em" }}>
            <span style={{ width:5, height:5, background:G, borderRadius:"50%", animation:"pulse 2s infinite" }}/> LAB DIAGNOSTIC
          </span>

          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.4rem,4vw,1.8rem)", fontWeight:800, color:headingColor, marginBottom:".75rem", lineHeight:1.2 }}>
            Page not found — but your <GradText>leaks still are.</GradText>
          </h1>

          <p style={{ fontSize:14, color:mutedText, lineHeight:1.75, marginBottom:"1.5rem" }}>
            The page you're looking for doesn't exist. But while you're here — most e-commerce stores lose 30-65% of potential revenue to fixable friction points. Let's find yours.
          </p>

          {/* Quick links */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:"1.5rem" }}>
            {[
              { path:"/audit",        label:"🔍 Run a free store audit",        desc:"Find every revenue leak in your store" },
              { path:"/",             label:"🏠 Go to homepage",                desc:"Back to Bode Conversion Lab" },
              { path:"/case-studies", label:"📈 See client results",            desc:"Real stores, real numbers" },
              { path:"/contact",      label:"💬 Talk to us",                    desc:"Response within 24 hours" },
            ].map(l => (
              <Link key={l.path} to={l.path} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.03)", border:dark?".5px solid rgba(255,255,255,.08)":".5px solid rgba(0,0,0,.07)", borderRadius:12, textDecoration:"none", transition:"all .3s cubic-bezier(.22,1,.36,1)", minHeight:44 }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(0,255,136,.07)"; e.currentTarget.style.borderColor="rgba(0,255,136,.3)"; e.currentTarget.style.transform="translateX(4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background=dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.03)"; e.currentTarget.style.borderColor=dark?"rgba(255,255,255,.08)":"rgba(0,0,0,.07)"; e.currentTarget.style.transform="none"; }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:headingColor, margin:0 }}>{l.label}</p>
                  <p style={{ fontSize:11, color:mutedText2, margin:0 }}>{l.desc}</p>
                </div>
                <span style={{ color:G, fontSize:16, flexShrink:0 }}>→</span>
              </Link>
            ))}
          </div>

          <Magnetic>
            <Link to="/audit" className="btn-g" style={{ display:"block", width:"100%", textAlign:"center" }}>
              Audit my store for free →
            </Link>
          </Magnetic>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <p style={{ fontSize:12, color:mutedText2 }}>
          Error 404 · Bode Conversion Lab · <Link to="/" style={{ color:G, textDecoration:"none" }}>bodeconversionlab.com</Link>
        </p>
      </ScrollReveal>
    </div>
  );
}
