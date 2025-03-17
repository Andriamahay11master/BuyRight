import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        ☰
      </button>
      
      <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/create" className="nav-item">Create List</Link>
        <Link to="/profile" className="nav-item">Profile</Link>
      </div>
      
      <div className={`navbar-auth ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/login" className="nav-item">Login</Link>
        <Link to="/register" className="nav-item">Register</Link>
        <button className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar; 