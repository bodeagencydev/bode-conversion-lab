/* ────────────────────────────────────────────────────────────────
   Scan cache. The same store scanned twice should give the same report.

   Two things made repeat scans of one unchanged site differ:
   1. Lighthouse is a lab test, so a single run swings by several points
      (and by whole seconds on LCP and blocking time) between runs.
   2. The homepage "clarity" read is AI generated, so wording and score
      can shift between calls.
   Results are now cached per store for 24 hours (see TTL), and the
   PageSpeed proxy takes the median of three runs instead of trusting one.

   Entries are gzipped before they go into Redis, so one PageSpeed result
   costs roughly 100 KB instead of around 1 MB. Every function here fails
   open: if Redis is down, scans simply run live like before.
──────────────────────────────────────────────────────────────────── */
import zlib from "node:zlib";
import { getRedisClient } from "./redis.js";

export const SCAN_TTL_SECONDS = 60 * 60 * 24;

// "https://www.Shop.com/?utm=1#x" and "shop.com" are the same store.
export function normalizeTarget(raw) {
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    const path = u.pathname.replace(/\/+$/, "");
    return host + path;
  } catch {
    return String(raw || "").trim().toLowerCase();
  }
}

export async function cacheGet(key) {
  try {
    const redis = await getRedisClient();
    const raw = await redis.get(key);
    if (!raw) return null;
    return JSON.parse(zlib.gunzipSync(Buffer.from(raw, "base64")).toString("utf8"));
  } catch {
    return null;
  }
}

export async function cacheSet(key, value, ttl = SCAN_TTL_SECONDS) {
  try {
    const redis = await getRedisClient();
    const packed = zlib.gzipSync(Buffer.from(JSON.stringify(value), "utf8")).toString("base64");
    await redis.set(key, packed, { EX: ttl });
  } catch {
    /* fail open */
  }
}
