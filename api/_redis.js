/* ────────────────────────────────────────────────────────────────
   Shared Redis connection — reuses the exact same store as
   whatsapp-webhook.js (REDIS_URL is already set up in your Vercel
   project, nothing new to add). Every serverless function that
   needs Redis imports getRedisClient() from here instead of each
   creating its own connection.
──────────────────────────────────────────────────────────────────── */

import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;

let redisClient;
export async function getRedisClient() {
  if (redisClient && redisClient.isOpen) return redisClient;
  redisClient = createClient({ url: REDIS_URL });
  redisClient.on("error", (err) => console.error("REDIS CLIENT ERROR:", err.message));
  await redisClient.connect();
  return redisClient;
}

/* ─── Shared admin-password check. Reuses the same password the
     Admin.jsx UI already gates behind — it's read here via
     process.env, which works fine for server-side code even though
     the VITE_ prefix is normally about client-bundle inlining. No
     new secret to create or remember. ─── */
export function isAdminAuthed(req) {
  const supplied = req.headers["x-admin-password"] || "";
  const real = process.env.VITE_ADMIN_PASSWORD;
  // Fail closed, not open: if the env var genuinely isn't set yet, every
  // request is rejected rather than silently accepting a guessable
  // hardcoded default. (Admin.jsx's own login screen has the same
  // fallback pattern client-side — worth removing there too, since
  // anyone can read it straight out of the shipped JS bundle.)
  if (!real) return false;
  return supplied === real;
}
