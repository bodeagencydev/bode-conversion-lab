/* ────────────────────────────────────────────────────────────────
   WhatsApp Cloud API Webhook — Bode Conversion Lab
   Lean-intake version (free, no AI cost — uses Redis to remember
   where each person is in the flow across separate webhook calls)

   Place this file at:  /api/whatsapp-webhook.js  (project root)

   ENVIRONMENT VARIABLES NEEDED (Vercel → Settings → Environment Variables):
   - WHATSAPP_TOKEN            → your access token from Meta
   - WHATSAPP_PHONE_NUMBER_ID  → 1215714554962102 (real +234 906 488 5280 number's ID)
   - WHATSAPP_VERIFY_TOKEN     → any secret string you make up, e.g. "bcl_verify_2026"
   - TELEGRAM_TOKEN            → your Telegram bot token
   - TELEGRAM_CHAT_ID          → 7016026848
   - REDIS_URL                 → auto-added when you connect your Redis store

   HOW IT WORKS (the flow):
   1. Someone messages for the first time  → greeted, asked their name
   2. They reply with their name           → shown a short list of things people usually need help with
   3. They pick one from the list          → asked for their store link
   4. They send their store link           → wrapped up, and YOU get a full summary on Telegram —
                                              from that point on it's a normal conversation, you take it from here
   5. Any message after that                → forwarded straight to your Telegram, no more questions

   Each person's progress is stored in Redis under key `wa_session:<phone>`,
   so the bot "remembers" them across separate webhook calls (which are
   otherwise stateless). Sessions auto-expire after 14 days of inactivity.
──────────────────────────────────────────────────────────────────── */

import { createClient } from "redis";

const WHATSAPP_TOKEN   = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID  = process.env.WHATSAPP_PHONE_NUMBER_ID;
const VERIFY_TOKEN     = process.env.WHATSAPP_VERIFY_TOKEN;
const TELEGRAM_TOKEN   = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "7016026848";
const REDIS_URL        = process.env.REDIS_URL;

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // sessions auto-expire after 14 days

const HELP_OPTIONS = [
  { id: "audit",   title: "Free Store Audit",  description: "See what's costing you sales" },
  { id: "pricing", title: "Pricing & Packages", description: "See what a project would cost" },
  { id: "cgo",     title: "Full CGO Setup",     description: "Fix, test, and scale — the whole system" },
  { id: "ads",     title: "Ad Management Only", description: "Just need help running ads" },
  { id: "other",   title: "Something Else",     description: "Talk to Fiyin directly" },
];
const HELP_LABELS = Object.fromEntries(HELP_OPTIONS.map(o => [o.id, o.title]));

/* ─── Redis client (reused across invocations when the function stays warm) ─── */
let redisClient;
async function getRedis() {
  if (redisClient && redisClient.isOpen) return redisClient;
  redisClient = createClient({ url: REDIS_URL });
  redisClient.on("error", (err) => console.error("REDIS CLIENT ERROR:", err.message));
  await redisClient.connect();
  return redisClient;
}

async function getSession(phone) {
  const r = await getRedis();
  const raw = await r.get(`wa_session:${phone}`);
  return raw ? JSON.parse(raw) : null;
}
async function saveSession(phone, session) {
  const r = await getRedis();
  await r.set(`wa_session:${phone}`, JSON.stringify(session), { EX: SESSION_TTL_SECONDS });
}

/* ─── Telegram notification ─── */
async function notifyTelegram(message) {
  if (!TELEGRAM_TOKEN) return;
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "HTML" }),
    });
    if (!res.ok) console.error("TELEGRAM NOTIFY FAILED:", res.status, await res.text());
  } catch (err) {
    console.error("TELEGRAM NOTIFY ERROR:", err.message);
  }
}

/* ─── Low-level WhatsApp senders ─── */
async function sendWhatsAppRequest(payload) {
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const resBody = await res.text();
    if (!res.ok) {
      console.error("WHATSAPP SEND FAILED:", res.status, resBody);
      await notifyTelegram(`⚠️ <b>WhatsApp send failed</b>\nStatus: ${res.status}\n${resBody}`);
    } else {
      console.log("WHATSAPP SEND OK:", resBody);
    }
  } catch (err) {
    console.error("WHATSAPP SEND NETWORK ERROR:", err.message);
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

function sendHelpList(to, bodyText) {
  return sendWhatsAppRequest({
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "list",
      body: { text: bodyText },
      action: {
        button: "See options",
        sections: [{ title: "How can we help?", rows: HELP_OPTIONS }],
      },
    },
  });
}

/* ─── The conversation flow (3 questions, then straight to Fiyin) ─── */
async function handleIncomingMessage({ from, contactName, message }) {
  let session = await getSession(from);

  const typedText  = message.type === "text" ? (message.text?.body || "").trim() : null;
  const listReplyId = message.type === "interactive" && message.interactive?.type === "list_reply"
    ? message.interactive.list_reply.id : null;

  /* ── New conversation ── */
  if (!session) {
    session = { step: "awaiting_name", createdAt: Date.now() };
    await saveSession(from, session);
    await sendText(
      from,
      `Hi there 👋 Thanks for reaching out to Bode Conversion Lab.\n\nBefore we get started, may I know your name?`
    );
    return;
  }

  /* ── Step: waiting for their name ── */
  if (session.step === "awaiting_name") {
    const name = typedText || "there";
    session.name = name;
    session.step = "awaiting_choice";
    await saveSession(from, session);
    await sendHelpList(from, `Thanks, ${name}! To point you in the right direction — what are you looking for help with today?`);
    return;
  }

  /* ── Step: waiting for them to pick a help option ── */
  if (session.step === "awaiting_choice") {
    if (!listReplyId || !HELP_LABELS[listReplyId]) {
      await sendHelpList(from, `Just tap one of the options below 👇`);
      return;
    }
    session.choiceId    = listReplyId;
    session.choiceLabel = HELP_LABELS[listReplyId];
    session.step        = "awaiting_store_link";
    await saveSession(from, session);
    await sendText(from, `Got it. Could you share your store link? We'll use it to take a proper look. 🔗`);
    return;
  }

  /* ── Step: waiting for their store link ── */
  if (session.step === "awaiting_store_link") {
    session.storeLink = typedText || "(not provided)";
    session.step = "done";
    await saveSession(from, session);
    await wrapUp(from, session);
    return;
  }

  /* ── Done — forward anything further straight to Telegram, Fiyin takes it from here ── */
  if (session.step === "done") {
    await notifyTelegram(
      `💬 <b>Follow-up message from ${session.name || contactName}</b>\n` +
      `📱 ${from}\n📝 ${typedText || "(non-text message)"}`
    );
    return;
  }
}

async function wrapUp(from, session) {
  await sendText(
    from,
    `Thank you, ${session.name} — I've got everything I need. I'll personally review this and follow up with you shortly. 🙌`
  );
  await notifyTelegram(
    `🚨 <b>New WhatsApp lead</b>\n` +
    `👤 Name: ${session.name}\n` +
    `📱 Phone: ${from}\n` +
    `🙋 Needs help with: ${session.choiceLabel}\n` +
    `🔗 Store: ${session.storeLink}`
  );
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

  // ── POST: an incoming message or list-tap event ──
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

      await handleIncomingMessage({ from, contactName, message });
      return res.status(200).send("OK");
    } catch (err) {
      console.error("WEBHOOK HANDLER ERROR:", err.message, err.stack);
      await notifyTelegram(`⚠️ <b>WhatsApp webhook error</b>\n${err.message}`);
      return res.status(200).send("OK"); // always 200 so Meta doesn't retry-storm you
    }
  }

  return res.status(405).send("Method not allowed");
}
