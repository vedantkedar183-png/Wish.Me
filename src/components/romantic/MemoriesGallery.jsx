import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';

/** Polaroid-style photo card with tilt and lift on hover */
function PolaroidCard({ photo, index }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: index * 0.12 + 0.3,
        duration: 0.6,
        type: 'spring',
        stiffness: 220,
        damping: 20,
      }}
      className="polaroid cursor-pointer"
      style={{ '--rot': photo.rotation }}
      tabIndex={0}
      aria-label={photo.caption}
    >
      {/* Photo area */}
      <div className="w-full aspect-[4/5] overflow-hidden bg-romantic-100 flex items-center justify-center">
        {!photo.src || imgError ? (
          /* Gradient placeholder when the photo is device-local or fails to load */
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-4xl"
            style={{
              background: `linear-gradient(135deg, hsl(${(index * 40) % 360}, 60%, 85%), hsl(${(index * 40 + 40) % 360}, 60%, 80%))`,
            }}
          >
            <span aria-hidden="true">🖼️</span>
            <span className="text-[10px] font-medium text-gray-600/70 px-2 text-center">
              {photo.caption || 'A memory'}
            </span>
          </div>
        ) : (
          <img
            src={photo.src}
            alt={photo.caption}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Caption strip */}
      <div className="pt-2 pb-1 px-1 text-center">
        <p className="font-cursive text-sm text-gray-600 leading-tight">
          {photo.caption}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Section 2 — Memories Gallery
 * Polaroid-style photo grid with staggered entrance and tilt-on-hover effect.
 */
export default function MemoriesGallery({ onNext }) {
  const config = useRomanticConfig();
  const { memories } = config;

  return (
    <div className="romantic-section py-16 justify-start">
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="text-4xl mb-3 block" aria-hidden="true">🎞️</span>
          <h2 className="font-display text-3xl md:text-4xl text-romantic-warm mb-2">
            {memories.title}
          </h2>
          <p className="font-cursive text-xl text-romantic-muted">
            {memories.subtitle}
          </p>
        </motion.div>

        {/* Polaroid grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7 mb-10">
          {memories.photos.map((photo, i) => (
            <PolaroidCard key={i} photo={photo} index={i} />
          ))}
        </div>

        {/* Continue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: memories.photos.length * 0.12 + 0.8 }}
          className="text-center"
        >
          <button onClick={onNext} className="btn-romantic">
            Continue ❤️
          </button>
        </motion.div>
      </div>
    </div>
  );
}
