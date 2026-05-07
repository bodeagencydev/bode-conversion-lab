async function fetchPSI(storeUrl, strategy) {
  const API_KEY = "AIzaSyCAnT0GIpN-3OVQkP3fPJBwhl6pTU0BN8k";
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(storeUrl)}` +
    `&strategy=${strategy}` +
    `&category=performance&category=seo&category=best-practices&category=accessibility` +
    `&key=${API_KEY}`;

  const r = await fetch(api, { signal: AbortSignal.timeout(35000) });
  if (!r.ok) throw new Error(`PageSpeed API HTTP ${r.status}`);
  const d = await r.json();
  if (d?.error) throw new Error(d.error.message || "PSI error");
  return d;
}