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
