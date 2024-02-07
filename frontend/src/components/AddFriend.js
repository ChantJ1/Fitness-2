import React, { useState, useContext } from "react";
import { useFriendContext } from "../context/FriendContext"; // Import useFriendContext hook
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const AddFriend = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null); // State to store search result
  const { dispatch } = useFriendContext(); // Use useFriendContext hook to access the dispatch function
  const authContext = useContext(AuthContext); // Use useContext hook to access AuthContext

  const handleSearch = async () => {
    try {
      const authToken = authContext.user.token; // Retrieve token from AuthContext
      // Update the request URL to match the new endpoint and query parameter
      const response = await fetch(`/api/user/profile?username=${searchTerm}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the authentication token
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to search for user");
      }

      setSearchResult(data); // Set search result, assuming the API returns the user object directly
    } catch (error) {
      console.error("Failed to search for user:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authToken = authContext.user.token; // Retrieve token from AuthContext
      // No need to retrieve userId from local storage as the sender, since your backend should use the authenticated user's ID
      const friendId = searchResult._id; // Extract friendId from search result
      const response = await fetch("/api/friends/send-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Include the authentication token
        },
        body: JSON.stringify({ friendId }), // Update to match the expected JSON format
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to send friend request");
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
        placeholder="Enter username"
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
