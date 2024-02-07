import React, { useState, useContext } from "react";
import { useFriendContext } from "../context/FriendContext";
import { AuthContext } from "../context/AuthContext";

const AddFriend = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(""); // State to store the error message
  const { dispatch } = useFriendContext();
  const authContext = useContext(AuthContext);

  const handleSearch = async () => {
    setError(""); // Reset error message
    try {
      const authToken = authContext.user.token;
      const response = await fetch(`/api/user/profile?username=${searchTerm}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to search for user");
      }

      setSearchResult(data);
    } catch (error) {
      console.error("Failed to search for user:", error.message);
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      const authToken = authContext.user.token;
      const senderId = authContext.user.userId;
      const receiverId = searchResult._id;

      const response = await fetch("/api/friends/send-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ senderId, receiverId }),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to send friend request");
      }

      console.log("Friend request sent successfully:", responseData);
      dispatch({ type: "ADD_FRIEND", payload: responseData });
    } catch (error) {
      console.error("Failed to send friend request:", error.message);
      setError(error.message); // Set error message
    }

    setSearchTerm("");
    setSearchResult(null);
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
      <button className="form-button" onClick={handleSearch}>
        Search
      </button>
      {searchResult && (
        <div>
          <p>Search result: {searchResult.username}</p>
          <button className="form-button" onClick={handleSubmit}>
            Add Friend
          </button>
        </div>
      )}
      {error && <p className="error">{error}</p>} {/* Display error message */}
    </div>
  );
};

export default AddFriend;
