// src/pages/ForgotPasswordPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { guestAuthApi } from '../services/api.js';
import hotelConfig      from '../config/hotel.config.js';
import './AuthPages.css';

export default function ForgotPasswordPage() {
  const [email,     setEmail]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = `Reset Password | ${hotelConfig.shortName}`;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await guestAuthApi.forgotPassword(email);
    } catch {
      // Intentionally silent — never reveal if email exists
    } finally {
      setLoading(false);
      setSubmitted(true); // Always show success
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__inner">
        <div className="auth-card">
          <div className="auth-card__header">
            <Link to="/" className="auth-card__logo">{hotelConfig.shortName}</Link>
            <h1 className="auth-card__title">Forgot Password?</h1>
            <p className="auth-card__sub">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {submitted ? (
            <div className="forgot-success">
              <div className="forgot-success__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <p className="forgot-success__title">Check your email</p>
              <p className="forgot-success__body">
                If <strong>{email}</strong> is registered, you'll receive a reset link shortly.
              </p>
              <p className="forgot-success__note">
                Didn't receive it? Check your spam folder or{' '}
                <a href={`tel:${hotelConfig.contact.phone}`}>call us directly</a>.
              </p>
              <button
                className="btn btn--outline"
                style={{ marginTop: '0.5rem' }}
                onClick={() => setSubmitted(false)}
              >
                Try a different email
              </button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn--primary auth-form__submit"
                disabled={loading}
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="auth-card__footer">
            <p><Link to="/login">← Back to Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}