# Bode Conversion Lab

A clean rebuild of the public Bode Conversion Lab website.

## Direction
- E-commerce growth, store experience, marketing execution, creative production, retention and analytics.
- Editorial layout, restrained interactions, accessible responsive design.
- Mobile-first checks and no fabricated testimonials or performance claims.
- Existing portfolio evidence and brand assets are retained under `public/`.

## Development
- `npm install`
- `npm run dev`
- `npm run build`

## Contact
Public contact email: bodeagencyofficial@gmail.com

## Important implementation notes
- The project enquiry form prepares an email in the visitor's own email application. It does not silently send or store submitted data.
- The current release is English-only. Additional languages should be launched as fully translated, crawlable locale routes with matching metadata and `hreflang`, not as a partial machine-translated toggle.
- The portfolio figures are carried forward from the existing site content. Keep their supporting records available and confirm permissions before expanding their use.
- The previous API handlers, admin pages, scan utilities, tracking scripts and cron configuration are intentionally not part of this rebuilt public site. Reintroduce only after a specific need, security review and test plan.
