const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const URL_PATTERN =
  /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/i;

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    require: true,
  },
  author: {
    type: ObjectId,
    ref: "User",
  },
  preparationMinutes: {
    type: Number,
    required: true,
  },
  cookingMinutes: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  pricePerServing: {
    type: Number,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => URL_PATTERN.test(value),
      message: "Invalid URL ",
    },
  },
  summary: {
    type: String,
    trim: true,
    required: true,
  },
  dishTypes: [
    {
      type: String,
      trim: true,
      required: true,
    },
  ],
  extendedIngredients: [
    {
      name: {
        type: String,
        trim: true,
        required: true,
      },
      measures: {
        metric: {
          amount: {
            type: Number,
            required: true,
          },
          unitLong: {
            type: String,
            trim: true,
            required: true,
          },
        },
      },
    },
  ],
  analyzedInstructions: [
    {
      steps: {
        number: {
          type: Number,
          required: true,
        },
        step: {
          type: String,
          trim: true,
          required: true,
        },
      },
    },
  ],
  likes: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  // a blog post can have multiple comments, so it should be in a array.
  // all comments info should be kept in this array of this blog post.
  comments: [
    {
      type: ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Recipe", recipeSchema);
