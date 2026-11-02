
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  console.error("Unexpected database error:", err.message);
});

pool.query("SELECT NOW()")
  .then(() => console.log("✅ PostgreSQL connected successfully!"))
  .catch((err) => {
  console.error("❌ PostgreSQL connection failed:", err);
  console.error("Error code:", err.code);
  console.error("Error message:", err.message);
});

module.exports = pool;
