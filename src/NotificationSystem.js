/**
 * SMART NOTIFICATION SYSTEM
 * ─────────────────────────
 * Uses localStorage to track what has already been reported.
 * You will ONLY be notified:
 *   • First time a unique device visits the site
 *   • First time a device runs an audit (with their URL)
 *   • First time a device clicks each CTA type
 *   • First time a device visits each page
 *
 * After that — silence. No repeated pings from the same person.
 *
 * Notifications arrive as emails to your Formspree inbox.
 * Subject lines are prefixed with 🔔 BCL: so you can filter them.
 */

const FORMSPREE_ID = "xaqadyal"; // ← your Formspree ID
const STORAGE_KEY  = "bcl_notified"; // localStorage key

/* ── Read/write the notification log ── */
function getLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function setLog(log) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(log)); } catch {}
}

/* Returns true if this event has already been reported from this device */
function alreadyReported(eventKey) {
  const log = getLog();
  return !!log[eventKey];
}

/* Mark event as reported */
function markReported(eventKey) {
  const log = getLog();
  log[eventKey] = new Date().toISOString();
  setLog(log);
}

/* ── Collect device/session info ── */
function getDeviceInfo() {
  return {
    device:   /Mobi|Android/i.test(navigator.userAgent) ? "📱 Mobile" : "🖥 Desktop",
    browser:  (() => {
      const ua = navigator.userAgent;
      if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
      if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
      if (ua.includes("Firefox")) return "Firefox";
      if (ua.includes("Edg")) return "Edge";
      return "Other";
    })(),
    os: (() => {
      const ua = navigator.userAgent;
      if (/iPhone|iPad/.test(ua)) return "iOS";
      if (/Android/.test(ua))     return "Android";
      if (/Windows/.test(ua))     return "Windows";
      if (/Mac/.test(ua))         return "macOS";
      return "Other";
    })(),
    screen:   `${window.screen.width}×${window.screen.height}`,
    language: navigator.language || "unknown",
    referrer: document.referrer || "Direct / No referrer",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
    time:     new Date().toLocaleString("en-GB", { dateStyle:"short", timeStyle:"short" }) + " (local)",
  };
}

/* ── Core ping function ── */
async function ping(subject, fields = {}) {
  try {
    await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        _subject:  `🔔 BCL: ${subject}`,
        _replyto:  "no-reply@bodeconversionlab.com",
        event:     subject,
        ...getDeviceInfo(),
        ...fields,
      }),
    });
  } catch {
    /* Silent fail — never break the user experience */
  }
}

/* ══════════════════════════════════════════
   PUBLIC API
══════════════════════════════════════════ */

/**
 * Track a page view — fires ONCE per page per device
 * Called automatically from App.jsx on every route change
 */
export function trackPageView(pathname) {
  const key = `page:${pathname}`;
  if (alreadyReported(key)) return;
  markReported(key);

  // Small delay so it doesn't fire on bounces
  setTimeout(() => {
    ping(`New page visit → ${pathname}`, {
      page:       pathname,
      event_type: "page_view",
      full_url:   window.location.href,
    });
  }, 3000); // Only report if they stay 3+ seconds
}

/**
 * Track first site visit — fires ONCE per device, ever
 */
export function trackFirstVisit() {
  const key = "first_visit";
  if (alreadyReported(key)) return;
  markReported(key);

  setTimeout(() => {
    ping("🌟 New visitor (first time)", {
      event_type:   "first_visit",
      landing_page: window.location.pathname,
      full_url:     window.location.href,
    });
  }, 5000); // Only if they stay 5+ seconds
}

/**
 * Track audit scan — fires ONCE per store URL per device
 * @param {string} storeUrl - The URL they entered
 */
export function trackAuditRun(storeUrl) {
  const key = `audit:${storeUrl}`;
  if (alreadyReported(key)) return;
  markReported(key);

  ping(`🔍 Audit scan — ${storeUrl}`, {
    store_url:  storeUrl,
    event_type: "audit_scan",
  });
}

/**
 * Track audit result — fires ONCE per store URL per device
 * @param {string} storeUrl
 * @param {number} score
 * @param {boolean} isCritical
 */
export function trackAuditResult(storeUrl, score, isCritical) {
  const key = `audit_result:${storeUrl}`;
  if (alreadyReported(key)) return;
  markReported(key);

  ping(`📊 Audit result — ${storeUrl} → ${score}/100${isCritical?" 🚨 CRITICAL":""}`, {
    store_url:     storeUrl,
    overall_score: score,
    is_critical:   isCritical ? "YES 🚨" : "No",
    event_type:    "audit_result",
  });
}

/**
 * Track CTA click — fires ONCE per CTA label per device
 * @param {string} ctaLabel - e.g. "Apply Now", "Get free audit"
 */
export function trackCTAClick(ctaLabel) {
  const key = `cta:${ctaLabel}`;
  if (alreadyReported(key)) return;
  markReported(key);

  ping(`👆 CTA clicked — "${ctaLabel}"`, {
    cta:        ctaLabel,
    page:       window.location.pathname,
    event_type: "cta_click",
  });
}

/**
 * Track contact form submission — always fires (you want every lead)
 * @param {string} email - visitor's email
 * @param {string} name  - visitor's name
 */
export function trackFormSubmit(email, name) {
  // Always report form submissions — every lead matters
  ping(`📩 Form submitted — ${name} (${email})`, {
    visitor_name:  name,
    visitor_email: email,
    page:          window.location.pathname,
    event_type:    "form_submit",
  });
}

/* ── React hook — use inside BrowserRouter ── */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track first visit ever
    trackFirstVisit();
  }, []);

  useEffect(() => {
    // Track each page visit (once per page per device)
    trackPageView(location.pathname);
  }, [location.pathname]);
}