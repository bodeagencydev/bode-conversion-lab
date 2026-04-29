export const G = "#00ff88";
export const GG = "linear-gradient(135deg,#00ff88,#00cc6a)";

export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "Pricing", path: "/pricing" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

export const TESTIMONIALS = [
  { init: "MT", name: "Marcus T.", role: "Shopify Store Owner", result: "$1.2k → $38k/mo", text: "I'd been running ads for 2 years with nothing to show for it. Three months in, my ROAS went from 0.8x to 6.2x. The store rebuild alone doubled my conversion rate." },
  { init: "PS", name: "Priya S.", role: "DTC Brand Founder", result: "1.1% → 4.8% CVR", text: "They found 11 things wrong with my checkout in the first audit. I had no idea I was losing that many customers. Best investment I've made in the business." },
  { init: "JO", name: "James O.", role: "E-commerce Entrepreneur", result: "ROAS 0.6x → 5.4x", text: "Went from burning money on ads to finally being profitable in week 6. The system they built just keeps compounding. I wish I found them sooner." },
  { init: "AL", name: "Aisha L.", role: "Beauty Brand Owner", result: "$800 → $22k/mo", text: "Within 45 days they rebuilt my product page, rewrote my ad copy and my cost per purchase dropped by 60%. Insane results for a small brand." },
  { init: "RK", name: "Ryan K.", role: "Fitness Supplements", result: "CPA $42 → $11", text: "The audit alone was worth 10x the price. They identified a checkout friction point killing 40% of my sales. Fixed in a week, results were immediate." },
  { init: "TN", name: "Tunde N.", role: "Fashion E-commerce", result: "$3k → $41k/mo", text: "We were spending $5k/mo on ads and getting almost nothing back. Bode found the issue in 3 days. Now every dollar we spend returns four." },
];

export const CASE_STUDIES = [
  {
    id: "marcus-fitness",
    client: "Marcus T.",
    category: "Fitness & Supplements",
    headline: "From $1,200/mo to $38,000/mo in 90 days",
    summary: "A Shopify fitness brand with great products but a broken funnel. We rebuilt the entire system from scratch.",
    result1: { label: "Revenue", before: "$1,200/mo", after: "$38,000/mo" },
    result2: { label: "ROAS", before: "0.8x", after: "6.2x" },
    result3: { label: "CVR", before: "0.6%", after: "3.8%" },
    color: "#00ff88",
    tags: ["Shopify", "Meta Ads", "CRO"],
    story: [
      { heading: "The problem", body: "Marcus had a great product but was spending $3,000/month on Meta ads and generating less than $1,200 in revenue. His ROAS of 0.8x meant every dollar he spent on ads cost him money." },
      { heading: "The diagnosis", body: "Within 48 hours of our audit, we found the core issue: his product page loaded in 7.2 seconds on mobile, his checkout had 6 unnecessary steps, and his ad creative was targeting the wrong audience entirely." },
      { heading: "What we built", body: "We rebuilt his product page cutting load time to 1.4 seconds, reduced checkout to 2 steps, rewrote ad copy to speak to serious athletes, and restructured his Meta campaigns with proper audience segmentation." },
      { heading: "The result", body: "Month 1: ROAS went from 0.8x to 2.4x. Month 2: 4.1x. Month 3: 6.2x with revenue at $38,000/month. Same ad budget. Same product. Different system." },
    ],
  },
  {
    id: "priya-beauty",
    client: "Priya S.",
    category: "Beauty & Skincare",
    headline: "Checkout friction was killing 40% of sales",
    summary: "A DTC beauty brand with strong traffic but terrible conversion. One audit changed everything.",
    result1: { label: "CVR", before: "1.1%", after: "4.8%" },
    result2: { label: "CPA", before: "$68", after: "$19" },
    result3: { label: "Revenue", before: "$4k/mo", after: "$22k/mo" },
    color: "#00ff88",
    tags: ["WooCommerce", "Google Ads", "Email"],
    story: [
      { heading: "The problem", body: "Priya's skincare brand was getting 15,000 monthly visitors but converting at just 1.1%. She was spending $4,000/month on ads and making $4,000 back — breaking even at best." },
      { heading: "The diagnosis", body: "Our audit revealed 11 distinct friction points. Her checkout required account creation before purchase, killing 38% of buyers at that step alone." },
      { heading: "What we built", body: "We enabled guest checkout, redesigned product pages, moved the CTA above the fold, rewrote product descriptions with benefit-first copy, and built a post-purchase email sequence." },
      { heading: "The result", body: "Conversion rate jumped from 1.1% to 4.8% in 30 days without changing a single ad. Revenue went from $4k to $22k/month." },
    ],
  },
  {
    id: "tunde-fashion",
    client: "Tunde N.",
    category: "Fashion & Apparel",
    headline: "Every dollar spent on ads now returns four",
    summary: "A fashion brand burning $5k/month on ads with almost no return. We found the leak in 3 days.",
    result1: { label: "ROAS", before: "0.9x", after: "4.3x" },
    result2: { label: "Revenue", before: "$3k/mo", after: "$41k/mo" },
    result3: { label: "Ad Spend", before: "$5k/mo", after: "$5k/mo" },
    color: "#00ff88",
    tags: ["Shopify", "TikTok Ads", "Meta Ads"],
    story: [
      { heading: "The problem", body: "Tunde's fashion brand had everything going for it but his paid ads were hemorrhaging money. $5,000/month in, barely $3,000 out." },
      { heading: "The diagnosis", body: "His TikTok ads were elegant and aspirational — perfect for Instagram, completely wrong for TikTok's raw culture. His Meta retargeting was targeting homepage visitors instead of product page visitors." },
      { heading: "What we built", body: "We created a new TikTok creative strategy with raw behind-the-scenes content, rebuilt Meta retargeting, and created dedicated landing pages for his top 5 products." },
      { heading: "The result", body: "Same $5,000 ad budget. ROAS went from 0.9x to 4.3x. Revenue grew from $3k to $41k/month over 4 months." },
    ],
  },
];

export const BLOG_POSTS = [
  {
    id: "why-your-roas-is-lying",
    title: "Why Your ROAS Is Lying to You (And What to Track Instead)",
    category: "Ad Strategy",
    date: "April 15, 2025",
    readTime: "6 min read",
    excerpt: "Most store owners obsess over ROAS. But ROAS alone is one of the most misleading metrics in e-commerce. Here's what actually tells you if your ads are working.",
    content: [
      { heading: "The ROAS trap", body: "A 4x ROAS sounds great. But what if your product costs $30 to make, sells for $80, and your ads cost $20 per sale? You're barely breaking even. ROAS doesn't tell you any of that." },
      { heading: "What to track instead", body: "MER (Marketing Efficiency Ratio): Total revenue divided by total ad spend. nCAC (New Customer Acquisition Cost): What it costs to acquire a brand new customer. LTV:CAC ratio: If your LTV is $200 and your CAC is $50, you have a healthy 4:1 ratio." },
      { heading: "The bottom line", body: "ROAS is a useful signal, not a business metric. Stores that scale past $100k/month obsess over contribution margin, LTV, and MER — not ROAS." },
    ],
  },
  {
    id: "5-checkout-fixes",
    title: "5 Checkout Fixes That Doubled Our Clients' Conversion Rates",
    category: "CRO",
    date: "March 28, 2025",
    readTime: "8 min read",
    excerpt: "After auditing 40+ e-commerce stores, we found the same 5 checkout problems killing conversion rates. Here's exactly how to fix each one.",
    content: [
      { heading: "Fix 1: Kill forced account creation", body: "Requiring account creation before checkout kills an average of 35% of buyers. Enable guest checkout immediately." },
      { heading: "Fix 2: Move your CTA above the fold", body: "On mobile, 60% of product pages have their Add to Cart button below the fold. Your price, main benefit, and CTA should all be visible without scrolling." },
      { heading: "Fix 3: Fix your mobile speed", body: "If your product page loads in over 3 seconds on mobile, you're losing 40% of visitors. This single fix has 2x'd conversion rates for our clients." },
    ],
  },
  {
    id: "tiktok-vs-meta-2025",
    title: "TikTok vs Meta Ads in 2025: Where Should Your Budget Go?",
    category: "Ad Strategy",
    date: "March 10, 2025",
    readTime: "7 min read",
    excerpt: "The answer isn't one or the other. It's about understanding what each platform does well and building a strategy that uses both at the right time.",
    content: [
      { heading: "Meta: Still the conversion king", body: "Meta's advantage is its purchase intent data. For retargeting and scaling proven winners, Meta is still unmatched. If you're spending under $5k/month on ads, start here." },
      { heading: "TikTok: The discovery engine", body: "TikTok's algorithm is terrifyingly good at finding your audience. It's the best platform for top-of-funnel awareness. The catch: polished ads die on TikTok. Raw, authentic content wins." },
      { heading: "Our recommendation", body: "For most brands: 70% Meta, 30% TikTok. Use TikTok to find new audiences, use Meta to convert them." },
    ],
  },
  {
    id: "email-flows-that-print-money",
    title: "The 3 Email Flows Every E-commerce Store Needs",
    category: "Email Marketing",
    date: "February 22, 2025",
    readTime: "9 min read",
    excerpt: "Email generates $42 for every $1 spent. But only if you have the right flows. Most stores are leaving 30% of their revenue on the table.",
    content: [
      { heading: "Flow 1: Abandoned Cart", body: "60-70% of shoppers abandon their cart. A 3-email sequence can recover 15-20% of them. This sequence alone adds an average of $8,000/month for our clients." },
      { heading: "Flow 2: Post-Purchase", body: "Your happiest customer just bought. Now confirm their purchase, set delivery expectations, offer a complementary product, and ask for a review 7 days later." },
      { heading: "Flow 3: Win-Back", body: "Anyone who hasn't purchased in 90 days is at risk. A 2-email win-back sequence reactivates 8-12% of lapsed customers." },
    ],
  },
];

export const QUIZ = [
  { id: "revenue", q: "What is your store's current monthly revenue?", opts: ["Under $1k", "$1k – $10k", "$10k – $50k", "$50k+"] },
  { id: "ads", q: "Are you currently running paid ads?", opts: ["Yes, actively", "No, not yet", "Used to, paused now"] },
  { id: "bottleneck", q: "What's your biggest bottleneck right now?", opts: ["Getting traffic", "Converting visitors", "Improving ROAS", "All of the above"] },
  { id: "budget", q: "Monthly investment budget for growth?", opts: ["Under $500", "$500 – $2k", "$2k – $5k", "$5k+"] },
];

export const FAQS = [
  { q: "Do I need a big ad budget to work with you?", a: "No. We work with clients at various stages. The most important thing is a proven product and willingness to optimize. We'll tell you the minimum viable budget on our discovery call." },
  { q: "How long before I see results?", a: "Most clients see measurable improvements within 30 days. Full revenue compounding typically kicks in by month 3. Our record is 90 days from $1k to $70k monthly revenue." },
  { q: "What platforms do you work with?", a: "Shopify, WooCommerce, Magento, BigCommerce and more. For ads: Meta, TikTok, and Google. We focus on wherever your customers actually are." },
  { q: "What makes you different from a regular ad agency?", a: "We don't just run ads. We fix the whole system — store speed, product pages, checkout flow, email sequences, then ads. Most agencies skip the 80% that makes ads actually work." },
  { q: "Is there a contract?", a: "Month-to-month on The Lab retainer. We don't believe in locking clients in — we believe in results that make you want to stay." },
  { q: "What if I'm just starting out?", a: "The Audit is the perfect entry point. We'll assess where you are, tell you exactly what to fix, and give you a clear roadmap to your first $10k month." },
];

// Platform tickers with real icon slugs from simpleicons.org
export const ECOM_PLATFORMS = [
  { name: "Shopify", slug: "shopify" },
  { name: "WooCommerce", slug: "woocommerce" },
  { name: "Magento", slug: "magento" },
  { name: "BigCommerce", slug: "bigcommerce" },
  { name: "Wix", slug: "wix" },
  { name: "Squarespace", slug: "squarespace" },
  { name: "PrestaShop", slug: "prestashop" },
  { name: "OpenCart", slug: "opencart" },
  { name: "Ecwid", slug: "ecwid" },
];

export const AD_PLATFORMS = [
  { name: "Meta Ads", slug: "meta" },
  { name: "TikTok Ads", slug: "tiktok" },
  { name: "Google Ads", slug: "google" },
  { name: "Pinterest Ads", slug: "pinterest" },
  { name: "Snapchat Ads", slug: "snapchat" },
  { name: "YouTube Ads", slug: "youtube" },
  { name: "X Ads", slug: "x" },
  { name: "LinkedIn Ads", slug: "linkedin" },
  { name: "Amazon Ads", slug: "amazon" },
];

export const PARTNERS = [
  { name: "Meta", slug: "meta" },
  { name: "Google", slug: "google" },
  { name: "TikTok", slug: "tiktok" },
  { name: "Shopify", slug: "shopify" },
  { name: "Klaviyo", slug: "klaviyo" },
  { name: "Triple Whale", slug: "triplewhale" },
];

export const VIDEO_TIPS = [
  {
    tag: "CRO Tip",
    title: "Why your checkout is losing 40% of buyers",
    desc: "The #1 mistake e-commerce stores make that kills conversions at the final step.",
    videoUrl: "",
  },
  {
    tag: "Ad Strategy",
    title: "How to cut your Meta CPA in half",
    desc: "A simple audience restructure that most agencies overlook entirely.",
    videoUrl: "",
  },
  {
    tag: "Store Audit",
    title: "5 things we check in every store audit",
    desc: "The exact checklist we use to find where your store is leaking money.",
    videoUrl: "",
  },
  {
    tag: "ROAS",
    title: "What a 4x ROAS actually looks like",
    desc: "Real numbers, real campaigns — breaking down what makes ads actually profitable.",
    videoUrl: "",
  },
  {
    tag: "Email",
    title: "The abandoned cart sequence that recovers 20%",
    desc: "3 emails, exact timing, exact copy structure. Free to implement today.",
    videoUrl: "",
  },
];