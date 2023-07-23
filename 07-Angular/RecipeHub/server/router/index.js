const router = require("express").Router();
const auth = require("./auth");
const recipes = require("./recipes");
const saves = require("./saves");
const { authController } = require("../controllers");

router.use("/auth", auth);
router.post("auth/register", authController.register);
router.post("auth/login", authController.login);
router.post("auth/logout", authController.logout);
router.get("auth/user-profile", authController.getProfileInfo);
router.put("auth/edit-user-profile", authController.editProfileInfo);

router.use("/recipes", recipes);
router.use("/saves", saves);

module.exports = router;
