const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const { auth } = require("../utils");

router.get("/user-profile", auth(), authController.getProfileInfo);
router.put("/user-profile", auth(), authController.editProfileInfo);

module.exports = router;
