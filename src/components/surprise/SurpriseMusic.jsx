import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MUSIC_OPTIONS } from '../../utils/themes';

/**
 * Floating music toggle button for the birthday surprise experience.
 * Uses the user's selected music track from form data.
 * Fixed in the bottom-right corner.
 */
export default function SurpriseMusic({ musicId }) {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef(null);

  const musicOption = MUSIC_OPTIONS.find((m) => m.value === musicId);

  useEffect(() => {
    if (!musicOption?.url) return;

    const audio = new Audio(musicOption.url);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = 'auto';
    audioRef.current = audio;
    setReady(true);

    // Try autoplay on first user interaction
    const onInteraction = () => {
      if (!audioRef.current || playing) return;
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
      document.removeEventListener('click', onInteraction);
      document.removeEventListener('keydown', onInteraction);
    };
    document.addEventListener('click', onInteraction);
    document.addEventListener('keydown', onInteraction);

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
      document.removeEventListener('click', onInteraction);
      document.removeEventListener('keydown', onInteraction);
    };
  }, [musicOption?.url]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  if (!ready) return null;

  return (
    <motion.button
      onClick={toggle}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, type: 'spring' }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-pink-100 flex items-center justify-center text-xl"
      aria-label={playing ? 'Pause background music' : 'Play background music'}
      title={playing ? `Pause ${musicOption?.label || 'music'}` : `Play ${musicOption?.label || 'music'}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={playing ? 'on' : 'off'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {playing ? '🎵' : '🔇'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
