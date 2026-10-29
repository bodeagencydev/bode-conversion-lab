# Bode Conversion Lab

Multi-page agency website for Bode Conversion Lab.

## Development
- `npm install`
- `npm run dev`
- `npm run build`

## Website structure
Home, services overview, six dedicated service pages, selected work, individual portfolio records, about, contact and privacy.

## Contact form
The enquiry form opens a prefilled email draft addressed to bodeagencyofficial@gmail.com. It does not submit or store data on the website.

## Portfolio evidence
Historical performance figures are retained from previous site material. Confirm source reports, measurement periods and permissions before describing them as verified case studies.

## Technical notes
Routes use the Vercel rewrite to serve the React app. The app renders distinct page content based on the current path and updates title, description and canonical metadata client-side. For full server-rendered or statically prerendered metadata, add a prerendering or framework build step.


## Contact form configuration

The contact page supports two modes:

- Without a form endpoint, it opens a prefilled email draft addressed to `bodeagencyofficial@gmail.com`.
- To accept submissions directly on the website, create a Formspree form and set `VITE_FORMSPREE_ENDPOINT` in the Vercel project environment variables to that form's endpoint. Redeploy after adding the variable. Do not put secret API keys in `VITE_*` variables; these values are exposed to the browser.

Until an endpoint is configured and tested, the website must not be described as storing or submitting contact form enquiries.

## Before production launch

- Connect the final custom domain and update the canonical URL, sitemap, robots.txt, and metadata base URL to match it.
- Configure and test the online contact form, or retain the clearly labelled email-draft fallback.
- Complete visual QA at desktop and mobile widths.
- Add approved founder/team photographs when provided.
- Verify supporting evidence and permissions for all public case-study figures.
