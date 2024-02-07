const express = require("express");
const {
  loginUser,
  signupUser,
  getUserProfile,
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Existing login and signup routes
router.post("/login", loginUser);
router.post("/signup", signupUser);

// Add a new GET route for user profile, protected by requireAuth
router.get("/profile", requireAuth, getUserProfile);

module.exports = router;
