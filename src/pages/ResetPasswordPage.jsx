// src/pages/ResetPasswordPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { guestAuthApi } from '../services/api.js';
import hotelConfig      from '../config/hotel.config.js';
import './AuthPages.css';

const EyeIcon = ({ open }) => open ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export default function ResetPasswordPage() {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const token           = searchParams.get('token');

  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [showPwd,   setShowPwd]   = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    document.title = `Set New Password | ${hotelConfig.shortName}`;
  }, []);

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-page__inner">
          <div className="auth-card">
            <div className="auth-card__header">
              <Link to="/" className="auth-card__logo">{hotelConfig.shortName}</Link>
              <h1 className="auth-card__title">Invalid Link</h1>
              <p className="auth-card__sub">This password reset link is invalid or has expired.</p>
            </div>
            <div className="auth-card__footer">
              <p><Link to="/forgot-password">Request a new link</Link></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setError('');
    setLoading(true);
    try {
      await guestAuthApi.resetPassword({ token, password });
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Reset failed. Your link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__inner">
        <div className="auth-card">
          <div className="auth-card__header">
            <Link to="/" className="auth-card__logo">{hotelConfig.shortName}</Link>
            <h1 className="auth-card__title">Set New Password</h1>
            <p className="auth-card__sub">Choose a strong password for your account</p>
          </div>

          {done ? (
            <div className="forgot-success">
              <div className="forgot-success__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <p className="forgot-success__title">Password updated!</p>
              <p className="forgot-success__body">Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              {error && <div className="alert alert--error">{error}</div>}
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div className="auth-input-wrap">
                    <input
                      type={showPwd ? 'text' : 'password'} className="input"
                      placeholder="Min. 8 characters"
                      value={password} onChange={e => setPassword(e.target.value)}
                      autoComplete="new-password" required />
                    <button type="button" className="auth-input-toggle"
                      onClick={() => setShowPwd(v => !v)}>
                      <EyeIcon open={showPwd} />
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password" className="input"
                    placeholder="Repeat password"
                    value={confirm} onChange={e => setConfirm(e.target.value)}
                    autoComplete="new-password" required />
                </div>

                <button type="submit" className="btn btn--primary auth-form__submit" disabled={loading}>
                  {loading ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </>
          )}

          <div className="auth-card__footer">
            <p><Link to="/login">← Back to Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}