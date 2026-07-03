/* ── NOTIFICATION SYSTEM — Telegram visitor alerts ── */

const TELEGRAM_TOKEN = "8895379108:AAE3MfPdfoirb7LqrOOhQtx4CpOJl-WiWxo"; // replace with new token from @BotFather
const TELEGRAM_CHAT_ID = "7016026848"; // replace with your chat ID

/* ── Send message to your Telegram ── */
async function sendTelegram(message) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (e) {
    // fail silently — never break the site for a notification
  }
}

/* ── Get visitor info ── */
function getVisitorInfo() {
  const ua = navigator.userAgent;
  const device = /Mobi|Android/i.test(ua) ? "📱 Mobile" : "🖥️ Desktop";
  const browser =
    /Chrome/i.test(ua) ? "Chrome" :
    /Firefox/i.test(ua) ? "Firefox" :
    /Safari/i.test(ua) ? "Safari" :
    /Edge/i.test(ua) ? "Edge" : "Unknown";

  // UTM params
  const params = new URLSearchParams(window.location.search);
  const utm_source   = params.get("utm_source")   || "direct";
  const utm_medium   = params.get("utm_medium")   || "—";
  const utm_campaign = params.get("utm_campaign") || "—";

  // Return visitor check
  const visits = parseInt(localStorage.getItem("bcl_visits") || "0") + 1;
  localStorage.setItem("bcl_visits", String(visits));
  const isReturn = visits > 1;

  // Session ID for grouping
  if (!sessionStorage.getItem("bcl_session")) {
    sessionStorage.setItem("bcl_session", Math.random().toString(36).slice(2, 8).toUpperCase());
  }
  const session = sessionStorage.getItem("bcl_session");

  return { device, browser, utm_source, utm_medium, utm_campaign, visits, isReturn, session };
}

/* ── Format time ── */
function getTime() {
  return new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Lagos",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/* ── Page visit notification ── */
async function notifyVisit(page) {
  // Don't fire on every re-render — only once per page per session
  const key = `bcl_notified_${page}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");

  const v = getVisitorInfo();
  const emoji = v.isReturn ? "🔄" : "👤";
  const badge = v.isReturn ? `Return visitor (#${v.visits})` : "New visitor";

  const msg = `
${emoji} <b>${badge}</b> — Session ${v.session}

📄 <b>Page:</b> ${page}
${v.device} | ${v.browser}
🕐 <b>Time:</b> ${getTime()}

🔗 <b>Source:</b> ${v.utm_source}
📣 <b>Medium:</b> ${v.utm_medium}
🎯 <b>Campaign:</b> ${v.utm_campaign}

🌐 <b>URL:</b> ${window.location.href}
  `.trim();

  await sendTelegram(msg);
}

/* ── Pricing CTA click notification ── */
export async function notifyPricingClick(packageName, price) {
  const v = getVisitorInfo();
  const msg = `
💰 <b>PRICING CTA CLICKED</b> — Session ${v.session}

📦 <b>Package:</b> ${packageName}
💵 <b>Price:</b> ${price}
${v.device} | ${v.browser}
🕐 <b>Time:</b> ${getTime()}

🔗 <b>Source:</b> ${v.utm_source}
🌐 <b>URL:</b> ${window.location.href}
  `.trim();

  await sendTelegram(msg);
}

/* ── Contact form submission notification ── */
export async function notifyFormSubmit(name, email, storeUrl) {
  const v = getVisitorInfo();
  const msg = `
🔥 <b>NEW APPLICATION SUBMITTED</b>

👤 <b>Name:</b> ${name}
📧 <b>Email:</b> ${email}
🛒 <b>Store:</b> ${storeUrl || "Not provided"}
${v.device} | ${v.browser}
🕐 <b>Time:</b> ${getTime()}
🔗 <b>Source:</b> ${v.utm_source}
  `.trim();

  await sendTelegram(msg);
}

/* ── Payment notification ── */
export async function notifyPayment(packageName, amount, email) {
  const msg = `
✅ <b>PAYMENT INITIATED</b>

📦 <b>Package:</b> ${packageName}
💵 <b>Amount:</b> $${amount}
📧 <b>Email:</b> ${email}
🕐 <b>Time:</b> ${getTime()}
  `.trim();

  await sendTelegram(msg);
}

/* ── React hook — fires on every route change ── */
export function usePageTracking() {
  const location = typeof window !== "undefined" ? window.location : null;

  if (typeof window !== "undefined") {
    const page = window.location.pathname || "/";
    const pageNames = {
      "/": "🏠 Home",
      "/about": "ℹ️ About",
      "/pricing": "💰 Pricing",
      "/case-studies": "📊 Case Studies",
      "/blog": "📝 Blog",
      "/contact": "📬 Contact",
      "/audit": "🔍 Free Audit",
      "/subscribe": "📧 Subscribe",
    };
    const pageName = pageNames[page] || `📄 ${page}`;
    notifyVisit(pageName);
  }
}