// app.jsx — root, routing, persistence

const { useState: A_s, useEffect: A_e, useRef: A_r } = React;

function App() {
  const [store, setStore] = A_s(loadStore);
  const [page, setPage] = A_s("hub");
  const [running, setRunning] = A_s(null); // {mode} or {mode:'story', chapter}
  const [result, setResult] = A_s(null); // result + gain bundle
  const [toasts, setToasts] = A_s([]);
  const [customizing, setCustomizing] = A_s(false);
  const [diary, setDiary] = A_s(false);
  const [showTitle, setShowTitle] = A_s(true);

  // persist on every store change
  A_e(() => { saveStore(store); }, [store]);

  const profile = store.currentId ? store.profiles.find(p => p.id === store.currentId) : null;

  function updateProfile(updater) {
    setStore(s => ({
      ...s,
      profiles: s.profiles.map(p => p.id === s.currentId ? updater(p) : p),
    }));
  }
  function pushToast(msg, kind, icon) {
    const id = Math.random().toString(36).slice(2);
    setToasts(ts => [...ts, { id, msg, kind, icon }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 3500);
  }

  // === PROFILE LIFECYCLE ===
  function createProfile({ name, glyph, color }) {
    const p = makeProfile(name, glyph, color);
    setStore(s => ({ profiles: [...s.profiles, p], currentId: p.id }));
    setPage("hub");
    pushToast("Welcome, " + p.name + "!", "", "✦");
  }
  function pickProfile(id) {
    setStore(s => ({ ...s, currentId: id, profiles: s.profiles.map(p => p.id === id ? { ...p, lastPlayedAt: Date.now() } : p) }));
    setPage("hub");
  }
  function deleteProfile(id) {
    setStore(s => ({
      profiles: s.profiles.filter(p => p.id !== id),
      currentId: s.currentId === id ? null : s.currentId,
    }));
  }
  function switchProfile() {
    setStore(s => ({ ...s, currentId: null }));
  }

  // === ACHIEVEMENT CHECK ===
  function checkAchievements(p) {
    const { level } = levelFromXp(p.xp);
    const stats = { ...p.stats, level };
    const newly = {};
    for (const a of ACHIEVEMENTS) {
      const cur = a.stat === "level" ? level : (stats[a.stat] || 0);
      if (cur >= a.target && !p.achievements[a.id]) {
        newly[a.id] = Date.now();
        pushToast("Achievement: " + a.name, "ach", "★");
      }
    }
    if (Object.keys(newly).length === 0) return p;
    return { ...p, achievements: { ...p.achievements, ...newly } };
  }

  // === SHOP ===
  function buy(item) {
    updateProfile(p => {
      if (p.coins < item.price) return p;
      if (p.owned.includes(item.id)) return p;
      const np = { ...p, coins: p.coins - item.price, owned: [...p.owned, item.id] };
      // auto-equip if category is single-slot
      if (["theme","keyboard","effect","cursor"].includes(item.cat)) {
        np.equipped = { ...p.equipped, [item.cat]: item.id };
      }
      return np;
    });
    pushToast("Acquired: " + item.name, "", "$");
  }
  function equip(item) {
    if (!["theme","keyboard","effect","cursor"].includes(item.cat)) return;
    updateProfile(p => ({ ...p, equipped: { ...p.equipped, [item.cat]: item.id } }));
    pushToast("Equipped: " + item.name, "", "▸");
  }

  // === QUEST CLAIM ===
  function claimQuest(q) {
    updateProfile(p => {
      const completed = { ...(p.quests.completed || {}) };
      if (completed[q.id]) return p;
      completed[q.id] = Date.now();
      return { ...p, coins: p.coins + q.reward, quests: { ...p.quests, completed } };
    });
    pushToast("Quest claimed: +" + fmt(q.reward) + " coins", "quest", "✦");
  }

  // === REWARD CALCULATION ===
  function calcGain(result, p) {
    const coinsBase = Math.round((result.correctChars || 0) * 0.6);
    const coinsAcc = Math.round((result.correctChars || 0) * Math.max(0, (result.accuracy - 80) / 100));
    const coinsCombo = Math.floor((result.longestStreak || 0) / 5) * 2;
    let coinMult = 1;
    if (p.owned.includes("boost-2x-coin")) coinMult *= 1.5;
    if (result.mode === "boss") coinMult *= 2;
    if (result.mode === "story") coinMult *= 3;
    const coins = Math.round((coinsBase + coinsAcc + coinsCombo) * coinMult);
    let xp = Math.round((result.correctChars || 0) * 0.4 + (result.wpm || 0) * 2);
    if (p.owned.includes("boost-2x-xp")) xp = Math.round(xp * 1.5);
    if (result.mode === "boss") xp *= 2;
    if (result.mode === "story") {
      xp += 300 * (result.chapterIdx + 1);
      // include guaranteed chapter coin reward
      // coins already multiplied, add chapter coin bonus
      // handled below
    }
    return { coinsBase, coinsAcc, coinsCombo, coinMult, coins, xp };
  }

  // === RUN END ===
  function endRun(result) {
    setRunning(null);
    if (!result) return; // abandoned
    if (!profile) return;
    const before = levelFromXp(profile.xp).level;
    let gain = calcGain(result, profile);
    // chapter coin reward
    let chapterBonus = 0;
    if (result.mode === "story") {
      chapterBonus = 500 * (result.chapterIdx + 1);
      gain.coins += chapterBonus;
      gain.coinsBase += chapterBonus;
    }

    updateProfile(p => {
      const s = p.stats;
      const next = {
        ...p,
        coins: p.coins + gain.coins,
        xp: p.xp + gain.xp,
        lastPlayedAt: Date.now(),
        stats: {
          ...s,
          totalKeys: s.totalKeys + (result.keys || 0),
          correctKeys: s.correctKeys + (result.correctChars || 0),
          errors: s.errors + (result.errors || 0),
          bestWpm: Math.max(s.bestWpm, result.wpm || 0),
          bestAccuracy: Math.max(s.bestAccuracy, result.accuracy || 0),
          sprintHigh: result.mode === "sprint" ? Math.max(s.sprintHigh, result.score || 0) : s.sprintHigh,
          marathonBest: result.mode === "marathon" ? Math.max(s.marathonBest || 0, result.score || 0) : s.marathonBest,
          survivalHigh: result.mode === "survival" ? Math.max(s.survivalHigh, result.survivedWords || result.score || 0) : s.survivalHigh,
          runsCompleted: s.runsCompleted + 1,
          bossesDefeated: result.bossDefeated ? s.bossesDefeated + 1 : s.bossesDefeated,
          longestStreak: Math.max(s.longestStreak, result.longestStreak || 0),
          timeTypedMs: s.timeTypedMs + (result.elapsedMs || 0),
        },
      };

      // chapter advance
      if (result.mode === "story") {
        next.story = { ...p.story, chapter: Math.max(p.story.chapter, result.chapterIdx + 1) };
      }

      // session quests
      const dayKey = todayKey();
      let qs = p.quests;
      if (qs.date !== dayKey) qs = { date: dayKey, session: {}, completed: {} };
      const session = { ...qs.session };
      session.keys = (session.keys || 0) + (result.keys || 0);
      session.runs = (session.runs || 0) + 1;
      session.bestWpm = Math.max(session.bestWpm || 0, result.wpm || 0);
      session.bestAcc = Math.max(session.bestAcc || 0, result.accuracy || 0);
      session.bosses = (session.bosses || 0) + (result.bossDefeated ? 1 : 0);
      session.survivalHigh = Math.max(session.survivalHigh || 0, result.survivedWords || (result.mode === "survival" ? result.score : 0) || 0);
      session.longestStreak = Math.max(session.longestStreak || 0, result.longestStreak || 0);
      next.quests = { ...qs, session };

      return checkAchievements(next);
    });

    const after = levelFromXp(profile.xp + gain.xp).level;
    if (after > before) pushToast("LEVEL UP! " + before + " → " + after, "ach", "★");

    setResult({ result, gain, levelBefore: before, levelAfter: after });
  }

  // === RENDER ===
  if (showTitle) {
    return <TitleScreen onBegin={() => setShowTitle(false)}/>;
  }
  if (!profile) {
    return (
      <>
        <ProfileSelect
          profiles={store.profiles}
          onPick={pickProfile}
          onDelete={deleteProfile}
          onCreate={createProfile}
        />
        <Toasts toasts={toasts}/>
      </>
    );
  }

  // currently running a typing game
  if (running) {
    if (running.mode === "story") {
      return <>
        <StoryRunner profile={profile} chapterIdx={running.chapter} onEnd={endRun}/>
        <Toasts toasts={toasts}/>
      </>;
    }
    return <>
      <TypingGame mode={running.mode} profile={profile} onEnd={endRun}/>
      <Toasts toasts={toasts}/>
    </>;
  }

  // hub
  const dayKey = todayKey();
  const hasNewQuests = profile.quests.date !== dayKey;

  let content = null;
  if (page === "hub" || page === "play") {
    content = <PlayScreen profile={profile} onStart={(m) => setRunning({ mode: m })}/>;
  } else if (page === "shop") {
    content = <ShopScreen profile={profile} onBuy={buy} onEquip={equip}/>;
  } else if (page === "stats") {
    content = <StatsScreen profile={profile}/>;
  } else if (page === "ach") {
    content = <AchievementsScreen profile={profile}/>;
  } else if (page === "quests") {
    content = <QuestsScreen profile={profile} onClaim={claimQuest}/>;
  } else if (page === "story") {
    content = <StoryScreen profile={profile} onPlayChapter={(i) => setRunning({ mode: "story", chapter: i })}/>;
  } else if (page === "camp") {
    content = <CampScreen profile={profile}
      onGrant={({coins, xp, label}) => {
        updateProfile(p => ({ ...p, coins: p.coins + coins, xp: p.xp + xp }));
        pushToast("Dispatch sealed: +" + fmt(coins) + "¢", "ach", "✦");
      }}/>;
  }

  return (
    <div className="hub">
      <TopBar profile={profile} onSwitch={switchProfile} page={page} setPage={setPage}/>
      <TelegraphTicker/>
      <div className="hub-body">
        <SideNav page={page === "hub" ? "play" : page} setPage={setPage} hasNewQuests={hasNewQuests}/>
        <div className="content">
          {content}
        </div>
      </div>
      {result && (
        <ResultsModal
          {...result}
          profile={profile}
          onClose={() => { setResult(null); setPage("play"); }}
          onAgain={() => {
            const mode = result.result.mode;
            setResult(null);
            if (mode === "story") setPage("story");
            else setRunning({ mode });
          }}
        />
      )}
      <button onClick={() => setCustomizing(true)} style={{position:"fixed", left:18, bottom:18, zIndex:150, padding:"8px 14px", fontFamily:"var(--f-display)", letterSpacing:"0.16em", fontSize:11, background:"linear-gradient(180deg, var(--brass-bright), var(--brass))", color:"#2a1a08", border:"2px solid #6a4a18", boxShadow:"0 3px 0 #6a4a18, inset 0 1px 0 rgba(255,255,255,0.5)", cursor:"pointer"}}>★ MY SOLDIER</button>
      <button onClick={() => setDiary(true)} style={{position:"fixed", left:160, bottom:18, zIndex:150, padding:"8px 14px", fontFamily:"var(--f-display)", letterSpacing:"0.16em", fontSize:11, background:"linear-gradient(180deg, var(--parchment-light), var(--parchment-dark))", color:"var(--ink)", border:"2px solid var(--sepia)", boxShadow:"0 3px 0 var(--sepia)", cursor:"pointer"}}>✒ DIARY ★ STORIES</button>
      {customizing && <CharacterCustomizer profile={profile} onClose={() => setCustomizing(false)} onSave={(a) => updateProfile(p => ({...p, appearance: a}))}/>}
      {diary && <SoldierStoryRunner profile={profile} onClose={() => setDiary(false)} onGrant={({coins, xp, label}) => { updateProfile(p => ({...p, coins: p.coins + coins, xp: p.xp + xp})); pushToast("Page sealed: +" + fmt(coins) + "¢", "ach", "✒"); }}/>}
      <Toasts toasts={toasts}/>
      <AudioControls/>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
