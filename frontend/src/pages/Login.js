import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Use a generic term like 'identifier' for email or username
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pass the identifier and password to the login function
    await login(identifier, password);
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log In</h3>
      <label>Email or Username:</label>{" "}
      {/* Update label to indicate email or username */}
      <input
        type="text" // Change type to text to accommodate both email and username
        onChange={(e) => setIdentifier(e.target.value)}
        value={identifier}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button disabled={isLoading}>Log in</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Login;
