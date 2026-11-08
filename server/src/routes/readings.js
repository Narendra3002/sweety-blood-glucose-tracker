const router = require("express").Router();
const pool = require("../db");
const { requireAuth } = require("../auth");
const { validateReading } = require("../utils");

router.get("/", requireAuth, async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit || "20", 10), 1),
      100
    );
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      "SELECT COUNT(*)::int AS total FROM readings WHERE user_id = $1",
      [req.user.id]
    );

    const result = await pool.query(
      `SELECT id, reading_date, slot, value, created_at, updated_at
       FROM readings
       WHERE user_id = $1
       ORDER BY reading_date DESC, id DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    const total = countResult.rows[0].total;

    res.json({
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const validationError = validateReading(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const { date, slot, value } = req.body;

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM readings
       WHERE user_id = $1
       AND reading_date = $2`,
      [req.user.id, date]
    );

    if (countResult.rows[0].count >= 4) {
      return res.status(400).json({
        message: "You can add only 4 readings per day."
      });
    }

    const duplicate = await pool.query(
      `SELECT id FROM readings
       WHERE user_id = $1 AND reading_date = $2 AND slot = $3`,
      [req.user.id, date, slot]
    );

    if (duplicate.rowCount) {
      return res.status(400).json({
        message: `You already have a ${slot} reading for this date.`
      });
    }

    const result = await pool.query(
      `INSERT INTO readings (user_id, reading_date, slot, value)
       VALUES ($1, $2, $3, $4)
       RETURNING id, reading_date, slot, value`,
      [req.user.id, date, slot, Number(value)]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  const validationError = validateReading(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const { date, slot, value } = req.body;

  try {
    const owned = await pool.query(
      "SELECT id FROM readings WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    if (!owned.rowCount) {
      return res.status(404).json({ message: "Reading not found." });
    }

    const duplicate = await pool.query(
      `SELECT id FROM readings
       WHERE user_id = $1
       AND reading_date = $2
       AND slot = $3
       AND id <> $4`,
      [req.user.id, date, slot, req.params.id]
    );

    if (duplicate.rowCount) {
      return res.status(400).json({
        message: `You already have a ${slot} reading for this date.`
      });
    }

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM readings
       WHERE user_id = $1
       AND reading_date = $2
       AND id <> $3`,
      [req.user.id, date, req.params.id]
    );

    if (countResult.rows[0].count >= 4) {
      return res.status(400).json({
        message: "You can add only 4 readings per day."
      });
    }

    const result = await pool.query(
      `UPDATE readings
       SET reading_date = $1, slot = $2, value = $3, updated_at = NOW()
       WHERE id = $4 AND user_id = $5
       RETURNING id, reading_date, slot, value, updated_at`,
      [date, slot, Number(value), req.params.id, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM readings
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [req.params.id, req.user.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        message: "Reading not found."
      });
    }

    res.json({ message: "Reading deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;