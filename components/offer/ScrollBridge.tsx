'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { prefersReducedMotion, sceneState } from '@/lib/offer/scene';

gsap.registerPlugin(ScrollTrigger);

/**
 * Wires Lenis smooth scrolling to GSAP's ticker, exposes global scroll
 * progress + pointer state to the 3D scene, and smooths in-page anchors.
 * Everything is torn down on unmount — no leaked listeners.
 */
export default function useScrollBridge() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    if (reduced) {
      sceneState.progress = 0;
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Global progress 0 → 1 across the whole page journey.
    const progressTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        sceneState.progress = self.progress;
      },
    });

    // Pointer parallax state for the 3D camera.
    const onPointer = (e: PointerEvent) => {
      sceneState.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    // Smooth in-page anchors through Lenis.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -84, duration: 1.4 });
    };
    document.addEventListener('click', onClick);

    // Recalculate pinned/scrubbed triggers once webfonts settle.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      document.removeEventListener('click', onClick);
      window.removeEventListener('pointermove', onPointer);
      progressTrigger.kill();
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
}
