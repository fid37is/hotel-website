// src/pages/BookingPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link }   from 'react-router-dom';
import { useBooking }          from '../hooks/useBooking.jsx';
import { roomsApi, reservationsApi } from '../services/api.js';
import hotelConfig             from '../config/hotel.config.js';
import { fmt }                 from '../utils/currency.js';
import './BookingPage.css';

const STEPS = ['Select Room', 'Your Details', 'Review & Pay'];


const nights = (ci, co) => {
  if (!ci || !co) return 0;
  return Math.max(0, Math.round((new Date(co) - new Date(ci)) / 86400000));
};

export default function BookingPage() {
  const { state, dispatch } = useBooking();
  const navigate = useNavigate();
  const [step, setStep] = useState(state.selectedRoom ? 1 : 0);

  const [roomTypes,     setRoomTypes]     = useState([]);
  const [loadingRooms,  setLoadingRooms]  = useState(true);
  const [selectedRoom,  setSelectedRoom]  = useState(state.selectedRoom);
  const [selectedRate,  setSelectedRate]  = useState(state.selectedRate);
  const [rates,         setRates]         = useState([]);

  const [form, setForm] = useState({
    firstName:       state.guestDetails.firstName || '',
    lastName:        state.guestDetails.lastName  || '',
    email:           state.guestDetails.email     || '',
    phone:           state.guestDetails.phone     || '',
    specialRequests: state.guestDetails.specialRequests || '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting,  setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const checkIn  = state.search.checkIn;
  const checkOut = state.search.checkOut;
  const numNights = nights(checkIn, checkOut);
  const totalAmount = selectedRate ? selectedRate.rate * numNights : 0;

  useEffect(() => {
    document.title = `Book a Room | ${hotelConfig.shortName}`;
    roomsApi.getTypes()
      .then(res => setRoomTypes(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingRooms(false));
  }, []);

  useEffect(() => {
    if (selectedRoom?.id) {
      roomsApi.getRates(selectedRoom.id)
        .then(res => {
          const plans = res.data || [];
          setRates(plans);
          if (!selectedRate && plans.length > 0) setSelectedRate(plans[0]);
        })
        .catch(() => {});
    }
  }, [selectedRoom]);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validateStep1 = () => !!(selectedRoom && selectedRate && checkIn && checkOut);

  const validateStep2 = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim())  errs.lastName  = 'Last name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.phone.trim())     errs.phone     = 'Phone number is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    if (step === 1 && !validateStep2()) return;
    dispatch({ type: 'SET_GUEST_DETAILS', payload: form });
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        check_in:     checkIn,
        check_out:    checkOut,
        room_type_id: selectedRoom.id,
        rate_plan_id: selectedRate?.id,
        adults:       state.search.guests || 1,
        guest: {
          first_name: form.firstName,
          last_name:  form.lastName,
          email:      form.email,
          phone:      form.phone,
        },
        special_requests: form.specialRequests,
      };
      const res = await reservationsApi.create(payload);
      dispatch({
        type:    'BOOKING_CONFIRMED',
        payload: { reservation: res.data?.reservation || res.data, guestToken: res.data?.guest_token },
      });
      navigate('/confirmation');
    } catch (err) {
      setSubmitError(err.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-page__inner container">

        {/* ── Steps indicator ── */}
        <div className="booking-steps">
          {STEPS.map((label, i) => (
            <div key={i} className={`booking-step ${i === step ? 'booking-step--active' : ''} ${i < step ? 'booking-step--done' : ''}`}>
              <span className="booking-step__num">{i < step ? '✓' : i + 1}</span>
              <span className="booking-step__label">{label}</span>
              {i < STEPS.length - 1 && <span className="booking-step__line" />}
            </div>
          ))}
        </div>

        <div className="booking-page__layout">

          {/* ── Main panel ── */}
          <div className="booking-page__main">

            {/* Step 0: Select room */}
            {step === 0 && (
              <div className="booking-panel">
                <h2 className="booking-panel__title">Select a Room</h2>

                {(!checkIn || !checkOut) && (
                  <div className="alert alert--info">
                    No dates selected. <Link to="/rooms">Search availability</Link> first, or choose a room type below and contact us to confirm dates.
                  </div>
                )}

                {loadingRooms ? (
                  <div className="booking-room-list">
                    {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '120px' }} />)}
                  </div>
                ) : (
                  <div className="booking-room-list">
                    {roomTypes.map(room => (
                      <label
                        key={room.id}
                        className={`booking-room-option ${selectedRoom?.id === room.id ? 'booking-room-option--selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="room"
                          value={room.id}
                          checked={selectedRoom?.id === room.id}
                          onChange={() => { setSelectedRoom(room); setSelectedRate(null); }}
                        />
                        <div className="booking-room-option__info">
                          <span className="booking-room-option__name">{room.name}</span>
                          <span className="booking-room-option__desc">{room.description}</span>
                        </div>
                        {room.base_rate && (
                          <span className="booking-room-option__price">
                            {fmt(room.base_rate)}<small>/night</small>
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}

                {/* Rate plan selector */}
                {selectedRoom && rates.length > 1 && (
                  <div className="booking-rates">
                    <h3 className="booking-rates__title">Rate Plan</h3>
                    {rates.map(rate => (
                      <label
                        key={rate.id}
                        className={`booking-rate-option ${selectedRate?.id === rate.id ? 'booking-rate-option--selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="rate"
                          checked={selectedRate?.id === rate.id}
                          onChange={() => setSelectedRate(rate)}
                        />
                        <span className="booking-rate-option__name">{rate.name}</span>
                        <span className="booking-rate-option__price">{fmt(rate.rate)}/night</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Guest details */}
            {step === 1 && (
              <div className="booking-panel">
                <h2 className="booking-panel__title">Your Details</h2>
                <div className="booking-form">
                  <div className="booking-form__row">
                    <div className="form-group">
                      <label className="form-label">First Name *</label>
                      <input className={`input ${formErrors.firstName ? 'input--error' : ''}`}
                        value={form.firstName} onChange={e => setField('firstName', e.target.value)} />
                      {formErrors.firstName && <span className="form-error">{formErrors.firstName}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name *</label>
                      <input className={`input ${formErrors.lastName ? 'input--error' : ''}`}
                        value={form.lastName} onChange={e => setField('lastName', e.target.value)} />
                      {formErrors.lastName && <span className="form-error">{formErrors.lastName}</span>}
                    </div>
                  </div>
                  <div className="booking-form__row">
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input type="email" className={`input ${formErrors.email ? 'input--error' : ''}`}
                        value={form.email} onChange={e => setField('email', e.target.value)} />
                      {formErrors.email && <span className="form-error">{formErrors.email}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input type="tel" className={`input ${formErrors.phone ? 'input--error' : ''}`}
                        value={form.phone} onChange={e => setField('phone', e.target.value)} />
                      {formErrors.phone && <span className="form-error">{formErrors.phone}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Special Requests</label>
                    <textarea className="input" rows={3}
                      placeholder="Dietary requirements, room preferences, accessibility needs…"
                      value={form.specialRequests}
                      onChange={e => setField('specialRequests', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="booking-panel">
                <h2 className="booking-panel__title">Review Your Booking</h2>

                <div className="booking-review">
                  <div className="booking-review__section">
                    <h3>Stay Details</h3>
                    <div className="booking-review__row"><span>Room</span><strong>{selectedRoom?.name}</strong></div>
                    <div className="booking-review__row"><span>Rate Plan</span><strong>{selectedRate?.name || 'Standard'}</strong></div>
                    <div className="booking-review__row"><span>Check-in</span><strong>{checkIn}</strong></div>
                    <div className="booking-review__row"><span>Check-out</span><strong>{checkOut}</strong></div>
                    <div className="booking-review__row"><span>Nights</span><strong>{numNights}</strong></div>
                    <div className="booking-review__row"><span>Guests</span><strong>{state.search.guests}</strong></div>
                  </div>

                  <div className="booking-review__section">
                    <h3>Guest Details</h3>
                    <div className="booking-review__row"><span>Name</span><strong>{form.firstName} {form.lastName}</strong></div>
                    <div className="booking-review__row"><span>Email</span><strong>{form.email}</strong></div>
                    <div className="booking-review__row"><span>Phone</span><strong>{form.phone}</strong></div>
                    {form.specialRequests && (
                      <div className="booking-review__row"><span>Requests</span><strong>{form.specialRequests}</strong></div>
                    )}
                  </div>
                </div>

                {submitError && <div className="alert alert--error">{submitError}</div>}

                <p className="booking-review__note">
                  By confirming, you agree to our cancellation policy. Payment may be required at check-in or as directed by the hotel.
                </p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="booking-page__actions">
              {step > 0 && (
                <button className="btn btn--outline" onClick={() => setStep(s => s - 1)}>
                  ← Back
                </button>
              )}
              {step < 2 ? (
                <button className="btn btn--primary" onClick={handleNext}>
                  Continue →
                </button>
              ) : (
                <button
                  className="btn btn--gold btn--lg"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Confirming…' : 'Confirm Booking'}
                </button>
              )}
            </div>
          </div>

          {/* ── Booking summary sidebar ── */}
          <aside className="booking-sidebar">
            <div className="booking-summary">
              <h3 className="booking-summary__title">Booking Summary</h3>
              {selectedRoom ? (
                <>
                  <p className="booking-summary__room">{selectedRoom.name}</p>
                  {selectedRate && <p className="booking-summary__rate">{selectedRate.name || 'Standard Rate'}</p>}
                  <div className="booking-summary__dates">
                    <div><span>Check-in</span><strong>{checkIn || '—'}</strong></div>
                    <div><span>Check-out</span><strong>{checkOut || '—'}</strong></div>
                    <div><span>Nights</span><strong>{numNights || '—'}</strong></div>
                    <div><span>Guests</span><strong>{state.search.guests || 1}</strong></div>
                  </div>
                  {numNights > 0 && selectedRate && (
                    <div className="booking-summary__total">
                      <span>Estimated Total</span>
                      <strong>{fmt(totalAmount)}</strong>
                    </div>
                  )}
                </>
              ) : (
                <p className="booking-summary__empty">Select a room to see your summary</p>
              )}
              <div className="booking-summary__contact">
                <p>Need help? Call us:</p>
                <a href={`tel:${hotelConfig.contact.phone}`}>{hotelConfig.contact.phone}</a>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}