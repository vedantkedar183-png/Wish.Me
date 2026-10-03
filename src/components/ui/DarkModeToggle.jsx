import { motion } from 'framer-motion';
import { useThemeMode } from '../../context/ThemeContext';

/**
 * Animated dark/light mode toggle button.
 * Shows a sun icon in dark mode (click to switch to light) and
 * a moon icon in light mode (click to switch to dark).
 */
export default function DarkModeToggle({ className = '' }) {
  const { isDark, toggleMode } = useThemeMode();

  return (
    <motion.button
      onClick={toggleMode}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' : 'bg-white/20 hover:bg-white/30 text-white'} ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.span
        key={isDark ? 'sun' : 'moon'}
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0, rotate: 90, opacity: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
        className="text-lg"
        aria-hidden="true"
      >
        {isDark ? '☀️' : '🌙'}
      </motion.span>
    </motion.button>
  );
}
