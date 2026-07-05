import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { G, GG } from "../data.js";
import { PageWrapper, GradText, useTheme } from "../components.jsx";
import { ScrollReveal, TiltCard } from "../AnimationSystem.jsx";

/* ─── CONFIG ─── */
const PSI_KEY    = "AIzaSyCAnT0GIpN-3OVQkP3fPJBwhl6pTU0BN8k";
const ADMIN_EMAIL = "bodeagencyofficial@gmail.com";

/* ─── ACCESS CODES — add new ones as clients pay ─── */
const ACCESS_CODES = {
  // "BCL-XXXXXXXX": { tier: "diagnosis" | "fix" | "lab" | "fullstack", client: "Name" }
  "BCL-DEMO1234": { tier: "fullstack", client: "Demo Client" },
};

/* ─── DEEP DIAGNOSTIC QUESTIONS ─── */
const DIAGNOSTIC = [
  {
    category: "🛒 Checkout & Conversion",
    questions: [
      { id:"q1",  text:"Does your checkout require account creation before purchase?",        options:["Yes, mandatory","Optional but default","No — guest checkout available","I don't know"] },
      { id:"q2",  text:"How many steps does your checkout process have?",                     options:["1-2 steps","3-4 steps","5+ steps","I don't know"] },
      { id:"q3",  text:"Do you have an abandoned cart recovery system?",                      options:["Yes, email + SMS","Email only","No","I don't know"] },
      { id:"q4",  text:"Do you display trust badges near your checkout button?",              options:["Yes, multiple","1-2 badges","None","I don't know"] },
      { id:"q5",  text:"Do you offer multiple payment methods (cards, PayPal, BNPL)?",       options:["3+ options","2 options","Card only","I don't know"] },
    ]
  },
  {
    category: "📱 Product Page Quality",
    questions: [
      { id:"q6",  text:"Is your Add to Cart button visible without scrolling on mobile?",    options:["Yes, always","Sometimes","No","I don't know"] },
      { id:"q7",  text:"How many product images do you have per product?",                   options:["6+ with video","3-5 images","1-2 images","None"] },
      { id:"q8",  text:"Do you have customer reviews visible on product pages?",             options:["Yes, above the fold","Yes, below the fold","No reviews","I don't know"] },
      { id:"q9",  text:"Do you show urgency signals (stock count, limited time)?",           options:["Yes, both","One of them","No","I don't know"] },
      { id:"q10", text:"Does your product description address buyer objections?",             options:["Yes, specifically","Somewhat","Generic only","No description"] },
    ]
  },
  {
    category: "📈 Ad Account Health",
    questions: [
      { id:"q11", text:"What is your current ROAS (return on ad spend)?",                   options:["4x+","2-4x","Below 2x","Not running ads"] },
      { id:"q12", text:"Are you running retargeting campaigns?",                             options:["Yes, multiple audiences","Basic retargeting","No","I don't know"] },
      { id:"q13", text:"How often do you refresh your ad creatives?",                        options:["Weekly","Monthly","Rarely","Never"] },
      { id:"q14", text:"Do you use lookalike audiences based on purchasers?",                options:["Yes","No","I don't know","Not applicable"] },
      { id:"q15", text:"Are your ad landing pages different from your homepage?",            options:["Yes, dedicated pages","Sometimes","No, homepage only","I don't know"] },
    ]
  },
  {
    category: "✉️ Email & Retention",
    questions: [
      { id:"q16", text:"Do you have an abandoned cart email sequence?",                      options:["Yes, 3+ emails","1-2 emails","No","Planning to"] },
      { id:"q17", text:"Do you have a post-purchase email flow?",                            options:["Yes, full sequence","Just order confirmation","No","I don't know"] },
      { id:"q18", text:"How do you collect customer emails?",                                options:["Popup + checkout","Checkout only","No system","I don't know"] },
      { id:"q19", text:"Do you run win-back campaigns for lapsed customers?",                options:["Yes, automated","Manual sometimes","No","I don't know"] },
      { id:"q20", text:"What is your email open rate approximately?",                        options:["25%+","15-25%","Below 15%","Not using email"] },
    ]
  },
  {
    category: "🔒 Trust & Brand Authority",
    questions: [
      { id:"q21", text:"Do you have an About Us page with real team/founder info?",          options:["Yes, detailed","Basic info","No","I don't know"] },
      { id:"q22", text:"Do you display social proof (press mentions, follower counts)?",     options:["Yes, prominently","Some","No","I don't know"] },
      { id:"q23", text:"Do you have a clear return/refund policy visible before checkout?",  options:["Yes, clearly visible","Buried in footer","No","I don't know"] },
      { id:"q24", text:"Do you have UGC (user-generated content) on your store?",            options:["Yes, throughout","Some","No","I don't know"] },
      { id:"q25", text:"How quickly do you respond to customer inquiries?",                  options:["Within 1 hour","Same day","1-3 days","Not consistently"] },
    ]
  },
];

/* ─── SCORING LOGIC PER ANSWER ─── */
function scoreAnswer(id, answer) {
  const goodAnswers = {
    q1:["No — guest checkout available"],
    q2:["1-2 steps"],
    q3:["Yes, email + SMS"],
    q4:["Yes, multiple"],
    q5:["3+ options"],
    q6:["Yes, always"],
    q7:["6+ with video"],
    q8:["Yes, above the fold"],
    q9:["Yes, both"],
    q10:["Yes, specifically"],
    q11:["4x+"],
    q12:["Yes, multiple audiences"],
    q13:["Weekly"],
    q14:["Yes"],
    q15:["Yes, dedicated pages"],
    q16:["Yes, 3+ emails"],
    q17:["Yes, full sequence"],
    q18:["Popup + checkout"],
    q19:["Yes, automated"],
    q20:["25%+"],
    q21:["Yes, detailed"],
    q22:["Yes, prominently"],
    q23:["Yes, clearly visible"],
    q24:["Yes, throughout"],
    q25:["Within 1 hour"],
  };
  const okAnswers = {
    q1:["Optional but default"],
    q2:["3-4 steps"],
    q3:["Email only"],
    q4:["1-2 badges"],
    q5:["2 options"],
    q6:["Sometimes"],
    q7:["3-5 images"],
    q8:["Yes, below the fold"],
    q9:["One of them"],
    q10:["Somewhat"],
    q11:["2-4x"],
    q12:["Basic retargeting"],
    q13:["Monthly"],
    q14:["I don't know"],
    q15:["Sometimes"],
    q16:["1-2 emails"],
    q17:["Just order confirmation"],
    q18:["Checkout only"],
    q19:["Manual sometimes"],
    q20:["15-25%"],
    q21:["Basic info"],
    q22:["Some"],
    q23:["Buried in footer"],
    q24:["Some"],
    q25:["Same day"],
  };
  if (goodAnswers[id]?.includes(answer)) return 100;
  if (okAnswers[id]?.includes(answer))   return 55;
  return 10;
}

/* ─── GENERATE FINDINGS FROM ANSWERS ─── */
function generateFindings(answers) {
  const findings = [];

  const findingMap = {
    q1: { bad:["Yes, mandatory"], finding:"Forced account creation is killing your checkout. Industry data shows this eliminates 35% of buyers before payment — they came to buy, not to register.", severity:"critical", fix:"Enable guest checkout immediately. This is a 20-minute fix that typically lifts conversion by 15-30%." },
    q2: { bad:["5+ steps"], ok:["3-4 steps"], finding:"Your checkout has too many steps. Every additional step costs you buyers — each extra page reduces conversion by approximately 10-15%.", severity:"high", fix:"Audit every checkout step and eliminate anything that isn't essential to completing the transaction." },
    q3: { bad:["No"], finding:"You have no abandoned cart recovery. 70% of shoppers who add to cart don't buy on the first visit. Without recovery emails, you're leaving all of that revenue on the table.", severity:"critical", fix:"Set up a 3-email abandoned cart sequence: 1hr reminder, 24hr objection handler, 72hr final offer with urgency." },
    q4: { bad:["None"], ok:["1-2 badges"], finding:"Missing or insufficient trust badges near checkout. Trust signals at the point of payment reduce buyer anxiety and directly increase completion rates.", severity:"high", fix:"Add SSL badge, payment method logos, money-back guarantee, and any relevant certifications near your checkout button." },
    q5: { bad:["Card only"], finding:"Limited payment options are creating unnecessary friction. In international markets especially, buyers abandon if their preferred payment method isn't available.", severity:"medium", fix:"Add PayPal, Apple Pay, and at minimum one Buy Now Pay Later option. Each addition increases eligible buyer pool." },
    q6: { bad:["No"], ok:["Sometimes"], finding:"Your Add to Cart button is not visible above the fold on mobile. If buyers have to scroll to find how to buy, many won't bother.", severity:"critical", fix:"Restructure your mobile product page layout. Price + CTA must be visible within the first screen without scrolling." },
    q7: { bad:["1-2 images","None"], finding:"Insufficient product imagery. Online shoppers need to feel confident about what they're buying. Thin image galleries signal low quality and increase return anxiety.", severity:"high", fix:"Minimum 6 images per product: front, back, detail, lifestyle, scale reference, and a video. Video alone lifts conversion by 80% on mobile." },
    q8: { bad:["No reviews"], ok:["Yes, below the fold"], finding:"Reviews are not visible above the fold — or don't exist. Social proof is one of the most powerful conversion elements. Its absence communicates risk.", severity:"critical", fix:"Import or collect reviews and display them prominently. Aim for star rating + count visible near price. Even 5 reviews outperform none." },
    q9: { bad:["No"], ok:["One of them"], finding:"No urgency signals on product pages. Without scarcity or urgency, buyers rationalize waiting — and then never return.", severity:"medium", fix:"Add real stock counts (\"Only 7 left\"), limited-time offers, or \"X people viewing now\" signals. Must be authentic to maintain trust." },
    q10:{ bad:["Generic only","No description"], finding:"Your product descriptions aren't addressing buyer objections. Generic copy doesn't convert. Buyers have fears — if your copy doesn't speak to them, they leave.", severity:"high", fix:"Rewrite descriptions around the top 3 buyer objections for each product. Answer: Is this right for me? Will it actually work? What if I don't like it?" },
    q11:{ bad:["Below 2x","Not running ads"], finding:"Sub-2x ROAS means every ad dollar is losing money after product costs, fulfillment, and platform fees. You're paying to acquire customers at a loss.", severity:"critical", fix:"Stop scaling until ROAS is fixed. Audit your funnel first — ads amplify your conversion rate, they don't fix it." },
    q12:{ bad:["No"], ok:["Basic retargeting"], finding:"No meaningful retargeting strategy. You're paying to acquire cold traffic and then abandoning 97% of them who don't buy on first visit.", severity:"high", fix:"Build a retargeting stack: product page visitors (3-day), add-to-cart abandoners (1-day), checkout abandoners (6-hour). Each audience needs different messaging." },
    q13:{ bad:["Rarely","Never"], finding:"Ad creative fatigue is costing you performance. When buyers see the same ads repeatedly, engagement drops sharply — typically within 2-3 weeks.", severity:"medium", fix:"Establish a weekly creative review. Flag any ad with declining CTR or rising CPM for immediate refresh. Build a content bank to pull from." },
    q14:{ bad:["No"], finding:"No lookalike audiences based on purchasers. This is one of the highest-value targeting methods available — you're ignoring it.", severity:"medium", fix:"Upload your customer list to Meta and Google. Create 1%, 3%, and 5% lookalikes. Test each against your current targeting." },
    q15:{ bad:["No, homepage only"], ok:["Sometimes"], finding:"Sending ad traffic to your homepage is one of the most common and costly mistakes in e-commerce advertising. Homepage is not a landing page.", severity:"critical", fix:"Build dedicated landing pages for each ad campaign. Match the ad message exactly. Remove navigation to reduce distraction. Every element should lead to one action." },
    q16:{ bad:["No"], ok:["1-2 emails"], finding:"Weak or absent abandoned cart recovery. This is the single highest-ROI email automation available. A 3-email sequence recovers 15-20% of abandoned carts.", severity:"critical", fix:"Build a 3-part sequence: Email 1 (1hr): simple reminder with product image. Email 2 (24hr): address objections + reviews. Email 3 (72hr): create urgency with a small incentive." },
    q17:{ bad:["No","Just order confirmation"], finding:"No post-purchase email flow means you're leaving repeat revenue on the table. The easiest customer to convert is one who's already bought from you.", severity:"high", fix:"Build a 5-email post-purchase sequence: confirmation, shipping update, delivery check-in, review request (day 7), related product recommendation (day 14)." },
    q18:{ bad:["No system"], ok:["Checkout only"], finding:"Poor email collection strategy. Your email list is your owned audience — the only channel that isn't subject to algorithm changes or ad costs.", severity:"high", fix:"Add an exit-intent popup offering a 10% discount or free resource. Add inline email capture to blog posts and product pages. Checkout email is table stakes — build beyond it." },
    q19:{ bad:["No"], finding:"No win-back campaign for lapsed customers. Customers who've bought once are 9x more likely to convert than cold prospects — but not if you never contact them.", severity:"medium", fix:"Build a 2-email win-back for customers with no purchase in 90 days: Email 1: \"We miss you\" + best products. Email 2: Last chance + incentive." },
    q20:{ bad:["Below 15%","Not using email"], finding:"Your email open rates are critically low or email isn't being used at all. This indicates poor list hygiene, weak subject lines, or an audience that's disengaged.", severity:"high", fix:"Clean your list — remove contacts with no opens in 90 days. Improve subject lines using curiosity, specificity, and the word 'you'. Aim for 25%+ before scaling list size." },
    q21:{ bad:["No"], ok:["Basic info"], finding:"Weak or missing About page. In e-commerce, especially for DTC brands, the founder story is a conversion asset. Anonymous stores feel risky.", severity:"medium", fix:"Write a genuine founder story. Address why you started the brand, who it's for, and what you believe. Include a real photo. This page converts better than most product pages." },
    q22:{ bad:["No"], ok:["Some"], finding:"Insufficient social proof. Beyond product reviews, you need brand-level social proof — press mentions, follower counts, certifications, or industry recognition.", severity:"medium", fix:"Add a social proof bar on your homepage: logos of publications, a follower count if meaningful, a customer counter if you have one. Even niche credibility signals help." },
    q23:{ bad:["No"], ok:["Buried in footer"], finding:"Return policy not visible at point of decision. Return anxiety is one of the top reasons buyers don't convert — if they can't easily see your policy, they assume it's bad.", severity:"high", fix:"Add return policy summary near your Add to Cart button. \"Free returns within 30 days\" displayed at the point of purchase directly lifts conversion." },
    q24:{ bad:["No"], ok:["Some"], finding:"No user-generated content strategy. UGC is the most credible form of social proof available — real customers using your product is worth more than any ad you can run.", severity:"medium", fix:"Start collecting UGC immediately: request photos from past customers, run a hashtag campaign, offer a discount for tagged posts. Add to product pages and ads." },
    q25:{ bad:["1-3 days","Not consistently"], finding:"Slow customer response time is damaging trust and costing sales. Many purchase decisions are made within hours — if a prospect doesn't hear back, they buy from a competitor.", severity:"high", fix:"Set up automated first-response within 1 hour acknowledging the inquiry. Aim for human response within 4 business hours. Response time is a trust signal." },
  };

  Object.entries(answers).forEach(([id, answer]) => {
    const map = findingMap[id];
    if (!map) return;
    const isBad = map.bad?.includes(answer);
    const isOk  = map.ok?.includes(answer);
    if (isBad || isOk) {
      findings.push({
        id,
        finding: map.finding,
        fix: map.fix,
        severity: isBad ? map.severity : (map.severity === "critical" ? "high" : map.severity === "high" ? "medium" : "low"),
        score: isBad ? 10 : 55,
      });
    }
  });

  return findings.sort((a, b) => {
    const order = { critical:0, high:1, medium:2, low:3 };
    return order[a.severity] - order[b.severity];
  });
}

/* ─── GENERATE PLANS ─── */
function generatePlans(findings, answers, techResults) {
  const hasCritical = findings.filter(f => f.severity === "critical");
  const hasHigh     = findings.filter(f => f.severity === "high");

  const fixingPlan = [
    {
      phase: "Phase 1 — Stop the Bleeding (Week 1-2)",
      priority: "critical",
      actions: [
        ...hasCritical.map(f => ({ title: findingTitle(f.id), action: f.fix, impact: "High", effort: "Low-Medium" })),
        ...(techResults?.raw?.mPerf < 60 ? [{ title:"Fix mobile page speed", action:"Compress all images to WebP, remove unused JavaScript, enable browser caching. Target: under 3 seconds.", impact:"High", effort:"Medium" }] : []),
      ].slice(0, 5),
    },
    {
      phase: "Phase 2 — Conversion Foundation (Week 3-4)",
      priority: "high",
      actions: hasHigh.map(f => ({ title: findingTitle(f.id), action: f.fix, impact: "Medium-High", effort: "Medium" })).slice(0, 5),
    },
    {
      phase: "Phase 3 — Optimize & Test (Month 2)",
      priority: "medium",
      actions: [
        { title:"A/B test product page layouts", action:"Test two versions of your product page CTA placement, imagery, and description format. Run for minimum 1,000 visitors per variant.", impact:"Medium", effort:"Medium" },
        { title:"Implement heatmap tracking", action:"Install Hotjar or Microsoft Clarity (free) to see exactly where users click, scroll, and drop off. Use this data to prioritize next round of changes.", impact:"Medium", effort:"Low" },
        { title:"Review and optimize ad creative", action:"Audit all active ads — pause anything with declining CTR. Brief 3 new creative angles based on your top customer objections.", impact:"High", effort:"Medium" },
      ],
    },
  ];

  const growthPlan = [
    {
      phase: "Traffic Architecture",
      actions: [
        { title:"Build a content marketing engine", action:"Publish 2 SEO-optimised articles per week targeting buyer-intent keywords (e.g. 'best [product] for [use case]'). Each article is a 24/7 traffic source.", metric:"Target: 5,000 organic monthly visitors within 6 months" },
        { title:"Activate TikTok for discovery", action:"Post 3x/week raw behind-the-scenes content. Don't produce ads — produce content. TikTok rewards authenticity over production value.", metric:"Target: 1 viral post per month (10k+ views)" },
        { title:"Build influencer pipeline", action:"Identify 20 micro-influencers (5k-50k followers) in your niche. Offer product-for-post collaborations. 1 in 4 will drive meaningful traffic.", metric:"Target: 5 active collaborations within 30 days" },
      ],
    },
    {
      phase: "Conversion Compounding",
      actions: [
        { title:"Launch loyalty programme", action:"Implement a simple points-for-purchase system. Returning customers spend 67% more than new ones. Even a basic loyalty structure dramatically lifts LTV.", metric:"Target: 20% increase in repeat purchase rate" },
        { title:"Bundle strategy", action:"Create 3 strategic product bundles at 10-15% discount vs individual pricing. Bundles increase AOV and reduce price sensitivity.", metric:"Target: 25% of orders include a bundle" },
        { title:"Post-purchase upsell", action:"Add a one-click upsell immediately after purchase confirmation. \"Complete your order\" offers convert at 15-25% — highest converting moment in the funnel.", metric:"Target: 15% upsell take rate" },
      ],
    },
    {
      phase: "Scale Infrastructure",
      actions: [
        { title:"Implement attribution tracking", action:"Set up MER (Marketing Efficiency Ratio) tracking across all channels. Stop optimising for ROAS alone — optimise for profit.", metric:"Target: Clear view of true CAC and LTV by channel" },
        { title:"Build paid media testing framework", action:"Allocate 20% of ad budget to new creative testing weekly. Document what wins and why. Build a swipe file of proven angles.", metric:"Target: 1 new proven creative angle per month" },
        { title:"Subscription / recurring revenue", action:"If your product allows, introduce a subscription option. Even 10% of customers on subscription transforms your revenue predictability.", metric:"Target: 10% subscription penetration within 90 days" },
      ],
    },
  ];

  const marketingPlan = [
    {
      phase: "Brand Positioning",
      actions: [
        { title:"Define your singular brand position", action:"You need one sentence that no competitor can honestly say. Not 'high quality' or 'best price' — a specific, verifiable claim. Build all creative around this.", metric:"Deliverable: 1-sentence brand positioning statement" },
        { title:"Develop customer avatar", action:"Interview 5 existing customers. Understand their exact language, fears, and aspirations. Your ad copy should sound like your customer talking to themselves.", metric:"Deliverable: Detailed customer avatar document" },
        { title:"Create brand content pillars", action:"Define 4 content themes that reflect your brand values. Every piece of content fits one pillar. This creates consistency without rigidity.", metric:"Deliverable: 4 content pillars with 10 ideas each" },
      ],
    },
    {
      phase: "Paid Media Strategy",
      actions: [
        { title:"Meta campaign architecture", action:"Structure: Awareness (TOF — broad/interest) → Consideration (MOF — video views, page visitors) → Conversion (BOF — add-to-cart, checkout). Each level has different creative, copy, and bidding.", metric:"Target: 4x+ blended ROAS within 60 days" },
        { title:"Creative strategy by platform", action:"Meta: Problem-agitate-solve format. TikTok: Native, authentic, trend-aware. Google: Intent-based, benefit-led. Pinterest: Aspirational, lifestyle-led. Never run the same creative across all platforms.", metric:"Target: Platform-specific CTR benchmarks hit within 30 days" },
        { title:"Seasonal planning", action:"Map your top 6 revenue events for the year (BFCM, Valentine's, etc.). Build creative and offer strategy 6 weeks in advance. Don't improvise on peak days.", metric:"Deliverable: 12-month promotional calendar" },
      ],
    },
    {
      phase: "Email Marketing Architecture",
      actions: [
        { title:"Core flow build-out", action:"Priority order: Abandoned Cart → Post-Purchase → Welcome Series → Win-Back. Each flow is an automated revenue engine. Build in this order for maximum ROI.", metric:"Target: Email generates 30% of total revenue" },
        { title:"Segmentation strategy", action:"Segment by: purchase frequency, average order value, product category, acquisition source. Different segments need different messages — one-size-fits-all email kills deliverability.", metric:"Target: 25%+ open rate across all segments" },
        { title:"List growth engine", action:"Exit-intent popup (10% off) → Welcome email → Educational sequence (value-first) → Soft sell. Build trust before asking for money. Subscribers who buy once from email have 3x LTV.", metric:"Target: 500 new subscribers per month" },
      ],
    },
  ];

  return { fixingPlan, growthPlan, marketingPlan };
}

function findingTitle(id) {
  const titles = {
    q1:"Enable guest checkout",q2:"Reduce checkout steps",q3:"Build abandoned cart sequence",
    q4:"Add trust badges",q5:"Expand payment options",q6:"Fix mobile CTA visibility",
    q7:"Improve product imagery",q8:"Add above-fold reviews",q9:"Add urgency signals",
    q10:"Rewrite product descriptions",q11:"Fix ROAS before scaling",q12:"Build retargeting stack",
    q13:"Refresh ad creatives weekly",q14:"Build lookalike audiences",q15:"Build dedicated landing pages",
    q16:"Build 3-email cart recovery",q17:"Build post-purchase sequence",q18:"Improve email collection",
    q19:"Build win-back campaign",q20:"Improve email engagement",q21:"Build founder story page",
    q22:"Add brand social proof",q23:"Make return policy visible",q24:"Collect UGC",q25:"Fix response time",
  };
  return titles[id] || id;
}

/* ─── SEVERITY COLORS ─── */
function sevColor(s) {
  if (s === "critical") return "#FF3B3B";
  if (s === "high")     return "#FF9900";
  if (s === "medium")   return "#FFD700";
  return "#00ff88";
}

/* ─── GENERATE PDF/HTML REPORT ─── */
function generateReport(storeUrl, findings, plans, techResults, tier) {
  const now = new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
  const planSections = tier === "diagnosis" ? [] :
    tier === "fix" ? [plans.fixingPlan] :
    tier === "lab" ? [plans.fixingPlan, plans.growthPlan] :
    [plans.fixingPlan, plans.growthPlan, plans.marketingPlan];

  const planNames = ["🔧 Fixing Plan", "📈 Growth Plan", "📣 Marketing Plan"];

  const planHTML = planSections.map((plan, idx) => `
    <div style="margin-top:40px">
      <h2 style="font-size:22px;font-weight:800;color:#00ff88;margin-bottom:20px">${planNames[idx]}</h2>
      ${plan.map(phase => `
        <div style="margin-bottom:30px">
          <h3 style="font-size:16px;font-weight:700;color:#fff;margin-bottom:12px;padding:8px 16px;background:rgba(0,255,136,.1);border-radius:8px;border-left:3px solid #00ff88">${phase.phase}</h3>
          ${phase.actions.map(action => `
            <div style="margin-bottom:16px;padding:16px;background:rgba(255,255,255,.04);border-radius:10px;border:.5px solid rgba(255,255,255,.08)">
              <p style="font-weight:700;color:#fff;margin-bottom:6px">→ ${action.title}</p>
              <p style="color:rgba(255,255,255,.6);font-size:13px;line-height:1.7;margin-bottom:8px">${action.action}</p>
              <p style="color:#00ff88;font-size:12px;font-weight:600">${action.metric || `Impact: ${action.impact} | Effort: ${action.effort}`}</p>
            </div>
          `).join("")}
        </div>
      `).join("")}
    </div>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>BCL Store Audit — ${storeUrl}</title>
<style>
  body{font-family:'Inter',sans-serif;background:#040608;color:#f0f0f0;margin:0;padding:40px;max-width:900px;margin:0 auto;}
  h1{font-size:32px;font-weight:800;background:linear-gradient(135deg,#00ff88,#00cc6a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .finding{margin-bottom:20px;padding:16px 20px;border-radius:12px;border-left:4px solid;}
  .critical{background:rgba(255,59,59,.1);border-color:#FF3B3B;}
  .high{background:rgba(255,153,0,.08);border-color:#FF9900;}
  .medium{background:rgba(255,215,0,.06);border-color:#FFD700;}
  .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;text-transform:uppercase;}
  .watermark{text-align:center;color:rgba(255,255,255,.15);font-size:11px;margin-top:60px;padding-top:20px;border-top:.5px solid rgba(255,255,255,.06);}
</style>
</head>
<body>
<p style="color:rgba(255,255,255,.4);font-size:12px">Generated ${now} by Bode Conversion Lab</p>
<h1>Store Audit Report</h1>
<p style="color:rgba(255,255,255,.6);font-size:16px;margin-bottom:8px">🌐 ${storeUrl}</p>
${techResults ? `<p style="color:rgba(255,255,255,.5);font-size:13px">Technical Score: ${techResults.overall}/100 | Mobile: ${techResults.raw?.mPerf ?? "—"}/100</p>` : ""}
<h2 style="font-size:22px;font-weight:800;color:#00ff88;margin:32px 0 16px">Findings — ${findings.length} Issues Identified</h2>
${findings.map(f => `
  <div class="finding ${f.severity}">
    <p><span class="badge" style="background:${sevColor(f.severity)}22;color:${sevColor(f.severity)}">${f.severity.toUpperCase()}</span></p>
    <p style="font-weight:700;color:#fff;margin:8px 0 4px">${findingTitle(f.id)}</p>
    <p style="color:rgba(255,255,255,.65);font-size:13px;line-height:1.7;margin-bottom:8px">${f.finding}</p>
    <p style="color:#00ff88;font-size:13px"><strong>Fix:</strong> ${f.fix}</p>
  </div>
`).join("")}
${planHTML}
<div class="watermark">Bode Conversion Lab — bodeconversionlab.vercel.app — We don't run ads. We engineer ROAS.</div>
</body>
</html>`;
}

/* ─── DOWNLOAD HELPER ─── */
function downloadHTML(content, filename) {
  const blob = new Blob([content], { type:"text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ─── RING SVG ─── */
function Ring({ score, size=80, color=G }) {
  const r = size/2 - 6;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform:"rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={5}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition:"stroke-dasharray 1s cubic-bezier(.22,1,.36,1)" }}/>
    </svg>
  );
}

/* ─── PSI CHECKS ─── */
const CHECKS = [
  { id:"mobile",     label:"Mobile Performance",   icon:"📱", weight:0.25, critical:true },
  { id:"vitals",     label:"Core Web Vitals",       icon:"📊", weight:0.22, critical:true },
  { id:"speed",      label:"Page Speed",            icon:"⚡", weight:0.15 },
  { id:"seo",        label:"SEO Health",            icon:"🔍", weight:0.12 },
  { id:"images",     label:"Image Optimization",    icon:"🖼️", weight:0.10 },
  { id:"ssl",        label:"SSL & Security",        icon:"🔒", weight:0.06 },
  { id:"checkout",   label:"Checkout Friction",     icon:"🛒", weight:0.05 },
  { id:"conversion", label:"Conversion Readiness",  icon:"💰", weight:0.05 },
];

const SCAN_STAGES = [
  { msg:"Connecting to store...",            sub:"Initialising analysis engine" },
  { msg:"Scanning mobile performance...",     sub:"This is where most stores fail" },
  { msg:"Detecting layout shifts (CLS)...",   sub:"Invisible leaks that cost you buyers" },
  { msg:"Measuring load blocking (TBT)...",   sub:"Every millisecond costs conversion" },
  { msg:"Auditing SEO signals...",            sub:"Are you invisible on Google?" },
  { msg:"Checking image optimisation...",     sub:"Bloated images = lost revenue" },
  { msg:"Calculating friction points...",     sub:"Where buyers abandon your funnel" },
  { msg:"Running final diagnosis...",         sub:"Compiling your revenue leak report" },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function Audit() {
  const { dark } = useTheme();

  /* ── URL input ── */
  const [url, setUrl]           = useState("");
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [stageIdx, setStageIdx] = useState(0);
  const [techResults, setTechResults] = useState(null);

  /* ── Diagnostic quiz ── */
  const [showDiag, setShowDiag]       = useState(false);
  const [diagStep, setDiagStep]       = useState(0);
  const [diagAnswers, setDiagAnswers] = useState({});

  /* ── Final results ── */
  const [findings, setFindings]   = useState(null);
  const [plans, setPlans]         = useState(null);
  const [revealed, setRevealed]   = useState(false);

  /* ── Access control ── */
  const [accessCode, setAccessCode]     = useState("");
  const [accessTier, setAccessTier]     = useState(null); // null | "admin" | "diagnosis" | "fix" | "lab" | "fullstack"
  const [accessError, setAccessError]   = useState("");
  const [showAccessModal, setShowAccessModal] = useState(false);

  const headingColor = dark ? "#fff"                  : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.5)"   : "rgba(26,20,8,.65)";
  const mutedText2   = dark ? "rgba(255,255,255,.4)"   : "rgba(26,20,8,.55)";
  const mutedText3   = dark ? "rgba(255,255,255,.3)"   : "rgba(26,20,8,.45)";
  const cardBg       = dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(255,255,255,.5),rgba(255,255,255,.2))";
  const cardBorder   = dark ? "rgba(255,255,255,.1)"   : "rgba(26,20,8,.15)";
  const inputBg      = dark ? "rgba(255,255,255,.05)"  : "rgba(255,255,255,.5)";
  const inputBorder  = dark ? "rgba(255,255,255,.12)"  : "rgba(26,20,8,.18)";
  const trackBg      = dark ? "rgba(255,255,255,.08)"  : "rgba(26,20,8,.1)";

  /* ── PSI fetch & score ── */
  async function runTechScan(storeUrl) {
    let stage = 0;
    const interval = setInterval(() => {
      stage = Math.min(stage + 1, SCAN_STAGES.length - 1);
      setStageIdx(stage);
    }, 3500);

    try {
      const [desktop, mobile] = await Promise.all([
        fetchPSI(storeUrl, "desktop").catch(() => null),
        fetchPSI(storeUrl, "mobile").catch(() => null),
      ]);
      clearInterval(interval);
      return buildReport(desktop, mobile, storeUrl);
    } catch (e) {
      clearInterval(interval);
      throw e;
    }
  }

  /* ── Start scan ── */
  async function handleScan() {
    if (!url.trim()) return setError("Please enter your store URL.");
    if (!email.trim() || !email.includes("@")) return setError("Please enter your email address.");
    setError(""); setLoading(true); setStageIdx(0);
    setTechResults(null); setFindings(null); setPlans(null); setRevealed(false);

    try {
      const tech = await runTechScan(url.trim());
      setTechResults(tech);
      setLoading(false);
      setShowDiag(true);
      setDiagStep(0);
      setDiagAnswers({});
    } catch (e) {
      setLoading(false);
      setError("Could not reach that store URL. Please check it's correct and publicly accessible.");
    }
  }

  /* ── Answer diagnostic question ── */
  function answerQuestion(questionId, answer) {
    const newAnswers = { ...diagAnswers, [questionId]: answer };
    setDiagAnswers(newAnswers);

    const allQuestions = DIAGNOSTIC.flatMap(c => c.questions);
    const currentQ = allQuestions.find(q => q.id === questionId);
    const currentIdx = allQuestions.indexOf(currentQ);

    if (currentIdx < allQuestions.length - 1) {
      setDiagStep(currentIdx + 1);
    } else {
      // All questions answered — generate results
      const f = generateFindings(newAnswers);
      const p = generatePlans(f, newAnswers, techResults);
      setFindings(f);
      setPlans(p);
      setShowDiag(false);
      setTimeout(() => setRevealed(true), 100);
    }
  }

  /* ── Access code verification ── */
  function verifyAccess() {
    const code = accessCode.trim().toUpperCase();
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      setAccessTier("admin");
      setShowAccessModal(false);
      return;
    }
    const entry = ACCESS_CODES[code];
    if (entry) {
      setAccessTier(entry.tier);
      setShowAccessModal(false);
      setAccessError("");
    } else {
      setAccessError("Invalid access code. Please check your payment confirmation email.");
    }
  }

  /* ── Download logic ── */
  function handleDownload(type) {
    if (!accessTier) { setShowAccessModal(true); return; }

    const tierOrder = { diagnosis:0, fix:1, lab:2, fullstack:3, admin:99 };
    const typeOrder = { analysis:0, fixing:1, growth:2, marketing:3 };

    if (accessTier !== "admin") {
      const allowedByTier = {
        diagnosis: ["analysis"],
        fix:       ["analysis","fixing"],
        lab:       ["analysis","fixing","growth"],
        fullstack: ["analysis","fixing","growth","marketing"],
      };
      if (!allowedByTier[accessTier]?.includes(type)) {
        alert(`Your current package (${accessTier}) doesn't include the ${type} plan. Upgrade to unlock.`);
        return;
      }
    }

    const domain = url.replace(/https?:\/\//, "").split("/")[0];
    if (type === "analysis") {
      const content = generateReport(url, findings, plans, techResults, accessTier === "admin" ? "fullstack" : accessTier);
      downloadHTML(content, `BCL-Analysis-${domain}.html`);
    } else if (type === "fixing") {
      const content = generateReport(url, findings, { fixingPlan: plans.fixingPlan }, techResults, "fix");
      downloadHTML(content, `BCL-FixingPlan-${domain}.html`);
    } else if (type === "growth") {
      const content = generateReport(url, [], { growthPlan: plans.growthPlan }, techResults, "lab");
      downloadHTML(content, `BCL-GrowthPlan-${domain}.html`);
    } else if (type === "marketing") {
      const content = generateReport(url, [], { marketingPlan: plans.marketingPlan }, techResults, "fullstack");
      downloadHTML(content, `BCL-MarketingPlan-${domain}.html`);
    }
  }

  /* ── PSI helpers ── */
  function fetchPSI(storeUrl, strategy) {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(storeUrl)}&strategy=${strategy}&category=performance&category=seo&category=best-practices&category=accessibility&key=${PSI_KEY}`;
    return fetch(apiUrl, { signal: AbortSignal.timeout(40000) })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
  }

  function buildReport(desktop, mobile, storeUrl) {
    const lh  = mobile?.lighthouseResult;
    const lhD = desktop?.lighthouseResult;
    const pct = v => v != null ? Math.max(0, Math.min(100, Math.round(v * 100))) : null;
    const clamp = v => Math.max(0, Math.min(100, Math.round(v || 0)));

    const rawMPerf = pct(lh?.categories?.performance?.score);
    const rawDPerf = pct(lhD?.categories?.performance?.score);
    const rawSeo   = pct(lh?.categories?.seo?.score);

    const lcp = parseFloat(lh?.audits?.["largest-contentful-paint"]?.numericValue || 4500);
    const cls = parseFloat(lh?.audits?.["cumulative-layout-shift"]?.numericValue  || 0.25);
    const tbt = parseFloat(lh?.audits?.["total-blocking-time"]?.numericValue      || 400);

    const mobileScore = clamp((rawMPerf ?? 50) - 15);
    let vitRaw = 100;
    if (lcp > 4000) vitRaw -= 40; else if (lcp > 2500) vitRaw -= 25; else if (lcp > 1800) vitRaw -= 12;
    if (cls > 0.25) vitRaw -= 35; else if (cls > 0.1) vitRaw -= 20;  else if (cls > 0.05) vitRaw -= 8;
    if (tbt > 600)  vitRaw -= 30; else if (tbt > 300) vitRaw -= 18;  else if (tbt > 200)  vitRaw -= 8;
    const vitScore   = clamp(vitRaw - 10);
    const speedScore = clamp(((rawMPerf ?? 45) * 0.55 + (rawDPerf ?? 55) * 0.45) - 14);
    const seoScore   = clamp((rawSeo ?? 45) - 10);
    const imgScore   = clamp(75 - (lh?.audits?.["uses-optimized-images"]?.score===0?28:0) - (lh?.audits?.["uses-webp-images"]?.score===0?22:0));
    const sslScore   = lh?.audits?.["is-on-https"]?.score === 1 ? 82 : 12;
    const checkoutScore = clamp(55 - (cls > 0.1 ? 20 : 0) - (tbt > 300 ? 20 : 0));
    const convScore  = clamp(mobileScore * 0.4 + vitScore * 0.3 + seoScore * 0.3);

    const scores = { mobile:mobileScore, vitals:vitScore, speed:speedScore, seo:seoScore, images:imgScore, ssl:sslScore, checkout:checkoutScore, conversion:convScore };
    const overall = clamp(CHECKS.reduce((acc, c) => acc + (scores[c.id] || 0) * c.weight, 0));

    const isCritical = overall < 50 || mobileScore < 50 || vitScore < 40;
    const leak = overall < 40 ? "40-60% of potential revenue" : overall < 60 ? "20-40% of potential revenue" : overall < 75 ? "10-20% of potential revenue" : "Under 10%";

    const verdicts = {
      F: "Your store is critically broken. Buyers are landing and leaving before they even see your product properly. Every ad dollar you spend is being poured into a leaking bucket.",
      D: "Significant revenue leaks detected across multiple areas. Your store is functional but underperforming in ways that compound monthly.",
      C: "Your store has a foundation but several high-impact issues are suppressing conversion. These are fixable — but every week they're unfixed costs you real money.",
      B: "Decent baseline with specific areas that need attention. Small improvements here will have disproportionate revenue impact.",
    };

    const oGrade = overall >= 80 ? "B" : overall >= 65 ? "C" : overall >= 45 ? "D" : "F";

    const topPriorities = [];
    if (mobileScore < 60) topPriorities.push("Fix mobile page speed — your mobile experience is actively repelling buyers");
    if (vitScore < 50)    topPriorities.push("Resolve Core Web Vitals failures — layout shifts and blocking time are killing your conversion rate");
    if (seoScore < 55)    topPriorities.push("Fix critical SEO issues — you're partially invisible to search engines");
    if (imgScore < 50)    topPriorities.push("Optimize all images — uncompressed images are the single fastest performance fix");
    if (sslScore < 50)    topPriorities.push("Fix HTTPS/SSL immediately — browsers are warning visitors your site is insecure");
    if (topPriorities.length < 3) topPriorities.push("Run a full conversion rate audit across your product pages and checkout");

    const disqualMessages = {
      F: "We need to be honest with you — running paid traffic to this store right now would accelerate your losses, not fix them. The foundation needs to be rebuilt before ads will work. Our Store Diagnosis will show you exactly what to fix first.",
      D: "Your store can be profitable, but not without fixing these leaks first. The good news: most of these issues are solvable within 2-4 weeks. Our Conversion Fix package handles the highest-impact ones for you.",
      C: "You're closer than most store owners we audit. The issues here are specific and fixable. A targeted conversion fix on your top 3 problems will have measurable impact within 30 days.",
      B: "Solid foundation. The opportunities here are in optimization and scaling, not repair. You're ready for a growth system — this is where compounding starts.",
    };

    return {
      overall, isCritical, leak,
      verdict: verdicts[oGrade],
      disqualMsg: disqualMessages[oGrade],
      mobileSubOptimal: mobileScore < 85,
      domain: storeUrl.replace(/https?:\/\//, "").split("/")[0],
      checks: Object.fromEntries(CHECKS.map(c => [c.id, {
        score: scores[c.id],
        grade: scores[c.id] >= 80 ? "B" : scores[c.id] >= 65 ? "C" : scores[c.id] >= 45 ? "D" : "F",
        label: scores[c.id] >= 80 ? "Acceptable" : scores[c.id] >= 65 ? "Sub-Optimal" : scores[c.id] >= 45 ? "Leaking Revenue" : "Critical Failure",
        color: scores[c.id] >= 75 ? "#00ff88" : scores[c.id] >= 50 ? "#FF9900" : "#FF3B3B",
        critical: c.critical && scores[c.id] < 60,
      }])),
      raw: { mPerf: rawMPerf, dPerf: rawDPerf },
      topPriorities: topPriorities.slice(0, 3),
    };
  }

  /* ── Progress through diagnostic ── */
  const allQuestions = DIAGNOSTIC.flatMap(c => c.questions);
  const currentQuestion = allQuestions[diagStep];
  const currentCategory = DIAGNOSTIC.find(c => c.questions.includes(currentQuestion));
  const diagProgress = Math.round((diagStep / allQuestions.length) * 100);

  /* ─────────────────────────────────
     RENDER
  ───────────────────────────────── */
  return (
    <PageWrapper>

      {/* ── ACCESS CODE MODAL ── */}
      {showAccessModal && (
        <div onClick={() => setShowAccessModal(false)} style={{ position:"fixed", inset:0, zIndex:99000, background:"rgba(0,0,0,.7)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background:dark?"rgba(4,6,8,.97)":"rgba(255,248,225,.98)", border:dark?".5px solid rgba(255,255,255,.12)":".5px solid rgba(26,20,8,.18)", borderTop:".5px solid rgba(0,255,136,.4)", borderRadius:24, padding:"2rem", width:"100%", maxWidth:420, position:"relative" }}>
            <button onClick={() => setShowAccessModal(false)} style={{ position:"absolute", top:14, right:16, background:"transparent", border:"none", cursor:"pointer", fontSize:20, color:mutedText3 }}>×</button>

            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1.2rem" }}>
              <span style={{ fontSize:20 }}>🔐</span>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:headingColor, margin:0 }}>Unlock Downloads</h3>
            </div>

            <p style={{ fontSize:13, color:mutedText, lineHeight:1.7, marginBottom:"1.2rem" }}>
              Enter your payment access code to download your reports. Your code was sent in your payment confirmation email.
            </p>

            <input
              type="text"
              placeholder="Access code (e.g. BCL-X7K2P9)"
              value={accessCode}
              onChange={e => setAccessCode(e.target.value.toUpperCase())}
              style={{ width:"100%", background:inputBg, border:`.5px solid ${inputBorder}`, borderRadius:10, padding:".8rem 1rem", color:headingColor, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box", marginBottom:8, letterSpacing:".08em" }}
              onFocus={e => e.target.style.borderColor="rgba(0,255,136,.5)"}
              onBlur={e => e.target.style.borderColor=inputBorder}
              onKeyDown={e => e.key === "Enter" && verifyAccess()}
            />

            {accessError && <p style={{ fontSize:12, color:"#FF6B6B", marginBottom:8 }}>{accessError}</p>}

            <button onClick={verifyAccess} className="btn-g" style={{ width:"100%", fontFamily:"inherit", cursor:"pointer", marginBottom:"1rem" }}>
              Unlock my reports →
            </button>

            <p style={{ fontSize:12, color:mutedText3, textAlign:"center" }}>
              Don't have a code?{" "}
              <a href={"https://wa.me/19454076473?text=" + encodeURIComponent("Hi, I need my audit access code. I paid for the [package name].")} target="_blank" rel="noopener noreferrer" style={{ color:G, textDecoration:"none", fontWeight:600 }}>
                Message us on WhatsApp
              </a>
            </p>
          </div>
        </div>
      )}

      {/* ── HERO / INPUT ── */}
      {!showDiag && !findings && (
        <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"clamp(5rem,10vw,7rem) clamp(1rem,4vw,2rem) 4rem", overflow:"hidden" }}>
          <div style={{ position:"absolute", width:"min(600px,100%)", height:"min(600px,100vw)", top:-150, left:"50%", transform:"translateX(-50%)", background:"radial-gradient(circle at 40% 40%,rgba(0,255,136,.15),transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>

          <div style={{ maxWidth:640, width:"100%", textAlign:"center", position:"relative", zIndex:1 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:dark?"rgba(0,255,136,.1)":"#1A1408", border:dark?".5px solid rgba(0,255,136,.28)":"none", borderRadius:100, padding:"6px 16px", fontSize:11, color:dark?G:"#FFEFC2", fontWeight:600, letterSpacing:".05em", marginBottom:"1.6rem" }}>
              <span style={{ width:6, height:6, background:G, borderRadius:"50%", animation:"pulse 2s ease-in-out infinite" }}/> Free store diagnostic
            </span>

            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(2rem,6vw,3.5rem)", fontWeight:800, lineHeight:1.08, letterSpacing:"-.03em", color:headingColor, marginBottom:"1rem" }}>
              Find every leak in<br /><GradText>your store — free.</GradText>
            </h1>

            <p style={{ fontSize:"clamp(0.9rem,2vw,1.05rem)", color:mutedText, lineHeight:1.8, maxWidth:500, margin:"0 auto 2.5rem" }}>
              25-question deep diagnostic + live technical scan. We check 8 technical factors and 25 conversion elements. Nothing gets ignored. Not even the small things.
            </p>

            {/* What we check */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"0.6rem", marginBottom:"2.5rem", textAlign:"left" }}>
              {["Mobile speed & Core Web Vitals","Checkout friction points","Product page conversion elements","Ad account & ROAS health","Email & retention setup","Trust signals & social proof","SEO visibility","Image optimization"].map((item, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, background:dark?"rgba(255,255,255,.04)":"rgba(255,255,255,.4)", border:`.5px solid ${cardBorder}`, borderRadius:8, padding:".5rem .75rem" }}>
                  <span style={{ color:G, fontSize:12, fontWeight:800 }}>✓</span>
                  <span style={{ fontSize:12, color:mutedText2 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Input form */}
            <div style={{ background:cardBg, border:`.5px solid ${cardBorder}`, borderTop:dark?".5px solid rgba(255,255,255,.2)":".5px solid rgba(255,255,255,.6)", borderRadius:20, padding:"1.8rem", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.4),transparent)", pointerEvents:"none" }}/>

              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:"1rem" }}>
                <input
                  type="url"
                  placeholder="Your store URL (e.g. mystore.com)"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  style={{ width:"100%", background:inputBg, border:`.5px solid ${inputBorder}`, borderRadius:10, padding:".8rem 1.1rem", color:headingColor, fontSize:15, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                  onFocus={e => e.target.style.borderColor="rgba(0,255,136,.5)"}
                  onBlur={e => e.target.style.borderColor=inputBorder}
                  onKeyDown={e => e.key==="Enter" && handleScan()}
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width:"100%", background:inputBg, border:`.5px solid ${inputBorder}`, borderRadius:10, padding:".8rem 1.1rem", color:headingColor, fontSize:15, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}
                  onFocus={e => e.target.style.borderColor="rgba(0,255,136,.5)"}
                  onBlur={e => e.target.style.borderColor=inputBorder}
                />
              </div>

              {error && <p style={{ fontSize:13, color:"#FF6B6B", marginBottom:"1rem", padding:".75rem", background:"rgba(255,107,107,.08)", border:".5px solid rgba(255,107,107,.25)", borderRadius:8 }}>{error}</p>}

              <button onClick={handleScan} disabled={loading} className="btn-g" style={{ width:"100%", fontFamily:"inherit", cursor:"pointer" }}>
                Run my free diagnostic →
              </button>

              <p style={{ fontSize:11, color:mutedText3, textAlign:"center", marginTop:".75rem" }}>
                Takes 3-5 minutes. 25 questions + live technical scan. No credit card.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── LOADING ── */}
      {loading && (
        <section style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"4rem 2rem" }}>
          <div style={{ maxWidth:520, width:"100%", textAlign:"center" }}>
            <div style={{ width:56, height:56, position:"relative", margin:"0 auto 1.5rem" }}>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid rgba(0,255,136,.3)", borderTopColor:G, animation:"auditSpin .8s linear infinite" }}/>
              <div style={{ position:"absolute", inset:8, borderRadius:"50%", border:"1px solid rgba(0,255,136,.2)", borderBottomColor:G, animation:"auditSpin 1.2s linear infinite reverse" }}/>
            </div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:headingColor, marginBottom:".4rem" }}>{SCAN_STAGES[stageIdx]?.msg}</h3>
            <p style={{ fontSize:13, color:mutedText3, marginBottom:"2rem" }}>{SCAN_STAGES[stageIdx]?.sub}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {CHECKS.map((c, i) => (
                <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:13, flexShrink:0 }}>{c.icon}</span>
                  <div style={{ flex:1, height:3, background:trackBg, borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", background:i<=stageIdx?GG:"transparent", borderRadius:3, width:i<=stageIdx?"100%":"0%", transition:"width 1s ease" }}/>
                  </div>
                  <span style={{ fontSize:11, color:i<=stageIdx?G:mutedText3, minWidth:130, textAlign:"right", fontWeight:i<=stageIdx?600:400 }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DIAGNOSTIC QUESTIONNAIRE ── */}
      {showDiag && !findings && (
        <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"4rem 2rem" }}>
          <div style={{ maxWidth:620, width:"100%" }}>

            {/* Progress */}
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:12, color:mutedText3 }}>Question {diagStep + 1} of {allQuestions.length}</span>
              <span style={{ fontSize:12, color:mutedText3 }}>{diagProgress}% complete</span>
            </div>
            <div style={{ height:3, background:trackBg, borderRadius:3, overflow:"hidden", marginBottom:"1.5rem" }}>
              <div style={{ height:"100%", background:GG, width:`${diagProgress}%`, transition:"width .4s ease", borderRadius:3 }}/>
            </div>

            {/* Category label */}
            <p style={{ fontSize:11, color:G, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", marginBottom:".75rem" }}>{currentCategory?.category}</p>

            {/* Question */}
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.1rem,3vw,1.4rem)", fontWeight:800, color:headingColor, lineHeight:1.3, marginBottom:"1.5rem" }}>
              {currentQuestion?.text}
            </h2>

            {/* Options */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {currentQuestion?.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => answerQuestion(currentQuestion.id, opt)}
                  style={{ width:"100%", textAlign:"left", background:dark?"rgba(255,255,255,.04)":"rgba(255,255,255,.45)", border:`.5px solid ${cardBorder}`, borderRadius:12, padding:"1rem 1.2rem", color:headingColor, fontSize:14, cursor:"pointer", fontFamily:"inherit", transition:"all .2s", display:"flex", alignItems:"center", gap:12 }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(0,255,136,.1)"; e.currentTarget.style.borderColor="rgba(0,255,136,.5)"; e.currentTarget.style.transform="translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=dark?"rgba(255,255,255,.04)":"rgba(255,255,255,.45)"; e.currentTarget.style.borderColor=cardBorder; e.currentTarget.style.transform="none"; }}>
                  <span style={{ width:22, height:22, borderRadius:"50%", background:"rgba(0,255,136,.1)", border:".5px solid rgba(0,255,136,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:G, flexShrink:0 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            {/* Back button */}
            {diagStep > 0 && (
              <button
                onClick={() => setDiagStep(diagStep - 1)}
                style={{ marginTop:"1rem", background:"transparent", border:"none", color:mutedText3, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                ← Back
              </button>
            )}
          </div>
        </section>
      )}

      {/* ── FULL RESULTS ── */}
      {findings && !showDiag && (
        <div style={{ maxWidth:980, margin:"0 auto", padding:"clamp(2rem,5vw,4rem) clamp(1rem,4vw,2rem) 6rem", opacity:revealed?1:0, transition:"opacity .6s ease" }}>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.8rem,5vw,2.8rem)", fontWeight:800, color:headingColor, marginBottom:".5rem" }}>
              Your Store Diagnostic Report
            </h1>
            <p style={{ fontSize:14, color:mutedText2 }}>🌐 {url} — {new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}</p>
          </div>

          {/* Technical score summary */}
          {techResults && (
            <div style={{ background:cardBg, border:`.5px solid ${techResults.isCritical?"rgba(255,59,59,.3)":cardBorder}`, borderRadius:20, padding:"1.8rem", marginBottom:"1.5rem", display:"flex", gap:"2rem", alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ position:"relative", flexShrink:0 }}>
                <Ring score={techResults.overall} size={90} color={techResults.isCritical?"#FF3B3B":techResults.overall>70?G:"#FF9900"}/>
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.4rem", fontWeight:800, color:techResults.isCritical?"#FF3B3B":techResults.overall>70?G:"#FF9900" }}>{techResults.overall}</span>
                  <span style={{ fontSize:9, color:mutedText3 }}>/ 100</span>
                </div>
              </div>
              <div style={{ flex:1, minWidth:200 }}>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:headingColor, marginBottom:".3rem" }}>Technical Score — {techResults.domain}</h2>
                <p style={{ fontSize:13, color:mutedText, lineHeight:1.7, marginBottom:".75rem" }}>{techResults.verdict}</p>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <span style={{ background:"rgba(255,59,59,.1)", border:".5px solid rgba(255,59,59,.25)", borderRadius:8, padding:"3px 10px", fontSize:12, color:"#FF6B6B", fontWeight:700 }}>Revenue leak: {techResults.leak}</span>
                  <span style={{ background:dark?"rgba(255,255,255,.05)":"rgba(255,255,255,.4)", border:`.5px solid ${cardBorder}`, borderRadius:8, padding:"3px 10px", fontSize:12, color:mutedText2 }}>Mobile: {techResults.raw?.mPerf ?? "—"}/100</span>
                </div>
              </div>
              {/* Tech check mini grid */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, width:"100%" }}>
                {CHECKS.map(c => {
                  const chk = techResults.checks?.[c.id];
                  if (!chk) return null;
                  return (
                    <div key={c.id} style={{ background:dark?"rgba(255,255,255,.03)":"rgba(255,255,255,.35)", border:`.5px solid ${chk.critical?"rgba(255,59,59,.3)":cardBorder}`, borderRadius:10, padding:".75rem", textAlign:"center" }}>
                      <span style={{ fontSize:16 }}>{c.icon}</span>
                      <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:800, color:chk.color, margin:"4px 0 2px" }}>{chk.grade}</p>
                      <p style={{ fontSize:9, color:mutedText3, lineHeight:1.3 }}>{c.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Findings summary bar */}
          <div style={{ display:"flex", gap:10, marginBottom:"1.5rem", flexWrap:"wrap" }}>
            {["critical","high","medium"].map(sev => {
              const count = findings.filter(f => f.severity === sev).length;
              if (!count) return null;
              return (
                <div key={sev} style={{ background:`${sevColor(sev)}18`, border:`.5px solid ${sevColor(sev)}44`, borderRadius:10, padding:".6rem 1rem", display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:sevColor(sev) }}>{count}</span>
                  <span style={{ fontSize:12, color:mutedText2, textTransform:"capitalize" }}>{sev} issues</span>
                </div>
              );
            })}
            <div style={{ background:dark?"rgba(255,255,255,.04)":"rgba(255,255,255,.4)", border:`.5px solid ${cardBorder}`, borderRadius:10, padding:".6rem 1rem", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, color:G }}>{findings.length}</span>
              <span style={{ fontSize:12, color:mutedText2 }}>total findings</span>
            </div>
          </div>

          {/* All findings */}
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem", marginBottom:"2rem" }}>
            {findings.map((f, i) => (
              <div key={i} style={{ background:cardBg, border:`.5px solid ${cardBorder}`, borderLeft:`3px solid ${sevColor(f.severity)}`, borderRadius:"0 14px 14px 0", padding:"1.2rem 1.5rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:".5rem", flexWrap:"wrap" }}>
                  <span style={{ background:`${sevColor(f.severity)}22`, border:`.5px solid ${sevColor(f.severity)}55`, borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700, color:sevColor(f.severity), textTransform:"uppercase" }}>{f.severity}</span>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:800, color:headingColor, margin:0 }}>{findingTitle(f.id)}</h3>
                </div>
                <p style={{ fontSize:13, color:mutedText, lineHeight:1.75, marginBottom:".75rem" }}>{f.finding}</p>
                <div style={{ background:dark?"rgba(0,255,136,.04)":"rgba(0,255,136,.06)", border:".5px solid rgba(0,255,136,.18)", borderRadius:8, padding:".75rem 1rem" }}>
                  <span style={{ fontSize:11, color:G, fontWeight:700, textTransform:"uppercase", letterSpacing:".05em" }}>Fix → </span>
                  <span style={{ fontSize:13, color:mutedText, lineHeight:1.7 }}>{f.fix}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Access tier indicator */}
          {accessTier && (
            <div style={{ background:"rgba(0,255,136,.06)", border:".5px solid rgba(0,255,136,.25)", borderRadius:12, padding:".9rem 1.2rem", marginBottom:"1.5rem", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:16 }}>🔓</span>
              <span style={{ fontSize:13, color:G, fontWeight:600 }}>
                {accessTier === "admin" ? "Admin access — all downloads unlocked" : `${ACCESS_CODES[accessCode.toUpperCase()]?.client || "Client"} — ${accessTier} package unlocked`}
              </span>
            </div>
          )}

          {/* Download section */}
          <div style={{ background:cardBg, border:`.5px solid ${cardBorder}`, borderRadius:20, padding:"1.8rem", marginBottom:"2rem" }}>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.1rem", fontWeight:800, color:headingColor, marginBottom:".4rem" }}>Download Your Reports</h3>
            <p style={{ fontSize:13, color:mutedText2, marginBottom:"1.2rem", lineHeight:1.6 }}>
              Analysis report is available to all users. Fixing, Growth, and Marketing plans are unlocked based on your package.
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"0.75rem" }} className="stat-grid">
              {[
                { type:"analysis",   label:"📊 Analysis Report",    desc:"Full diagnostic findings",         always:true },
                { type:"fixing",     label:"🔧 Fixing Plan",         desc:"Step-by-step remediation plan",   tier:["fix","lab","fullstack","admin"] },
                { type:"growth",     label:"📈 Growth Plan",          desc:"Traffic & conversion strategy",   tier:["lab","fullstack","admin"] },
                { type:"marketing",  label:"📣 Marketing Plan",      desc:"Ad, email & brand strategy",      tier:["fullstack","admin"] },
              ].map((d, i) => {
                const unlocked = d.always || (accessTier && (d.tier?.includes(accessTier)));
                return (
                  <div key={i} style={{ background:unlocked?dark?"rgba(0,255,136,.06)":"rgba(0,255,136,.08)":dark?"rgba(255,255,255,.02)":"rgba(26,20,8,.03)", border:unlocked?".5px solid rgba(0,255,136,.25)":`.5px solid ${cardBorder}`, borderRadius:12, padding:"1rem" }}>
                    <p style={{ fontSize:13, fontWeight:700, color:unlocked?headingColor:mutedText3, marginBottom:3 }}>{d.label}</p>
                    <p style={{ fontSize:11, color:mutedText3, marginBottom:".75rem" }}>{d.desc}</p>
                    <button
                      onClick={() => handleDownload(d.type)}
                      style={{ width:"100%", background:unlocked?GG:"transparent", color:unlocked?"#040608":mutedText3, border:unlocked?"none":`.5px solid ${cardBorder}`, borderRadius:8, padding:".55rem", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                      {unlocked ? "⬇ Download" : "🔒 Unlock"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teaser of fixing plan (blurred for non-subscribers) */}
          <div style={{ position:"relative", marginBottom:"2rem" }}>
            <div style={{ background:cardBg, border:`.5px solid ${cardBorder}`, borderRadius:20, padding:"1.8rem", filter:accessTier ? "none" : "blur(4px)", pointerEvents:accessTier?"auto":"none", userSelect:accessTier?"auto":"none" }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.1rem", fontWeight:800, color:headingColor, marginBottom:"1rem" }}>🔧 Your Fixing Plan — Phase 1</h3>
              {plans?.fixingPlan?.[0]?.actions?.slice(0, 2).map((action, i) => (
                <div key={i} style={{ background:dark?"rgba(255,255,255,.03)":"rgba(255,255,255,.35)", border:`.5px solid ${cardBorder}`, borderRadius:10, padding:"1rem", marginBottom:".75rem" }}>
                  <p style={{ fontSize:13, fontWeight:700, color:headingColor, marginBottom:4 }}>→ {action.title}</p>
                  <p style={{ fontSize:12, color:mutedText, lineHeight:1.7 }}>{action.action}</p>
                </div>
              ))}
              <p style={{ fontSize:12, color:mutedText3, textAlign:"center", marginTop:"1rem" }}>+ {(plans?.fixingPlan?.[0]?.actions?.length || 0) + (plans?.fixingPlan?.[1]?.actions?.length || 0) + (plans?.fixingPlan?.[2]?.actions?.length || 0) - 2} more actions across 3 phases...</p>
            </div>
            {!accessTier && (
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
                <span style={{ fontSize:28 }}>🔒</span>
                <p style={{ fontSize:14, fontWeight:700, color:headingColor, textAlign:"center" }}>Unlock your Fixing Plan</p>
                <button onClick={() => setShowAccessModal(true)} className="btn-g" style={{ fontFamily:"inherit", cursor:"pointer" }}>Enter access code →</button>
              </div>
            )}
          </div>

          {/* CTA */}
          <div style={{ background:"linear-gradient(135deg,rgba(0,255,136,.08),rgba(0,204,106,.03))", border:".5px solid rgba(0,255,136,.25)", borderTop:".5px solid rgba(0,255,136,.45)", borderRadius:24, padding:"clamp(2rem,5vw,3rem)", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,rgba(0,255,136,.5),transparent)", pointerEvents:"none" }}/>
            <p style={{ fontSize:10, color:G, letterSpacing:".14em", textTransform:"uppercase", marginBottom:".6rem", fontWeight:700 }}>Ready to fix all of this?</p>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.3rem,4vw,2rem)", fontWeight:800, color:headingColor, marginBottom:".6rem", lineHeight:1.15 }}>
              This is the surface.<br /><GradText>Our paid audit goes 10× deeper.</GradText>
            </h3>
            <p style={{ fontSize:14, color:mutedText, maxWidth:460, margin:"0 auto 1.5rem", lineHeight:1.75 }}>
              We don't just identify problems — we fix them. Landing pages, checkout, ad structure, email flows. One compounding system.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <a href={"https://wa.me/19454076473?text=" + encodeURIComponent(`Hi Bode Conversion Lab 👋 I just ran my store audit for ${url} and I'm ready to fix these issues. Can we talk about the right package?`)} target="_blank" rel="noopener noreferrer" className="btn-g" style={{ display:"inline-block", textDecoration:"none" }}>
                Apply for professional audit →
              </a>
              <button onClick={() => { setFindings(null); setTechResults(null); setUrl(""); setEmail(""); setRevealed(false); setDiagAnswers({}); setDiagStep(0); }} className="btn-ghost" style={{ fontFamily:"inherit", cursor:"pointer" }}>
                Scan another store
              </button>
            </div>
          </div>

        </div>
      )}
    </PageWrapper>
  );
}