const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // each comment can only relates to one blog, so it's not in array
  recipe: {
    type: ObjectId,
    ref: "Recipe",
  },
});

module.exports = mongoose.model("Comment", commentSchema);
