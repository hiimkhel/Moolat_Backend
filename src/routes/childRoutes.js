const express = require("express");
const { registerChild, getChildProfile, getChildProgress } = require("../controllers/childControllers");
const router = express.Router();

router.get("/:childId", getChildProfile);
router.get("/progress/:childId", getChildProgress);
router.post("/register", registerChild);

module.exports = router;