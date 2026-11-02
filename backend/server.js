
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const xpRoutes = require("./routes/xpRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: [
    "https://velop-beryl.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());

// Request Logging
app.use((req, res, next) => {
  console.log("Request:", req.method, req.url);
  console.log("Origin:", req.headers.origin);

  next();
});

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VELOOP backend is running!",
  });
});

// Database Health Check
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS current_time, current_database() AS database"
    );

    res.status(200).json({
      success: true,
      message: "VELOOP backend and PostgreSQL are connected!",
      database: result.rows[0].database,
      serverTime: result.rows[0].current_time,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// XP Routes
app.use("/api/xp", xpRoutes);

// Protected Profile Route
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

    return res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`VELOOP backend running on port ${PORT}`);
});
