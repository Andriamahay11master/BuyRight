import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import firebase from '../firebase';
import Loader from '../components/Loader';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get the redirect path from location state or default to home
  const from = (location.state as any)?.from?.pathname || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        firebase.auth,
        formData.email,
        formData.password
      );

      // Redirect to the page user tried to visit or home
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Welcome Back</h1>
      {error && <div className="error-message">{error}</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group form-group-password">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <div className="password-toggle" onClick={togglePasswordVisibility}>
            <i className={showPassword ? 'icon-eye-off' : 'icon-eye'}></i>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading} className='btn btn-primary'>
            {loading ? (
              <>
                <Loader size="small" color="#ffffff" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
          <Link to="/reset-password" className="forgot-password" style={{ pointerEvents: loading ? 'none' : 'auto' }}>
            Forgot Password?
          </Link>
        </div>
        <div className="form-footer">
          Don't have an account? <Link to="/register" style={{ pointerEvents: loading ? 'none' : 'auto' }}>Register here</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 