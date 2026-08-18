/* ────────────────────────────────────────────────────────────────
   WhatsApp Cloud API Webhook — Bode Conversion Lab
   Two-flow version (free, no AI cost — uses Redis to remember
   where each person is in the flow across separate webhook calls)

   Place this file at:  /api/whatsapp-webhook.js  (project root)

   ENVIRONMENT VARIABLES NEEDED:
   - WHATSAPP_TOKEN            → your access token from Meta
   - WHATSAPP_PHONE_NUMBER_ID  → 1215714554962102
   - WHATSAPP_VERIFY_TOKEN     → any secret string you make up
   - TELEGRAM_TOKEN            → your Telegram bot token
   - TELEGRAM_CHAT_ID          → 7016026848
   - REDIS_URL                 → auto-added by your Redis store

   TWO FLOWS:
   - "short" flow (Pricing page links only — payment confirmation /
     pre-purchase question): name → what they need → store link → done.
     These people already picked a package, no need to interrogate them.
   - "deep" flow (every other WhatsApp link on the site — footer,
     floating button, Contact page, Audit page): name → what they need
     → store link → store age → target market → sales goal →
     current marketing → budget → done. Full discovery before handoff.

   Which flow starts is decided by the FIRST message text, matched
   against the exact pre-filled texts used on the Pricing page links.
   Everything else defaults to the deep flow.

   Every wrap-up message reassures the person they'll get a real,
   personalized response from Fiyin — not a bot — as requested.
──────────────────────────────────────────────────────────────────── */

import { createClient } from "redis";

const WHATSAPP_TOKEN   = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID  = process.env.WHATSAPP_PHONE_NUMBER_ID;
const VERIFY_TOKEN     = process.env.WHATSAPP_VERIFY_TOKEN;
const TELEGRAM_TOKEN   = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "7016026848";
const REDIS_URL        = process.env.REDIS_URL;

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // sessions auto-expire after 14 days

/* ─── Matches the Pricing page's two pre-filled WhatsApp texts exactly ─── */
const SHORT_FLOW_TRIGGER = /I just completed payment for|I have a question about the .+ package before paying/i;

/* ─── Help-list options for each flow ─── */
const SHORT_HELP_OPTIONS = [
  { id: "audit",   title: "Free Store Audit",  description: "See what's costing you sales" },
  { id: "pricing", title: "Pricing & Packages", description: "See what a project would cost" },
  { id: "cgo",     title: "Full CGO Setup",     description: "Fix, test, and scale — the whole system" },
  { id: "ads",     title: "Ad Management Only", description: "Just need help running ads" },
  { id: "other",   title: "Something Else",     description: "Talk to Fiyin directly" },
];

const DEEP_HELP_OPTIONS = [
  { id: "audit",   title: "Free Store Audit",          description: "See exactly what's costing you sales" },
  { id: "fixes",   title: "Store & Checkout Fixes",     description: "Conversion leaks, slow pages, payment gateway issues" },
  { id: "ads",     title: "Ad Management & Scaling",    description: "Running, fixing, or scaling paid ads" },
  { id: "cgo",     title: "Full CGO Setup",             description: "The complete fix + ads + scale system" },
  { id: "unsure",  title: "Not Sure Yet",               description: "Just exploring, want an expert take" },
  { id: "fiyin",   title: "Talk to Fiyin Directly",     description: "Skip the questions, connect me now" },
];

function optionsFor(flow) {
  return flow === "short" ? SHORT_HELP_OPTIONS : DEEP_HELP_OPTIONS;
}
function labelsFor(flow) {
  return Object.fromEntries(optionsFor(flow).map(o => [o.id, o.title]));
}

/* ─── Pull a plain name out of things like "My name is Micheal" or "Hi, I'm Micheal" ─── */
function extractName(text) {
  if (!text) return "there";
  let t = text.trim();
  t = t.replace(/^(?:hi|hello|hey)[,!\s]*/i, "");
  t = t.replace(/^(?:my name is|i am|i'm|im|this is|it's|its)\s+/i, "");
  t = t.trim();
  const words = t.split(/\s+/).filter(Boolean).slice(0, 3);
  let name = words.join(" ").replace(/[.,!?]+$/, "");
  if (!name) return "there";
  return name.replace(/\b\w/g, c => c.toUpperCase());
}

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
  return sendWhatsAppRequest({ messaging_product: "whatsapp", to, type: "text", text: { body } });
}

function sendButtons(to, bodyText, buttons) {
  return sendWhatsAppRequest({
    messaging_product: "whatsapp", to, type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: { buttons: buttons.map(b => ({ type: "reply", reply: { id: b.id, title: b.title } })) },
    },
  });
}

function sendHelpList(to, bodyText, options) {
  return sendWhatsAppRequest({
    messaging_product: "whatsapp", to, type: "interactive",
    interactive: {
      type: "list",
      body: { text: bodyText },
      action: { button: "See options", sections: [{ title: "How can we help?", rows: options }] },
    },
  });
}

/* ─── The conversation flow ─── */
async function handleIncomingMessage({ from, contactName, message }) {
  let session = await getSession(from);

  const typedText  = message.type === "text" ? (message.text?.body || "").trim() : null;
  const listReplyId = message.type === "interactive" && message.interactive?.type === "list_reply"
    ? message.interactive.list_reply.id : null;
  const buttonReplyId = message.type === "interactive" && message.interactive?.type === "button_reply"
    ? message.interactive.button_reply.id : null;

  /* ── New conversation — decide which flow based on the pre-filled text ── */
  if (!session) {
    const flow = typedText && SHORT_FLOW_TRIGGER.test(typedText) ? "short" : "deep";
    session = { flow, step: "awaiting_name", createdAt: Date.now() };
    await saveSession(from, session);
    await sendText(
      from,
      `Hi there 👋 Thanks for reaching out to Bode Conversion Lab.\n\nBefore we get started, may I know your name?`
    );
    return;
  }

  /* ── Step: waiting for their name ── */
  if (session.step === "awaiting_name") {
    session.name = extractName(typedText);
    session.step = "awaiting_choice";
    await saveSession(from, session);
    await sendHelpList(
      from,
      `Thanks, ${session.name}! To point you in the right direction — what are you looking for help with today?`,
      optionsFor(session.flow)
    );
    return;
  }

  /* ── Step: waiting for them to pick a help option ── */
  if (session.step === "awaiting_choice") {
    const labels = labelsFor(session.flow);
    if (!listReplyId || !labels[listReplyId]) {
      await sendHelpList(from, `Just tap one of the options below 👇`, optionsFor(session.flow));
      return;
    }
    session.choiceId    = listReplyId;
    session.choiceLabel = labels[listReplyId];

    // Deep flow only: "Talk to Fiyin Directly" skips everything else
    if (session.flow === "deep" && listReplyId === "fiyin") {
      session.step = "done";
      await saveSession(from, session);
      await sendText(from, `Got it, ${session.name} — I'll connect you with Fiyin directly, they'll be with you shortly. You'll get a real, personalized response, not a bot. 🙌`);
      await notifyTelegram(`🚨 <b>New WhatsApp lead — wants Fiyin directly</b>\n👤 ${session.name}\n📱 ${from}`);
      return;
    }

    session.step = "awaiting_store_link";
    await saveSession(from, session);
    await sendText(from, `Got it. Could you share your store link? We'll use it to take a proper look. 🔗`);
    return;
  }

  /* ── Step: waiting for their store link ── */
  if (session.step === "awaiting_store_link") {
    session.storeLink = typedText || "(not provided)";

    if (session.flow === "short") {
      session.step = "done";
      await saveSession(from, session);
      await wrapUp(from, session);
      return;
    }

    session.step = "awaiting_store_age";
    await saveSession(from, session);
    await sendText(from, `How long has your store/domain been up and running?`);
    return;
  }

  /* ── Deep flow only, from here on ── */
  if (session.step === "awaiting_store_age") {
    session.storeAge = typedText || "(not provided)";
    session.step = "awaiting_target_market";
    await saveSession(from, session);
    await sendText(from, `Which country or region is your target market?`);
    return;
  }

  if (session.step === "awaiting_target_market") {
    session.targetMarket = typedText || "(not provided)";
    session.step = "awaiting_sales_goal";
    await saveSession(from, session);
    await sendText(from, `What's your monthly sales goal you're aiming for?`);
    return;
  }

  if (session.step === "awaiting_sales_goal") {
    session.salesGoal = typedText || "(not provided)";
    session.step = "awaiting_marketing";
    await saveSession(from, session);
    await sendText(from, `How are you currently driving traffic — paid ads, organic/social, influencers, or nothing yet?`);
    return;
  }

  if (session.step === "awaiting_marketing") {
    session.marketing = typedText || "(not provided)";
    session.step = "awaiting_budget";
    await saveSession(from, session);
    await sendText(from, `Last one — what's a realistic monthly budget you can commit to reach that goal?`);
    return;
  }

  if (session.step === "awaiting_budget") {
    session.budget = typedText || "(not provided)";
    session.step = "done";
    await saveSession(from, session);
    await wrapUp(from, session);
    return;
  }

  /* ── Done — reply with a follow-up prompt instead of going silent ── */
  if (session.step === "done") {
    if (buttonReplyId === "talk_fiyin") {
      session.handedOff = true;
      await saveSession(from, session);
      await sendText(from, `Perfect — I've let Fiyin know! They'll jump into this chat directly, shortly. 🙌`);
      await notifyTelegram(`🚨 <b>${session.name} wants to talk directly</b>\n📱 ${from}\n\nReply on WhatsApp now.`);
      return;
    }
    if (buttonReplyId === "new_request") {
      session.step = "awaiting_choice";
      await saveSession(from, session);
      await sendHelpList(from, `Sure thing, ${session.name} — what else can I help with?`, optionsFor(session.flow));
      return;
    }

    await notifyTelegram(
      `💬 <b>Follow-up message from ${session.name || contactName}</b>\n` +
      `📱 ${from}\n📝 ${typedText || "(non-text message)"}`
    );

    if (!session.handedOff) {
      await sendButtons(
        from,
        `Hi ${session.name}! 👋 What else can I do for you? Or would you like to speak with Fiyin directly?`,
        [
          { id: "talk_fiyin",  title: "Talk to Fiyin" },
          { id: "new_request", title: "New Request" },
        ]
      );
    }
    return;
  }
}

async function wrapUp(from, session) {
  await sendText(
    from,
    `Thank you, ${session.name} — I've got everything I need. You'll get a personalized response directly from Fiyin, not a bot, shortly. 🙌`
  );

  let summary =
    `🚨 <b>New WhatsApp lead (${session.flow} flow)</b>\n` +
    `👤 Name: ${session.name}\n` +
    `📱 Phone: ${from}\n` +
    `🙋 Needs help with: ${session.choiceLabel}\n` +
    `🔗 Store: ${session.storeLink}`;

  if (session.flow === "deep") {
    summary +=
      `\n📅 Store age: ${session.storeAge}` +
      `\n🌍 Target market: ${session.targetMarket}` +
      `\n🎯 Sales goal: ${session.salesGoal}` +
      `\n📣 Current marketing: ${session.marketing}` +
      `\n💰 Budget: ${session.budget}`;
  }

  await notifyTelegram(summary);
}

/* ─── Main handler ─── */
export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode      = req.query["hub.mode"];
    const token     = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Verification failed");
  }

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
      return res.status(200).send("OK");
    }
  }

  return res.status(405).send("Method not allowed");
}
