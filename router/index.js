const router = require("express").Router();
const users = require("./users");
const auth = require("./auth");
const recipes = require("./recipes");

router.use("/users", users);
router.use("/auth", auth);
router.use("/recipes", recipes);

module.exports = router;
