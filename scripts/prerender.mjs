/**
 * Build-time prerender ("static shell") for the SPA.
 *
 * Runs after `vite build`. For every public route it writes dist/<route>/index.html
 * containing:
 *   - the correct <title>, meta description, canonical, Open Graph and Twitter tags
 *   - real, readable page content (H1, copy, links) inside #root
 *   - FAQ / Service JSON-LD where the page shows that content
 * React still mounts with createRoot() and replaces #root as soon as the JS loads,
 * so visitors get the normal app. Crawlers that never run JavaScript (or run it
 * badly) now see a complete page instead of a spinner.
 *
 * The content comes from the same files the React pages use (src/data.js and
 * src/site-content.js), so it cannot drift from what visitors see.
 *
 * SAFETY: this script never fails the deploy. Any error is logged and the plain
 * Vite build is left untouched.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const SITE = "https://bodeconversionlab.vercel.app";
const BRAND = "Bode Conversion Lab";
const DEFAULT_TITLE = "Bode Conversion Lab — Store Optimization & Ads Engineering";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const NAV = [
  ["Home", "/"], ["About", "/about"], ["SRS", "/srs"], ["Past Projects", "/past-projects"],
  ["Pricing", "/pricing"], ["Blog", "/blog"], ["Free Audit", "/audit"], ["Contact", "/contact"],
];

// Pull title / description / path out of a page's <SEO ... /> block so titles never drift.
function readSEO(file) {
  const src = fs.readFileSync(path.join(ROOT, "src", "pages", file), "utf8");
  const block = src.match(/<SEO[\s\S]*?\/>/);
  if (!block) return null;
  const grab = (k) => {
    const m = block[0].match(new RegExp(`${k}=(?:"([^"]*)"|\\{"([^"]*)"\\})`));
    return m ? (m[1] ?? m[2]) : "";
  };
  return { title: grab("title"), description: grab("description"), path: grab("path") };
}

const h = (tag, text, attrs = "") => `<${tag}${attrs ? " " + attrs : ""}>${esc(text)}</${tag}>`;
const p = (text) => h("p", text);
const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

function shell(bodyHtml, servicesList) {
  const nav = NAV.map(([t, hr]) => link(hr, t)).join(" | ");
  const services = servicesList.map((s) => link(`/services/${s.id}`, s.title)).join(" | ");
  return (
    `<div id="prerender-shell" style="background:#040608;color:#e8ece9;min-height:100vh;font-family:'IBM Plex Sans',system-ui,sans-serif;line-height:1.7">` +
    `<style>#prerender-shell a{color:#00ff88}#prerender-shell h1,#prerender-shell h2,#prerender-shell h3{font-family:'Space Grotesk',system-ui,sans-serif;line-height:1.2}#prerender-shell li{margin:.35rem 0}</style>` +
    `<header style="max-width:900px;margin:0 auto;padding:1.5rem"><strong>${esc(BRAND)}</strong><nav aria-label="Main">${nav}</nav></header>` +
    `<main style="max-width:900px;margin:0 auto;padding:1rem 1.5rem 3rem">${bodyHtml}</main>` +
    `<footer style="max-width:900px;margin:0 auto;padding:1.5rem 1.5rem 3rem;font-size:14px">` +
    `<p>We don't run ads. We engineer ROAS.</p><nav aria-label="Services">${services}</nav></footer></div>`
  );
}

function jsonLdScript(id, obj) {
  return `<script type="application/ld+json" id="${id}">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
}

async function main() {
  const indexPath = path.join(DIST, "index.html");
  if (!fs.existsSync(indexPath)) throw new Error("dist/index.html not found (run vite build first)");
  const template = fs.readFileSync(indexPath, "utf8");
  if (!template.includes('<div id="root"></div>')) throw new Error('template has no empty <div id="root"></div>');

  const data = await import(pathToFileURL(path.join(ROOT, "src", "data.js")).href);
  const site = await import(pathToFileURL(path.join(ROOT, "src", "site-content.js")).href);
  const { SERVICES, BLOG_POSTS, PAST_PROJECTS, TESTIMONIALS } = data;
  const { PHASES, COMPARISON, SRS_FAQ, PROOF_RESULTS, HOME_STEPS, HOME_SRS_PHASES } = site;
  const realProjects = (PAST_PROJECTS || []).filter((x) => !x.placeholder);

  /** @type {{path:string,title:string,description:string,body:string,extraHead?:string,priority:string}[]} */
  const routes = [];

  // ---- Home ----
  {
    const seo = readSEO("Home.jsx") || {};
    routes.push({
      path: "/",
      title: seo.title,
      description: seo.description,
      priority: "1.0",
      body:
        h("h1", "We turn your store into a revenue machine.") +
        p("We don't run ads. We engineer ROAS — auditing every leak in your store, ads, and checkout, then fixing it as one compounding system.") +
        `<p>${link("/audit", "Scan my store free")} | ${link("https://calendly.com/bodeagencyofficial/30min", "Book a free strategy call")} | ${link("/past-projects", "See our past work")}</p>` +
        h("h2", "Real client results") +
        ul(PROOF_RESULTS.map((r) => `${esc(r.name)}: ${esc(r.line)}`)) +
        h("h2", "Same product. Same budget. 70x the revenue.") +
        p("70x revenue multiplier, 90 days to results, 4x+ ROAS improvement.") +
        h("h2", "We don't run ads. We engineer ROAS.") +
        HOME_STEPS.map((s) => h("h3", `${s.n} ${s.t}`) + p(s.d)).join("") +
        h("h2", "What is SRS?") +
        p("SRS, the Sales Recovery System, is the system behind everything we do. Most agencies run ads first. We fix the store first, because sending traffic to a leaky funnel just burns your budget faster.") +
        ul(HOME_SRS_PHASES.map((s) => `Phase ${esc(s.phase)}, ${esc(s.t)}: ${esc(s.d)}`)) +
        `<p>${link("/srs", "See the full SRS breakdown")}</p>` +
        h("h2", "Services") +
        ul(SERVICES.map((s) => `${link(`/services/${s.id}`, s.title)}: ${esc(s.tagline)}`)),
    });
  }

  // ---- SRS ----
  {
    const seo = readSEO("SRS.jsx") || {};
    routes.push({
      path: "/srs",
      title: seo.title,
      description: seo.description,
      priority: "0.9",
      extraHead: jsonLdScript("seo-faq-jsonld", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: SRS_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }),
      body:
        h("h1", "The Sales Recovery System (SRS)") +
        p(seo.description) +
        PHASES.map((ph) => h("h2", `Phase ${ph.n}: ${ph.name} (${ph.tag})`) + p(ph.summary) + p(ph.detail) + ul(ph.bullets.map(esc))).join("") +
        h("h2", "SRS vs a typical ad agency") +
        ul(COMPARISON.map((c) => `Typical agency: ${esc(c.theirs)}. SRS: ${esc(c.ours)}`)) +
        h("h2", "SRS in action") +
        ul(PROOF_RESULTS.map((r) => `${esc(r.name)}: ${esc(r.line)}`)) +
        `<p>${link("/past-projects", "View all past projects")}</p>` +
        h("h2", "Questions about SRS") +
        SRS_FAQ.map((f) => h("h3", f.q) + p(f.a)).join("") +
        `<p>${link("/audit", "Run my free audit")} | ${link("/pricing", "See pricing")}</p>`,
    });
  }

  // ---- Simple pages: title + description from each page's own <SEO> block ----
  const simple = [
    ["About.jsx", "/about", "0.8", "About Bode Conversion Lab"],
    ["Pricing.jsx", "/pricing", "0.9", "Pricing"],
    ["Contact.jsx", "/contact", "0.8", "Contact"],
    ["Audit.jsx", "/audit", "0.9", "Free Store Audit"],
    ["Privacy.jsx", "/privacy", "0.3", "Privacy Policy"],
    ["Terms.jsx", "/terms", "0.3", "Terms of Service"],
  ];
  for (const [file, route, priority, fallbackH1] of simple) {
    const seo = readSEO(file);
    if (!seo || !seo.title) {
      console.warn(`[prerender] no literal <SEO> found in ${file}, skipping ${route}`);
      continue;
    }
    routes.push({
      path: route,
      title: seo.title,
      description: seo.description,
      priority,
      body:
        h("h1", seo.title || fallbackH1) +
        p(seo.description) +
        (route === "/audit"
          ? p("Enter your store URL and email to get a free audit covering page speed, checkout friction, trust signals, mobile experience, and SEO.")
          : "") +
        h("h2", "Explore") +
        ul(NAV.map(([t, hr]) => link(hr, t))),
    });
  }

  // ---- Past projects list ----
  {
    const seo = readSEO("PastProjects.jsx") || {};
    routes.push({
      path: "/past-projects",
      title: seo.title || "Past Projects",
      description: seo.description || "Real client work and results from Bode Conversion Lab.",
      priority: "0.8",
      body:
        h("h1", "Past projects") +
        p(seo.description || "Real client work and results from Bode Conversion Lab.") +
        h("h2", "Client results") +
        ul(PROOF_RESULTS.map((r) => `${esc(r.name)}: ${esc(r.line)}`)) +
        (realProjects.length
          ? h("h2", "Project write-ups") +
            ul(realProjects.map((x) => `${link(`/past-projects/${x.id}`, x.client)}: ${esc(x.headline)}`))
          : ""),
    });
    for (const x of realProjects) {
      routes.push({
        path: `/past-projects/${x.id}`,
        title: `${x.client}: ${x.headline}`,
        description: x.summary,
        priority: "0.6",
        body:
          h("h1", `${x.client}: ${x.headline}`) +
          p(x.summary) +
          (x.role ? p(`Role: ${x.role}`) : "") +
          (x.whatIDid?.length ? h("h2", "What was done") + ul(x.whatIDid.map(esc)) : "") +
          (x.toolsUsed?.length ? h("h2", "Tools used") + ul(x.toolsUsed.map(esc)) : "") +
          `<p>${link("/past-projects", "All past projects")}</p>`,
      });
    }
  }

  // ---- Services ----
  for (const s of SERVICES) {
    routes.push({
      path: `/services/${s.id}`,
      title: s.seoTitle || s.title,
      description: s.seoDesc || s.desc,
      priority: "0.7",
      extraHead: jsonLdScript("seo-service-jsonld", {
        "@context": "https://schema.org",
        "@type": "Service",
        name: s.title,
        description: s.seoDesc || s.desc,
        provider: { "@type": "Organization", name: BRAND, url: SITE },
        areaServed: "Worldwide",
        url: `${SITE}/services/${s.id}`,
      }),
      body:
        h("h1", s.title) +
        p(s.tagline) +
        p(s.desc) +
        (s.bullets?.length ? h("h2", "What's included") + ul(s.bullets.map(esc)) : "") +
        (s.process?.length ? h("h2", "How it works") + `<ol>${s.process.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>` : "") +
        `<p>${link(s.link || "/pricing", "See pricing")} | ${link("/audit", "Run my free audit")}</p>`,
    });
  }

  // ---- Blog ----
  routes.push({
    path: "/blog",
    title: (readSEO("Blog.jsx") || {}).title || "Blog — E-commerce Conversion & Ads Tips",
    description: (readSEO("Blog.jsx") || {}).description || "Operator-tested tactics on ROAS, checkout optimization, ad strategy, and email flows.",
    priority: "0.7",
    body:
      h("h1", "Blog: e-commerce conversion and ads tips") +
      ul(BLOG_POSTS.map((b) => `${link(`/blog/${b.id}`, b.title)}: ${esc(b.excerpt)}`)),
  });
  for (const b of BLOG_POSTS) {
    routes.push({
      path: `/blog/${b.id}`,
      title: b.title,
      description: b.excerpt,
      priority: "0.6",
      extraHead: "",
      body:
        h("h1", b.title) +
        p(`${b.category || ""} ${b.date ? "| " + b.date : ""} ${b.readTime ? "| " + b.readTime : ""}`.trim()) +
        (b.content || []).map((c) => (c.heading ? h("h2", c.heading) : "") + (c.body ? p(c.body) : "")).join("") +
        `<p>${link("/blog", "All articles")}</p>`,
    });
  }

  // ---- Write every route ----
  const fullTitle = (t) => (t ? `${t} | ${BRAND}` : DEFAULT_TITLE);
  let written = 0;
  for (const r of routes) {
    const url = `${SITE}${r.path === "/" ? "/" : r.path}`;
    const canonicalUrl = r.path === "/" ? `${SITE}/` : url;
    const title = fullTitle(r.title);
    const desc = r.description || "";
    let html = template;
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
    html = html.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(desc)}" />`);
    html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`);
    html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(desc)}" />`);
    html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${esc(canonicalUrl)}" />`);
    html = html.replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(title)}" />`);
    html = html.replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(desc)}" />`);
    html = html.replace("</head>", `    <link rel="canonical" href="${esc(canonicalUrl)}" />\n${r.extraHead ? "    " + r.extraHead + "\n" : ""}  </head>`);
    html = html.replace('<div id="root"></div>', `<div id="root">${shell(r.body, SERVICES)}</div>`);

    const outFile = r.path === "/" ? path.join(DIST, "index.html") : path.join(DIST, r.path, "index.html");
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html);
    written++;
  }

  // ---- sitemap.xml generated from the same route list ----
  const today = new Date().toISOString().slice(0, 10);
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes
      .filter((r) => !["/privacy", "/terms"].includes(r.path))
      .map((r) => `  <url><loc>${SITE}${r.path === "/" ? "/" : r.path}</loc><lastmod>${today}</lastmod><priority>${r.priority}</priority></url>`)
      .join("\n") +
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);

  console.log(`[prerender] wrote ${written} pages + sitemap.xml`);
}

main().catch((err) => {
  console.warn(`[prerender] skipped, plain build left untouched: ${err.message}`);
  // vercel.json rewrites /srs, /pricing, etc. to <route>/index.html. If prerendering failed,
  // make sure those files still exist (plain app shell) so no page ever 404s.
  try {
    const base = path.join(DIST, "index.html");
    if (fs.existsSync(base)) {
      for (const r of ["about", "srs", "pricing", "past-projects", "blog", "contact", "audit"]) {
        const out = path.join(DIST, r, "index.html");
        if (!fs.existsSync(out)) {
          fs.mkdirSync(path.dirname(out), { recursive: true });
          fs.copyFileSync(base, out);
        }
      }
    }
  } catch {}
  process.exit(0);
});
