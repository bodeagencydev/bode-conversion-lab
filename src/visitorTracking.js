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

/* Picks a name up from the URL itself (?name=Fiyin), so a personalized link
   Fiyin sends out -- an email follow-up, a WhatsApp message, a DM -- can land
   someone on the site already greeted by name, with no form involved. This is
   the ONLY honest way to know a visitor's name before they've told the site
   themselves: it only works when Fiyin puts it in the link, never guessed or
   looked up. Safe to call on every page load; does nothing if the param isn't
   there, and never overwrites a name the site already captured some other way. */
export function captureNameFromUrl() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("name");
    if (fromUrl && !getKnownName()) storeKnownName(fromUrl);
  } catch {}
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

const KNOWN_NAME_KEY = "bcl_known_name";

/* Once someone gives their name anywhere on the site (Contact, Pricing gate,
   the newsletter form), remember it in THIS browser so any later popup or
   the chat widget can greet them by name instead of a generic line. Never
   sent anywhere new by this file -- captureLeadContact already sends it to
   the server; this just keeps a local copy for the UI to read back. */
export function storeKnownName(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) return;
  try { localStorage.setItem(KNOWN_NAME_KEY, trimmed.slice(0, 60)); } catch {}
}

export function getKnownName() {
  try { return localStorage.getItem(KNOWN_NAME_KEY) || null; } catch { return null; }
}

export function captureLeadContact(email, name) {
  const visitorId = getVisitorId();
  storeKnownName(name);
  fetch("/api/contact/capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visitorId, email, name }),
  }).catch(() => {});
}
