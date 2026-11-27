import { useMemo } from 'react';

/**
 * Decorative CSS layers for the "signature" themes.
 *
 * Each theme in utils/themes.js can carry an optional `effect` id. The layers
 * are purely visual, never receive pointer events, and are hidden from
 * assistive tech. Animations are disabled automatically by the global
 * `prefers-reduced-motion` rule in index.css.
 */

const PETAL_EMOJIS = ['🌸', '🌷', '🌺', '💮', '🌸', '🍃'];
const PAW_EMOJIS = ['🐾', '🐾', '💕', '🐾', '✨', '🐾'];
const PETAL_COUNT = 18;
const DUST_COUNT = 36;

/** Deterministic pseudo-random so particles keep their position between renders. */
function pseudoRandom(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export default function ThemeEffect({ effect }) {
  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, i) => ({
        id: i,
        emoji: PETAL_EMOJIS[i % PETAL_EMOJIS.length],
        left: `${(i * 5.6 + pseudoRandom(i + 1) * 4) % 100}%`,
        size: `${0.85 + pseudoRandom(i + 7) * 0.75}rem`,
        delay: `${(i * 0.7) % 12}s`,
        duration: `${9 + pseudoRandom(i + 3) * 7}s`,
        drift: `${(pseudoRandom(i + 11) - 0.5) * 160}px`,
      })),
    [],
  );

  const dust = useMemo(
    () =>
      Array.from({ length: DUST_COUNT }, (_, i) => ({
        id: i,
        top: `${pseudoRandom(i + 1) * 100}%`,
        left: `${pseudoRandom(i + 21) * 100}%`,
        size: `${2 + pseudoRandom(i + 41) * 4}px`,
        delay: `${pseudoRandom(i + 61) * 4.5}s`,
        duration: `${3.5 + pseudoRandom(i + 81) * 3}s`,
      })),
    [],
  );

  if (!effect) return null;

  return (
    <div
      className="fixed inset-0 z-[15] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {effect === 'aurora' && (
        <>
          <span
            className="theme-aurora-blob"
            style={{
              top: '-16%',
              left: '-12%',
              width: 'min(60vw, 640px)',
              height: 'min(60vw, 640px)',
              background: 'radial-gradient(circle, #34d399 0%, rgba(52,211,153,0) 70%)',
            }}
          />
          <span
            className="theme-aurora-blob"
            style={{
              top: '20%',
              right: '-18%',
              width: 'min(55vw, 560px)',
              height: 'min(55vw, 560px)',
              background: 'radial-gradient(circle, #22d3ee 0%, rgba(34,211,238,0) 70%)',
              animationDuration: '23s',
              animationDelay: '-6s',
            }}
          />
          <span
            className="theme-aurora-blob"
            style={{
              bottom: '-22%',
              left: '22%',
              width: 'min(65vw, 700px)',
              height: 'min(65vw, 700px)',
              background: 'radial-gradient(circle, #6366f1 0%, rgba(99,102,241,0) 70%)',
              animationDuration: '27s',
              animationDelay: '-12s',
            }}
          />
        </>
      )}

      {effect === 'sakura' &&
        petals.map((petal) => (
          <span
            key={petal.id}
            className="theme-petal"
            style={{
              left: petal.left,
              fontSize: petal.size,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
              '--drift': petal.drift,
            }}
          >
            {petal.emoji}
          </span>
        ))}

      {effect === 'paws' &&
        petals.map((petal) => (
          <span
            key={petal.id}
            className="theme-paw"
            style={{
              left: petal.left,
              fontSize: petal.size,
              animationDelay: petal.delay,
              animationDuration: `${Number.parseFloat(petal.duration) * 1.4}s`,
              '--drift': petal.drift,
            }}
          >
            {PAW_EMOJIS[petal.id % PAW_EMOJIS.length]}
          </span>
        ))}

      {effect === 'holo' && <span className="theme-holo-sheen" />}

      {effect === 'gold' &&
        dust.map((speck) => (
          <span
            key={speck.id}
            className="theme-gold-dust"
            style={{
              top: speck.top,
              left: speck.left,
              width: speck.size,
              height: speck.size,
              animationDelay: speck.delay,
              animationDuration: speck.duration,
            }}
          />
        ))}
    </div>
  );
}
