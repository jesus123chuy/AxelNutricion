# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + Tailwind CSS, selected by the user.

## Users

Athletes and people seeking body recomposition or sports nutrition support in Colima and Villa de Álvarez, plus people who prefer online consultations.

## Product Purpose

Convert interested visitors into consultation inquiries by explaining the available consultation modes, what the plans include, and how personalized nutrition can support their goals.

## Positioning

Personalized, flexible sports nutrition paired with in-person body-composition assessment in Colima/Villa de Álvarez or an online consultation with equivalent plan tools and follow-up.

## Operating Context

Visitors arrive from mobile or desktop and should be able to understand the service and start a WhatsApp inquiry quickly. The online path must work independently of local availability.

## Capabilities and Constraints

- The landing page is a static Vite application with client-side interactions; no backend or public API is requested.
- Consultation modes: in-person and online.
- Goal section requested by the user: increasing muscle mass, weight loss and reducing measurements. Goal cards are informational only (no buttons, at the user's request); WhatsApp is reached from the hero, modalities, FAQ, contact and footer. The supplied reference guides the three-column layout with an emphasized center panel, which holds "Aumentar masa muscular" to match the hero promise; fruit and vegetable SVG icons reinforce food-related content.
- Plan features and FAQ copy come from the supplied brief.
- Illustrative AI-generated photos (modalities and plan intro) were removed so the page shows only real, user-supplied photography; the files remain in assets/ unused.
- Contact details supplied by the user: Danthe Axel Cernas Delgado, phone/WhatsApp 312 228 1628 (+52 Mexico), axelcernas@gmail.com, Instagram https://www.instagram.com/danthe_axel_/.
- Exact address and professional license were not supplied; their rows and Facebook were removed from the page at the user's request. Contact details remain editable in src/data/siteConfig.js.
- The user supplied three before/after image pairs and requested that they be split and published with the matching case summaries.
- The three original case cards form a continuous leftward passage, exiting on the left and reappearing on the right through an identical, assistive-technology-hidden copy. The passage pauses on hover (pointer devices), while a case has keyboard focus, and through a visible "Pausar casos" toggle (WCAG 2.2.2). Reduced-motion preference restores the static responsive grid and hides the toggle.
- FAQ uses a contained accordion with a pale green active state, all answers initially closed, keyboard navigation and a direct WhatsApp help link. Answers open only on user interaction.
- Every booking action uses the label "Agendar consulta"; the FAQ link "Escríbeme por WhatsApp" is kept for questions.
- The footer lists contact, service area, Instagram, the current year and a link to aviso-de-privacidad.html (a second Vite entry). The notice is a basic template: it omits the responsible party's address, which was not supplied.
- Visual rules to avoid a templated look: no single-word color accents in headlines, no all-caps tracked labels, no middle-dot separators, no decorative arrows, no icon circles, no gradients, no scroll-reveal animations; one solid brand green for all actions. Cases come right after the hero.
- Favicon set (favicon.ico, favicon-32.png, favicon.svg, apple-touch-icon.png) is derived from the logo mark.
- Do not invent prices, outcome metrics, credentials, addresses, or patient evidence.

## Brand Commitments

- Official user-supplied logo: Danthe Cernas / Asesor Nutricional, original in .impeccable/sources/brand/danthe-cernas-logo.png. Its background was removed at the user's request with Imagegen; assets/brand/danthe-cernas-logo-transparent.webp is used in the header and footer. Footer artwork is rendered white with CSS for contrast. The complete mark remains visible; the display frame trims only surrounding blank margins.
- Spanish-language, direct, professional, and human.
- The landing uses white (#FFFFFF), ultra-light gray (#F9FAFB), professional green, and a darker high-contrast CTA green.
- Use the referenced nutrition site as inspiration for its direct service, testimonial, and contact flow, without copying its copy or claims.

## Evidence on Hand

The user supplied the page copy, service descriptions, FAQ, three case summaries, and three before/after image pairs. The images are user-provided assets; case summaries are content supplied for the page and are not independently verified.

The user supplied two additional photos (gym training and a diploma photograph in Colima) to replace the illustrative gym photo. Enhanced versions are in assets/about/ and are displayed in full without cropping, side by side on larger screens and stacked on mobile.

## Product Principles

- Make both consultation paths clear and equally credible.
- Show flexibility and practical support alongside training goals.
- Keep contact easy, especially on mobile.
- Use only supplied business facts and evidence.

## Accessibility & Inclusion

Use semantic HTML, keyboard-operable controls, visible focus styles, and respect `prefers-reduced-motion`.
