import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const site = (process.env.VITE_SITE_URL || "https://bodeconversionlab.vercel.app").replace(/\/$/, "");
const shareImage = site + "/og-image.png";

const pages = {
  "/": {
    title: "Ecommerce Growth, Built Around the Customer",
    description: "Bode Conversion Lab helps ecommerce businesses improve store experience, advertising, creative, product visibility and retention."
  },
  "/services": {
    title: "Ecommerce Growth Services",
    description: "Explore store optimization, paid advertising, AI product videos, SEO, retention and analytics services from Bode Conversion Lab."
  },
  "/store-optimization": {
    title: "Ecommerce Store Optimization",
    description: "Improve product pages, mobile usability, trust signals and the customer journey with Bode Conversion Lab."
  },
  "/paid-advertising": {
    title: "Ecommerce Paid Advertising",
    description: "Connect campaign strategy, creative testing, landing pages and measurement with Bode Conversion Lab."
  },
  "/ai-product-videos": {
    title: "AI Product Video Production",
    description: "Product-focused short-form video, UGC-style ad concepts and creative variations from Bode Conversion Lab."
  },
  "/seo-product-visibility": {
    title: "Ecommerce SEO and Product Visibility",
    description: "Improve technical SEO, product information, indexing and product-feed quality with Bode Conversion Lab."
  },
  "/email-retention": {
    title: "Email Marketing and Customer Retention",
    description: "Build useful lifecycle communication, abandoned-cart flows and repeat-purchase journeys with Bode Conversion Lab."
  },
  "/analytics-tracking": {
    title: "Ecommerce Analytics and Conversion Tracking",
    description: "Review conversion events, pixels, analytics and reporting to make more informed ecommerce decisions."
  },
  "/work": {
    title: "Selected Ecommerce and Creative Work",
    description: "Explore selected portfolio videos and project records from Bode Conversion Lab, with context on historical performance figures."
  },
  "/work/novi-good-store": {
    title: "Novi Good Store | Project Record",
    description: "Review the available Novi Good Store portfolio record from Bode Conversion Lab. Historical performance figures require supporting documentation."
  },
  "/work/robin-and-roobaby": {
    title: "Robin and Roobaby | Project Record",
    description: "Review the available Robin and Roobaby portfolio record from Bode Conversion Lab. Historical performance figures require supporting documentation."
  },
  "/work/stream-ride-store": {
    title: "Stream Ride Store | Project Record",
    description: "Review the available Stream Ride Store portfolio record from Bode Conversion Lab. Historical performance figures require supporting documentation."
  },
  "/about": {
    title: "About Bode Conversion Lab",
    description: "Learn about Bode Conversion Lab's customer-first approach to ecommerce store experience, marketing execution, creative and measurement."
  },
  "/contact": {
    title: "Contact Bode Conversion Lab",
    description: "Discuss your ecommerce store, marketing priorities and performance challenges with Bode Conversion Lab."
  },
  "/privacy": {
    title: "Privacy Policy",
    description: "Read how the Bode Conversion Lab website currently handles contact information and third-party resources."
  }
};

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const baseHtml = await readFile(path.join(dist, "index.html"), "utf8");

for (const [route, metadata] of Object.entries(pages)) {
  const canonical = site + (route === "/" ? "/" : route);
  let html = baseHtml.replaceAll("https://bodeconversionlab.vercel.app", site);
  html = html.replace(/<title>[^<]*<\/title>/i, "<title>" + escapeHtml(metadata.title + " | Bode Conversion Lab") + "</title>");
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/i, '<meta name="description" content="' + escapeHtml(metadata.description) + '" />');
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/i, '<link rel="canonical" href="' + canonical + '" />');
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/>/i, '<meta property="og:title" content="' + escapeHtml(metadata.title + " | Bode Conversion Lab") + '" />');
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/>/i, '<meta property="og:description" content="' + escapeHtml(metadata.description) + '" />');
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/>/i, '<meta property="og:url" content="' + canonical + '" />');
  html = html.replace(/<meta property="og:image" content="[^"]*"\s*\/>/i, '<meta property="og:image" content="' + shareImage + '" />');
  const outputDir = route === "/" ? dist : path.join(dist, route.slice(1));
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), html, "utf8");
}

const sitemapPath = path.join(dist, "sitemap.xml");
const robotsPath = path.join(dist, "robots.txt");
for (const filePath of [sitemapPath, robotsPath]) {
  try {
    const original = await readFile(filePath, "utf8");
    await writeFile(filePath, original.replaceAll("https://bodeconversionlab.vercel.app", site), "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

console.log("Generated route-specific HTML metadata for " + Object.keys(pages).length + " routes using " + site + ".");
