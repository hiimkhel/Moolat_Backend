const express = require("express");
const { usePowerUps, getPowerUps } = require("../controllers/powerUpControllers");

const router = express.Router();

router.post("/use", usePowerUps);
router.get("/", getPowerUps);

module.exports = router;