const { hasUser } = require("../middlewares/guards");
const { search } = require("../services/animalService");

const searchController = require("express").Router();

searchController.get("/", hasUser(), async (req, res) => {
  if (!req.user) {
    res.redirect("/auth/login");
  }

  const { location } = req.query;
  const animals = await search(location);

  res.render("search", {
    title: "Search Page",
    user: req.user,
    animals,
    location,
  });
});

module.exports = searchController;
