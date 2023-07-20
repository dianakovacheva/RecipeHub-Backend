const { Schema, model, Types } = require("mongoose");

const URL_PATTERN =
  /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/i;

const animalSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "The name should be at least 2 characters long"],
  },
  years: {
    type: Number,
    required: true,
    min: [1, "The years should begin from 1"],
    max: [100, "The years should not be a number bigger than 100"],
  },
  kind: {
    type: String,
    required: true,
    minlength: [3, "The kind should be at least 3 characters long"],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (value) => URL_PATTERN.test(value),
      message: "Invalid URL ",
    },
  },
  need: {
    type: String,
    required: true,
    minlength: [3, "The need should be at least 3 characters long"],
    maxlength: [20, "The need should be no longer than 20 characters"],
  },
  location: {
    type: String,
    required: true,
    minlength: [5, "The location should be at least 5 characters long"],
    maxlength: [15, "The location should be no longer than 15 characters"],
  },
  description: {
    type: String,
    required: true,
    minlength: [5, "The description should be at least 5 characters long"],
    maxlength: [50, "The description should be no longer than 50 characters"],
  },
  donations: {
    type: [Types.ObjectId],
    ref: "User",
  },
  owner: {
    type: Types.ObjectId,
    ref: "User",
  },
});

animalSchema.index(
  { name: 1 },
  {
    collation: {
      locale: "en",
      strength: 2,
    },
  }
);

const Animal = model("Animal", animalSchema);

module.exports = Animal;
