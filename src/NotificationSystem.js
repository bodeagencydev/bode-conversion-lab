/**
 * NOTIFICATION SYSTEM
 * Sends you an email via Formspree when:
 * 1. Someone visits the site (page view ping)
 * 2. Someone runs an audit (captures their URL + device info)
 * 3. Someone clicks Apply Now / CTA buttons
 *
 * Setup: Replace FORMSPREE_ID with your Formspree form ID
 * Get one free at formspree.io — use the same one as your contact form
 * or create a new one specifically for notifications
 */

const FORMSPREE_ID = "xaqadyal"; // ← your existing Formspree ID

function getDeviceInfo() {
  return {
    device: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
    browser: (() => {
      const ua = navigator.userAgent;
      if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
      if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
      if (ua.includes("Firefox")) return "Firefox";
      if (ua.includes("Edg")) return "Edge";
      return "Other";
    })(),
    os: (() => {
      const ua = navigator.userAgent;
      if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
      if (ua.includes("Android")) return "Android";
      if (ua.includes("Windows")) return "Windows";
      if (ua.includes("Mac")) return "macOS";
      return "Other";
    })(),
    screen: `${window.screen.width}×${window.screen.height}`,
    language: navigator.language || "unknown",
    referrer: document.referrer || "Direct",
    page: window.location.pathname,
    time: new Date().toLocaleString("en-GB", { timeZone: "UTC", dateStyle: "short", timeStyle: "short" }) + " UTC",
  };
}

async function ping(subject, fields = {}) {
  const info = getDeviceInfo();
  const body = {
    _subject: `🔔 BCL: ${subject}`,
    _replyto: "no-reply@bodeconversionlab.com",
    event: subject,
    ...fields,
    ...info,
  };
  try {
    await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // Silent fail — never break the user experience
  }
}

/* ── Page view tracker ── */
let _lastPage = "";
export function trackPageView(pathname) {
  if (pathname === _lastPage) return;
  _lastPage = pathname;
  // Debounce 2s to avoid double-fires on React re-renders
  setTimeout(() => {
    ping(`New visitor → ${pathname}`, { page_visited: pathname });
  }, 2000);
}

/* ── Audit run tracker ── */
export function trackAuditRun(storeUrl) {
  ping("Audit Scan Started", { store_url: storeUrl, event_type: "audit_scan" });
}

/* ── Audit result tracker ── */
export function trackAuditResult(storeUrl, score, isCritical) {
  ping(`Audit Complete — ${storeUrl} scored ${score}/100${isCritical ? " 🚨 CRITICAL" : ""}`, {
    store_url: storeUrl,
    overall_score: score,
    critical: isCritical ? "YES" : "NO",
    event_type: "audit_result",
  });
}

/* ── CTA click tracker ── */
export function trackCTAClick(ctaLabel) {
  ping(`CTA Clicked: ${ctaLabel}`, { cta: ctaLabel, event_type: "cta_click" });
}

/* ── React hook — use in App.jsx ── */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);
}
