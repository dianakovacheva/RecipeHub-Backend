const { getAllAnimals } = require("../services/animalService");

const dashboardController = require("express").Router();

dashboardController.get("/", async (req, res) => {
  const animals = await getAllAnimals();
  res.render("dashboard", {
    title: "Dashboard Page",
    user: req.user,
    animals,
  });
});

module.exports = dashboardController;
