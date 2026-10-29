import { access, readFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const routes = [
  "/", "/services", "/store-optimization", "/paid-advertising",
  "/ai-product-videos", "/seo-product-visibility", "/email-retention",
  "/analytics-tracking", "/work", "/work/novi-good-store",
  "/work/robin-and-roobaby", "/work/stream-ride-store", "/about",
  "/contact", "/privacy"
];

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL:", message);
    process.exitCode = 1;
  }
}

for (const route of routes) {
  const file = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  try {
    const html = await readFile(file, "utf8");
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] || "";
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] || "";
    const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1] || "";
    assert(title.includes("Bode Conversion Lab"), `${route}: missing branded title`);
    assert(canonical.endsWith(route === "/" ? "/" : route), `${route}: canonical URL does not match route (${canonical})`);
    assert(description.length >= 40, `${route}: missing or short meta description`);
    assert(!html.includes("budyagencyofficial"), `${route}: old contact email found`);
  } catch {
    assert(false, `${route}: generated HTML file missing (${file})`);
  }
}

for (const asset of ["og-image.png", "favicon.png", "apple-touch-icon.png", "logo-mark.png", "robots.txt", "sitemap.xml"]) {
  try {
    await access(path.join(dist, asset));
  } catch {
    assert(false, `required public asset missing: ${asset}`);
  }
}

try {
  const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
  const sitemapRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  assert(sitemapRoutes.length === routes.length, `sitemap should list ${routes.length} routes, found ${sitemapRoutes.length}`);
  for (const route of routes) assert(sitemapRoutes.includes(route), `sitemap missing route: ${route}`);
  const robots = await readFile(path.join(dist, "robots.txt"), "utf8");
  assert(robots.includes("/sitemap.xml"), "robots.txt must reference the sitemap");
} catch {
  assert(false, "sitemap.xml or robots.txt could not be read");
}

if (process.exitCode) {
  console.error("Build verification failed.");
} else {
  console.log(`Build verification passed: ${routes.length} route HTML files, SEO metadata, sitemap, robots.txt and core assets.`);
}
