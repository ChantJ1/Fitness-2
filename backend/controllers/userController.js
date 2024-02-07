const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login a user
const loginUser = async (req, res) => {
  const { identifier, password } = req.body; // Change 'email' to 'identifier'

  try {
    // Call User.login with 'identifier' instead of 'email'
    const user = await User.login(identifier, password);

    // Create a token
    const token = createToken(user._id);

    // Return the user's email, username, and ID
    res.status(200).json({
      email: user.email,
      username: user.username,
      userId: user._id,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Call User.signup with email, username, and password
    const user = await User.signup(email, username, password);

    // Create a token
    const token = createToken(user._id);

    // Return the user's email, username, and ID
    res.status(200).json({
      email: user.email,
      username: user.username,
      userId: user._id,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search users function
const searchUsers = async (req, res) => {
  const query = req.query.query; // Extracting 'query' parameter from query string
  try {
    // Flexible search for users by username or email using regex for partial match and case insensitivity
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } }, // Case-insensitive regex search for username
        { email: { $regex: query, $options: "i" } }, // Case-insensitive regex search for email
      ],
    }).select("username email _id"); // Only return username, email, and _id fields

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to get the authenticated user's profile
// userController.js
const getUserProfile = async (req, res) => {
  const { username } = req.query; // Get the username from query parameters

  try {
    if (!username) {
      return res
        .status(400)
        .json({ error: "Username query parameter is required." });
    }

    // Search for the user by username
    const user = await User.findOne({ username }).select("username _id");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Return the found user's information
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { signupUser, loginUser, searchUsers, getUserProfile };
