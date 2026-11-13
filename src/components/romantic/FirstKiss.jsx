import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';
import useConfetti from '../../hooks/useConfetti';
import KissingCouple from './KissingCouple';

/**
 * Section 13 — And Then, One Kiss
 *
 * A whole page built around one moment: a boy and a girl leaning in under a
 * sky full of stars. Tap them and they lean closer, the kiss glows, petals
 * fall and a magical poem line writes itself across the page.
 *
 * All copy lives in `config.firstKiss`.
 */

const DEFAULT_POEMS = [
  'Two hearts leaned in, and the whole sky forgot how to breathe.',
  'One kiss \u2014 and every star learned your name.',
  'Somewhere between your heartbeat and mine, forever quietly began.',
  'The world went still, just long enough for us to become a poem.',
];

/* Deterministic pseudo-random so the sky looks the same on every visit. */
function seeded(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

const STAR_COUNT = 54;
const PETAL_COUNT = 14;

function StarSky() {
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => ({
        id: i,
        x: seeded(i + 1) * 100,
        y: seeded(i + 2) * 78,
        size: 1 + seeded(i + 3) * 2.2,
        delay: `${(seeded(i + 4) * 6).toFixed(2)}s`,
        duration: `${(2.6 + seeded(i + 5) * 3.4).toFixed(2)}s`,
        opacity: 0.25 + seeded(i + 6) * 0.55,
      })),
    [],
  );

  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, i) => ({
        id: i,
        x: seeded(i + 21) * 100,
        size: 7 + seeded(i + 22) * 9,
        delay: `${(seeded(i + 23) * 14).toFixed(2)}s`,
        duration: `${(11 + seeded(i + 24) * 9).toFixed(2)}s`,
        drift: `${(seeded(i + 25) * 90 - 45).toFixed(1)}px`,
        rotate: `${(seeded(i + 26) * 360).toFixed(0)}deg`,
        opacity: 0.18 + seeded(i + 27) * 0.3,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="kiss-moon" />

      {stars.map((star) => (
        <span
          key={star.id}
          className="kiss-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      <span className="kiss-shooting-star" style={{ top: '18%', left: '-10%', animationDelay: '1.5s' }} />
      <span className="kiss-shooting-star" style={{ top: '40%', left: '20%', animationDelay: '6s' }} />
      <span className="kiss-shooting-star" style={{ top: '10%', left: '55%', animationDelay: '11s' }} />

      {petals.map((petal) => (
        <span
          key={petal.id}
          className="kiss-petal"
          style={{
            left: `${petal.x}%`,
            width: `${petal.size}px`,
            height: `${petal.size * 0.72}px`,
            opacity: petal.opacity,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            '--petal-drift': petal.drift,
            '--petal-rotate': petal.rotate,
          }}
        />
      ))}
    </div>
  );
}

/** The poem line: words rise into place, then a light sweeps across it. */
function MagicPoem({ text, reduceMotion }) {
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <p className="magic-line mx-auto max-w-md text-balance">
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="magic-word"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.5, delay: index * 0.075, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {word}
          {index < words.length - 1 ? '\u00a0' : ''}
        </motion.span>
      ))}
    </p>
  );
}

export default function FirstKiss({ onNext }) {
  const config = useRomanticConfig();
  const kiss = config.firstKiss || {};

  const shouldReduceMotion = useReducedMotion();
  const { fireConfetti } = useConfetti('romantic');

  const poems = useMemo(
    () => (Array.isArray(kiss.poems) && kiss.poems.length > 0 ? kiss.poems : DEFAULT_POEMS),
    [kiss.poems],
  );

  const target = Math.max(1, Number(kiss.afterKisses) || 3);

  const [kisses, setKisses] = useState(0);
  const [leaning, setLeaning] = useState(false);
  const [bursts, setBursts] = useState([]);

  const done = kisses >= target;
  const poem = done ? kiss.finalPoem || poems[0] : poems[kisses % poems.length];

  const leanIn = () => {
    const next = kisses + 1;
    setKisses(next);
    setLeaning(true);
    window.setTimeout(() => setLeaning(false), 950);

    const stamp = Date.now();
    const fresh = Array.from({ length: 5 }, (_, i) => ({
      id: `${stamp}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      dx: (Math.random() - 0.5) * 120,
      dy: -50 - Math.random() * 100,
      rotate: (Math.random() - 0.5) * 80,
      scale: 0.6 + Math.random() * 0.8,
      delay: i * 0.05,
      kind: i % 2 === 0 ? 'heart' : 'spark',
    }));
    setBursts((previous) => [...previous, ...fresh].slice(-26));

    if (next === target && !shouldReduceMotion) fireConfetti();
  };

  return (
    <div
      className={`romantic-section kiss-page relative overflow-hidden py-14 justify-start ${
        leaning ? 'kiss-page-flash' : ''
      }`}
    >
      <StarSky />

      <div className="relative z-10 mx-auto w-full max-w-xl px-4 text-center">

        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-cursive text-[10px] uppercase tracking-[0.38em] text-romantic-200/90">
            {kiss.label || 'one kiss \u00b7 one forever'}
          </p>
          <h2 className="mt-2 font-display text-3xl leading-tight text-white drop-shadow-[0_4px_18px_rgba(255,120,170,0.45)] sm:text-4xl">
            {kiss.title || 'And Then, One Kiss'}
          </h2>
          <p className="mt-1 px-2 font-script text-xl leading-snug text-romantic-200 sm:text-2xl">
            {kiss.subtitle || 'the night we stopped being two'}
          </p>
        </motion.div>

        {/* ── The couple ─────────────────────────────────────────── */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mx-auto mt-1 w-full max-w-[360px]"
        >
          <div className="kiss-aura" aria-hidden="true" />

          <button
            type="button"
            onClick={leanIn}
            aria-label={kiss.hint || 'Tap them to lean in'}
            className={`kiss-stage relative z-10 block w-full rounded-[2rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-romantic-300/50 ${
              leaning ? 'kiss-is-leaning' : ''
            }`}
          >
            <KissingCouple className="block h-auto w-full" />
          </button>

          {/* Hearts and sparks that jump out of the kiss */}
          {bursts.map((burst) => (
            <motion.span
              key={burst.id}
              aria-hidden="true"
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.3, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: burst.dx,
                y: burst.dy,
                scale: burst.scale,
                rotate: burst.rotate,
              }}
              transition={{ duration: 1.7, ease: 'easeOut', delay: burst.delay }}
              onAnimationComplete={() =>
                setBursts((previous) => previous.filter((item) => item.id !== burst.id))
              }
              className={`kiss-burst absolute left-1/2 top-[58%] ${
                burst.kind === 'heart' ? 'text-romantic-200' : 'text-white'
              }`}
            >
              {burst.kind === 'heart' ? '\u2665' : '\u2726'}
            </motion.span>
          ))}
        </motion.div>

        {/* ── The magical poem line ──────────────────────────────── */}
        <div className="relative mt-1 min-h-[92px]">
          <span className="kiss-poem-spark absolute -left-1 top-2 text-sm text-romantic-200" aria-hidden="true">{'\u2726'}</span>
          <span className="kiss-poem-spark absolute -right-1 top-2 text-sm text-romantic-200" aria-hidden="true">{'\u2726'}</span>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={poem}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <MagicPoem text={poem} reduceMotion={shouldReduceMotion} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Count + hint ───────────────────────────────────────── */}
        <div className="mt-2 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-romantic-200/80">
          <span className="tabular-nums text-romantic-100">
            {Math.min(kisses, target)}
            <span className="text-romantic-200/50"> / </span>
            {target}
          </span>
          <span>{kiss.counterLabel || 'kisses'}</span>
        </div>

        <p className="mt-2 text-[11px] text-romantic-200/70">
          {kiss.hint || 'Tap them to lean in'}
        </p>

        <div className="mt-5">
          <button type="button" onClick={onNext} className="btn-romantic">
            {kiss.continueText || 'Keep going \u2764\ufe0f \u2192'}
          </button>
        </div>

        <p className="sr-only" aria-live="polite">
          {kisses === 0 ? kiss.hint || 'Tap them to lean in' : `${kisses} kisses. ${poem}`}
        </p>
      </div>
    </div>
  );
}
