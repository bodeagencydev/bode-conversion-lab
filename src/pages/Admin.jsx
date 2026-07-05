import { useState, useEffect } from "react";
import { G, GG } from "../data.js";
import { PageWrapper, useTheme } from "../components.jsx";

/* ─── CONFIG ─── */
const ADMIN_EMAIL    = "bodeagencyofficial@gmail.com";
const ADMIN_PASSWORD = "bode2026admin"; // change this to something only you know

/* ─── ACCESS CODE STORAGE KEY ─── */
const STORAGE_KEY = "bcl_access_codes";

/* ─── TIERS ─── */
const TIERS = [
  { id:"diagnosis", label:"Store Diagnosis",  price:"$175", color:"#00ff88", includes:["Analysis Report"] },
  { id:"fix",       label:"Conversion Fix",   price:"$497", color:"#00ff88", includes:["Analysis Report","Solution Plan"] },
  { id:"lab",       label:"The Lab",          price:"$997", color:"#FFD700", includes:["Analysis Report","Solution Plan"] },
  { id:"fullstack", label:"Full Stack",       price:"$1,997",color:"#FF9900", includes:["Analysis Report","Solution Plan"] },
];

/* ─── GENERATE CODE ─── */
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "BCL-";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

/* ─── LOAD/SAVE CODES ─── */
function loadCodes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveCodes(codes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
}

export default function Admin() {
  const { dark } = useTheme();
  const [authed,     setAuthed]     = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass,  setLoginPass]  = useState("");
  const [loginErr,   setLoginErr]   = useState("");
  const [codes,      setCodes]      = useState([]);
  const [form,       setForm]       = useState({ clientName:"", clientEmail:"", tier:"fix", notes:"" });
  const [copied,     setCopied]     = useState(null);
  const [filter,     setFilter]     = useState("all");
  const [search,     setSearch]     = useState("");

  const headingColor = dark ? "#fff"                  : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.5)"   : "rgba(26,20,8,.65)";
  const mutedText2   = dark ? "rgba(255,255,255,.4)"   : "rgba(26,20,8,.55)";
  const mutedText3   = dark ? "rgba(255,255,255,.3)"   : "rgba(26,20,8,.45)";
  const cardBg       = dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(255,255,255,.5),rgba(255,255,255,.2))";
  const cardBorder   = dark ? "rgba(255,255,255,.1)"   : "rgba(26,20,8,.15)";
  const inputBg      = dark ? "rgba(255,255,255,.05)"  : "rgba(255,255,255,.55)";
  const inputBorder  = dark ? "rgba(255,255,255,.12)"  : "rgba(26,20,8,.18)";
  const rowBg        = dark ? "rgba(255,255,255,.03)"  : "rgba(255,255,255,.35)";

  /* Load on mount */
  useEffect(() => {
    const session = sessionStorage.getItem("bcl_admin_session");
    if (session === "1") setAuthed(true);
    setCodes(loadCodes());
  }, []);

  /* Login */
  function handleLogin() {
    if (loginEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() && loginPass === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("bcl_admin_session", "1");
      setCodes(loadCodes());
      setLoginErr("");
    } else {
      setLoginErr("Invalid credentials.");
    }
  }

  /* Generate new code */
  function handleGenerate() {
    if (!form.clientName.trim()) return alert("Client name required.");
    if (!form.clientEmail.trim() || !form.clientEmail.includes("@")) return alert("Valid client email required.");

    const code = generateCode();
    const newEntry = {
      code,
      clientName:  form.clientName.trim(),
      clientEmail: form.clientEmail.trim().toLowerCase(),
      tier:        form.tier,
      notes:       form.notes.trim(),
      createdAt:   new Date().toISOString(),
      used:        false,
      active:      true,
    };

    const updated = [newEntry, ...codes];
    setCodes(updated);
    saveCodes(updated);
    setForm({ clientName:"", clientEmail:"", tier:"fix", notes:"" });
  }

  /* Copy code */
  function copyCode(code) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  /* Copy WhatsApp message */
  function copyWhatsApp(entry) {
    const tier = TIERS.find(t => t.id === entry.tier);
    const msg = `Hi ${entry.clientName.split(" ")[0]} 👋\n\nThank you for your payment for *${tier?.label}* (${ tier?.price}).\n\nYour Bode Conversion Lab access code is:\n\n*${entry.code}*\n\nTo use it:\n1. Go to bodeconversionlab.vercel.app/audit\n2. Run your store scan\n3. Click "Enter access code" and enter the code above\n4. Your reports will unlock immediately.\n\nLet us know when you're ready to start. We respond within 4 hours. 🚀\n\n— Bode Conversion Lab`;
    navigator.clipboard.writeText(msg);
    setCopied(entry.code + "_wa");
    setTimeout(() => setCopied(null), 2000);
  }

  /* Revoke code */
  function revokeCode(code) {
    if (!window.confirm(`Revoke code ${code}? The client will lose download access.`)) return;
    const updated = codes.map(c => c.code === code ? { ...c, active:false } : c);
    setCodes(updated);
    saveCodes(updated);
  }

  /* Reactivate */
  function reactivateCode(code) {
    const updated = codes.map(c => c.code === code ? { ...c, active:true } : c);
    setCodes(updated);
    saveCodes(updated);
  }

  /* Mark as used */
  function markUsed(code, val) {
    const updated = codes.map(c => c.code === code ? { ...c, used:val } : c);
    setCodes(updated);
    saveCodes(updated);
  }

  /* Filter + search */
  const filtered = codes.filter(c => {
    const matchFilter = filter === "all" || c.tier === filter || (filter === "active" && c.active) || (filter === "revoked" && !c.active);
    const matchSearch = !search || c.clientName.toLowerCase().includes(search.toLowerCase()) || c.clientEmail.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search.toUpperCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total:   codes.length,
    active:  codes.filter(c => c.active).length,
    used:    codes.filter(c => c.used).length,
    revoked: codes.filter(c => !c.active).length,
  };

  /* ── LOGIN SCREEN ── */
  if (!authed) return (
    <PageWrapper>
      <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
        <div style={{ maxWidth:380, width:"100%", background:cardBg, border:`.5px solid ${cardBorder}`, borderTop:".5px solid rgba(0,255,136,.3)", borderRadius:24, padding:"2.5rem", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.4),transparent)", pointerEvents:"none" }}/>
          <div style={{ textAlign:"center", marginBottom:"2rem" }}>
            <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem" }}>
              <span style={{ fontSize:22 }}>🔐</span>
            </div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.4rem", fontWeight:800, color:headingColor }}>Admin Panel</h2>
            <p style={{ fontSize:13, color:mutedText2 }}>Bode Conversion Lab</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:"1rem" }}>
            {[
              { placeholder:"Admin email", value:loginEmail, setter:setLoginEmail, type:"email" },
              { placeholder:"Password",    value:loginPass,  setter:setLoginPass,  type:"password" },
            ].map((f, i) => (
              <input key={i} type={f.type} placeholder={f.placeholder} value={f.value}
                onChange={e => f.setter(e.target.value)}
                onKeyDown={e => e.key==="Enter" && handleLogin()}
                style={{ width:"100%", background:inputBg, border:`.5px solid ${inputBorder}`, borderRadius:10, padding:".8rem 1rem", color:headingColor, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                onFocus={e => e.target.style.borderColor="rgba(0,255,136,.5)"}
                onBlur={e => e.target.style.borderColor=inputBorder}
              />
            ))}
          </div>
          {loginErr && <p style={{ fontSize:12, color:"#FF6B6B", marginBottom:"1rem" }}>{loginErr}</p>}
          <button onClick={handleLogin} className="btn-g" style={{ width:"100%", fontFamily:"inherit", cursor:"pointer" }}>
            Enter →
          </button>
        </div>
      </div>
    </PageWrapper>
  );

  /* ── ADMIN DASHBOARD ── */
  return (
    <PageWrapper>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"clamp(2rem,5vw,4rem) clamp(1rem,4vw,2rem) 6rem" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
          <div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.5rem,4vw,2rem)", fontWeight:800, color:headingColor, marginBottom:".2rem" }}>
              Admin Panel
            </h1>
            <p style={{ fontSize:13, color:mutedText2 }}>Access code management — Bode Conversion Lab</p>
          </div>
          <button
            onClick={() => { setAuthed(false); sessionStorage.removeItem("bcl_admin_session"); }}
            style={{ background:"transparent", border:`.5px solid ${cardBorder}`, borderRadius:8, padding:".5rem 1rem", fontSize:12, color:mutedText3, cursor:"pointer", fontFamily:"inherit" }}>
            Sign out
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.75rem", marginBottom:"2rem" }}>
          {[
            { label:"Total codes",   value:stats.total,   color:G },
            { label:"Active",        value:stats.active,  color:"#00ff88" },
            { label:"Used by client",value:stats.used,    color:"#FFD700" },
            { label:"Revoked",       value:stats.revoked, color:"#FF3B3B" },
          ].map((s, i) => (
            <div key={i} style={{ background:cardBg, border:`.5px solid ${cardBorder}`, borderRadius:14, padding:"1.2rem", textAlign:"center" }}>
              <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.8rem", fontWeight:800, color:s.color, margin:0 }}>{s.value}</p>
              <p style={{ fontSize:11, color:mutedText3, marginTop:4 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Generate new code */}
        <div style={{ background:cardBg, border:`.5px solid ${cardBorder}`, borderTop:".5px solid rgba(0,255,136,.25)", borderRadius:20, padding:"1.8rem", marginBottom:"2rem", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.35),transparent)", pointerEvents:"none" }}/>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:800, color:headingColor, marginBottom:"1.2rem" }}>
            ✨ Generate Access Code
          </h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem", marginBottom:"0.75rem" }} className="how-grid">
            {[
              { placeholder:"Client full name *",  key:"clientName",  type:"text" },
              { placeholder:"Client email *",       key:"clientEmail", type:"email" },
            ].map(f => (
              <input key={f.key} type={f.type} placeholder={f.placeholder} value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]:e.target.value }))}
                style={{ width:"100%", background:inputBg, border:`.5px solid ${inputBorder}`, borderRadius:10, padding:".8rem 1rem", color:headingColor, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                onFocus={e => e.target.style.borderColor="rgba(0,255,136,.5)"}
                onBlur={e => e.target.style.borderColor=inputBorder}
              />
            ))}
          </div>

          {/* Tier selector */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.5rem", marginBottom:"0.75rem" }}>
            {TIERS.map(t => (
              <button key={t.id} onClick={() => setForm(p => ({ ...p, tier:t.id }))}
                style={{ background:form.tier===t.id?"rgba(0,255,136,.12)":"transparent", border:form.tier===t.id?".5px solid rgba(0,255,136,.45)":`".5px solid ${cardBorder}"`, borderRadius:10, padding:".75rem .5rem", cursor:"pointer", fontFamily:"inherit", textAlign:"center", transition:"all .2s" }}>
                <p style={{ fontSize:12, fontWeight:700, color:form.tier===t.id?headingColor:mutedText3, margin:0 }}>{t.label}</p>
                <p style={{ fontSize:11, color:form.tier===t.id?G:mutedText3, margin:"2px 0 0" }}>{t.price}</p>
              </button>
            ))}
          </div>

          {/* What's included */}
          <div style={{ background:dark?"rgba(0,255,136,.04)":"rgba(0,255,136,.06)", border:".5px solid rgba(0,255,136,.15)", borderRadius:8, padding:".75rem 1rem", marginBottom:"0.75rem" }}>
            <p style={{ fontSize:11, color:G, fontWeight:600, marginBottom:4 }}>This code unlocks:</p>
            {TIERS.find(t => t.id===form.tier)?.includes.map((item, i) => (
              <p key={i} style={{ fontSize:12, color:mutedText, margin:0 }}>✓ {item}</p>
            ))}
          </div>

          <input type="text" placeholder="Notes (optional — payment ref, project details...)" value={form.notes}
            onChange={e => setForm(p => ({ ...p, notes:e.target.value }))}
            style={{ width:"100%", background:inputBg, border:`.5px solid ${inputBorder}`, borderRadius:10, padding:".8rem 1rem", color:headingColor, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box", marginBottom:".75rem" }}
            onFocus={e => e.target.style.borderColor="rgba(0,255,136,.5)"}
            onBlur={e => e.target.style.borderColor=inputBorder}
          />

          <button onClick={handleGenerate} className="btn-g" style={{ fontFamily:"inherit", cursor:"pointer" }}>
            Generate access code →
          </button>
        </div>

        {/* Filter + search */}
        <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.2rem", flexWrap:"wrap", alignItems:"center" }}>
          <input type="text" placeholder="Search by name, email, or code..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex:1, minWidth:200, background:inputBg, border:`.5px solid ${inputBorder}`, borderRadius:10, padding:".65rem 1rem", color:headingColor, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
            onFocus={e => e.target.style.borderColor="rgba(0,255,136,.5)"}
            onBlur={e => e.target.style.borderColor=inputBorder}
          />
          {["all","active","revoked","diagnosis","fix","lab","fullstack"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ background:filter===f?"rgba(0,255,136,.12)":"transparent", border:filter===f?".5px solid rgba(0,255,136,.4)":`".5px solid ${cardBorder}"`, borderRadius:8, padding:".45rem .9rem", fontSize:12, color:filter===f?G:mutedText3, cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize", transition:"all .2s" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Codes table */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"3rem", color:mutedText3 }}>
            <p style={{ fontSize:32, marginBottom:"1rem" }}>📭</p>
            <p style={{ fontSize:14 }}>No codes yet. Generate your first one above.</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            {filtered.map((entry, i) => {
              const tier = TIERS.find(t => t.id === entry.tier);
              const date = new Date(entry.createdAt).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
              return (
                <div key={i} style={{ background:entry.active?cardBg:"rgba(255,59,59,.04)", border:`.5px solid ${entry.active?cardBorder:"rgba(255,59,59,.2)"}`, borderRadius:16, padding:"1.2rem 1.4rem" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"1rem", flexWrap:"wrap" }}>

                    {/* Left — client info */}
                    <div style={{ flex:1, minWidth:180 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:".3rem", flexWrap:"wrap" }}>
                        <p style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:entry.active?headingColor:"rgba(255,59,59,.7)", margin:0 }}>{entry.clientName}</p>
                        <span style={{ background:`${tier?.color}22`, border:`.5px solid ${tier?.color}55`, borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700, color:tier?.color }}>
                          {tier?.label}
                        </span>
                        {entry.used && <span style={{ background:"rgba(255,215,0,.15)", border:".5px solid rgba(255,215,0,.3)", borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700, color:"#FFD700" }}>USED</span>}
                        {!entry.active && <span style={{ background:"rgba(255,59,59,.15)", border:".5px solid rgba(255,59,59,.3)", borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700, color:"#FF3B3B" }}>REVOKED</span>}
                      </div>
                      <p style={{ fontSize:12, color:mutedText3, margin:0 }}>{entry.clientEmail}</p>
                      {entry.notes && <p style={{ fontSize:11, color:mutedText3, margin:"4px 0 0", fontStyle:"italic" }}>{entry.notes}</p>}
                      <p style={{ fontSize:11, color:mutedText3, margin:"4px 0 0" }}>Created {date}</p>
                    </div>

                    {/* Right — code + actions */}
                    <div style={{ display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end" }}>
                      {/* Code display */}
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:800, color:entry.active?G:"rgba(255,59,59,.7)", letterSpacing:".08em" }}>{entry.code}</span>
                        <button onClick={() => copyCode(entry.code)}
                          style={{ background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.25)", borderRadius:6, padding:"3px 8px", fontSize:11, color:G, cursor:"pointer", fontFamily:"inherit" }}>
                          {copied===entry.code ? "✅ Copied" : "Copy code"}
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end" }}>
                        <button onClick={() => copyWhatsApp(entry)}
                          style={{ background:"rgba(37,211,102,.1)", border:".5px solid rgba(37,211,102,.25)", borderRadius:6, padding:"4px 10px", fontSize:11, color:"#25D366", cursor:"pointer", fontFamily:"inherit" }}>
                          {copied===entry.code+"_wa" ? "✅ Copied!" : "📱 Copy WhatsApp msg"}
                        </button>
                        <button onClick={() => markUsed(entry.code, !entry.used)}
                          style={{ background:dark?"rgba(255,255,255,.05)":"rgba(26,20,8,.05)", border:`.5px solid ${cardBorder}`, borderRadius:6, padding:"4px 10px", fontSize:11, color:mutedText2, cursor:"pointer", fontFamily:"inherit" }}>
                          {entry.used ? "Mark unused" : "Mark used"}
                        </button>
                        {entry.active
                          ? <button onClick={() => revokeCode(entry.code)}
                              style={{ background:"rgba(255,59,59,.08)", border:".5px solid rgba(255,59,59,.2)", borderRadius:6, padding:"4px 10px", fontSize:11, color:"#FF6B6B", cursor:"pointer", fontFamily:"inherit" }}>
                              Revoke
                            </button>
                          : <button onClick={() => reactivateCode(entry.code)}
                              style={{ background:"rgba(0,255,136,.08)", border:".5px solid rgba(0,255,136,.2)", borderRadius:6, padding:"4px 10px", fontSize:11, color:G, cursor:"pointer", fontFamily:"inherit" }}>
                              Reactivate
                            </button>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </PageWrapper>
  );
}