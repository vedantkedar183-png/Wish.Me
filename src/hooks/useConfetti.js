import { useCallback } from 'react';
import confetti from 'canvas-confetti';

// ── Default confetti color palette ────────────────────────────────────────────
const DEFAULT_COLORS = [
  '#ff69b4', // hot pink
  '#ff1493', // deep pink
  '#ffd700', // gold
  '#ff6347', // tomato
  '#9400d3', // violet
  '#00ced1', // dark turquoise
  '#ff4500', // orange-red
  '#adff2f', // green-yellow
];

// ── Theme-aware color palettes ────────────────────────────────────────────────
const THEME_COLORS = {
  romantic:   ['#ff69b4', '#ff1493', '#ff6b81', '#ffd700', '#ff4081', '#e91e63', '#f06292', '#ffb6c1'],
  galaxy:     ['#a78bfa', '#7c3aed', '#818cf8', '#c084fc', '#6366f1', '#ffd700', '#38bdf8', '#a855f7'],
  tropical:   ['#fb923c', '#f97316', '#fbbf24', '#ff6b6b', '#ec4899', '#f43f5e', '#4ade80', '#06b6d4'],
  golden:     ['#ffd700', '#f59e0b', '#facc15', '#fb923c', '#f97316', '#fbbf24', '#eab308', '#d97706'],
  midnight:   ['#22d3ee', '#06b6d4', '#3b82f6', '#818cf8', '#a78bfa', '#ffd700', '#38bdf8', '#67e8f9'],
  pastel:     ['#f9a8d4', '#c4b5fd', '#fda4af', '#a5b4fc', '#86efac', '#fcd34d', '#f472b6', '#818cf8'],
  neon:       ['#e879f9', '#22d3ee', '#4ade80', '#f472b6', '#a855f7', '#06b6d4', '#10b981', '#facc15'],
  vintage:    ['#d97706', '#b45309', '#a16207', '#fbbf24', '#f59e0b', '#92400e', '#facc15', '#78716c'],
  minimalist: ['#94a3b8', '#64748b', '#cbd5e1', '#e2e8f0', '#475569', '#9ca3af', '#a1a1aa', '#d4d4d8'],
  kidsParty:  ['#fde047', '#4ade80', '#3b82f6', '#f472b6', '#a855f7', '#fb923c', '#06b6d4', '#ef4444'],
};

/**
 * Returns confetti functions that launch celebrations.
 * Supports theme-aware colors and multiple confetti patterns.
 *
 * @param {string} [themeId] — optional theme ID for theme-matching colors
 */
export default function useConfetti(themeId) {
  const COLORS = THEME_COLORS[themeId] || DEFAULT_COLORS;

  /** Classic multi-burst celebration — left/right cannons + center shower */
  const fireConfetti = useCallback(() => {
    // Left cannon
    confetti({
      particleCount: 70,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: COLORS,
      zIndex: 9999,
    });

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: COLORS,
        zIndex: 9999,
      });
    }, 150);

    // Center top shower
    setTimeout(() => {
      confetti({
        particleCount: 130,
        spread: 110,
        startVelocity: 45,
        origin: { x: 0.5, y: 0.2 },
        colors: COLORS,
        gravity: 0.9,
        scalar: 1.1,
        zIndex: 9999,
      });
    }, 350);

    // Second wave — left/right
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 80,
        origin: { x: 0.15, y: 0.5 },
        colors: COLORS,
        zIndex: 9999,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 80,
        origin: { x: 0.85, y: 0.5 },
        colors: COLORS,
        zIndex: 9999,
      });
    }, 1200);
  }, [COLORS]);

  /** Firework burst pattern — multiple timed explosions */
  const fireFireworks = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60 + Math.random() * 60,
        spread: 55 + Math.random() * 30,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: COLORS,
        zIndex: 9999,
        startVelocity: 30 + Math.random() * 25,
        gravity: 0.8 + Math.random() * 0.4,
        ticks: 60 + Math.random() * 40,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [COLORS]);

  /** Gentle falling stars pattern */
  const fireStars = useCallback(() => {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.4,
      decay: 0.94,
      startVelocity: 20,
      colors: COLORS,
      zIndex: 9999,
      shapes: ['star'],
      scalar: 1.2,
    };

    confetti({ ...defaults, particleCount: 40, origin: { x: 0.3, y: 0.3 } });
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 35, origin: { x: 0.7, y: 0.25 } });
    }, 400);
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 45, origin: { x: 0.5, y: 0.15 } });
    }, 800);
  }, [COLORS]);

  return { fireConfetti, fireFireworks, fireStars };
}
