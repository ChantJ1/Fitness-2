const express = require("express");
const router = express.Router();
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} = require("../controllers/friendController");
const requireAuth = require("../middleware/requireAuth"); // Adjust path as necessary

// Applying the requireAuth middleware to all friend-related routes
router.use(requireAuth);

// Route to send a friend request
router.post("/send-request", sendFriendRequest);

// Route to accept a friend request
router.post("/accept-request", acceptFriendRequest);

// Route to reject a friend request
router.post("/reject-request", rejectFriendRequest);

module.exports = router;
