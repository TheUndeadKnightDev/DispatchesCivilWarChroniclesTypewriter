// typing.jsx — the four game modes
// Exports: TypingGame (Sprint, Marathon, Survival, Boss)

const { useState: _us, useEffect: _ue, useRef: _ur, useMemo: _um, useCallback: _uc } = React;

// ============ HELPERS ============
function buildPassage(words, count) {
  const out = [];
  for (let i = 0; i < count; i++) out.push(words[Math.floor(Math.random() * words.length)]);
  return out.join(" ");
}
function pickPassage() {
  return PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
}

// ============ Shared typing engine state ============
function useTypingEngine(target, opts = {}) {
  const onFinish = opts.onFinish;
  const onKey = opts.onKey;
  const [typed, setTyped] = _us("");
  const [errors, setErrors] = _us(0);
  const [keys, setKeys] = _us(0);
  const [streak, setStreak] = _us(0);
  const [bestStreak, setBestStreak] = _us(0);
  const [startedAt, setStartedAt] = _us(null);
  const [finishedAt, setFinishedAt] = _us(null);
  const [shieldUsed, setShieldUsed] = _us(false);

  const onKeyDown = _uc((e) => {
    if (finishedAt) return;
    const k = e.key;
    if (k === "Escape") { opts.onEscape && opts.onEscape(); return; }
    if (k === "Backspace") {
      e.preventDefault();
      setTyped(t => t.slice(0, -1));
      return;
    }
    if (k.length !== 1) return;
    e.preventDefault();
    if (!startedAt) setStartedAt(Date.now());
    const idx = typed.length;
    const expected = target[idx];
    const ok = k === expected;
    setKeys(n => n + 1);
    setTyped(t => t + k);
    if (ok) {
      setStreak(s => {
        const ns = s + 1;
        setBestStreak(b => Math.max(b, ns));
        return ns;
      });
    } else {
      setErrors(n => n + 1);
      if (opts.shield && !shieldUsed) {
        setShieldUsed(true);
      } else {
        setStreak(0);
      }
    }
    onKey && onKey({ key: k, ok, idx });
    if (idx + 1 >= target.length) {
      setFinishedAt(Date.now());
      onFinish && onFinish({ keys: keys + 1, errors: errors + (ok?0:1), elapsedMs: (Date.now() - (startedAt || Date.now())) });
    }
  }, [typed, target, startedAt, finishedAt, errors, keys, shieldUsed, opts.shield, onFinish, onKey, opts.onEscape]);

  _ue(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const elapsedMs = startedAt ? ((finishedAt || Date.now()) - startedAt) : 0;
  const correctChars = typed.split("").filter((c, i) => c === target[i]).length;
  const accuracy = keys ? (correctChars / keys) * 100 : 100;
  const wpm = elapsedMs > 0 ? Math.round((correctChars / 5) / (elapsedMs / 60000)) : 0;

  return {
    typed, errors, keys, streak, bestStreak, startedAt, finishedAt,
    elapsedMs, accuracy, wpm, correctChars,
    reset: () => { setTyped(""); setErrors(0); setKeys(0); setStreak(0); setBestStreak(0); setStartedAt(null); setFinishedAt(null); setShieldUsed(false); }
  };
}

// ============ ARENA BAR ============
function ArenaBar({ stats, onQuit }) {
  return (
    <div className="arena-bar">
      <button className="btn ghost sm" onClick={onQuit}>◀ QUIT</button>
      <div className="spacer"></div>
      {stats.map(s => (
        <div key={s.k} className={`live-stat ${s.kind || ""}`}>
          <div className="k">{s.k}</div>
          <div className="v">{s.v}</div>
        </div>
      ))}
    </div>
  );
}

// ============ RENDER PASSAGE ============
function PassageRender({ target, typed }) {
  const chars = _um(() => target.split(""), [target]);
  return (
    <div className="passage">
      {chars.map((c, i) => {
        let cls = "ch";
        if (i < typed.length) cls += typed[i] === c ? " done" : " err";
        else if (i === typed.length) cls += " cur" + (c === " " ? " space" : "");
        return <span key={i} className={cls}>{c}</span>;
      })}
    </div>
  );
}

// ============ SPRINT (60s timer, free passage) ============
function SprintMode({ profile, onEnd }) {
  const passageRef = _ur(null);
  if (!passageRef.current) passageRef.current = buildPassage(COMMON_WORDS, 80);
  const [target, setTarget] = _us(passageRef.current);
  const DURATION = 60_000;
  const [now, setNow] = _us(Date.now());
  const [done, setDone] = _us(false);
  const engine = useTypingEngine(target, {
    shield: profile.owned.includes("boost-shield"),
    onEscape: () => onEnd(null),
    onFinish: () => {
      // extend target if user finishes early
      setTarget(t => t + " " + buildPassage(COMMON_WORDS, 40));
    }
  });

  _ue(() => {
    if (!engine.startedAt) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [engine.startedAt]);

  const elapsed = engine.startedAt ? (now - engine.startedAt) : 0;
  const remaining = Math.max(0, DURATION - elapsed);
  _ue(() => {
    if (!engine.startedAt) return;
    if (remaining <= 0 && !done) {
      setDone(true);
      onEnd({
        mode: "sprint",
        wpm: engine.wpm, accuracy: engine.accuracy,
        correctChars: engine.correctChars, keys: engine.keys, errors: engine.errors,
        elapsedMs: DURATION, longestStreak: engine.bestStreak,
        success: true, score: engine.correctChars,
      });
    }
  }, [remaining, done]);

  const secs = Math.ceil(remaining / 1000);
  const lastTyped = engine.typed[engine.typed.length - 1] || target[engine.typed.length] || " ";

  return (
    <div className="arena">
      <ArenaBar
        stats={[
          { k: "TIME", v: pad(Math.floor(secs/60)) + ":" + pad(secs%60), kind: secs <= 10 ? "bad" : "" },
          { k: "WPM", v: engine.wpm, kind: "good" },
          { k: "ACC", v: Math.round(engine.accuracy) + "%", kind: engine.accuracy >= 95 ? "good" : engine.accuracy >= 80 ? "" : "bad" },
          { k: "COMBO", v: "x" + engine.streak, kind: "blue" },
          { k: "SCORE", v: engine.correctChars, kind: "gold" },
        ]}
        onQuit={() => onEnd(null)}
      />
      <div className="arena-stage">
        <SoldierAside profile={profile} k={engine.keys} errors={engine.errors} streak={engine.streak}/>
        <div className="sheet">
          <div className="sheet-header">
            <div className="form-no">FORM 14-S · TRANSMISSION, GENERAL</div>
            <h3>FIELD DISPATCH</h3>
            <div className="from">From the desk of {profile.name}, {profile.regiment}</div>
          </div>
          <PassageRender target={target.slice(0, engine.typed.length + 240)} typed={engine.typed}/>
          <div className="passage-foot">
            <span>{engine.startedAt ? "Keep typing" : "Strike a key to begin"}</span>
            <div className="ribbon-bar thin"><i style={{ width: (engine.typed.length / target.length * 100) + "%" }}></i></div>
            <span className="mono">{engine.keys} keys · {engine.errors} err</span>
          </div>
          <div className="wax">D</div>
        </div>
        <Typewriter lit={lastTyped} machine={profile.equipped.machine}/>
      </div>
    </div>
  );
}

// ============ MARATHON (full passage, finish to win) ============
function MarathonMode({ profile, onEnd }) {
  const tRef = _ur(null);
  if (!tRef.current) {
    // assemble 3 passages
    const a = pickPassage(), b = pickPassage(), c = pickPassage();
    tRef.current = a + " " + b + " " + c;
  }
  const target = tRef.current;
  const engine = useTypingEngine(target, {
    shield: profile.owned.includes("boost-shield"),
    onEscape: () => onEnd(null),
    onFinish: (r) => {
      onEnd({
        mode: "marathon",
        wpm: engine.wpm, accuracy: engine.accuracy,
        correctChars: engine.correctChars, keys: r.keys, errors: r.errors,
        elapsedMs: r.elapsedMs, longestStreak: engine.bestStreak,
        success: true, score: Math.round(engine.correctChars * (engine.accuracy/100)),
      });
    }
  });
  const lastTyped = engine.typed[engine.typed.length - 1] || target[engine.typed.length] || " ";
  const elapsed = engine.startedAt ? ((engine.finishedAt || Date.now()) - engine.startedAt) : 0;
  const secs = Math.floor(elapsed / 1000);

  return (
    <div className="arena">
      <ArenaBar
        stats={[
          { k: "TIME", v: pad(Math.floor(secs/60)) + ":" + pad(secs%60) },
          { k: "WPM", v: engine.wpm, kind: "good" },
          { k: "ACC", v: Math.round(engine.accuracy) + "%", kind: engine.accuracy >= 95 ? "good" : "" },
          { k: "COMBO", v: "x" + engine.streak, kind: "blue" },
          { k: "PROG", v: Math.floor(engine.typed.length / target.length * 100) + "%", kind: "gold" },
        ]}
        onQuit={() => onEnd(null)}
      />
      <div className="arena-stage">
        <SoldierAside profile={profile} k={engine.keys} errors={engine.errors} streak={engine.streak}/>
        <div className="sheet">
          <div className="sheet-header">
            <div className="form-no">FORM 22-M · CORRESPONDENCE, FULL</div>
            <h3>LONG DISPATCH</h3>
            <div className="from">From the desk of {profile.name}, {profile.regiment}</div>
          </div>
          <PassageRender target={target} typed={engine.typed}/>
          <div className="passage-foot">
            <span>{engine.startedAt ? "Long dispatch in progress" : "Take a breath. Strike a key to begin."}</span>
            <div className="ribbon-bar thin"><i style={{ width: (engine.typed.length / target.length * 100) + "%" }}></i></div>
            <span className="mono">{engine.keys} keys · {engine.errors} err</span>
          </div>
          <div className="wax">D</div>
        </div>
        <Typewriter lit={lastTyped} machine={profile.equipped.machine}/>
      </div>
    </div>
  );
}

// ============ SURVIVAL (words fall, type to clear) ============
function SurvivalMode({ profile, onEnd }) {
  const [words, setWords] = _us([]); // { id, text, x, y, typed, vy, born }
  const [score, setScore] = _us(0);
  const [lives, setLives] = _us(3);
  const [targetId, setTargetId] = _us(null);
  const [streak, setStreak] = _us(0);
  const [bestStreak, setBestStreak] = _us(0);
  const [keys, setKeys] = _us(0);
  const [errors, setErrors] = _us(0);
  const [startedAt] = _us(Date.now());
  const [over, setOver] = _us(false);
  const tickRef = _ur();
  const spawnRef = _ur();

  // game loop
  _ue(() => {
    if (over) return;
    let last = Date.now();
    tickRef.current = setInterval(() => {
      const t = Date.now();
      const dt = (t - last) / 1000;
      last = t;
      // speed scales with survival time
      const speed = 60 + Math.min(180, (t - startedAt) / 500);
      setWords(ws => {
        const out = [];
        let lost = 0;
        for (const w of ws) {
          const ny = w.y + speed * dt;
          if (ny > 420 - 30) { lost++; continue; }
          out.push({ ...w, y: ny });
        }
        if (lost) {
          setLives(l => {
            const nl = l - lost;
            if (nl <= 0 && !over) {
              setOver(true);
              setTimeout(() => onEnd({
                mode: "survival",
                wpm: 0, accuracy: keys ? (keys - errors) / keys * 100 : 100,
                correctChars: score * 5, keys, errors,
                elapsedMs: Date.now() - startedAt,
                longestStreak: bestStreak, survivedWords: score,
                success: true, score,
              }), 800);
            }
            return Math.max(0, nl);
          });
          setStreak(0);
        }
        return out;
      });
    }, 40);
    return () => clearInterval(tickRef.current);
  }, [over]);

  // spawner
  _ue(() => {
    if (over) return;
    function spawn() {
      const elapsed = (Date.now() - startedAt) / 1000;
      const pool = elapsed > 60 ? RARE_WORDS.concat(COMMON_WORDS) : COMMON_WORDS;
      const text = pool[Math.floor(Math.random() * pool.length)];
      const id = Math.random().toString(36).slice(2);
      setWords(ws => [...ws, { id, text, x: 10 + Math.random() * 80, y: 0, typed: 0 }]);
      const interval = Math.max(700, 1700 - elapsed * 15);
      spawnRef.current = setTimeout(spawn, interval + Math.random() * 400);
    }
    spawn();
    return () => clearTimeout(spawnRef.current);
  }, [over]);

  // typing handler
  _ue(() => {
    function onKey(e) {
      if (over) return;
      const k = e.key;
      if (k === "Escape") { onEnd(null); return; }
      if (k.length !== 1) return;
      e.preventDefault();
      setKeys(n => n + 1);
      setWords(ws => {
        // find existing target word
        let tgt = targetId ? ws.find(w => w.id === targetId) : null;
        if (!tgt) {
          // find a word whose next char matches k
          tgt = ws.find(w => w.text[w.typed] === k);
          if (!tgt) {
            setErrors(n => n + 1);
            setStreak(0);
            return ws;
          }
          setTargetId(tgt.id);
        }
        const next = tgt.text[tgt.typed];
        if (next === k) {
          const newTyped = tgt.typed + 1;
          if (newTyped >= tgt.text.length) {
            // word complete
            setScore(s => s + 1);
            setStreak(s => {
              const ns = s + 1;
              setBestStreak(b => Math.max(b, ns));
              return ns;
            });
            setTargetId(null);
            return ws.filter(w => w.id !== tgt.id);
          }
          return ws.map(w => w.id === tgt.id ? { ...w, typed: newTyped } : w);
        } else {
          setErrors(n => n + 1);
          setStreak(0);
          return ws;
        }
      });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [targetId, over]);

  const elapsed = Math.floor((Date.now() - startedAt) / 1000);

  return (
    <div className="arena">
      <ArenaBar
        stats={[
          { k: "LIVES", v: "♥".repeat(Math.max(0,lives)) + "♡".repeat(Math.max(0,3 - lives)), kind: lives <= 1 ? "bad" : "" },
          { k: "TIME", v: pad(Math.floor(elapsed/60)) + ":" + pad(elapsed%60) },
          { k: "CLEARED", v: score, kind: "gold" },
          { k: "COMBO", v: "x" + streak, kind: "blue" },
          { k: "ERR", v: errors, kind: errors > 5 ? "bad" : "" },
        ]}
        onQuit={() => onEnd(null)}
      />
      <div className="arena-stage">
        <SoldierAside profile={profile} k={engine.keys} errors={engine.errors} streak={engine.streak}/>
        <div className="battlefield">
          <div className="smoke"></div>
          <div className="horizon"></div>
          <div className="trench"></div>
          <div className="ground"></div>
          {words.map(w => (
            <div key={w.id}
                 className={`fall-word ${w.id === targetId ? "target" : ""}`}
                 style={{ left: w.x + "%", top: w.y + "px" }}>
              <span className="typed">{w.text.slice(0, w.typed)}</span>
              <span className="rest">{w.text.slice(w.typed)}</span>
            </div>
          ))}
          {over && (
            <div style={{
              position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
              background:"rgba(0,0,0,0.5)",
              fontFamily:"var(--f-display)", fontSize: 36, color:"var(--crimson-bright)", letterSpacing:"0.12em"
            }}>THE LINE BROKE</div>
          )}
        </div>
        <div style={{marginTop:14, fontSize:18, color:"var(--sepia)", fontStyle:"italic"}}>
          Strike the first letter to fix a dispatch in your sights, then finish it before it reaches the line.
        </div>
      </div>
    </div>
  );
}

// ============ BOSS (typing battle) ============
function BossMode({ profile, onEnd }) {
  // pick boss by chapter / level
  const bossIdx = _um(() => Math.min(BOSS_PHRASES.length-1, Math.max(0, profile.story.chapter)), [profile]);
  const boss = BOSS_PHRASES[bossIdx];
  const [hp, setHp] = _us(boss.hp);
  const targetRef = _ur(boss.text);
  const target = targetRef.current;

  const engine = useTypingEngine(target, {
    shield: profile.owned.includes("boost-shield"),
    onEscape: () => onEnd(null),
    onKey: ({ ok }) => { if (ok) setHp(h => Math.max(0, h - 1)); },
  });

  _ue(() => {
    if (hp <= 0 && !engine.finishedAt) {
      onEnd({
        mode: "boss", boss: boss.name,
        wpm: engine.wpm, accuracy: engine.accuracy,
        correctChars: engine.correctChars, keys: engine.keys, errors: engine.errors,
        elapsedMs: engine.elapsedMs, longestStreak: engine.bestStreak,
        success: true, score: boss.hp * 2, bossDefeated: true,
      });
    }
  }, [hp]);

  const lastTyped = engine.typed[engine.typed.length - 1] || " ";
  const hpPct = hp / boss.hp * 100;

  return (
    <div className="arena">
      <ArenaBar
        stats={[
          { k: "WPM", v: engine.wpm, kind: "good" },
          { k: "ACC", v: Math.round(engine.accuracy) + "%", kind: "" },
          { k: "COMBO", v: "x" + engine.streak, kind: "blue" },
          { k: "DMG", v: engine.correctChars, kind: "bad" },
        ]}
        onQuit={() => onEnd(null)}
      />
      <div className="arena-stage">
        <SoldierAside profile={profile} k={engine.keys} errors={engine.errors} streak={engine.streak}/>
        <div className="engagement">
          <div className="head">
            <div className="crest">{boss.glyph}</div>
            <div className="info">
              <div className="label">ENGAGEMENT</div>
              <div className="name">{boss.name}</div>
              <div className="where">{boss.title} · {boss.where}</div>
              <div className="hp-bar">
                <i style={{ width: hpPct + "%" }}></i>
                <span className="label-h">RESOLVE {hp} / {boss.hp}</span>
              </div>
            </div>
          </div>
          <div className="sheet">
            <div className="sheet-header">
              <div className="form-no">FORM 7-B · BATTLE REPORT</div>
              <h3>FROM THE FIELD</h3>
              <div className="from">{boss.where}</div>
            </div>
            <PassageRender target={target} typed={engine.typed}/>
            <div className="passage-foot">
              <span>Every correct stroke carries the field by one yard. Errors do not.</span>
              <div className="ribbon-bar thin"><i style={{ width: (engine.typed.length / target.length * 100) + "%" }}></i></div>
            </div>
            <div className="wax">D</div>
          </div>
          <Typewriter lit={lastTyped} machine={profile.equipped.machine}/>
        </div>
      </div>
    </div>
  );
}

function TypingGame({ mode, profile, onEnd }) {
  if (mode === "sprint")   return <SprintMode   profile={profile} onEnd={onEnd}/>;
  if (mode === "marathon") return <MarathonMode profile={profile} onEnd={onEnd}/>;
  if (mode === "survival") return <SurvivalMode profile={profile} onEnd={onEnd}/>;
  if (mode === "boss")     return <BossMode     profile={profile} onEnd={onEnd}/>;
  return null;
}


function SoldierAside({ profile, k, errors = 0, streak = 0 }) {
  // Mood derives from recent performance; debounced via refs so it doesn't flicker every keystroke.
  const moodRef = React.useRef({ mood: "neutral", since: 0, lastErrors: 0, lastStreak: 0, lineIdx: 0, lineSince: 0 });
  const m = moodRef.current;
  const now = Date.now();
  const dErr = errors - m.lastErrors;
  const dStreak = streak - m.lastStreak;
  const prevMood = m.mood;
  if (dErr >= 2 && now - m.since > 1400) { m.mood = "wince"; m.since = now; }
  else if (dErr === 1 && now - m.since > 2200) { m.mood = "frown"; m.since = now; }
  else if (dStreak > 0 && streak > 0 && streak % 25 === 0 && now - m.since > 1800) { m.mood = "happy"; m.since = now; }
  else if (k > 0 && k % 60 === 0 && dErr === 0 && now - m.since > 2200) { m.mood = "focus"; m.since = now; }
  else if (m.mood !== "neutral" && now - m.since > 2200) { m.mood = "neutral"; }
  m.lastErrors = errors; m.lastStreak = streak;

  const lines = {
    neutral: ["Steady now.","The ink will not pour itself.","Mind the margins.","Keep on."],
    focus:   ["Good rhythm. Hold it.","I can hear the keys singing."],
    happy:   ["Ha! There's the touch.","Capital. Capital work."],
    wince:   ["Easy — the colonel reads these.","Ach. Begin again."],
    frown:   ["A misstrike. Steady the hand.","Watch your spelling, soldier."],
  };
  const pool = lines[m.mood] || lines.neutral;
  const moodChanged = prevMood !== m.mood && m.mood !== "neutral";
  if (moodChanged) { m.lineIdx = Math.floor(Math.random() * pool.length); m.lineSince = now; }
  else if (now - m.lineSince > 6000) { m.lineIdx = (m.lineIdx + 1) % pool.length; m.lineSince = now; }
  const line = pool[m.lineIdx % pool.length];

  return (
    <div className={"soldier-aside mood-" + m.mood} key={m.mood + "-" + Math.floor(m.since / 200)}>
      <SoldierPortrait a={profile.appearance} w={200} h={250} lit={true} mood={m.mood}/>
      <div className="soldier-aside-name">{(profile.appearance?.rank || "private").toUpperCase()} {profile.name.toUpperCase()}</div>
      <div className="soldier-aside-line">{line}</div>
    </div>
  );
}

Object.assign(window, { TypingGame });
