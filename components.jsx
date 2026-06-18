// components.jsx — Civil-war typewriter UI bits + audio

const { useState, useEffect, useRef, useMemo, useCallback } = React;

function Dollar({ sm }) { return <span className={`dollar ${sm?"sm":""}`}></span>; }
function Medal() { return <span className="medal"></span>; }
function Coin({ size }) { return <Dollar sm={size && size < 18}/>; }

function Chip({ kind, label, children }) {
  return (
    <span className="chip">
      {label && <span className="label">{label}</span>}
      {kind === "gem" ? <Medal/> : <Dollar/>}
      <span>{children}</span>
    </span>
  );
}

function Avatar({ glyph, color, size=88 }) {
  return (
    <div className="portrait" style={{ background: `linear-gradient(180deg, ${color}, ${color}cc 60%, #4a3520)`, width: size, height: size, fontSize: Math.floor(size * 0.45) }}>
      {glyph}
    </div>
  );
}
function AvatarSm({ glyph, color }) {
  return <div className="portrait-sm" style={{ background: `linear-gradient(180deg, ${color}, #4a3520)` }}>{glyph}</div>;
}

function XPBar({ value, max, thin, kind, showText }) {
  const pct = clamp((value / max) * 100, 0, 100);
  return (
    <div className={`ribbon-bar ${thin?"thin":""} ${kind || ""}`} style={{position:"relative"}}>
      <i style={{ width: pct + "%" }}></i>
      {showText && (
        <span style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"var(--f-display)", fontSize: 10, color:"#2a1a08", letterSpacing:"0.12em", fontWeight:700}}>{value} / {max}</span>
      )}
    </div>
  );
}

function Toasts({ toasts }) {
  return (
    <div className="toasts">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.kind || ""}`}>
          <span className="ti">{t.icon || "★"}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// AUDIO ENGINE — synthesized typewriter sounds + period music
// ============================================================
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.musicOn = false;
    this.sfxOn = true;
    this.musicNodes = [];
    this.musicTimer = null;
    this.tune = 0;
  }
  _ensure() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }
  // Typewriter key click: noise burst + tonal pluck
  click(strong) {
    if (!this.sfxOn) return;
    const ctx = this._ensure(); if (!ctx) return;
    const t = ctx.currentTime;
    // Noise burst (mechanical clack)
    const len = 0.04;
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * len), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/d.length, 2.2);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const filt = ctx.createBiquadFilter(); filt.type = "bandpass"; filt.frequency.value = strong ? 2400 : 3200; filt.Q.value = 2;
    const g = ctx.createGain(); g.gain.value = strong ? 0.22 : 0.14;
    src.connect(filt); filt.connect(g); g.connect(ctx.destination);
    src.start(t); src.stop(t + len);
    // Tonal pluck under the click
    const o = ctx.createOscillator(); o.type = "square"; o.frequency.value = 180 + Math.random()*60;
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.05, t); og.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    o.connect(og); og.connect(ctx.destination); o.start(t); o.stop(t + 0.07);
  }
  // Carriage-return bell
  bell() {
    if (!this.sfxOn) return;
    const ctx = this._ensure(); if (!ctx) return;
    const t = ctx.currentTime;
    [1320, 1980, 2640].forEach((f,i) => {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18 / (i+1), t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 1.3);
    });
  }
  // "Battle Hymn of the Republic" — public domain melody (William Steffe, c.1856)
  // Encoded as scale degrees + durations, rendered via fife-like square synth
  _tunes() {
    // Public-domain Civil War melodies, encoded as freq+beat pairs
    const C = 261.63, D = 293.66, E = 329.63, F = 349.23, G = 392, A = 440, B = 493.88, C2 = 523.25, D2 = 587.33, E2 = 659.25;
    const Am = 220, Bb = 233.08, Bm = 246.94, Eb = 311.13;
    return [
      { name: "Battle Hymn of the Republic", bpm: 96, notes: [
        [G,1],[G,0.5],[G,0.5],[G,1],[E,0.5],[G,0.5],[G,1],[A,0.5],[G,0.5],[G,1],[E,1],
        [G,1],[G,0.5],[G,0.5],[G,1],[E,0.5],[G,0.5],[G,1],[E,1],[D,2],
        [G,1],[G,0.5],[G,0.5],[G,1],[E,0.5],[G,0.5],[G,1],[A,0.5],[G,0.5],[G,1],[E,1],
        [C2,1],[B,1],[A,1],[G,1],[F,1],[E,1],[D,1],[C,2],
      ]},
      { name: "When Johnny Comes Marching Home", bpm: 108, notes: [
        [Am,0.5],[C,0.5],[D,0.5],[E,0.5],[E,1],[A,1],
        [G,0.5],[E,0.5],[D,0.5],[C,0.5],[D,1],[Am,1],
        [Am,0.5],[C,0.5],[D,0.5],[E,0.5],[E,1],[F,1],
        [E,0.5],[D,0.5],[C,0.5],[Bm,0.5],[Am,2],
      ]},
      { name: "Dixie's Land", bpm: 120, notes: [
        [D,0.5],[E,0.5],[F,1],[E,1],[D,1],
        [D,0.5],[F,0.5],[A,1],[A,1],[G,1],[F,1],
        [E,0.5],[D,0.5],[E,1],[F,1],[D,2],
        [D,0.5],[E,0.5],[F,1],[A,1],[G,1],[F,1],[E,2],
      ]},
      { name: "The Bonnie Blue Flag", bpm: 112, notes: [
        [C,0.5],[E,0.5],[G,0.5],[C2,0.5],[G,1],[E,1],
        [C,0.5],[E,0.5],[G,0.5],[C2,0.5],[G,2],
        [A,0.5],[G,0.5],[F,0.5],[E,0.5],[D,1],[G,1],
        [E,0.5],[D,0.5],[C,2],
      ]},
      { name: "Battle Cry of Freedom", bpm: 124, notes: [
        [G,0.5],[G,0.5],[G,0.5],[G,0.5],[C2,1],[A,1],
        [G,0.5],[E,0.5],[E,0.5],[G,0.5],[C,2],
        [G,0.5],[G,0.5],[A,0.5],[B,0.5],[C2,1],[E2,1],
        [D2,0.5],[C2,0.5],[B,0.5],[A,0.5],[G,2],
      ]},
      { name: "Lorena", bpm: 70, notes: [
        [E,1],[G,1],[A,1],[B,1],[C2,2],[B,1],[A,1],
        [G,1],[E,1],[F,1],[G,2],[E,2],
        [D,1],[E,1],[G,1],[A,1],[B,2],[A,1],[G,1],
        [F,1],[E,1],[D,1],[C,4],
      ]},
      { name: "Marching Through Georgia", bpm: 132, notes: [
        [G,0.5],[E,0.5],[G,0.5],[A,0.5],[G,1],[E,1],
        [G,0.5],[A,0.5],[B,0.5],[C2,0.5],[B,2],
        [C2,0.5],[B,0.5],[A,0.5],[G,0.5],[A,1],[G,1],
        [E,0.5],[D,0.5],[C,2],
      ]},
      { name: "Home, Sweet Home", bpm: 68, notes: [
        [G,1],[G,0.5],[A,0.5],[B,1],[C2,1],
        [B,1],[A,1],[G,2],
        [E,1],[F,1],[G,1],[A,1],[G,2],
        [D,1],[E,1],[F,1],[D,1],[C,2],
      ]},
    ];
  }
  startMusic() {
    if (this.musicOn) return;
    const ctx = this._ensure(); if (!ctx) return;
    this.musicOn = true;
    const tunes = this._tunes();
    const tune = tunes[this.tune % tunes.length];
    this.tune++;
    const beat = 60 / tune.bpm;
    let t = ctx.currentTime + 0.1;

    // Drum (low thump on each beat)
    const totalBeats = tune.notes.reduce((s, n) => s + n[1], 0);
    for (let b = 0; b < totalBeats; b++) {
      const dt = t + b * beat;
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(120, dt); o.frequency.exponentialRampToValueAtTime(50, dt + 0.15);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.16, dt); g.gain.exponentialRampToValueAtTime(0.0001, dt + 0.18);
      o.connect(g); g.connect(ctx.destination); o.start(dt); o.stop(dt + 0.2);
      this.musicNodes.push(o);
    }
    // Fife melody
    for (const [freq, dur] of tune.notes) {
      const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = freq;
      const o2 = ctx.createOscillator(); o2.type = "square"; o2.frequency.value = freq;
      const g = ctx.createGain();
      const len = dur * beat;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.10, t + 0.02);
      g.gain.setValueAtTime(0.08, t + len - 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      const g2 = ctx.createGain(); g2.gain.value = 0.03;
      o.connect(g); o2.connect(g2); g.connect(ctx.destination); g2.connect(ctx.destination);
      o.start(t); o.stop(t + len);
      o2.start(t); o2.stop(t + len);
      this.musicNodes.push(o, o2);
      t += len;
    }
    // Loop
    const loopMs = (t - ctx.currentTime) * 1000 + 600;
    this.musicTimer = setTimeout(() => {
      this.musicOn = false;
      this.musicNodes = [];
      this.startMusic();
    }, loopMs);
  }
  stopMusic() {
    this.musicOn = false;
    if (this.musicTimer) { clearTimeout(this.musicTimer); this.musicTimer = null; }
    for (const n of this.musicNodes) { try { n.stop(); } catch(e){} }
    this.musicNodes = [];
  }
}

window.__audio = window.__audio || new AudioEngine();

// Listen globally so every keystroke in the page clicks
if (!window.__audio_bound) {
  window.__audio_bound = true;
  window.addEventListener("keydown", (e) => {
    if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter" || e.key === " ") {
      const strong = e.key === " " || e.key === "Enter";
      window.__audio.click(strong);
      // Random bell once in a while on space — like end of line
      if (e.key === " " && Math.random() < 0.04) setTimeout(() => window.__audio.bell(), 30);
    }
  }, true);
}

// ============================================================
// SOUND / MUSIC TOGGLE PANEL (bottom-right)
// ============================================================
function AudioControls() {
  const [sfx, setSfx] = useState(true);
  const [music, setMusic] = useState(false);
  const [tune, setTune] = useState(0);
  const [open, setOpen] = useState(false);
  const tunes = useMemo(() => window.__audio._tunes().map(t => t.name), []);
  useEffect(() => { window.__audio.sfxOn = sfx; }, [sfx]);
  useEffect(() => {
    window.__audio.stopMusic();
    window.__audio.tune = tune;
    if (music) window.__audio.startMusic();
  }, [music, tune]);
  return (
    <div style={{
      position: "fixed", right: 18, bottom: 18, zIndex: 150,
      display: "flex", flexDirection: "column", gap: 6,
      background: "linear-gradient(180deg, var(--parchment-light), var(--parchment-dark))",
      border: "2px solid var(--sepia)",
      boxShadow: "inset 0 0 0 1px var(--parchment-light), 0 3px 0 var(--sepia)",
      padding: "8px 10px", minWidth: 200,
      fontFamily: "var(--f-display)", fontSize: 10, letterSpacing: "0.16em", color: "var(--ink)",
    }}>
      <div style={{textAlign:"center", color:"var(--crimson)", fontSize:9, letterSpacing:"0.2em", borderBottom:"1px solid var(--sepia)", paddingBottom:3}}>★ FIELD AUDIO ★</div>
      <button onClick={() => setSfx(s => !s)} style={{textAlign:"left", display:"flex", gap:8, alignItems:"center", padding:"3px 6px", border:"1px solid var(--sepia)", background: sfx ? "var(--brass-bright)" : "var(--parchment-light)", color:"#2a1a08", fontFamily:"var(--f-display)", fontSize:10, letterSpacing:"0.14em"}}>
        <span style={{width:10, height:10, background: sfx ? "var(--crimson)" : "var(--sepia-dim)", borderRadius:"50%"}}></span>
        TYPE CLACK
      </button>
      <button onClick={() => setMusic(m => !m)} style={{textAlign:"left", display:"flex", gap:8, alignItems:"center", padding:"3px 6px", border:"1px solid var(--sepia)", background: music ? "var(--crimson)" : "var(--parchment-light)", color: music ? "var(--parchment-light)" : "#2a1a08", fontFamily:"var(--f-display)", fontSize:10, letterSpacing:"0.14em"}}>
        <span style={{width:10, height:10, background: music ? "var(--brass-bright)" : "var(--sepia-dim)", borderRadius:"50%"}}></span>
        FIFE & DRUM
      </button>
      <button onClick={() => setOpen(o => !o)} style={{textAlign:"left", padding:"3px 6px", border:"1px dashed var(--sepia)", background:"transparent", color:"var(--sepia)", fontFamily:"var(--f-display)", fontSize:9, letterSpacing:"0.14em"}}>
        {open ? "▾" : "▸"} TUNE: {tunes[tune].split(" ").slice(0,3).join(" ")}
      </button>
      {open && (
        <div style={{display:"flex", flexDirection:"column", gap:2, maxHeight:160, overflowY:"auto"}}>
          {tunes.map((n, i) => (
            <button key={i} onClick={() => { setTune(i); if (!music) setMusic(true); }}
              style={{textAlign:"left", padding:"3px 6px", border:"1px solid var(--sepia-dim)",
                background: tune===i ? "var(--brass-bright)" : "var(--parchment-light)",
                color: "var(--ink)", fontFamily:"var(--f-serif)", fontStyle:"italic", fontSize:11, letterSpacing:"0.04em"}}>
              {tune===i ? "♪ " : "  "}{n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// TYPEWRITER — round-keyed, animated carriage, key strike
// ============================================================
const KB_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"],
];
const TINTS = {
  "kb-wooden": { body:"#b8842c", body2:"#6a4a18", key:"#f3e4be", keyEdge:"#8a7a5a", keyT:"#2a1a08", panel:"#3a2810", accent:"#e8b860" },
  "kb-brass":  { body:"#d6a554", body2:"#7a5a1a", key:"#f8eecb", keyEdge:"#8a7a5a", keyT:"#2a1a08", panel:"#4a3010", accent:"#ffd98a" },
  "kb-ivory":  { body:"#b3a17c", body2:"#5a4a30", key:"#f8f1d8", keyEdge:"#9a8a6a", keyT:"#3a2a14", panel:"#3a2a14", accent:"#cdb487" },
  "kb-arcade": { body:"#7a4a2a", body2:"#3a1f10", key:"#e8b860", keyEdge:"#6a4a18", keyT:"#1a0a04", panel:"#1a0a04", accent:"#e8b860" },
  "kb-runic":  { body:"#5a4a30", body2:"#2a1f10", key:"#cdb487", keyEdge:"#6a4a18", keyT:"#1a0a04", panel:"#1a0a04", accent:"#c8a35b" },
  "kb-neon":   { body:"#2a3a5e", body2:"#0d1830", key:"#e8b860", keyEdge:"#7a5a1a", keyT:"#1a0a04", panel:"#0d1830", accent:"#e8b860" },
};

function Typewriter({ lit, machine }) {
  const t = TINTS[machine] || TINTS["kb-wooden"];
  const litK = (lit || "").toUpperCase();
  // carriage position 0..1, advances on each keystroke; resets on bell
  const [carriage, setCarriage] = useState(0);
  const [shake, setShake] = useState(0);
  const [lastStrike, setLastStrike] = useState({ k: "", t: 0 });
  useEffect(() => {
    function onKey(e) {
      if (e.key.length !== 1 && e.key !== " " && e.key !== "Enter") return;
      setLastStrike({ k: e.key.toUpperCase(), t: Date.now() });
      setCarriage(c => {
        const next = c + (1 / 36);
        if (next >= 1) { setShake(s => s+1); return 0; }
        return next;
      });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // any-time "is this key currently down" via lastStrike recency
  const isLit = (k) => (litK === k) || (lastStrike.k === k && (Date.now() - lastStrike.t) < 120);

  // round-key renderer
  function Key({ x, y, label, w=42, h=42 }) {
    const lit = isLit(label);
    const cx = x + w/2, cy = y + h/2;
    return (
      <g key={x+"-"+y+"-"+label} style={{ transition: "transform 0.05s", transformOrigin: `${cx}px ${cy}px`, transform: lit ? "translateY(2px) scale(0.96)" : "none" }}>
        {/* metal ring */}
        <circle cx={cx} cy={cy} r={w/2 + 1} fill={t.body2}/>
        <circle cx={cx} cy={cy} r={w/2 - 1} fill={t.keyEdge}/>
        {/* keycap */}
        <circle cx={cx} cy={cy} r={w/2 - 4} fill={lit ? t.accent : t.key}
                stroke={t.body2} strokeWidth="0.5"/>
        {/* highlight crescent */}
        <path d={`M ${cx - w/2 + 6} ${cy - 3} a ${w/2 - 6} ${w/2 - 6} 0 0 1 ${w - 12} -3`}
              fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round"/>
        {/* legend */}
        <text x={cx} y={cy + 5} textAnchor="middle"
              fontFamily="Cinzel, serif" fontWeight="700" fontSize="14"
              fill={lit ? "#1a0a04" : t.keyT}>{label}</text>
      </g>
    );
  }

  const VW = 680, VH = 360;
  const keyW = 42, gap = 8;

  // shake offset for carriage return (bell)
  const shakeX = (shake % 2) ? 0 : 0; // CSS keyframe via key

  return (
    <div className="typewriter">
      <svg viewBox={`0 0 ${VW} ${VH}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.body}/>
            <stop offset="100%" stopColor={t.body2}/>
          </linearGradient>
          <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.panel}/>
            <stop offset="100%" stopColor="#0d0703"/>
          </linearGradient>
          <radialGradient id="platenGrad">
            <stop offset="0%" stopColor="#3a2810"/>
            <stop offset="80%" stopColor="#1a0e04"/>
          </radialGradient>
          <radialGradient id="ribbonRed">
            <stop offset="0%" stopColor="#b03a2e"/>
            <stop offset="100%" stopColor="#3a0d08"/>
          </radialGradient>
        </defs>

        {/* === Paper sheet sticking out the top === */}
        <g key={shake /* re-key on bell to retrigger anim */} style={{ animation: shake ? "carriageReturn 0.5s ease-out" : "none" }}>
          <rect x="190" y="2" width="300" height="58" fill="#f3e4be" stroke="#8a7a5a" strokeWidth="1"/>
          {[14,24,34,44].map(y => <line key={y} x1="210" y1={y} x2="470" y2={y} stroke="#8a7a5a" strokeOpacity="0.35"/>)}
          {/* typed marks proportional to carriage */}
          <g transform={`translate(${210}, 14)`}>
            {Array(Math.floor(carriage * 32)).fill(0).map((_, i) => (
              <rect key={i} x={i * 8} y={0} width="5" height="2" fill="#2a1f15"/>
            ))}
          </g>
        </g>

        {/* === Carriage assembly === */}
        <rect x="60" y="56" width="560" height="60" rx="8" fill="url(#panelGrad)" stroke={t.body2} strokeWidth="2"/>
        {/* slide rail */}
        <rect x="80" y="76" width="520" height="3" fill={t.body2}/>
        <rect x="80" y="100" width="520" height="3" fill={t.body2}/>
        {/* moving carriage block (slides RIGHT to LEFT as you type) */}
        <g style={{ transition: "transform 0.08s ease-out", transform: `translateX(${(1 - carriage) * 360}px)` }}>
          <rect x="80" y="64" width="160" height="44" rx="4" fill={t.body} stroke={t.body2} strokeWidth="2"/>
          <rect x="86" y="70" width="148" height="32" rx="2" fill="url(#platenGrad)"/>
          {/* paper guide tabs */}
          <rect x="88" y="60" width="6" height="8" fill={t.body2}/>
          <rect x="226" y="60" width="6" height="8" fill={t.body2}/>
          {/* small carriage handle */}
          <rect x="232" y="80" width="8" height="14" fill={t.accent} stroke={t.body2}/>
        </g>
        {/* platen knobs (fixed on body sides) */}
        <circle cx="56" cy="86" r="16" fill={t.body} stroke={t.body2} strokeWidth="2"/>
        <circle cx="56" cy="86" r="8" fill={t.body2}/>
        <line x1="56" y1="74" x2="56" y2="78" stroke={t.accent} strokeWidth="2"/>
        <circle cx="624" cy="86" r="16" fill={t.body} stroke={t.body2} strokeWidth="2"/>
        <circle cx="624" cy="86" r="8" fill={t.body2}/>

        {/* === Type-bar fan (decorative) === */}
        <g opacity="0.7">
          {Array(13).fill(0).map((_, i) => {
            const a = -60 + i * 10;
            const r = 60;
            const x1 = 340, y1 = 150;
            const x2 = 340 + Math.sin(a * Math.PI / 180) * r;
            const y2 = 150 - Math.cos(a * Math.PI / 180) * r;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={t.body2} strokeWidth="2.5" strokeLinecap="round"/>;
          })}
          {/* one bar flicked up when a key is hit */}
          {lastStrike.k && (Date.now() - lastStrike.t) < 150 && (
            <line x1="340" y1="150" x2="340" y2="62" stroke={t.accent} strokeWidth="3" strokeLinecap="round"
                  style={{ animation: "typeBarFlick 0.15s ease-out" }}/>
          )}
        </g>

        {/* === Main body === */}
        <rect x="40" y="140" width="600" height="200" rx="14" fill="url(#bodyGrad)" stroke={t.body2} strokeWidth="3"/>
        {/* gold trim bands */}
        <rect x="40" y="138" width="600" height="4" fill={t.body2}/>
        <rect x="40" y="338" width="600" height="4" fill={t.body2}/>
        <rect x="40" y="186" width="600" height="2" fill={t.accent} opacity="0.6"/>
        {/* name plate */}
        <g>
          <rect x="270" y="148" width="140" height="26" rx="3" fill={t.body2}/>
          <rect x="273" y="151" width="134" height="20" rx="2" fill={t.panel}/>
          <text x="340" y="166" textAnchor="middle"
                fontFamily="Cinzel, serif" fontWeight="700" fontSize="11"
                fill={t.accent} letterSpacing="3">DISPATCHES</text>
        </g>

        {/* === Ribbon spools (small, clean brass discs) === */}
        <g>
          <circle cx="140" cy="168" r="11" fill={t.body2}/>
          <circle cx="140" cy="168" r="7" fill={t.accent} opacity="0.85"/>
          <circle cx="140" cy="168" r="2" fill={t.body2}/>
        </g>
        <g>
          <circle cx="540" cy="168" r="11" fill={t.body2}/>
          <circle cx="540" cy="168" r="7" fill={t.accent} opacity="0.85"/>
          <circle cx="540" cy="168" r="2" fill={t.body2}/>
        </g>

        {/* === Keys === */}
        <g transform="translate(0, 200)">
          {KB_ROWS[0].map((k, i) => <Key key={k} x={90 + i*(keyW+gap)} y={0}   label={k}/>)}
          {KB_ROWS[1].map((k, i) => <Key key={k} x={115 + i*(keyW+gap)} y={50}  label={k}/>)}
          {KB_ROWS[2].map((k, i) => <Key key={k} x={155 + i*(keyW+gap)} y={100} label={k}/>)}
        </g>

        {/* === Space bar === */}
        <g style={{ transition: "transform 0.05s", transform: isLit(" ") ? "translateY(2px)" : "none" }}>
          <rect x="200" y="324" width="280" height="12" rx="6" fill={isLit(" ") ? t.accent : t.key} stroke={t.body2} strokeWidth="1.5"/>
        </g>

        {/* === Side bell (right) — rings when carriage returns === */}
        <g style={{ transformOrigin: "608px 220px", animation: shake ? "bellRing 0.4s ease-out" : "none" }}>
          <circle cx="608" cy="220" r="13" fill={t.body2}/>
          <circle cx="608" cy="220" r="9" fill={t.accent}/>
          <circle cx="608" cy="220" r="2" fill={t.body2}/>
        </g>

        <style>{`
          @keyframes carriageReturn { 0% { transform: translateX(-12px); } 60% { transform: translateX(6px); } 100% { transform: translateX(0); } }
          @keyframes bellRing { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-22deg); } 75% { transform: rotate(22deg); } }
          @keyframes typeBarFlick { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }
          @keyframes spool { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </svg>
    </div>
  );
}

Object.assign(window, { Dollar, Medal, Coin, Chip, Avatar, AvatarSm, XPBar, Toasts, Typewriter, KeyboardPreview: Typewriter, AudioControls });
