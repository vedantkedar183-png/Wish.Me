import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

/**
 * Polaroid-style photo gallery showing uploaded photos with staggered animations.
 * Falls back to a beautiful emoji card if no photos were uploaded.
 */
export default function SurpriseGallery({ onNext, data, themeObj, photos }) {
  const { name } = data;
  const hasPhotos = photos.length > 0;
  const [activePhoto, setActivePhoto] = useState(0);
  const [showButton, setShowButton] = useState(false);

  // Auto-advance photos
  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setActivePhoto((prev) => (prev + 1) % photos.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [photos.length]);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Random rotations for polaroid effect
  const rotations = ['-3deg', '2deg', '-2deg', '3deg', '-1deg', '2deg'];

  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center',
        `bg-gradient-to-br ${themeObj.bgGradient}`,
        themeObj.textColor,
      )}
    >
      <motion.div
        className="relative z-10 w-full max-w-lg space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">
            {hasPhotos ? 'Beautiful Memories 📸' : 'A Special Moment ✨'}
          </h2>
          <p className="opacity-70 text-sm md:text-base">
            {hasPhotos
              ? 'Every moment with you is one to treasure forever'
              : `Every moment with ${name || 'you'} is pure magic`}
          </p>
        </motion.div>

        {hasPhotos ? (
          <>
            {/* Main photo display */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="relative mx-auto"
            >
              {/* Polaroid frame */}
              <div
                className="bg-white/95 rounded-xl p-3 pb-12 shadow-2xl mx-auto inline-block"
                style={{ transform: `rotate(${rotations[activePhoto % rotations.length]})` }}
              >
                <div className="w-64 h-72 md:w-72 md:h-80 rounded-lg overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activePhoto}
                      src={photos[activePhoto]}
                      alt={`Memory ${activePhoto + 1} of ${photos.length}`}
                      className="w-full h-full object-cover absolute inset-0"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                    />
                  </AnimatePresence>
                </div>
                {/* Caption area */}
                <p className="text-gray-600 text-xs mt-2 font-handwriting text-center">
                  {`Memory ${activePhoto + 1} of ${photos.length} 💕`}
                </p>
              </div>

              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 -z-10 rounded-xl"
                animate={{
                  boxShadow: [
                    `0 0 30px 8px ${themeObj.glowColorHex}33`,
                    `0 0 60px 15px ${themeObj.glowColorHex}55`,
                    `0 0 30px 8px ${themeObj.glowColorHex}33`,
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              />
            </motion.div>

            {/* Photo dots */}
            {photos.length > 1 && (
              <div className="flex justify-center gap-2">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={clsx(
                      'rounded-full transition-all duration-300',
                      i === activePhoto
                        ? 'w-6 h-2.5 bg-white'
                        : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60',
                    )}
                    aria-label={`View photo ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Mini thumbnails */}
            {photos.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center gap-2 flex-wrap"
              >
                {photos.map((photo, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    whileHover={{ scale: 1.1, rotate: 0 }}
                    className={clsx(
                      'w-14 h-14 rounded-lg overflow-hidden border-2 transition-all',
                      i === activePhoto
                        ? 'border-white shadow-lg scale-110'
                        : 'border-white/30 opacity-70',
                    )}
                    style={{ transform: `rotate(${rotations[i % rotations.length]})` }}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </>
        ) : (
          /* No photos — show emoji card */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className={clsx(
              'mx-auto w-64 h-72 rounded-3xl flex flex-col items-center justify-center gap-4',
              themeObj.cardBg,
              'backdrop-blur-xl border border-white/20 shadow-2xl',
            )}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="text-7xl"
            >
              {themeObj.previewEmoji}
            </motion.span>
            <p className="opacity-70 text-sm px-6">
              Every moment with {name || 'you'} is a beautiful memory 💕
            </p>
          </motion.div>
        )}

        {/* Continue button */}
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className={clsx(
              'px-8 py-3 rounded-full text-base font-semibold',
              'bg-white/20 backdrop-blur-md border border-white/25',
              'hover:bg-white/30 transition-all shadow-xl cursor-pointer',
            )}
          >
            Keep going — there's more! →
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
