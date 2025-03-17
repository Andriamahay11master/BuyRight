import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    }
  return (
    <div className="login-page">
      <h1>Welcome Back</h1>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" pattern='^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' title='Please enter a valid email address' required />
        </div>
        <div className="form-group form-group-password">
          <label htmlFor="password">Password</label>
          <input type={showPassword ? "text" : "password"} id="password" name="password" required />
          <div className="password-toggle">
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} onClick={togglePassword} />
          </div>
        </div>
        <button type="submit">Login</button>
        <div className="form-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 