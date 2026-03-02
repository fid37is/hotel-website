// src/pages/ConfirmationPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate }   from 'react-router-dom';
import { useBooking }          from '../hooks/useBooking.jsx';
import { useGuestAuth }        from '../hooks/useGuestAuth.jsx';
import { guestAuthApi }        from '../services/api.js';
import hotelConfig             from '../config/hotel.config.js';
import './ConfirmationPage.css';

export default function ConfirmationPage() {
  const { state, dispatch } = useBooking();
  const { isLoggedIn, login, register } = useGuestAuth();
  const navigate = useNavigate();
  const res = state.confirmedReservation;

  // Post-booking account creation state
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [password,     setPassword]     = useState('');
  const [confirmPass,  setConfirmPass]  = useState('');
  const [accountError, setAccountError] = useState('');
  const [creating,     setCreating]     = useState(false);
  const [accountDone,  setAccountDone]  = useState(false);

  const guestEmail = res?.guest?.email || state.guestDetails?.email;
  const guestName  = res?.guest?.first_name
    ? `${res.guest.first_name} ${res.guest.last_name || ''}`.trim()
    : `${state.guestDetails?.firstName || ''} ${state.guestDetails?.lastName || ''}`.trim();

  useEffect(() => {
    document.title = `Booking Confirmed | ${hotelConfig.shortName}`;
    if (!res) navigate('/book');
    // Show account prompt after a short delay if guest isn't already logged in
    if (res && !isLoggedIn) {
      const t = setTimeout(() => setShowAccountPrompt(true), 1200);
      return () => clearTimeout(t);
    }
  }, [res]);

  const handleCreateAccount = async () => {
    setAccountError('');
    if (password.length < 8)          { setAccountError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPass)      { setAccountError('Passwords do not match.'); return; }
    setCreating(true);
    try {
      await register({
        full_name: guestName,
        email:     guestEmail,
        phone:     state.guestDetails?.phone || '',
        password,
      });
      setAccountDone(true);
    } catch (err) {
      // Account may already exist — try login instead
      if (err.status === 409) {
        setAccountError('An account with this email already exists. Sign in to view your booking.');
      } else {
        setAccountError(err.message || 'Could not create account. Please try again.');
      }
    } finally {
      setCreating(false);
    }
  };

  if (!res) return null;

  return (
    <div className="confirm-page">
      <div className="confirm-page__inner container">
        <div className="confirm-card">

          {/* Success icon */}
          <div className="confirm-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="28" height="28">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <h1 className="confirm-card__title">Booking Confirmed!</h1>
          <p className="confirm-card__sub">
            Thank you, <strong>{guestName}</strong>.
            Your reservation is confirmed. A confirmation has been sent to{' '}
            <strong>{guestEmail}</strong>.
          </p>

          {/* Reference */}
          <div className="confirm-card__ref">
            <span className="confirm-card__ref-label">Booking Reference</span>
            <span className="confirm-card__ref-code">
              {res.reservation_no || res.confirmation_number || res.id}
            </span>
          </div>

          {/* Details */}
          <div className="confirm-card__details">
            <div className="confirm-card__detail-row">
              <span>Room</span>
              <strong>{state.selectedRoom?.name}</strong>
            </div>
            <div className="confirm-card__detail-row">
              <span>Check-in</span>
              <strong>{state.search.checkIn}</strong>
            </div>
            <div className="confirm-card__detail-row">
              <span>Check-out</span>
              <strong>{state.search.checkOut}</strong>
            </div>
            <div className="confirm-card__detail-row">
              <span>Guests</span>
              <strong>{state.search.guests}</strong>
            </div>
            <div className="confirm-card__detail-row">
              <span>Status</span>
              <strong className="confirm-card__status">{res.status || 'Confirmed'}</strong>
            </div>
          </div>

          {/* Hotel info */}
          <div className="confirm-card__notice">
            <p><strong>Check-in:</strong> {hotelConfig.contact.checkIn} &nbsp;|&nbsp; <strong>Check-out:</strong> {hotelConfig.contact.checkOut}</p>
            <p>{hotelConfig.contact.address}</p>
          </div>

          {/* ── Post-booking account prompt ── */}
          {showAccountPrompt && !isLoggedIn && (
            <div className="confirm-account">
              {!accountDone ? (
                <>
                  <div className="confirm-account__header">
                    <div className="confirm-account__icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div>
                      <p className="confirm-account__title">Save your booking to an account</p>
                      <p className="confirm-account__sub">Manage, view and cancel bookings anytime</p>
                    </div>
                  </div>

                  <div className="confirm-account__fields">
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="input" value={guestEmail} disabled />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Set a password</label>
                      <input
                        className="input"
                        type="password"
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm password</label>
                      <input
                        className="input"
                        type="password"
                        placeholder="Repeat password"
                        value={confirmPass}
                        onChange={e => setConfirmPass(e.target.value)}
                      />
                    </div>
                    {accountError && <p className="form-error">{accountError}</p>}
                    <button
                      className="btn btn--primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={handleCreateAccount}
                      disabled={creating}
                    >
                      {creating ? 'Creating account…' : 'Create Account'}
                    </button>
                  </div>

                  <button
                    className="confirm-account__skip"
                    onClick={() => setShowAccountPrompt(false)}
                  >
                    No thanks, I'll use my reference number
                  </button>
                </>
              ) : (
                <div className="confirm-account__success">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Account created! You can now{' '}
                  <Link to="/account">view your booking</Link> anytime.
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="confirm-card__actions">
            {isLoggedIn || accountDone ? (
              <Link to="/account" className="btn btn--outline">View My Bookings</Link>
            ) : null}
            <Link
              to="/"
              className="btn btn--primary"
              onClick={() => dispatch({ type: 'RESET_BOOKING' })}
            >
              Back to Home
            </Link>
          </div>

          <p className="confirm-card__help">
            Questions? Call us at{' '}
            <a href={`tel:${hotelConfig.contact.phone}`}>{hotelConfig.contact.phone}</a>
          </p>

        </div>
      </div>
    </div>
  );
}