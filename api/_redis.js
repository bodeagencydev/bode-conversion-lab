/* ────────────────────────────────────────────────────────────────
   Shared Redis connection — reuses the exact same store as
   whatsapp-webhook.js (REDIS_URL is already set up in your Vercel
   project, nothing new to add). Every serverless function that
   needs Redis imports getRedisClient() from here instead of each
   creating its own connection.
──────────────────────────────────────────────────────────────────── */

import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;
const SESSION_PREFIX = "bcl:admin_session:";
const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24h

let redisClient;
export async function getRedisClient() {
  if (redisClient && redisClient.isOpen) return redisClient;
  redisClient = createClient({ url: REDIS_URL });
  redisClient.on("error", (err) => console.error("REDIS CLIENT ERROR:", err.message));
  await redisClient.connect();
  return redisClient;
}

/* ─── Session-token admin auth. This used to compare the raw admin
     password on every request — which only worked because the client
     also had to know that same raw password, which meant it had to
     ship inside the public JS bundle (as VITE_ADMIN_PASSWORD), which
     meant anyone could read it straight out of dev tools and log in
     as admin. The password now lives ONLY here (ADMIN_PASSWORD, no
     VITE_ prefix — never bundled client-side) and is checked once, in
     api/admin/login.js. What the browser holds afterward is a random
     session token with no relation to the password, looked up here
     against Redis. Reading this token out of the browser gets you
     nothing the server didn't already hand out on purpose, and it
     expires on its own. ─── */
export async function isAdminAuthed(req) {
  const token = req.headers["x-admin-session"] || "";
  if (!token) return false;
  try {
    const redis = await getRedisClient();
    const valid = await redis.get(SESSION_PREFIX + token);
    return valid === "1";
  } catch (err) {
    console.error("session check error:", err.message);
    return false;
  }
}

export async function issueAdminSession(password) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real || password !== real) return null;
  const token = [...Array(32)].map(() => Math.floor(Math.random() * 36).toString(36)).join("");
  const redis = await getRedisClient();
  await redis.set(SESSION_PREFIX + token, "1", { EX: SESSION_TTL_SECONDS });
  return token;
}
