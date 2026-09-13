/* ────────────────────────────────────────────────────────────────
   Shared lead-system utilities — Bode Conversion Lab

   Used by api/visitor/*, api/contact/*, and api/admin/leads.js.
──────────────────────────────────────────────────────────────────── */

// Not exhaustive — per the spec this shouldn't be treated as a complete
// list, just the common ones. Anything not on here that also doesn't match
// an identified company domain falls through to "unknown", not "business".
const PERSONAL_PROVIDERS = new Set([
  "gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com",
  "proton.me", "protonmail.com", "live.com", "aol.com", "msn.com",
]);

export function classifyEmail(email, companyDomain) {
  const domain = (email.split("@")[1] || "").toLowerCase();
  if (companyDomain && domain === companyDomain.toLowerCase()) return "business";
  if (PERSONAL_PROVIDERS.has(domain)) return "personal";
  // Not a known personal provider and doesn't match an identified company
  // domain — could still be a business domain we just haven't confirmed
  // (e.g. no company record exists yet for this visitor). Per the spec,
  // classification is about the domain, not a certainty judgment, so this
  // stays "unknown" rather than guessing "business".
  return domain ? "unknown" : "unknown";
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Points per the spec's table. Kept as a plain object so it's easy to
// tune later without hunting through logic.
export const INTENT_WEIGHTS = {
  firstVisit: 5,
  returningVisitor: 10,
  viewedService: 10,
  viewedPricing: 15,
  viewedPastProjects: 10,
  viewedContact: 15,
  formStarted: 10,
  emailSubmitted: 25,
  multipleSessions: 10,
  highEngagement: 10, // 5+ page views in the visitor's history
};

export function computeIntentScore({ sessionCount, pageViews, hasEmail }) {
  let score = INTENT_WEIGHTS.firstVisit;
  if (sessionCount > 1) score += INTENT_WEIGHTS.returningVisitor;
  if (sessionCount > 2) score += INTENT_WEIGHTS.multipleSessions;
  const pages = pageViews || [];
  if (pages.some(p => p.includes("/pricing"))) score += INTENT_WEIGHTS.viewedPricing;
  if (pages.some(p => p.includes("/contact"))) score += INTENT_WEIGHTS.viewedContact;
  if (pages.some(p => p.includes("/past-projects"))) score += INTENT_WEIGHTS.viewedPastProjects;
  if (pages.some(p => p.includes("/pricing/") || p.includes("/service"))) score += INTENT_WEIGHTS.viewedService;
  if (pages.length >= 5) score += INTENT_WEIGHTS.highEngagement;
  if (hasEmail) score += INTENT_WEIGHTS.emailSubmitted;
  return Math.min(100, score);
}

export function intentLabel(score) {
  if (score >= 80) return "VERY HOT";
  if (score >= 60) return "HOT";
  if (score >= 30) return "WARM";
  return "COLD";
}

export function newVisitorId() {
  return "v_" + [...Array(20)].map(() => Math.floor(Math.random() * 36).toString(36)).join("");
}
