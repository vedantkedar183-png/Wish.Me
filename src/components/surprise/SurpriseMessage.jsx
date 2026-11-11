import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { OCCASIONS } from '../../utils/themes';

/**
 * Typewriter hook for animated text reveal.
 */
function useTypewriter(text, { speed = 45, delay = 600 } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!text) { setDisplayed(''); setIsDone(true); return; }
    setDisplayed('');
    setIsDone(false);
    let charIndex = 0;
    let intervalId;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        charIndex += 1;
        setDisplayed(text.slice(0, charIndex));
        if (charIndex >= text.length) {
          clearInterval(intervalId);
          setIsDone(true);
        }
      }, speed);
    }, delay);

    return () => { clearTimeout(timeoutId); clearInterval(intervalId); };
  }, [text, speed, delay]);

  return { displayed, isDone };
}

/**
 * Love-letter-styled message card with typewriter effect.
 * Displays the user's custom message in a beautiful animated card.
 * Adapts title and signature to the selected occasion.
 */
export default function SurpriseMessage({ onNext, data, themeObj }) {
  const { message, fromName, name } = data;
  const occasion = OCCASIONS.find(o => o.id === data?.occasion || (o.id === 'justBecause' && data?.occasion === 'just_because')) || OCCASIONS[0];
  const [showButton, setShowButton] = useState(false);

  const displayMessage =
    message || `Wishing you a magical day filled with joy, love, and laughter! Every moment with you is truly special. 🎊`;

  const { displayed, isDone } = useTypewriter(displayMessage, { speed: 30, delay: 1000 });

  useEffect(() => {
    if (isDone) {
      const t = setTimeout(() => setShowButton(true), 800);
      return () => clearTimeout(t);
    }
  }, [isDone]);

  // Occasion-specific title
  const titleMap = {
    birthday: 'A Little Letter 💌',
    anniversary: 'A Love Note 💕',
    friendship: 'A Note From a Friend 🤝',
    justBecause: 'A Special Note 💝',
    just_because: 'A Special Note 💝',
  };

  // Occasion-specific signature line
  const signatureMap = {
    birthday: 'With all my love',
    anniversary: 'Forever yours',
    friendship: 'Your friend forever',
    justBecause: 'With love',
    just_because: 'With love',
  };

  const title = titleMap[data?.occasion] || titleMap.birthday;
  const signaturePrefix = signatureMap[data?.occasion] || signatureMap.birthday;

  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center',
        `bg-gradient-to-br ${themeObj.bgGradient}`,
        themeObj.textColor,
      )}
    >
      <motion.div
        className="relative z-10 w-full max-w-md space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">
            {title}
          </h2>
          <p className="opacity-70 text-sm">
            Just for you, {name || 'someone special'}
          </p>
        </motion.div>

        {/* Letter card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', bounce: 0.3 }}
          className={clsx(
            'rounded-3xl p-6 md:p-8 shadow-2xl',
            themeObj.cardBg,
            'backdrop-blur-xl border border-white/20',
          )}
        >
          {/* Decorative top */}
          <div className="text-3xl mb-4" aria-hidden="true">💌</div>

          {/* Salutation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-left text-sm italic opacity-70 mb-4"
          >
            Dear {name || 'you'},
          </motion.p>

          {/* Typewriter message */}
          <p
            className="text-base md:text-lg leading-relaxed text-left whitespace-pre-wrap min-h-[120px]"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.08)' }}
          >
            {displayed}
            {!isDone && (
              <span
                className="opacity-75 ml-0.5"
                style={{ animation: 'blink 1s step-end infinite' }}
                aria-hidden="true"
              >
                |
              </span>
            )}
          </p>

          {/* Signature */}
          {isDone && fromName && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={clsx(
                'text-right text-sm mt-6 font-medium italic',
                themeObj.accentColor,
              )}
            >
              — {signaturePrefix}, {fromName} ❤️
            </motion.p>
          )}

          {isDone && !fromName && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={clsx(
                'text-right text-sm mt-6 font-medium italic',
                themeObj.accentColor,
              )}
            >
              — {signaturePrefix} ❤️
            </motion.p>
          )}
        </motion.div>

        {/* Decorative emojis */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center gap-2 text-xl"
          aria-hidden="true"
        >
          {themeObj.emojis.slice(0, 5).map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

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
            Almost there — one more surprise! →
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
