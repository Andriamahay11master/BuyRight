import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <h1>Welcome Back</h1>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
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