/* ────────────────────────────────────────────────────────────────
   Business identification (free tier) — Bode Conversion Lab

   Uses ipapi.co's free endpoint (no key required at low volume) to look
   up which organization a visitor's IP address is registered to — this
   is public network-registration data (the same kind of thing a WHOIS
   lookup gives you), not anything scraped or private.

   BE HONEST ABOUT WHAT THIS ACTUALLY TELLS YOU: for most visitors on
   home wifi or mobile data, this returns their ISP's name (e.g.
   "Comcast Cable", "Vodafone") — not their employer. It only reflects a
   real company name when someone browses from a business's own
   dedicated internet connection, which is common for offices, uncommon
   for everyone else. That's why this is scored at low confidence (0.35)
   and labeled clearly — it's a real signal, not a company database.

   Paid providers (Clearbit, Apollo, etc.) do a fundamentally different
   and more reliable thing here — this free version is a starting point,
   not a replacement for one, if that's ever worth the recurring cost.
──────────────────────────────────────────────────────────────────── */

export async function identifyBusinessFromIP(ip) {
  if (!ip || ip === "::1" || ip.startsWith("127.") || ip.startsWith("10.") || ip.startsWith("192.168.")) {
    return null; // local/dev traffic, nothing real to look up
  }
  try {
    const r = await fetch(`https://ipapi.co/${ip}/json/`, { signal: AbortSignal.timeout(4000) });
    if (!r.ok) return null;
    const data = await r.json();
    if (!data || data.error || !data.org) return null;

    // Free-tier ISP orgs are extremely noisy generic names — filtering out
    // the most common ones stops the dashboard filling up with
    // "Company: Comcast Cable" on every residential visitor, which would
    // be actively misleading rather than just unhelpful.
    const genericIsps = /comcast|verizon|at&t|spectrum|xfinity|vodafone|t-mobile|charter|cox communications|frontier|centurylink|orange sa|deutsche telekom/i;
    if (genericIsps.test(data.org)) return null;

    return {
      companyName: data.org,
      domain: null, // ipapi.co doesn't provide this — a real limitation of the free tier
      country: data.country_name || null,
      confidence: 0.35,
      source: "ip_org_lookup_free_tier",
    };
  } catch {
    return null; // never let a lookup failure break visitor tracking
  }
}
