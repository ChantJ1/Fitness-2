import React, { useState } from "react";
import { useFriendContext } from "../context/FriendContext"; // Import useFriendContext hook

const AddFriend = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null); // State to store search result
  const { dispatch } = useFriendContext(); // Use useFriendContext hook to access the dispatch function

  const handleSearch = async () => {
    try {
      const authToken = localStorage.getItem("authToken"); // Retrieve token from local storage
      const response = await fetch(`/api/users/search?query=${searchTerm}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the authentication token
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to search for user");
      }

      setSearchResult(data); // Set search result
    } catch (error) {
      console.error("Failed to search for user:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem("authToken"); // Retrieve token from local storage
      const userId = localStorage.getItem("userId"); // Retrieve userId from local storage or your auth context
      const friendId = searchResult.id; // Extract friendId from search result
      const response = await fetch("/api/friends/send-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Include the authentication token
        },
        body: JSON.stringify({ userId, friendId }), // Send both userId and friendId
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to send friend request"
        );
      }

      console.log("Friend request sent successfully:", responseData);
      // Dispatch action to add the friend to the state
      dispatch({ type: "ADD_FRIEND", payload: responseData }); // Assuming responseData contains the newly added friend object
    } catch (error) {
      console.error("Failed to send friend request:", error.message);
    }

    setSearchTerm("");
    setSearchResult(null); // Reset search result after submission
  };

  return (
    <div>
      <h2>Add a Friend</h2>
      <input
        type="text"
        placeholder="Enter username or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {searchResult && (
        <div>
          <p>Search result: {searchResult.username}</p>
          <button onClick={handleSubmit}>Add Friend</button>
        </div>
      )}
    </div>
  );
};

export default AddFriend;
