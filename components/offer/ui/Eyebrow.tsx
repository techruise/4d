'use client';

import ScrambleText from './ScrambleText';

/** Small uppercase eyebrow label with scramble-on-reveal. */
export default function Eyebrow({ text }: { text: string }) {
  return (
    <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-accent/90">
      <span aria-hidden className="inline-block h-px w-8 bg-accent/50" />
      <ScrambleText text={text} />
    </p>
  );
}
