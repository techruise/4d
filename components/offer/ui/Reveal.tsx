'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/offer/scene';

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'section' | 'li' | 'span';
};

/**
 * Scroll-reveal wrapper. The initial hidden state is applied from JS only,
 * so content stays fully visible when scripts are disabled or motion is
 * reduced.
 */
export default function Reveal({ children, className, delay = 0, y = 30, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay, y]);

  const Tag = as as 'div';
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
