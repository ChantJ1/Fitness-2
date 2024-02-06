import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { FriendContextProvider } from "./context/FriendContext"; // Import FriendContextProvider

// pages & components
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Friends from "./pages/Friends"; // Import the Friends component

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <FriendContextProvider>
            {" "}
            {/* Wrap Routes with FriendContextProvider */}
            <Routes>
              <Route
                path="/"
                element={user ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/home"
                element={user ? <Home /> : <Navigate to="/login" />}
              />
              {/* Ensure Friends route is within FriendContextProvider */}
              <Route
                path="/friends"
                element={user ? <Friends /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" />}
              />
            </Routes>
          </FriendContextProvider>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
