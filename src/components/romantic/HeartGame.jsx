import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';
import useConfetti from '../../hooks/useConfetti';

/**
 * Section 7 — A Heart Full of You
 *
 * A big glowing heart with a ring around it. Every tap fills the ring, pops a
 * little heart into the air and brightens the glow. Fill it completely and the
 * heart bursts into confetti and unlocks a sweet message.
 *
 * Copy, tap target and prompts all live in `config.heartGame`.
 */

const PARTICLE_COLORS = ['#fb7185', '#f472b6', '#f9a8d4', '#fda4af', '#fbbf24'];

const HEART_PATH =
  'M100,170 C60,135 20,105 20,66 C20,38 42,20 66,20 C82,20 94,29 100,42 C106,29 118,20 134,20 C158,20 180,38 180,66 C180,105 140,135 100,170 Z';

export default function HeartGame({ onNext }) {
  const config = useRomanticConfig();
  const game = config.heartGame || {};

  const target = Math.max(3, Number(game.tapTarget) || 10);
  const prompts = useMemo(
    () => (Array.isArray(game.prompts) && game.prompts.length > 0
      ? game.prompts
      : ['Tap the heart…', 'Ooh, it glows brighter', 'Halfway to my whole heart', 'Almost bursting with love']),
    [game.prompts],
  );

  const [taps, setTaps] = useState(0);
  const [bursts, setBursts] = useState([]);
  const [won, setWon] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const { fireConfetti } = useConfetti('romantic');

  const progress = Math.min(1, taps / target);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const prompt = won
    ? (game.winTitle || 'It’s full — and it’s all yours')
    : prompts[Math.min(prompts.length - 1, Math.floor(progress * prompts.length))];

  const tapHeart = () => {
    if (won) return;

    const nextTaps = taps + 1;
    setTaps(nextTaps);

    // Pop a little heart out of the big one.
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const dx = (Math.random() - 0.5) * 170;
    const dy = -40 - Math.random() * 110;
    setBursts((previous) => [
      ...previous,
      {
        id,
        dx,
        dy,
        rotate: (Math.random() - 0.5) * 90,
        scale: 0.7 + Math.random() * 0.8,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      },
    ]);

    if (nextTaps >= target) {
      setWon(true);
      if (!shouldReduceMotion) fireConfetti();
    }
  };

  const reset = () => {
    setTaps(0);
    setBursts([]);
    setWon(false);
  };

  return (
    <div className="romantic-section py-16 justify-start">
      <div className="relative z-10 w-full max-w-lg mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-2"
        >
          <h2 className="font-display text-3xl md:text-4xl text-romantic-warm mb-2">
            {game.title || 'A Heart Full of You'}
          </h2>
          <p className="font-cursive text-xl text-romantic-muted">
            {game.subtitle || 'One tap, one little piece of my heart — fill it up 💗'}
          </p>
        </motion.div>

        {/* ── The heart stage ─────────────────────────────────────── */}
        <div className="relative mx-auto mt-6 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">

          {/* Soft glow behind the heart */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-4 rounded-full blur-2xl transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle, rgba(244,63,120,0.45) 0%, rgba(244,63,120,0) 70%)',
              opacity: 0.35 + progress * 0.6,
            }}
          />

          {/* Progress ring */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <defs>
              <linearGradient id="heartRing" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="50%" stopColor="#f43f78" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(244,63,120,0.14)" strokeWidth="3" />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="url(#heartRing)"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              className="transition-all duration-300 ease-out"
            />
          </svg>

          {/* Twinkles around the heart */}
          <span className="divine-star pointer-events-none absolute left-6 top-10 text-lg text-romantic-300" aria-hidden="true">✦</span>
          <span
            className="divine-star pointer-events-none absolute right-5 top-24 text-sm text-romantic-200"
            style={{ animationDelay: '1.1s' }}
            aria-hidden="true"
          >
            ✦
          </span>
          <span
            className="divine-star pointer-events-none absolute bottom-10 left-10 text-xs text-romantic-200"
            style={{ animationDelay: '2.2s' }}
            aria-hidden="true"
          >
            ✦
          </span>

          {/* Floating hearts */}
          {bursts.map((burst) => (
            <motion.span
              key={burst.id}
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.4, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.4, burst.scale, burst.scale * 1.1, burst.scale * 0.9],
                x: burst.dx,
                y: burst.dy,
                rotate: burst.rotate,
              }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              onAnimationComplete={() =>
                setBursts((previous) => previous.filter((item) => item.id !== burst.id))
              }
              className="pointer-events-none absolute left-1/2 top-1/2 text-2xl"
              style={{ color: burst.color }}
            >
              ♥
            </motion.span>
          ))}

          {/* The heart itself */}
          <motion.button
            type="button"
            onClick={tapHeart}
            disabled={won}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
            className="relative z-10 rounded-full p-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-romantic-300/60 disabled:cursor-default"
            aria-label={
              won
                ? 'Your heart is full'
                : `Fill the heart — ${taps} of ${target} taps`
            }
            aria-describedby="heart-progress"
          >
            <svg viewBox="0 0 200 180" className="heartbeat h-44 w-44 sm:h-52 sm:w-52" aria-hidden="true">
              <defs>
                <linearGradient id="heartFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffb3c6" />
                  <stop offset="42%" stopColor="#f43f78" />
                  <stop offset="100%" stopColor="#b31f47" />
                </linearGradient>
                <radialGradient id="heartShine" cx="0.3" cy="0.26" r="0.62">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#ffffff" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
                <filter id="heartGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path d={HEART_PATH} fill="url(#heartFill)" filter="url(#heartGlow)" />
              <path d={HEART_PATH} fill="url(#heartShine)" />
            </svg>
          </motion.button>
        </div>

        {/* Prompt + progress */}
        <div className="mt-2 text-center" aria-hidden="true">
          <p className="font-cursive text-lg text-romantic-500">{prompt}</p>
          <p id="heart-progress" className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-romantic-muted tabular-nums">
            {Math.min(taps, target)} / {target} {game.tapsLabel || 'taps'}
          </p>
        </div>

        <p className="sr-only" aria-live="polite">
          {won ? 'The heart is full of love.' : `${taps} of ${target} taps.`}
        </p>

        {/* Win card */}
        <AnimatePresence>
          {won && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 20 }}
              className="glass-card mt-6 rounded-3xl p-5 text-center"
            >
              <p className="text-2xl" aria-hidden="true">💞</p>
              <p className="mt-1 font-display text-xl text-romantic-warm">
                {game.winTitle || 'It’s full — and it’s all yours'}
              </p>
              <p className="mt-1 font-cursive text-lg leading-snug text-romantic-500">
                {game.winMessage ||
                  'Every tap was a little piece of my heart — and every piece has always belonged to you. 💞'}
              </p>

              <div className="mt-4 flex flex-col items-center gap-2">
                <button type="button" onClick={onNext} className="btn-romantic">
                  {game.continueText || 'Keep going ❤️ →'}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-semibold text-romantic-500 underline decoration-dotted underline-offset-4 hover:text-romantic-600 transition-colors"
                >
                  {game.retryText || 'Fill it again 🔄'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!won && (
          <p className="mt-4 text-center text-[11px] text-romantic-muted/80">
            {game.hint || 'Tap the heart — or press Space / Enter'}
          </p>
        )}
      </div>
    </div>
  );
}
