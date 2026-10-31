import { useEffect, useRef, useState } from "react";

const disciplines = [
  ["01", "Store experience", "Product pages, navigation, trust and checkout.", "/store-optimization"],
  ["02", "Paid acquisition", "Campaigns connected to the page they send people to.", "/paid-advertising"],
  ["03", "Product films", "Creative that makes the product feel worth choosing.", "/ai-product-videos"],
  ["04", "Search visibility", "Technical SEO, product data and discovery.", "/seo-product-visibility"],
  ["05", "Customer return", "Lifecycle messages that bring customers back.", "/email-retention"],
  ["06", "Measurement", "Tracking that makes the next decision clearer.", "/analytics-tracking"]
];
const projects = [
  { name: "Novi Good Store", metric: "4.3× ROAS · $57k sales", video: "/proof/Videoproof2.mp4", poster: "/proof/thumbs/novigood.jpg", slug: "novi-good-store" },
  { name: "Robin and Roobaby", metric: "$77k sales", video: "/proof/Videoproof5.mp4", poster: "/proof/thumbs/robinroobaby.jpg", slug: "robin-and-roobaby" },
  { name: "Stream Ride Store", metric: "$36k sales", video: "/proof/Videoproof1.mp4", poster: "/proof/thumbs/streamride.jpg", slug: "stream-ride-store" }
];

export default function ImmersiveHome() {
  const stage = useRef(null);
  const [activeService, setActiveService] = useState(0);
  const [activeProject, setActiveProject] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const p = scrollY / max;
      setProgress(p);
      root.style.setProperty("--journey-progress", p);
    };
    const onPointer = e => {
      if (matchMedia("(pointer: fine)").matches) {
        const x = (e.clientX / innerWidth - .5) * 2;
        const y = (e.clientY / innerHeight - .5) * 2;
        root.style.setProperty("--pointer-x", x.toFixed(3));
        root.style.setProperty("--pointer-y", y.toFixed(3));
      }
    };
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-in-view");
    }), { threshold: .18 });
    root.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pointermove", onPointer, { passive: true });
    onScroll();
    return () => { removeEventListener("scroll", onScroll); removeEventListener("pointermove", onPointer); observer.disconnect(); };
  }, []);
  return <div className="immersive-home" ref={stage} style={{ "--pointer-x": 0, "--pointer-y": 0 }}>
    <div className="ih-atmosphere" aria-hidden="true"><div className="ih-grid"/><div className="ih-glow ih-glow-a"/><div className="ih-glow ih-glow-b"/><div className="ih-orbit ih-orbit-a"/><div className="ih-orbit ih-orbit-b"/></div>
    <section className="ih-hero">
      <div className="ih-hero-copy" data-reveal>
        <p className="ih-kicker"><i/> INDEPENDENT COMMERCE GROWTH STUDIO <span> / 01—06</span></p>
        <h1>Make every<br/>part of the sale<br/><em>work together.</em></h1>
        <p className="ih-lede">Your ads, store, product story and checkout are one customer experience. We engineer the connections between them.</p>
        <div className="ih-actions"><a className="ih-primary" href="/contact">Build a better store <span>↗</span></a><a className="ih-text-link" href="#ih-work">Explore the work <span>↓</span></a></div>
      </div>
      <div className="ih-engine" aria-label="Interactive visual representing the connected conversion system">
        <div className="ih-engine-ring ring-one"/><div className="ih-engine-ring ring-two"/><div className="ih-engine-ring ring-three"/>
        <div className="ih-engine-core"><div className="ih-core-mark">B<span>.</span></div><small>CONVERSION<br/>ENGINE</small></div>
        <div className="ih-engine-node node-ads"><b>ADS</b><small>Attention</small></div>
        <div className="ih-engine-node node-store"><b>STORE</b><small>Experience</small></div>
        <div className="ih-engine-node node-checkout"><b>CHECKOUT</b><small>Decision</small></div>
        <div className="ih-engine-node node-return"><b>RETURN</b><small>Retention</small></div>
        <div className="ih-engine-signal"/>
        <span className="ih-engine-caption caption-top">SYSTEM 001 <i>LIVE</i></span><span className="ih-engine-caption caption-bottom">CONNECTED COMMERCE / BODE LAB</span>
      </div>
      <div className="ih-hero-foot"><span>STRATEGY / EXPERIENCE / PERFORMANCE</span><span>SCROLL TO EXPLORE <b>⌄</b></span></div>
    </section>
    <section className="ih-manifesto" data-reveal>
      <div className="ih-section-index">02 <span>/ THE PRINCIPLE</span></div>
      <div className="ih-manifesto-content"><p className="ih-kicker">THE CUSTOMER DOESN'T SEE YOUR DEPARTMENTS.</p><h2>They see <em>one journey.</em></h2><p>They see the ad, the promise, the product page, the checkout and what happens after the order. A weak link can undo the work everywhere else.</p><a href="/about">How we approach the work <span>↗</span></a></div>
      <div className="ih-journey-map" aria-label="Customer journey stages"><div className="ih-journey-line"><i/></div>{[["01","DISCOVER"],["02","UNDERSTAND"],["03","DECIDE"],["04","RETURN"]].map((n,i)=><div className={"ih-journey-stop stop-"+i} key={n[0]}><b>{n[0]}</b><span>{n[1]}</span></div>)}</div>
    </section>
    <section className="ih-services" id="ih-services">
      <div className="ih-section-head" data-reveal><div><div className="ih-section-index">03 <span>/ THE SYSTEM</span></div><h2>Six disciplines.<br/><em>One outcome.</em></h2></div><p>We work across the moments that shape a customer's decision. Start with one problem. Connect the rest when the evidence calls for it.</p></div>
      <div className="ih-service-machine" data-reveal>
        <div className="ih-machine-core"><span>BODE</span><b>GROWTH<br/>SYSTEM</b><i>↗</i></div>
        <div className="ih-machine-lines" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div>
        {disciplines.map((d,i)=><a key={d[0]} href={d[3]} onMouseEnter={()=>setActiveService(i)} onFocus={()=>setActiveService(i)} className={"ih-service-node service-"+i+(activeService===i?" selected":"")}><span>{d[0]}</span><b>{d[1]}</b><i>↗</i></a>)}
        <div className="ih-service-detail"><span>SELECTED DISCIPLINE / 0{activeService+1}</span><h3>{disciplines[activeService][1]}</h3><p>{disciplines[activeService][2]}</p></div>
      </div>
      <div className="ih-service-mobile">{disciplines.map(d=><a href={d[3]} key={d[0]}><span>{d[0]}</span><b>{d[1]}</b><i>↗</i><small>{d[2]}</small></a>)}</div>
    </section>
    <section className="ih-work" id="ih-work">
      <div className="ih-section-head" data-reveal><div><div className="ih-section-index">04 <span>/ SELECTED RECORDS</span></div><h2>Work with<br/><em>context.</em></h2></div><p>Project records and reported figures. Each result is presented with the context available to us.</p></div>
      <div className="ih-project-stage" data-reveal><div className="ih-project-stack"><div className="ih-project-back"/><div className="ih-project-mid"/><a className="ih-project-screen" href={"/work/"+projects[activeProject].slug}><video key={projects[activeProject].slug} muted autoPlay loop playsInline preload="none" poster={projects[activeProject].poster}><source src={projects[activeProject].video} type="video/mp4"/></video><span>PROJECT FILM / 0{activeProject+1}</span></a></div><div className="ih-project-list"><span className="ih-kicker">CHOOSE A PROJECT</span>{projects.map((p,i)=><button key={p.slug} onClick={()=>setActiveProject(i)} className={activeProject===i?"chosen":""}><small>0{i+1}</small><span><b>{p.name}</b><em>{p.metric}</em></span><i>↗</i></button>)}<a href="/work">View all project records ↗</a></div></div>
    </section>
    <section className="ih-method">
      <div className="ih-method-visual" data-reveal><div className="ih-method-cube"><i/><i/><i/><i/><b>01—04</b></div><span>RESEARCH / PRIORITY / EXECUTION / REVIEW</span></div>
      <div className="ih-method-copy" data-reveal><div className="ih-section-index">05 <span>/ THE METHOD</span></div><h2>Find the friction.<br/><em>Change with intent.</em></h2><div className="ih-method-steps">{[["01","Read the journey","Understand the offer, customer and path to purchase."],["02","Set the priority","Agree on the highest-value problem and what evidence matters."],["03","Make the change","Improve the storefront, creative, campaigns or measurement."],["04","Review the signal","Assess what changed and decide the next useful move."]].map(s=><article key={s[0]}><b>{s[0]}</b><div><h3>{s[1]}</h3><p>{s[2]}</p></div></article>)}</div></div>
    </section>
    <section className="ih-close" data-reveal><div className="ih-close-orb"><span>B</span></div><div className="ih-section-index">06 <span>/ THE NEXT MOVE</span></div><h2>Stop treating<br/>the sale as<br/><em>separate parts.</em></h2><a className="ih-primary" href="/contact">Start a project conversation <span>↗</span></a><p>STORE EXPERIENCE / ACQUISITION / CREATIVE / RETENTION</p></section>
    <div className="ih-progress" aria-hidden="true"><span style={{transform:"scaleX("+progress+")"}}/></div>
  </div>;
}
