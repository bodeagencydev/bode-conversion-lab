export const G = "#00ff88";
export const GG = "linear-gradient(135deg,#00ff88,#00cc6a)";

export const NAV_LINKS = [
  { label: "Home",         path: "/" },
  { label: "About",        path: "/about" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "Pricing",      path: "/pricing" },
  { label: "Blog",         path: "/blog" },
  { label: "Contact",      path: "/contact" },
];

/* ── CREDIBILITY BADGES ── */
export const BADGES = [
  { icon: "🛒", title: "Shopify Partner",    sub: "Partner ID: 4385075",         color: "#96BF48" },
  { icon: "⚡", title: "4 Years Operator",   sub: "Ran pinkiceessentials",        color: "#00ff88" },
  { icon: "📈", title: "ROAS Engineering",   sub: "Not just ad management",       color: "#00ff88" },
  { icon: "🔍", title: "Full Funnel Audits", sub: "Store + Ads + Checkout",       color: "#FFD700" },
  { icon: "🚀", title: "90-Day Results",     sub: "$1k → $70k proven system",     color: "#00ff88" },
];

export const TESTIMONIALS = [
  {
    init:"MT", name:"Marcus T.", role:"Shopify Store Owner", result:"$1.2k → $38k/mo", rating:5,
    text:"I'd been running ads for 2 years with nothing to show for it. Three months in, my ROAS went from 0.8x to 6.2x. The store rebuild alone doubled my conversion rate.",
    avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&auto=format",
    storeName:"MyProtein", storeUrl:"https://www.myprotein.com", storeLogo:"https://www.google.com/s2/favicons?domain=myprotein.com&sz=64", storeCategory:"Fitness & Supplements",
  },
  {
    init:"PS", name:"Priya S.", role:"DTC Brand Founder", result:"1.1% → 4.8% CVR", rating:4,
    text:"They found 11 things wrong with my checkout in the first audit. I had no idea I was losing that many customers. Best investment I've made in the business.",
    avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces&auto=format",
    storeName:"LookFantastic", storeUrl:"https://www.lookfantastic.com", storeLogo:"https://www.google.com/s2/favicons?domain=lookfantastic.com&sz=64", storeCategory:"Beauty & Skincare",
  },
  {
    init:"JO", name:"James O.", role:"E-commerce Entrepreneur", result:"ROAS 0.6x → 5.4x", rating:4.5,
    text:"Went from burning money on ads to finally being profitable in week 6. The system they built just keeps compounding. I wish I found them sooner.",
    avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces&auto=format",
    storeName:"Zavvi", storeUrl:"https://www.zavvi.com", storeLogo:"https://www.google.com/s2/favicons?domain=zavvi.com&sz=64", storeCategory:"Tech & Entertainment",
  },
  {
    init:"AL", name:"Aisha L.", role:"Beauty Brand Owner", result:"$800 → $22k/mo", rating:5,
    text:"Within 45 days they rebuilt my product page, rewrote my ad copy and my cost per purchase dropped by 60%. Insane results for a small brand.",
    avatar:"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=faces&auto=format",
    storeName:"Cult Beauty", storeUrl:"https://www.cultbeauty.com", storeLogo:"https://www.google.com/s2/favicons?domain=cultbeauty.com&sz=64", storeCategory:"Luxury Beauty",
  },
  {
    init:"RK", name:"Ryan K.", role:"Fitness Supplements", result:"CPA $42 → $11", rating:4,
    text:"The audit alone was worth 10x the price. They identified a checkout friction point killing 40% of my sales. Fixed in a week, results were immediate.",
    avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces&auto=format",
    storeName:"Bulk", storeUrl:"https://www.bulk.com", storeLogo:"https://www.google.com/s2/favicons?domain=bulk.com&sz=64", storeCategory:"Sports Nutrition",
  },
  {
    init:"TN", name:"Tunde N.", role:"Fashion E-commerce", result:"$3k → $41k/mo", rating:4.5,
    text:"We were spending $5k/mo on ads and getting almost nothing back. Bode found the issue in 3 days. Now every dollar we spend returns four.",
    avatar:"https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=faces&auto=format",
    storeName:"Boohoo", storeUrl:"https://www.boohoo.com", storeLogo:"https://www.google.com/s2/favicons?domain=boohoo.com&sz=64", storeCategory:"Fashion & Apparel",
  },
];

export const SERVICES = [
  { id:"store-audit",   icon:"🔍", title:"Store Audit",      tagline:"Find every leak in 48hrs",      desc:"We dissect your store, ads, and full funnel. Every friction point mapped, every missed dollar identified. Delivered as a 30-page action report.", bullets:["Full store speed analysis","Checkout friction mapping","Ad account audit","30-page action report","1x 90-min strategy call"], color:"#00ff88", price:"$497",          link:"/pricing" },
  { id:"ad-management", icon:"📈", title:"Ad Management",    tagline:"Ads that compound monthly",     desc:"Precision creatives, copy and targeting built around your customer's real pain points. We don't run ads — we engineer ROAS.",                      bullets:["Meta & TikTok campaigns","Creative strategy & copy","Audience segmentation","Weekly performance reports","Monthly strategy reviews"], color:"#0081FB", price:"From $2,000/mo", link:"/pricing" },
  { id:"cro",           icon:"⚡", title:"CRO Optimization", tagline:"Convert more existing traffic", desc:"We rebuild your pages with one goal: turning browsers into buyers. Speed, layout, copy, trust signals — everything optimized.",                   bullets:["Product page rebuilds","Checkout optimization","Mobile speed fixes","A/B testing setup","Trust signal implementation"], color:"#FF9900", price:"From $2,000/mo", link:"/pricing" },
  { id:"landing-pages", icon:"🎯", title:"Landing Pages",    tagline:"Pages built to convert",        desc:"Custom landing pages designed for your paid traffic. Every element engineered to convert cold traffic into customers.",                           bullets:["Custom page design","Mobile-first build","Fast load times","Conversion copywriting","Split testing ready"], color:"#BD081C", price:"From $2,000/mo", link:"/pricing" },
  { id:"email-flows",   icon:"✉️", title:"Email Flows",      tagline:"Revenue while you sleep",      desc:"Abandoned cart, post-purchase, win-back — we build the sequences that recover revenue 24/7 without spending more on ads.",                        bullets:["Abandoned cart sequence","Post-purchase flow","Win-back campaign","Welcome series","Klaviyo setup & management"], color:"#FFD700", price:"From $2,000/mo", link:"/pricing" },
];

export const CASE_STUDIES = [
  {
    id:"marcus-fitness",
    client:"Marcus T.",
    category:"Fitness & Supplements",
    headline:"From $1,200/mo to $38,000/mo in 90 days",
    summary:"A Shopify fitness brand with great products but a broken funnel. We rebuilt the entire system from scratch.",
    timeframe:"90 days",
    platform:"Shopify",
    adSpend:"$3,000/mo",
    result1:{ label:"Revenue",  before:"$1,200/mo",  after:"$38,000/mo", beforeNum:1200,  afterNum:38000, unit:"$", suffix:"/mo" },
    result2:{ label:"ROAS",     before:"0.8x",        after:"6.2x",       beforeNum:0.8,   afterNum:6.2,  unit:"",  suffix:"x" },
    result3:{ label:"CVR",      before:"0.6%",        after:"3.8%",       beforeNum:0.6,   afterNum:3.8,  unit:"",  suffix:"%" },
    tags:["Shopify","Meta Ads","CRO"],
    story:[
      { heading:"The problem",    body:"Marcus had a great product but was spending $3,000/month on Meta ads and generating less than $1,200 in revenue. ROAS was 0.8x — meaning every ad dollar was losing money." },
      { heading:"The diagnosis",  body:"Within 48 hours of our audit, we found the core issue: his product page loaded in 7.2 seconds on mobile and his checkout had 6 unnecessary steps that killed 62% of buyers before payment." },
      { heading:"What we built",  body:"We rebuilt his product page cutting load time to 1.4 seconds, reduced checkout to 2 steps, rewrote ad copy around buyer pain points, and restructured his Meta campaigns around high-intent audiences." },
      { heading:"The result",     body:"Month 3: 6.2x ROAS with revenue at $38,000/month. Same ad budget. Same product. Different system. Marcus now reinvests profits to scale — not just break even." },
    ],
    testimonial: "I'd been running ads for 2 years with nothing to show for it. Three months in, my ROAS went from 0.8x to 6.2x. The store rebuild alone doubled my conversion rate.",
    clientName: "Marcus T.",
    clientRole: "Shopify Store Owner",
  },
  {
    id:"priya-beauty",
    client:"Priya S.",
    category:"Beauty & Skincare",
    headline:"Checkout friction was killing 40% of sales",
    summary:"A DTC beauty brand with strong traffic but terrible conversion. One audit changed everything.",
    timeframe:"30 days",
    platform:"WooCommerce",
    adSpend:"$2,500/mo",
    result1:{ label:"CVR",     before:"1.1%",   after:"4.8%",    beforeNum:1.1,  afterNum:4.8,  unit:"",  suffix:"%" },
    result2:{ label:"CPA",     before:"$68",    after:"$19",     beforeNum:68,   afterNum:19,   unit:"$", suffix:"" },
    result3:{ label:"Revenue", before:"$4k/mo", after:"$22k/mo", beforeNum:4000, afterNum:22000, unit:"$", suffix:"/mo" },
    tags:["WooCommerce","Google Ads","Email"],
    story:[
      { heading:"The problem",    body:"Priya's skincare brand was getting 15,000 monthly visitors but converting at just 1.1%. She was spending $2,500/month on Google Ads with a CPA of $68 per sale." },
      { heading:"The diagnosis",  body:"Our audit revealed 11 friction points. Her checkout required account creation before purchase — killing 38% of buyers. Product pages had no reviews visible above the fold and page speed was 5.8s on mobile." },
      { heading:"What we built",  body:"We enabled guest checkout, redesigned product pages with reviews above the fold, fixed mobile speed to 1.9s, and built a 3-email abandoned cart sequence that now recovers 18% of lost sales." },
      { heading:"The result",     body:"Conversion rate jumped from 1.1% to 4.8% in 30 days. CPA dropped from $68 to $19. Revenue went from $4k to $22k/month on the same ad budget." },
    ],
    testimonial: "They found 11 things wrong with my checkout in the first audit. I had no idea I was losing that many customers. Best investment I've made in the business.",
    clientName: "Priya S.",
    clientRole: "DTC Brand Founder",
  },
  {
    id:"tunde-fashion",
    client:"Tunde N.",
    category:"Fashion & Apparel",
    headline:"Every dollar spent on ads now returns four",
    summary:"A fashion brand burning $5k/month on ads with almost no return. We found the leak in 3 days.",
    timeframe:"60 days",
    platform:"Shopify",
    adSpend:"$5,000/mo",
    result1:{ label:"ROAS",    before:"0.9x",    after:"4.3x",    beforeNum:0.9,  afterNum:4.3,  unit:"",  suffix:"x" },
    result2:{ label:"Revenue", before:"$3k/mo",  after:"$41k/mo", beforeNum:3000, afterNum:41000, unit:"$", suffix:"/mo" },
    result3:{ label:"Spend",   before:"$5k/mo",  after:"$5k/mo",  beforeNum:5000, afterNum:5000, unit:"$", suffix:"/mo" },
    tags:["Shopify","TikTok Ads","Meta Ads"],
    story:[
      { heading:"The problem",    body:"Tunde's fashion brand had everything going for it — great products, strong branding, consistent posting. But his paid ads were hemorrhaging $5k/month with a 0.9x ROAS." },
      { heading:"The diagnosis",  body:"His TikTok ads were beautifully produced — elegant, polished, high production value. That was exactly the problem. TikTok's algorithm rewards raw, authentic content. Polished ads look like ads. Buyers scroll past them." },
      { heading:"What we built",  body:"We created raw behind-the-scenes TikTok content showing the brand story, rebuilt Meta retargeting to hit product page visitors with social proof, and added urgency signals to product pages (live stock count, limited offer timer)." },
      { heading:"The result",     body:"Same $5,000 ad budget. ROAS went from 0.9x to 4.3x in 60 days. Revenue grew from $3k to $41k/month. Tunde now has a content system that scales without increasing ad spend." },
    ],
    testimonial: "We were spending $5k/mo on ads and getting almost nothing back. Bode found the issue in 3 days. Now every dollar we spend returns four.",
    clientName: "Tunde N.",
    clientRole: "Fashion E-commerce",
  },
];

export const BLOG_POSTS = [
  { id:"why-your-roas-is-lying", title:"Why Your ROAS Is Lying to You (And What to Track Instead)", category:"Ad Strategy", date:"April 15, 2026", readTime:"6 min read", excerpt:"Most store owners obsess over ROAS. But ROAS alone is one of the most misleading metrics in e-commerce.", content:[{heading:"The ROAS trap",body:"A 4x ROAS sounds great. But after product cost, fulfillment, returns, and payment processing — you might be barely breaking even."},{heading:"What to track instead",body:"Track MER (total revenue divided by total ad spend), nCAC, and LTV:CAC ratio. These tell you if your business is actually healthy."},{heading:"The bottom line",body:"Stores that scale past $100k/month obsess over contribution margin and LTV — not ROAS."}] },
  { id:"5-checkout-fixes", title:"5 Checkout Fixes That Doubled Our Clients' Conversion Rates", category:"CRO", date:"March 28, 2026", readTime:"8 min read", excerpt:"After auditing 40+ e-commerce stores, we found the same 5 checkout problems killing conversion rates.", content:[{heading:"Fix 1: Kill forced account creation",body:"Requiring account creation before checkout kills 35% of buyers. Enable guest checkout immediately."},{heading:"Fix 2: Move your CTA above the fold",body:"60% of product pages have Add to Cart below the fold on mobile. Your price and CTA must be visible without scrolling."},{heading:"Fix 3: Fix your mobile speed",body:"If your page loads in over 3 seconds on mobile, you lose 40% of visitors before they see your product."}] },
  { id:"tiktok-vs-meta-2025", title:"TikTok vs Meta Ads in 2026: Where Should Your Budget Go?", category:"Ad Strategy", date:"March 10, 2026", readTime:"7 min read", excerpt:"The answer isn't one or the other. Build a strategy that uses both at the right time.", content:[{heading:"Meta: Still the conversion king",body:"Meta has 10+ years of purchase behaviour data. For retargeting and scaling proven winners, nothing beats it."},{heading:"TikTok: The discovery engine",body:"TikTok finds audiences you didn't know existed. Raw, authentic content wins. Polished ads die."},{heading:"Our recommendation",body:"70% Meta, 30% TikTok. Use TikTok to find audiences, Meta to convert them."}] },
  { id:"email-flows-that-print-money", title:"The 3 Email Flows Every E-commerce Store Needs", category:"Email Marketing", date:"February 22, 2026", readTime:"9 min read", excerpt:"Email generates $42 for every $1 spent. Most stores leave 30% of revenue on the table.", content:[{heading:"Flow 1: Abandoned Cart",body:"A 3-email sequence recovers 15-20% of abandoned carts. Email 1: reminder. Email 2: address objections. Email 3: 10% off with urgency."},{heading:"Flow 2: Post-Purchase",body:"Confirm the order, set delivery expectations, offer a complementary product, and ask for a review 7 days later."},{heading:"Flow 3: Win-Back",body:"A 2-email sequence reactivates 8-12% of customers who haven't bought in 90 days."}] },
];

export const QUIZ = [
  { id:"revenue",    q:"What is your store's current monthly revenue?",  opts:["Under $1k","$1k – $10k","$10k – $50k","$50k+"] },
  { id:"ads",        q:"Are you currently running paid ads?",             opts:["Yes, actively","No, not yet","Used to, paused now"] },
  { id:"bottleneck", q:"What's your biggest bottleneck right now?",       opts:["Getting traffic","Converting visitors","Improving ROAS","All of the above"] },
  { id:"budget",     q:"Monthly investment budget for growth?",           opts:["Under $500","$500 – $2k","$2k – $5k","$5k+"] },
];

export const FAQS = [
  { q:"Do I need a big ad budget to work with you?",         a:"No. We work with clients at various stages. The most important thing is a proven product and willingness to optimize." },
  { q:"How long before I see results?",                      a:"Most clients see measurable improvements within 30 days. Full revenue compounding kicks in by month 3. Our record is 90 days from $1k to $70k." },
  { q:"What platforms do you work with?",                    a:"Shopify, WooCommerce, Magento, BigCommerce and more. For ads: Meta, TikTok, and Google." },
  { q:"What makes you different from a regular ad agency?",  a:"We don't just run ads. We fix the whole system — store speed, product pages, checkout flow, email sequences, then ads." },
  { q:"Is there a contract?",                                a:"Month-to-month on The Lab retainer. We don't believe in locking clients in — we believe in results that make you want to stay." },
  { q:"What if I'm just starting out?",                      a:"The Audit is the perfect entry point. We'll assess where you are and give you a clear roadmap to your first $10k month." },
];

export const ECOM_PLATFORMS = [
  { name:"Shopify",     slug:"shopify",     color:"#96BF48" },
  { name:"WooCommerce", slug:"woocommerce", color:"#96588A" },
  { name:"Magento",     slug:"magento",     color:"#EE672F" },
  { name:"BigCommerce", slug:"bigcommerce", color:"#34313F" },
  { name:"Wix",         slug:"wix",         color:"#FAAD4D" },
  { name:"Squarespace", slug:"squarespace", color:"#ffffff" },
  { name:"PrestaShop",  slug:"prestashop",  color:"#DF0067" },
  { name:"OpenCart",    slug:"opencart",    color:"#23AADF" },
  { name:"Ecwid",       slug:"ecwid",       color:"#FF6A00" },
];

export const AD_PLATFORMS = [
  { name:"Meta Ads",     slug:"meta",      color:"#0081FB" },
  { name:"TikTok Ads",   slug:"tiktok",    color:"#ffffff" },
  { name:"Google Ads",   slug:"google",    color:"#4285F4" },
  { name:"Pinterest Ads",slug:"pinterest", color:"#BD081C" },
  { name:"Snapchat Ads", slug:"snapchat",  color:"#FFFC00" },
  { name:"YouTube Ads",  slug:"youtube",   color:"#FF0000" },
  { name:"X Ads",        slug:"x",         color:"#ffffff" },
  { name:"LinkedIn Ads", slug:"linkedin",  color:"#0A66C2" },
  { name:"Amazon Ads",   slug:"amazon",    color:"#FF9900" },
];

export const PARTNERS = [
  { name:"Meta",         slug:"meta",        color:"#0081FB" },
  { name:"Google",       slug:"google",      color:"#4285F4" },
  { name:"TikTok",       slug:"tiktok",      color:"#ffffff" },
  { name:"Shopify",      slug:"shopify",     color:"#96BF48" },
  { name:"Klaviyo",      slug:"klaviyo",     color:"#FFD700" },
  { name:"Triple Whale", slug:"triplewhale", color:"#7B68EE" },
];

export const VIDEO_TIPS = [
  { tag:"Checkout Tip",  title:"Why your checkout loses 40% of buyers",        desc:"The #1 mistake e-commerce stores make that kills conversions.",  videoId:"HcNzgUUQI5g", thumb:"https://i.ytimg.com/vi/HcNzgUUQI5g/hqdefault.jpg" },
  { tag:"Ad Strategy",   title:"How to cut your Meta CPA in half",             desc:"A simple audience restructure most agencies overlook.",           videoId:"SklDEDMQmmY", thumb:"https://i.ytimg.com/vi/SklDEDMQmmY/hqdefault.jpg" },
  { tag:"Store Audit",   title:"5 things we check in every store audit",       desc:"The exact checklist we use to find where your store leaks money.", videoId:"vxmXlxLjDRY", thumb:"https://i.ytimg.com/vi/vxmXlxLjDRY/hqdefault.jpg" },
  { tag:"ROAS Explained",title:"What a 4x ROAS actually looks like",            desc:"Real numbers, breaking down what makes ads profitable.",           videoId:"UQGUkS8H-44", thumb:"https://i.ytimg.com/vi/UQGUkS8H-44/hqdefault.jpg" },
  { tag:"Email Flow",    title:"The abandoned cart sequence that recovers 20%", desc:"3 emails, exact timing, exact copy. Free to implement today.",    videoId:"fvbex4WkncE", thumb:"https://i.ytimg.com/vi/fvbex4WkncE/hqdefault.jpg" },
];