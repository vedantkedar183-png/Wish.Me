import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';
import pianoPlayer from '../../audio/loveMeLikeYouDoPiano';

/**
 * Floating music toggle, fixed in the bottom-right corner.
 *
 * The soundtrack is a live-synthesized instrumental of the song (see
 * `src/audio/loveMeLikeYouDoPiano.js`), so there is no MP3 to download and
 * nothing to fail on a slow phone.
 *
 * Browsers won't allow sound before a user gesture, so the first tap/keypress
 * anywhere in the story starts it. After that the button is a normal
 * play/pause toggle, and a deliberate pause is remembered for the session.
 */
export default function MusicButton() {
  const config = useRomanticConfig();
  const { music } = config;
  const [playing, setPlaying] = useState(false);
  const pausedByUser = useRef(false);
  const startedOnce = useRef(false);

  const enabled = music?.enabled !== false;

  const startMusic = () => {
    if (pianoPlayer.start()) {
      startedOnce.current = true;
      setPlaying(true);
      return true;
    }
    return false;
  };

  const stopMusic = () => {
    pianoPlayer.stop();
    setPlaying(false);
  };

  useEffect(() => {
    if (!enabled) return undefined;

    const onFirstGesture = (event) => {
      if (pausedByUser.current || startedOnce.current) return;
      const target = event.target;
      if (target instanceof Element && target.closest('[data-music-toggle]')) {
        // Let the button's own handler decide, so we don't start then stop.
        return;
      }
      startMusic();
    };

    window.addEventListener('pointerdown', onFirstGesture, { passive: true });
    window.addEventListener('keydown', onFirstGesture);

    return () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
      pianoPlayer.stop();
    };
  }, [enabled]);

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
    <motion.button
      type="button"
      onClick={toggle}
      data-music-toggle="true"
      data-music-playing={playing ? 'true' : 'false'}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.6, type: 'spring' }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/35 text-xl text-[#f5d488] shadow-xl backdrop-blur-md"
      aria-label={
        playing
          ? 'Pause Love Me Like You Do'
          : 'Play Love Me Like You Do'
      }
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
  );
}
