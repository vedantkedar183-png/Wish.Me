import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBirthday } from '../context/BirthdayContext';
import { decodeBirthdayData } from '../utils/encode';
import SurpriseExperience from '../components/SurpriseExperience';

// ─── Loading screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center">
      <motion.div
        className="text-white text-center space-y-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-6xl"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          aria-hidden="true"
        >
          🎂
        </motion.div>
        <p className="text-xl font-semibold font-display">
          Preparing your surprise…
        </p>
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white/70 rounded-full"
              animate={{ y: [0, -8, 0] }}
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center p-6">
      <motion.div
        className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
      >
        <div className="text-5xl mb-4" aria-hidden="true">😕</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2 font-display">
          Oops! Couldn't load this page
        </h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          This birthday page couldn't be found. The link may be invalid,
          expired, or corrupted. Try creating a fresh surprise!
        </p>
        <button
          onClick={onGoHome}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-sm hover:from-pink-600 hover:to-rose-600 transition-all shadow-md shadow-pink-500/25"
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
      const decoded = decodeBirthdayData(decodeURIComponent(encoded));
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
