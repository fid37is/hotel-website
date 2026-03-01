// src/pages/RoomsPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate }   from 'react-router-dom';
import { useBooking }    from '../hooks/useBooking.jsx';
import { roomsApi }      from '../services/api.js';
import hotelConfig       from '../config/hotel.config.js';
import AvailabilitySearch from '../components/booking/AvailabilitySearch.jsx';
import RoomCard           from '../components/ui/RoomCard.jsx';
import './RoomsPage.css';

export default function RoomsPage() {
  const { state, dispatch } = useBooking();
  const navigate = useNavigate();
  const [allTypes, setAllTypes] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const hasSearch  = state.search.checkIn && state.search.checkOut;
  const rooms      = hasSearch ? state.availableRooms : allTypes;
  const isLoading  = hasSearch ? state.availabilityLoading : loading;

  useEffect(() => {
    document.title = `Rooms & Rates | ${hotelConfig.shortName}`;
    roomsApi.getTypes()
      .then(res => setAllTypes(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleBook = (room) => {
    dispatch({ type: 'SELECT_ROOM', payload: { room, rate: room.rate_plans?.[0] || null } });
    navigate('/book');
  };

  return (
    <div className="rooms-page">

      {/* ── Page Header ── */}
      <div className="rooms-page__header">
        <div className="rooms-page__header-bg" />
        <div className="rooms-page__header-overlay" />
        <div className="container rooms-page__header-content">
          <p className="section-label">Accommodation</p>
          <h1 className="section-title" style={{ color: '#fff' }}>Rooms &amp; Suites</h1>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="rooms-page__search-bar">
        <div className="container">
          <AvailabilitySearch compact />
        </div>
      </div>

      {/* ── Results ── */}
      <section className="section">
        <div className="container">

          {hasSearch && (
            <div className="rooms-page__search-summary">
              {isLoading ? (
                <p>Searching availability…</p>
              ) : state.availabilityError ? (
                <p className="alert alert--error">{state.availabilityError}</p>
              ) : (
                <p>
                  <strong>{rooms.length} room{rooms.length !== 1 ? 's' : ''}</strong> available
                  {' '}for <strong>{state.search.checkIn}</strong> → <strong>{state.search.checkOut}</strong>
                  {' '}· {state.search.guests} guest{state.search.guests > 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="rooms-page__grid">
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton" style={{ height: '460px' }} />
              ))}
            </div>
          ) : rooms.length > 0 ? (
            <div className="rooms-page__grid">
              {rooms.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  showBookBtn={hasSearch}
                  onBook={handleBook}
                />
              ))}
            </div>
          ) : (
            <div className="rooms-page__empty">
              <p className="rooms-page__empty-title">No rooms available</p>
              <p className="rooms-page__empty-sub">
                Try different dates or{' '}
                <a href={`tel:${hotelConfig.contact.phone}`}>call us directly</a> — we may be able to help.
              </p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
