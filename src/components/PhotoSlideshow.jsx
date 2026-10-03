import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

/**
 * Auto-advancing photo slideshow with crossfade transitions.
 * Falls back to single photo or emoji placeholder.
 *
 * @param {{ photos: string[], glowColor: string, fallbackEmoji: string, name: string, cardBg: string }} props
 */
export default function PhotoSlideshow({
  photos = [],
  glowColor = '#fb7185',
  fallbackEmoji = '🎂',
  name = 'Birthday person',
  cardBg = 'bg-white/20',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasPhotos = photos.length > 0;

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [photos.length]);

  const goTo = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Dynamic glow animation
  const glowKeyframes = [
    `0 0 20px 4px ${glowColor}55, 0 0 50px 10px ${glowColor}22`,
    `0 0 45px 12px ${glowColor}99, 0 0 90px 25px ${glowColor}44`,
    `0 0 20px 4px ${glowColor}55, 0 0 50px 10px ${glowColor}22`,
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Photo container */}
      <motion.div
        animate={{ boxShadow: glowKeyframes }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white/40 relative"
      >
        <AnimatePresence mode="wait">
          {hasPhotos ? (
            <motion.img
              key={currentIndex}
              src={photos[currentIndex]}
              alt={`${name}'s photo ${currentIndex + 1} of ${photos.length}`}
              className="w-full h-full object-cover absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            <div
              className={clsx(
                'w-full h-full flex items-center justify-center text-6xl',
                cardBg,
              )}
            >
              {fallbackEmoji}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation dots */}
      {photos.length > 1 && (
        <div className="flex gap-2" role="tablist" aria-label="Photo slideshow">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`View photo ${i + 1}`}
              className={clsx(
                'rounded-full transition-all duration-300',
                i === currentIndex
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
