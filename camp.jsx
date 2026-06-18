// camp.jsx — Live camp screen w/ Quartermaster + Generals + Trail events + Ticker

const { useState: C_s, useEffect: C_e, useRef: C_r, useMemo: C_m } = React;

// =========================================================
// DRAWN PORTRAITS (SVG busts) — stylized period figures
// =========================================================

function PortraitFrame({ children, w=240, h=300, lit }) {
  return (
    <div style={{
      width: w, height: h, position: "relative",
      background: "linear-gradient(180deg, #6a4a18, #3a2810)",
      padding: 8, boxShadow: "0 4px 0 #2a1a08, inset 0 0 0 2px #e8b860",
    }}>
      <div style={{
        position: "absolute", inset: 8,
        background: "radial-gradient(circle at 50% 35%, #cdb487 0%, #8a6a48 50%, #4a3520 100%)",
        overflow: "hidden",
      }}>
        <svg viewBox="0 0 240 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          {children}
        </svg>
        {lit && <div style={{position:"absolute", inset:0, background:"radial-gradient(circle at 50% 30%, rgba(255,220,140,0.25), transparent 60%)", pointerEvents:"none"}}/>}
      </div>
      {/* corner studs */}
      {[[8,8],[8,"r"],["b",8],["b","r"]].map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          [p[0]==="b"?"bottom":"top"]: p[0]==="b" ? 4 : 4,
          [p[1]==="r"?"right":"left"]: p[1]==="r" ? 4 : 4,
          width: 10, height: 10, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #ffd98a, #6a4a18)",
        }}/>
      ))}
    </div>
  );
}

// Reusable bust components ---
function HeadShape({ skin, jaw=1 }) {
  return (
    <>
      {/* neck */}
      <rect x="100" y="180" width="40" height="40" fill={skin}/>
      {/* collar shadow */}
      <ellipse cx="120" cy="222" rx="32" ry="6" fill="#2a1a08" opacity="0.4"/>
      {/* head */}
      <ellipse cx="120" cy={140} rx={42} ry={50*jaw} fill={skin}/>
      {/* ears */}
      <ellipse cx="80" cy="148" rx="6" ry="10" fill={skin}/>
      <ellipse cx="160" cy="148" rx="6" ry="10" fill={skin}/>
    </>
  );
}
function Eyes({ y=140, c="#1a0a04" }) {
  return (
    <>
      <ellipse cx="106" cy={y} rx="3" ry="2.5" fill={c}/>
      <ellipse cx="134" cy={y} rx="3" ry="2.5" fill={c}/>
      {/* brow */}
      <rect x="98" y={y-9} width="16" height="2.5" fill="#3a2810"/>
      <rect x="126" y={y-9} width="16" height="2.5" fill="#3a2810"/>
    </>
  );
}
function UnionUniform() {
  return (
    <>
      <path d="M 60 240 L 90 200 L 150 200 L 180 240 L 180 300 L 60 300 Z" fill="#2a3a5e"/>
      <line x1="120" y1="200" x2="120" y2="300" stroke="#e8b860" strokeWidth="2"/>
      {[225, 245, 265, 285].map(y => <circle key={y} cx="120" cy={y} r="3" fill="#e8b860"/>)}
      {/* shoulder boards */}
      <rect x="78" y="210" width="22" height="10" fill="#e8b860" stroke="#6a4a18"/>
      <rect x="140" y="210" width="22" height="10" fill="#e8b860" stroke="#6a4a18"/>
    </>
  );
}
function ConfederateUniform() {
  return (
    <>
      <path d="M 60 240 L 90 200 L 150 200 L 180 240 L 180 300 L 60 300 Z" fill="#5a6a4a"/>
      <line x1="120" y1="200" x2="120" y2="300" stroke="#e8b860" strokeWidth="2"/>
      {[225, 245, 265, 285].map(y => <circle key={y} cx="120" cy={y} r="3" fill="#e8b860"/>)}
      {/* collar stars (rank) */}
      <text x="100" y="218" fontSize="10" fill="#e8b860">★</text>
      <text x="130" y="218" fontSize="10" fill="#e8b860">★</text>
      <text x="115" y="218" fontSize="10" fill="#e8b860">★</text>
    </>
  );
}

function LeePortrait({ lit }) {
  return (
    <PortraitFrame lit={lit}>
      <ConfederateUniform/>
      <HeadShape skin="#e3c8a3"/>
      {/* hair (grey, parted) */}
      <path d="M 78 122 Q 80 90 120 88 Q 160 90 162 122 L 158 130 Q 140 110 120 112 Q 100 110 82 130 Z" fill="#d0c9b8"/>
      <Eyes/>
      <line x1="118" y1="155" x2="122" y2="155" stroke="#2a1a08" strokeWidth="1.5"/>
      {/* moustache */}
      <path d="M 100 165 Q 120 162 140 165 L 138 172 Q 120 168 102 172 Z" fill="#bdb3a0"/>
      {/* full beard */}
      <path d="M 82 162 Q 90 195 120 200 Q 150 195 158 162 Q 150 190 120 195 Q 90 190 82 162" fill="#d0c9b8"/>
      <path d="M 96 175 Q 120 215 144 175 Q 130 200 120 202 Q 110 200 96 175" fill="#bdb3a0"/>
    </PortraitFrame>
  );
}
function GrantPortrait({ lit }) {
  return (
    <PortraitFrame lit={lit}>
      <UnionUniform/>
      <HeadShape skin="#dabb95"/>
      {/* hair (brown, short) */}
      <path d="M 78 122 Q 80 95 120 92 Q 160 95 162 122 L 158 128 Q 140 115 120 116 Q 100 115 82 128 Z" fill="#6a4a18"/>
      <Eyes/>
      {/* moustache + beard (short, dark brown) */}
      <path d="M 100 168 Q 120 165 140 168 L 138 175 Q 120 170 102 175 Z" fill="#3a2810"/>
      <path d="M 92 172 Q 100 195 120 198 Q 140 195 148 172 Q 138 188 120 192 Q 102 188 92 172" fill="#3a2810"/>
      {/* cigar */}
      <rect x="140" y="170" width="22" height="3" fill="#6a4a18" transform="rotate(8 140 170)"/>
      <circle cx="162" cy="173" r="2" fill="#e8b860"/>
      <path d="M 162 168 Q 168 160 170 152" stroke="#d0c9b8" strokeWidth="1.5" fill="none" opacity="0.7"/>
    </PortraitFrame>
  );
}
function ShermanPortrait({ lit }) {
  return (
    <PortraitFrame lit={lit}>
      <UnionUniform/>
      <HeadShape skin="#e6c19b" jaw={1.05}/>
      {/* hair (red, unkempt) */}
      <path d="M 76 124 Q 70 88 120 84 Q 168 88 164 124 L 156 130 Q 150 100 120 108 Q 92 100 84 130 Z" fill="#8a4a1a"/>
      {/* sideburns */}
      <path d="M 78 140 Q 80 170 92 175 L 92 155 Z" fill="#8a4a1a"/>
      <path d="M 162 140 Q 160 170 148 175 L 148 155 Z" fill="#8a4a1a"/>
      <Eyes/>
      {/* angular brow */}
      <path d="M 96 130 L 116 134 L 116 138 L 96 134 Z" fill="#3a2810"/>
      <path d="M 144 130 L 124 134 L 124 138 L 144 134 Z" fill="#3a2810"/>
      <line x1="115" y1="170" x2="125" y2="170" stroke="#2a1a08" strokeWidth="2"/>
      {/* slight beard stubble */}
      <ellipse cx="120" cy="178" rx="22" ry="6" fill="#3a2810" opacity="0.3"/>
    </PortraitFrame>
  );
}
function JacksonPortrait({ lit }) {
  return (
    <PortraitFrame lit={lit}>
      <ConfederateUniform/>
      <HeadShape skin="#e0bd96" jaw={1.1}/>
      {/* kepi (forage cap) */}
      <path d="M 70 108 L 70 92 Q 70 78 120 76 Q 170 78 170 92 L 170 108 Z" fill="#3a3a4a"/>
      <rect x="70" y="106" width="100" height="5" fill="#1a1a24"/>
      <rect x="100" y="84" width="40" height="6" fill="#e8b860" opacity="0.7"/>
      <Eyes y="138"/>
      {/* intense stare */}
      <line x1="116" y1="160" x2="124" y2="160" stroke="#2a1a08" strokeWidth="1.5"/>
      {/* full dark beard */}
      <path d="M 82 155 Q 88 200 120 208 Q 152 200 158 155 Q 150 195 120 200 Q 90 195 82 155" fill="#3a2810"/>
      <path d="M 94 168 Q 120 220 146 168 Q 130 205 120 208 Q 110 205 94 168" fill="#2a1a08"/>
    </PortraitFrame>
  );
}
function QuartermasterPortrait({ lit, talking }) {
  return (
    <PortraitFrame lit={lit} w={260} h={320}>
      {/* apron uniform */}
      <path d="M 60 240 L 88 200 L 152 200 L 180 240 L 180 320 L 60 320 Z" fill="#6a4a18"/>
      <rect x="76" y="230" width="88" height="85" fill="#cdb487"/>
      <rect x="76" y="230" width="88" height="2" fill="#6a4a18"/>
      <text x="120" y="262" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="700" fontSize="9" fill="#3a2810" letterSpacing="2">QUARTER-</text>
      <text x="120" y="276" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="700" fontSize="9" fill="#3a2810" letterSpacing="2">MASTER</text>
      <text x="120" y="298" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="8" fill="#6a4a18">★ 1863 ★</text>

      <HeadShape skin="#e3c19b" jaw={1.15}/>
      {/* bald top + side hair grey */}
      <path d="M 80 128 Q 88 110 102 108 L 100 134 Z" fill="#cdb487"/>
      <path d="M 160 128 Q 152 110 138 108 L 140 134 Z" fill="#cdb487"/>
      <path d="M 78 142 Q 82 175 96 178 L 96 158 Q 86 152 80 144 Z" fill="#cdb487"/>
      <path d="M 162 142 Q 158 175 144 178 L 144 158 Q 154 152 160 144 Z" fill="#cdb487"/>
      {/* round spectacles */}
      <circle cx="104" cy="142" r="10" fill="none" stroke="#3a2810" strokeWidth="2"/>
      <circle cx="136" cy="142" r="10" fill="none" stroke="#3a2810" strokeWidth="2"/>
      <line x1="114" y1="142" x2="126" y2="142" stroke="#3a2810" strokeWidth="2"/>
      <line x1="94" y1="142" x2="84" y2="138" stroke="#3a2810" strokeWidth="1.5"/>
      <line x1="146" y1="142" x2="156" y2="138" stroke="#3a2810" strokeWidth="1.5"/>
      <ellipse cx="104" cy="142" rx="8" ry="6" fill="#cdb487" opacity="0.3"/>
      <ellipse cx="136" cy="142" rx="8" ry="6" fill="#cdb487" opacity="0.3"/>
      {/* pupils through specs */}
      <circle cx="104" cy="142" r="2" fill="#1a0a04"/>
      <circle cx="136" cy="142" r="2" fill="#1a0a04"/>
      {/* big walrus mustache */}
      <path d={talking
          ? "M 86 168 Q 100 178 120 174 Q 140 178 154 168 L 152 184 Q 138 192 120 184 Q 102 192 88 184 Z"
          : "M 86 168 Q 100 174 120 170 Q 140 174 154 168 L 152 182 Q 138 188 120 178 Q 102 188 88 182 Z"
        } fill="#cdb487"/>
      <path d="M 92 172 Q 100 178 110 174 Z" fill="#bdb3a0"/>
      <path d="M 130 174 Q 140 178 148 172 Z" fill="#bdb3a0"/>
      {/* round red nose */}
      <ellipse cx="120" cy="160" rx="6" ry="4" fill="#c87858"/>
      {/* mouth (animates when talking) */}
      {talking
        ? <ellipse cx="120" cy="188" rx="6" ry="4" fill="#3a1a08"/>
        : <line x1="114" y1="190" x2="126" y2="190" stroke="#3a1a08" strokeWidth="2"/>
      }
      {/* pencil tucked behind ear */}
      <rect x="76" y="118" width="3" height="20" fill="#e8b860" transform="rotate(-15 76 118)"/>
    </PortraitFrame>
  );
}

// =========================================================
// NPC DEFINITIONS
// =========================================================

const NPCS = [
  {
    id: "lee", name: "Gen. Robert E. Lee", title: "Army of Northern Virginia", side: "south",
    Portrait: LeePortrait, color: "#5a6a4a",
    voice: "courteous, weary",
    greetings: [
      "Mr. {NAME}. Sit a moment. The mail has been slow.",
      "Good morning. I hope your hand is steady today.",
      "Be welcome at headquarters. Coffee is in the pot — what remains of it.",
    ],
    lines: [
      "The army moves in the morning. I shall need fair copies of these orders before the brigade commanders ride.",
      "Tell me, sir, can you keep an hundred and twenty words a minute? My aides have hands of stone.",
      "Mrs. Lee has not had a letter in three weeks. The post is bedeviled. Pray, see this one to Richmond if you can.",
      "Battles are not won in the saddle, but at the writing-desk the night before.",
    ],
    farewells: [
      "Carry on. The hour grows late.",
      "Strike the tent at first light. — R.E.L.",
    ],
    task: { label: "Copy Field Order No. 191", text: "By command of Gen Lee — The army will advance on Sharpsburg by way of the Hagerstown road, in two columns, the artillery on the right, the infantry on the left, with all possible expedition. Stragglers will be returned by the provost.", reward: 350, xp: 80 },
  },
  {
    id: "grant", name: "Gen. Ulysses S. Grant", title: "Armies of the United States", side: "north",
    Portrait: GrantPortrait, color: "#2a3a5e",
    voice: "blunt, plain",
    greetings: [
      "{NAME}. Pull up a stump. Don't wait for me to say it twice.",
      "Got a pencil? Good. Got a typewriter? Better.",
      "Coffee's fresh. Tobacco's not. Get to work when you're ready.",
    ],
    lines: [
      "I propose to fight it out on this line if it takes all summer. Set that down for the wires.",
      "Unconditional surrender is the only term. No comma, no flourish. Plain words.",
      "Sherman wires from Atlanta. The wires are hot and the news is hotter.",
      "Don't tell me it can't be done. Type it.",
    ],
    farewells: [
      "Dispatch goes at six. Don't be late.",
      "Carry on. — U.S.G.",
    ],
    task: { label: "Wire to Halleck, City Point", text: "I propose to fight it out on this line if it takes all summer. The enemy will be pressed at every point. Reinforcements may be ordered forward without further word. U.S. Grant, Lt. Gen.", reward: 400, xp: 90 },
  },
  {
    id: "sherman", name: "Gen. William T. Sherman", title: "Military Division of the Mississippi", side: "north",
    Portrait: ShermanPortrait, color: "#7a4a2a",
    voice: "restless, sharp",
    greetings: [
      "Sit down, {NAME}, and don't say a word about the weather.",
      "You're late. Or I'm early. Doesn't matter. Type.",
      "Atlanta is taken and fairly won. Set that down before the ink cools.",
    ],
    lines: [
      "War is cruelty, and you cannot refine it. Get the lines straight or don't get them at all.",
      "From Atlanta to the sea. Sixty miles wide. Mark every river crossing on the map.",
      "I will make Georgia howl. Type it as I dictate — no softer words.",
      "Cump won't sit still. He paces. The typewriter steadies him a little.",
    ],
    farewells: [
      "March at dawn. Don't bring the typewriter — it'll slow the wagon train.",
      "Forward. — W.T.S.",
    ],
    task: { label: "Dispatch to Lincoln", text: "I beg to present you, as a Christmas gift, the city of Savannah, with one hundred and fifty heavy guns, plenty of ammunition, and also about twenty-five thousand bales of cotton. W.T. Sherman, Maj. Gen.", reward: 500, xp: 120 },
  },
  {
    id: "jackson", name: "Gen. T.J. 'Stonewall' Jackson", title: "II Corps, ANV", side: "south",
    Portrait: JacksonPortrait, color: "#3a3a4a",
    voice: "terse, biblical",
    greetings: [
      "{NAME}. We march at dawn. Sit and write.",
      "Duty is ours. Consequences are God's. Take your seat.",
      "The Lord has been merciful. The orders are not.",
    ],
    lines: [
      "Never take counsel of your fears. Type the order as written.",
      "If we cannot whip them, we must outflank them. Mark this on the chart.",
      "The shenandoah will be hard country in August. Prepare three copies for the brigade.",
      "Press on. Press on. Press on.",
    ],
    farewells: [
      "Let us pass over the river and rest under the shade of the trees.",
      "Press on. — T.J.J.",
    ],
    task: { label: "Order to Ewell", text: "Press on. Press on. The valley is open and the road is good. We will strike them at Front Royal before they can recover. Move with all speed. Make no halt save for water. T.J. Jackson.", reward: 380, xp: 85 },
  },
];

// =========================================================
// QUARTERMASTER DIALOGUE
// =========================================================
const QUARTERMASTER_LINES = [
  "Well now. Look who the cat dragged in. Step closer, {NAME}, my eyes ain't what they were at Antietam.",
  "Ribbons, paper, nibs, machines — I got 'em all. Some of it I even paid for, honest.",
  "Folks come in here cryin' over a ten-dollar ribbon. Then they go out and lose a hundred-dollar horse. Ain't that the way.",
  "I knew a clerk in Richmond could do a hunnerd-fifteen words a minute. He's a colonel now, an' useless. Don't take the promotion, son.",
  "I had this here Sholes & Glidden since '74. She's outlived two wives an' a war. Reckon she'll outlive me.",
  "Tell you what — when the bell rings on a carriage return, that's the prettiest sound in the world. Better'n church.",
  "You see that ribbon? Red and black. Red side for the headlines, black for everythin' else. Don't waste the red.",
  "Aw, don't look at the prices like that. Cost of a good ribbon's the cost of a clean dispatch. An' a clean dispatch saved my boy at Gettysburg.",
];

// =========================================================
// TRAIL EVENTS — Oregon-Trail style random encounters
// =========================================================
const TRAIL_EVENTS = [
  { id: "rain",   icon: "☂", title: "Rain on the Road",       blurb: "A sudden squall soaks your dispatch satchel. Type fast to save the ink before it bleeds.", reward: 120, prompt: "the ink runs the ink runs save the page" },
  { id: "scout",  icon: "✦", title: "A Picket Calls Halt",    blurb: "A union scout steps from the brush with rifle leveled. Speak the password.",             reward: 100, prompt: "vicksburg vicksburg shenandoah pass friend" },
  { id: "wire",   icon: "⚡", title: "The Wire Is Hot",        blurb: "Telegraph clerk hands you an urgent dispatch from Washington. Relay it word for word.",   reward: 200, prompt: "by order of the secretary all units stand to" },
  { id: "ferry",  icon: "⛵", title: "Ferry at the Rappahannock", blurb: "The ferryman wants payment in good words. He cannot read but he likes a clean line.",   reward: 90,  prompt: "across the river slow and steady the ferry goes" },
  { id: "horse",  icon: "♞", title: "Lame Horse",              blurb: "Your courier's horse goes lame at the creek. Send word ahead by typewriter instead.",     reward: 140, prompt: "horse is lame send word by wire at once" },
  { id: "rumor",  icon: "❡", title: "A Camp Rumor",            blurb: "The boys say Lee is at Chambersburg. Or maybe Cashtown. Type what you can verify.",       reward: 110, prompt: "the army is moving north position not confirmed" },
  { id: "supply", icon: "▣", title: "Quartermaster Wagons",    blurb: "Wagons arrive with hardtack, salt pork, and a new ribbon. Sign for the manifest.",       reward: 80,  prompt: "received in good order seven crates four ribbons" },
  { id: "song",   icon: "♪", title: "A Song Around the Fire",  blurb: "The men sing 'Lorena' by the embers. The picket cannot stop weeping.",                   reward: 60,  prompt: "the years creep slowly by lorena" },
];

// =========================================================
// TELEGRAPH TICKER — rolling war headlines
// =========================================================
const TELEGRAPH_HEADLINES = [
  "★ Apr 12, 1861 — Batteries at Charleston open fire upon Fort Sumter. War is begun.",
  "★ Jul 21, 1861 — A confused day at Bull Run. The army retires upon Centreville.",
  "★ Mar 9, 1862 — Iron-clad MONITOR engages MERRIMACK at Hampton Roads. Neither sunk.",
  "★ Apr 6, 1862 — Heavy losses at Shiloh. Grant holds the field after two days.",
  "★ Sep 17, 1862 — Antietam: bloodiest day in American arms. Lee withdraws to Virginia.",
  "★ Jan 1, 1863 — The Emancipation Proclamation takes effect. The wires are full of it.",
  "★ Jul 3, 1863 — Pickett's charge repulsed at Gettysburg. Lee retires south.",
  "★ Jul 4, 1863 — Vicksburg surrenders to Grant. The Mississippi runs unvexed to the sea.",
  "★ Nov 19, 1863 — Mr. Lincoln speaks at the soldiers' cemetery, Gettysburg. Brief remarks.",
  "★ Sep 2, 1864 — Sherman wires the President: 'Atlanta is ours, and fairly won.'",
  "★ Dec 22, 1864 — Sherman presents Savannah as a Christmas gift.",
  "★ Apr 9, 1865 — At Appomattox Court House, Gen. Lee surrenders to Gen. Grant.",
  "★ — Stand by for further dispatches —",
];

function TelegraphTicker() {
  const [i, setI] = C_s(0);
  C_e(() => {
    const id = setInterval(() => setI(n => (n+1) % TELEGRAPH_HEADLINES.length), 7000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="ticker">
      <span className="ticker-tag">⚡ WIRE</span>
      <div className="ticker-track">
        <div key={i} className="ticker-line">{TELEGRAPH_HEADLINES[i]}</div>
      </div>
      <span className="ticker-tag right">★</span>
    </div>
  );
}

// =========================================================
// TYPED DIALOGUE — characters appear one at a time
// =========================================================
function TypedLine({ text, speed=22, onDone, talkingRef }) {
  const [n, setN] = C_s(0);
  C_e(() => {
    setN(0);
    if (!text) return;
    const id = setInterval(() => {
      setN(k => {
        if (k >= text.length) {
          clearInterval(id);
          if (talkingRef) talkingRef.current = false;
          if (onDone) onDone();
          return k;
        }
        if (talkingRef) talkingRef.current = true;
        return k + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return <span>{text.slice(0, n)}{n < (text||"").length ? <span className="caret-blink">▮</span> : ""}</span>;
}

// =========================================================
// QUARTERMASTER PANEL  (shop-side companion)
// =========================================================
function Quartermaster({ profile }) {
  const lines = C_m(() => QUARTERMASTER_LINES.map(l => l.replace("{NAME}", profile.name)), [profile.name]);
  const [idx, setIdx] = C_s(0);
  const [talking, setTalking] = C_s(false);
  const tRef = C_r(false);
  C_e(() => {
    const id = setInterval(() => { setTalking(tRef.current); }, 110);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="qm-panel">
      <QuartermasterPortrait lit talking={talking}/>
      <div className="qm-speech">
        <div className="qm-name">★ Sgt. ELIAS WATSON — Quartermaster, A.Q.M. Dept. ★</div>
        <div className="qm-bubble">
          <span className="qm-quote">"</span>
          <TypedLine key={idx} text={lines[idx]} talkingRef={tRef}/>
        </div>
        <button className="qm-next" onClick={() => setIdx(i => (i+1) % lines.length)}>
          ▸ HE SAYS ON
        </button>
      </div>
    </div>
  );
}

// =========================================================
// CAMP SCREEN — pick a general, read dispatches, take tasks
// =========================================================
function DictationTask({ task, onDone, onCancel }) {
  const [typed, setTyped] = C_s("");
  const target = task.prompt;
  const correct = C_m(() => {
    let n = 0; for (let i = 0; i < typed.length && i < target.length; i++) if (typed[i] === target[i]) n++; return n;
  }, [typed, target]);
  const done = typed.length >= target.length;
  const accuracy = typed.length ? Math.round((correct/typed.length)*100) : 100;
  C_e(() => {
    function onKey(e) { if (e.key === "Escape") onCancel(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="trail-modal-bg" onClick={onCancel}>
      <div className="trail-modal" style={{maxWidth:760}} onClick={e => e.stopPropagation()}>
        <div className="eyebrow" style={{textAlign:"center"}}>★ {task.label} ★</div>
        <div style={{fontFamily:"var(--f-typewriter, Special Elite), monospace", fontSize:18, lineHeight:1.7, background:"var(--parchment-light)", padding:"18px 22px", border:"1px solid var(--sepia-dim)", margin:"14px 0", color:"var(--ink)"}}>
          {target.split("").map((c, i) => {
            const t = typed[i];
            const cls = t == null ? "" : (t === c ? "ok" : "bad");
            const cur = i === typed.length ? "cur" : "";
            return <span key={i} className={`dt-ch ${cls} ${cur}`}>{c}</span>;
          })}
        </div>
        <input autoFocus value={typed} onChange={e => setTyped(e.target.value)}
               className="dt-input"
               onPaste={e => e.preventDefault()}
               onCopy={e => e.preventDefault()}
               onCut={e => e.preventDefault()}
               onDrop={e => e.preventDefault()}
               onContextMenu={e => e.preventDefault()}
               autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
               placeholder="Type the dispatch above — verbatim — (no paste allowed)"/>
        <div style={{display:"flex", justifyContent:"space-between", marginTop:12, fontFamily:"var(--f-display)", letterSpacing:"0.14em", fontSize:11, color:"var(--sepia)"}}>
          <span>ACC {accuracy}%</span>
          <span>{typed.length} / {target.length}</span>
          <span>REWARD +{fmt(task.reward)}¢</span>
        </div>
        <div style={{display:"flex", gap:10, justifyContent:"center", marginTop:14}}>
          <button className="d-btn" onClick={onCancel}>STAND DOWN</button>
          <button className="d-btn primary" disabled={!done} onClick={() => onDone({ accuracy, ...task })}>
            ★ SEAL & DISPATCH
          </button>
        </div>
      </div>
    </div>
  );
}

function CampScreen({ profile, onStartTask, onGrant }) {
  const [pickedId, setPickedId] = C_s(NPCS[0].id);
  const npc = NPCS.find(n => n.id === pickedId);
  const [event, setEvent] = C_s(null);
  const [lineIdx, setLineIdx] = C_s(0);
  const [greeted, setGreeted] = C_s(false);
  const [task, setTask] = C_s(null);

  C_e(() => { setGreeted(false); setLineIdx(0); }, [pickedId]);

  function rollEvent() {
    const ev = TRAIL_EVENTS[Math.floor(Math.random() * TRAIL_EVENTS.length)];
    setEvent(ev);
  }
  function resolveEvent(success) {
    if (success) setTask({ kind: "trail", prompt: event.prompt, reward: event.reward, label: event.title });
    setEvent(null);
  }

  const greeting = npc.greetings[Math.floor(Math.random() * npc.greetings.length)].replace("{NAME}", profile.name);
  const currentLine = greeted ? npc.lines[lineIdx % npc.lines.length] : greeting;

  return (
    <div className="camp-screen">
      <div className="camp-head">
        <div className="eyebrow">★ HEADQUARTERS BIVOUAC ★</div>
        <h1>The Camp</h1>
        <div className="subline">— a slow afternoon, the wires humming, the coffee thin —</div>
      </div>

      <TelegraphTicker/>

      <div className="camp-grid">
        {/* Left: NPC roster */}
        <div className="camp-roster">
          <div className="roster-label">★ PRESENT FOR DUTY ★</div>
          {NPCS.map(n => {
            const Pt = n.Portrait;
            return (
              <button key={n.id} className={`roster-card ${pickedId===n.id?"active":""}`} onClick={() => setPickedId(n.id)}>
                <div style={{width:64, height:80, overflow:"hidden", flexShrink:0, border:`2px solid ${n.color}`, boxShadow:"inset 0 0 0 1px #e8b860"}}>
                  <div style={{transform:"scale(0.27)", transformOrigin:"top left", width:240, height:300}}>
                    <Pt/>
                  </div>
                </div>
                <div className="roster-meta" style={{minWidth:0, flex:1}}>
                  <div className="roster-name" style={{whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{n.name}</div>
                  <div className="roster-side" style={{whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{n.title}</div>
                  <div className={`roster-flag ${n.side}`}>{n.side === "north" ? "U.S.A." : "C.S.A."}</div>
                </div>
              </button>
            );
          })}

          <div className="roster-label" style={{marginTop:18}}>★ THE TRAIL ★</div>
          <button className="trail-btn" onClick={rollEvent}>
            <div style={{fontSize:24, lineHeight:1}}>⚒</div>
            <div>
              <div style={{fontFamily:"var(--f-display)", letterSpacing:"0.15em", fontSize:12}}>ON THE MARCH</div>
              <div style={{fontFamily:"var(--f-serif)", fontStyle:"italic", fontSize:12, color:"var(--sepia)"}}>Risk a random encounter</div>
            </div>
          </button>
        </div>

        {/* Right: portrait + dialogue */}
        <div className="camp-stage">
          <div className="camp-portrait-col">
            <npc.Portrait lit/>
            <div className="camp-nameplate" style={{borderColor: npc.color}}>
              <div className="np-name">{npc.name}</div>
              <div className="np-title">{npc.title}</div>
            </div>
          </div>

          <div className="camp-dialog">
            <div className="scroll-paper">
              <div className="dialog-eyebrow">— {greeted ? "He continues" : "He turns and speaks"} —</div>
              <div className="dialog-text">
                <span className="dialog-quote">"</span>
                <TypedLine key={pickedId+"-"+greeted+"-"+lineIdx} text={currentLine}
                           onDone={() => { /* idle */ }}/>
                <span className="dialog-quote">"</span>
              </div>
              <div className="dialog-actions">
                <button className="d-btn" onClick={() => {
                  if (!greeted) setGreeted(true);
                  else setLineIdx(i => i+1);
                }}>▸ GO ON</button>
                <button className="d-btn primary" onClick={() => {
                  setTask({ kind: "general", prompt: npc.task.text, reward: npc.task.reward, xp: npc.task.xp, label: npc.task.label + " — " + npc.name.split(".").pop() });
                }}>
                  ★ TAKE THE DICTATION — +{fmt(npc.task.reward)}¢
                </button>
              </div>
              <div className="dialog-task">
                <span style={{fontFamily:"var(--f-display)", letterSpacing:"0.12em", fontSize:10, color:"var(--crimson)"}}>STANDING ORDER:</span>
                <span style={{marginLeft:8, fontFamily:"var(--f-serif)", fontStyle:"italic", color:"var(--ink)"}}>{npc.task.label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {task && <DictationTask task={task}
        onCancel={() => setTask(null)}
        onDone={(r) => { onGrant && onGrant({ coins: task.reward, xp: task.xp || Math.round(task.reward * 0.2), label: task.label }); setTask(null); }}/>}

      {event && (
        <div className="trail-modal-bg" onClick={() => setEvent(null)}>
          <div className="trail-modal" onClick={e => e.stopPropagation()}>
            <div style={{fontSize:48, textAlign:"center"}}>{event.icon}</div>
            <div className="eyebrow" style={{textAlign:"center"}}>★ AN EVENT ON THE TRAIL ★</div>
            <h2 style={{textAlign:"center", margin:"4px 0 12px"}}>{event.title}</h2>
            <p style={{fontFamily:"var(--f-serif)", fontStyle:"italic", textAlign:"center", color:"var(--ink-soft)", lineHeight:1.5}}>{event.blurb}</p>
            <div style={{display:"flex", gap:10, justifyContent:"center", marginTop:18}}>
              <button className="d-btn" onClick={() => resolveEvent(false)}>WALK AWAY</button>
              <button className="d-btn primary" onClick={() => resolveEvent(true)}>★ TYPE IT OUT (+{fmt(event.reward)}¢)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================
// SOLDIER PORTRAIT — customizable player avatar
// =========================================================
const SOLDIER_DEFAULTS = { side: "north", hat: "kepi", hair: "brown", beard: "moustache", skin: "fair", rank: "private" };
const SOLDIER_OPTS = {
  side:  [["north","U.S.A.","#2a3a5e"], ["south","C.S.A.","#5a6a4a"]],
  hat:   [["kepi","Kepi"], ["slouch","Slouch Hat"], ["forage","Forage"], ["none","Bare"]],
  hair:  [["black","Black","#1a0a04"], ["brown","Brown","#5a3a1a"], ["red","Auburn","#8a4a1a"], ["blonde","Blonde","#c8a35b"], ["grey","Grey","#bdb3a0"]],
  beard: [["clean","Clean"], ["moustache","Moustache"], ["chinstrap","Chin Strap"], ["full","Full Beard"], ["mutton","Mutton Chops"]],
  skin:  [["fair","Fair","#e6c8a8"], ["tan","Tan","#cda07a"], ["olive","Olive","#a87a52"], ["brown","Brown","#7a4a28"], ["dark","Dark","#4a2810"]],
  rank:  [["private","Private"], ["corporal","Corporal"], ["sergeant","Sergeant"], ["lieutenant","Lieutenant"], ["captain","Captain"]],
};
function SoldierPortrait({ a = {}, w = 240, h = 300, lit = true, mood = "neutral" }) {
  const app = { ...SOLDIER_DEFAULTS, ...a };
  const skin = (SOLDIER_OPTS.skin.find(s => s[0] === app.skin) || SOLDIER_OPTS.skin[0])[2];
  const hair = (SOLDIER_OPTS.hair.find(s => s[0] === app.hair) || SOLDIER_OPTS.hair[1])[2];
  const isN = app.side === "north";
  const coat = isN ? "#2a3a5e" : "#5a6a4a";
  const trim = "#e8b860";
  const hatBase = isN ? "#1a2a44" : "#3a3a4a";
  const stripes = { private: 0, corporal: 2, sergeant: 3, lieutenant: 0, captain: 0 };
  return (
    <PortraitFrame w={w} h={h} lit={lit}>
      {/* Coat */}
      <path d="M 60 240 L 90 200 L 150 200 L 180 240 L 180 300 L 60 300 Z" fill={coat}/>
      <line x1="120" y1="200" x2="120" y2="300" stroke={trim} strokeWidth="2"/>
      {[225, 245, 265, 285].map(y => <circle key={y} cx="120" cy={y} r="3" fill={trim}/>)}
      {/* Rank chevrons on sleeve */}
      {[...Array(stripes[app.rank] || 0)].map((_, i) => (
        <path key={i} d={`M 64 ${260 + i*6} L 78 ${256 + i*6} L 92 ${260 + i*6}`} fill="none" stroke={trim} strokeWidth="2.5"/>
      ))}
      {(app.rank === "lieutenant" || app.rank === "captain") && (
        <>
          <rect x="78" y="210" width="22" height="10" fill={trim} stroke="#6a4a18"/>
          <rect x="140" y="210" width="22" height="10" fill={trim} stroke="#6a4a18"/>
          {app.rank === "captain" && <>
            <text x="89" y="219" fontSize="9" fill="#6a4a18">★</text>
            <text x="151" y="219" fontSize="9" fill="#6a4a18">★</text>
          </>}
        </>
      )}
      {/* Head */}
      <rect x="100" y="180" width="40" height="40" fill={skin}/>
      <ellipse cx="120" cy="222" rx="32" ry="6" fill="#2a1a08" opacity="0.4"/>
      <ellipse cx="120" cy="140" rx="42" ry="50" fill={skin}/>
      <ellipse cx="80" cy="148" rx="6" ry="10" fill={skin}/>
      <ellipse cx="160" cy="148" rx="6" ry="10" fill={skin}/>
      {/* Hair */}
      {app.hat === "none" || app.hat === "slouch" ? (
        <path d="M 78 122 Q 80 90 120 88 Q 160 90 162 122 L 158 130 Q 140 110 120 112 Q 100 110 82 130 Z" fill={hair}/>
      ) : (
        <path d="M 78 122 Q 80 110 120 110 Q 160 110 162 122 L 158 128 Q 140 122 120 122 Q 100 122 82 128 Z" fill={hair}/>
      )}
      {/* Eyes & brow — mood-driven */}
      {(() => {
        const eyeL = mood === "happy" ? {ry:1.2} : mood === "wince" ? {ry:0.7} : mood === "focus" ? {ry:1.6} : {ry:2.5};
        return <>
          <ellipse cx="106" cy="140" rx="3" ry={eyeL.ry} fill="#1a0a04"/>
          <ellipse cx="134" cy="140" rx="3" ry={eyeL.ry} fill="#1a0a04"/>
        </>;
      })()}
      {mood === "frown" && <>
        {/* angry-down brows */}
        <path d="M 98 134 L 114 128" stroke={hair} strokeWidth="3" strokeLinecap="round"/>
        <path d="M 126 128 L 142 134" stroke={hair} strokeWidth="3" strokeLinecap="round"/>
      </>}
      {mood === "wince" && <>
        {/* furrowed brows + crease */}
        <path d="M 98 132 Q 106 126 114 132" stroke={hair} strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M 126 132 Q 134 126 142 132" stroke={hair} strokeWidth="3" fill="none" strokeLinecap="round"/>
        <line x1="118" y1="128" x2="118" y2="135" stroke="#2a1a08" strokeWidth="1" opacity="0.5"/>
        <line x1="122" y1="128" x2="122" y2="135" stroke="#2a1a08" strokeWidth="1" opacity="0.5"/>
      </>}
      {mood === "happy" && <>
        {/* raised brows */}
        <path d="M 98 128 Q 106 124 114 128" stroke={hair} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M 126 128 Q 134 124 142 128" stroke={hair} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </>}
      {mood === "focus" && <>
        {/* concentrated lowered brows */}
        <rect x="98" y="133" width="16" height="2.5" fill={hair} transform="rotate(-3 106 134)"/>
        <rect x="126" y="133" width="16" height="2.5" fill={hair} transform="rotate(3 134 134)"/>
      </>}
      {mood === "neutral" && <>
        <rect x="98" y="131" width="16" height="2.5" fill={hair}/>
        <rect x="126" y="131" width="16" height="2.5" fill={hair}/>
      </>}
      {/* Nose & mouth — mood-driven */}
      <path d="M 120 145 L 117 158 L 123 158 Z" fill="#2a1a08" opacity="0.25"/>
      {mood === "happy"  && <path d="M 112 168 Q 120 176 128 168" stroke="#2a1a08" strokeWidth="1.6" fill="none" strokeLinecap="round"/>}
      {mood === "frown"  && <path d="M 112 174 Q 120 166 128 174" stroke="#2a1a08" strokeWidth="1.6" fill="none" strokeLinecap="round"/>}
      {mood === "wince"  && <path d="M 113 170 Q 120 168 127 170 L 124 173 L 116 173 Z" fill="#2a1a08" opacity="0.6"/>}
      {mood === "focus"  && <line x1="113" y1="170" x2="127" y2="170" stroke="#2a1a08" strokeWidth="1.8"/>}
      {mood === "neutral"&& <line x1="115" y1="170" x2="125" y2="170" stroke="#2a1a08" strokeWidth="1.5"/>}
      {/* Beard styles */}
      {app.beard === "moustache" && <path d="M 100 165 Q 120 162 140 165 L 138 172 Q 120 168 102 172 Z" fill={hair}/>}
      {app.beard === "chinstrap" && <>
        <path d="M 82 145 Q 88 200 120 205 Q 152 200 158 145 L 152 175 Q 140 195 120 198 Q 100 195 88 175 Z" fill={hair}/>
      </>}
      {app.beard === "full" && <>
        <path d="M 82 155 Q 88 200 120 208 Q 152 200 158 155 Q 150 195 120 200 Q 90 195 82 155" fill={hair}/>
        <path d="M 100 165 Q 120 162 140 165 L 138 172 Q 120 168 102 172 Z" fill={hair}/>
      </>}
      {app.beard === "mutton" && <>
        <path d="M 78 140 Q 82 188 100 190 L 100 158 Z" fill={hair}/>
        <path d="M 162 140 Q 158 188 140 190 L 140 158 Z" fill={hair}/>
      </>}
      {/* Hat */}
      {app.hat === "kepi" && <>
        <path d="M 72 110 L 72 92 Q 72 78 120 76 Q 168 78 168 92 L 168 110 Z" fill={hatBase}/>
        <rect x="72" y="108" width="96" height="5" fill="#1a1a24"/>
        <rect x="100" y="84" width="40" height="6" fill={trim} opacity="0.7"/>
      </>}
      {app.hat === "forage" && <>
        <path d="M 72 112 L 72 100 Q 72 82 120 80 Q 168 82 168 100 L 168 112 Z" fill={hatBase}/>
        <ellipse cx="120" cy="112" rx="56" ry="6" fill="#1a1a24"/>
      </>}
      {app.hat === "slouch" && <>
        <ellipse cx="120" cy="100" rx="70" ry="8" fill="#3a2810"/>
        <path d="M 78 100 Q 80 70 120 68 Q 160 70 162 100 Z" fill="#5a3a1a"/>
        <rect x="76" y="92" width="88" height="4" fill="#2a1a08"/>
        <path d="M 100 70 L 140 70 L 138 76 L 102 76 Z" fill={trim} opacity="0.5"/>
      </>}
    </PortraitFrame>
  );
}

function CharacterCustomizer({ profile, onSave, onClose }) {
  const [a, setA] = C_s({ ...SOLDIER_DEFAULTS, ...(profile.appearance || {}) });
  return (
    <div className="trail-modal-bg" onClick={onClose}>
      <div className="trail-modal" style={{maxWidth:880, width:"92%", display:"grid", gridTemplateColumns:"280px 1fr", gap:24}} onClick={e => e.stopPropagation()}>
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:10}}>
          <SoldierPortrait a={a}/>
          <div style={{textAlign:"center", fontFamily:"var(--f-display)", letterSpacing:"0.1em", fontSize:13, color:"var(--ink)"}}>
            {a.rank.toUpperCase()} {profile.name.toUpperCase()}
          </div>
          <div style={{fontFamily:"var(--f-serif)", fontStyle:"italic", fontSize:12, color:"var(--sepia)"}}>
            {a.side === "north" ? "Union — Army of the Potomac" : "Confederacy — Army of N. Virginia"}
          </div>
        </div>
        <div>
          <div className="eyebrow" style={{textAlign:"center", marginBottom:14, color:"var(--crimson)", fontFamily:"var(--f-display)", letterSpacing:"0.22em", fontSize:12}}>★ MUSTER ROLL ★ ENLIST YOUR LIKENESS ★</div>
          {Object.entries(SOLDIER_OPTS).map(([key, opts]) => (
            <div key={key} style={{marginBottom:12}}>
              <div style={{fontFamily:"var(--f-display)", letterSpacing:"0.16em", fontSize:10, color:"var(--sepia)", marginBottom:4}}>{key.toUpperCase()}</div>
              <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
                {opts.map(o => {
                  const swatch = o[2];
                  const active = a[key] === o[0];
                  return (
                    <button key={o[0]} onClick={() => setA(s => ({...s, [key]: o[0]}))}
                      style={{
                        padding: swatch ? "3px 8px 3px 26px" : "5px 10px", position:"relative",
                        fontFamily:"var(--f-serif)", fontStyle:"italic", fontSize:13,
                        background: active ? "var(--brass-bright)" : "var(--parchment-light)",
                        color:"var(--ink)", border:`1.5px solid ${active ? "#6a4a18" : "var(--sepia-dim)"}`,
                        boxShadow: active ? "0 2px 0 #6a4a18" : "none", cursor:"pointer",
                      }}>
                      {swatch && <span style={{position:"absolute", left:6, top:"50%", transform:"translateY(-50%)", width:14, height:14, background:swatch, border:"1px solid #6a4a18"}}/>}
                      {o[1]}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{display:"flex", gap:10, justifyContent:"flex-end", marginTop:18, paddingTop:14, borderTop:"1px dashed var(--sepia-dim)"}}>
            <button className="d-btn" onClick={onClose}>CANCEL</button>
            <button className="d-btn primary" onClick={() => { onSave(a); onClose(); }}>★ SIGN THE ROLL</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// SOLDIER STORIES — branching, type-from-the-soldier's-pen
// Multiple endings, randomized per playthrough
// =========================================================
const SOLDIER_STORIES = [
  {
    id: "first-march", title: "The First March", date: "Summer, 1861", reading: "12 min",
    intro: "I am nineteen years old. My name is on the muster roll of the 83rd Pennsylvania Volunteers, in a hand I do not remember writing. The recruiting sergeant gave me three dollars and a paper to sign, and a man in a fine coat shook my hand and called me a patriot. My mother packed me a tin of biscuits, four pairs of wool stockings, and the small bible that was my father's. She did not weep until I was already on the wagon. I am writing this on the back of an envelope, by the light of a tallow candle, in a tent that smells of wet canvas and other men.",
    chapters: [
      "Camp Curtin, outside Harrisburg. The rain has not let up in three days and the parade ground is a hog wallow. My brogans are caked with mud to the ankle and my forage cap is heavier wet than dry. We have been drilling all morning — right shoulder shift, left shoulder shift, the manual of arms — and most of the boys cannot tell their right from their left. The sergeant, a regular army man from Pittsburgh named Doyle, walked down the line and looked each of us in the face and said, gentlemen, the rebels will not wait for you to learn this. So we drill again, and again, until the rain has gone clean through my coat and my musket is a bar of cold iron in my hands.",
      "We crossed the Susquehanna at dawn on the cars. A boy from Lancaster County named Asahel slipped on the wet planking at the depot and fell between the platform and the train. The captain himself caught him by the back of his collar and hauled him up like a kitten, swearing in a way I have never heard a captain swear before. Asahel laughed afterwards, but his teeth chattered the whole rest of the morning, and I gave him my spare wool blanket, which is the first thing I have given anyone since I left home. He looked at me as if I had given him a horse.",
      "An old man came to the fence at Cockeysville with a sack of apples. He must have been seventy. He had three sons in the regiment that went down before us, he said, and not one had come home. He set the sack inside the gate and would not take our coins, though we pressed them on him. He stood there with his hat held against his chest, and he said, God bless the Union, boys, and God keep you. I ate my apple slowly. It was the best apple I have ever eaten in my life. I do not think I shall ever eat one as good again.",
      "Tonight we are camped in a field outside Baltimore. There is a fellow in our mess by the name of Tom Wheeler, a tall thin boy from Erie with a face like a hatchet, who has taken to me without my asking. He plays a tin whistle very ill but very loud. He has a brother in the 21st Virginia, he tells me, and he has not spoken to him in two years on account of politics, and he expects he will have to look for him across every battlefield until one of them is dead. He said this very plainly and then he laughed and offered me a cup of coffee, and we did not speak of it again.",
      "I have been a soldier for one month and I have not yet seen a rebel except in a newspaper drawing. The army is a great slow beast. We march and we wait and we march and we wait. The veterans of the three-month regiments are going home, and they look at us with a kind of pity that I do not understand and do not wish to understand. One of them, a sergeant with his arm in a sling, stopped me at the wash-pump this evening and asked how old I was. I told him nineteen. He looked at me for a long time. Then he said, write to your mother tonight, son. Write to her every week. Do not let a week go by. And he walked away before I could answer.",
    ],
    endings: [
      { kind: "good",    text: "I have written to mother. The boys are singing Lorena around the embers and Tom Wheeler is murdering it on the tin whistle and somebody is laughing somewhere in the dark. The rain has stopped. The stars are out over Maryland, and they are the same stars I knew at home. Whatever tomorrow may bring, this evening I am whole, and I am warm, and I am content, and I find that I love these men more than I have ever loved anyone outside my own blood." },
      { kind: "neutral", text: "I write by a sputtering candle. The pickets are quiet. Somewhere south of us the telegraph wires are humming with news we shall not hear until breakfast. Sergeant Doyle walked past my tent and said nothing. I am not a man yet, I think. I am only a boy in a man's uniform, learning to wear it. But I am learning. I am learning a little every day, and that is enough for tonight." },
      { kind: "tragic",  text: "Word came back at midnight that the bridge we crossed this morning has been burned by Maryland secessionists. Two companies of the Ohio regiment behind us were caught on the far bank and there has been firing in the dark for an hour. We can see the orange of it from the rise. The captain is sitting in his tent writing letters and he has not lifted his head in two hours. I cannot sleep. I keep thinking of Asahel, falling between the train and the platform, and how easily a thing happens, and how it cannot be undone." },
      { kind: "fateful", text: "The colonel rode through camp at midnight with new orders from Washington. He came right to our mess fire and dismounted, and he asked the captain who his best young man was, and the captain looked at me and said, Henderson, sir. The colonel looked at me a long moment by the firelight. He said, son, can you ride a horse? And I said yes sir, I have been on horses since I was four. And he said, then we shall make a courier of you. Pack your kit. You ride for Frederick at dawn. So I am to leave the company before I have ever fired my musket. Tom Wheeler embraced me and said he would see me at Richmond. I do not know if I shall ever see him again." },
      { kind: "tragic",  text: "Asahel took a fever in the night. The surgeon says it is the measles, that half a regiment will catch it before we ever see a rebel, and that some will not get up again. He is in the hospital tent now, very small under the blanket. I sat with him an hour and held his hand because no one else had come. He asked me to write to his mother. I said I would. I have her name on a scrap of paper in my pocket. I do not yet know what I shall write." },
    ],
  },
  {
    id: "antietam-eve", title: "On the Eve of Antietam", date: "September 16, 1862", reading: "14 min",
    intro: "Sharpsburg, Maryland. The cornfields are taller than a man, and the cornsilk catches the light like a girl's hair at evening. There is a small white church at the edge of the West Woods that the Dunker brethren built, very plain, with no steeple. I have been a soldier for fourteen months. I have seen the Peninsula, and Gaines's Mill, and Malvern Hill, and Second Bull Run, and I have come out of all of them with no worse than a scratch on my left hand from a splinter. Tonight I do not believe my luck will hold. None of us do. We are all writing letters by the firelight, every man in the brigade. Tomorrow there will be a battle, and it will be a great one, and I think I shall be in the very middle of it.",
    chapters: [
      "We came up the Hagerstown turnpike at sunset, twelve miles in road dust thick enough to swallow a man whole. The Dunker Church stands all alone at the corner of the woodlot, very small, very white, with the cornfield to the south of it. Tomorrow at first light we shall pass it again, and I expect under very different circumstances. There is something obscene about a peaceful little chapel sitting in the path of an army. The Dunkers themselves are pacifists. They have all gone home and locked the door behind them. I do not blame them. If I had a door to lock, I should lock it too.",
      "Tom Wheeler is here. He has grown a great red beard like a Viking and he has been made a corporal. We do not speak as much as we used to but we drink coffee together every evening and that is enough. Tonight he came to my fire and sat down without a word and after a long time he took out his father's silver pocket-watch and put it in my hand. He said, if I do not come back, send it to my mother at Erie. I gave him my mother's small bible and said the same. We did not embrace. He shook my hand the way a banker shakes hands, very formal, very firm, and then he went away to his own fire. We have done this before. We did it before Malvern Hill. I do not know why it feels different tonight.",
      "I went up the rise an hour ago to look at the rebel campfires across the Antietam creek. There are thousands of them. They string out across the slope like a vast disordered town set down in the wrong place. The men around me were very quiet. Sergeant Doyle, who has been at this from the very beginning and is the bravest man I have ever known, was quieter than any of us. He stood with his hands behind his back and after a long while he said, well, boys, there they are. I do not know how many they are, and I do not believe the colonel knows either. The army says forty thousand. Tom Wheeler says a hundred thousand. Tonight, looking at all those little fires, I believe Tom Wheeler.",
      "The chaplain came through the lines about nine o'clock. He is a small bald man from Meadville named Doctor Frye, and he speaks always as if he is apologizing for the existence of his own voice. He did not preach. He asked each man if he wished to pray, and if he did not, the chaplain only sat with him a minute and went on. When he came to me I said I would pray, and we said the Lord's Prayer together very quietly, and at the end he put his hand on my head, the way my father used to do when I was a small child, and said, the Lord bless thee and keep thee. I have not been a small child in a very long time. I cried, and I am not ashamed of it.",
      "Asahel is here also. He recovered from the measles, in case you wondered, and rejoined us at Yorktown, and he has been with the company ever since. He is no longer the boy who fell between the platform and the train at Cockeysville. He is twenty years old now and he has a hard face and he does not laugh as easily. Tonight at the fire he was cleaning his rifle very methodically — wiping it, oiling it, snapping the lock, wiping it again — and he said, almost to himself, I am tired of being afraid. I do not think he meant me to hear. I pretended I did not.",
      "It is almost midnight and I cannot sleep. I have written letters to my mother, to my sister Mary, to the Methodist minister at home, and to a girl named Susannah Beale whom I knew in school and to whom I have never spoken a word since. I do not know what came over me to write to her. I sealed the letter very quickly so that I would not open it again and read what I had said. The picket firing has stopped along the creek. There is a strange great quiet over both armies. Tomorrow it will be the bloodiest day this country has ever known. We do not know that tonight, but we feel it. You can feel it the way you feel a storm coming on the back of your neck.",
    ],
    endings: [
      { kind: "good",    text: "I survived the day. The cornfield was a thing I cannot describe and shall not try to. We went into it four hundred and twenty strong and came out of it a hundred and ten, and Tom Wheeler and Asahel were both among the hundred and ten, by some grace I do not pretend to deserve. At sunset we drank coffee together on the porch of the Dunker church, which has a great hole in the roof now from a shell, and we did not say a word for a long time. Then Tom looked at me and laughed once, a small dry laugh, and handed me back my mother's bible. I gave him his watch. We did not speak of what we had seen. I do not know that we ever shall." },
      { kind: "tragic",  text: "Tom Wheeler did not come back from the cornfield. He was at my left elbow at the second volley and he was not there at the third. I went back for him at dusk under a flag of truce and I found him face down between the rows, untouched but for a small dark place at the back of his collar. I carried him out on my shoulders. He was very light. I have his watch in my pocket and his tin whistle in my haversack. I shall send the watch to his mother at Erie as he asked. I do not know yet what I shall do with the whistle. I cannot bear to throw it away and I cannot bear to keep it." },
      { kind: "fateful", text: "I caught a ball in the left shoulder at the second charge across the cornfield, but I would not go to the rear, and Sergeant Doyle bound it up with my own handkerchief and gave me a pull from his canteen and pushed me back in the line. At the third charge the color sergeant went down and the colors went down with him, and I picked them up because they were nearest, and I carried them for the rest of the day. The brigadier himself rode past me at sunset and reined in and took off his hat. He asked my name. He said, Henderson, you shall have a sergeant's stripes for this, and so will every man who stood with you. I do not feel I have done anything. I feel only that I am very tired and that my shoulder hurts." },
      { kind: "neutral", text: "We held the line until dusk and the rebels held theirs. Neither army gave a foot of ground. Both armies sleep tonight on the very ground they stood at dawn, and the wounded are between them in the cornfield, and we cannot reach them, and they cry out in the dark for water and for their mothers. I have a canteen full of water and I cannot use it. There is a boy in gray about thirty yards out and I have been listening to him for two hours and I do not think I shall ever again hear a sound like it for as long as I live." },
      { kind: "tragic",  text: "Asahel is gone. He went down at the rail fence beside the turnpike, very early in the morning, before the worst of the day had even begun. I did not see him fall. I did not know he was dead until evening, when I went looking for him at the field hospital, and a surgeon's orderly said yes, that one, the freckled boy, he came in at nine o'clock and he was gone by ten, and I am sorry son but there was nothing to be done. I have his haversack and his letters and the small wooden cross his mother gave him at Cockeysville. He fell between the platform and the train, once. I have been thinking about it all evening. Some men get caught the second time." },
      { kind: "fateful", text: "At about three in the afternoon a general staff officer rode up to our colonel and they spoke a moment and then the colonel turned to the company and said, I want a volunteer to carry a message to General Sumner. I stepped out before I knew I had done it. The officer looked at me and said, can you ride, Pennsylvania? I said I could. He gave me his own horse, a great black gelding called Caesar, and I rode three miles under shellfire with a folded paper in my coat, and I delivered it, and I rode back. General Sumner himself spoke to me. He said, that was well done, son. They are putting my name in the dispatch. I do not know how to feel about it. Asahel is dead. Tom is wounded in the leg and may lose it. I rode a horse." },
    ],
  },
  {
    id: "gettysburg-3", title: "The Third Day at Gettysburg", date: "July 3, 1863", reading: "15 min",
    intro: "Cemetery Ridge, Pennsylvania. My own state. My own ground. There is a low stone wall in front of our line and a copse of trees behind it and a wheatfield in front of it that runs gently down to the Emmitsburg Road. The artillery began at one o'clock in the afternoon and it did not stop for two hours, and in all my time as a soldier I have never heard anything like it, not at Malvern Hill, not at Antietam, not at Fredericksburg, not at Chancellorsville. The very air shook. A shell took the head off Corporal Maginnis on my immediate right and I did not move. There was nowhere to move to. Now there is a great quiet. The smoke is lifting. And across the wheatfield, in three long perfect lines, the Army of Northern Virginia is coming for us on foot.",
    chapters: [
      "I have never in my life seen anything like what is in front of me now. There is a mile-wide line of Confederate infantry walking — walking — across open ground in close order, with their officers mounted in front of them and their battle flags up, the red and the blue ones both. They are not running. They are walking. I can hear their bands playing somewhere behind them in the smoke. The captain says it is fifteen thousand men. Tom Wheeler — he is here, he is here, his leg healed, he made corporal again and then sergeant — Tom Wheeler is at my left, and he said in a voice I have never heard from him before, my god, my god, look at them. They are the bravest men I have ever seen.",
      "Our artillery has opened from the ridge above us. Whole files of the gray line are going down at once, like a man drawing a hand across a chessboard. I can see it happen in slow motion. A shell strikes the second rank of a Carolina regiment about three hundred yards out and the whole front of the regiment simply ceases to be a regiment for a moment, and then closes up, and then comes on. They do not break. They do not run. They close the gaps and they come on. I am sick to my stomach. I am proud of them. I am terrified of them. I do not know how to hold all of those things in the same body at once.",
      "We held our fire until they were inside two hundred yards. The order came down the line — fire by file, commence firing — and we began. I have fired my musket six times. My right shoulder is a bruise from collarbone to elbow. The man on my left is no longer Tom Wheeler. I do not know when Tom Wheeler stopped being there. There is a new man in his place, a sergeant from another company who has lost his hat. The rebels are at the Emmitsburg Road now. They are climbing the rail fence and the fence is killing as many of them as we are. The boy I am aiming at is perhaps seventeen years old. I do not aim for the boy. I aim for the colors above him. I am told this is what one is meant to do.",
      "They are at the wall. They are at the wall. A Virginian came over the wall directly in front of me — a tall man with a yellow beard and a sword in his hand — and an officer of ours, I do not know who, shot him with a revolver at three feet. He fell across the wall and lay there. There was hand-to-hand for a moment among the trees. I struck a man with the butt of my musket. I do not know what became of him. I do not know if he was killed or only stunned. There is a Virginian's face in my mind very clearly — a young one, very young, very surprised — and I do not know whose bayonet was on him. It might have been mine. It might have been any of ours. I cannot tell. The smoke is everywhere. I have powder in my eyes and blood from somewhere on my face and I do not believe it is mine.",
      "It is breaking. The charge is breaking. The gray line is going back across the wheatfield, very slowly, in twos and threes, and our boys are firing at their backs because no one has told us to stop. An officer rides down the line waving his hat and shouting cease fire, cease fire for the love of god, and we cease firing. I sit down where I am standing. I sit down in the grass behind the stone wall, with my musket across my knees, and I am sick into the grass between my boots. I am not ashamed of being sick. Half the company is doing the same. The man who was on my left a moment ago, the sergeant without a hat, is sitting against the wall with his eyes closed and tears coming down his face, and he is praying out loud, and no one is troubling him.",
      "Tom Wheeler is dead. I found him an hour after the charge broke. He was about ten yards in front of the wall, sitting up against a small rock as though he were resting. There was a wound in his chest and another in his throat. He had taken out my mother's bible and was holding it in his lap. I do not know if he knew, at the end, that he was holding it. I sat with him a long time. I do not know how long. Asahel was killed at Antietam, and now Tom is killed at Gettysburg, and I am the only one left of the three of us who shared a fire at Cockeysville on the night the old man gave us the apples. I am twenty-one years old. I do not feel twenty-one years old. I do not know what age I feel. I do not believe there is a number for it.",
    ],
    endings: [
      { kind: "good",    text: "We held the wall. The whole army held. Tonight I am alive and I have washed Tom Wheeler's face with water from my own canteen and laid him under a poncho with the bible folded in his hands, and a chaplain has prayed over him, and tomorrow I shall bury him myself. I shall send the watch to his mother in Erie. I have written the letter already, three times, and burned the first two. The third one is short. I told her that he was the bravest and the kindest man I have ever known, and that he died facing the enemy on the soil of his own state, and that he loved her. I do not know what else there is to say. I do not know that there is anything else." },
      { kind: "fateful", text: "I caught a ball through the crown of my forage cap at the moment of the breakthrough. It parted my hair and took the brim clean away. An inch lower and I should not be writing this. The captain has put me up for a citation. He says I held the regimental colors after the color sergeant fell and that I struck the Virginian on the wall with the butt of my musket and that I rallied the line at the moment of the break. I do not remember doing any of those things, but seven men say I did, and so I suppose I did. There is to be a medal struck for actions of this kind, by act of Congress. I do not want a medal. I want Tom Wheeler to be alive. But one does not get a choice in these matters." },
      { kind: "tragic",  text: "The Virginian I struck on the wall was seventeen years old. I know this because we have his papers. His name was Edmund Lawrence Carter, of the 14th Virginia, from a place called Powhatan County, and he had a sister and a mother and no father living. He died in our field hospital at about midnight. I sat with him for the last hour because no one else had come, and I held his hand, the way the chaplain held mine on the eve of Antietam. He thought I was his brother. He said, Charlie, Charlie, I tried, I did try. I told him he had done well and that he should rest. I do not know if it was a lie. I do not believe I shall ever forget his face." },
      { kind: "neutral", text: "When the firing finally died away there was a strange great quiet over the field, the same quiet there was at Antietam, only worse, because the field was bigger. The wounded were calling from the wheatfield for water in two accents, the northern and the southern, and at that distance you could not tell them apart. We went out under a flag at sundown with canteens and stretchers and we brought in everyone we could reach, ours and theirs alike, and the surgeons worked all night. A great many of them were boys. So were a great many of us. I do not know any longer what the difference is supposed to be between us. I knew once. I am no longer sure." },
      { kind: "good",    text: "President Lincoln is to come to this place, the colonel says, in the autumn, to dedicate a cemetery on this very ground. I shall not be here for it. By autumn I expect we shall be on the Rapidan again, or in the Wilderness, or in some place we have not yet learned the name of. But I am glad he is coming. I am glad someone in Washington will see what we did here, and what was done to us, and what was done by us. I should like to think it was for something. Tonight, sitting against the stone wall with Tom Wheeler under a poncho and the wheatfield full of bodies in the moonlight, I should very much like to think it was for something." },
      { kind: "fateful", text: "An aide of General Hancock's came down the line at evening looking for a man named Henderson. He found me. The general himself, who is wounded in the leg and is in great pain, has been asking after the boy who held the colors at the angle. He wants to shake my hand. I am to go to him at the field hospital tonight. I do not know what to say to a general. I have nothing in my head to say to anyone tonight. But I shall go. Tom Wheeler would have laughed and called me Pennsylvania, and shoved me forward, and so I shall go." },
    ],
  },
  {
    id: "wilderness", title: "Into the Wilderness", date: "May 5, 1864", reading: "13 min",
    intro: "Virginia again. Always Virginia. We crossed the Rapidan three days ago under a new general — Grant, the western man, the one they say smokes cigars in the saddle and does not stop for anything — and we are in a country called the Wilderness, which is the right name for it. Scrub oak and second-growth pine so thick a man cannot see thirty yards, and dry as tinder, and with the bones of the Chancellorsville dead still lying among the brambles where they fell a year ago. I am twenty-two. I am the senior sergeant of my company. There is no one left in the company who remembers Cockeysville. There is no one left in the regiment, even, except myself and a lieutenant named Cobb. The army is full of strangers in our uniform. We bury them and we make more of them and we bury them.",
    chapters: [
      "The fighting today began in the brush and stayed in the brush. There is no field at Wilderness. There is no line of battle that a man can see. There is only smoke in the leaves and the flash of muzzles forty yards in front of you and the screaming of men you cannot see. We fired at flashes. The flashes fired back. About midday the woods began to burn — the powder smoke and the dry leaves catching together — and the wounded who could not crawl were caught in the flames. We could hear them. We could not get to them. There was a private from Schuylkill County named Brennan in my company, twenty years old, who tried to crawl back to one of them and was shot in the back of the head doing it, and he fell into the fire himself, and we could not get to him either. I shall be hearing the sound of this for the rest of my life.",
      "There is a great difference between Grant and the other generals we have had. The others, when a day went as today went, would have ordered us back across the Rapidan in the night, and we should have spent the summer recovering and writing letters home. Grant has not done this. Grant has ordered us south. We march tonight, by the left flank, in column of fours, around the rebel right, toward a crossroads called Spotsylvania. I have been a soldier almost three years and I have never marched south after a fight like today. I do not know whether to weep or to cheer. The boys in the column cheered when they understood. They cheered Grant. He sat on his horse at the side of the road and chewed his cigar and did not say a word, and the column kept on cheering, regiment after regiment, all down the line.",
      "Lieutenant Cobb is from a place near my own home. He is twenty-four. He volunteered the same week I did, in a regiment that was destroyed at Antietam, and he came to us as a replacement officer last winter. Tonight, on the march, he came up beside me in the dark and said, Henderson, I am going to be killed tomorrow. He said it quite calmly. I told him not to talk that way. He said, I am not afraid, I have had the feeling all afternoon, I know it the way you know rain is coming. He gave me a letter for his mother and a small daguerreotype of a girl. He said the girl was not his sweetheart, only a cousin he was fond of. He said, send her the daguerreotype back, will you, I should not like her to think I died with a picture of her in my pocket, it would not be fair to her. Then he laughed and walked back to his place in the column.",
      "We came up to the Mule Shoe at first light. There is no other word for that place than slaughter. I shall not write the details. I shall say only that the rebel works were ours, and then they were not ours, and then they were ours again, and the rain began at noon, and we fought across a parapet of dead men in the rain for eighteen hours without stopping, and when at dawn the rebels finally gave up the salient and fell back to a new line, there were oak trees as thick as a man's body shot clean through by musket fire. I saw one. I touched it. I do not believe such a thing is possible and yet I touched it with my own hand.",
      "Lieutenant Cobb was killed at about four o'clock in the afternoon at the Mule Shoe, leading a company of the 7th New York in a counter-attack. He was shot through the throat and he fell across the parapet and he did not move again. He had told me he would die today and he had been right. I had his letter and the picture in my coat. I sent them both that evening from the field telegraph station, by way of Washington, to a Mrs. Cobb at Meadville. I added a note of my own. I said he had been a kind officer and a brave one and that he had spoken of her in his last hours. I did not say he had foreseen his death and walked into it. I do not believe a mother needs to know a thing like that. I do not believe it would help her to know it.",
    ],
    endings: [
      { kind: "good",    text: "The army keeps going south. Whatever Grant is, and whatever men say of him, he keeps going south. Tonight we are at the North Anna river and the rebels are still in front of us and tomorrow we shall fight again. I have a hot supper and a dry blanket and a man under my command who plays the harmonica very well, and I have washed my face for the first time in a week. There is a particular quality to being still alive at the end of a day when many of your friends are not. It is not happiness. It is something quieter. I have come to know it well." },
      { kind: "tragic",  text: "I caught a fever in the swamp at Cold Harbor and they have sent me to the field hospital at White House Landing. There is a smell here I shall not describe. The man in the cot next to me, a Vermonter named Pettibone, died this morning at about ten o'clock, and they did not come for him until two in the afternoon, and I lay beside him for four hours. I am not dying. The surgeon says I shall recover and be sent back to the regiment in a fortnight. But I do not feel that I am the same man who marched south from the Rapidan three weeks ago, and I do not believe I shall ever be that man again." },
      { kind: "fateful", text: "There is talk that a new regiment is being raised in Pennsylvania and that they are looking for veteran sergeants to come home and take commissions in it as officers. The captain has put my name forward. He says they will make me a first lieutenant directly, with a captaincy by Christmas if I survive the summer. I do not know yet what I shall do. To go home and to wear a new uniform and to teach new boys to do what we have done — I do not know whether I have it in me. I do not know whether I have anything in me anymore that is not this regiment and these men." },
      { kind: "neutral", text: "We have been in the trenches at Petersburg now for three weeks. The trenches are like nothing we have ever seen. Men live in them as moles live, with their faces pressed against the wet clay, and the sharpshooters take the head off anyone who shows it above the parapet. There is a corporal across from me, four feet away, who has been reading the same letter from his wife for an hour by candlelight. I have not asked him what is in it. We do not ask such things. A man's letters are his own. I have my own letters, in a tin box under my blanket. I do not read them as often as I used to. I do not know why." },
      { kind: "good",    text: "Mother's letter found me this evening at last. It has been chasing the regiment since Pennsylvania. She is well. The barn was rebuilt. Susannah Beale — I had quite forgotten — Susannah Beale is teaching at the schoolhouse in our village and she has asked after me twice this winter. Mother says this with a great deal of underlining. I have not thought of Susannah Beale in two years. I am thinking of her now. The corporal beside me is asleep with his harmonica on his chest. The shelling has stopped for the night. There is a moon somewhere above the trench works. I am twenty-two years old. I am alive. I had forgotten, for a time, that those two things are remarkable." },
    ],
  },
  {
    id: "appomattox", title: "Surrender at Appomattox", date: "April 9, 1865", reading: "13 min",
    intro: "A small village in Virginia, named for a court house. I have been a soldier for nearly four years. I have walked, by my own count, eleven hundred miles in this uniform, and I have worn out seven pairs of brogans, and I have fired my musket in seventeen general engagements and in more skirmishes than I can name. Tom Wheeler is dead. Asahel is dead. Lieutenant Cobb is dead. Sergeant Doyle was killed at Spotsylvania. The chaplain Doctor Frye took a shell at Petersburg in the autumn. Of the men I marched south with from Camp Curtin in the summer of 1861, I know of three who are still alive, and I am one of them. This is the last day. I do not believe it yet, but I am told it is the last day, and I am writing this down so that I shall remember it.",
    chapters: [
      "The morning was bright and very cool, the kind of April morning my mother loves best, when the cherry trees are out at home and the river is high and clean. We could hear the rebel bugles in the lines opposite at first light, calling reveille as if it were any other day. About nine o'clock there was a rumor down the line of a flag of truce coming forward. About ten o'clock the rumor became a fact. A rebel staff officer rode out between the lines with a folded white cloth tied to the point of his sabre. Word came back along the regiments — parley, parley, hold your fire — and then a longer word — they want terms — and we did not at first understand what it meant.",
      "General Grant rode past us about noon on his way to the McLean house, in a private's coat with mud to the knee and no sword at his side. He did not look like a man who had won a war. He looked like a man who had been on a horse for a long time and would like his dinner. He glanced at our line once as he passed and he raised one finger to the brim of his hat, very briefly, very plainly, and that was all. The boys did not cheer him. The boys took off their forage caps without saying a word, every man of us, all the way down the line, and we stood at attention as he went by. I have never seen the army do that before. I do not believe I shall ever see it do it again.",
      "Word came at about four in the afternoon. The surrender was signed. The Army of Northern Virginia would lay down its arms in two days' time on the road outside the village. The boys did cheer then — at first they cheered — and then someone said, very loud, that's enough boys, those men over there are our countrymen, and the cheering stopped, and there was a strange quiet again, and the colonel rode along the line and looked into the face of every man, and at the end he took off his hat and said, gentlemen, the war is over. I do not believe him. I have not yet believed him. I keep waiting for the bugle to call us into line of battle.",
      "Two days later, on the road outside Appomattox Court House, the Army of Northern Virginia came forward to stack its arms. General Chamberlain, of Maine, the professor — he is the brigade commander on our right — gave the order: present arms. Our whole line came to the carry. The rebel column halted. General Gordon, who led them, lifted his sword and saluted us, and turned his horse, and the rebel column came to the present in their turn, and they stacked their muskets and laid their colors, and they walked away. There was no cheering. There was not a word. Twenty thousand men on each side of the road, and not a sound, except the click of the muskets being stacked, and the soft tramp of feet on the spring mud.",
      "I stood at the carry with my hand on my musket and I watched them. Ragged is not the word. There were men in that column without shoes, and men without shirts, and men whose trousers were patched with the cloth of their own captured flags, and they walked past us with their heads up, and they did not look at us with hatred. They looked at us as men who have done a hard piece of work together with their neighbors. I have hated these people for four years in a general sort of way, and I have killed them, and they have killed my friends, and I find that I cannot hate them now. I cannot. I have tried, standing here, and I find that I cannot. They are men. They are men like ours. We were lied to about a great many things, by a great many people, all of us, on both sides of the road.",
      "There was a Virginia regiment toward the end of the column whose colors I recognized. I had seen them on the wall at Gettysburg. I stepped a little out of the line to look. Their color sergeant, a tall thin man with a great gray beard, met my eye as he passed. He stopped. He looked at me for a long moment, and I looked at him. He nodded to me once, very slowly, the way a man nods who is not going to say what he is thinking but wants you to know that he is thinking it. I nodded back. Then he marched on past with his colors, and a young officer behind him snapped them down to the stack, and they were gone. I do not know who he was. I shall never know. He had been at the wall. He knew I had been there too. That was enough.",
    ],
    endings: [
      { kind: "good",    text: "I am going home. The captain shook my hand this morning and called me by my christian name for the first time in four years. We are to be mustered out at Washington in three weeks. I have my furlough papers in my coat. I have a hundred and sixty dollars in back pay in my pocket. I have all my limbs and most of my hearing and most of my teeth, and I have a small bible that has been to every fight from the Peninsula to Petersburg, and I have a tin whistle that I have never learned to play. I have a long journey ahead of me. Mother does not know yet that I am coming. I should like very much to surprise her. I should like to walk up the road from the village in my uniform on a Sunday morning and to be standing in the kitchen when she comes in from church. I have not let myself think about it for four years. I am letting myself think about it now." },
      { kind: "neutral", text: "Lee rode by on his horse Traveller at about two o'clock, going back to his lines after signing the surrender. He took off his hat to us as he passed. I do not know what I expected of him. I had pictured him for four years as a kind of devil, in the way a soldier pictures the man on the other end of the line. He is not a devil. He is a tired old man on a tired old horse, going home to a country that has been ruined. I am twenty-three years old and I have white hairs at my temples already. I expect he saw them on me as he passed. I expect he sees them on a great many of us." },
      { kind: "fateful", text: "Colonel Chamberlain himself sent for me this evening. He has asked me to remain in the army. The regular establishment is being kept on for service in the west, on the plains and along the Rio Grande, and he has offered me a lieutenancy in the regulars with a brevet captaincy from the first of the year. I sat in his tent for an hour. He is a kind man, and a learned one, and he spoke to me of the frontier and of the work to be done. I asked for the night to think. I have been thinking. My farm wants me. My mother wants me. Susannah Beale, who has been writing to me since Cold Harbor, wants me. I shall thank him in the morning and I shall decline. I have been a soldier four years. I should like to be a man now." },
      { kind: "tragic",  text: "Tom Wheeler's brother — the one in the 21st Virginia, whom Tom had not spoken to in two years over politics — was in the rebel line opposite us at the stacking of arms. I did not at first recognize him. He had Tom's face, only thinner, and twenty years older. I went up to him after the ranks were dismissed. I told him who I was. I told him that I had been at Tom's side at Gettysburg and that I had carried him out of the field and buried him. The brother stood very still and listened. He had not known. He had heard nothing in two and a half years. He embraced me then, on the road in front of both armies, and we wept like children, and the men around us looked away because they understood. Both their fathers are dead. Their mother does not yet know about Tom. He is going home to tell her. I gave him the watch." },
      { kind: "good",    text: "Doctor Frye, the little chaplain, who I had believed killed at Petersburg in the autumn — Doctor Frye, it turns out, is not dead. He was wounded badly and sent home and is recovered, and he has come down to the army at Appomattox as a sutler for the Christian Commission, to bring coffee and bibles and tobacco to the boys at the end. He found me at the wagon park this morning. He embraced me. He said, my boy, I had thought you long dead, and I confess I prayed for your soul, and I am very glad to find my prayers were misdirected. We laughed until I cried. I told him about Tom Wheeler at Gettysburg. He sat down with me on the tongue of a wagon and we prayed for Tom, and for Asahel, and for Cobb, and for Doyle, and for every man we could name, and at the end he put his hand on my head as he had done on the eve of Antietam, and said the same words. I have been a long time getting back to that little church in the woods. But here I am. I am here." },
    ],
  },
];

function SoldierStoryRunner({ profile, onClose, onGrant }) {
  const [pickId, setPickId] = C_s(null);
  const [stage, setStage] = C_s(0); // 0=intro,1..N=chapters typed, last=ending
  const [typed, setTyped] = C_s("");
  const [endingIdx, setEndingIdx] = C_s(null);
  const story = pickId ? SOLDIER_STORIES.find(s => s.id === pickId) : null;
  const chapter = story ? (stage === 0 ? story.intro : (stage <= story.chapters.length ? story.chapters[stage - 1] : null)) : null;
  const atEnding = story && stage > story.chapters.length;

  C_e(() => { setTyped(""); }, [stage, pickId]);

  function next() {
    if (!chapter) return;
    if (typed.length < chapter.length) return;
    // If we are about to enter the ending stage, pick the ending NOW so render is never blank.
    if (stage >= story.chapters.length) {
      setEndingIdx(Math.floor(Math.random() * story.endings.length));
    }
    setStage(s => s + 1);
  }

  if (!story) {
    return (
      <div className="trail-modal-bg" onClick={onClose}>
        <div className="trail-modal" style={{maxWidth:780, width:"94%"}} onClick={e => e.stopPropagation()}>
          <div className="eyebrow" style={{textAlign:"center", marginBottom:6}}>★ LETTERS FROM THE SOLDIER ★</div>
          <h2 style={{textAlign:"center", margin:"0 0 6px", fontFamily:"var(--f-display)", letterSpacing:"0.06em"}}>Type a Chapter of Your War</h2>
          <p style={{textAlign:"center", fontFamily:"var(--f-serif)", fontStyle:"italic", color:"var(--sepia)", margin:"0 0 18px"}}>Each story branches at the last page — your ending is decided by fate.</p>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14}}>
            {SOLDIER_STORIES.map(s => (
              <button key={s.id} onClick={() => { setPickId(s.id); setStage(0); setEndingIdx(null); }}
                style={{textAlign:"left", padding:"16px 18px", background:"var(--parchment-light)", border:"2px solid var(--sepia)", boxShadow:"0 3px 0 var(--sepia)", cursor:"pointer"}}>
                <div style={{fontFamily:"var(--f-display)", fontWeight:700, fontSize:14, letterSpacing:"0.1em", color:"var(--ink)"}}>{s.title}</div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:2}}>
                  <span style={{fontFamily:"var(--f-serif)", fontStyle:"italic", fontSize:12, color:"var(--sepia)"}}>{s.date}</span>
                  <span style={{fontFamily:"var(--f-display)", fontSize:9, letterSpacing:"0.18em", color:"var(--crimson)"}}>★ {s.reading || ""}</span>
                </div>
                <div style={{fontFamily:"var(--f-serif)", fontSize:13, color:"var(--ink-soft)", marginTop:10, lineHeight:1.5}}>{s.intro.slice(0, 180)}…</div>
                <div style={{marginTop:10, display:"flex", gap:4, alignItems:"center"}}>
                  {s.endings.map((e, i) => <span key={i} style={{width:8, height:8, borderRadius:"50%",
                    background: e.kind==="good"?"#6a8a4a":e.kind==="tragic"?"#a83a2a":e.kind==="fateful"?"#c8a35b":"#8a7a5a"}}/>)}
                  <span style={{marginLeft:6, fontFamily:"var(--f-display)", fontSize:9, letterSpacing:"0.15em", color:"var(--sepia)"}}>{s.endings.length} POSSIBLE ENDINGS ★ {s.chapters.length + 1} PAGES</span>
                </div>
              </button>
            ))}
          </div>
          <div style={{textAlign:"center", marginTop:18}}>
            <button className="d-btn" onClick={onClose}>CLOSE</button>
          </div>
        </div>
      </div>
    );
  }

  if (atEnding) {
    const safeIdx = endingIdx != null ? endingIdx : 0;
    const ending = story.endings[safeIdx];
    const reward = { good: 600, neutral: 450, tragic: 700, fateful: 800 }[ending.kind];
    const kindLabel = { good: "A GOOD DAY", neutral: "AN ORDINARY DAY", tragic: "A TRAGIC TURN", fateful: "A TURN OF FATE" }[ending.kind];
    const kindColor = { good:"#6a8a4a", neutral:"#8a7a5a", tragic:"#a83a2a", fateful:"#c8a35b" }[ending.kind];
    return (
      <div className="trail-modal-bg" onClick={() => {}}>
        <div className="trail-modal" style={{maxWidth:780, width:"94%"}} onClick={e => e.stopPropagation()}>
          <div className="eyebrow" style={{textAlign:"center", color:kindColor, fontFamily:"var(--f-display)", letterSpacing:"0.25em", fontSize:12, marginBottom:6}}>★ {kindLabel} ★</div>
          <h2 style={{textAlign:"center", margin:"0 0 14px", fontFamily:"var(--f-display)", letterSpacing:"0.06em"}}>{story.title}</h2>
          <div style={{background:"var(--parchment-light)", border:`2px solid ${kindColor}`, padding:"22px 26px", fontFamily:"var(--f-serif)", fontStyle:"italic", fontSize:17, lineHeight:1.7, color:"var(--ink)", boxShadow:"inset 0 0 0 1px var(--parchment-light)"}}>
            <span style={{fontFamily:"Cinzel, serif", fontSize:32, color:kindColor, verticalAlign:"-8px"}}>"</span>
            {ending.text}
            <span style={{fontFamily:"Cinzel, serif", fontSize:32, color:kindColor, verticalAlign:"-8px"}}>"</span>
            <div style={{textAlign:"right", marginTop:14, fontStyle:"normal", fontFamily:"var(--f-display)", fontSize:11, letterSpacing:"0.18em", color:"var(--sepia)"}}>
              — {profile.name.toUpperCase()}, {story.date.toUpperCase()}
            </div>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", marginTop:18, alignItems:"center"}}>
            <span style={{fontFamily:"var(--f-display)", fontSize:11, letterSpacing:"0.16em", color:"var(--crimson)"}}>JOURNAL REWARD: +{fmt(reward)}¢</span>
            <div style={{display:"flex", gap:10}}>
              <button className="d-btn" onClick={() => { onGrant({ coins: reward, xp: 200, label: story.title }); setPickId(null); setStage(0); setEndingIdx(null); }}>ANOTHER STORY</button>
              <button className="d-btn primary" onClick={() => { onGrant({ coins: reward, xp: 200, label: story.title }); onClose(); }}>★ SEAL THIS PAGE</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Typing a chapter
  const pct = chapter ? Math.round((typed.length / chapter.length) * 100) : 0;
  return (
    <div className="trail-modal-bg" onClick={() => {}}>
      <div className="trail-modal" style={{maxWidth:1080, width:"96%", maxHeight:"92vh", display:"flex", flexDirection:"column"}} onClick={e => e.stopPropagation()}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
          <span className="eyebrow" style={{fontFamily:"var(--f-display)", letterSpacing:"0.2em", fontSize:12, color:"var(--crimson)"}}>★ {story.title.toUpperCase()} ★ {story.date.toUpperCase()}</span>
          <span style={{fontFamily:"var(--f-display)", fontSize:11, letterSpacing:"0.18em", color:"var(--sepia)"}}>{stage === 0 ? "PROLOGUE" : `CHAPTER ${stage} OF ${story.chapters.length}`} ★ {pct}%</span>
        </div>
        <div style={{height:4, background:"var(--sepia-dim)", marginBottom:10, position:"relative"}}>
          <div style={{position:"absolute", left:0, top:0, bottom:0, width:`${pct}%`, background:"linear-gradient(90deg, var(--crimson), var(--brass-bright))", transition:"width 0.1s"}}/>
        </div>
        <div style={{flex:1, overflowY:"auto", background:"var(--parchment-light)", border:"1px solid var(--sepia)", boxShadow:"inset 0 0 0 2px var(--parchment-light), inset 0 0 0 3px var(--sepia-dim)", padding:"28px 36px", margin:"0 0 14px", fontFamily:"\"Courier Prime\", monospace", fontSize:18, lineHeight:1.9, color:"var(--ink)", minHeight:280}}>
          {chapter.split("").map((c, i) => {
            const t = typed[i]; const cls = t == null ? "" : (t === c ? "ok" : "bad"); const cur = i === typed.length ? "cur" : "";
            return <span key={i} className={`dt-ch ${cls} ${cur}`}>{c}</span>;
          })}
        </div>
        <input autoFocus value={typed} onChange={e => setTyped(e.target.value.slice(0, chapter.length))}
          className="dt-input"
          onPaste={e => e.preventDefault()} onCopy={e => e.preventDefault()} onCut={e => e.preventDefault()}
          onDrop={e => e.preventDefault()} onContextMenu={e => e.preventDefault()}
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          placeholder="Write in the soldier's hand — verbatim — no paste —"/>
        <div style={{display:"flex", justifyContent:"space-between", marginTop:12}}>
          <button className="d-btn" onClick={onClose}>SET ASIDE THE PEN</button>
          <button className="d-btn primary" disabled={typed.length < chapter.length} onClick={next}>
            {stage >= story.chapters.length ? "★ TURN THE LAST PAGE" : "▸ NEXT PAGE"}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CampScreen, TelegraphTicker, Quartermaster, NPCS, TRAIL_EVENTS, SoldierPortrait, CharacterCustomizer, SoldierStoryRunner, SOLDIER_STORIES });
