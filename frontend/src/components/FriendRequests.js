import React from "react";
import { useFriendContext } from "../context/FriendContext";

const FriendRequests = () => {
  const { friendRequests, dispatch } = useFriendContext();

  const handleAccept = (id) => {
    // Implement function to accept friend request
    dispatch({ type: "ACCEPT_FRIEND_REQUEST", payload: id });
  };

  const handleReject = (id) => {
    // Implement function to reject friend request
    dispatch({ type: "REJECT_FRIEND_REQUEST", payload: id });
  };

  return (
    <div>
      <h2>Friend Requests</h2>
      <ul>
        {friendRequests.map((request) => (
          <li key={request.id}>
            {request.name}
            <button onClick={() => handleAccept(request.id)}>Accept</button>
            <button onClick={() => handleReject(request.id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequests;
