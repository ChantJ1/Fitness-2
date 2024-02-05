import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Change null to false for clarity
  const { dispatch } = useAuthContext();

  // Include username in the signup function parameters
  const signup = async (email, password, username) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }), // Include username in the request body
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    } else {
      // Save the user to local storage. Ensure json includes username or adjust accordingly.
      localStorage.setItem("user", JSON.stringify(json));

      // Update the auth context. Make sure json includes the username.
      dispatch({ type: "LOGIN", payload: json });

      // Update loading state
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
