import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { themes } from '../utils/themes';
import { useBirthday } from '../context/BirthdayContext';

import SurpriseProgress    from './surprise/SurpriseProgress';
import SurpriseMusic       from './surprise/SurpriseMusic';
import SurpriseWelcome     from './surprise/SurpriseWelcome';
import SurpriseReveal      from './surprise/SurpriseReveal';
import SurpriseGallery     from './surprise/SurpriseGallery';
import SurpriseMessage     from './surprise/SurpriseMessage';
import SurpriseCelebration from './surprise/SurpriseCelebration';
import SurpriseFinale      from './surprise/SurpriseFinale';
import ShareModal          from './ShareModal';

// ─── Page transition variants ─────────────────────────────────────────────────
const pageVariants = {
  initial: {
    opacity: 0,
    y: 55,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -35,
    scale: 0.97,
    transition: { duration: 0.38, ease: 'easeIn' },
  },
};

// ─── Section registry ─────────────────────────────────────────────────────────
const SECTION_KEYS = [
  'welcome',
  'reveal',
  'gallery',
  'message',
  'celebration',
  'finale',
];

/**
 * SurpriseExperience — the rich multi-step birthday experience.
 *
 * Orchestrates 6 animated sections using the user's custom data:
 * 1. Welcome Screen — dramatic intro
 * 2. Birthday Reveal — big "Happy Birthday!" with confetti
 * 3. Photo Gallery — polaroid-style photo wall
 * 4. Message Card — love-letter styled message with typewriter
 * 5. Celebration — confetti explosion & emotional note
 * 6. Finale — replay, share, branding
 *
 * @param {{ data: Object }} props — birthday data from form or URL
 */
export default function SurpriseExperience({ data }) {
  const { getPhoto } = useBirthday();
  const [step, setStep] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [photos, setPhotos] = useState([]);

  const themeObj = themes[data?.theme] ?? themes.romantic;

  // ── Load photos from localStorage ────────────────────────────────────────
  useEffect(() => {
    const loaded = [];

    if (data?.photoIds?.length) {
      data.photoIds.forEach((id) => {
        try {
          const stored = localStorage.getItem(`wishora_photo_${id}`);
          if (stored) loaded.push(stored);
        } catch {
          // Ignore storage errors
        }
      });
    }

    // Fallback to single photo
    if (loaded.length === 0 && data?.photoId) {
      try {
        const stored = localStorage.getItem(`wishora_photo_${data.photoId}`);
        if (stored) loaded.push(stored);
      } catch {
        // Ignore
      }
    }

    setPhotos(loaded);
  }, [data?.photoId, data?.photoIds]);

  // ── Navigation ───────────────────────────────────────────────────────────
  const goNext    = () => setStep((s) => Math.min(s + 1, SECTION_KEYS.length - 1));
  const goRestart = () => setStep(0);

  // ── Render current section ───────────────────────────────────────────────
  const renderSection = () => {
    const commonProps = { data, themeObj };

    switch (SECTION_KEYS[step]) {
      case 'welcome':
        return <SurpriseWelcome onNext={goNext} {...commonProps} />;
      case 'reveal':
        return <SurpriseReveal onNext={goNext} {...commonProps} />;
      case 'gallery':
        return <SurpriseGallery onNext={goNext} photos={photos} {...commonProps} />;
      case 'message':
        return <SurpriseMessage onNext={goNext} {...commonProps} />;
      case 'celebration':
        return <SurpriseCelebration onNext={goNext} {...commonProps} />;
      case 'finale':
        return (
          <SurpriseFinale
            onRestart={goRestart}
            onShare={() => setShowShare(true)}
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ isolation: 'isolate' }}>

      {/* ── Always-on layers ────────────────────────────────────────── */}
      <SurpriseMusic musicId={data?.music} />
      <SurpriseProgress total={SECTION_KEYS.length} current={step} themeObj={themeObj} />

      {/* ── Animated section ─────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ position: 'relative', zIndex: 10 }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>

      {/* ── Share modal ──────────────────────────────────────────────── */}
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        data={data}
      />
    </div>
  );
}
