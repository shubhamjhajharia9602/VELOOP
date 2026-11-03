
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const xpRoutes = require("./routes/xpRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ================= CORS =================

app.use(cors({
  origin: [
    "https://veloop-beryl.vercel.app",
    "http://localhost:5173"
  ]
}));

app.options(/.*/, cors());

// ================= MIDDLEWARE =================
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ================= HOME =================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "VELOOP backend is running!",
  });
});

// ================= TEST =================
app.get("/test", (req, res) => {
  res.status(200).send("VELOOP TEST OK");
});

// ================= DATABASE HEALTH =================
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS current_time, current_database() AS database"
    );

    res.status(200).json({
      success: true,
      message: "Backend and PostgreSQL connected!",
      database: result.rows[0].database,
      serverTime: result.rows[0].current_time,
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// ================= AUTH ROUTES =================
app.use("/api/auth", authRoutes);

// ================= XP ROUTES =================
app.use("/api/xp", xpRoutes);

// ================= PROFILE =================
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, total_xp, created_at
       FROM users
       WHERE id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Profile error:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`VELOOP backend running on port ${PORT}`);
});
