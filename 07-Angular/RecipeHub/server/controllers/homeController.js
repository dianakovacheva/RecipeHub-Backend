const { getLastThree } = require("../services/animalService");

const homeController = require("express").Router();

homeController.get("/", async (req, res) => {
  const animals = await getLastThree();

  res.render("home", {
    title: "Home Page",
    user: req.user,
    animals,
  });
});

module.exports = homeController;
