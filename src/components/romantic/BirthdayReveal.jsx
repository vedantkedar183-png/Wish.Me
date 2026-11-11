import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';
import useConfetti from '../../hooks/useConfetti';

/** Small heart rain — tiny hearts cascade from the top */
function HeartRain() {
  const hearts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${8 + i * 8}%`,
    delay: `${i * 0.22}s`,
    duration: `${2.5 + (i % 4) * 0.4}s`,
    size: `${1 + (i % 3) * 0.3}rem`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute top-0"
          style={{
            left: h.left,
            fontSize: h.size,
            animation: `floatFinal ${h.duration} ease-in ${h.delay} infinite`,
            opacity: 0,
          }}
        >
          {['⭐', '🌟', '💫', '✨'][h.id % 4]}
        </span>
      ))}
    </div>
  );
}

/**
 * Section 1 — Birthday Reveal
 * Dramatic name + birthday reveal with heart rain and personal message.
 */
export default function BirthdayReveal({ onNext }) {
  const config = useRomanticConfig();
  const { person, reveal } = config;
  const { fireConfetti } = useConfetti();

  useEffect(() => {
    // Small celebratory burst on reveal
    const t = setTimeout(fireConfetti, 700);
    return () => clearTimeout(t);
  }, [fireConfetti]);

  return (
    <div className="romantic-section overflow-hidden">
      <HeartRain />

      {/* Decorative top glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(255,182,193,0.35), transparent)' }}
      />

      <div className="relative z-10 text-center max-w-xl mx-auto px-4 space-y-6">

        {/* Emoji row */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl flex justify-center gap-3"
          aria-hidden="true"
        >
          {['🌟', '🎆', '🎇'].map((e, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.3 }}
            >
              {e}
            </motion.span>
          ))}
        </motion.div>

        {/* Top line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="font-cursive text-xl md:text-2xl text-romantic-muted"
        >
          {reveal.topLine}
        </motion.p>

        {/* Birthday reveal card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.75, type: 'spring', stiffness: 240, damping: 22 }}
          className="glass-card rounded-3xl p-8 md:p-10"
        >
          <p className="text-xs uppercase tracking-widest text-romantic-400 font-medium mb-3">
            ✦ Wishing a very happy birthday to ✦
          </p>

          {/* Name — big, beautiful */}
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-3 leading-none">
            <span className="shimmer-name">{person.name}</span>
          </h2>

          {/* Age + date badges */}
          <div className="flex items-center justify-center gap-3 mb-5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-romantic-100 text-romantic-600 text-sm font-semibold px-4 py-1.5 rounded-full">
              🥳 Turning {person.age}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-pink-50 text-romantic-muted text-sm px-4 py-1.5 rounded-full border border-romantic-100">
              📅 {person.birthdayDate}
            </span>
          </div>

          <p className="font-cursive text-xl md:text-2xl text-romantic-500">
            {reveal.bottomLine}
          </p>
        </motion.div>

        {/* Personal message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="glass-card rounded-2xl p-6 text-left"
        >
          <div className="text-2xl mb-3 text-center" aria-hidden="true">🎇</div>
          <p className="text-romantic-warm/85 leading-relaxed text-sm md:text-base">
            {reveal.birthdayMessage}
          </p>
        </motion.div>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9 }}
        >
          <button onClick={onNext} className="btn-romantic">
            {reveal.continueText} →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
