const express = require("express");
const { query, getClient } = require("../db");
const { requireAuth } = require("../auth");
const { publicUser } = require("./auth");

const router = express.Router();

// GET /me
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const u = (await query(`SELECT * FROM users WHERE id = $1`, [req.user.id])).rows[0];
    if (!u) return res.status(404).json({ error: { code: "not_found", message: "User not found." } });
    const langs = (await query(`SELECT language FROM user_languages WHERE user_id = $1`, [u.id])).rows.map((r) => r.language);
    const goals = (await query(`SELECT goal FROM user_goals WHERE user_id = $1`, [u.id])).rows.map((r) => r.goal);
    res.json({ user: { ...publicUser(u), ageRange: u.age_range, sex: u.sex, languages: langs, goals } });
  } catch (e) { next(e); }
});

// PATCH /me  (profile / anonymity)
router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const { displayName, anonDefault, country } = req.body;
    const u = (await query(
      `UPDATE users SET
         display_name = COALESCE($2, display_name),
         anon_default = COALESCE($3, anon_default),
         country      = COALESCE($4, country)
       WHERE id = $1 RETURNING *`,
      [req.user.id, displayName ?? null, anonDefault ?? null, country ?? null]
    )).rows[0];
    res.json({ user: publicUser(u) });
  } catch (e) { next(e); }
});

// PATCH /me/onboarding  (save sign-up profile)
router.patch("/me/onboarding", requireAuth, async (req, res, next) => {
  try {
    const { displayName, country, ageRange, sex, anonDefault, languages = [], goals = [] } = req.body;
    const client = await getClient();
    try {
      await client.query("BEGIN");
      const u = (await client.query(
        `UPDATE users SET display_name = COALESCE($2, display_name), country = $3,
            age_range = $4, sex = $5, anon_default = COALESCE($6, anon_default),
            onboarded_at = COALESCE(onboarded_at, now())
         WHERE id = $1 RETURNING *`,
        [req.user.id, displayName ?? null, country ?? null, ageRange ?? null, sex ?? null, anonDefault ?? null]
      )).rows[0];
      await client.query(`DELETE FROM user_languages WHERE user_id = $1`, [u.id]);
      await client.query(`DELETE FROM user_goals WHERE user_id = $1`, [u.id]);
      for (const lang of languages) await client.query(`INSERT INTO user_languages (user_id, language) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [u.id, lang]);
      for (const goal of goals) await client.query(`INSERT INTO user_goals (user_id, goal) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [u.id, goal]);
      await client.query("COMMIT");
      res.json({ user: publicUser(u) });
    } catch (e) { await client.query("ROLLBACK"); throw e; } finally { client.release(); }
  } catch (e) { next(e); }
});

// POST /me/consent  { items: [{ doc, version }] }
router.post("/me/consent", requireAuth, async (req, res, next) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    for (const it of items) {
      if (!["terms", "privacy", "guidelines"].includes(it.doc)) continue;
      await query(`INSERT INTO user_consents (user_id, doc, version) VALUES ($1, $2, $3)`, [req.user.id, it.doc, it.version || "1.0"]);
    }
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// DELETE /me  (soft delete + scrub PII)
router.delete("/me", requireAuth, async (req, res, next) => {
  try {
    await query(
      `UPDATE users SET status = 'deleted', deleted_at = now(),
         email = NULL, phone = NULL, display_name = 'Deleted user'
       WHERE id = $1`,
      [req.user.id]
    );
    await query(`UPDATE auth_sessions SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL`, [req.user.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// POST /me/checkins  { mood }
router.post("/me/checkins", requireAuth, async (req, res, next) => {
  try {
    const { mood } = req.body;
    if (!mood) return res.status(422).json({ error: { code: "missing", message: "mood required." } });
    await query(`INSERT INTO mood_checkins (user_id, mood) VALUES ($1, $2)`, [req.user.id, mood]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// GET /crisis-resources?country=India  (public)
router.get("/crisis-resources", async (req, res, next) => {
  try {
    const country = (req.query.country || "").toString();
    const national = country
      ? (await query(`SELECT name, phone, url, hours FROM crisis_resources WHERE country = $1 ORDER BY sort_order`, [country])).rows
      : [];
    const global = (await query(`SELECT name, phone, url, hours FROM crisis_resources WHERE is_global = true ORDER BY sort_order`)).rows;
    res.json({ country: country || null, national, global });
  } catch (e) { next(e); }
});

// POST /reports  { targetType, targetId, reason }
router.post("/reports", requireAuth, async (req, res, next) => {
  try {
    const { targetType, targetId, reason } = req.body;
    if (!["post", "reply", "user", "aria_message"].includes(targetType) || !targetId) {
      return res.status(422).json({ error: { code: "bad_target", message: "Invalid report target." } });
    }
    await query(
      `INSERT INTO reports (reporter_id, target_type, target_id, reason) VALUES ($1, $2, $3, $4)`,
      [req.user.id, targetType, targetId, reason || null]
    );
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

// Blocks
router.get("/blocks", requireAuth, async (req, res, next) => {
  try {
    const rows = (await query(`SELECT blocked_id FROM user_blocks WHERE blocker_id = $1`, [req.user.id])).rows;
    res.json({ blocked: rows.map((r) => r.blocked_id) });
  } catch (e) { next(e); }
});

router.post("/blocks", requireAuth, async (req, res, next) => {
  try {
    const { blockedUserId } = req.body;
    if (!blockedUserId || blockedUserId === req.user.id) return res.status(422).json({ error: { code: "bad_block", message: "Invalid user." } });
    await query(`INSERT INTO user_blocks (blocker_id, blocked_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [req.user.id, blockedUserId]);
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

router.delete("/blocks/:userId", requireAuth, async (req, res, next) => {
  try {
    await query(`DELETE FROM user_blocks WHERE blocker_id = $1 AND blocked_id = $2`, [req.user.id, req.params.userId]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = { router };
