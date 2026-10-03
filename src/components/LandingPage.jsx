import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import DarkModeToggle from './ui/DarkModeToggle';
import HowItWorks from './HowItWorks';
import ThemeShowcase from './ThemeShowcase';
import TestimonialSection from './TestimonialCard';

// ─── Static data ──────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '🎨',
    title: '10 Stunning Themes',
    desc: 'From Romantic Rose to Neon Glow, Kids Party to Minimalist — find the perfect vibe.',
  },
  {
    icon: '📸',
    title: 'Photo Slideshow',
    desc: 'Upload up to 6 photos with auto-advancing crossfade transitions.',
  },
  {
    icon: '🎵',
    title: 'Background Music',
    desc: 'Set the mood with royalty-free birthday soundtracks.',
  },
  {
    icon: '🔗',
    title: 'QR & Link Sharing',
    desc: 'Share via QR code, WhatsApp, or a single link — no account needed.',
  },
  {
    icon: '✨',
    title: 'Particle Effects',
    desc: 'Confetti fireworks, floating emojis, sparkle trails & 3D card effects.',
  },
  {
    icon: '💌',
    title: 'Card Templates',
    desc: 'Pick from 8 ready-made templates or create from scratch.',
  },
  {
    icon: '🌙',
    title: 'Dark Mode',
    desc: 'Beautiful in any lighting with automatic dark/light mode toggle.',
  },
  {
    icon: '📱',
    title: 'Mobile First',
    desc: 'Looks stunning on every device — phones, tablets, and desktops.',
  },
];

const BG_EMOJIS = [
  '🎂', '🎈', '🎉', '🎊', '🌹', '✨',
  '💖', '🥳', '🎁', '⭐', '🌟', '💫',
  '🎀', '🍰', '🥂', '🎆', '🦄', '🎪',
];

// ─── Animation variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950 transition-colors duration-500">

      {/* ── Decorative background emoji field ─────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {BG_EMOJIS.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl md:text-4xl opacity-[0.12] dark:opacity-[0.08]"
            style={{
              left: `${(i * 5.55) % 100}%`,
              top: `${(i * 11.3 + 5) % 95}%`,
            }}
            animate={{
              y: [0, -18, 0],
              rotate: [0, i % 2 === 0 ? 12 : -12, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 3 + (i % 4) * 0.7,
              repeat: Infinity,
              delay: i * 0.25,
              ease: 'easeInOut',
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* ── Main layout ────────────────────────────────────────────────── */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl" aria-hidden="true">🎂</span>
            <span className="text-white font-bold text-xl font-display tracking-tight">
              Wishora
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <DarkModeToggle />
            <Button variant="secondary" size="sm" onClick={() => navigate('/create')}>
              Create Now ✨
            </Button>
          </motion.div>
        </nav>

        {/* ── Hero Section ────────────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-16">
          <div className="text-center max-w-4xl mx-auto">

            {/* Animated badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white/90 text-sm mb-6"
            >
              <span className="animate-bounce-slow" aria-hidden="true">🎉</span>
              Free forever · No account needed
            </motion.div>

            {/* Cake icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
              className="text-6xl md:text-8xl mb-6 inline-block"
              aria-hidden="true"
            >
              🎂
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-display leading-tight"
            >
              Make Their Birthday{' '}
              <br className="hidden sm:block" />
              <span className="font-cursive text-yellow-300 dark:text-yellow-400 drop-shadow-lg">
                Unforgettable
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-6 text-base md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            >
              Create beautiful, animated birthday surprise pages in minutes.
              Upload photos, pick a theme, write a heartfelt message, and
              share it with a single link. 💌
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap"
            >
              <Button
                variant="white"
                size="xl"
                onClick={() => navigate('/create')}
                className="shadow-2xl shadow-black/25 font-bold"
              >
                🎉 Create a Birthday Surprise
              </Button>

              <Button
                variant="secondary"
                size="xl"
                onClick={() => navigate('/romantic')}
              >
                💌 Romantic Birthday Story
              </Button>
            </motion.div>
          </div>
        </div>

        {/* ── How It Works ─────────────────────────────────────────────── */}
        <HowItWorks />

        {/* ── Theme Showcase ───────────────────────────────────────────── */}
        <ThemeShowcase />

        {/* ── Feature grid ─────────────────────────────────────────────── */}
        <div className="px-6 py-20 max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
              Packed with Features ⚡
            </h2>
            <p className="text-white/70 max-w-lg mx-auto">
              Everything you need to create the perfect birthday surprise
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/15 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all hover:-translate-y-1 group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform" aria-hidden="true">{f.icon}</div>
                <h3 className="font-semibold text-white text-sm md:text-base leading-snug">
                  {f.title}
                </h3>
                <p className="text-white/60 text-xs md:text-sm mt-1 leading-snug">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Testimonials ─────────────────────────────────────────────── */}
        <TestimonialSection />

        {/* Footer */}
        <footer className="text-center pb-10 pt-8 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl" aria-hidden="true">🎂</span>
              <span className="text-white font-bold text-lg font-display">Wishora</span>
            </div>
            <p className="text-white/40 text-sm mb-4">
              Create magical birthday surprises in minutes. Free, open source, always.
            </p>
            <p className="text-white/30 text-xs">
              Made with ❤️ — © {new Date().getFullYear()} Wishora
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
