const { User, Recipe, Comment } = require("../models");

function newComment(text, userId, recipesId) {
  return Comment.create({ text, userId, recipesId }).then((comment) => {
    return Promise.all([
      User.updateOne(
        { _id: userId },
        {
          $push: { userCommentsList: recipesId._id },
          $addToSet: { commentedRecipe: recipesId },
        }
      ),
      Recipe.findByIdAndUpdate(
        { _id: recipesId },
        {
          $push: { commentsList: comment._id },
          $addToSet: { subscribers: userId },
        },
        { new: true }
      ),
    ]);
  });
}

// function getLatestsPosts(req, res, next) {
//   const limit = Number(req.query.limit) || 0;

//   postModel
//     .find()
//     .sort({ created_at: -1 })
//     .limit(limit)
//     .populate("themeId userId")
//     .then((posts) => {
//       res.status(200).json(posts);
//     })
//     .catch(next);
// }

function createComment(req, res, next) {
  const { recipesId } = req.params;
  const { _id: userId } = req.user;
  const { commentText } = req.body;

  newPost(commentText, userId, recipesId)
    .then(([_, updatedRecipe]) => res.status(200).json(updatedRecipe))
    .catch(next);
}

function editComment(req, res, next) {
  const { commentId } = req.params;
  const { commentText } = req.body;
  const { _id: userId } = req.user;

  // if the userId is not the same as this one of the post, the post will not be updated
  Comment.findOneAndUpdate(
    { _id: commentId, userId },
    { text: commentText },
    { new: true }
  )
    .then((updatedComment) => {
      if (updatedComment) {
        res.status(200).json(updatedComment);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  const { commentId, recipesId } = req.params;
  const { _id: userId } = req.user;

  Promise.all([
    Comment.findOneAndDelete({ _id: commentId, userId }),
    User.findOneAndUpdate(
      { _id: userId },
      { $pull: { userCommentsList: commentId } }
    ),
    Recipe.findOneAndUpdate(
      { _id: recipesId },
      { $pull: { commentsList: commentId } }
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

module.exports = {
  //   getLatestsPosts,
  newComment,
  createComment,
  editComment,
  deleteComment,
};
