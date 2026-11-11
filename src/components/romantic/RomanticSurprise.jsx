import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { surpriseConfig, getRomanticConfig } from '../../data/surpriseConfig';
import { RomanticConfigProvider } from '../../context/RomanticConfigContext';

import DecorationLayer from './DecorationLayer';
import MusicButton    from './MusicButton';
import ProgressDots   from './ProgressDots';

import WelcomeScreen   from './WelcomeScreen';
import BirthdayReveal  from './BirthdayReveal';
import MemoriesGallery from './MemoriesGallery';
import ReasonsCards    from './ReasonsCards';
import LoveLetter      from './LoveLetter';
import FinalSurprise   from './FinalSurprise';

// ─── Section registry ────────────────────────────────────────────────────────
const SECTIONS = [
  WelcomeScreen,
  BirthdayReveal,
  MemoriesGallery,
  ReasonsCards,
  LoveLetter,
  FinalSurprise,
];

// ─── Section transition variants ─────────────────────────────────────────────
// Exit upward, enter from below — feels like turning pages in a storybook.
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

// ─── Main orchestrator ───────────────────────────────────────────────────────
/**
 * RomanticSurprise — the root component for the birthday story experience.
 *
 * Manages which section is active and renders smooth AnimatePresence
 * transitions between them. The DecorationLayer and MusicButton are always
 * mounted so they don't reset when sections change.
 */
export default function RomanticSurprise() {
  const [step, setStep] = useState(0);

  const config = useMemo(() => {
    try {
      const saved = localStorage.getItem('wishora_romantic_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return getRomanticConfig(parsed);
      }
    } catch (err) {
      console.warn('[Wishora] Failed to read wishora_romantic_data from localStorage:', err);
    }
    return surpriseConfig;
  }, []);

  const goNext    = () => setStep((s) => Math.min(s + 1, SECTIONS.length - 1));
  const goRestart = () => setStep(0);

  const CurrentSection = SECTIONS[step];

  return (
    <RomanticConfigProvider config={config}>
      <div className="relative min-h-screen overflow-x-hidden" style={{ isolation: 'isolate' }}>

        {/* ── Always-on layers ──────────────────────────────────────── */}
        <DecorationLayer />
        <MusicButton />

        {/* ── Progress indicator ────────────────────────────────────── */}
        <ProgressDots total={SECTIONS.length} current={step} />

        {/* ── Animated section ─────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <CurrentSection onNext={goNext} onRestart={goRestart} />
          </motion.div>
        </AnimatePresence>
      </div>
    </RomanticConfigProvider>
  );
}
