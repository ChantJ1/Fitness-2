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
      return {
        ...state,
        friendRequests: state.friendRequests.filter(
          (request) => request.id !== action.payload.id
        ),
        friends: [...state.friends, action.payload],
      };
    case "REJECT_FRIEND_REQUEST":
      return {
        ...state,
        friendRequests: state.friendRequests.filter(
          (request) => request.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export const FriendContextProvider = ({ children }) => {
  const { user } = useAuthContext();

  // Define your initial state here
  const initialState = {
    friends: [], // Set initial state to an empty array
    friendRequests: [],
  };

  // Use the initialState in useReducer
  const [state, dispatch] = useReducer(friendReducer, initialState);

  // Example function to load friends from the backend
  useEffect(() => {
    const loadFriends = async () => {
      if (user) {
        try {
          // Fetch friends from the backend API
          const response = await fetch("/api/friends/get-friends", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch friends data");
          }

          const data = await response.json();
          dispatch({ type: "LOAD_FRIENDS", payload: data.friends }); // Ensure "data.friends" is an array
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      }
    };

    loadFriends();
  }, [user]);

  return (
    <FriendContext.Provider value={{ ...state, dispatch }}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriendContext = () => {
  const context = useContext(FriendContext);

  if (context === undefined) {
    throw new Error(
      "useFriendContext must be used within a FriendContextProvider"
    );
  }

  return context;
};
