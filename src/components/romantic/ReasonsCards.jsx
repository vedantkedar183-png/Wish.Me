import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';

/** A single animated reason card */
function ReasonCard({ card }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 22 }}
      className="glass-card rounded-2xl p-4 md:p-5 flex items-start gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">
        {card.icon}
      </span>
      <p className="text-romantic-warm/85 text-sm md:text-base leading-relaxed">
        {card.text}
      </p>
    </motion.div>
  );
}

/**
 * Section 3 — Reasons You Are Special
 * Cards appear one by one with a timed stagger. After all are shown,
 * the "Continue" button fades in.
 */
export default function ReasonsCards({ onNext }) {
  const config = useRomanticConfig();
  const { reasons } = config;
  const [visibleCount, setVisibleCount] = useState(0);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const cards = reasons?.cards || [];
    const timers = cards.map((_, i) =>
      setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, i * 550 + 600),
    );

    // Show Continue button 900ms after the last card appears
    const continueTimer = setTimeout(
      () => setShowContinue(true),
      cards.length * 550 + 1500,
    );

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(continueTimer);
    };
  }, [reasons]);

  return (
    <div className="romantic-section py-16 justify-start">
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="text-4xl block mb-3" aria-hidden="true">💎</span>
          <h2 className="font-display text-3xl md:text-4xl text-romantic-warm mb-2">
            {reasons.title}
          </h2>
          <p className="font-cursive text-xl text-romantic-muted">
            {reasons.subtitle}
          </p>
        </motion.div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8">
          <AnimatePresence>
            {reasons.cards.slice(0, visibleCount).map((card, i) => (
              <ReasonCard key={i} card={card} />
            ))}
          </AnimatePresence>
        </div>

        {/* Counter */}
        <motion.p
          className="text-center text-xs text-romantic-300 mb-4"
          animate={{ opacity: visibleCount > 0 ? 1 : 0 }}
        >
          {visibleCount} of {reasons.cards.length} reasons revealed…
        </motion.p>

        {/* Continue button */}
        <AnimatePresence>
          {showContinue && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <button onClick={onNext} className="btn-romantic">
                There's more ❤️ →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
