import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import useConfetti from '../../hooks/useConfetti';

/**
 * Birthday Reveal — Big animated "Happy Birthday!" with confetti burst.
 * Shows the birthday person's name with a typewriter effect and fireworks.
 */
export default function SurpriseReveal({ onNext, data, themeObj }) {
  const { name } = data;
  const { fireConfetti, fireFireworks } = useConfetti(data.theme);
  const [showName, setShowName] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Fire confetti on mount
    const t1 = setTimeout(() => fireConfetti(), 600);
    const t2 = setTimeout(() => fireFireworks(), 1200);
    const t3 = setTimeout(() => setShowName(true), 800);
    const t4 = setTimeout(() => setShowButton(true), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [fireConfetti, fireFireworks]);

  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden',
        `bg-gradient-to-br ${themeObj.bgGradient}`,
        themeObj.textColor,
      )}
    >
      {/* Floating emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {themeObj.emojis.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl md:text-5xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0.5, 1.2, 0.5],
              y: [0, -80, -160],
              x: [0, (i % 2 === 0 ? 30 : -30)],
            }}
            transition={{
              duration: 3,
              delay: 0.8 + i * 0.3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            style={{
              left: `${(i * 12.5) % 100}%`,
              bottom: '10%',
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* Main reveal */}
      <motion.div className="relative z-10 space-y-8">
        {/* Cake with glow */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="relative inline-block"
        >
          <motion.div
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="text-7xl md:text-9xl"
            aria-hidden="true"
          >
            🎂
          </motion.div>
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                `0 0 30px 10px ${themeObj.glowColorHex}44`,
                `0 0 60px 20px ${themeObj.glowColorHex}66`,
                `0 0 30px 10px ${themeObj.glowColorHex}44`,
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>

        {/* Happy Birthday text */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', bounce: 0.4 }}
          className="text-4xl md:text-7xl font-bold font-display"
          style={{ textShadow: '0 4px 30px rgba(0,0,0,0.25)' }}
        >
          Happy Birthday! 🎉
        </motion.h1>

        {/* Name reveal */}
        {showName && (
          <motion.h2
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="text-3xl md:text-6xl font-bold font-cursive"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}
          >
            {name || 'Someone Special'} 💖
          </motion.h2>
        )}

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-lg md:text-xl opacity-80 max-w-md mx-auto leading-relaxed"
        >
          Today is the most wonderful day of the year,
          <br />
          because the world got <strong>YOU</strong> in it. ✨
        </motion.p>

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
            There's more waiting for you →
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
