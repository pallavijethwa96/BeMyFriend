import React, { useState, useEffect, useRef } from "react";
import {
  Wind, CloudMoon, Baby, Heart, Flame, Sun, Feather, Flower2,
  VenetianMask, Sprout, ArrowLeft, Plus, X, Send, HeartHandshake,
  MessageCircle, LifeBuoy, Lock, ShieldCheck, ChevronRight, Check, Mail, Phone,
  BadgeCheck, Stethoscope, Sparkles, Languages, Globe,
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

const EXPERTS = [
  { id: "e1", name: "Dr. Ananya Rao", title: "Clinical Psychologist", kind: "therapy", initials: "AR", accent: "#6B5FA8", tags: ["Anxiety", "Stress", "Burnout"], langs: "English · Hindi", reply: "Usually replies within a day", blurb: "A steady space for anxiety, overwhelm and finding your footing again." },
  { id: "e2", name: "Rohan Mehta", title: "Counselling Psychologist", kind: "therapy", initials: "RM", accent: "#4E8E8E", tags: ["Depression", "Grief", "Self-esteem"], langs: "English · Marathi", reply: "Usually replies within hours", blurb: "Warm, practical support for low moods, loss and being kinder to yourself." },
  { id: "e3", name: "Dr. Sara Iyer", title: "Psychotherapist", kind: "therapy", initials: "SI", accent: "#C2755A", tags: ["Relationships", "Parenting", "Family"], langs: "English · Tamil", reply: "Usually replies within a day", blurb: "Helps untangle relationships, parenting strain and family knots." },
  { id: "m1", name: "Vikram Singh", title: "Motivation & Mindset Coach", kind: "motivation", initials: "VS", accent: "#C2853E", tags: ["Motivation", "Confidence", "Habits"], langs: "English · Hindi", reply: "Usually replies within hours", blurb: "Helps you find momentum, build habits, and back yourself again." },
  { id: "m2", name: "Leena Kapoor", title: "Life & Performance Coach", kind: "motivation", initials: "LK", accent: "#4E8E4A", tags: ["Goals", "Focus", "Accountability"], langs: "English · Punjabi", reply: "Usually replies within a day", blurb: "Turns overwhelm into small, doable steps you'll actually take." },
  { id: "m3", name: "Arjun Nair", title: "Wellbeing & Motivation Mentor", kind: "motivation", initials: "AN", accent: "#5B8C7E", tags: ["Purpose", "Routine", "Burnout recovery"], langs: "English · Malayalam", reply: "Usually replies within a day", blurb: "Gentle accountability to help you feel like yourself again." },
];
const EXPERT_REPLIES = [
  "Thank you for trusting me with that. It makes sense you'd feel this way, and you don't have to carry it alone. When does it tend to feel strongest?",
  "I hear how heavy this is. Let's take it one small piece at a time. What feels like the hardest part right now?",
  "That sounds genuinely tough, and reaching out took courage. What would feeling a little lighter look like for you this week?",
];
const MOTIVATION_REPLIES = [
  "I love that you're showing up for yourself by reaching out. What's one small step you could take in the next 24 hours?",
  "That's a real obstacle — so let's shrink it. What would the easiest possible version of starting look like?",
  "You've got more in you than today is letting you feel. What's something that's worked for you before, even once?",
];

const ARIA_SYSTEM = `You are Aria, a warm, caring AI companion inside Havenn, a peer-support mental wellness app. You give people a kind, private, non-judgmental space to talk through whatever is on their mind.

How you help:
- Listen with genuine warmth and empathy. Validate feelings and reflect back what you hear in the person's own words.
- Ask gentle, open questions. Let the person lead.
- When it fits, offer simple, evidence-informed coping ideas (grounding, slow breathing, journaling, gentle reframing, breaking things into small steps), framed as soft suggestions, not instructions.
- Keep replies short and human: usually 2 to 5 sentences. Warm, plain language. Avoid long lists and clinical jargon.

Boundaries (important):
- You are an AI companion, not a therapist, doctor, or crisis service. Never diagnose or give medical advice. Gently encourage professional help for clinical concerns.
- You are a supplement to human support, never a replacement for it.

Safety (critical):
- If the person mentions suicide, self-harm, wanting to die, harming someone, or being in immediate danger, respond with calm compassion and take it seriously. Gently and clearly encourage them to reach out right now to a crisis line or local emergency services, and to a trusted person. If they are in India, they can contact Tele-MANAS at 14416 (free, 24/7). Encourage them to tap the "Need support right now" button in the app. Never provide or discuss any methods or means. Never minimize what they're feeling.

Tone: gentle, grounded, hopeful. Never preachy or robotic. You are a steady, kind presence.`;

const ARIA_HELLO = "Hi, I'm Aria — your companion here at Havenn. I'm an AI, here to listen anytime, day or night. No problem is too big or too small to bring here. What's been on your mind?";

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
      { id: uid(), author: "Dr. Ananya Rao", anon: false, expert: true, title: "Clinical Psychologist", body: "Anticipatory anxiety often peaks the night before. A slow exhale that's longer than your inhale can settle the body. You've got this.", time: "1h" },
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

const REGION_GROUPS = [
  { id: "r_hi", Icon: Languages, flag: "🇮🇳", name: "हिन्दी मंडल", sub: "India · Hindi", bg: "#FBEAE0", fg: "#C2755A", line: "मन की बात अपनी भाषा में।" },
  { id: "r_ta", Icon: Languages, flag: "🇮🇳", name: "தமிழ் வட்டம்", sub: "India · Tamil", bg: "#E0F0EC", fg: "#3F8475", line: "உங்கள் மொழியில் மனம் திறந்து பேசுங்கள்." },
  { id: "r_bn", Icon: Languages, flag: "🇮🇳", name: "বাংলা আসর", sub: "India · Bengali", bg: "#ECE9F6", fg: "#6B5FA8", line: "নিজের ভাষায় মন খুলে বলুন।" },
  { id: "r_mr", Icon: Languages, flag: "🇮🇳", name: "मराठी कट्टा", sub: "India · Marathi", bg: "#FCEEDD", fg: "#C2853E", line: "आपल्या भाषेत मन मोकळं करा." },
  { id: "r_te", Icon: Languages, flag: "🇮🇳", name: "తెలుగు గూడు", sub: "India · Telugu", bg: "#E5F2E2", fg: "#4E8E4A", line: "మీ భాషలో మనసు విప్పి మాట్లాడండి." },
  { id: "r_en", Icon: Globe, flag: "🌐", name: "English Circle", sub: "All regions · English", bg: "#E4EAF1", fg: "#4E6E8E", line: "Connect across regions in English." },
];
const REGION_SEED = {
  r_hi: [{ id: uid(), author: "Anonymous", anon: true, body: "आज दिन थोड़ा भारी लग रहा है। बस किसी से बात करनी थी।", time: "2h", support: 9, supported: false, replies: [] }],
  r_ta: [{ id: uid(), author: "Anonymous", anon: true, body: "இன்று கொஞ்சம் சோர்வாக இருக்கிறேன். யாராவது பேசலாமா?", time: "3h", support: 5, supported: false, replies: [] }],
  r_bn: [{ id: uid(), author: "Anonymous", anon: true, body: "আজ মনটা একটু খারাপ। এখানে লিখে একটু হালকা লাগছে।", time: "1h", support: 6, supported: false, replies: [] }],
  r_mr: [{ id: uid(), author: "Anonymous", anon: true, body: "आज जरा एकटं वाटतंय. इथे लिहून थोडं बरं वाटलं.", time: "4h", support: 4, supported: false, replies: [] }],
  r_te: [{ id: uid(), author: "Anonymous", anon: true, body: "ఈ రోజు కొంచెం ఒత్తిడిగా ఉంది. ఇక్కడ మాట్లాడితే మంచిగా అనిపిస్తోంది.", time: "2h", support: 7, supported: false, replies: [] }],
  r_en: [{ id: uid(), author: "Maya", anon: false, body: "New here — moved cities and missing speaking my mother tongue. Glad these spaces exist.", time: "5h", support: 11, supported: false, replies: [] }],
};
const ALL_GROUPS = [...GROUPS, ...REGION_GROUPS];

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
  const [posts, setPosts] = useState({ ...SEED, ...REGION_SEED });
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
  const [expertId, setExpertId] = useState(null);
  const [consults, setConsults] = useState({});
  const [typing, setTyping] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [aiMsgs, setAiMsgs] = useState([{ role: "assistant", content: ARIA_HELLO }]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const openAI = () => setView("ai");
  const sendAI = async (text) => {
    const history = [...aiMsgs, { role: "user", content: text }];
    setAiMsgs(history);
    setAiLoading(true);
    setAiError("");
    const apiMessages = [];
    for (const m of history) {
      if (apiMessages.length === 0 && m.role !== "user") continue;
      apiMessages.push({ role: m.role, content: m.content });
    }
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system: ARIA_SYSTEM, messages: apiMessages }),
      });
      const data = await res.json();
      const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      setAiMsgs((prev) => [...prev, { role: "assistant", content: reply || "I'm here with you." }]);
    } catch (e) {
      setAiError("I couldn't reach the network just now — please try again in a moment.");
    } finally {
      setAiLoading(false);
    }
  };

  const expert = EXPERTS.find((e) => e.id === expertId);
  const openExperts = () => setView("experts");
  const openConsult = (id) => {
    const ex = EXPERTS.find((e) => e.id === id);
    setConsults((prev) => prev[id] ? prev : {
      ...prev,
      [id]: [{ from: "expert", body: `Hi, I'm ${ex.name.split(" ")[0]}${ex.name.startsWith("Dr.") ? "" : ""}, a verified ${ex.title.toLowerCase()} here on Havenn. Whatever you share stays private — I can't see your name or details, only what you choose to write. What's on your mind today?`, time: "now" }],
    });
    setExpertId(id);
    setView("consult");
  };
  const sendConsult = (id, text) => {
    const ex = EXPERTS.find((e) => e.id === id);
    const pool = ex?.kind === "motivation" ? MOTIVATION_REPLIES : EXPERT_REPLIES;
    setConsults((prev) => ({ ...prev, [id]: [...(prev[id] || []), { from: "you", body: text, time: "now" }] }));
    setTyping(true);
    setTimeout(() => {
      setConsults((prev) => ({ ...prev, [id]: [...(prev[id] || []), { from: "expert", body: pool[Math.floor(Math.random() * pool.length)], time: "now" }] }));
      setTyping(false);
    }, 1400);
  };

  const group = ALL_GROUPS.find((g) => g.id === gid);
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
        .dot { animation: bob 1s ease-in-out infinite; }
        @keyframes bob { 0%,100% { transform: translateY(0); opacity:.5 } 50% { transform: translateY(-4px); opacity:1 } }
        @media (prefers-reduced-motion: reduce) { .pulse,.rise,.sheet,.dot { animation: none !important } }
        textarea:focus, button:focus-visible { outline: 2px solid ${C.brand}; outline-offset: 2px; }
        ::-webkit-scrollbar { width: 0 }
      `}</style>

      <div style={{ width: "100%", maxWidth: 430, background: C.bg, borderRadius: 30, overflow: "hidden", boxShadow: "0 24px 60px -20px rgba(46,43,39,.35)", display: "flex", flexDirection: "column", position: "relative", minHeight: 760 }}>

        {!started && <Splash onEnter={() => setStarted(true)} onGuide={() => setShowGuide(true)} />}

        {started && !onboarded && !profile && <Onboarding onBack={() => setStarted(false)} onGuide={() => setShowGuide(true)} onDone={(p) => { setDisplayName(p.name.trim() || "Friend"); setAnonDefault(p.anon); setProfile(p); }} />}

        {started && !onboarded && profile && <AccountSetup initialDial={profile?.dial && profile.dial.length > 1 ? profile.dial : "+91"} onBack={() => setProfile(null)} onGuide={() => setShowGuide(true)} onDone={() => setOnboarded(true)} />}

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
            <button onClick={() => setView(view === "thread" ? "group" : view === "consult" ? "experts" : "home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: C.ink, padding: 0 }}>
              <ArrowLeft size={20} />
              <span className="fd" style={{ fontSize: 18, fontWeight: 600 }}>{view === "thread" ? "Conversation" : view === "experts" ? "Verified experts" : view === "consult" ? expert?.name : view === "ai" ? "Aria" : group?.name}</span>
            </button>
          )}
        </header>

        {/* body */}
        <main style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflowY: (view === "consult" || view === "ai") ? "hidden" : "auto", paddingBottom: (view === "consult" || view === "ai") ? 0 : 96 }}>
          {view === "home" && <Home mood={mood} setMood={setMood} openGroup={openGroup} posts={posts} openExperts={openExperts} openAI={openAI} />}
          {view === "group" && <GroupFeed group={group} list={posts[gid]} openThread={openThread} toggleSupport={toggleSupport} onCompose={() => setComposeOpen(true)} />}
          {view === "thread" && <Thread group={group} post={thread} anonDefault={anonDefault} displayName={displayName} toggleSupport={toggleSupport} onReply={(b, a) => addReply(gid, tid, b, a)} />}
          {view === "experts" && <Experts onOpen={openConsult} onApply={() => setShowApply(true)} />}
          {view === "consult" && <Consult expert={expert} msgs={consults[expertId] || []} typing={typing} onSend={(t) => sendConsult(expertId, t)} onSafety={() => setShowSafety(true)} />}
          {view === "ai" && <AIChat msgs={aiMsgs} loading={aiLoading} error={aiError} onSend={sendAI} onSafety={() => setShowSafety(true)} />}
        </main>

        {/* lifeline bar */}
        {view !== "consult" && view !== "ai" && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 16px 16px", background: "linear-gradient(to top, " + C.bg + " 70%, transparent)", zIndex: 30 }}>
          <button onClick={() => setShowSafety(true)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: C.brand, color: "#fff", border: "none", padding: "14px", borderRadius: 18, fontSize: 14.5, fontWeight: 600, cursor: "pointer", boxShadow: "0 10px 24px -8px rgba(63,107,92,.6)" }}>
            <span style={{ position: "relative", display: "inline-flex" }}>
              <span className="pulse" style={{ position: "absolute", inset: 0, borderRadius: 999, background: "#fff" }} />
              <LifeBuoy size={18} style={{ position: "relative" }} />
            </span>
            Need support right now
          </button>
        </div>
        )}

        {/* compose sheet */}
        {composeOpen && <Compose group={group} anonDefault={anonDefault} displayName={displayName} onClose={() => setComposeOpen(false)} onSubmit={(b, a) => { addPost(gid, b, a); setComposeOpen(false); }} />}

        {/* modals */}
        {showSafety && <Safety onClose={() => setShowSafety(false)} />}
        {showGuide && <Guidelines onClose={() => setShowGuide(false)} />}
        {showIdentity && <Identity anonDefault={anonDefault} setAnonDefault={setAnonDefault} displayName={displayName} onGuide={() => { setShowIdentity(false); setShowGuide(true); }} onClose={() => setShowIdentity(false)} />}
        {showApply && <ExpertApply onClose={() => setShowApply(false)} />}
      </div>
    </div>
  );
}

/* ---------- home ---------- */
function Home({ mood, setMood, openGroup, posts, openExperts, openAI }) {
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

      <button onClick={openAI} className="rise" style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 13, marginTop: 22, padding: "15px 15px", borderRadius: 20, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #6B5FA8 0%, #9A8CCB 100%)", boxShadow: "0 12px 26px -12px rgba(107,95,168,.6)" }}>
        <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 13, background: "rgba(255,255,255,.18)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={21} strokeWidth={1.9} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15.5, fontWeight: 600, color: "#fff" }}>Talk it through with Aria <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".5px", background: "rgba(255,255,255,.22)", borderRadius: 999, padding: "2px 7px" }}>AI</span></span>
          <span style={{ display: "block", fontSize: 12.5, color: "rgba(255,255,255,.85)", marginTop: 2, lineHeight: 1.35 }}>A caring AI companion, here to listen 24/7. Instant and private.</span>
        </span>
        <ChevronRight size={18} style={{ color: "rgba(255,255,255,.8)", flexShrink: 0 }} />
      </button>

      <button onClick={openExperts} className="rise" style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 13, marginTop: 12, padding: "15px 15px", borderRadius: 20, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #3F6B5C 0%, #4E8E7E 100%)", boxShadow: "0 12px 26px -12px rgba(63,107,92,.7)" }}>
        <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 13, background: "rgba(255,255,255,.16)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Stethoscope size={22} strokeWidth={1.9} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15.5, fontWeight: 600, color: "#fff" }}>Talk to a verified expert <BadgeCheck size={15} /></span>
          <span style={{ display: "block", fontSize: 12.5, color: "rgba(255,255,255,.82)", marginTop: 2, lineHeight: 1.35 }}>Counsellors & motivation coaches. Confidential, and you stay anonymous.</span>
        </span>
        <ChevronRight size={18} style={{ color: "rgba(255,255,255,.8)", flexShrink: 0 }} />
      </button>

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

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "26px 2px 12px" }}>
        <h3 style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".7px", display: "flex", alignItems: "center", gap: 6 }}><Languages size={14} /> Connect in your language</h3>
      </div>
      <div style={{ display: "grid", gap: 11 }}>
        {REGION_GROUPS.map((g) => {
          const count = posts[g.id]?.length || 0;
          return (
            <button key={g.id} onClick={() => openGroup(g.id)} className="rise" style={{ display: "flex", alignItems: "center", gap: 13, textAlign: "left", background: C.card, border: `1px solid ${C.faint}`, borderRadius: 20, padding: "13px 14px", cursor: "pointer" }}>
              <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 14, background: g.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{g.flag}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: C.ink }}>{g.name}</span>
                <span style={{ display: "block", fontSize: 12, color: C.muted, marginTop: 2 }}>{g.sub}</span>
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
const STEPS = ["You", "Country", "Language", "Age", "About you", "Your why"];
const LANGS = [
  { n: "English", v: "English" },
  { n: "हिन्दी", v: "Hindi" },
  { n: "বাংলা", v: "Bengali" },
  { n: "मराठी", v: "Marathi" },
  { n: "తెలుగు", v: "Telugu" },
  { n: "தமிழ்", v: "Tamil" },
  { n: "ગુજરાતી", v: "Gujarati" },
  { n: "ಕನ್ನಡ", v: "Kannada" },
  { n: "മലയാളം", v: "Malayalam" },
  { n: "ਪੰਜਾਬੀ", v: "Punjabi" },
  { n: "اردو", v: "Urdu" },
  { n: "ଓଡ଼ିଆ", v: "Odia" },
  { n: "Español", v: "Spanish" },
  { n: "العربية", v: "Arabic" },
  { n: "Français", v: "French" },
];
const COUNTRIES = [
  { f: "🇮🇳", n: "India", d: "+91" },
  { f: "🇺🇸", n: "United States", d: "+1" },
  { f: "🇬🇧", n: "United Kingdom", d: "+44" },
  { f: "🇨🇦", n: "Canada", d: "+1" },
  { f: "🇦🇺", n: "Australia", d: "+61" },
  { f: "🇸🇬", n: "Singapore", d: "+65" },
  { f: "🇦🇪", n: "United Arab Emirates", d: "+971" },
  { f: "🇩🇪", n: "Germany", d: "+49" },
  { f: "🇫🇷", n: "France", d: "+33" },
  { f: "🇪🇸", n: "Spain", d: "+34" },
  { f: "🇮🇹", n: "Italy", d: "+39" },
  { f: "🇳🇱", n: "Netherlands", d: "+31" },
  { f: "🇮🇪", n: "Ireland", d: "+353" },
  { f: "🇸🇪", n: "Sweden", d: "+46" },
  { f: "🇳🇴", n: "Norway", d: "+47" },
  { f: "🇩🇰", n: "Denmark", d: "+45" },
  { f: "🇨🇭", n: "Switzerland", d: "+41" },
  { f: "🇧🇪", n: "Belgium", d: "+32" },
  { f: "🇵🇹", n: "Portugal", d: "+351" },
  { f: "🇳🇿", n: "New Zealand", d: "+64" },
  { f: "🇯🇵", n: "Japan", d: "+81" },
  { f: "🇰🇷", n: "South Korea", d: "+82" },
  { f: "🇨🇳", n: "China", d: "+86" },
  { f: "🇭🇰", n: "Hong Kong", d: "+852" },
  { f: "🇲🇾", n: "Malaysia", d: "+60" },
  { f: "🇮🇩", n: "Indonesia", d: "+62" },
  { f: "🇵🇭", n: "Philippines", d: "+63" },
  { f: "🇹🇭", n: "Thailand", d: "+66" },
  { f: "🇻🇳", n: "Vietnam", d: "+84" },
  { f: "🇵🇰", n: "Pakistan", d: "+92" },
  { f: "🇧🇩", n: "Bangladesh", d: "+880" },
  { f: "🇱🇰", n: "Sri Lanka", d: "+94" },
  { f: "🇳🇵", n: "Nepal", d: "+977" },
  { f: "🇸🇦", n: "Saudi Arabia", d: "+966" },
  { f: "🇶🇦", n: "Qatar", d: "+974" },
  { f: "🇰🇼", n: "Kuwait", d: "+965" },
  { f: "🇿🇦", n: "South Africa", d: "+27" },
  { f: "🇳🇬", n: "Nigeria", d: "+234" },
  { f: "🇰🇪", n: "Kenya", d: "+254" },
  { f: "🇪🇬", n: "Egypt", d: "+20" },
  { f: "🇧🇷", n: "Brazil", d: "+55" },
  { f: "🇲🇽", n: "Mexico", d: "+52" },
  { f: "🇦🇷", n: "Argentina", d: "+54" },
  { f: "🇷🇺", n: "Russia", d: "+7" },
  { f: "🇹🇷", n: "Turkey", d: "+90" },
  { f: "🇵🇱", n: "Poland", d: "+48" },
  { f: "🌍", n: "Somewhere else", d: "+" },
];

function Onboarding({ onBack, onGuide, onDone }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [anon, setAnon] = useState(false);
  const [country, setCountry] = useState(null);
  const [cq, setCq] = useState("");
  const [langs, setLangs] = useState([]);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [goals, setGoals] = useState([]);

  const toggleGoal = (g) => setGoals((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));
  const toggleLang = (l) => setLangs((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]));
  const canNext = [name.trim().length > 0, !!country, langs.length > 0, !!age, !!sex, goals.length > 0][step];
  const last = step === 5;
  const next = () => (last ? onDone({ name, anon, country: country?.n, dial: country?.d, langs, age, sex, goals }) : setStep(step + 1));
  const back = () => (step === 0 ? onBack() : setStep(step - 1));
  const filtered = COUNTRIES.filter((c) => c.n.toLowerCase().includes(cq.trim().toLowerCase()));

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
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: ".5px", marginTop: 10, textTransform: "uppercase" }}>About you · {step + 1} of 6</div>
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
            <h2 className="fd" style={{ fontSize: 23, fontWeight: 500, color: C.ink, lineHeight: 1.25 }}>Where are you based?</h2>
            <p style={{ fontSize: 13.5, color: C.muted, marginTop: 6 }}>So we can show the right crisis lines and experts for your region.</p>
            <input value={cq} onChange={(e) => setCq(e.target.value)} placeholder="Search your country" style={{ width: "100%", marginTop: 16, background: C.card, border: `1.5px solid ${C.faint}`, borderRadius: 14, padding: "13px 15px", fontSize: 15, color: C.ink, fontFamily: "inherit" }} />
            <div style={{ marginTop: 12, maxHeight: 290, overflowY: "auto", border: `1px solid ${C.faint}`, borderRadius: 14, background: C.card }}>
              {filtered.length === 0 && <p style={{ fontSize: 13, color: C.muted, textAlign: "center", padding: "18px 0" }}>No match — try a different spelling.</p>}
              {filtered.map((c, i) => {
                const on = country?.n === c.n;
                return (
                  <button key={c.n} onClick={() => setCountry(c)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left", padding: "12px 14px", background: on ? C.brandSoft : "transparent", border: "none", borderTop: i === 0 ? "none" : `1px solid ${C.faint}`, cursor: "pointer" }}>
                    <span style={{ fontSize: 20 }}>{c.f}</span>
                    <span style={{ flex: 1, fontSize: 14.5, color: C.ink, fontWeight: on ? 600 : 500 }}>{c.n}</span>
                    <span style={{ fontSize: 12.5, color: C.muted }}>{c.d}</span>
                    {on && <Check size={16} style={{ color: C.brand }} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="rise">
            <h2 className="fd" style={{ fontSize: 23, fontWeight: 500, color: C.ink, lineHeight: 1.25 }}>Which languages are you comfortable in?</h2>
            <p style={{ fontSize: 13.5, color: C.muted, marginTop: 6 }}>We'll connect you to community circles in your language. Pick any that fit.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 16 }}>
              {LANGS.map((l) => {
                const on = langs.includes(l.v);
                return (
                  <button key={l.v} onClick={() => toggleLang(l.v)} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, padding: "10px 14px", borderRadius: 999, cursor: "pointer", border: `1.5px solid ${on ? C.brand : C.faint}`, background: on ? C.brand : C.card, color: on ? "#fff" : C.ink, fontWeight: 500 }}>
                    {on && <Check size={14} />} {l.n}{l.n !== l.v && <span style={{ fontSize: 11, opacity: .7 }}>· {l.v}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
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

        {step === 4 && (
          <div className="rise">
            <h2 className="fd" style={{ fontSize: 23, fontWeight: 500, color: C.ink, lineHeight: 1.25 }}>Which best describes you?</h2>
            <p style={{ fontSize: 13.5, color: C.muted, marginTop: 6 }}>Entirely up to you — “prefer not to say” is always fine.</p>
            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              {SEXES.map((s) => <SelectCard key={s} wide active={sex === s} onClick={() => setSex(s)} label={s} />)}
            </div>
          </div>
        )}

        {step === 5 && (
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

function AccountSetup({ onBack, onGuide, onDone, initialDial = "+91" }) {
  const [phase, setPhase] = useState("details"); // details | verify
  const [email, setEmail] = useState("");
  const [dial, setDial] = useState(initialDial);
  const dialOptions = Array.from(new Set([initialDial, ...DIAL]));
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
                {dialOptions.map((d) => <option key={d} value={d}>{d}</option>)}
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
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {r.anon ? "Anonymous" : r.author}
                {r.expert && <VerifiedTag title={r.title} />}
                <span style={{ color: C.muted, fontWeight: 400 }}>· {r.time}</span>
              </div>
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

/* ---------- experts ---------- */
function VerifiedTag({ title }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 600, color: C.brand, background: C.brandSoft, borderRadius: 999, padding: "2px 8px" }}>
      <BadgeCheck size={12} /> Verified{title ? ` · ${title}` : ""}
    </span>
  );
}

function Experts({ onOpen, onApply }) {
  const [cat, setCat] = useState("therapy");
  const list = EXPERTS.filter((e) => e.kind === cat);
  const tabs = [{ k: "therapy", label: "Counselling", Icon: Stethoscope }, { k: "motivation", label: "Motivation", Icon: Sparkles }];
  return (
    <div style={{ padding: "16px 16px 8px" }}>
      <div style={{ background: cat === "motivation" ? "linear-gradient(135deg, #C2853E 0%, #D9A35C 100%)" : "linear-gradient(135deg, #3F6B5C 0%, #4E8E7E 100%)", borderRadius: 20, padding: "16px 16px", color: "#fff", transition: "background .3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600 }}>{cat === "motivation" ? <Sparkles size={18} /> : <Stethoscope size={18} />} {cat === "motivation" ? "Motivation & coaching" : "Confidential expert support"}</div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.88)", lineHeight: 1.5, marginTop: 7 }}>
          {cat === "motivation"
            ? "Verified coaches to help you build momentum, habits and self-belief. They never see your name or details — only what you share."
            : "Every expert here is identity-verified by Havenn. They only ever see what you choose to write — never your name, contact details or profile."}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#fff", background: "rgba(255,255,255,.16)", borderRadius: 999, padding: "7px 12px", marginTop: 12, width: "fit-content" }}>
          <Lock size={13} /> You stay anonymous, always
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, background: C.card, border: `1px solid ${C.faint}`, borderRadius: 14, padding: 4, marginTop: 16 }}>
        {tabs.map((t) => {
          const on = cat === t.k;
          return (
            <button key={t.k} onClick={() => setCat(t.k)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 8px", borderRadius: 11, border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 600, background: on ? C.brand : "transparent", color: on ? "#fff" : C.muted }}>
              <t.Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".6px", margin: "18px 2px 12px" }}>Available now</div>

      <div style={{ display: "grid", gap: 12 }}>
        {list.map((e) => (
          <div key={e.id} className="rise" style={{ background: C.card, border: `1px solid ${C.faint}`, borderRadius: 20, padding: "15px 15px" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ width: 46, height: 46, borderRadius: 999, background: e.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, flexShrink: 0 }}>{e.initials}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{e.name}</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>{e.title}</div>
                <div style={{ marginTop: 5 }}><VerifiedTag /></div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#4a463f", lineHeight: 1.45, marginTop: 11 }}>{e.blurb}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {e.tags.map((t) => <span key={t} style={{ fontSize: 11.5, color: C.brand, background: C.brandSoft, borderRadius: 999, padding: "4px 10px", fontWeight: 500 }}>{t}</span>)}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 13 }}>
              <span style={{ fontSize: 11.5, color: C.muted }}>{e.langs} · {e.reply}</span>
            </div>
            <button onClick={() => onOpen(e.id)} style={{ width: "100%", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.brand, color: "#fff", border: "none", borderRadius: 14, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              <Lock size={15} /> Start anonymous chat
            </button>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px dashed ${C.faint}`, borderRadius: 18, padding: "15px 15px", marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, display: "flex", alignItems: "center", gap: 7 }}><BadgeCheck size={16} style={{ color: C.brand }} /> Are you a mental health professional?</div>
        <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.45, marginTop: 6 }}>Volunteer your time to support people anonymously. We verify your credentials; the people you help always stay anonymous to you.</p>
        <button onClick={onApply} style={{ marginTop: 12, background: C.brandSoft, color: C.brand, border: "none", borderRadius: 12, padding: "10px 16px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>Apply to help</button>
      </div>
    </div>
  );
}

function Consult({ expert, msgs, typing, onSend, onSafety }) {
  const [text, setText] = useState("");
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);
  const send = () => { if (!text.trim()) return; onSend(text.trim()); setText(""); };
  if (!expert) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <div style={{ background: C.brandSoft, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.faint}` }}>
        <Lock size={14} style={{ color: C.brand, flexShrink: 0 }} />
        <p style={{ fontSize: 12, color: C.brand, lineHeight: 1.4 }}>You're anonymous to {expert.name.split(" ").slice(0, 2).join(" ")}. They can't see your name or details.</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} className="rise" style={{ alignSelf: m.from === "you" ? "flex-end" : "flex-start", maxWidth: "82%" }}>
            {m.from === "expert" && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, marginLeft: 2 }}><span style={{ width: 22, height: 22, borderRadius: 999, background: expert.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600 }}>{expert.initials}</span><BadgeCheck size={13} style={{ color: C.brand }} /></div>}
            <div style={{ background: m.from === "you" ? C.brand : C.card, color: m.from === "you" ? "#fff" : "#3a372f", border: m.from === "you" ? "none" : `1px solid ${C.faint}`, borderRadius: 16, padding: "11px 14px", fontSize: 14, lineHeight: 1.5 }}>{m.body}</div>
          </div>
        ))}
        {typing && (
          <div style={{ alignSelf: "flex-start", background: C.card, border: `1px solid ${C.faint}`, borderRadius: 16, padding: "12px 16px", fontSize: 13, color: C.muted }}>{expert.name.split(" ")[0]} is typing…</div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "8px 14px 10px", borderTop: `1px solid ${C.faint}` }}>
        <button onClick={onSafety} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: C.brand, background: "none", border: "none", cursor: "pointer", margin: "0 auto 8px", fontWeight: 600 }}>
          <LifeBuoy size={13} /> In crisis? Get urgent help
        </button>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={1} placeholder="Write privately…" style={{ flex: 1, background: C.card, border: `1px solid ${C.faint}`, borderRadius: 16, padding: "12px 14px", fontSize: 14, color: C.ink, resize: "none", fontFamily: "inherit", maxHeight: 100 }} />
          <button onClick={send} style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 14, background: C.brand, color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
}

function ExpertApply({ onClose }) {
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [reg, setReg] = useState("");
  const ok = name.trim() && title.trim() && reg.trim();
  const field = (label, val, setVal, ph) => (
    <div style={{ marginTop: 12 }}>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: C.ink, marginBottom: 6 }}>{label}</label>
      <input value={val} onChange={(e) => setVal(e.target.value)} placeholder={ph} style={{ width: "100%", background: C.card, border: `1.5px solid ${C.faint}`, borderRadius: 13, padding: "12px 14px", fontSize: 14.5, color: C.ink, fontFamily: "inherit" }} />
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, background: "rgba(46,43,39,.45)", display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: C.bg, borderRadius: "26px 26px 0 0", padding: "16px 18px 22px", maxHeight: "90%", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h3 className="fd" style={{ fontSize: 19, fontWeight: 600, color: C.ink }}>{done ? "Application received" : "Apply to support"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={20} /></button>
        </div>

        {done ? (
          <div className="rise">
            <div style={{ width: 52, height: 52, borderRadius: 16, background: C.brandSoft, color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", margin: "12px 0 14px" }}><BadgeCheck size={26} /></div>
            <p style={{ fontSize: 14, color: "#4a463f", lineHeight: 1.55 }}>Thank you, {name.split(" ")[0]}. Our team will verify your credentials privately, usually within a few days. Once approved, you'll be able to support people who always remain anonymous to you.</p>
            <button onClick={onClose} style={{ width: "100%", marginTop: 18, background: C.brand, color: "#fff", border: "none", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Done</button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.45 }}>We verify every professional before they can offer support. Your details are checked privately and never shown to the people you help.</p>
            {field("Full name", name, setName, "Dr. Priya Nair")}
            {field("Professional title", title, setTitle, "Clinical Psychologist")}
            {field("Licence / registration number", reg, setReg, "e.g. RCI A-12345")}
            <div style={{ background: C.card, border: `1px solid ${C.faint}`, borderRadius: 13, padding: "11px 13px", marginTop: 14, display: "flex", gap: 9 }}>
              <ShieldCheck size={15} style={{ color: C.brand, flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.45 }}>I confirm I'm a licensed/registered mental health professional and agree to Havenn's care and safeguarding standards.</p>
            </div>
            <button onClick={() => ok && setDone(true)} disabled={!ok} style={{ width: "100%", marginTop: 16, background: ok ? C.brand : C.faint, color: ok ? "#fff" : C.muted, border: "none", borderRadius: 14, padding: 14, fontSize: 14.5, fontWeight: 600, cursor: ok ? "pointer" : "default" }}>Submit for verification</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- AI companion ---------- */
function AIChat({ msgs, loading, error, onSend, onSafety }) {
  const [text, setText] = useState("");
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);
  const send = () => { if (!text.trim() || loading) return; onSend(text.trim()); setText(""); };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <div style={{ background: "#EFEAF7", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.faint}` }}>
        <Sparkles size={14} style={{ color: "#6B5FA8", flexShrink: 0 }} />
        <p style={{ fontSize: 12, color: "#6B5FA8", lineHeight: 1.4 }}>Aria is an AI companion — caring, but not a substitute for professional care or a crisis service.</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} className="rise" style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "84%" }}>
            {m.role === "assistant" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, marginLeft: 2 }}>
                <span style={{ width: 22, height: 22, borderRadius: 999, background: "linear-gradient(135deg, #6B5FA8, #9A8CCB)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={12} /></span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "#6B5FA8" }}>Aria</span>
              </div>
            )}
            <div style={{ whiteSpace: "pre-wrap", background: m.role === "user" ? C.brand : C.card, color: m.role === "user" ? "#fff" : "#3a372f", border: m.role === "user" ? "none" : `1px solid ${C.faint}`, borderRadius: 16, padding: "11px 14px", fontSize: 14, lineHeight: 1.55 }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.faint}`, borderRadius: 16, padding: "12px 16px" }}>
            <span className="dot" style={{ width: 7, height: 7, borderRadius: 999, background: "#9A8CCB" }} />
            <span className="dot" style={{ width: 7, height: 7, borderRadius: 999, background: "#9A8CCB", animationDelay: ".2s" }} />
            <span className="dot" style={{ width: 7, height: 7, borderRadius: 999, background: "#9A8CCB", animationDelay: ".4s" }} />
          </div>
        )}
        {error && <p style={{ alignSelf: "center", fontSize: 12.5, color: "#B85C72", textAlign: "center" }}>{error}</p>}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "8px 14px 10px", borderTop: `1px solid ${C.faint}` }}>
        <button onClick={onSafety} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: C.brand, background: "none", border: "none", cursor: "pointer", margin: "0 auto 8px", fontWeight: 600 }}>
          <LifeBuoy size={13} /> In crisis? Get urgent help
        </button>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={1} placeholder="Tell Aria what's on your mind…" style={{ flex: 1, background: C.card, border: `1px solid ${C.faint}`, borderRadius: 16, padding: "12px 14px", fontSize: 14, color: C.ink, resize: "none", fontFamily: "inherit", maxHeight: 110 }} />
          <button onClick={send} disabled={loading || !text.trim()} style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 14, background: (loading || !text.trim()) ? C.faint : "#6B5FA8", color: (loading || !text.trim()) ? C.muted : "#fff", border: "none", cursor: (loading || !text.trim()) ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Send size={18} /></button>
        </div>
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
