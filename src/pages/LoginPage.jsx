// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGuestAuth } from '../hooks/useGuestAuth.jsx';
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

export default function LoginPage() {
  const { login, isLoggedIn } = useGuestAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from || '/account';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    document.title = `Sign In | ${hotelConfig.shortName}`;
    if (isLoggedIn) navigate(from, { replace: true });
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.');
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
            <h1 className="auth-card__title">Welcome back</h1>
            <p className="auth-card__sub">Sign in to manage your reservations</p>
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" className="input"
                placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="email" required
              />
            </div>

            <div className="form-group">
              <div className="auth-label-row">
                <label className="form-label">Password</label>
                <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
              </div>
              <div className="auth-input-wrap">
                <input
                  type={showPwd ? 'text' : 'password'} className="input"
                  placeholder="Your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password" required
                />
                <button type="button" className="auth-input-toggle"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}>
                  <EyeIcon open={showPwd} />
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn--primary auth-form__submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="auth-card__footer">
            <p>Don't have an account?{' '}
              <Link to="/register" state={{ from }}>Create one</Link>
            </p>
            <p className="auth-card__help">
              Need help? <a href={`tel:${hotelConfig.contact.phone}`}>Call us</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}