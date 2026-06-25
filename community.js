const express = require("express");
const { query } = require("../db");
const { requireAuth } = require("../auth");

const router = express.Router();

// GET /groups
router.get("/groups", requireAuth, async (req, res, next) => {
  try {
    const rows = (await query(
      `SELECT slug, name, kind, tagline, language, is_anonymous_only,
              (SELECT count(*) FROM posts p WHERE p.group_id = g.id AND p.status = 'active') AS post_count
       FROM groups g ORDER BY sort_order`
    )).rows;
    res.json({ groups: rows });
  } catch (e) { next(e); }
});

// GET /groups/:slug
router.get("/groups/:slug", requireAuth, async (req, res, next) => {
  try {
    const g = (await query(`SELECT slug, name, kind, tagline, language, is_anonymous_only FROM groups WHERE slug = $1`, [req.params.slug])).rows[0];
    if (!g) return res.status(404).json({ error: { code: "not_found", message: "Group not found." } });
    res.json({ group: g });
  } catch (e) { next(e); }
});

// GET /groups/:slug/posts?cursor=&limit=
router.get("/groups/:slug/posts", requireAuth, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 50);
    const cursor = req.query.cursor ? new Date(req.query.cursor) : null;
    const g = (await query(`SELECT id FROM groups WHERE slug = $1`, [req.params.slug])).rows[0];
    if (!g) return res.status(404).json({ error: { code: "not_found", message: "Group not found." } });

    const rows = (await query(
      `SELECT p.id, p.body, p.is_anonymous, p.support_count, p.reply_count, p.created_at,
              CASE WHEN p.is_anonymous THEN 'Anonymous' ELSE u.display_name END AS author,
              (s.user_id IS NOT NULL) AS supported
       FROM posts p
       JOIN users u ON u.id = p.author_id
       LEFT JOIN post_supports s ON s.post_id = p.id AND s.user_id = $2
       WHERE p.group_id = $1 AND p.status = 'active'
         AND p.author_id NOT IN (SELECT blocked_id FROM user_blocks WHERE blocker_id = $2)
         AND ($3::timestamptz IS NULL OR p.created_at < $3)
       ORDER BY p.created_at DESC
       LIMIT $4`,
      [g.id, req.user.id, cursor, limit]
    )).rows;

    const nextCursor = rows.length === limit ? rows[rows.length - 1].created_at : null;
    res.json({ posts: rows, nextCursor });
  } catch (e) { next(e); }
});

// POST /groups/:slug/posts  { body, isAnonymous }
router.post("/groups/:slug/posts", requireAuth, async (req, res, next) => {
  try {
    const { body, isAnonymous } = req.body;
    if (!body || !body.trim()) return res.status(422).json({ error: { code: "empty", message: "Write something first." } });
    const g = (await query(`SELECT id, is_anonymous_only FROM groups WHERE slug = $1`, [req.params.slug])).rows[0];
    if (!g) return res.status(404).json({ error: { code: "not_found", message: "Group not found." } });
    const anon = g.is_anonymous_only ? true : !!isAnonymous;
    const post = (await query(
      `INSERT INTO posts (group_id, author_id, body, is_anonymous) VALUES ($1, $2, $3, $4)
       RETURNING id, body, is_anonymous, support_count, reply_count, created_at`,
      [g.id, req.user.id, body.trim(), anon]
    )).rows[0];
    res.status(201).json({ post: { ...post, author: anon ? "Anonymous" : undefined, supported: false } });
  } catch (e) { next(e); }
});

// GET /posts/:id  (post + replies)
router.get("/posts/:id", requireAuth, async (req, res, next) => {
  try {
    const post = (await query(
      `SELECT p.id, p.body, p.is_anonymous, p.support_count, p.reply_count, p.created_at,
              CASE WHEN p.is_anonymous THEN 'Anonymous' ELSE u.display_name END AS author,
              (s.user_id IS NOT NULL) AS supported
       FROM posts p JOIN users u ON u.id = p.author_id
       LEFT JOIN post_supports s ON s.post_id = p.id AND s.user_id = $2
       WHERE p.id = $1 AND p.status = 'active'`,
      [req.params.id, req.user.id]
    )).rows[0];
    if (!post) return res.status(404).json({ error: { code: "not_found", message: "Post not found." } });

    const replies = (await query(
      `SELECT r.id, r.body, r.is_anonymous, r.created_at,
              CASE WHEN r.is_anonymous THEN 'Anonymous' ELSE u.display_name END AS author
       FROM replies r JOIN users u ON u.id = r.author_id
       WHERE r.post_id = $1 AND r.status = 'active'
         AND r.author_id NOT IN (SELECT blocked_id FROM user_blocks WHERE blocker_id = $2)
       ORDER BY r.created_at ASC`,
      [req.params.id, req.user.id]
    )).rows;

    res.json({ post, replies });
  } catch (e) { next(e); }
});

// DELETE /posts/:id  (author or staff)
router.delete("/posts/:id", requireAuth, async (req, res, next) => {
  try {
    const post = (await query(`SELECT author_id FROM posts WHERE id = $1`, [req.params.id])).rows[0];
    if (!post) return res.status(404).json({ error: { code: "not_found", message: "Post not found." } });
    if (post.author_id !== req.user.id && !req.user.staff) return res.status(403).json({ error: { code: "forbidden", message: "Not allowed." } });
    await query(`UPDATE posts SET status = 'removed' WHERE id = $1`, [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// POST /posts/:id/support  (idempotent)
router.post("/posts/:id/support", requireAuth, async (req, res, next) => {
  try {
    await query(`INSERT INTO post_supports (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [req.params.id, req.user.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// DELETE /posts/:id/support
router.delete("/posts/:id/support", requireAuth, async (req, res, next) => {
  try {
    await query(`DELETE FROM post_supports WHERE post_id = $1 AND user_id = $2`, [req.params.id, req.user.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// POST /posts/:id/replies  { body, isAnonymous }
router.post("/posts/:id/replies", requireAuth, async (req, res, next) => {
  try {
    const { body, isAnonymous } = req.body;
    if (!body || !body.trim()) return res.status(422).json({ error: { code: "empty", message: "Write something first." } });
    const exists = (await query(`SELECT id FROM posts WHERE id = $1 AND status = 'active'`, [req.params.id])).rows[0];
    if (!exists) return res.status(404).json({ error: { code: "not_found", message: "Post not found." } });
    const reply = (await query(
      `INSERT INTO replies (post_id, author_id, body, is_anonymous) VALUES ($1, $2, $3, $4)
       RETURNING id, body, is_anonymous, created_at`,
      [req.params.id, req.user.id, body.trim(), !!isAnonymous]
    )).rows[0];
    res.status(201).json({ reply });
  } catch (e) { next(e); }
});

// DELETE /replies/:id  (author or staff)
router.delete("/replies/:id", requireAuth, async (req, res, next) => {
  try {
    const r = (await query(`SELECT author_id FROM replies WHERE id = $1`, [req.params.id])).rows[0];
    if (!r) return res.status(404).json({ error: { code: "not_found", message: "Reply not found." } });
    if (r.author_id !== req.user.id && !req.user.staff) return res.status(403).json({ error: { code: "forbidden", message: "Not allowed." } });
    await query(`UPDATE replies SET status = 'removed' WHERE id = $1`, [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = { router };
