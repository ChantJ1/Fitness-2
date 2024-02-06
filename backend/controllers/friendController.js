const User = require("../models/userModel");

// Function to send a friend request
exports.sendFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;

  // Prevent users from sending requests to themselves
  if (senderId === receiverId) {
    return res
      .status(400)
      .json({ error: "Cannot send a friend request to yourself." });
  }

  try {
    // Ensure both users exist
    const senderExists = await User.findById(senderId);
    const receiverExists = await User.findById(receiverId);
    if (!senderExists || !receiverExists) {
      return res.status(404).json({ error: "User not found." });
    }

    // Proceed with sending the friend request
    await User.findByIdAndUpdate(receiverId, {
      $addToSet: { friendRequests: senderId },
    });

    res.status(200).json({ message: "Friend request sent successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to accept a friend request
exports.acceptFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;

  // Security check (assuming req.user is set by your authentication middleware)
  if (req.user._id.toString() !== userId) {
    return res.status(403).json({ error: "Unauthorized action." });
  }

  try {
    // Additional checks can be added here if necessary

    // Move friendId from userId's friendRequests array to friends array
    await User.findByIdAndUpdate(userId, {
      $pull: { friendRequests: friendId },
      $addToSet: { friends: friendId },
    });

    // Also add userId to friendId's friends array
    await User.findByIdAndUpdate(friendId, {
      $addToSet: { friends: userId },
    });

    res.status(200).json({ message: "Friend request accepted." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to reject a friend request
exports.rejectFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;

  // Security check
  if (req.user._id.toString() !== userId) {
    return res.status(403).json({ error: "Unauthorized action." });
  }

  try {
    // Remove friendId from userId's friendRequests array
    await User.findByIdAndUpdate(userId, {
      $pull: { friendRequests: friendId },
    });

    res.status(200).json({ message: "Friend request rejected." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to get a user's friends
// Function to get a user's friends
exports.getFriends = async (req, res) => {
  const userId = req.user._id; // Assuming you're using authentication middleware

  try {
    // Retrieve the user's friends based on their ID
    const user = await User.findById(userId).populate("friends");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Extract the friends from the user object
    const friends = user.friends || [];

    res.status(200).json({ friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
