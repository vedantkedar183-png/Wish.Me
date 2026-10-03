import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

/**
 * Visual grid of greeting card templates.
 * Clicking a template calls onSelect with the template data.
 * Includes a "Start from scratch" option.
 *
 * @param {{ templates: Array, onSelect: Function, onSkip: Function }} props
 */
export default function TemplateGallery({ templates, onSelect, onSkip }) {
  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {templates.map((t) => (
          <motion.button
            key={t.id}
            variants={itemVariants}
            onClick={() => onSelect(t)}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.96 }}
            className="rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-pink-400 transition-colors text-left shadow-sm hover:shadow-lg group"
          >
            {/* Gradient preview */}
            <div
              className="h-20 md:h-24 flex items-center justify-center"
              style={{ background: t.previewGradient }}
            >
              <span className="text-3xl md:text-4xl group-hover:scale-125 transition-transform" aria-hidden="true">
                {t.emoji}
              </span>
            </div>
            {/* Label */}
            <div className="px-3 py-2.5 bg-white dark:bg-gray-800">
              <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs md:text-sm truncate">
                {t.name}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs truncate mt-0.5">
                {t.description}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Skip option */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onSkip}
        className="mt-4 w-full text-center text-sm text-gray-400 hover:text-pink-500 transition-colors py-2"
      >
        ✏️ Or start from scratch
      </motion.button>
    </div>
  );
}
