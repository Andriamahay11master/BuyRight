import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import firebase from "../../firebase";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("/");

  // Close menu when route changes
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };

  const handleLogout = async () => {
    try {
      await signOut(firebase.auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">BuyRight</Link>
      </div>

      <div className="navbar-content">
        <div className="navbar-menu-container">
          <div className="navbar-menu">
            <Link
              to="/"
              className={`nav-item ${activeLink === "/" ? "active" : ""}`}
              onClick={() => handleLinkClick("/")}
            >
              <i className="icon-list"></i>
              <span>Home</span>
            </Link>
            <Link
              to="/create"
              className={`nav-item ${activeLink === "/create" ? "active" : ""}`}
              onClick={() => handleLinkClick("/create")}
            >
              <i className="icon-plus-circle"></i>
              <span>Create List</span>
            </Link>
            <Link
              to="/profile"
              className={`nav-item ${
                activeLink === "/profile" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/profile")}
            >
              <i className="icon-user"></i>
              <span>Profile</span>
            </Link>
          </div>

          <div className="navbar-auth">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="icon-power"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
