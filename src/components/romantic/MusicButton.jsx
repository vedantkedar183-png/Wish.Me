import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';
import pianoPlayer from '../../audio/loveMeLikeYouDoPiano';

/**
 * Floating music toggle, fixed in the bottom-right corner.
 *
 * The soundtrack is synthesized live (see `src/audio/loveMeLikeYouDoPiano.js`),
 * so there is no MP3 to download and nothing to fail on a slow phone.
 *
 * Mobile browsers only allow audio from a real gesture, and some phones keep
 * the first tap for scrolling. We therefore try to unlock the soundtrack on
 * every early tap until it succeeds, show a small "tap for music" hint if the
 * browser is still blocking us, and only report `playing` once the audio
 * context is genuinely running.
 */
export default function MusicButton() {
  const config = useRomanticConfig();
  const { music } = config;
  const [playing, setPlaying] = useState(false);
  // Show the hint straight away: on a phone the soundtrack only starts after a
  // real tap, and a visible cue is what makes people tap the music button.
  const [showHint, setShowHint] = useState(true);
  const pausedByUser = useRef(false);
  const startingRef = useRef(false);
  const mountedRef = useRef(true);

  const enabled = music?.enabled !== false;

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  const startMusic = useCallback(async () => {
    if (startingRef.current) return false;
    startingRef.current = true;
    try {
      const ok = await pianoPlayer.start();
      if (!mountedRef.current) return ok;
      setPlaying(ok);
      if (ok) setShowHint(false);
      else setShowHint(true);
      return ok;
    } finally {
      startingRef.current = false;
    }
  }, []);

  const stopMusic = useCallback(() => {
    pianoPlayer.stop();
    if (mountedRef.current) setPlaying(false);
  }, []);

  useEffect(() => {
    if (enabled) return undefined;

    stopMusic();
    return undefined;
  }, [enabled, stopMusic]);

  // Reflect the real state on the phone's media controls.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
    } catch {
      // Media Session is optional.
    }
  }, [playing]);

  useEffect(() => {
    if (!enabled) return undefined;

    const onFirstGesture = (event) => {
      if (pausedByUser.current || startingRef.current || pianoPlayer.isPlaying()) return;
      const target = event.target;
      if (target instanceof Element && target.closest('[data-music-toggle]')) {
        // Let the button's own handler decide, so we don't start then stop.
        return;
      }
      startMusic();
    };

    // `pointerdown` is the earliest gesture and works in iOS Safari, while
    // `touchend`/`click` cover older Android browsers and accessibility tools.
    const events = ['pointerdown', 'touchend', 'click', 'keydown'];
    events.forEach((name) => window.addEventListener(name, onFirstGesture, true));

    const hintTimer = setTimeout(() => {
      if (!pianoPlayer.isPlaying()) setShowHint(true);
    }, 5000);

    // Keep the phone lock-screen / notification controls in sync so the song
    // reads as real media playback instead of a silent web sound.
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: 'Love Me Like You Do',
          artist: 'Instrumental — for you',
          album: 'Our little story',
        });
        navigator.mediaSession.setActionHandler('play', () => startMusic());
        navigator.mediaSession.setActionHandler('pause', () => stopMusic());
      } catch {
        // Media Session is optional.
      }
    }

    return () => {
      events.forEach((name) => window.removeEventListener(name, onFirstGesture, true));
      clearTimeout(hintTimer);
      pianoPlayer.stop();
      if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
        try {
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
        } catch {
          // Media Session is optional.
        }
      }
    };
  }, [enabled, startMusic, stopMusic]);

  const toggle = () => {
    if (playing) {
      pausedByUser.current = true;
      stopMusic();
      return;
    }
    pausedByUser.current = false;
    startMusic();
  };

  if (!enabled) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      <AnimatePresence>
        {showHint && !playing && (
          <motion.span
            initial={{ opacity: 0, x: 8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="rounded-full border border-[#f5d488]/25 bg-black/55 px-3 py-1.5 text-[11px] font-medium text-[#f5d488] shadow-lg backdrop-blur-sm"
          >
            Tap for music
          </motion.span>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={toggle}
        data-music-toggle="true"
        data-music-playing={playing ? 'true' : 'false'}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/35 text-xl text-[#f5d488] shadow-xl backdrop-blur-md"
        aria-label={playing ? 'Pause Love Me Like You Do' : 'Play Love Me Like You Do'}
        aria-pressed={playing}
        title={
          playing
            ? 'Pause "Love Me Like You Do" (instrumental)'
            : 'Play "Love Me Like You Do" (instrumental)'
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={playing ? 'on' : 'off'}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
            className="leading-none"
          >
            {playing ? '♫' : '♪'}
          </motion.span>
        </AnimatePresence>

        {!playing && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-[#f5d488]/25"
          />
        )}
      </motion.button>
    </div>
  );
}
