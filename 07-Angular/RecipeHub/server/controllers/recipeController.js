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
  const { recipeId } = req.params;

  return await recipeModel
    .findById(recipeId)
    .lean()
    .populate({
      populate: {
        path: "userId",
      },
    })
    .then((recipe) => res.json(recipe))
    .catch(next);
}

async function createRecipe(req, res, next) {
  const { recipeName, recipeText } = req.body; //TODO: Add needed info for a recipe
  const { _id: userId } = req.user;

  return await recipeModel
    .create({ recipeName, recipeText, userId, subscribers: [userId] })
    .then((createdRecipe) => {
      res.status(200).json(createdRecipe);
    })
    .catch(next);
}

async function editRecipe(req, res, next) {
  const { recipeId } = req.params;
  const { recipeText } = req.body; //TODO: Add needed info for a recipe
  const { _id: userId } = req.user;

  // if the userId is not the same as this one of the post, the post will not be updated
  return await recipeModel
    .findOneAndUpdate(
      { _id: recipeId, userId },
      { text: recipeText },
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
      { $pull: { recipes: recipeId } }
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

async function commentRecipe(req, res, next) {
  const recipeId = req.params.recipeId;
  const commentText = req.body;
  const { _id: userId } = req.user;

  return await recipeModel
    .findByIdAndUpdate(
      { _id: recipeId },
      { comment: commentText },
      { $addToSet: { subscribers: userId } },
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
  commentRecipe,
};
