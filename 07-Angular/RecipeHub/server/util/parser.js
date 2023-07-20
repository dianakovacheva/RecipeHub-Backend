function parseError(error) {
  if (error.name == "ValidatorError") {
    return Object.values(error.errors).map((value) => value.message);
  } else {
    return error.message.split("\n");
  }
}

module.exports = {
  parseError,
};
