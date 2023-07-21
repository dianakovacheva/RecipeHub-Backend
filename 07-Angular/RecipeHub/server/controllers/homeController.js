const { getAllRecipes } = require("./recipeController");

const homeController = require("express").Router();

homeController.get("/", async (req, res) => {
  const allRecipes = await getAllRecipes();

  if (allRecipes) {
    res.status(200).json(allRecipes);
  } else {
    // res.status(401).json({ message: `Not allowed!` });
    return;
  }
});

module.exports = homeController;
