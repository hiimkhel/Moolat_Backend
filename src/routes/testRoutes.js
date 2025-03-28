const express = require("express");

const router = express.Router();

router.post("/submit", submitTest);
router.get("/history/:childId", getChildResults);

module.exports = {submitTest, getChildResults}; 