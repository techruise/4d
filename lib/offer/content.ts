/**
 * All copy for the /offer page lives here so it is trivial to edit.
 * Placeholders like [Client name] are intentional — no fabricated
 * testimonials, clients, stats or prices are used anywhere.
 */

export const BRAND = {
  name: 'Techruise',
  tagline: 'Let your business cruise',
  email: 'techruise5@gmail.com',
  founder: 'Raja Hunain',
  founderRole: 'Founder & CEO',
};

export const HERO = {
  badge: 'Techruise Web Studio · booking new projects',
  lines: ['Your website,', 'built to'],
  accent: 'cruise',
  trail: '.',
  sub: 'Techruise builds fast, animated, AI-powered websites that turn visitors into customers — premium design, 3D motion and a smart assistant, all in one launch.',
  primaryCta: 'Get my website',
  secondaryCta: 'See live demos',
  scrollHint: 'Scroll to set sail',
};

export const MARQUEE_ITEMS = [
  'Lightning fast',
  'Built to convert',
  'AI-powered',
  'Handcrafted design',
  '3D & motion',
  'SEO-ready',
  'Mobile first',
  'Yours to keep',
];

export const PROBLEM = {
  eyebrow: '01 · The problem',
  lead: 'Your website should sell while you sleep.',
  body: 'Instead, most sites load slow, look dated and say nothing. Visitors leave in seconds — while competitors’ sites chat with leads, capture details and close sales at 3 a.m.',
};

export const FEATURES = {
  eyebrow: '02 · What you get',
  title: 'Everything a premium site needs. Built in.',
  sub: 'No piecemeal plugins, no bloated templates — one handcrafted build with the good stuff already wired in.',
  items: [
    {
      icon: 'design',
      title: 'Premium design',
      body: 'A bespoke, high-end look that makes your business the obvious choice — no cookie-cutter templates.',
      tags: ['Custom UI', 'Brand-matched'],
    },
    {
      icon: 'motion',
      title: '3D & animated visuals',
      body: 'Scroll storytelling, 3D scenes and micro-interactions that make people stop scrolling — and remember you.',
      tags: ['Three.js', 'GSAP'],
    },
    {
      icon: 'ai',
      title: 'AI chatbot & agent built in',
      body: 'An assistant trained on your business — answering visitors, capturing leads and booking calls around the clock.',
      tags: ['Chat agent', 'Lead capture'],
    },
    {
      icon: 'speed',
      title: 'SEO + speed',
      body: 'Clean code, semantic markup and performance budgets from day one, so Google and your visitors both love you.',
      tags: ['Core Web Vitals', 'On-page SEO'],
    },
    {
      icon: 'mobile',
      title: 'Mobile first',
      body: 'Designed for the phone in your customer’s hand first, then scaled up — flawless at every screen size.',
      tags: ['Responsive', 'Touch-ready'],
    },
    {
      icon: 'edit',
      title: 'Easy to edit',
      body: 'Change text, images and pages without touching code. Own your site — no developer dependency.',
      tags: ['CMS', 'Handover docs'],
    },
  ],
};

export const SHOWCASE = {
  eyebrow: '03 · Showcase',
  title: 'Recent launches, fresh off the water.',
  sub: 'A glimpse of the kinds of sites we build. Placeholder projects shown — your site could be next.',
  swipeHint: 'Swipe',
  projects: [
    { name: '[Project name]', kind: 'SaaS landing page', tags: ['3D hero', 'AI chat'], variant: 'saas' },
    { name: '[Project name]', kind: 'E-commerce store', tags: ['Product AI', 'Fast checkout'], variant: 'shop' },
    { name: '[Project name]', kind: 'Restaurant & bookings', tags: ['Reservations', 'Menu CMS'], variant: 'bistro' },
    { name: '[Project name]', kind: 'Studio portfolio', tags: ['Motion', 'Gallery'], variant: 'studio' },
  ] as { name: string; kind: string; tags: string[]; variant: string }[],
  endCard: {
    title: 'Your website, here.',
    body: 'Tell us what you’re building — we’ll design, animate and ship it.',
    cta: 'Start my project',
  },
};

export const PROCESS = {
  eyebrow: '04 · How it works',
  title: 'Four steps. One smooth cruise.',
  counterLabel: 'steps from first call to launch day.',
  steps: [
    {
      num: '01',
      title: 'Discover',
      body: 'A free call to map your goals, your audience and the one job your website must do: sell.',
    },
    {
      num: '02',
      title: 'Design',
      body: 'You approve a premium design direction — look, feel, motion — before a single line of code is written.',
    },
    {
      num: '03',
      title: 'Build',
      body: 'We engineer your site: fast, animated, SEO-ready, with your AI assistant wired in from the start.',
    },
    {
      num: '04',
      title: 'Launch',
      body: 'We ship, connect your domain and analytics, and hand you the keys. Then we stay on call.',
    },
  ],
};

export const AI_ADDONS = {
  eyebrow: '05 · AI add-ons',
  title: 'An employee that never sleeps.',
  sub: 'Bolt an intelligent agent onto your site and let it greet, qualify and convert visitors — even at 3 a.m. Especially at 3 a.m.',
  chips: [
    'Instant replies',
    '24/7 coverage',
    'Lead capture',
    'Books calls',
    'Trained on your business',
    'Human handoff',
  ],
  terminalTitle: 'techruise-agent — live demo',
};

export const PACKAGES = {
  eyebrow: '06 · Packages',
  title: 'Pick a heading. We’ll chart the course.',
  sub: 'No prices here on purpose — every build is scoped to exactly what you need. Free quote, no pressure.',
  tiers: [
    {
      name: 'Starter',
      blurb: 'For a sharp, credible presence.',
      features: [
        'Landing page or up to 5 pages',
        'Bespoke design system',
        'Mobile-first build',
        'Speed + on-page SEO pass',
        'Contact form + analytics',
        'Launch in days, not weeks',
      ],
      featured: false,
    },
    {
      name: 'Growth',
      blurb: 'Our most-loved build.',
      badge: 'Most popular',
      features: [
        'Everything in Starter',
        'Up to 12 pages + blog / CMS',
        '3D or advanced motion hero',
        'AI chat agent built in',
        'Booking or lead funnels',
        '30 days of post-launch care',
      ],
      featured: true,
    },
    {
      name: 'Custom',
      blurb: 'When off-the-shelf won’t cut it.',
      features: [
        'Web apps & portals',
        'E-commerce & payments',
        'Custom AI agents & automations',
        'Integrations with your tools',
        'Dedicated senior team',
        'Ongoing partnership & SLA',
      ],
      featured: false,
    },
  ],
  cta: 'Get a quote',
};

export const FOUNDER = {
  eyebrow: 'A note from the founder',
  // Draft copy — edit freely here.
  quote:
    'I started Techruise after watching too many good businesses hide behind bad websites — slow, dated, silent. We built the studio I wished existed: a small senior team, obsessive craft, and sites that work as hard as you do. Fast when it loads. Alive when it moves. Smart when it talks to your customers. That’s the standard — and your business deserves to cruise.',
  name: BRAND.founder,
  role: `${BRAND.founderRole}, ${BRAND.name}`,
};

export const FAQS = {
  eyebrow: '07 · FAQ',
  title: 'Questions, answered.',
  items: [
    {
      q: 'How fast can you launch my website?',
      a: 'Most projects go live within a few weeks of the first call. A focused landing page can ship in days; bigger builds with AI features take a little longer. You get a clear timeline before we start — and we hit it.',
    },
    {
      q: 'What do you need from me to start?',
      a: 'A short conversation, plus anything you already have — logo, brand colors, copy, photos. Missing something? We’ll write, design and source it for you.',
    },
    {
      q: 'Can I update the website myself?',
      a: 'Yes. We build on an easy editing setup and hand over a walkthrough, so you can change text, images and pages without calling a developer.',
    },
    {
      q: 'What AI features can I actually get?',
      a: 'Chat agents that answer customers and capture leads, smart contact and booking flows, product recommenders, content helpers — scoped to your business, not bolted on for show.',
    },
    {
      q: 'Do you offer support after launch?',
      a: 'Yes — every launch includes a care window, and ongoing care plans keep your site updated, fast and secure while you focus on the business.',
    },
    {
      q: 'How much does it cost?',
      a: 'Every project is scoped individually, so we don’t list prices. Tell us what you need and you’ll get a fixed, no-surprises quote — free.',
    },
  ],
};

export const FINAL_CTA = {
  title: ['Ready to let your', 'business'],
  accent: 'cruise?',
  sub: 'Tell us about your project — get a free quote and a launch plan within one business day.',
  bookCta: 'Book a free call',
  formTitle: 'Or send the brief straight here',
  success: 'Got it — we’ll reply within one business day. Talk soon.',
  error: 'Something went wrong — please email us directly instead:',
};
