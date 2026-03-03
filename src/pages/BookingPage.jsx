// src/pages/BookingPage.jsx — Pure Tailwind
import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useBooking }          from '../hooks/useBooking.jsx';
import { useGuestAuth }        from '../hooks/useGuestAuth.jsx';
import { useHotelConfig }      from '../hooks/useHotelConfig.jsx';
import { roomsApi, reservationsApi } from '../services/api.js';
import { fmt }                 from '../utils/currency.js';

const STEPS = ['Select Room', 'Your Details', 'Review & Pay'];
const nights = (ci, co) => (!ci || !co) ? 0 : Math.max(0, Math.round((new Date(co) - new Date(ci)) / 86400000));

export default function BookingPage() {
  const hotelConfig = useHotelConfig();
  const { state, dispatch } = useBooking();
  const { guest, isLoggedIn } = useGuestAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ci = searchParams.get('checkIn');
    const co = searchParams.get('checkOut');
    const g  = searchParams.get('guests');
    if (ci && !state.search.checkIn) {
      dispatch({ type: 'SET_SEARCH', payload: { checkIn: ci, checkOut: co || '', guests: g ? Number(g) : 1 } });
    }
  }, []);

  const [step, setStep] = useState(state.selectedRoom ? 1 : 0);
  const [availableTypes,  setAvailableTypes]  = useState([]);
  const [loadingRooms,    setLoadingRooms]    = useState(false);
  const [availError,      setAvailError]      = useState('');
  const [selectedTypeId,  setSelectedTypeId]  = useState(state.selectedRoom?.id || '');
  const [selectedRoom,    setSelectedRoom]    = useState(state.selectedRoom);
  const [selectedRate,    setSelectedRate]    = useState(state.selectedRate);
  const [rates,           setRates]           = useState([]);

  const [form, setForm] = useState(() => {
    const nameParts = guest?.full_name?.trim().split(' ') || [];
    return {
      firstName:       state.guestDetails.firstName || nameParts[0] || '',
      lastName:        state.guestDetails.lastName  || nameParts.slice(1).join(' ') || '',
      email:           state.guestDetails.email     || guest?.email || '',
      phone:           state.guestDetails.phone     || guest?.phone || '',
      specialRequests: state.guestDetails.specialRequests || '',
    };
  });
  const [formErrors,  setFormErrors]  = useState({});
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState('');

  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [checkIn,     setCheckIn]     = useState(state.search.checkIn  || '');
  const [checkOut,    setCheckOut]    = useState(state.search.checkOut || '');
  const [guestCount,  setGuestCount]  = useState(state.search.guests   || 1);
  const numNights = nights(checkIn, checkOut);

  useEffect(() => { dispatch({ type: 'SET_SEARCH', payload: { checkIn, checkOut, guests: guestCount } }); }, [checkIn, checkOut, guestCount]);
  useEffect(() => { document.title = `Book a Room | ${hotelConfig.shortName}`; }, [hotelConfig.shortName]);

  const selectedType = availableTypes.find(t => t.id === selectedTypeId) || selectedRoom;
  const ratePerNight = selectedRate?.base_rate ?? selectedRate?.rate ?? selectedType?.base_rate ?? 0;
  const totalAmount  = ratePerNight * numNights;

  useEffect(() => {
    if (!checkIn || !checkOut || numNights < 1) { setAvailableTypes([]); setAvailError(''); return; }
    setLoadingRooms(true); setAvailError(''); setSelectedTypeId(''); setSelectedRoom(null); setSelectedRate(null); setRates([]);
    roomsApi.getAvailability({ checkIn, checkOut })
      .then(res => {
        const rooms = res.data || [];
        const map = {};
        rooms.forEach(room => {
          const t = room.room_types || room.room_type;
          if (!t) return;
          if (!map[t.id]) map[t.id] = { ...t, count: 0, rooms: [] };
          map[t.id].count++;
          map[t.id].rooms.push(room);
        });
        setAvailableTypes(Object.values(map).sort((a, b) => a.base_rate - b.base_rate));
      })
      .catch(() => setAvailError('Could not check availability. Please try again.'))
      .finally(() => setLoadingRooms(false));
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (!selectedTypeId) return;
    roomsApi.getRates(selectedTypeId)
      .then(res => { const plans = res.data || []; setRates(plans); if (plans.length > 0) setSelectedRate(plans[0]); })
      .catch(() => {});
  }, [selectedTypeId]);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const validateStep1 = () => !!(selectedTypeId && checkIn && checkOut && numNights > 0);
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
    if (step === 0) {
      const type = availableTypes.find(t => t.id === selectedTypeId);
      dispatch({ type: 'SELECT_ROOM', payload: { room: type, rate: selectedRate } });
      dispatch({ type: 'SET_GUEST_DETAILS', payload: form });
    } else {
      dispatch({ type: 'SET_GUEST_DETAILS', payload: form });
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitError('');
    try {
      const payload = {
        check_in: checkIn, check_out: checkOut, room_type_id: selectedTypeId,
        rate_plan_id: selectedRate?.id, adults: guestCount,
        guest: { first_name: form.firstName, last_name: form.lastName, email: form.email, phone: form.phone },
        special_requests: form.specialRequests,
      };
      const res = await reservationsApi.create(payload);
      dispatch({ type: 'BOOKING_CONFIRMED', payload: { reservation: res.data?.reservation || res.data, guestToken: res.data?.guest_token } });
      navigate('/confirmation');
    } catch (err) {
      setSubmitError(err.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-bg min-h-screen pt-nav pb-10">
      <div className="container max-w-5xl">
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center gap-2 ${i === step ? 'text-primary' : i < step ? 'text-secondary' : 'text-muted'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2
                  ${i === step ? 'border-primary bg-primary text-white' : i < step ? 'border-secondary bg-secondary text-white' : 'border-border bg-surface'}`}>
                  {i < step ? '✓' : i + 1}
                </span>
                <span className="text-xs font-medium tracking-wide hidden sm:block">{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-12 h-px mx-2 ${i < step ? 'bg-secondary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-lg border border-border p-6 lg:p-8">

              {step === 0 && (
                <>
                  <h2 className="font-display text-2xl font-medium mb-6">Select a Room</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pb-6 border-b border-border">
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
                      <select className="input" value={guestCount} onChange={e => setGuestCount(Number(e.target.value))}>
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                    {numNights > 0 && (
                      <div className="sm:col-span-3 text-xs text-secondary font-medium">
                        {numNights} night{numNights !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {numNights > 0 && (
                    <div>
                      <p className="text-xs text-muted mb-4 uppercase tracking-widest font-medium">
                        Available Room Types {loadingRooms && <span className="text-secondary">— checking...</span>}
                      </p>
                      {loadingRooms && <div className="flex flex-col gap-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-lg" />)}</div>}
                      {!loadingRooms && availError && <p className="alert alert--error">{availError}</p>}
                      {!loadingRooms && !availError && availableTypes.length === 0 && (
                        <p className="text-sm text-muted py-6 text-center">No rooms available for these dates. Please try different dates.</p>
                      )}
                      {!loadingRooms && availableTypes.length > 0 && (
                        <div className="flex flex-col gap-3">
                          {availableTypes.map(type => {
                            const isSel = selectedTypeId === type.id;
                            return (
                              <button key={type.id} type="button" onClick={() => setSelectedTypeId(isSel ? '' : type.id)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSel ? 'border-secondary bg-secondary/5' : 'border-border hover:border-secondary/40'}`}>
                                <div className="flex items-center justify-between gap-4">
                                  <div>
                                    <p className="font-medium text-sm">{type.name}</p>
                                    <p className="text-xs text-muted mt-0.5">
                                      {type.count} room{type.count !== 1 ? 's' : ''} available
                                      {type.max_occupancy ? ` · up to ${type.max_occupancy} guests` : ''}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-display text-xl font-medium text-primary">{fmt(type.base_rate)}</p>
                                    <p className="text-xs text-muted">/ night</p>
                                  </div>
                                </div>
                                {isSel && (
                                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-secondary/20 text-xs text-secondary font-medium">
                                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><polyline points="2 8 6 12 14 4"/></svg>
                                    Selected
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedTypeId && rates.length > 1 && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-xs font-medium tracking-widest uppercase text-muted mb-4">Rate Plan</p>
                      <div className="flex flex-col gap-2">
                        {rates.map(rate => (
                          <label key={rate.id}
                            className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedRate?.id === rate.id ? 'border-secondary bg-secondary/5' : 'border-border hover:border-secondary/40'}`}>
                            <div className="flex items-center gap-3">
                              <input type="radio" name="rate" className="accent-secondary"
                                checked={selectedRate?.id === rate.id} onChange={() => setSelectedRate(rate)} />
                              <span className="text-sm font-medium">{rate.name}</span>
                            </div>
                            <span className="text-sm font-medium">{fmt(rate.base_rate || rate.rate)}/night</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="font-display text-2xl font-medium mb-6">Your Details</h2>
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                        value={form.specialRequests} onChange={e => setField('specialRequests', e.target.value)} />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-display text-2xl font-medium mb-6">Review Your Booking</h2>
                  <div className="flex flex-col gap-6">
                    {[
                      { title: 'Stay Details', rows: [
                        ['Room', selectedRoom?.name],
                        ['Rate Plan', selectedRate?.name || 'Standard'],
                        ['Check-in', checkIn],
                        ['Check-out', checkOut],
                        ['Nights', numNights],
                        ['Guests', state.search.guests],
                      ]},
                      { title: 'Guest Details', rows: [
                        ['Name', `${form.firstName} ${form.lastName}`],
                        ['Email', form.email],
                        ['Phone', form.phone],
                        ...(form.specialRequests ? [['Requests', form.specialRequests]] : []),
                      ]},
                    ].map(({ title, rows }) => (
                      <div key={title} className="rounded-lg border border-border p-5">
                        <h3 className="font-medium text-sm tracking-wide mb-4">{title}</h3>
                        <div className="flex flex-col gap-3">
                          {rows.map(([label, value]) => (
                            <div key={label} className="flex justify-between gap-4 text-sm">
                              <span className="text-muted">{label}</span>
                              <strong className="text-right text-primary">{value}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {submitError && <div className="alert alert--error mt-4">{submitError}</div>}
                  <p className="text-xs text-muted mt-4">
                    By confirming, you agree to our cancellation policy. Payment may be required at check-in or as directed by the hotel.
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-between mt-5">
              {step > 0 ? (
                <button className="btn btn--outline" onClick={() => setStep(s => s - 1)}>← Back</button>
              ) : <div />}
              {step < 2 ? (
                <button className="btn btn--primary" onClick={handleNext}>Continue →</button>
              ) : (
                <button className="btn btn--gold btn--lg" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Confirming…' : 'Confirm Booking'}
                </button>
              )}
            </div>
          </div>

          <aside>
            <div className="sticky top-24 bg-surface border border-border rounded-lg p-5">
              <h3 className="text-sm font-medium tracking-wide mb-4">Booking Summary</h3>
              {selectedType ? (
                <div className="flex flex-col gap-3 text-sm">
                  <p className="font-display text-lg font-medium">{selectedType.name}</p>
                  {selectedRate && <p className="text-xs text-muted">{selectedRate.name || 'Standard Rate'}</p>}
                  <div className="flex flex-col gap-2 pt-3 border-t border-border">
                    {[['Check-in', checkIn || '—'], ['Check-out', checkOut || '—'], ['Nights', numNights || '—'], ['Guests', state.search.guests || 1]].map(([label, val]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-muted">{label}</span>
                        <strong>{val}</strong>
                      </div>
                    ))}
                  </div>
                  {numNights > 0 && selectedTypeId && (
                    <div className="flex justify-between pt-3 border-t border-border font-medium">
                      <span>Estimated Total</span>
                      <strong className="text-secondary">{fmt(totalAmount)}</strong>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted">Select dates and a room type to see your summary</p>
              )}
              <div className="mt-5 pt-5 border-t border-border text-xs text-muted">
                <p>Need help? Call us:</p>
                <a href={`tel:${hotelConfig.contact.phone}`} className="text-secondary hover:underline">{hotelConfig.contact.phone}</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}