// src/pages/RoomDetailPage.jsx — Pure Tailwind
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { roomsApi }   from '../services/api.js';
import { useBooking } from '../hooks/useBooking.jsx';
import hotelConfig    from '../config/hotel.config.js';
import { fmt }        from '../utils/currency.js';
import RoomGallery    from '../components/ui/RoomGallery.jsx';

export default function RoomDetailPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { dispatch } = useBooking();

  const [room,    setRoom]    = useState(null);
  const [rates,   setRates]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

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
    Promise.all([roomsApi.getTypeById(id), roomsApi.getRates(id)])
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
    dispatch({ type: 'SELECT_ROOM', payload: { room, rate: rates[0] || null } });
    dispatch({ type: 'SET_SEARCH', payload: { checkIn, checkOut, guests } });
    navigate('/book');
  };

  if (loading) return (
    <div className="container py-12 flex flex-col gap-6">
      <div className="skeleton h-[480px] rounded-lg" />
      <div className="skeleton h-48 rounded-lg" />
    </div>
  );

  if (error || !room) return (
    <div className="container py-20 flex flex-col items-center gap-6 text-center">
      <p className="text-muted">{error || 'Room not found.'}</p>
      <Link to="/rooms" className="btn btn--primary">Back to Rooms</Link>
    </div>
  );

  return (
    <div className="pb-24">
      {/* Page header */}
      <div className="bg-bg border-b border-border py-6 pt-nav">
        <div className="container">
          <Link to="/rooms" className="text-sm text-muted hover:text-secondary transition-colors mb-2 block">← All Rooms</Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-4xl font-medium">{room.name}</h1>
            {room.category && (
              <span className="text-xs tracking-widest uppercase bg-primary text-white px-3 py-1.5 rounded-sm">{room.category}</span>
            )}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="container py-8">
        <RoomGallery images={room.images || []} videoUrl={room.video_url || null} roomName={room.name} />
      </div>

      {/* Content */}
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {room.description && (
              <div>
                <h2 className="font-display text-2xl font-medium mb-4">About This Room</h2>
                <p className="text-muted leading-relaxed">{room.description}</p>
              </div>
            )}

            {room.amenities?.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-medium mb-4">Amenities</h2>
                <ul className="grid grid-cols-2 gap-3">
                  {room.amenities.map((a, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted">
                      <span className="text-secondary text-xs">✦</span>{a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {rates.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-medium mb-4">Rate Plans</h2>
                <div className="flex flex-col gap-3">
                  {rates.map(rate => (
                    <div key={rate.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-secondary/50 transition-colors">
                      <div>
                        <p className="font-medium text-sm">{rate.name || 'Standard Rate'}</p>
                        {rate.description && <p className="text-xs text-muted mt-0.5">{rate.description}</p>}
                      </div>
                      <p className="font-display text-xl font-medium text-secondary">
                        {fmt(rate.base_rate)}<small className="text-xs text-muted font-body font-normal">/night</small>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <aside>
            <div className="sticky top-24 bg-surface border border-border rounded-lg p-6 flex flex-col gap-5">
              {(rates[0] || room.base_rate) && (
                <div className="text-center pb-4 border-b border-border">
                  <span className="text-xs text-muted">From</span>
                  <p className="font-display text-4xl font-medium text-primary">{fmt(rates[0]?.base_rate || room.base_rate)}</p>
                  <span className="text-xs text-muted">per night</span>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="form-label">Check-in</label>
                  <input type="date" className="input" min={today} value={checkIn}
                    onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(''); }} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="form-label">Check-out</label>
                  <input type="date" className="input" min={checkIn || tomorrow} value={checkOut}
                    onChange={e => setCheckOut(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="form-label">Guests</label>
                  <select className="input" value={guests} onChange={e => setGuests(Number(e.target.value))}>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>

              {numNights > 0 && (rates[0]?.base_rate || room.base_rate) && (
                <div className="flex items-center justify-between py-3 border-t border-b border-border text-sm font-medium">
                  <span className="text-muted">{numNights} night{numNights !== 1 ? 's' : ''}</span>
                  <span className="font-display text-xl">{fmt((rates[0]?.base_rate || room.base_rate) * numNights)}</span>
                </div>
              )}

              {dateError && <p className="form-error">{dateError}</p>}

              <button className="btn btn--gold btn--lg justify-center w-full" onClick={handleBook}>
                Book This Room
              </button>

              <p className="text-xs text-center text-muted">Best rate guaranteed when booking direct</p>

              <div className="flex justify-center gap-3 text-xs text-muted">
                <a href={`tel:${hotelConfig.contact.phone}`} className="hover:text-secondary transition-colors">{hotelConfig.contact.phone}</a>
                <span>or</span>
                <a href={`mailto:${hotelConfig.contact.email}`} className="hover:text-secondary transition-colors">Email us</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
