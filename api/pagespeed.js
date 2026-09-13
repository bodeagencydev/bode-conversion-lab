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

const PSI_KEY = process.env.PSI_KEY;

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!PSI_KEY) return res.status(500).json({ error: "PSI_KEY not set — add it in Vercel env vars first" });

  const { url, strategy } = req.query;
  if (!url) return res.status(400).json({ error: "url is required" });

  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy || "mobile"}&category=performance&category=seo&category=best-practices&category=accessibility&key=${PSI_KEY}`;

  try {
    const r = await fetch(endpoint, { signal: AbortSignal.timeout(45000) });
    const data = await r.json();
    if (!r.ok || data?.error) return res.status(502).json({ error: data?.error?.message || `HTTP ${r.status}` });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
