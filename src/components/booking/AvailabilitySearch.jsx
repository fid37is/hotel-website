// src/components/booking/AvailabilitySearch.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking.jsx';
import { roomsApi }   from '../../services/api.js';
import './AvailabilitySearch.css';

export default function AvailabilitySearch({ compact = false }) {
  const { state, dispatch } = useBooking();
  const navigate = useNavigate();

  const today     = new Date().toISOString().split('T')[0];
  const tomorrow  = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn,  setCheckIn]  = useState(state.search.checkIn  || today);
  const [checkOut, setCheckOut] = useState(state.search.checkOut || tomorrow);
  const [guests,   setGuests]   = useState(state.search.guests   || 1);
  const [error,    setError]    = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates.');
      return;
    }
    if (checkIn >= checkOut) {
      setError('Check-out must be after check-in.');
      return;
    }

    dispatch({ type: 'SET_SEARCH', payload: { checkIn, checkOut, guests } });
    dispatch({ type: 'SET_AVAILABILITY_LOADING', payload: true });

    try {
      const res = await roomsApi.getAvailability({ checkIn, checkOut, guests });
      dispatch({ type: 'SET_AVAILABILITY_RESULTS', payload: res.data || [] });
      navigate('/rooms');
    } catch (err) {
      dispatch({ type: 'SET_AVAILABILITY_ERROR', payload: err.message });
      navigate('/rooms');
    }
  };

  return (
    <form
      className={`availability-search ${compact ? 'availability-search--compact' : ''}`}
      onSubmit={handleSearch}
    >
      <div className="availability-search__fields">
        <div className="availability-search__field">
          <label className="availability-search__label">Check-in</label>
          <input
            type="date"
            className="availability-search__input"
            value={checkIn}
            min={today}
            onChange={e => setCheckIn(e.target.value)}
            required
          />
        </div>

        <div className="availability-search__divider" />

        <div className="availability-search__field">
          <label className="availability-search__label">Check-out</label>
          <input
            type="date"
            className="availability-search__input"
            value={checkOut}
            min={checkIn || today}
            onChange={e => setCheckOut(e.target.value)}
            required
          />
        </div>

        <div className="availability-search__divider" />

        <div className="availability-search__field availability-search__field--guests">
          <label className="availability-search__label">Guests</label>
          <select
            className="availability-search__input"
            value={guests}
            onChange={e => setGuests(Number(e.target.value))}
          >
            {[1,2,3,4,5,6].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="availability-search__btn">
          Check Availability
        </button>
      </div>

      {error && <p className="availability-search__error">{error}</p>}
    </form>
  );
}
