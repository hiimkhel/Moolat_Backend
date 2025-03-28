const express = require("express");
const { submitTest, getTest, getChildTestResults } = require("../controllers/testControllers");

const router = express.Router();

router.post("/submit", submitTest);
router.get("/:childId", getTest);
router.get("/results/:childId", getChildTestResults);

module.exports = router; 