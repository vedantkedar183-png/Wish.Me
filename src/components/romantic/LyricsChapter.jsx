import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';

/**
 * Section 6 — Our Song (lyrics chapter)
 *
 * A full-screen, cinematic black stage for the lyric lines. One line at a
 * time in a large, readable serif; auto-advances every few seconds, and can
 * be stepped manually (tap the words or use the arrows) or paused.
 *
 * The lines live in `config.lyrics.lines` (src/data/surpriseConfig.js), so the
 * text is fully editable. Nothing here blocks the story — a Continue button
 * is always available at the bottom.
 */
export default function LyricsChapter({ onNext }) {
  const config = useRomanticConfig();
  const lyrics = config.lyrics || {};

  const lines = useMemo(
    () =>
      Array.isArray(lyrics.lines)
        ? lyrics.lines.filter((line) => typeof line === 'string' && line.trim())
        : [],
    [lyrics.lines],
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const intervalMs = Number(lyrics.intervalMs) > 1500 ? Number(lyrics.intervalMs) : 6000;

  // Auto-advance the lyric, unless the reader paused it.
  useEffect(() => {
    if (paused || lines.length < 2) return undefined;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % lines.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [paused, lines.length, intervalMs]);

  if (lines.length === 0) return null;

  const total = lines.length;
  const step = (delta) => setIndex((current) => (current + delta + total) % total);

  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[#08060c] px-6 pb-28 pt-24 text-center">

      {/* ── Ambient stage lighting ─────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute -top-32 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-fuchsia-600/25 blur-[110px]" />
        <span className="absolute -bottom-40 -right-20 h-[22rem] w-[22rem] rounded-full bg-rose-600/20 blur-[120px]" />
        <span className="absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-indigo-600/20 blur-[100px]" />
        <span className="lyric-note left-[12%] top-[22%] text-base" style={{ animationDelay: '0.2s' }}>♪</span>
        <span className="lyric-note right-[14%] top-[30%] text-lg" style={{ animationDelay: '1.6s' }}>♫</span>
        <span className="lyric-note left-[18%] bottom-[26%] text-sm" style={{ animationDelay: '2.4s' }}>♩</span>
        <span className="lyric-note right-[20%] bottom-[20%] text-base" style={{ animationDelay: '3.1s' }}>♪</span>
      </div>

      {/* ── Song title ─────────────────────────────────────────────── */}
      <p className="relative text-[10px] font-semibold uppercase tracking-[0.32em] text-rose-300/70">
        {lyrics.subtitle || 'our little song'}
      </p>
      <h2 className="relative mt-2 font-cute text-3xl text-white sm:text-4xl">
        {lyrics.title || 'Love Me Like You Do'}
      </h2>

      {/* ── The line ───────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="Show the next lyric line"
        className="relative mt-10 flex min-h-[11rem] w-full max-w-2xl items-center justify-center rounded-3xl px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -16, filter: 'blur(6px)' }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: 'easeOut' }}
            className="block font-elegant text-[1.6rem] italic leading-snug text-rose-50 sm:text-3xl md:text-4xl"
          >
            {lines[index]}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* ── Controls ───────────────────────────────────────────────── */}
      <div className="relative mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous lyric line"
          className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          ‹
        </button>

        <div className="flex items-center gap-1.5" aria-hidden="true">
          {lines.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-5 bg-rose-300' : 'w-1.5 bg-white/25'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next lyric line"
          className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          ›
        </button>

        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? 'Resume lyric rotation' : 'Pause lyric rotation'}
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          {paused ? '▶' : '⏸'}
        </button>
      </div>

      <p className="relative mt-3 text-[10px] font-medium uppercase tracking-[0.24em] text-white/35 tabular-nums">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        <span className="mx-2">·</span>
        {lyrics.hint || 'Tap the words for the next line'}
      </p>

      {/* ── Back to the story ──────────────────────────────────────── */}
      <button
        type="button"
        onClick={onNext}
        className="relative mt-9 rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
      >
        {lyrics.continueText || 'Continue our story →'}
      </button>

      {/* Screen-reader-only live line */}
      <p className="sr-only" aria-live="polite">
        {`Line ${index + 1} of ${total}: ${lines[index]}`}
      </p>
    </section>
  );
}
