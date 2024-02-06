import React from "react";
import { useFriendContext } from "../context/FriendContext";

const FriendsList = () => {
  const { friends } = useFriendContext();

  return (
    <div>
      <h2>My Friends</h2>
      <ul>
        {friends.length === 0 ||
        friends.every((friend) => friend.username === "") ? (
          <p key="no-friends">No friends</p>
        ) : (
          friends.map(
            (friend) =>
              friend.username !== "" && (
                <li key={friend._id}>{friend.username}</li>
              )
          )
        )}
      </ul>
    </div>
  );
};

export default FriendsList;
