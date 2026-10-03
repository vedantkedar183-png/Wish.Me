import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import useConfetti from '../../hooks/useConfetti';

/**
 * Grand finale — the last screen of the birthday surprise.
 * Shows a final birthday wish, replay/share options, and Wishora branding.
 */
export default function SurpriseFinale({ onRestart, onShare, data, themeObj }) {
  const { name, fromName } = data;
  const { fireConfetti, fireFireworks } = useConfetti(data.theme);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    // Grand finale effects
    const t1 = setTimeout(() => fireFireworks(), 400);
    const t2 = setTimeout(() => fireConfetti(), 1000);
    const t3 = setTimeout(() => fireFireworks(), 2000);
    const t4 = setTimeout(() => setShowActions(true), 2500);

    return () => {
      [t1, t2, t3, t4].forEach(clearTimeout);
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
      {/* Sparkle background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 3,
              repeat: Infinity,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 space-y-8 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Pre-text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg opacity-80"
        >
          And most importantly of all…
        </motion.p>

        {/* Big birthday cake */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', bounce: 0.5 }}
        >
          <motion.span
            className="text-8xl md:text-9xl inline-block"
            animate={{ rotate: [-5, 5, -5], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            🎂
          </motion.span>
        </motion.div>

        {/* Final wish */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: 'spring' }}
        >
          <h2
            className="text-4xl md:text-6xl font-bold font-display mb-2"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.25)' }}
          >
            Happy Birthday,
          </h2>
          <h2
            className="text-4xl md:text-6xl font-bold font-cursive"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.25)' }}
          >
            {name || 'Someone Special'}! 🎉
          </h2>
        </motion.div>

        {/* Emotional note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className={clsx(
            'rounded-3xl p-6 shadow-2xl',
            themeObj.cardBg,
            'backdrop-blur-xl border border-white/20',
          )}
        >
          <p className="text-base md:text-lg leading-relaxed">
            Thank you for existing. Thank you for being exactly who you are.
            Thank you for making this world so incredibly, beautifully wonderful. 🌸
          </p>
        </motion.div>

        {/* Bouncing emojis */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex justify-center gap-3 text-3xl"
          aria-hidden="true"
        >
          {['🎂', '🎉', '🎊', '💖', '🥳', '✨'].map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -12, 0] }}
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

        {/* Action buttons */}
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Replay */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className={clsx(
                'w-full px-8 py-4 rounded-full text-base font-bold',
                'bg-white/25 backdrop-blur-md border border-white/30',
                'hover:bg-white/35 transition-all shadow-xl cursor-pointer',
              )}
            >
              🔄 Replay from the Beginning
            </motion.button>

            {/* Share */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              className={clsx(
                'w-full px-8 py-3 rounded-full text-base font-semibold',
                'bg-white/15 backdrop-blur-md border border-white/20',
                'hover:bg-white/25 transition-all shadow-lg cursor-pointer',
              )}
            >
              🔗 Share this Surprise
            </motion.button>
          </motion.div>
        )}

        {/* Wishora branding */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="pt-6"
        >
          <div
            className={clsx(
              'inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full',
              themeObj.cardBg,
              'backdrop-blur-md border border-white/20 text-sm',
            )}
          >
            <span className="opacity-60">Made with</span>
            <span>❤️</span>
            <span className="opacity-60">using</span>
            <a
              href="/"
              className={clsx(
                'font-semibold hover:underline underline-offset-2',
                themeObj.accentColor,
              )}
            >
              Wishora
            </a>
            <span aria-hidden="true">🎂</span>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}
