import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';

/**
 * Section 4 — Under the Same Sky
 *
 * An original, hand-drawn SVG scene: Parvati and Mahadev seated on a hill,
 * looking up at a starry night. Drawn as soft silhouettes so it stays tasteful
 * and readable at every size. All copy lives in `config.divineSky`.
 */

/** Deterministic pseudo-random so the sky is identical between renders. */
function seeded(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

const STAR_COUNT = 78;

const HEART_PATH =
  'M0,-3 C-2,-7 -8,-5 -8,0 C-8,5 0,10 0,10 C0,10 8,5 8,0 C8,-5 2,-7 0,-3 Z';

function NightSky({ stars }) {
  return (
    <svg
      viewBox="0 0 800 520"
      className="block h-auto w-full"
      role="img"
      aria-label="Parvati and Mahadev seated on a hill, watching a starry night sky"
    >
      <defs>
        <linearGradient id="divineSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#05030f" />
          <stop offset="42%" stopColor="#141033" />
          <stop offset="76%" stopColor="#2b1145" />
          <stop offset="100%" stopColor="#3d1436" />
        </linearGradient>

        <radialGradient id="divineMoonGlow">
          <stop offset="0%" stopColor="#fff7d6" stopOpacity="0.95" />
          <stop offset="42%" stopColor="#ffe9a8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="divineHalo">
          <stop offset="0%" stopColor="#ffd6e8" stopOpacity="0.5" />
          <stop offset="62%" stopColor="#f9a8d4" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="divineShoot" x1="0" y1="0" x2="1" y2="0.45">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>

        <filter id="divineSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      {/* ── Night sky ─────────────────────────────────────────────── */}
      <rect width="800" height="520" fill="url(#divineSky)" />

      {/* Soft milky way */}
      <g filter="url(#divineSoft)" opacity="0.55">
        <ellipse cx="300" cy="182" rx="286" ry="50" fill="#a78bfa" opacity="0.22" transform="rotate(-14 300 182)" />
        <ellipse cx="330" cy="176" rx="210" ry="30" fill="#f0abfc" opacity="0.16" transform="rotate(-14 330 176)" />
      </g>

      {/* Stars */}
      {stars.map((star) => (
        <circle
          key={star.id}
          className="divine-star"
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill={star.tint}
          style={{ animationDelay: star.delay, animationDuration: star.duration }}
        />
      ))}

      {/* Moon */}
      <circle cx="654" cy="96" r="70" fill="url(#divineMoonGlow)" />
      <circle cx="654" cy="96" r="26" fill="#fff8e1" />
      <circle cx="646" cy="88" r="5" fill="#f1e0b0" opacity="0.35" />
      <circle cx="663" cy="103" r="3.4" fill="#f1e0b0" opacity="0.28" />

      {/* Shooting star */}
      <g transform="translate(118 62)">
        <g className="shooting-star">
          <line x1="0" y1="0" x2="44" y2="19" stroke="url(#divineShoot)" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>

      {/* ── Mountains ─────────────────────────────────────────────── */}
      <path
        d="M0,392 L96,318 L168,372 L262,288 L340,356 L458,300 L548,362 L640,306 L740,368 L800,332 L800,520 L0,520 Z"
        fill="#171233"
        opacity="0.95"
      />
      <path
        d="M0,430 L120,368 L214,414 L318,352 L420,410 L520,360 L636,414 L742,370 L800,400 L800,520 L0,520 Z"
        fill="#0f0c24"
      />
      <path
        d="M0,470 C140,452 280,446 400,452 C540,459 680,444 800,470 L800,520 L0,520 Z"
        fill="#090714"
      />

      {/* Ledge they sit on */}
      <path d="M282,452 C330,442 470,442 518,454 C470,472 330,474 282,452 Z" fill="#0d0b1c" />

      {/* ── Divine glow behind the couple ─────────────────────────── */}
      <ellipse cx="392" cy="352" rx="168" ry="120" fill="url(#divineHalo)" />

      {/* ── Trishul planted beside them ───────────────────────────── */}
      <g stroke="#100d20" strokeLinecap="round" fill="none">
        <rect x="283" y="330" width="6" height="132" rx="3" fill="#100d20" stroke="none" />
        <path d="M286,334 L286,300" strokeWidth="5" />
        <path d="M286,334 C270,328 264,312 268,300" strokeWidth="4.5" />
        <path d="M286,334 C302,328 308,312 304,300" strokeWidth="4.5" />
        <path d="M272,334 L300,334" strokeWidth="4" />
      </g>

      {/* ── Mahadev (left) ────────────────────────────────────────── */}
      <g>
        <path
          d="M300,452 C302,414 324,388 356,386 C390,388 410,414 412,452 Z"
          fill="#070510"
          stroke="#fbcfe8"
          strokeOpacity="0.26"
          strokeWidth="1.5"
        />
        <path
          d="M292,452 C316,440 400,440 422,452 C398,464 314,464 292,452 Z"
          fill="#070510"
          stroke="#fbcfe8"
          strokeOpacity="0.2"
          strokeWidth="1.5"
        />
        {/* Hair strands */}
        <path d="M340,344 C334,358 334,374 338,386" stroke="#070510" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M372,344 C378,358 378,374 374,386" stroke="#070510" strokeWidth="9" strokeLinecap="round" fill="none" />
        {/* Head + jata */}
        <circle cx="356" cy="360" r="25" fill="#070510" stroke="#fbcfe8" strokeOpacity="0.26" strokeWidth="1.5" />
        <ellipse cx="356" cy="331" rx="16" ry="14" fill="#070510" stroke="#fbcfe8" strokeOpacity="0.24" strokeWidth="1.4" />
        {/* Crescent moon in the hair */}
        <path d="M362,318 C354,321 354,331 362,334 C356,329 356,323 362,318 Z" fill="#fcd34d" opacity="0.9" />
        {/* Arm around Parvati */}
        <path d="M392,404 C406,416 416,418 424,408" stroke="#070510" strokeWidth="13" strokeLinecap="round" fill="none" />
        <path d="M392,400 C406,412 416,414 424,404" stroke="#fbcfe8" strokeOpacity="0.22" strokeWidth="1.4" fill="none" />
      </g>

      {/* ── Parvati (right) ───────────────────────────────────────── */}
      <g>
        {/* Veil edge behind her head */}
        <path
          d="M410,392 C404,364 414,342 432,338 C452,342 462,364 456,392"
          stroke="#f472b6"
          strokeOpacity="0.4"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M456,392 C464,414 462,432 456,446" stroke="#f472b6" strokeOpacity="0.22" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Flowing hair behind the body */}
        <path d="M452,356 C470,374 476,410 468,452" stroke="#070510" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M436,352 C432,368 432,388 436,404" stroke="#070510" strokeWidth="8" strokeLinecap="round" fill="none" />

        <path
          d="M392,452 C394,416 410,396 434,394 C458,396 472,416 474,452 Z"
          fill="#070510"
          stroke="#fbcfe8"
          strokeOpacity="0.26"
          strokeWidth="1.5"
        />
        <path
          d="M386,452 C410,442 462,442 484,452 C460,462 410,462 386,452 Z"
          fill="#070510"
          stroke="#fbcfe8"
          strokeOpacity="0.2"
          strokeWidth="1.5"
        />

        {/* Head, tilted toward him */}
        <ellipse
          cx="432"
          cy="372"
          rx="22"
          ry="23"
          transform="rotate(-8 432 372)"
          fill="#070510"
          stroke="#fbcfe8"
          strokeOpacity="0.26"
          strokeWidth="1.5"
        />

        {/* Jhumka */}
        <path d="M448,378 L448,382" stroke="#fcd34d" strokeWidth="1.2" opacity="0.8" />
        <circle cx="448" cy="384.5" r="2.4" fill="#fcd34d" opacity="0.9" />
      </g>

      {/* ── Little hearts drifting between them ───────────────────── */}
      <g className="divine-heart" style={{ animationDelay: '0s' }} transform="translate(340 296) scale(1)">
        <path d={HEART_PATH} fill="#fb7185" opacity="0.85" />
      </g>
      <g className="divine-heart" style={{ animationDelay: '1.7s' }} transform="translate(408 286) scale(0.8)">
        <path d={HEART_PATH} fill="#f9a8d4" opacity="0.8" />
      </g>
      <g className="divine-heart" style={{ animationDelay: '3.1s' }} transform="translate(374 262) scale(0.62)">
        <path d={HEART_PATH} fill="#fda4af" opacity="0.75" />
      </g>

      {/* Fireflies near the hill */}
      <circle className="divine-star" cx="236" cy="452" r="2" fill="#fcd34d" style={{ animationDelay: '0.8s', animationDuration: '4s' }} />
      <circle className="divine-star" cx="548" cy="460" r="1.8" fill="#fcd34d" style={{ animationDelay: '2.2s', animationDuration: '4.6s' }} />
      <circle className="divine-star" cx="590" cy="440" r="1.5" fill="#ffe9a8" style={{ animationDelay: '1.4s', animationDuration: '3.8s' }} />
    </svg>
  );
}

export default function DivineSky({ onNext }) {
  const config = useRomanticConfig();
  const sky = config.divineSky || {};
  const shouldReduceMotion = useReducedMotion();

  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => {
        const tintPool = ['#ffffff', '#ffe9f7', '#c7d2fe', '#fde68a'];
        return {
          id: i,
          cx: 12 + seeded(i + 1) * 776,
          cy: 10 + seeded(i + 2) * 372,
          r: 0.6 + seeded(i + 3) * 1.5,
          tint: tintPool[i % tintPool.length],
          delay: `${(seeded(i + 4) * 5).toFixed(2)}s`,
          duration: `${(2.4 + seeded(i + 5) * 3.4).toFixed(2)}s`,
        };
      }),
    [],
  );

  return (
    <div className="romantic-section py-16 justify-start">
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="text-4xl block mb-3" aria-hidden="true">🌙</span>
          <h2 className="font-display text-3xl md:text-4xl text-romantic-warm mb-2">
            {sky.title || 'Under the Same Sky'}
          </h2>
          <p className="font-cursive text-xl text-romantic-muted">
            {sky.subtitle || 'Like Parvati & Mahadev, watching the stars'}
          </p>
        </motion.div>

        {/* The illustration */}
        <motion.figure
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' }}
          className="divine-frame relative overflow-hidden rounded-[2rem] border-4 border-white/75 shadow-[0_24px_60px_rgba(74,16,32,0.35)]"
        >
          <NightSky stars={stars} />

          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-5 pb-5 pt-12 text-center">
            <p className="font-script text-2xl text-rose-50 sm:text-3xl">
              {sky.caption || 'Parvati & Mahadev, under the same stars'}
            </p>
          </figcaption>
        </motion.figure>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-6 text-center font-elegant text-lg italic leading-relaxed text-romantic-warm/80 md:text-xl"
        >
          {sky.message ||
            'Some bonds are written in the stars long before we meet — and under this same sky, I would choose you in every lifetime. ✨'}
        </motion.p>

        <div className="mt-7 text-center">
          <button type="button" onClick={onNext} className="btn-romantic">
            {sky.continueText || 'Keep going ❤️ →'}
          </button>
        </div>
      </div>
    </div>
  );
}
