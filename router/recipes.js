const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { recipeController, commentController } = require("../controllers");

// middleware that is specific to this router

// Recipe router
router.get("/", recipeController.getAllRecipes);
router.post("/create-recipe", auth(), recipeController.createRecipe);
router.get("/details/:recipeId", recipeController.getRecipeById);
// router.get("/recipes/details/:recipeId/edit", recipeController.editRecipe);
router.put("/details/:recipeId/edit", recipeController.editRecipe);
router.delete("/details/:recipeId/delete", recipeController.deleteRecipe);

// Comment router
router.post("/details/:recipeId", auth(), commentController.createComment);
router.put("/details/:recipeId", auth(), commentController.createComment);
router.put(
  "/details/:recipeId/comments/:commentId",
  auth(),
  commentController.editComment
);
router.delete(
  "/details/:recipeId/comments/:commentId",
  auth(),
  commentController.deleteComment
);

module.exports = router;
