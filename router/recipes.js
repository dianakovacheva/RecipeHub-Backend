const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { recipeController } = require("../controllers");

// middleware that is specific to this router

// Routes
// router.get("/", homeController);
// router.get("/", authController);
router.get("/recipes", recipeController.getAllRecipes);
router.post("/create-recipe", auth(), recipeController.createRecipe);

router.get("/recipe-details/:recipeId", recipeController.getRecipeById);
// If author of the recipe
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

// router.get("/recipe-details/:recipeId", recipeController.likeRecipe);
// router.post("/:recipeId", auth(), recipeController.addCommentToRecipe);
//TODO: Add router for "edit comment"
//TODO: Add router for "delete comment"

// router.get('/my-trips/:id/reservations', auth(), themeController.getReservations);

// router.use(function (req, res) {
//   res.status(404).render("404", {
//     title: "404 Page Not Found",
//     user: req.user,
//   });
// });

module.exports = router;
