import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import useConfetti from '../../hooks/useConfetti';

/**
 * Interactive wrapped gift for the romantic finale.
 *
 * Tapping the box pops the lid, fires confetti and reveals a set of
 * "love coupons" from `config.final.gift`. The coupons are plain data, so the
 * whole section can be customised from data/surpriseConfig.js (or hidden by
 * setting `coupons: []`).
 */
export default function GiftBox({ gift, recipient }) {
  const [opened, setOpened] = useState(false);
  const { fireConfetti } = useConfetti('romantic');
  const shouldReduceMotion = useReducedMotion();

  if (!gift?.coupons?.length) return null;

  const openGift = () => {
    if (opened) return;
    setOpened(true);
    fireConfetti();
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="closed-gift"
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: -24 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <p className="font-script text-2xl md:text-3xl text-romantic-600">
              {gift.title}
            </p>
            <p className="mt-1 text-[11px] md:text-xs uppercase tracking-[0.18em] text-romantic-muted">
              {gift.subtitle}
            </p>

            <button
              type="button"
              onClick={openGift}
              className="group mt-3 flex flex-col items-center rounded-2xl px-4 pb-2 pt-8 focus:outline-none"
              aria-label={`Open your gift${recipient ? ` for ${recipient}` : ''}`}
            >
              <span className="gift-box block" aria-hidden="true">
                <span className="gift-lid" />
                <span className="gift-body">
                  <span className="gift-ribbon-v" />
                  <span className="gift-ribbon-h" />
                </span>
                <span className="gift-bow">🎀</span>
              </span>
              <span className="mt-2 text-xs font-semibold text-romantic-500 underline decoration-dotted underline-offset-4 group-hover:text-romantic-600 transition-colors">
                Tap to open 🎁
              </span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="opened-gift"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 22 }}
            className="glass-card rounded-3xl p-5 md:p-6 text-left"
          >
            <div className="text-center">
              <span className="text-3xl" aria-hidden="true">🎁</span>
              <p className="font-script text-2xl md:text-3xl text-romantic-600 leading-tight">
                {recipient ? `For you, ${recipient}` : gift.title}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-romantic-muted">
                Love coupons · no expiry
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {gift.coupons.map((coupon, index) => (
                <motion.div
                  key={`${coupon.title}-${index}`}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.15 + index * 0.12, duration: 0.45 }}
                  className="coupon"
                >
                  <span className="text-2xl shrink-0" aria-hidden="true">
                    {coupon.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-romantic-warm">
                      {coupon.title}
                    </p>
                    <p className="text-xs text-romantic-muted leading-snug">
                      {coupon.text}
                    </p>
                  </div>
                  <span className="ml-auto shrink-0 text-[9px] font-bold uppercase tracking-widest text-romantic-300">
                    Redeem
                  </span>
                </motion.div>
              ))}
            </div>

            {gift.note && (
              <p className="mt-4 text-center font-script text-lg md:text-xl text-romantic-500">
                {gift.note}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
