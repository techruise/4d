'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/offer/scene';

/**
 * Text scramble/reveal: characters cycle through a glyph set and resolve
 * left-to-right when the element scrolls into view. Static (safe) without JS.
 */
export default function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const glyphs = '█▓▒░<>/+=*·techruise01';
    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = (now - start) / 850;
      const n = Math.floor(t * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        out += i < n || text[i] === ' ' ? text[i] : glyphs[(Math.random() * glyphs.length) | 0];
      }
      el.textContent = out;
      if (n < text.length) raf = requestAnimationFrame(tick);
      else el.textContent = text;
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          io.disconnect();
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
