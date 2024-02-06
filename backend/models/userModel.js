const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensuring username is unique
  },
  password: {
    type: String,
    required: true,
  },
});

// static signup method
userSchema.statics.signup = async function (email, username, password) {
  // validation
  if (!email || !username || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password must include one Capital, one lowercase, one number and one special character"
    );
  }

  // Adding validation for username, adjust according to your needs
  if (
    !validator.isAlphanumeric(username, "en-US", { ignore: "_-" }) ||
    !validator.isLength(username, { min: 3, max: 30 })
  ) {
    throw Error("Username not valid");
  }

  const exists = await this.findOne({ $or: [{ email }, { username }] });

  if (exists) {
    throw Error("Email or Username already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, username, password: hash });

  return user;
};

// static login method - Unchanged, but consider adding username login option
// This is a conceptual example and needs to be adjusted to your specific backend logic
userSchema.statics.login = async function (identifier, password) {
  let user;
  // Check if the identifier is an email
  if (validator.isEmail(identifier)) {
    user = await this.findOne({ email: identifier });
  } else {
    user = await this.findOne({ username: identifier });
  }

  if (!user) {
    throw Error("User not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
