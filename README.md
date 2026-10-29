# Bode Conversion Lab

Multi-page ecommerce performance and conversion agency website built with React and Vite.

## Development

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Website routes

- Home
- Services overview
- Store optimization
- Paid advertising
- AI product videos
- SEO and product visibility
- Email and retention
- Analytics and tracking
- Selected work and three individual project records
- About
- Contact
- Privacy policy

The production build generates route-specific HTML metadata for all 15 routes, including page titles, descriptions, canonical URLs and social-sharing metadata. It also updates the sitemap and robots.txt to use the configured site origin.

## Contact form

The contact form supports two modes:

- Without `VITE_FORMSPREE_ENDPOINT`, it opens a prefilled email draft addressed to `bodeagencyofficial@gmail.com`. It does not submit or store the form data on the website.
- To enable direct online submissions, create a Formspree form, add its endpoint as `VITE_FORMSPREE_ENDPOINT` in Vercel's project environment variables, and redeploy. Test a successful submission and a failed submission before advertising the form as live.

Values prefixed with `VITE_` are exposed to browser code. Never place secret API keys in them.

## Domain configuration

Set `VITE_SITE_URL` to the final HTTPS origin after the custom domain is connected. The build uses this value for canonical URLs, generated metadata, sitemap and robots.txt. Without it, the site falls back to `https://bodeconversionlab.vercel.app`.

## Portfolio evidence

Historical performance figures are carried forward from previous site material. Confirm source reports, measurement periods, attribution and client permissions before promoting them as verified case-study claims. Keep case-study explanations specific about Bode's contribution.

## Production launch checklist

- Confirm the preview visually on desktop and mobile, including direct loading of every route.
- Add approved founder/team photographs when provided.
- Configure and test the online contact form, or keep the email-draft fallback clearly labelled.
- Connect the custom domain and set `VITE_SITE_URL`.
- Verify sitemap, robots.txt, canonical URLs, social-sharing metadata and Search Console property.
- Confirm portfolio evidence and permissions.
- Check keyboard navigation, form labels, reduced-motion behaviour, mobile touch targets, video loading and horizontal overflow.

## Design principles

Keep the visual system restrained and deliberate: Bode green, warm neutrals, strong typography, clear page hierarchy, minimal decorative elements, accessible responsive layouts and no fabricated testimonials or team members.
