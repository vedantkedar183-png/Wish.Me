/**
 * Section progress indicator — small dots at the bottom of the screen.
 * Hidden on the Welcome (step 0) and Final (last step) screens.
 */
export default function ProgressDots({ total, current }) {
  if (current === 0 || current === total - 1) return null;

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total - 1}
      aria-label={`Step ${current} of ${total - 1}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-400"
          style={{
            width:  i === current ? '20px' : '8px',
            height: '8px',
            background:
              i === current
                ? 'linear-gradient(90deg,#ff6b9d,#f43f78)'
                : i < current
                ? '#ffb3c6'
                : '#ffe0ea',
            opacity: i === current ? 1 : 0.7,
          }}
        />
      ))}
    </div>
  );
}
