const { Schema, model, Types } = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALTROUNDS) || 5;

const EMAIL_PATTERN = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: [2, "The first name must be at least 2 characters long."],
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
    minlength: [2, "The last name must be at least 2 characters long."],
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
    minlength: [10, "The email must be at least 10 characters long."],
    validate: {
      validator: (value) => EMAIL_PATTERN.test(value),
      message: "Invalid email address.",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "The Password must be at least 8 characters long."],
    validate: {
      validator: function (v) {
        return /[a-zA-Z0-9]+/g.test(v);
      },
      message: (props) =>
        `${props.value} must contains only latin letters and digits!`,
    },
  },
  userRecipesList: [
    {
      type: [Types.ObjectId],
      ref: "Recipe",
    },
  ],
  userCommentsList: [
    {
      type: [Types.ObjectId],
      ref: "Recipe",
    },
  ],
  userSavedRecipes: [
    {
      type: [Types.ObjectId],
      ref: "Recipe",
    },
  ],
});

userSchema.methods = {
  matchPassword: function (password) {
    return bcrypt.compare(password, this.password);
  },
};

userSchema.pre(
  "save",
  function (next) {
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
  },
  { timestamps: { createdAt: "created_at" } }
);

const User = model("User", userSchema);

module.exports = User;
