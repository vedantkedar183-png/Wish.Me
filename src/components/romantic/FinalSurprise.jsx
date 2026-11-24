import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';

/* ────────────────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────────────────── */

function seeded(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function NightStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 110 }, (_, i) => ({
        id: i,
        left: seeded(i + 1) * 100,
        top: seeded(i + 41) * 70,
        size: 0.7 + seeded(i + 73) * 2.1,
        opacity: 0.2 + seeded(i + 101) * 0.7,
        duration: 3 + seeded(i + 131) * 5,
        delay: seeded(i + 151) * 6,
        warm: seeded(i + 181) > 0.68,
      })),
    [],
  );

  return (
    <div className="her-stars" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className={`her-star ${star.warm ? 'is-warm' : ''}`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--her-star-opacity': star.opacity,
            '--story-star-opacity': star.opacity,
            '--her-twinkle': `${star.duration}s`,
            '--story-twinkle': `${star.duration}s`,
            '--her-delay': `${star.delay}s`,
            '--story-delay': `${star.delay}s`,
          }}
        />
      ))}
      <span className="her-shooting-star her-shooting-one" />
      <span className="her-shooting-star her-shooting-two" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   The moon
   ──────────────────────────────────────────────────────────────────────────── */

function Moon() {
  return (
    <div className="her-moon" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="her-moon-svg">
        <defs>
          <radialGradient id="herMoonGlow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#fff8dd" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#ffe9b0" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ffb8d2" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="herMoonBody" cx="36%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#fffdf0" />
            <stop offset="46%" stopColor="#ffedbe" />
            <stop offset="82%" stopColor="#e7c07b" />
            <stop offset="100%" stopColor="#b98a4f" />
          </radialGradient>
          <filter id="herMoonBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <circle cx="100" cy="100" r="96" fill="url(#herMoonGlow)" />
        <circle cx="100" cy="100" r="66" fill="url(#herMoonBody)" />
        <g fill="#a8763d" opacity="0.18" filter="url(#herMoonBlur)">
          <circle cx="76" cy="83" r="12" />
          <circle cx="118" cy="72" r="7" />
          <circle cx="126" cy="116" r="10" />
          <circle cx="88" cy="126" r="6" />
          <circle cx="108" cy="98" r="4" />
        </g>
        <circle cx="100" cy="100" r="79" fill="none" stroke="#ffe8b2" strokeWidth="0.7" opacity="0.34" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="#ffc8d9" strokeWidth="0.45" opacity="0.22" />
        <path d="M45 54 Q100 18 155 54" fill="none" stroke="#fff4cf" strokeWidth="1" opacity="0.38" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   The terrace parapet
   ──────────────────────────────────────────────────────────────────────────── */

const BALUSTERS = Array.from({ length: 15 }, (_, i) => 26 + i * 62);

function Parapet() {
  return (
    <div className="her-parapet" aria-hidden="true">
      <svg viewBox="0 0 960 240" className="her-parapet-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="herGround" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b0514" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#07030d" stopOpacity="0.97" />
            <stop offset="100%" stopColor="#040109" />
          </linearGradient>
          <linearGradient id="herCapLight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f2cf8d" stopOpacity="0" />
            <stop offset="18%" stopColor="#f2cf8d" stopOpacity="0.6" />
            <stop offset="72%" stopColor="#ffe7af" stopOpacity="0.52" />
            <stop offset="100%" stopColor="#ffb8d2" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="herLanternGlow">
            <stop offset="0%" stopColor="#ffe3a2" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffe3a2" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ground and parapet face */}
        <rect x="0" y="0" width="960" height="240" fill="url(#herGround)" />
        <rect x="0" y="0" width="960" height="14" fill="#150b1f" />
        <path d="M0 1 H960" stroke="url(#herCapLight)" strokeWidth="2" />
        <rect x="0" y="14" width="960" height="226" fill="#07030e" opacity="0.92" />
        <path d="M0 14 H960" stroke="#a9793e" strokeWidth="1" opacity="0.28" />

        {/* Balustrade grooves */}
        <g className="her-parapet-grooves" stroke="#c79a55" strokeWidth="1.1" opacity="0.12">
          {BALUSTERS.map((x) => (
            <path key={x} d={`M${x} 22 L${x} 232`} />
          ))}
        </g>
        <g className="her-parapet-grooves" stroke="#f2cf8d" strokeWidth="0.7" opacity="0.08">
          <path d="M0 74 H960" />
          <path d="M0 196 H960" />
        </g>

        {/* Potted plant on the left */}
        <g className="her-parapet-plant" transform="translate(34 0)" opacity="0.9">
          <path d="M18 -40 L46 -40 L40 0 L24 0 Z" fill="#241226" stroke="#c99b57" strokeWidth="1" />
          <path d="M32 -40 C17 -64 13 -84 22 -100 C35 -86 38 -64 32 -40" fill="#154a4a" stroke="#3e9c88" strokeWidth="1" />
          <path d="M32 -42 C49 -62 62 -76 64 -94 C47 -90 34 -72 32 -42" fill="#1c615c" stroke="#5fc8b4" strokeWidth="1" />
          <path d="M32 -42 C30 -72 30 -94 39 -114 C50 -92 45 -64 32 -42" fill="#226f68" stroke="#7ae0cc" strokeWidth="1" />
        </g>

        {/* Lantern on the right */}
        <g className="her-parapet-lantern" transform="translate(800 0)">
          <circle cx="30" cy="-30" r="56" fill="url(#herLanternGlow)" />
          <path d="M14 -58 L46 -58 L41 -16 L19 -16 Z" fill="#2a1639" stroke="#f0ca7d" strokeWidth="1" />
          <path d="M21 -50 L39 -50 L35 -24 L25 -24 Z" fill="#ffdda0" opacity="0.82" />
          <path d="M30 -70 L30 -58 M21 -70 L39 -70" stroke="#e9c27a" strokeWidth="1.4" strokeLinecap="round" />
        </g>

        {/* Rose petals on the terrace floor */}
        <g fill="#e78aa6" opacity="0.32">
          <ellipse cx="150" cy="206" rx="6" ry="2.3" transform="rotate(-18 150 206)" />
          <ellipse cx="390" cy="218" rx="5" ry="2" transform="rotate(12 390 218)" />
          <ellipse cx="720" cy="210" rx="7" ry="2.5" transform="rotate(-8 720 210)" />
          <ellipse cx="880" cy="222" rx="4" ry="1.8" transform="rotate(22 880 222)" />
        </g>
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Him, sitting on the parapet, looking up
   ──────────────────────────────────────────────────────────────────────────── */

function SeatedFigure() {
  return (
    <div className="her-seated" aria-hidden="true">
      <svg viewBox="0 0 240 270" className="her-seated-svg">
        <defs>
          <linearGradient id="herRim" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#f2cf8d" stopOpacity="0" />
            <stop offset="48%" stopColor="#ffe7af" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ffb8d2" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="herRimSoft" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#f2cf8d" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffb8d2" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="herSeatGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f2cf8d" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f2cf8d" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="120" cy="196" rx="104" ry="74" fill="url(#herSeatGlow)" />
        <ellipse cx="112" cy="250" rx="70" ry="8" fill="#000" opacity="0.5" />

        {/* Body */}
        <path
          d="M64 250 C60 214 66 184 80 166 C88 154 98 148 108 152 C124 158 132 180 136 206 C139 224 140 238 140 250 Z"
          fill="#08040e"
        />
        {/* Thigh and shin */}
        <path d="M86 250 C92 226 112 202 140 190 L166 214 C142 226 124 240 116 252 Z" fill="#0a0511" />
        <path d="M150 206 C160 218 166 232 166 250 L190 250 C188 226 178 206 162 192 Z" fill="#0a0511" />
        <path d="M160 246 L194 246 C200 246 200 252 194 253 L160 253 Z" fill="#0a0511" />

        {/* Head, tilted up */}
        <path
          d="M96 156 C86 138 90 112 106 102 C122 92 140 102 144 120 L148 125 L143 129 C145 140 140 150 130 156 C118 163 104 163 96 156 Z"
          fill="#08040e"
        />
        <path d="M96 116 C94 100 104 90 118 90 C132 90 142 98 144 110" fill="none" stroke="#0b0612" strokeWidth="6" strokeLinecap="round" />

        {/* Arm resting on the knee */}
        <path d="M104 170 C124 178 142 190 150 200" stroke="#08040e" strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="151" cy="201" r="6" fill="#08040e" />

        {/* Gold rim light */}
        <path d="M67 248 C65 214 70 186 82 168 C90 156 100 150 108 154" fill="none" stroke="url(#herRim)" strokeWidth="2.2" opacity="0.9" />
        <path d="M108 100 C124 94 140 104 144 120 L148 125 L143 129" fill="none" stroke="url(#herRim)" strokeWidth="1.9" opacity="0.95" />
        <path d="M146 192 C162 204 174 224 180 246" fill="none" stroke="url(#herRimSoft)" strokeWidth="1.3" opacity="0.48" />
        <path d="M80 168 C74 190 69 216 69 246" fill="none" stroke="#ffb8d2" strokeWidth="0.8" opacity="0.3" />

        {/* A small star caught on his shoulder */}
        <g fill="#fff3ce" opacity="0.8">
          <circle cx="143" cy="172" r="1.4" />
          <circle cx="154" cy="166" r="0.9" />
        </g>
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Final page
   ──────────────────────────────────────────────────────────────────────────── */

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.14-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.89 9.89m8.42-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42" />
    </svg>
  );
}

export default function FinalSurprise({ onRestart, onShare }) {
  const config = useRomanticConfig();
  const { final, person } = config;
  const reduceMotion = useReducedMotion();

  const shareOnWhatsApp = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const message = `💌 I made this little story for you, ${person.name}.\n\nOpen it here:\n${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const scrollToLetter = () => {
    document.getElementById('her-final-wish')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <section className="her-finale" aria-labelledby="her-finale-title">
      <div className="her-stage">
        <NightStars />
        <div className="her-nebula her-nebula-one" aria-hidden="true" />
        <div className="her-nebula her-nebula-two" aria-hidden="true" />
        <Moon />
        <Parapet />
        <SeatedFigure />
        <div className="her-stage-vignette" aria-hidden="true" />

        <div className="her-copy">
          <motion.p
            className="her-eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            the last page &middot; under one sky
          </motion.p>

          <motion.h2
            id="her-finale-title"
            className="her-title"
            initial={reduceMotion ? false : { opacity: 0, y: 22, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.95, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            Her eyes,
            <span>in my sky.</span>
          </motion.h2>

          <motion.p
            className="her-poem"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.52 }}
          >
            I sat on my terrace tonight. The moon was there. The stars were there.
            Then I found you in all of them &mdash; your eyes, soft as moonlight,
            looking back at me.
          </motion.p>

          <motion.p
            className="her-forever-line"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            My love. <span>My forever.</span>
          </motion.p>

          <motion.div
            className="her-copy-actions"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.88 }}
          >
            <button type="button" className="rani-btn-gold her-btn" onClick={scrollToLetter}>
              Read my last wish <span aria-hidden="true">&darr;</span>
            </button>
            <button type="button" className="her-btn-ghost" onClick={onRestart}>
              Replay our story <span aria-hidden="true">&#8635;</span>
            </button>
          </motion.div>
        </div>

        <motion.button
          type="button"
          className="her-scroll-cue"
          onClick={scrollToLetter}
          aria-label="Scroll to the final wish"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <span>for the last wish</span>
          <i aria-hidden="true">&darr;</i>
        </motion.button>
      </div>

      <div className="her-letter" id="her-final-wish">
        <div className="her-letter-inner">
          <motion.p
            className="her-eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            {final.preText}
          </motion.p>

          <motion.h3
            className="her-letter-title"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.05 }}
          >
            {final.mainWish}
            <span className="shimmer-name">{person.name}</span>
          </motion.h3>

          <p className="her-letter-age">{final.ageText}</p>

          <div className="her-letter-rule" aria-hidden="true">
            <span />
            <i>✦</i>
            <span />
          </div>

          <p className="her-letter-message">{final.message}</p>
          <p className="her-letter-note">{final.emotionalNote}</p>

          <p className="her-letter-forever">My love. My forever.</p>
          <p className="her-letter-signature">
            From {person.yourName}, always in your corner
          </p>

          <div className="her-letter-actions">
            <button type="button" className="rani-btn-gold her-btn" onClick={onRestart}>
              {final.replayText || 'Rewind & relive'}
            </button>
            <button type="button" className="her-btn-ghost" onClick={onShare}>
              Share this story <span aria-hidden="true">&#9825;</span>
            </button>
            <button
              type="button"
              className="her-btn-whatsapp"
              onClick={shareOnWhatsApp}
            >
              <WhatsAppIcon /> Send on WhatsApp
            </button>
          </div>

          <p className="her-letter-footnote">the stars will keep this page for us</p>
        </div>
      </div>
    </section>
  );
}
