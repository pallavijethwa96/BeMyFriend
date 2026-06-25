const express = require("express");
const { query } = require("../db");
const { requireAuth } = require("../auth");
const config = require("../config");

const router = express.Router();

const ARIA_SYSTEM = `You are Aria, a warm, caring AI companion inside BeMyFriend, a peer-support mental wellness service. You give people a kind, private, non-judgmental space to talk through whatever is on their mind.

How you help:
- Listen with genuine warmth and empathy. Validate feelings and reflect back what you hear.
- Ask gentle, open questions. Let the person lead.
- Offer simple, evidence-informed coping ideas as soft suggestions, not instructions.
- Keep replies short and human: usually 2 to 5 sentences. Avoid long lists and clinical jargon.

Boundaries: You are an AI companion, not a therapist, doctor, or crisis service. Never diagnose or give medical advice. You are a supplement to human support, never a replacement.

Safety (critical): If the person mentions suicide, self-harm, wanting to die, harming someone, or being in immediate danger, respond with calm compassion. Encourage them to reach out right now to a crisis line or local emergency services, and to a trusted person. Use the local crisis line provided below if there is one; otherwise direct them to findahelpline.com (primary) or befrienders.org (backup). Never provide or discuss methods or means. Never minimize what they're feeling.

Tone: gentle, grounded, hopeful. Never preachy or robotic.`;

const HELPLINES = {
  "India": { name: "Tele-MANAS", num: "14416" },
  "United States": { name: "988 Suicide & Crisis Lifeline", num: "988" },
  "United Kingdom": { name: "Samaritans", num: "116 123" },
  "Ireland": { name: "Samaritans", num: "116 123" },
  "Australia": { name: "Lifeline", num: "13 11 14" },
  "Canada": { name: "988 Suicide Crisis Helpline", num: "988" },
  "New Zealand": { name: "Need to talk? helpline", num: "1737" },
  "Germany": { name: "Telefonseelsorge", num: "0800 111 0 111" },
};

function crisisNote(country) {
  const h = country && HELPLINES[country];
  return h
    ? `Context — the person is in ${country}. National crisis line: ${h.name}: ${h.num} (24/7). Also findahelpline.com / befrienders.org.`
    : `Context — the person's country is unknown. Direct them to findahelpline.com (primary) or befrienders.org (backup).`;
}

async function getOrCreateConversation(userId) {
  let conv = (await query(`SELECT id FROM aria_conversations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`, [userId])).rows[0];
  if (!conv) conv = (await query(`INSERT INTO aria_conversations (user_id) VALUES ($1) RETURNING id`, [userId])).rows[0];
  return conv.id;
}

// GET /aria/conversation
router.get("/aria/conversation", requireAuth, async (req, res, next) => {
  try {
    const convId = await getOrCreateConversation(req.user.id);
    const messages = (await query(
      `SELECT role, content, created_at FROM aria_messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
      [convId]
    )).rows;
    res.json({ conversationId: convId, messages });
  } catch (e) { next(e); }
});

// POST /aria/messages  { message }
router.post("/aria/messages", requireAuth, async (req, res, next) => {
  try {
    const message = (req.body.message || "").trim();
    if (!message) return res.status(422).json({ error: { code: "empty", message: "Type a message." } });
    if (!config.ai.key) return res.status(503).json({ error: { code: "ai_unconfigured", message: "AI provider not configured." } });

    const convId = await getOrCreateConversation(req.user.id);
    const user = (await query(`SELECT country FROM users WHERE id = $1`, [req.user.id])).rows[0];

    // store the user's message
    await query(`INSERT INTO aria_messages (conversation_id, role, content) VALUES ($1, 'user', $2)`, [convId, message]);

    // build history for the model
    const history = (await query(
      `SELECT role, content FROM aria_messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
      [convId]
    )).rows;

    const resp = await fetch(config.ai.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": config.ai.key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.ai.model,
        max_tokens: 1000,
        system: ARIA_SYSTEM + "\n\n" + crisisNote(user?.country),
        messages: history.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
    const data = await resp.json();
    const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim() || "I'm here with you.";

    await query(`INSERT INTO aria_messages (conversation_id, role, content) VALUES ($1, 'assistant', $2)`, [convId, reply]);
    res.json({ reply });
  } catch (e) { next(e); }
});

// DELETE /aria/conversation
router.delete("/aria/conversation", requireAuth, async (req, res, next) => {
  try {
    await query(`DELETE FROM aria_conversations WHERE user_id = $1`, [req.user.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = { router };
