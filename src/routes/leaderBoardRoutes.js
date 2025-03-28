const express = require("express");
const { getLeaderboard } = require("../controllers/leaderboardControllers");

const router = express.Router();

router.get("/", getLeaderboard);

module.exports = router;