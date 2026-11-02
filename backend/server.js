require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const xpRoutes = require("./routes/xpRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://velop-beryl.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options(/.*/, cors({
  origin: "https://velop-beryl.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());

// Request logging (development only)
app.use((req, res, next) => {
  console.log("Request:", req.method, req.url);
  console.log("Content-Type:", req.headers["content-type"]);

  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Request Body:", {
      ...req.body,
      password: req.body.password ? "[HIDDEN]" : undefined,
    });
  }

  next();
});

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VELOOP backend is running!",
  });
});

// Database health check
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

// Signup and Login routes
app.use("/api/auth", authRoutes);

// XP routes
app.use("/api/xp", xpRoutes);

// Protected profile route
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

// Start server
app.listen(PORT, () => {
  console.log(`VELOOP backend running at http://localhost:${PORT}`);
});