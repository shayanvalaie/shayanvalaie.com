# shayanvalaie.com

Personal portfolio for Shayan Valaie. React + TypeScript + Vite, styled with
Tailwind CSS v4, animated with Motion (Framer Motion).

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Structure

- `src/data/content.ts` holds all visible copy (hero, about, experience,
  projects, contact). Edit text there, not in components.
- `src/components/` one component per section: Nav, Hero, About, Experience,
  TechMarquee, Work, Contact, Footer.
- `src/components/ParticleField.tsx` is the canvas constellation behind the
  hero (pointer parallax, honors reduced motion).
- The contact form posts through EmailJS; the service, template, and public
  key live in `src/data/content.ts`.

## Notes

- Dark theme is locked at the page level; design tokens are defined in
  `src/index.css` under `@theme`.
- Tech logos load from the Simple Icons CDN.
- All scroll effects honor `prefers-reduced-motion`.
