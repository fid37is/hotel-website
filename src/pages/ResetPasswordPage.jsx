// src/pages/ResetPasswordPage.jsx — Pure Tailwind
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { guestAuthApi } from '../services/api.js';
import hotelConfig      from '../config/hotel.config.js';

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

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const token          = searchParams.get('token');

  const [password,setPassword] = useState('');
  const [confirm, setConfirm]  = useState('');
  const [showPwd, setShowPwd]  = useState(false);
  const [loading, setLoading]  = useState(false);
  const [done,    setDone]     = useState(false);
  const [error,   setError]    = useState('');

  useEffect(() => { document.title = `Set New Password | ${hotelConfig.shortName}`; }, []);

  const AuthCard = ({ children }) => (
    <div className="min-h-screen bg-bg flex items-center justify-center pt-nav px-4 pb-12">
      <div className="w-full max-w-md bg-surface rounded-lg border border-border p-8 lg:p-10">{children}</div>
    </div>
  );

  if (!token) return (
    <AuthCard>
      <div className="text-center">
        <Link to="/" className="font-display text-2xl font-medium">{hotelConfig.shortName}</Link>
        <h1 className="text-2xl font-medium mt-4 mb-2">Invalid Link</h1>
        <p className="text-sm text-muted mb-6">This password reset link is invalid or has expired.</p>
        <Link to="/forgot-password" className="text-secondary hover:underline text-sm">Request a new link</Link>
      </div>
    </AuthCard>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm)  { setError('Passwords do not match.'); return; }
    setError(''); setLoading(true);
    try { await guestAuthApi.resetPassword({ token, password }); setDone(true); setTimeout(() => navigate('/login'), 3000); }
    catch (err) { setError(err.message || 'Reset failed. Your link may have expired.'); }
    finally     { setLoading(false); }
  };

  return (
    <AuthCard>
      <div className="text-center mb-8">
        <Link to="/" className="font-display text-2xl font-medium">{hotelConfig.shortName}</Link>
        <h1 className="text-2xl font-medium mt-4 mb-1">Set New Password</h1>
        <p className="text-sm text-muted">Choose a strong password for your account</p>
      </div>

      {done ? (
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28" className="text-green-600">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <p className="font-medium">Password updated!</p>
          <p className="text-sm text-muted">Redirecting you to sign in…</p>
        </div>
      ) : (
        <>
          {error && <div className="alert alert--error mb-5">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} className="input pr-12" placeholder="Min. 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                  onClick={() => setShowPwd(v => !v)}><EyeIcon open={showPwd} /></button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="input" placeholder="Repeat password"
                value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" required />
            </div>
            <button type="submit" className="btn btn--primary justify-center w-full py-3.5" disabled={loading}>
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </>
      )}
      <div className="mt-6 pt-6 border-t border-border text-center text-sm">
        <Link to="/login" className="text-secondary hover:underline">← Back to Sign In</Link>
      </div>
    </AuthCard>
  );
}
