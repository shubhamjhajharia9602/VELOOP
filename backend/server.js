
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
  console.log("REQUEST RECEIVED:", req.method, req.originalUrl);
  console.log("ORIGIN:", req.headers.origin);
  next();
});

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VELOOP backend is running!",
  });
});

// Test Route
app.get("/test", (req, res) => {
  res.status(200).send("VELOOP TEST OK");
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

// 404 Handler
app.use((req, res) => {
  console.log("ROUTE NOT FOUND:", req.method, req.originalUrl);

  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`VELOOP backend running on port ${PORT}`);
  console.log("TEST ROUTE: GET /test");
  console.log("HEALTH ROUTE: GET /api/health");
});
