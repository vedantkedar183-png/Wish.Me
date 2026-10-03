import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { themes } from '../utils/themes';
import { useBirthday } from '../context/BirthdayContext';

/**
 * Preview modal — shows a scaled-down version of the birthday page
 * so the creator can review before generating the full page.
 *
 * @param {{ isOpen: boolean, onClose: () => void, onConfirm: () => void, previewData: Object }} props
 */
export default function PreviewModal({ isOpen, onClose, onConfirm, previewData }) {
  const { getPhoto } = useBirthday();

  const { name, message, fromName, theme, photoId } = previewData || {};
  const themeObj = themes[theme] ?? themes.romantic;
  const photo = photoId ? getPhoto(photoId) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Birthday page preview"
          >
            <motion.div
              className="w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Birthday page mini-preview ─────────────────── */}
              <div
                className={clsx(
                  'relative p-8 text-center space-y-5 overflow-hidden',
                  `bg-gradient-to-br ${themeObj.bgGradient}`,
                  themeObj.textColor,
                )}
              >
                {/* Mini floating emojis (decorative) */}
                {themeObj.emojis.slice(0, 4).map((e, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="absolute opacity-20 text-2xl pointer-events-none select-none"
                    style={{
                      top: `${15 + i * 18}%`,
                      left: i % 2 === 0 ? '8%' : '82%',
                    }}
                  >
                    {e}
                  </span>
                ))}

                {/* Photo or placeholder */}
                <div className="flex justify-center">
                  {photo ? (
                    <img
                      src={photo}
                      alt={name || 'Birthday person'}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white/40 shadow-xl"
                    />
                  ) : (
                    <div
                      className={clsx(
                        'w-24 h-24 rounded-full border-4 border-white/30',
                        'flex items-center justify-center text-4xl shadow-xl',
                        themeObj.cardBg,
                      )}
                    >
                      {themeObj.previewEmoji}
                    </div>
                  )}
                </div>

                {/* Name & birthday line */}
                <div>
                  <p className={clsx('text-xs font-semibold mb-1', themeObj.accentColor)}>
                    🎂 Happy Birthday!
                  </p>
                  <h2 className="text-2xl font-bold font-cursive">
                    {name || 'Someone Special'}
                  </h2>
                </div>

                {/* Message card */}
                <div
                  className={clsx(
                    'rounded-2xl p-4 border border-white/20',
                    themeObj.cardBg,
                    'backdrop-blur-md',
                  )}
                >
                  <p className="text-sm leading-relaxed line-clamp-4">
                    {message ||
                      'Your heartfelt message will appear here — looking beautiful already! 💌'}
                  </p>
                  {fromName && (
                    <p className={clsx('text-xs mt-2 font-medium', themeObj.accentColor)}>
                      — {fromName}
                    </p>
                  )}
                </div>

                <p className="text-xs opacity-50">
                  ✨ Preview — full animations on the live page
                </p>
              </div>

              {/* ── Action bar ────────────────────────────────── */}
              <div className="bg-white p-4 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-semibold transition-all shadow-md shadow-pink-500/20"
                >
                  🚀 Launch!
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
