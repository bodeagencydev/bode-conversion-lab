import { useEffect, useState } from "react";
import ConversionStructure from "./ConversionStructure.jsx";

const EMAIL = "bodeagencyofficial@gmail.com";
const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://bodeconversionlab.vercel.app").replace(/\/$/, "");
const services = [
  { slug: "store-optimization", title: "Store optimization", kicker: "A better buying experience", summary: "Remove the friction between a customer discovering your product and feeling confident enough to buy it.", detail: "We examine the store as a customer experiences it: the first impression, product information, navigation, mobile usability, trust, cart and checkout. Recommendations are prioritized by customer impact and practical effort, not by how many changes can be listed in an audit.", deliverables: ["Store and customer-journey review", "Product-page and merchandising improvements", "Mobile usability and navigation review", "Trust, cart and checkout friction review", "Prioritized implementation plan"], fit: "For stores with traffic or customer interest that are not converting as consistently as they should.", visual: "store" },
  { slug: "paid-advertising", title: "Paid advertising", kicker: "Campaigns built around the sale", summary: "Align campaign creative and landing pages with the product and the customer you want to reach.", detail: "We review campaign structure, offer, creative and landing page together. Then we set up focused tests and report what the available results can tell us before recommending a budget change.", deliverables: ["Campaign and account review", "Offer, audience and creative hypotheses", "Meta and Google campaign planning", "Landing-page and ad-message alignment", "Performance review and next-test priorities"], fit: "For businesses ready to measure acquisition against meaningful commercial goals.", visual: "ads" },
  { slug: "ai-product-videos", title: "AI product videos", kicker: "Creative that earns attention", summary: "Create product-focused video concepts that help customers understand the offer and feel why it matters.", detail: "Strong product creative begins with the audience, not the effect. We develop concepts around customer motivations, product use, visual proof and a clear message, then shape the output for the intended channel and campaign.", deliverables: ["Creative direction and concept development", "Product-led short-form video", "UGC-style ad concepts", "Multiple hooks and creative variations", "Channel-ready formats and delivery"], fit: "For brands that need a stronger stream of creative to explain products and test new angles.", visual: "creative" },
  { slug: "seo-product-visibility", title: "SEO and product visibility", kicker: "Make discovery easier", summary: "Improve how search engines and potential customers understand your products and pages.", detail: "We review the technical and on-page foundations that help a store get discovered. Work may include indexability, product information, page structure, internal linking, search snippets and product-feed quality, depending on the platform and issue.", deliverables: ["Technical and on-page SEO review", "Product title and description improvements", "Indexing and crawlability checks", "Google Merchant Center and feed review", "Search visibility priorities"], fit: "For businesses that want to strengthen organic discovery and product presentation across search surfaces.", visual: "search" },
  { slug: "email-retention", title: "Email and retention", kicker: "Give customers a reason to return", summary: "Make useful, timely communication part of the customer experience, not an afterthought.", detail: "Retention work starts with the customer lifecycle and the messages that help people make a decision, use a product or return when the timing is right. We prioritize useful communication and clear measurement over sending more messages for its own sake.", deliverables: ["Lifecycle and existing-flow review", "Welcome and abandoned-cart journeys", "Post-purchase communication", "Win-back and repeat-purchase ideas", "Segmentation and reporting recommendations"], fit: "For stores that want to make better use of existing customer relationships.", visual: "retention" },
  { slug: "analytics-tracking", title: "Analytics and tracking", kicker: "Know what the numbers mean", summary: "Improve the quality of the information used to make marketing and store decisions.", detail: "We review the events, platforms and reports used to understand customer behaviour. The aim is a measurement setup that is useful, proportionate and clear about what it can and cannot tell you.", deliverables: ["Analytics and conversion-event review", "Pixel and tag configuration checks", "Funnel and attribution limitations review", "Reporting aligned to business questions", "Practical measurement recommendations"], fit: "For teams that need more confidence in the data behind their next decision.", visual: "analytics" }
];

const work = [
  { slug: "novi-good-store", name: "Novi Good Store", metric: "4.3× ROAS · $57k sales", video: "/proof/Videoproof2.mp4", poster: "/proof/thumbs/novigood.jpg", context: "Reported figures supplied for the project. The reporting period and attribution details were not included in the published record." },
  { slug: "robin-and-roobaby", name: "Robin and Roobaby", metric: "$77k sales", video: "/proof/Videoproof5.mp4", poster: "/proof/thumbs/robinroobaby.jpg", context: "Reported sales figure supplied for the project. The reporting period and attribution details were not included in the published record." },
  { slug: "stream-ride-store", name: "Stream Ride Store", metric: "$36k sales", video: "/proof/Videoproof1.mp4", poster: "/proof/thumbs/streamride.jpg", context: "Reported sales figure supplied for the project. The reporting period and attribution details were not included in the published record." }
];

const faqs = [
  ["Which ecommerce platforms do you work with?", "We work across Shopify, WooCommerce, Wix, BigCommerce and custom storefronts. The right approach depends on your platform, goals and the problem being solved."],
  ["Can I hire Bode for one service?", "Yes. You can start with an audit, creative project, store improvement or campaign review. We agree the scope before work begins."],
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
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"} aria-controls="primary-navigation">{open ? "Close" : "Menu"}</button>
    <nav id="primary-navigation" className={open ? "nav nav-open" : "nav"} aria-label="Main navigation">
      {nav.map(([label, href]) => <a key={href} className={path === href ? "nav-current" : ""} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav-contact" href="/contact" onClick={() => setOpen(false)}>Discuss a project</a>
    </nav>
  </header>;
}

function Footer() {
  return <footer className="footer">
    <div className="footer-top"><a className="brand brand-footer" href="/"><img src="/logo-mark.png" alt="" /><span><b>BODE</b><small>CONVERSION LAB</small></span></a><p>Store optimization, paid campaigns and product creative for ecommerce.</p><a className="footer-email" href={"mailto:" + EMAIL}>{EMAIL}</a></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Bode Conversion Lab</span><div><a href="/services">Services</a><a href="/work">Work</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a></div><span>Built around the customer.</span></div>
  </footer>;
}

function Eyebrow({ children }) { return <p className="eyebrow">{children}</p>; }
function PageIntro({ eyebrow, title, text, className = "" }) {
  return <section className={"page-intro " + className}><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{text && <p className="intro-text">{text}</p>}</section>;
}
function ServiceRows({ compact = false }) {
  return <div className={compact ? "service-rows service-rows-compact" : "service-rows"}>{services.map((s, i) => <a className="service-row" data-structure-focus={i} href={"/" + s.slug} key={s.slug}><span className="row-num">0{i + 1}</span><div><h3>{s.title}</h3><p>{s.summary}</p></div><span className="row-label">Explore service</span></a>)}</div>;
}
function WorkCards({ limit }) {
  const list = typeof limit === "number" ? work.slice(0, limit) : work;
  return <div className="work-grid">{list.map((item, i) => <article className="work-card" key={item.slug}><a className="work-image" href={"/work/" + item.slug}><video muted playsInline preload="none" poster={item.poster} aria-label={item.name}><source src={item.video} type="video/mp4" /></video><span className="work-number">0{i + 1}</span></a><div className="work-card-info"><div><p className="small-cap">Selected record</p><h3><a href={"/work/" + item.slug}>{item.name}</a></h3></div><strong>{item.metric}</strong></div></article>)}</div>;
}
function ContactCallout({ title = "Let's talk about the work.", text = "Tell us what you are trying to improve. We will shape the first conversation around that." }) {
  return <section className="contact-callout"><div><Eyebrow>START A CONVERSATION</Eyebrow><h2>{title}</h2><p>{text}</p></div><a className="button button-light" href="/contact">Discuss your project</a></section>;
}

function Home() {
  const [selected, setSelected] = useState(work[0]);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;
    const cursor = document.querySelector(".bode-cursor");
    if (!cursor) return undefined;
    const move = event => {
      cursor.style.transform = "translate3d(" + event.clientX + "px," + event.clientY + "px,0)";
      cursor.classList.add("is-visible");
      cursor.classList.toggle("is-hover", Boolean(event.target.closest("a,button,[role=button]")));
    };
    const leave = () => cursor.classList.remove("is-visible");
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);
  return <div className="home-experience bespoke-home">
    <section className="bespoke-hero">
      <div className="hero-copy">
        <p className="hero-index">BODE / CONVERSION LAB</p>
        <h1>The sale starts <em>before</em> the click.</h1>
        <p className="hero-description">We find where product pages, campaigns and checkout lose momentum, then improve the parts customers actually experience.</p>
        <div className="hero-ctas"><a className="button button-light" href="/contact">Discuss your store <span aria-hidden="true">↗</span></a><a className="hero-work-link" href="#selected-work">See selected work</a></div>
        <p className="hero-footnote">STORE EXPERIENCE&nbsp;&nbsp; / &nbsp;&nbsp;ACQUISITION&nbsp;&nbsp; / &nbsp;&nbsp;RETENTION</p>
      </div>
      <div className="hero-art" aria-label="Interactive particle field responding to pointer and touch movement">
        <ConversionStructure />
        <img className="hero-mark" src="/logo-mark.png" alt="Bode Conversion Lab" />
        <span className="hero-annotation hero-annotation-one">Customer signal / 01</span>
        <span className="hero-annotation hero-annotation-two">Conversion current / live</span>
      </div>
      <span className="hero-scroll">Scroll to explore</span><span className="hero-corner-index">01 / 04</span>
    </section>
    <section className="field-note">
      <div><span className="field-label">The work, beneath the surface</span><div className="field-stats"><div><span>Focus</span><b>Customer journey</b></div><div><span>Practice</span><b>Commerce growth</b></div><div><span>Approach</span><b>Evidence-led</b></div></div></div>
      <div><h2 className="field-headline">Growth is rarely one big fix. It is a series of <em>better decisions.</em></h2><p className="field-copy">A store, its campaigns and the experience after checkout all shape the decision to buy again. Bode works across those connected moments: identify the friction, agree what to change, and measure what the available evidence can show.</p></div>
    </section>
    <section className="section service-sequence" id="services">
      <div className="sequence-heading"><div><Eyebrow>WHAT WE WORK ON</Eyebrow><h2>Six ways to move<br/>the experience forward.</h2></div><p>Start with the part that needs attention. We scope each engagement around your platform, customers and business priorities.</p></div>
      <ServiceRows compact />
    </section>
    <section className="project-chamber" id="selected-work">
      <div className="project-head"><div><Eyebrow>SELECTED WORK / PROJECT RECORDS</Eyebrow><h2>Work in context.</h2></div><p>Selected project videos and reported figures. Each result is shown with the context available to us.</p></div>
      <div className="project-display">
        <a className="project-screen" href={"/work/" + selected.slug} aria-label={"Open project record: " + selected.name}>
          <video key={selected.slug} muted autoPlay loop playsInline preload="none" poster={selected.poster} aria-label={selected.name}><source src={selected.video} type="video/mp4" /></video>
          <span className="project-screen-caption">PROJECT RECORD&nbsp;&nbsp; / &nbsp;&nbsp;{selected.name}</span>
        </a>
        <div className="project-nav" aria-label="Select a project preview">
          {work.map((item, i) => <button type="button" key={item.slug} className={"project-choice" + (selected.slug === item.slug ? " active" : "")} onClick={() => setSelected(item)} onMouseEnter={() => setSelected(item)} onFocus={() => setSelected(item)} aria-pressed={selected.slug === item.slug}>
            <span>0{i + 1}</span><div><b>{item.name}</b><small>{item.metric}</small></div><i aria-hidden="true">↗</i>
          </button>)}
          <a className="project-all-link" href="/work">VIEW ALL PROJECTS&nbsp;&nbsp;↗</a>
        </div>
      </div>
    </section>
    <section className="method-section">
      <div><span className="method-index">BODE / METHOD</span><h2>Look closely.<br/><em>Change with intent.</em></h2><p className="method-description">A clear process makes the work easier to understand, deliver and evaluate.</p></div>
      <div className="method-list">
        <article className="method-item"><span>01</span><div><h3>Read the journey</h3><p>We look at the product, the offer and the path customers take through your store.</p></div></article>
        <article className="method-item"><span>02</span><div><h3>Set the priority</h3><p>We agree on the main friction point and the evidence that can help assess it.</p></div></article>
        <article className="method-item"><span>03</span><div><h3>Make the change</h3><p>We work within the agreed scope across the storefront, creative or campaigns.</p></div></article>
        <article className="method-item"><span>04</span><div><h3>Review what happened</h3><p>We put the available results in context and define the next useful action.</p></div></article>
      </div>
    </section>
    <section className="bespoke-close">
      <div><Eyebrow>PROJECT ENQUIRIES</Eyebrow><h2>What is your store<br/>ready to <em>change?</em></h2><div className="closing-actions"><a className="button button-light" href="/contact">Start a conversation <span aria-hidden="true">↗</span></a><a className="closing-mail" href="mailto:bodeagencyofficial@gmail.com">Email Bode directly</a></div></div>
      <div className="closing-coordinate">Store experience&nbsp;&nbsp; / &nbsp;&nbsp;Campaigns&nbsp;&nbsp; / &nbsp;&nbsp;Creative&nbsp;&nbsp; / &nbsp;&nbsp;Customer retention</div>
      <img className="bespoke-close-mark" src="/logo-mark.png" alt="" />
    </section>
    <div className="bode-cursor" aria-hidden="true" />
  </div>;
}
function FAQList({ items = faqs }) { return <div className="faq-list">{items.map(([q, a], i) => <details key={q}><summary><span>0{i + 1}</span><b>{q}</b><i aria-hidden="true">+</i></summary><p>{a}</p></details>)}</div>; }

function ServicesPage() {
  return <><PageIntro eyebrow="OUR SERVICES" title="The right work starts with the right problem." text="Choose a specific area to improve, or bring us the wider challenge. We will help define the work around your business, platform and goals."/><section className="section services-page-section"><ServiceRows /><div className="note-panel"><h2>Not sure where to start?</h2><p>Begin with the business problem and what you can currently measure. We can help identify the most useful first step.</p><a className="underlined-link" href="/contact">Talk through your priorities</a></div></section><ContactCallout title="Start with what needs to change." /></>;
}

function ServicePage({ service }) {
  return <><PageIntro eyebrow={"SERVICE / " + service.title.toUpperCase()} title={service.kicker + "."} text={service.summary}/><section className="service-detail"><div className={"service-visual visual-" + service.visual}><span className="visual-label">BODE / {service.title.toUpperCase()}</span><div className="visual-large">{service.title}</div><div className="visual-rule"></div><p>{service.kicker}</p></div><div className="service-detail-copy"><Eyebrow>OUR APPROACH</Eyebrow><h2>{service.kicker}.</h2><p>{service.detail}</p><p>{service.fit}</p><a className="button button-dark" href="/contact">Discuss this service</a></div></section><section className="section deliverables"><div className="section-title"><Eyebrow>WHAT THE WORK CAN INCLUDE</Eyebrow><h2>Work scoped to your store.</h2><p>We agree deliverables around the platform, access and priorities before work begins.</p></div><ul>{service.deliverables.map((d, i) => <li key={d}><span>0{i + 1}</span>{d}</li>)}</ul></section><section className="related-services"><div className="section-title"><Eyebrow>RELATED SERVICES</Eyebrow><h2>Other areas we can help with.</h2></div><ServiceRows compact /></section><ContactCallout title="Talk through this service." text="Share your store and the problem you want to solve. We will respond with a clear next step." /></>;
}

function WorkPage() {
  return <><PageIntro eyebrow="SELECTED WORK" title="Project videos and reported outcomes." text="A selection of ecommerce projects, with figures shown as reported outcomes rather than a promise of future results."/><section className="section work-page"><WorkCards /><div className="evidence-note"><h2>About the figures</h2><p>The figures shown were supplied for these projects. Their reporting periods and attribution details were not included with the material published here.</p></div></section><ContactCallout title="Have a similar challenge?" /></>;
}

function CaseStudy({ item }) {
  return <><PageIntro eyebrow="PROJECT / ECOMMERCE" title={item.name} text="A project video and outcome supplied for this portfolio."/><section className="section case-study"><div className="case-video"><video controls playsInline preload="metadata" poster={item.poster} controlsList="nodownload" aria-label={"Portfolio video for " + item.name}><source src={item.video} type="video/mp4" />Your browser does not support embedded video.</video></div><div className="case-summary"><Eyebrow>REPORTED OUTCOME</Eyebrow><h2>{item.metric}</h2><p>{item.context}</p></div></section><ContactCallout title="Tell us what you want to improve." /></>;
}

function AboutPage() {
  return <><PageIntro eyebrow="ABOUT BODE CONVERSION LAB" title="Ecommerce work across store, acquisition and retention." text="Bode Conversion Lab helps ecommerce teams improve storefronts, campaigns, product creative, search visibility and customer retention."/><section className="section about-detail"><div className="about-symbol"><img src="/logo-mark.png" alt="" /></div><div><Eyebrow>HOW WE WORK</Eyebrow><h2>Find the leak. Fix the experience. Measure the result.</h2><p>We review the offer, storefront and acquisition path, then agree on a focused scope. The work may include product pages, checkout, campaign creative or measurement, depending on where customers drop out.</p><p>Before work begins, we set the deliverables, responsibilities and measures with you. That keeps the project focused on a change the business can assess.</p></div></section><section className="section principles"><article><span>01</span><h3>Review the journey</h3><p>We look at how customers discover, evaluate and buy from your store.</p></article><article><span>02</span><h3>Agree the scope</h3><p>We set priorities, deliverables and responsibilities before implementation.</p></article><article><span>03</span><h3>Report with context</h3><p>We explain what changed, what the available data shows and what to do next.</p></article></section><ContactCallout title="Tell us about your store." /></>;
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
  return <><PageIntro eyebrow="CONTACT" title="Tell us what you want to improve." text="Share the context, the challenge and what a useful outcome would look like. We will use that information to assess whether the project is a fit."/><section className="contact-layout"><div className="contact-sidebar"><Eyebrow>PROJECT ENQUIRIES</Eyebrow><h2>Start with the business problem.</h2><p>There is no need to have every answer ready. Tell us what you know, and we can identify the questions that matter next.</p><div className="contact-email-block"><span>Prefer email?</span><a href={"mailto:" + EMAIL}>{EMAIL}</a></div><p className="form-privacy">{import.meta.env.VITE_FORMSPREE_ENDPOINT ? "This form sends your enquiry through the configured form processor. See the privacy policy for details." : "Without an online form processor configured, this form opens an email draft and does not submit or store your details on this website."}</p></div><form className="contact-form" onSubmit={submit} aria-busy={submission.state === "sending"}><div className="form-top"><span>PROJECT ENQUIRY</span><span>01 / 06</span></div><label>Your name<input required autoComplete="name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Name"/></label><label>Business email<input required type="email" autoComplete="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="you@company.com"/></label><label>Website or store URL<input type="url" value={form.website} onChange={e => setForm({...form, website:e.target.value})} placeholder="https://yourstore.com"/></label><div className="form-two"><label>Platform<select value={form.platform} onChange={e => setForm({...form, platform:e.target.value})}>{["Not sure yet","Shopify","WooCommerce","Wix","BigCommerce","Custom","Other"].map(v=><option key={v}>{v}</option>)}</select></label><label>Main priority<select value={form.priority} onChange={e => setForm({...form, priority:e.target.value})}>{["Improve store conversion","Paid advertising","Product creative","SEO and product visibility","Email and retention","Analytics and tracking","Not sure yet"].map(v=><option key={v}>{v}</option>)}</select></label></div><label>Tell us a little more<textarea rows="4" value={form.details} onChange={e => setForm({...form, details:e.target.value})} placeholder="What are you trying to improve?"/></label><button className="button button-dark" type="submit" disabled={submission.state === "sending"}>{submission.state === "sending" ? "Sending enquiry…" : import.meta.env.VITE_FORMSPREE_ENDPOINT ? "Send project enquiry" : "Prepare enquiry email"}</button><p className="form-note" role="status" aria-live="polite">{submission.message || (import.meta.env.VITE_FORMSPREE_ENDPOINT ? "Your details will be sent to the configured form processor." : "This form prepares an email draft. It does not submit or store your details on this website.")}</p></form></section></>;
}

function PrivacyPage() {
  return <><PageIntro eyebrow="PRIVACY" title="How we handle your information." text="This page describes the information handled when you contact Bode Conversion Lab through this website."/><section className="section privacy-content"><h2>Information you provide</h2><p>When no online form processor is configured, the contact form prepares an email draft in your own email application; the website does not submit or store its fields. If online form processing is enabled, the information entered is sent to the configured form provider so Bode Conversion Lab can receive the enquiry. If you send an email directly, Bode Conversion Lab receives the information you choose to include and may use it to respond.</p><h2>Technical information</h2><p>The hosting provider may process standard technical request information to deliver and secure the site. Please refer to the hosting provider's current terms for details.</p><h2>Third-party services</h2><p>Portfolio videos are served from this website. The site loads fonts from Google Fonts. If online form processing is enabled, the configured form provider will also process the information submitted through the contact form under its own privacy terms.</p><h2>Retention and requests</h2><p>If you email Bode, your message may be retained as needed to handle the enquiry and maintain business records. To ask a question about information you have sent, email <a href={"mailto:" + EMAIL}>{EMAIL}</a>.</p></section></>;
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

  useEffect(() => {
    const page = document.querySelector("#main");
    if (!page) return undefined;
    const targets = page.querySelectorAll(".page-intro, .section-title, .reference-section-heading, .service-rows .service-row, .reference-work-row, .reference-work-preview, .reference-manifesto h2, .reference-process-grid article, .closing-copy, .service-visual, .service-detail-copy, .case-video, .case-summary, .work-card, .deliverables li, .principles article, .contact-sidebar, .contact-form > label, .privacy-content > *");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(target => target.classList.add("story-entered"));
      return undefined;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("story-entered");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });
    targets.forEach((target, index) => {
      target.classList.add("story-enter");
      target.style.setProperty("--story-delay", String((index % 5) * 65) + "ms");
      observer.observe(target);
    });
    return () => observer.disconnect();
  }, [path]);

  return <div className={"site-shell" + (path === "/contact" ? " contact-route" : "")}><a className="skip-link" href="#main">Skip to content</a><Header path={path}/><main id="main">{content}</main><Footer/>{path !== "/contact" && <a className="mobile-sticky-cta" href="/contact">Discuss your project </a>}</div>;
}

