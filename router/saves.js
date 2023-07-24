const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { recipeController } = require("../controllers");

// middleware that is specific to this router

router.put("/recipes/details/:recipeId", auth(), recipeController.saveRecipe);

module.exports = router;
