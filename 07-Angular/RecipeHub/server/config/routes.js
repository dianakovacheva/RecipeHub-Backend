const animalController = require("../controllers/animalController");
const authController = require("../controllers/authController");
const dashboardController = require("../controllers/dashboardController");
const homeController = require("../controllers/homeController");
const searchController = require("../controllers/searchController");

module.exports = (app) => {
  app.use("/", homeController);
  app.use("/auth", authController);
  app.use("/dashboard", dashboardController);
  app.use("/animal", animalController);
  app.use("/search", searchController);
  app.use(function (req, res) {
    res.status(404).render("404", {
      title: "404 Page Not Found",
      user: req.user,
    });
  });
};
