import React from "react";
import { useFriendContext } from "../context/FriendContext";

const FriendsList = () => {
  const { friends } = useFriendContext();

  return (
    <div>
      <h2>My Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend._id}>{friend.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
