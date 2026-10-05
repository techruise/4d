# Techruise — /offer landing page

> **Let your business cruise.**
> Premium, animated, AI-powered websites by Techruise.

A "4D-feeling" sales page for Techruise's website-building offer: a real-time 3D
journey (glass browser panels, a low-poly sailing ship, particle dust) that the
camera flies through as you scroll, layered with scroll storytelling, magnetic
buttons, 3D tilt cards, a live-feel AI agent demo — and clean static fallbacks
for reduced motion, no-JS and no-WebGL environments.

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **three / @react-three/fiber / @react-three/drei** — the 3D scene (lazy, ssr:false)
- **GSAP + ScrollTrigger** — scroll storytelling, pinned horizontal showcase
- **Lenis** — smooth scrolling, synced to GSAP's ticker
- **Framer Motion** — accordion + micro-interactions
- **Inter** (UI) + **Instrument Serif italic** (accent words) via `next/font`

## Run it

```bash
npm install
npm run dev      # development → http://localhost:3000/offer
npm run build    # production build (must pass with 0 errors)
npm start        # serve the production build
npm run lint     # must pass with 0 warnings
```

The route is **`/offer`**; `/` redirects there. The contact form posts to
**`/api/contact`** (see `app/api/contact/route.ts` — wire it to your email
provider; until then the form also falls back gracefully and the email
`techruise5@gmail.com` is shown everywhere).

## Where to edit things

| What | File |
|---|---|
| **All copy** (hero, features, packages, FAQ, founder note…) | `lib/offer/content.ts` |
| Colors, fonts, glows | `tailwind.config.ts` + `app/globals.css` |
| Camera flight path / ship route | `lib/offer/scene.ts` (`CAMERA_PATH`, `SHIP_PATH`) |
| 3D scene pieces | `components/offer/three/*` |
| Sections (one component each) | `components/offer/sections/*` |
| Reveal / scramble / tilt / magnetic / counter primitives | `components/offer/ui/*` |

The founder note is draft copy in `lib/offer/content.ts` → `FOUNDER.quote`.

## Guardrails baked in

- **No fake proof** — placeholders like `[Project name]` only; no prices, stats,
  clients or testimonials.
- **prefers-reduced-motion** — 3D, scroll-jacking and animations are disabled;
  a clean static layout is shown.
- **Performance** — canvas lazy-mounted after first paint, `dpr` capped at 2
  (1.5 on mobile/low-power), one-draw-call particles, rendering pauses when the
  tab is hidden, three.js code-split out of the first-load bundle.
- **No layout shift, no horizontal scroll** — verified at 375 / 768 / 1280 / 1920.
- **Readable without JS or WebGL** — full SSR content, static gradient backdrop,
  intro overlay is CSS-gated on `html.js`.
- **Accessible** — semantic landmarks, labelled form fields, keyboard-friendly
  accordion (`aria-expanded` / `aria-controls`), visible focus rings, AA contrast.
- All GSAP / Lenis / three listeners and objects are disposed on unmount.

## Deploy on Vercel

1. Push this folder to GitHub (the `package.json` must be at the top level of the repo).
2. Vercel -> Add New -> Project -> import the repo. Framework Preset should say **Next.js**.
3. (Optional) Environment Variables: `RESEND_API_KEY` so the contact form emails techruise5@gmail.com
   (create the Resend account with that same email; the free test sender can only deliver to it).
4. Deploy.
