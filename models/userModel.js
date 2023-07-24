const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALTROUNDS) || 5;

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: [2, "First name must be min 2 chars long."],
    validate: {
      validator: function (v) {
        return /[a-zA-Z]+/g.test(v);
      },
      message: (props) => `${props.value} must contains only latin letters!`,
    },
  },
  lastName: {
    type: String,
    required: true,
    minlength: [2, "Last name must be min 2 chars long."],
    validate: {
      validator: function (v) {
        return /[a-zA-Z]+/g.test(v);
      },
      message: (props) => `${props.value} must contains only latin letters!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters."],
    validate: {
      validator: function (v) {
        return /[a-zA-Z0-9]+/g.test(v);
      },
      message: (props) =>
        `${props.value} must contains only latin letters and digits!`,
    },
  },
  createdRecipes: [
    {
      type: ObjectId,
      ref: "Recipe",
    },
  ],
  savedRecipes: [
    {
      type: ObjectId,
      ref: "Recipe",
    },
  ],
  userCommentedRecipes: [
    {
      type: ObjectId,
      ref: "Comment",
    },
  ],
});

userSchema.methods = {
  matchPassword: function (password) {
    return bcrypt.compare(password, this.password);
  },
};

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        next(err);
      }
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) {
          next(err);
        }
        this.password = hash;
        next();
      });
    });
    return;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
