import { Link } from "react-router-dom";
import { SERVICES } from "../data.js";
import { PageWrapper, SEO } from "../components.jsx";
export default function Services() {
 return <PageWrapper style={{paddingTop:72}}><SEO title="Services" description="Explore Bode Conversion Lab services for audits, conversion optimization, paid advertising, landing pages, retention and analytics." path="/services"/>
 <main className="studio-subpage"><header className="studio-subpage-hero"><p className="studio-eyebrow"><span/> THE BODE GROWTH SYSTEM</p><h1>One clear goal.<br/><em>Better performance.</em></h1><p>Choose what you want to improve. Each service has its own page with details, process and next steps.</p><Link className="studio-button" to="/audit">Start with a free audit <span>↗</span></Link></header>
 <section className="studio-service-list" aria-label="All services">{SERVICES.map((s,i)=><Link className="studio-service-row" key={s.id} to={"/services/"+s.id}><span className="studio-service-num">{String(i+1).padStart(2,"0")}</span><div><h2>{s.title}</h2><p>{s.tagline}</p></div><span className="studio-service-arrow">↗</span></Link>)}</section>
 <section className="studio-subpage-cta"><h2>Not sure where to start?</h2><p>Let the audit show you where the biggest opportunities may be.</p><Link className="studio-button" to="/audit">Find my starting point <span>↗</span></Link></section></main></PageWrapper>;
}