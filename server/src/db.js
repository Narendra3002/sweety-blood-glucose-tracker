const { Pool, types } = require("pg");
require("dotenv").config();

// Keep PostgreSQL DATE values as YYYY-MM-DD strings.
// This prevents timezone shifts when sending dates to the frontend.
types.setTypeParser(1082, value => value);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;