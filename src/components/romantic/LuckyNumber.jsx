import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';

/**
 * Section 12 — 2228, Our Lucky Number
 *
 * A whole page made of kisses: soft pink lip prints scattered across a blush
 * background, with the lucky number set big and bold in the middle. Tap the
 * number and a few kisses float up.
 *
 * All copy lives in `config.luckyNumber`.
 */

/* Two soft lip-print halves so each mark clearly reads as a kiss. */
const KISS_UPPER =
  'M16,46 C10,36 17,25 29,27 C39,29 45,35 50,40 C55,35 61,29 71,27 C83,25 90,36 84,46 C75,49 63,47 50,45 C37,47 25,49 16,46 Z';
const KISS_LOWER =
  'M17,50 C21,62 34,70 50,70 C66,70 79,62 83,50 C74,53 62,55 50,55 C38,55 26,53 17,50 Z';

/** Deterministic pseudo-random so the kisses stay in the same place. */
function seeded(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

const KISS_COUNT = 64;

function Kiss({ className = '', style }) {
  return (
    <svg viewBox="0 0 100 80" className={className} style={style} aria-hidden="true">
      <g fill="currentColor">
        <path d={KISS_UPPER} />
        <path d={KISS_LOWER} />
      </g>
    </svg>
  );
}

export default function LuckyNumber({ onNext }) {
  const config = useRomanticConfig();
  const lucky = config.luckyNumber || {};

  const shouldReduceMotion = useReducedMotion();
  const [bursts, setBursts] = useState([]);

  const number = String(lucky.number || '2228');
  const meaning = Array.isArray(lucky.meaning) && lucky.meaning.length > 0
    ? lucky.meaning
    : ['2 hearts', '2 souls', '2 people', '8 letters'];

  /* Scatter kisses around the middle, leaving the number its own space. */
  const kisses = useMemo(
    () =>
      Array.from({ length: KISS_COUNT }, (_, i) => ({
        id: i,
        x: 3 + seeded(i + 1) * 94,
        y: 4 + seeded(i + 2) * 92,
        size: 20 + seeded(i + 3) * 28,
        rotate: -42 + seeded(i + 4) * 84,
        delay: `${(seeded(i + 5) * 7).toFixed(2)}s`,
        duration: `${(5 + seeded(i + 6) * 4.5).toFixed(2)}s`,
        opacity: 0.24 + seeded(i + 7) * 0.34,
        inCenter:
          seeded(i + 1) * 94 + 3 > 22 &&
          seeded(i + 1) * 94 + 3 < 78 &&
          seeded(i + 2) * 92 + 4 > 22 &&
          seeded(i + 2) * 92 + 4 < 80,
      })).filter((kiss) => !kiss.inCenter),
    [],
  );

  const sendKiss = () => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setBursts((previous) => [
      ...previous,
      {
        id,
        dx: (Math.random() - 0.5) * 150,
        dy: -70 - Math.random() * 90,
        rotate: (Math.random() - 0.5) * 50,
        scale: 0.7 + Math.random() * 0.6,
      },
    ]);
  };

  return (
    <div className="romantic-section lucky-page relative overflow-hidden py-16 justify-start">

      {/* ── Kisses everywhere ─────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {kisses.map((kiss) => (
          <span
            key={kiss.id}
            className="kiss-mark"
            style={{
              left: `${kiss.x}%`,
              top: `${kiss.y}%`,
              width: `${kiss.size}px`,
              opacity: kiss.opacity,
              '--kiss-rotate': `${kiss.rotate}deg`,
              animationDelay: kiss.delay,
              animationDuration: kiss.duration,
            }}
          >
            <Kiss className="block h-auto w-full" />
          </span>
        ))}
      </div>

      {/* ── Centre ────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-4 text-center">

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-cursive text-[11px] uppercase tracking-[0.34em] text-romantic-500"
        >
          {lucky.label || 'our lucky number'}
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 16 }}
          className="relative mt-2"
        >
          <button
            type="button"
            onClick={sendKiss}
            aria-label={`Send a kiss to ${number}`}
            className="lucky-number-btn focus:outline-none focus-visible:ring-4 focus-visible:ring-romantic-300/60"
          >
            <span className="lucky-number font-display">{number}</span>
          </button>

          {/* Kisses that float up on tap */}
          {bursts.map((burst) => (
            <motion.span
              key={burst.id}
              aria-hidden="true"
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: burst.dx,
                y: burst.dy,
                scale: burst.scale,
                rotate: burst.rotate,
              }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              onAnimationComplete={() =>
                setBursts((previous) => previous.filter((item) => item.id !== burst.id))
              }
              className="kiss-burst absolute left-1/2 top-1/2 w-7 text-romantic-300"
            >
              <Kiss className="block h-auto w-full" />
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-1 font-script text-3xl text-romantic-500 sm:text-4xl"
        >
          {lucky.kissesLabel || '2,228 kisses'}
        </motion.p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {meaning.map((piece) => (
            <span
              key={piece}
              className="rounded-full border border-romantic-200/80 bg-white/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-romantic-600"
            >
              {piece}
            </span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mx-auto mt-5 max-w-md font-elegant text-lg italic leading-relaxed text-romantic-warm/80 sm:text-xl"
        >
          {lucky.message ||
            'Two hearts. Two souls. Two people. Eight little letters that say everything \u2014 I love you.'}
        </motion.p>

        <p className="mt-4 text-[11px] text-romantic-muted/80">
          {lucky.hint || 'Tap the number for a kiss'}
        </p>

        <div className="mt-6">
          <button type="button" onClick={onNext} className="btn-romantic">
            {lucky.continueText || 'Keep going \u2764\ufe0f \u2192'}
          </button>
        </div>

        <p className="sr-only" aria-live="polite">
          {`Our lucky number is ${number}. ${lucky.message || ''}`}
        </p>
      </div>
    </div>
  );
}
