import React from "react";
import { useFriends } from "../hooks/useFriends";
import FriendsList from "../components/FriendsList";
import AddFriend from "../components/AddFriend";

const Friends = () => {
  const { friends, isLoading } = useFriends(); // Fetch friends and loading state

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="friends-page">
      {/* <h2>My Friends</h2> */}
      <FriendsList friends={friends} />
      <AddFriend />
    </div>
  );
};

export default Friends;
