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
  { icon: "01", title: "Shopify Partner",    sub: "Partner ID: 4385075",         color: "#96BF48" },
  { icon: "02", title: "4 Years Operator",   sub: "Ran pinkiceessentials",        color: "#00ff88" },
  { icon: "03", title: "ROAS Engineering",   sub: "Not just ad management",       color: "#00ff88" },
  { icon: "04", title: "Full Funnel Audits", sub: "Store + Ads + Checkout",       color: "#FFD700" },
  { icon: "05", title: "90-Day Results",     sub: "$1k → $70k proven system",     color: "#00ff88" },
];

export const TESTIMONIALS = [
  {
    init:"MT", name:"Marcus T.", role:"Shopify Store Owner", result:"$1.2k → $38k/mo", rating:5,
    text:"A colleague kept telling me about their SRS strategy, so I finally gave it a shot. I'd been running ads for 2 years with nothing to show for it. Three months into the Sales Recovery System, my ROAS went from 0.8x to 6.2x. The store rebuild alone doubled my conversion rate.",
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
  { id:"store-audit",   icon:"01", title:"Store Audit",      tagline:"Find every leak in 48hrs",      desc:"We dissect your store, ads, and full funnel. Every friction point mapped, every missed dollar identified. Delivered as a 30-page action report.", bullets:["Full store speed analysis","Checkout friction mapping","Ad account audit","30-page action report","1x 90-min strategy call"], color:"#00ff88", price:"$497",          link:"/pricing",
    seoTitle:"Shopify Store Audit Service", seoDesc:"A full technical and conversion audit of your Shopify store, ads, and funnel — delivered as a 30-page action report showing exactly what's costing you sales.",
    process:["We scan your store, ads, and checkout end-to-end","Every friction point gets mapped and prioritized by revenue impact","You get a 30-page report plus a live strategy call to walk through it"] },
  { id:"ad-management", icon:"02", title:"Ad Management",    tagline:"Ads that compound monthly",     desc:"Precision creatives, copy and targeting built around your customer's real pain points. We don't run ads — we engineer ROAS.", bullets:["Meta & TikTok campaigns","Creative strategy & copy","Audience segmentation","Weekly performance reports","Monthly strategy reviews"], color:"#0081FB", price:"From $2,000/mo", link:"/pricing",
    seoTitle:"Ecommerce Ad Management Agency", seoDesc:"Meta and TikTok ad management built around ROAS, not vanity metrics. Creative strategy, audience segmentation, and weekly reporting for e-commerce brands.",
    process:["We audit your existing ad account and customer data","We build and test creative angles based on real buyer objections","We scale what works and report on ROAS weekly, not just spend"] },
  { id:"cro",           icon:"03", title:"CRO Optimization", tagline:"Convert more existing traffic", desc:"We rebuild your pages with one goal: turning browsers into buyers. Speed, layout, copy, trust signals — everything optimized.", bullets:["Product page rebuilds","Checkout optimization","Mobile speed fixes","A/B testing setup","Trust signal implementation"], color:"#FF9900", price:"From $2,000/mo", link:"/pricing",
    seoTitle:"Shopify Conversion Rate Optimization (CRO)", seoDesc:"Turn more of your existing traffic into buyers. Product page rebuilds, checkout optimization, and mobile speed fixes for Shopify stores.",
    process:["We identify exactly where visitors are dropping off","We rebuild the highest-impact pages first — product, cart, checkout","We test changes against real traffic, not guesses"] },
  { id:"landing-pages", icon:"04", title:"Landing Pages",    tagline:"Pages built to convert",        desc:"Custom landing pages designed for your paid traffic. Every element engineered to convert cold traffic into customers.", bullets:["Custom page design","Mobile-first build","Fast load times","Conversion copywriting","Split testing ready"], color:"#BD081C", price:"From $2,000/mo", link:"/pricing",
    seoTitle:"Ecommerce Landing Page Design", seoDesc:"Custom-built landing pages designed specifically for paid traffic — fast, mobile-first, and built to convert cold visitors into customers.",
    process:["We map your offer to what cold traffic actually needs to see first","We design and build a page focused on one conversion action","We set it up split-test ready from day one"] },
  { id:"email-flows",   icon:"05", title:"Email Flows",      tagline:"Revenue while you sleep",      desc:"Abandoned cart, post-purchase, win-back — we build the sequences that recover revenue 24/7 without spending more on ads.", bullets:["Abandoned cart sequence","Post-purchase flow","Win-back campaign","Welcome series","Klaviyo setup & management"], color:"#FFD700", price:"From $2,000/mo", link:"/pricing",
    seoTitle:"Ecommerce Email Marketing & Klaviyo Flows", seoDesc:"Abandoned cart, post-purchase, and win-back email flows built to recover revenue automatically — Klaviyo setup and management for Shopify stores.",
    process:["We audit your current email flows (or build from zero)","We build the core revenue flows: cart, post-purchase, win-back","We monitor and refine based on real open/click/revenue data"] },
  { id:"seo",           icon:"06", title:"SEO & Organic Growth", tagline:"Traffic that doesn't stop when ad spend does", desc:"Technical SEO, on-page optimization, and content strategy built to get your store found without paying for every visitor.", bullets:["Full technical SEO audit","On-page + blog content strategy","Backlink outreach","Keyword & competitor research","Monthly ranking reports"], color:"#4285F4", price:"From $1,500/mo", link:"/pricing",
    seoTitle:"Shopify SEO Agency", seoDesc:"Technical SEO, content strategy, and backlink outreach for Shopify stores — built to get found on Google without relying entirely on ad spend.",
    process:["We run a full technical SEO audit of your store","We fix the technical issues and build a content/keyword plan","We execute the plan and report on real ranking movement monthly"] },
  { id:"sms-marketing", icon:"07", title:"SMS Marketing",    tagline:"The channel with no algorithm to fight", desc:"Cart abandonment texts, flash sale blasts, and list growth — SMS converts higher than email for stores that use it right.", bullets:["Cart abandonment texts","VIP/flash sale campaigns","List growth via popups","Compliance & deliverability setup","Monthly performance reports"], color:"#25D366", price:"From $1,200/mo", link:"/pricing",
    seoTitle:"Ecommerce SMS Marketing Agency", seoDesc:"SMS marketing for Shopify stores — cart abandonment texts, flash sale campaigns, and list growth built for high open and conversion rates.",
    process:["We set up compliant SMS collection across your store","We build abandonment and campaign flows tailored to your audience","We manage sends and report on real revenue attributed to SMS"] },
  { id:"retention",     icon:"08", title:"Retention & Loyalty", tagline:"Your cheapest customer is a repeat one", desc:"Loyalty programs, win-back campaigns, and subscription flows built to turn one-time buyers into repeat customers.", bullets:["Loyalty/rewards program setup","Win-back campaigns","Subscription/repeat-purchase flows","Customer segmentation","Retention rate reporting"], color:"#9C6ADE", price:"From $1,500/mo", link:"/pricing",
    seoTitle:"Ecommerce Customer Retention & Loyalty Programs", seoDesc:"Loyalty programs, win-back campaigns, and subscription flows built to increase repeat purchase rate for Shopify stores.",
    process:["We analyze your current repeat purchase rate and customer segments","We build a loyalty/retention system matched to your customer behavior","We track and report on repeat rate and customer lifetime value"] },
  { id:"tracking",      icon:"09", title:"Tracking & Analytics", tagline:"Know what's actually working", desc:"GA4, pixel, and server-side tracking setup — so you're making decisions on real data, not guesses, especially post-iOS14.", bullets:["GA4 + Meta/TikTok pixel setup","Server-side tracking (post-iOS14)","Attribution reporting dashboard","UTM & campaign structure cleanup","Ongoing tracking audits"], color:"#F4B400", price:"From $997", link:"/pricing",
    seoTitle:"Ecommerce Tracking & Analytics Setup", seoDesc:"GA4, Meta and TikTok pixel, and server-side tracking setup for Shopify stores — accurate attribution data even after iOS14 tracking changes.",
    process:["We audit your current tracking setup for gaps and data loss","We implement GA4, pixels, and server-side tracking correctly","We build a simple dashboard so you can see what's actually working"] },
  { id:"store-setup",   icon:"10", title:"Store Setup & Migration", tagline:"Start right, or move without losing data", desc:"Migrating to Shopify or launching fresh — theme setup, app configuration, and data migration handled end-to-end.", bullets:["Store migration to Shopify","Custom theme setup","App/integration configuration","Data migration (products, customers, orders)","Launch QA & testing"], color:"#96BF48", price:"From $1,997", link:"/pricing",
    seoTitle:"Shopify Store Setup & Migration Service", seoDesc:"Migrate to Shopify or launch a new store the right way — theme setup, app configuration, and full data migration handled end-to-end.",
    process:["We map your current store/data and plan the migration or build","We configure the theme, apps, and integrations you need","We QA everything before launch so nothing breaks on day one"] },
];

export const PAST_PROJECTS = [
  {
    id:"toothy",
    client:"Toothy",
    category:"Content Creation — Travel Oral Care",
    headline:"Video ad content for a travel oral care brand",
    summary:"Toothy makes toothpaste tablets and a bamboo toothbrush kit built for travel. Brought on to produce their video ad content from concept to final cut.",
    timeframe:"Multi-session, ongoing",
    role:"Video Ad Content Creator",
    whatIDid:[
      "Produced CGI-style science/product visuals for the ad concepts",
      "Directed and generated voiceover for each ad",
      "Assembled and edited final ad cuts ready for Meta/TikTok placement",
    ],
    toolsUsed:["Higgsfield (CGI + video generation)","ElevenLabs (voiceover)","Canva / CapCut (final edit)"],
    tags:["Video Ads","Content Production","DTC"],
  },
  {
    id:"pinkiceessentials",
    client:"pinkiceessentials",
    category:"E-commerce — Owner/Operator",
    headline:"Ran my own store for 4 years before starting this agency",
    summary:"Before advising other stores, I ran one myself. Four years of hands-on operator experience, sourcing, marketing, fulfillment, customer service, is where the actual pattern-recognition for this agency came from.",
    timeframe:"4 years",
    role:"Founder / Operator",
    whatIDid:[
      "Ran full day-to-day store operations end to end",
      "Handled marketing, fulfillment, and customer service directly",
      "Learned firsthand what actually breaks conversion and retention in a live store",
    ],
    toolsUsed:["E-commerce operations","Direct-to-consumer marketing"],
    tags:["Operator Experience","E-commerce"],
  },
  /* ── 18 reserved slots for upcoming real projects — placeholder:true
     keeps them out of the public page (see the .filter() in
     PastProjects.jsx) so visitors only ever see completed, honest
     entries. Edit these in place as real projects come in, then flip
     placeholder to false (or delete the flag) to make them go live. */
  ...Array.from({ length: 18 }, (_, i) => ({
    id: `placeholder-${i + 3}`,
    placeholder: true,
    client: "",
    category: "Awaiting Details",
    headline: "Project details coming soon",
    summary: "Reserved slot for an upcoming project — details, tools used, and any proof will go here once added.",
    timeframe: "TBD",
    role: "TBD",
    whatIDid: ["Details coming soon"],
    toolsUsed: ["TBD"],
    tags: ["Coming Soon"],
  })),
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