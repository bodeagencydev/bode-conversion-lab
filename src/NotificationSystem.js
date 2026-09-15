import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initVisitorSession, trackPageView } from "./visitorTracking.js";

/* ─── The Telegram token used to live here (as VITE_TELEGRAM_TOKEN) and
   this file called Telegram's API directly from the browser — meaning the
   full bot token shipped in the public JS bundle, readable by anyone. It
   now goes through /api/notify.js instead, which holds the real token
   server-side only. Nothing else about how this file is used changes. ─── */

/* ─── Send via the server-side proxy ── */
async function sendTelegram(message) {
  try {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  } catch {
    // never break the site for a notification failure
  }
}

/* ─── Visitor info ── */
function getInfo() {
  const ua = navigator.userAgent;
  const device =
    /Mobi|Android/i.test(ua) ? "📱 Mobile" :
    /Tablet|iPad/i.test(ua)  ? "📟 Tablet" : "🖥️ Desktop";
  const browser =
    /Edg/i.test(ua)     ? "Edge"    :
    /Chrome/i.test(ua)  ? "Chrome"  :
    /Firefox/i.test(ua) ? "Firefox" :
    /Safari/i.test(ua)  ? "Safari"  : "Unknown";

  const params   = new URLSearchParams(window.location.search);
  const src      = params.get("utm_source")   || document.referrer || "direct";
  const med      = params.get("utm_medium")   || "—";
  const camp     = params.get("utm_campaign") || "—";
  const ref      = document.referrer ? new URL(document.referrer).hostname : "none";

  const visits = parseInt(localStorage.getItem("bcl_v") || "0") + 1;
  localStorage.setItem("bcl_v", String(visits));

  const sessionPages = parseInt(sessionStorage.getItem("bcl_pages") || "0") + 1;
  sessionStorage.setItem("bcl_pages", String(sessionPages));

  if (!sessionStorage.getItem("bcl_sid")) {
    sessionStorage.setItem("bcl_sid", Math.random().toString(36).slice(2,8).toUpperCase());
  }

  const tz       = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const lang     = navigator.language || "unknown";
  const screen   = `${window.screen.width}×${window.screen.height}`;
  const online   = navigator.onLine ? "Online" : "Offline";

  return {
    device, browser, src, med, camp, ref,
    visits, sessionPages,
    isReturn: visits > 1,
    session:  sessionStorage.getItem("bcl_sid"),
    tz, lang, screen, online,
  };
}

/* ─── Time (Lagos) ── */
function now() {
  return new Date().toLocaleString("en-GB", {
    timeZone:  "Africa/Lagos",
    day:       "2-digit",
    month:     "short",
    year:      "numeric",
    hour:      "2-digit",
    minute:    "2-digit",
  });
}

/* ─── Page visit notification ── */
async function notifyVisit(pageName) {
  const key = "bcl_seen_" + pageName;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");

  const v     = getInfo();
  const badge = v.isReturn ? `🔄 Return visitor #${v.visits}` : "👤 New visitor";

  await sendTelegram(
`${badge} — Session <b>${v.session}</b>

📄 <b>Page:</b> ${pageName}
${v.device} | ${v.browser}
🌍 <b>Timezone:</b> ${v.tz}
🗣️ <b>Language:</b> ${v.lang}
📐 <b>Screen:</b> ${v.screen}
🕐 <b>Time:</b> ${now()}

🔗 <b>Source:</b> ${v.src}
📣 <b>Medium:</b> ${v.med}
🎯 <b>Campaign:</b> ${v.camp}
↩️ <b>Referrer:</b> ${v.ref}

📊 <b>Session pages:</b> ${v.sessionPages}
🔢 <b>Total visits:</b> ${v.visits}
🌐 <b>URL:</b> ${window.location.href}`
  );
}

/* ─── Contact form submitted ── */
export async function notifyFormSubmit(name, email, storeUrl) {
  const v = getInfo();
  await sendTelegram(
`🔥 <b>NEW APPLICATION</b>

👤 <b>Name:</b> ${name}
📧 <b>Email:</b> ${email}
🛒 <b>Store:</b> ${storeUrl || "Not provided"}
${v.device} | Source: ${v.src}
🕐 ${now()}`
  );
}

/* ─── Payment initiated ── */
export async function notifyPayment(packageName, amount, email) {
  await sendTelegram(
`✅ <b>PAYMENT INITIATED</b>

📦 <b>Package:</b> ${packageName}
💵 <b>Amount:</b> $${amount}
📧 <b>Email:</b> ${email}
🕐 ${now()}`
  );
}

/* ─── Access code auto-generated at checkout ── */
export async function notifyAccessCode(code, clientName, clientEmail, tier) {
  await sendTelegram(
`🔑 <b>ACCESS CODE ISSUED</b>

👤 <b>Client:</b> ${clientName}
📧 <b>Email:</b> ${clientEmail}
📦 <b>Package:</b> ${tier}
🔐 <b>Code:</b> ${code}
🕐 ${now()}`
  );
}

/* ─── Popup email captured ── */
export async function notifyPopupCapture(email, type) {
  await sendTelegram(
`📬 <b>POPUP EMAIL CAPTURED</b>

📧 <b>Email:</b> ${email}
🎯 <b>Type:</b> ${type}
🕐 ${now()}`
  );
}

/* ─── React hook — fires on every route change ── */
export function usePageTracking() {
  const location = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    const pageNames = {
      "/":             "🏠 Home",
      "/about":        "ℹ️ About",
      "/pricing":      "💰 Pricing",
      "/past-projects": "📊 Past Projects",
      "/blog":         "📝 Blog",
      "/contact":      "📬 Contact",
      "/audit":        "🔍 Free Audit",
      "/subscribe":    "📧 Subscribe",
      "/admin":        "🔐 Admin",
    };
    const name = pageNames[location.pathname] || `📄 ${location.pathname}`;
    notifyVisit(name);

    // First call on app load establishes/recognizes the visitor and their
    // session; every route change after that is just a page-view event
    // against the session already in place.
    if (!initialized.current) {
      initialized.current = true;
      initVisitorSession(location.pathname);
    } else {
      trackPageView(location.pathname);
    }
  }, [location.pathname]);
}