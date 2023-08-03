const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { recipeController, commentController } = require("../controllers");

// middleware that is specific to this router

// Recipe router

router.post("/create-recipe", auth(), recipeController.createRecipe);
router.get("/recipe-details/:recipeId", recipeController.getRecipeById);
router.put(
  "/recipe-details/:recipeId/edit",
  auth(),
  recipeController.editRecipe
);
router.delete(
  "/recipe-details/:recipeId/delete",
  auth(),
  recipeController.deleteRecipe
);

// Comment router
router.post(
  "/recipe-details/:recipeId",
  auth(),
  commentController.createComment
);
router.put(
  "/recipe-details/:recipeId",
  auth(),
  commentController.createComment
);
router.put(
  "/recipe-details/:recipeId/comments/:commentId",
  auth(),
  commentController.editComment
);
router.delete(
  "/recipe-details/:recipeId/comments/:commentId",
  auth(),
  commentController.deleteComment
);

router.get("/", recipeController.getAllRecipes);

module.exports = router;
