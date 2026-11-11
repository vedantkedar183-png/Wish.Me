import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { themes } from '../utils/themes';

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

const reducedMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/**
 * SurpriseExperience — the rich multi-step surprise experience.
 *
 * Orchestrates animated sections using the user's custom data:
 * 1. Welcome Screen — dramatic intro
 * 2. Reveal — big greeting with confetti
 * 3. Photo Gallery (optional) — polaroid-style photo wall when photos exist
 * 4. Message Card — styled message with typewriter
 * 5. Celebration — confetti explosion & emotional note
 * 6. Finale — replay, share, branding
 *
 * @param {{ data: Object }} props — surprise data from form or URL
 */
export default function SurpriseExperience({ data }) {
  const shouldReduceMotion = useReducedMotion();
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

  // ── Dynamic sections (skip gallery if no photos) ───────────────────────────
  const sections = useMemo(() => {
    const base = ['welcome', 'reveal'];
    if (photos.length > 0) base.push('gallery');
    base.push('message', 'celebration', 'finale');
    return base;
  }, [photos.length]);

  useEffect(() => {
    if (step >= sections.length) {
      setStep(Math.max(0, sections.length - 1));
    }
  }, [sections.length, step]);

  // ── Navigation ───────────────────────────────────────────────────────────
  const goNext    = () => setStep((s) => Math.min(s + 1, sections.length - 1));
  const goRestart = () => setStep(0);

  // ── Render current section ───────────────────────────────────────────────
  const renderSection = () => {
    const commonProps = { data, themeObj, occasion: data?.occasion || 'birthday' };

    switch (sections[step]) {
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
      <SurpriseProgress total={sections.length} current={step} themeObj={themeObj} />

      {/* ── Animated section ─────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={shouldReduceMotion ? reducedMotionVariants : pageVariants}
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
