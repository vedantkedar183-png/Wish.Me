import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { surpriseConfig } from '../../data/surpriseConfig';
import useConfetti from '../../hooks/useConfetti';

const { final, person } = surpriseConfig;

/** Massive confetti explosion — multiple bursts with delay */
function useCelebrationConfetti(fire) {
  useEffect(() => {
    const delays = [300, 700, 1200, 2200];
    const timers = delays.map((d) => setTimeout(fire, d));
    return () => timers.forEach(clearTimeout);
  }, [fire]);
}

/** Floating celebration hearts fixed across the screen */
function FloatingHeartField() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        symbol: ['❤️', '💕', '🩷', '🌸', '✨', '💗'][i % 6],
        left: `${(i * 4.2) % 98}%`,
        delay: `${(i * 0.35) % 8}s`,
        duration: `${7 + (i % 5)}s`,
        size: `${0.9 + (i % 4) * 0.25}rem`,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-20" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-0"
          style={{
            left: h.left,
            fontSize: h.size,
            animation: `floatFinal ${h.duration} ease-in ${h.delay} infinite`,
            opacity: 0,
          }}
        >
          {h.symbol}
        </span>
      ))}
    </div>
  );
}

/**
 * Section 5 — Final Birthday Surprise
 * The grand finale: massive confetti, floating hearts, shimmer name,
 * emotional message, and a Replay button.
 */
export default function FinalSurprise({ onRestart }) {
  const fireConfetti = useConfetti();
  useCelebrationConfetti(fireConfetti);

  return (
    <div
      className="romantic-section overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #ffe4ef 0%, #fce4ec 35%, #fff5f7 65%, #ffd6e7 100%)',
      }}
    >
      <FloatingHeartField />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,107,157,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-30 text-center max-w-xl mx-auto px-4 space-y-5">

        {/* Pre-text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-cursive text-xl md:text-2xl text-romantic-muted"
        >
          {final.preText}
        </motion.p>

        {/* Animated cake */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
          aria-hidden="true"
        >
          <motion.span
            className="text-6xl md:text-8xl inline-block"
            animate={{ rotate: [-5, 5, -5], scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            🎂
          </motion.span>
        </motion.div>

        {/* Main wish */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
        >
          <h1 className="font-display text-4xl md:text-6xl font-bold text-romantic-warm leading-tight">
            {final.mainWish}
          </h1>
          <h2
            className="font-display text-5xl md:text-7xl font-black mt-1 shimmer-name"
            aria-label={final.nameWish}
          >
            {final.nameWish}
          </h2>
        </motion.div>

        {/* Age badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3 }}
        >
          <span className="inline-block bg-white/70 backdrop-blur-sm border border-romantic-200 text-romantic-600 font-semibold px-5 py-2 rounded-full text-sm md:text-base shadow-md">
            {final.ageText}
          </span>
        </motion.div>

        {/* Emoji celebration row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex justify-center gap-3 text-3xl"
          aria-hidden="true"
        >
          {['🎉', '🎊', '🥳', '🎈', '✨', '🎁'].map((e, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -14, 0], rotate: [0, i % 2 === 0 ? 10 : -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 + i * 0.15, delay: i * 0.2 }}
            >
              {e}
            </motion.span>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.9 }}
          className="flex items-center justify-center gap-3"
          aria-hidden="true"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-romantic-200 max-w-[80px]" />
          <span className="text-romantic-300">❤️</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-romantic-200 max-w-[80px]" />
        </motion.div>

        {/* Main message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.7 }}
          className="glass-card rounded-3xl p-6 md:p-8"
        >
          <p className="text-romantic-warm/85 leading-relaxed text-sm md:text-base mb-4">
            {final.message}
          </p>
          <p className="font-cursive text-lg md:text-xl text-romantic-500">
            {final.emotionalNote}
          </p>
        </motion.div>

        {/* Signature */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.7 }}
          className="font-cursive text-xl text-romantic-muted"
        >
          — From {person.yourName}, with all my love ❤️
        </motion.p>

        {/* Replay button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.1 }}
          className="pb-8"
        >
          <button
            onClick={onRestart}
            className="btn-romantic"
            style={{ background: 'linear-gradient(135deg, #e63946, #ff6b9d)' }}
          >
            {final.replayText}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
