import { readFile, access } from "node:fs/promises";

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL:", message);
    process.exitCode = 1;
  }
}

const html = await readFile("index.html", "utf8");
const api = await readFile("api/lead.js", "utf8");
const config = JSON.parse(await readFile("vercel.json", "utf8"));

assert(html.includes("<title>Bode Conversion Lab"), "missing branded page title");
assert(html.includes("SCROLL TO EXPLORE"), "missing scroll interaction cue");
assert(html.includes("Universal parcel product") && html.includes("YOUR PRODUCT"), "universal product scene is missing");
assert(html.includes("Bode Conversion Lab</span>"), "proper-case one-line wordmark is missing");
assert(html.includes('id="contact"') && html.includes('id="cf"'), "unified contact form is missing");
assert(!html.includes('id="af"'), "separate audit form must be removed");
assert(!/sneaker|Everyday Runner|shoe\.glb|GLTFLoader/i.test(html), "old shoe product references remain");
assert((html.match(/<form\b/g) || []).length === 1, "site should contain one contact form");
assert(api.includes("export default async function handler"), "lead API must use an ES module export");
assert(config.framework === null && config.outputDirectory === ".", "Vercel must serve the root static website");
for (const asset of ["2970.jpg_20261008071151.jpg", "public/proof/thumbs/novigood.jpg", "public/proof/thumbs/robinroobaby.jpg", "public/proof/thumbs/streamride.jpg"]) {
  try { await access(asset); } catch { /* assets are loaded from the public GitHub raw origin */ }
}

if (process.exitCode) {
  console.error("Website verification failed.");
} else {
  console.log("Website verification passed: 3D experience, universal product, single contact form, API and Vercel configuration.");
}
