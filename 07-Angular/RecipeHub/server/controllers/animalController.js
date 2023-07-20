const { hasUser } = require("../middlewares/guards");
const {
  createAnimalPost,
  getAnimalPostById,
  donateToAnimal,
  editAnimalPost,
  deletePost,
} = require("../services/animalService");
const { parseError } = require("../util/parser");

const animalController = require("express").Router();

animalController.get("/addAnimalPost", hasUser(), (req, res) => {
  res.render("create", {
    title: "Add Post Page",
    user: req.user,
  });
});

animalController.post("/addAnimalPost", hasUser(), async (req, res) => {
  const animal = {
    name: req.body.name,
    years: req.body.years,
    kind: req.body.kind,
    imageUrl: req.body.imageUrl,
    need: req.body.need,
    location: req.body.location,
    description: req.body.description,
    owner: req.user._id,
  };

  try {
    await createAnimalPost(animal);
    res.redirect("/dashboard");
  } catch (error) {
    const errors = parseError(error);
    res.render("create", {
      title: "Add Post Page",
      user: req.user,
      errors,
      animal,
    });
  }
});

animalController.get("/details/:id", async (req, res) => {
  const animalPost = await getAnimalPostById(req.params.id);

  animalPost.isOwner =
    animalPost.owner._id.toString() == req.user?._id.toString();

  animalPost.isDonater = animalPost.donations.find(
    (userId) => userId.toString() == req.user?._id
  );

  res.render("details", {
    title: "Details Page",
    user: req.user,
    animal: animalPost,
  });
});

animalController.get("/details/:id/donate", hasUser(), async (req, res) => {
  const animalPost = await getAnimalPostById(req.params.id);

  try {
    await donateToAnimal(animalPost._id, req.user._id);
    res.redirect(`/animal/details/${animalPost._id}`);
  } catch (error) {
    res.render("details", {
      title: "Details Page",
      user: req.user,
      errors: parseError(error),
      animal: animalPost,
    });
  }
});

animalController.get("/details/:id/edit", hasUser(), async (req, res) => {
  const animalPost = await getAnimalPostById(req.params.id);

  res.render("edit", {
    title: "Edit Page",
    animal: animalPost,
  });
});

animalController.post("/details/:id/edit", hasUser(), async (req, res) => {
  const animalPost = await getAnimalPostById(req.params.id);

  if (animalPost.owner.toString() != req.user._id.toString()) {
    return res.redirect("/auth/login");
  }

  try {
    await editAnimalPost(animalPost._id, req.body);
    res.redirect(`/animal/details/${animalPost._id}`);
  } catch (error) {
    res.render("edit", {
      title: "Edit Page",
      errors: parseError(error),
      animal: animalPost,
    });
  }
});

animalController.get("/details/:id/delete", hasUser(), async (req, res) => {
  const animalPost = await getAnimalPostById(req.params.id);

  if (animalPost.owner.toString() != req.user._id.toString()) {
    return res.redirect("/auth/login");
  }

  await deletePost(animalPost._id);
  res.redirect("/dashboard");
});

module.exports = animalController;
