import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Workout Stats</h1>
        </Link>
        <nav>
          {user && (
            <>
              <div className="nav-page-container">
                <Link className="nav-link" to="/home">
                  Home
                </Link>
                <Link className="nav-link" to="/friends">
                  Friends
                </Link>
              </div>{" "}
              {/* Add this line */}
              <span>{user.username}</span>
              <button onClick={handleClick}>Log out</button>
            </>
          )}
          {!user && (
            <>
              <Link className="nav-link" to="/login">
                Login
              </Link>
              <Link className="nav-link" to="/signup">
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
