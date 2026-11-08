const router = require("express").Router();
const pool = require("../db");
const { requireAuth } = require("../auth");

async function getStats(userId, from, to) {
  const result = await pool.query(
    `SELECT
       COUNT(*)::int AS count,
       MIN(value)::int AS lowest,
       MAX(value)::int AS highest,
       ROUND(AVG(value)::numeric, 1)::float AS average
     FROM readings
     WHERE user_id = $1
       AND reading_date BETWEEN $2 AND $3`,
    [userId, from, to]
  );

  return result.rows[0];
}

router.get("/daily", requireAuth, async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date is required." });
  }

  try {
    const stats = await getStats(req.user.id, date, date);

    const result = await pool.query(
      `SELECT id, reading_date, slot, value
       FROM readings
       WHERE user_id = $1 AND reading_date = $2
       ORDER BY id`,
      [req.user.id, date]
    );

    res.json({
      type: "daily",
      date,
      ...stats,
      readings: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

router.get("/month-to-date", requireAuth, async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date is required." });
  }

  try {
    const from = `${date.slice(0, 7)}-01`;
    const stats = await getStats(req.user.id, from, date);

    res.json({
      type: "month-to-date",
      from,
      to: date,
      ...stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

router.get("/monthly", requireAuth, async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date is required." });
  }

  try {
    const selected = new Date(`${date}T00:00:00`);

    const firstCurrent = new Date(
      selected.getFullYear(),
      selected.getMonth(),
      1
    );

    const lastPrevious = new Date(
      firstCurrent.getFullYear(),
      firstCurrent.getMonth(),
      0
    );

    const firstPrevious = new Date(
      lastPrevious.getFullYear(),
      lastPrevious.getMonth(),
      1
    );

    const format = value =>
      `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;

    const from = format(firstPrevious);
    const to = format(lastPrevious);

    const stats = await getStats(req.user.id, from, to);

    res.json({
      type: "monthly",
      from,
      to,
      ...stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;