/* ────────────────────────────────────────────────────────────────
   Subscriber capture — Bode Conversion Lab

   Every email the site collects (newsletter signup, contact form,
   pricing enquiry) gets written here too, in ADDITION to whatever
   already goes to Formspree — this is what gives the admin panel an
   actual list to read, and what the campaign-send endpoint sends to.

   Stored as a single Redis hash, keyed by email — HSET is naturally
   idempotent per field, so re-submitting the same email just
   overwrites its record instead of creating a duplicate.

   ENVIRONMENT VARIABLES NEEDED: none new — reuses REDIS_URL, already
   set up for the WhatsApp webhook.

   Place this file at: /api/subscribe.js
──────────────────────────────────────────────────────────────────── */

import crypto from "node:crypto";
import { getRedisClient, isAdminAuthed } from "../lib/redis.js";
import { PACKAGES } from "../lib/pricing.js";

const SUBSCRIBERS_KEY = "bcl:subscribers";
const CODES_KEY       = "bcl:access_codes";   // code -> { tier, clientName, clientEmail, reference, ... }
const PAY_REF_PREFIX  = "bcl:pay:";           // reference -> issued result (makes verification idempotent)

/* ─── Payment verification + access codes ──────────────────────────
   This file already is the "everything that touches an email" endpoint,
   and the project sits at the 12-function Hobby cap, so these two
   actions ride along here, picked by the body's \`action\` field.

   verify-payment : the browser hands over a Paystack reference; the
                    SERVER asks Paystack whether it really succeeded,
                    for the right currency, the right customer and at
                    least the package price, then issues the code.
                    Re-sending the same reference returns the same code.
   check-code     : is this access code real and active? (rate limited)

   ENV: PAYSTACK_SECRET_KEY (sk_live_... or sk_test_..., must match the
   mode of the public key used at checkout). Server-only, no VITE_ prefix.
──────────────────────────────────────────────────────────────────── */
function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(8);
  let code = "BCL-";
  for (let i = 0; i < 8; i++) code += chars[bytes[i] % chars.length];
  return code;
}

async function notifyTelegram(text) {
  const token = process.env.TELEGRAM_TOKEN, chat = process.env.TELEGRAM_CHAT_ID || "7016026848";
  if (!token) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML" }),
    });
  } catch {}
}

async function verifyPayment(req, res) {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  const { reference, packageId, email = "", name = "" } = req.body || {};
  const pkg = PACKAGES[packageId];
  if (!secret) {
    // Never let a paying customer vanish silently: tell the owner on Telegram
    // with everything needed to match the payment by hand.
    await notifyTelegram(`🚨 <b>PAYMENT MADE BUT PAYSTACK_SECRET_KEY IS MISSING</b>\n\nAdd the key in Vercel, then send this client their code manually.\n\n📦 ${pkg?.name || packageId}\n👤 ${name}\n📧 ${email}\n🔖 ${reference}`);
    return res.status(503).json({ ok: false, error: "not_configured" });
  }
  if (!pkg || typeof reference !== "string" || !/^[A-Za-z0-9._=-]{6,100}$/.test(reference)) {
    return res.status(400).json({ ok: false, error: "bad_request" });
  }

  try {
    const redis = await getRedisClient();

    const done = await redis.get(PAY_REF_PREFIX + reference);
    if (done) return res.status(200).json({ ok: true, ...JSON.parse(done), repeat: true });

    const r = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const body = await r.json().catch(() => ({}));
    const d = body?.data;
    const paidOk =
      r.ok && body?.status === true && d?.status === "success" &&
      d?.currency === "NGN" &&
      Number(d?.amount) >= pkg.kobo &&
      String(d?.customer?.email || "").toLowerCase() === String(email).toLowerCase();

    if (!paidOk) {
      await notifyTelegram(`⚠️ <b>PAYMENT NOT CONFIRMED</b>\n\n📦 ${pkg.name}\n📧 ${email}\n🔖 ${reference}\nPaystack said: ${d?.status || body?.message || r.status}`);
      return res.status(402).json({ ok: false, error: "not_confirmed" });
    }

    const code = makeCode();
    const result = { code, tier: packageId };
    // Claim the reference atomically so two simultaneous calls can't mint two codes.
    const claimed = await redis.set(PAY_REF_PREFIX + reference, JSON.stringify(result), { NX: true });
    if (!claimed) {
      const again = await redis.get(PAY_REF_PREFIX + reference);
      return res.status(200).json({ ok: true, ...JSON.parse(again), repeat: true });
    }
    await redis.hSet(CODES_KEY, code, JSON.stringify({
      tier: packageId, clientName: name, clientEmail: String(email).toLowerCase(),
      reference, amountKobo: d.amount, createdAt: new Date().toISOString(), active: true, source: "paystack",
    }));
    await notifyTelegram(`✅ <b>PAYMENT VERIFIED</b>\n\n📦 ${pkg.name}\n👤 ${name}\n📧 ${email}\n🔑 ${code}\n🔖 ${reference}`);
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error("verify-payment error:", err.message);
    return res.status(502).json({ ok: false, error: "verify_failed" });
  }
}

async function checkCode(req, res) {
  const code = String(req.body?.code || "").trim().toUpperCase();
  if (!/^[A-Z0-9-]{4,24}$/.test(code)) return res.status(200).json({ ok: false });
  try {
    const redis = await getRedisClient();
    // Light brute-force guard: 30 guesses per IP per hour.
    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
    const key = `bcl:codetry:${ip}`;
    const tries = await redis.incr(key);
    if (tries === 1) await redis.expire(key, 3600);
    if (tries > 30) return res.status(429).json({ ok: false, error: "rate_limited" });

    const raw = await redis.hGet(CODES_KEY, code);
    const entry = raw ? JSON.parse(raw) : null;
    if (entry && entry.active) return res.status(200).json({ ok: true, tier: entry.tier });
    return res.status(200).json({ ok: false });
  } catch (err) {
    console.error("check-code error:", err.message);
    return res.status(200).json({ ok: false, error: "unavailable" });
  }
}

/* Admin-made codes (Admin.jsx) are also registered here so they work on the
   client's own device, not just the browser that generated them. */
async function registerCode(req, res) {
  if (!(await isAdminAuthed(req))) return res.status(401).json({ error: "Unauthorized" });
  const { code, tier, clientName = "", clientEmail = "", active = true } = req.body || {};
  const c = String(code || "").trim().toUpperCase();
  if (!/^[A-Z0-9-]{4,24}$/.test(c) || !PACKAGES[tier]) return res.status(400).json({ ok: false });
  try {
    const redis = await getRedisClient();
    const raw = await redis.hGet(CODES_KEY, c);
    const prev = raw ? JSON.parse(raw) : {};
    await redis.hSet(CODES_KEY, c, JSON.stringify({
      ...prev, tier, clientName, clientEmail: String(clientEmail).toLowerCase(),
      active: !!active, createdAt: prev.createdAt || new Date().toISOString(), source: prev.source || "admin",
    }));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("register-code error:", err.message);
    return res.status(200).json({ ok: false });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const action = req.body?.action;
  if (action === "verify-payment") return verifyPayment(req, res);
  if (action === "check-code")     return checkCode(req, res);
  if (action === "register-code")  return registerCode(req, res);

  const { email, name = "", source = "unknown" } = req.body || {};
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    const redis = await getRedisClient();
    const existingRaw = await redis.hGet(SUBSCRIBERS_KEY, email.toLowerCase());
    const existing = existingRaw ? JSON.parse(existingRaw) : null;
    await redis.hSet(SUBSCRIBERS_KEY, email.toLowerCase(), JSON.stringify({
      email,
      name: name || existing?.name || "",
      source: existing ? `${existing.source}, ${source}` : source, // keep a trail of every place they signed up
      firstSeen: existing?.firstSeen || new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    }));
    res.status(200).json({ ok: true });
  } catch (err) {
    // Fail soft — this runs alongside Formspree, never in front of it, so a
    // Redis hiccup here should never be the reason a visitor's submission
    // looks like it failed.
    console.error("subscribe error:", err.message);
    res.status(200).json({ ok: false });
  }
}
