import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    avatar: '👩🏻',
    quote: 'My best friend cried happy tears when she opened her birthday surprise! The confetti and music made it feel so real. Absolutely loved it!',
    stars: 5,
  },
  {
    name: 'Alex Thompson',
    avatar: '👨🏼',
    quote: 'I used the romantic story mode for my girlfriend and she was speechless. The typewriter letter effect is chef\'s kiss! 💋',
    stars: 5,
  },
  {
    name: 'Rahul Patel',
    avatar: '👨🏽',
    quote: 'So easy to use! Created a birthday page for my mom in 5 minutes and shared it on WhatsApp. She absolutely loved the galaxy theme!',
    stars: 5,
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, rotateX: 10 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/**
 * Testimonials section for the landing page.
 * Displays 3 glassmorphic testimonial cards with star ratings.
 */
export default function TestimonialSection() {
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
          Loved by Thousands 💕
        </h2>
        <p className="text-white/70 max-w-lg mx-auto">
          See what people are saying about their Wishora experience
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {TESTIMONIALS.map((t) => (
          <motion.div
            key={t.name}
            variants={cardVariants}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/15 hover:bg-white/15 transition-all hover:-translate-y-1"
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-4" aria-label={`${t.stars} out of 5 stars`}>
              {Array.from({ length: t.stars }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg" aria-hidden="true">★</span>
              ))}
            </div>

            {/* Quote */}
            <p className="text-white/80 text-sm leading-relaxed mb-5 italic">
              "{t.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">{t.avatar}</span>
              <span className="text-white font-semibold text-sm">{t.name}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
