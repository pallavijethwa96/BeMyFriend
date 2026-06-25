const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("./config");

// ---------- Access tokens (stateless JWT) ----------
function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, staff: !!user.is_staff },
    config.jwtSecret,
    { expiresIn: config.accessTtl }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtSecret); // throws if invalid/expired
}

// ---------- Refresh tokens (opaque, stored hashed) ----------
function newRefreshToken() {
  const token = crypto.randomBytes(48).toString("base64url");
  const hash = sha256(token);
  return { token, hash };
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function refreshExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + config.refreshTtlDays);
  return d;
}

// ---------- OTP codes ----------
function generateOtp() {
  return String(crypto.randomInt(100000, 1000000)); // 6 digits
}

async function hashOtp(code) {
  return bcrypt.hash(code, 10);
}

async function verifyOtp(code, hash) {
  return bcrypt.compare(code, hash);
}

function otpExpiry() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + config.otpTtlMin);
  return d;
}

// ---------- Middleware ----------
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: { code: "no_token", message: "Authentication required." } });
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, staff: !!payload.staff };
    next();
  } catch {
    return res.status(401).json({ error: { code: "invalid_token", message: "Session expired or invalid." } });
  }
}

function requireStaff(req, res, next) {
  if (!req.user || !req.user.staff) {
    return res.status(403).json({ error: { code: "forbidden", message: "Staff access only." } });
  }
  next();
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  newRefreshToken,
  sha256,
  refreshExpiry,
  generateOtp,
  hashOtp,
  verifyOtp,
  otpExpiry,
  requireAuth,
  requireStaff,
};
