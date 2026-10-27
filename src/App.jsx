import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { ThemeContext } from "./components.jsx";
import "./App.css";
const Home=lazy(()=>import("./pages/Home.jsx"));
const Services=lazy(()=>import("./pages/Services.jsx"));
const About=lazy(()=>import("./pages/About.jsx"));
const ServiceDetail=lazy(()=>import("./pages/ServiceDetail.jsx"));
const SRS=lazy(()=>import("./pages/SRS.jsx"));
const Projects=lazy(()=>import("./pages/PastProjects.jsx").then(m=>({default:m.PastProjects})));
const Pricing=lazy(()=>import("./pages/Pricing.jsx"));
const Blog=lazy(()=>import("./pages/Blog.jsx").then(m=>({default:m.Blog})));
const Contact=lazy(()=>import("./pages/Contact.jsx"));
const Audit=lazy(()=>import("./pages/Audit.jsx"));
const Subscribe=lazy(()=>import("./pages/Subscribe.jsx"));
const Admin=lazy(()=>import("./pages/Admin.jsx"));
const Privacy=lazy(()=>import("./pages/Privacy.jsx"));
const Terms=lazy(()=>import("./pages/Terms.jsx"));
const NotFound=lazy(()=>import("./NotFound.jsx"));
function SiteNav(){const [open,setOpen]=useState(false);const location=useLocation();useEffect(()=>setOpen(false),[location.pathname]);const links=[["Services","/services"],["Our work","/past-projects"],["About","/about"],["Insights","/blog"],["Pricing","/pricing"]];return <header className="site-nav"><Link to="/" className="brand" aria-label="Bode Conversion Lab home"><img src="/favicon.png" alt=""/><span>BODE <b>CONVERSION LAB</b></span></Link><button className="menu-toggle" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label="Toggle navigation">{open?"Close":"Menu"}</button><nav className={open?"site-links is-open":"site-links"}>{links.map(([label,path])=><Link key={path} to={path}>{label}</Link>)}<Link className="nav-cta" to="/audit">Get an audit <span>↗</span></Link></nav></header>}
function SiteFooter(){return <footer className="site-footer"><div className="footer-top"><div><Link to="/" className="brand footer-brand"><img src="/favicon.png" alt=""/><span>BODE <b>CONVERSION LAB</b></span></Link><p>We don’t guess. We engineer conversion.</p></div><div className="footer-links"><Link to="/services">Services</Link><Link to="/past-projects">Our work</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Bode Conversion Lab</span><a href="mailto:bodeagencyofficial@gmail.com">bodeagencyofficial@gmail.com</a><a href="https://www.instagram.com/bodeconversionlab/" target="_blank" rel="noreferrer">Instagram ↗</a></div></footer>}
function RouteContent(){const location=useLocation();useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[location.pathname]);return <><SiteNav/><Suspense fallback={<div className="loading-state">Bode Conversion Lab<span/></div>}><Routes><Route path="/" element={<Home/>}/><Route path="/services" element={<Services/>}/><Route path="/about" element={<About/>}/><Route path="/services/:id" element={<ServiceDetail/>}/><Route path="/past-projects" element={<Projects/>}/><Route path="/past-projects/:id" element={<Projects/>}/><Route path="/pricing" element={<Pricing/>}/><Route path="/srs" element={<SRS/>}/><Route path="/blog" element={<Blog/>}/><Route path="/blog/:id" element={<Blog/>}/><Route path="/contact" element={<Contact/>}/><Route path="/audit" element={<Audit/>}/><Route path="/subscribe" element={<Subscribe/>}/><Route path="/admin" element={<Admin/>}/><Route path="/privacy" element={<Privacy/>}/><Route path="/terms" element={<Terms/>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense><SiteFooter/></>}
export default function App(){return <ThemeContext.Provider value={{dark:false,toggle:()=>{}}}><BrowserRouter><div className="site-root"><RouteContent/></div></BrowserRouter></ThemeContext.Provider>}
