// src/components/booking/AvailabilitySearch.jsx — Pure Tailwind
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking.jsx';
import { roomsApi }   from '../../services/api.js';

export default function AvailabilitySearch({ compact = false }) {
  const { state, dispatch } = useBooking();
  const navigate = useNavigate();

  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn,  setCheckIn]  = useState(state.search.checkIn  || today);
  const [checkOut, setCheckOut] = useState(state.search.checkOut || tomorrow);
  const [guests,   setGuests]   = useState(state.search.guests   || 1);
  const [error,    setError]    = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    if (!checkIn || !checkOut)   { setError('Please select check-in and check-out dates.'); return; }
    if (checkIn >= checkOut)     { setError('Check-out must be after check-in.'); return; }

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

  if (compact) return (
    <form onSubmit={handleSearch} className="bg-surface/95 backdrop-blur rounded-lg shadow p-4 flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1 min-w-[140px]">
        <label className="form-label">Check-in</label>
        <input type="date" className="input" value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-1 min-w-[140px]">
        <label className="form-label">Check-out</label>
        <input type="date" className="input" value={checkOut} min={checkIn || today} onChange={e => setCheckOut(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-1">
        <label className="form-label">Guests</label>
        <select className="input" value={guests} onChange={e => setGuests(Number(e.target.value))}>
          {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
        </select>
      </div>
      <button type="submit" className="btn btn--primary">Search</button>
      {error && <p className="w-full text-xs text-red-500">{error}</p>}
    </form>
  );

  return (
    <form onSubmit={handleSearch}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 flex flex-wrap gap-0 overflow-hidden">
      {/* Check-in */}
      <div className="flex flex-col gap-1 px-5 py-4 flex-1 min-w-[140px] border-r border-white/20">
        <label className="text-[10px] font-medium tracking-widest uppercase text-white/70">Check-in</label>
        <input type="date" className="bg-transparent text-white text-sm outline-none w-full [color-scheme:dark]"
          value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)} required />
      </div>
      {/* Check-out */}
      <div className="flex flex-col gap-1 px-5 py-4 flex-1 min-w-[140px] border-r border-white/20">
        <label className="text-[10px] font-medium tracking-widest uppercase text-white/70">Check-out</label>
        <input type="date" className="bg-transparent text-white text-sm outline-none w-full [color-scheme:dark]"
          value={checkOut} min={checkIn || today} onChange={e => setCheckOut(e.target.value)} required />
      </div>
      {/* Guests */}
      <div className="flex flex-col gap-1 px-5 py-4 min-w-[120px] border-r border-white/20">
        <label className="text-[10px] font-medium tracking-widest uppercase text-white/70">Guests</label>
        <select className="bg-transparent text-white text-sm outline-none appearance-none"
          value={guests} onChange={e => setGuests(Number(e.target.value))}>
          {[1,2,3,4,5,6].map(n => <option key={n} value={n} className="text-primary bg-white">{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
        </select>
      </div>
      {/* Submit */}
      <div className="px-3 py-3 flex items-center">
        <button type="submit" className="btn btn--gold px-8 py-3 text-sm whitespace-nowrap">Check Availability</button>
      </div>
      {error && <p className="w-full px-5 pb-3 text-xs text-red-300">{error}</p>}
    </form>
  );
}
