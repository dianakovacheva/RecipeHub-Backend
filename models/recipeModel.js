const { Schema, model, Types } = require("mongoose");

const URL_PATTERN =
  /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/i;

const recipeSchema = new Schema(
  {
    recipeApiID: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      require: true,
      minlength: [2, "The title must be at least 2 characters long."],
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
      minlength: [2, "The author must be at least 2 characters long."],
    },
    preparationMinutes: {
      type: Number,
      required: true,
      min: [1, "The preparation minutes must begin from 1."],
    },
    cookingMinutes: {
      type: Number,
      required: true,
      min: [1, "The cooking minutes must begin from 1."],
    },
    servings: {
      type: Number,
      required: true,
      min: [1, "The servings must begin from 1."],
    },
    pricePerServing: {
      type: Number,
      min: [0, "The price per serving must be a positive number."],
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (value) => URL_PATTERN.test(value),
        message: "Invalid URL.",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: true,
      minlength: [5, "The summary must be at least 5 characters long."],
      maxlength: [100, "The summary must be no longer than 100 characters."],
    },
    dishTypes: [
      {
        type: String,
        trim: true,
        required: true,
        minlength: [2, "The dish type must be at least 2 characters long."],
        enum: ["lunch", "main course", "main dish", "dinner"],
      },
    ],
    extendedIngredients: [
      {
        name: {
          type: String,
          trim: true,
          required: true,
          minlength: [
            2,
            "The ingredient's name must be at least 2 characters long.",
          ],
        },
        measures: {
          metric: {
            amount: {
              type: Number,
              required: true,
              min: [0, "The amount must be a positive number."],
            },
            unitLong: {
              type: String,
              trim: true,
              required: true,
              minlength: [1, "The unit must be at least 1 character long."],
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
            min: [1, "The number of the steps must begin from 1."],
          },
          step: {
            type: String,
            trim: true,
            required: true,
            minlength: [
              10,
              "The step's description must be at least 10 characters long.",
            ],
            maxlength: [
              100,
              "The step's description must be no longer than 100 characters.",
            ],
          },
        },
      },
    ],
    recipeOwner: {
      type: Types.ObjectId,
      ref: "User",
    },
    commentsList: {
      type: [Types.ObjectId],
      ref: "Comment",
    },
    saves: [
      {
        type: [Types.ObjectId],
        ref: "User",
      },
    ],
  },
  { timestamps: { createdAt: "created_at" } }
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
