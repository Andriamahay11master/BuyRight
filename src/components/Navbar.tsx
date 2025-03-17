import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faTimes, 
  faHome, 
  faPlus, 
  faUser, 
  faSignInAlt, 
  faUserPlus, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">BuyRight</Link>
      </div>
      
      <button className="menu-toggle" onClick={toggleMenu}>
        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
      </button>
      
      <div className={`navbar-content ${isMenuOpen ? 'active' : ''}`}>
        <div className="navbar-menu">
          <Link to="/" className="nav-item">
            <FontAwesomeIcon icon={faHome} className="nav-icon" />
            Home
          </Link>
          <Link to="/create" className="nav-item">
            <FontAwesomeIcon icon={faPlus} className="nav-icon" />
            Create List
          </Link>
          <Link to="/profile" className="nav-item">
            <FontAwesomeIcon icon={faUser} className="nav-icon" />
            Profile
          </Link>
        </div>
        
        <div className="navbar-auth">
          <Link to="/login" className="nav-item">
            <FontAwesomeIcon icon={faSignInAlt} className="nav-icon" />
            Login
          </Link>
          <Link to="/register" className="nav-item">
            <FontAwesomeIcon icon={faUserPlus} className="nav-icon" />
            Register
          </Link>
          <button className="logout-btn">
            <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 