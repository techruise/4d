'use client';

import dynamic from 'next/dynamic';
import useScrollBridge from './ScrollBridge';
import Intro from './ui/Intro';
import CursorGlow from './ui/CursorGlow';
import Scene3D from './Scene3D';
import Nav from './sections/Nav';
import Hero from './sections/Hero';
import Marquee from './ui/Marquee';
import Footer from './sections/Footer';

/**
 * Below-fold sections are code-split (still server-rendered, so content is
 * fully readable without JS) — their hydration cost loads after first paint.
 */
const Problem = dynamic(() => import('./sections/Problem'));
const Features = dynamic(() => import('./sections/Features'));
const Showcase = dynamic(() => import('./sections/Showcase'));
const Process = dynamic(() => import('./sections/Process'));
const AiAddons = dynamic(() => import('./sections/AiAddons'));
const Packages = dynamic(() => import('./sections/Packages'));
const Founder = dynamic(() => import('./sections/Founder'));
const Faq = dynamic(() => import('./sections/Faq'));
const FinalCta = dynamic(() => import('./sections/FinalCta'));

/** The /offer experience: one continuous 3D journey through all sections. */
export default function OfferPage() {
  useScrollBridge();

  return (
    <div id="top" className="relative min-h-screen bg-transparent">
      {/* Static backdrop: gradient pools + grid + noise (always visible). */}
      <div aria-hidden className="bg-layers" />
      <Scene3D />
      <CursorGlow />
      <div aria-hidden className="grid-tex" />
      <div aria-hidden className="noise-tex" />

      <Intro />
      <Nav />

      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Problem />
        <Features />
        <Showcase />
        <Process />
        <AiAddons />
        <Packages />
        <Founder />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}
