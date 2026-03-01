// src/pages/AccountPage.jsx
import { useState, useEffect }   from 'react';
import { Link, useNavigate }     from 'react-router-dom';
import { useGuestAuth }          from '../hooks/useGuestAuth.jsx';
import { guestAuthApi, reservationsApi } from '../services/api.js';
import { fmt }                   from '../utils/currency.js';
import hotelConfig               from '../config/hotel.config.js';
import './AccountPage.css';

const STATUS_LABELS = {
  confirmed:   { label: 'Confirmed',   color: 'green'  },
  checked_in:  { label: 'Checked In',  color: 'blue'   },
  checked_out: { label: 'Checked Out', color: 'gray'   },
  cancelled:   { label: 'Cancelled',   color: 'red'    },
  no_show:     { label: 'No Show',     color: 'orange' },
};

const nights = (ci, co) =>
  Math.max(0, Math.round((new Date(co) - new Date(ci)) / 86400000));

export default function AccountPage() {
  const { guest, token, isLoggedIn, logout } = useGuestAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [activeTab,    setActiveTab]    = useState('upcoming');

  // Cancel state
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling,   setCancelling]   = useState(false);
  const [cancelError,  setCancelError]  = useState('');

  useEffect(() => {
    document.title = `My Account | ${hotelConfig.shortName}`;
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/account' } });
      return;
    }
    loadReservations();
  }, [isLoggedIn]);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const res = await guestAuthApi.myReservations(token);
      setReservations(res.data || []);
    } catch (err) {
      setError('Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    setCancelling(true);
    setCancelError('');
    try {
      await reservationsApi.cancel(reservationId, cancelReason, token);
      setCancellingId(null);
      setCancelReason('');
      // Update locally
      setReservations(rs => rs.map(r =>
        r.id === reservationId ? { ...r, status: 'cancelled' } : r
      ));
    } catch (err) {
      setCancelError(err.message || 'Cancellation failed. Please call us.');
    } finally {
      setCancelling(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const upcoming = reservations.filter(r =>
    ['confirmed', 'checked_in'].includes(r.status) && r.check_in_date >= today
  );
  const past = reservations.filter(r =>
    ['checked_out', 'no_show'].includes(r.status) ||
    (r.status === 'confirmed' && r.check_out_date < today)
  );
  const cancelled = reservations.filter(r => r.status === 'cancelled');

  const tabs = [
    { key: 'upcoming',  label: 'Upcoming',  count: upcoming.length },
    { key: 'past',      label: 'Past',       count: past.length },
    { key: 'cancelled', label: 'Cancelled',  count: cancelled.length },
  ];

  const displayed = { upcoming, past, cancelled }[activeTab] || [];

  return (
    <div className="account-page">
      <div className="container">

        {/* Profile header */}
        <div className="account-header">
          <div className="account-header__avatar">
            {guest?.full_name?.[0]?.toUpperCase()}
          </div>
          <div className="account-header__info">
            <h1 className="account-header__name">{guest?.full_name}</h1>
            <p className="account-header__email">{guest?.email}</p>
          </div>
          <button className="account-header__logout" onClick={() => { logout(); navigate('/'); }}>
            Sign Out
          </button>
        </div>

        {/* Quick actions */}
        <div className="account-actions">
          <Link to="/book" className="account-action">
            <span className="account-action__icon">🛏</span>
            <span>Book a Room</span>
          </Link>
          <a href={`tel:${hotelConfig.contact.phone}`} className="account-action">
            <span className="account-action__icon">📞</span>
            <span>Call Hotel</span>
          </a>
          <a href={`https://wa.me/${hotelConfig.contact.whatsapp}`} className="account-action" target="_blank" rel="noopener noreferrer">
            <span className="account-action__icon">💬</span>
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Tabs */}
        <div className="account-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`account-tab ${activeTab === tab.key ? 'account-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.count > 0 && <span className="account-tab__badge">{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* Reservations */}
        {loading ? (
          <div className="account-reservations">
            {[1,2].map(i => (
              <div key={i} className="skeleton" style={{ height: '160px', borderRadius: '8px' }} />
            ))}
          </div>
        ) : error ? (
          <div className="alert alert--error">{error}</div>
        ) : displayed.length === 0 ? (
          <div className="account-empty">
            <p className="account-empty__icon">🏨</p>
            <p className="account-empty__title">No {activeTab} reservations</p>
            {activeTab === 'upcoming' && (
              <Link to="/book" className="btn btn--primary" style={{ marginTop: '1rem' }}>
                Book a Room
              </Link>
            )}
          </div>
        ) : (
          <div className="account-reservations">
            {displayed.map(res => {
              const status  = STATUS_LABELS[res.status] || { label: res.status, color: 'gray' };
              const numNights = nights(res.check_in_date, res.check_out_date);
              const isCancelling = cancellingId === res.id;

              return (
                <div key={res.id} className="res-card">
                  <div className="res-card__header">
                    <div>
                      <p className="res-card__ref">{res.reservation_no}</p>
                      <p className="res-card__room">{res.room_type?.name || 'Room'}</p>
                    </div>
                    <span className={`res-card__status res-card__status--${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="res-card__dates">
                    <div className="res-card__date">
                      <span className="res-card__date-label">Check-in</span>
                      <span className="res-card__date-value">{res.check_in_date}</span>
                    </div>
                    <div className="res-card__date-sep">→</div>
                    <div className="res-card__date">
                      <span className="res-card__date-label">Check-out</span>
                      <span className="res-card__date-value">{res.check_out_date}</span>
                    </div>
                  </div>

                  <div className="res-card__meta">
                    <span>{numNights} night{numNights !== 1 ? 's' : ''}</span>
                    <span>·</span>
                    <span>{res.adults} adult{res.adults !== 1 ? 's' : ''}</span>
                    {res.children > 0 && <><span>·</span><span>{res.children} child{res.children !== 1 ? 'ren' : ''}</span></>}
                    <span>·</span>
                    <span className="res-card__amount">{fmt(res.total_amount)}</span>
                  </div>

                  {res.special_requests && (
                    <p className="res-card__requests">💬 {res.special_requests}</p>
                  )}

                  {/* Cancel section */}
                  {res.status === 'confirmed' && res.check_in_date >= today && (
                    <div className="res-card__actions">
                      {!isCancelling ? (
                        <button
                          className="res-card__cancel-btn"
                          onClick={() => { setCancellingId(res.id); setCancelError(''); }}
                        >
                          Cancel Reservation
                        </button>
                      ) : (
                        <div className="res-card__cancel-form">
                          <input
                            className="input"
                            placeholder="Reason (optional)"
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                          />
                          {cancelError && <p className="form-error">{cancelError}</p>}
                          <div className="res-card__cancel-btns">
                            <button
                              className="btn btn--outline"
                              onClick={() => { setCancellingId(null); setCancelReason(''); }}
                            >
                              Keep Booking
                            </button>
                            <button
                              className="btn btn--danger"
                              onClick={() => handleCancel(res.id)}
                              disabled={cancelling}
                            >
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