export default function ClayCharacter({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 360 340"
      className={className}
      role="img"
      aria-label="Ilustrasi karakter clay"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="clayHair" cx="32%" cy="20%" r="88%">
          <stop offset="0%" stopColor="#9c6a4b" />
          <stop offset="52%" stopColor="#7a4c33" />
          <stop offset="100%" stopColor="#5b3626" />
        </radialGradient>
        <radialGradient id="clayHairLight" cx="40%" cy="18%" r="80%">
          <stop offset="0%" stopColor="#b07a56" />
          <stop offset="100%" stopColor="#7a4c33" />
        </radialGradient>
        <radialGradient id="claySkin" cx="35%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#ffd9c4" />
          <stop offset="58%" stopColor="#f6c2a9" />
          <stop offset="100%" stopColor="#e3a288" />
        </radialGradient>
        <radialGradient id="clayHoodie" cx="32%" cy="18%" r="90%">
          <stop offset="0%" stopColor="#c9b6f3" />
          <stop offset="55%" stopColor="#a88ce5" />
          <stop offset="100%" stopColor="#8b6dd0" />
        </radialGradient>
        <radialGradient id="clayCheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f79bb2" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f79bb2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="clayIris" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#8a5a3d" />
          <stop offset="100%" stopColor="#4a2a1c" />
        </radialGradient>
        <radialGradient id="clayMouth" cx="50%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#7c3438" />
          <stop offset="100%" stopColor="#4f1f27" />
        </radialGradient>
        <filter id="claySoft" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="9"
            floodColor="#674a9a"
            floodOpacity="0.2"
          />
        </filter>
        <filter id="clayTiny" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="3"
            floodColor="#674a9a"
            floodOpacity="0.22"
          />
        </filter>
      </defs>

      <g filter="url(#claySoft)">
        <path
          d="M64 340 C62 286 96 252 142 244 L218 244 C264 252 298 286 296 340 Z"
          fill="url(#clayHoodie)"
        />
        <path
          d="M64 340 C62 286 96 252 142 244 L218 244 C264 252 298 286 296 340 Z"
          fill="none"
          stroke="#d4c6f7"
          strokeOpacity="0.45"
          strokeWidth="3"
        />
        <path
          d="M156 208 h48 v44 c0 16 -11 26 -24 26 s-24 -10 -24 -26 z"
          fill="url(#claySkin)"
        />
        <path
          d="M138 248 C150 262 164 268 180 268 C196 268 210 262 222 248"
          fill="none"
          stroke="#7f60c6"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M84 340 C78 306 90 282 114 272 C132 264 148 268 154 280 L154 340 Z"
          fill="url(#clayHoodie)"
        />
        <path
          d="M276 340 C282 306 270 282 246 272 C228 264 212 268 206 280 L206 340 Z"
          fill="url(#clayHoodie)"
        />
        <ellipse cx="146" cy="318" rx="30" ry="24" fill="url(#claySkin)" />
        <ellipse cx="214" cy="318" rx="30" ry="24" fill="url(#claySkin)" />
        <path
          d="M126 314 q8 10 18 6"
          stroke="#d99478"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M198 320 q8 10 18 6"
          stroke="#d99478"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        />
      </g>

      <g filter="url(#claySoft)">
        <ellipse cx="180" cy="136" rx="94" ry="92" fill="url(#clayHair)" />
        <circle cx="180" cy="46" r="45" fill="url(#clayHairLight)" />
        <circle cx="140" cy="62" r="20" fill="url(#clayHair)" />
        <circle cx="222" cy="60" r="17" fill="url(#clayHair)" />
        <path
          d="M150 34 C164 18 196 18 210 34"
          stroke="#b98360"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M158 52 C170 40 194 40 204 54"
          stroke="#c08b68"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />

        <ellipse cx="112" cy="158" rx="12" ry="18" fill="url(#claySkin)" />
        <ellipse cx="248" cy="158" rx="12" ry="18" fill="url(#claySkin)" />

        <ellipse cx="180" cy="150" rx="70" ry="78" fill="url(#claySkin)" />

        <path
          d="M108 128 C112 80 140 58 180 58 C220 58 248 80 252 128 C238 104 216 92 196 100 C176 108 166 124 150 128 C136 132 120 130 108 128 Z"
          fill="url(#clayHair)"
        />
        <path
          d="M118 96 C134 72 160 64 184 68"
          stroke="#a06a49"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          opacity="0.45"
        />

        <path
          d="M108 128 C100 164 104 206 118 232 C128 214 122 178 124 150 Z"
          fill="url(#clayHair)"
        />
        <path
          d="M252 128 C260 164 256 206 242 232 C232 214 238 178 236 150 Z"
          fill="url(#clayHair)"
        />

        <path
          d="M136 128 q17 -9 34 0"
          stroke="#6b422c"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M190 128 q17 -9 34 0"
          stroke="#6b422c"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />

        <path
          d="M136 156 q16 16 32 0"
          stroke="#5a3524"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M142 160 l-5 7 M162 160 l5 7"
          stroke="#5a3524"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.65"
        />

        <ellipse cx="208" cy="154" rx="17" ry="20" fill="#fffaf6" />
        <ellipse cx="208" cy="156" rx="12" ry="14" fill="url(#clayIris)" />
        <circle cx="208" cy="158" r="6.5" fill="#2f1a12" />
        <circle cx="204" cy="151" r="3.4" fill="#fff" />
        <circle cx="212" cy="162" r="1.8" fill="#fff" opacity="0.85" />
        <path
          d="M190 136 q18 -7 36 0"
          stroke="#6b422c"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />

        <ellipse cx="136" cy="180" rx="18" ry="10" fill="url(#clayCheek)" />
        <ellipse cx="224" cy="180" rx="18" ry="10" fill="url(#clayCheek)" />

        <path
          d="M180 164 q7 10 -1 14"
          stroke="#d99478"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
        />

        <path
          d="M154 194 q26 34 52 0 q-26 12 -52 0 z"
          fill="url(#clayMouth)"
        />
        <path d="M164 206 q16 12 32 0 q-16 14 -32 0 z" fill="#f28fa0" />
        <path
          d="M158 194 q22 10 44 0 q-22 8 -44 0 z"
          fill="#fffaf6"
          opacity="0.9"
        />
        <path
          d="M154 194 q26 34 52 0"
          stroke="#8f4247"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        />

        <path
          d="M262 268 C276 248 268 226 252 214"
          stroke="#9f83df"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
        />
        <g filter="url(#clayTiny)">
          <ellipse
            cx="244"
            cy="214"
            rx="19"
            ry="23"
            transform="rotate(18 244 214)"
            fill="url(#claySkin)"
          />
          <path
            d="M232 204 q10 6 8 16 M242 200 q10 7 9 18 M252 200 q10 7 9 18"
            stroke="#d99478"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.55"
          />
        </g>
      </g>

      <ellipse
        cx="146"
        cy="116"
        rx="22"
        ry="10"
        fill="#fff"
        opacity="0.16"
        transform="rotate(-16 146 116)"
      />
      <ellipse
        cx="120"
        cy="286"
        rx="18"
        ry="9"
        fill="#fff"
        opacity="0.18"
        transform="rotate(-24 120 286)"
      />
      <ellipse
        cx="256"
        cy="290"
        rx="16"
        ry="8"
        fill="#fff"
        opacity="0.14"
        transform="rotate(20 256 290)"
      />
    </svg>
  );
}
