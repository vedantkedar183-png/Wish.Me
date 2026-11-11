import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';

/**
 * Section 0 — Lock-screen notification intro.
 *
 * The recipient lands on what looks like their phone lock screen. A single
 * notification from the sender is waiting. Tapping it "unlocks" the phone and
 * the story begins — the same hook format that performs well on Instagram.
 */
export default function LockScreen({ onNext }) {
  const { person } = useRomanticConfig();
  const shouldReduceMotion = useReducedMotion();
  const [now, setNow] = useState(() => new Date());
  const [unlocking, setUnlocking] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const unlock = () => {
    if (unlocking) return;
    setUnlocking(true);
    timerRef.current = setTimeout(onNext, shouldReduceMotion ? 250 : 850);
  };

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const screen = (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden sm:p-6"
      style={{
        background:
          'radial-gradient(ellipse at 20% 0%, #4b1d3a 0%, #1c1024 55%, #120a1a 100%)',
      }}
    >
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
        animate={
          unlocking
            ? { y: '-105%', opacity: 0 }
            : { opacity: 1, y: 0 }
        }
        transition={{
          duration: shouldReduceMotion ? 0.15 : unlocking ? 0.8 : 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative w-full h-full sm:h-[min(88vh,820px)] sm:max-w-[400px] sm:rounded-[2.75rem] overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(165deg, #22132b 0%, #43162f 45%, #7d2148 100%)',
        }}
      >
        {/* ── Wallpaper glows ─────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-pink-500/30 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-rose-400/20 blur-3xl pointer-events-none"
        />

        {/* Slow rising hearts in the wallpaper */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="absolute bottom-0 text-white/20 select-none"
              style={{
                left: `${8 + i * 9.2}%`,
                fontSize: `${0.8 + (i % 3) * 0.3}rem`,
                animation: `romanticFloat ${14 + (i % 5) * 2}s ease-in-out ${i * 1.3}s infinite`,
              }}
            >
              {['💗', '✨', '🤍', '💫', '🌸'][i % 5]}
            </span>
          ))}
        </div>

        <div className="relative z-10 flex flex-col h-full px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-6">
          {/* ── Top: lock icon, time, date ──────────────────────────────── */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-center select-none"
          >
            <div
              className="mx-auto mb-4 w-9 h-9 rounded-full bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center text-sm"
              aria-hidden="true"
            >
              🔒
            </div>
            <p className="text-white/70 text-sm font-medium tracking-wide">{date}</p>
            <p className="text-white text-[4.25rem] leading-none font-light tracking-tight tabular-nums drop-shadow-lg">
              {time}
            </p>
          </motion.div>

          {/* ── Notification ────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-[11px] uppercase tracking-[0.2em] text-white/45"
            >
              1 new message
            </motion.p>

            <motion.button
              type="button"
              onClick={unlock}
              whileTap={{ scale: 0.97 }}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 210, damping: 22 }}
              className="relative w-full text-left rounded-3xl p-4 bg-white/15 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)] hover:bg-white/20 transition-colors"
              aria-label={`${person.yourName} sent you a birthday surprise. Tap to unlock.`}
            >
              {/* soft pulse ring */}
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-3xl ring-1 ring-pink-300/40 animate-pulse pointer-events-none"
              />
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-base shadow-lg">
                  💌
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">
                  Wishora
                </span>
                <span className="ml-auto text-[10px] text-white/50">now</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-white leading-snug">
                {person.yourName} sent you something
              </p>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                A birthday surprise is waiting. Tap to unwrap 🎁
              </p>
            </motion.button>
          </div>

          {/* ── Bottom hint ─────────────────────────────────────────────── */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center select-none"
          >
            <p className="text-[11px] text-white/50">
              Tap the notification to unlock
            </p>
            <div
              aria-hidden="true"
              className="mx-auto mt-3 h-1 w-28 rounded-full bg-white/40"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  // Portal to <body> so the lock screen always covers the app's own layers
  // (the section wrapper creates a stacking context).
  return typeof document !== 'undefined'
    ? createPortal(screen, document.body)
    : screen;
}
