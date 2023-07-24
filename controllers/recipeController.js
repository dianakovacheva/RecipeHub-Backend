const { Recipe, User, Comment } = require("../models");
const { newComment } = require("./commentController");

function getAllRecipes(req, res, next) {
  Recipe.find()
    .populate("userId")
    .then((recipes) => res.json(recipes))
    .catch(next);
}

function getRecipeById(req, res, next) {
  const { recipeId } = req.params;

  Recipe.findById(recipeId)
    .populate({
      path: "commentsList",
      populate: {
        path: "userId",
      },
    })
    .then((foundRecipe) => res.json(foundRecipe))
    .catch(next);
}

function createRecipe(req, res, next) {
  const { recipeName, commentText } = req.body;
  const { _id: userId } = req.user;

  Recipe.create({ recipeName, userId, recipeOwner: [userId] })
    .then((createdRecipe) => {
      newComment(commentText, userId, createdRecipe._id).then(
        ([_, updatedRecipe]) => res.status(200).json(updatedRecipe)
      );
    })
    .catch(next);
}

function editRecipe(req, res, next) {
  const { recipeId } = req.params;
  const { recipeTitle } = req.body;
  const { _id: userId } = req.user;

  // if the userId is not the same as this one of the post, the post will not be updated
  Recipe.findOneAndUpdate(
    { _id: recipeId, userId },
    { title: recipeTitle },
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
  const { recipeId, commentId } = req.params;
  const { _id: userId } = req.user;

  Promise.all([
    Recipe.findOneAndDelete({ _id: recipeId, userId }),
    User.findOneAndUpdate(
      { _id: userId },
      { $pull: { userRecipesList: recipeId } }
    ),
    Comment.findOneAndUpdate(
      { _id: commentId },
      { $pull: { commentedRecipe: recipeId } }
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

function saveRecipe(req, res, next) {
  const { recipesId } = req.params;
  const { _id: userId } = req.user;

  console.log("save");

  Recipe.updateOne(
    { _id: recipesId },
    { $addToSet: { saves: userId } },
    { new: true }
  )
    .then(() => res.status(200).json({ message: "Saved successful!" }))
    .catch(next);
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  editRecipe,
  deleteRecipe,
  saveRecipe,
};
