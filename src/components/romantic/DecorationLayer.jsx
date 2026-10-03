import { useMemo } from 'react';

const PARTICLES = ['❤️', '🩷', '💕', '💗', '🌸', '✨', '🌹', '💫', '🎀', '🦋'];

/** A single slowly-rising romantic decoration particle */
function Particle({ symbol, left, delay, duration, size }) {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 pointer-events-none select-none"
      style={{
        left: `${left}%`,
        fontSize: `${size}rem`,
        animation: `romanticFloat ${duration}s ease-in-out ${delay}s infinite`,
        willChange: 'transform, opacity',
      }}
    >
      {symbol}
    </div>
  );
}

/**
 * Fixed-position background layer of slowly rising romantic particles.
 * Very subtle opacity — purely decorative, never interferes with content.
 */
export default function DecorationLayer({ count = 18 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        symbol: PARTICLES[i % PARTICLES.length],
        left: (i * 5.8 + Math.sin(i * 1.7) * 8 + 100) % 97,
        delay: (i * 0.55) % 14,
        duration: 12 + (i % 7) * 2,
        size: 0.7 + (i % 5) * 0.18,
      })),
    [count],
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </div>
  );
}
