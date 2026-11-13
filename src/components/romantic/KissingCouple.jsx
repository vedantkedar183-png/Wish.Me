/**
 * The kissing couple — an original hand-drawn illustration.
 *
 * Both faces are the same profile path; the girl is the mirrored copy, so the
 * two mouths line up perfectly. Hair, lashes and the flower are what make them
 * different.
 */
export default function KissingCouple({ className = '' }) {
  return (
    <svg
      viewBox="0 0 420 340"
      className={className}
      role="img"
      aria-label="A boy and a girl leaning in for a kiss under a starry sky"
    >
      <defs>
        <linearGradient id="kissSkinBoy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffdec6" />
          <stop offset="58%" stopColor="#f3b98f" />
          <stop offset="100%" stopColor="#dd976a" />
        </linearGradient>
        <linearGradient id="kissSkinGirl" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffeadd" />
          <stop offset="58%" stopColor="#f8c8ab" />
          <stop offset="100%" stopColor="#e5a687" />
        </linearGradient>
        <linearGradient id="kissHairBoy" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#4a3021" />
          <stop offset="100%" stopColor="#1d1109" />
        </linearGradient>
        <linearGradient id="kissHairGirl" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#4e3223" />
          <stop offset="55%" stopColor="#2b1912" />
          <stop offset="100%" stopColor="#170d08" />
        </linearGradient>
        <linearGradient id="kissLips" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff9cb8" />
          <stop offset="100%" stopColor="#d92e5a" />
        </linearGradient>
        <linearGradient id="kissShirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38496e" />
          <stop offset="100%" stopColor="#161f31" />
        </linearGradient>
        <linearGradient id="kissDress" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffa6c9" />
          <stop offset="100%" stopColor="#bf2f60" />
        </linearGradient>
        <radialGradient id="kissCheek">
          <stop offset="0%" stopColor="#ff7f9f" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff7f9f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="kissSparkGlow">
          <stop offset="0%" stopColor="#fff6fb" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#ffb3d0" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ff8fb8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Boy — faces right. Sits a breath away from her until they lean in. */}
      <g transform="translate(-2,0)">
        <g className="kiss-figure kiss-figure-boy">
        <path
          d="M92,340 L92,306 C100,276 126,258 160,254 L184,254 C198,268 206,286 210,308 L210,340 Z"
          fill="url(#kissShirt)"
        />
        <path d="M152,224 L178,224 L180,258 L150,258 Z" fill="#d3946b" />

        <ellipse cx="148" cy="151" rx="49" ry="58" fill="url(#kissHairBoy)" transform="rotate(-6 148 151)" />

        <ellipse cx="158" cy="196" rx="10" ry="14" fill="#e0a179" />
        <path d="M156,190 C160,192 160,200 156,203" stroke="#c98a63" strokeWidth="2" fill="none" />

        <path
          d="M176,108 C190,121 195,140 196,158 C196,165 197,169 200,174 C205,182 213,190 217,197 C219,200 215,203 207,203 C203,204 206,205 210,207 C213,208 208,211 204,212 C207,214 209,216 206,217 C204,220 201,222 199,225 C195,231 188,235 178,236 C168,237 158,233 154,225 C150,213 148,195 149,178 C149,158 158,136 168,124 C171,117 173,111 176,108 Z"
          fill="url(#kissSkinBoy)"
        />

        <path d="M205,196 C209,197 211,199 210,201" stroke="#d0906b" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M200,176 C203,183 206,189 207,193" stroke="#ffe0c8" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* collar */}
        <path d="M151,257 C159,267 172,272 184,273" stroke="#0d1420" strokeOpacity="0.55" strokeWidth="2.6" fill="none" />
        <path d="M157,258 C164,265 172,268 180,269" stroke="#8ea6d6" strokeOpacity="0.45" strokeWidth="2" fill="none" />

        <path d="M171,160 C177,154 186,154 191,159" stroke="#2b1a12" strokeWidth="4.2" strokeLinecap="round" fill="none" />
        <path d="M172,176 C179,169 188,169 193,176" stroke="#2b1a12" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M174,175 L171,170" stroke="#2b1a12" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M192,176 L195,171" stroke="#2b1a12" strokeWidth="2.6" strokeLinecap="round" />

        <ellipse cx="181" cy="197" rx="15" ry="10" fill="url(#kissCheek)" />
        <path d="M204,205 C210,203 214,205 214,208 C212,212 206,213 202,210 Z" fill="url(#kissLips)" />
        <path d="M205,206 C208,205 211,205 213,206" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </g>
      </g>

      {/* Girl — the same face, mirrored */}
      <g transform="translate(422,0) scale(-1,1)">
        <g className="kiss-figure kiss-figure-girl">
          <path
            d="M92,340 L92,306 C100,276 126,258 160,254 L184,254 C198,268 206,286 210,308 L210,340 Z"
            fill="url(#kissDress)"
          />
          <path d="M152,224 L178,224 L180,258 L150,258 Z" fill="#dda184" />

          <path
            d="M150,104 C118,108 96,132 94,168 C92,196 100,218 96,246 C92,274 98,302 112,316 C120,323 128,316 125,303 C119,282 128,262 130,242 C132,218 127,194 134,170 C138,150 144,126 150,104 Z"
            fill="url(#kissHairGirl)"
          />
          <ellipse cx="148" cy="152" rx="52" ry="62" fill="url(#kissHairGirl)" />

          <ellipse cx="158" cy="196" rx="9" ry="13" fill="#e8b195" />
          <path d="M156,190 C160,192 160,200 156,203" stroke="#cf947a" strokeWidth="2" fill="none" />

          <path
            d="M176,108 C190,121 195,140 196,158 C196,165 197,169 200,174 C205,182 213,190 217,197 C219,200 215,203 207,203 C203,204 206,205 210,207 C213,208 208,211 204,212 C207,214 209,216 206,217 C204,220 201,222 199,225 C195,231 188,235 178,236 C168,237 158,233 154,225 C150,213 148,195 149,178 C149,158 158,136 168,124 C171,117 173,111 176,108 Z"
            fill="url(#kissSkinGirl)"
          />

          <path d="M205,196 C209,197 211,199 210,201" stroke="#dc9c80" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M200,176 C203,183 206,189 207,193" stroke="#fff0e4" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* necklace + tiny heart */}
          <path d="M154,254 C162,262 174,262 182,254" stroke="#ffe7f2" strokeOpacity="0.75" strokeWidth="1.6" fill="none" />
          <path d="M168,262 C169.6,263.4 171.4,264.6 171.4,265.8 C171.4,267 170,267.6 168,266.4 C166,267.6 164.6,267 164.6,265.8 C164.6,264.6 166.4,263.4 168,262 Z" fill="#ffe7f2" opacity="0.9" />

          <path d="M168,160 C175,153 185,153 191,159" stroke="#2b1a12" strokeWidth="3.8" strokeLinecap="round" fill="none" />
          <path d="M170,176 C177,168 187,168 193,176" stroke="#2b1a12" strokeWidth="3.8" strokeLinecap="round" fill="none" />
          <path d="M172,175 L169,169" stroke="#2b1a12" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M192,176 L196,170" stroke="#2b1a12" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M178,170 L177,166" stroke="#2b1a12" strokeWidth="2" strokeLinecap="round" />
          <path d="M186,170 L187,166" stroke="#2b1a12" strokeWidth="2" strokeLinecap="round" />

          <ellipse cx="181" cy="197" rx="15" ry="10" fill="url(#kissCheek)" />
          <path d="M204,205 C211,203 215,205 215,208 C213,212 206,213 201,210 Z" fill="url(#kissLips)" />
          <path d="M205,206 C208,205 211,205 213,206" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* pearl earring */}
          <circle cx="158" cy="212" r="3.2" fill="#fff5fa" />
          <circle cx="157" cy="211" r="1" fill="#ffd6e6" />

          <g transform="translate(120,128)">
            <circle cx="0" cy="-9" r="7" fill="#ffd1e2" />
            <circle cx="9" cy="0" r="7" fill="#ffd1e2" />
            <circle cx="0" cy="9" r="7" fill="#ffd1e2" />
            <circle cx="-9" cy="0" r="7" fill="#ffd1e2" />
            <circle cx="0" cy="0" r="5" fill="#ff7fa8" />
          </g>
        </g>
      </g>

      {/* the kiss itself */}
      <g className="kiss-spark" aria-hidden="true">
        <circle cx="210" cy="209" r="27" fill="url(#kissSparkGlow)" />
        <path
          d="M210,201 C213,204 217,207 217,210 C217,213 213,215 210,219 C207,215 203,213 203,210 C203,207 207,204 210,201 Z"
          fill="#fff2f8"
          opacity="0.92"
        />
      </g>
    </svg>
  );
}
