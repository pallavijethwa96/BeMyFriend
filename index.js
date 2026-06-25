const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const config = require("./config");

const authRoutes = require("./routes/auth").router;
const accountRoutes = require("./routes/account").router;
const communityRoutes = require("./routes/community").router;
const ariaRoutes = require("./routes/aria").router;

const app = express();
app.set("trust proxy", 1);
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Rate limit the auth endpoints (OTP abuse protection)
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });
app.use(["/auth/start", "/auth/verify"], authLimiter);

// Mount routers (each defines full paths, e.g. /auth/start, /groups, ...)
app.use(authRoutes);
app.use(accountRoutes);
app.use(communityRoutes);
app.use(ariaRoutes);

// 404
app.use((_req, res) => res.status(404).json({ error: { code: "not_found", message: "Route not found." } }));

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: { code: "server_error", message: "Something went wrong." } });
});

app.listen(config.port, () => {
  console.log(`BeMyFriend API listening on http://localhost:${config.port} (${config.env})`);
});

module.exports = app;
