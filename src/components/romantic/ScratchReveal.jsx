import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const REVEAL_THRESHOLD = 0.52;
const BRUSH_RADIUS = 24;

/**
 * Scratch-card reveal.
 *
 * A gradient card covers its children. Dragging a finger/mouse erases the
 * canvas; once roughly half the surface is cleared, the card fades away and
 * `onRevealed` fires. Also exposes an instant-reveal button for accessibility
 * and for people who don't want to scratch.
 */
export default function ScratchReveal({
  children,
  onRevealed,
  className = '',
  label = 'Scratch to reveal ✨',
  hint = 'Use your finger or mouse',
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastRef = useRef(null);
  const strokesRef = useRef(0);
  const doneRef = useRef(false);

  const [revealed, setRevealed] = useState(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    drawingRef.current = false;
    setRevealed(true);
    onRevealed?.();
  }, [onRevealed]);

  /** Paint the scratchable surface at the container's current size. */
  const paint = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const rect = wrap.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, width, height);

    // Rose gradient base
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f9a8d4');
    gradient.addColorStop(0.48, '#f472b6');
    gradient.addColorStop(1, '#e11d48');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Deterministic sparkle speckles
    for (let i = 0; i < 52; i += 1) {
      const x = (((i * 73) % 100) / 100) * width;
      const y = (((i * 37) % 100) / 100) * height;
      const r = 1 + (i % 3);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.08 + (i % 4) * 0.035})`;
      ctx.fill();
    }

    // Dashed inner border
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(10, 10, width - 20, height - 20);
    ctx.setLineDash([]);

    // Labels
    const titleSize = Math.max(15, Math.min(23, width / 15));
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = `700 ${titleSize}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.97)';
    ctx.fillText(label, width / 2, height / 2 - titleSize * 0.55);

    ctx.font = `500 ${Math.max(10, titleSize * 0.52)}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.fillText(hint, width / 2, height / 2 + titleSize * 0.85);
  }, [label, hint]);

  useLayoutEffect(() => {
    paint();

    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(() => {
      // Never repaint over the user's progress.
      if (strokesRef.current === 0 && !doneRef.current) paint();
    });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [paint]);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const checkCleared = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let sampled = 0;
    // Sample every 8th pixel — plenty accurate, much cheaper.
    for (let i = 3; i < data.length; i += 4 * 8) {
      sampled += 1;
      if (data[i] < 40) cleared += 1;
    }
    if (sampled > 0 && cleared / sampled >= REVEAL_THRESHOLD) finish();
  };

  const scratchAt = (point) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';

    // Bridge gaps between pointer samples for fast swipes.
    if (lastRef.current) {
      ctx.lineWidth = BRUSH_RADIUS * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastRef.current.x, lastRef.current.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(point.x, point.y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    lastRef.current = point;
    strokesRef.current += 1;

    if (strokesRef.current % 6 === 0) checkCleared();
  };

  const handlePointerDown = (event) => {
    if (doneRef.current) return;
    event.preventDefault();
    drawingRef.current = true;
    lastRef.current = null;
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      // ignore
    }
    const point = getPoint(event);
    if (point) scratchAt(point);
  };

  const handlePointerMove = (event) => {
    if (!drawingRef.current || doneRef.current) return;
    event.preventDefault();
    const point = getPoint(event);
    if (point) scratchAt(point);
  };

  const handlePointerUp = (event) => {
    drawingRef.current = false;
    lastRef.current = null;
    try {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {children}

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="absolute inset-0 rounded-[inherit]"
        style={{
          zIndex: 10,
          touchAction: 'none',
          cursor: doneRef.current ? 'default' : 'crosshair',
          opacity: revealed ? 0 : 1,
          pointerEvents: revealed ? 'none' : 'auto',
          transition: 'opacity 0.65s ease',
        }}
      />

      {!revealed && (
        <button
          type="button"
          onClick={finish}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-romantic-600 shadow-md hover:bg-white transition-colors"
          style={{ zIndex: 20 }}
        >
          Reveal instantly ✨
        </button>
      )}
    </div>
  );
}
