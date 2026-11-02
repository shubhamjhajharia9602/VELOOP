const pool = require("../config/db");

// Get logged-in user's XP and XP history
const getXP = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userResult = await pool.query(
      "SELECT id, name, total_xp FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const historyResult = await pool.query(
      `SELECT id, xp_earned, activity, created_at
       FROM user_xp_history
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      totalXP: userResult.rows[0].total_xp,
      history: historyResult.rows,
    });
  } catch (error) {
    console.error("Get XP error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch XP",
    });
  }
};

// Earn XP
const earnXP = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.userId;
    const { amount, activity } = req.body || {};

    if (
      !Number.isInteger(amount) ||
      amount <= 0 ||
      amount > 1000 ||
      typeof activity !== "string" ||
      activity.trim().length === 0 ||
      activity.trim().length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid XP amount (1-1000) and activity",
      });
    }

    await client.query("BEGIN");

    const userResult = await client.query(
      "SELECT id FROM users WHERE id = $1 FOR UPDATE",
      [userId]
    );

    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await client.query(
      "UPDATE users SET total_xp = total_xp + $1 WHERE id = $2",
      [amount, userId]
    );

    const historyResult = await client.query(
      `INSERT INTO user_xp_history (user_id, xp_earned, activity)
       VALUES ($1, $2, $3)
       RETURNING id, xp_earned, activity, created_at`,
      [userId, amount, activity.trim()]
    );

    const totalResult = await client.query(
      "SELECT total_xp FROM users WHERE id = $1",
      [userId]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "XP earned successfully",
      earned: historyResult.rows[0],
      totalXP: totalResult.rows[0].total_xp,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Earn XP error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update XP",
    });
  } finally {
    client.release();
  }
};

// Daily Check-in
const dailyCheckin = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.userId;
    const xpAmount = 10;

    await client.query("BEGIN");

    // Verify user and lock the row
    const userResult = await client.query(
      "SELECT id, total_xp FROM users WHERE id = $1 FOR UPDATE",
      [userId]
    );

    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Allow only one check-in per user per database date
    const checkinResult = await client.query(
      `INSERT INTO daily_checkins (user_id, checkin_date, xp_earned)
       VALUES ($1, CURRENT_DATE, $2)
       ON CONFLICT (user_id, checkin_date) DO NOTHING
       RETURNING id, checkin_date, xp_earned`,
      [userId, xpAmount]
    );

    if (checkinResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(409).json({
        success: false,
        message: "You have already checked in today!",
      });
    }

    // Add check-in XP to user's total
    const totalResult = await client.query(
      `UPDATE users
       SET total_xp = total_xp + $1
       WHERE id = $2
       RETURNING total_xp`,
      [xpAmount, userId]
    );

    // Save check-in in XP history
    await client.query(
      `INSERT INTO user_xp_history (user_id, xp_earned, activity)
       VALUES ($1, $2, $3)`,
      [userId, xpAmount, "daily_checkin"]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Daily check-in successful!",
      xpEarned: xpAmount,
      totalXP: totalResult.rows[0].total_xp,
      checkinDate: checkinResult.rows[0].checkin_date,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Daily check-in error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Daily check-in failed",
    });
  } finally {
    client.release();
  }
};

module.exports = { getXP, earnXP, dailyCheckin };
