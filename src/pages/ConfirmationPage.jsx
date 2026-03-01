// src/pages/ConfirmationPage.jsx
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking }        from '../hooks/useBooking.jsx';
import hotelConfig           from '../config/hotel.config.js';
import './ConfirmationPage.css';

export default function ConfirmationPage() {
  const { state, dispatch } = useBooking();
  const navigate = useNavigate();
  const res = state.confirmedReservation;

  useEffect(() => {
    document.title = `Booking Confirmed | ${hotelConfig.shortName}`;
    if (!res) navigate('/book');
  }, [res]);

  if (!res) return null;

  return (
    <div className="confirm-page">
      <div className="confirm-page__inner container">
        <div className="confirm-card">
          <div className="confirm-card__icon">✓</div>
          <h1 className="confirm-card__title">Booking Confirmed!</h1>
          <p className="confirm-card__sub">
            Thank you, <strong>{res.guest?.first_name || state.guestDetails.firstName}</strong>.
            Your reservation is confirmed. A confirmation has been sent to{' '}
            <strong>{res.guest?.email || state.guestDetails.email}</strong>.
          </p>

          <div className="confirm-card__ref">
            <span className="confirm-card__ref-label">Booking Reference</span>
            <span className="confirm-card__ref-code">
              {res.confirmation_number || res.id}
            </span>
          </div>

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

          <div className="confirm-card__notice">
            <p><strong>Check-in:</strong> {hotelConfig.contact.checkIn} &nbsp;|&nbsp; <strong>Check-out:</strong> {hotelConfig.contact.checkOut}</p>
            <p>{hotelConfig.contact.address}</p>
          </div>

          <div className="confirm-card__actions">
            <Link to="/manage" className="btn btn--outline">Manage My Booking</Link>
            <Link to="/" className="btn btn--primary" onClick={() => dispatch({ type: 'RESET_BOOKING' })}>
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
