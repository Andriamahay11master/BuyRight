import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import firebase from '../firebase';
import Loader from '../components/Loader';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        firebase.auth,
        formData.email,
        formData.password
      );

      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.displayName
      });

      // Create user document in Firestore
      await setDoc(doc(firebase.db, 'users', userCredential.user.uid), {
        displayName: formData.displayName,
        email: formData.email,
        createdAt: new Date().toISOString(),
        totalLists: 0,
        sharedLists: 0
      });

      // Redirect to login page
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h1>Create Account</h1>
      {error && <div className="error-message">{error}</div>}
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
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
            minLength={6}
            disabled={loading}
          />
          <div className="password-toggle" onClick={() => togglePasswordVisibility('password')}>
            <i className={showPassword ? 'icon-eye-off' : 'icon-eye'}></i>
          </div>
        </div>
        <div className="form-group form-group-password">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            disabled={loading}
          />
          <div className="password-toggle" onClick={() => togglePasswordVisibility('confirmPassword')}>
            <i className={showConfirmPassword ? 'icon-eye-slash' : 'icon-eye'}></i>
          </div>
        </div>
        <button type="submit" disabled={loading} className='btn btn-primary'>
          {loading ? (
            <>
              <Loader size="small" color="#ffffff" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
        <div className="form-footer">
          Already have an account? <Link to="/login" style={{ pointerEvents: loading ? 'none' : 'auto' }}>Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage; 