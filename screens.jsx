// screens.jsx — DISPATCHES non-typing screens

const { useState: $s, useEffect: $e, useRef: $r, useMemo: $m } = React;

// ============ PROFILE / ENLISTMENT SELECT ============
function ProfileSelect({ profiles, onPick, onDelete, onCreate }) {
  const [creating, setCreating] = $s(false);
  const [name, setName] = $s("");
  const [glyph, setGlyph] = $s("");
  const [color, setColor] = $s(AV_COLORS[0]);
  const [regiment, setRegiment] = $s(randomRegiment());
  const GLYPHS = ["A","B","C","D","E","F","G","H","J","L","M","R","S","T","W","★","☘","✦","♛","♞","◆","☾","⚙","△"];

  function submit() {
    const n = name.trim();
    if (!n) return;
    onCreate({ name: n, glyph: glyph || n[0].toUpperCase(), color, regiment });
    setCreating(false); setName(""); setGlyph(""); setColor(AV_COLORS[0]); setRegiment(randomRegiment());
  }

  return (
    <div className="profile-screen parchment-bg">
      <div className="title-block">
        <div className="eyebrow">★ A TYPEWRITER CHRONICLE OF THE WAR ★</div>
        <h1>DISPATCHES</h1>
        <div className="year">— ANNO 1861–1865 —</div>
        <div className="sub">In which a young clerk shall write home, by lamp-light, until the war is ended.</div>
        <div className="rule"></div>
      </div>

      <div className="flourish" style={{width:"min(880px,90%)"}}>
        <span className="star">★</span>
        <span style={{fontFamily:"var(--f-display)", fontSize:12, letterSpacing:"0.25em"}}>SELECT YOUR SERVICE RECORD</span>
        <span className="star">★</span>
      </div>

      <div className="profile-grid">
        {profiles.map(p => {
          const { level } = levelFromXp(p.xp);
          return (
            <div key={p.id} className="profile-card" onClick={() => onPick(p.id)}>
              <div className="rank-strip">{rankFor(level)}</div>
              <div className="stamp">SERVICE<br/>RECORD<br/>★ {pad(level)} ★</div>
              <button className="del" onClick={(e) => { e.stopPropagation(); if (confirm(`Strike "${p.name}" from the rolls? This cannot be undone.`)) onDelete(p.id); }}>✕</button>
              <Avatar glyph={p.glyph} color={p.color} size={88}/>
              <div className="name">{p.name}</div>
              <div className="regt">{p.regiment}</div>
              <div className="row-meta">
                <span><Dollar sm/> {fmt(p.coins)}</span>
                <span>★ {fmt(p.stats.totalKeys)} keys</span>
              </div>
            </div>
          );
        })}
        <div className="profile-card new" onClick={() => setCreating(true)}>
          <div className="plus">+</div>
          <div style={{fontFamily:"var(--f-display)", fontSize:12, letterSpacing:"0.18em", marginTop:8}}>ENLIST A NEW CLERK</div>
        </div>
      </div>

      <div style={{fontFamily:"var(--f-serif)", fontStyle:"italic", fontSize:16, color:"var(--sepia)"}}>
        — Press any key on the typewriter to begin —
      </div>

      {creating && (
        <div className="modal-bg" onClick={(e) => { if (e.target.classList.contains("modal-bg")) setCreating(false); }}>
          <div className="modal">
            <h2>Articles of Enlistment</h2>
            <div className="subhead">Form 1A · Volunteer Service · Union Army</div>
            <div className="field">
              <label>Name of recruit</label>
              <input type="text" value={name} maxLength={16} placeholder="J. Atticus Hollis" onChange={e => setName(e.target.value)} autoFocus onKeyDown={e => e.key==='Enter' && submit()}/>
            </div>
            <div className="field">
              <label>Initial / mark</label>
              <div className="option-row">
                {GLYPHS.slice(0, 18).map(g => (
                  <button key={g} type="button" className={`option-btn ${glyph===g?"sel":""}`} onClick={() => setGlyph(g)}>{g}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Portrait tone</label>
              <div className="option-row">
                {AV_COLORS.map(c => (
                  <button key={c} type="button" className={`option-btn color-swatch ${color===c?"sel":""}`} onClick={() => setColor(c)} style={{background: c}}>●</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Regiment of assignment</label>
              <div className="option-row">
                {REGIMENTS.slice(0, 8).map(r => (
                  <button key={r} type="button" className={`option-btn ${regiment===r?"sel":""}`} onClick={() => setRegiment(r)} style={{minWidth:0, fontSize:11}}>{r}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Preview</label>
              <div style={{display:"flex", gap:14, alignItems:"center", padding:"10px 14px", background:"var(--parchment-light)", border:"1px solid var(--sepia)"}}>
                <Avatar glyph={glyph || (name[0] || "?").toUpperCase()} color={color} size={56}/>
                <div>
                  <div style={{fontFamily:"var(--f-display)", fontWeight:700, fontSize:16, letterSpacing:"0.1em"}}>{name.toUpperCase() || "UNNAMED"}</div>
                  <div style={{fontFamily:"var(--f-serif)", fontStyle:"italic", fontSize:15, color:"var(--sepia)"}}>{regiment}</div>
                  <div style={{fontFamily:"var(--f-type)", fontSize:13, marginTop:4}}>Rank: Recruit · $50 bounty</div>
                </div>
              </div>
            </div>
            <div className="row" style={{justifyContent:"flex-end", gap:10, marginTop:14}}>
              <button className="btn ghost" onClick={() => setCreating(false)}>Decline</button>
              <button className="btn primary" onClick={submit} disabled={!name.trim()}>Take the Oath</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ TOP BAR ============
function TopBar({ profile, onSwitch, page, setPage }) {
  const { level, intoLvl, needLvl } = levelFromXp(profile.xp);
  return (
    <div className="topbar">
      <div className="brand-block" onClick={() => setPage("hub")}>
        <div className="seal">D</div>
        <div className="lockup">
          <div className="name">DISPATCHES</div>
          <div className="tag">a chronicle of the war</div>
        </div>
      </div>
      <div className="who">
        <div className="portrait-sm" style={{background: `linear-gradient(180deg, ${profile.color}, #4a3520)`, color: "#f3e4be"}}>{profile.glyph}</div>
        <div>
          <div className="name">{profile.name}</div>
          <div className="rank">{rankFor(level)} · {profile.regiment}</div>
          <div className="xp-line">
            <span className="lvl-pip">LV {level}</span>
            <XPBar value={intoLvl} max={needLvl} thin/>
            <span style={{fontFamily:"var(--f-type)", fontSize:12, color:"var(--sepia)"}}>{intoLvl}/{needLvl}</span>
          </div>
        </div>
      </div>
      <div className="spacer"></div>
      <Chip label="DOLLARS">{fmt(profile.coins)}</Chip>
      <Chip kind="gem" label="STARS">{fmt(profile.gems)}</Chip>
      <button className="btn ghost sm" onClick={onSwitch}>◀ ROLLS</button>
    </div>
  );
}

// ============ SIDE NAV ============
function SideNav({ page, setPage, hasNewQuests }) {
  const items = [
    { id: "play",   label: "Orders",        glyph: "▶" },
    { id: "camp",   label: "Camp",          glyph: "⚒" },
    { id: "story",  label: "Chronicle",     glyph: "§" },
    { id: "shop",   label: "Quartermaster", glyph: "$" },
    { id: "stats",  label: "Service Record",glyph: "≡" },
    { id: "quests", label: "Daily Orders",  glyph: "✦" },
    { id: "ach",    label: "Commendations", glyph: "★" },
  ];
  return (
    <div className="sidenav">
      {items.map(it => (
        <button key={it.id} className={`nav-btn ${page===it.id?"active":""}`} onClick={() => setPage(it.id)}>
          <span className="nav-glyph">{it.glyph}</span>
          {it.label}
          {it.id==="quests" && hasNewQuests && <span className="nav-badge">NEW</span>}
        </button>
      ))}
    </div>
  );
}

// ============ PLAY ============
function PlayScreen({ profile, onStart }) {
  const { level } = levelFromXp(profile.xp);
  const modes = [
    { id: "sprint",   name: "Sprint Dispatch",  no: "FORM 14-S", icon: "I",  lvl: 1,
      desc: "One minute at the keys. Type as much of the dispatch as you can carry. Modest pay, brisk experience.",
      best: "best: " + fmt(profile.stats.sprintHigh || 0) + " strokes" },
    { id: "marathon", name: "Long Dispatch",    no: "FORM 22-M", icon: "II", lvl: 2,
      desc: "Three full letters home, end to end. A slow and accurate hand pays best. The night will be long.",
      best: "best run: " + (profile.stats.marathonBest ? Math.round(profile.stats.marathonBest) + " marks" : "—") },
    { id: "survival", name: "Hold the Line",    no: "FORM 8-V",  icon: "III",lvl: 4,
      desc: "Dispatches descend from the smoke. Strike them down before they reach the trench. Three errors and the line breaks.",
      best: "best: " + fmt(profile.stats.survivalHigh || 0) + " held" },
    { id: "boss",     name: "Engagement",       no: "FORM 7-B",  icon: "IV", lvl: 6,
      desc: "Stand at the keys and write the full battle report. Each correct stroke advances the line by one yard.",
      best: fmt(profile.stats.bossesDefeated) + " engagements carried" },
  ];
  return (
    <div>
      <div className="section-head">
        <h2>Orders of the Day</h2>
        <div className="sub">Choose your duty, {profile.name}.</div>
      </div>
      <div className="mode-grid">
        {modes.map(m => {
          const locked = level < m.lvl;
          return (
            <div key={m.id}
                 className={`mode-card ${locked?"locked":""}`}
                 data-lvl={m.lvl}
                 onClick={() => !locked && onStart(m.id)}>
              <div className="head">
                <div className="seal">{m.icon}</div>
                <div>
                  <div className="formno">{m.no}</div>
                  <h3>{m.name}</h3>
                </div>
              </div>
              <p>{m.desc}</p>
              <div className="foot">
                <span>{m.best}</span>
                <div className="spacer"></div>
                {!locked && <span className="enter">UNDERTAKE ▸</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="subhead">A note from the Adjutant</div>
      <div style={{fontFamily:"var(--f-serif)", fontStyle:"italic", fontSize:18, color:"var(--ink-soft)", maxWidth: 760, lineHeight:1.4}}>
        Press <b>Esc</b> at any time to break off and return to camp. Combos break upon a slip, except where you have purchased the
        <b> Forgiver's Eraser</b> from the Quartermaster, which absorbs the first error of any run.
      </div>
    </div>
  );
}

// ============ SHOP / QUARTERMASTER ============
function ShopPreview({ item }) {
  if (item.cat === "paper") {
    const tints = { blue: "#cdd6e3", rose:"#e3cdcf", olive:"#cdd6b5", noir:"#3a2810", sunset:"#e8b860", default:"#ead7b0" };
    const bg = tints[item.tint || "default"];
    return <div style={{width:"100%", height:"100%", background: `linear-gradient(135deg, ${bg}, #cdb487)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#2a1f15", fontFamily:"var(--f-type)", fontSize:11, padding: 14, textAlign:"center"}}>
      My dear Eliza,<br/>The rains have come...
    </div>;
  }
  if (item.cat === "machine") {
    return <div style={{width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(180deg, #cdb487, #a9856a)"}}>
      <Typewriter lit="" machine={item.id}/>
    </div>;
  }
  if (item.cat === "ribbon") {
    const c = { "fx-none":"#2a1f15", "fx-sparks":"#3a2810", "fx-flames":"#7a2a20", "fx-ripple":"#1f2a3a", "fx-aurora":"#c8a35b" }[item.id] || "#2a1f15";
    return <div style={{width:"100%", height:"100%", background:"var(--parchment-light)", display:"flex", alignItems:"center", justifyContent:"center"}}>
      <div style={{width: "80%", height: 8, background: c, boxShadow: `0 14px 0 ${c}88, 0 28px 0 ${c}44`}}></div>
    </div>;
  }
  if (item.cat === "sundry") {
    return <div style={{width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(180deg, var(--parchment-dark), var(--sepia))"}}>
      <div style={{fontFamily:"var(--f-display)", fontWeight:900, fontSize:36, color:"var(--brass-bright)"}}>+</div>
      <div style={{fontFamily:"var(--f-display)", fontSize:10, letterSpacing:"0.18em", color:"var(--parchment-light)"}}>PERMANENT ISSUE</div>
    </div>;
  }
  if (item.cat === "nib") {
    const cur = { "cur-block":"█", "cur-line":"│", "cur-under":"_", "cur-heart":"♥" }[item.id] || "█";
    return <div style={{width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background: "var(--parchment-light)"}}>
      <span style={{fontFamily:"var(--f-type)", fontSize:42, color:"var(--ink)"}}>A{cur}</span>
    </div>;
  }
  return null;
}

function ShopScreen({ profile, onBuy, onEquip }) {
  const [tab, setTab] = $s("paper");
  const items = SHOP_ITEMS.filter(i => i.cat === tab);
  const equipKey = { paper:"paper", machine:"machine", ribbon:"ribbon", nib:"nib" }[tab];

  return (
    <div>
      <Quartermaster profile={profile}/>
      <div className="section-head">
        <h2>The Quartermaster</h2>
        <div className="sub">Stationery, machines & sundries — paid in silver dollars.</div>
      </div>
      <div className="shop-tabs">
        {[
          ["paper","Paper Stocks"],
          ["machine","Typewriters"],
          ["ribbon","Ribbons"],
          ["nib","Nibs"],
          ["sundry","Sundries"],
        ].map(([id,label]) => (
          <button key={id} className={`shop-tab ${tab===id?"active":""}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      <div className="shop-grid">
        {items.map(it => {
          const owned = profile.owned.includes(it.id);
          const equipped = equipKey && profile.equipped[equipKey] === it.id;
          const canAfford = profile.coins >= it.price;
          return (
            <div key={it.id} className={`shop-card ${owned?"owned":""} ${equipped?"equipped":""}`}>
              {equipped && <span className="ribbon">ISSUED</span>}
              {!equipped && owned && <span className="ribbon">OWNED</span>}
              <div className="preview"><ShopPreview item={it}/></div>
              <div className="name">{it.name}</div>
              <div className="desc">{it.desc}</div>
              {!owned ? (
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <div className="price"><Dollar sm/> {fmt(it.price)}</div>
                  <button className="btn sm primary" disabled={!canAfford} onClick={() => onBuy(it)}>REQUISITION</button>
                </div>
              ) : (
                <div style={{display:"flex", justifyContent:"flex-end"}}>
                  {it.cat === "sundry"
                    ? <span style={{fontFamily:"var(--f-display)", fontSize:11, color:"var(--olive)", letterSpacing:"0.14em"}}>IN USE</span>
                    : equipped
                      ? <span style={{fontFamily:"var(--f-display)", fontSize:11, color:"var(--brass-dark)", letterSpacing:"0.14em"}}>EQUIPPED</span>
                      : <button className="btn sm" onClick={() => onEquip(it)}>EQUIP</button>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ STATS / SERVICE RECORD ============
function StatsScreen({ profile }) {
  const s = profile.stats;
  const acc = s.totalKeys ? (s.correctKeys / s.totalKeys * 100) : 0;
  const time = s.timeTypedMs || 0;
  const hh = Math.floor(time / 3600000), mm = Math.floor((time % 3600000) / 60000), ss = Math.floor((time % 60000) / 1000);
  const { level, intoLvl, needLvl } = levelFromXp(profile.xp);
  return (
    <div>
      <div className="section-head">
        <h2>Service Record</h2>
        <div className="sub">{profile.name} · {profile.regiment} · enlisted {new Date(profile.createdAt).toLocaleDateString()}</div>
      </div>
      <div className="stats-grid">
        <div className="stat-tile"><div className="k">Rank</div><div className="v crimson">{rankFor(level)}</div><div className="sub">LV {level} · {intoLvl}/{needLvl} XP</div></div>
        <div className="stat-tile"><div className="k">Commendation</div><div className="v">{fmt(profile.xp)}</div><div className="sub">total experience</div></div>
        <div className="stat-tile"><div className="k">Silver Dollars</div><div className="v">{fmt(profile.coins)}</div></div>
        <div className="stat-tile"><div className="k">Best WPM</div><div className="v">{s.bestWpm}</div></div>
        <div className="stat-tile"><div className="k">Best Accuracy</div><div className="v">{Math.round(s.bestAccuracy)}%</div></div>
        <div className="stat-tile"><div className="k">Lifetime Accuracy</div><div className="v">{acc.toFixed(1)}%</div></div>
        <div className="stat-tile"><div className="k">Keys Struck</div><div className="v">{fmt(s.totalKeys)}</div></div>
        <div className="stat-tile"><div className="k">Correct Strokes</div><div className="v">{fmt(s.correctKeys)}</div></div>
        <div className="stat-tile"><div className="k">Errors</div><div className="v">{fmt(s.errors)}</div></div>
        <div className="stat-tile"><div className="k">Dispatches Sent</div><div className="v">{fmt(s.runsCompleted)}</div></div>
        <div className="stat-tile"><div className="k">Engagements Won</div><div className="v">{fmt(s.bossesDefeated)}</div></div>
        <div className="stat-tile"><div className="k">Longest Volley</div><div className="v">x{fmt(s.longestStreak)}</div></div>
        <div className="stat-tile"><div className="k">Sprint High</div><div className="v">{fmt(s.sprintHigh)}</div></div>
        <div className="stat-tile"><div className="k">Line Held</div><div className="v">{fmt(s.survivalHigh)}</div></div>
        <div className="stat-tile"><div className="k">Hours at the Keys</div><div className="v">{pad(hh)}:{pad(mm)}:{pad(ss)}</div></div>
        <div className="stat-tile"><div className="k">Days in Service</div><div className="v">{Math.max(1, Math.floor((Date.now() - profile.createdAt)/86400000))}d</div></div>
      </div>
    </div>
  );
}

// ============ ACHIEVEMENTS / COMMENDATIONS ============
function AchievementsScreen({ profile }) {
  const { level } = levelFromXp(profile.xp);
  const stats = { ...profile.stats, level };
  const list = ACHIEVEMENTS.map(a => {
    const cur = a.stat === "level" ? level : (stats[a.stat] || 0);
    const done = cur >= a.target;
    return { ...a, cur, done, prog: Math.min(100, (cur / a.target) * 100) };
  });
  const earned = list.filter(a => a.done).length;
  return (
    <div>
      <div className="section-head">
        <h2>Commendations</h2>
        <div className="sub">{earned} of {ACHIEVEMENTS.length} medals earned</div>
      </div>
      <div className="ach-grid">
        {list.map(a => (
          <div key={a.id} className={`ach-card ${a.done?"":"locked"}`}>
            <div className="medal-big">{a.glyph}</div>
            <div style={{flex:1, minWidth:0}}>
              <div className="name">{a.name}</div>
              <div className="desc">{a.desc}</div>
              <div className="prog"><i style={{width: a.prog + "%"}}></i></div>
              <div style={{fontFamily:"var(--f-type)", fontSize:13, color:"var(--sepia)", marginTop:4}}>{fmt(Math.min(a.cur, a.target))} / {fmt(a.target)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ QUESTS / DAILY ORDERS ============
function QuestsScreen({ profile, onClaim }) {
  const dayKey = todayKey();
  const fresh = profile.quests.date !== dayKey;
  const quests = pickDailyQuests(dayKey);
  return (
    <div>
      <div className="section-head">
        <h2>Daily Orders</h2>
        <div className="sub">By order of the Adjutant General · {dayKey}</div>
      </div>
      {fresh && (
        <div style={{padding:14, marginBottom:14, background:"var(--parchment-light)", border:"2px solid var(--crimson)", boxShadow:"0 3px 0 var(--crimson)", fontFamily:"var(--f-display)", fontSize:13, letterSpacing:"0.16em", color:"var(--crimson)"}}>
          ★ NEW ORDERS POSTED — UNDERTAKE A DUTY TO MAKE PROGRESS
        </div>
      )}
      <div className="quest-list">
        {quests.map(q => {
          const session = (profile.quests.date === dayKey ? profile.quests.session : {}) || {};
          const key = q.stat.split(".")[1];
          const cur = session[key] || 0;
          const done = cur >= q.target;
          const claimed = profile.quests.completed && profile.quests.completed[q.id];
          return (
            <div key={q.id} className={`quest-row ${claimed?"done":""}`}>
              <div className="qseal">✦</div>
              <div className="qbody">
                <div className="name">{q.name}</div>
                <div className="desc">{q.desc}</div>
              </div>
              <div className="qbar">
                <XPBar value={Math.min(cur, q.target)} max={q.target} thin showText/>
              </div>
              <div className="qreward"><Dollar sm/> +{fmt(q.reward)}</div>
              <button className="btn sm primary" disabled={!done || claimed} onClick={() => onClaim(q)}>
                {claimed ? "PAID" : done ? "CLAIM" : "—"}
              </button>
            </div>
          );
        })}
      </div>
      <div className="subhead">Adjutant's Note</div>
      <div style={{fontFamily:"var(--f-serif)", fontStyle:"italic", fontSize:18, color:"var(--ink-soft)", lineHeight:1.4, maxWidth:780}}>
        Three orders are posted at reveille and expire at the next. Pay is rendered upon claim. Take only what
        you can carry out before the bugle.
      </div>
    </div>
  );
}

// ============ STORY / CHRONICLE ============
function StoryScreen({ profile, onPlayChapter }) {
  const { level } = levelFromXp(profile.xp);
  const reqLvl = (i) => 1 + i * 3;
  return (
    <div>
      <div className="section-head">
        <h2>The Chronicle</h2>
        <div className="sub">Chapter {Math.min(profile.story.chapter + 1, STORY_CHAPTERS.length)} of {STORY_CHAPTERS.length}</div>
      </div>
      <div className="story-list">
        {STORY_CHAPTERS.map((q, i) => {
          const done = i < profile.story.chapter;
          const current = i === profile.story.chapter;
          const locked = level < reqLvl(i);
          return (
            <div key={i} className={`chapter ${done?"done":""} ${current && !locked ? "current":""} ${locked?"locked":""}`}>
              <div className="roman">{q.no}</div>
              <div style={{flex:1}}>
                <h3>{q.title}</h3>
                <div className="date">{q.date}</div>
                <p>{q.text}</p>
                <div className="meta">
                  <span>Reward · <Dollar sm/> {fmt(400 * (i+1))} · {200 * (i+1)} XP</span>
                  <span className="spacer"></span>
                  {locked
                    ? <span style={{color:"var(--crimson)"}}>Sealed until rank LV {reqLvl(i)}</span>
                    : done
                      ? <span style={{color:"var(--olive)"}}>★ Transcribed</span>
                      : current
                        ? <button className="btn sm crimson" onClick={() => onPlayChapter(i)}>TRANSCRIBE</button>
                        : <span style={{color:"var(--sepia)"}}>Locked until the previous chapter is committed</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ RESULTS MODAL ============
function ResultsModal({ result, levelBefore, levelAfter, gain, profile, onClose, onAgain, onChapter }) {
  if (!result) return null;
  const wpm = result.wpm || 0;
  const acc = Math.round(result.accuracy || 0);
  const verdict =
    wpm >= 80 ? "A blistering hand, sir. Word travels faster than the wire." :
    wpm >= 60 ? "A strong return. The Adjutant is pleased." :
    wpm >= 40 ? "Steady at the keys. Acceptable." :
    acc >= 95 ? "Slow but without a blot — a clerk's clerk." :
    "Keep at it. Every dispatch carries the line.";
  return (
    <div className="modal-bg">
      <div className="results-modal">
        <h2>{result.success ? "Dispatch Delivered" : "Run Broken Off"}</h2>
        <div className="verdict">{verdict}</div>
        <div className="results-grid">
          <div className="cell"><div className="k">WPM</div><div className="v">{wpm}</div></div>
          <div className="cell"><div className="k">Accuracy</div><div className="v">{acc}%</div></div>
          <div className="cell"><div className="k">Strokes</div><div className="v">{fmt(result.keys || 0)}</div></div>
          <div className="cell"><div className="k">Volley</div><div className="v">x{result.longestStreak || 0}</div></div>
        </div>
        <div className="rewards">
          <div className="row" style={{justifyContent:"space-between"}}><span>Base pay</span><span className="gain">+{fmt(gain.coinsBase)}</span></div>
          <div className="row" style={{justifyContent:"space-between"}}><span>Accuracy bonus</span><span className="gain">+{fmt(gain.coinsAcc)}</span></div>
          <div className="row" style={{justifyContent:"space-between"}}><span>Volley bonus</span><span className="gain">+{fmt(gain.coinsCombo)}</span></div>
          {gain.coinMult > 1 && <div className="row" style={{justifyContent:"space-between"}}><span style={{color:"var(--sepia)"}}>Brass Inkwell ×{gain.coinMult}</span><span style={{color:"var(--sepia)"}}>applied</span></div>}
          <div className="row total"><span>★ DOLLARS EARNED ★</span><span><Dollar sm/> +{fmt(gain.coins)}</span></div>
          <div className="row total"><span>★ COMMENDATION ★</span><span style={{color:"var(--union)"}}>+{fmt(gain.xp)} XP</span></div>
        </div>
        {levelAfter > levelBefore && (
          <div className="lvlup">★ PROMOTED — {rankFor(levelBefore)} → {rankFor(levelAfter)} ★</div>
        )}
        {result.mode === "story" && onChapter && (
          <div className="lvlup" style={{background:"linear-gradient(180deg, var(--moss), var(--olive))", color:"#f3e4be", borderColor:"#3a4a1c"}}>
            ★ CHAPTER COMMITTED TO RECORD ★
          </div>
        )}
        <div className="row" style={{justifyContent:"center", gap:12, marginTop:14}}>
          <button className="btn ghost" onClick={onClose}>Back to camp</button>
          <button className="btn primary" onClick={onAgain}>Take it again</button>
        </div>
      </div>
    </div>
  );
}

// ============ STORY RUNNER ============
function StoryRunner({ profile, chapterIdx, onEnd }) {
  const ch = STORY_CHAPTERS[chapterIdx];
  const target = ch.text;
  const engine = useTypingEngine(target, {
    shield: profile.owned.includes("boost-shield"),
    onEscape: () => onEnd(null),
    onFinish: (r) => {
      onEnd({
        mode: "story",
        chapterIdx,
        wpm: engine.wpm, accuracy: engine.accuracy,
        correctChars: engine.correctChars, keys: r.keys, errors: r.errors,
        elapsedMs: r.elapsedMs, longestStreak: engine.bestStreak,
        success: true, score: target.length, chapterReward: true,
      });
    }
  });
  const lastTyped = engine.typed[engine.typed.length - 1] || " ";
  const elapsed = engine.startedAt ? ((engine.finishedAt || Date.now()) - engine.startedAt) : 0;
  const secs = Math.floor(elapsed / 1000);
  return (
    <div className="arena">
      <ArenaBar
        stats={[
          { k: "CHAPTER", v: ch.no },
          { k: "TIME", v: pad(Math.floor(secs/60)) + ":" + pad(secs%60) },
          { k: "WPM", v: engine.wpm, kind: "good" },
          { k: "ACC", v: Math.round(engine.accuracy) + "%" },
          { k: "PROG", v: Math.floor(engine.typed.length / target.length * 100) + "%" },
        ]}
        onQuit={() => onEnd(null)}
      />
      <div className="arena-stage">
        <div className="soldier-aside" key={engine.keys % 8}>
          <SoldierPortrait a={profile.appearance} w={220} h={280} lit={true}/>
          <div className="soldier-aside-name">{(profile.appearance?.rank || "private").toUpperCase()} {profile.name.toUpperCase()}</div>
          <div className="soldier-aside-line">
            {(() => {
              const lines = [
                "Steady now — take the next word.",
                "My hand is cramping. Yours?",
                "Mind your spelling — the colonel reads these.",
                "The candle is burning low. Hurry.",
                "I had this dream of home again.",
                "Tom would have laughed at this passage.",
                "Keep on. The Chronicle does not write itself.",
                "Coffee's gone cold. So is the ink.",
              ];
              return lines[engine.keys % lines.length];
            })()}
          </div>
        </div>
        <div className="sheet">
          <div className="sheet-header">
            <div className="form-no">CHAPTER {ch.no} OF THE CHRONICLE</div>
            <h3>{ch.title}</h3>
            <div className="from">{ch.date}</div>
          </div>
          <PassageRender target={target} typed={engine.typed}/>
          <div className="passage-foot">
            <span>Transcribe the chapter to commit it to record.</span>
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

Object.assign(window, {
  ProfileSelect, TopBar, SideNav, PlayScreen, ShopScreen,
  StatsScreen, AchievementsScreen, QuestsScreen, StoryScreen,
  ResultsModal, StoryRunner,
});
