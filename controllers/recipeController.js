const { Recipe, User, Comment } = require("../models");

// Create Recipe
function createRecipe(req, res) {
  const {
    title,
    summary,
    imageURL,
    preparationMinutes,
    cookingMinutes,
    servings,
    pricePerServing,
    dishTypes,
    extendedIngredients,
    analyzedInstructions,
  } = req.body;
  const { _id: userId } = req.user;

  parsedIngredients = JSON.parse(extendedIngredients);
  parsedSteps = JSON.parse(analyzedInstructions);

  let convertedImageUrl = imageURL;
  if (imageURL == "") {
    convertedImageUrl = undefined;
  }

  Recipe.create({
    title,
    summary,
    imageURL: convertedImageUrl,
    preparationMinutes,
    cookingMinutes,
    servings,
    pricePerServing,
    dishTypes,
    extendedIngredients: parsedIngredients,
    analyzedInstructions: parsedSteps,
    author: [userId],
  })
    .then((createdRecipe) => {
      if (createdRecipe) {
        return Promise.all([
          User.updateOne(
            { _id: userId },
            {
              $push: { userRecipesList: createdRecipe._id },
            }
          ),
        ]).then(res.status(200).json(createdRecipe));
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Get All Recipes
function getAllRecipes(req, res) {
  Recipe.find()
    .populate({ path: "author", select: "firstName lastName" })
    .then((foundRecipes) => {
      if (foundRecipes) {
        res.status(200).json(foundRecipes);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Get Recipe by ID
function getRecipeById(req, res, next) {
  const { recipeId } = req.params;

  Recipe.findById(recipeId)
    .populate({ path: "author", select: "firstName lastName" })
    .then((foundRecipe) => {
      if (foundRecipe) {
        res.status(200).json(foundRecipe);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Edit Recipe
function editRecipe(req, res) {
  const { recipeId } = req.params;
  const { _id: userId } = req.user;
  const {
    title,
    summary,
    imageURL,
    preparationMinutes,
    cookingMinutes,
    servings,
    pricePerServing,
    dishTypes,
    extendedIngredients,
    analyzedInstructions,
  } = req.body;

  parsedIngredients = JSON.parse(extendedIngredients);
  parsedSteps = JSON.parse(analyzedInstructions);

  let convertedImageUrl = imageURL;
  if (imageURL == "") {
    convertedImageUrl = undefined;
  }

  // if the userId is not the same as this one of the post, the post will not be updated
  Recipe.findOneAndUpdate(
    { _id: recipeId, author: userId },
    {
      title: title,
      summary: summary,
      imageURL: convertedImageUrl,
      preparationMinutes: preparationMinutes,
      cookingMinutes: cookingMinutes,
      servings: servings,
      pricePerServing: pricePerServing,
      dishTypes: dishTypes,
      extendedIngredients: parsedIngredients,
      analyzedInstructions: parsedSteps,
    }
  )
    .then((updatedRecipe) => {
      if (updatedRecipe) {
        res.status(200).json(updatedRecipe);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Delete Recipe
function deleteRecipe(req, res) {
  const { recipeId } = req.params;
  const { _id: userId } = req.user;

  Promise.all([
    Recipe.findOneAndDelete({ _id: recipeId, author: userId }),
    User.findOneAndUpdate(
      { _id: userId },
      { $pull: { userRecipesList: recipeId, userSavedRecipes: recipeId } }
    ),
    Comment.findOneAndDelete(
      { commentedRecipe: recipeId },
      { $pull: { commentedRecipe: recipeId } }
    ),
  ])
    .then(([deletedOne, _]) => {
      if (deletedOne) {
        res.status(200).json(deletedOne);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Save Recipe
function saveRecipe(req, res, next) {
  const { recipeId } = req.params;
  const { _id: userId } = req.user;

  return Promise.all([
    Recipe.updateOne(
      { _id: recipeId },
      { $addToSet: { savesList: userId } },
      { new: true }
    ),
    User.updateOne(
      { _id: userId },
      {
        $push: { userSavedRecipes: recipeId },
      }
    ),
  ])
    .then(() => {
      res.status(200).json({ message: "Recipe saved successfully!" });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Remove Saved Recipe
function removeSavedRecipe(req, res, next) {
  const { recipeId } = req.params;
  const { _id: userId } = req.user;

  return Promise.all([
    Recipe.updateOne(
      { _id: recipeId },
      { $pull: { savesList: userId } },
      { new: true }
    ),
    User.updateOne(
      { _id: userId },
      {
        $pull: { userSavedRecipes: recipeId },
      }
    ),
  ])
    .then(() => {
      res.status(200).json({ message: "Recipe removed successfully!" });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Get Recipe Comments
function getRecipeComments(req, res, next) {
  const { recipeId } = req.params;

  Comment.find({ commentedRecipe: recipeId })
    .populate({ path: "commentAuthor", select: "firstName lastName" })
    .then((foundComments) => {
      if (foundComments) {
        res.status(200).json(foundComments);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

function search(req, res, next) {
  const query = req.query.search;
  const regExpQuery = new RegExp(query, "i"); // 'i' flag for case-insensitive search

  Recipe.find({
    $or: [
      { title: regExpQuery },
      { summary: regExpQuery },
      { "extendedIngredients.name": regExpQuery },
    ],
  })
    .populate({ path: "author", select: "firstName lastName" })
    .then((foundRecipes) => {
      if (foundRecipes) {
        res.status(200).json(foundRecipes);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  editRecipe,
  deleteRecipe,
  saveRecipe,
  removeSavedRecipe,
  getRecipeComments,
  search,
};
