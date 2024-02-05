import { createContext, useReducer } from "react";

export const WorkoutsContext = createContext();

export const workoutsReducer = (state, action) => {
  switch (action.type) {
    case "SET_WORKOUTS":
      return {
        workouts: action.payload,
      };
    case "CREATE_WORKOUT":
      return {
        workouts: [action.payload, ...state.workouts],
      };
    case "DELETE_WORKOUT":
      return {
        workouts: state.workouts.filter((w) => w._id !== action.payload._id),
      };
    case "UPDATE_WORKOUT":
      // Find the index of the updated workout in the state
      const updatedIndex = state.workouts.findIndex(
        (w) => w._id === action.payload._id
      );
      if (updatedIndex === -1) {
        // Workout not found, return state as is
        return state;
      }
      // Create a new state array with the updated workout
      const updatedWorkouts = [...state.workouts];
      updatedWorkouts[updatedIndex] = action.payload;
      return {
        workouts: updatedWorkouts,
      };
    default:
      return state;
  }
};

export const WorkoutsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutsReducer, {
    workouts: [],
  });

  return (
    <WorkoutsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WorkoutsContext.Provider>
  );
};
