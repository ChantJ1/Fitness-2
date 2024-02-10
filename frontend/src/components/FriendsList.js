import React from "react";
import { useFriends } from "../hooks/useFriends";

const FriendsList = () => {
  const { friends } = useFriends();

  return (
    <div>
      <h2>My Friends</h2>
      <ul>
        {friends.length === 0 ? (
          <p key="no-friends">No friends</p> // This key is fine since it's a single element
        ) : (
          friends.map((friend) => {
            // Ensure each `friend` has a unique `friend._id`
            if (friend.username !== "") {
              return <li key={friend._id}>{friend.username}</li>; // Make sure `friend._id` is unique
            }
            return null; // Return null for friends without a username, though this case should ideally be handled differently
          })
        )}
      </ul>
    </div>
  );
};

export default FriendsList;
