// src/pages/ConfirmationPage.jsx — Pure Tailwind
import { useEffect, useState } from 'react';
import { Link, useNavigate }   from 'react-router-dom';
import { useBooking }          from '../hooks/useBooking.jsx';
import { useGuestAuth }        from '../hooks/useGuestAuth.jsx';
import { useHotelConfig }      from '../hooks/useHotelConfig.jsx';

export default function ConfirmationPage() {
  const hotelConfig = useHotelConfig();
  const { state, dispatch } = useBooking();
  const { isLoggedIn, register } = useGuestAuth();
  const navigate = useNavigate();
  const res = state.confirmedReservation;

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
    if (res && !isLoggedIn) {
      const t = setTimeout(() => setShowAccountPrompt(true), 1200);
      return () => clearTimeout(t);
    }
  }, [res, hotelConfig.shortName]);

  const handleCreateAccount = async () => {
    setAccountError('');
    if (password.length < 8)     { setAccountError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPass) { setAccountError('Passwords do not match.'); return; }
    setCreating(true);
    try {
      await register({ full_name: guestName, email: guestEmail, phone: state.guestDetails?.phone || '', password });
      setAccountDone(true);
    } catch (err) {
      if (err.status === 409) {
        setAccountError('An account with this email already exists. Sign in to view your booking.');
      } else {
        setAccountError(err.message || 'Could not create account. Please try again.');
      }
    } finally { setCreating(false); }
  };

  if (!res) return null;

  return (
    <div className="min-h-screen bg-bg pt-nav pb-16">
      <div className="container max-w-2xl">
        <div className="bg-surface rounded-lg border border-border p-8 lg:p-10 flex flex-col gap-8">

          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="28" height="28" className="text-green-600">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <h1 className="font-display text-4xl font-medium mb-2">Booking Confirmed!</h1>
              <p className="text-sm text-muted">
                Thank you, <strong className="text-primary">{guestName}</strong>.
                A confirmation has been sent to <strong className="text-primary">{guestEmail}</strong>.
              </p>
            </div>
          </div>

          <div className="bg-bg rounded-lg p-5 text-center border border-border">
            <p className="text-xs text-muted uppercase tracking-widest mb-2">Booking Reference</p>
            <p className="font-mono text-2xl font-medium text-secondary tracking-widest">
              {res.reservation_no || res.confirmation_number || res.id}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              ['Room',      state.selectedRoom?.name],
              ['Check-in',  state.search.checkIn],
              ['Check-out', state.search.checkOut],
              ['Guests',    state.search.guests],
              ['Status',    res.status || 'Confirmed'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm py-2 border-b border-border">
                <span className="text-muted">{label}</span>
                <strong className={label === 'Status' ? 'text-green-600' : 'text-primary'}>{value}</strong>
              </div>
            ))}
          </div>

          <div className="bg-secondary/10 rounded-lg p-4 text-sm text-center">
            <p><strong>Check-in:</strong> {hotelConfig.contact.checkIn} &nbsp;|&nbsp; <strong>Check-out:</strong> {hotelConfig.contact.checkOut}</p>
            <p className="text-muted mt-1">{hotelConfig.contact.address}</p>
          </div>

          {showAccountPrompt && !isLoggedIn && (
            <div className="border border-border rounded-lg p-5">
              {!accountDone ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg border border-border flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Save your booking to an account</p>
                      <p className="text-xs text-muted">Manage, view and cancel bookings anytime</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="input opacity-60 cursor-not-allowed" value={guestEmail} disabled />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Set a password</label>
                      <input type="password" className="input" placeholder="Min. 8 characters"
                        value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm password</label>
                      <input type="password" className="input" placeholder="Repeat password"
                        value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                    </div>
                    {accountError && <p className="form-error">{accountError}</p>}
                    <button className="btn btn--primary w-full justify-center" onClick={handleCreateAccount} disabled={creating}>
                      {creating ? 'Creating account…' : 'Create Account'}
                    </button>
                  </div>
                  <button className="text-xs text-muted hover:text-primary transition-colors text-center"
                    onClick={() => setShowAccountPrompt(false)}>
                    No thanks, I'll use my reference number
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Account created! You can now <Link to="/account" className="underline ml-1">view your booking</Link> anytime.
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-center">
            {(isLoggedIn || accountDone) && (
              <Link to="/account" className="btn btn--outline">View My Bookings</Link>
            )}
            <Link to="/" className="btn btn--primary" onClick={() => dispatch({ type: 'RESET_BOOKING' })}>
              Back to Home
            </Link>
          </div>

          <p className="text-xs text-center text-muted">
            Questions? Call us at{' '}
            <a href={`tel:${hotelConfig.contact.phone}`} className="text-secondary hover:underline">{hotelConfig.contact.phone}</a>
          </p>
        </div>
      </div>
    </div>
  );
}