/* ────────────────────────────────────────────────────────────────
   PageSpeed Insights proxy — Bode Conversion Lab

   The Free Audit page used to call Google's PageSpeed Insights API
   directly from the browser with the key hardcoded in the page's own
   source (PSI_KEY) — fully readable by anyone who opened dev tools
   or just viewed the page source. This moves the actual call
   server-side; the browser only ever sends the target URL + strategy.

   ENVIRONMENT VARIABLES NEEDED:
   - PSI_KEY  → Google Cloud Console → APIs & Services → Credentials.
                Same key that was hardcoded before works fine here —
                just move it into Vercel env vars instead of the
                source file. Worth rotating it (create a new one,
                delete the old) since the old value has been sitting
                in public source and should be treated as compromised.

   Place this file at: /api/pagespeed.js
──────────────────────────────────────────────────────────────────── */

import { cacheGet, cacheSet, normalizeTarget } from "../lib/scancache.js";

const PSI_KEY = process.env.PSI_KEY;
const RUNS = 3; // Lighthouse varies run to run; the median run is what we report

async function runOnce(url, strategy) {
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=seo&category=best-practices&category=accessibility&key=${PSI_KEY}`;
  const r = await fetch(endpoint, { signal: AbortSignal.timeout(50000) });
  const data = await r.json();
  if (!r.ok || data?.error) throw new Error(data?.error?.message || `HTTP ${r.status}`);
  return data;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!PSI_KEY) return res.status(500).json({ error: "PSI_KEY not set — add it in Vercel env vars first" });

  const { url, strategy: strat } = req.query;
  if (!url) return res.status(400).json({ error: "url is required" });
  const strategy = strat === "desktop" ? "desktop" : "mobile";

  const key = `bcl:psi:v1:${strategy}:${normalizeTarget(url)}`;
  const hit = await cacheGet(key);
  if (hit) {
    res.setHeader("x-bcl-cache", "hit");
    return res.status(200).json(hit);
  }

  // Three parallel runs, keep the one with the median performance score.
  // Parallel, so the wait is the slowest single run, not three in a row.
  const settled = await Promise.allSettled(Array.from({ length: RUNS }, () => runOnce(url, strategy)));
  const runs = settled.filter(s => s.status === "fulfilled").map(s => s.value);
  if (!runs.length) {
    const why = settled.find(s => s.status === "rejected")?.reason?.message || "PageSpeed failed";
    return res.status(502).json({ error: why });
  }
  const perf = d => d?.lighthouseResult?.categories?.performance?.score ?? 0;
  const median = [...runs].sort((x, y) => perf(x) - perf(y))[Math.floor(runs.length / 2)];

  await cacheSet(key, median);
  res.setHeader("x-bcl-cache", "miss");
  res.status(200).json(median);
}
