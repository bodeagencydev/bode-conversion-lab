import { useState } from "react";
import { Link } from "react-router-dom";
import { G, GG } from "../data.js";
import { PageWrapper, Particles, GradText, useTheme } from "../components.jsx";

const CHECKS = [
  { id:"speed",      label:"Page Speed",          icon:"⚡" },
  { id:"mobile",     label:"Mobile Friendliness",  icon:"📱" },
  { id:"seo",        label:"SEO Health",           icon:"🔍" },
  { id:"checkout",   label:"Checkout Friction",    icon:"🛒" },
  { id:"images",     label:"Image Optimization",   icon:"🖼️" },
  { id:"ssl",        label:"SSL & Security",       icon:"🔒" },
  { id:"vitals",     label:"Core Web Vitals",      icon:"📊" },
  { id:"conversion", label:"Conversion Readiness", icon:"💰" },
];
const MSGS = [
  "Connecting to Google PageSpeed...","Running performance analysis...",
  "Scanning mobile experience...","Checking SEO signals...",
  "Analysing Core Web Vitals...","Detecting friction points...",
  "Scoring conversion readiness...","Building your report...",
];

const sc  = s => s>=80?"#00ff88":s>=50?"#FAAD4D":"#FF4444";
const gr  = s => s>=80?"A":s>=65?"B":s>=50?"C":"D";
const cl  = v => Math.max(0,Math.min(100,Math.round(v||0)));
const pct = v => v!=null?cl(v*100):null;

async function fetchPSI(storeUrl, strategy) {
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(storeUrl)}&strategy=${strategy}&category=performance&category=seo&category=best-practices&category=accessibility`;
  /* allorigins wraps the response in { contents: "<json string>", status: {...} } */
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(api)}`;
  const r = await fetch(proxy, { signal: AbortSignal.timeout(35000) });
  if (!r.ok) throw new Error(`Proxy HTTP ${r.status}`);
  const w = await r.json();
  if (!w?.contents) throw new Error("Empty proxy response");
  const d = JSON.parse(w.contents);
  if (d?.error) throw new Error(d.error.message||"PSI error");
  return d;
}

function buildReport(desktop, mobile, url) {
  const lh=mobile?.lighthouseResult, lhD=desktop?.lighthouseResult;
  const mP=pct(lh?.categories?.performance?.score), dP=pct(lhD?.categories?.performance?.score);
  const mS=pct(lh?.categories?.seo?.score), mA=pct(lh?.categories?.accessibility?.score), mB=pct(lh?.categories?.["best-practices"]?.score);
  const lcp=lh?.audits?.["largest-contentful-paint"], cls=lh?.audits?.["cumulative-layout-shift"], fid=lh?.audits?.["total-blocking-time"], si=lh?.audits?.["speed-index"];

  const spd=cl((mP??45)*.6+(dP??55)*.4);
  const mob=cl(mP??50);
  const seo=cl(mS??55);
  const lcpMs=lcp?parseFloat(lcp.numericValue):3500, clsV=cls?parseFloat(cls.numericValue):.18, fidMs=fid?parseFloat(fid.numericValue):250;
  let vit=100; if(lcpMs>4000)vit-=35;else if(lcpMs>2500)vit-=20; if(clsV>0.25)vit-=30;else if(clsV>0.1)vit-=15; if(fidMs>600)vit-=25;else if(fidMs>300)vit-=12; vit=cl(vit);
  let img=82; if(lh?.audits?.["uses-optimized-images"]?.score===0)img-=25; if(lh?.audits?.["uses-webp-images"]?.score===0)img-=20; if(lh?.audits?.["uses-responsive-images"]?.score===0)img-=15; img=cl(img);
  const hsc=lh?.audits?.["is-on-https"]?.score, ssl=hsc===1?98:hsc===0?15:72;
  const chk=cl(50+(mP??50)*.3+(mB??50)*.2);
  const con=cl((mP??50)*.3+(mS??50)*.2+(mB??50)*.2+(mA??50)*.15+ssl*.15);
  const overall=cl((spd+mob+seo+vit+img+ssl+chk+con)/8);
  const leak=overall>=80?"5-15%":overall>=60?"20-35%":overall>=40?"35-55%":"55-70%";
  let domain=url; try{domain=new URL(url).hostname.replace("www.","")}catch{}

  const ranked=[{id:"speed",s:spd},{id:"mobile",s:mob},{id:"seo",s:seo},{id:"vitals",s:vit},{id:"images",s:img},{id:"ssl",s:ssl},{id:"checkout",s:chk},{id:"conversion",s:con}].sort((a,b)=>a.s-b.s);
  const pMap={speed:`Fix mobile page speed (${mob}/100) — every 1s delay cuts conversions 7%`,mobile:`Optimise mobile (${mP??"-"}/100 performance on phones)`,seo:`Fix SEO issues (${seo}/100) — missing tags cut organic traffic`,vitals:`Improve Core Web Vitals — Google uses these for search ranking`,images:`Optimise product images — uncompressed images slow store and kill ROAS`,ssl:`Fix HTTPS immediately — buyers won't trust an unsecured checkout`,checkout:`Audit checkout — enable guest checkout and add trust signals`,conversion:`Review CTA placement, social proof and trust signals`};

  return {
    domain, overallScore:overall,
    checks:{
      speed:{score:spd,grade:gr(spd),summary:`Mobile ${mP??"-"}  Desktop ${dP??"-"}  LCP ${lcp?.displayValue??"?"}`,issues:[(mP??100)<90?`Mobile performance: ${mP}/100`:"Speed looks solid",lcp&&parseFloat(lcp.numericValue)>2500?`LCP ${lcp.displayValue} above 2.5s threshold`:"LCP within threshold"].filter(Boolean),fixes:["Minify JS/CSS and defer non-critical scripts","Preload hero image and serve assets via CDN"]},
      mobile:{score:mob,grade:gr(mob),summary:`Mobile performance ${mP??"-"}/100`,issues:[(mP??100)<75?`Mobile ${mP}/100 vs desktop ${dP}/100`:"Mobile score is solid",lh?.audits?.["tap-targets"]?.score<1?"Tap targets too small":"Tap targets look fine"],fixes:["Prioritise mobile-first CSS","Lazy-load below-fold images","Test on real iOS and Android devices"]},
      seo:{score:seo,grade:gr(seo),summary:`SEO score ${mS??"-"}/100 from Google Lighthouse`,issues:[lh?.audits?.["meta-description"]?.score===0?"Missing meta description tag":"Meta description found",lh?.audits?.["document-title"]?.score===0?"Missing title tag":"Title tag found",(mS??100)<80?`SEO score ${mS}/100 — room to improve`:"SEO fundamentals healthy"],fixes:["Add unique 150-160 char meta description per page","Add keyword-rich title tags under 60 chars","Add product schema markup"]},
      checkout:{score:chk,grade:gr(chk),summary:"Inferred from speed, best-practices & security",issues:[(mP??100)<70?"Slow mobile load will cause checkout abandonment":"Mobile load acceptable","Guest checkout requires live manual test","Trust badges not verifiable from URL alone"],fixes:["Enable guest checkout — removes #1 conversion killer","Reduce checkout to 2 steps maximum","Display SSL badge and payment logos at checkout"]},
      images:{score:img,grade:gr(img),summary:"Checked for WebP, compression & responsive sizing",issues:[lh?.audits?.["uses-optimized-images"]?.score===0?"Images not properly optimised":"Images appear optimised",lh?.audits?.["uses-webp-images"]?.score===0?"Not using WebP/AVIF formats":"Modern image formats detected"],fixes:["Compress all product images under 100KB","Convert to WebP — 30% smaller than JPEG","Use srcset for responsive images"]},
      ssl:{score:ssl,grade:gr(ssl),summary:hsc===1?"HTTPS active and valid":"HTTPS status unclear",issues:[hsc===1?"SSL certificate active and valid":"HTTPS not confirmed — critical trust issue"],fixes:[hsc===1?"Ensure SSL auto-renews and HSTS headers set":"Enable HTTPS immediately via hosting provider"]},
      vitals:{score:vit,grade:gr(vit),summary:`LCP ${lcp?.displayValue??"?"} · CLS ${cls?.displayValue??"?"} · TBT ${fid?.displayValue??"?"}`,issues:[lcpMs>2500?`LCP ${lcp?.displayValue} exceeds threshold`:"LCP within threshold",clsV>0.1?`CLS ${cls?.displayValue} — layout shifts detected`:"CLS looks stable"],fixes:["Compress & preload hero image — use WebP","Set explicit width/height on all images","Split large JS bundles"]},
      conversion:{score:con,grade:gr(con),summary:"Composite: performance + SEO + accessibility + best-practices",issues:[(mA??100)<80?`Accessibility score ${mA}/100`:"Accessibility looks good","CTA placement requires manual review","Social proof elements need manual audit"],fixes:["Fix contrast ratios and add alt text","Ensure Add-to-Cart is above fold on mobile","Add social proof near CTA"]},
    },
    topPriorities:ranked.slice(0,3).map(a=>pMap[a.id]),
    estimatedRevenueLeak:`${leak} of potential revenue`,
    verdict:`Based on real Google data, ${domain} scores ${overall}/100. ${overall>=80?"Solid fundamentals — focus on scaling.":overall>=60?"Clear friction points cost you conversions daily.":"Multiple critical issues actively lose you customers."}`,
  };
}

function Ring({score,size=96,color:c}){const r=(size-10)/2,circ=2*Math.PI*r,dash=(score/100)*circ;return(<svg width={size} height={size} style={{transform:"rotate(-90deg)",flexShrink:0}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(128,128,128,.13)" strokeWidth={7}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={7} strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round" style={{transition:"stroke-dasharray 1.4s cubic-bezier(.16,1,.3,1)"}}/></svg>);}

function CheckCard({check,label,icon,dark,cardBg,cardBorder,mutedText,headingColor,trackBg}){
  const[open,setOpen]=useState(false);const c=sc(check.score);
  return(<div onClick={()=>setOpen(v=>!v)} style={{background:cardBg,border:`.5px solid ${open?c+"66":cardBorder}`,borderTop:`.5px solid ${c}55`,borderRadius:16,padding:"1.2rem 1.3rem",cursor:"pointer",transition:"border-color .25s,transform .2s,box-shadow .2s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 12px 32px ${c}18`;}} onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".6rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:17}}>{icon}</span><span style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:headingColor}}>{label}</span></div>
      <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:c,lineHeight:1}}>{check.grade}</span><span style={{fontSize:11,color:mutedText}}>{check.score}/100</span><span style={{color:c,fontSize:16,transition:"transform .25s",transform:open?"rotate(45deg)":"none",display:"inline-block",lineHeight:1}}>+</span></div>
    </div>
    <div style={{height:5,background:trackBg,borderRadius:5,overflow:"hidden",marginBottom:".5rem"}}><div style={{height:"100%",background:`linear-gradient(90deg,${c},${c}99)`,borderRadius:5,width:`${check.score}%`,transition:"width 1.2s cubic-bezier(.16,1,.3,1)"}}/></div>
    <p style={{fontSize:12,color:mutedText,lineHeight:1.55,marginBottom:open?".9rem":0}}>{check.summary}</p>
    {open&&(<div style={{borderTop:dark?".5px solid rgba(255,255,255,.07)":".5px solid rgba(0,0,0,.07)",paddingTop:".75rem"}}>
      {check.issues?.length>0&&<div style={{marginBottom:".75rem"}}><p style={{fontSize:10,color:"#ff8888",letterSpacing:".08em",textTransform:"uppercase",fontWeight:700,marginBottom:".4rem"}}>⚠ Issues</p>{check.issues.map((iss,i)=>(<div key={i} style={{display:"flex",gap:7,marginBottom:4}}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{flexShrink:0,marginTop:2}}><path d="M3 3L9 9M9 3L3 9" stroke="#FF6400" strokeWidth="1.5" strokeLinecap="round"/></svg><p style={{fontSize:12,color:dark?"rgba(255,255,255,.55)":"rgba(0,0,0,.55)",margin:0,lineHeight:1.5}}>{iss}</p></div>))}</div>}
      {check.fixes?.length>0&&<div><p style={{fontSize:10,color:"#00ff88aa",letterSpacing:".08em",textTransform:"uppercase",fontWeight:700,marginBottom:".4rem"}}>✓ Fixes</p>{check.fixes.map((fix,i)=>(<div key={i} style={{display:"flex",gap:7,marginBottom:4}}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{flexShrink:0,marginTop:2}}><path d="M2 6L5 9L10 3" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg><p style={{fontSize:12,color:dark?"rgba(255,255,255,.6)":"rgba(0,0,0,.6)",margin:0,lineHeight:1.5}}>{fix}</p></div>))}</div>}
    </div>)}
  </div>);
}

export default function Audit(){
  const{dark}=useTheme();
  const[url,setUrl]=useState(""),[loading,setLoading]=useState(false),[msgIdx,setMsgIdx]=useState(0),[results,setResults]=useState(null),[error,setError]=useState("");
  const headingColor=dark?"#fff":"#0a0a0a",mutedText=dark?"rgba(255,255,255,.45)":"rgba(0,0,0,.5)";
  const cardBg=dark?"linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))":"linear-gradient(135deg,rgba(0,0,0,.03),rgba(0,0,0,.01))";
  const cardBorder=dark?"rgba(255,255,255,.12)":"rgba(0,0,0,.1)",inputBg=dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.04)";
  const inputBorder=dark?"rgba(255,255,255,.14)":"rgba(0,0,0,.12)",inputColor=dark?"#f0f0f0":"#0a0a0a",trackBg=dark?"rgba(255,255,255,.08)":"rgba(0,0,0,.08)";

  const runAudit=async()=>{
    let cleaned=url.trim();
    if(!cleaned){setError("Please enter your store URL.");return;}
    if(!/^https?:\/\//i.test(cleaned))cleaned="https://"+cleaned;
    try{new URL(cleaned);}catch{setError("That doesn't look like a valid URL.");return;}
    setError("");setLoading(true);setResults(null);setMsgIdx(0);
    let idx=0;const iv=setInterval(()=>{idx=(idx+1)%MSGS.length;setMsgIdx(idx);},1800);
    try{
      const[mRes,dRes]=await Promise.allSettled([fetchPSI(cleaned,"mobile"),fetchPSI(cleaned,"desktop")]);
      const mobile=mRes.status==="fulfilled"?mRes.value:null;
      const desktop=dRes.status==="fulfilled"?dRes.value:null;
      if(!mobile&&!desktop)throw new Error("Could not reach Google PageSpeed API");
      setResults(buildReport(desktop,mobile,cleaned));
    }catch(e){setError(`Analysis failed — ${e.message}. Please try again in a moment.`);}
    finally{clearInterval(iv);setLoading(false);}
  };

  const oCol=results?sc(results.overallScore):G,oGrade=results?gr(results.overallScore):"?";

  return(<PageWrapper>
    <section style={{position:"relative",padding:"clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) 2.5rem",overflow:"hidden"}}>
      <Particles/><div style={{position:"absolute",width:600,height:600,top:-150,left:"50%",transform:"translateX(-50%)",background:"radial-gradient(circle,rgba(0,255,136,.13),transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}/>
      <div style={{maxWidth:780,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
        <span style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(0,255,136,.1)",border:".5px solid rgba(0,255,136,.28)",borderRadius:100,padding:"5px 14px",fontSize:11,color:G,fontWeight:500,marginBottom:"1.4rem"}}><span style={{width:6,height:6,background:G,borderRadius:"50%",animation:"pulse 2s infinite"}}/> Powered by Google PageSpeed Insights</span>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.9rem,5.5vw,3.3rem)",fontWeight:800,lineHeight:1.08,color:headingColor,marginBottom:"1rem",wordBreak:"break-word"}}>Paste your URL.<br/><GradText>See exactly where you're losing money.</GradText></h1>
        <p style={{fontSize:"clamp(0.9rem,2.5vw,1rem)",color:mutedText,lineHeight:1.75,maxWidth:500,margin:"0 auto 2rem"}}>Real data from Google's API. 8 conversion checks. Specific fixes — like PageSpeed Insights but built for e-commerce revenue.</p>
        <div style={{maxWidth:620,margin:"0 auto",display:"flex",gap:10,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:220,position:"relative"}}><span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none"}}>🔗</span>
            <input type="text" placeholder="yourstore.com" value={url} onChange={e=>{setUrl(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&!loading&&runAudit()} style={{width:"100%",background:inputBg,border:`.5px solid ${error?"#FF4444":inputBorder}`,borderRadius:12,padding:".85rem 1rem .85rem 2.7rem",color:inputColor,fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box",transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor="rgba(0,255,136,.5)"} onBlur={e=>e.target.style.borderColor=error?"#FF4444":inputBorder}/>
          </div>
          <button onClick={runAudit} disabled={loading} style={{background:GG,color:"#040608",border:"none",borderRadius:12,padding:".85rem 1.6rem",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",opacity:loading?.8:1,whiteSpace:"nowrap",boxShadow:"0 4px 22px rgba(0,255,136,.35)",transition:"transform .15s,box-shadow .15s"}} onMouseEnter={e=>{if(!loading){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 34px rgba(0,255,136,.55)";}}} onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 22px rgba(0,255,136,.35)";}}>
            {loading?"Analysing...":"Analyse Store →"}
          </button>
        </div>
        {error&&<p style={{color:"#FF4444",fontSize:13,marginTop:10,maxWidth:560,margin:"10px auto 0",lineHeight:1.5}}>{error}</p>}
        {!loading&&!results&&<div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginTop:"1.8rem"}}>{CHECKS.map(c=>(<span key={c.id} style={{display:"inline-flex",alignItems:"center",gap:5,background:dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.04)",border:dark?".5px solid rgba(255,255,255,.09)":".5px solid rgba(0,0,0,.08)",borderRadius:100,padding:"4px 11px",fontSize:11.5,color:mutedText}}>{c.icon} {c.label}</span>))}</div>}
      </div>
    </section>

    {loading&&<div style={{maxWidth:580,margin:"0 auto",padding:"0 1.5rem 5rem"}}>
      <div style={{background:cardBg,border:`.5px solid ${cardBorder}`,borderRadius:24,padding:"2.5rem 2rem",position:"relative",overflow:"hidden",textAlign:"center"}}>
        <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)"}}/>
        <div style={{width:70,height:70,margin:"0 auto 1.5rem",position:"relative"}}>
          <div style={{position:"absolute",inset:0,borderRadius:"50%",border:`2.5px solid ${G}`,borderTopColor:"transparent",animation:"auditSpin 0.9s linear infinite"}}/>
          <div style={{position:"absolute",inset:10,borderRadius:"50%",border:`1.5px solid ${G}`,borderBottomColor:"transparent",animation:"auditSpin 1.4s linear infinite reverse"}}/>
          <div style={{position:"absolute",inset:"50%",transform:"translate(-50%,-50%)",width:8,height:8,borderRadius:"50%",background:G,animation:"pulse 1s ease-in-out infinite"}}/>
        </div>
        <p style={{fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:700,color:headingColor,marginBottom:".4rem"}}>{MSGS[msgIdx]}</p>
        <p style={{fontSize:12,color:mutedText,marginBottom:"1.5rem"}}>Fetching real data from Google PageSpeed API...</p>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>{CHECKS.map((c,i)=>(<div key={c.id} style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:13,flexShrink:0}}>{c.icon}</span><div style={{flex:1,height:4,background:trackBg,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",background:GG,borderRadius:4,animation:`scanBar 1.8s ${i*.18}s ease-in-out infinite alternate`}}/></div><span style={{fontSize:11,color:mutedText,whiteSpace:"nowrap",minWidth:120,textAlign:"left"}}>{c.label}</span></div>))}</div>
      </div>
      <style>{`@keyframes auditSpin{to{transform:rotate(360deg);}}@keyframes scanBar{from{width:10%;opacity:.3;}to{width:100%;opacity:1;}}`}</style>
    </div>}

    {results&&!loading&&<div style={{maxWidth:920,margin:"0 auto",padding:"0 clamp(1rem,4vw,2rem) 5rem"}}>
      <div style={{background:cardBg,border:`.5px solid ${cardBorder}`,borderTop:`.5px solid ${oCol}66`,borderRadius:24,padding:"clamp(1.4rem,4vw,2.2rem)",marginBottom:"1.2rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:`linear-gradient(90deg,transparent,${oCol}77,transparent)`}}/>
        <div style={{display:"flex",gap:"clamp(.8rem,3vw,2rem)",alignItems:"center",flexWrap:"wrap"}}>
          <div style={{position:"relative",flexShrink:0}}><Ring score={results.overallScore} size={96} color={oCol}/><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:"'Syne',sans-serif",fontSize:"1.5rem",fontWeight:800,color:oCol,lineHeight:1}}>{oGrade}</span><span style={{fontSize:10,color:mutedText}}>{results.overallScore}/100</span></div></div>
          <div style={{flex:1,minWidth:180}}><h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.1rem,3.5vw,1.5rem)",fontWeight:800,color:headingColor,marginBottom:".4rem"}}>{results.domain}</h2><p style={{fontSize:13,color:mutedText,lineHeight:1.65,marginBottom:".9rem"}}>{results.verdict}</p><div style={{display:"inline-flex",background:"rgba(255,68,68,.1)",border:".5px solid rgba(255,68,68,.22)",borderRadius:10,padding:".45rem .9rem"}}><div><p style={{fontSize:9,color:"rgba(255,100,100,.65)",marginBottom:1,textTransform:"uppercase",letterSpacing:".06em",fontWeight:600}}>Estimated Revenue Leak</p><p style={{fontSize:13,fontWeight:700,color:"#FF7B7B",margin:0}}>{results.estimatedRevenueLeak}</p></div></div></div>
        </div>
      </div>
      <div style={{background:"linear-gradient(135deg,rgba(255,68,68,.06),rgba(255,68,68,.02))",border:".5px solid rgba(255,68,68,.2)",borderRadius:16,padding:"1.1rem 1.4rem",marginBottom:"1.2rem"}}><p style={{fontSize:10,color:"#ff9999",letterSpacing:".1em",textTransform:"uppercase",fontWeight:700,marginBottom:".6rem"}}>🚨 Fix These First</p>{results.topPriorities?.map((p,i)=>(<div key={i} style={{display:"flex",gap:9,marginBottom:i<results.topPriorities.length-1?6:0}}><span style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:800,color:"#FF7B7B",flexShrink:0,marginTop:1}}>{i+1}.</span><p style={{fontSize:13,color:dark?"rgba(255,255,255,.7)":"rgba(0,0,0,.65)",margin:0,lineHeight:1.5}}>{p}</p></div>))}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(255px,1fr))",gap:"1rem",marginBottom:"1.5rem"}}>{CHECKS.map(c=>{const chk=results.checks?.[c.id];if(!chk)return null;return<CheckCard key={c.id} check={chk} label={c.label} icon={c.icon} dark={dark} cardBg={cardBg} cardBorder={cardBorder} mutedText={mutedText} headingColor={headingColor} trackBg={trackBg}/>;})}</div>
      <p style={{fontSize:11,color:dark?"rgba(255,255,255,.2)":"rgba(0,0,0,.25)",textAlign:"center",marginBottom:"1.5rem",lineHeight:1.6}}>Data from Google PageSpeed Insights API. Checkout & conversion scores inferred from technical signals.</p>
      <div style={{background:"linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))",border:".5px solid rgba(0,255,136,.25)",borderRadius:24,padding:"clamp(1.8rem,5vw,3rem)",textAlign:"center"}}><p style={{fontSize:11,color:G,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".6rem",fontWeight:600}}>Want us to fix all of this?</p><h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.2rem,4vw,1.9rem)",fontWeight:800,color:headingColor,marginBottom:".6rem",lineHeight:1.2}}>This is just the surface.<br/><GradText>Our full audit goes 10x deeper.</GradText></h3><p style={{fontSize:14,color:mutedText,maxWidth:460,margin:"0 auto 1.4rem",lineHeight:1.7}}>We don't just identify problems — we fix them. One system. Compounding results every month.</p><div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}><Link to="/contact" className="btn-g" style={{display:"inline-block"}}>Apply for full professional audit →</Link><button onClick={()=>{setResults(null);setUrl("");}} className="btn-ghost">Analyse another store</button></div></div>
    </div>}
  </PageWrapper>);
}