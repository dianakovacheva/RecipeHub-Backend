const { Schema, model, Types } = require("mongoose");

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      minlength: [10, "The comment must be at least 10 characters long."],
      maxlength: [50, "The comment must be no longer than 50 characters."],
    },
    commentOwner: {
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
