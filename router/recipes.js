const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { recipeController, commentController } = require("../controllers");

// middleware that is specific to this router

// Recipe router
router.post("/create-recipe", auth(), recipeController.createRecipe);
router.put("/details/:recipeId/edit", auth(), recipeController.editRecipe);
router.put("/details/:recipeId/save", auth(), recipeController.saveRecipe);
router.delete(
  "/details/:recipeId/delete",
  auth(),
  recipeController.deleteRecipe
);
router.get("/details/:recipeId", recipeController.getRecipeById);

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

router.get("/", recipeController.getAllRecipes);

module.exports = router;
