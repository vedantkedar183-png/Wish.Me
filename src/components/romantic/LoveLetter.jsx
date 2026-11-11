import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';

// ─── Typewriter hook ──────────────────────────────────────────────────────────
/**
 * Reveals paragraphs one by one, character by character.
 * After each paragraph finishes typing, waits 700ms then moves to the next.
 */
function useLetterReveal(paragraphs, charDelay = 18) {
  const [revealed, setRevealed] = useState([]);   // fully typed paragraphs
  const [current, setCurrent] = useState('');       // paragraph currently typing
  const [paraIndex, setParaIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!paragraphs || paragraphs.length === 0) return;
    if (paraIndex >= paragraphs.length) {
      setDone(true);
      return;
    }

    const fullText = paragraphs[paraIndex];
    let i = 0;

    const interval = setInterval(() => {
      i += 1;
      setCurrent(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => {
          setRevealed((prev) => [...prev, fullText]);
          setCurrent('');
          setParaIndex((prev) => prev + 1);
        }, 700);
      }
    }, charDelay);

    return () => clearInterval(interval);
  }, [paraIndex, paragraphs, charDelay]);

  return { revealed, current, done };
}

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * Section 4 — Love Letter
 * Paragraphs are revealed one by one via typewriter effect on a lined paper card.
 */
export default function LoveLetter({ onNext }) {
  const config = useRomanticConfig();
  const { letter, person } = config;
  const [started, setStarted] = useState(false);
  const { revealed, current, done } = useLetterReveal(
    started ? letter.paragraphs : [],
    20,
  );

  // Auto-start the letter after a short entrance delay
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="romantic-section py-16 justify-start">
      <div className="relative z-10 w-full max-w-xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-7"
        >
          <motion.span
            className="text-5xl block mb-3"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            📝
          </motion.span>
          <h2 className="font-display text-3xl md:text-4xl text-romantic-warm mb-1">
            {letter.title}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2" aria-hidden="true">
            <span className="text-romantic-200">—</span>
            <span className="text-romantic-300 text-sm">a letter written just for you</span>
            <span className="text-romantic-200">—</span>
          </div>
        </motion.div>

        {/* Letter paper card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="letter-paper rounded-2xl p-6 md:p-8 shadow-xl border border-romantic-100 relative overflow-hidden"
        >
          {/* Corner heart decorations */}
          <span aria-hidden="true" className="absolute top-3 right-4 text-romantic-200 text-2xl opacity-60">🪶</span>
          <span aria-hidden="true" className="absolute bottom-3 left-4 text-romantic-200 text-2xl opacity-40">⭐</span>

          {/* Salutation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="font-cursive text-2xl text-romantic-500 mb-4"
          >
            {letter.salutation}
          </motion.p>

          {/* Revealed paragraphs (fully typed) */}
          {revealed.map((para, i) => (
            <p
              key={i}
              className="text-romantic-warm/80 leading-8 mb-4 text-sm md:text-base"
              style={{ animation: 'fadeInUp 0.4s ease both' }}
            >
              {para}
            </p>
          ))}

          {/* Currently typing paragraph */}
          {current && (
            <p className="text-romantic-warm/80 leading-8 mb-4 text-sm md:text-base">
              {current}
              <span className="typewriter-cursor" aria-hidden="true" />
            </p>
          )}

          {/* Closing + signature — show only when done */}
          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-5 pt-4 border-t border-romantic-100"
              >
                <p className="font-cursive text-xl text-romantic-muted mb-1">
                  {letter.closing}
                </p>
                <p className="font-cursive text-2xl text-romantic-500">
                  {person.yourName} — {letter.signature}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wax seal / envelope emoji */}
          {done && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="flex justify-center mt-5"
              aria-hidden="true"
            >
              <span className="text-4xl">🕊️</span>
            </motion.div>
          )}
        </motion.div>

        {/* Continue — appears after letter is fully revealed */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-8"
            >
              <button onClick={onNext} className="btn-romantic">
                One last thing… ✨
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
