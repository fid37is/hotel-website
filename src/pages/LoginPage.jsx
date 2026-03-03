// src/pages/LoginPage.jsx — Pure Tailwind
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGuestAuth }   from '../hooks/useGuestAuth.jsx';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';

const EyeIcon = ({ open }) => open ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

export default function LoginPage() {
  const hotelConfig = useHotelConfig();
  const { login, isLoggedIn } = useGuestAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from     = location.state?.from || '/account';

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
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(email, password); navigate(from, { replace: true }); }
    catch (err) { setError(err.message || 'Sign in failed. Please try again.'); }
    finally     { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center pt-nav px-4 pb-12">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-lg border border-border p-8 lg:p-10">
          <div className="text-center mb-8">
            <Link to="/" className="font-display text-2xl font-medium text-primary">{hotelConfig.shortName}</Link>
            <h1 className="text-2xl font-medium mt-4 mb-1">Welcome back</h1>
            <p className="text-sm text-muted">Sign in to manage your reservations</p>
          </div>

          {error && <div className="alert alert--error mb-5">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="input" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
            </div>
            <div className="form-group">
              <div className="flex justify-between items-center mb-1.5">
                <label className="form-label !mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-secondary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} className="input pr-12"
                  placeholder="Your password" value={password}
                  onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                  onClick={() => setShowPwd(v => !v)} aria-label={showPwd ? 'Hide' : 'Show'}>
                  <EyeIcon open={showPwd} />
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn--primary justify-center w-full py-3.5" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center flex flex-col gap-2 text-sm">
            <p>Don't have an account? <Link to="/register" state={{ from }} className="text-secondary hover:underline">Create one</Link></p>
            <p className="text-xs text-muted">Need help? <a href={`tel:${hotelConfig.contact.phone}`} className="text-secondary hover:underline">Call us</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}