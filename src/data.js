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
  {
    init: "MT",
    name: "Marcus T.",
    role: "Shopify Store Owner",
    result: "$1.2k → $38k/mo",
    text: "I'd been running ads for 2 years with nothing to show for it. Three months in, my ROAS went from 0.8x to 6.2x. The store rebuild alone doubled my conversion rate.",
    storeName: "IronFuel Supplements",
    storeUrl: "https://www.myprotein.com",
    storeLogo: "https://www.google.com/s2/favicons?domain=myprotein.com&sz=64",
    storeCategory: "Fitness & Supplements",
  },
  {
    init: "PS",
    name: "Priya S.",
    role: "DTC Brand Founder",
    result: "1.1% → 4.8% CVR",
    text: "They found 11 things wrong with my checkout in the first audit. I had no idea I was losing that many customers. Best investment I've made in the business.",
    storeName: "Glow Ritual",
    storeUrl: "https://www.lookfantastic.com",
    storeLogo: "https://www.google.com/s2/favicons?domain=lookfantastic.com&sz=64",
    storeCategory: "Beauty & Skincare",
  },
  {
    init: "JO",
    name: "James O.",
    role: "E-commerce Entrepreneur",
    result: "ROAS 0.6x → 5.4x",
    text: "Went from burning money on ads to finally being profitable in week 6. The system they built just keeps compounding. I wish I found them sooner.",
    storeName: "TechToy Vista",
    storeUrl: "https://www.zavvi.com",
    storeLogo: "https://www.google.com/s2/favicons?domain=zavvi.com&sz=64",
    storeCategory: "Tech & Gadgets",
  },
  {
    init: "AL",
    name: "Aisha L.",
    role: "Beauty Brand Owner",
    result: "$800 → $22k/mo",
    text: "Within 45 days they rebuilt my product page, rewrote my ad copy and my cost per purchase dropped by 60%. Insane results for a small brand.",
    storeName: "Velvet & Co",
    storeUrl: "https://www.cultbeauty.com",
    storeLogo: "https://www.google.com/s2/favicons?domain=cultbeauty.com&sz=64",
    storeCategory: "Luxury Beauty",
  },
  {
    init: "RK",
    name: "Ryan K.",
    role: "Fitness Supplements",
    result: "CPA $42 → $11",
    text: "The audit alone was worth 10x the price. They identified a checkout friction point killing 40% of my sales. Fixed in a week, results were immediate.",
    storeName: "PeakForm Nutrition",
    storeUrl: "https://www.bulk.com",
    storeLogo: "https://www.google.com/s2/favicons?domain=bulk.com&sz=64",
    storeCategory: "Sports Nutrition",
  },
  {
    init: "TN",
    name: "Tunde N.",
    role: "Fashion E-commerce",
    result: "$3k → $41k/mo",
    text: "We were spending $5k/mo on ads and getting almost nothing back. Bode found the issue in 3 days. Now every dollar we spend returns four.",
    storeName: "Drip District",
    storeUrl: "https://www.boohoo.com",
    storeLogo: "https://www.google.com/s2/favicons?domain=boohoo.com&sz=64",
    storeCategory: "Fashion & Apparel",
  },
];

export const SERVICES = [
  {
    id: "store-audit",
    icon: "🔍",
    title: "Store Audit",
    tagline: "Find every leak in 48hrs",
    desc: "We dissect your store, ads, and full funnel. Every friction point mapped, every missed dollar identified. Delivered as a 30-page action report.",
    bullets: ["Full store speed analysis", "Checkout friction mapping", "Ad account audit", "30-page action report", "1x 90-min strategy call"],
    color: "#00ff88",
    price: "$497",
    link: "/pricing",
  },
  {
    id: "ad-management",
    icon: "📈",
    title: "Ad Management",
    tagline: "Ads that compound monthly",
    desc: "Precision creatives, copy and targeting built around your customer's real pain points. We don't run ads — we engineer ROAS.",
    bullets: ["Meta & TikTok campaigns", "Creative strategy & copy", "Audience segmentation", "Weekly performance reports", "Monthly strategy reviews"],
    color: "#0081FB",
    price: "From $2,000/mo",
    link: "/pricing",
  },
  {
    id: "cro-optimization",
    icon: "⚡",
    title: "CRO Optimization",
    tagline: "Convert more existing traffic",
    desc: "We rebuild your pages with one goal: turning browsers into buyers. Speed, layout, copy, trust signals — everything optimized.",
    bullets: ["Product page rebuilds", "Checkout optimization", "Mobile speed fixes", "A/B testing setup", "Trust signal implementation"],
    color: "#FF9900",
    price: "From $2,000/mo",
    link: "/pricing",
  },
  {
    id: "landing-pages",
    icon: "🎯",
    title: "Landing Pages",
    tagline: "Pages built to convert",
    desc: "Custom landing pages designed for your paid traffic. Every element engineered to convert cold traffic into customers.",
    bullets: ["Custom page design", "Mobile-first build", "Fast load times", "Conversion copywriting", "Split testing ready"],
    color: "#BD081C",
    price: "From $2,000/mo",
    link: "/pricing",
  },
  {
    id: "email-flows",
    icon: "✉️",
    title: "Email Flows",
    tagline: "Revenue while you sleep",
    desc: "Abandoned cart, post-purchase, win-back — we build the sequences that recover revenue 24/7 without spending more on ads.",
    bullets: ["Abandoned cart sequence", "Post-purchase flow", "Win-back campaign", "Welcome series", "Klaviyo setup & management"],
    color: "#FFD700",
    price: "From $2,000/mo",
    link: "/pricing",
  },
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
    tags: ["Shopify", "Meta Ads", "CRO"],
    story: [
      { heading: "The problem", body: "Marcus had a great product but was spending $3,000/month on Meta ads and generating less than $1,200 in revenue." },
      { heading: "The diagnosis", body: "Within 48 hours of our audit, we found the core issue: his product page loaded in 7.2 seconds on mobile and his checkout had 6 unnecessary steps." },
      { heading: "What we built", body: "We rebuilt his product page cutting load time to 1.4 seconds, reduced checkout to 2 steps, and restructured his Meta campaigns." },
      { heading: "The result", body: "Month 3: 6.2x ROAS with revenue at $38,000/month. Same ad budget. Same product. Different system." },
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
    tags: ["WooCommerce", "Google Ads", "Email"],
    story: [
      { heading: "The problem", body: "Priya's skincare brand was getting 15,000 monthly visitors but converting at just 1.1%." },
      { heading: "The diagnosis", body: "Our audit revealed 11 friction points. Her checkout required account creation before purchase, killing 38% of buyers." },
      { heading: "What we built", body: "We enabled guest checkout, redesigned product pages, and built a post-purchase email sequence." },
      { heading: "The result", body: "Conversion rate jumped from 1.1% to 4.8% in 30 days. Revenue went from $4k to $22k/month." },
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
    tags: ["Shopify", "TikTok Ads", "Meta Ads"],
    story: [
      { heading: "The problem", body: "Tunde's fashion brand had everything going for it but his paid ads were hemorrhaging money." },
      { heading: "The diagnosis", body: "His TikTok ads were elegant — perfect for Instagram, completely wrong for TikTok's raw culture." },
      { heading: "What we built", body: "We created raw behind-the-scenes TikTok content and rebuilt Meta retargeting to target product page visitors." },
      { heading: "The result", body: "Same $5,000 ad budget. ROAS went from 0.9x to 4.3x. Revenue grew from $3k to $41k/month." },
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
    excerpt: "Most store owners obsess over ROAS. But ROAS alone is one of the most misleading metrics in e-commerce.",
    content: [
      { heading: "The ROAS trap", body: "A 4x ROAS sounds great. But after product cost, fulfillment, returns, and payment processing — you might be barely breaking even." },
      { heading: "What to track instead", body: "Track MER (total revenue divided by total ad spend), nCAC, and LTV:CAC ratio. These tell you if your business is actually healthy." },
      { heading: "The bottom line", body: "Stores that scale past $100k/month obsess over contribution margin and LTV — not ROAS." },
    ],
  },
  {
    id: "5-checkout-fixes",
    title: "5 Checkout Fixes That Doubled Our Clients' Conversion Rates",
    category: "CRO",
    date: "March 28, 2025",
    readTime: "8 min read",
    excerpt: "After auditing 40+ e-commerce stores, we found the same 5 checkout problems killing conversion rates.",
    content: [
      { heading: "Fix 1: Kill forced account creation", body: "Requiring account creation before checkout kills 35% of buyers. Enable guest checkout immediately." },
      { heading: "Fix 2: Move your CTA above the fold", body: "60% of product pages have Add to Cart below the fold on mobile. Your price and CTA must be visible without scrolling." },
      { heading: "Fix 3: Fix your mobile speed", body: "If your page loads in over 3 seconds on mobile, you lose 40% of visitors before they see your product." },
    ],
  },
  {
    id: "tiktok-vs-meta-2025",
    title: "TikTok vs Meta Ads in 2025: Where Should Your Budget Go?",
    category: "Ad Strategy",
    date: "March 10, 2025",
    readTime: "7 min read",
    excerpt: "The answer isn't one or the other. Build a strategy that uses both at the right time.",
    content: [
      { heading: "Meta: Still the conversion king", body: "Meta has 10+ years of purchase behaviour data. For retargeting and scaling proven winners, nothing beats it." },
      { heading: "TikTok: The discovery engine", body: "TikTok finds audiences you didn't know existed. Raw, authentic content wins. Polished ads die." },
      { heading: "Our recommendation", body: "70% Meta, 30% TikTok. Use TikTok to find audiences, Meta to convert them." },
    ],
  },
  {
    id: "email-flows-that-print-money",
    title: "The 3 Email Flows Every E-commerce Store Needs",
    category: "Email Marketing",
    date: "February 22, 2025",
    readTime: "9 min read",
    excerpt: "Email generates $42 for every $1 spent. Most stores leave 30% of revenue on the table.",
    content: [
      { heading: "Flow 1: Abandoned Cart", body: "A 3-email sequence recovers 15-20% of abandoned carts. Email 1: reminder. Email 2: address objections. Email 3: 10% off with urgency." },
      { heading: "Flow 2: Post-Purchase", body: "Confirm the order, set delivery expectations, offer a complementary product, and ask for a review 7 days later." },
      { heading: "Flow 3: Win-Back", body: "A 2-email sequence reactivates 8-12% of customers who haven't bought in 90 days." },
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
  { q: "Do I need a big ad budget to work with you?", a: "No. We work with clients at various stages. The most important thing is a proven product and willingness to optimize." },
  { q: "How long before I see results?", a: "Most clients see measurable improvements within 30 days. Full revenue compounding kicks in by month 3. Our record is 90 days from $1k to $70k." },
  { q: "What platforms do you work with?", a: "Shopify, WooCommerce, Magento, BigCommerce and more. For ads: Meta, TikTok, and Google." },
  { q: "What makes you different from a regular ad agency?", a: "We don't just run ads. We fix the whole system — store speed, product pages, checkout flow, email sequences, then ads." },
  { q: "Is there a contract?", a: "Month-to-month on The Lab retainer. We don't believe in locking clients in — we believe in results that make you want to stay." },
  { q: "What if I'm just starting out?", a: "The Audit is the perfect entry point. We'll assess where you are and give you a clear roadmap to your first $10k month." },
];

// Inline SVG icons — no CDN dependency
export const ECOM_PLATFORMS = [
  { name: "Shopify", color: "#96BF48", svg: '<svg viewBox="0 0 24 24" fill="#96BF48"><path d="M15.337.276a.335.335 0 00-.33-.276c-.148 0-2.905.205-2.905.205s-1.937-1.894-2.138-2.094V24l7.976-1.723S15.337.426 15.337.276z"/><path d="M10.29 7.876l-.92 3.444s-1.02-.464-2.24-.387c-1.783.112-1.802 1.233-1.783 1.514.097 1.533 4.13 1.868 4.356 5.455.175 2.822-1.494 4.757-3.9 4.906-2.888.18-4.354-1.523-4.354-1.523l.595-2.527s1.51 1.14 2.716 1.064c.787-.05 1.07-.69 1.04-1.15-.126-2.002-3.413-1.884-3.62-5.173C1.993 10.07 3.87 7.26 7.823 7.01c1.554-.098 2.467.297 2.467.297z"/></svg>' },
  { name: "WooCommerce", color: "#96588A", svg: '<svg viewBox="0 0 24 24" fill="#96588A"><path d="M2.047 0C.919 0 0 .92 0 2.047v13.838c0 1.128.92 2.047 2.047 2.047h6.91l-.636 3.683 4.591-3.683h9.041c1.128 0 2.047-.92 2.047-2.047V2.047C24 .919 23.08 0 21.953 0zm2.442 5.299h.843l1.028 4.584 1.139-4.584h.826l1.108 4.584 1.042-4.584h.82L8.97 11.16H8.18l-1.07-4.266-1.085 4.266h-.787zm7.73 0h3.04v.736h-2.27v1.642h2.055v.733H13.0v1.714h2.307v.736H12.22zm4.207 0h.77V8.41l2.254-3.111h.863l-2.778 3.836V11.16h-.77V8.135l-2.778-3.836h.87z"/></svg>' },
  { name: "Magento", color: "#EE672F", svg: '<svg viewBox="0 0 24 24" fill="#EE672F"><path d="M12 0L1.608 6v12L12 24l10.392-6V6zm-.034 4.63l4.053 2.349v4.66l-1.36.786V7.762l-2.693-1.556-2.693 1.556v8.667l-1.36-.786V6.979zm-2.708 9.547V9.518l2.708-1.567 2.709 1.567v4.66l-1.348.778V10.29l-1.36-.786-1.362.786v4.663z"/></svg>' },
  { name: "BigCommerce", color: "#34313F", svg: '<svg viewBox="0 0 24 24" fill="#a78bfa"><path d="M0 0v24h24V0zm7.19 17.514H5.047V6.486H7.19zm5.357 0H10.4v-7.37h2.147zm5.358 0h-2.148V9.248h2.148z"/></svg>' },
  { name: "Wix", color: "#FAAD4D", svg: '<svg viewBox="0 0 24 24" fill="#FAAD4D"><path d="M6.722 6.064c-.546.281-.904.757-1.216 1.457L3 13.619l1.612-.802.875-2.557 1.54 3.858 1.61-.8-2.025-5.08c-.219-.547-.215-.878.11-1.174zm7.164 0L12.3 10.08l-.977-2.48c-.294-.743-.7-1.285-1.15-1.536H7.93l3.098 7.555 1.278-.643 1.28.643 3.098-7.555z"/></svg>' },
  { name: "Squarespace", color: "#ffffff", svg: '<svg viewBox="0 0 24 24" fill="#ffffff"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.657 8.485L8.485 17.657 6.343 15.5l9.172-9.172 2.142 2.157zm-1.414-1.414L7.07 16.243 4.93 14.1 14.1 4.929l2.143 2.142z"/></svg>' },
  { name: "PrestaShop", color: "#DF0067", svg: '<svg viewBox="0 0 24 24" fill="#DF0067"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.388 17.338c-2.994.648-5.88-1.25-6.44-4.248-.56-2.998 1.436-5.832 4.43-6.48 2.994-.648 5.88 1.25 6.44 4.248.56 2.998-1.436 5.832-4.43 6.48z"/></svg>' },
  { name: "OpenCart", color: "#23AADF", svg: '<svg viewBox="0 0 24 24" fill="#23AADF"><path d="M22.325 4.765a1.4 1.4 0 00-1.054-.48H3.35C2.605 4.285 2 4.89 2 5.635v.018c0 .372.148.727.412.99l.01.01 4.24 4.241H5.28a1.4 1.4 0 000 2.8h1.924l-.001.001 4.25 4.25a1.4 1.4 0 001.98 0l4.24-4.24h1.925a1.4 1.4 0 000-2.8H17.72l4.24-4.24a1.4 1.4 0 00.365-1.9z"/></svg>' },
  { name: "Ecwid", color: "#FF6A00", svg: '<svg viewBox="0 0 24 24" fill="#FF6A00"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6a8.4 8.4 0 110 16.8A8.4 8.4 0 0112 3.6zm0 2.4a6 6 0 100 12A6 6 0 0012 6z"/></svg>' },
];

export const AD_PLATFORMS = [
  { name: "Meta Ads", color: "#0081FB", svg: '<svg viewBox="0 0 24 24" fill="#0081FB"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
  { name: "TikTok Ads", color: "#ffffff", svg: '<svg viewBox="0 0 24 24" fill="#ffffff"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>' },
  { name: "Google Ads", color: "#4285F4", svg: '<svg viewBox="0 0 24 24" fill="#4285F4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>' },
  { name: "Pinterest", color: "#BD081C", svg: '<svg viewBox="0 0 24 24" fill="#BD081C"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>' },
  { name: "Snapchat", color: "#FFFC00", svg: '<svg viewBox="0 0 24 24" fill="#FFFC00"><path d="M12.065.001C9.078.001 5.97 1.67 4.315 4.317c-.882 1.457-1.155 3.088-1.063 4.735C3.11 9.7 3.017 10.36 2.726 11c-.38.835-1.048 1.1-1.48 1.376-.432.277-.775.525-.73.995.045.47.485.838 1.09 1.018.607.18.907.252 1.12.69.284.574.142 1.45.59 1.866.33.306.793.177 1.284.126.49-.05 1.022.016 1.544.443.44.356.816 1.05 1.308 1.69.49.637 1.126 1.284 2.11 1.668C9.546 20.88 10.64 21 12 21c1.36 0 2.455-.12 3.44-.128.984-.385 1.62-1.032 2.11-1.668.49-.64.868-1.334 1.308-1.69.522-.427 1.054-.493 1.544-.443.49.05.954.18 1.284-.126.448-.416.306-1.292.59-1.866.213-.438.513-.51 1.12-.69.605-.18 1.045-.548 1.09-1.018.045-.47-.298-.718-.73-.995-.432-.276-1.1-.54-1.48-1.376-.29-.64-.384-1.3-.526-1.948.092-1.647-.18-3.278-1.063-4.735C18.03 1.67 14.922.001 11.935.001z"/></svg>' },
  { name: "YouTube Ads", color: "#FF0000", svg: '<svg viewBox="0 0 24 24" fill="#FF0000"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>' },
  { name: "X Ads", color: "#ffffff", svg: '<svg viewBox="0 0 24 24" fill="#ffffff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
  { name: "LinkedIn Ads", color: "#0A66C2", svg: '<svg viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' },
  { name: "Amazon Ads", color: "#FF9900", svg: '<svg viewBox="0 0 24 24" fill="#FF9900"><path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.674-1.94 1.207-4.13 1.812-6.57 1.812-2.39 0-4.81-.548-7.25-1.642L4.09 19.93l-.045-.02c-.55-.314-1.07-.644-1.56-.99-.31-.21-.41-.5-.44-.9z"/><path d="M21.54 15.842c-.18-.23-.476-.255-.89-.073l-.03.015c-.8.44-1.663.617-2.592.533-1.185-.108-2.216-.61-3.09-1.505-.616-.637-1.047-1.36-1.295-2.17-.248-.808-.293-1.612-.134-2.41.157-.8.488-1.52.99-2.16.503-.64 1.12-1.142 1.85-1.505.73-.362 1.51-.543 2.342-.543 1.278 0 2.398.412 3.357 1.236.96.825 1.503 1.914 1.63 3.265.09.96-.04 1.92-.39 2.88l-.05.133c-.1.253-.03.43.21.54.24.11.43.02.57-.27.14-.29.25-.59.33-.9.51-1.91.19-3.63-.96-5.16-1.15-1.53-2.73-2.39-4.74-2.59-2.36-.23-4.41.54-6.15 2.31-1.31 1.34-1.97 2.92-1.97 4.74 0 1.57.52 2.98 1.56 4.23s2.35 2.04 3.93 2.38c1.06.23 2.11.19 3.15-.12 1.04-.31 1.96-.84 2.77-1.59.37-.33.4-.67.1-1.02z"/></svg>' },
];

export const PARTNERS = [
  { name: "Meta", color: "#0081FB", svg: '<svg viewBox="0 0 24 24" fill="#0081FB"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
  { name: "Google", color: "#4285F4", svg: '<svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>' },
  { name: "TikTok", color: "#ffffff", svg: '<svg viewBox="0 0 24 24" fill="#ffffff"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>' },
  { name: "Shopify", color: "#96BF48", svg: '<svg viewBox="0 0 24 24" fill="#96BF48"><path d="M15.337.276a.335.335 0 00-.33-.276c-.148 0-2.905.205-2.905.205s-1.937-1.894-2.138-2.094V24l7.976-1.723S15.337.426 15.337.276z"/><path d="M10.29 7.876l-.92 3.444s-1.02-.464-2.24-.387c-1.783.112-1.802 1.233-1.783 1.514.097 1.533 4.13 1.868 4.356 5.455.175 2.822-1.494 4.757-3.9 4.906-2.888.18-4.354-1.523-4.354-1.523l.595-2.527s1.51 1.14 2.716 1.064c.787-.05 1.07-.69 1.04-1.15-.126-2.002-3.413-1.884-3.62-5.173C1.993 10.07 3.87 7.26 7.823 7.01c1.554-.098 2.467.297 2.467.297z"/></svg>' },
  { name: "Klaviyo", color: "#FFD700", svg: '<svg viewBox="0 0 24 24" fill="#FFD700"><path d="M22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zM8 17.5H5.5V13H8v4.5zm0-6.5H5.5V6.5H8V11zm5.5 6.5H11V13h2.5v4.5zm0-6.5H11V6.5h2.5V11zm5.5 6.5H16.5V13H19v4.5zm0-6.5H16.5V6.5H19V11z"/></svg>' },
  { name: "Triple Whale", color: "#7B68EE", svg: '<svg viewBox="0 0 24 24" fill="#7B68EE"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>' },
];

export const VIDEO_TIPS = [
  { tag: "Checkout Tip", title: "Why your checkout loses 40% of buyers", desc: "The #1 mistake e-commerce stores make that kills conversions.", videoId: "HcNzgUUQI5g", thumb: "https://i.ytimg.com/vi/HcNzgUUQI5g/hqdefault.jpg" },
  { tag: "Ad Strategy", title: "How to cut your Meta CPA in half", desc: "A simple audience restructure most agencies overlook.", videoId: "SklDEDMQmmY", thumb: "https://i.ytimg.com/vi/SklDEDMQmmY/hqdefault.jpg" },
  { tag: "Store Audit", title: "5 things we check in every store audit", desc: "The exact checklist we use to find where your store leaks money.", videoId: "UQGUkS8H-44", thumb: "https://i.ytimg.com/vi/UQGUkS8H-44/hqdefault.jpg" },
  { tag: "ROAS Explained", title: "What a 4x ROAS actually looks like", desc: "Real numbers, breaking down what makes ads profitable.", videoId: "GT3yTvgD7i8", thumb: "https://i.ytimg.com/vi/GT3yTvgD7i8/hqdefault.jpg" },
  { tag: "Email Flow", title: "The abandoned cart sequence that recovers 20%", desc: "3 emails, exact timing, exact copy. Free to implement today.", videoId: "fvbex4WkncE", thumb: "https://i.ytimg.com/vi/fvbex4WkncE/hqdefault.jpg" },
];