// src/pages/RegisterPage.jsx
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

export default function RegisterPage() {
  const { register, isLoggedIn } = useGuestAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from     = location.state?.from || '/account';

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', address: '', password: '', confirm_password: '',
  });
  const [showPwd,  setShowPwd]  = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [errors,   setErrors]   = useState({});

  useEffect(() => {
    document.title = `Create Account | ${hotelConfig.shortName}`;
    if (isLoggedIn) navigate(from, { replace: true });
  }, [isLoggedIn]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.full_name.trim())   e.full_name         = 'Full name is required';
    if (!form.email.trim())       e.email             = 'Email is required';
    if (form.password.length < 8) e.password          = 'Minimum 8 characters';
    if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
            <h1 className="auth-card__title">Create Account</h1>
            <p className="auth-card__sub">Book and manage your stays with ease</p>
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className={`input ${errors.full_name ? 'input--error' : ''}`}
                placeholder="John Doe" value={form.full_name}
                onChange={e => set('full_name', e.target.value)}
                autoComplete="name" required />
              {errors.full_name && <span className="form-error">{errors.full_name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className={`input ${errors.email ? 'input--error' : ''}`}
                placeholder="you@example.com" value={form.email}
                onChange={e => set('email', e.target.value)}
                autoComplete="email" required />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Phone Number <span className="form-label-optional">optional</span>
              </label>
              <input type="tel" className="input"
                placeholder="+234 800 000 0000" value={form.phone}
                onChange={e => set('phone', e.target.value)}
                autoComplete="tel" />
            </div>

            <div className="form-group">
              <label className="form-label">
                Address <span className="form-label-optional">optional</span>
              </label>
              <input className="input"
                placeholder="Street, City, State"
                value={form.address}
                onChange={e => set('address', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-input-wrap">
                <input type={showPwd ? 'text' : 'password'}
                  className={`input ${errors.password ? 'input--error' : ''}`}
                  placeholder="Min. 8 characters" value={form.password}
                  onChange={e => set('password', e.target.value)}
                  autoComplete="new-password" required />
                <button type="button" className="auth-input-toggle"
                  onClick={() => setShowPwd(v => !v)}>
                  <EyeIcon open={showPwd} />
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <input type={showConf ? 'text' : 'password'}
                  className={`input ${errors.confirm_password ? 'input--error' : ''}`}
                  placeholder="Repeat password" value={form.confirm_password}
                  onChange={e => set('confirm_password', e.target.value)}
                  autoComplete="new-password" required />
                <button type="button" className="auth-input-toggle"
                  onClick={() => setShowConf(v => !v)}>
                  <EyeIcon open={showConf} />
                </button>
              </div>
              {errors.confirm_password && <span className="form-error">{errors.confirm_password}</span>}
            </div>

            <button type="submit" className="btn btn--primary auth-form__submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="auth-card__footer">
            <p>Already have an account?{' '}
              <Link to="/login" state={{ from }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}