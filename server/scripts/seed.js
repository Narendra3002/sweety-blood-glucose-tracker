const bcrypt = require("bcrypt");
const pool = require("../src/db");

(async () => {
  const passwordHash = await bcrypt.hash("DemoPassword123", 10);

  const userResult = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (email)
     DO UPDATE SET name = EXCLUDED.name,
                   password_hash = EXCLUDED.password_hash
     RETURNING id`,
    ["Demo User", "demo@sweety.com", passwordHash]
  );

  const userId = userResult.rows[0].id;

  await pool.query(
    "DELETE FROM readings WHERE user_id = $1",
    [userId]
  );

  const readings = [
    ["2026-11-07", "Morning", 95],
    ["2026-11-07", "After breakfast", 128],
    ["2026-11-07", "After lunch", 142],
    ["2026-11-07", "After dinner", 119],
    ["2026-11-06", "Morning", 101],
    ["2026-11-06", "After dinner", 135],
    ["2026-10-20", "Morning", 98],
    ["2026-10-20", "After lunch", 131]
  ];

  for (const [date, slot, value] of readings) {
    await pool.query(
      `INSERT INTO readings (user_id, reading_date, slot, value)
       VALUES ($1, $2, $3, $4)`,
      [userId, date, slot, value]
    );
  }

  console.log("Seed complete.");
  console.log("Demo email: demo@sweety.com");
  console.log("Demo password: DemoPassword123");

  await pool.end();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
