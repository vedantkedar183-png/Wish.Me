import { useMemo } from 'react';

/** A single floating emoji that rises from the bottom using CSS keyframe animation. */
function FloatingEmoji({ emoji, left, delay, duration, size }) {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 pointer-events-none select-none"
      style={{
        left: `${left}%`,
        fontSize: `${size}rem`,
        animation: `floatUp ${duration}s ease-in-out ${delay}s infinite`,
        willChange: 'transform, opacity',
      }}
    >
      {emoji}
    </div>
  );
}

/**
 * Renders a field of floating emoji particles that rise from the bottom
 * of the screen with randomised timing, size, and horizontal position.
 *
 * @param {{ emojis: string[], count: number }} props
 */
export default function FloatingHearts({ emojis = ['❤️', '✨'], count = 18 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: emojis[i % emojis.length],
        left: 1 + (i * 6.1 + Math.sin(i * 2.3) * 10 + 100) % 96,
        delay: (i * 0.6) % 9,
        duration: 5 + (i % 5),
        size: 0.85 + (i % 4) * 0.2,
      })),
    [emojis, count],
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <FloatingEmoji key={p.id} {...p} />
      ))}
    </div>
  );
}
