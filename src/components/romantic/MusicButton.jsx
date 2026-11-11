import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';

/**
 * Floating music toggle button — fixed in the bottom-right corner.
 * Requires a user gesture before playing (browser autoplay policy).
 */
export default function MusicButton() {
  const config = useRomanticConfig();
  const { music } = config;
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!music?.url) return;

    const audio = new Audio(music.url);
    audio.loop = true;
    audio.volume = 0.32;
    audio.preload = 'none';
    audioRef.current = audio;
    setReady(true);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [music?.url]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  if (!ready) return null;

  return (
    <motion.button
      onClick={toggle}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, type: 'spring' }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-pink-100 flex items-center justify-center text-xl"
      aria-label={playing ? 'Pause background music' : 'Play background music'}
      title={playing ? `Pause ${music?.label || 'music'}` : `Play ${music?.label || 'music'}`}
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
