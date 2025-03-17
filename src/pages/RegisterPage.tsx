import React from 'react';

const RegisterPage: React.FC = () => {
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
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage; 