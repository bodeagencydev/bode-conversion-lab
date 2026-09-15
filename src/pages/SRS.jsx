import { Link } from "react-router-dom";
import { Section, SectionLabel, Heading, GradText, PageWrapper, useTheme, SEO, HeroBackdrop } from "../components.jsx";
import { ScrollReveal, TiltCard } from "../AnimationSystem.jsx";

const PHASES = [
  {
    n: "01", name: "Foundation Fix",
    tag: "Weeks 1–2",
    summary: "Fix leaks & trust signals first — before a single extra dollar goes to ads.",
    detail: "Most stores lose more revenue to friction than to weak traffic. We audit checkout flow, page speed, mobile experience, and trust signals (reviews, guarantees, policies), then fix what's actively costing you sales. This is also where we set up proper tracking — you can't fix what you can't measure, and most stores we open up are tracking almost nothing correctly.",
    bullets: [
      "Full checkout & funnel audit — every step a buyer has to get through",
      "Mobile page speed fixes (most traffic is mobile, most stores are slow on it)",
      "Trust signal gaps closed — reviews, guarantees, shipping/return policy visibility",
      "Tracking & analytics set up correctly — pixels, conversions, UTM discipline",
    ],
  },
  {
    n: "02", name: "Traffic Ignition",
    tag: "Weeks 2–5",
    summary: "Controlled ad tests find winners — small, structured spend, not a blind budget dump.",
    detail: "With the leaks fixed, we start testing ads deliberately: small budgets, clear hypotheses, one variable at a time. The goal here isn't to scale yet — it's to find out which offers, creatives, and audiences actually convert on your now-fixed store, with real data instead of guesses.",
    bullets: [
      "Structured creative & audience testing — controlled, not a shotgun approach",
      "Landing pages matched to each ad's specific promise",
      "Early-signal tracking — cost per result, not just clicks",
      "Kill underperforming tests fast, double down on early winners",
    ],
  },
  {
    n: "03", name: "Scale & Compound",
    tag: "Weeks 5–10",
    summary: "Double down on what's proven — scale spend behind data, not intuition.",
    detail: "Once we know what actually works, this is where spend goes up — deliberately, behind the specific angles, creatives, and audiences that proved themselves in Phase 2. Because the foundation is already fixed, more traffic means more conversions, not just more visitors bouncing off the same leaks.",
    bullets: [
      "Scale winning ad sets and creative angles",
      "Expand to adjacent audiences and platforms once the core is proven",
      "Retention layer added — email/SMS flows so paid traffic isn't the only lever",
      "Weekly numbers review — ROAS, CAC, margin, not vanity metrics",
    ],
  },
  {
    n: "04", name: "Systemize",
    tag: "Ongoing",
    summary: "Document it so it runs itself — a repeatable system, not a one-off campaign.",
    detail: "The last phase turns what worked into a standing playbook: documented processes for creative testing, budget allocation, and reporting, so growth doesn't depend on us being in the account every day. This is also where we hand over (or continue managing, if you're on a retainer) a system built specifically around your store's numbers.",
    bullets: [
      "A documented playbook specific to your store — not a generic template",
      "Reporting cadence you can actually read in 5 minutes",
      "Clear next-test queue so testing never goes stale",
      "Built to keep compounding without needing a rebuild every quarter",
    ],
  },
];

const COMPARISON = [
  { theirs: "Ads first, hope the store converts", ours: "Store fixed first, then ads — so spend isn't wasted on a leaky funnel" },
  { theirs: "Broad, blind ad spend from day one", ours: "Small controlled tests find what works before scaling spend" },
  { theirs: "Reports full of impressions & reach", ours: "Reports built around ROAS, CAC, and margin — numbers that pay bills" },
  { theirs: "Locked into long contracts", ours: "Month-to-month — we keep the account by performing, not by contract" },
];

const SRS_FAQ = [
  { q: "What is SRS (Sales Recovery System)?", a: "SRS is Bode Conversion Lab's four-phase methodology for fixing an e-commerce store's revenue before scaling ad spend: Foundation Fix, Traffic Ignition, Scale & Compound, and Systemize. It exists because sending traffic to a leaky store just burns budget faster — fixing the leaks first makes every dollar of ad spend afterward convert better." },
  { q: "How long does the SRS process take?", a: "Foundation Fix typically runs 1–2 weeks, Traffic Ignition 2–5 weeks, and Scale & Compound from week 5 onward as results prove out. Systemize is ongoing — it's what keeps the results compounding rather than fading once initial fixes are made." },
  { q: "Do I need a big ad budget to start SRS?", a: "No. Phase 1 (Foundation Fix) doesn't require any ad spend at all — it's entirely about fixing what's already costing you sales. Phase 2 starts with small, controlled test budgets, not a large spend commitment." },
  { q: "How is SRS different from a normal ad agency?", a: "Most agencies start by running ads and scaling spend based on early results, even if the store itself has conversion leaks. SRS fixes the store's checkout, trust signals, and site speed first, so the traffic an agency later buys actually converts instead of leaking away." },
  { q: "What's a realistic result from SRS?", a: "Results vary by store, but our best documented result took a client from $1k/month to $70k/month in 90 days — a 0.8x to 4.2x ROAS improvement on the same product and the same ad budget, purely from fixing the funnel before scaling spend." },
];

export default function SRS() {
  const { dark } = useTheme();
  const headingColor = dark ? "#fff" : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.62)" : "rgba(26,20,8,.68)";
  const mutedText2   = dark ? "rgba(255,255,255,.45)" : "rgba(26,20,8,.6)";
  const borderCol    = dark ? "rgba(255,255,255,.1)"  : "rgba(26,20,8,.19)";
  const cardBg       = dark ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.4)";
  const brandGG = dark ? "linear-gradient(135deg,#00ff88,#00e676,#00cc6a)" : "linear-gradient(135deg,#00A35C,#00814A)";
  const G = dark ? "#00ff88" : "#00A35C";

  return (
    <PageWrapper>
      <SEO
        title="SRS — The Sales Recovery System"
        description="SRS (Sales Recovery System) is Bode Conversion Lab's 4-phase methodology for fixing an e-commerce store's checkout, trust signals, and site speed before scaling ad spend. Foundation Fix, Traffic Ignition, Scale & Compound, Systemize."
        path="/srs"
        service={{ name: "Sales Recovery System (SRS)", description: "A 4-phase methodology that fixes store conversion leaks before scaling ad spend, so every dollar of traffic converts better." }}
        faq={SRS_FAQ}
      />

      {/* ── HERO ── */}
      <section style={{ position:"relative", overflow:"hidden", padding:"clamp(5rem,10vw,7rem) clamp(1rem,4vw,2rem) 3rem" }}>
        <HeroBackdrop dark={dark} />
        <div style={{ position:"relative", zIndex:1, maxWidth:820, margin:"0 auto", textAlign:"center" }}>
          <p style={{ fontSize:11, fontWeight:700, color:G, letterSpacing:".1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            The Methodology
          </p>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(2.2rem,6vw,3.6rem)", fontWeight:800, color:headingColor, lineHeight:1.1, marginBottom:"1.2rem" }}>
            The <GradText>Sales Recovery System</GradText>
          </h1>
          <p style={{ fontSize:16, color:mutedText, lineHeight:1.8, maxWidth:620, margin:"0 auto 2rem" }}>
            Most agencies run ads first. We fix the store first — because sending traffic to a leaky funnel just burns your budget faster. SRS fixes what's broken, proves what works, then scales only what's earned it.
          </p>
          <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
            <Link to="/audit" style={{ padding:"14px 32px", borderRadius:10, background:brandGG, color:"#040608", fontWeight:700, fontSize:14, textDecoration:"none" }}>
              Get your free audit →
            </Link>
            <Link to="/pricing" style={{ padding:"14px 32px", borderRadius:10, border:`1px solid ${borderCol}`, color:headingColor, fontWeight:600, fontSize:14, textDecoration:"none" }}>
              See pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE 4 PHASES, IN DEPTH ── */}
      <Section>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <SectionLabel>How it works</SectionLabel>
          <Heading size="2rem">Four phases. One compounding system.</Heading>
          <div style={{ marginTop:"2.5rem", display:"flex", flexDirection:"column", gap:"1.2rem" }}>
            {PHASES.map((p, i) => (
              <ScrollReveal key={p.n} delay={i * 0.08}>
                <TiltCard className="glass" style={{ padding:"clamp(1.5rem,4vw,2.2rem)" }}>
                  <div style={{ display:"flex", gap:"1.2rem", alignItems:"flex-start", flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"2.2rem", fontWeight:800, color:G, flexShrink:0, opacity:.85 }}>
                      {p.n}
                    </span>
                    <div style={{ flex:1, minWidth:240 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:".4rem" }}>
                        <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"1.3rem", fontWeight:800, color:headingColor }}>{p.name}</h3>
                        <span style={{ fontSize:10.5, fontWeight:700, color:mutedText2, border:`1px solid ${borderCol}`, borderRadius:100, padding:"2px 10px", textTransform:"uppercase", letterSpacing:".04em" }}>{p.tag}</span>
                      </div>
                      <p style={{ fontSize:14, color:G, fontWeight:600, marginBottom:".8rem" }}>{p.summary}</p>
                      <p style={{ fontSize:14, color:mutedText, lineHeight:1.75, marginBottom:"1rem" }}>{p.detail}</p>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:".6rem" }}>
                        {p.bullets.map((b, j) => (
                          <div key={j} style={{ display:"flex", gap:".6rem", alignItems:"flex-start" }}>
                            <span style={{ color:G, fontWeight:800, fontSize:13, flexShrink:0, marginTop:1 }}>✓</span>
                            <span style={{ fontSize:13, color:mutedText, lineHeight:1.6 }}>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SRS vs TRADITIONAL AGENCY ── */}
      <Section>
        <div style={{ maxWidth:820, margin:"0 auto" }}>
          <SectionLabel>The difference</SectionLabel>
          <Heading size="1.8rem">SRS vs. the typical agency approach</Heading>
          <div style={{ marginTop:"1.8rem", border:`1px solid ${borderCol}`, borderRadius:16, overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", background: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)" }}>
              <div style={{ padding:"1rem 1.2rem", fontSize:11, fontWeight:700, color:mutedText2, textTransform:"uppercase", letterSpacing:".05em" }}>Typical agency</div>
              <div style={{ padding:"1rem 1.2rem", fontSize:11, fontWeight:700, color:G, textTransform:"uppercase", letterSpacing:".05em", borderLeft:`1px solid ${borderCol}` }}>SRS</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderTop:`1px solid ${borderCol}` }}>
                <div style={{ padding:"1rem 1.2rem", fontSize:13.5, color:mutedText, lineHeight:1.6 }}>{row.theirs}</div>
                <div style={{ padding:"1rem 1.2rem", fontSize:13.5, color:headingColor, lineHeight:1.6, borderLeft:`1px solid ${borderCol}`, fontWeight:500 }}>{row.ours}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── PROOF POINT ── */}
      <Section>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
          <SectionLabel>Real results</SectionLabel>
          <Heading size="1.8rem">Same product. Same budget. <GradText>4.2x the ROAS.</GradText></Heading>
          <p style={{ fontSize:14.5, color:mutedText, lineHeight:1.8, margin:"1rem auto 0", maxWidth:560 }}>
            Our best documented result: a store went from $1,000/month to $70,000/month in 90 days — a 0.8x to 4.2x ROAS improvement, on the exact same product and ad budget. The only thing that changed was fixing the funnel before scaling spend.
          </p>
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <SectionLabel>Questions</SectionLabel>
          <Heading size="1.8rem">About SRS</Heading>
          <div style={{ marginTop:"1.5rem", display:"flex", flexDirection:"column", gap:".8rem" }}>
            {SRS_FAQ.map((f, i) => (
              <div key={i} style={{ padding:"1.2rem 1.4rem", borderRadius:14, border:`1px solid ${borderCol}`, background:cardBg }}>
                <p style={{ fontSize:14.5, fontWeight:700, color:headingColor, marginBottom:".5rem" }}>{f.q}</p>
                <p style={{ fontSize:13.5, color:mutedText, lineHeight:1.7 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section style={{ paddingBottom:"6rem" }}>
        <div style={{ maxWidth:640, margin:"0 auto", textAlign:"center" }}>
          <Heading size="1.8rem">Ready to run SRS on <GradText>your store?</GradText></Heading>
          <p style={{ fontSize:14, color:mutedText2, margin:"1rem 0 1.6rem" }}>
            It starts with a free audit — we'll show you exactly where Phase 1 needs to focus before you spend another dollar on ads.
          </p>
          <Link to="/audit" style={{ display:"inline-block", padding:"14px 32px", borderRadius:10, background:brandGG, color:"#040608", fontWeight:700, fontSize:15, textDecoration:"none" }}>
            Run my free audit →
          </Link>
        </div>
      </Section>
    </PageWrapper>
  );
}
