// data.jsx — DISPATCHES: A Civil War Typewriter Chronicle

// ============ COMMON / CAMP WORDS for sprint & survival ============
const CAMP_WORDS = "men march road camp tent fire creek river ford bridge ridge field corn salt pork bread coffee horse mule wagon caisson rifle musket bayonet powder shot ball cap drum bugle flag colors line front rear left right north south union state company regiment brigade division corps general colonel captain major sergeant private order honor duty rank file march hard day night rain mud sun dust dust dust letter home mother father wife son daughter brother sister friend hope wait soon".split(/\s+/);
const RARE_WORDS = "haversack canteen brogan oilcloth dispatch courier piquet vedette skirmisher sutler quartermaster commissary fortifications redoubt earthworks parapet glacis enfilade caisson limber bivouac reveille tattoo hardtack salt-junk".split(/\s+/);

// ============ PASSAGES (originals, period-flavored, not copyrighted) ============
const PASSAGES = [
  "From the camp at Bull's Ford, this 14th of October, 1862. My dearest Eliza, the rains have come and the road is a long brown river. We march each morning before the bugle and sleep where we fall. I think often of the window above the orchard, and of you in it.",
  "Field Order, no. 41. The brigade will strike camp at four o'clock and proceed by the river road to the ferry below the bend. Canteens are to be filled at the creek before departure. Stragglers will be held to account by the rear guard.",
  "Telegraphic dispatch, relayed from Frederick. Enemy column observed at twilight crossing the upper ford in number not less than two regiments of foot and a battery of light guns. Movement appears to be toward the gap. Send word to the Generals at once.",
  "Mother, I have not written in three weeks and you must forgive me. The first letter was lost when the wagon overturned at the creek, and the second was carried by a sergeant who has since been wounded at the works. I am well. The mornings are very cold.",
  "Surgeon's notes, evening of the 3rd. Forty-one admitted since reveille. Three did not see the noon meal. The men bear their wounds with a patience that is hard to look upon. I have given out the last of the lint and shall need more by the morning.",
  "Headquarters, Army of the Cumberland. The commanding general directs that all officers shall keep their men in close column on the march tomorrow, by reason of the narrowness of the way and the disposition of enemy cavalry on our flank.",
  "From the diary of a private soldier. Today we crossed the river twice over the same bridge, owing to a confusion in orders. The men joked of it. We are camped in a meadow that smells of clover, and the band of the 7th has been playing since dusk.",
  "To the Honorable Secretary of War. Sir, I have the honor to report that the line at Burnt Oak has been held throughout the day, and the enemy repulsed twice with heavy loss. Our own losses have been considerable. I shall require fresh ammunition by morning.",
  "Letter, sent home by post from Camp Linden. There is a boy here from Vermont who plays a tin whistle in the evening. I asked him how old he was and he said sixteen, but I do not believe him. He says he has come to see the country, which he certainly has.",
  "Sherman's columns are reported to be already on the Macon road. The rolling stock at the depot has been ordered burned. I do not know if this letter will find you. If it does not, please understand that I tried, and that the failure was not in the writing.",
  "Roll of the 22nd Indiana, Co. F, as called this morning of the 11th. Of seventy-eight names answered yesterday, fifty-three respond today. Of the remainder, twelve are at the field hospital, four have been detailed to the wagon train, and the rest are not accounted for.",
  "Telegram. Lincoln to Grant. I begin to see what you propose. Hold the river and the rest will hold itself. Press them where they are weakest and do not be moved by reports of their strength elsewhere. The country is with you. So am I.",
];

// ============ STORY / CAMPAIGN CHAPTERS ============
// Each chapter is one full passage to type, with a date and a title
const STORY_CHAPTERS = [
  {
    no: "I", title: "Enlistment", date: "April 1861 — Boston, Massachusetts",
    text: "We mustered in the town square the morning after the news from Sumter. The flag was new on the pole and the band played twice through the same tune for want of another. I signed the book in a hand I scarcely recognized as my own. Mother stood at the edge of the crowd and did not wave when I passed. I knew then she had already begun the long business of waiting."
  },
  {
    no: "II", title: "First Camp", date: "June 1861 — Camp Curtin, Pennsylvania",
    text: "There are five thousand of us here in a field that was a pasture a month ago. We drill by squad and by company and by regiment, and we drill again by lamplight when we cannot see our own feet. The food is plentiful and bad. The water is not plentiful and is worse. Still, no man has yet asked to go home, though many have written letters that say otherwise between the lines."
  },
  {
    no: "III", title: "The First Engagement", date: "July 1861 — Manassas Junction",
    text: "We were sent forward across a wheatfield in the hot of the day. The corn was tall and the smoke came down in it like fog. The man on my left, whose name I had not yet learned, fell without sound. I did not see who fired. I have read since that the day went badly for our side. I cannot speak to the day as a whole. I can only speak to that wheatfield, and I would rather not."
  },
  {
    no: "IV", title: "The Long Winter", date: "January 1862 — Winter Quarters, Virginia",
    text: "We have built ourselves small wooden cities. The chimneys smoke poorly and the doors do not shut. We read each newspaper four times over and the older ones eight. A box of socks arrived from a women's aid society in Hartford and was distributed with great ceremony. I received the left of a pair. Sgt. Beemis received the right. We have agreed to march together on that account."
  },
  {
    no: "V", title: "The River Crossing", date: "May 1862 — The Chickahominy",
    text: "The pontoons were laid before dawn and the bridge did not hold against the current. The engineers worked in the water to the waist and were not relieved until past noon. We crossed by twos, very slowly, and our band played from the far bank to encourage us. There is a particular silence that comes over a column on a bridge that the men remember afterwards, though no one can say why."
  },
  {
    no: "VI", title: "The Field Hospital", date: "September 1862 — Sharpsburg",
    text: "The barn has been requisitioned for a hospital and the loft for the dying. The surgeon does not lift his head except to call for the next. The straw is changed when the orderlies remember to change it. A boy from the 12th asked me to write to his mother and tell her he was well. I told him I would write and that he should rest. He has rested now for some hours."
  },
  {
    no: "VII", title: "The Address", date: "November 1863 — Gettysburg, Pennsylvania",
    text: "We stood in a great half-circle on the new ground above the town. The president spoke for perhaps three minutes and the men nearest the platform could scarcely hear him. The men farthest away heard nothing at all. The day after, the newspapers printed the speech in full, and we read it aloud at the campfire. It is a short speech. We have read it many times now."
  },
  {
    no: "VIII", title: "The March", date: "November 1864 — Georgia",
    text: "We have left the railhead and the order is to live on what the country provides. The country provides considerably. I have eaten sweet potato in seven preparations. We tear up the iron in regular lengths and heat it in fires of pine and bend it about the trees, where it cools in the shape of the trunk. They are calling these Sherman's neckties. The general has not, to my knowledge, objected to the name."
  },
  {
    no: "IX", title: "Surrender", date: "April 1865 — Appomattox Court House",
    text: "Word came down the line at noon and was not believed until the third repetition. Some men cheered. Most did not. An officer of the other side rode past us with his head uncovered and his sword at his thigh, and our men, of their own accord, came to a present arms as he went by. He returned the salute. Neither party spoke. There is a kind of quiet that arrives when the long noise stops, and we are still learning what to do inside of it."
  },
  {
    no: "X", title: "Going Home", date: "June 1865 — The Long Road",
    text: "We were paid at the depot and given our discharge papers and a card for the railway. The train was not on time. We waited on the platform six hours and no one complained, which is not a thing that has ever before been true of soldiers. I came down the road to the orchard at evening. The window was open and the lamp was lit and a woman I knew very well was at the table, writing a letter. She had not yet heard the train."
  },
];

// ============ BOSS ENGAGEMENTS (battles) ============
const BOSS_PHRASES = [
  {
    name: "Skirmish at Burnt Oak", title: "A holding action at the rail crossing",
    where: "Tennessee, autumn 1862", hp: 80, glyph: "I",
    text: "The pickets reported smoke at the ridge an hour before dawn and the line was formed in the wheatfield north of the depot. We held the position through the morning."
  },
  {
    name: "The Long Retreat", title: "Withdrawal under fire",
    where: "Virginia, winter 1862", hp: 130, glyph: "II",
    text: "Orders came down at three o'clock to fall back by company in good order to the second line. The wagons were already moving. The rear guard held the road until past sundown and then withdrew along the creek by lantern light."
  },
  {
    name: "Fortress Linden", title: "Assault on the earthworks",
    where: "Mississippi, summer 1863", hp: 200, glyph: "III",
    text: "The works rose forty feet above the field and were crowned by a battery of six guns. The men crossed the open ground at the run with bayonets fixed. The first wave reached the parapet. The second did not. We were in possession of the position by nightfall, and counted our cost in the morning."
  },
  {
    name: "Cumberland Crossing", title: "A battle in the river fog",
    where: "Kentucky, spring 1864", hp: 280, glyph: "IV",
    text: "Fog lay on the water until past nine and we could not see the far bank for it. The order was given to advance by sound, the bands playing on the near shore as a guide. The enemy heard the bands as well, and was waiting. Many men did not return from that bank."
  },
  {
    name: "The Iron Brigade", title: "A duel of regulars",
    where: "Pennsylvania, summer 1863", hp: 360, glyph: "V",
    text: "We met them in the woods west of the seminary at midday and neither side gave ground for an hour. The fire was so heavy the leaves came down upon the wounded in a steady fall. The black hats stood where they were told to stand. So did we. So did the dead."
  },
  {
    name: "Sherman's March", title: "A war upon the land",
    where: "Georgia, autumn 1864", hp: 480, glyph: "VI",
    text: "The order is to move sixty thousand men through a country that does not know we are coming. We will live upon the country and the country will know us afterwards. The rails will be heated and bent. The cotton will be burned. The houses, where possible, will be spared. The houses, where not possible, will not."
  },
  {
    name: "The Surrender", title: "An ending in a parlor",
    where: "Virginia, April 9th, 1865", hp: 640, glyph: "VII",
    text: "The two generals sat at small tables in a room not much larger than the room I write this in. There was a moment, I am told, of considerable silence before either spoke. The terms were generous. The arms were stacked. The horses were sent home with the men who had ridden them in, on the grounds that the men would need them for the spring planting, which began that week and could not be delayed for any war."
  },
];

// ============ QUARTERMASTER / SHOP ============
const SHOP_ITEMS = [
  // PAPER STOCKS (themes - paper grain/tint)
  { id: "theme-default", cat: "paper", name: "Federal Foolscap", desc: "Standard issue. Cream, sturdy, faintly ruled.", price: 0 },
  { id: "theme-arctic",  cat: "paper", name: "Officer's Stationery", desc: "Cool blue laid paper from the regimental staff.", price: 1200, tint: "blue" },
  { id: "theme-rose",    cat: "paper", name: "Mourning Stationery", desc: "Black-bordered. For the letters home that one hopes never to write.", price: 2400, tint: "rose" },
  { id: "theme-emerald", cat: "paper", name: "Ledger Green", desc: "Quartermaster's account paper. Lined, businesslike.", price: 3600, tint: "olive" },
  { id: "theme-noir",    cat: "paper", name: "Carbon Copy", desc: "Onionskin. Each keystroke leaves a ghost.", price: 5000, tint: "noir" },
  { id: "theme-sunset",  cat: "paper", name: "Telegraph Tape", desc: "Hot orange newsroom paper. Read aloud while still warm.", price: 8000, tint: "sunset" },

  // TYPEWRITERS (keyboard skins)
  { id: "kb-wooden", cat: "machine", name: "Sholes & Glidden, 1874", desc: "The original. Brass keys, painted iron frame.", price: 0 },
  { id: "kb-brass",  cat: "machine", name: "Remington No. 2",       desc: "Shift key added. Capital letters at last.", price: 1500 },
  { id: "kb-ivory",  cat: "machine", name: "Hammond Model 1",        desc: "Curved keyboard, type shuttle. A scholar's machine.", price: 3200 },
  { id: "kb-arcade", cat: "machine", name: "Field Telegraph Key",    desc: "A telegrapher's brass thumper. Click, dot, dash.", price: 5500 },
  { id: "kb-runic",  cat: "machine", name: "Caligraph No. 3",        desc: "A full keyboard, every letter both cases.", price: 9000 },
  { id: "kb-neon",   cat: "machine", name: "Smith Premier",          desc: "Late century. Ribbons of two colors.", price: 14000 },

  // RIBBONS (effects)
  { id: "fx-none",   cat: "ribbon", name: "Plain Black Ribbon",   desc: "Standard issue. Quiet.", price: 0 },
  { id: "fx-sparks", cat: "ribbon", name: "Carbon Ribbon",        desc: "Each strike kicks up a small dark cloud.", price: 800 },
  { id: "fx-flames", cat: "ribbon", name: "Red-Black Ribbon",     desc: "Sustained combos print in fierce red.", price: 2000 },
  { id: "fx-ripple", cat: "ribbon", name: "Ink Ribbon, Fresh",    desc: "Heavy ink. Each letter blooms slightly.", price: 3500 },
  { id: "fx-aurora", cat: "ribbon", name: "Gilt Ribbon",          desc: "Above 95% accuracy, the type takes a faint gold.", price: 6000 },

  // PERMANENT BOOSTS — sundries
  { id: "boost-2x-coin", cat: "sundry", name: "Brass Inkwell",      desc: "+50% silver dollars earned. Permanent.", price: 4000 },
  { id: "boost-2x-xp",   cat: "sundry", name: "Bound Field Notebook", desc: "+50% commendation earned. Permanent.", price: 6000 },
  { id: "boost-combo",   cat: "sundry", name: "Steady Hand Cuff",   desc: "Combo bonuses begin to accrue sooner.", price: 2500 },
  { id: "boost-shield",  cat: "sundry", name: "Forgiver's Eraser",  desc: "First slip in a run does not break a combo.", price: 3500 },

  // CURSORS — quills / nibs
  { id: "cur-block",  cat: "nib", name: "Standard Type Block", desc: "Square cursor. Classic.", price: 0 },
  { id: "cur-line",   cat: "nib", name: "Fine Steel Nib",      desc: "A thin slip of a cursor.", price: 400 },
  { id: "cur-under",  cat: "nib", name: "Underscore",          desc: "A patient terminal sort.", price: 400 },
  { id: "cur-heart",  cat: "nib", name: "Pierced Heart",       desc: "For the soldiers' love letters.", price: 1500 },
];

// ============ ACHIEVEMENTS (medals & commendations) ============
const ACHIEVEMENTS = [
  { id: "first-run",    name: "First Dispatch",        desc: "Complete your first transmission.",          glyph: "I",   target: 1,    stat: "runsCompleted" },
  { id: "ten-runs",     name: "Trusted Clerk",         desc: "Complete 10 transmissions.",                 glyph: "X",   target: 10,   stat: "runsCompleted" },
  { id: "fifty-runs",   name: "Veteran of the Desk",   desc: "Complete 50 transmissions.",                 glyph: "L",   target: 50,   stat: "runsCompleted" },
  { id: "hundred-runs", name: "Faithful Servant",      desc: "Complete 100 transmissions.",                glyph: "C",   target: 100,  stat: "runsCompleted" },

  { id: "keys-1k",   name: "A Thousand Strokes",       desc: "Press 1,000 keys.",                          glyph: "1K",  target: 1000,    stat: "totalKeys" },
  { id: "keys-10k",  name: "Iron Fingers",             desc: "Press 10,000 keys.",                         glyph: "10K", target: 10000,   stat: "totalKeys" },
  { id: "keys-100k", name: "The Old Hand",             desc: "Press 100,000 keys.",                        glyph: "100K",target: 100000,  stat: "totalKeys" },

  { id: "wpm-40", name: "Steady at the Keys",   desc: "Reach 40 WPM.",   glyph: "40",  target: 40,  stat: "bestWpm" },
  { id: "wpm-60", name: "Quick Telegrapher",    desc: "Reach 60 WPM.",   glyph: "60",  target: 60,  stat: "bestWpm" },
  { id: "wpm-80", name: "Lightning",             desc: "Reach 80 WPM.",   glyph: "80",  target: 80,  stat: "bestWpm" },
  { id: "wpm-100",name: "Wire-Burner",          desc: "Reach 100 WPM.",  glyph: "100", target: 100, stat: "bestWpm" },

  { id: "acc-95",  name: "Surgeon's Precision",  desc: "Finish at 95%+ accuracy.",   glyph: "95%",  target: 95,  stat: "bestAccuracy" },
  { id: "acc-99",  name: "Untrembled Hand",      desc: "Finish at 99%+ accuracy.",   glyph: "99%",  target: 99,  stat: "bestAccuracy" },
  { id: "acc-100", name: "Without a Blot",       desc: "Finish a run with no errors.",glyph: "100", target: 100, stat: "bestAccuracy" },

  { id: "combo-25",  name: "Rolling Volley",   desc: "Land a 25-key combo.",   glyph: "x25",  target: 25,  stat: "longestStreak" },
  { id: "combo-100", name: "Sustained Fire",   desc: "Land a 100-key combo.",  glyph: "x100", target: 100, stat: "longestStreak" },
  { id: "combo-300", name: "Cannonade",        desc: "Land a 300-key combo.",  glyph: "x300", target: 300, stat: "longestStreak" },

  { id: "boss-1", name: "First Engagement",  desc: "Carry the field in one battle.",  glyph: "★",  target: 1, stat: "bossesDefeated" },
  { id: "boss-3", name: "Three Crossed Sabres", desc: "Carry three battles.",         glyph: "★★", target: 3, stat: "bossesDefeated" },
  { id: "boss-7", name: "Brevet to Major",   desc: "Carry seven battles.",            glyph: "★★★",target: 7, stat: "bossesDefeated" },

  { id: "survive-30",  name: "Held the Line",       desc: "Type 30 dispatches under fire.",  glyph: "30",  target: 30,  stat: "survivalHigh" },
  { id: "survive-60",  name: "Trench Operator",     desc: "60 dispatches under fire.",       glyph: "60",  target: 60,  stat: "survivalHigh" },
  { id: "survive-120", name: "The Wire Holds",      desc: "120 dispatches under fire.",      glyph: "120", target: 120, stat: "survivalHigh" },

  { id: "lvl-10",  name: "Corporal",   desc: "Reach rank Corporal.",   glyph: "Cpl", target: 10,  stat: "level" },
  { id: "lvl-25",  name: "Sergeant",   desc: "Reach rank Sergeant.",   glyph: "Sgt", target: 25,  stat: "level" },
  { id: "lvl-50",  name: "Captain",    desc: "Reach rank Captain.",    glyph: "Cpt", target: 50,  stat: "level" },
];

// ============ QUESTS (orders of the day) ============
const QUEST_TEMPLATES = [
  { id: "press-300",  name: "Morning Drill",      desc: "Press 300 keys today.",        target: 300, stat: "session.keys",          reward: 200 },
  { id: "press-800",  name: "Full Day's Duty",    desc: "Press 800 keys today.",        target: 800, stat: "session.keys",          reward: 500 },
  { id: "wpm-50",     name: "Carry the Wire",     desc: "Reach 50 WPM in any run.",     target: 50,  stat: "session.bestWpm",       reward: 350 },
  { id: "run-3",      name: "Three Transmissions",desc: "Complete 3 runs.",             target: 3,   stat: "session.runs",          reward: 300 },
  { id: "acc-95",     name: "A Steady Hand",      desc: "Finish at 95%+ accuracy.",     target: 95,  stat: "session.bestAcc",       reward: 400 },
  { id: "boss",       name: "Carry the Field",    desc: "Win one engagement.",          target: 1,   stat: "session.bosses",        reward: 600 },
  { id: "survive-25", name: "Hold the Line",      desc: "Type 25 dispatches under fire.",target: 25, stat: "session.survivalHigh",  reward: 450 },
  { id: "combo-50",   name: "Sustained Volley",   desc: "Land a 50-key combo.",         target: 50,  stat: "session.longestStreak", reward: 400 },
];

// ============ RANKS by level ============
const RANK_LADDER = [
  { lvl: 1,  name: "Recruit" },
  { lvl: 3,  name: "Private" },
  { lvl: 6,  name: "Corporal" },
  { lvl: 10, name: "Sergeant" },
  { lvl: 15, name: "Sergeant Major" },
  { lvl: 20, name: "Lieutenant" },
  { lvl: 28, name: "Captain" },
  { lvl: 38, name: "Major" },
  { lvl: 50, name: "Colonel" },
  { lvl: 75, name: "Brigadier" },
];
function rankFor(level) {
  let r = RANK_LADDER[0];
  for (const x of RANK_LADDER) if (level >= x.lvl) r = x;
  return r.name;
}

// ============ REGIMENTS (generated for new profiles) ============
const REGIMENTS = [
  "20th Maine Vol.","54th Massachusetts","2nd Wisconsin","19th Indiana","69th New York",
  "1st Minnesota","6th Wisconsin","8th Ohio Cavalry","14th Brooklyn","42nd Illinois","83rd Pennsylvania","11th Vermont"
];
function randomRegiment() { return REGIMENTS[Math.floor(Math.random() * REGIMENTS.length)]; }

// ============ XP & LEVEL ============
function xpForLevel(level) { return Math.floor(100 * Math.pow(level, 1.55)); }
function levelFromXp(totalXp) {
  let lvl = 1, need = xpForLevel(1), acc = 0;
  while (totalXp >= acc + need && lvl < 99) { acc += need; lvl++; need = xpForLevel(lvl); }
  return { level: lvl, intoLvl: totalXp - acc, needLvl: need };
}

// ============ DATE / QUESTS HELPERS ============
function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}
function pickDailyQuests(dateKey) {
  let h = 0; for (let i=0; i<dateKey.length; i++) h = (h*31 + dateKey.charCodeAt(i)) | 0;
  const out = []; const pool = [...QUEST_TEMPLATES];
  for (let i=0; i<3 && pool.length; i++) {
    h = (h * 1103515245 + 12345) | 0;
    const idx = Math.abs(h) % pool.length;
    out.push(pool.splice(idx,1)[0]);
  }
  return out;
}

// ============ PROFILES (localStorage) ============
const STORE_KEY = "keyforge:v2"; // bumped key for new schema

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { profiles: [], currentId: null };
    return JSON.parse(raw);
  } catch(e) { return { profiles: [], currentId: null }; }
}
function saveStore(s) { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch(e) {} }
function newProfileId() { return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function makeProfile(name, glyph, color, regiment) {
  return {
    id: newProfileId(),
    name: name.slice(0, 16),
    glyph: glyph || name[0].toUpperCase(),
    color: color || "#cdb487",
    regiment: regiment || randomRegiment(),
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
    xp: 0, coins: 50, gems: 0,
    stats: {
      totalKeys: 0, correctKeys: 0, errors: 0,
      bestWpm: 0, bestAccuracy: 0,
      sprintHigh: 0, marathonBest: 0, survivalHigh: 0,
      runsCompleted: 0, sessionsPlayed: 1,
      bossesDefeated: 0, longestStreak: 0,
      timeTypedMs: 0,
    },
    owned: ["theme-default","kb-wooden","fx-none","cur-block"],
    equipped: { paper: "theme-default", machine: "kb-wooden", ribbon: "fx-none", nib: "cur-block" },
    achievements: {},
    story: { chapter: 0 },
    quests: { date: todayKey(), session: {}, completed: {} },
  };
}

// ============ AVATAR COLORS ============
const AV_COLORS = ["#cdb487","#a9856a","#7a9bb5","#9a7a5a","#5d5847","#b89a6a","#94806a","#3d5a78","#7a8a5a","#6e7a45"];

// ============ FORMAT ============
function fmt(n) {
  if (n === undefined || n === null) return "0";
  if (n < 1000) return n.toString();
  if (n < 1e6) return (n/1000).toFixed(n<10000?2:1).replace(/\.?0+$/,"") + "K";
  if (n < 1e9) return (n/1e6).toFixed(2).replace(/\.?0+$/,"") + "M";
  return (n/1e9).toFixed(2).replace(/\.?0+$/,"") + "B";
}
function pad(n, w=2) { return String(n).padStart(w, "0"); }
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

// ============ EXPORTS ============
Object.assign(window, {
  CAMP_WORDS, COMMON_WORDS: CAMP_WORDS, RARE_WORDS, PASSAGES,
  STORY_CHAPTERS, STORY_QUOTES: STORY_CHAPTERS, BOSS_PHRASES,
  SHOP_ITEMS, ACHIEVEMENTS, QUEST_TEMPLATES, AV_COLORS,
  todayKey, pickDailyQuests, xpForLevel, levelFromXp,
  loadStore, saveStore, newProfileId, makeProfile,
  rankFor, randomRegiment, REGIMENTS,
  fmt, pad, clamp,
});
