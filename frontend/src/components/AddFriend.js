import React, { useState } from "react";
import { useFriends } from "../hooks/useFriends"; // Corrected import

const AddFriend = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // Assuming useFriend hook returns a dispatch function among other values
  const { dispatch } = useFriends();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement logic for searching or directly sending a friend request
    console.log("Search term:", searchTerm);
    // Example: Directly sending a friend request (adjust according to actual API and requirements)
    try {
      const response = await fetch("/api/friends/send-request", {
        // Adjust endpoint as necessary
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include auth token if required, assuming your auth context provides it
        },
        body: JSON.stringify({ searchTerm }), // Adjust the body as per your backend expectations
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send friend request");
      }

      console.log("Friend request sent successfully:", data);
      // Optionally, dispatch an action to update your app state/context
      // dispatch({ type: 'SEND_FRIEND_REQUEST_SUCCESS', payload: data });
    } catch (error) {
      console.error("Failed to send friend request:", error.message);
      // Handle sending friend request error
    }

    setSearchTerm(""); // Reset search term post action
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a Friend</h2>
      <input
        type="text"
        placeholder="Enter username or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit">Search</button>{" "}
      {/* Adjust button text if it directly sends requests */}
    </form>
  );
};

export default AddFriend;
