/* ────────────────────────────────────────────────────────────────
   WhatsApp Cloud API Webhook — Bode Conversion Lab
   Button-menu version (free, no AI cost)

   Place this file at:  /api/whatsapp-webhook.js  (project root)

   ENVIRONMENT VARIABLES NEEDED (Vercel → Settings → Environment Variables):
   - WHATSAPP_TOKEN            → your access token from Meta
   - WHATSAPP_PHONE_NUMBER_ID  → 121571454962102 (real +234 906 488 5280 number's ID)
   - WHATSAPP_VERIFY_TOKEN     → any secret string you make up, e.g. "bcl_verify_2026"
   - TELEGRAM_TOKEN            → same bot token as NotificationSystem.js
   - TELEGRAM_CHAT_ID          → 7016026848

   HOW IT WORKS:
   - Someone sends any plain text message  → they get a button menu (Pricing / Free Audit / Talk to Fiyin)
   - They tap a button                     → they get a specific follow-up reply for that topic
   - Every interaction pings your Telegram, so nothing goes unseen
   - "Talk to Fiyin" pings Telegram as an URGENT lead, separate from the others

   TO ADD MORE OPTIONS LATER: just add another "case" in the handleButtonReply
   function below, and another button object in the sendButtonMenu function.
──────────────────────────────────────────────────────────────────── */

const WHATSAPP_TOKEN   = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID  = process.env.WHATSAPP_PHONE_NUMBER_ID;
const VERIFY_TOKEN     = process.env.WHATSAPP_VERIFY_TOKEN;
const TELEGRAM_TOKEN   = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "7016026848";

/* ─── Telegram notification (same pattern as NotificationSystem.js) ─── */
async function notifyTelegram(message) {
  if (!TELEGRAM_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "HTML" }),
    });
  } catch {
    // never let a notification failure break message handling
  }
}

/* ─── Low-level senders ─── */
async function sendWhatsAppRequest(payload) {
  try {
    await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    await notifyTelegram(`⚠️ <b>WhatsApp send failed</b>\n${err.message}`);
  }
}

function sendText(to, body) {
  return sendWhatsAppRequest({
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body },
  });
}

function sendButtonMenu(to) {
  return sendWhatsAppRequest({
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: "Hey! 👋 Thanks for reaching out to Bode Conversion Lab. What can I help with?" },
      action: {
        buttons: [
          { type: "reply", reply: { id: "pricing", title: "Pricing" } },
          { type: "reply", reply: { id: "audit",   title: "Free Audit" } },
          { type: "reply", reply: { id: "human",   title: "Talk to Fiyin" } },
        ],
      },
    },
  });
}

/* ─── What happens when someone taps a button ─── */
async function handleButtonReply(buttonId, from, contactName) {
  switch (buttonId) {
    case "pricing":
      await sendText(
        from,
        `Here's our full pricing breakdown 👇\nhttps://bodeconversionlab.vercel.app/pricing\n\n` +
        `Got a specific package in mind, or want a recommendation? Just tell me a bit about your store.`
      );
      await notifyTelegram(`💰 <b>Pricing interest</b>\n👤 ${contactName} (${from})`);
      break;

    case "audit":
      await sendText(
        from,
        `Here's our free 12-point store audit — takes about 30-60 seconds 👇\n` +
        `https://bodeconversionlab.vercel.app/audit\n\n` +
        `It'll show you exactly what's costing you sales, no strings attached.`
      );
      await notifyTelegram(`🔍 <b>Audit interest</b>\n👤 ${contactName} (${from})`);
      break;

    case "human":
      await sendText(
        from,
        `Got it — I'll personally reply as soon as I can! Usually within a few hours. 🙌`
      );
      await notifyTelegram(
        `🚨 <b>URGENT — wants to talk to a human</b>\n👤 ${contactName} (${from})\n\nReply directly on WhatsApp now.`
      );
      break;

    default:
      await sendButtonMenu(from);
  }
}

/* ─── Main handler ─── */
export default async function handler(req, res) {
  // ── GET: Meta's webhook verification handshake ──
  if (req.method === "GET") {
    const mode      = req.query["hub.mode"];
    const token     = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Verification failed");
  }

  // ── POST: an incoming message or button-tap event ──
  if (req.method === "POST") {
    try {
      const body    = req.body;
      const entry   = body?.entry?.[0];
      const change  = entry?.changes?.[0];
      const value   = change?.value;
      const message = value?.messages?.[0];

      if (!message) {
        return res.status(200).send("OK — no message to process");
      }

      const from        = message.from;
      const contactName = value?.contacts?.[0]?.profile?.name || "Unknown";

      // Someone tapped a button
      if (message.type === "interactive" && message.interactive?.type === "button_reply") {
        const buttonId = message.interactive.button_reply.id;
        await handleButtonReply(buttonId, from, contactName);
        return res.status(200).send("OK");
      }

      // Someone sent a plain text message — show the menu
      if (message.type === "text") {
        const text = message.text?.body || "";
        await notifyTelegram(`💬 <b>New WhatsApp message</b>\n👤 ${contactName} (${from})\n📝 ${text}`);
        await sendButtonMenu(from);
        return res.status(200).send("OK");
      }

      return res.status(200).send("OK — unhandled message type");
    } catch (err) {
      await notifyTelegram(`⚠️ <b>WhatsApp webhook error</b>\n${err.message}`);
      return res.status(200).send("OK"); // always 200 so Meta doesn't retry-storm you
    }
  }

  return res.status(405).send("Method not allowed");
}
