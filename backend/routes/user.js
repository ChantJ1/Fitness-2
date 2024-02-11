// File: routes/userRoutes.js

const express = require("express");
const {
  loginUser,
  signupUser,
  getUserProfile,
  updateGymStatus,
  clearGymStatus,
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Existing login and signup routes
router.post("/login", loginUser);
router.post("/signup", signupUser);

// GET route for user profile, protected by requireAuth
router.get("/profile", requireAuth, getUserProfile);

// New POST route for updating gym status, protected by requireAuth
router.post("/update-gym-status", requireAuth, updateGymStatus);

// New POST route for clearing gym status, protected by requireAuth
router.post("/clear-gym-status", requireAuth, clearGymStatus);

module.exports = router;
