/* ────────────────────────────────────────────────────────────────
   Visitor tracking (frontend) — Bode Conversion Lab

   First-party only: the visitor ID lives in this browser's own
   localStorage, nothing third-party, nothing that reads across sites.
   Talks to /api/visitor/session.js, /api/visitor/event.js, and
   /api/contact/capture.js — see those files for what actually happens
   with this data server-side.
──────────────────────────────────────────────────────────────────── */

const VISITOR_ID_KEY = "bcl_visitor_id";

export function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      // Server assigns the real ID on first session call; this is just a
      // placeholder so the very first request has something to send.
      id = null;
    }
    return id;
  } catch { return null; }
}

function storeVisitorId(id) {
  try { localStorage.setItem(VISITOR_ID_KEY, id); } catch {}
}

function getUTM() {
  try {
    const p = new URLSearchParams(window.location.search);
    return { utmSource: p.get("utm_source"), utmMedium: p.get("utm_medium"), utmCampaign: p.get("utm_campaign") };
  } catch { return {}; }
}

export async function initVisitorSession(page) {
  try {
    const { utmSource, utmMedium, utmCampaign } = getUTM();
    const r = await fetch("/api/visitor/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: getVisitorId(), page, referrer: document.referrer || null, utmSource, utmMedium, utmCampaign }),
    });
    const data = await r.json();
    if (data.visitorId) storeVisitorId(data.visitorId);
    return data;
  } catch { return null; }
}

export function trackPageView(page) {
  const visitorId = getVisitorId();
  if (!visitorId) return; // session hasn't been established yet, nothing to attach this to
  fetch("/api/visitor/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visitorId, page }),
  }).catch(() => {});
}

export function captureLeadContact(email, name) {
  const visitorId = getVisitorId();
  fetch("/api/contact/capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visitorId, email, name }),
  }).catch(() => {});
}
