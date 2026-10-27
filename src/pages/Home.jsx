import { Link } from "react-router-dom";
import { PageWrapper, SEO } from "../components.jsx";

const areas = [
  ["01","Store & funnel audit","Find what is stopping visitors from taking action.","store-audit"],
  ["02","Conversion optimization","Make the customer journey clearer and easier.","cro"],
  ["03","Paid growth","Connect ads, creative and landing pages.","ad-management"]
];
export default function Home() {
 return <PageWrapper style={{paddingTop:72}}>
  <SEO title="Store Optimization & Ads Engineering" description="Bode Conversion Lab helps brands improve their websites, customer journeys and paid acquisition." path="/" />
  <main className="studio-home">
   <section className="studio-hero">
    <div className="studio-hero-copy">
     <p className="studio-eyebrow"><span/> STORE OPTIMIZATION & ADS ENGINEERING</p>
     <h1>Make every<br/>visit <em>count.</em></h1>
     <p className="studio-intro">We find what is holding your website back, improve the customer journey, and help your marketing work harder.</p>
     <div className="studio-actions"><Link className="studio-button" to="/audit">Get a free audit <span>↗</span></Link><Link className="studio-text-link" to="/services">Explore services <span>→</span></Link></div>
     <p className="studio-micro">One connected system. Clear priorities. Better decisions.</p>
    </div>
    <div className="studio-hero-art" aria-label="Bode Conversion Engine abstract visual">
     <div className="studio-art-grid"/><div className="studio-art-orbit studio-orbit-one"/><div className="studio-art-orbit studio-orbit-two"/>
     <div className="studio-art-core"><span>BODE</span><b>CONVERSION<br/>ENGINE</b><i>01 — 03</i></div>
     <div className="studio-art-caption studio-art-caption-top">VISITOR → CUSTOMER</div><div className="studio-art-caption studio-art-caption-bottom">FIND. FIX. GROW.</div><div className="studio-art-index">BCL / SYSTEM 001</div>
    </div>
    <div className="studio-hero-foot"><span>01 / THE GROWTH SYSTEM</span><span>BUILT AROUND YOUR CUSTOMER</span></div>
   </section>
   <section className="studio-proofline"><span>Less guesswork</span><i>✳</i><span>Clearer customer journeys</span><i>✳</i><span>Smarter growth</span></section>
   <section className="studio-section">
    <div className="studio-section-head"><div><p className="studio-eyebrow">WHAT WE DO</p><h2>Fix the right<br/><em>things first.</em></h2></div><div className="studio-section-side"><p>Choose a goal. Open the service page. See how we can help.</p><Link className="studio-arrow-link" to="/services">All services <span>↗</span></Link></div></div>
    <div className="studio-feature-grid">{areas.map(a=><Link className="studio-feature" key={a[3]} to={"/services/"+a[3]}><span className="studio-feature-number">{a[0]}</span><span className="studio-feature-label">{a[1]}</span><h3>{a[2]}</h3><span className="studio-feature-arrow">Explore service ↗</span></Link>)}</div>
   </section>
   <section className="studio-work-band"><div><p className="studio-eyebrow">REAL WORK. CLEAR THINKING.</p><h2>See what better<br/><em>can look like.</em></h2></div><p>Explore selected project proof and the thinking behind the work.</p><Link className="studio-button studio-button-light" to="/past-projects">View our work <span>↗</span></Link></section>
   <section className="studio-section studio-video-work">
    <div className="studio-section-head">
     <div><p className="studio-eyebrow">SELECTED VIDEO WORK</p><h2>Made to be<br/><em>remembered.</em></h2></div>
     <div className="studio-section-side"><p>A look at the creative work behind clearer brand stories and stronger marketing.</p><Link className="studio-arrow-link" to="/past-projects">Explore all work <span>↗</span></Link></div>
    </div>
    <div className="studio-video-grid">
     <article className="studio-video-card">
      <video src="https://bodeconversionlab.vercel.app/bode_final_1080p.mp4" controls playsInline preload="metadata" aria-label="Bode Conversion Lab featured video" />
      <div><span>01 / BRAND FILM</span><h3>Bode Conversion Film</h3></div>
     </article>
     <article className="studio-video-card">
      <video src="https://bodeconversionlab.vercel.app/viral_edit_1080p.mp4" controls playsInline preload="metadata" aria-label="Featured creative ad edit" />
      <div><span>02 / CREATIVE EDIT</span><h3>Creative Ad Edit</h3></div>
     </article>
    </div>
   </section>
   <section className="studio-section studio-process"><div className="studio-section-head"><div><p className="studio-eyebrow">A SIMPLE PROCESS</p><h2>Clarity before<br/><em>complexity.</em></h2></div><p className="studio-process-note">No pile of confusing tactics. A focused path from diagnosis to improvement.</p></div>
    <div className="studio-steps"><article><span>01</span><h3>Find the friction</h3><p>Understand where people hesitate, drop off or lose trust.</p></article><article><span>02</span><h3>Make the fix</h3><p>Prioritize changes that can improve the journey.</p></article><article><span>03</span><h3>Build on progress</h3><p>Use evidence to guide what comes next.</p></article></div>
   </section>
   <section className="studio-final-cta"><p className="studio-eyebrow">START WITH THE WEBSITE YOU HAVE</p><h2>Find your next<br/><em>best move.</em></h2><p>Get a clearer picture of what to improve first.</p><Link className="studio-button" to="/audit">Get a free audit <span>↗</span></Link></section>
  </main>
 </PageWrapper>;
}