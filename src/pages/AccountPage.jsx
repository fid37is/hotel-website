// src/pages/AccountPage.jsx — Pure Tailwind
import { useState, useEffect } from 'react';
import { Link, useNavigate }   from 'react-router-dom';
import { useGuestAuth }        from '../hooks/useGuestAuth.jsx';
import { useHotelConfig }      from '../hooks/useHotelConfig.jsx';
import { guestAuthApi }        from '../services/api.js';
import { fmt }                 from '../utils/currency.js';

const STATUS = {
  confirmed:   { label: 'Confirmed',   cls: 'bg-green-100 text-green-700' },
  checked_in:  { label: 'Checked In',  cls: 'bg-blue-100 text-blue-700'  },
  checked_out: { label: 'Checked Out', cls: 'bg-gray-100 text-gray-600'  },
  cancelled:   { label: 'Cancelled',   cls: 'bg-red-100 text-red-600'    },
  no_show:     { label: 'No Show',     cls: 'bg-orange-100 text-orange-600' },
};

const nights = (ci, co) => Math.max(0, Math.round((new Date(co) - new Date(ci)) / 86400000));

export default function AccountPage() {
  const hotelConfig = useHotelConfig();
  const { guest, token, isLoggedIn, loading: authLoading, logout } = useGuestAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [resLoading,   setResLoading]   = useState(false);
  const [activeTab,    setActiveTab]    = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling,   setCancelling]   = useState(false);
  const [cancelError,  setCancelError]  = useState('');

  useEffect(() => { document.title = `My Account | ${hotelConfig.shortName}`; }, [hotelConfig.shortName]);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) { navigate('/login', { state: { from: '/account' }, replace: true }); return; }
    loadReservations();
  }, [authLoading, isLoggedIn]);

  const loadReservations = async () => {
    setResLoading(true);
    try {
      const res = await guestAuthApi.myReservations(token);
      setReservations(Array.isArray(res.data) ? res.data : []);
    } catch { setReservations([]); }
    finally   { setResLoading(false); }
  };

  const handleCancel = async (reservationId) => {
    setCancelling(true); setCancelError('');
    try {
      await guestAuthApi.cancelReservation(reservationId, cancelReason, token);
      setCancellingId(null); setCancelReason('');
      setReservations(rs => rs.map(r => r.id === reservationId ? { ...r, status: 'cancelled' } : r));
    } catch (err) {
      setCancelError(err.message || 'Cancellation failed. Please call us.');
    } finally { setCancelling(false); }
  };

  const today     = new Date().toISOString().split('T')[0];
  const upcoming  = reservations.filter(r => ['confirmed', 'checked_in'].includes(r.status) && r.check_in_date >= today);
  const past      = reservations.filter(r => ['checked_out', 'no_show'].includes(r.status) || (r.status === 'confirmed' && r.check_out_date < today));
  const cancelled = reservations.filter(r => r.status === 'cancelled');
  const displayed = { upcoming, past, cancelled }[activeTab] || [];

  if (authLoading) return (
    <div className="container max-w-2xl py-10 flex flex-col gap-4">
      <div className="skeleton h-20 rounded-lg" /><div className="skeleton h-24 rounded-lg" /><div className="skeleton h-48 rounded-lg" />
    </div>
  );

  return (
    <div className="bg-bg min-h-screen pt-nav pb-10">
      <div className="container max-w-3xl flex flex-col gap-6">

        <div className="bg-surface rounded-lg border border-border p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-primary text-white font-display text-2xl flex items-center justify-center shrink-0">
            {guest?.full_name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-medium">{guest?.full_name}</h1>
            <p className="text-sm text-muted truncate">{guest?.email}</p>
          </div>
          <button className="btn btn--outline text-xs" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
        </div>

        {(guest?.phone || guest?.address) && (
          <div className="bg-surface rounded-lg border border-border p-5">
            {guest?.phone && (
              <div className="flex justify-between text-sm py-2 border-b border-border">
                <span className="text-muted">Phone</span><span>{guest.phone}</span>
              </div>
            )}
            {guest?.address && (
              <div className="flex justify-between text-sm py-2">
                <span className="text-muted">Address</span><span>{guest.address}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {[
            { to: '/book', icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>, label: 'Book a Room' },
            { href: `tel:${hotelConfig.contact.phone}`, icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.64A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>, label: 'Call Hotel' },
            { href: `mailto:${hotelConfig.contact.email}`, icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>, label: 'Email Us' },
          ].map(({ to, href, icon, label }) => {
            const cls = "bg-surface border border-border rounded-lg p-4 flex flex-col items-center gap-2 text-xs font-medium hover:border-secondary/50 transition-colors";
            const content = (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">{icon}</svg>
                <span>{label}</span>
              </>
            );
            return to
              ? <Link key={label} to={to} className={cls}>{content}</Link>
              : <a key={label} href={href} className={cls}>{content}</a>;
          })}
        </div>

        <div className="flex border-b border-border">
          {[
            { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
            { key: 'past',     label: 'Past',     count: past.length     },
            { key: 'cancelled',label: 'Cancelled',count: cancelled.length},
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium tracking-wide border-b-2 transition-colors -mb-px
                ${activeTab === tab.key ? 'border-secondary text-primary' : 'border-transparent text-muted hover:text-primary'}`}>
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {resLoading ? (
          <div className="flex flex-col gap-4">{[1,2].map(i => <div key={i} className="skeleton h-40 rounded-lg" />)}</div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <p className="font-display text-2xl text-muted">No {activeTab} reservations</p>
            {activeTab === 'upcoming' && <Link to="/book" className="btn btn--primary">Book a Room</Link>}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayed.map(res => {
              const status = STATUS[res.status] || { label: res.status, cls: 'bg-gray-100 text-gray-600' };
              const n = nights(res.check_in_date, res.check_out_date);
              const isCancelling = cancellingId === res.id;
              return (
                <div key={res.id} className="bg-surface rounded-lg border border-border p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-muted mb-0.5">{res.reservation_no}</p>
                      <p className="font-display text-xl font-medium">{res.room_types?.name || res.room_type_name || 'Room'}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.cls}`}>{status.label}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div><p className="text-xs text-muted">Check-in</p><p className="font-medium">{res.check_in_date}</p></div>
                    <span className="text-muted">→</span>
                    <div><p className="text-xs text-muted">Check-out</p><p className="font-medium">{res.check_out_date}</p></div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                    <span>{n} night{n !== 1 ? 's' : ''}</span>
                    <span>·</span>
                    <span>{res.adults} adult{res.adults !== 1 ? 's' : ''}</span>
                    {res.children > 0 && <><span>·</span><span>{res.children} child{res.children !== 1 ? 'ren' : ''}</span></>}
                    <span>·</span>
                    <span className="font-medium text-primary">{fmt(res.total_amount)}</span>
                  </div>

                  {res.status === 'confirmed' && res.check_in_date >= today && (
                    <div className="pt-3 border-t border-border">
                      {!isCancelling ? (
                        <button className="text-xs text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => { setCancellingId(res.id); setCancelError(''); }}>
                          Cancel Reservation
                        </button>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <input className="input text-sm" placeholder="Reason (optional)"
                            value={cancelReason} onChange={e => setCancelReason(e.target.value)} />
                          {cancelError && <p className="form-error">{cancelError}</p>}
                          <div className="flex gap-3">
                            <button className="btn btn--outline text-xs"
                              onClick={() => { setCancellingId(null); setCancelReason(''); }}>Keep Booking</button>
                            <button className="btn btn--danger text-xs" onClick={() => handleCancel(res.id)} disabled={cancelling}>
                              {cancelling ? 'Cancelling…' : 'Confirm Cancel'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}