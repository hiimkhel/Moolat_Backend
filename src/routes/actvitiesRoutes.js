const express = require("express");
const { getQuiz, getDragAndDrop, getCognitiveChallenges } = require("../controllers/activitiesControllers");

const router = express.Router();

router.get("/quiz/:exerciseId", getQuiz);
router.get("/drag-and-drop/:exerciseId", getDragAndDrop);
router.get("/cognitive-challenges/:exerciseId", getCognitiveChallenges);

module.exports = router;