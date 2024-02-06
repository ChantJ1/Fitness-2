import { FriendContext } from "../context/FriendContext"; // Adjust the path as necessary
import { useContext } from "react";

export const useFriends = () => {
  const context = useContext(FriendContext);

  if (!context) {
    throw new Error("useFriends must be used within a FriendContextProvider");
  }

  return context;
};
