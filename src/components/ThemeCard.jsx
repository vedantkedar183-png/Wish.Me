import { motion } from 'framer-motion';
import { clsx } from 'clsx';

/**
 * A visual theme selection card.
 * Shows a gradient preview swatch with emoji and theme name.
 * Highlights when selected with a pink ring + scale effect.
 */
export default function ThemeCard({ theme, isSelected, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(theme.id)}
      whileHover={{ scale: isSelected ? 1.05 : 1.06 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={clsx(
        'relative rounded-2xl overflow-hidden cursor-pointer',
        'border-2 transition-all duration-200 aspect-square',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2',
        isSelected
          ? 'border-pink-500 scale-[1.05] shadow-lg shadow-pink-500/30'
          : 'border-transparent hover:border-gray-200 hover:shadow-md',
      )}
      aria-label={`Select ${theme.name} theme`}
      aria-pressed={isSelected}
    >
      {/* Gradient swatch */}
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-1 p-2"
        style={{ background: theme.previewGradient }}
      >
        <span className="text-2xl drop-shadow-sm" aria-hidden="true">
          {theme.previewEmoji}
        </span>
        <span className="text-white text-xs font-semibold text-center leading-tight drop-shadow">
          {theme.name}
        </span>
      </div>

      {/* Selected checkmark badge */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1.5 right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"
          aria-hidden="true"
        >
          <svg
            className="w-3 h-3 text-pink-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
