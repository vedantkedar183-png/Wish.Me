import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

// ─── Variant Styles ───────────────────────────────────────────────────────────
const VARIANTS = {
  primary:
    'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/25',
  secondary:
    'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/35',
  outline:
    'border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white bg-transparent',
  ghost:
    'text-white hover:bg-white/20 bg-transparent',
  white:
    'bg-white text-pink-600 hover:bg-pink-50 shadow-xl shadow-black/10',
  danger:
    'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700',
  glass:
    'bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white/25',
};

// ─── Size Styles ──────────────────────────────────────────────────────────────
const SIZES = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm font-semibold',
  lg: 'px-8 py-4 text-base font-semibold',
  xl: 'px-10 py-5 text-lg font-bold',
};

/**
 * Reusable animated button with multiple variants and sizes.
 * Wraps Framer Motion for smooth press feedback.
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    fullWidth = false,
    onClick,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full',
        'font-medium transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
});

export default Button;
