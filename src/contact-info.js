/* ────────────────────────────────────────────────────────────────
   Contact email, stored base64-encoded rather than as a literal
   string. This doesn't make it unreadable to a determined human or
   a scraper built specifically to decode base64 — nothing client-
   side truly can. What it DOES stop is the much more common case:
   simple bots that download the site's JS bundle and regex-search it
   for anything matching an email pattern. That pattern never appears
   in the bundle at all with this in place — only the decoded string,
   assembled at runtime, briefly in memory.
──────────────────────────────────────────────────────────────────── */
export const CONTACT_EMAIL = atob("Ym9kZWFnZW5jeW9mZmljaWFsQGdtYWlsLmNvbQ==");
