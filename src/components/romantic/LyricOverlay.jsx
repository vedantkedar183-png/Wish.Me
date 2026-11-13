import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * Floating lyric effect for the romantic story.
 *
 * A single line fades in at the bottom of the screen, holds for a few seconds
 * and is replaced by the next one — like a lyric ticker. Purely decorative:
 * it never blocks taps, is hidden from assistive tech, and pauses when the
 * `visible` prop is false (e.g. on the lock screen or during the game).
 *
 * All text comes from `config.lyrics`, so the lines can be edited freely.
 */
export default function LyricOverlay({ lyrics, visible = true }) {
  const lines = useMemo(
    () =>
      Array.isArray(lyrics?.lines)
        ? lyrics.lines.filter((line) => typeof line === 'string' && line.trim())
        : [],
    [lyrics?.lines],
  );

  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const intervalMs = Number(lyrics?.intervalMs) > 1500 ? Number(lyrics.intervalMs) : 7000;

  useEffect(() => {
    if (!visible || lines.length < 2) return undefined;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % lines.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [visible, lines.length, intervalMs]);

  if (!visible || lyrics?.show === false || lines.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[4.75rem] z-30 flex justify-center px-4"
      aria-hidden="true"
    >
      <div className="relative max-w-[min(26rem,86vw)] rounded-2xl border border-romantic-200/70 bg-white/75 px-4 py-2 text-center shadow-[0_10px_30px_rgba(244,63,120,0.14)] backdrop-blur-md">

        {/* Tiny drifting notes */}
        <span className="lyric-note -left-3 top-0" style={{ animationDelay: '0s' }}>♪</span>
        <span className="lyric-note -right-3 top-1" style={{ animationDelay: '1.4s' }}>♫</span>

        {lyrics?.label && (
          <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-romantic-400">
            {lyrics.label}
          </p>
        )}

        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: 'easeOut' }}
            className="font-cursive text-base leading-snug text-romantic-600 sm:text-lg"
          >
            {lines[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
