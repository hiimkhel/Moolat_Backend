const express = require("express");
const { logoutUser, signUpParent} = require("../controllers/authControllers");

const router = express.Router();

router.post("/signup", signUpParent);
router.post("/logout", logoutUser);

module.exports = router;