const fs = require("fs");
const path = require("path");
const pool = require("../src/db");

(async () => {
  const schema = fs.readFileSync(
    path.join(__dirname, "schema.sql"),
    "utf8"
  );

  await pool.query(schema);
  console.log("Database initialized successfully.");
  await pool.end();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
