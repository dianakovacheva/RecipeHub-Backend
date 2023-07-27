const router = require("express").Router();
const users = require("./users");
const auth = require("./auth");

router.use("/users", users);
router.use("/auth", auth);

// router.use("/recipes", recipes);
// router.use("/saved-recipes", saves);

module.exports = router;
