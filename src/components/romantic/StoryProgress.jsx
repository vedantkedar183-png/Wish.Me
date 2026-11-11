import { motion } from 'framer-motion';

/**
 * Instagram-story style progress header.
 *
 * Segmented bars at the top, a sender avatar strip, and invisible tap zones on
 * the left/right edges for previous/next — the navigation language people
 * already know from Stories. There is no auto-advance so long chapters (the
 * typewriter letter) are never cut off.
 */
export default function StoryProgress({ total, current, senderName, onPrev, onNext }) {
  // The lock screen (step 0) has its own UI, and isn't part of the story bars.
  if (current <= 0) return null;

  const storyTotal = Math.max(1, total - 1);
  const active = Math.min(Math.max(current - 1, 0), storyTotal - 1);
  const isLast = current >= total - 1;
  const initial = (senderName || 'W').trim().charAt(0).toUpperCase();

  return (
    <>
      {/* ── Segmented bars + sender strip ─────────────────────────────── */}
      <div className="fixed top-0 inset-x-0 z-40 px-3 pt-[max(0.65rem,env(safe-area-inset-top))] pointer-events-none">
        <div className="max-w-3xl mx-auto">
          <div
            className="flex items-center gap-1.5"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={storyTotal}
            aria-valuenow={active + 1}
            aria-label={`Story chapter ${active + 1} of ${storyTotal}`}
          >
            {Array.from({ length: storyTotal }).map((_, i) => (
              <div
                key={i}
                className="h-[3px] flex-1 rounded-full overflow-hidden bg-romantic-300/35"
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #ff80a0, #f43f78)',
                  }}
                  initial={false}
                  animate={{ width: i <= active ? '100%' : '0%' }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-romantic-400 to-romantic-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm ring-2 ring-white/70">
              {initial}
            </span>
            <span className="text-xs font-semibold text-romantic-warm/90">
              {senderName || 'Your surprise'}
            </span>
            <span className="text-[10px] text-romantic-muted/70">· now</span>
            <span className="ml-auto text-[10px] font-medium text-romantic-muted/70 tabular-nums">
              {active + 1}/{storyTotal}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tap zones (edge strips, so content buttons stay usable) ───── */}
      <button
        type="button"
        onClick={onPrev}
        disabled={current <= 1}
        aria-label="Previous story chapter"
        className="fixed left-0 top-24 bottom-24 z-30 w-[12vw] max-w-[70px] cursor-w-resize disabled:opacity-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-romantic-400/60"
      />
      {!isLast && (
        <button
          type="button"
          onClick={onNext}
          aria-label="Next story chapter"
          className="fixed right-0 top-24 bottom-24 z-30 w-[12vw] max-w-[70px] cursor-e-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-romantic-400/60"
        />
      )}
    </>
  );
}
