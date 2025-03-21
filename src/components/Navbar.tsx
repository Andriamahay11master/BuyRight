import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
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
    setActiveLink(location.pathname);
  }, [location.pathname]);


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
       
      <div className="navbar-content">
        {isAuthenticated ? (
          <div className='navbar-menu-container'>
            <div className="navbar-menu">
              <Link 
                to="/" 
                className={`nav-item ${activeLink === '/' ? 'active' : ''}`}
                onClick={() => handleLinkClick('/')}
              >
                <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Home</span>
              </Link>
              <Link 
                to="/create" 
                className={`nav-item ${activeLink === '/create' ? 'active' : ''}`}
                onClick={() => handleLinkClick('/create')}
              >
                <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Create List</span>
              </Link>
              <Link 
                to="/profile" 
                className={`nav-item ${activeLink === '/profile' ? 'active' : ''}`}
                onClick={() => handleLinkClick('/profile')}
              >
                <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Profile</span>
              </Link>
            </div>
            
            <div className="navbar-auth">
              <button className="logout-btn" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
                Logout
              </button>
            </div>
          </div>
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