import { motion } from 'framer-motion';
import { clsx } from 'clsx';

/**
 * Progress dots indicator for multi-step navigation.
 * Fixed at the right edge of the viewport.
 */
export default function SurpriseProgress({ total, current }) {
  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5"
      role="navigation"
      aria-label="Section progress"
    >
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5 + i * 0.08 }}
          className={clsx(
            'rounded-full transition-all duration-500 cursor-default',
            i === current
              ? 'w-2.5 h-6 bg-white shadow-lg shadow-white/30'
              : i < current
                ? 'w-2.5 h-2.5 bg-white/60'
                : 'w-2.5 h-2.5 bg-white/25',
          )}
          aria-label={`Section ${i + 1} of ${total}${i === current ? ' (current)' : ''}`}
          aria-current={i === current ? 'step' : undefined}
        />
      ))}
    </div>
  );
}
