# Bode Conversion Lab redesign direction

Status: design blueprint, not production implementation.
Base: main at b6d71e527062ba8773d020dc3fd937981357abe4.
References: https://www.igloo.inc/ and https://obsidianassembly.com/

## Creative direction

Combine the two references as equal design inputs:
- Igloo Inc. informs the immersive spatial experience: a strong visual world, depth, environmental motion, purposeful 3D objects, scroll-led scene changes, and responsive interaction.
- Obsidian Assembly informs the editorial discipline: restrained typography, deliberate negative space, sparse interface chrome, quiet labels, controlled information density, and a composed dark atmosphere.
- Bode remains recognizably Bode: commerce-growth purpose, the existing green identity (#6CCB2E, #2E7D1F, #8EEA3A), existing logo assets, service offering, portfolio evidence, and contact route.

Do not reproduce proprietary source code, exact assets, or brand marks from either reference. Recreate the design principles and interaction patterns in an original Bode experience.

## Experience principles

1. The whole site must feel designed as one coherent world. Do not make the hero immersive and leave the remaining sections as generic cards.
2. Use one or two signature 3D motifs with meaningful connection to commerce and conversion. Avoid decorative random particles or generic spinning spheres.
3. Scroll should change the composition and reveal a connected narrative, not merely trigger fade-in effects.
4. Interactions must work with touch, keyboard, pointer, and reduced-motion preferences.
5. Typography and layout must remain readable. The atmosphere supports the message rather than competing with it.
6. Mobile is a designed experience in its own right. No horizontal overflow, clipped controls, excessive WebGL load, or fixed CTA covering content.
7. Preserve honest portfolio context. Do not invent results, clients, testimonials, or performance claims.
8. Keep the existing production site untouched until the redesign is reviewed and explicitly approved.

## Proposed information architecture

- Home: immersive opening, Bode proposition, connected commerce journey, disciplines, selected project records, working method, enquiry.
- Services: editorial overview with clear routes into individual service pages.
- Individual service pages: distinctive visual treatment, concise explanation, deliverables, fit, related work, enquiry.
- Work: portfolio index and individual project records with existing videos and accurate context.
- About: operating principles and how Bode works.
- Contact: accessible, functional enquiry form and direct email.
- Privacy: retain and verify current policy route.

## Visual system to develop

- Base: near-black / graphite surfaces with subtle tonal variation, not flat black everywhere.
- Accent: Bode green used sparingly for focus, active states, signals, and calls to action.
- Type: a deliberate display face paired with a highly legible text face. Establish scale, line-height, tracking, and responsive rules before page implementation.
- Layout: generous whitespace, strong alignment, asymmetric editorial compositions, thin rules, restrained metadata.
- Motion: layered depth, slow environmental movement, scroll-linked transformations, precise hover/focus states, and short transitions for controls.
- Media: use existing Bode-owned videos and images. Treat each as an intentional composition, not generic cards.

## Technical direction

Current project uses React 18 and Vite. It already has a custom WebGL canvas in src/ConversionStructure.jsx, but the current homepage also contains CSS-built pseudo-3D motifs. Current package.json does not include Three.js or GSAP.

Evaluate a proper scene implementation using Three.js (or a deliberately lightweight custom WebGL scene) and GSAP/ScrollTrigger for coordinated scroll timelines. Select the smallest stack that delivers the reference quality without making mobile performance fragile. Use lazy loading, responsive render resolution, visibility pausing, reduced-motion fallbacks, and a static poster/fallback scene.

Do not add dependencies until the visual prototype establishes that they are necessary.

## Existing code audit findings

- src/App.jsx contains the site shell, route content, navigation, service content, portfolio data, contact form, and current homepage implementation.
- src/ImmersiveHome.jsx exists and is imported by App.jsx, but the current App.jsx homepage implementation must be checked carefully to determine which homepage is actually rendered. Do not assume the imported component is active.
- src/ConversionStructure.jsx is a custom WebGL particle/strand renderer. It is not Three.js and does not currently implement the full 3D environment described in the references.
- src/ImmersiveHome.css and src/Experience.css contain multiple overlapping visual systems. Consolidation is required after route and component ownership is mapped.
- package.json currently has React, React Router, Vite and form/PDF utilities; no Three.js, GSAP, or dedicated animation library.
- The previous merged change is deployed, but build success is not visual QA.

## Required review gates

1. Reference study: record desktop and mobile layouts, section order, scroll behaviour, navigation, transitions, hover/touch interactions, and loading behaviour.
2. Bode content map: map every current route, existing asset, CTA, and form behaviour. Preserve required business information.
3. Design prototype: build the hero and one representative scroll transition on the isolated branch. Review before scaling the visual language to every route.
4. Full implementation: only after the prototype direction is accepted.
5. QA: test current desktop and mobile breakpoints, keyboard navigation, reduced motion, video loading, route links, form fallback, console errors, and production build.
6. Release: deploy a preview first. Production remains unchanged until review and approval.

## Acceptance criteria

- The result feels like a deliberate fusion of immersive spatial storytelling and restrained editorial design.
- Every page belongs to the same visual system.
- The 3D scene has a clear purpose and is not a generic background effect.
- The site remains readable, navigable, and usable without animation.
- No mobile horizontal scrolling or content overlap.
- All existing business routes, contact details, and owned portfolio assets are preserved unless intentionally revised.
- No claim of completion without visual inspection of the deployed preview.
