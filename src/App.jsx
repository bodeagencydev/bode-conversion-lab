import { useEffect, useState } from "react";

const EMAIL = "bodeagencyofficial@gmail.com";
const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://bodeconversionlab.vercel.app").replace(/\/$/, "");
const services = [
  { slug: "store-optimization", title: "Store optimization", kicker: "A better buying experience", summary: "Remove the friction between a customer discovering your product and feeling confident enough to buy it.", detail: "We examine the store as a customer experiences it: the first impression, product information, navigation, mobile usability, trust, cart and checkout. Recommendations are prioritized by customer impact and practical effort, not by how many changes can be listed in an audit.", deliverables: ["Store and customer-journey review", "Product-page and merchandising improvements", "Mobile usability and navigation review", "Trust, cart and checkout friction review", "Prioritized implementation plan"], fit: "For stores with traffic or customer interest that are not converting as consistently as they should.", visual: "store" },
  { slug: "paid-advertising", title: "Paid advertising", kicker: "A more considered way to acquire customers", summary: "Build campaigns around the offer, the customer and the experience that follows the click.", detail: "We connect campaign objectives with creative concepts, audience hypotheses, landing pages and measurement. Testing is structured so that the business can learn what is working instead of simply increasing spend and hoping for a better result.", deliverables: ["Campaign and account review", "Offer, audience and creative hypotheses", "Meta and Google campaign planning", "Landing-page and ad-message alignment", "Performance review and next-test priorities"], fit: "For businesses ready to measure acquisition against meaningful commercial goals.", visual: "ads" },
  { slug: "ai-product-videos", title: "AI product videos", kicker: "Creative that earns attention", summary: "Create product-focused video concepts that help customers understand the offer and feel why it matters.", detail: "Strong product creative begins with the audience, not the effect. We develop concepts around customer motivations, product use, visual proof and a clear message, then shape the output for the intended channel and campaign.", deliverables: ["Creative direction and concept development", "Product-led short-form video", "UGC-style ad concepts", "Multiple hooks and creative variations", "Channel-ready formats and delivery"], fit: "For brands that need a stronger stream of creative to explain products and test new angles.", visual: "creative" },
  { slug: "seo-product-visibility", title: "SEO and product visibility", kicker: "Make discovery easier", summary: "Improve how search engines and potential customers understand your products and pages.", detail: "We review the technical and on-page foundations that help a store get discovered. Work may include indexability, product information, page structure, internal linking, search snippets and product-feed quality, depending on the platform and issue.", deliverables: ["Technical and on-page SEO review", "Product title and description improvements", "Indexing and crawlability checks", "Google Merchant Center and feed review", "Search visibility priorities"], fit: "For businesses that want to strengthen organic discovery and product presentation across search surfaces.", visual: "search" },
  { slug: "email-retention", title: "Email and retention", kicker: "Give customers a reason to return", summary: "Make useful, timely communication part of the customer experience, not an afterthought.", detail: "Retention work starts with the customer lifecycle and the messages that help people make a decision, use a product or return when the timing is right. We prioritize useful communication and clear measurement over sending more messages for its own sake.", deliverables: ["Lifecycle and existing-flow review", "Welcome and abandoned-cart journeys", "Post-purchase communication", "Win-back and repeat-purchase ideas", "Segmentation and reporting recommendations"], fit: "For stores that want to make better use of existing customer relationships.", visual: "retention" },
  { slug: "analytics-tracking", title: "Analytics and tracking", kicker: "Know what the numbers mean", summary: "Improve the quality of the information used to make marketing and store decisions.", detail: "We review the events, platforms and reports used to understand customer behaviour. The aim is a measurement setup that is useful, proportionate and clear about what it can and cannot tell you.", deliverables: ["Analytics and conversion-event review", "Pixel and tag configuration checks", "Funnel and attribution limitations review", "Reporting aligned to business questions", "Practical measurement recommendations"], fit: "For teams that need more confidence in the data behind their next decision.", visual: "analytics" }
];

const work = [
  { slug: "novi-good-store", name: "Novi Good Store", metric: "4.3× ROAS · $57k sales", video: "/proof/Videoproof2.mp4", poster: "/proof/thumbs/novigood.jpg", context: "A performance record carried forward from previous site material. Supporting reporting and the measurement period should be confirmed before making a more detailed public claim." },
  { slug: "robin-and-roobaby", name: "Robin and Roobaby", metric: "$77k sales", video: "/proof/Videoproof5.mp4", poster: "/proof/thumbs/robinroobaby.jpg", context: "A sales figure carried forward from previous site material. The source records and measurement period should be confirmed before making a more detailed public claim." },
  { slug: "stream-ride-store", name: "Stream Ride Store", metric: "$36k sales", video: "/proof/Videoproof1.mp4", poster: "/proof/thumbs/streamride.jpg", context: "A sales figure carried forward from previous site material. The source records and measurement period should be confirmed before making a more detailed public claim." }
];

const faqs = [
  ["Which ecommerce platforms do you work with?", "We work across Shopify, WooCommerce, Wix, BigCommerce and custom storefronts. The right approach depends on your platform, goals and the problem being solved."],
  ["Can I hire Bode for one service?", "Yes. Projects can begin with a defined audit, creative package, implementation project or marketing service. Wider ongoing work is considered when it makes sense."],
  ["Do you guarantee sales or a specific ROAS?", "No. Results depend on the product, offer, margins, market, budget, customer demand and measurement. We agree on scope and reporting before work starts."],
  ["How does pricing work?", "Pricing depends on the scope, complexity and level of support. After understanding the project, we provide a clear scope and quote before work begins."],
  ["Can you work with an international business?", "Yes. Remote projects can be managed with clear communication, agreed working arrangements, documented approvals and reporting."],
  ["What happens after I send an enquiry?", "We review the information and determine whether the project fits our capabilities. If it does, the next step is a conversation about priorities, scope and timing."]
];

const pages = {
  "/": { title: "Ecommerce growth, built around the customer", description: "Bode Conversion Lab helps ecommerce businesses improve store experience, advertising, creative, product visibility and retention." },
  "/services": { title: "Services", description: "Explore store optimization, paid advertising, AI product videos, SEO, retention and analytics services from Bode Conversion Lab." },
  "/store-optimization": { title: "Store optimization", description: "Improve product pages, mobile usability, trust signals and the customer journey with Bode Conversion Lab." },
  "/paid-advertising": { title: "Paid advertising", description: "Connect campaign strategy, creative testing, landing pages and measurement with Bode Conversion Lab." },
  "/ai-product-videos": { title: "AI product videos", description: "Product-focused short-form video, UGC-style ad concepts and creative variations from Bode Conversion Lab." },
  "/seo-product-visibility": { title: "SEO and product visibility", description: "Improve technical SEO, product information, indexing and product-feed quality with Bode Conversion Lab." },
  "/email-retention": { title: "Email and retention", description: "Build useful lifecycle communication, abandoned-cart flows and repeat-purchase journeys with Bode Conversion Lab." },
  "/analytics-tracking": { title: "Analytics and tracking", description: "Review conversion events, pixels, analytics and reporting to make more informed ecommerce decisions." },
  "/work": { title: "Selected work", description: "Explore selected creative and performance records from Bode Conversion Lab." },
  "/about": { title: "About Bode Conversion Lab", description: "Learn about Bode Conversion Lab's practical, evidence-led approach to ecommerce growth." },
  "/contact": { title: "Contact", description: "Tell Bode Conversion Lab about your ecommerce business, project and priorities." },
  "/privacy": { title: "Privacy policy", description: "Read how Bode Conversion Lab handles information submitted through its website." }
};

function Header({ path }) {
  const [open, setOpen] = useState(false);
  const nav = [["Services", "/services"], ["Selected work", "/work"], ["About", "/about"]];
  return <header className="header">
    <a className="brand" href="/" aria-label="Bode Conversion Lab home"><img src="/logo-mark.png" alt="" /><span><b>BODE</b><small>CONVERSION LAB</small></span></a>
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"}>{open ? "Close" : "Menu"}</button>
    <nav className={open ? "nav nav-open" : "nav"} aria-label="Main navigation">
      {nav.map(([label, href]) => <a key={href} className={path === href ? "nav-current" : ""} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav-contact" href="/contact" onClick={() => setOpen(false)}>Discuss a project</a>
    </nav>
  </header>;
}

function Footer() {
  return <footer className="footer">
    <div className="footer-top"><a className="brand brand-footer" href="/"><img src="/logo-mark.png" alt="" /><span><b>BODE</b><small>CONVERSION LAB</small></span></a><p>Better store experiences. More considered marketing. Clearer decisions.</p><a className="footer-email" href={"mailto:" + EMAIL}>{EMAIL}</a></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Bode Conversion Lab</span><div><a href="/services">Services</a><a href="/work">Work</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a></div><span>Built around the customer.</span></div>
  </footer>;
}

function Eyebrow({ children }) { return <p className="eyebrow">{children}</p>; }
function PageIntro({ eyebrow, title, text, className = "" }) {
  return <section className={"page-intro " + className}><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{text && <p className="intro-text">{text}</p>}</section>;
}
function ServiceRows({ compact = false }) {
  return <div className={compact ? "service-rows service-rows-compact" : "service-rows"}>{services.map((s, i) => <a className="service-row" href={"/" + s.slug} key={s.slug}><span className="row-num">0{i + 1}</span><div><h3>{s.title}</h3><p>{s.summary}</p></div><span className="row-label">Explore service</span></a>)}</div>;
}
function WorkCards({ limit }) {
  const list = typeof limit === "number" ? work.slice(0, limit) : work;
  return <div className="work-grid">{list.map((item, i) => <article className="work-card" key={item.slug}><a className="work-image" href={"/work/" + item.slug}><video muted playsInline preload="none" poster={item.poster} aria-label={item.name}><source src={item.video} type="video/mp4" /></video><span className="work-number">0{i + 1}</span></a><div className="work-card-info"><div><p className="small-cap">Selected record</p><h3><a href={"/work/" + item.slug}>{item.name}</a></h3></div><strong>{item.metric}</strong></div></article>)}</div>;
}
function ContactCallout({ title = "Let's talk about the work.", text = "Tell us what you are trying to improve. We will start with the business problem, not a preselected package." }) {
  return <section className="contact-callout"><div><Eyebrow>START A CONVERSATION</Eyebrow><h2>{title}</h2><p>{text}</p></div><a className="button button-light" href="/contact">Discuss your project</a></section>;
}

function Home() {
  return <>
    <section className="home-hero">
      <div className="hero-copy"><Eyebrow>ECOMMERCE GROWTH · STORE EXPERIENCE · MARKETING</Eyebrow><h1>Make every part of the customer journey <em>work harder.</em></h1><p className="hero-lede">Bode Conversion Lab helps ecommerce businesses improve how they sell, how they reach customers and what they learn from the results.</p><div className="hero-actions"><a className="button button-dark" href="/contact">Discuss your store</a><a className="plain-link" href="/services">Explore our services</a></div><p className="hero-note">Platform independent. Built around your business.</p></div>
      <div className="hero-composition"><div className="composition-head"><span>THE CUSTOMER JOURNEY</span><span>01 / 04</span></div><div className="journey-item"><span>01</span><div><b>Store experience</b><small>Can customers buy with confidence?</small></div></div><div className="journey-item"><span>02</span><div><b>Acquisition</b><small>Are we reaching the right people?</small></div></div><div className="journey-item"><span>03</span><div><b>Retention</b><small>Is there a reason to return?</small></div></div><div className="journey-item journey-last"><span>04</span><div><b>Measurement</b><small>What should happen next?</small></div></div><p className="composition-foot">One connected plan. Clear priorities. Work you can inspect.</p></div>
    </section>
    <section className="platform-strip"><span>WORKING ACROSS YOUR STOREFRONT</span><div><b>Shopify</b><b>WooCommerce</b><b>Wix</b><b>BigCommerce</b><b>Custom platforms</b></div></section>
    <section className="section problem-section"><div className="section-title"><Eyebrow>START WITH THE REAL PROBLEM</Eyebrow><h2>More activity is not always the answer.</h2><p>Before increasing spend or adding another tool, understand where the customer journey is breaking down.</p></div><div className="problem-points"><article><span>01</span><div><h3>People visit, but do not buy.</h3><p>Review product pages, mobile experience, trust signals and checkout friction.</p></div></article><article><span>02</span><div><h3>Marketing spend lacks a clear answer.</h3><p>Connect campaign goals, creative tests, landing pages and reliable measurement.</p></div></article><article><span>03</span><div><h3>Customers buy once and disappear.</h3><p>Build relevant follow-up, post-purchase communication and retention flows.</p></div></article></div></section>
    <section className="section services-home"><div className="section-title section-title-wide"><div><Eyebrow>WHAT WE DO</Eyebrow><h2>Bring the important parts of growth into one plan.</h2></div><p>Start with the challenge that matters most. Connect other services when the evidence says they belong in the plan.</p></div><ServiceRows compact /><a className="underlined-link" href="/services">View all services</a></section>
    <section className="dark-band"><div className="dark-band-copy"><Eyebrow>HOW WE WORK</Eyebrow><h2>Clear thinking before busy work.</h2><p>We agree on the problem, scope and how progress will be judged before the work starts.</p></div><div className="process-list"><article><span>01</span><div><h3>Understand the business</h3><p>Learn what you sell, who buys it and what success needs to look like.</p></div></article><article><span>02</span><div><h3>Find the constraint</h3><p>Review the customer journey and available data, then prioritize what matters.</p></div></article><article><span>03</span><div><h3>Make and review changes</h3><p>Work to an agreed scope, with clear ownership and approval before launch.</p></div></article><article><span>04</span><div><h3>Measure and improve</h3><p>Explain what changed, what the data says and what should happen next.</p></div></article></div></section>
    <section className="section work-home"><div className="section-title section-title-wide"><div><Eyebrow>SELECTED WORK</Eyebrow><h2>Evidence belongs in the open.</h2></div><p>Explore selected creative and performance records. Claims are not expanded beyond the information currently available.</p></div><WorkCards limit={3}/><a className="underlined-link" href="/work">Explore selected work</a><p className="disclaimer">Previously supplied performance figures should be supported by source records and measurement periods before being used as verified case-study claims.</p></section>
    <section className="creative-feature"><div className="creative-feature-copy"><Eyebrow>CREATIVE PRODUCTION</Eyebrow><h2>Make the product matter before you ask for the sale.</h2><p>Product-focused creative starts with what customers care about, what they need to see and what makes the offer relevant.</p><a className="button button-light" href="/ai-product-videos">Explore product video</a></div><div className="creative-frame"><video controls playsInline preload="metadata" poster="/og-image.png" controlsList="nodownload" aria-label="Bode creative portfolio sample"><source src="/bode_final_1080p.mp4" type="video/mp4" />Your browser does not support embedded video.</video><span>SELECTED CREATIVE WORK</span></div></section>
    <section className="section about-teaser"><div className="about-symbol"><img src="/logo-mark.png" alt="" /></div><div><Eyebrow>ABOUT BODE CONVERSION LAB</Eyebrow><h2>Practical work. Clear ownership. No mystery process.</h2><p>We bring store improvement, marketing execution, creative production and performance analysis together around the needs of each business.</p><a className="underlined-link" href="/about">Learn about our approach</a></div></section>
    <section className="section faq-home"><div className="section-title"><Eyebrow>BEFORE YOU START</Eyebrow><h2>Useful answers, without the sales script.</h2></div><FAQList items={faqs.slice(0, 4)} /></section>
    <ContactCallout />
  </>;
}

function FAQList({ items = faqs }) { return <div className="faq-list">{items.map(([q, a], i) => <details key={q}><summary><span>0{i + 1}</span><b>{q}</b><i aria-hidden="true">+</i></summary><p>{a}</p></details>)}</div>; }

function ServicesPage() {
  return <><PageIntro eyebrow="OUR SERVICES" title="The right work starts with the right problem." text="Choose a specific area to improve, or bring us the wider challenge. We will help define the work around your business, platform and goals."/><section className="section services-page-section"><ServiceRows /><div className="note-panel"><h2>Not sure where to start?</h2><p>Begin with the business problem and what you can currently measure. We can help identify the most useful first step.</p><a className="underlined-link" href="/contact">Talk through your priorities</a></div></section><ContactCallout title="Start with what needs to change." /></>;
}

function ServicePage({ service }) {
  return <><PageIntro eyebrow={"SERVICE / " + service.title.toUpperCase()} title={service.kicker + "."} text={service.summary}/><section className="service-detail"><div className={"service-visual visual-" + service.visual}><span className="visual-label">BODE CONVERSION LAB</span><div className="visual-large">{service.title}</div><div className="visual-rule"></div><p>Customer first. Evidence led. Built for the real world.</p></div><div className="service-detail-copy"><Eyebrow>OUR APPROACH</Eyebrow><h2>Useful changes, not activity for its own sake.</h2><p>{service.detail}</p><p>{service.fit}</p><a className="button button-dark" href="/contact">Discuss this service</a></div></section><section className="section deliverables"><div className="section-title"><Eyebrow>WHAT THE WORK CAN INCLUDE</Eyebrow><h2>A clear scope, tailored to the situation.</h2><p>The final deliverables depend on the platform, access, priorities and project agreement.</p></div><ul>{service.deliverables.map((d, i) => <li key={d}><span>0{i + 1}</span>{d}</li>)}</ul></section><section className="related-services"><div className="section-title"><Eyebrow>CONNECTED CAPABILITIES</Eyebrow><h2>Sometimes one fix reveals the next.</h2></div><ServiceRows compact /></section><ContactCallout title="Let's define the right scope." text="Share your store or website and the challenge you want to solve. We will start from there." /></>;
}

function WorkPage() {
  return <><PageIntro eyebrow="SELECTED WORK" title="Creative and performance records, presented with context." text="Explore selected project records and portfolio videos. We distinguish material available for review from claims that still need supporting documentation."/><section className="section work-page"><WorkCards /><div className="evidence-note"><h2>How to read these records</h2><p>Performance figures previously supplied for this website are shown as historical records, not guarantees. Before publishing detailed case studies, Bode should confirm the source reports, attribution method, measurement period, client permission and the specific work delivered.</p></div></section><ContactCallout title="Have a similar challenge?" /></>;
}

function CaseStudy({ item }) {
  return <><PageIntro eyebrow="SELECTED RECORD / " title={item.name} text="A portfolio record retained from earlier site material. The supporting evidence needs to be confirmed before a detailed case study can responsibly be published."/><section className="section case-study"><div className="case-video"><video controls playsInline preload="metadata" poster={item.poster} controlsList="nodownload" aria-label={"Portfolio record for " + item.name}><source src={item.video} type="video/mp4" />Your browser does not support embedded video.</video></div><div className="case-summary"><Eyebrow>REPORTED FIGURE</Eyebrow><h2>{item.metric}</h2><p>{item.context}</p><p>We are not adding a claim about the strategy, time period or contribution until that information can be substantiated.</p></div></section><ContactCallout title="Discuss the problem behind your numbers." /></>;
}

function AboutPage() {
  return <><PageIntro eyebrow="ABOUT BODE CONVERSION LAB" title="Practical work, built around how customers decide." text="Bode Conversion Lab connects store experience, marketing execution, creative production and performance analysis around the needs of each business."/><section className="section about-detail"><div className="about-symbol"><img src="/logo-mark.png" alt="" /></div><div><Eyebrow>OUR WORKING PRINCIPLES</Eyebrow><h2>Clear priorities. Honest reporting. Work you can inspect.</h2><p>We start by understanding the business and the customer journey. Then we identify the constraints that matter, agree on a scope and define how progress will be evaluated.</p><p>Recommendations should be understandable. Deliverables should be clear. Results should be described with the context needed to interpret them. We do not treat more activity, more tools or more complicated reports as proof of progress.</p></div></section><section className="section principles"><article><span>01</span><h3>Understand before recommending</h3><p>Context matters. We look at the product, customer, platform, offer and current information before suggesting a plan.</p></article><article><span>02</span><h3>Make the work visible</h3><p>Scopes, deliverables and responsibilities are agreed clearly so you know what is being done and why.</p></article><article><span>03</span><h3>Be honest about evidence</h3><p>We distinguish what is measured, what is assumed and what still needs to be tested.</p></article></section><ContactCallout title="Tell us what you are building." /></>;
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", website: "", platform: "Not sure yet", priority: "Improve store conversion", details: "" });
  const [submission, setSubmission] = useState({ state: "idle", message: "" });
  async function submit(e) {
    e.preventDefault();
    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
    const body = ["Name: " + form.name, "Business email: " + form.email, "Website: " + form.website, "Platform: " + form.platform, "Priority: " + form.priority, "", "Project details:", form.details].join("\n");
    if (endpoint) {
      setSubmission({ state: "sending", message: "Sending your enquiry…" });
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...form, _subject: "Project enquiry from " + form.name })
        });
        if (!response.ok) throw new Error("Submission failed");
        setSubmission({ state: "success", message: "Your enquiry has been submitted. Bode Conversion Lab can now follow up using the email you provided." });
        setForm({ name: "", email: "", website: "", platform: "Not sure yet", priority: "Improve store conversion", details: "" });
      } catch {
        setSubmission({ state: "error", message: "Your enquiry could not be submitted. Please email " + EMAIL + " directly instead." });
      }
      return;
    }
    setSubmission({ state: "fallback", message: "Your email application should open with a draft. Review it and send it to complete your enquiry. If no email application opens, contact " + EMAIL + " directly." });
    window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Project enquiry from " + form.name) + "&body=" + encodeURIComponent(body);
  }
  return <><PageIntro eyebrow="CONTACT" title="Tell us what you want to improve." text="Share the context, the challenge and what a useful outcome would look like. We will use that information to assess whether the project is a fit."/><section className="contact-layout"><div className="contact-sidebar"><Eyebrow>PROJECT ENQUIRIES</Eyebrow><h2>Start with the business problem.</h2><p>There is no need to have every answer ready. Tell us what you know, and we can identify the questions that matter next.</p><div className="contact-email-block"><span>Prefer email?</span><a href={"mailto:" + EMAIL}>{EMAIL}</a></div><p className="form-privacy">{import.meta.env.VITE_FORMSPREE_ENDPOINT ? "This form sends your enquiry through the configured form processor. See the privacy policy for details." : "Without an online form processor configured, this form opens an email draft and does not submit or store your details on this website."}</p></div><form className="contact-form" onSubmit={submit} aria-busy={submission.state === "sending"}><div className="form-top"><span>PROJECT ENQUIRY</span><span>01 / 06</span></div><label>Your name<input required autoComplete="name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Name"/></label><label>Business email<input required type="email" autoComplete="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="you@company.com"/></label><label>Website or store URL<input type="url" value={form.website} onChange={e => setForm({...form, website:e.target.value})} placeholder="https://yourstore.com"/></label><div className="form-two"><label>Platform<select value={form.platform} onChange={e => setForm({...form, platform:e.target.value})}>{["Not sure yet","Shopify","WooCommerce","Wix","BigCommerce","Custom","Other"].map(v=><option key={v}>{v}</option>)}</select></label><label>Main priority<select value={form.priority} onChange={e => setForm({...form, priority:e.target.value})}>{["Improve store conversion","Paid advertising","Product creative","SEO and product visibility","Email and retention","Analytics and tracking","Not sure yet"].map(v=><option key={v}>{v}</option>)}</select></label></div><label>Tell us a little more<textarea rows="4" value={form.details} onChange={e => setForm({...form, details:e.target.value})} placeholder="What are you trying to improve?"/></label><button className="button button-dark" type="submit" disabled={submission.state === "sending"}>{submission.state === "sending" ? "Sending enquiry…" : import.meta.env.VITE_FORMSPREE_ENDPOINT ? "Send project enquiry" : "Prepare enquiry email"}</button><p className="form-note" role="status" aria-live="polite">{submission.message || (import.meta.env.VITE_FORMSPREE_ENDPOINT ? "Your details will be sent securely to the configured form processor." : "This form prepares an email draft. It does not submit or store your details on this website.")}</p></form></section></>;
}

function PrivacyPage() {
  return <><PageIntro eyebrow="PRIVACY" title="A straightforward approach to your information." text="This page explains the current behaviour of the Bode Conversion Lab website. It should be reviewed and updated if additional data collection or third-party services are introduced."/><section className="section privacy-content"><h2>Information you provide</h2><p>When no online form processor is configured, the contact form prepares an email draft in your own email application and the website does not submit or store its fields. If online form processing is enabled, the information entered is sent to the configured form provider so Bode Conversion Lab can receive the enquiry. If you send an email directly, Bode Conversion Lab receives the information you choose to include and may use it to respond.</p><h2>Information collected automatically</h2><p>The current public website does not intentionally run the previous visitor-tracking scripts removed during the rebuild. The hosting provider may process standard technical request information to deliver and secure the site. Check the hosting provider's current terms for details.</p><h2>Third-party services</h2><p>Portfolio videos are served from this website. The site loads fonts from Google Fonts. If online form processing is enabled, the configured form provider will also process the information submitted through the contact form under its own privacy terms. These providers may receive technical information needed to deliver their services.</p><h2>Retention and requests</h2><p>If you email Bode, your message may be retained as needed to handle the enquiry and maintain business records. To ask a question about information you have sent, email <a href={"mailto:" + EMAIL}>{EMAIL}</a>.</p><h2>Changes to this page</h2><p>This page must be updated if the website adds a live form processor, analytics, advertising pixels, chat, newsletter sign-up or other data collection. This is a plain-language summary, not legal advice.</p></section></>;
}

function NotFound() { return <PageIntro eyebrow="PAGE NOT FOUND" title="This page could not be found." text="The address may have changed. Use the navigation to find a service, explore our work or contact Bode Conversion Lab."/>; }

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const caseRecord = path.startsWith("/work/") ? work.find(w => "/work/" + w.slug === path) : null;
  const current = pages[path] || (caseRecord ? {
    title: caseRecord.name + " portfolio record",
    description: "Review the available portfolio record for " + caseRecord.name + " from Bode Conversion Lab, with context on historical performance figures."
  } : services.find(s => "/" + s.slug === path) ? {
    title: services.find(s => "/" + s.slug === path).title,
    description: services.find(s => "/" + s.slug === path).summary
  } : { title: "Page not found", description: "The requested page could not be found on Bode Conversion Lab." });
  useEffect(() => {
    document.title = (current.title ? current.title + " | " : "") + "Bode Conversion Lab";
    let desc = document.querySelector('meta[name="description"]');
    if (desc && current.description) desc.setAttribute("content", current.description);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", SITE_URL + path);
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", document.title);
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", SITE_URL + path);
  }, [path, current.title, current.description]);

  let content;
  if (path === "/") content = <Home />;
  else if (path === "/services") content = <ServicesPage />;
  else if (path === "/work") content = <WorkPage />;
  else if (path === "/about") content = <AboutPage />;
  else if (path === "/contact") content = <ContactPage />;
  else if (path === "/privacy") content = <PrivacyPage />;
  else if (path.startsWith("/work/")) {
    const item = work.find(w => "/work/" + w.slug === path);
    content = item ? <CaseStudy item={item}/> : <NotFound/>;
  } else {
    const service = services.find(s => "/" + s.slug === path);
    content = service ? <ServicePage service={service}/> : <NotFound/>;
  }

  return <div className={"site-shell" + (path === "/contact" ? " contact-route" : "")}><a className="skip-link" href="#main">Skip to content</a><Header path={path}/><main id="main">{content}</main><Footer/>{path !== "/contact" && <a className="mobile-sticky-cta" href="/contact">Discuss your project </a>}</div>;
}
