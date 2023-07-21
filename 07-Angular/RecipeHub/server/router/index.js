const router = require("express").Router();
const auth = require("./auth");
const recipes = require("./recipes");
const saves = require("./saves");
const { authController } = require("../controllers");

router.post("auth/register", authController.register);
router.post("auth/login", authController.login);
router.post("auth/logout", authController.logout);

router.use("/auth", auth);
router.use("/recipes", recipes);
router.use("/saves", saves);

module.exports = router;
