import { useState } from "react";
import { Link } from "react-router-dom";
import { G, GG, FAQS } from "../data.js";
import { Section, SectionLabel, Heading, GradText, PageWrapper, Particles, useTheme } from "../components.jsx";

export default function Pricing() {
  const { dark } = useTheme();
  const [pricingVisible, setPricingVisible] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  const headingColor = dark ? "#fff" : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.45)" : "rgba(26,20,8,.62)";
  const mutedText2   = dark ? "rgba(255,255,255,.4)"  : "rgba(26,20,8,.55)";
  const mutedText3   = dark ? "rgba(255,255,255,.35)" : "rgba(26,20,8,.5)";
  const mutedText4   = dark ? "rgba(255,255,255,.3)"  : "rgba(26,20,8,.45)";
  const mutedText5   = dark ? "rgba(255,255,255,.5)"  : "rgba(26,20,8,.65)";
  const faqBorder    = dark ? "rgba(255,255,255,.07)" : "rgba(26,20,8,.14)";
  const itemBorder   = dark ? "rgba(255,255,255,.05)" : "rgba(26,20,8,.1)";

  const tiers = [
    {
      tier: "Entry",
      name: "Store Diagnosis",
      price: "$175",
      period: "one-time",
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
      cta: "Get my diagnosis →",
      badge: null,
    },
    {
      tier: "Growth",
      name: "Conversion Fix",
      price: "$497",
      period: "one-time",
      tagline: "Audit + we implement the top 3 revenue leaks ourselves.",
      desc: "We don't just tell you what's broken — we fix it. The three highest-impact changes, done for you within 7 days of your audit.",
      items: [
        "Everything in Store Diagnosis",
        "Top 3 friction points fixed",
        "Mobile speed optimization",
        "Above-fold CTA restructure",
        "Checkout flow cleanup",
        "1 x 60-min strategy call",
      ],
      feat: false,
      cta: "Apply for Conversion Fix →",
      badge: null,
    },
    {
      tier: "Most Popular",
      name: "The Lab",
      price: "$997",
      period: "/mo",
      tagline: "A full conversion system running in your store every month.",
      desc: "We run your ads, optimize your store, and compound results month over month. One system. One team. One goal — ROAS that grows.",
      items: [
        "Everything in Conversion Fix",
        "Monthly Meta & TikTok ad management",
        "Creative strategy & copy",
        "CRO optimization (ongoing)",
        "Weekly performance reports",
        "Slack access — 4hr response",
        "Monthly strategy review",
      ],
      feat: true,
      cta: "Apply for The Lab →",
      badge: "Most Popular",
    },
    {
      tier: "Elite",
      name: "Full Stack",
      price: "$1,997",
      period: "/mo",
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
      cta: "Apply for Full Stack →",
      badge: "Elite",
    },
  ];

  return (
    <PageWrapper>
      <section style={{ position:"relative", padding:"6rem 2rem 4rem", overflow:"hidden" }}>
        <Particles />
        <div style={{ position:"absolute", width:500, height:500, top:-100, left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle,rgba(0,255,136,.12),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ marginBottom:"1.5rem" }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.28)", borderRadius:100, padding:"5px 14px", fontSize:11, color:G, fontWeight:500 }}>
              <span style={{ width:6, height:6, background:G, borderRadius:"50%" }}/> Investment
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

      {/* COMMITMENT */}
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
              { icon:"→", title:"Month-to-month terms",    desc:"No contracts. No lock-in. Stay because the results are there. Leave if they're not. We're that confident." },
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

      {/* PRICING */}
      <Section>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          {!pricingVisible ? (
            <div style={{ textAlign:"center", padding:"4rem 2rem", background:"linear-gradient(135deg,rgba(0,255,136,.06),rgba(0,204,106,.02))", border:".5px solid rgba(0,255,136,.2)", borderRadius:24 }}>
              <div style={{ width:70, height:70, borderRadius:"50%", background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem", animation:"glow 3s ease-in-out infinite" }}>
                <svg width="28" height="28" viewBox="0 0 22 22" fill="none"><rect x="4" y="10" width="14" height="10" rx="3" stroke={G} strokeWidth="1.5"/><path d="M7 10V7a4 4 0 018 0v3" stroke={G} strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.5rem", fontWeight:800, color:headingColor, marginBottom:".75rem" }}>Pricing is qualification-based</h3>
              <p style={{ fontSize:15, color:mutedText2, marginBottom:"2rem", lineHeight:1.7, maxWidth:480, margin:"0 auto 2rem" }}>We only work with stores that are the right fit. Not because we're exclusive — because we only take clients we can genuinely help.</p>
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
                    {/* Tier label */}
                    {o.feat
                      ? <div style={{ display:"inline-block", background:"rgba(0,255,136,.15)", border:".5px solid rgba(0,255,136,.4)", borderRadius:100, padding:"3px 12px", fontSize:11, color:G, marginBottom:"1rem", alignSelf:"flex-start" }}>{o.tier}</div>
                      : <p style={{ fontSize:11, color:mutedText4, marginBottom:".5rem", fontWeight:600, textTransform:"uppercase", letterSpacing:".05em" }}>{o.tier}</p>
                    }

                    <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, marginBottom:".4rem", color:headingColor }}>{o.name}</h3>
                    <p style={{ fontSize:12, color:G, fontWeight:600, marginBottom:".75rem" }}>{o.tagline}</p>
                    <p style={{ fontSize:12, color:mutedText3, marginBottom:"1.2rem", lineHeight:1.6, flexGrow:0 }}>{o.desc}</p>

                    {/* Price */}
                    <div style={{ marginBottom:"1.5rem", paddingBottom:"1.2rem", borderBottom:`.5px solid ${itemBorder}` }}>
                      <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"2rem", fontWeight:800, color:headingColor }}>{o.price}</span>
                      <span style={{ fontSize:13, color:mutedText4, marginLeft:4 }}>{o.period}</span>
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

                    {/* CTA */}
                    <Link to="/contact" className={o.feat ? "btn-g" : "btn-ghost"} style={{ display:"block", textAlign:"center", textDecoration:"none", marginTop:"auto" }}>{o.cta}</Link>
                  </div>
                ))}
              </div>

              {/* Value anchor note */}
              <div style={{ textAlign:"center", marginTop:"2.5rem" }}>
                <p style={{ fontSize:13, color:mutedText3, lineHeight:1.8 }}>
                  All retainers are month-to-month. No contracts. No lock-in.<br />
                  <span style={{ color:G, fontWeight:600 }}>Every tier starts with a store audit.</span> We don't run blind.
                </p>
              </div>
            </div>
          )}
        </div>
      </Section>

      <hr className="divider" />

      {/* FAQ */}
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
              {faqOpen === i && <p style={{ fontSize:14, color:mutedText, lineHeight:1.75, padding:"1rem 0 1.2rem", borderBottom:`.5px solid ${faqBorder}` }}>{f.a}</p>}
            </div>
          ))}
        </div>
      </Section>
    </PageWrapper>
  );
}