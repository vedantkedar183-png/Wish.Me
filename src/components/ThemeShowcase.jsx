import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { themes } from '../utils/themes';

const THEME_LIST = Object.values(themes);

/**
 * Auto-scrolling horizontal theme showcase for the landing page.
 * Shows all available themes with preview gradients.
 * Clicking a theme navigates to the creator with that theme pre-selected.
 */
export default function ThemeShowcase() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  return (
    <section className="py-20 px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
          10 Stunning Themes 🎨
        </h2>
        <p className="text-white/70 max-w-lg mx-auto">
          Each theme comes with unique colors, emojis, and glow effects
        </p>
      </motion.div>

      {/* Scrolling strip */}
      <div className="relative max-w-6xl mx-auto">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {THEME_LIST.map((t) => (
            <motion.button
              key={t.id}
              onClick={() => navigate('/create')}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 snap-center w-40 md:w-48 rounded-2xl overflow-hidden border-2 border-white/20 hover:border-white/50 transition-colors shadow-xl group cursor-pointer"
            >
              {/* Gradient preview */}
              <div
                className="h-28 md:h-36 flex items-center justify-center"
                style={{ background: t.previewGradient }}
              >
                <span className="text-4xl md:text-5xl group-hover:scale-125 transition-transform" aria-hidden="true">
                  {t.previewEmoji}
                </span>
              </div>
              {/* Label */}
              <div className="bg-white/10 backdrop-blur-md px-3 py-2.5 text-center">
                <p className="text-white font-semibold text-sm truncate">{t.name}</p>
                <div className="flex justify-center gap-0.5 mt-1">
                  {t.emojis.slice(0, 4).map((emoji, i) => (
                    <span key={i} className="text-xs" aria-hidden="true">{emoji}</span>
                  ))}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-rose-500/50 to-transparent pointer-events-none rounded-l-2xl" />
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-purple-600/50 to-transparent pointer-events-none rounded-r-2xl" />
      </div>
    </section>
  );
}
