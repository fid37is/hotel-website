// src/pages/RegisterPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGuestAuth } from '../hooks/useGuestAuth.jsx';
import hotelConfig      from '../config/hotel.config.js';
import './AuthPages.css';

export default function RegisterPage() {
  const { register, isLoggedIn } = useGuestAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from     = location.state?.from || '/account';

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '', confirm_password: '',
  });
  const [showPwd,  setShowPwd]  = useState(false);
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
    if (!form.full_name.trim())   e.full_name = 'Full name is required';
    if (!form.email.trim())       e.email     = 'Email is required';
    if (form.password.length < 8) e.password  = 'Password must be at least 8 characters';
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
                placeholder="John Doe"
                value={form.full_name}
                onChange={e => set('full_name', e.target.value)}
                autoComplete="name" required />
              {errors.full_name && <span className="form-error">{errors.full_name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className={`input ${errors.email ? 'input--error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                autoComplete="email" required />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number <span style={{color:'var(--clr-muted)'}}>optional</span></label>
              <input type="tel" className="input"
                placeholder="+234 800 000 0000"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                autoComplete="tel" />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className={`input ${errors.password ? 'input--error' : ''}`}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  autoComplete="new-password" required />
                <button type="button" className="auth-input-toggle"
                  onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`input ${errors.confirm_password ? 'input--error' : ''}`}
                placeholder="Repeat password"
                value={form.confirm_password}
                onChange={e => set('confirm_password', e.target.value)}
                autoComplete="new-password" required />
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