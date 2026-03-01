// src/pages/RoomDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { roomsApi }   from '../services/api.js';
import { useBooking } from '../hooks/useBooking.jsx';
import hotelConfig    from '../config/hotel.config.js';
import { fmt }        from '../utils/currency.js';
import RoomGallery from '../components/ui/RoomGallery.jsx';
import './RoomDetailPage.css';


export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useBooking();

  const [room,    setRoom]    = useState(null);
  const [rates,   setRates]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Date & guest selection
  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [checkIn,  setCheckIn]  = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests,   setGuests]   = useState(1);
  const [dateError, setDateError] = useState('');

  const numNights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0;

  useEffect(() => {
    Promise.all([
      roomsApi.getTypeById(id),
      roomsApi.getRates(id),
    ])
      .then(([roomRes, ratesRes]) => {
        setRoom(roomRes.data);
        setRates(ratesRes.data || []);
        document.title = `${roomRes.data?.name} | ${hotelConfig.shortName}`;
      })
      .catch(() => setError('Room not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = () => {
    setDateError('');
    if (!checkIn || !checkOut) { setDateError('Please select check-in and check-out dates.'); return; }
    if (numNights < 1)         { setDateError('Check-out must be after check-in.'); return; }
    dispatch({ type: 'SELECT_ROOM',   payload: { room, rate: rates[0] || null } });
    dispatch({ type: 'SET_SEARCH',    payload: { checkIn, checkOut, guests } });
    navigate('/book');
  };

  if (loading) return (
    <div className="room-detail-page">
      <div className="container" style={{ paddingTop: 'calc(var(--nav-h) + 3rem)' }}>
        <div className="skeleton" style={{ height: '480px', marginBottom: '2rem' }} />
        <div className="skeleton" style={{ height: '200px' }} />
      </div>
    </div>
  );

  if (error || !room) return (
    <div className="room-detail-page room-detail-page--error">
      <div className="container">
        <p>{error || 'Room not found.'}</p>
        <Link to="/rooms" className="btn btn--primary">Back to Rooms</Link>
      </div>
    </div>
  );

  return (
    <div className="room-detail-page">
      {/* Back nav + title */}
      <div className="room-detail__page-header">
        <div className="container">
          <Link to="/rooms" className="room-detail__back">← All Rooms</Link>
          <h1 className="room-detail__title">{room.name}</h1>
          {room.category && <span className="room-detail__category">{room.category}</span>}
        </div>
      </div>

      {/* Gallery */}
      <div className="container room-detail__gallery-wrap">
        <RoomGallery
          images={room.images || []}
          videoUrl={room.video_url || null}
          roomName={room.name}
        />
      </div>

      <div className="container">
        <div className="room-detail__layout">

          {/* Main info */}
          <div className="room-detail__main">
            {room.description && (
              <div className="room-detail__section">
                <h2>About This Room</h2>
                <p>{room.description}</p>
              </div>
            )}

            {room.amenities?.length > 0 && (
              <div className="room-detail__section">
                <h2>Amenities</h2>
                <ul className="room-detail__amenities">
                  {room.amenities.map((a, i) => (
                    <li key={i}><span>✦</span>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            {rates.length > 0 && (
              <div className="room-detail__section">
                <h2>Rate Plans</h2>
                <div className="room-detail__rates">
                  {rates.map(rate => (
                    <div key={rate.id} className="room-detail__rate">
                      <div>
                        <p className="room-detail__rate-name">{rate.name || 'Standard Rate'}</p>
                        {rate.description && <p className="room-detail__rate-desc">{rate.description}</p>}
                      </div>
                      <p className="room-detail__rate-price">{fmt(rate.base_rate)}<small>/night</small></p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="room-detail__sidebar">
            <div className="room-detail__book-card">
              {(rates[0] || room.base_rate) && (
                <div className="room-detail__book-price">
                  <span>From</span>
                  <strong>{fmt(rates[0]?.base_rate || room.base_rate)}</strong>
                  <span>per night</span>
                </div>
              )}

              <div className="room-detail__book-dates">
                <div className="room-detail__book-field">
                  <label className="room-detail__book-label">Check-in</label>
                  <input
                    type="date"
                    className="input"
                    min={today}
                    value={checkIn}
                    onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(''); }}
                  />
                </div>
                <div className="room-detail__book-field">
                  <label className="room-detail__book-label">Check-out</label>
                  <input
                    type="date"
                    className="input"
                    min={checkIn || tomorrow}
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                  />
                </div>
                <div className="room-detail__book-field">
                  <label className="room-detail__book-label">Guests</label>
                  <select className="input" value={guests} onChange={e => setGuests(Number(e.target.value))}>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>

              {numNights > 0 && (rates[0]?.base_rate || room.base_rate) && (
                <div className="room-detail__book-total">
                  <span>{numNights} night{numNights !== 1 ? 's' : ''}</span>
                  <strong>{fmt((rates[0]?.base_rate || room.base_rate) * numNights)}</strong>
                </div>
              )}

              {dateError && <p className="form-error" style={{ marginBottom: '0.5rem' }}>{dateError}</p>}

              <button className="btn btn--gold btn--lg" onClick={handleBook} style={{ width: '100%', justifyContent: 'center' }}>
                Book This Room
              </button>
              <p className="room-detail__book-note">Best rate guaranteed when booking direct</p>
              <div className="room-detail__book-contact">
                <a href={`tel:${hotelConfig.contact.phone}`}>{hotelConfig.contact.phone}</a>
                <span>or</span>
                <a href={`mailto:${hotelConfig.contact.email}`}>Email us</a>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}