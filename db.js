const { Pool } = require("pg");
const config = require("./config");

const pool = new Pool({ connectionString: config.databaseUrl });

pool.on("error", (err) => {
  console.error("Unexpected PG pool error", err);
});

// Simple query helper. Use `query(text, params)` everywhere.
async function query(text, params) {
  return pool.query(text, params);
}

// For transactions: const client = await getClient(); try { ... } finally { client.release(); }
async function getClient() {
  return pool.connect();
}

module.exports = { pool, query, getClient };
