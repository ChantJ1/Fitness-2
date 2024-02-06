const express = require("express");
const router = express.Router();
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends, // Add this import
} = require("../controllers/friendController");
const requireAuth = require("../middleware/requireAuth");

// Applying the requireAuth middleware to all friend-related routes
router.use(requireAuth);

// Route to send a friend request
router.post("/send-request", sendFriendRequest);

// Route to accept a friend request
router.post("/accept-request", acceptFriendRequest);

// Route to reject a friend request
router.post("/reject-request", rejectFriendRequest);

// New route to get user's friends
router.get("/get-friends", getFriends); // Add this route

module.exports = router;
