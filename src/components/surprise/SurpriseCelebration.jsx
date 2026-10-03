import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import useConfetti from '../../hooks/useConfetti';

/**
 * Full-screen celebration with massive confetti, bouncing emojis,
 * theme-specific particle effects, and an emotional message.
 */
export default function SurpriseCelebration({ onNext, data, themeObj }) {
  const { name, fromName } = data;
  const { fireConfetti, fireFireworks } = useConfetti(data.theme);
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Burst of effects
    const t1 = setTimeout(() => fireConfetti(), 300);
    const t2 = setTimeout(() => fireFireworks(), 800);
    const t3 = setTimeout(() => fireConfetti(), 1500);
    const t4 = setTimeout(() => setShowContent(true), 600);
    const t5 = setTimeout(() => setShowButton(true), 4000);

    return () => {
      [t1, t2, t3, t4, t5].forEach(clearTimeout);
    };
  }, [fireConfetti, fireFireworks]);

  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center relative overflow-hidden',
        `bg-gradient-to-br ${themeObj.bgGradient}`,
        themeObj.textColor,
      )}
    >
      {/* Massive floating emojis background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...themeObj.emojis, ...themeObj.emojis].map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-4xl md:text-6xl"
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: [0, 0.4, 0],
              y: [-20, -300],
              x: Math.sin(i) * 40,
              rotate: [0, 360],
            }}
            transition={{
              duration: 4 + (i % 3),
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            style={{
              left: `${(i * 6.25) % 100}%`,
              bottom: '-10%',
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {showContent && (
        <motion.div
          className="relative z-10 space-y-8 max-w-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          {/* Party emoji */}
          <motion.div
            animate={{ rotate: [0, -15, 15, -15, 0], scale: [1, 1.2, 1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-7xl md:text-9xl"
            aria-hidden="true"
          >
            🥳
          </motion.div>

          {/* Celebration text */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl font-bold font-display"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.25)' }}
          >
            You Are So Special! 💖
          </motion.h2>

          {/* Emotional message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={clsx(
              'rounded-3xl p-6 md:p-8 shadow-2xl',
              themeObj.cardBg,
              'backdrop-blur-xl border border-white/20',
            )}
          >
            <p className="text-base md:text-lg leading-relaxed">
              {name || 'Someone Special'}, you make this world a more beautiful place
              just by being in it. Today we celebrate <strong>YOU</strong> and everything
              amazing about you! 🌸
            </p>
            <p className="text-sm mt-4 opacity-70">
              May this year bring you more joy, more laughter, more adventures,
              and more love than you ever thought possible. You deserve every
              single bit of it — and so much more. ✨
            </p>
          </motion.div>

          {/* Bouncing emoji row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex justify-center gap-3 text-3xl md:text-4xl"
            aria-hidden="true"
          >
            {themeObj.emojis.slice(0, 6).map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: i * 0.12,
                  ease: 'easeInOut',
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>

          {/* From signature */}
          {fromName && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className={clsx('text-lg italic font-medium', themeObj.accentColor)}
            >
              — With all the love in the world, {fromName} ❤️
            </motion.p>
          )}

          {/* Continue button */}
          {showButton && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className={clsx(
                'px-8 py-3 rounded-full text-base font-semibold',
                'bg-white/20 backdrop-blur-md border border-white/25',
                'hover:bg-white/30 transition-all shadow-xl cursor-pointer',
              )}
            >
              One last thing… →
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
