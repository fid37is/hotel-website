// src/pages/AccountPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate }   from 'react-router-dom';
import { useGuestAuth }        from '../hooks/useGuestAuth.jsx';
import { guestAuthApi }        from '../services/api.js';
import { fmt }                 from '../utils/currency.js';
import hotelConfig             from '../config/hotel.config.js';
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
  const { guest, token, isLoggedIn, loading: authLoading, logout } = useGuestAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [resLoading,   setResLoading]   = useState(false);
  const [error,        setError]        = useState('');
  const [activeTab,    setActiveTab]    = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling,   setCancelling]   = useState(false);
  const [cancelError,  setCancelError]  = useState('');

  useEffect(() => {
    document.title = `My Account | ${hotelConfig.shortName}`;
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/account' }, replace: true });
      return;
    }
    loadReservations();
  }, [authLoading, isLoggedIn]);

  const loadReservations = async () => {
    setResLoading(true);
    setError('');
    try {
      const res = await guestAuthApi.myReservations(token);
      setReservations(Array.isArray(res.data) ? res.data : []);
    } catch {
      setReservations([]);
    } finally {
      setResLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    setCancelling(true);
    setCancelError('');
    try {
      await guestAuthApi.cancelReservation(reservationId, cancelReason, token);
      setCancellingId(null);
      setCancelReason('');
      setReservations(rs => rs.map(r =>
        r.id === reservationId ? { ...r, status: 'cancelled' } : r
      ));
    } catch (err) {
      setCancelError(err.message || 'Cancellation failed. Please call us.');
    } finally {
      setCancelling(false);
    }
  };

  const today     = new Date().toISOString().split('T')[0];
  const upcoming  = reservations.filter(r =>
    ['confirmed', 'checked_in'].includes(r.status) && r.check_in_date >= today
  );
  const past      = reservations.filter(r =>
    ['checked_out', 'no_show'].includes(r.status) ||
    (r.status === 'confirmed' && r.check_out_date < today)
  );
  const cancelled = reservations.filter(r => r.status === 'cancelled');

  const tabs = [
    { key: 'upcoming',  label: 'Upcoming',  count: upcoming.length  },
    { key: 'past',      label: 'Past',      count: past.length      },
    { key: 'cancelled', label: 'Cancelled', count: cancelled.length },
  ];

  const displayed = { upcoming, past, cancelled }[activeTab] || [];

  if (authLoading) {
    return (
      <div className="account-page account-page--loading">
        <div className="account-loading">
          <div className="skeleton" style={{ height: '80px',  borderRadius: '12px' }} />
          <div className="skeleton" style={{ height: '100px', borderRadius: '12px' }} />
          <div className="skeleton" style={{ height: '200px', borderRadius: '12px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="container">

        <div className="account-header">
          <div className="account-header__avatar">
            {guest?.full_name?.[0]?.toUpperCase()}
          </div>
          <div className="account-header__info">
            <h1 className="account-header__name">{guest?.full_name}</h1>
            <p className="account-header__email">{guest?.email}</p>
          </div>
          <button
            className="account-header__logout"
            onClick={() => { logout(); navigate('/'); }}
          >
            Sign Out
          </button>
        </div>

        <div className="account-profile">
          {guest?.phone && (
            <div className="account-profile__row">
              <span className="account-profile__label">Phone</span>
              <span className="account-profile__value">{guest.phone}</span>
            </div>
          )}
          {guest?.address && (
            <div className="account-profile__row">
              <span className="account-profile__label">Address</span>
              <span className="account-profile__value">{guest.address}</span>
            </div>
          )}
          {!guest?.phone && !guest?.address && (
            <p className="account-profile__empty">
              No contact details on file.{' '}
              <a href={`tel:${hotelConfig.contact.phone}`}>Call us</a> to update.
            </p>
          )}
        </div>

        <div className="account-actions">
          <Link to="/book" className="account-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Book a Room</span>
          </Link>
          <a href={`tel:${hotelConfig.contact.phone}`} className="account-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.64A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
            <span>Call Hotel</span>
          </a>
          <a href={`mailto:${hotelConfig.contact.email}`} className="account-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>Email Us</span>
          </a>
        </div>

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

        {resLoading ? (
          <div className="account-reservations">
            {[1, 2].map(i => (
              <div key={i} className="skeleton" style={{ height: '160px', borderRadius: '8px' }} />
            ))}
          </div>
        ) : error ? (
          <div className="alert alert--error">{error}</div>
        ) : displayed.length === 0 ? (
          <div className="account-empty">
            <div className="account-empty__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="36" height="36">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
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
              const status    = STATUS_LABELS[res.status] || { label: res.status, color: 'gray' };
              const numNights = nights(res.check_in_date, res.check_out_date);
              const isCancelling = cancellingId === res.id;
              return (
                <div key={res.id} className="res-card">
                  <div className="res-card__header">
                    <div>
                      <p className="res-card__ref">{res.reservation_no}</p>
                      <p className="res-card__room">{res.room_types?.name || res.room_type_name || 'Room'}</p>
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
                    {res.children > 0 && (
                      <>
                        <span>·</span>
                        <span>{res.children} child{res.children !== 1 ? 'ren' : ''}</span>
                      </>
                    )}
                    <span>·</span>
                    <span className="res-card__amount">{fmt(res.total_amount)}</span>
                  </div>
                  {res.special_requests && (
                    <p className="res-card__requests">{res.special_requests}</p>
                  )}
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