import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const RegisterPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    }

    const toggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }
  return (
    <div className="register-page">
      <h1>Create Account</h1>
      <form className="register-form">
        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input type="text" id="displayName" name="displayName" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group form-group-password">
          <label htmlFor="password">Password</label>
          <input type={showPassword ? "text" : "password"} id="password" name="password" required />
          <div className="password-toggle">
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} onClick={togglePassword} />
          </div>
        </div>
        <div className="form-group form-group-password">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" required />
          <div className="password-toggle">
            <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} onClick={toggleConfirmPassword} />
          </div>
        </div>
        <button type="submit">Create Account</button>
        <div className="form-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage; 