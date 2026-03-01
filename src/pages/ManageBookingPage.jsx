// src/pages/ManageBookingPage.jsx
import { useState, useEffect }   from 'react';
import { useBooking }            from '../hooks/useBooking.jsx';
import { reservationsApi, folioApi } from '../services/api.js';
import hotelConfig               from '../config/hotel.config.js';
import './ManageBookingPage.css';

const fmt = (amt) => new Intl.NumberFormat('en-NG', {
  style: 'currency', currency: hotelConfig.payment.currency, minimumFractionDigits: 0,
}).format(amt);

export default function ManageBookingPage() {
  const { state } = useBooking();

  // If guest just booked, pre-fill from context
  const prefillId    = state.confirmedReservation?.id || state.confirmedReservation?.confirmation_number || '';
  const prefillEmail = state.guestDetails.email || '';

  const [refInput,  setRefInput]  = useState(prefillId);
  const [email,     setEmail]     = useState(prefillEmail);
  const [token,     setToken]     = useState(state.guestToken || '');

  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [reservation, setReservation] = useState(
    state.confirmedReservation ? state.confirmedReservation : null
  );
  const [folio,     setFolio]     = useState(null);

  const [cancelling,   setCancelling]   = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelDone,   setCancelDone]   = useState(false);
  const [cancelError,  setCancelError]  = useState('');

  useEffect(() => {
    document.title = `Manage Booking | ${hotelConfig.shortName}`;
    // If we already have context from a fresh booking, load the folio too
    if (reservation && token) {
      folioApi.getByReservation(reservation.id, token)
        .then(r => setFolio(r.data))
        .catch(() => {});
    }
  }, []);

  const handleLookup = async (e) => {
    e.preventDefault();
    setError('');
    setReservation(null);
    setFolio(null);
    setLoading(true);

    try {
      // Guest must have their token. In a real flow this comes from their confirmation email.
      // For demo: if they have token in session we use it, else we tell them to check email.
      if (!token) {
        setError('Please use the link in your confirmation email to access your booking, or call us directly.');
        return;
      }
      const r = await reservationsApi.getById(refInput, token);
      setReservation(r.data);

      // Try to load folio
      folioApi.getByReservation(r.data.id, token)
        .then(fr => setFolio(fr.data))
        .catch(() => {});
    } catch (err) {
      setError(err.message || 'Booking not found. Please check your reference number.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    setCancelling(true);
    setCancelError('');
    try {
      await reservationsApi.cancel(reservation.id, cancelReason, token);
      setCancelDone(true);
      setReservation(r => ({ ...r, status: 'cancelled' }));
    } catch (err) {
      setCancelError(err.message || 'Cancellation failed. Please call us directly.');
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = reservation &&
    !['cancelled', 'checked_out', 'checked_in'].includes(reservation.status) &&
    !cancelDone;

  return (
    <div className="manage-page">
      <div className="container">
        <div className="manage-page__header">
          <p className="section-label">Guest Services</p>
          <h1 className="section-title">Manage My Booking</h1>
          <p className="manage-page__sub">
            View your reservation details, folio, or cancel your booking.
          </p>
        </div>

        {/* Lookup form */}
        {!reservation && (
          <form className="manage-lookup" onSubmit={handleLookup}>
            <div className="form-group">
              <label className="form-label">Booking Reference</label>
              <input
                className="input"
                value={refInput}
                onChange={e => setRefInput(e.target.value)}
                placeholder="e.g. RES-00123"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email used at booking"
              />
            </div>
            {error && <div className="alert alert--error">{error}</div>}
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Looking up…' : 'Find My Booking'}
            </button>
            <p className="manage-lookup__hint">
              The booking link in your confirmation email will sign you in automatically.
            </p>
          </form>
        )}

        {/* Reservation details */}
        {reservation && (
          <div className="manage-details">
            <div className="manage-details__header">
              <div>
                <p className="manage-details__ref">Ref: {reservation.confirmation_number || reservation.id}</p>
                <span className={`manage-details__status manage-details__status--${reservation.status}`}>
                  {reservation.status}
                </span>
              </div>
              <button className="btn btn--outline" onClick={() => setReservation(null)}>
                Look up another
              </button>
            </div>

            <div className="manage-details__grid">
              <div className="manage-details__section">
                <h3>Stay Details</h3>
                <div className="manage-review-row"><span>Room</span><strong>{reservation.room_type?.name || 'Room'}</strong></div>
                <div className="manage-review-row"><span>Check-in</span><strong>{reservation.check_in}</strong></div>
                <div className="manage-review-row"><span>Check-out</span><strong>{reservation.check_out}</strong></div>
                <div className="manage-review-row"><span>Guests</span><strong>{reservation.adults}</strong></div>
              </div>

              {folio && (
                <div className="manage-details__section">
                  <h3>Billing Summary</h3>
                  <div className="manage-review-row"><span>Room charges</span><strong>{fmt(folio.room_charges || 0)}</strong></div>
                  <div className="manage-review-row"><span>Other charges</span><strong>{fmt(folio.other_charges || 0)}</strong></div>
                  <div className="manage-review-row"><span>Total paid</span><strong>{fmt(folio.total_paid || 0)}</strong></div>
                  <div className="manage-review-row manage-review-row--balance">
                    <span>Balance due</span>
                    <strong>{fmt(folio.balance || 0)}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Cancellation */}
            {canCancel && (
              <div className="manage-cancel">
                <h3>Cancel Reservation</h3>
                <p>Cancellation is subject to our cancellation policy. Please review before proceeding.</p>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label">Reason (optional)</label>
                  <input className="input" value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                    placeholder="Change of plans…" />
                </div>
                {cancelError && <div className="alert alert--error" style={{ marginTop: '1rem' }}>{cancelError}</div>}
                <button
                  className="btn btn--outline manage-cancel__btn"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling…' : 'Cancel My Reservation'}
                </button>
              </div>
            )}

            {cancelDone && (
              <div className="alert alert--success">Your reservation has been cancelled. We hope to welcome you another time.</div>
            )}

            <p className="manage-details__help">
              Need assistance?{' '}
              <a href={`tel:${hotelConfig.contact.phone}`}>{hotelConfig.contact.phone}</a>
              {' '}or{' '}
              <a href={`mailto:${hotelConfig.contact.email}`}>{hotelConfig.contact.email}</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
