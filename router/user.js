const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const { auth } = require("../utils");

router.get("/profile", auth(), authController.getProfileInfo);
router.put("/profile", auth(), authController.editProfileInfo);
router.get("/recipes", auth(), authController.getUserRecipesList);
router.get("/saved-recipes", auth(), authController.getUserSavedRecipesList);
router.get("/comments", auth(), authController.getUserCommentsList);

module.exports = router;
