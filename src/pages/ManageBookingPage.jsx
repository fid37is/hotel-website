// src/pages/ManageBookingPage.jsx — Pure Tailwind
import { useState, useEffect } from 'react';
import { useBooking }          from '../hooks/useBooking.jsx';
import { reservationsApi, folioApi } from '../services/api.js';
import hotelConfig             from '../config/hotel.config.js';

const fmt = (amt) => new Intl.NumberFormat('en-NG', {
  style: 'currency', currency: hotelConfig.payment.currency, minimumFractionDigits: 0,
}).format(amt);

const STATUS_CLS = {
  confirmed:   'bg-green-100 text-green-700',
  checked_in:  'bg-blue-100 text-blue-700',
  checked_out: 'bg-border/50 text-muted',
  cancelled:   'bg-red-100 text-red-600',
  default:     'bg-border/50 text-muted',
};

export default function ManageBookingPage() {
  const { state } = useBooking();
  const prefillId    = state.confirmedReservation?.id || '';
  const prefillEmail = state.guestDetails.email || '';

  const [refInput,    setRefInput]    = useState(prefillId);
  const [email,       setEmail]       = useState(prefillEmail);
  const [token,       setToken]       = useState(state.guestToken || '');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [reservation, setReservation] = useState(state.confirmedReservation || null);
  const [folio,       setFolio]       = useState(null);
  const [cancelling,  setCancelling]  = useState(false);
  const [cancelReason,setCancelReason]= useState('');
  const [cancelDone,  setCancelDone]  = useState(false);
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    document.title = `Manage Booking | ${hotelConfig.shortName}`;
    if (reservation && token) {
      folioApi.getByReservation(reservation.id, token).then(r => setFolio(r.data)).catch(() => {});
    }
  }, []);

  const handleLookup = async (e) => {
    e.preventDefault();
    setError(''); setReservation(null); setFolio(null); setLoading(true);
    try {
      if (!token) { setError('Please use the link in your confirmation email, or call us directly.'); return; }
      const r = await reservationsApi.getById(refInput, token);
      setReservation(r.data);
      folioApi.getByReservation(r.data.id, token).then(fr => setFolio(fr.data)).catch(() => {});
    } catch (err) {
      setError(err.message || 'Booking not found. Please check your reference number.');
    } finally { setLoading(false); }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    setCancelling(true); setCancelError('');
    try {
      await reservationsApi.cancel(reservation.id, cancelReason, token);
      setCancelDone(true);
      setReservation(r => ({ ...r, status: 'cancelled' }));
    } catch (err) {
      setCancelError(err.message || 'Cancellation failed. Please call us directly.');
    } finally { setCancelling(false); }
  };

  const canCancel = reservation && !['cancelled', 'checked_out', 'checked_in'].includes(reservation.status) && !cancelDone;

  return (
    <div className="bg-bg min-h-screen pb-10" style={{ paddingTop: "calc(var(--nav-h, 72px) + 38px + 2rem)" }}>
      <div className="container max-w-2xl">
        <div className="mb-10">
          <p className="section-label">Guest Services</p>
          <h1 className="section-title mb-2">Manage My Booking</h1>
          <p className="text-muted text-sm">View your reservation details, folio, or cancel your booking.</p>
        </div>

        {!reservation && (
          <form onSubmit={handleLookup} className="bg-surface rounded-lg border border-border p-6 flex flex-col gap-5">
            <div className="form-group">
              <label className="form-label">Booking Reference</label>
              <input className="input" value={refInput} onChange={e => setRefInput(e.target.value)} placeholder="e.g. RES-00123" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email used at booking" />
            </div>
            {error && <div className="alert alert--error">{error}</div>}
            <button type="submit" className="btn btn--primary w-full justify-center" disabled={loading}>
              {loading ? 'Looking up…' : 'Find My Booking'}
            </button>
            <p className="text-xs text-muted text-center">The booking link in your confirmation email will sign you in automatically.</p>
          </form>
        )}

        {reservation && (
          <div className="bg-surface rounded-lg border border-border p-6 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-muted mb-1">Ref: {reservation.confirmation_number || reservation.id}</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_CLS[reservation.status] || STATUS_CLS.default}`}>
                  {reservation.status}
                </span>
              </div>
              <button className="btn btn--outline text-xs" onClick={() => setReservation(null)}>Look up another</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-medium tracking-widest uppercase text-muted mb-3">Stay Details</h3>
                {[
                  ['Room',      reservation.room_type?.name || 'Room'],
                  ['Check-in',  reservation.check_in],
                  ['Check-out', reservation.check_out],
                  ['Guests',    reservation.adults],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm py-2 border-b border-border">
                    <span className="text-muted">{label}</span><strong>{val}</strong>
                  </div>
                ))}
              </div>

              {folio && (
                <div>
                  <h3 className="text-xs font-medium tracking-widest uppercase text-muted mb-3">Billing Summary</h3>
                  {[
                    ['Room charges',  folio.room_charges  || 0],
                    ['Other charges', folio.other_charges || 0],
                    ['Total paid',    folio.total_paid    || 0],
                    ['Balance due',   folio.balance       || 0, true],
                  ].map(([label, val, bold]) => (
                    <div key={label} className={`flex justify-between text-sm py-2 border-b border-border ${bold ? 'font-medium' : ''}`}>
                      <span className="text-muted">{label}</span><strong className={bold ? 'text-secondary' : ''}>{fmt(val)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {canCancel && (
              <div className="border border-border rounded-lg p-4 flex flex-col gap-4">
                <div>
                  <h3 className="font-medium text-sm mb-1">Cancel Reservation</h3>
                  <p className="text-xs text-muted">Cancellation is subject to our cancellation policy. Please review before proceeding.</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Reason (optional)</label>
                  <input className="input" value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="Change of plans…" />
                </div>
                {cancelError && <div className="alert alert--error">{cancelError}</div>}
                <button className="btn btn--outline text-red-600 border-red-200 hover:bg-red-50 text-xs self-start"
                  onClick={handleCancel} disabled={cancelling}>
                  {cancelling ? 'Cancelling…' : 'Cancel My Reservation'}
                </button>
              </div>
            )}

            {cancelDone && <div className="alert alert--success">Your reservation has been cancelled. We hope to welcome you another time.</div>}

            <p className="text-xs text-muted">
              Need assistance?{' '}
              <a href={`tel:${hotelConfig.contact.phone}`} className="text-secondary hover:underline">{hotelConfig.contact.phone}</a>
              {' '}or{' '}
              <a href={`mailto:${hotelConfig.contact.email}`} className="text-secondary hover:underline">{hotelConfig.contact.email}</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}