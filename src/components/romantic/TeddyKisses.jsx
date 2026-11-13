import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';
import useConfetti from '../../hooks/useConfetti';
import KissMark from './KissMark';

/**
 * Section 13 — A Teddy Full of Kisses
 *
 * A hand-drawn teddy who has been saving up kisses. Tap him and he leans in,
 * sends three little kiss marks into the air and says something sweet. A few
 * kisses later, confetti falls.
 *
 * All copy lives in `config.teddy`.
 */

const DEFAULT_MESSAGES = [
  'Mwah! That one was for your smile.',
  'A kiss for the way you laugh.',
  'This one is for your kind heart.',
  'And one more, because I can.',
];

function TeddyBear() {
  return (
    <svg
      viewBox="0 0 300 340"
      className="block h-auto w-full overflow-visible"
      role="img"
      aria-label="A cute teddy bear holding a heart"
    >
      <defs>
        <linearGradient id="teddyFur" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#e7b98c" />
          <stop offset="55%" stopColor="#d9a06a" />
          <stop offset="100%" stopColor="#c3854f" />
        </linearGradient>
        <linearGradient id="teddyFurLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9dfc5" />
          <stop offset="100%" stopColor="#efc9a3" />
        </linearGradient>
        <linearGradient id="teddyEar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd0dd" />
          <stop offset="100%" stopColor="#f7a4bf" />
        </linearGradient>
        <linearGradient id="teddyBow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff8fab" />
          <stop offset="100%" stopColor="#e63946" />
        </linearGradient>
        <linearGradient id="teddyHeartGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffa3b8" />
          <stop offset="50%" stopColor="#f43f78" />
          <stop offset="100%" stopColor="#b31f47" />
        </linearGradient>
        <radialGradient id="teddyCheek">
          <stop offset="0%" stopColor="#ff8fab" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff8fab" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="150" cy="320" rx="88" ry="14" fill="#c96a86" opacity="0.16" />

      {/* Ears */}
      <g className="teddy-ear teddy-ear-left">
        <circle cx="94" cy="92" r="33" fill="url(#teddyFur)" />
        <circle cx="94" cy="92" r="19" fill="url(#teddyEar)" />
      </g>
      <g className="teddy-ear teddy-ear-right">
        <circle cx="206" cy="92" r="33" fill="url(#teddyFur)" />
        <circle cx="206" cy="92" r="19" fill="url(#teddyEar)" />
      </g>

      {/* Body */}
      <path
        d="M150,174 C197,174 224,210 224,250 C224,290 192,314 150,314 C108,314 76,290 76,250 C76,210 103,174 150,174 Z"
        fill="url(#teddyFur)"
      />
      <ellipse cx="150" cy="248" rx="52" ry="48" fill="url(#teddyFurLight)" opacity="0.9" />

      {/* Legs */}
      <ellipse cx="104" cy="298" rx="31" ry="23" fill="url(#teddyFur)" />
      <ellipse cx="196" cy="298" rx="31" ry="23" fill="url(#teddyFur)" />
      <ellipse cx="104" cy="301" rx="15" ry="11" fill="url(#teddyEar)" opacity="0.85" />
      <ellipse cx="196" cy="301" rx="15" ry="11" fill="url(#teddyEar)" opacity="0.85" />

      {/* Arms */}
      <ellipse cx="72" cy="234" rx="21" ry="39" transform="rotate(18 72 234)" fill="url(#teddyFur)" />
      <ellipse cx="228" cy="234" rx="21" ry="39" transform="rotate(-18 228 234)" fill="url(#teddyFur)" />

      {/* Heart */}
      <path
        d="M150,262 C136,248 114,236 114,216 C114,203 125,194 137,194 C144,194 148,198 150,203 C152,198 156,194 163,194 C175,194 186,203 186,216 C186,236 164,248 150,262 Z"
        fill="url(#teddyHeartGrad)"
        stroke="#fff4f7"
        strokeWidth="2.5"
      />
      <path d="M132,206 C136,201 142,201 146,205" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Paws over the heart */}
      <circle cx="110" cy="238" r="17" fill="url(#teddyFur)" />
      <circle cx="190" cy="238" r="17" fill="url(#teddyFur)" />
      <circle cx="110" cy="238" r="7" fill="#f7c6a3" opacity="0.8" />
      <circle cx="190" cy="238" r="7" fill="#f7c6a3" opacity="0.8" />

      {/* Head */}
      <ellipse cx="150" cy="128" rx="69" ry="61" fill="url(#teddyFur)" />

      {/* Cheeks */}
      <ellipse cx="104" cy="143" rx="14" ry="9" fill="url(#teddyCheek)" />
      <ellipse cx="196" cy="143" rx="14" ry="9" fill="url(#teddyCheek)" />

      {/* Muzzle + nose + smile */}
      <ellipse cx="150" cy="152" rx="37" ry="27" fill="url(#teddyFurLight)" />
      <path
        d="M150,131 C157,131 164,136 164,142 C164,149 155,153 150,156 C145,153 136,149 136,142 C136,136 143,131 150,131 Z"
        fill="#4a2f22"
      />
      <ellipse cx="147" cy="137" rx="3.4" ry="2.2" fill="#ffffff" opacity="0.55" />
      <path
        d="M150,156 L150,161 M150,161 C144,168 136,166 134,160 M150,161 C156,168 164,166 166,160"
        stroke="#4a2f22"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Eyes */}
      <g className="teddy-eye">
        <circle cx="123" cy="117" r="6.4" fill="#3b2417" />
        <circle cx="177" cy="117" r="6.4" fill="#3b2417" />
        <circle cx="121" cy="115" r="2" fill="#ffffff" opacity="0.9" />
        <circle cx="175" cy="115" r="2" fill="#ffffff" opacity="0.9" />
      </g>

      {/* Bow tie */}
      <g>
        <path d="M150,188 L120,176 C112,173 108,180 112,188 L116,198 C118,203 124,204 128,201 Z" fill="url(#teddyBow)" />
        <path d="M150,188 L180,176 C188,173 192,180 188,188 L184,198 C182,203 176,204 172,201 Z" fill="url(#teddyBow)" />
        <circle cx="150" cy="190" r="8" fill="#e63946" stroke="#ffd0dd" strokeWidth="2" />
      </g>
    </svg>
  );
}

export default function TeddyKisses({ onNext }) {
  const config = useRomanticConfig();
  const teddy = config.teddy || {};

  const shouldReduceMotion = useReducedMotion();
  const { fireConfetti } = useConfetti('romantic');

  const messages = useMemo(
    () =>
      Array.isArray(teddy.messages) && teddy.messages.length > 0
        ? teddy.messages
        : DEFAULT_MESSAGES,
    [teddy.messages],
  );

  const target = Math.max(1, Number(teddy.afterKisses) || 3);

  const [kisses, setKisses] = useState(0);
  const [bursts, setBursts] = useState([]);
  const [kissing, setKissing] = useState(false);
  const kissTimer = useRef(null);

  useEffect(
    () => () => {
      if (kissTimer.current) clearTimeout(kissTimer.current);
    },
    [],
  );

  const won = kisses >= target;
  const line =
    kisses === 0
      ? teddy.firstMessage || 'Tap me \u2014 I have kisses to give!'
      : messages[(kisses - 1) % messages.length];

  const giveKiss = () => {
    const nextKisses = kisses + 1;
    setKisses(nextKisses);

    setKissing(true);
    if (kissTimer.current) clearTimeout(kissTimer.current);
    kissTimer.current = setTimeout(() => setKissing(false), 850);

    const stamp = Date.now();
    const fresh = [0, 1, 2].map((i) => ({
      id: `${stamp}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      dx: (i - 1) * 34 + (Math.random() - 0.5) * 18,
      dy: -78 - Math.random() * 74,
      rotate: (Math.random() - 0.5) * 50,
      scale: 0.6 + Math.random() * 0.55,
      delay: i * 0.06,
    }));
    setBursts((previous) => [...previous, ...fresh].slice(-18));

    if (nextKisses === target && !shouldReduceMotion) fireConfetti();
  };

  return (
    <div className="romantic-section teddy-page relative overflow-hidden py-16 justify-start">
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 text-center">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-4xl block mb-2" aria-hidden="true">🧸</span>
          <h2 className="font-display text-3xl md:text-4xl text-romantic-warm mb-2">
            {teddy.title || 'A Teddy Full of Kisses'}
          </h2>
          <p className="font-cursive text-xl text-romantic-muted">
            {teddy.subtitle || 'He has been saving 2,228 kisses just for you'}
          </p>
        </motion.div>

        {/* ── Teddy stage ──────────────────────────────────────────── */}
        <div
          className={`teddy-stage relative mx-auto mt-2 w-full max-w-[300px] ${
            kissing ? 'teddy-is-kissing' : ''
          }`}
        >
          <div className="teddy-halo" aria-hidden="true" />

          <span className="divine-star pointer-events-none absolute left-2 top-16 text-base text-romantic-300" aria-hidden="true">✦</span>
          <span className="divine-star pointer-events-none absolute right-1 top-28 text-xs text-romantic-200" style={{ animationDelay: '1.2s' }} aria-hidden="true">✦</span>
          <span className="divine-star pointer-events-none absolute bottom-10 left-6 text-[11px] text-romantic-200" style={{ animationDelay: '2.1s' }} aria-hidden="true">✦</span>

          <button
            type="button"
            onClick={giveKiss}
            aria-label={teddy.hint || 'Tap the teddy for a kiss'}
            className="teddy-button relative z-10 block w-full rounded-[45%] focus:outline-none focus-visible:ring-4 focus-visible:ring-romantic-300/60"
          >
            <span className="teddy-bob block">
              <TeddyBear />
            </span>
          </button>

          {/* The kiss he plants on the screen */}
          <span className="teddy-kiss-mark" aria-hidden="true">
            <KissMark className="block h-auto w-full" />
          </span>

          {/* Kisses floating up on each tap */}
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
              transition={{ duration: 1.6, ease: 'easeOut', delay: burst.delay }}
              onAnimationComplete={() =>
                setBursts((previous) => previous.filter((item) => item.id !== burst.id))
              }
              className="teddy-burst absolute left-1/2 top-[42%] w-7 text-romantic-300"
            >
              <KissMark className="block h-auto w-full" />
            </motion.span>
          ))}
        </div>

        {/* ── What the teddy says ──────────────────────────────────── */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={kisses}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="glass-card mx-auto mt-2 max-w-sm rounded-3xl px-5 py-4"
          >
            <p className="font-cursive text-lg leading-snug text-romantic-600 sm:text-xl">
              {line}
            </p>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-romantic-muted tabular-nums">
              {kisses} {teddy.counterLabel || 'kisses given'}
            </p>

            {won && (
              <div className="mt-2 border-t border-romantic-200/70 pt-2">
                <p className="font-display text-base text-romantic-warm">
                  {teddy.winTitle || 'You have been kissed, teddy-style'}
                </p>
                <p className="mt-1 font-elegant text-sm italic leading-relaxed text-romantic-warm/75">
                  {teddy.winMessage ||
                    'He says what I have been trying to say all along: you are loved, today and every day.'}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <p className="mt-3 text-[11px] text-romantic-muted/80">
          {teddy.hint || 'Tap the teddy for a kiss'}
        </p>

        <div className="mt-5">
          <button type="button" onClick={onNext} className="btn-romantic">
            {teddy.continueText || 'Keep going \u2764\ufe0f \u2192'}
          </button>
        </div>

        <p className="sr-only" aria-live="polite">
          {kisses === 0
            ? 'Tap the teddy for a kiss.'
            : `${kisses} kisses given. ${line}`}
        </p>
      </div>
    </div>
  );
}
