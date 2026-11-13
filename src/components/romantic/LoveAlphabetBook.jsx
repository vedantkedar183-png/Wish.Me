import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';
import useConfetti from '../../hooks/useConfetti';
import LOVE_ALPHABET from '../../data/loveAlphabet';

/**
 * Section 10 — The A to Z of You
 *
 * A little keepsake book: one page for every letter, each with a single word
 * and a line of love. Pages turn with the arrows (or swipe / arrow keys), the
 * letter rail jumps anywhere, and the last page unlocks a closing note.
 *
 * All copy lives in `config.alphabet`.
 */

const pageVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction >= 0 ? 56 : -56,
    rotateY: direction >= 0 ? -10 : 10,
  }),
  center: {
    opacity: 1,
    x: 0,
    rotateY: 0,
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction >= 0 ? -56 : 56,
    rotateY: direction >= 0 ? 10 : -10,
  }),
};

export default function LoveAlphabetBook({ onNext }) {
  const config = useRomanticConfig();
  const book = config.alphabet || {};

  const letters = useMemo(() => {
    const source =
      Array.isArray(book.letters) && book.letters.length > 0
        ? book.letters
        : LOVE_ALPHABET;
    return source.filter((entry) => entry && entry.letter);
  }, [book.letters]);

  const total = letters.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [celebrated, setCelebrated] = useState(false);
  const [sealPops, setSealPops] = useState(0);

  const shouldReduceMotion = useReducedMotion();
  const { fireConfetti } = useConfetti('romantic');

  const entry = letters[index] || {
    letter: '?',
    symbol: '\ud83d\udc96',
    word: '',
    message: '',
  };
  const isLast = index >= total - 1;

  const go = useCallback(
    (nextIndex) => {
      if (nextIndex < 0 || nextIndex >= total) return;
      if (nextIndex === index) return;
      setDirection(nextIndex > index ? 1 : -1);
      setIndex(nextIndex);
    },
    [index, total],
  );

  // Arrow keys turn the page too.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(index + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(index - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [go, index]);

  // Clear the seal's little heart burst when the page changes.
  useEffect(() => {
    setSealPops(0);
  }, [index]);

  // A little celebration when the reader reaches Z.
  useEffect(() => {
    if (!isLast || celebrated) return;
    setCelebrated(true);
    if (!shouldReduceMotion) fireConfetti();
  }, [isLast, celebrated, shouldReduceMotion, fireConfetti]);

  if (total === 0) return null;

  const progress = ((index + 1) / total) * 100;

  return (
    <div className="romantic-section py-16 justify-start">
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <span className="text-4xl block mb-2" aria-hidden="true">📖</span>
          <h2 className="font-display text-3xl md:text-4xl text-romantic-warm mb-2">
            {book.title || 'The A to Z of You'}
          </h2>
          <p className="font-cursive text-xl text-romantic-muted">
            {book.subtitle || 'Twenty-six little reasons, one for every letter'}
          </p>
        </motion.div>

        {/* One line, just for her */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="alphabet-dedication mx-auto mb-6 mt-4 max-w-xl text-center font-elegant text-base italic leading-relaxed text-romantic-warm/75 sm:text-lg"
        >
          &ldquo;
          {book.dedication ||
            'Of all the stories ever told, my favourite is ours \u2014 the one where you walked in and my world quietly became home.'}
          &rdquo;
        </motion.p>

        {/* ── The book ─────────────────────────────────────────────── */}
        <div className="relative" style={{ perspective: 1400 }}>
          <div className="alphabet-book relative overflow-hidden rounded-[1.75rem] border border-romantic-200/80 shadow-[0_26px_60px_rgba(122,26,48,0.22)]">
            <span className="alphabet-spine hidden sm:block" aria-hidden="true" />

            {/* Lazy little hearts drifting through the book */}
            <span className="alphabet-drift left-[7%] top-[24%] text-base" aria-hidden="true">&#9825;</span>
            <span className="alphabet-drift right-[9%] top-[38%] text-xs" style={{ animationDelay: '2.4s' }} aria-hidden="true">&#9825;</span>
            <span className="alphabet-drift left-[14%] bottom-[18%] text-[10px]" style={{ animationDelay: '4.8s' }} aria-hidden="true">&#9825;</span>

            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={entry.letter}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }
                }
                drag={shouldReduceMotion ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) go(index + 1);
                  else if (info.offset.x > 70) go(index - 1);
                }}
                className="alphabet-spread grid cursor-grab active:cursor-grabbing sm:grid-cols-2"
              >
                {/* Light sweep across the page on every turn */}
                <span className="alphabet-shine" aria-hidden="true" />

                {/* Left page — the letter */}
                <div className="alphabet-page alphabet-page-left relative flex min-h-[270px] flex-col items-center justify-center px-6 py-10 sm:min-h-[360px]">
                  <span className="alphabet-ribbon" aria-hidden="true" />

                  <p className="font-cursive text-[11px] uppercase tracking-[0.3em] text-romantic-400">
                    {book.bookLabel || 'a little book of us'}
                  </p>

                  <span className="alphabet-letter font-display" aria-hidden="true">
                    {entry.letter}
                  </span>

                  <p className="mt-1 font-script text-3xl text-romantic-600 sm:text-4xl">
                    {entry.word}
                  </p>

                  <span className="alphabet-flourish mt-4" aria-hidden="true">
                    {entry.symbol}
                  </span>

                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-romantic-muted/80">
                    {book.letterLabel || 'Letter'} {entry.letter} · {(index + 1).toString().padStart(2, '0')}
                  </p>
                </div>

                {/* Right page — the message */}
                <div className="alphabet-page alphabet-page-right relative flex min-h-[240px] flex-col justify-center px-6 py-10 sm:min-h-[360px] sm:border-l sm:border-dashed sm:border-romantic-200/80">
                  <div className="alphabet-seal-wrap">
                    <button
                      type="button"
                      onClick={() => setSealPops((pops) => pops + 1)}
                      className="alphabet-symbol"
                      aria-label={`Send a little love for letter ${entry.letter}`}
                    >
                      <span aria-hidden="true">{entry.symbol}</span>
                    </button>

                    {sealPops > 0 &&
                      [0, 1, 2].map((pop) => (
                        <span
                          key={`${entry.letter}-${sealPops}-${pop}`}
                          className="alphabet-pop-heart"
                          style={{ '--dx': `${(pop - 1) * 18}px`, animationDelay: `${pop * 0.07}s` }}
                          aria-hidden="true"
                        >
                          &#10084;
                        </span>
                      ))}
                  </div>

                  <p className="mt-4 font-elegant text-xl italic leading-relaxed text-romantic-warm/90 sm:text-2xl">
                    {entry.message}
                  </p>

                  <p className="mt-6 font-cursive text-lg text-romantic-400">
                    {book.signature || 'with love, always'}
                  </p>

                  <span className="alphabet-page-number">
                    {(index + 1).toString().padStart(2, '0')} / {total.toString().padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Screen-reader page announcement */}
          <p className="sr-only" aria-live="polite">
            {`Letter ${entry.letter}: ${entry.word}. ${entry.message}`}
          </p>
        </div>

        {/* ── Page controls ────────────────────────────────────────── */}
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label={book.prevLabel || 'Previous letter'}
            className="alphabet-nav disabled:opacity-30 disabled:cursor-default"
          >
            {'\u2190'}
          </button>

          <div className="min-w-[116px] text-center">
            <p className="font-cursive text-base text-romantic-600">
              {book.letterLabel || 'Letter'} {entry.letter}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-romantic-muted tabular-nums">
              {index + 1} {book.ofLabel || 'of'} {total}
            </p>
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={isLast}
            aria-label={book.nextLabel || 'Next letter'}
            className="alphabet-nav disabled:opacity-30 disabled:cursor-default"
          >
            {'\u2192'}
          </button>
        </div>

        {/* Progress */}
        <div className="mx-auto mt-3 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-romantic-200/60">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #ffb3c6, #f43f78, #c0294f)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* ── A–Z rail ─────────────────────────────────────────────── */}
        <div
          className="mx-auto mt-5 flex max-w-md flex-wrap justify-center gap-1.5"
          role="tablist"
          aria-label="Jump to a letter"
        >
          {letters.map((item, itemIndex) => (
            <button
              key={item.letter}
              type="button"
              role="tab"
              aria-selected={itemIndex === index}
              aria-label={`Read letter ${item.letter}`}
              onClick={() => go(itemIndex)}
              className={`alphabet-chip ${itemIndex === index ? 'is-active' : ''}`}
            >
              {item.letter}
            </button>
          ))}
        </div>

        {/* ── Closing note on Z ────────────────────────────────────── */}
        <AnimatePresence>
          {isLast && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 20 }}
              className="glass-card mx-auto mt-6 max-w-lg rounded-3xl p-5 text-center"
            >
              <p className="text-2xl" aria-hidden="true">💞</p>
              <p className="mt-1 font-display text-xl text-romantic-warm">
                {book.closingTitle || 'You are my whole alphabet'}
              </p>
              <p className="mt-1 font-cursive text-lg leading-snug text-romantic-500">
                {book.closingMessage ||
                  'Twenty-six letters, and every one of them spells you. I would read this book a hundred times and still find something new to love.'}
              </p>
              <button type="button" onClick={onNext} className="btn-romantic mt-4">
                {book.continueText || 'Keep going \u2764\ufe0f \u2192'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!isLast && (
          <p className="mt-3 text-center text-[11px] text-romantic-muted/80">
            {book.hint || 'Turn the page, swipe, or tap a letter to begin anywhere'}
          </p>
        )}
      </div>
    </div>
  );
}
