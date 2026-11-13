import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';
import useConfetti from '../../hooks/useConfetti';

/**
 * Section 9 — Two Prints, One Heart
 *
 * The social-media “two thumbprints = one heart” trend, made interactive:
 * each thumb starts as a faint outline — tap it to ink it in. Once both are
 * stamped, the prints glow, confetti fires and a sweet message unlocks.
 */

/* The heart, split down the middle into two thumb-shaped halves. */
const LEFT_LOBE =
  'M130,208 C104,186 54,158 48,116 C43,84 64,62 89,62 C109,62 123,74 130,90 Z';
const RIGHT_LOBE =
  'M130,208 C156,186 206,158 212,116 C217,84 196,62 171,62 C151,62 137,74 130,90 Z';

/** Concentric fingerprint ridges, clipped to one heart lobe. */
function Ridges({ cx, cy, rx, ry, count = 10 }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const t = i / (count - 1);
        const scale = 0.16 + t * 0.84;
        const jx = (i % 2 === 0 ? 1 : -1) * (0.6 + i * 0.5);
        const jy = i * 0.5 - 2;

        return (
          <ellipse
            key={i}
            className="ridge"
            cx={cx + jx}
            cy={cy + jy}
            rx={rx * scale}
            ry={ry * scale}
            transform={`rotate(${(i % 2 === 0 ? 1 : -1) * (2 + i * 0.8)} ${cx + jx} ${cy + jy})`}
            fill="none"
            strokeWidth="1.5"
            strokeDasharray={`${24 + i * 4} ${10 + (i % 3) * 6}`}
            strokeDashoffset={i * 13}
          />
        );
      })}
      <ellipse
        className="ridge"
        cx={cx}
        cy={cy}
        rx="4.5"
        ry="7"
        fill="none"
        strokeWidth="1.4"
        strokeDasharray="9 6"
      />
    </g>
  );
}

/** One thumbprint — a heart lobe filled with fingerprint ridges. */
function Thumbprint({ side, stamped }) {
  const isLeft = side === 'left';

  return (
    <g
      className={`thumbprint ${isLeft ? 'thumbprint-left' : 'thumbprint-right'} ${
        stamped ? 'is-stamped' : ''
      }`}
    >
      <path className="thumb-fill" d={isLeft ? LEFT_LOBE : RIGHT_LOBE} />
      <g clipPath={isLeft ? 'url(#thumbClipLeft)' : 'url(#thumbClipRight)'}>
        <Ridges cx={isLeft ? 94 : 166} cy={126} rx={46} ry={60} />
      </g>
    </g>
  );
}

export default function ThumbprintHeart({ onNext }) {
  const config = useRomanticConfig();
  const print = config.thumbHeart || {};

  const [stamped, setStamped] = useState({ left: false, right: false });
  const [celebrated, setCelebrated] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const { fireConfetti } = useConfetti('romantic');

  const complete = stamped.left && stamped.right;

  const stamp = (side) => {
    if (stamped[side]) return;

    const next = { ...stamped, [side]: true };
    setStamped(next);

    if (next.left && next.right && !celebrated) {
      setCelebrated(true);
      if (!shouldReduceMotion) fireConfetti();
    }
  };

  const reset = () => {
    setStamped({ left: false, right: false });
    setCelebrated(false);
  };

  const remaining = [!stamped.left && 'left', !stamped.right && 'right'].filter(Boolean);

  return (
    <div className="romantic-section py-16 justify-start">
      <div className="relative z-10 w-full max-w-lg mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <span className="text-3xl block mb-2" aria-hidden="true">🤞💞</span>
          <h2 className="font-display text-3xl md:text-4xl text-romantic-warm mb-2">
            {print.title || 'Two Prints, One Heart'}
          </h2>
          <p className="font-cursive text-xl text-romantic-muted">
            {print.subtitle || 'Press both thumbs — that’s us, you know 💗'}
          </p>
        </motion.div>

        {/* ── Thumbprint heart stage ───────────────────────────────── */}
        <div className="relative mx-auto mt-2 w-full max-w-[300px]">
          <svg
            viewBox="0 0 260 240"
            className={`thumb-heart block h-auto w-full ${complete ? 'is-complete' : ''}`}
            role="img"
            aria-label="Two thumbprints joined together to form a heart"
          >
            <defs>
              <linearGradient id="thumbLeft" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffb3c6" />
                <stop offset="45%" stopColor="#f43f78" />
                <stop offset="100%" stopColor="#b31f47" />
              </linearGradient>
              <linearGradient id="thumbRight" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffc2d4" />
                <stop offset="45%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#d61f4e" />
              </linearGradient>
              <clipPath id="thumbClipLeft">
                <path d={LEFT_LOBE} />
              </clipPath>
              <clipPath id="thumbClipRight">
                <path d={RIGHT_LOBE} />
              </clipPath>
            </defs>

            <Thumbprint side="left" stamped={stamped.left} />
            <Thumbprint side="right" stamped={stamped.right} />
          </svg>

          {/* Tap targets over each half */}
          <button
            type="button"
            onClick={() => stamp('left')}
            disabled={stamped.left}
            aria-pressed={stamped.left}
            aria-label={stamped.left ? 'Left thumbprint stamped' : 'Stamp the left thumbprint'}
            className="absolute left-0 top-[20%] h-[58%] w-[47%] rounded-[45%] bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-romantic-400/70 disabled:cursor-default"
          />
          <button
            type="button"
            onClick={() => stamp('right')}
            disabled={stamped.right}
            aria-pressed={stamped.right}
            aria-label={stamped.right ? 'Right thumbprint stamped' : 'Stamp the right thumbprint'}
            className="absolute right-0 top-[20%] h-[58%] w-[47%] rounded-[45%] bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-romantic-400/70 disabled:cursor-default"
          />

          {/* Celebration sparkles */}
          {complete && (
            <>
              <span className="divine-star pointer-events-none absolute left-2 top-6 text-lg text-romantic-300" aria-hidden="true">✦</span>
              <span className="divine-star pointer-events-none absolute right-2 top-16 text-sm text-romantic-200" style={{ animationDelay: '0.9s' }} aria-hidden="true">✦</span>
              <span className="divine-star pointer-events-none absolute bottom-6 left-8 text-xs text-romantic-200" style={{ animationDelay: '1.8s' }} aria-hidden="true">✦</span>
            </>
          )}
        </div>

        {/* Caption */}
        <p className="mt-1 text-center font-script text-2xl text-romantic-500">
          {print.caption || 'Two prints, one heart — you & me'}
        </p>

        {/* Hint / progress */}
        {!complete ? (
          <p className="mt-1 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-romantic-muted">
            {print.hint || 'Tap both thumbprints'}
            <span className="mx-2">·</span>
            {stamped.left ? 1 : 0} / 2
          </p>
        ) : (
          <p className="mt-1 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-romantic-500">
            2 / 2 <span aria-hidden="true">·</span> {print.completeLabel || 'sealed with love'}
          </p>
        )}

        {/* Win card */}
        <AnimatePresence>
          {complete && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 20 }}
              className="glass-card mt-5 rounded-3xl p-5 text-center"
            >
              <p className="text-2xl" aria-hidden="true">💞</p>
              <p className="mt-1 font-display text-xl text-romantic-warm">
                {print.winTitle || 'Same heart, two prints'}
              </p>
              <p className="mt-1 font-cursive text-lg leading-snug text-romantic-500">
                {print.winMessage ||
                  'Different fingerprints, same heart — that’s the whole story. 💗'}
              </p>

              <div className="mt-4 flex flex-col items-center gap-2">
                <button type="button" onClick={onNext} className="btn-romantic">
                  {print.continueText || 'One last chapter 💌 →'}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-semibold text-romantic-500 underline decoration-dotted underline-offset-4 hover:text-romantic-600 transition-colors"
                >
                  {print.retryText || 'Stamp again 🔄'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Small nudge for the second thumb */}
        {!complete && remaining.length === 1 && (
          <p className="mt-3 text-center text-[11px] text-romantic-muted/80">
            {remaining[0] === 'left' ? 'One more on the left 👈' : 'One more on the right 👉'}
          </p>
        )}

        <p className="sr-only" aria-live="polite">
          {complete
            ? 'Both thumbprints stamped. Two prints, one heart.'
            : `${stamped.left ? 'Left' : 'No'} thumbprint stamped. ${
                stamped.right ? 'Right' : 'No second'
              } thumbprint yet.`}
        </p>
      </div>
    </div>
  );
}
