import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* ────────────────────────────────────────────
   TELEGRAM CONFIG
   Open this file in Stackblitz, paste your
   real values below, save, push. Never share
   these in chat.
──────────────────────────────────────────── */
const TELEGRAM_TOKEN   = "8916245771:AAEm0W70LmWuR0qjngFSeqh0MWpPlWc2o3kE";
const TELEGRAM_CHAT_ID = "7016026848";

/* ── Send to Telegram ── */
async function sendTelegram(message) {
  if (TELEGRAM_TOKEN === "8916245771:AAEm0W70LmWuR0qjngFSeqh0MWpPlWc2o3k") return;
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );
  } catch {
    // fail silently — never break the site
  }
}

/* ── Visitor info ── */
function getInfo() {
  const ua = navigator.userAgent;
  const device  = /Mobi|Android/i.test(ua) ? "📱 Mobile" : "🖥️ Desktop";
  const browser =
    /Edg/i.test(ua)    ? "Edge"    :
    /Chrome/i.test(ua) ? "Chrome"  :
    /Firefox/i.test(ua)? "Firefox" :
    /Safari/i.test(ua) ? "Safari"  : "Unknown";

  const params = new URLSearchParams(window.location.search);
  const src  = params.get("utm_source")   || "direct";
  const med  = params.get("utm_medium")   || "—";
  const camp = params.get("utm_campaign") || "—";

  const visits = parseInt(localStorage.getItem("bcl_v") || "0") + 1;
  localStorage.setItem("bcl_v", String(visits));

  if (!sessionStorage.getItem("bcl_sid")) {
    sessionStorage.setItem("bcl_sid", Math.random().toString(36).slice(2,8).toUpperCase());
  }

  return {
    device, browser,
    src, med, camp,
    visits,
    isReturn: visits > 1,
    session: sessionStorage.getItem("bcl_sid"),
  };
}

/* ── Time (Lagos) ── */
function now() {
  return new Date().toLocaleString("en-GB", {
    timeZone:"Africa/Lagos",
    day:"2-digit", month:"short", year:"numeric",
    hour:"2-digit", minute:"2-digit",
  });
}

/* ── Page visit notification ── */
async function notifyVisit(pageName) {
  const key = "bcl_seen_" + pageName;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");

  const v = getInfo();
  const badge = v.isReturn ? `🔄 Return visitor #${v.visits}` : "👤 New visitor";

  await sendTelegram(
`${badge} — <b>${v.session}</b>

📄 <b>Page:</b> ${pageName}
${v.device} | ${v.browser}
🕐 ${now()}
🔗 Source: ${v.src} | ${v.med} | ${v.camp}
🌐 ${window.location.href}`
  );
}

/* ── Pricing CTA click ── */
export async function notifyPricingClick(packageName, price) {
  const v = getInfo();
  await sendTelegram(
`💰 <b>PRICING CTA CLICKED</b>

📦 <b>Package:</b> ${packageName}
💵 <b>Price:</b> $${price}
${v.device} | Session ${v.session}
🕐 ${now()}`
  );
}

/* ── Contact form submit ── */
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

/* ── Payment initiated ── */
export async function notifyPayment(packageName, amount, email) {
  await sendTelegram(
`✅ <b>PAYMENT INITIATED</b>

📦 <b>Package:</b> ${packageName}
💵 <b>Amount:</b> $${amount}
📧 <b>Email:</b> ${email}
🕐 ${now()}`
  );
}

/* ── Popup email capture ── */
export async function notifyPopupCapture(email, type) {
  await sendTelegram(
`📬 <b>POPUP EMAIL CAPTURED</b>

📧 <b>Email:</b> ${email}
🎯 <b>Type:</b> ${type}
🕐 ${now()}`
  );
}

/* ── React hook — fires on every route change ── */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const pageNames = {
      "/":             "🏠 Home",
      "/about":        "ℹ️ About",
      "/pricing":      "💰 Pricing",
      "/case-studies": "📊 Case Studies",
      "/blog":         "📝 Blog",
      "/contact":      "📬 Contact",
      "/audit":        "🔍 Free Audit",
      "/subscribe":    "📧 Subscribe",
    };
    const name = pageNames[location.pathname] || `📄 ${location.pathname}`;
    notifyVisit(name);
  }, [location.pathname]);
}