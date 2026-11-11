import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

import ParticleField from './ParticleField';
import PhotoSlideshow from './PhotoSlideshow';
import ShareModal from './ShareModal';
import { themes, MUSIC_OPTIONS } from '../utils/themes';
import { useBirthday } from '../context/BirthdayContext';
import useConfetti from '../hooks/useConfetti';

// ─── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(text, { speed = 90, delay = 900 } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayed('');
      setIsDone(true);
      return;
    }

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

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, delay]);

  return { displayed, isDone };
}

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * Full-screen birthday celebration page.
 *
 * @param {{ data: Object }} props — birthday page data (may come from URL or localStorage)
 */
export default function BirthdayPage({ data }) {
  const navigate = useNavigate();
  const { resetForm } = useBirthday();

  const { name, message, fromName, theme, music: musicId, photoId, photoIds } = data ?? {};
  const themeObj = themes[theme] ?? themes.romantic;
  const musicOption = MUSIC_OPTIONS.find((m) => m.value === musicId);

  // ── State ────────────────────────────────────────────────────────────────
  const [photos, setPhotos] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const audioRef = useRef(null);

  const { displayed: typedName, isDone: nameDone } = useTypewriter(
    name || 'Someone Special',
    { speed: 85, delay: 1000 },
  );

  // Use theme-aware confetti
  const { fireConfetti } = useConfetti(theme);

  // ── Load photos from localStorage ────────────────────────────────────────
  useEffect(() => {
    const loadedPhotos = [];

    // Load multi-photos
    if (photoIds?.length) {
      photoIds.forEach((id) => {
        try {
          const stored = localStorage.getItem(`wishora_photo_${id}`);
          if (stored) loadedPhotos.push(stored);
        } catch {
          // Ignore storage errors
        }
      });
    }

    // Fallback to single photo
    if (loadedPhotos.length === 0 && photoId) {
      try {
        const stored = localStorage.getItem(`wishora_photo_${photoId}`);
        if (stored) loadedPhotos.push(stored);
      } catch {
        // Ignore
      }
    }

    setPhotos(loadedPhotos);
  }, [photoId, photoIds]);

  // ── Confetti burst on mount ───────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(fireConfetti, 600);
    return () => clearTimeout(t);
  }, [fireConfetti]);

  // ── Music player ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!musicOption?.url) return;

    const audio = new Audio(musicOption.url);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    // Try auto-play; if blocked, show the mute button in "paused" state
    audio
      .play()
      .then(() => setMusicPlaying(true))
      .catch(() => setMusicPlaying(false));

    // Retry on first user interaction (browsers require gesture for audio)
    const onInteraction = () => {
      if (!audioRef.current) return;
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
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

  // ── Controls ─────────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    if (!musicPlaying) {
      // Try starting playback if it was blocked
      audioRef.current
        .play()
        .then(() => {
          setMusicPlaying(true);
          setIsMuted(false);
        })
        .catch(() => {});
      return;
    }
    audioRef.current.muted = !isMuted;
    setIsMuted((prev) => !prev);
  }, [isMuted, musicPlaying]);

  const handleEdit = () => navigate('/create');

  const handleReset = () => {
    resetForm();
    navigate('/');
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className={clsx(
        'relative min-h-screen overflow-x-hidden',
        `bg-gradient-to-br ${themeObj.bgGradient}`,
        themeObj.textColor,
      )}
    >
      {/* ── Advanced particle effects ──────────────────────────────────── */}
      <ParticleField
        emojis={themeObj.emojis}
        glowColor={themeObj.glowColorHex}
        count={24}
      />

      {/* ── Top controls bar ────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-md border-b border-white/10"
        aria-label="Birthday page controls"
      >
        <button
          onClick={handleEdit}
          className="flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg px-1"
        >
          ← Edit
        </button>

        <span className="text-white/70 text-sm font-semibold tracking-wide">
          🎂 Wishora
        </span>

        <div className="flex items-center gap-2">
          {musicOption?.url && (
            <button
              onClick={toggleMute}
              aria-label={isMuted || !musicPlaying ? 'Play music' : 'Mute music'}
              title={isMuted || !musicPlaying ? 'Play music' : 'Mute music'}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {!musicPlaying ? '▶' : isMuted ? '🔇' : '🎵'}
            </button>
          )}

          <button
            onClick={() => setShowShare(true)}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/35 text-white text-xs px-3 py-1.5 rounded-full transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            🔗 Share
          </button>

          <button
            onClick={handleReset}
            aria-label="Start over — create a new surprise"
            title="Start over"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white/70 hover:text-white text-sm transition-colors"
          >
            ✕
          </button>
        </div>
      </motion.nav>

      {/* ── Main birthday content ────────────────────────────────────────── */}
      <main className="relative z-30 min-h-screen flex flex-col items-center justify-center px-6 pb-12 pt-24">

        {/* Happy Birthday headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="text-5xl md:text-7xl mb-3 inline-block"
            aria-hidden="true"
          >
            🎂
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-5xl font-bold font-display tracking-wide"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.18)' }}
          >
            Happy Birthday! 🎉
          </motion.h1>
        </motion.div>

        {/* Photo / Slideshow with 3D hover effect */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring', bounce: 0.5 }}
          className="mb-6 card-3d"
        >
          <div className="card-3d-inner">
            <PhotoSlideshow
              photos={photos}
              glowColor={themeObj.glowColorHex}
              fallbackEmoji={themeObj.previewEmoji}
              name={name}
              cardBg={themeObj.cardBg}
            />
          </div>
        </motion.div>

        {/* Typewriter name */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mb-8"
          aria-label={`Happy birthday, ${name}`}
        >
          <h2
            className={clsx(
              'text-4xl md:text-6xl font-bold font-cursive',
              theme === 'neon' && 'animate-neon-pulse',
            )}
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.15)' }}
          >
            {typedName}
            {!nameDone && (
              <span
                className="opacity-75"
                style={{ animation: 'blink 1s step-end infinite' }}
                aria-hidden="true"
              >
                |
              </span>
            )}
          </h2>
        </motion.div>

        {/* Message card with 3D hover */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8, ease: 'easeOut' }}
          className={clsx(
            'w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl mb-8 card-3d',
            themeObj.cardBg,
            'backdrop-blur-xl border border-white/20',
          )}
        >
          <div className="card-3d-inner">
            <div className="text-2xl text-center mb-3" aria-hidden="true">💌</div>
            <p
              className="text-base md:text-lg leading-relaxed text-center whitespace-pre-wrap"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.08)' }}
            >
              {message ||
                'Wishing you a magical birthday filled with joy, love, and laughter! 🎊'}
            </p>

            {fromName && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8 }}
                className={clsx(
                  'text-sm text-center mt-5 font-medium italic',
                  themeObj.accentColor,
                )}
              >
                — With love, {fromName} ❤️
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Bouncing emoji row */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="flex gap-2 md:gap-3 text-2xl md:text-3xl mb-10"
          aria-hidden="true"
        >
          {themeObj.emojis.slice(0, 6).map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -12, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                delay: i * 0.18,
                ease: 'easeInOut',
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
          className="text-center"
        >
          <div
            className={clsx(
              'inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full',
              themeObj.cardBg,
              'backdrop-blur-md border border-white/20 text-sm',
            )}
          >
            <span className="opacity-60">Made with</span>
            <span>❤️</span>
            <span className="opacity-60">using</span>
            <a
              href="/"
              className={clsx(
                'font-semibold hover:underline underline-offset-2',
                themeObj.accentColor,
              )}
            >
              Wishora
            </a>
            <span aria-hidden="true">🎂</span>
          </div>
        </motion.footer>
      </main>

      {/* ── Share modal ──────────────────────────────────────────────────── */}
      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} data={data} />
    </div>
  );
}
