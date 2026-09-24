// Shared page copy. Imported by the React pages AND by scripts/prerender.mjs,
// so the static HTML that crawlers see always matches what visitors see.

export const PHASES = [
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

export const COMPARISON = [
  { theirs: "Ads first, hope the store converts", ours: "Store fixed first, then ads — so spend isn't wasted on a leaky funnel" },
  { theirs: "Broad, blind ad spend from day one", ours: "Small controlled tests find what works before scaling spend" },
  { theirs: "Reports full of impressions & reach", ours: "Reports built around ROAS, CAC, and margin — numbers that pay bills" },
  { theirs: "Locked into long contracts", ours: "Month-to-month — we keep the account by performing, not by contract" },
];

export const SRS_FAQ = [
  { q: "What is SRS (Sales Recovery System)?", a: "SRS is Bode Conversion Lab's four-phase methodology for fixing an e-commerce store's revenue before scaling ad spend: Foundation Fix, Traffic Ignition, Scale & Compound, and Systemize. It exists because sending traffic to a leaky store just burns budget faster — fixing the leaks first makes every dollar of ad spend afterward convert better." },
  { q: "How long does the SRS process take?", a: "Foundation Fix typically runs 1–2 weeks, Traffic Ignition 2–5 weeks, and Scale & Compound from week 5 onward as results prove out. Systemize is ongoing — it's what keeps the results compounding rather than fading once initial fixes are made." },
  { q: "Do I need a big ad budget to start SRS?", a: "No. Phase 1 (Foundation Fix) doesn't require any ad spend at all — it's entirely about fixing what's already costing you sales. Phase 2 starts with small, controlled test budgets, not a large spend commitment." },
  { q: "How is SRS different from a normal ad agency?", a: "Most agencies start by running ads and scaling spend based on early results, even if the store itself has conversion leaks. SRS fixes the store's checkout, trust signals, and site speed first, so the traffic an agency later buys actually converts instead of leaking away." },
  { q: "What's a realistic result from SRS?", a: "Results vary by store, but our best documented result took a client from $1k/month to $70k/month in 90 days — a 0.8x to 4.2x ROAS improvement on the same product and the same ad budget, purely from fixing the funnel before scaling spend." },
];

// Named client results shown on the homepage strip and the SRS page.
export const PROOF_RESULTS = [
  { name: "Novi Good Store",   result: "4.3x ROAS", sub: "$57k in sales", line: "4.3x ROAS, $57k in sales" },
  { name: "Robin and Roobaby", result: "$77k",      sub: "in sales",      line: "$77k in sales" },
  { name: "Stream Ride Store", result: "$36k",      sub: "in sales",      line: "$36k in sales" },
];

// Homepage "The system" cards.
export const HOME_STEPS = [
  { n:"01", t:"Deep-dive audit",         d:"We dissect your store, ads, and full funnel. Every leak, every friction point, every missed dollar — mapped in 48 hours." },
  { n:"02", t:"Conversion architecture", d:"We rebuild your pages with one goal: turning browsers into buyers using the traffic you already have." },
  { n:"03", t:"Ad engineering",          d:"Precision creatives, copy and targeting built around your customer's real pain points. Every ad compounds." },
  { n:"04", t:"Scale & compound",        d:"Once ROAS target is hit, we scale. Same efficiency, more budget. $1k/mo becomes $70k/mo." },
];

// Homepage compact SRS cards.
export const HOME_SRS_PHASES = [
  { phase:"01", t:"Foundation Fix",   d:"Fix leaks & trust signals first." },
  { phase:"02", t:"Traffic Ignition", d:"Controlled ad tests find winners." },
  { phase:"03", t:"Scale & Compound", d:"Double down on what's proven." },
  { phase:"04", t:"Systemize",        d:"Document it so it runs itself." },
];
