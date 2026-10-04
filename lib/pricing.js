/* ────────────────────────────────────────────────────────────────
   Single source of truth for package prices. Imported by the
   Pricing page (what the checkout charges) AND by the server-side
   payment check in api/subscribe.js (what a payment must be worth
   before an access code is issued), so the two can never drift.

   `kobo` is the NGN amount charged, in kobo (1 NGN = 100 kobo).
   Update both the USD display price and the kobo amount here when
   the exchange rate moves.
──────────────────────────────────────────────────────────────────── */
export const PACKAGES = {
  diagnosis: { name: "Store Diagnosis", usd: 175,  kobo: 28000000 },
  fix:       { name: "Conversion Fix",  usd: 497,  kobo: 79520000 },
  lab:       { name: "The Lab",         usd: 997,  kobo: 159520000 },
  fullstack: { name: "Full Stack",      usd: 1997, kobo: 319520000 },
};

export function packageIdFromName(name) {
  const hit = Object.entries(PACKAGES).find(([, p]) => p.name === name);
  return hit ? hit[0] : null;
}
