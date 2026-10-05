'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/offer/scene';

gsap.registerPlugin(ScrollTrigger);

/** Animated number counter (0 → to) triggered on scroll into view. */
export default function Counter({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = String(to);
      return;
    }
    const state = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(state, {
        v: to,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = String(Math.round(state.v));
        },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [to]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
