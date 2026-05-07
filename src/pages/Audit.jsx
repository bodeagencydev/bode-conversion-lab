import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { G, GG } from "../data.js";
import { PageWrapper, GradText, useTheme } from "../components.jsx";

/* ─── PUT YOUR GOOGLE PAGESPEED API KEY HERE ─── */
const PSI_KEY = "AIzaSyCAnT0GIpN-3OVQkP3fPJBwhl6pTU0BN8k";
/* ─────────────────────────────────────────────── */

const CHECKS = [
  { id:"speed",      label:"Page Speed",          icon:"⚡", desc:"How fast your store loads" },
  { id:"mobile",     label:"Mobile Friendliness",  icon:"📱", desc:"Experience on phones" },
  { id:"seo",        label:"SEO Health",           icon:"🔍", desc:"Search engine visibility" },
  { id:"checkout",   label:"Checkout Friction",    icon:"🛒", desc:"Conversion bottlenecks" },
  { id:"images",     label:"Image Optimization",   icon:"🖼️", desc:"File sizes and formats" },
  { id:"ssl",        label:"SSL & Security",       icon:"🔒", desc:"Trust and security signals" },
  { id:"vitals",     label:"Core Web Vitals",      icon:"📊", desc:"Google's UX metrics" },
  { id:"conversion", label:"Conversion Readiness", icon:"💰", desc:"Revenue potential score" },
];

const MSGS = [
  "Pinging Google PageSpeed API...",
  "Running performance tests...",
  "Scanning mobile experience...",
  "Checking SEO signals...",
  "Analysing Core Web Vitals...",
  "Detecting friction points...",
  "Scoring conversion readiness...",
  "Building your report...",
];

const sc  = s => s>=80?"#00ff88":s>=50?"#FAAD4D":"#FF4444";
const gr  = s => s>=80?"A":s>=65?"B":s>=50?"C":"D";
const cl  = v => Math.max(0,Math.min(100,Math.round(v||0)));
const pct = v => v!=null?cl(v*100):null;

async function fetchPSI(storeUrl, strategy) {
  const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(storeUrl)}&strategy=${strategy}&category=performance&category=seo&category=best-practices&category=accessibility&key=${PSI_KEY}`;
  const r = await fetch(url, { signal: AbortSignal.timeout(40000) });
  if (!r.ok) {
    const err = await r.json().catch(()=>({}));
    throw new Error(err?.error?.message || `HTTP ${r.status}`);
  }
  return r.json();
}

function buildReport(desktop, mobile, url) {
  const lh=mobile?.lighthouseResult, lhD=desktop?.lighthouseResult;
  const mP=pct(lh?.categories?.performance?.score), dP=pct(lhD?.categories?.performance?.score);
  const mS=pct(lh?.categories?.seo?.score), mA=pct(lh?.categories?.accessibility?.score), mB=pct(lh?.categories?.["best-practices"]?.score);
  const lcp=lh?.audits?.["largest-contentful-paint"], cls=lh?.audits?.["cumulative-layout-shift"];
  const fid=lh?.audits?.["total-blocking-time"], si=lh?.audits?.["speed-index"];

  const spd=cl((mP??45)*.6+(dP??55)*.4), mob=cl(mP??50), seo=cl(mS??55);
  const lcpMs=lcp?parseFloat(lcp.numericValue):3500, clsV=cls?parseFloat(cls.numericValue):.18, fidMs=fid?parseFloat(fid.numericValue):250;
  let vit=100;
  if(lcpMs>4000)vit-=35;else if(lcpMs>2500)vit-=20;
  if(clsV>0.25)vit-=30;else if(clsV>0.1)vit-=15;
  if(fidMs>600)vit-=25;else if(fidMs>300)vit-=12;
  vit=cl(vit);
  let img=82;
  if(lh?.audits?.["uses-optimized-images"]?.score===0)img-=25;
  if(lh?.audits?.["uses-webp-images"]?.score===0)img-=20;
  if(lh?.audits?.["uses-responsive-images"]?.score===0)img-=15;
  img=cl(img);
  const hsc=lh?.audits?.["is-on-https"]?.score, ssl=hsc===1?98:hsc===0?15:72;
  const chk=cl(50+(mP??50)*.3+(mB??50)*.2);
  const con=cl((mP??50)*.3+(mS??50)*.2+(mB??50)*.2+(mA??50)*.15+ssl*.15);
  const overall=cl((spd+mob+seo+vit+img+ssl+chk+con)/8);
  const leak=overall>=80?"5-15%":overall>=60?"20-35%":overall>=40?"35-55%":"55-70%";
  let domain=url; try{domain=new URL(url).hostname.replace("www.","")}catch{}

  const ranked=[
    {id:"speed",s:spd},{id:"mobile",s:mob},{id:"seo",s:seo},{id:"vitals",s:vit},
    {id:"images",s:img},{id:"ssl",s:ssl},{id:"checkout",s:chk},{id:"conversion",s:con}
  ].sort((a,b)=>a.s-b.s);

  const pMap={
    speed:`Fix mobile page speed (${mob}/100) — every 1s delay cuts conversions 7%`,
    mobile:`Optimise mobile experience — ${mP??"-"}/100 performance on phones`,
    seo:`Fix SEO issues (${seo}/100) — missing tags cut organic traffic`,
    vitals:`Improve Core Web Vitals — Google uses these for search ranking`,
    images:`Optimise product images — uncompressed images slow your store`,
    ssl:`Fix HTTPS immediately — buyers won't trust an unsecured checkout`,
    checkout:`Audit checkout flow — enable guest checkout and trust signals`,
    conversion:`Review CTA placement, social proof and accessibility`,
  };

  return {
    domain, overallScore:overall,
    checks:{
      speed:{score:spd,grade:gr(spd),summary:`Mobile ${mP??"-"}  Desktop ${dP??"-"}  LCP ${lcp?.displayValue??"?"}`,
        issues:[(mP??100)<90?`Mobile performance: ${mP}/100`:"Speed looks solid",lcp&&lcpMs>2500?`LCP ${lcp.displayValue} above 2.5s`:"LCP within threshold"],
        fixes:["Minify JS/CSS and defer non-critical scripts","Preload hero image and serve assets via CDN"]},
      mobile:{score:mob,grade:gr(mob),summary:`Mobile performance ${mP??"-"}/100`,
        issues:[(mP??100)<75?`Mobile ${mP}/100 vs desktop ${dP}/100`:"Mobile score solid",lh?.audits?.["tap-targets"]?.score<1?"Tap targets too small":"Tap targets fine"],
        fixes:["Prioritise mobile-first CSS","Lazy-load below-fold images","Test on real iOS and Android"]},
      seo:{score:seo,grade:gr(seo),summary:`SEO score ${mS??"-"}/100 from Google Lighthouse`,
        issues:[lh?.audits?.["meta-description"]?.score===0?"Missing meta description":"Meta description found",lh?.audits?.["document-title"]?.score===0?"Missing title tag":"Title tag found",(mS??100)<80?`SEO score ${mS}/100 — room to improve`:"SEO fundamentals healthy"],
        fixes:["Add unique 150-160 char meta description per page","Add keyword-rich title under 60 chars","Add product schema markup"]},
      checkout:{score:chk,grade:gr(chk),summary:"Inferred from speed, best-practices & security",
        issues:[(mP??100)<70?"Slow mobile load causes checkout drop-off":"Mobile load acceptable","Guest checkout needs live manual test","Trust badges need manual audit"],
        fixes:["Enable guest checkout — removes #1 conversion killer","Reduce checkout to 2 steps maximum","Display SSL badge and payment logos at checkout"]},
      images:{score:img,grade:gr(img),summary:"Checked for WebP, compression & responsive sizing",
        issues:[lh?.audits?.["uses-optimized-images"]?.score===0?"Images not properly optimised":"Images appear optimised",lh?.audits?.["uses-webp-images"]?.score===0?"Not using WebP/AVIF":"Modern formats detected"],
        fixes:["Compress all product images under 100KB","Convert to WebP — 30% smaller than JPEG","Use srcset for responsive images"]},
      ssl:{score:ssl,grade:gr(ssl),summary:hsc===1?"HTTPS active and valid":"HTTPS status unclear",
        issues:[hsc===1?"SSL certificate active":"HTTPS not confirmed — critical trust issue"],
        fixes:[hsc===1?"Ensure SSL auto-renews and HSTS headers set":"Enable HTTPS immediately via hosting provider"]},
      vitals:{score:vit,grade:gr(vit),summary:`LCP ${lcp?.displayValue??"?"} · CLS ${cls?.displayValue??"?"} · TBT ${fid?.displayValue??"?"}`,
        issues:[lcpMs>2500?`LCP ${lcp?.displayValue} exceeds threshold`:"LCP within threshold",clsV>0.1?`CLS ${cls?.displayValue} — layout shifts detected`:"CLS stable"],
        fixes:["Compress & preload hero image — use WebP","Set explicit width/height on all images","Split large JS bundles"]},
      conversion:{score:con,grade:gr(con),summary:"Composite: performance + SEO + accessibility + best-practices",
        issues:[(mA??100)<80?`Accessibility score ${mA}/100`:"Accessibility looks good","CTA placement requires manual review"],
        fixes:["Fix contrast ratios and add alt text","Ensure Add-to-Cart above fold on mobile","Add social proof near CTA"]},
    },
    topPriorities:ranked.slice(0,3).map(a=>pMap[a.id]),
    estimatedRevenueLeak:`${leak} of potential revenue`,
    verdict:`Based on real Google data, ${domain} scores ${overall}/100. ${overall>=80?"Solid fundamentals — focus on scaling.":overall>=60?"Clear friction points cost you conversions daily.":"Multiple critical issues actively lose you customers."}`,
  };
}

/* ── Animated scanning ring (lusion-inspired) ── */
function ScanRing({ size=96, color:c, score }) {
  const r=((size-10)/2), circ=2*Math.PI*r, dash=(score/100)*circ;
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(128,128,128,.1)" strokeWidth={7}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${c}22`} strokeWidth={12}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={7}
        strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round"
        style={{ transition:"stroke-dasharray 1.6s cubic-bezier(.16,1,.3,1)", filter:`drop-shadow(0 0 6px ${c})` }}/>
    </svg>
  );
}

/* ── Lusion-inspired animated check card ── */
function CheckCard({ check, label, icon, dark, cardBg, cardBorder, mutedText, headingColor, trackBg }) {
  const [open, setOpen] = useState(false);
  const c = sc(check.score);
  return (
    <div onClick={()=>setOpen(v=>!v)}
      style={{ background:cardBg, border:`.5px solid ${open?c+"77":cardBorder}`, borderTop:`.5px solid ${c}66`,
        borderRadius:18, padding:"1.3rem", cursor:"pointer",
        transition:"all .3s cubic-bezier(.16,1,.3,1)",
        position:"relative", overflow:"hidden" }}
      onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-4px) scale(1.01)"; e.currentTarget.style.boxShadow=`0 16px 40px ${c}22, 0 4px 12px rgba(0,0,0,.15)`; e.currentTarget.style.borderColor=c+"55"; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=open?c+"77":cardBorder; }}>
      {/* Top shimmer line */}
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${c}66,transparent)`,pointerEvents:"none" }}/>
      {/* Score bar background glow */}
      <div style={{ position:"absolute",bottom:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${c}00,${c}33,${c}00)`,opacity:open?1:0,transition:"opacity .3s",pointerEvents:"none" }}/>

      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".7rem" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ fontSize:18, filter:open?`drop-shadow(0 0 6px ${c})`:"none", transition:"filter .3s" }}>{icon}</span>
          <span style={{ fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:headingColor }}>{label}</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:c,lineHeight:1,
            textShadow:open?`0 0 20px ${c}88`:"none",transition:"text-shadow .3s" }}>{check.grade}</span>
          <span style={{ fontSize:11,color:mutedText }}>{check.score}/100</span>
          <span style={{ color:c,fontSize:16,transition:"transform .3s cubic-bezier(.16,1,.3,1)",
            transform:open?"rotate(45deg)":"none",display:"inline-block",lineHeight:1 }}>+</span>
        </div>
      </div>

      {/* Animated score bar */}
      <div style={{ height:5,background:trackBg,borderRadius:5,overflow:"hidden",marginBottom:".6rem" }}>
        <div style={{ height:"100%",borderRadius:5,width:`${check.score}%`,
          background:`linear-gradient(90deg,${c}aa,${c},${c}dd)`,
          boxShadow:`0 0 8px ${c}66`,
          transition:"width 1.4s cubic-bezier(.16,1,.3,1)" }}/>
      </div>
      <p style={{ fontSize:12,color:mutedText,lineHeight:1.6,marginBottom:open?".9rem":0 }}>{check.summary}</p>

      {open&&(
        <div style={{ borderTop:dark?".5px solid rgba(255,255,255,.08)":".5px solid rgba(0,0,0,.08)",paddingTop:".8rem",
          animation:"expandIn .3s cubic-bezier(.16,1,.3,1)" }}>
          <style>{`@keyframes expandIn{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:none;}}`}</style>
          {check.issues?.length>0&&(
            <div style={{ marginBottom:".75rem" }}>
              <p style={{ fontSize:10,color:"#ff8888",letterSpacing:".1em",textTransform:"uppercase",fontWeight:700,marginBottom:".5rem" }}>⚠ Issues Found</p>
              {check.issues.map((iss,i)=>(
                <div key={i} style={{ display:"flex",gap:8,marginBottom:5,padding:"4px 8px",background:"rgba(255,68,68,.05)",borderRadius:8 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink:0,marginTop:2 }}><path d="M3 3L9 9M9 3L3 9" stroke="#FF6400" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <p style={{ fontSize:12,color:dark?"rgba(255,255,255,.6)":"rgba(0,0,0,.6)",margin:0,lineHeight:1.5 }}>{iss}</p>
                </div>
              ))}
            </div>
          )}
          {check.fixes?.length>0&&(
            <div>
              <p style={{ fontSize:10,color:"#00ff88bb",letterSpacing:".1em",textTransform:"uppercase",fontWeight:700,marginBottom:".5rem" }}>✓ Recommended Fixes</p>
              {check.fixes.map((fix,i)=>(
                <div key={i} style={{ display:"flex",gap:8,marginBottom:5,padding:"4px 8px",background:"rgba(0,255,136,.05)",borderRadius:8 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink:0,marginTop:2 }}><path d="M2 6L5 9L10 3" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <p style={{ fontSize:12,color:dark?"rgba(255,255,255,.65)":"rgba(0,0,0,.65)",margin:0,lineHeight:1.5 }}>{fix}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main Audit Page ── */
export default function Audit() {
  const { dark } = useTheme();
  const [url,setUrl]       = useState("");
  const [loading,setLoading] = useState(false);
  const [msgIdx,setMsgIdx] = useState(0);
  const [results,setResults] = useState(null);
  const [error,setError]   = useState("");
  const [progress,setProgress] = useState(0);
  const canvasRef = useRef(null);

  const headingColor = dark?"#fff":"#0a0a0a";
  const mutedText    = dark?"rgba(255,255,255,.45)":"rgba(0,0,0,.5)";
  const cardBg       = dark?"linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))":"linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))";
  const cardBorder   = dark?"rgba(255,255,255,.12)":"rgba(0,0,0,.1)";
  const inputBg      = dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.04)";
  const inputBorder  = dark?"rgba(255,255,255,.14)":"rgba(0,0,0,.12)";
  const inputColor   = dark?"#f0f0f0":"#0a0a0a";
  const trackBg      = dark?"rgba(255,255,255,.08)":"rgba(0,0,0,.08)";

  /* Lusion-inspired radar canvas animation during loading */
  useEffect(()=>{
    if(!loading||!canvasRef.current)return;
    const c=canvasRef.current, ctx=c.getContext("2d");
    c.width=c.height=200;
    let angle=0,raf;
    const draw=()=>{
      ctx.clearRect(0,0,200,200);
      const cx=100,cy=100;
      // Rings
      [40,60,80,100].forEach(r=>{
        ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
        ctx.strokeStyle=`rgba(0,255,136,${r===40?.12:.06})`;ctx.lineWidth=1;ctx.stroke();
      });
      // Cross hairs
      ctx.strokeStyle="rgba(0,255,136,.08)";ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,200);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(200,cy);ctx.stroke();
      // Sweep
      const grad=ctx.createConicalGradient?.(cx,cy,angle)||null;
      if(!grad){
        // fallback sweep arc
        const a1=angle-Math.PI*.5, a2=angle;
        const grd=ctx.createLinearGradient(cx+Math.cos(a1)*80,cy+Math.sin(a1)*80,cx+Math.cos(a2)*80,cy+Math.sin(a2)*80);
        grd.addColorStop(0,"rgba(0,255,136,0)");
        grd.addColorStop(1,"rgba(0,255,136,.35)");
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,100,a1,a2);ctx.closePath();
        ctx.fillStyle=grd;ctx.fill();
      }
      // Sweep line
      ctx.beginPath();ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(angle)*100,cy+Math.sin(angle)*100);
      ctx.strokeStyle="rgba(0,255,136,.7)";ctx.lineWidth=1.5;ctx.stroke();
      // Dot at tip
      ctx.beginPath();ctx.arc(cx+Math.cos(angle)*100,cy+Math.sin(angle)*100,3,0,Math.PI*2);
      ctx.fillStyle="#00ff88";ctx.fill();
      // Center dot
      ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);
      ctx.fillStyle="#00ff88";ctx.fill();

      angle=(angle+0.04)%(Math.PI*2);
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(raf);
  },[loading]);

  /* Progress bar during load */
  useEffect(()=>{
    if(!loading){setProgress(0);return;}
    setProgress(5);
    const t1=setTimeout(()=>setProgress(35),2000);
    const t2=setTimeout(()=>setProgress(65),8000);
    const t3=setTimeout(()=>setProgress(85),16000);
    return()=>{ clearTimeout(t1);clearTimeout(t2);clearTimeout(t3); };
  },[loading]);

  const runAudit = async () => {
    let cleaned = url.trim();
    if(!cleaned){setError("Please enter your store URL.");return;}
    if(!/^https?:\/\//i.test(cleaned))cleaned="https://"+cleaned;
    try{new URL(cleaned);}catch{setError("That doesn't look like a valid URL.");return;}

    if(PSI_KEY==="YOUR_GOOGLE_PAGESPEED_API_KEY"){
      setError("⚠ Add your Google PageSpeed API key to Audit.jsx line 9 first.");
      return;
    }

    setError("");setLoading(true);setResults(null);setMsgIdx(0);
    let idx=0;
    const iv=setInterval(()=>{idx=(idx+1)%MSGS.length;setMsgIdx(idx);},2000);
    try{
      const [mRes,dRes] = await Promise.allSettled([
        fetchPSI(cleaned,"mobile"),
        fetchPSI(cleaned,"desktop"),
      ]);
      const mobile  = mRes.status==="fulfilled"?mRes.value:null;
      const desktop = dRes.status==="fulfilled"?dRes.value:null;
      if(!mobile&&!desktop) throw new Error("Both requests failed");
      setProgress(100);
      setTimeout(()=>{ setResults(buildReport(desktop,mobile,cleaned)); },400);
    }catch(e){
      setError(`Analysis failed — ${e.message}. Please try again.`);
    }finally{
      clearInterval(iv);
      setLoading(false);
    }
  };

  const oCol=results?sc(results.overallScore):G;
  const oGrade=results?gr(results.overallScore):"?";

  return (
    <PageWrapper>
      <style>{`
        @keyframes auditSpin{to{transform:rotate(360deg);}}
        @keyframes auditSpin2{to{transform:rotate(-360deg);}}
        @keyframes scanBar{from{width:5%;opacity:.2;}to{width:100%;opacity:1;}}
        @keyframes auditFadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:none;}}
        @keyframes radarPing{0%{transform:scale(1);opacity:.8;}100%{transform:scale(2.5);opacity:0;}}
        .audit-check-enter{animation:auditFadeUp .4s cubic-bezier(.16,1,.3,1) both;}
        .audit-check-enter:nth-child(1){animation-delay:.05s;}
        .audit-check-enter:nth-child(2){animation-delay:.1s;}
        .audit-check-enter:nth-child(3){animation-delay:.15s;}
        .audit-check-enter:nth-child(4){animation-delay:.2s;}
        .audit-check-enter:nth-child(5){animation-delay:.25s;}
        .audit-check-enter:nth-child(6){animation-delay:.3s;}
        .audit-check-enter:nth-child(7){animation-delay:.35s;}
        .audit-check-enter:nth-child(8){animation-delay:.4s;}
      `}</style>

      {/* ── HERO ── */}
      <section style={{ position:"relative",padding:"clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) 2.5rem",overflow:"hidden" }}>
        {/* Animated background orbs */}
        <div style={{ position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:"-15%",left:"50%",transform:"translateX(-50%)",width:"clamp(300px,60vw,700px)",height:"clamp(300px,60vw,700px)",background:"radial-gradient(circle at 40% 40%,rgba(0,255,136,.1),transparent 65%)",animation:"breathe 8s ease-in-out infinite",borderRadius:"50%" }}/>
          <div style={{ position:"absolute",bottom:0,right:"-10%",width:"300px",height:"300px",background:"radial-gradient(circle,rgba(0,255,136,.05),transparent 70%)",animation:"breathe 6s ease-in-out infinite 2s",borderRadius:"50%" }}/>
        </div>

        <div style={{ maxWidth:800,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1 }}>
          <div style={{ animation:"auditFadeUp .6s cubic-bezier(.16,1,.3,1) both" }}>
            <span style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(0,255,136,.1)",border:".5px solid rgba(0,255,136,.28)",borderRadius:100,padding:"5px 14px",fontSize:11,color:G,fontWeight:500,marginBottom:"1.4rem" }}>
              <span style={{ width:6,height:6,background:G,borderRadius:"50%",animation:"pulse 2s infinite" }}/> Powered by Google PageSpeed Insights
            </span>
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(2rem,6vw,3.5rem)",fontWeight:800,lineHeight:1.06,color:headingColor,marginBottom:"1rem",wordBreak:"break-word",animation:"auditFadeUp .6s .1s cubic-bezier(.16,1,.3,1) both",opacity:0 }}>
            Paste your URL.<br/><GradText>See every leak costing you revenue.</GradText>
          </h1>
          <p style={{ fontSize:"clamp(0.9rem,2.5vw,1.05rem)",color:mutedText,lineHeight:1.8,maxWidth:520,margin:"0 auto 2rem",animation:"auditFadeUp .6s .2s cubic-bezier(.16,1,.3,1) both",opacity:0 }}>
            8 conversion checks powered by real Google data. Scores, grades, and specific fixes — in under 30 seconds.
          </p>

          {/* URL Input */}
          <div style={{ maxWidth:640,margin:"0 auto",animation:"auditFadeUp .6s .3s cubic-bezier(.16,1,.3,1) both",opacity:0 }}>
            <div style={{ display:"flex",gap:10,flexWrap:"wrap",marginBottom:error?"6px":"0" }}>
              <div style={{ flex:1,minWidth:220,position:"relative" }}>
                <span style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,pointerEvents:"none" }}>🔗</span>
                <input type="text" placeholder="yourstore.com or https://yourstore.com" value={url}
                  onChange={e=>{ setUrl(e.target.value); setError(""); }}
                  onKeyDown={e=>e.key==="Enter"&&!loading&&runAudit()}
                  style={{ width:"100%",background:inputBg,border:`.5px solid ${error?"#FF4444":inputBorder}`,borderRadius:14,padding:".9rem 1rem .9rem 3rem",color:inputColor,fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box",transition:"border-color .2s,box-shadow .2s" }}
                  onFocus={e=>{ e.target.style.borderColor="rgba(0,255,136,.6)"; e.target.style.boxShadow="0 0 0 3px rgba(0,255,136,.1)"; }}
                  onBlur={e=>{ e.target.style.borderColor=error?"#FF4444":inputBorder; e.target.style.boxShadow="none"; }}/>
              </div>
              <button onClick={runAudit} disabled={loading}
                style={{ background:GG,color:"#040608",border:"none",borderRadius:14,padding:".9rem 1.8rem",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",opacity:loading?.85:1,whiteSpace:"nowrap",boxShadow:"0 4px 24px rgba(0,255,136,.4)",transition:"transform .15s,box-shadow .15s,opacity .15s",position:"relative",overflow:"hidden" }}
                onMouseEnter={e=>{ if(!loading){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 10px 36px rgba(0,255,136,.6)";} }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 24px rgba(0,255,136,.4)"; }}>
                {loading?"Analysing...":"Analyse Store →"}
              </button>
            </div>
            {error&&<p style={{ color:"#FF4444",fontSize:13,marginTop:8,lineHeight:1.5,textAlign:"center" }}>{error}</p>}
          </div>

          {/* Check pills */}
          {!loading&&!results&&(
            <div style={{ display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginTop:"2rem",animation:"auditFadeUp .6s .4s cubic-bezier(.16,1,.3,1) both",opacity:0 }}>
              {CHECKS.map((c,i)=>(
                <span key={c.id} style={{ display:"inline-flex",alignItems:"center",gap:5,background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)",border:dark?".5px solid rgba(255,255,255,.09)":".5px solid rgba(0,0,0,.08)",borderRadius:100,padding:"5px 13px",fontSize:12,color:mutedText,transition:"all .2s",animationDelay:`${i*.05}s` }}
                  onMouseEnter={e=>{ e.currentTarget.style.background="rgba(0,255,136,.08)";e.currentTarget.style.borderColor="rgba(0,255,136,.3)";e.currentTarget.style.color=G; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)";e.currentTarget.style.borderColor=dark?"rgba(255,255,255,.09)":"rgba(0,0,0,.08)";e.currentTarget.style.color=mutedText; }}>
                  {c.icon} {c.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LOADING — RADAR ── */}
      {loading&&(
        <div style={{ maxWidth:560,margin:"0 auto",padding:"0 1.5rem 5rem",textAlign:"center" }}>
          {/* Progress bar */}
          <div style={{ height:2,background:trackBg,borderRadius:2,overflow:"hidden",marginBottom:"2rem" }}>
            <div style={{ height:"100%",background:GG,borderRadius:2,width:`${progress}%`,transition:"width 1s cubic-bezier(.16,1,.3,1)",boxShadow:"0 0 8px rgba(0,255,136,.6)" }}/>
          </div>
          <div style={{ background:cardBg,border:`.5px solid ${cardBorder}`,borderRadius:24,padding:"2.5rem 2rem",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)" }}/>
            {/* Radar */}
            <div style={{ position:"relative",width:160,height:160,margin:"0 auto 1.5rem" }}>
              <canvas ref={canvasRef} style={{ position:"absolute",inset:0,width:160,height:160 }}/>
              {/* Ping rings */}
              <div style={{ position:"absolute",inset:"50%",transform:"translate(-50%,-50%)",width:20,height:20,borderRadius:"50%",border:"1px solid rgba(0,255,136,.6)",animation:"radarPing 2s ease-out infinite" }}/>
              <div style={{ position:"absolute",inset:"50%",transform:"translate(-50%,-50%)",width:20,height:20,borderRadius:"50%",border:"1px solid rgba(0,255,136,.4)",animation:"radarPing 2s ease-out infinite 1s" }}/>
            </div>
            <p style={{ fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:700,color:headingColor,marginBottom:".4rem" }}>{MSGS[msgIdx]}</p>
            <p style={{ fontSize:12,color:mutedText,marginBottom:"1.5rem" }}>This usually takes 15-30 seconds</p>
            {/* Check list */}
            <div style={{ display:"flex",flexDirection:"column",gap:7,textAlign:"left" }}>
              {CHECKS.map((c,i)=>(
                <div key={c.id} style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <span style={{ fontSize:13,flexShrink:0 }}>{c.icon}</span>
                  <div style={{ flex:1,height:3,background:trackBg,borderRadius:3,overflow:"hidden" }}>
                    <div style={{ height:"100%",background:GG,borderRadius:3,boxShadow:"0 0 6px rgba(0,255,136,.5)",animation:`scanBar 2s ${i*.22}s ease-in-out infinite alternate` }}/>
                  </div>
                  <span style={{ fontSize:11,color:mutedText,whiteSpace:"nowrap",minWidth:130,textAlign:"right" }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {results&&!loading&&(
        <div style={{ maxWidth:940,margin:"0 auto",padding:"0 clamp(1rem,4vw,2rem) 5rem" }}>

          {/* Overall score */}
          <div style={{ background:cardBg,border:`.5px solid ${cardBorder}`,borderTop:`.5px solid ${oCol}77`,borderRadius:24,padding:"clamp(1.5rem,4vw,2.5rem)",marginBottom:"1.2rem",position:"relative",overflow:"hidden",animation:"auditFadeUp .5s cubic-bezier(.16,1,.3,1)" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${oCol}66,transparent)` }}/>
            <div style={{ display:"flex",gap:"clamp(1rem,4vw,2.5rem)",alignItems:"center",flexWrap:"wrap" }}>
              <div style={{ position:"relative",flexShrink:0 }}>
                <ScanRing score={results.overallScore} size={100} color={oCol}/>
                <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
                  <span style={{ fontFamily:"'Syne',sans-serif",fontSize:"1.6rem",fontWeight:800,color:oCol,lineHeight:1,textShadow:`0 0 20px ${oCol}88` }}>{oGrade}</span>
                  <span style={{ fontSize:10,color:mutedText }}>{results.overallScore}/100</span>
                </div>
              </div>
              <div style={{ flex:1,minWidth:180 }}>
                <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.2rem,3.5vw,1.6rem)",fontWeight:800,color:headingColor,marginBottom:".4rem" }}>{results.domain}</h2>
                <p style={{ fontSize:13,color:mutedText,lineHeight:1.7,marginBottom:".9rem" }}>{results.verdict}</p>
                <div style={{ display:"inline-flex",gap:10,flexWrap:"wrap" }}>
                  <div style={{ background:"rgba(255,68,68,.1)",border:".5px solid rgba(255,68,68,.22)",borderRadius:10,padding:".5rem 1rem" }}>
                    <p style={{ fontSize:9,color:"rgba(255,100,100,.7)",marginBottom:2,textTransform:"uppercase",letterSpacing:".06em",fontWeight:600 }}>Revenue Leak</p>
                    <p style={{ fontSize:14,fontWeight:700,color:"#FF7B7B",margin:0 }}>{results.estimatedRevenueLeak}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top priorities */}
          <div style={{ background:"linear-gradient(135deg,rgba(255,50,50,.07),rgba(255,50,50,.02))",border:".5px solid rgba(255,80,80,.2)",borderRadius:18,padding:"1.2rem 1.5rem",marginBottom:"1.2rem",animation:"auditFadeUp .5s .1s cubic-bezier(.16,1,.3,1) both",opacity:0 }}>
            <p style={{ fontSize:10,color:"#ff9999",letterSpacing:".12em",textTransform:"uppercase",fontWeight:700,marginBottom:".7rem" }}>🚨 Fix These First</p>
            {results.topPriorities?.map((p,i)=>(
              <div key={i} style={{ display:"flex",gap:10,marginBottom:i<results.topPriorities.length-1?8:0 }}>
                <span style={{ fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,color:"#FF7B7B",flexShrink:0 }}>{i+1}.</span>
                <p style={{ fontSize:13,color:dark?"rgba(255,255,255,.72)":"rgba(0,0,0,.68)",margin:0,lineHeight:1.6 }}>{p}</p>
              </div>
            ))}
          </div>

          {/* Check cards grid */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1rem",marginBottom:"1.5rem" }}>
            {CHECKS.map(c=>{
              const chk=results.checks?.[c.id];
              if(!chk)return null;
              return (
                <div key={c.id} className="audit-check-enter">
                  <CheckCard check={chk} label={c.label} icon={c.icon} dark={dark} cardBg={cardBg} cardBorder={cardBorder} mutedText={mutedText} headingColor={headingColor} trackBg={trackBg}/>
                </div>
              );
            })}
          </div>

          <p style={{ fontSize:11,color:dark?"rgba(255,255,255,.2)":"rgba(0,0,0,.25)",textAlign:"center",marginBottom:"1.5rem",lineHeight:1.6 }}>
            Data sourced from Google PageSpeed Insights API. Checkout & conversion scores are inferred from technical signals.
          </p>

          {/* CTA */}
          <div style={{ background:"linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))",border:".5px solid rgba(0,255,136,.25)",borderRadius:24,padding:"clamp(2rem,5vw,3rem)",textAlign:"center",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:"20%",right:"20%",height:1,background:"linear-gradient(90deg,transparent,rgba(0,255,136,.4),transparent)" }}/>
            <p style={{ fontSize:11,color:G,letterSpacing:".14em",textTransform:"uppercase",marginBottom:".7rem",fontWeight:600 }}>Want us to fix all of this?</p>
            <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.3rem,4vw,2rem)",fontWeight:800,color:headingColor,marginBottom:".7rem",lineHeight:1.15 }}>
              This is the surface.<br/><GradText>Our full audit goes 10× deeper.</GradText>
            </h3>
            <p style={{ fontSize:14,color:mutedText,maxWidth:460,margin:"0 auto 1.5rem",lineHeight:1.75 }}>
              We don't just identify problems — we fix them. Landing pages, checkout flow, ad structure, email sequences.
            </p>
            <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
              <Link to="/contact" className="btn-g" style={{ display:"inline-block" }}>Apply for full professional audit →</Link>
              <button onClick={()=>{ setResults(null); setUrl(""); }} className="btn-ghost">Analyse another store</button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}