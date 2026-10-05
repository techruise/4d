'use client';

import { useEffect, useRef, useState } from 'react';
import Eyebrow from '../ui/Eyebrow';
import Reveal from '../ui/Reveal';
import { AI_ADDONS } from '@/lib/offer/content';
import { prefersReducedMotion } from '@/lib/offer/scene';

type Line = { who: 'user' | 'ai'; text: string };

const SCRIPT: Line[] = [
  { who: 'user', text: 'How long does a website take to build?' },
  {
    who: 'ai',
    text: 'Most Techruise sites launch in weeks, not months — we scope first, then build. Want a timeline for yours?',
  },
  { who: 'user', text: 'Can it answer my customers like this?' },
  {
    who: 'ai',
    text: 'Exactly like this — trained on your business, embedded in your site, replying in seconds. Any hour.',
  },
  { who: 'user', text: 'What if it can’t answer something?' },
  {
    who: 'ai',
    text: 'It hands off to a human and saves the lead. Nothing slips through.',
  },
];

/** Scripted terminal where a Techruise agent answers visitors, on loop. */
function Terminal() {
  const [visible, setVisible] = useState<Line[]>([]);
  const [partial, setPartial] = useState('');
  const [partialWho, setPartialWho] = useState<'user' | 'ai'>('user');
  const root = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduced = prefersReducedMotion();
    if (reduced) {
      setVisible(SCRIPT);
      return;
    }

    let started = false;
    let cancelled = false;

    const run = () => {
      const wait = (ms: number, fn: () => void) => {
        const id = window.setTimeout(() => {
          if (!cancelled) fn();
        }, ms);
        timers.current.push(id);
      };

      const typeLine = (index: number) => {
        if (cancelled) return;
        if (index >= SCRIPT.length) {
          wait(3800, () => {
            setVisible([]);
            setPartial('');
            run();
          });
          return;
        }
        const line = SCRIPT[index];
        setPartialWho(line.who);
        if (line.who === 'user') {
          setPartial('');
          wait(420, () => {
            if (cancelled) return;
            setVisible((v) => [...v, line]);
            typeLine(index + 1);
          });
        } else {
          let i = 0;
          const step = () => {
            if (cancelled) return;
            if (i <= line.text.length) {
              setPartial(line.text.slice(0, i));
              i += 2;
              wait(16 + Math.random() * 26, step);
            } else {
              setPartial('');
              setVisible((v) => [...v, line]);
              wait(650, () => typeLine(index + 1));
            }
          };
          wait(350, step);
        }
      };

      setVisible([]);
      setPartial('');
      typeLine(0);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          run();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const renderLine = (line: Line, key: number) => (
    <p key={key} className={line.who === 'user' ? 'text-ink' : 'text-accent/95'}>
      <span className={line.who === 'user' ? 'mr-2 text-muted' : 'mr-2 text-gold'}>
        {line.who === 'user' ? '❯ visitor:' : '◆ agent:'}
      </span>
      {line.text}
    </p>
  );

  return (
    <div ref={root} className="glass-strong overflow-hidden rounded-2xl shadow-glow-sm">
      <div className="flex items-center gap-2 border-b border-line/80 bg-base/70 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
        <span className="ml-2 text-xs font-medium text-muted">{AI_ADDONS.terminalTitle}</span>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-accent">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          online
        </span>
      </div>
      <div className="min-h-[21rem] space-y-3.5 p-5 font-mono text-[13px] leading-relaxed sm:min-h-[19rem]">
        {visible.map(renderLine)}
        {partial && (
          <p className={partialWho === 'user' ? 'text-ink' : 'text-accent/95'}>
            <span className={partialWho === 'user' ? 'mr-2 text-muted' : 'mr-2 text-gold'}>
              {partialWho === 'user' ? '❯ visitor:' : '◆ agent:'}
            </span>
            {partial}
            <span className="ml-0.5 inline-block h-3.5 w-[7px] animate-pulse bg-accent align-middle" aria-hidden />
          </p>
        )}
        {!partial && (
          <p className="text-accent/95" aria-hidden>
            <span className="mr-2 text-gold">◆ agent:</span>
            <span className="ml-0.5 inline-block h-3.5 w-[7px] animate-pulse bg-accent align-middle" />
          </p>
        )}
      </div>
    </div>
  );
}

/** AI add-ons section: copy + live-feel agent terminal. */
export default function AiAddons() {
  return (
    <section id="ai" aria-label="AI add-ons" className="relative px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-8xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <Eyebrow text={AI_ADDONS.eyebrow} />
          <h2 className="max-w-lg text-[clamp(1.9rem,5vw,3.5rem)] font-semibold leading-[1.12] tracking-tight text-ink">
            An employee that <em className="font-serif italic font-normal text-gold">never sleeps.</em>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            {AI_ADDONS.sub}
          </p>
          <ul className="mt-8 flex max-w-md flex-wrap gap-2.5">
            {AI_ADDONS.chips.map((c) => (
              <li
                key={c}
                className="rounded-full border border-accent/25 bg-accent/5 px-3.5 py-1.5 text-xs font-medium text-accent"
              >
                {c}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <Terminal />
        </Reveal>
      </div>
    </section>
  );
}
