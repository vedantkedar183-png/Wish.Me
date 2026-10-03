import { motion } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    icon: '✍️',
    title: 'Customize',
    desc: 'Pick a stunning theme, upload photos, write a heartfelt message, and choose background music.',
  },
  {
    num: '02',
    icon: '🎨',
    title: 'Preview',
    desc: 'See the magic come alive with animations, confetti, and floating emojis before you share.',
  },
  {
    num: '03',
    icon: '🚀',
    title: 'Share',
    desc: 'Send via link, QR code, or WhatsApp. No account needed — it just works!',
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/**
 * Three-step visual guide showing how Wishora works.
 * Rendered on the landing page with scroll-triggered animations.
 */
export default function HowItWorks() {
  return (
    <section className="py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
          How It Works ✨
        </h2>
        <p className="text-white/70 max-w-lg mx-auto">
          Create a magical birthday surprise in just 3 simple steps
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
      >
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            variants={itemVariants}
            className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/15 hover:bg-white/15 transition-colors group"
          >
            {/* Step number badge */}
            <div className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {step.num}
            </div>

            {/* Connecting line (hidden on mobile and last item) */}
            {i < STEPS.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-4 md:-right-5 w-8 md:w-10 h-0.5 bg-gradient-to-r from-white/30 to-transparent" />
            )}

            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-display">
              {step.title}
            </h3>
            <p className="text-white/65 text-sm leading-relaxed">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
