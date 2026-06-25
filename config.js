require("dotenv").config();

const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  env: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "dev-insecure-secret",
  accessTtl: process.env.ACCESS_TTL || "15m",
  refreshTtlDays: parseInt(process.env.REFRESH_TTL_DAYS || "30", 10),
  otpTtlMin: parseInt(process.env.OTP_TTL_MIN || "10", 10),
  otpMaxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || "5", 10),
  minAge: parseInt(process.env.MIN_AGE || "16", 10),
  ai: {
    url: process.env.AI_API_URL || "https://api.anthropic.com/v1/messages",
    key: process.env.AI_API_KEY || "",
    model: process.env.AI_MODEL || "claude-sonnet-4-6",
  },
};

module.exports = config;
