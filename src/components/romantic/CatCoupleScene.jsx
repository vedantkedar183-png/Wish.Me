import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Scene three — the little cat page.
 *
 * Two cats (a ginger boy and a lilac-grey girl) sit on a cushion under a
 * glowing heart moon. Tap them and they lean in for a kiss while a burst of
 * hearts floats up. It replaces the old "one hundred reasons" scene.
 */

const BURST = [
  { dx: -96, delay: 0 },
  { dx: -58, delay: 0.06 },
  { dx: -24, delay: 0.12 },
  { dx: 18, delay: 0.04 },
  { dx: 54, delay: 0.1 },
  { dx: 92, delay: 0.16 },
  { dx: 0, delay: 0.2 },
];

/** Deterministic little stars so the sky never jumps between renders. */
function seeded(seed) {
  const value = Math.sin(seed * 91.7 + 17.3) * 43758.5453;
  return value - Math.floor(value);
}

export default function CatCoupleScene({ name, onForever, reduceMotion = false, lite = false }) {
  const uid = useId().replace(/:/g, '');
  const [kissing, setKissing] = useState(false);
  const [kissKey, setKissKey] = useState(0);
  const timer = useRef(null);

  const stars = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: 4 + seeded(i + 1) * 92,
        top: 3 + seeded(i + 2) * 70,
        size: 1 + seeded(i + 3) * 2.2,
        delay: seeded(i + 4) * 4,
        duration: 2.6 + seeded(i + 5) * 3.4,
      })),
    [],
  );

  const kiss = useCallback(() => {
    setKissKey((key) => key + 1);
    setKissing(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setKissing(false), 1500);
  }, []);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const loop = setInterval(kiss, 6800);
    return () => clearInterval(loop);
  }, [kiss, reduceMotion]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const ginger = `cat-ginger-${uid}`;
  const grey = `cat-grey-${uid}`;
  const cream = `cat-cream-${uid}`;
  const heart = `cat-heart-${uid}`;
  const cushion = `cat-cushion-${uid}`;
  const glow = `cat-glow-${uid}`;

  return (
    <section
      className="rani-scene rani-scene-cats"
      aria-labelledby="rani-cats-title"
    >
      {/* Night sky */}
      <div className="rani-starfield rani-starfield-dim" aria-hidden="true">
        {stars.map((star) => (
          <span
            key={star.id}
            className="rani-bg-star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: star.id % 4 === 0 ? '#ffd6e7' : '#ffffff',
              '--star-opacity': 0.25 + seeded(star.id + 9) * 0.5,
              '--twinkle-duration': `${star.duration}s`,
              '--twinkle-delay': `${star.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="rani-scene-glow" aria-hidden="true">
        <span className="rani-glow-blob rani-glow-blob-one" />
        <span className="rani-glow-blob rani-glow-blob-two" />
      </div>

      <div className="rani-scene-inner rani-cats-inner">
        <motion.p
          className="rani-eyebrow"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          the little cat page
        </motion.p>

        <motion.h2
          id="rani-cats-title"
          className="rani-display-title"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
        >
          Two of us, in every life
        </motion.h2>

        <motion.p
          className="rani-sub"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.18 }}
        >
          If we came back as cats, {name}, I would still find you &mdash; and still
          lean in for the same kiss.
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 26, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="rani-cats-wrap"
        >
          <button
            type="button"
            onClick={kiss}
            className={`rani-cats-stage ${kissing ? 'is-kissing' : ''}`}
            aria-label="Tap the two cats to make them kiss"
          >
            <svg
              viewBox="0 0 420 360"
              className="rani-cats-svg"
              role="img"
              aria-label={`Two little cats in love, one ginger and one grey, leaning in to kiss under a heart moon`}
            >
              <defs>
                <radialGradient id={glow} cx="50%" cy="42%" r="58%">
                  <stop offset="0%" stopColor="#ff9fbb" stopOpacity="0.4" />
                  <stop offset="55%" stopColor="#ff9fbb" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ff9fbb" stopOpacity="0" />
                </radialGradient>
                <linearGradient id={heart} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffe9ae" />
                  <stop offset="46%" stopColor="#ff9fbb" />
                  <stop offset="100%" stopColor="#f43f78" />
                </linearGradient>
                <linearGradient id={ginger} x1="0" y1="0" x2="0.4" y2="1">
                  <stop offset="0%" stopColor="#ffc98f" />
                  <stop offset="52%" stopColor="#f2a35f" />
                  <stop offset="100%" stopColor="#d97c3c" />
                </linearGradient>
                <linearGradient id={grey} x1="0" y1="0" x2="0.4" y2="1">
                  <stop offset="0%" stopColor="#f0e8f6" />
                  <stop offset="52%" stopColor="#cfc2dd" />
                  <stop offset="100%" stopColor="#a892bd" />
                </linearGradient>
                <linearGradient id={cream} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fffaf1" />
                  <stop offset="100%" stopColor="#ffe9d6" />
                </linearGradient>
                <linearGradient id={cushion} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#5a2338" />
                  <stop offset="48%" stopColor="#8c3a55" />
                  <stop offset="100%" stopColor="#4a1c2e" />
                </linearGradient>
                <filter id={`${uid}-soft`} x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* halo */}
              <ellipse cx="210" cy="188" rx="186" ry="164" fill={`url(#${glow})`} />

              {/* stars */}
              <g className="cat-stars" fill="#ffe9bd">
                <circle cx="72" cy="64" r="1.6" opacity="0.8" />
                <circle cx="348" cy="84" r="1.4" opacity="0.7" />
                <circle cx="118" cy="118" r="1.1" opacity="0.55" />
                <circle cx="318" cy="142" r="1.2" opacity="0.6" />
                <circle cx="56" cy="178" r="1" opacity="0.45" />
                <circle cx="368" cy="200" r="1" opacity="0.4" />
              </g>

              {/* heart moon */}
              <g className="cat-heart-moon">
                <path
                  d="M210 130 C 184 108, 162 88, 174 64 C 186 42, 210 54, 210 76 C 210 54, 234 42, 246 64 C 258 88, 236 108, 210 130 Z"
                  fill={`url(#${heart})`}
                  opacity="0.9"
                  filter={lite ? undefined : `url(#${uid}-soft)`}
                />
                <path
                  d="M210 122 C 189 104, 172 88, 181 70 C 190 53, 208 62, 210 80 C 212 62, 230 53, 239 70 C 248 88, 231 104, 210 122 Z"
                  fill="#fff4d6"
                  opacity="0.22"
                />
              </g>

              {/* cushion */}
              <ellipse cx="210" cy="308" rx="164" ry="34" fill="#170810" opacity="0.85" />
              <ellipse cx="210" cy="300" rx="150" ry="32" fill={`url(#${cushion})`} />
              <path
                d="M62 300 Q210 338 358 300"
                fill="none"
                stroke="#f5d488"
                strokeOpacity="0.28"
                strokeWidth="2"
              />
              <path
                d="M86 307 Q210 338 334 307"
                fill="none"
                stroke="#f5d488"
                strokeOpacity="0.16"
                strokeWidth="1.4"
              />
              <g stroke="#f5d488" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round">
                <path d="M60 298 l-8 8 M64 306 l-7 6" />
                <path d="M360 298 l8 8 M356 306 l7 6" />
              </g>

              {/* ── left cat (ginger) ── */}
              <g className="cat-body-left">
                <g className="cat-tail cat-tail-left">
                  <path
                    d="M110 294 C 66 288, 48 244, 74 222 C 96 203, 120 220, 108 240"
                    fill="none"
                    stroke={`url(#${ginger})`}
                    strokeWidth="15"
                    strokeLinecap="round"
                  />
                  <path
                    d="M108 240 C 102 232, 94 228, 86 228"
                    fill="none"
                    stroke="#fff0dc"
                    strokeWidth="10"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                </g>
                <path
                  d="M98 302 C 96 262, 114 232, 150 230 C 186 232, 204 262, 202 302 Z"
                  fill={`url(#${ginger})`}
                />
                <ellipse cx="150" cy="224" rx="28" ry="24" fill={`url(#${ginger})`} />
                <path
                  d="M128 302 C 126 274, 136 252, 152 250 C 168 252, 178 274, 176 302 Z"
                  fill={`url(#${cream})`}
                />
                <ellipse cx="116" cy="298" rx="17" ry="10" fill="#e8914f" />
                <g className="cat-paws">
                  <ellipse cx="190" cy="293" rx="18" ry="11" fill={`url(#${cream})`} />
                  <g stroke="#e0a87c" strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
                    <path d="M184 289 v6" />
                    <path d="M192 288 v7" />
                    <path d="M199 290 v5" />
                  </g>
                </g>
              </g>

              {/* ── right cat (grey) ── */}
              <g className="cat-body-right">
                <g className="cat-tail cat-tail-right">
                  <path
                    d="M310 294 C 354 288, 372 244, 346 222 C 324 203, 300 220, 312 240"
                    fill="none"
                    stroke={`url(#${grey})`}
                    strokeWidth="15"
                    strokeLinecap="round"
                  />
                  <path
                    d="M312 240 C 318 232, 326 228, 334 228"
                    fill="none"
                    stroke="#f6effc"
                    strokeWidth="10"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                </g>
                <path
                  d="M322 302 C 324 262, 306 232, 270 230 C 234 232, 216 262, 218 302 Z"
                  fill={`url(#${grey})`}
                />
                <ellipse cx="270" cy="224" rx="28" ry="24" fill={`url(#${grey})`} />
                <path
                  d="M292 302 C 294 274, 284 252, 268 250 C 252 252, 242 274, 244 302 Z"
                  fill={`url(#${cream})`}
                />
                <ellipse cx="304" cy="298" rx="17" ry="10" fill="#b5a3c8" />
                <g className="cat-paws">
                  <ellipse cx="230" cy="293" rx="18" ry="11" fill={`url(#${cream})`} />
                  <g stroke="#e0a87c" strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
                    <path d="M236 289 v6" />
                    <path d="M228 288 v7" />
                    <path d="M221 290 v5" />
                  </g>
                </g>
              </g>

              {/* ── left head ── */}
              <g className="cat-idle cat-idle-left">
                <g className="cat-head cat-head-left">
                  <path d="M150 134 L170 94 L194 130 Z" fill="#d97c3c" />
                  <path d="M114 144 L104 98 L156 122 Z" fill={`url(#${ginger})`} />
                  <path d="M118 134 L114 110 L144 123 Z" fill="#ff9fbb" opacity="0.85" />
                  <circle cx="150" cy="176" r="46" fill={`url(#${ginger})`} />
                  <path
                    d="M150 136 q 5 8 3 16 M164 139 q 5 7 3 14 M136 140 q 4 7 2 13"
                    fill="none"
                    stroke="#c96f33"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <ellipse cx="186" cy="194" rx="21" ry="17" fill={`url(#${cream})`} />
                  <path
                    d="M198 187 l9 4 -9 6 z"
                    fill="#ff8fab"
                    stroke="#e06f8f"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M204 197 q -5 7 -11 4 M204 197 q 5 7 11 4"
                    fill="none"
                    stroke="#8a5236"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M158 170 q 9 -9 18 0"
                    fill="none"
                    stroke="#4a2a1a"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <ellipse className="cat-blush" cx="175" cy="207" rx="11" ry="6" fill="#ff8fab" opacity="0.42" />
                  <g stroke="#fff6ea" strokeWidth="1.8" strokeLinecap="round" opacity="0.8">
                    <path d="M206 189 L223 184" />
                    <path d="M207 195 L224 195" />
                    <path d="M205 201 L221 207" />
                  </g>
                </g>
              </g>

              {/* ── right head ── */}
              <g className="cat-idle cat-idle-right">
                <g className="cat-head cat-head-right">
                  <path d="M270 134 L250 94 L226 130 Z" fill="#a892bd" />
                  <path d="M306 144 L316 98 L264 122 Z" fill={`url(#${grey})`} />
                  <path d="M302 134 L306 110 L276 123 Z" fill="#ff9fbb" opacity="0.85" />
                  <circle cx="270" cy="176" r="46" fill={`url(#${grey})`} />
                  <path
                    d="M270 136 q -5 8 -3 16 M256 139 q -5 7 -3 14 M284 140 q -4 7 -2 13"
                    fill="none"
                    stroke="#9c86b0"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <ellipse cx="234" cy="194" rx="21" ry="17" fill={`url(#${cream})`} />
                  <path
                    d="M222 187 l-9 4 9 6 z"
                    fill="#ff8fab"
                    stroke="#e06f8f"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M216 197 q 5 7 11 4 M216 197 q -5 7 -11 4"
                    fill="none"
                    stroke="#7a6070"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M244 170 q 9 -9 18 0"
                    fill="none"
                    stroke="#3f2d4a"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <ellipse className="cat-blush" cx="245" cy="207" rx="11" ry="6" fill="#ff8fab" opacity="0.42" />
                  <g stroke="#fff6ea" strokeWidth="1.8" strokeLinecap="round" opacity="0.8">
                    <path d="M214 189 L197 184" />
                    <path d="M213 195 L196 195" />
                    <path d="M215 201 L199 207" />
                  </g>
                </g>
              </g>

              {/* the heart that blooms between their noses when they kiss */}
              <g className="cat-kiss-heart" aria-hidden="true">
                <circle cx="210" cy="171" r="30" fill={`url(#${heart})`} opacity="0.16" />
                <path
                  d="M210 184 C 197 171, 188 161, 194 152 C 200 144, 210 151, 210 159 C 210 151, 220 144, 226 152 C 232 161, 223 171, 210 184 Z"
                  fill={`url(#${heart})`}
                  stroke="#fff3d0"
                  strokeOpacity="0.55"
                  strokeWidth="1.1"
                />
                <g fill="#fff6dd">
                  <circle cx="184" cy="150" r="1.7" opacity="0.9" />
                  <circle cx="238" cy="156" r="1.4" opacity="0.8" />
                  <circle cx="196" cy="140" r="1.1" opacity="0.7" />
                  <circle cx="226" cy="138" r="1.2" opacity="0.7" />
                </g>
              </g>

              {/* little paw print on the cushion */}
              <g className="cat-paw-print" fill="#ffd6e7" opacity="0.55">
                <ellipse cx="150" cy="318" rx="5" ry="4" />
                <circle cx="143" cy="311" r="2" />
                <circle cx="150" cy="309" r="2" />
                <circle cx="157" cy="311" r="2" />
              </g>
            </svg>

            {/* heart burst */}
            {!reduceMotion && kissing && (
              <span className="cat-kiss-burst" aria-hidden="true">
                {BURST.map((item, index) => (
                  <span
                    key={`${kissKey}-${index}`}
                    className="cat-burst-heart"
                    style={{ '--dx': `${item.dx}px`, '--delay': `${item.delay}s` }}
                  >
                    ♥
                  </span>
                ))}
              </span>
            )}
          </button>
        </motion.div>

        <p className="rani-cats-caption" aria-live="polite">
          {kissing ? 'mwah 💕' : 'tap the cats for a kiss 🐾'}
        </p>

        <button type="button" className="rani-btn-ghost" onClick={onForever}>
          Read my forever letter <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
