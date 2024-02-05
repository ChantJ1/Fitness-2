const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login a user
const loginUser = async (req, res) => {
  // Change 'email' to a more generic term like 'identifier' to reflect that it can be either an email or a username.
  const { identifier, password } = req.body;

  try {
    // Adjust the call to User.login to pass 'identifier' instead of 'email'
    const user = await User.login(identifier, password);

    // Create a token
    const token = createToken(user._id);

    // Consider returning the actual identifier used for login and the username for client-side usage
    res
      .status(200)
      .json({ identifier: user.email, username: user.username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const { email, username, password } = req.body; // Include username in the request body

  try {
    const user = await User.signup(email, username, password); // Pass username to the signup method

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, username, token }); // Return username along with email and token
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };
