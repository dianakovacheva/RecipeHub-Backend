const { Schema, model, Types } = require("mongoose");

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      minlength: [2, "The comment must be at least 2 characters long."],
      maxlength: [500, "The comment must be no longer than 500 characters."],
    },
    commentAuthor: {
      type: Types.ObjectId,
      ref: "User",
    },
    commentedRecipe: {
      type: Types.ObjectId,
      ref: "Recipe",
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
