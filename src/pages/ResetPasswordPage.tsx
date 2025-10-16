import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import firebase from "../firebase";
import Loader from "../components/loader/Loader";

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      await sendPasswordResetEmail(firebase.auth, email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <h1>Reset Password</h1>
      {error && <div className="error-message">{error}</div>}
      {success ? (
        <div className="success-message">
          <p>Password reset email sent! Please check your inbox.</p>
          <Link to="/login" className="back-to-login">
            Back to Login
          </Link>
        </div>
      ) : (
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-group">
              <i className="icon-mail input-icon"></i>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? (
              <>
                <Loader size="small" color="#ffffff" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
          <div className="form-footer">
            Remember your password?{" "}
            <Link
              to="/login"
              style={{ pointerEvents: loading ? "none" : "auto" }}
            >
              Login here
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
