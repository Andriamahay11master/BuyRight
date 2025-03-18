import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faTimes, 
  faHome, 
  faPlus, 
  faUser, 
  faSignOutAlt,
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'firebase/auth';
import firebase from '../firebase';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveLink(location.pathname);
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

  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };

  const handleLogout = async () => {
    try {
      await signOut(firebase.auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
        {isAuthenticated ? (
          <>
            <div className="navbar-menu">
              <Link 
                to="/" 
                className={`nav-item ${activeLink === '/' ? 'active' : ''}`}
                onClick={() => handleLinkClick('/')}
              >
                <FontAwesomeIcon icon={faHome} className="nav-icon" />
                Home
              </Link>
              <Link 
                to="/create" 
                className={`nav-item ${activeLink === '/create' ? 'active' : ''}`}
                onClick={() => handleLinkClick('/create')}
              >
                <FontAwesomeIcon icon={faPlus} className="nav-icon" />
                Create List
              </Link>
              <Link 
                to="/profile" 
                className={`nav-item ${activeLink === '/profile' ? 'active' : ''}`}
                onClick={() => handleLinkClick('/profile')}
              >
                <FontAwesomeIcon icon={faUser} className="nav-icon" />
                Profile
              </Link>
            </div>
            
            <div className="navbar-auth">
              <button className="logout-btn" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="login-btn">
              <FontAwesomeIcon icon={faSignInAlt} className="nav-icon" />
              Login
            </Link>
            <Link to="/register" className="register-btn">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;