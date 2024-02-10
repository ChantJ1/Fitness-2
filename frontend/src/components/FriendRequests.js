import React, { useEffect, useState, useContext } from "react";
import { useFriendContext } from "../context/FriendContext";
import { AuthContext } from "../context/AuthContext";

const FriendRequests = () => {
  const { dispatch } = useFriendContext();
  const { user } = useContext(AuthContext);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch("/api/friends/get-friend-requests", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setFriendRequests(data.friendRequests);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error("Failed to fetch friend requests:", error.message);
      }
    };

    fetchFriendRequests();
  }, [user.token]);

  const handleAccept = async (friendId) => {
    try {
      const response = await fetch("/api/friends/accept-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: user.userId, friendId }),
      });
      const data = await response.json();

      if (response.ok) {
        dispatch({ type: "ACCEPT_FRIEND_REQUEST", payload: friendId });
        setFriendRequests(
          friendRequests.filter((request) => request.id !== friendId)
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Failed to accept friend request:", error.message);
    }
  };

  const handleReject = async (friendId) => {
    try {
      const response = await fetch("/api/friends/reject-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: user.userId, friendId }),
      });
      const data = await response.json();

      if (response.ok) {
        dispatch({ type: "REJECT_FRIEND_REQUEST", payload: friendId });
        setFriendRequests(
          friendRequests.filter((request) => request.id !== friendId)
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Failed to reject friend request:", error.message);
    }
  };

  return (
    <div>
      <h2>Friend Requests</h2>
      <ul>
        {friendRequests.map((request) => (
          <li key={request.id}>
            {request.username} {/* Displaying the username */}
            <button onClick={() => handleAccept(request.id)}>Accept</button>
            <button onClick={() => handleReject(request.id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequests;
