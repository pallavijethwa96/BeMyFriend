// Applies db/schema.sql to the configured database.
// Usage: npm run migrate
const fs = require("fs");
const path = require("path");
const { pool } = require("./db");

async function main() {
  const sqlPath = path.join(__dirname, "..", "db", "schema.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  console.log("Applying schema from", sqlPath);
  await pool.query(sql);
  console.log("✓ Schema applied.");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
