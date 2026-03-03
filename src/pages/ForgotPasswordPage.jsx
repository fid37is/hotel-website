// src/pages/ForgotPasswordPage.jsx — Pure Tailwind
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { guestAuthApi } from '../services/api.js';
import hotelConfig      from '../config/hotel.config.js';

export default function ForgotPasswordPage() {
  const [email, setEmail]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { document.title = `Reset Password | ${hotelConfig.shortName}`; }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await guestAuthApi.forgotPassword(email); } catch {}
    finally { setLoading(false); setSubmitted(true); }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center pt-nav px-4 pb-12">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-lg border border-border p-8 lg:p-10">
          <div className="text-center mb-8">
            <Link to="/" className="font-display text-2xl font-medium text-primary">{hotelConfig.shortName}</Link>
            <h1 className="text-2xl font-medium mt-4 mb-1">Forgot Password?</h1>
            <p className="text-sm text-muted">Enter your email and we'll send you a reset link</p>
          </div>

          {submitted ? (
            <div className="text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" className="text-green-600">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-lg">Check your email</p>
                <p className="text-sm text-muted mt-1">
                  If <strong>{email}</strong> is registered, you'll receive a reset link shortly.
                </p>
              </div>
              <p className="text-xs text-muted">
                Didn't receive it? Check your spam folder or{' '}
                <a href={`tel:${hotelConfig.contact.phone}`} className="text-secondary hover:underline">call us directly</a>.
              </p>
              <button className="btn btn--outline text-xs mt-2" onClick={() => setSubmitted(false)}>
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="input" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" autoFocus required />
              </div>
              <button type="submit" className="btn btn--primary justify-center w-full py-3.5" disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center text-sm">
            <Link to="/login" className="text-secondary hover:underline">← Back to Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
