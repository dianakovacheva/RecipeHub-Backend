const { recipeModel } = require("../models/recipeModel");

async function getAllRecipes(req, res, next) {
  return await recipeModel
    .find({})
    .lean()
    .populate("userId")
    .then((allRecipes) => res.json(allRecipes))
    .catch(next);
}

async function getRecipeById(req, res, next) {
  const { recipeId } = req.params; //TODO: Adjust the recipe ID info

  return await recipeModel
    .findById(recipeId) //TODO: Adjust the recipe ID info
    .lean()
    .populate({
      populate: {
        path: "userId",
      },
    })
    .then((foundRecipe) => {
      if (foundRecipe) {
        res.status(200).json(foundRecipe);
      } else {
        res.status(404).json({ message: "Recipe not found" });
      }
    })
    .catch(next);
}

async function createRecipe(req, res, next) {
  const recipe = new recipeModel({
    title: req.body.title,
    author: req.body.title,
    preparationMinutes: req.body.preparationMinutes,
    cookingMinutes: req.body.cookingMinutes,
    servings: req.body.servings,
    pricePerServing: req.body.pricePerServing,
    image: req.body.image, //TODO: Adjust this part of the recipe model
    summary: req.body.summary,
    dishTypes: req.body.dishTypes, //TODO: Adjust this part of the recipe model
    extendedIngredients: req.body.extendedIngredients,
    analyzedInstructions: req.body.analyzedInstructions,
    likes: req.body.likes,
    comments: req.body.comments,
  });

  const { _id: userId } = req.user;

  return await recipeModel
    .create({
      recipe,
      userId,
      likes: [userId],
      comments: [userId],
    })
    .then((createdRecipe) => {
      res.status(200).json(createdRecipe);
    })
    .catch(next);
}

async function editRecipe(req, res, next) {
  const { recipeId } = req.params;
  const existingRecipe = await recipeModel.findById(recipeId);
  const { _id: userId } = req.user;

  // Update recipe fields
  existingRecipe.title = req.body.title;
  existingRecipe.author = req.body.author;
  existingRecipe.preparationMinutes = req.body.preparationMinutes;
  existingRecipe.cookingMinutes = req.body.cookingMinutes;
  existingRecipe.servings = req.body.servings;
  existingRecipe.pricePerServing = req.body.pricePerServing;
  existingRecipe.image = req.body.image; //TODO: Adjust this part of the recipe model
  existingRecipe.summary = req.body.summary;
  existingRecipe.dishTypes = req.body.dishTypes; //TODO: Adjust this part of the recipe model
  existingRecipe.extendedIngredients = req.body.extendedIngredients;
  existingRecipe.analyzedInstructions = req.body.analyzedInstructions;
  existingRecipe.likes = req.body.likes;
  existingRecipe.comments = req.body.comments;

  const updatedRecipe = await existingRecipe.save();

  // if the userId is not the same as this one of the post, the post will not be updated
  return await recipeModel
    .findOneAndUpdate(
      { _id: recipeId, userId },
      { recipe: updatedRecipe }, //TODO: Adjust the content of the updated recipe
      { new: true }
    )
    .then((updatedRecipe) => {
      if (updatedRecipe) {
        res.status(200).json(updatedRecipe);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch(next);
}

function deleteRecipe(req, res, next) {
  const { recipeId } = req.params;
  const { _id: userId } = req.user;

  Promise.all([
    recipeModel.findOneAndDelete({ _id: recipeId, userId }),
    userModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { recipes: recipeId } }
    ),
    recipeModel.findOneAndUpdate(
      { _id: recipeId },
      { $pull: { createdRecipes: recipeId } }
    ),
  ])
    .then(([deletedOne, _, __]) => {
      if (deletedOne) {
        res.status(200).json(deletedOne);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch(next);
}

async function likeRecipe(req, res, next) {
  const { recipeId } = req.params;
  const { _id: userId } = req.user;

  console.log("like");

  return await recipeModel
    .updateOne(
      { _id: recipeId },
      { $addToSet: { likes: userId } },
      { new: true }
    )
    .then(() => res.status(200).json({ message: "Liked successful!" }))
    .catch(next);
}

async function addCommentToRecipe(req, res, next) {
  const recipeId = req.params.recipeId;
  const commentText = req.body;
  const { _id: userId } = req.user;

  return await recipeModel
    .findByIdAndUpdate(
      { _id: recipeId },
      { comment: commentText },
      { $addToSet: { comments: userId } },
      { new: true }
    )
    .then((commentedRecipe) => {
      res.status(200).json(commentedRecipe);
    })
    .catch(next);
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  editRecipe,
  deleteRecipe,
  likeRecipe,
  addCommentToRecipe,
};
