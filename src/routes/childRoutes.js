const express = require("express");
const { registerChild, getChildProfile } = require("../controllers/childControllers");
const router = express.Router();

router.get("/:childId", getChildProfile);
router.post("/register", registerChild);

module.exports = router;