const express = require("express");
const {
  getXP,
  earnXP,
  dailyCheckin,
} = require("../controllers/xpController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getXP);
router.post("/earn", authMiddleware, earnXP);
router.post("/checkin", authMiddleware, dailyCheckin);

module.exports = router;