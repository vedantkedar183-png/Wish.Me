import { motion } from 'framer-motion';
import { clsx } from 'clsx';

/**
 * Welcome screen — the first thing the recipient sees.
 * Dramatic intro with their name and a magical "Open Your Surprise" button.
 * Adapts to the selected occasion (birthday, anniversary, friendship, justBecause).
 */
export default function SurpriseWelcome({ onNext, data, themeObj }) {
  const { name } = data;

  // Occasion-specific content
  const occasionContent = {
    birthday: {
      emoji: '🎂',
      preText: '✨ Someone made something very special just for you ✨',
      subtitle: 'Close your eyes and take a deep breath…',
      button: 'Open Your Surprise 💕',
      subline: 'Something magical is about to begin',
    },
    anniversary: {
      emoji: '💍',
      preText: '✨ A moment crafted with love, just for you ✨',
      subtitle: 'A moment crafted with love…',
      button: 'Celebrate Our Love 💍',
      subline: 'Something beautiful is about to unfold',
    },
    friendship: {
      emoji: '🤝',
      preText: '✨ Something special from a dear friend ✨',
      subtitle: 'Something special from a dear friend…',
      button: 'See What Awaits You 🤝',
      subline: 'A heartfelt surprise is waiting',
    },
    justBecause: {
      emoji: '💝',
      preText: '✨ Someone wanted to make your day brighter ✨',
      subtitle: 'Someone wanted to make your day…',
      button: 'Unwrap Your Surprise 💝',
      subline: 'Something wonderful is about to happen',
    },
    just_because: {
      emoji: '💝',
      preText: '✨ Someone wanted to make your day brighter ✨',
      subtitle: 'Someone wanted to make your day…',
      button: 'Unwrap Your Surprise 💝',
      subline: 'Something wonderful is about to happen',
    },
  };

  const content = occasionContent[data?.occasion] || occasionContent.birthday;

  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col items-center justify-center px-6 text-center',
        `bg-gradient-to-br ${themeObj.bgGradient}`,
        themeObj.textColor,
      )}
    >
      {/* Floating decorative emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {themeObj.emojis.slice(0, 8).map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl md:text-3xl opacity-20"
            style={{
              left: `${(i * 13 + 5) % 90}%`,
              top: `${(i * 17 + 8) % 85}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, i % 2 === 0 ? 15 : -15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + (i % 3) * 0.8,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Sparkle pre-text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-sm md:text-base opacity-80 tracking-wide"
        >
          {content.preText}
        </motion.p>

        {/* Animated occasion emoji */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 15 }}
          className="text-7xl md:text-9xl"
          aria-hidden="true"
        >
          {content.emoji}
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-3xl md:text-5xl font-bold font-display leading-snug"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}
        >
          Hey {name || 'Someone Special'}! 💕
          <br />
          <span className="text-xl md:text-3xl opacity-80 font-normal">
            {content.subtitle}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-base md:text-lg opacity-70 max-w-md mx-auto"
        >
          {content.subline}
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, type: 'spring' }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className={clsx(
            'mt-8 px-10 py-4 rounded-full text-lg font-bold',
            'bg-white/25 backdrop-blur-md border border-white/30',
            'hover:bg-white/35 transition-all shadow-2xl',
            'cursor-pointer select-none',
          )}
          style={{ textShadow: '0 1px 8px rgba(0,0,0,0.1)' }}
        >
          {content.button}
        </motion.button>

        {/* Bouncing arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5, y: [0, 8, 0] }}
          transition={{ delay: 3, duration: 1.5, repeat: Infinity }}
          className="text-2xl mt-4"
          aria-hidden="true"
        >
          ↓
        </motion.div>
      </motion.div>
    </div>
  );
}
