import { useState } from "react";
import { G, GG, FAQS } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, useTheme } from "../components.jsx";
import { notifyPayment } from "../NotificationSystem.js";

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_KEY || "pk_test_469a79a7423df47Xb9e51cf45da2bbd640187dcd";

function loadPaystack() {
  return new Promise((resolve) => {
    if (window.PaystackPop) return resolve();
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

export default function Pricing() {
  const { dark } = useTheme();
  const [pricingVisible, setPricingVisible] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const headingColor = dark ? "#fff"                 : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.45)" : "rgba(26,20,8,.62)";
  const mutedText2   = dark ? "rgba(255,255,255,.4)"  : "rgba(26,20,8,.55)";
  const mutedText3   = dark ? "rgba(255,255,255,.35)" : "rgba(26,20,8,.5)";
  const mutedText4   = dark ? "rgba(255,255,255,.3)"  : "rgba(26,20,8,.45)";
  const mutedText5   = dark ? "rgba(255,255,255,.5)"  : "rgba(26,20,8,.65)";
  const faqBorder    = dark ? "rgba(255,255,255,.07)" : "rgba(26,20,8,.14)";
  const itemBorder   = dark ? "rgba(255,255,255,.05)" : "rgba(26,20,8,.1)";
  const inputBg      = dark ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.5)";
  const inputBorder  = dark ? "rgba(255,255,255,.12)" : "rgba(26,20,8,.18)";
  const modalBg      = dark ? "rgba(4,6,8,.96)"       : "rgba(250,245,233,.96)";

  const tiers = [
    {
      tier: "Entry",
      name: "Store Diagnosis",
      price: 175,
      nairaPrice: 28000000, // in kobo — update to current FX rate periodically
      kickoffNote: "We'll email your audit findings and prioritized fix roadmap within 24 hours — no call needed unless you want to walk through it together.",
      cycle: "per engagement",
      tagline: "Find out exactly where your store is bleeding money.",
      desc: "Before spending another dollar on ads, know what's broken. We audit your store, funnel, and ad account — and hand you a clear action roadmap.",
      items: [
        "Full store speed & UX audit",
        "Checkout friction mapping",
        "Ad account health check",
        "Priority fix roadmap",
        "1 x 45-min debrief call",
      ],
      feat: false,
      cta: "Get started →",
    },
    {
      tier: "Growth",
      name: "Conversion Fix",
      price: 497,
      nairaPrice: 79520000, // in kobo — update to current FX rate periodically
      kickoffNote: "We schedule your 60-minute strategy call and begin implementing your top 3 revenue fixes within 7 days.",
      cycle: "per project",
      tagline: "Audit + we implement the top 3 revenue leaks ourselves.",
      desc: "We don't just tell you what's broken — we fix it. The three highest-impact changes, done for you within 7 days.",
      items: [
        "Everything in Store Diagnosis",
        "Top 3 friction points fixed",
        "Mobile speed optimization",
        "Above-fold CTA restructure",
        "Checkout flow cleanup",
        "1 x 60-min strategy call",
      ],
      feat: false,
      cta: "Get started →",
    },
    {
      tier: "Most Popular",
      name: "The Lab",
      price: 997,
      nairaPrice: 159520000, // in kobo — update to current FX rate periodically
      kickoffNote: "We set up your direct Slack access and kick off your first optimization cycle right away.",
      cycle: "per cycle",
      tagline: "A full conversion system running in your store every cycle.",
      desc: "We run your ads, optimize your store, and compound results every cycle. One system. One team. One goal — ROAS that grows.",
      items: [
        "Everything in Conversion Fix",
        "Meta & TikTok ad management",
        "Creative strategy & copy",
        "CRO optimization (ongoing)",
        "Weekly performance reports",
        "Slack access — 4hr response",
        "Cycle strategy review",
      ],
      feat: true,
      cta: "Apply now →",
    },
    {
      tier: "Elite",
      name: "Full Stack",
      price: 1997,
      nairaPrice: 319520000, // in kobo — update to current FX rate periodically
      kickoffNote: "We schedule your first weekly strategy call and assign your dedicated growth strategist.",
      cycle: "per cycle",
      tagline: "Your entire growth engine — built, run, and scaled for you.",
      desc: "Done-for-you everything. Ads, landing pages, email flows, creative production. You focus on the product. We handle the revenue.",
      items: [
        "Everything in The Lab",
        "Done-for-you landing pages",
        "Email flow builds (Klaviyo)",
        "Creative production & UGC direction",
        "Weekly strategy calls",
        "Priority 2hr response",
        "Dedicated growth strategist",
      ],
      feat: false,
      cta: "Apply now →",
    },
  ];

  const pkg = activeModal !== null ? tiers[activeModal] : null;
  const amount = pkg ? pkg.nairaPrice : 0; // charged in NGN under the hood — displayed in $ on-site

  function openModal(i) {
    setActiveModal(i);
    setEmail(""); setName("");
    setError(""); setSuccess(false);
  }

  function closeModal() {
    setActiveModal(null);
    setError(""); setSuccess(false);
  }

  async function handlePay() {
    if (!email || !email.includes("@")) return setError("Please enter a valid email address.");
    if (!name.trim()) return setError("Please enter your full name.");
    setError("");
    setLoading(true);
    await loadPaystack();
    setLoading(false);

    const label = `${pkg.name} — Full Payment`;
    await notifyPayment(label, pkg.price, email);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email,
      amount: amount,
      currency: "NGN",
      channels: ["card"], // card-only — hides Transfer/USSD/Bank/OPay/etc. for a cleaner, less Nigeria-specific checkout
      ref: `BCL-${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: "Client Name",  variable_name: "name",    value: name },
          { display_name: "Package",      variable_name: "package", value: label },
        ],
      },
      callback: () => {
        setSuccess(true);
      },
      onClose: () => {
        setError("Payment window closed. Try again when ready.");
      },
    });

    handler.openIframe();
  }

  return (
    <PageWrapper>

      {/* ── PAYMENT MODAL ── */}
      {activeModal !== null && (
        <div
          onClick={closeModal}
          style={{ position:"fixed", inset:0, zIndex:9000, background:"rgba(0,0,0,.7)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{ background:modalBg, border:dark?".5px solid rgba(255,255,255,.12)":".5px solid rgba(26,20,8,.18)", borderRadius:24, padding:"clamp(1.5rem,4vw,2.5rem)", width:"100%", maxWidth:480, position:"relative", maxHeight:"90vh", overflowY:"auto" }}>

            {/* Close */}
            <button
              onClick={closeModal}
              style={{ position:"absolute", top:16, right:16, background:"transparent", border:"none", cursor:"pointer", color:mutedText3, fontSize:20, lineHeight:1 }}>
              ×
            </button>

            {success ? (
              /* ── SUCCESS STATE — START YOUR PROJECT ── */
              <div style={{ padding:"0.5rem 0" }}>
                <div style={{ textAlign:"center", marginBottom:"1.8rem" }}>
                  <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(0,255,136,.15)", border:".5px solid rgba(0,255,136,.4)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.2rem" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.4rem", fontWeight:800, color:headingColor, marginBottom:".5rem" }}>Payment confirmed!</h3>
                  <p style={{ fontSize:13, color:mutedText, lineHeight:1.7 }}>
                    You're in for <strong>{pkg?.name}</strong>. Here's exactly what happens next.
                  </p>
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:"1rem", marginBottom:"1.6rem" }}>
                  {[
                    { n:"01", t:"Send proof of payment", d:"Screenshot your receipt and send it via WhatsApp or email below — this makes sure nothing gets missed on our end." },
                    { n:"02", t:"We confirm within 4 hours", d:"You'll get a personal reply confirming everything and answering any quick questions." },
                    { n:"03", t:"Kickoff begins", d: pkg?.kickoffNote || "We schedule your onboarding call and get started on your project right away." },
                  ].map((s,i) => (
                    <div key={i} style={{ display:"flex", gap:"0.9rem", alignItems:"flex-start" }}>
                      <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:G, flexShrink:0, fontFamily:"'Syne',sans-serif" }}>{s.n}</div>
                      <div>
                        <h4 style={{ fontSize:13, fontWeight:700, color:headingColor, margin:"0 0 3px" }}>{s.t}</h4>
                        <p style={{ fontSize:12, color:mutedText2, lineHeight:1.6, margin:0 }}>{s.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <a
                    href={"https://wa.me/19454076473?text=" + encodeURIComponent(`Hi Bode Conversion Lab 👋 I just completed payment for ${pkg?.name}. Here's my payment screenshot:`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-g"
                    style={{ display:"block", textAlign:"center", textDecoration:"none" }}>
                    Send screenshot on WhatsApp →
                  </a>
                  <a
                    href={"mailto:bodeagencyofficial@gmail.com?subject=" + encodeURIComponent(`Payment confirmation — ${pkg?.name}`) + "&body=" + encodeURIComponent(`Hi, I just completed payment for ${pkg?.name}. Attaching my payment screenshot.`)}
                    style={{ display:"block", textAlign:"center", textDecoration:"none", background:"transparent", border:`.5px solid ${inputBorder}`, borderRadius:10, padding:".75rem", fontSize:13, fontWeight:600, color:headingColor }}>
                    Or send it via email instead
                  </a>
                </div>
              </div>
            ) : (
              /* ── PAYMENT FORM ── */
              <>
                {/* Package summary */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem", paddingBottom:"1.2rem", borderBottom:`.5px solid ${itemBorder}` }}>
                  <div>
                    <p style={{ fontSize:11, color:G, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em", margin:0 }}>{pkg?.tier}</p>
                    <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.3rem", fontWeight:800, color:headingColor, margin:"4px 0 0" }}>{pkg?.name}</h3>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.6rem", fontWeight:800, color:G, margin:0 }}>${pkg?.price}</p>
                    <p style={{ fontSize:11, color:mutedText3, margin:0 }}>{pkg?.cycle}</p>
                  </div>
                </div>

                {/* Form fields */}
                <p style={{ fontSize:11, color:mutedText3, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", marginBottom:".6rem" }}>Your details</p>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:"1.2rem" }}>
                  <input
                    type="text"
                    placeholder="Full name *"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{ width:"100%", background:inputBg, border:`.5px solid ${inputBorder}`, borderRadius:10, padding:".8rem 1rem", color:headingColor, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                    onFocus={e => e.target.style.borderColor="rgba(0,255,136,.5)"}
                    onBlur={e => e.target.style.borderColor=inputBorder}
                  />
                  <input
                    type="email"
                    placeholder="Email address *"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width:"100%", background:inputBg, border:`.5px solid ${inputBorder}`, borderRadius:10, padding:".8rem 1rem", color:headingColor, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                    onFocus={e => e.target.style.borderColor="rgba(0,255,136,.5)"}
                    onBlur={e => e.target.style.borderColor=inputBorder}
                  />
                </div>

                {/* Due today summary */}
                <div style={{ background:"rgba(0,255,136,.05)", border:".5px solid rgba(0,255,136,.18)", borderRadius:10, padding:".9rem 1rem", marginBottom:".6rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, color:mutedText2 }}>Due today</span>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.3rem", fontWeight:800, color:G }}>${pkg?.price?.toLocaleString()}</span>
                </div>

                {/* Currency conversion notice — the card popup charges in NGN,
                    this makes sure that isn't a surprise mid-checkout */}
                <div style={{ display:"flex", gap:".5rem", alignItems:"flex-start", marginBottom:"1.2rem", padding:".7rem .8rem", background:dark?"rgba(255,255,255,.03)":"rgba(26,20,8,.03)", border:`.5px solid ${inputBorder}`, borderRadius:8 }}>
                  <span style={{ flexShrink:0, width:14, height:14, borderRadius:"50%", border:`1px solid ${mutedText3}`, color:mutedText3, fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", marginTop:2 }}>i</span>
                  <p style={{ fontSize:11.5, color:mutedText3, lineHeight:1.55, margin:0 }}>
                    Your card will be charged in <strong style={{ color:mutedText2 }}>NGN</strong> — the equivalent of ${pkg?.price?.toLocaleString()} at the current exchange rate. This is normal and handled automatically by your card network; your bank may show a small foreign transaction fee.
                  </p>
                </div>

                {error && (
                  <p style={{ fontSize:13, color:"#FF6B6B", marginBottom:".75rem", padding:".75rem", background:"rgba(255,107,107,.08)", border:".5px solid rgba(255,107,107,.25)", borderRadius:8 }}>{error}</p>
                )}

                <button
                  onClick={handlePay}
                  disabled={loading}
                  style={{ width:"100%", background:loading?"rgba(0,255,136,.4)":GG, color:"#040608", border:"none", borderRadius:10, padding:".9rem", fontSize:15, fontWeight:700, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", boxShadow:loading?"none":"0 4px 22px rgba(0,255,136,.35)", marginBottom:".75rem" }}>
                  {loading ? "Loading..." : `Pay $${pkg?.price?.toLocaleString()} securely →`}
                </button>

                {/* Trust + contact option */}
                <div style={{ textAlign:"center" }}>
                  <div style={{ display:"flex", gap:"1rem", justifyContent:"center", marginBottom:".6rem", flexWrap:"wrap" }}>
                    {["SSL encrypted","All major cards","Global payments"].map((t, i) => (
                      <span key={i} style={{ fontSize:11, color:mutedText3 }}>{t}</span>
                    ))}
                  </div>
                  <p style={{ fontSize:12, color:mutedText3 }}>
                    Have a question first?{" "}
                    <a
                      href={"https://wa.me/19454076473?text=" + encodeURIComponent(`Hi, I have a question about the ${pkg?.name} package before paying.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color:G, textDecoration:"none", fontWeight:600 }}>
                      Message us on WhatsApp
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{ position:"relative", padding:"6rem 2rem 4rem", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:500, height:500, top:-100, left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ marginBottom:"1.5rem" }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:dark?"rgba(0,255,136,.1)":"#1A1408", border:dark?".5px solid rgba(0,255,136,.28)":"none", borderRadius:100, padding:"6px 16px", fontSize:11, color:dark?G:"#FFEFC2", fontWeight:600, letterSpacing:".05em" }}>
              <span style={{ width:6, height:6, background:G, borderRadius:"50%", animation:"pulse 2s ease-in-out infinite" }}/> Investment
            </span>
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"3.2rem", fontWeight:800, lineHeight:1.1, letterSpacing:"-.03em", color:headingColor, marginBottom:"1.2rem" }}>
            Serious about scaling?<br /><GradText>Here's how we work.</GradText>
          </h1>
          <p style={{ fontSize:"1.05rem", color:mutedText, lineHeight:1.75 }}>
            We don't work with everyone. We work with stores that are ready to grow. Unlock pricing below after reading our commitment to you.
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* ── COMMITMENT ── */}
      <Section>
        <div style={{ maxWidth:760, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <SectionLabel>Our commitment</SectionLabel>
            <Heading>What you get when you<br /><GradText>work with us</GradText></Heading>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"1rem" }} className="how-grid">
            {[
              { icon:"→", title:"48-hour audit delivery",  desc:"Every engagement starts with a full store and ads audit delivered within 48 business hours." },
              { icon:"→", title:"No fluff reporting",      desc:"Weekly reports focused on revenue, ROAS, and CPA. Nothing else. We don't hide behind vanity metrics." },
              { icon:"→", title:"Cycle-to-cycle terms",    desc:"No lock-in. Stay because the results compound. Leave if they don't. We're that confident." },
              { icon:"→", title:"Direct access",           desc:"Slack access to your dedicated strategist. Real responses within 4 business hours — not a ticket system." },
            ].map((item, i) => (
              <div key={i} className="glass" style={{ padding:"1.5rem" }}>
                <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <span style={{ color:G, fontSize:18, fontWeight:800, flexShrink:0, marginTop:2 }}>{item.icon}</span>
                  <div>
                    <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:700, color:headingColor, marginBottom:".4rem" }}>{item.title}</h3>
                    <p style={{ fontSize:13, color:mutedText2, lineHeight:1.7 }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="divider" />

      {/* ── PRICING ── */}
      <Section>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          {!pricingVisible ? (
            <div style={{ textAlign:"center", padding:"4rem 2rem", background:"linear-gradient(135deg,rgba(0,255,136,.06),rgba(0,204,106,.02))", border:".5px solid rgba(0,255,136,.2)", borderRadius:24 }}>
              <div style={{ width:70, height:70, borderRadius:"50%", background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem", animation:"glow 3s ease-in-out infinite" }}>
                <svg width="28" height="28" viewBox="0 0 22 22" fill="none"><rect x="4" y="10" width="14" height="10" rx="3" stroke={G} strokeWidth="1.5"/><path d="M7 10V7a4 4 0 018 0v3" stroke={G} strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.5rem", fontWeight:800, color:headingColor, marginBottom:".75rem" }}>Pricing is qualification-based</h3>
              <p style={{ fontSize:15, color:mutedText2, lineHeight:1.7, maxWidth:480, margin:"0 auto 2rem" }}>We only work with stores that are the right fit. Not because we're exclusive — because we only take clients we can genuinely help.</p>
              <button className="btn-g" onClick={() => setPricingVisible(true)}>I'm ready — show me pricing →</button>
            </div>
          ) : (
            <div>
              <div style={{ textAlign:"center", marginBottom:"3rem" }}>
                <SectionLabel>Four ways to work together</SectionLabel>
                <Heading>Pick your <GradText>entry point</GradText></Heading>
                <p style={{ fontSize:14, color:mutedText3, marginTop:".75rem" }}>Start anywhere. Every tier is designed to compound into the next.</p>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem" }} className="offer-grid">
                {tiers.map((o, i) => (
                  <div key={i} className={`offer-card ${o.feat ? "feat" : ""}`} style={{ display:"flex", flexDirection:"column" }}>
                    {o.feat
                      ? <div style={{ display:"inline-block", background:"rgba(0,255,136,.15)", border:".5px solid rgba(0,255,136,.4)", borderRadius:100, padding:"3px 12px", fontSize:11, color:G, marginBottom:"1rem", alignSelf:"flex-start" }}>{o.tier}</div>
                      : <p style={{ fontSize:11, color:mutedText4, marginBottom:".5rem", fontWeight:600, textTransform:"uppercase", letterSpacing:".05em" }}>{o.tier}</p>
                    }
                    <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, marginBottom:".4rem", color:headingColor }}>{o.name}</h3>
                    <p style={{ fontSize:12, color:G, fontWeight:600, marginBottom:".75rem" }}>{o.tagline}</p>
                    <p style={{ fontSize:12, color:mutedText3, marginBottom:"1.2rem", lineHeight:1.6 }}>{o.desc}</p>

                    {/* Price */}
                    <div style={{ marginBottom:"1.5rem", paddingBottom:"1.2rem", borderBottom:`.5px solid ${itemBorder}` }}>
                      <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"2rem", fontWeight:800, color:headingColor }}>${o.price}</span>
                      <span style={{ fontSize:11, color:mutedText4, marginLeft:6, opacity:.7 }}>{o.cycle}</span>
                    </div>

                    {/* Features */}
                    <ul style={{ listStyle:"none", marginBottom:"1.5rem", flexGrow:1 }}>
                      {o.items.map((item, j) => (
                        <li key={j} style={{ fontSize:13, color:mutedText5, padding:"7px 0", borderBottom:`.5px solid ${itemBorder}`, display:"flex", gap:8, alignItems:"center" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* ── CTA — opens payment modal ── */}
                    <button
                      onClick={() => openModal(i)}
                      className={o.feat ? "btn-g" : "btn-ghost"}
                      style={{ display:"block", width:"100%", textAlign:"center", marginTop:"auto", cursor:"pointer", fontFamily:"inherit" }}>
                      {o.cta}
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ textAlign:"center", marginTop:"2.5rem" }}>
                <p style={{ fontSize:13, color:mutedText3, lineHeight:1.8 }}>
                  All engagements are cycle-to-cycle. No lock-in. No contracts.<br />
                  <span style={{ color:G, fontWeight:600 }}>Every tier starts with a store audit.</span> We don't run blind.
                </p>
              </div>
            </div>
          )}
        </div>
      </Section>

      <hr className="divider" />

      {/* ── FAQ ── */}
      <Section style={{ paddingBottom:"8rem" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <SectionLabel>Common questions</SectionLabel>
            <Heading>FAQ</Heading>
          </div>
          {FAQS.map((f, i) => (
            <div key={i}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                style={{ width:"100%", textAlign:"left", background:"transparent", border:"none", color:headingColor, fontSize:15, fontWeight:500, cursor:"pointer", padding:"1.2rem 0", display:"flex", justifyContent:"space-between", alignItems:"center", fontFamily:"inherit", borderBottom:`.5px solid ${faqBorder}` }}>
                <span>{f.q}</span>
                <span style={{ color:G, fontSize:18, transition:"transform .25s", transform:faqOpen===i?"rotate(45deg)":"none", display:"inline-block", flexShrink:0, marginLeft:12 }}>+</span>
              </button>
              {faqOpen === i && (
                <p style={{ fontSize:14, color:mutedText, lineHeight:1.75, padding:"1rem 0 1.2rem", borderBottom:`.5px solid ${faqBorder}` }}>{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

    </PageWrapper>
  );
}