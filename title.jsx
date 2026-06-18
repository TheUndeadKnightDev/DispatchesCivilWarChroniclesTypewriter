// =============================================================
// TITLE SCREEN — cinematic dusk battlefield (silhouette art)
// =============================================================
// No goofy stick-figure soldiers. Instead: layered silhouette
// hills, broken cannon, ruined fence, lone planted colors on a
// rise, drifting smoke, embers, and a low-burning fire — all
// rendered as proper artistic silhouettes against a sunset.

function TitleScreen({ onBegin }) {
  const [leaving, setLeaving] = React.useState(false);

  function go() {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onBegin, 700);
  }

  React.useEffect(() => {
    function onKey(e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") { e.preventDefault(); go(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leaving]);

  const TITLE = "DISPATCHES";

  return (
    <div className={"title-screen" + (leaving ? " leaving" : "")}>
      {/* ============ SCENE ============ */}
      <svg className="title-scene" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="ts-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"    stopColor="#0c0805"/>
            <stop offset="0.30" stopColor="#1f1108"/>
            <stop offset="0.55" stopColor="#52220e"/>
            <stop offset="0.75" stopColor="#a85420"/>
            <stop offset="0.88" stopColor="#d88a36"/>
            <stop offset="1"    stopColor="#f3b864"/>
          </linearGradient>
          <radialGradient id="ts-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0"   stopColor="#ffe39a" stopOpacity="0.95"/>
            <stop offset="0.45" stopColor="#e88a3a" stopOpacity="0.4"/>
            <stop offset="1"   stopColor="#e88a3a" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="ts-flash" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0"   stopColor="#fff4c8" stopOpacity="1"/>
            <stop offset="0.3" stopColor="#ffb84a" stopOpacity="0.7"/>
            <stop offset="1"   stopColor="#ffb84a" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="ts-smoke" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#1a0c06" stopOpacity="0.85"/>
            <stop offset="1" stopColor="#1a0c06" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="ts-fog" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#120804" stopOpacity="0.95"/>
            <stop offset="1" stopColor="#120804" stopOpacity="0"/>
          </linearGradient>
          <radialGradient id="ts-fire" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0"   stopColor="#fff0b0" stopOpacity="1"/>
            <stop offset="0.4" stopColor="#ff8a2a" stopOpacity="0.8"/>
            <stop offset="1"   stopColor="#ff8a2a" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="ts-vig" cx="0.5" cy="0.5" r="0.7">
            <stop offset="0.5" stopColor="#000" stopOpacity="0"/>
            <stop offset="1"   stopColor="#000" stopOpacity="0.85"/>
          </radialGradient>
        </defs>

        {/* sky */}
        <rect width="1920" height="1080" fill="url(#ts-sky)"/>

        {/* sun haze low on horizon */}
        <ellipse cx="1280" cy="730" rx="560" ry="220" fill="url(#ts-sun)"/>
        <circle cx="1280" cy="740" r="80" fill="#ffd58a" opacity="0.55"/>

        {/* stars */}
        <g fill="#f8e6b8">
          {Array.from({length: 70}).map((_, i) => {
            const x = (i * 137) % 1920;
            const y = ((i * 73) % 320);
            const r = 0.5 + (i % 3) * 0.45;
            return <circle key={i} cx={x} cy={y} r={r} opacity={0.35 + (i%5)*0.1} className={"ts-twinkle ts-tw-" + (i % 5)}/>;
          })}
        </g>

        {/* drifting upper cloud bands */}
        <g opacity="0.45">
          <ellipse className="ts-cloud-a" cx="400" cy="260" rx="320" ry="22" fill="#2a1610"/>
          <ellipse className="ts-cloud-b" cx="1240" cy="170" rx="420" ry="20" fill="#3a1c14"/>
          <ellipse className="ts-cloud-c" cx="880" cy="360" rx="280" ry="22" fill="#48201a"/>
        </g>

        {/* === FAR RIDGE === */}
        <path d="M0 740
                 Q 220 690 420 720
                 T 820 700
                 Q 1000 680 1200 715
                 T 1620 695
                 Q 1820 720 1920 740
                 L 1920 1080 L 0 1080 Z"
              fill="#1a0c07" opacity="0.95"/>

        {/* tiny silhouetted shapes on far ridge — abstract tree line, no people */}
        <g fill="#0d0604">
          {Array.from({length: 40}).map((_, i) => {
            const x = i * 50 + (i % 3) * 6;
            const h = 12 + (i * 7) % 22;
            return <path key={i} d={`M ${x} 720 L ${x-2} ${720-h} L ${x+2} ${720-h} Z`}/>;
          })}
        </g>

        {/* === MID RIDGE === */}
        <path d="M0 870
                 Q 380 800 760 830
                 T 1380 815
                 Q 1620 825 1920 855
                 L 1920 1080 L 0 1080 Z"
              fill="#0c0604"/>

        {/* === DISTANT CANNON SMOKE COLUMNS (no figures) === */}
        <g className="ts-smoke ts-smoke-1" transform="translate(260 800)">
          <ellipse cx="0" cy="-30" rx="42" ry="60" fill="url(#ts-smoke)"/>
          <ellipse cx="-12" cy="-110" rx="56" ry="80" fill="url(#ts-smoke)" opacity="0.7"/>
          <ellipse cx="8" cy="-200" rx="70" ry="100" fill="url(#ts-smoke)" opacity="0.45"/>
        </g>
        <g className="ts-smoke ts-smoke-2" transform="translate(1180 810)">
          <ellipse cx="0" cy="-40" rx="52" ry="72" fill="url(#ts-smoke)"/>
          <ellipse cx="20" cy="-130" rx="64" ry="90" fill="url(#ts-smoke)" opacity="0.7"/>
          <ellipse cx="-4" cy="-230" rx="78" ry="110" fill="url(#ts-smoke)" opacity="0.45"/>
        </g>
        <g className="ts-smoke ts-smoke-3" transform="translate(1620 820)">
          <ellipse cx="0" cy="-30" rx="36" ry="56" fill="url(#ts-smoke)" opacity="0.8"/>
          <ellipse cx="10" cy="-100" rx="46" ry="72" fill="url(#ts-smoke)" opacity="0.55"/>
        </g>

        {/* === MUZZLE FLASHES (just glows on the ridge, no cannons drawn) === */}
        <g className="ts-flash ts-flash-1">
          <circle cx="280" cy="820" r="46" fill="url(#ts-flash)"/>
        </g>
        <g className="ts-flash ts-flash-2">
          <circle cx="1200" cy="830" r="56" fill="url(#ts-flash)"/>
        </g>
        <g className="ts-flash ts-flash-3">
          <circle cx="1640" cy="840" r="34" fill="url(#ts-flash)"/>
        </g>

        {/* low ground fog band */}
        <rect x="0" y="830" width="1920" height="250" fill="url(#ts-fog)" opacity="0.7"/>

        {/* === FOREGROUND HILL with PLANTED COLORS === */}
        <path d="M0 990
                 Q 480 920 920 950
                 Q 1180 970 1500 935
                 Q 1740 920 1920 950
                 L 1920 1080 L 0 1080 Z"
              fill="#050302"/>

        {/* planted colors — proper artistic silhouette */}
        <g transform="translate(880 660)">
          {/* mound */}
          <ellipse cx="44" cy="290" rx="120" ry="14" fill="#000" opacity="0.7"/>
          {/* staff */}
          <line x1="44" y1="0" x2="44" y2="290" stroke="#000" strokeWidth="6"/>
          {/* finial */}
          <path d="M44 -10 L40 0 L48 0 Z" fill="#d4a04a"/>
          <circle cx="44" cy="-14" r="5" fill="#d4a04a"/>
          {/* flag panel — torn edge */}
          <path d="M46 4
                   L 168 12
                   L 158 24
                   L 168 38
                   L 156 52
                   L 168 68
                   L 154 82
                   L 46 76 Z"
                fill="#8b1a1a" className="ts-flag-wave"/>
          {/* star */}
          <text x="100" y="56" fontSize="34" textAnchor="middle"
                fill="#f4d68a" fontFamily="Cinzel, serif" fontWeight="900"
                className="ts-flag-wave">★</text>
          {/* tassels */}
          <line x1="44" y1="-10" x2="36" y2="6" stroke="#d4a04a" strokeWidth="1.5"/>
          <line x1="44" y1="-10" x2="52" y2="6" stroke="#d4a04a" strokeWidth="1.5"/>
        </g>

        {/* === BROKEN CANNON silhouette, left foreground === */}
        <g transform="translate(180 920)" fill="#000">
          {/* barrel tilted upward */}
          <path d="M 0 60 L 220 -10 L 230 18 L 14 88 Z"/>
          {/* trunnion */}
          <circle cx="120" cy="42" r="14"/>
          {/* broken wheel — only half visible */}
          <path d="M 60 110
                   A 70 70 0 0 1 200 110
                   L 200 130 L 60 130 Z"/>
          {/* spokes */}
          <line x1="130" y1="50" x2="130" y2="130" stroke="#000" strokeWidth="6"/>
          <line x1="70"  y1="100" x2="190" y2="110" stroke="#000" strokeWidth="6"/>
          <line x1="92"  y1="60"  x2="170" y2="130" stroke="#000" strokeWidth="6"/>
          <line x1="170" y1="60"  x2="92"  y2="130" stroke="#000" strokeWidth="6"/>
          {/* shadow under */}
          <ellipse cx="130" cy="140" rx="120" ry="8" fill="#000" opacity="0.6"/>
        </g>

        {/* === SMALL CAMPFIRE on the rise, right of center === */}
        <g transform="translate(1180 880)">
          {/* logs */}
          <rect x="-22" y="22" width="50" height="8" rx="2" fill="#1a0c04" transform="rotate(-10)"/>
          <rect x="-18" y="28" width="52" height="8" rx="2" fill="#1a0c04" transform="rotate(8)"/>
          {/* fire glow */}
          <ellipse cx="6" cy="14" rx="40" ry="28" fill="url(#ts-fire)" className="ts-fire-flicker"/>
          {/* small flame tongues */}
          <path d="M 0 18 Q 2 -2 8 -10 Q 14 -2 12 18 Z" fill="#ffb84a" className="ts-fire-flicker"/>
          <path d="M 10 22 Q 14 6 22 0 Q 20 14 18 22 Z" fill="#ff8a2a" className="ts-fire-flicker"/>
        </g>

        {/* === SPLIT RAIL FENCE foreground === */}
        <g fill="#000">
          {Array.from({length: 20}).map((_, i) => {
            const x = i * 102 - 30;
            const dy = (i * 23) % 5;
            return <rect key={i} x={x} y={965 + dy} width="6" height="78"/>;
          })}
          <path d="M -30 990 L 1980 996 L 1980 1000 L -30 994 Z"/>
          <path d="M -30 1024 L 1980 1030 L 1980 1034 L -30 1028 Z"/>
        </g>

        {/* === EMBERS rising === */}
        <g>
          {Array.from({length: 30}).map((_, i) => {
            const x = 200 + (i * 67) % 1600;
            return (
              <circle key={i} cx={x} cy="940" r={1 + (i%3)*0.7}
                      fill={i % 3 === 0 ? "#ffd084" : i % 3 === 1 ? "#ff7e2a" : "#ffb84a"}
                      className={"ts-ember ts-ember-" + (i % 7)}/>
            );
          })}
        </g>
        {/* ashfall */}
        <g>
          {Array.from({length: 18}).map((_, i) => {
            const x = (i * 197) % 1920;
            return (
              <circle key={i} cx={x} cy="-20" r={1.2}
                      fill="#6a4a32"
                      className={"ts-ash ts-ash-" + (i % 5)}/>
            );
          })}
        </g>

        {/* film vignette */}
        <rect width="1920" height="1080" fill="url(#ts-vig)" pointerEvents="none"/>

        {/* film grain overlay (subtle) */}
        <rect width="1920" height="1080" fill="#3a1c0a" opacity="0.06"
              style={{mixBlendMode:"overlay"}} pointerEvents="none"/>
      </svg>

      {/* ============ TITLE STACK ============ */}
      <div className="title-stack">
        <div className="title-eyebrow">— A TYPEWRITER CHRONICLE OF THE WAR —</div>
        <h1 className="title-main" aria-label={TITLE}>
          {TITLE.split("").map((c, i) => (
            <span key={i} className="title-letter" style={{ animationDelay: (0.4 + i * 0.07) + "s" }}>{c}</span>
          ))}
        </h1>
        <div className="title-rule">
          <span className="title-rule-star">★</span>
          <span className="title-rule-line"></span>
          <span className="title-year">ANNO 1861 — 1865</span>
          <span className="title-rule-line"></span>
          <span className="title-rule-star">★</span>
        </div>
        <div className="title-sub">
          In which a young clerk shall write home, by lamp-light, until the war is ended.
        </div>

        <button className="title-seal" onClick={go} aria-label="Begin">
          <svg viewBox="0 0 200 200" width="180" height="180">
            <defs>
              <radialGradient id="seal-r" cx="0.4" cy="0.35" r="0.8">
                <stop offset="0"    stopColor="#d8423a"/>
                <stop offset="0.55" stopColor="#a02018"/>
                <stop offset="1"    stopColor="#5a0e08"/>
              </radialGradient>
            </defs>
            <path d="M100 18
                     Q150 12 162 50
                     Q198 80 184 130
                     Q190 178 138 184
                     Q100 198 60 184
                     Q12 178 16 130
                     Q2  80 38 50
                     Q50 12 100 18 Z"
                  fill="url(#seal-r)" stroke="#3a0806" strokeWidth="2"/>
            <circle cx="100" cy="100" r="64" fill="none" stroke="#3a0806" strokeWidth="1.5" strokeDasharray="3 3"/>
            <text x="100" y="92" textAnchor="middle"
                  fontFamily="Cinzel, serif" fontWeight="900" fontSize="26"
                  fill="#f6d28a" letterSpacing="6">BEGIN</text>
            <text x="100" y="118" textAnchor="middle"
                  fontFamily="IM Fell English, serif" fontStyle="italic" fontSize="13"
                  fill="#f6d28a" opacity="0.9">the chronicle</text>
            <text x="100" y="140" textAnchor="middle" fontSize="16" fill="#f6d28a">★ ★ ★</text>
          </svg>
        </button>

        <div className="title-hint">
          press <kbd>Enter</kbd> · or click the seal
        </div>
      </div>

      <div className="title-corner tl">★ VOL. I ★</div>
      <div className="title-corner tr">No. 1 · PRICE: ONE CENT</div>
      <div className="title-corner bl">Printed by lamp-light at the front</div>
      <div className="title-corner br">— sound of distant guns —</div>
      <div className="title-credit">
        A GAME BY <strong>THE MEAN ONE DEVELOPMENTS</strong> ★ MMXXVI
      </div>
    </div>
  );
}

Object.assign(window, { TitleScreen });
