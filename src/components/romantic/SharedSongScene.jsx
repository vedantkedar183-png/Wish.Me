import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRomanticConfig } from '../../context/RomanticConfigContext';
import { ambientCount } from '../../utils/device';

/**
 * Chapter — Same Song, Same Sky.
 *
 * An original hand-drawn night scene: a boy and a girl sitting on a blanket
 * under a big tree by the water, sharing one pair of wired earphones — one bud
 * in his ear, one in hers — while her head rests on his shoulder. Their whole
 * life together is hinted at in the little details: carved initials in the
 * bark, one phone with both cables running to it, and the song drifting up as
 * notes and hearts.
 *
 * All copy lives in `config.sharedSong`.
 */

function seeded(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

const STAR_COUNT = 46;
const FIREFLY_COUNT = 7;

function NightSky({ starCount }) {
  const stars = useMemo(
    () =>
      Array.from({ length: starCount }, (_, i) => ({
        id: i,
        x: 8 + seeded(i + 1) * 444,
        y: 6 + seeded(i + 2) * 232,
        r: 0.7 + seeded(i + 3) * 1.5,
        opacity: 0.25 + seeded(i + 4) * 0.6,
        delay: `${(seeded(i + 5) * 5).toFixed(2)}s`,
        duration: `${(2.8 + seeded(i + 6) * 3).toFixed(2)}s`,
      })),
    [starCount],
  );

  const fireflies = useMemo(
    () =>
      Array.from({ length: FIREFLY_COUNT }, (_, i) => ({
        id: i,
        x: 34 + seeded(i + 31) * 250,
        y: 210 + seeded(i + 32) * 96,
        delay: `${(seeded(i + 33) * 6).toFixed(2)}s`,
        duration: `${(3.6 + seeded(i + 34) * 3.4).toFixed(2)}s`,
      })),
    [],
  );

  return (
    <svg
      viewBox="0 0 460 360"
      className="block h-auto w-full"
      role="img"
      aria-label="A boy and a girl sitting under a tree at night, sharing wired earphones, her head resting on his shoulder"
    >
      <defs>
        <linearGradient id="hwSky" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#07030f" />
          <stop offset="42%" stopColor="#1b1133" />
          <stop offset="72%" stopColor="#3a2047" />
          <stop offset="100%" stopColor="#6b3552" />
        </linearGradient>
        <radialGradient id="hwHorizon" cx="50%" cy="100%" r="70%">
          <stop offset="0%" stopColor="#d98098" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#8d4b6c" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#6b3552" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hwMoonHalo">
          <stop offset="0%" stopColor="#ffeccb" stopOpacity="0.5" />
          <stop offset="45%" stopColor="#ffd9a8" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffd9a8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hwMoon" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="62%" stopColor="#f7e3bd" />
          <stop offset="100%" stopColor="#e4c48d" />
        </radialGradient>
        <linearGradient id="hwBark" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#2a1a17" />
          <stop offset="52%" stopColor="#402a22" />
          <stop offset="100%" stopColor="#1c110f" />
        </linearGradient>
        <radialGradient id="hwLeafA" cx="34%" cy="26%" r="80%">
          <stop offset="0%" stopColor="#3e7f60" />
          <stop offset="58%" stopColor="#215741" />
          <stop offset="100%" stopColor="#0f2c26" />
        </radialGradient>
        <radialGradient id="hwLeafB" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#4b8a67" />
          <stop offset="60%" stopColor="#276245" />
          <stop offset="100%" stopColor="#123527" />
        </radialGradient>
        <radialGradient id="hwLeafC" cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#6b4162" />
          <stop offset="60%" stopColor="#3b233f" />
          <stop offset="100%" stopColor="#1b1023" />
        </radialGradient>
        <linearGradient id="hwSkinBoy" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#f3c9a4" />
          <stop offset="60%" stopColor="#dba87f" />
          <stop offset="100%" stopColor="#bd835e" />
        </linearGradient>
        <linearGradient id="hwSkinGirl" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#ffddc2" />
          <stop offset="60%" stopColor="#efbb98" />
          <stop offset="100%" stopColor="#d79a78" />
        </linearGradient>
        <linearGradient id="hwHairBoy" x1="0.2" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#3c2820" />
          <stop offset="55%" stopColor="#241610" />
          <stop offset="100%" stopColor="#120b08" />
        </linearGradient>
        <linearGradient id="hwHairGirl" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#4a2f22" />
          <stop offset="48%" stopColor="#2b1913" />
          <stop offset="100%" stopColor="#150c09" />
        </linearGradient>
        <linearGradient id="hwShirt" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#3b5178" />
          <stop offset="55%" stopColor="#25344f" />
          <stop offset="100%" stopColor="#121b2c" />
        </linearGradient>
        <linearGradient id="hwDress" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#d9789d" />
          <stop offset="55%" stopColor="#b04a74" />
          <stop offset="100%" stopColor="#7b2d4d" />
        </linearGradient>
        <linearGradient id="hwDressSkirt" x1="0.1" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#bf5a80" />
          <stop offset="60%" stopColor="#963a5e" />
          <stop offset="100%" stopColor="#66233f" />
        </linearGradient>
        <linearGradient id="hwBlanket" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#8f4c6b" />
          <stop offset="55%" stopColor="#6e3452" />
          <stop offset="100%" stopColor="#4c2239" />
        </linearGradient>
        <radialGradient id="hwPhoneGlow">
          <stop offset="0%" stopColor="#ffddab" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#ffb36b" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffb36b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hwFirefly">
          <stop offset="0%" stopColor="#fff4c4" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#ffd57a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffd57a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Night sky ─────────────────────────────────────────────── */}
      <rect width="460" height="360" fill="url(#hwSky)" />
      <ellipse cx="230" cy="352" rx="310" ry="140" fill="url(#hwHorizon)" />

      {stars.map((star) => (
        <circle
          key={star.id}
          cx={star.x}
          cy={star.y}
          r={star.r}
          fill="#fff6ea"
          opacity={star.opacity}
          className="hw-star"
          style={{ animationDelay: star.delay, animationDuration: star.duration }}
        />
      ))}

      <circle cx="384" cy="68" r="58" fill="url(#hwMoonHalo)" />
      <circle cx="384" cy="68" r="26" fill="url(#hwMoon)" />
      <circle cx="376" cy="62" r="5" fill="#e7c894" opacity="0.5" />
      <circle cx="389" cy="76" r="3.4" fill="#e7c894" opacity="0.42" />
      <circle cx="392" cy="61" r="2.2" fill="#e7c894" opacity="0.36" />

      {/* ── Distant hills and water ───────────────────────────────── */}
      <path d="M0,296 C72,276 132,290 196,284 C262,278 336,290 460,272 L460,360 L0,360 Z" fill="#181029" />
      <path d="M0,314 C92,300 156,312 244,304 C330,296 394,308 460,300 L460,360 L0,360 Z" fill="#120b20" />

      {/* ── The tree ──────────────────────────────────────────────── */}
      <g>
        <path
          d="M44,346 C49,310 52,278 54,246 C56,222 60,206 64,192 L82,195 C81,216 83,240 85,264 C87,296 89,322 92,346 Z"
          fill="url(#hwBark)"
        />
        <path d="M71,226 C88,210 104,200 124,190" stroke="#33211b" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M59,244 C42,236 28,226 16,214" stroke="#33211b" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M75,206 C88,192 100,180 114,168" stroke="#33211b" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M46,342 C34,348 22,350 10,348" stroke="#2a1a17" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M90,342 C102,348 114,350 124,347" stroke="#2a1a17" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M60,300 C58,320 58,332 57,344" stroke="#1a1110" strokeWidth="2" strokeOpacity="0.55" fill="none" />
        <path d="M78,284 C80,308 80,328 81,344" stroke="#1a1110" strokeWidth="2" strokeOpacity="0.45" fill="none" />
        <path d="M64,216 C62,238 61,260 60,280" stroke="#6b4a33" strokeWidth="1.4" strokeOpacity="0.45" fill="none" />

        {/* carved initials */}
        <g transform="translate(70,276) rotate(-8)" aria-hidden="true">
          <path
            d="M0,0 C-2.4,-5 -8.5,-3.6 -8.5,0.8 C-8.5,5.4 0,10.5 0,10.5 C0,10.5 8.5,5.4 8.5,0.8 C8.5,-3.6 2.4,-5 0,0 Z"
            fill="#f3d3a2"
            opacity="0.22"
          />
          <path
            d="M0,0 C-2.4,-5 -8.5,-3.6 -8.5,0.8 C-8.5,5.4 0,10.5 0,10.5 C0,10.5 8.5,5.4 8.5,0.8 C8.5,-3.6 2.4,-5 0,0 Z"
            fill="none"
            stroke="#f3d3a2"
            strokeWidth="0.9"
            opacity="0.75"
          />
        </g>
      </g>

      {/* ── Canopy ────────────────────────────────────────────────── */}
      <g className="hw-canopy">
        <ellipse cx="26" cy="148" rx="76" ry="58" fill="url(#hwLeafA)" />
        <ellipse cx="96" cy="112" rx="86" ry="66" fill="url(#hwLeafB)" />
        <ellipse cx="172" cy="142" rx="64" ry="50" fill="url(#hwLeafA)" />
        <ellipse cx="56" cy="82" rx="62" ry="46" fill="url(#hwLeafB)" />
        <ellipse cx="132" cy="78" rx="58" ry="42" fill="url(#hwLeafA)" />
        <ellipse cx="196" cy="172" rx="42" ry="32" fill="url(#hwLeafC)" />
        <ellipse cx="108" cy="164" rx="50" ry="30" fill="url(#hwLeafC)" opacity="0.55" />

        {/* leaf highlights */}
        <ellipse cx="84" cy="90" rx="42" ry="24" fill="#54956f" opacity="0.28" />
        <ellipse cx="30" cy="124" rx="32" ry="20" fill="#4c8a68" opacity="0.24" />
        <ellipse cx="158" cy="118" rx="30" ry="18" fill="#4b7f61" opacity="0.2" />
        <ellipse cx="126" cy="62" rx="26" ry="15" fill="#5da079" opacity="0.2" />

        {/* small clusters around the outline */}
        <circle cx="8" cy="190" r="17" fill="#1b4739" />
        <circle cx="188" cy="196" r="14" fill="#2a5b46" />
        <circle cx="232" cy="182" r="11" fill="#315d4a" opacity="0.9" />
        <circle cx="222" cy="198" r="8" fill="#3d6b52" opacity="0.8" />
        <circle cx="164" cy="66" r="16" fill="#2f674c" opacity="0.9" />
        <circle cx="206" cy="152" r="12" fill="#4a3350" opacity="0.85" />

        {/* hanging sprigs */}
        <path d="M160,176 C158,192 154,204 146,214" stroke="#2f6248" strokeWidth="2.2" fill="none" />
        <circle cx="146" cy="216" r="4" fill="#3d7a58" />
        <circle cx="153" cy="204" r="3.4" fill="#4a8a63" />
        <circle cx="158" cy="192" r="3" fill="#3d7a58" />
        <path d="M196,184 C198,198 202,208 210,216" stroke="#2f6248" strokeWidth="2" fill="none" />
        <circle cx="210" cy="218" r="3.6" fill="#3d7a58" />
        <circle cx="202" cy="206" r="3" fill="#4a8a63" />
      </g>

      {/* ── Foreground ground ────────────────────────────────────── */}
      <path d="M0,330 C120,314 262,322 460,306 L460,360 L0,360 Z" fill="#0e081b" />
      <path d="M0,340 C140,328 300,334 460,322 L460,360 L0,360 Z" fill="#0a0615" />

      {/* grass tufts */}
      <g stroke="#2b5744" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.8">
        <path d="M128,336 C130,328 132,324 136,320" />
        <path d="M132,336 C134,329 138,325 143,323" />
        <path d="M348,326 C350,318 352,314 356,311" />
        <path d="M353,326 C355,319 359,315 364,313" />
        <path d="M398,316 C400,310 402,306 406,304" />
        <path d="M26,352 C28,346 30,342 34,339" />
      </g>

      {/* ── Blanket ──────────────────────────────────────────────── */}
      <g>
        <path
          d="M150,312 C190,301 300,299 340,309 C348,314 347,328 338,334 C300,343 194,344 158,335 C148,330 145,318 150,312 Z"
          fill="url(#hwBlanket)"
        />
        <g stroke="#b9718d" strokeWidth="1.1" strokeOpacity="0.35" fill="none">
          <path d="M160,318 C210,309 292,309 334,316" />
          <path d="M156,327 C208,319 294,319 338,326" />
          <path d="M186,307 C184,318 186,331 190,340" />
          <path d="M246,304 C246,316 246,330 246,341" />
          <path d="M306,306 C308,318 308,330 306,340" />
        </g>
        <path d="M158,335 C200,343 300,342 338,334" stroke="#c98aa0" strokeWidth="1.4" strokeOpacity="0.35" fill="none" />
      </g>

      {/* ── The couple ───────────────────────────────────────────── */}
      <g>
        {/* boy's torso */}
        <path
          d="M186,336 C184,310 187,282 197,262 C204,249 214,244 226,246 C242,250 251,268 255,292 C257,308 257,324 257,336 Z"
          fill="url(#hwShirt)"
        />
        <path d="M197,262 C205,254 215,251 226,253 C238,256 246,266 251,282" stroke="#6a82ad" strokeWidth="1.6" strokeOpacity="0.5" fill="none" />
        <path d="M190,282 C188,300 188,320 189,336" stroke="#0b1220" strokeWidth="1.4" strokeOpacity="0.5" fill="none" />

        {/* girl's hair — behind her body */}
        <path
          d="M246,222 C241,202 252,188 266,188 C282,188 294,202 291,222 C295,244 304,264 307,286 C310,306 304,322 292,329 C280,336 262,334 254,324 C247,314 252,296 254,278 C256,256 250,240 246,222 Z"
          fill="url(#hwHairGirl)"
        />
        <path d="M288,232 C298,254 302,278 300,300" stroke="#5c3a28" strokeWidth="1.3" strokeOpacity="0.5" fill="none" />

        {/* girl's dress */}
        <path
          d="M250,336 C248,312 252,284 261,268 C267,257 278,253 288,258 C301,266 309,288 312,336 Z"
          fill="url(#hwDress)"
        />
        <path
          d="M244,306 C240,320 246,333 258,338 C280,344 304,341 320,332 C328,326 327,312 319,302 C296,315 264,314 244,306 Z"
          fill="url(#hwDressSkirt)"
        />
        <g stroke="#da8aa5" strokeWidth="1" strokeOpacity="0.35" fill="none">
          <path d="M262,309 C264,320 264,330 262,338" />
          <path d="M284,309 C285,320 285,331 284,339" />
          <path d="M304,307 C306,318 306,328 304,336" />
        </g>
        <path d="M262,268 C272,274 284,275 294,270" stroke="#f0a9bf" strokeWidth="1.3" strokeOpacity="0.4" fill="none" />

        {/* a lock of her hair over the dress */}
        <path d="M288,228 C294,248 297,272 296,296 C295,306 292,314 288,320" stroke="url(#hwHairGirl)" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.95" />

        {/* his arm around her shoulders */}
        <path d="M238,262 C252,253 270,251 284,257" stroke="#2c3f60" strokeWidth="17" strokeLinecap="round" fill="none" />
        <path d="M240,257 C252,249 268,247 280,252" stroke="#5d77a3" strokeWidth="1.6" strokeOpacity="0.45" strokeLinecap="round" fill="none" />
        <ellipse cx="287" cy="258" rx="7" ry="6" fill="url(#hwSkinBoy)" />
        <path d="M283,255 C286,254 290,255 291,258" stroke="#b47c58" strokeWidth="1" strokeOpacity="0.6" fill="none" />

        {/* necks */}
        <path d="M205,235 L229,235 L231,258 L203,258 Z" fill="url(#hwSkinBoy)" />
        <path d="M206,239 C213,245 222,245 229,240" stroke="#b47c58" strokeWidth="1.3" strokeOpacity="0.5" fill="none" />
        <path d="M256,239 L270,239 L272,258 L254,258 Z" fill="url(#hwSkinGirl)" />
        <path d="M257,243 C263,248 268,248 272,245" stroke="#c98b6d" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />

        {/* his head, seen from behind — hair covers the whole skull */}
        <ellipse cx="216" cy="205" rx="24" ry="26" fill="url(#hwSkinBoy)" />
        <path
          d="M192,206 C191,184 201,174 216,174 C231,174 241,184 240,206 C240,216 236,225 228,229 C220,232 212,232 204,229 C196,225 192,216 192,206 Z"
          fill="url(#hwHairBoy)"
        />
        <ellipse cx="190.5" cy="212" rx="5.2" ry="7.2" fill="url(#hwSkinBoy)" />
        <ellipse cx="241.5" cy="212" rx="5.2" ry="7.2" fill="url(#hwSkinBoy)" />
        <path d="M200,188 C208,181 224,181 232,188" stroke="#6b4a33" strokeWidth="1.6" strokeOpacity="0.5" fill="none" />
        <path d="M208,180 C214,177 221,177 226,180" stroke="#7d5a3f" strokeWidth="1" strokeOpacity="0.35" fill="none" />
        <path d="M198,200 C195,212 197,223 202,229" stroke="#0e0906" strokeWidth="1.2" strokeOpacity="0.45" fill="none" />
        <path d="M234,200 C237,212 235,223 230,229" stroke="#0e0906" strokeWidth="1.2" strokeOpacity="0.4" fill="none" />

        {/* her head, tilted onto his shoulder — hair covers the whole skull */}
        <g transform="rotate(-22 266 240)">
          <ellipse cx="266" cy="212" rx="22" ry="23" fill="url(#hwSkinGirl)" />
          <path
            d="M244,208 C243,190 253,181 266,181 C279,181 289,190 288,208 C288,218 284,226 277,230 C270,233 262,233 255,230 C248,226 244,218 244,208 Z"
            fill="url(#hwHairGirl)"
          />
          <ellipse cx="246" cy="217" rx="4.8" ry="6.4" fill="url(#hwSkinGirl)" />
          <ellipse cx="288" cy="217" rx="4.8" ry="6.4" fill="url(#hwSkinGirl)" />
          <path d="M254,192 C262,187 275,187 282,194" stroke="#66422c" strokeWidth="1.3" strokeOpacity="0.55" fill="none" />
          <path d="M262,184 C268,181 275,182 280,186" stroke="#7a5334" strokeWidth="1" strokeOpacity="0.35" fill="none" />
          <path d="M248,205 C245,215 247,224 250,231" stroke="#120b08" strokeWidth="1.1" strokeOpacity="0.45" fill="none" />
          <path d="M283,205 C286,214 284,223 281,231" stroke="#120b08" strokeWidth="1.1" strokeOpacity="0.4" fill="none" />
          {/* tiny earring */}
          <circle cx="290" cy="224" r="2" fill="#ffe9bd" opacity="0.9" />
        </g>

        {/* ── Wired earphones ───────────────────────────────────── */}
        <g fill="none" strokeLinecap="round">
          {/* shadows under the cables */}
          <path d="M191,216 C182,240 179,266 190,288 C199,305 214,315 230,319" stroke="#0b0614" strokeWidth="4" strokeOpacity="0.45" />
          <path d="M277,211 C293,236 299,262 294,282 C288,299 266,314 240,320" stroke="#0b0614" strokeWidth="4" strokeOpacity="0.45" />
          {/* cables */}
          <path d="M191,216 C182,240 179,266 190,288 C199,305 214,315 230,319" stroke="#f7e9e2" strokeWidth="2" strokeOpacity="0.92" />
          <path d="M277,211 C293,236 299,262 294,282 C288,299 266,314 240,320" stroke="#f7e9e2" strokeWidth="2" strokeOpacity="0.92" />
          <path d="M191,216 C182,240 179,266 190,288" stroke="#ffffff" strokeWidth="0.7" strokeOpacity="0.6" />
        </g>

        {/* buds in each ear — one for him, one for her */}
        <g>
          <circle cx="191" cy="213" r="4.4" fill="#fdf7f1" />
          <circle cx="191" cy="213" r="2.1" fill="#cbb9ae" />
          <path d="M189,217 L188,222" stroke="#fdf7f1" strokeWidth="2.4" strokeLinecap="round" />
        </g>
        <g transform="rotate(-22 266 240)">
          <circle cx="288" cy="216" r="4.4" fill="#fdf7f1" />
          <circle cx="288" cy="216" r="2.1" fill="#cbb9ae" />
          <path d="M290,220 L291,225" stroke="#fdf7f1" strokeWidth="2.4" strokeLinecap="round" />
        </g>

        {/* little heart where both cables meet */}
        <path
          d="M232,308 C233.6,305.4 237,306 237,308.4 C237,310.8 232,313.6 232,313.6 C232,313.6 227,310.8 227,308.4 C227,306 230.4,305.4 232,308 Z"
          fill="#ffc2d6"
          opacity="0.95"
        />
      </g>

      {/* ── Phone on the blanket ─────────────────────────────────── */}
      <g>
        <ellipse cx="234" cy="322" rx="30" ry="19" fill="url(#hwPhoneGlow)" />
        <g transform="translate(226,306) rotate(-8)">
          <rect x="0" y="0" width="17" height="28" rx="3.4" fill="#191320" stroke="#4b4058" strokeWidth="1" />
          <rect x="1.6" y="2.4" width="13.8" height="22.4" rx="2" fill="#f6dfae" opacity="0.9" />
          <path d="M6.4,14 L6.4,19.2 M9,11.6 L9,19.2 M11.6,13.2 L11.6,19.2" stroke="#7a4a63" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
          <circle cx="8.5" cy="25" r="1" fill="#8b7b93" />
        </g>
      </g>

      {/* ── Fireflies ────────────────────────────────────────────── */}
      {fireflies.map((fly) => (
        <g
          key={fly.id}
          className="hw-firefly"
          style={{ animationDelay: fly.delay, animationDuration: fly.duration }}
        >
          <circle cx={fly.x} cy={fly.y} r="9" fill="url(#hwFirefly)" opacity="0.5" />
          <circle cx={fly.x} cy={fly.y} r="1.9" fill="#fff3c4" />
        </g>
      ))}
    </svg>
  );
}

export default function SharedSongScene({ onNext }) {
  const config = useRomanticConfig();
  const song = config.sharedSong || {};
  const shouldReduceMotion = useReducedMotion();

  const starCount = useMemo(
    () => (shouldReduceMotion ? 18 : ambientCount(STAR_COUNT, 20)),
    [shouldReduceMotion],
  );

  const [bursts, setBursts] = useState([]);

  const initials = `${(config.person?.yourName || 'V').trim().charAt(0)} \u2665 ${(config.person?.name || 'R').trim().charAt(0)}`;

  const sendLove = () => {
    const stamp = Date.now();
    const fresh = Array.from({ length: 4 }, (_, i) => ({
      id: `${stamp}-${i}`,
      dx: (Math.random() - 0.5) * 90,
      dy: -46 - Math.random() * 70,
      rotate: (Math.random() - 0.5) * 60,
      kind: i % 2 === 0 ? 'heart' : 'note',
      delay: i * 0.06,
    }));
    setBursts((previous) => [...previous, ...fresh].slice(-16));
  };

  return (
    <div className="romantic-section shared-song-page relative overflow-hidden py-14 justify-start">
      <div className="hw-aurora" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-xl px-4 text-center">
        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-cursive text-[10px] uppercase tracking-[0.38em] text-romantic-200/90">
            {song.label || 'our song \u00b7 one ear each'}
          </p>
          <h2 className="mt-2 font-display text-3xl leading-tight text-white drop-shadow-[0_4px_18px_rgba(255,120,170,0.45)] sm:text-4xl">
            {song.title || 'Same Song, Same Sky'}
          </h2>
          <p className="mt-1 px-2 font-script text-xl leading-snug text-romantic-200 sm:text-2xl">
            {song.subtitle || 'two lives, one playlist'}
          </p>
        </motion.div>

        {/* ── The scene ──────────────────────────────────────────── */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mx-auto mt-2 w-full max-w-[430px]"
        >
          <div className="hw-aura" aria-hidden="true" />

          <button
            type="button"
            onClick={sendLove}
            aria-label={song.hint || 'Tap them for a little more love'}
            className="hw-stage relative z-10 block w-full rounded-[2rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-romantic-300/50"
          >
            <NightSky starCount={starCount} />
          </button>

          {bursts.map((burst) => (
            <motion.span
              key={burst.id}
              aria-hidden="true"
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: burst.dx,
                y: burst.dy,
                scale: 1,
                rotate: burst.rotate,
              }}
              transition={{ duration: 1.6, ease: 'easeOut', delay: burst.delay }}
              onAnimationComplete={() =>
                setBursts((previous) => previous.filter((item) => item.id !== burst.id))
              }
              className={`hw-burst absolute left-1/2 top-[62%] ${
                burst.kind === 'heart' ? 'text-romantic-200' : 'hw-burst-note'
              }`}
            >
              {burst.kind === 'heart' ? '\u2665' : '\u266b'}
            </motion.span>
          ))}

          {/* drifting notes over the scene */}
          {!shouldReduceMotion && (
            <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
              <span className="hw-note" style={{ left: '48%', top: '76%', animationDelay: '0s' }}>{'\u266a'}</span>
              <span className="hw-note" style={{ left: '57%', top: '70%', animationDelay: '1.7s' }}>{'\u266b'}</span>
              <span className="hw-note" style={{ left: '40%', top: '72%', animationDelay: '3.1s' }}>{'\u266a'}</span>
              <span className="hw-note-heart" style={{ left: '55%', top: '64%', animationDelay: '2.2s' }}>{'\u2665'}</span>
            </div>
          )}
        </motion.div>

        {/* ── Now playing strip ─────────────────────────────────── */}
        <div className="hw-nowplaying" aria-label={song.playLabel || 'now playing, Love Me Like You Do'}>
          <span className="hw-eq" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>{song.playLabel || 'now playing \u00b7 love me like you do'}</span>
        </div>

        {/* ── Caption ────────────────────────────────────────────── */}
        <p className="mt-3 font-script text-lg leading-snug text-romantic-200 sm:text-xl">
          {song.caption || 'one earbud each \u2014 every song becomes a memory'}
        </p>

        <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-romantic-200/85">
          {song.message ||
            'This is how I want to spend our lives \u2014 your head on my shoulder, our song in both our ears, and the rest of the world quietly on pause.'}
        </p>

        <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-romantic-200/60">
          {song.hint || 'Tap them for a little more love'}
        </p>

        <div className="mt-5">
          <button type="button" onClick={onNext} className="btn-romantic">
            {song.continueText || 'Keep going \u2764\ufe0f \u2192'}
          </button>
        </div>

        <p className="mt-4 font-cursive text-[11px] tracking-[0.3em] text-romantic-200/50">
          {initials}
        </p>

        <p className="sr-only" aria-live="polite">
          {bursts.length > 0 ? song.hint || 'A little more love.' : ''}
        </p>
      </div>
    </div>
  );
}
