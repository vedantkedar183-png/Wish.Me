import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useBirthday } from '../context/BirthdayContext';
import { decodeSurpriseData, decodeBirthdayData } from '../utils/encode';
import SurpriseExperience from '../components/SurpriseExperience';

// ─── Loading screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        className="text-white text-center space-y-4 max-w-xs sm:max-w-sm w-full px-4"
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
      >
        <motion.div
          className="text-5xl sm:text-6xl"
          animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          aria-hidden="true"
        >
          🎂
        </motion.div>
        <p className="text-lg sm:text-xl font-semibold font-display">
          Preparing your surprise…
        </p>
        <div className="flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-white/70 rounded-full"
              animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Error screen ─────────────────────────────────────────────────────────────
function ErrorScreen({ onGoHome }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        className="bg-white rounded-3xl p-6 sm:p-8 text-center max-w-sm w-full shadow-2xl mx-4"
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.6 }}
      >
        <div className="text-4xl sm:text-5xl mb-4" aria-hidden="true">😕</div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 font-display">
          Oops! Couldn't load this surprise
        </h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          This surprise couldn't be loaded. The link may be invalid or corrupted. Try creating a fresh surprise!
        </p>
        <button
          onClick={onGoHome}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-sm hover:from-pink-600 hover:to-rose-600 transition-all shadow-md shadow-pink-500/25 active:scale-95"
        >
          🎉 Create a New Surprise
        </button>
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
/**
 * Surprise page — resolves birthday data from either:
 * 1. URL query param `?d=<base64>` (shared link)
 * 2. localStorage via context (same-device navigation from /create)
 *
 * If neither is available, redirects to home.
 */
export default function Surprise() {
  const [searchParams] = useSearchParams();
  const { formData } = useBirthday();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const encoded = searchParams.get('d');

    if (encoded) {
      // ── Shared link flow (URL-decoded data) ─────────────────────────
      const decoded =
        decodeSurpriseData(decodeURIComponent(encoded)) ||
        decodeBirthdayData(decodeURIComponent(encoded));
      if (decoded?.name) {
        setData(decoded);
      } else {
        setError(true);
      }
    } else if (formData?.name) {
      // ── Same-device flow (localStorage data) ────────────────────────
      setData(formData);
    } else {
      // ── No data — send user home ─────────────────────────────────────
      navigate('/', { replace: true });
      return;
    }

    setLoading(false);
  }, []); // Run once on mount — deps intentionally omitted to avoid re-renders

  if (loading) return <LoadingScreen />;
  if (error || !data) return <ErrorScreen onGoHome={() => navigate('/')} />;

  return <SurpriseExperience data={data} />;
}
