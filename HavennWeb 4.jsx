import React, { useState, useEffect, useRef } from "react";
import {
  Wind, CloudMoon, Baby, Heart, Flame, Sun, Feather, Flower2, VenetianMask, Sprout,
  ArrowLeft, ArrowRight, Plus, X, Send, HeartHandshake, MessageCircle, LifeBuoy, Lock,
  ShieldCheck, ChevronRight, Check, BadgeCheck, Stethoscope, Sparkles, Languages, Globe,
  Home as HomeIcon, Users, Menu,
} from "lucide-react";

/* ===================== tokens ===================== */
const C = {
  bg: "#F7F4EE", card: "#FFFFFF", ink: "#2E2B27", muted: "#857E73", faint: "#ECE7DD",
  brand: "#3F6B5C", brandSoft: "#E3EDE8", accent: "#D9876C", slate: "#3D5A66",
};

const GROUPS = [
  { id: "anxiety", name: "Anxiety & Stress", Icon: Wind, bg: "#ECE9F6", fg: "#6B5FA8", line: "A place to set down the racing thoughts." },
  { id: "depress", name: "Depression Support", Icon: CloudMoon, bg: "#E4EAF1", fg: "#4E6E8E", line: "For the heavy days, and people who get it." },
  { id: "parent", name: "Motherhood & Parenting", Icon: Baby, bg: "#FBEAE0", fg: "#C2755A", line: "Raising little humans, holding yourself together." },
  { id: "relate", name: "Relationships & Family", Icon: Heart, bg: "#F8E6EA", fg: "#B85C72", line: "The people closest to us are rarely simple." },
  { id: "burnout", name: "Workplace Burnout", Icon: Flame, bg: "#FCEEDD", fg: "#C2853E", line: "When work has taken more than it gave." },
  { id: "esteem", name: "Self-Esteem & Confidence", Icon: Sun, bg: "#FBF3DA", fg: "#A07C25", line: "Being kinder to the person in the mirror." },
  { id: "grief", name: "Grief & Loss", Icon: Feather, bg: "#E7EEE7", fg: "#5F7E63", line: "Carry what you've lost, alongside others." },
  { id: "mindful", name: "Mindfulness & Wellness", Icon: Flower2, bg: "#E0F0EC", fg: "#3F8475", line: "Small practices for steadier days." },
  { id: "vent", name: "Anonymous Venting", Icon: VenetianMask, bg: "#E9EBEF", fg: "#5B6472", line: "Say it without your name attached." },
  { id: "success", name: "Success Stories & Recovery", Icon: Sprout, bg: "#E5F2E2", fg: "#4E8E4A", line: "Proof that things can, and do, get lighter." },
];
const REGION_GROUPS = [
  { id: "r_hi", Icon: Languages, flag: "🇮🇳", name: "हिन्दी मंडल", sub: "India · Hindi", bg: "#FBEAE0", fg: "#C2755A", line: "मन की बात अपनी भाषा में।" },
  { id: "r_ta", Icon: Languages, flag: "🇮🇳", name: "தமிழ் வட்டம்", sub: "India · Tamil", bg: "#E0F0EC", fg: "#3F8475", line: "உங்கள் மொழியில் மனம் திறந்து பேசுங்கள்." },
  { id: "r_bn", Icon: Languages, flag: "🇮🇳", name: "বাংলা আসর", sub: "India · Bengali", bg: "#ECE9F6", fg: "#6B5FA8", line: "নিজের ভাষায় মন খুলে বলুন।" },
  { id: "r_mr", Icon: Languages, flag: "🇮🇳", name: "मराठी कट्टा", sub: "India · Marathi", bg: "#FCEEDD", fg: "#C2853E", line: "आपल्या भाषेत मन मोकळं करा." },
  { id: "r_te", Icon: Languages, flag: "🇮🇳", name: "తెలుగు గూడు", sub: "India · Telugu", bg: "#E5F2E2", fg: "#4E8E4A", line: "మీ భాషలో మనసు విప్పి మాట్లాడండి." },
  { id: "r_en", Icon: Globe, flag: "🌐", name: "English Circle", sub: "All regions · English", bg: "#E4EAF1", fg: "#4E6E8E", line: "Connect across regions in English." },
];
const ALL_GROUPS = [...GROUPS, ...REGION_GROUPS];

const EXPERTS = [
  { id: "e1", name: "Dr. Ananya Rao", title: "Clinical Psychologist", kind: "therapy", initials: "AR", accent: "#6B5FA8", tags: ["Anxiety", "Stress", "Burnout"], langs: "English · Hindi", reply: "Replies within a day", blurb: "A steady space for anxiety, overwhelm and finding your footing again." },
  { id: "e2", name: "Rohan Mehta", title: "Counselling Psychologist", kind: "therapy", initials: "RM", accent: "#4E8E8E", tags: ["Depression", "Grief", "Self-esteem"], langs: "English · Marathi", reply: "Replies within hours", blurb: "Warm, practical support for low moods, loss and self-kindness." },
  { id: "e3", name: "Dr. Sara Iyer", title: "Psychotherapist", kind: "therapy", initials: "SI", accent: "#C2755A", tags: ["Relationships", "Parenting", "Family"], langs: "English · Tamil", reply: "Replies within a day", blurb: "Helps untangle relationships, parenting strain and family knots." },
  { id: "m1", name: "Vikram Singh", title: "Motivation & Mindset Coach", kind: "motivation", initials: "VS", accent: "#C2853E", tags: ["Motivation", "Confidence", "Habits"], langs: "English · Hindi", reply: "Replies within hours", blurb: "Helps you find momentum, build habits, and back yourself again." },
  { id: "m2", name: "Leena Kapoor", title: "Life & Performance Coach", kind: "motivation", initials: "LK", accent: "#4E8E4A", tags: ["Goals", "Focus", "Accountability"], langs: "English · Punjabi", reply: "Replies within a day", blurb: "Turns overwhelm into small, doable steps you'll actually take." },
  { id: "m3", name: "Arjun Nair", title: "Wellbeing & Motivation Mentor", kind: "motivation", initials: "AN", accent: "#5B8C7E", tags: ["Purpose", "Routine", "Burnout recovery"], langs: "English · Malayalam", reply: "Replies within a day", blurb: "Gentle accountability to help you feel like yourself again." },
];
const EXPERT_REPLIES = [
  "Thank you for trusting me with that. It makes sense you'd feel this way, and you don't have to carry it alone. When does it tend to feel strongest?",
  "I hear how heavy this is. Let's take it one small piece at a time. What feels like the hardest part right now?",
  "That sounds genuinely tough, and reaching out took courage. What would feeling a little lighter look like this week?",
];
const MOTIVATION_REPLIES = [
  "I love that you're showing up for yourself by reaching out. What's one small step you could take in the next 24 hours?",
  "That's a real obstacle — so let's shrink it. What would the easiest possible version of starting look like?",
  "You've got more in you than today is letting you feel. What's something that's worked for you before, even once?",
];

const MOODS = [{ k: "heavy", label: "Heavy" }, { k: "anxious", label: "Anxious" }, { k: "okay", label: "Okay" }, { k: "hopeful", label: "Hopeful" }, { k: "numb", label: "Numb" }];

const ARIA_SYSTEM = `You are Aria, a warm, caring AI companion inside Havenn, a peer-support mental wellness platform. You give people a kind, private, non-judgmental space to talk through whatever is on their mind.

How you help:
- Listen with genuine warmth and empathy. Validate feelings and reflect back what you hear in the person's own words.
- Ask gentle, open questions. Let the person lead.
- When it fits, offer simple, evidence-informed coping ideas (grounding, slow breathing, journaling, gentle reframing, small steps), framed as soft suggestions.
- Keep replies short and human: usually 2 to 5 sentences. Warm, plain language. Avoid long lists and clinical jargon.

Boundaries: You are an AI companion, not a therapist, doctor, or crisis service. Never diagnose or give medical advice. You are a supplement to human support, never a replacement.

Safety (critical): If the person mentions suicide, self-harm, wanting to die, harming someone, or being in immediate danger, respond with calm compassion and take it seriously. Gently and clearly encourage them to reach out right now to a crisis line or local emergency services, and to a trusted person. If they are in India, they can contact Tele-MANAS at 14416 (free, 24/7). Encourage them to use the "Need support" button. Never provide or discuss methods or means. Never minimize what they're feeling.

Tone: gentle, grounded, hopeful. Never preachy or robotic.`;
const ARIA_HELLO = "Hi, I'm Aria — your companion here at Havenn. I'm an AI, here to listen anytime, day or night. No problem is too big or too small to bring here. What's been on your mind?";

const uid = () => Math.random().toString(36).slice(2, 9);
const SEED = {
  anxiety: [
    { id: uid(), author: "Riya", anon: false, body: "Big presentation tomorrow and my chest has been tight all evening. Just naming it here so it stops rattling around in my head.", time: "2h", support: 14, supported: false, replies: [
      { id: uid(), author: "Dr. Ananya Rao", anon: false, expert: true, title: "Clinical Psychologist", body: "Anticipatory anxiety often peaks the night before. A slow exhale that's longer than your inhale can settle the body. You've got this.", time: "1h" },
    ] },
  ],
  depress: [{ id: uid(), author: "Anonymous", anon: true, body: "Managed to shower and eat one real meal today. Doesn't sound like much but it's more than yesterday.", time: "3h", support: 31, supported: false, replies: [] }],
  parent: [{ id: uid(), author: "Meera", anon: false, body: "Lost my patience with my toddler and felt awful after. Reminding myself a good parent is one who notices and tries again.", time: "1h", support: 22, supported: false, replies: [] }],
  relate: [{ id: uid(), author: "Anonymous", anon: true, body: "How do you set a boundary with a parent who takes it personally every single time?", time: "6h", support: 7, supported: false, replies: [] }],
  burnout: [{ id: uid(), author: "Kabir", anon: false, body: "Took my first real day off in months. Felt guilty for an hour, then slept for three. Recommend.", time: "4h", support: 18, supported: false, replies: [] }],
  esteem: [{ id: uid(), author: "Anonymous", anon: true, body: "Trying to talk to myself the way I'd talk to a friend. Feels fake right now but I'm sticking with it.", time: "2h", support: 12, supported: false, replies: [] }],
  grief: [{ id: uid(), author: "Tara", anon: false, body: "It's been a year today. Lit a candle and made her recipe. Some grief doesn't shrink, you just grow around it.", time: "8h", support: 27, supported: false, replies: [] }],
  mindful: [{ id: uid(), author: "Jonah", anon: false, body: "Tip that's working for me: one slow breath before I unlock my phone in the morning. Small, but it changes the day.", time: "3h", support: 16, supported: false, replies: [] }],
  vent: [{ id: uid(), author: "Anonymous", anon: true, body: "I'm so tired of pretending I'm fine at work when everything outside it is falling apart. That's the post.", time: "1h", support: 24, supported: false, replies: [] }],
  success: [{ id: uid(), author: "Aisha", anon: false, body: "One year ago I could barely leave the house. Today I danced at a friend's wedding. To anyone in the thick of it: keep going.", time: "5h", support: 58, supported: false, replies: [] }],
};
const REGION_SEED = {
  r_hi: [{ id: uid(), author: "Anonymous", anon: true, body: "आज दिन थोड़ा भारी लग रहा है। बस किसी से बात करनी थी।", time: "2h", support: 9, supported: false, replies: [] }],
  r_ta: [{ id: uid(), author: "Anonymous", anon: true, body: "இன்று கொஞ்சம் சோர்வாக இருக்கிறேன். யாராவது பேசலாமா?", time: "3h", support: 5, supported: false, replies: [] }],
  r_bn: [{ id: uid(), author: "Anonymous", anon: true, body: "আজ মনটা একটু খারাপ। এখানে লিখে একটু হালকা লাগছে।", time: "1h", support: 6, supported: false, replies: [] }],
  r_mr: [{ id: uid(), author: "Anonymous", anon: true, body: "आज जरा एकटं वाटतंय. इथे लिहून थोडं बरं वाटलं.", time: "4h", support: 4, supported: false, replies: [] }],
  r_te: [{ id: uid(), author: "Anonymous", anon: true, body: "ఈ రోజు కొంచెం ఒత్తిడిగా ఉంది. ఇక్కడ మాట్లాడితే మంచిగా అనిపిస్తోంది.", time: "2h", support: 7, supported: false, replies: [] }],
  r_en: [{ id: uid(), author: "Maya", anon: false, body: "New here — moved cities and missing speaking my mother tongue. Glad these spaces exist.", time: "5h", support: 11, supported: false, replies: [] }],
};

/* ===================== logo ===================== */
function HavennLogo({ size = 96 }) {
  return (
    <svg width={size} height={size * 1.06} viewBox="0 0 200 212" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <defs><linearGradient id="hvHeadW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#74AC9C" /><stop offset="1" stopColor="#5C9082" /></linearGradient></defs>
      <path fill="url(#hvHeadW)" fillRule="evenodd" d="M100 44 C142 44 166 72 164 106 C163 124 156 134 156 150 L156 186 C156 196 150 200 142 200 L108 200 C101 200 98 195 99 188 C101 174 104 166 101 158 C99 152 92 154 90 147 C88 141 80 142 82 134 C84 128 74 128 78 120 C81 114 66 114 70 105 C73 99 84 98 86 92 C88 80 84 60 100 44 Z M104 74 C120 64 150 68 152 94 C153 113 144 126 129 128 C140 116 141 97 131 86 C121 75 108 77 102 86 C99 81 100 78 104 74 Z" />
      <path d="M118 150 C116 124 116 104 116 84" stroke="#6FB6A0" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M116 120 C102 114 92 118 89 109 C100 106 111 111 116 120 Z" fill="#7DBFA8" />
      <path d="M116 110 C130 104 140 108 143 99 C132 96 121 101 116 110 Z" fill="#88C6AF" />
      <path d="M117 136 C105 131 96 134 93 126 C103 123 112 128 117 136 Z" fill="#7DBFA8" />
      <g fill="#CCC5E7">{[-80, -53, -27, 0, 27, 53, 80].map((a) => <g key={a} transform={`translate(116,72) rotate(${a}) scale(1.16)`}><path d="M0 0 C-9 -16 -8 -38 0 -44 C8 -38 9 -16 0 0 Z" /></g>)}</g>
      <g fill="#B3A7DC">{[-54, -28, 28, 54].map((a) => <g key={a} transform={`translate(116,70) rotate(${a}) scale(0.95)`}><path d="M0 0 C-9 -16 -8 -38 0 -44 C8 -38 9 -16 0 0 Z" /></g>)}</g>
      <g fill="#9A8CCB"><g transform="translate(116,69) scale(1.02)"><path d="M0 0 C-9 -16 -8 -38 0 -44 C8 -38 9 -16 0 0 Z" /></g></g>
    </svg>
  );
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
.fd{font-family:'Fraunces',Georgia,serif}
*{box-sizing:border-box}
.rise{animation:rise .4s ease both}@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.dot{animation:bob 1s ease-in-out infinite}@keyframes bob{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-4px);opacity:1}}
.hov{transition:transform .15s ease, box-shadow .15s ease}.hov:hover{transform:translateY(-3px);box-shadow:0 16px 34px -18px rgba(46,43,39,.4)}
.lnk{transition:color .15s}.lnk:hover{color:#3F6B5C}
button{font-family:inherit}
::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:#dcd6ca;border-radius:99px;border:3px solid #F7F4EE}
@media (prefers-reduced-motion: reduce){.rise,.dot,.hov{animation:none!important;transition:none!important}}`;

/* ===================== root ===================== */
export default function App() {
  const [screen, setScreen] = useState("landing");
  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", color: C.ink, background: C.bg, minHeight: "100vh" }}>
      <style>{FONTS}</style>
      {screen === "landing" ? <Landing onEnter={() => setScreen("app")} /> : <AppShell onExit={() => setScreen("landing")} />}
    </div>
  );
}

/* ===================== landing ===================== */
function Landing({ onEnter }) {
  const pillars = [
    { Icon: Sparkles, t: "Talk to Aria, your AI companion", d: "A caring AI that listens 24/7. Instant, private, and always there for the 3am thoughts.", bg: "linear-gradient(135deg,#6B5FA8,#9A8CCB)" },
    { Icon: Users, t: "Peer support circles", d: "Ten topic spaces and regional language circles where people who truly get it gather.", bg: "linear-gradient(135deg,#3F6B5C,#4E8E7E)" },
    { Icon: Stethoscope, t: "Verified experts & coaches", d: "Identity-verified psychologists and motivation coaches — and you always stay anonymous.", bg: "linear-gradient(135deg,#C2853E,#D9A35C)" },
  ];
  const feats = [
    { Icon: VenetianMask, t: "Anonymous by design", d: "Share with your name, a nickname, or fully anonymously. You're in control." },
    { Icon: Languages, t: "In your language", d: "Community circles in Hindi, Tamil, Bengali, Marathi, Telugu and more." },
    { Icon: Heart, t: "Always free", d: "Support shouldn't cost anything. Havenn is free to join and use." },
    { Icon: LifeBuoy, t: "Safety first", d: "Crisis resources are one click away from every screen, anytime." },
  ];
  return (
    <div>
      {/* nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(10px)", background: "rgba(247,244,238,.82)", borderBottom: `1px solid ${C.faint}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <HavennLogo size={34} />
            <div><div className="fd" style={{ fontSize: 21, fontWeight: 600, color: C.brand, lineHeight: 1 }}>Havenn</div><div style={{ fontSize: 10.5, color: C.muted }}>Mind &amp; Wellness</div></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <a href="#how" className="lnk" style={{ fontSize: 14, color: C.muted, textDecoration: "none", fontWeight: 500 }}>How it works</a>
            <a href="#support" className="lnk" style={{ fontSize: 14, color: C.muted, textDecoration: "none", fontWeight: 500 }}>Support</a>
            <button onClick={onEnter} style={{ background: C.brand, color: "#fff", border: "none", borderRadius: 12, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Open the app</button>
          </div>
        </div>
      </nav>

      {/* hero */}
      <header style={{ maxWidth: 820, margin: "0 auto", padding: "70px 24px 56px", textAlign: "center" }}>
        <div className="rise" style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <div style={{ width: 132, height: 132, borderRadius: 34, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 50px -20px rgba(63,107,92,.5)" }}><HavennLogo size={98} /></div>
        </div>
        <h1 className="fd rise" style={{ fontSize: 52, lineHeight: 1.08, fontWeight: 600, letterSpacing: "-1.5px", margin: 0, color: C.ink }}>A gentler place<br />to be heard.</h1>
        <p className="rise" style={{ fontSize: 18, color: C.muted, lineHeight: 1.6, maxWidth: 580, margin: "22px auto 0" }}>
          Havenn brings together a caring AI companion, peer support circles in your own language, and verified professionals — all in one calm, anonymous space.
        </p>
        <div className="rise" style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}>
          <button onClick={onEnter} style={{ background: C.brand, color: "#fff", border: "none", borderRadius: 14, padding: "15px 28px", fontSize: 15.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 14px 30px -12px rgba(63,107,92,.6)" }}>Get started <ArrowRight size={18} /></button>
          <a href="#support" style={{ background: "#fff", color: C.ink, border: `1px solid ${C.faint}`, borderRadius: 14, padding: "15px 24px", fontSize: 15.5, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>See how it helps</a>
        </div>
        <p style={{ fontSize: 12.5, color: C.muted, marginTop: 18 }}>Free · Anonymous · havenn.in</p>
      </header>

      {/* three pillars */}
      <section id="support" style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 24px 10px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
          {pillars.map((p) => (
            <div key={p.t} className="hov" style={{ background: C.card, border: `1px solid ${C.faint}`, borderRadius: 22, padding: "26px 24px" }}>
              <div style={{ width: 52, height: 52, borderRadius: 15, background: p.bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><p.Icon size={25} /></div>
              <h3 className="fd" style={{ fontSize: 20, fontWeight: 600, margin: 0, color: C.ink }}>{p.t}</h3>
              <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.6, marginTop: 8 }}>{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* features */}
      <section id="how" style={{ maxWidth: 1120, margin: "0 auto", padding: "56px 24px" }}>
        <h2 className="fd" style={{ fontSize: 32, fontWeight: 600, textAlign: "center", letterSpacing: "-.5px", color: C.ink }}>Built around how people actually heal</h2>
        <p style={{ textAlign: "center", color: C.muted, fontSize: 16, maxWidth: 520, margin: "12px auto 0", lineHeight: 1.6 }}>Connection, safety, and the freedom to be honest — without judgement.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginTop: 36 }}>
          {feats.map((f) => (
            <div key={f.t} style={{ background: C.card, border: `1px solid ${C.faint}`, borderRadius: 20, padding: "22px 20px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: C.brandSoft, color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}><f.Icon size={22} /></div>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: C.ink }}>{f.t}</h3>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.55, marginTop: 6 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* spaces preview */}
      <section style={{ background: "#fff", borderTop: `1px solid ${C.faint}`, borderBottom: `1px solid ${C.faint}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "52px 24px" }}>
          <h2 className="fd" style={{ fontSize: 28, fontWeight: 600, textAlign: "center", color: C.ink }}>Spaces for whatever you're carrying</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 28 }}>
            {GROUPS.map((g) => (
              <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 9, background: C.bg, border: `1px solid ${C.faint}`, borderRadius: 999, padding: "9px 15px 9px 9px" }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, background: g.bg, color: g.fg, display: "flex", alignItems: "center", justifyContent: "center" }}><g.Icon size={16} /></span>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: C.ink }}>{g.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ background: "linear-gradient(135deg,#3F6B5C,#5B8C7E)", borderRadius: 28, padding: "52px 32px", textAlign: "center", color: "#fff" }}>
          <h2 className="fd" style={{ fontSize: 34, fontWeight: 600, margin: 0, letterSpacing: "-.5px" }}>Ready when you are</h2>
          <p style={{ fontSize: 16.5, color: "rgba(255,255,255,.9)", marginTop: 12, lineHeight: 1.6, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>No need to be okay first. Step in, take a breath, and start wherever feels right.</p>
          <button onClick={onEnter} style={{ marginTop: 24, background: "#fff", color: C.brand, border: "none", borderRadius: 14, padding: "15px 30px", fontSize: 15.5, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>Open Havenn <ArrowRight size={18} /></button>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${C.faint}`, padding: "30px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><HavennLogo size={28} /><span className="fd" style={{ fontSize: 17, fontWeight: 600, color: C.brand }}>Havenn</span><span style={{ fontSize: 13, color: C.muted }}>· havenn.in</span></div>
          <p style={{ fontSize: 12.5, color: C.muted, margin: 0 }}>Peer support, not a substitute for professional care or crisis services.</p>
        </div>
      </footer>
    </div>
  );
}

/* ===================== app shell ===================== */
export function AppShell({ onExit }) {
  const [view, setView] = useState("home");
  const [gid, setGid] = useState(null);
  const [tid, setTid] = useState(null);
  const [posts, setPosts] = useState({ ...SEED, ...REGION_SEED });
  const [mood, setMood] = useState(null);
  const [anonDefault, setAnonDefault] = useState(false);
  const [displayName] = useState("You");
  const [modal, setModal] = useState(null); // safety | guide | identity | apply | compose
  const [expertId, setExpertId] = useState(null);
  const [consults, setConsults] = useState({});
  const [typing, setTyping] = useState(false);
  const [aiMsgs, setAiMsgs] = useState([{ role: "assistant", content: ARIA_HELLO }]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const group = ALL_GROUPS.find((g) => g.id === gid);
  const thread = group ? posts[gid]?.find((p) => p.id === tid) : null;
  const expert = EXPERTS.find((e) => e.id === expertId);

  const openGroup = (id) => { setGid(id); setView("group"); };
  const openThread = (id) => { setTid(id); setView("thread"); };
  const toggleSupport = (g, pid) => setPosts((prev) => ({ ...prev, [g]: prev[g].map((p) => p.id === pid ? { ...p, supported: !p.supported, support: p.support + (p.supported ? -1 : 1) } : p) }));
  const addPost = (g, body, anon) => setPosts((prev) => ({ ...prev, [g]: [{ id: uid(), author: anon ? "Anonymous" : displayName, anon, body, time: "just now", support: 0, supported: false, replies: [] }, ...prev[g]] }));
  const addReply = (g, pid, body, anon) => setPosts((prev) => ({ ...prev, [g]: prev[g].map((p) => p.id === pid ? { ...p, replies: [...p.replies, { id: uid(), author: anon ? "Anonymous" : displayName, anon, body, time: "now" }] } : p) }));

  const openConsult = (id) => {
    const ex = EXPERTS.find((e) => e.id === id);
    setConsults((prev) => prev[id] ? prev : { ...prev, [id]: [{ from: "expert", body: `Hi, I'm ${ex.name.split(" ")[0]}, a verified ${ex.title.toLowerCase()} here on Havenn. Whatever you share stays private — I can't see your name or details, only what you choose to write. What's on your mind today?`, time: "now" }] });
    setExpertId(id); setView("consult");
  };
  const sendConsult = (id, text) => {
    const ex = EXPERTS.find((e) => e.id === id);
    const pool = ex?.kind === "motivation" ? MOTIVATION_REPLIES : EXPERT_REPLIES;
    setConsults((prev) => ({ ...prev, [id]: [...(prev[id] || []), { from: "you", body: text, time: "now" }] }));
    setTyping(true);
    setTimeout(() => { setConsults((prev) => ({ ...prev, [id]: [...(prev[id] || []), { from: "expert", body: pool[Math.floor(Math.random() * pool.length)], time: "now" }] })); setTyping(false); }, 1400);
  };
  const sendAI = async (text) => {
    const history = [...aiMsgs, { role: "user", content: text }];
    setAiMsgs(history); setAiLoading(true); setAiError("");
    const apiMessages = [];
    for (const m of history) { if (apiMessages.length === 0 && m.role !== "user") continue; apiMessages.push({ role: m.role, content: m.content }); }
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system: ARIA_SYSTEM, messages: apiMessages }) });
      const data = await res.json();
      const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      setAiMsgs((prev) => [...prev, { role: "assistant", content: reply || "I'm here with you." }]);
    } catch (e) { setAiError("I couldn't reach the network just now — please try again in a moment."); }
    finally { setAiLoading(false); }
  };

  const nav = [
    { k: "home", label: "Home", Icon: HomeIcon, go: () => setView("home") },
    { k: "ai", label: "Talk to Aria", Icon: Sparkles, go: () => setView("ai") },
    { k: "experts", label: "Experts & coaches", Icon: Stethoscope, go: () => setView("experts") },
  ];
  const activeNav = ["group", "thread"].includes(view) ? "home" : view === "consult" ? "experts" : view;

  return (
    <div style={{ display: "flex", minHeight: "100vh", maxWidth: 1280, margin: "0 auto" }}>
      {/* sidebar */}
      <aside style={{ width: 260, flexShrink: 0, borderRight: `1px solid ${C.faint}`, background: C.bg, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", padding: "22px 16px" }}>
        <button onClick={onExit} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: "0 6px", marginBottom: 26 }}>
          <HavennLogo size={36} />
          <div style={{ textAlign: "left" }}><div className="fd" style={{ fontSize: 22, fontWeight: 600, color: C.brand, lineHeight: 1 }}>Havenn</div><div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>Mind &amp; Wellness</div></div>
        </button>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {nav.map((n) => {
            const on = activeNav === n.k;
            return (
              <button key={n.k} onClick={n.go} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 13, border: "none", cursor: "pointer", background: on ? C.brand : "transparent", color: on ? "#fff" : C.ink, fontSize: 14.5, fontWeight: 600, textAlign: "left" }}>
                <n.Icon size={19} /> {n.label}
              </button>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => setModal("identity")} style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 14px", borderRadius: 12, border: `1px solid ${C.faint}`, cursor: "pointer", background: anonDefault ? "#E9EBEF" : C.card, color: anonDefault ? "#5B6472" : C.ink, fontSize: 13, fontWeight: 600 }}>
            {anonDefault ? <VenetianMask size={15} /> : <ShieldCheck size={15} />} {anonDefault ? "Anonymous" : "Posting as You"}
          </button>
          <button onClick={() => setModal("safety")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 12, border: "none", cursor: "pointer", background: C.brand, color: "#fff", fontSize: 13.5, fontWeight: 600 }}>
            <LifeBuoy size={16} /> Need support
          </button>
          <button onClick={onExit} className="lnk" style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 12, padding: "4px" }}>← Back to website</button>
        </div>
      </aside>

      {/* main */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        {(view === "group" || view === "thread" || view === "consult") && (
          <div style={{ padding: "20px 32px 0" }}>
            <button onClick={() => setView(view === "thread" ? "group" : view === "consult" ? "experts" : "home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: C.ink, padding: 0, fontSize: 14 }}>
              <ArrowLeft size={18} /> {view === "thread" ? "Back to space" : view === "consult" ? "Back to experts" : "Back to home"}
            </button>
          </div>
        )}
        <div style={{ flex: 1, overflowY: (view === "ai" || view === "consult") ? "hidden" : "auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
          {view === "home" && <WebHome mood={mood} setMood={setMood} posts={posts} openGroup={openGroup} setView={setView} />}
          {view === "group" && <WebGroup group={group} list={posts[gid]} openThread={openThread} toggleSupport={toggleSupport} onCompose={() => setModal("compose")} />}
          {view === "thread" && <WebThread group={group} post={thread} anonDefault={anonDefault} displayName={displayName} toggleSupport={toggleSupport} onReply={(b, a) => addReply(gid, tid, b, a)} />}
          {view === "experts" && <WebExperts onOpen={openConsult} onApply={() => setModal("apply")} />}
          {view === "consult" && <Chat kind="expert" expert={expert} msgs={consults[expertId] || []} typing={typing} onSend={(t) => sendConsult(expertId, t)} onSafety={() => setModal("safety")} />}
          {view === "ai" && <Chat kind="ai" msgs={aiMsgs} loading={aiLoading} error={aiError} onSend={sendAI} onSafety={() => setModal("safety")} />}
        </div>
      </main>

      {modal === "compose" && <Compose group={group} anonDefault={anonDefault} onClose={() => setModal(null)} onSubmit={(b, a) => { addPost(gid, b, a); setModal(null); }} />}
      {modal === "safety" && <Safety onClose={() => setModal(null)} />}
      {modal === "guide" && <Guidelines onClose={() => setModal(null)} />}
      {modal === "identity" && <Identity anonDefault={anonDefault} setAnonDefault={setAnonDefault} onGuide={() => setModal("guide")} onClose={() => setModal(null)} />}
      {modal === "apply" && <ExpertApply onClose={() => setModal(null)} />}
    </div>
  );
}

/* ===================== web home ===================== */
function PageHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h1 className="fd" style={{ fontSize: 30, fontWeight: 600, margin: 0, color: C.ink, letterSpacing: "-.5px" }}>{title}</h1>
      {sub && <p style={{ fontSize: 15, color: C.muted, marginTop: 6 }}>{sub}</p>}
    </div>
  );
}

function WebHome({ mood, setMood, posts, openGroup, setView }) {
  return (
    <div style={{ padding: "26px 32px 48px", maxWidth: 1000, width: "100%" }}>
      <PageHead title="How are you arriving today?" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
        {MOODS.map((m) => { const on = mood === m.k; return (
          <button key={m.k} onClick={() => setMood(on ? null : m.k)} style={{ fontSize: 13.5, padding: "9px 16px", borderRadius: 999, cursor: "pointer", border: `1px solid ${on ? C.brand : C.faint}`, background: on ? C.brand : C.card, color: on ? "#fff" : C.ink, fontWeight: 500 }}>{m.label}</button>
        ); })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 26 }}>
        <button onClick={() => setView("ai")} className="hov" style={{ textAlign: "left", border: "none", cursor: "pointer", borderRadius: 20, padding: "20px 20px", background: "linear-gradient(135deg,#6B5FA8,#9A8CCB)", color: "#fff" }}>
          <Sparkles size={24} />
          <div style={{ fontSize: 17, fontWeight: 600, marginTop: 12 }}>Talk it through with Aria</div>
          <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.85)", marginTop: 4 }}>A caring AI companion, 24/7. Instant &amp; private.</div>
        </button>
        <button onClick={() => setView("experts")} className="hov" style={{ textAlign: "left", border: "none", cursor: "pointer", borderRadius: 20, padding: "20px 20px", background: "linear-gradient(135deg,#3F6B5C,#4E8E7E)", color: "#fff" }}>
          <Stethoscope size={24} />
          <div style={{ fontSize: 17, fontWeight: 600, marginTop: 12 }}>Verified experts &amp; coaches</div>
          <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.85)", marginTop: 4 }}>Confidential help. You stay anonymous.</div>
        </button>
      </div>

      <SectionLabel>Spaces to land in</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
        {GROUPS.map((g) => <GroupCard key={g.id} g={g} count={posts[g.id]?.length || 0} onClick={() => openGroup(g.id)} />)}
      </div>

      <SectionLabel><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Languages size={14} /> Connect in your language</span></SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
        {REGION_GROUPS.map((g) => (
          <button key={g.id} onClick={() => openGroup(g.id)} className="hov" style={{ display: "flex", alignItems: "center", gap: 13, textAlign: "left", background: C.card, border: `1px solid ${C.faint}`, borderRadius: 18, padding: "14px", cursor: "pointer" }}>
            <span style={{ width: 46, height: 46, borderRadius: 13, background: g.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{g.flag}</span>
            <span style={{ flex: 1 }}><span style={{ display: "block", fontSize: 15, fontWeight: 600, color: C.ink }}>{g.name}</span><span style={{ display: "block", fontSize: 12, color: C.muted, marginTop: 2 }}>{g.sub}</span></span>
            <ChevronRight size={16} style={{ color: C.muted }} />
          </button>
        ))}
      </div>
    </div>
  );
}
function SectionLabel({ children }) {
  return <h3 style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".7px", margin: "30px 2px 13px" }}>{children}</h3>;
}
function GroupCard({ g, count, onClick }) {
  return (
    <button onClick={onClick} className="hov" style={{ display: "flex", alignItems: "center", gap: 13, textAlign: "left", background: C.card, border: `1px solid ${C.faint}`, borderRadius: 18, padding: "14px", cursor: "pointer" }}>
      <span style={{ width: 46, height: 46, borderRadius: 13, background: g.bg, color: g.fg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><g.Icon size={22} strokeWidth={1.9} /></span>
      <span style={{ flex: 1, minWidth: 0 }}><span style={{ display: "block", fontSize: 14.5, fontWeight: 600, color: C.ink }}>{g.name}</span><span style={{ display: "block", fontSize: 12, color: C.muted, marginTop: 2 }}>{g.line}</span></span>
      <span style={{ fontSize: 12, color: C.muted }}>{count}</span>
    </button>
  );
}

/* ===================== web group + thread ===================== */
function Avatar({ post, group, size = 34 }) {
  if (post.anon) return <span style={{ width: size, height: size, borderRadius: 999, background: "#E9EBEF", color: "#5B6472", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><VenetianMask size={size * 0.47} /></span>;
  return <span style={{ width: size, height: size, borderRadius: 999, background: group?.bg || C.brandSoft, color: group?.fg || C.brand, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, fontWeight: 600, flexShrink: 0 }}>{post.author.charAt(0).toUpperCase()}</span>;
}
function PostCard({ post, group, onOpen, onSupport }) {
  return (
    <div className="rise" style={{ background: C.card, border: `1px solid ${C.faint}`, borderRadius: 18, padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Avatar post={post} group={group} />
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{post.anon ? "Anonymous" : post.author}</span>
          {post.expert && <VerifiedTag title={post.title} />}
          <span style={{ fontSize: 12, color: C.muted }}>· {post.time} ago</span>
        </div>
      </div>
      <p onClick={onOpen} style={{ fontSize: 14.5, color: "#3a372f", lineHeight: 1.55, cursor: onOpen ? "pointer" : "default", margin: 0 }}>{post.body}</p>
      <div style={{ display: "flex", gap: 8, marginTop: 13 }}>
        <button onClick={onSupport} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, padding: "7px 13px", borderRadius: 999, cursor: "pointer", fontWeight: 500, border: `1px solid ${post.supported ? (group?.fg || C.brand) : C.faint}`, background: post.supported ? (group?.bg || C.brandSoft) : "#fff", color: post.supported ? (group?.fg || C.brand) : C.muted }}><HeartHandshake size={15} /> {post.support}</button>
        {onOpen && <button onClick={onOpen} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, padding: "7px 13px", borderRadius: 999, cursor: "pointer", fontWeight: 500, border: `1px solid ${C.faint}`, background: "#fff", color: C.muted }}><MessageCircle size={15} /> {post.replies.length}</button>}
      </div>
    </div>
  );
}
function WebGroup({ group, list, openThread, toggleSupport, onCompose }) {
  if (!group) return null;
  return (
    <div style={{ padding: "16px 32px 48px", maxWidth: 720, width: "100%", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 13, background: group.bg, borderRadius: 18, padding: "16px 18px", marginBottom: 18 }}>
        <span style={{ width: 46, height: 46, borderRadius: 13, background: "#ffffffcc", color: group.fg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: group.flag ? 22 : undefined }}>{group.flag || <group.Icon size={22} strokeWidth={1.9} />}</span>
        <div><div className="fd" style={{ fontSize: 20, fontWeight: 600, color: C.ink }}>{group.name}</div><p style={{ fontSize: 13, color: "#4a463f", margin: "2px 0 0" }}>{group.line}</p></div>
      </div>
      <button onClick={onCompose} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px dashed ${C.faint}`, borderRadius: 16, padding: "14px 16px", cursor: "pointer", marginBottom: 18, color: C.muted, fontSize: 14.5 }}>
        <Plus size={18} style={{ color: group.fg }} /> {group.id === "vent" ? "Let it out — your name stays hidden" : "Share what's on your mind…"}
      </button>
      <div style={{ display: "grid", gap: 12 }}>
        {list.map((p) => <PostCard key={p.id} post={p} group={group} onOpen={() => openThread(p.id)} onSupport={() => toggleSupport(group.id, p.id)} />)}
      </div>
    </div>
  );
}
function WebThread({ group, post, anonDefault, displayName, toggleSupport, onReply }) {
  const [text, setText] = useState("");
  const [anon, setAnon] = useState(group?.id === "vent" || anonDefault);
  if (!post || !group) return null;
  const send = () => { if (!text.trim()) return; onReply(text.trim(), anon); setText(""); };
  return (
    <div style={{ padding: "16px 32px 48px", maxWidth: 720, width: "100%", margin: "0 auto" }}>
      <PostCard post={post} group={group} onSupport={() => toggleSupport(group.id, post.id)} />
      <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".6px", margin: "22px 4px 12px" }}>{post.replies.length} {post.replies.length === 1 ? "reply" : "replies"}</div>
      <div style={{ display: "grid", gap: 10 }}>
        {post.replies.map((r) => (
          <div key={r.id} className="rise" style={{ display: "flex", gap: 10 }}>
            <Avatar post={r} group={group} size={30} />
            <div style={{ background: C.card, border: `1px solid ${C.faint}`, borderRadius: 14, padding: "10px 14px", flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>{r.anon ? "Anonymous" : r.author}{r.expert && <VerifiedTag title={r.title} />}<span style={{ color: C.muted, fontWeight: 400 }}>· {r.time}</span></div>
              <p style={{ fontSize: 14, color: "#3a372f", lineHeight: 1.5, margin: "3px 0 0" }}>{r.body}</p>
            </div>
          </div>
        ))}
        {post.replies.length === 0 && <p style={{ fontSize: 13.5, color: C.muted, textAlign: "center", padding: "8px 0" }}>No replies yet. A kind word here can matter more than you'd think.</p>}
      </div>
      <div style={{ marginTop: 18, background: C.card, border: `1px solid ${C.faint}`, borderRadius: 16, padding: 14 }}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Offer some support…" rows={2} style={{ width: "100%", border: "none", resize: "none", fontSize: 14.5, color: C.ink, background: "transparent", fontFamily: "inherit", outline: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <button onClick={() => group.id !== "vent" && setAnon(!anon)} disabled={group.id === "vent"} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: anon ? group.fg : C.muted, background: "none", border: "none", cursor: group.id === "vent" ? "default" : "pointer", fontWeight: 500 }}><Lock size={13} /> {anon ? "Anonymous" : `Reply as ${displayName}`}</button>
          <button onClick={send} style={{ display: "flex", alignItems: "center", gap: 6, background: C.brand, color: "#fff", border: "none", borderRadius: 12, padding: "9px 16px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}><Send size={14} /> Send</button>
        </div>
      </div>
    </div>
  );
}

/* ===================== experts ===================== */
function VerifiedTag({ title }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 600, color: C.brand, background: C.brandSoft, borderRadius: 999, padding: "2px 8px" }}><BadgeCheck size={12} /> Verified{title ? ` · ${title}` : ""}</span>;
}
function WebExperts({ onOpen, onApply }) {
  const [cat, setCat] = useState("therapy");
  const list = EXPERTS.filter((e) => e.kind === cat);
  const tabs = [{ k: "therapy", label: "Counselling", Icon: Stethoscope }, { k: "motivation", label: "Motivation", Icon: Sparkles }];
  return (
    <div style={{ padding: "26px 32px 48px", maxWidth: 1000, width: "100%" }}>
      <PageHead title="Verified experts & coaches" />
      <div style={{ background: cat === "motivation" ? "linear-gradient(135deg,#C2853E,#D9A35C)" : "linear-gradient(135deg,#3F6B5C,#4E8E7E)", borderRadius: 20, padding: "20px 22px", color: "#fff", maxWidth: 680 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 600 }}>{cat === "motivation" ? <Sparkles size={18} /> : <Stethoscope size={18} />} {cat === "motivation" ? "Motivation & coaching" : "Confidential expert support"}</div>
        <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.9)", lineHeight: 1.55, marginTop: 8 }}>{cat === "motivation" ? "Verified coaches to help you build momentum, habits and self-belief. They never see your name — only what you share." : "Every expert is identity-verified by Havenn. They only see what you choose to write — never your name or details."}</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, background: "rgba(255,255,255,.16)", borderRadius: 999, padding: "7px 12px", marginTop: 12 }}><Lock size={13} /> You stay anonymous, always</div>
      </div>

      <div style={{ display: "inline-flex", gap: 6, background: C.card, border: `1px solid ${C.faint}`, borderRadius: 13, padding: 4, marginTop: 20 }}>
        {tabs.map((t) => { const on = cat === t.k; return (
          <button key={t.k} onClick={() => setCat(t.k)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 600, background: on ? C.brand : "transparent", color: on ? "#fff" : C.muted }}><t.Icon size={15} /> {t.label}</button>
        ); })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14, marginTop: 20 }}>
        {list.map((e) => (
          <div key={e.id} className="rise" style={{ background: C.card, border: `1px solid ${C.faint}`, borderRadius: 18, padding: "18px" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ width: 48, height: 48, borderRadius: 999, background: e.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600 }}>{e.initials}</span>
              <div><div style={{ fontSize: 15.5, fontWeight: 600, color: C.ink }}>{e.name}</div><div style={{ fontSize: 12.5, color: C.muted }}>{e.title}</div><div style={{ marginTop: 5 }}><VerifiedTag /></div></div>
            </div>
            <p style={{ fontSize: 13.5, color: "#4a463f", lineHeight: 1.45, marginTop: 12 }}>{e.blurb}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>{e.tags.map((t) => <span key={t} style={{ fontSize: 11.5, color: C.brand, background: C.brandSoft, borderRadius: 999, padding: "4px 10px", fontWeight: 500 }}>{t}</span>)}</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 12 }}>{e.langs} · {e.reply}</div>
            <button onClick={() => onOpen(e.id)} style={{ width: "100%", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.brand, color: "#fff", border: "none", borderRadius: 13, padding: "11px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}><Lock size={15} /> Start anonymous chat</button>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px dashed ${C.faint}`, borderRadius: 18, padding: "18px", marginTop: 18, maxWidth: 680 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, display: "flex", alignItems: "center", gap: 7 }}><BadgeCheck size={16} style={{ color: C.brand }} /> Are you a mental health professional?</div>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.45, marginTop: 6 }}>Volunteer to support people anonymously. We verify your credentials; the people you help always stay anonymous to you.</p>
        <button onClick={onApply} style={{ marginTop: 12, background: C.brandSoft, color: C.brand, border: "none", borderRadius: 12, padding: "10px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>Apply to help</button>
      </div>
    </div>
  );
}

/* ===================== chat (AI + expert) ===================== */
function Chat({ kind, expert, msgs, typing, loading, error, onSend, onSafety }) {
  const [text, setText] = useState("");
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing, loading]);
  const ai = kind === "ai";
  if (!ai && !expert) return null;
  const accent = ai ? "#6B5FA8" : C.brand;
  const send = () => { if (!text.trim() || loading) return; onSend(text.trim()); setText(""); };

  const isExpertMsg = (m) => ai ? m.role === "assistant" : m.from === "expert";
  const isMine = (m) => ai ? m.role === "user" : m.from === "you";
  const body = (m) => ai ? m.content : m.body;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, maxWidth: 760, width: "100%", margin: "0 auto" }}>
      <div style={{ background: ai ? "#EFEAF7" : C.brandSoft, padding: "12px 20px", display: "flex", alignItems: "center", gap: 9, margin: "16px 20px 0", borderRadius: 14 }}>
        {ai ? <Sparkles size={15} style={{ color: accent }} /> : <Lock size={15} style={{ color: accent }} />}
        <p style={{ fontSize: 12.5, color: accent, lineHeight: 1.4, margin: 0 }}>{ai ? "Aria is an AI companion — caring, but not a substitute for professional care or a crisis service." : `You're anonymous to ${expert.name}. They can't see your name or details.`}</p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 8px", display: "flex", flexDirection: "column", gap: 11 }}>
        {msgs.map((m, i) => (
          <div key={i} className="rise" style={{ alignSelf: isMine(m) ? "flex-end" : "flex-start", maxWidth: "78%" }}>
            {isExpertMsg(m) && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, marginLeft: 2 }}>
                <span style={{ width: 22, height: 22, borderRadius: 999, background: ai ? "linear-gradient(135deg,#6B5FA8,#9A8CCB)" : expert.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600 }}>{ai ? <Sparkles size={12} /> : expert.initials}</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: accent }}>{ai ? "Aria" : expert.name.split(" ")[0]}</span>{!ai && <BadgeCheck size={13} style={{ color: C.brand }} />}
              </div>
            )}
            <div style={{ whiteSpace: "pre-wrap", background: isMine(m) ? accent : C.card, color: isMine(m) ? "#fff" : "#3a372f", border: isMine(m) ? "none" : `1px solid ${C.faint}`, borderRadius: 16, padding: "12px 15px", fontSize: 14.5, lineHeight: 1.55 }}>{body(m)}</div>
          </div>
        ))}
        {(typing || loading) && (
          <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 7, background: C.card, border: `1px solid ${C.faint}`, borderRadius: 16, padding: "13px 16px" }}>
            <span className="dot" style={{ width: 7, height: 7, borderRadius: 999, background: accent }} /><span className="dot" style={{ width: 7, height: 7, borderRadius: 999, background: accent, animationDelay: ".2s" }} /><span className="dot" style={{ width: 7, height: 7, borderRadius: 999, background: accent, animationDelay: ".4s" }} />
          </div>
        )}
        {error && <p style={{ alignSelf: "center", fontSize: 12.5, color: "#B85C72" }}>{error}</p>}
        <div ref={endRef} />
      </div>
      <div style={{ padding: "10px 20px 18px" }}>
        <button onClick={onSafety} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: C.brand, background: "none", border: "none", cursor: "pointer", margin: "0 auto 8px", fontWeight: 600 }}><LifeBuoy size={13} /> In crisis? Get urgent help</button>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} rows={1} placeholder={ai ? "Tell Aria what's on your mind…" : "Write privately…"} style={{ flex: 1, background: C.card, border: `1px solid ${C.faint}`, borderRadius: 16, padding: "13px 16px", fontSize: 14.5, color: C.ink, resize: "none", fontFamily: "inherit", maxHeight: 120, outline: "none" }} />
          <button onClick={send} disabled={loading || !text.trim()} style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 14, background: (loading || !text.trim()) ? C.faint : accent, color: (loading || !text.trim()) ? C.muted : "#fff", border: "none", cursor: (loading || !text.trim()) ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
}

/* ===================== modals ===================== */
function Overlay({ children, onClose, wide }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(46,43,39,.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="rise" onClick={(e) => e.stopPropagation()} style={{ background: C.bg, borderRadius: 22, padding: "24px 24px", width: "100%", maxWidth: wide ? 460 : 420, maxHeight: "88vh", overflowY: "auto" }}>{children}</div>
    </div>
  );
}
function Compose({ group, anonDefault, onClose, onSubmit }) {
  const forceAnon = group?.id === "vent";
  const [text, setText] = useState("");
  const [anon, setAnon] = useState(forceAnon || anonDefault);
  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}><h3 className="fd" style={{ fontSize: 19, fontWeight: 600, margin: 0 }}>Share in {group?.name}</h3><button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={20} /></button></div>
      <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder={forceAnon ? "Nobody will see your name. Let it out." : "What would you like to set down here?"} style={{ width: "100%", background: C.card, border: `1px solid ${C.faint}`, borderRadius: 14, padding: 14, fontSize: 14.5, color: C.ink, resize: "none", fontFamily: "inherit", lineHeight: 1.5, outline: "none" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
        <button onClick={() => !forceAnon && setAnon(!anon)} style={{ display: "flex", alignItems: "center", gap: 8, background: anon ? C.brandSoft : C.card, border: `1px solid ${anon ? C.brand : C.faint}`, padding: "9px 13px", borderRadius: 999, cursor: forceAnon ? "default" : "pointer", fontSize: 13, color: anon ? C.brand : C.muted, fontWeight: 500 }}><Lock size={14} /> {anon ? "Posting anonymously" : "Post as You"}</button>
        <button onClick={() => text.trim() && onSubmit(text.trim(), anon)} disabled={!text.trim()} style={{ background: text.trim() ? C.brand : C.faint, color: text.trim() ? "#fff" : C.muted, border: "none", borderRadius: 13, padding: "11px 22px", fontSize: 14, fontWeight: 600, cursor: text.trim() ? "pointer" : "default" }}>Share</button>
      </div>
    </Overlay>
  );
}
function Safety({ onClose }) {
  const Line = ({ b, t }) => <div style={{ background: C.card, border: `1px solid ${C.faint}`, borderRadius: 13, padding: "11px 13px" }}><div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{b}</div><div style={{ fontSize: 13, color: C.muted, marginTop: 2, lineHeight: 1.45 }}>{t}</div></div>;
  return (
    <Overlay onClose={onClose}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: C.brandSoft, color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}><LifeBuoy size={24} /></div>
      <h3 className="fd" style={{ fontSize: 21, fontWeight: 600, margin: 0 }}>You don't have to hold this alone</h3>
      <p style={{ fontSize: 14, color: "#4a463f", lineHeight: 1.55, marginTop: 8 }}>If things feel like too much right now, reaching a real person can help. Havenn is peer support, not a substitute for care in a crisis.</p>
      <div style={{ display: "grid", gap: 9, marginTop: 16 }}>
        <Line b="If you may be in immediate danger" t="Contact your local emergency number right away." />
        <Line b="Talk to someone now (India)" t="Tele-MANAS, the national mental-health helpline: 14416 or 1-800-891-4416, free, 24/7." />
        <Line b="Reach a person you trust" t="A friend, family member, or doctor — even a short message counts." />
      </div>
      <p style={{ fontSize: 11.5, color: C.muted, marginTop: 14, lineHeight: 1.5 }}>In the live product these resources adapt to each person's country automatically.</p>
      <button onClick={onClose} style={{ width: "100%", marginTop: 16, background: C.brand, color: "#fff", border: "none", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Okay</button>
    </Overlay>
  );
}
function Guidelines({ onClose }) {
  const rules = [["Kindness first", "Everyone here is having a hard time with something. Respond the way you'd want someone to respond to you."], ["Support, not advice", "Share experience, not diagnoses. Don't tell people what to do unless they ask."], ["Protect privacy", "What's shared here stays here. Never identify another member outside Havenn."], ["Not a replacement for care", "Havenn sits alongside professional help, it doesn't replace it."]];
  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><h3 className="fd" style={{ fontSize: 21, fontWeight: 600, margin: 0 }}>How we keep this safe</h3><button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={20} /></button></div>
      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {rules.map(([t, d], i) => (
          <div key={i} style={{ display: "flex", gap: 11 }}><span className="fd" style={{ width: 26, height: 26, borderRadius: 999, background: C.brandSoft, color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 600 }}>{i + 1}</span><div><div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{t}</div><div style={{ fontSize: 13, color: C.muted, marginTop: 2, lineHeight: 1.45 }}>{d}</div></div></div>
        ))}
      </div>
      <button onClick={onClose} style={{ width: "100%", marginTop: 18, background: C.brand, color: "#fff", border: "none", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Got it</button>
    </Overlay>
  );
}
function Identity({ anonDefault, setAnonDefault, onGuide, onClose }) {
  const Opt = ({ active, onClick, icon, title, desc }) => (
    <button onClick={onClick} style={{ display: "flex", gap: 12, textAlign: "left", width: "100%", background: active ? C.brandSoft : C.card, border: `1.5px solid ${active ? C.brand : C.faint}`, borderRadius: 16, padding: "14px", cursor: "pointer" }}>
      <span style={{ width: 38, height: 38, borderRadius: 11, background: active ? C.brand : "#EFEBE2", color: active ? "#fff" : C.muted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</span>
      <span><span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14.5, fontWeight: 600, color: C.ink }}>{title}{active && <span style={{ fontSize: 10.5, fontWeight: 600, color: C.brand, background: "#fff", borderRadius: 999, padding: "2px 7px" }}>ON</span>}</span><span style={{ display: "block", fontSize: 12.5, color: C.muted, marginTop: 3, lineHeight: 1.4 }}>{desc}</span></span>
    </button>
  );
  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}><h3 className="fd" style={{ fontSize: 19, fontWeight: 600, margin: 0 }}>How you show up</h3><button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={20} /></button></div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.45, marginBottom: 14 }}>Pick your default. You can still flip it on any single post before you share.</p>
      <div style={{ display: "grid", gap: 10 }}>
        <Opt active={!anonDefault} onClick={() => setAnonDefault(false)} icon={<ShieldCheck size={19} />} title="Post as You" desc="Your name appears on what you share, so people can recognise you across the community." />
        <Opt active={anonDefault} onClick={() => setAnonDefault(true)} icon={<VenetianMask size={19} />} title="Stay anonymous" desc="Everything you post shows only “Anonymous”. Your name is never attached." />
      </div>
      <button onClick={onGuide} style={{ width: "100%", marginTop: 12, background: "none", border: "none", color: C.brand, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><ShieldCheck size={14} /> See our care rules</button>
      <button onClick={onClose} style={{ width: "100%", marginTop: 6, background: C.brand, color: "#fff", border: "none", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Done</button>
    </Overlay>
  );
}
function ExpertApply({ onClose }) {
  const [done, setDone] = useState(false);
  const [name, setName] = useState(""); const [title, setTitle] = useState(""); const [reg, setReg] = useState("");
  const ok = name.trim() && title.trim() && reg.trim();
  const Field = ({ label, val, setVal, ph }) => (
    <div style={{ marginTop: 12 }}><label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: C.ink, marginBottom: 6 }}>{label}</label><input value={val} onChange={(e) => setVal(e.target.value)} placeholder={ph} style={{ width: "100%", background: C.card, border: `1.5px solid ${C.faint}`, borderRadius: 13, padding: "12px 14px", fontSize: 14.5, color: C.ink, fontFamily: "inherit", outline: "none" }} /></div>
  );
  return (
    <Overlay onClose={onClose} wide>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}><h3 className="fd" style={{ fontSize: 19, fontWeight: 600, margin: 0 }}>{done ? "Application received" : "Apply to support"}</h3><button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={20} /></button></div>
      {done ? (
        <div className="rise"><div style={{ width: 52, height: 52, borderRadius: 16, background: C.brandSoft, color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", margin: "12px 0 14px" }}><BadgeCheck size={26} /></div><p style={{ fontSize: 14, color: "#4a463f", lineHeight: 1.55 }}>Thank you, {name.split(" ")[0]}. Our team will verify your credentials privately, usually within a few days. Once approved, you'll be able to support people who always remain anonymous to you.</p><button onClick={onClose} style={{ width: "100%", marginTop: 18, background: C.brand, color: "#fff", border: "none", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Done</button></div>
      ) : (
        <>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.45 }}>We verify every professional before they can offer support. Your details are checked privately and never shown to the people you help.</p>
          <Field label="Full name" val={name} setVal={setName} ph="Dr. Priya Nair" />
          <Field label="Professional title" val={title} setVal={setTitle} ph="Clinical Psychologist" />
          <Field label="Licence / registration number" val={reg} setVal={setReg} ph="e.g. RCI A-12345" />
          <div style={{ background: C.card, border: `1px solid ${C.faint}`, borderRadius: 13, padding: "11px 13px", marginTop: 14, display: "flex", gap: 9 }}><ShieldCheck size={15} style={{ color: C.brand, flexShrink: 0, marginTop: 1 }} /><p style={{ fontSize: 12, color: C.muted, lineHeight: 1.45, margin: 0 }}>I confirm I'm a licensed/registered mental health professional and agree to Havenn's care and safeguarding standards.</p></div>
          <button onClick={() => ok && setDone(true)} disabled={!ok} style={{ width: "100%", marginTop: 16, background: ok ? C.brand : C.faint, color: ok ? "#fff" : C.muted, border: "none", borderRadius: 14, padding: 14, fontSize: 14.5, fontWeight: 600, cursor: ok ? "pointer" : "default" }}>Submit for verification</button>
        </>
      )}
    </Overlay>
  );
}
