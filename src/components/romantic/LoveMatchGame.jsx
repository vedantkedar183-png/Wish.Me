import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';
import useConfetti from '../../hooks/useConfetti';

/**
 * Section 5 — A Little Game of Love
 *
 * A classic memory-matching game wrapped in the story: every emoji in
 * `config.game.emojis` becomes a pair. Matching all pairs fires confetti and
 * unlocks the last chapter. Purely client-side and keyboard accessible.
 */

const DEFAULT_EMOJIS = ['💖', '🌹', '🦋', '🎀', '🍓', '🌙', '⭐', '🧸'];

/** Build a shuffled deck where every emoji appears exactly twice. */
function buildDeck(emojis) {
  const cards = emojis.flatMap((emoji, pair) => [
    { id: `${pair}-a`, emoji },
    { id: `${pair}-b`, emoji },
  ]);

  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

export default function LoveMatchGame({ onNext }) {
  const config = useRomanticConfig();
  const game = config.game || {};

  const emojis = useMemo(
    () =>
      Array.isArray(game.emojis) && game.emojis.length > 0
        ? game.emojis
        : DEFAULT_EMOJIS,
    [game.emojis],
  );

  const [deck, setDeck] = useState(() => buildDeck(emojis));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(() => new Set());
  const [moves, setMoves] = useState(0);
  const [resolving, setResolving] = useState(false);
  const [won, setWon] = useState(false);

  const flipTimer = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { fireConfetti } = useConfetti('romantic');

  // Clear a pending "flip back" timer if the chapter is left mid-turn.
  useEffect(() => () => clearTimeout(flipTimer.current), []);

  // Celebration once every pair is matched.
  useEffect(() => {
    if (won || deck.length === 0) return;
    if (matched.size === deck.length) {
      setWon(true);
      if (!shouldReduceMotion) fireConfetti();
    }
  }, [matched, deck.length, won, fireConfetti, shouldReduceMotion]);

  const resetGame = useCallback(() => {
    clearTimeout(flipTimer.current);
    setDeck(buildDeck(emojis));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setResolving(false);
    setWon(false);
  }, [emojis]);

  const flipCard = (index) => {
    if (won || resolving) return;

    const card = deck[index];
    if (!card || flipped.includes(index) || matched.has(card.id)) return;

    const next = [...flipped, index];
    setFlipped(next);

    if (next.length < 2) return;

    setMoves((count) => count + 1);

    const [firstIndex, secondIndex] = next;
    const isPair = deck[firstIndex].emoji === deck[secondIndex].emoji;

    if (isPair) {
      setMatched((previous) => {
        const updated = new Set(previous);
        updated.add(deck[firstIndex].id);
        updated.add(deck[secondIndex].id);
        return updated;
      });
      setFlipped([]);
      return;
    }

    // Not a pair — hold both faces for a moment, then turn them back.
    setResolving(true);
    flipTimer.current = setTimeout(() => {
      setFlipped([]);
      setResolving(false);
    }, 780);
  };

  const totalPairs = deck.length / 2;
  const foundPairs = matched.size / 2;
  const movesLabel = game.movesLabel || 'moves';
  const pairsLabel = game.pairsLabel || 'pairs';

  return (
    <div className="romantic-section py-16 justify-start">
      <div className="relative z-10 w-full max-w-lg mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="text-4xl block mb-3" aria-hidden="true">
            {game.emoji || '🫶'}
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-romantic-warm mb-2">
            {game.title || 'A Little Game of Love'}
          </h2>
          <p className="font-cursive text-xl text-romantic-muted">
            {game.subtitle || 'Find every matching pair — two hearts that always find each other 🫶'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!won ? (
            <motion.div
              key="game-board"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              {/* Live score */}
              <div className="mb-4 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-romantic-muted">
                <span>💞 {foundPairs}/{totalPairs} {pairsLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{moves} {movesLabel}</span>
              </div>

              {/* Card grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3" role="group" aria-label="Memory match board">
                {deck.map((card, index) => {
                  const isMatched = matched.has(card.id);
                  const isFlipped = isMatched || flipped.includes(index);
                  const label = isMatched
                    ? `${card.emoji}, matched pair`
                    : isFlipped
                      ? `${card.emoji}, revealed`
                      : `Card ${index + 1}, face down`;

                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => flipCard(index)}
                      aria-label={label}
                      aria-pressed={isFlipped}
                      className={`memory-card aspect-square rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-romantic-500 focus-visible:ring-offset-2 ${isFlipped ? 'is-flipped' : ''} ${isMatched ? 'is-matched' : ''}`}
                    >
                      <span className="memory-card-inner">
                        <span className="memory-face memory-face-front" aria-hidden="true">
                          ♥
                        </span>
                        <span className="memory-face memory-face-back" aria-hidden="true">
                          {card.emoji}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-center text-[11px] text-romantic-muted/80">
                {game.hint || 'Tap two cards. Matching pairs stay open.'}
              </p>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={onNext}
                  className="text-[11px] font-semibold text-romantic-muted underline decoration-dotted underline-offset-4 hover:text-romantic-500 transition-colors"
                >
                  {game.skipText || 'Skip for now →'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="game-won"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 22, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 20 }}
              className="glass-card rounded-3xl p-6 text-center"
            >
              <span className="text-5xl block" aria-hidden="true">💞</span>
              <h3 className="mt-2 font-display text-2xl text-romantic-warm">
                {game.winTitle || 'Perfect match!'}
              </h3>
              <p className="mt-1 font-cursive text-xl text-romantic-500">
                {game.winMessage || 'Every card found its other half — just like I found you. 💞'}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-romantic-muted">
                {totalPairs} {pairsLabel} · {moves} {movesLabel}
              </p>

              <div className="mt-5 flex flex-col items-center gap-2">
                <button type="button" onClick={onNext} className="btn-romantic">
                  {game.continueText || 'One last chapter 💌 →'}
                </button>
                <button
                  type="button"
                  onClick={resetGame}
                  className="text-xs font-semibold text-romantic-500 underline decoration-dotted underline-offset-4 hover:text-romantic-600 transition-colors"
                >
                  {game.retryText || 'Play again 🔄'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
