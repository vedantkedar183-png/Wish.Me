import { useMemo } from 'react';

/**
 * Fixed midnight sky that sits behind every chapter of the romantic story.
 *
 * The stars are deterministic so the sky does not reshuffle between scenes.
 * It is purely decorative and never blocks interaction.
 */

function seeded(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export default function StoryThemeLayer() {
  const stars = useMemo(
    () =>
      Array.from({ length: 130 }, (_, i) => ({
        id: i,
        left: seeded(i + 1) * 100,
        top: seeded(i + 17) * 100,
        size: 0.7 + seeded(i + 33) * 2.1,
        opacity: 0.16 + seeded(i + 49) * 0.68,
        duration: 2.8 + seeded(i + 65) * 5.2,
        delay: seeded(i + 81) * 7,
        warm: seeded(i + 97) > 0.78,
      })),
    [],
  );

  return (
    <div className="story-theme-layer" aria-hidden="true">
      <div className="story-theme-aurora story-theme-aurora-one" />
      <div className="story-theme-aurora story-theme-aurora-two" />
      <div className="story-theme-haze" />
      {stars.map((star) => (
        <span
          key={star.id}
          className={`story-theme-star ${star.warm ? 'is-warm' : ''}`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--story-star-opacity': star.opacity,
            '--story-twinkle': `${star.duration}s`,
            '--story-delay': `${star.delay}s`,
          }}
        />
      ))}
      <span className="story-theme-shooting-star story-theme-shooting-one" />
      <span className="story-theme-shooting-star story-theme-shooting-two" />
      <div className="story-theme-grain" />
    </div>
  );
}
