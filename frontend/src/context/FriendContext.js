import React, { createContext, useReducer, useEffect, useContext } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export const FriendContext = createContext();

const friendReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_FRIENDS":
      return { ...state, friends: action.payload };
    case "ADD_FRIEND":
      return { ...state, friends: [...state.friends, action.payload] };
    case "LOAD_FRIEND_REQUESTS":
      return { ...state, friendRequests: action.payload };
    case "ACCEPT_FRIEND_REQUEST":
      // No need to update state here, just reload friend list

      return state;
    case "REJECT_FRIEND_REQUEST":
      return {
        ...state,
        friendRequests: state.friendRequests.filter(
          (request) => request._id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export const FriendContextProvider = ({ children }) => {
  const { user } = useAuthContext();
  const initialState = {
    friends: [],
    friendRequests: [],
  };
  const [state, dispatch] = useReducer(friendReducer, initialState);

  useEffect(() => {
    const loadFriends = async () => {
      if (user) {
        try {
          const response = await fetch("/api/friends/get-friends", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch friends data");
          }
          const data = await response.json();
          dispatch({ type: "LOAD_FRIENDS", payload: data.friends });
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      }
    };

    loadFriends();
  }, [user, state.friendRequests.length]); // Re-fetch friends when the number of friend requests changes

  return (
    <FriendContext.Provider value={{ ...state, dispatch }}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriendContext = () => useContext(FriendContext);
