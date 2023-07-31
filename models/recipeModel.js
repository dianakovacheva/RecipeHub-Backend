const { Schema, model, Types } = require("mongoose");

const IMAGE_URL_PATTERN =
  /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|bmp|svg)/;

const recipeSchema = new Schema(
  {
    recipeApiId: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      require: true,
      minlength: [2, "The title must be at least 2 characters long."],
      maxlength: [100, "The title must be no longer than 100 characters."],
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
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
    imageURL: {
      type: String,
      required: true,
      validate: {
        validator: (value) => IMAGE_URL_PATTERN.test(value),
        message: "Invalid URL.",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: true,
      minlength: [5, "The summary must be at least 5 characters long."],
      maxlength: [1000, "The summary must be no longer than 1000 characters."],
    },
    dishTypes: [
      {
        type: [String],
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
            unitShort: {
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
        steps: [
          {
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
                2,
                "The step's description must be at least 2 characters long.",
              ],
              // maxlength: [
              //   1000,
              //   "The step's description must be no longer than 1000 characters.",
              // ],
            },
          },
        ],
      },
    ],
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
