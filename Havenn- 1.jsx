import React, { useState, useEffect, useRef } from "react";
import {
  Wind, CloudMoon, Baby, Heart, Flame, Sun, Feather, Flower2,
  VenetianMask, Sprout, ArrowLeft, Plus, X, Send, HeartHandshake,
  MessageCircle, LifeBuoy, Lock, ShieldCheck, ChevronRight, Check, Mail, Phone,
} from "lucide-react";

/* ---------- design tokens ---------- */
const C = {
  bg: "#F7F4EE",
  card: "#FFFFFF",
  ink: "#2E2B27",
  muted: "#857E73",
  faint: "#ECE7DD",
  brand: "#3F6B5C",
  brandSoft: "#E3EDE8",
  accent: "#D9876C",
};

const GROUPS = [
  { id: "anxiety",  name: "Anxiety & Stress",        Icon: Wind,         bg: "#ECE9F6", fg: "#6B5FA8", line: "A place to set down the racing thoughts." },
  { id: "depress",  name: "Depression Support",       Icon: CloudMoon,    bg: "#E4EAF1", fg: "#4E6E8E", line: "For the heavy days, and the people who get it." },
  { id: "parent",   name: "Motherhood & Parenting",   Icon: Baby,         bg: "#FBEAE0", fg: "#C2755A", line: "Raising little humans, holding yourself together." },
  { id: "relate",   name: "Relationships & Family",   Icon: Heart,        bg: "#F8E6EA", fg: "#B85C72", line: "The people closest to us are rarely simple." },
  { id: "burnout",  name: "Workplace Burnout",        Icon: Flame,        bg: "#FCEEDD", fg: "#C2853E", line: "When work has taken more than it gave back." },
  { id: "esteem",   name: "Self-Esteem & Confidence", Icon: Sun,          bg: "#FBF3DA", fg: "#A07C25", line: "Learning to be kinder to the person in the mirror." },
  { id: "grief",    name: "Grief & Loss",             Icon: Feather,      bg: "#E7EEE7", fg: "#5F7E63", line: "Carry what you've lost, alongside others who understand." },
  { id: "mindful",  name: "Mindfulness & Wellness",   Icon: Flower2,      bg: "#E0F0EC", fg: "#3F8475", line: "Small practices for steadier days." },
  { id: "vent",     name: "Anonymous Venting",        Icon: VenetianMask, bg: "#E9EBEF", fg: "#5B6472", line: "Say it without your name attached. No advice unless asked." },
  { id: "success",  name: "Success Stories & Recovery", Icon: Sprout,     bg: "#E5F2E2", fg: "#4E8E4A", line: "Proof that things can, and do, get lighter." },
];

const uid = () => Math.random().toString(36).slice(2, 9);

/* ---------- brand logo ---------- */
function HavennLogo({ size = 96 }) {
  return (
    <svg width={size} height={size * 1.06} viewBox="0 0 200 212" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <defs>
        <linearGradient id="hvHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#74AC9C" />
          <stop offset="1" stopColor="#5C9082" />
        </linearGradient>
      </defs>
      <path fill="url(#hvHead)" fillRule="evenodd" d="M100 44 C142 44 166 72 164 106 C163 124 156 134 156 150 L156 186 C156 196 150 200 142 200 L108 200 C101 200 98 195 99 188 C101 174 104 166 101 158 C99 152 92 154 90 147 C88 141 80 142 82 134 C84 128 74 128 78 120 C81 114 66 114 70 105 C73 99 84 98 86 92 C88 80 84 60 100 44 Z M104 74 C120 64 150 68 152 94 C153 113 144 126 129 128 C140 116 141 97 131 86 C121 75 108 77 102 86 C99 81 100 78 104 74 Z" />
      <path d="M118 150 C116 124 116 104 116 84" stroke="#6FB6A0" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M116 120 C102 114 92 118 89 109 C100 106 111 111 116 120 Z" fill="#7DBFA8" />
      <path d="M116 110 C130 104 140 108 143 99 C132 96 121 101 116 110 Z" fill="#88C6AF" />
      <path d="M117 136 C105 131 96 134 93 126 C103 123 112 128 117 136 Z" fill="#7DBFA8" />
      <g fill="#CCC5E7">
        {[-80, -53, -27, 0, 27, 53, 80].map((a) => (
          <g key={a} transform={`translate(116,72) rotate(${a}) scale(1.16)`}><path d="M0 0 C-9 -16 -8 -38 0 -44 C8 -38 9 -16 0 0 Z" /></g>
        ))}
      </g>
      <g fill="#B3A7DC">
        {[-54, -28, 28, 54].map((a) => (
          <g key={a} transform={`translate(116,70) rotate(${a}) scale(0.95)`}><path d="M0 0 C-9 -16 -8 -38 0 -44 C8 -38 9 -16 0 0 Z" /></g>
        ))}
      </g>
      <g fill="#9A8CCB">
        <g transform="translate(116,69) scale(1.02)"><path d="M0 0 C-9 -16 -8 -38 0 -44 C8 -38 9 -16 0 0 Z" /></g>
      </g>
    </svg>
  );
}

const SEED = {
  anxiety: [
    { id: uid(), author: "Riya", anon: false, body: "Big presentation tomorrow and my chest has been tight all evening. Just naming it here so it stops rattling around in my head.", time: "2h", support: 14, supported: false, replies: [
      { id: uid(), author: "Sam", anon: false, body: "The fact that you care this much means you're prepared. Wishing you a steady morning.", time: "1h" },
    ]},
    { id: uid(), author: "Anonymous", anon: true, body: "Anyone else's anxiety worst in the quiet right before sleep? Looking for things that help.", time: "5h", support: 9, supported: false, replies: [] },
  ],
  depress: [
    { id: uid(), author: "Anonymous", anon: true, body: "Managed to shower and eat one real meal today. Doesn't sound like much but it's more than yesterday.", time: "3h", support: 31, supported: false, replies: [
      { id: uid(), author: "Dev", anon: false, body: "That is genuinely a lot on a heavy day. Counting it with you.", time: "2h" },
    ]},
  ],
  parent: [
    { id: uid(), author: "Meera", anon: false, body: "Lost my patience with my toddler and felt awful after. Reminding myself a good parent is one who notices and tries again.", time: "1h", support: 22, supported: false, replies: [] },
  ],
  relate: [
    { id: uid(), author: "Anonymous", anon: true, body: "How do you set a boundary with a parent who takes it personally every single time?", time: "6h", support: 7, supported: false, replies: [] },
  ],
  burnout: [
    { id: uid(), author: "Kabir", anon: false, body: "Took my first real day off in months. Felt guilty for about an hour, then slept for three. Recommend.", time: "4h", support: 18, supported: false, replies: [] },
  ],
  esteem: [
    { id: uid(), author: "Anonymous", anon: true, body: "Trying to talk to myself the way I'd talk to a friend. It feels fake right now but I'm sticking with it.", time: "2h", support: 12, supported: false, replies: [] },
  ],
  grief: [
    { id: uid(), author: "Tara", anon: false, body: "It's been a year today. Lit a candle and made her recipe. Some grief doesn't shrink, you just grow around it.", time: "8h", support: 27, supported: false, replies: [
      { id: uid(), author: "Anonymous", anon: true, body: "Thank you for sharing her with us today. Sitting with you.", time: "7h" },
    ]},
  ],
  mindful: [
    { id: uid(), author: "Jonah", anon: false, body: "Tip that's working for me: one slow breath before I unlock my phone in the morning. Small, but it changes the start of the day.", time: "3h", support: 16, supported: false, replies: [] },
  ],
  vent: [
    { id: uid(), author: "Anonymous", anon: true, body: "I'm so tired of pretending I'm fine at work when everything outside it is falling apart. That's it. That's the post.", time: "1h", support: 24, supported: false, replies: [] },
  ],
  success: [
    { id: uid(), author: "Aisha", anon: false, body: "One year ago I could barely leave the house. Today I went to a friend's wedding and actually danced. To anyone in the thick of it: keep going.", time: "5h", support: 58, supported: false, replies: [
      { id: uid(), author: "Anonymous", anon: true, body: "Saving this for the days I need to believe it. Thank you.", time: "4h" },
    ]},
  ],
};

const MOODS = [
  { k: "heavy",   label: "Heavy" },
  { k: "anxious", label: "Anxious" },
  { k: "okay",    label: "Okay" },
  { k: "hopeful", label: "Hopeful" },
  { k: "numb",    label: "Numb" },
];

export default function Haven() {
  const [view, setView] = useState("home");      // home | group | thread
  const [gid, setGid] = useState(null);
  const [tid, setTid] = useState(null);
  const [posts, setPosts] = useState(SEED);
  const [mood, setMood] = useState(null);
  const [showSafety, setShowSafety] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [anonDefault, setAnonDefault] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [displayName, setDisplayName] = useState("You");
  const [profile, setProfile] = useState(null);

  const group = GROUPS.find((g) => g.id === gid);
  const thread = group ? posts[gid].find((p) => p.id === tid) : null;

  const openGroup = (id) => { setGid(id); setView("group"); };
  const openThread = (id) => { setTid(id); setView("thread"); };

  const toggleSupport = (groupId, postId) => {
    setPosts((prev) => ({
      ...prev,
      [groupId]: prev[groupId].map((p) =>
        p.id === postId
          ? { ...p, supported: !p.supported, support: p.support + (p.supported ? -1 : 1) }
          : p
      ),
    }));
  };

  const addPost = (groupId, body, anon) => {
    const post = { id: uid(), author: anon ? "Anonymous" : displayName, anon, body, time: "just now", support: 0, supported: false, replies: [] };
    setPosts((prev) => ({ ...prev, [groupId]: [post, ...prev[groupId]] }));
  };

  const addReply = (groupId, postId, body, anon) => {
    const reply = { id: uid(), author: anon ? "Anonymous" : displayName, anon, body, time: "just now" };
    setPosts((prev) => ({
      ...prev,
      [groupId]: prev[groupId].map((p) =>
        p.id === postId ? { ...p, replies: [...p.replies, reply] } : p
      ),
    }));
  };

  return (
    <div style={{ background: "#EDE8DF", minHeight: "100vh", display: "flex", justifyContent: "center", padding: "20px 12px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .fd { font-family: 'Fraunces', Georgia, serif; }
        .pulse { animation: pulse 3.4s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { transform: scale(1); opacity:.55 } 50% { transform: scale(1.7); opacity:0 } }
        .rise { animation: rise .35s ease both; }
        @keyframes rise { from { opacity:0; transform: translateY(8px) } to { opacity:1; transform:none } }
        .sheet { animation: up .3s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes up { from { transform: translateY(100%) } to { transform: none } }
        @media (prefers-reduced-motion: reduce) { .pulse,.rise,.sheet { animation: none !important } }
        textarea:focus, button:focus-visible { outline: 2px solid ${C.brand}; outline-offset: 2px; }
        ::-webkit-scrollbar { width: 0 }
      `}</style>

      <div style={{ width: "100%", maxWidth: 430, background: C.bg, borderRadius: 30, overflow: "hidden", boxShadow: "0 24px 60px -20px rgba(46,43,39,.35)", display: "flex", flexDirection: "column", position: "relative", minHeight: 760 }}>

        {!started && <Splash onEnter={() => setStarted(true)} onGuide={() => setShowGuide(true)} />}

        {started && !onboarded && !profile && <Onboarding onBack={() => setStarted(false)} onGuide={() => setShowGuide(true)} onDone={(p) => { setDisplayName(p.name.trim() || "Friend"); setAnonDefault(p.anon); setProfile(p); }} />}

        {started && !onboarded && profile && <AccountSetup onBack={() => setProfile(null)} onGuide={() => setShowGuide(true)} onDone={() => setOnboarded(true)} />}

        {/* header */}
        <header style={{ padding: "18px 20px 14px", background: C.bg, borderBottom: `1px solid ${C.faint}`, position: "sticky", top: 0, zIndex: 20 }}>
          {view === "home" ? (
            <div className="flex items-center justify-between">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <HavennLogo size={34} />
                <div>
                  <div className="fd" style={{ fontSize: 24, fontWeight: 600, color: C.brand, letterSpacing: "-.5px", lineHeight: 1 }}>Havenn</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}>Mind &amp; Wellness</div>
                </div>
              </div>
              <button onClick={() => setShowIdentity(true)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: anonDefault ? "#5B6472" : C.brand, background: anonDefault ? "#E9EBEF" : C.brandSoft, border: "none", padding: "7px 11px", borderRadius: 999, cursor: "pointer", fontWeight: 600 }}>
                {anonDefault ? <VenetianMask size={14} /> : <ShieldCheck size={14} />}
                {anonDefault ? "Anonymous" : `Posting as ${displayName}`}
              </button>
            </div>
          ) : (
            <button onClick={() => setView(view === "thread" ? "group" : "home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: C.ink, padding: 0 }}>
              <ArrowLeft size={20} />
              <span className="fd" style={{ fontSize: 18, fontWeight: 600 }}>{view === "thread" ? "Conversation" : group?.name}</span>
            </button>
          )}
        </header>

        {/* body */}
        <main style={{ flex: 1, overflowY: "auto", paddingBottom: 96 }}>
          {view === "home" && <Home mood={mood} setMood={setMood} openGroup={openGroup} posts={posts} />}
          {view === "group" && <GroupFeed group={group} list={posts[gid]} openThread={openThread} toggleSupport={toggleSupport} onCompose={() => setComposeOpen(true)} />}
          {view === "thread" && <Thread group={group} post={thread} anonDefault={anonDefault} displayName={displayName} toggleSupport={toggleSupport} onReply={(b, a) => addReply(gid, tid, b, a)} />}
        </main>

        {/* lifeline bar */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 16px 16px", background: "linear-gradient(to top, " + C.bg + " 70%, transparent)", zIndex: 30 }}>
          <button onClick={() => setShowSafety(true)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: C.brand, color: "#fff", border: "none", padding: "14px", borderRadius: 18, fontSize: 14.5, fontWeight: 600, cursor: "pointer", boxShadow: "0 10px 24px -8px rgba(63,107,92,.6)" }}>
            <span style={{ position: "relative", display: "inline-flex" }}>
              <span className="pulse" style={{ position: "absolute", inset: 0, borderRadius: 999, background: "#fff" }} />
              <LifeBuoy size={18} style={{ position: "relative" }} />
            </span>
            Need support right now
          </button>
        </div>

        {/* compose sheet */}
        {composeOpen && <Compose group={group} anonDefault={anonDefault} displayName={displayName} onClose={() => setComposeOpen(false)} onSubmit={(b, a) => { addPost(gid, b, a); setComposeOpen(false); }} />}

        {/* modals */}
        {showSafety && <Safety onClose={() => setShowSafety(false)} />}
        {showGuide && <Guidelines onClose={() => setShowGuide(false)} />}
        {showIdentity && <Identity anonDefault={anonDefault} setAnonDefault={setAnonDefault} displayName={displayName} onGuide={() => { setShowIdentity(false); setShowGuide(true); }} onClose={() => setShowIdentity(false)} />}
      </div>
    </div>
  );
}

/* ---------- home ---------- */
function Home({ mood, setMood, openGroup, posts }) {
  return (
    <div style={{ padding: "20px 18px 8px" }}>
      <div className="rise">
        <h2 className="fd" style={{ fontSize: 22, fontWeight: 500, color: C.ink, lineHeight: 1.25 }}>How are you arriving today?</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {MOODS.map((m) => {
            const on = mood === m.k;
            return (
              <button key={m.k} onClick={() => setMood(on ? null : m.k)} style={{ fontSize: 13, padding: "8px 14px", borderRadius: 999, cursor: "pointer", border: `1px solid ${on ? C.brand : C.faint}`, background: on ? C.brand : C.card, color: on ? "#fff" : C.ink, fontWeight: 500, transition: "all .15s" }}>
                {m.label}
              </button>
            );
          })}
        </div>
        {mood && (
          <p className="rise" style={{ fontSize: 13, color: C.muted, marginTop: 12, lineHeight: 1.5, background: C.brandSoft, padding: "11px 14px", borderRadius: 14 }}>
            Thank you for naming it. Whatever you're carrying, there's a space below where people understand. No need to be okay first.
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "24px 2px 12px" }}>
        <h3 style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".7px" }}>Spaces to land in</h3>
        <span style={{ fontSize: 12, color: C.muted }}>{GROUPS.length} groups</span>
      </div>

      <div style={{ display: "grid", gap: 11 }}>
        {GROUPS.map((g) => {
          const count = posts[g.id].length;
          return (
            <button key={g.id} onClick={() => openGroup(g.id)} className="rise" style={{ display: "flex", alignItems: "center", gap: 13, textAlign: "left", background: C.card, border: `1px solid ${C.faint}`, borderRadius: 20, padding: "13px 14px", cursor: "pointer" }}>
              <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 14, background: g.bg, color: g.fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <g.Icon size={22} strokeWidth={1.9} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: C.ink }}>{g.name}</span>
                <span style={{ display: "block", fontSize: 12.5, color: C.muted, marginTop: 2, lineHeight: 1.35 }}>{g.line}</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 2, color: C.muted, flexShrink: 0 }}>
                <span style={{ fontSize: 12 }}>{count}</span>
                <ChevronRight size={16} />
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: "center", padding: "22px 0 6px" }}>
        <div className="fd" style={{ fontSize: 15, fontWeight: 600, color: C.brand }}>Havenn</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>havenn.in · you're welcome here, as you are</div>
      </div>
    </div>
  );
}

/* ---------- splash ---------- */
function Splash({ onEnter, onGuide }) {
  return (
    <div className="rise" style={{ position: "absolute", inset: 0, zIndex: 70, background: "linear-gradient(165deg, #EAF1EC 0%, " + C.bg + " 46%, #FBEFE7 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px", textAlign: "center" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
        <span className="pulse" style={{ position: "absolute", width: 96, height: 96, borderRadius: 999, background: C.brand, opacity: .25 }} />
        <span style={{ position: "relative", width: 124, height: 124, borderRadius: 30, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 36px -12px rgba(63,107,92,.45)" }}>
          <HavennLogo size={92} />
        </span>
      </div>

      <h1 className="fd" style={{ fontSize: 40, fontWeight: 600, color: C.brand, letterSpacing: "-1px", lineHeight: 1 }}>Havenn</h1>
      <p className="fd" style={{ fontSize: 15, fontStyle: "italic", color: "#5BA39A", marginTop: 4 }}>Mind &amp; Wellness</p>
      <p style={{ fontSize: 12, color: C.muted, marginTop: 6, letterSpacing: ".5px" }}>havenn.in</p>

      <p style={{ fontSize: 15.5, color: "#4a463f", lineHeight: 1.55, marginTop: 22, maxWidth: 300 }}>
        A gentler place to be heard. Find a space for what you're carrying, and people who quietly understand.
      </p>

      <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
        <Badge text="Anonymous when you want" />
        <Badge text="Always free" />
      </div>

      <button onClick={onEnter} style={{ marginTop: 30, width: "100%", maxWidth: 300, background: C.brand, color: "#fff", border: "none", borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 12px 26px -10px rgba(63,107,92,.6)" }}>
        Come in
      </button>
      <button onClick={onGuide} style={{ marginTop: 12, background: "none", border: "none", color: C.brand, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
        How we keep this safe
      </button>

      <p style={{ fontSize: 11, color: C.muted, marginTop: 26, lineHeight: 1.5, maxWidth: 280 }}>
        Peer support, not a substitute for professional care or crisis services.
      </p>
    </div>
  );
}
function Badge({ text }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.brand, fontWeight: 500 }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: C.accent }} /> {text}
    </span>
  );
}

/* ---------- onboarding ---------- */
const AGES = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"];
const SEXES = ["Female", "Male", "Non-binary", "Prefer not to say"];
const GOALS = [
  "A space to vent",
  "People who understand",
  "Daily support & check-ins",
  "Coping tools & techniques",
  "To share my story",
  "Just to read for now",
];
const STEPS = ["You", "Age", "About you", "Your why"];

function Onboarding({ onBack, onGuide, onDone }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [anon, setAnon] = useState(false);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [goals, setGoals] = useState([]);

  const toggleGoal = (g) => setGoals((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));
  const canNext = [name.trim().length > 0, !!age, !!sex, goals.length > 0][step];
  const last = step === 3;
  const next = () => (last ? onDone({ name, anon, age, sex, goals }) : setStep(step + 1));
  const back = () => (step === 0 ? onBack() : setStep(step - 1));

  return (
    <div className="rise" style={{ position: "absolute", inset: 0, zIndex: 65, background: C.bg, display: "flex", flexDirection: "column" }}>
      {/* top: back + progress */}
      <div style={{ padding: "18px 20px 6px" }}>
        <button onClick={back} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.ink, cursor: "pointer", padding: 0, fontSize: 13.5 }}>
          <ArrowLeft size={18} /> Back
        </button>
        <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
          {STEPS.map((_, i) => (
            <span key={i} style={{ flex: 1, height: 5, borderRadius: 999, background: i <= step ? C.brand : C.faint, transition: "background .25s" }} />
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: ".5px", marginTop: 10, textTransform: "uppercase" }}>About you · {step + 1} of 4</div>
      </div>

      {/* content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 16px" }}>
        {step === 0 && (
          <div className="rise">
            <h2 className="fd" style={{ fontSize: 23, fontWeight: 500, color: C.ink, lineHeight: 1.25 }}>What should we call you?</h2>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="First name or a nickname" style={{ width: "100%", marginTop: 16, background: C.card, border: `1.5px solid ${C.faint}`, borderRadius: 14, padding: "14px 15px", fontSize: 15.5, color: C.ink, fontFamily: "inherit" }} />
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <ChoicePill active={!anon} onClick={() => setAnon(false)} icon={<ShieldCheck size={16} />} label="Show my name" />
              <ChoicePill active={anon} onClick={() => setAnon(true)} icon={<VenetianMask size={16} />} label="Stay anonymous" />
            </div>
            <p style={{ fontSize: 12.5, color: C.muted, marginTop: 12, lineHeight: 1.5, background: anon ? "#E9EBEF" : C.brandSoft, padding: "11px 13px", borderRadius: 12 }}>
              {anon
                ? "We'll keep this as a private nickname. Your posts and replies will show only “Anonymous”."
                : "This is the name other members will see on what you share. You can switch to anonymous anytime."}
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="rise">
            <h2 className="fd" style={{ fontSize: 23, fontWeight: 500, color: C.ink, lineHeight: 1.25 }}>How old are you?</h2>
            <p style={{ fontSize: 13.5, color: C.muted, marginTop: 6 }}>This helps us point you to the right kind of support.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
              {AGES.map((a) => <SelectCard key={a} active={age === a} onClick={() => setAge(a)} label={a} />)}
            </div>
            {age === "Under 18" && (
              <p className="rise" style={{ fontSize: 12.5, color: "#4a463f", marginTop: 14, lineHeight: 1.5, background: "#FBEFE7", padding: "12px 13px", borderRadius: 12 }}>
                You're welcome here. We'll show you youth-friendly spaces and resources made for under-18s, and keep things extra safe for you.
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="rise">
            <h2 className="fd" style={{ fontSize: 23, fontWeight: 500, color: C.ink, lineHeight: 1.25 }}>Which best describes you?</h2>
            <p style={{ fontSize: 13.5, color: C.muted, marginTop: 6 }}>Entirely up to you — “prefer not to say” is always fine.</p>
            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              {SEXES.map((s) => <SelectCard key={s} wide active={sex === s} onClick={() => setSex(s)} label={s} />)}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="rise">
            <h2 className="fd" style={{ fontSize: 23, fontWeight: 500, color: C.ink, lineHeight: 1.25 }}>What are you hoping to find here?</h2>
            <p style={{ fontSize: 13.5, color: C.muted, marginTop: 6 }}>Pick as many as feel true.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 16 }}>
              {GOALS.map((g) => {
                const on = goals.includes(g);
                return (
                  <button key={g} onClick={() => toggleGoal(g)} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, padding: "10px 14px", borderRadius: 999, cursor: "pointer", border: `1.5px solid ${on ? C.brand : C.faint}`, background: on ? C.brand : C.card, color: on ? "#fff" : C.ink, fontWeight: 500 }}>
                    {on && <Check size={14} />} {g}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* footer */}
      <div style={{ padding: "10px 20px 20px", borderTop: `1px solid ${C.faint}` }}>
        <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 12 }}>
          <Lock size={12} style={{ marginTop: 1, flexShrink: 0 }} /> These details stay private, help tailor your support, and never appear on your posts. <button onClick={onGuide} style={{ background: "none", border: "none", color: C.brand, fontWeight: 600, cursor: "pointer", padding: 0, fontSize: 11 }}>Care rules</button>
        </p>
        <button onClick={next} disabled={!canNext} style={{ width: "100%", background: canNext ? C.brand : C.faint, color: canNext ? "#fff" : C.muted, border: "none", borderRadius: 15, padding: 15, fontSize: 15, fontWeight: 600, cursor: canNext ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {last ? "Continue" : "Continue"} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function ChoicePill({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 8px", borderRadius: 13, cursor: "pointer", border: `1.5px solid ${active ? C.brand : C.faint}`, background: active ? C.brandSoft : C.card, color: active ? C.brand : C.muted, fontSize: 13.5, fontWeight: 600 }}>
      {icon} {label}
    </button>
  );
}

function SelectCard({ active, onClick, label, wide }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: wide ? "14px 16px" : "15px 14px", borderRadius: 14, cursor: "pointer", border: `1.5px solid ${active ? C.brand : C.faint}`, background: active ? C.brandSoft : C.card, color: C.ink, fontSize: 15, fontWeight: 500 }}>
      {label}
      {active && <span style={{ width: 20, height: 20, borderRadius: 999, background: C.brand, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={13} /></span>}
    </button>
  );
}

/* ---------- account setup (email + phone + otp) ---------- */
const DIAL = ["+91", "+1", "+44", "+65", "+971", "+61"];
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
const validPhone = (p) => p.replace(/\D/g, "").length >= 8;

function AccountSetup({ onBack, onGuide, onDone }) {
  const [phase, setPhase] = useState("details"); // details | verify
  const [email, setEmail] = useState("");
  const [dial, setDial] = useState("+91");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");          // the "sent" code
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [secs, setSecs] = useState(0);
  const boxes = useRef([]);

  const detailsOk = validEmail(email) && validPhone(phone);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const sendCode = () => {
    const c = String(Math.floor(100000 + Math.random() * 900000));
    setCode(c);
    setDigits(["", "", "", "", "", ""]);
    setError("");
    setSecs(30);
    setPhase("verify");
    setTimeout(() => boxes.current[0]?.focus(), 60);
  };

  const setDigit = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const d = [...digits];
    d[i] = v;
    setDigits(d);
    setError("");
    if (v && i < 5) boxes.current[i + 1]?.focus();
  };
  const onKey = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) boxes.current[i - 1]?.focus();
  };
  const onPaste = (e) => {
    const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (t) { e.preventDefault(); const d = t.split(""); while (d.length < 6) d.push(""); setDigits(d); boxes.current[Math.min(t.length, 5)]?.focus(); }
  };

  const entered = digits.join("");
  const verify = () => {
    if (entered.length < 6) return;
    if (entered === code) onDone();
    else setError("That code doesn't match. Check it and try again.");
  };

  return (
    <div className="rise" style={{ position: "absolute", inset: 0, zIndex: 66, background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 6px" }}>
        <button onClick={phase === "verify" ? () => setPhase("details") : onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.ink, cursor: "pointer", padding: 0, fontSize: 13.5 }}>
          <ArrowLeft size={18} /> Back
        </button>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: ".5px", marginTop: 16, textTransform: "uppercase" }}>Final step · create your account</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px 16px" }}>
        {phase === "details" ? (
          <div className="rise">
            <h2 className="fd" style={{ fontSize: 23, fontWeight: 500, color: C.ink, lineHeight: 1.25 }}>Save your space at Havenn</h2>
            <p style={{ fontSize: 13.5, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>So you can come back to it, and so we can keep the community safe. Your contact details are never shown to other members.</p>

            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: C.ink, margin: "20px 2px 7px" }}>Email</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1.5px solid ${C.faint}`, borderRadius: 14, padding: "0 14px" }}>
              <Mail size={17} style={{ color: C.muted, flexShrink: 0 }} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" style={{ flex: 1, border: "none", padding: "14px 0", fontSize: 15.5, color: C.ink, background: "transparent", fontFamily: "inherit" }} />
            </div>

            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: C.ink, margin: "16px 2px 7px" }}>Phone number</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1.5px solid ${C.faint}`, borderRadius: 14, padding: "0 14px" }}>
              <Phone size={17} style={{ color: C.muted, flexShrink: 0 }} />
              <select value={dial} onChange={(e) => setDial(e.target.value)} style={{ border: "none", background: "transparent", fontSize: 15.5, color: C.ink, fontFamily: "inherit", cursor: "pointer", padding: "14px 0" }}>
                {DIAL.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="98765 43210" style={{ flex: 1, border: "none", padding: "14px 0", fontSize: 15.5, color: C.ink, background: "transparent", fontFamily: "inherit" }} />
            </div>

            <p style={{ fontSize: 12, color: C.muted, marginTop: 16, lineHeight: 1.5, display: "flex", gap: 7 }}>
              <Lock size={13} style={{ flexShrink: 0, marginTop: 1, color: C.brand }} /> We'll send a one-time code to confirm it's really you. No password needed.
            </p>
          </div>
        ) : (
          <div className="rise">
            <h2 className="fd" style={{ fontSize: 23, fontWeight: 500, color: C.ink, lineHeight: 1.25 }}>Enter your code</h2>
            <p style={{ fontSize: 13.5, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>
              We sent a 6-digit code to <b style={{ color: C.ink }}>{email}</b> and <b style={{ color: C.ink }}>{dial} {phone}</b>.
            </p>

            <div style={{ display: "flex", gap: 8, marginTop: 20 }} onPaste={onPaste}>
              {digits.map((d, i) => (
                <input key={i} ref={(el) => (boxes.current[i] = el)} value={d} onChange={(e) => setDigit(i, e.target.value)} onKeyDown={(e) => onKey(i, e)} inputMode="numeric" maxLength={1}
                  style={{ flex: 1, minWidth: 0, textAlign: "center", fontSize: 22, fontWeight: 600, color: C.ink, padding: "14px 0", borderRadius: 13, border: `1.5px solid ${error ? "#C2755A" : d ? C.brand : C.faint}`, background: C.card, fontFamily: "inherit" }} />
              ))}
            </div>

            {error && <p className="rise" style={{ fontSize: 12.5, color: "#B85C72", marginTop: 12 }}>{error}</p>}

            <div style={{ background: "#FBF3DA", border: "1px dashed #D9B85C", borderRadius: 12, padding: "11px 13px", marginTop: 16 }}>
              <p style={{ fontSize: 12.5, color: "#7a6320", lineHeight: 1.5 }}>Prototype demo — no real message is sent. Your code is <b style={{ letterSpacing: "2px" }}>{code}</b>.</p>
            </div>

            <div style={{ marginTop: 16, fontSize: 13, color: C.muted }}>
              {secs > 0
                ? <span>Resend code in {secs}s</span>
                : <button onClick={sendCode} style={{ background: "none", border: "none", color: C.brand, fontWeight: 600, cursor: "pointer", padding: 0, fontSize: 13 }}>Resend code</button>}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "10px 20px 20px", borderTop: `1px solid ${C.faint}` }}>
        <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.5, marginBottom: 12, display: "flex", gap: 6 }}>
          <ShieldCheck size={12} style={{ marginTop: 1, flexShrink: 0, color: C.brand }} /> By continuing you agree to our <button onClick={onGuide} style={{ background: "none", border: "none", color: C.brand, fontWeight: 600, cursor: "pointer", padding: 0, fontSize: 11 }}>care rules</button>.
        </p>
        {phase === "details" ? (
          <button onClick={sendCode} disabled={!detailsOk} style={{ width: "100%", background: detailsOk ? C.brand : C.faint, color: detailsOk ? "#fff" : C.muted, border: "none", borderRadius: 15, padding: 15, fontSize: 15, fontWeight: 600, cursor: detailsOk ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            Send verification code <ChevronRight size={18} />
          </button>
        ) : (
          <button onClick={verify} disabled={entered.length < 6} style={{ width: "100%", background: entered.length === 6 ? C.brand : C.faint, color: entered.length === 6 ? "#fff" : C.muted, border: "none", borderRadius: 15, padding: 15, fontSize: 15, fontWeight: 600, cursor: entered.length === 6 ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            Verify & enter Havenn <Sprout size={17} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- group feed ---------- */
function GroupFeed({ group, list, openThread, toggleSupport, onCompose }) {
  return (
    <div style={{ padding: "16px 16px 8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: group.bg, borderRadius: 18, padding: "14px 15px", marginBottom: 16 }}>
        <span style={{ width: 42, height: 42, borderRadius: 12, background: "#ffffffcc", color: group.fg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <group.Icon size={21} strokeWidth={1.9} />
        </span>
        <p style={{ fontSize: 13, color: "#4a463f", lineHeight: 1.4 }}>{group.line}</p>
      </div>

      <button onClick={onCompose} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px dashed ${C.faint}`, borderRadius: 16, padding: "13px 15px", cursor: "pointer", marginBottom: 16, color: C.muted, fontSize: 14 }}>
        <Plus size={18} style={{ color: group.fg }} />
        {group.id === "vent" ? "Let it out — your name stays hidden" : "Share what's on your mind…"}
      </button>

      <div style={{ display: "grid", gap: 12 }}>
        {list.map((p) => (
          <PostCard key={p.id} post={p} group={group} onOpen={() => openThread(p.id)} onSupport={() => toggleSupport(group.id, p.id)} />
        ))}
      </div>
    </div>
  );
}

function Avatar({ post, group }) {
  if (post.anon) {
    return <span style={{ width: 32, height: 32, borderRadius: 999, background: "#E9EBEF", color: "#5B6472", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><VenetianMask size={16} /></span>;
  }
  const letter = post.author.charAt(0).toUpperCase();
  return <span style={{ width: 32, height: 32, borderRadius: 999, background: group.bg, color: group.fg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{letter}</span>;
}

function PostCard({ post, group, onOpen, onSupport }) {
  return (
    <div className="rise" style={{ background: C.card, border: `1px solid ${C.faint}`, borderRadius: 20, padding: "14px 15px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
        <Avatar post={post} group={group} />
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{post.anon ? "Anonymous" : post.author}</div>
          <div style={{ fontSize: 11.5, color: C.muted }}>{post.time} ago</div>
        </div>
      </div>
      <p onClick={onOpen} style={{ fontSize: 14, color: "#3a372f", lineHeight: 1.5, cursor: "pointer" }}>{post.body}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
        <button onClick={onSupport} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, padding: "7px 12px", borderRadius: 999, cursor: "pointer", fontWeight: 500, border: `1px solid ${post.supported ? group.fg : C.faint}`, background: post.supported ? group.bg : "#fff", color: post.supported ? group.fg : C.muted }}>
          <HeartHandshake size={15} /> {post.support}
        </button>
        <button onClick={onOpen} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, padding: "7px 12px", borderRadius: 999, cursor: "pointer", fontWeight: 500, border: `1px solid ${C.faint}`, background: "#fff", color: C.muted }}>
          <MessageCircle size={15} /> {post.replies.length}
        </button>
      </div>
    </div>
  );
}

/* ---------- thread ---------- */
function Thread({ group, post, anonDefault, displayName, toggleSupport, onReply }) {
  const [text, setText] = useState("");
  const [anon, setAnon] = useState(group.id === "vent" || anonDefault);
  const send = () => { if (!text.trim()) return; onReply(text.trim(), anon); setText(""); };

  return (
    <div style={{ padding: "16px 16px 8px" }}>
      <PostCard post={post} group={group} onOpen={() => {}} onSupport={() => toggleSupport(group.id, post.id)} />

      <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".6px", margin: "20px 4px 10px" }}>
        {post.replies.length} {post.replies.length === 1 ? "reply" : "replies"}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {post.replies.map((r) => (
          <div key={r.id} className="rise" style={{ display: "flex", gap: 10, paddingLeft: 4 }}>
            <Avatar post={r} group={group} />
            <div style={{ background: C.card, border: `1px solid ${C.faint}`, borderRadius: 16, padding: "10px 13px", flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink }}>{r.anon ? "Anonymous" : r.author} <span style={{ color: C.muted, fontWeight: 400 }}>· {r.time}</span></div>
              <p style={{ fontSize: 13.5, color: "#3a372f", lineHeight: 1.45, marginTop: 3 }}>{r.body}</p>
            </div>
          </div>
        ))}
        {post.replies.length === 0 && (
          <p style={{ fontSize: 13, color: C.muted, textAlign: "center", padding: "10px 0 4px" }}>No replies yet. A kind word here can matter more than you'd think.</p>
        )}
      </div>

      <div style={{ marginTop: 16, background: C.card, border: `1px solid ${C.faint}`, borderRadius: 18, padding: 12 }}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Offer some support…" rows={2} style={{ width: "100%", border: "none", resize: "none", fontSize: 14, color: C.ink, background: "transparent", fontFamily: "inherit" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <button onClick={() => setAnon(!anon)} disabled={group.id === "vent"} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: anon ? group.fg : C.muted, background: "none", border: "none", cursor: group.id === "vent" ? "default" : "pointer", fontWeight: 500 }}>
            <Lock size={13} /> {anon ? "Anonymous" : `Reply as ${displayName}`}
          </button>
          <button onClick={send} style={{ display: "flex", alignItems: "center", gap: 6, background: C.brand, color: "#fff", border: "none", borderRadius: 12, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Send size={14} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- compose sheet ---------- */
function Compose({ group, anonDefault, displayName, onClose, onSubmit }) {
  const forceAnon = group.id === "vent";
  const [text, setText] = useState("");
  const [anon, setAnon] = useState(forceAnon || anonDefault);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(46,43,39,.4)", display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: C.bg, borderRadius: "26px 26px 0 0", padding: "16px 18px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 className="fd" style={{ fontSize: 18, fontWeight: 600, color: C.ink }}>Share in {group.name}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={20} /></button>
        </div>
        <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder={forceAnon ? "Nobody will see your name. Let it out." : "What would you like to set down here?"} style={{ width: "100%", background: C.card, border: `1px solid ${C.faint}`, borderRadius: 16, padding: 14, fontSize: 14.5, color: C.ink, resize: "none", fontFamily: "inherit", lineHeight: 1.5 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
          <button onClick={() => !forceAnon && setAnon(!anon)} style={{ display: "flex", alignItems: "center", gap: 8, background: anon ? C.brandSoft : C.card, border: `1px solid ${anon ? C.brand : C.faint}`, padding: "9px 13px", borderRadius: 999, cursor: forceAnon ? "default" : "pointer", fontSize: 13, color: anon ? C.brand : C.muted, fontWeight: 500 }}>
            <Lock size={14} /> {anon ? "Posting anonymously" : `Post as ${displayName}`}
          </button>
          <button onClick={() => text.trim() && onSubmit(text.trim(), anon)} disabled={!text.trim()} style={{ background: text.trim() ? C.brand : C.faint, color: text.trim() ? "#fff" : C.muted, border: "none", borderRadius: 14, padding: "11px 20px", fontSize: 14, fontWeight: 600, cursor: text.trim() ? "pointer" : "default" }}>
            Share
          </button>
        </div>
        {forceAnon ? (
          <p style={{ fontSize: 11.5, color: C.muted, marginTop: 10 }}>In this space, every post is anonymous by design.</p>
        ) : anon ? (
          <p style={{ fontSize: 11.5, color: C.muted, marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}><Lock size={12} /> Your name and profile stay hidden. Members will only see "Anonymous".</p>
        ) : null}
      </div>
    </div>
  );
}

/* ---------- identity ---------- */
function Identity({ anonDefault, setAnonDefault, displayName, onGuide, onClose }) {
  const Option = ({ active, onClick, icon, title, desc }) => (
    <button onClick={onClick} style={{ display: "flex", gap: 12, textAlign: "left", width: "100%", background: active ? C.brandSoft : C.card, border: `1.5px solid ${active ? C.brand : C.faint}`, borderRadius: 16, padding: "14px 14px", cursor: "pointer" }}>
      <span style={{ width: 38, height: 38, borderRadius: 11, background: active ? C.brand : "#EFEBE2", color: active ? "#fff" : C.muted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14.5, fontWeight: 600, color: C.ink }}>
          {title}
          {active && <span style={{ fontSize: 10.5, fontWeight: 600, color: C.brand, background: "#fff", borderRadius: 999, padding: "2px 7px" }}>ON</span>}
        </span>
        <span style={{ display: "block", fontSize: 12.5, color: C.muted, marginTop: 3, lineHeight: 1.4 }}>{desc}</span>
      </span>
    </button>
  );
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, background: "rgba(46,43,39,.45)", display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: C.bg, borderRadius: "26px 26px 0 0", padding: "16px 18px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h3 className="fd" style={{ fontSize: 19, fontWeight: 600, color: C.ink }}>How you show up</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={20} /></button>
        </div>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.45, marginBottom: 14 }}>Pick your default. You can still flip it on any single post before you share.</p>

        <div style={{ display: "grid", gap: 10 }}>
          <Option active={!anonDefault} onClick={() => setAnonDefault(false)} icon={<ShieldCheck size={19} />} title={`Post as ${displayName}`} desc="Your name appears on what you share, so people can recognise you across the community." />
          <Option active={anonDefault} onClick={() => setAnonDefault(true)} icon={<VenetianMask size={19} />} title="Stay anonymous" desc="Everything you post and reply to shows only “Anonymous”. Your name is never attached." />
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.faint}`, borderRadius: 14, padding: "11px 13px", marginTop: 14, display: "flex", gap: 9 }}>
          <Lock size={15} style={{ color: C.brand, flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.45 }}>Anonymous posts are unlinked from your profile. The Anonymous Venting space is always anonymous, whatever you choose here.</p>
        </div>

        <button onClick={onGuide} style={{ width: "100%", marginTop: 12, background: "none", border: "none", color: C.brand, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <ShieldCheck size={14} /> See our care rules
        </button>
        <button onClick={onClose} style={{ width: "100%", marginTop: 6, background: C.brand, color: "#fff", border: "none", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Done</button>
      </div>
    </div>
  );
}

/* ---------- safety ---------- */
function Safety({ onClose }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, background: "rgba(46,43,39,.5)", display: "flex", alignItems: "center", padding: 16 }} onClick={onClose}>
      <div className="rise" onClick={(e) => e.stopPropagation()} style={{ background: C.bg, borderRadius: 24, padding: "22px 20px", width: "100%" }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: C.brandSoft, color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <LifeBuoy size={24} />
        </div>
        <h3 className="fd" style={{ fontSize: 21, fontWeight: 600, color: C.ink }}>You don't have to hold this alone</h3>
        <p style={{ fontSize: 14, color: "#4a463f", lineHeight: 1.55, marginTop: 8 }}>
          If things feel like too much right now, reaching a real person can help. Havenn is peer support, not a substitute for care in a crisis.
        </p>
        <div style={{ display: "grid", gap: 9, marginTop: 16 }}>
          <Line bold="If you may be in immediate danger" text="Contact your local emergency number right away." />
          <Line bold="Talk to someone now (India)" text="Tele-MANAS, the national mental-health helpline: 14416 or 1-800-891-4416, free, 24/7." />
          <Line bold="Reach a person you trust" text="A friend, family member, or doctor — even a short message counts." />
        </div>
        <p style={{ fontSize: 11.5, color: C.muted, marginTop: 14, lineHeight: 1.5 }}>
          Prototype note: in the real app these resources would adapt to each user's country automatically.
        </p>
        <button onClick={onClose} style={{ width: "100%", marginTop: 16, background: C.brand, color: "#fff", border: "none", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Okay</button>
      </div>
    </div>
  );
}
function Line({ bold, text }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.faint}`, borderRadius: 14, padding: "11px 13px" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{bold}</div>
      <div style={{ fontSize: 13, color: C.muted, marginTop: 2, lineHeight: 1.45 }}>{text}</div>
    </div>
  );
}

/* ---------- guidelines ---------- */
function Guidelines({ onClose }) {
  const rules = [
    ["Kindness first", "Everyone here is having a hard time with something. Respond the way you'd want someone to respond to you."],
    ["This is support, not advice", "Share experience, not diagnoses. Don't tell people what to do unless they ask."],
    ["Protect each other's privacy", "What's shared here stays here. Never identify another member outside Havenn."],
    ["Not a replacement for care", "Havenn sits alongside professional help, it doesn't replace it."],
  ];
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, background: "rgba(46,43,39,.5)", display: "flex", alignItems: "center", padding: 16 }} onClick={onClose}>
      <div className="rise" onClick={(e) => e.stopPropagation()} style={{ background: C.bg, borderRadius: 24, padding: "22px 20px", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h3 className="fd" style={{ fontSize: 21, fontWeight: 600, color: C.ink }}>How we keep this safe</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={20} /></button>
        </div>
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {rules.map(([t, d], i) => (
            <div key={i} style={{ display: "flex", gap: 11 }}>
              <span style={{ width: 26, height: 26, borderRadius: 999, background: C.brandSoft, color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 600 }} className="fd">{i + 1}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{t}</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 2, lineHeight: 1.45 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{ width: "100%", marginTop: 18, background: C.brand, color: "#fff", border: "none", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Got it</button>
      </div>
    </div>
  );
}
