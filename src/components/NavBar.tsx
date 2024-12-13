import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { logout } from "../store/authSlice";
import { Link } from "react-router-dom";
import "../styles/components/navbar.css";
import NavbarLogo from "../components/NavBarLogo";

function Navbar() {
  const { isLoggedIn, role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <svg width="0" height="0">
            <linearGradient id="navbar-logo-gradient">
              <stop stopColor="#ff10d3" offset="0%" />
              <stop stopColor="bf5fff" offset="100%" />
            </linearGradient>
          </svg>
          <div className="navbar-logo-wrapper">
            <NavbarLogo className="navbar-logo" />
          </div>
          <h1>
            <span className="navbar-cv">CV</span>Portal
            <div className="sign"></div>
          </h1>
          <div className="sign">
            <span className="io-color">.io</span>
          </div>
        </Link>
      </div>
      <div className="navbar-actions">
        {isLoggedIn && (
          <>
            {role === "admin" ? (
              <Link to="/admin" className="admin-btn">
                Admin Dashboard
              </Link>
            ) : (
              <Link to="/cv" className="my-cvs-btn">
                My CVs
              </Link>
            )}
          </>
        )}
        {isLoggedIn ? (
          <button onClick={() => dispatch(logout())}>Logout</button>
        ) : (
          <Link to="/login" className="account-btn">
            Account
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
