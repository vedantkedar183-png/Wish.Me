import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';
import { generateRomanticShareUrl } from '../../utils/encode';
import { getDeviceProfile } from '../../utils/device';
import MusicButton from './MusicButton';
import {
  CONSTELLATION_STARS,
  FOREVER_STAR,
  LETTER_LABELS,
  LETTER_PATHS,
  GALLERY_PIECES,
  HUNDRED_REASONS,
  FOREVER,
  fillName,
} from '../../data/raniConstellation';

/* ────────────────────────────────────────────────────────────────────────────
   Tiny helpers
   ──────────────────────────────────────────────────────────────────────────── */

const SCENES = [
  { id: 'sky', label: 'The Sky', short: 'Sky' },
  { id: 'gallery', label: 'The Gallery', short: 'Gallery' },
  { id: 'reasons', label: '100 Reasons', short: '100' },
  { id: 'forever', label: 'Forever', short: 'Forever' },
];

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const PER_PAGE = 10;
const TOTAL_PAGES = Math.ceil(HUNDRED_REASONS.length / PER_PAGE);

/** Deterministic pseudo-random so the sky is the same on every render. */
function seeded(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

/* ────────────────────────────────────────────────────────────────────────────
   Ambient layers
   ──────────────────────────────────────────────────────────────────────────── */

function Starfield({ count = 110, className = '' }) {
  const { ambientScale } = getDeviceProfile();
  const total = Math.max(14, Math.round(count * ambientScale));
  const stars = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => ({
        id: i,
        left: seeded(i + 1) * 100,
        top: seeded(i + 2) * 100,
        size: 1 + seeded(i + 3) * 2.4,
        opacity: 0.18 + seeded(i + 4) * 0.72,
        duration: 2.8 + seeded(i + 5) * 4.4,
        delay: seeded(i + 6) * 6,
        tint: seeded(i + 7) > 0.86 ? '#ffd6e7' : seeded(i + 8) > 0.7 ? '#ffe9b0' : '#ffffff',
      })),
    [total],
  );

  return (
    <div className={`rani-starfield ${className}`} aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className="rani-bg-star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.tint,
            '--star-opacity': star.opacity,
            '--twinkle-duration': `${star.duration}s`,
            '--twinkle-delay': `${star.delay}s`,
          }}
        />
      ))}
      <span className="rani-shooting-star rani-shooting-star-one" />
      <span className="rani-shooting-star rani-shooting-star-two" />
    </div>
  );
}

function SceneGlow() {
  return (
    <div className="rani-scene-glow" aria-hidden="true">
      <span className="rani-glow-blob rani-glow-blob-one" />
      <span className="rani-glow-blob rani-glow-blob-two" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   The constellation
   ──────────────────────────────────────────────────────────────────────────── */

function Constellation({ found, allFound, onOpenStar, onOpenForever, reduceMotion, lite }) {
  const foundSet = useMemo(() => new Set(found), [found]);

  return (
    <div className="rani-constellation">
      <svg
        className="rani-constellation-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="raniLineGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffe9ae" stopOpacity="0.75" />
            <stop offset="48%" stopColor="#ffafc8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f4c46a" stopOpacity="0.8" />
          </linearGradient>
          <filter id="raniLineGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter={lite ? undefined : 'url(#raniLineGlow)'}>
          {LETTER_PATHS.map((path, index) => (
            <motion.path
              key={path.letter}
              d={path.d}
              fill="none"
              stroke="url(#raniLineGradient)"
              strokeWidth="0.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 2.3, delay: 0.45 + index * 0.22, ease: 'easeInOut' },
                opacity: { duration: 0.5, delay: 0.45 + index * 0.22 },
              }}
            />
          ))}
        </g>

        {allFound && (
          <motion.path
            d="M50 10 L43 22 M50 10 L76 22 M50 10 L10 22"
            fill="none"
            stroke="#ffe9ae"
            strokeWidth="0.14"
            strokeDasharray="0.8 1.6"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ duration: 1.2 }}
          />
        )}
      </svg>

      {CONSTELLATION_STARS.map((star, index) => {
        const isFound = foundSet.has(star.id);
        return (
          <motion.button
            key={star.id}
            type="button"
            onClick={() => onOpenStar(star)}
            className={`rani-star-btn ${isFound ? 'is-found' : ''}`}
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            aria-label={`Open hidden message: ${star.title}`}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: reduceMotion ? 0 : 0.7 + index * 0.075,
              type: 'spring',
              stiffness: 210,
              damping: 15,
            }}
            whileHover={reduceMotion ? undefined : { scale: 1.12 }}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          >
            <span
              className="rani-star-core"
              style={{ '--star-size': `${16 + (index % 3) * 4}px` }}
              aria-hidden="true"
            />
            <span className="rani-star-tip" aria-hidden="true">
              {star.title}
            </span>
          </motion.button>
        );
      })}

      {LETTER_LABELS.map((label) => (
        <span
          key={label.letter}
          className="rani-letter-label"
          style={{ left: `${label.x}%`, top: `${label.y}%` }}
          aria-hidden="true"
        >
          {label.letter}
        </span>
      ))}

      <AnimatePresence>
        {allFound && (
          <motion.button
            type="button"
            onClick={onOpenForever}
            className="rani-forever-star"
            style={{ left: '50%', top: '8%' }}
            aria-label="Open the Forever Star message"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{ type: 'spring', stiffness: 170, damping: 14 }}
          >
            <span className="rani-forever-halo" aria-hidden="true" />
            <span className="rani-star-core" aria-hidden="true" />
            <span className="rani-star-tip" aria-hidden="true">
              The Forever Star
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Gallery artwork — small original SVG pieces, no external photos needed
   ──────────────────────────────────────────────────────────────────────────── */

function RoomArt({ variant, lite }) {
  const artId = `rani-art-${variant}`;

  if (variant === 'dawn') {
    return (
      <svg viewBox="0 0 120 150" className="rani-room-art" role="img" aria-label="A dawn-coloured abstract landscape">
        <defs>
          <linearGradient id={`${artId}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#241238" />
            <stop offset="48%" stopColor="#7d3653" />
            <stop offset="100%" stopColor="#f3b273" />
          </linearGradient>
          <radialGradient id={`${artId}-sun`}>
            <stop offset="0%" stopColor="#fff5cf" />
            <stop offset="55%" stopColor="#ffe0a0" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ffe0a0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="120" height="150" fill={`url(#${artId}-sky)`} />
        <circle cx="60" cy="91" r="38" fill={`url(#${artId}-sun)`} />
        <circle cx="60" cy="91" r="20" fill="#fff0bd" opacity="0.92" />
        <path d="M0 109 Q28 88 58 105 T120 98 V150 H0Z" fill="#3a1626" />
        <path d="M0 124 Q34 105 68 122 T120 113 V150 H0Z" fill="#1e0b15" />
        <path d="M27 55 q4 -5 8 0 q4 -5 8 0" stroke="#ffe9bd" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.8" />
        <path d="M70 43 q3 -4 6 0 q3 -4 6 0" stroke="#ffe9bd" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.65" />
        {[
          [18, 28, 1.2],
          [38, 19, 0.9],
          [88, 24, 1.1],
          [102, 48, 0.8],
          [15, 66, 0.7],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#fff3d6" opacity="0.8" />
        ))}
      </svg>
    );
  }

  if (variant === 'constellation') {
    return (
      <svg viewBox="0 0 120 150" className="rani-room-art" role="img" aria-label="A constellation shaped like a heart">
        <defs>
          <radialGradient id={`${artId}-sky`}>
            <stop offset="0%" stopColor="#1b2450" />
            <stop offset="55%" stopColor="#070b22" />
            <stop offset="100%" stopColor="#03040e" />
          </radialGradient>
          <filter id={`${artId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="120" height="150" fill={`url(#${artId}-sky)`} />
        {[
          [18, 24, 0.7],
          [100, 32, 0.8],
          [28, 122, 0.65],
          [92, 118, 0.75],
          [58, 22, 0.55],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#ffffff" opacity="0.75" />
        ))}
        <g filter={lite ? undefined : `url(#${artId}-glow)`}>
          <path
            d="M60 112 L40 88 L31 71 L35 55 L50 49 L60 62 L70 49 L85 55 L89 71 L80 88 Z"
            fill="none"
            stroke="#ffdca0"
            strokeWidth="0.9"
            strokeLinejoin="round"
            opacity="0.8"
          />
          {[
            [60, 112],
            [40, 88],
            [31, 71],
            [35, 55],
            [50, 49],
            [60, 62],
            [70, 49],
            [85, 55],
            [89, 71],
            [80, 88],
          ].map(([cx, cy], i) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={i % 3 === 0 ? 1.8 : 1.25} fill="#fff4cf" />
          ))}
        </g>
        <text x="60" y="132" textAnchor="middle" fill="#ffdca0" fontSize="6" letterSpacing="2.4" opacity="0.75">
          US
        </text>
      </svg>
    );
  }

  if (variant === 'bloom') {
    return (
      <svg viewBox="0 0 120 150" className="rani-room-art" role="img" aria-label="A deep rose in bloom">
        <defs>
          <linearGradient id={`${artId}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b1022" />
            <stop offset="100%" stopColor="#13060d" />
          </linearGradient>
          <radialGradient id={`${artId}-petal`}>
            <stop offset="0%" stopColor="#ffd0dd" />
            <stop offset="55%" stopColor="#e55a86" />
            <stop offset="100%" stopColor="#8e2249" />
          </radialGradient>
          <radialGradient id={`${artId}-heart`}>
            <stop offset="0%" stopColor="#fff0c4" />
            <stop offset="100%" stopColor="#d4a24c" />
          </radialGradient>
        </defs>
        <rect width="120" height="150" fill={`url(#${artId}-bg)`} />
        <g transform="translate(60 74)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse
              key={angle}
              cx="0"
              cy="-26"
              rx="12"
              ry="27"
              fill={`url(#${artId}-petal)`}
              opacity="0.78"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle r="15" fill={`url(#${artId}-heart)`} />
          <circle r="24" fill="none" stroke="#ffd9e5" strokeWidth="0.6" opacity="0.4" />
        </g>
        <path d="M60 104 C62 118 58 126 60 140" stroke="#7a2b40" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M60 118 C50 114 44 118 42 126 C52 130 58 126 60 118Z" fill="#6f283c" opacity="0.9" />
        <path d="M60 126 C70 122 76 126 78 134 C68 138 62 134 60 126Z" fill="#5e2033" opacity="0.9" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 150" className="rani-room-art" role="img" aria-label="Two golden interlocking rings under stars">
      <defs>
        <linearGradient id={`${artId}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c0818" />
          <stop offset="100%" stopColor="#1d102c" />
        </linearGradient>
        <linearGradient id={`${artId}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff0bd" />
          <stop offset="45%" stopColor="#e0b25c" />
          <stop offset="100%" stopColor="#9c6a23" />
        </linearGradient>
        <filter id={`${artId}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="120" height="150" fill={`url(#${artId}-bg)`} />
      {[
        [20, 30, 0.8],
        [98, 24, 0.7],
        [30, 118, 0.6],
        [90, 122, 0.9],
        [60, 20, 0.5],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#fff5d6" opacity="0.8" />
      ))}
      <g filter={lite ? undefined : `url(#${artId}-glow)`} fill="none" stroke={`url(#${artId}-gold)`}>
        <ellipse cx="48" cy="76" rx="22" ry="28" strokeWidth="1.5" transform="rotate(-18 48 76)" />
        <ellipse cx="72" cy="76" rx="22" ry="28" strokeWidth="1.5" transform="rotate(18 72 76)" />
        <path d="M40 108 Q60 116 80 108" strokeWidth="0.8" opacity="0.55" />
      </g>
      <text x="60" y="132" textAnchor="middle" fill="#e8c47c" fontSize="5.5" letterSpacing="2.2" opacity="0.85">
        FOREVER
      </text>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Scene one — the constellation
   ──────────────────────────────────────────────────────────────────────────── */

function SkyScene({ name, found, allFound, onOpenStar, onOpenForever, onEnter, reduceMotion, lite }) {
  const progress = Math.round((found.length / CONSTELLATION_STARS.length) * 100);

  return (
    <section className="rani-scene rani-scene-sky" aria-labelledby="rani-sky-title">
      <Starfield count={130} />
      <SceneGlow />

      <div className="rani-scene-inner rani-hero-inner">
        <motion.p
          className="rani-eyebrow"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          a private universe &middot; for {name}
        </motion.p>

        <motion.h1
          id="rani-sky-title"
          className="rani-hero-title"
          initial={reduceMotion ? false : lite ? { opacity: 0, y: 18 } : { opacity: 0, y: 22, filter: 'blur(10px)' }}
          animate={lite ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.05, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {name}
        </motion.h1>

        <motion.p
          className="rani-hero-sub"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Every star here is holding something I never knew how to say aloud.
          <br className="hidden sm:block" /> Tap one, and let it tell you.
        </motion.p>

        <Constellation
          found={found}
          allFound={allFound}
          onOpenStar={onOpenStar}
          onOpenForever={onOpenForever}
          reduceMotion={reduceMotion}
          lite={lite}
        />

        <div className="rani-progress-block">
          <div className="rani-progress-labels">
            <span>{found.length} of {CONSTELLATION_STARS.length} hidden stars found</span>
            <span>{allFound ? 'the whole sky is awake' : 'each one is a little piece of us'}</span>
          </div>
          <div className="rani-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <motion.span
              className="rani-progress-fill"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="rani-hero-actions">
          <button type="button" className="rani-btn-gold" onClick={onEnter}>
            Enter the exhibition <span aria-hidden="true">→</span>
          </button>
          <p className="rani-hint">
            {allFound
              ? 'You found every star. The Forever Star is waiting above.'
              : 'Or step inside and come back for the stars later.'}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Scene two — the virtual gallery
   ──────────────────────────────────────────────────────────────────────────── */

function GalleryScene({ name, onOpenPiece, onContinue, reduceMotion, lite }) {
  return (
    <section className="rani-scene rani-scene-gallery" aria-labelledby="rani-gallery-title">
      <Starfield count={55} className="rani-starfield-dim" />
      <div className="rani-scene-inner rani-gallery-inner">
        <motion.p
          className="rani-eyebrow"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          the virtual exhibition
        </motion.p>

        <motion.h2
          id="rani-gallery-title"
          className="rani-display-title"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
        >
          A room built from us
        </motion.h2>

        <motion.p
          className="rani-sub"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Four frames. One lifetime inside them. Walk in slowly, {name} — the walls remember.
        </motion.p>

        <motion.div
          className="rani-gallery-stage"
          initial={reduceMotion ? false : { opacity: 0, y: 26, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rani-gallery-room">
            <div className="rani-room-ceiling" aria-hidden="true" />
            <div className="rani-room-side rani-room-side-left" aria-hidden="true">
              <span className="rani-sconce" />
            </div>
            <div className="rani-room-side rani-room-side-right" aria-hidden="true">
              <span className="rani-sconce" />
            </div>

            <div className="rani-room-backwall">
              <p className="rani-gallery-sign">The Gallery of Us</p>
              <div className="rani-frame-grid">
                {GALLERY_PIECES.map((piece, index) => (
                  <motion.button
                    key={piece.id}
                    type="button"
                    onClick={() => onOpenPiece(piece)}
                    className="rani-frame"
                    aria-label={`Open exhibit: ${piece.title}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.45 + index * 0.12 }}
                    whileHover={reduceMotion ? undefined : { y: -5, scale: 1.035 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                  >
                    <span className="rani-frame-art">
                      <RoomArt variant={piece.art} lite={lite} />
                      <span className="rani-frame-sheen" aria-hidden="true" />
                    </span>
                    <span className="rani-frame-plaque">{piece.title}</span>
                  </motion.button>
                ))}
              </div>
              <p className="rani-gallery-vision">four frames &middot; one life I would live again</p>
            </div>

            <div className="rani-room-floor" aria-hidden="true">
              <span className="rani-floor-path" />
            </div>
            <div className="rani-room-centerpiece" aria-hidden="true">
              <span className="rani-pedestal-orb" />
              <span className="rani-pedestal" />
            </div>
            <div className="rani-room-spotlight rani-spot-left" aria-hidden="true" />
            <div className="rani-room-spotlight rani-spot-right" aria-hidden="true" />
            <div className="rani-room-vignette" aria-hidden="true" />
          </div>
        </motion.div>

        <p className="rani-gallery-note">
          Every frame is a door. Tap one and I will tell you what I see when I look at it.
        </p>

        <button type="button" className="rani-btn-gold" onClick={onContinue}>
          Continue to the hundred reasons <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Scene three — one hundred reasons
   ──────────────────────────────────────────────────────────────────────────── */

const reasonVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 36 : -36,
    filter: 'blur(5px)',
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -28 : 28,
    filter: 'blur(4px)',
    transition: { duration: 0.25, ease: 'easeIn' },
  }),
};

const liteReasonVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 26 : -26,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -20 : 20,
    transition: { duration: 0.18, ease: 'easeIn' },
  }),
};

function ReasonsScene({ name, page, direction, onPage, onForever, reduceMotion, lite }) {
  const start = page * PER_PAGE;
  const reasons = HUNDRED_REASONS.slice(start, start + PER_PAGE);

  const goPrev = () => onPage(Math.max(0, page - 1), -1);
  const goNext = () => {
    if (page >= TOTAL_PAGES - 1) {
      onForever();
      return;
    }
    onPage(page + 1, 1);
  };

  return (
    <section className="rani-scene rani-scene-reasons" aria-labelledby="rani-reasons-title">
      <Starfield count={70} className="rani-starfield-dim" />
      <SceneGlow />
      <div className="rani-scene-inner rani-reasons-inner">
        <motion.p
          className="rani-eyebrow"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          the hundred reasons wing
        </motion.p>

        <motion.h2
          id="rani-reasons-title"
          className="rani-display-title"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
        >
          One hundred reasons
        </motion.h2>

        <motion.p
          className="rani-sub"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.18 }}
        >
          why I love you, {name} &mdash; ten little truths at a time
        </motion.p>

        <motion.div
          className="rani-reasons-panel"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.26 }}
        >
          <div className="rani-reasons-head">
            <span className="rani-reasons-chapter">Chapter {ROMAN[page]}</span>
            <span className="rani-reasons-range">
              {start + 1}&ndash;{Math.min(start + PER_PAGE, HUNDRED_REASONS.length)} of 100
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={page}
              className="rani-reason-grid"
              custom={direction}
              variants={reduceMotion ? undefined : lite ? liteReasonVariants : reasonVariants}
              initial={reduceMotion ? { opacity: 0 } : 'enter'}
              animate={reduceMotion ? { opacity: 1 } : 'center'}
              exit={reduceMotion ? { opacity: 0 } : 'exit'}
            >
              {reasons.map((reason, index) => {
                const number = start + index + 1;
                return (
                  <article
                    key={number}
                    className={`rani-reason ${number === 100 ? 'is-hundred' : ''}`}
                  >
                    <span className="rani-reason-number" aria-hidden="true">
                      {String(number).padStart(2, '0')}
                    </span>
                    <p className="rani-reason-text">{reason}</p>
                  </article>
                );
              })}
            </motion.div>
          </AnimatePresence>

          <div className="rani-pager">
            <button
              type="button"
              className="rani-pager-arrow"
              onClick={goPrev}
              disabled={page === 0}
              aria-label="Previous ten reasons"
            >
              ←
            </button>

            <div className="rani-page-dots" role="tablist" aria-label="Reason chapters">
              {ROMAN.map((roman, index) => (
                <button
                  key={roman}
                  type="button"
                  role="tab"
                  aria-selected={page === index}
                  aria-label={`Chapter ${roman}, reasons ${index * PER_PAGE + 1} to ${Math.min((index + 1) * PER_PAGE, 100)}`}
                  className={`rani-page-dot ${page === index ? 'is-active' : ''}`}
                  onClick={() => onPage(index, index > page ? 1 : -1)}
                >
                  {roman}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="rani-pager-arrow"
              onClick={goNext}
              aria-label={page === TOTAL_PAGES - 1 ? 'Go to the forever letter' : 'Next ten reasons'}
            >
              {page === TOTAL_PAGES - 1 ? '∞' : '→'}
            </button>
          </div>

          <div className="rani-reason-progress" aria-hidden="true">
            <motion.span
              initial={false}
              animate={{ width: `${((page + 1) / TOTAL_PAGES) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        <button type="button" className="rani-btn-ghost" onClick={onForever}>
          Read my forever letter <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Scene four — forever
   ──────────────────────────────────────────────────────────────────────────── */

const HEART_POINTS = [
  [50, 72],
  [32, 54],
  [24, 42],
  [27, 31],
  [38, 26],
  [50, 35],
  [62, 26],
  [73, 31],
  [76, 42],
  [68, 54],
];

function HeartConstellation({ reduceMotion, name, lite }) {
  return (
    <motion.div
      className="rani-heart-map"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className="rani-heart-svg">
        <defs>
          <linearGradient id="raniHeartLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffe9ae" />
            <stop offset="50%" stopColor="#ff9fbb" />
            <stop offset="100%" stopColor="#ffe9ae" />
          </linearGradient>
          <filter id="raniHeartGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d="M50 72 L32 54 L24 42 L27 31 L38 26 L50 35 L62 26 L73 31 L76 42 L68 54 Z"
          fill="rgba(244, 63, 120, 0.05)"
          stroke="url(#raniHeartLine)"
          strokeWidth="0.42"
          strokeLinejoin="round"
          filter={lite ? undefined : 'url(#raniHeartGlow)'}
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, delay: 0.4, ease: 'easeInOut' }}
        />

        {HEART_POINTS.map(([cx, cy], index) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={index === 5 ? 1.9 : 1.25}
            fill="#fff2c8"
            initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 + index * 0.07, type: 'spring', stiffness: 240, damping: 16 }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        ))}

        <circle cx="50" cy="48" r="10" fill="rgba(255, 180, 205, 0.1)" />
        <circle cx="50" cy="48" r="4" fill="rgba(255, 224, 173, 0.22)" />
      </svg>

      <span className="rani-heart-caption">{name} &amp; forever</span>
    </motion.div>
  );
}

function ForeverScene({ name, onRestart, onNext, standalone, shareUrl, reduceMotion, lite }) {
  const [copied, setCopied] = useState(false);

  const copyPage = () => {
    if (!navigator.clipboard || typeof window === 'undefined') return;
    navigator.clipboard
      .writeText(shareUrl || window.location.href)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      })
      .catch(() => {});
  };

  const shareOnWhatsApp = () => {
    if (typeof window === 'undefined') return;
    const url = shareUrl || window.location.href;
    const message = `💌 I made this little universe for you, ${name}.\n\nOpen it here:\n${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <section className="rani-scene rani-scene-forever" aria-labelledby="rani-forever-title">
      <Starfield count={100} />
      <SceneGlow />

      <div className="rani-scene-inner rani-forever-inner">
        <motion.p
          className="rani-eyebrow"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {FOREVER.eyebrow}
        </motion.p>

        <motion.h2
          id="rani-forever-title"
          className="rani-forever-title"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08 }}
        >
          My love.
          <span>My forever.</span>
        </motion.h2>

        <HeartConstellation reduceMotion={reduceMotion} name={name} lite={lite} />

        <motion.div
          className="rani-letter-card"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <p className="rani-letter-intro">{fillName(FOREVER.intro, name)}</p>
          {FOREVER.paragraphs.map((paragraph) => (
            <p key={paragraph} className="rani-letter-paragraph">
              {fillName(paragraph, name)}
            </p>
          ))}
          <p className="rani-letter-signature">{FOREVER.signature}</p>
        </motion.div>

        <motion.div
          className="rani-final-reason"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          <span className="rani-final-reason-number">100</span>
          <p>{FOREVER.finalReason}</p>
        </motion.div>

        <div className="rani-forever-actions">
          <button type="button" className="rani-btn-ghost" onClick={onRestart}>
            Replay our universe <span aria-hidden="true">↺</span>
          </button>
          {onNext ? (
            <button type="button" className="rani-btn-gold" onClick={onNext}>
              One last surprise <span aria-hidden="true">→</span>
            </button>
          ) : standalone ? (
            <>
              <button type="button" className="rani-btn-ghost" onClick={copyPage}>
                {copied ? 'Link copied' : 'Copy link'} <span aria-hidden="true">{copied ? '✓' : '🔗'}</span>
              </button>
              <button type="button" className="rani-btn-gold" onClick={shareOnWhatsApp}>
                Share on WhatsApp <span aria-hidden="true">💬</span>
              </button>
            </>
          ) : null}
        </div>

        <p className="rani-signature-note">made of stars, carried by love</p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Story modal
   ──────────────────────────────────────────────────────────────────────────── */

function StoryModal({ item, kind, onClose, onNext, nextLabel }) {
  const titleId = useId();
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      className="rani-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="rani-modal"
        initial={{ opacity: 0, y: 26, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
      >
        <button type="button" onClick={onClose} className="rani-modal-close" aria-label="Close message">
          &times;
        </button>

        <p className="rani-modal-eyebrow">
          {kind === 'star' ? `star of ${item.letter}` : item.chapter}
        </p>
        <span className="rani-modal-emoji" aria-hidden="true">
          {item.emoji || '\u2726'}
        </span>
        <h3 id={titleId} className="rani-modal-title">
          {item.title}
        </h3>
        <p className="rani-modal-body">{item.message || item.body}</p>

        <div className="rani-modal-actions">
          {onNext && (
            <button type="button" className="rani-btn-gold rani-btn-sm" onClick={onNext}>
              {nextLabel}
            </button>
          )}
          <button type="button" className="rani-btn-ghost rani-btn-sm" onClick={onClose}>
            {kind === 'star' ? 'Return to the sky' : 'Step back into the room'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Main orchestrator
   ──────────────────────────────────────────────────────────────────────────── */

const sceneVariants = {
  initial: { opacity: 0, scale: 1.025, filter: 'blur(8px)' },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.985,
    filter: 'blur(6px)',
    transition: { duration: 0.4, ease: 'easeIn' },
  },
};

const liteSceneVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function ConstellationExhibition({ name: nameProp, onNext, standalone = false }) {
  const config = useRomanticConfig();
  const name = (nameProp || config?.person?.name || 'Rani').trim();
  const reduceMotion = useReducedMotion();
  const { reduceAmbient: lite } = getDeviceProfile();

  // Inside the romantic story the address bar can be `/romantic` with no
  // payload (preview hand-off), so build a self-contained link. The standalone
  // /rani page needs no payload and can share its own address.
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    if (standalone) return window.location.href;
    try {
      return generateRomanticShareUrl(config)?.url || window.location.href;
    } catch {
      return window.location.href;
    }
  }, [standalone, config]);

  const [scene, setScene] = useState(() => {
    if (!standalone || typeof window === 'undefined') return 'sky';
    const requested = new URLSearchParams(window.location.search).get('scene');
    return SCENES.some((item) => item.id === requested) ? requested : 'sky';
  });
  const [found, setFound] = useState([]);
  const [activeStar, setActiveStar] = useState(null);
  const [activePiece, setActivePiece] = useState(null);
  const [reasonPage, setReasonPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [curtain, setCurtain] = useState(false);

  const timers = useRef([]);

  useEffect(
    () => () => {
      timers.current.forEach((timer) => clearTimeout(timer));
    },
    [],
  );

  const allFound = found.length === CONSTELLATION_STARS.length;

  const openStar = useCallback((star) => {
    setActiveStar(star);
    if (!CONSTELLATION_STARS.some((item) => item.id === star.id)) return;
    setFound((previous) =>
      previous.includes(star.id) ? previous : [...previous, star.id],
    );
  }, []);

  const openNextStar = useCallback(() => {
    if (!activeStar) return;
    const currentIndex = CONSTELLATION_STARS.findIndex((star) => star.id === activeStar.id);
    const nextStar = CONSTELLATION_STARS[(currentIndex + 1) % CONSTELLATION_STARS.length];
    setActiveStar(nextStar);
    setFound((previous) =>
      previous.includes(nextStar.id) ? previous : [...previous, nextStar.id],
    );
  }, [activeStar]);

  const openNextPiece = useCallback(() => {
    if (!activePiece) return;
    const currentIndex = GALLERY_PIECES.findIndex((piece) => piece.id === activePiece.id);
    setActivePiece(GALLERY_PIECES[(currentIndex + 1) % GALLERY_PIECES.length]);
  }, [activePiece]);

  const scrollToSceneTop = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const changeScene = useCallback(
    (nextScene) => {
      if (nextScene === scene || curtain) return;

      if (reduceMotion) {
        setScene(nextScene);
        scrollToSceneTop();
        return;
      }

      setCurtain(true);
      const swapTimer = setTimeout(() => {
        setScene(nextScene);
        scrollToSceneTop();
      }, 420);
      const clearTimer = setTimeout(() => setCurtain(false), 1080);
      timers.current.push(swapTimer, clearTimer);
    },
    [scene, curtain, reduceMotion, scrollToSceneTop],
  );

  const handleReasonPage = useCallback((nextPage, nextDirection) => {
    setDirection(nextDirection);
    setReasonPage(nextPage);
  }, []);

  const restart = useCallback(() => {
    setFound([]);
    setReasonPage(0);
    setDirection(1);
    setActiveStar(null);
    setActivePiece(null);

    if (scene === 'sky') {
      scrollToSceneTop();
      return;
    }
    changeScene('sky');
  }, [scene, changeScene, scrollToSceneTop]);

  return (
    <div className={`rani-page ${lite ? 'rani-page-lite' : ''}`}>
      <div className="rani-film-grain" aria-hidden="true" />

      {standalone && <MusicButton />}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={scene}
          variants={reduceMotion ? undefined : lite ? liteSceneVariants : sceneVariants}
          initial={reduceMotion ? { opacity: 0 } : 'initial'}
          animate={reduceMotion ? { opacity: 1 } : 'animate'}
          exit={reduceMotion ? { opacity: 0 } : 'exit'}
        >
          {scene === 'sky' && (
            <SkyScene
              name={name}
              found={found}
              allFound={allFound}
              onOpenStar={openStar}
              onOpenForever={() => openStar(FOREVER_STAR)}
              onEnter={() => changeScene('gallery')}
              reduceMotion={reduceMotion}
              lite={lite}
            />
          )}

          {scene === 'gallery' && (
            <GalleryScene
              name={name}
              onOpenPiece={setActivePiece}
              onContinue={() => changeScene('reasons')}
              reduceMotion={reduceMotion}
              lite={lite}
            />
          )}

          {scene === 'reasons' && (
            <ReasonsScene
              name={name}
              page={reasonPage}
              direction={direction}
              onPage={handleReasonPage}
              onForever={() => changeScene('forever')}
              reduceMotion={reduceMotion}
              lite={lite}
            />
          )}

          {scene === 'forever' && (
            <ForeverScene
              name={name}
              onRestart={restart}
              onNext={onNext}
              standalone={standalone}
              shareUrl={shareUrl}
              reduceMotion={reduceMotion}
              lite={lite}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Scene navigation */}
      <nav className="rani-scene-nav" aria-label="Story scenes">
        {SCENES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => changeScene(item.id)}
            className={`rani-nav-btn ${scene === item.id ? 'is-active' : ''}`}
            aria-current={scene === item.id ? 'step' : undefined}
          >
            <span className="rani-nav-index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="rani-nav-label">{item.short}</span>
          </button>
        ))}
      </nav>

      {/* Cinematic curtain between scenes */}
      <AnimatePresence>
        {curtain && (
          <motion.div
            className="rani-curtain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            aria-hidden="true"
          >
            <motion.span
              className="rani-curtain-orb"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              transition={{ duration: 0.95, ease: 'easeOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden message / exhibit modal */}
      <AnimatePresence>
        {activeStar && (
          <StoryModal
            key={`star-${activeStar.id}`}
            item={activeStar}
            kind="star"
            onClose={() => setActiveStar(null)}
            onNext={openNextStar}
            nextLabel="Another star →"
          />
        )}
        {activePiece && (
          <StoryModal
            key={`piece-${activePiece.id}`}
            item={activePiece}
            kind="piece"
            onClose={() => setActivePiece(null)}
            onNext={openNextPiece}
            nextLabel="Next frame →"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
