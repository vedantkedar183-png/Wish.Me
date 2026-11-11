import { motion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';

// Sparkle positions
const SPARKLES = [
  { top: '12%', left: '8%',  delay: 0    },
  { top: '18%', right: '10%', delay: 0.6 },
  { top: '72%', left: '5%',  delay: 1.2  },
  { top: '78%', right: '7%', delay: 0.3  },
  { top: '45%', left: '3%',  delay: 0.9  },
  { top: '35%', right: '4%', delay: 1.5  },
];

function Sparkle({ style, delay }) {
  return (
    <span
      aria-hidden="true"
      className="absolute text-pink-300 text-lg pointer-events-none select-none"
      style={{
        ...style,
        animation: `twinkle ${2 + delay}s ease-in-out ${delay}s infinite`,
      }}
    >
      ✦
    </span>
  );
}

/**
 * Section 0 — Welcome Screen
 * First thing the recipient sees. Dreamy, romantic, full-screen.
 */
export default function WelcomeScreen({ onNext }) {
  const config = useRomanticConfig();
  const { welcome } = config;

  return (
    <div className="romantic-section overflow-hidden">

      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ffb3c6, transparent)' }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ffd6e7, transparent)' }}
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ff80a0, transparent)' }}
      />

      {/* Sparkles */}
      {SPARKLES.map((s, i) => (
        <Sparkle key={i} style={{ top: s.top, left: s.left, right: s.right }} delay={s.delay} />
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center max-w-lg mx-auto px-4">

        {/* Animated heart */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mb-6"
        >
          <span
            className="text-7xl md:text-8xl inline-block"
            style={{ animation: 'heartbeat 2.2s ease-in-out infinite' }}
            aria-hidden="true"
          >
            🔮
          </span>
        </motion.div>

        {/* Pre-message */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="text-xs md:text-sm font-medium text-romantic-400 tracking-widest uppercase mb-6 leading-relaxed"
        >
          {welcome.preMessage}
        </motion.p>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="font-display text-3xl md:text-4xl lg:text-5xl text-romantic-warm leading-snug mb-5 whitespace-pre-line"
        >
          {welcome.mainTitle}
        </motion.h1>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-5"
          aria-hidden="true"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-romantic-300" />
          <span className="text-romantic-300 text-lg">🪄</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-romantic-300" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="font-cursive text-2xl md:text-3xl text-romantic-muted mb-10"
        >
          {welcome.subtitle}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.7, type: 'spring', stiffness: 260, damping: 20 }}
        >
          <button
            onClick={onNext}
            className="btn-romantic text-base md:text-lg"
            aria-label="Open your birthday surprise"
          >
            {welcome.buttonText}
          </button>
        </motion.div>

        {/* Flower row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1 }}
          className="mt-10 flex justify-center gap-4 text-2xl"
          aria-hidden="true"
        >
          {['✨', '🌙', '🔮', '🪄', '🦋'].map((f, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.3, ease: 'easeInOut' }}
            >
              {f}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
