import { useState } from "react";

const services = [
  { number: "01", title: "Store experience", intro: "Make the path to purchase clearer.", body: "Store audits, product pages, navigation, mobile usability, checkout friction, landing pages and conversion improvements.", tags: "Shopify · WooCommerce · Wix · BigCommerce · Custom" },
  { number: "02", title: "Paid acquisition", intro: "Spend with a plan, not a guess.", body: "Meta and Google campaign strategy, creative testing, audience research, landing-page alignment and performance reviews.", tags: "Meta Ads · Google Ads · TikTok Ads" },
  { number: "03", title: "Creative production", intro: "Give people a reason to stop and care.", body: "Product videos, UGC-style ads, campaign concepts, product imagery and creative variations built around a clear audience and offer.", tags: "Product video · UGC-style · Ad creative" },
  { number: "04", title: "Search and discovery", intro: "Help the right people find you.", body: "Technical SEO, product-feed checks, on-page improvements, content planning and search visibility reviews.", tags: "SEO · Google Search · Merchant Center" },
  { number: "05", title: "Email and retention", intro: "Build the next purchase into the plan.", body: "Welcome sequences, abandoned-cart flows, post-purchase follow-up, win-back campaigns and customer segmentation.", tags: "Email · SMS · Customer lifecycle" },
  { number: "06", title: "Analytics and tracking", intro: "Know what is actually working.", body: "Tracking audits, analytics setup, funnel reviews, practical dashboards and reporting tied to business decisions.", tags: "GA4 · Pixels · Reporting" }
];

const steps = [
  { n: "01", title: "Understand the business", text: "We learn what you sell, who buys it, what you have tried and what success needs to look like." },
  { n: "02", title: "Find the constraint", text: "We review the store, customer journey and available data. Then we separate the important problems from the noise." },
  { n: "03", title: "Make the changes", text: "You get a clear scope, named deliverables and a team plan. Work is reviewed before it goes live." },
  { n: "04", title: "Measure and improve", text: "We report what changed, what the data says and what we recommend doing next." }
];

const work = [
  { name: "Novi Good Store", result: "4.3× ROAS · $57k in sales", video: "/proof/Videoproof2.mp4", poster: "/proof/thumbs/novigood.jpg", note: "Store performance record" },
  { name: "Robin and Roobaby", result: "$77k in sales", video: "/proof/Videoproof5.mp4", poster: "/proof/thumbs/robinroobaby.jpg", note: "Store performance record" },
  { name: "Stream Ride Store", result: "$36k in sales", video: "/proof/Videoproof1.mp4", poster: "/proof/thumbs/streamride.jpg", note: "Store performance record" }
];

const faqs = [
  { q: "Which store platforms do you work with?", a: "We work across Shopify, WooCommerce, Wix, BigCommerce and custom storefronts. The right approach depends on your current setup and the problem we are solving." },
  { q: "Do you only work with e-commerce businesses?", a: "E-commerce is our primary focus. We also consider selected website and lead-generation projects when the business need matches our team's capabilities." },
  { q: "Can I hire you for one service?", a: "Yes. Start with a defined audit, implementation project, creative package or marketing service. Ongoing work is discussed only when it makes sense for the business." },
  { q: "Do you guarantee sales or a specific ROAS?", a: "No responsible agency can guarantee results that depend on factors such as the offer, margins, market, product, budget and customer demand. We agree on the work, measurement and reporting before a project starts." },
  { q: "How does pricing work?", a: "Pricing depends on the scope, complexity and level of ongoing support. After understanding your needs, we provide a clear scope and quote before work begins." },
  { q: "Can you work with a business in another country?", a: "Yes. Projects can be managed remotely with clear communication, agreed working hours, documented approvals and reporting. We confirm the practical arrangements before starting." }
];

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? "↗" : "→"}</span>;
}

function SectionLabel({ children }) {
  return <p className="section-label"><span />{children}</p>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", store: "", platform: "Not sure yet", challenge: "Improve store conversion" });

  const nav = [
    ["Services", "#services"],
    ["How we work", "#process"],
    ["Selected work", "#work"],
    ["About", "#about"]
  ];

  function submitInquiry(event) {
    event.preventDefault();
    const subject = encodeURIComponent("Store growth enquiry from " + (form.name || "website visitor"));
    const body = encodeURIComponent(
      "Name: " + form.name + "\nBusiness email: " + form.email +
      "\nStore URL: " + form.store + "\nPlatform: " + form.platform +
      "\nMain priority: " + form.challenge + "\n\nPlease contact me about next steps."
    );
    window.location.href = "mailto:bodeagencyofficial@gmail.com?subject=" + subject + "&body=" + body;
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Bode Conversion Lab home">
          <img src="/logo-mark.png" alt="" />
          <span className="brand-wordmark"><strong>BODE</strong><small>CONVERSION LAB</small></span>
        </a>
        <nav id="main-navigation" className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Discuss your store <Arrow diagonal /></a>
        </nav>
        <div className="header-tools">
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            <span>{menuOpen ? "Close" : "Menu"}</span><i aria-hidden="true">{menuOpen ? "×" : "+"}</i>
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <SectionLabel>ECOMMERCE GROWTH · STORE EXPERIENCE · MARKETING</SectionLabel>
            <h1>Good marketing starts with a store that is ready to <em>grow.</em></h1>
            <p className="hero-intro">We help online businesses improve the buying experience, reach the right customers and make better decisions with their marketing.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#contact">Talk about your store <Arrow diagonal /></a>
              <a className="text-button" href="#services">Explore what we do <Arrow /></a>
            </div>
            <div className="hero-footnote"><span className="tiny-check">✓</span> Independent of your e-commerce platform. Focused on the business problem.</div>
          </div>
          <div className="hero-visual" aria-label="Our approach connects store experience, acquisition, retention and measurement">
            <div className="visual-topline"><span>THE GROWTH PICTURE</span><span>01 / 04</span></div>
            <div className="journey">
              <div className="journey-row"><span className="journey-index">01</span><div><strong>Store experience</strong><small>Can people buy with confidence?</small></div><b className="journey-mark">↗</b></div>
              <div className="journey-connector"><i /></div>
              <div className="journey-row"><span className="journey-index">02</span><div><strong>Customer acquisition</strong><small>Are we reaching the right people?</small></div><b className="journey-mark">↗</b></div>
              <div className="journey-connector"><i /></div>
              <div className="journey-row"><span className="journey-index">03</span><div><strong>Retention</strong><small>Is there a reason to return?</small></div><b className="journey-mark">↗</b></div>
              <div className="journey-connector"><i /></div>
              <div className="journey-row journey-row-final"><span className="journey-index">04</span><div><strong>Measurement</strong><small>What should happen next?</small></div><b className="journey-mark">✓</b></div>
            </div>
            <div className="visual-caption"><span className="caption-line" /> One connected plan. Clear priorities. Work you can inspect.</div>
          </div>
        </section>

        <section className="platform-band" aria-label="Supported e-commerce platforms">
          <p>BUILT AROUND YOUR BUSINESS, NOT A SINGLE PLATFORM</p>
          <div><span>Shopify</span><span>WooCommerce</span><span>Wix</span><span>BigCommerce</span><span>Custom storefronts</span></div>
        </section>

        <section className="section problem-section" id="why">
          <div className="section-heading">
            <SectionLabel>START WITH THE REAL PROBLEM</SectionLabel>
            <h2>More activity is not always the answer.</h2>
            <p>Before increasing spend or adding another tool, understand where the customer journey is breaking down.</p>
          </div>
          <div className="problem-list">
            <article><span>01</span><div><h3>People visit, but do not buy.</h3><p>Review product pages, mobile experience, trust signals and checkout friction.</p></div><a href="#services" aria-label="Explore store experience services"><Arrow diagonal /></a></article>
            <article><span>02</span><div><h3>Ads spend money without a clear answer.</h3><p>Connect campaign goals, creative tests, landing pages and reliable measurement.</p></div><a href="#services" aria-label="Explore paid acquisition services"><Arrow diagonal /></a></article>
            <article><span>03</span><div><h3>Customers buy once and disappear.</h3><p>Build relevant follow-up, post-purchase communication and retention flows.</p></div><a href="#services" aria-label="Explore retention services"><Arrow diagonal /></a></article>
            <article><span>04</span><div><h3>There is plenty of data, but no clear next move.</h3><p>Turn tracking and reports into a short list of useful decisions.</p></div><a href="#services" aria-label="Explore analytics services"><Arrow diagonal /></a></article>
          </div>
        </section>

        <section className="section services-section" id="services">
          <div className="section-heading section-heading-split">
            <div><SectionLabel>WHAT WE DO</SectionLabel><h2>Bring the important parts of growth into one plan.</h2></div>
            <p>Choose the help you need now. We can start with one defined project or plan work across several areas when the evidence supports it.</p>
          </div>
          <div className="service-list">
            {services.map((service) => <article className="service-item" key={service.number}>
              <span className="service-number">{service.number}</span>
              <div className="service-main"><h3>{service.title}</h3><p className="service-intro">{service.intro}</p><p className="service-body">{service.body}</p><span className="service-tags">{service.tags}</span></div>
              <a href="#contact" aria-label={"Ask about " + service.title}><Arrow diagonal /></a>
            </article>)}
          </div>
        </section>

        <section className="method-section" id="process">
          <div className="method-intro">
            <SectionLabel>HOW WE WORK</SectionLabel>
            <h2>Clear thinking before busy work.</h2>
            <p>Every engagement begins with context. We agree on the problem, the scope and the way progress will be judged before the work starts.</p>
            <a className="button button-light" href="#contact">Discuss a project <Arrow diagonal /></a>
          </div>
          <div className="method-steps">
            {steps.map((step) => <article key={step.n}><span>{step.n}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}
          </div>
        </section>

        <section className="section work-section" id="work">
          <div className="section-heading section-heading-split">
            <div><SectionLabel>SELECTED STORE RECORDS</SectionLabel><h2>Evidence should be inspectable.</h2></div>
            <p>These portfolio records and performance figures were previously supplied for the site. We present them without inventing testimonials or adding claims that are not documented here.</p>
          </div>
          <div className="work-grid">
            {work.map((item, index) => <article className="work-card" key={item.name}>
              <div className="work-media"><video controls playsInline preload="none" poster={item.poster} controlsList="nodownload" aria-label={"Portfolio evidence for " + item.name}><source src={item.video} type="video/mp4" />Your browser does not support embedded video.</video><span className="work-index">0{index + 1}</span></div>
              <div className="work-info"><div><p>{item.note}</p><h3>{item.name}</h3></div><strong>{item.result}</strong></div>
            </article>)}
          </div>
          <p className="work-note">Results depend on the business, offer, market and measurement period. Past performance does not guarantee future outcomes.</p>
        </section>

        <section className="creative-section">
          <div className="creative-copy">
            <SectionLabel>CREATIVE PRODUCTION</SectionLabel>
            <h2>Make the product matter before you ask for the sale.</h2>
            <p>We produce product-focused creative that starts with the customer: what they care about, what they need to see and what makes the offer relevant.</p>
            <ul><li>Product and lifestyle videos</li><li>UGC-style ad concepts</li><li>Creative variations for testing</li></ul>
            <a className="text-button" href="#contact">Discuss creative work <Arrow diagonal /></a>
          </div>
          <div className="creative-media">
            <video controls playsInline preload="metadata" controlsList="nodownload" poster="/og-image.png" aria-label="Bode Conversion Lab creative sample"><source src="/bode_final_1080p.mp4" type="video/mp4" />Your browser does not support embedded video.</video>
            <div className="media-caption"><span>SELECTED CREATIVE</span><span>PLAY VIDEO ↗</span></div>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="about-mark"><img src="/logo-mark.png" alt="Bode Conversion Lab mark" /></div>
          <div className="about-copy">
            <SectionLabel>ABOUT BODE CONVERSION LAB</SectionLabel>
            <h2>Practical work. Clear ownership. No mystery process.</h2>
            <p>Bode Conversion Lab brings store improvement, marketing execution, creative production and performance analysis together around the needs of each business.</p>
            <p>Projects are scoped before work begins. Responsibilities are clear. Recommendations are explained in plain language. The work is reviewed against the agreed goal, not against how busy the team looks.</p>
            <a className="text-button" href="#contact">Meet us through a project conversation <Arrow diagonal /></a>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-heading"><SectionLabel>BEFORE YOU START</SectionLabel><h2>Useful answers, without the sales script.</h2></div>
          <div className="faq-list">
            {faqs.map((faq, index) => <details key={faq.q}><summary><span>0{index + 1}</span><strong>{faq.q}</strong><b aria-hidden="true">+</b></summary><p>{faq.a}</p></details>)}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-copy">
            <SectionLabel>START A CONVERSATION</SectionLabel>
            <h2>Tell us what is not working.</h2>
            <p>Share a few details. We will use them to understand the situation and decide whether we are a good fit for the work.</p>
            <div className="contact-direct"><span>Prefer email?</span><a href="mailto:bodeagencyofficial@gmail.com">bodeagencyofficial@gmail.com <Arrow diagonal /></a></div>
            <p className="contact-small">No commitment is created by sending an enquiry. Scope, timing and pricing are agreed before work starts.</p>
          </div>
          <form className="contact-form" onSubmit={submitInquiry}>
            <div className="form-heading"><span>PROJECT ENQUIRY</span><span>01 — 05</span></div>
            <label>Your name<input required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" /></label>
            <label>Business email<input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" /></label>
            <label>Store or website URL<input type="url" value={form.store} onChange={(e) => setForm({ ...form, store: e.target.value })} placeholder="https://yourstore.com" /></label>
            <div className="form-row">
              <label>Platform<select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}><option>Not sure yet</option><option>Shopify</option><option>WooCommerce</option><option>Wix</option><option>BigCommerce</option><option>Custom</option><option>Other</option></select></label>
              <label>Main priority<select value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })}><option>Improve store conversion</option><option>Paid advertising</option><option>Product creative</option><option>SEO and discovery</option><option>Email and retention</option><option>Analytics and tracking</option><option>Not sure yet</option></select></label>
            </div>
            <button className="button button-dark form-submit" type="submit">Prepare enquiry email <Arrow diagonal /></button>
            <p className="form-note">Your email app will open with the details you entered. Nothing is sent until you review and send it.</p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <a className="brand footer-brand" href="#top"><img src="/logo-mark.png" alt="" /><span className="brand-wordmark"><strong>BODE</strong><small>CONVERSION LAB</small></span></a>
          <p>Better store experiences. More considered marketing. Clearer decisions.</p>
          <a className="footer-email" href="mailto:bodeagencyofficial@gmail.com">bodeagencyofficial@gmail.com <Arrow diagonal /></a>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Bode Conversion Lab</span><div><a href="#services">Services</a><a href="#work">Work</a><a href="#contact">Contact</a><a href="mailto:bodeagencyofficial@gmail.com?subject=Privacy%20request">Privacy enquiries</a></div><a href="#top">Back to top ↑</a></div>
      </footer>
    </div>
  );
}
