import { useState, useCallback, useRef, memo } from 'react';

/**
 * Advanced particle effects system with multiple visual layers.
 * Replaces FloatingHearts with a richer, theme-aware experience.
 *
 * @param {{ emojis: string[], glowColor: string, count: number }} props
 */
const ParticleField = memo(function ParticleField({
  emojis = ['✨', '🎂', '🎈', '🎉'],
  glowColor: _glowColor = '#fb7185',
  count = 24,
}) {
  const [sparkles, setSparkles] = useState([]);
  const sparkleIdRef = useRef(0);
  const containerRef = useRef(null);

  // Generate static floating particles across 3 depth layers
  const particles = useRef(
    Array.from({ length: count }, (_, i) => {
      const layer = i % 3; // 0=back, 1=mid, 2=front
      const speed = [18, 14, 10][layer]; // seconds for full rise
      const size = [0.7, 1, 1.4][layer];
      const opacity = [0.15, 0.25, 0.35][layer];

      return {
        id: i,
        emoji: emojis[i % emojis.length],
        left: `${(Math.random() * 96 + 2).toFixed(1)}%`,
        delay: `${(Math.random() * speed).toFixed(1)}s`,
        duration: `${(speed + Math.random() * 6).toFixed(1)}s`,
        size: `${size}rem`,
        opacity,
        layer,
        swayAmount: `${(Math.random() * 60 - 30).toFixed(0)}px`,
      };
    })
  ).current;

  // Mouse/touch sparkle trail
  const handlePointerMove = useCallback((e) => {
    // Throttle — only create sparkle every 100ms
    const now = Date.now();
    if (handlePointerMove._lastTime && now - handlePointerMove._lastTime < 100) return;
    handlePointerMove._lastTime = now;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++sparkleIdRef.current;

    const sparkleEmojis = ['✨', '⭐', '💫', '🌟'];

    setSparkles((prev) => [
      ...prev.slice(-8), // Keep max 9 sparkles
      {
        id,
        x,
        y,
        emoji: sparkleEmojis[id % sparkleEmojis.length],
      },
    ]);

    // Auto-remove after animation
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 1000);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-20"
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      style={{ pointerEvents: 'none' }}
    >
      {/* Floating particles — 3 depth layers */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 select-none"
          style={{
            left: p.left,
            fontSize: p.size,
            opacity: p.opacity,
            animation: `floatUpSway ${p.duration} ${p.delay} linear infinite`,
            '--sway': p.swayAmount,
            zIndex: p.layer,
            willChange: 'transform, opacity',
          }}
        >
          {p.emoji}
        </span>
      ))}

      {/* Sparkle trail */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute select-none"
          style={{
            left: s.x,
            top: s.y,
            fontSize: '1.2rem',
            animation: 'sparkleOut 1s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 50,
          }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  );
});

export default ParticleField;
