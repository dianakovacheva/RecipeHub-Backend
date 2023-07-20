const Animal = require("../models/Animal");

async function getAllAnimals() {
  return await Animal.find({}).lean();
}

async function createAnimalPost(animalData) {
  return await Animal.create(animalData);
}

async function getAnimalPostById(postId) {
  return await Animal.findById(postId).lean();
}

async function donateToAnimal(animalId, donatorId) {
  const animal = await Animal.findById(animalId);

  animal.donations.push(donatorId);

  return animal.save();
}

async function editAnimalPost(animalId, data) {
  const existingAnimal = await Animal.findById(animalId);

  existingAnimal.name = data.name;
  existingAnimal.years = data.years;
  existingAnimal.kind = data.kind;
  existingAnimal.imageUrl = data.imageUrl;
  existingAnimal.need = data.need;
  existingAnimal.location = data.location;
  existingAnimal.description = data.description;

  return existingAnimal.save();
}

async function deletePost(animalId) {
  return await Animal.findByIdAndDelete(animalId);
}

async function getLastThree() {
  return await Animal.find().sort({ field: "asc", _id: -1 }).limit(3).lean();
}

async function search(location) {
  let animals = await getAllAnimals();

  if (location) {
    animals = animals.filter(
      (x) => x.location.toLowerCase() == location.toLowerCase()
    );
  }

  return animals;
}

module.exports = {
  getAllAnimals,
  createAnimalPost,
  getAnimalPostById,
  donateToAnimal,
  editAnimalPost,
  deletePost,
  getLastThree,
  search,
};
