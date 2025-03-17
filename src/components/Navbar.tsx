import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faTimes, 
  faHome, 
  faPlus, 
  faUser, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.querySelector('.navbar');
      if (isMenuOpen && navbar && !navbar.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

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