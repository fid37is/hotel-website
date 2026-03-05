// src/pages/AccountPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate }   from 'react-router-dom';
import { useGuestAuth }        from '../hooks/useGuestAuth.jsx';
import { useHotelConfig }      from '../hooks/useHotelConfig.jsx';
import { guestAuthApi }        from '../services/api.js';
import { fmt }                 from '../utils/currency.js';

const STATUS = {
  confirmed:   { label: 'Confirmed',   cls: 'bg-green-100 text-green-700' },
  checked_in:  { label: 'Checked In',  cls: 'bg-blue-100 text-blue-700'  },
  checked_out: { label: 'Checked Out', cls: 'bg-gray-100 text-gray-500'  },
  cancelled:   { label: 'Cancelled',   cls: 'bg-red-100 text-red-600'    },
  no_show:     { label: 'No Show',     cls: 'bg-orange-100 text-orange-600' },
};

const ID_TYPES  = ['passport', 'national_id', 'drivers_license', 'voters_card', 'residence_permit'];
const ID_LABELS = {
  passport: 'Passport', national_id: 'National ID',
  drivers_license: "Driver's License", voters_card: "Voter's Card",
  residence_permit: 'Residence Permit',
};

const nights = (ci, co) => Math.max(0, Math.round((new Date(co) - new Date(ci)) / 86400000));

function Field({ label, value, editing, name, onChange, type = 'text', children }) {
  return (
    <div>
      <p className="text-xs text-muted mb-1">{label}</p>
      {editing
        ? children || <input type={type} name={name} className="input text-sm w-full" value={value || ''} onChange={onChange} />
        : <p className="text-sm font-medium text-primary">{value || <span className="italic text-muted text-xs">Not set</span>}</p>
      }
    </div>
  );
}

export default function AccountPage() {
  const hotelConfig = useHotelConfig();
  const { guest, token, isLoggedIn, loading: authLoading, logout, updateProfile } = useGuestAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [resLoading,   setResLoading]   = useState(false);
  const [activeTab,    setActiveTab]    = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling,   setCancelling]   = useState(false);
  const [cancelError,  setCancelError]  = useState('');

  const [editing,     setEditing]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [saveError,   setSaveError]   = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [form,        setForm]        = useState({});

  useEffect(() => { document.title = `My Account | ${hotelConfig.shortName}`; }, [hotelConfig.shortName]);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) { navigate('/login', { state: { from: '/account' }, replace: true }); return; }
    loadReservations();
  }, [authLoading, isLoggedIn]);

  useEffect(() => {
    if (guest) setForm({
      full_name: guest.full_name || '', phone: guest.phone || '',
      address: guest.address || '', nationality: guest.nationality || '',
      id_type: guest.id_type || '', id_number: guest.id_number || '',
      date_of_birth: guest.date_of_birth || '', preferences: guest.preferences || '',
    });
  }, [guest]);

  const loadReservations = async () => {
    setResLoading(true);
    try {
      const res = await guestAuthApi.myReservations(token);
      setReservations(Array.isArray(res.data) ? res.data : []);
    } catch { setReservations([]); } finally { setResLoading(false); }
  };

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setSaveError(''); setSaveSuccess(false);
    try {
      await updateProfile(form);
      setSaveSuccess(true); setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) { setSaveError(err.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleCancel = async (id) => {
    setCancelling(true); setCancelError('');
    try {
      await guestAuthApi.cancelReservation(id, cancelReason, token);
      setCancellingId(null); setCancelReason('');
      setReservations(rs => rs.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
    } catch (err) { setCancelError(err.message || 'Failed. Please call us.'); }
    finally { setCancelling(false); }
  };

  const today       = new Date().toISOString().split('T')[0];
  const upcoming    = reservations.filter(r => ['confirmed','checked_in'].includes(r.status) && r.check_in_date >= today);
  const past        = reservations.filter(r => ['checked_out','no_show'].includes(r.status) || (r.status === 'confirmed' && r.check_out_date < today));
  const cancelled   = reservations.filter(r => r.status === 'cancelled');
  const displayed   = { upcoming, past, cancelled }[activeTab] || [];
  const checkedInRes = reservations.find(r => r.status === 'checked_in');

  if (authLoading) return (
    <div className="container max-w-6xl pt-nav py-8 grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 space-y-4"><div className="skeleton h-40 rounded-xl"/><div className="skeleton h-96 rounded-xl"/></div>
      <div className="lg:col-span-3 space-y-4"><div className="skeleton h-12 rounded-xl"/><div className="skeleton h-64 rounded-xl"/></div>
    </div>
  );

  return (
    <div className="bg-bg min-h-screen pt-nav pb-12">
      <div className="container">
        <div className="grid lg:grid-cols-5 gap-6 items-start">

          {/* ═══════════════════════════════════════════════
              LEFT — avatar + profile details
          ════════════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-4">

            {/* Avatar card */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-primary text-white font-display text-2xl flex items-center justify-center shrink-0 select-none">
                  {guest?.full_name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg font-semibold leading-tight truncate">{guest?.full_name}</p>
                  <p className="text-xs text-muted truncate">{guest?.email}</p>
                  {guest?.loyalty_points > 0 && (
                    <p className="text-xs text-secondary font-medium mt-0.5">✦ {guest.loyalty_points} loyalty points</p>
                  )}
                </div>
                <button onClick={() => { logout(); navigate('/'); }}
                  className="text-xs text-muted hover:text-red-500 transition-colors shrink-0 border border-border rounded-lg px-3 py-1.5">
                  Sign out
                </button>
              </div>

              {/* Chat banner — right here under the name, above actions */}
              {checkedInRes && (
                <Link to="/chat"
                  className="flex items-center gap-3 bg-primary text-white rounded-lg px-4 py-3 mb-4 hover:opacity-90 transition-opacity">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18" className="shrink-0">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">You're checked in · Room {checkedInRes.rooms?.room_number || '—'}</p>
                    <p className="text-xs text-white/70">Tap to message our team</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12" className="shrink-0 text-white/50">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </Link>
              )}

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
                {[
                  { to: '/book', label: 'Book',
                    icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/> },
                  { href: `tel:${hotelConfig.contact?.phone}`, label: 'Call',
                    icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01-.07 1.16 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/> },
                  { href: `mailto:${hotelConfig.contact?.email}`, label: 'Email',
                    icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></> },
                ].map(({ to, href, label, icon }) => {
                  const cls = "flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs text-muted hover:text-primary hover:bg-bg transition-colors";
                  const inner = <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="17" height="17">{icon}</svg><span>{label}</span></>;
                  return to ? <Link key={label} to={to} className={cls}>{inner}</Link>
                            : <a key={label} href={href} className={cls}>{inner}</a>;
                })}
              </div>
            </div>{/* ← FIX: closes Avatar card (was missing) */}

            {/* Profile details card */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Profile Details</p>
                {!editing
                  ? <button className="text-xs text-secondary font-medium hover:opacity-75 transition-opacity"
                      onClick={() => { setEditing(true); setSaveError(''); }}>Edit</button>
                  : <div className="flex gap-3">
                      <button className="text-xs text-muted hover:text-primary transition-colors"
                        onClick={() => { setEditing(false); setSaveError(''); }} disabled={saving}>Cancel</button>
                      <button className="text-xs text-secondary font-semibold hover:opacity-75 transition-opacity"
                        onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                    </div>
                }
              </div>

              {saveError   && <p className="text-xs text-red-500 mb-3">{saveError}</p>}
              {saveSuccess && <p className="text-xs text-green-600 mb-3 font-medium">✓ Profile updated</p>}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Full Name" name="full_name" value={form.full_name} editing={editing} onChange={onChange} />
                  <div>
                    <p className="text-xs text-muted mb-1">Email</p>
                    <p className="text-sm font-medium text-primary truncate">{guest?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Phone" name="phone" value={form.phone} type="tel" editing={editing} onChange={onChange} />
                  <Field label="Date of Birth" name="date_of_birth" value={form.date_of_birth} type="date" editing={editing} onChange={onChange} />
                </div>

                <Field label="Nationality" name="nationality" value={form.nationality} editing={editing} onChange={onChange} />

                <Field label="Address" name="address" value={form.address} editing={editing} onChange={onChange}>
                  {editing && <textarea name="address" className="input text-sm w-full" rows={2} value={form.address || ''} onChange={onChange} />}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="ID Type" name="id_type" value={ID_LABELS[form.id_type] || form.id_type} editing={editing} onChange={onChange}>
                    {editing && (
                      <select name="id_type" className="input text-sm w-full" value={form.id_type || ''} onChange={onChange}>
                        <option value="">Select</option>
                        {ID_TYPES.map(t => <option key={t} value={t}>{ID_LABELS[t]}</option>)}
                      </select>
                    )}
                  </Field>
                  <Field label="ID Number" name="id_number" value={form.id_number} editing={editing} onChange={onChange} />
                </div>

                <Field label="Special Preferences" name="preferences" value={form.preferences} editing={editing} onChange={onChange}>
                  {editing && <textarea name="preferences" className="input text-sm w-full" rows={2}
                    placeholder="Dietary needs, accessibility, room preferences…"
                    value={form.preferences || ''} onChange={onChange} />}
                </Field>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              RIGHT — reservations with inline tabs
          ════════════════════════════════════════════════ */}
          <div className="lg:col-span-3">
            <div className="bg-surface border border-border rounded-xl overflow-hidden">

              {/* Tabs — top of the right column, not below everything */}
              <div className="flex border-b border-border">
                {[
                  { key: 'upcoming',  label: 'Upcoming',  count: upcoming.length  },
                  { key: 'past',      label: 'Past',      count: past.length      },
                  { key: 'cancelled', label: 'Cancelled', count: cancelled.length },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-4 text-sm font-medium border-b-2 -mb-px transition-colors
                      ${activeTab === tab.key
                        ? 'border-secondary text-primary'
                        : 'border-transparent text-muted hover:text-primary'}`}>
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-medium
                        ${activeTab === tab.key ? 'bg-secondary text-white' : 'bg-border text-muted'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* List */}
              {resLoading ? (
                <div className="p-5 space-y-3">
                  {[1,2].map(i => <div key={i} className="skeleton h-32 rounded-lg"/>)}
                </div>
              ) : displayed.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="font-display text-xl text-muted mb-3">No {activeTab} stays</p>
                  {activeTab === 'upcoming' && <Link to="/book" className="btn btn--primary">Book a Room</Link>}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {displayed.map(res => {
                    const st = STATUS[res.status] || { label: res.status, cls: 'bg-gray-100 text-gray-500' };
                    const n  = nights(res.check_in_date, res.check_out_date);
                    const isCancelling = cancellingId === res.id;
                    return (
                      <div key={res.id} className="p-5">
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-display text-lg font-semibold">
                                {res.room_types?.name || res.room_type_name || 'Room'}
                              </p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.cls}`}>{st.label}</span>
                              {res.status === 'checked_in' && (
                                <Link to="/chat"
                                  className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
                                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                                  </svg>
                                  Chat with us
                                </Link>
                              )}
                            </div>
                            <p className="text-xs text-muted font-mono">{res.reservation_no}</p>
                          </div>
                          <p className="text-base font-semibold text-primary shrink-0">{fmt(res.total_amount)}</p>
                        </div>

                        {/* Dates */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="bg-bg rounded-lg px-3 py-2 text-center min-w-[90px]">
                            <p className="text-xs text-muted">Check-in</p>
                            <p className="text-sm font-semibold">{res.check_in_date}</p>
                          </div>
                          <div className="flex-1 flex flex-col items-center text-xs text-muted">
                            <div className="flex items-center gap-1 w-full">
                              <div className="flex-1 h-px bg-border"/>
                              <span className="shrink-0">{n}n</span>
                              <div className="flex-1 h-px bg-border"/>
                            </div>
                            <span className="mt-1">{res.adults} adult{res.adults !== 1 ? 's' : ''}{res.children > 0 ? `, ${res.children} child${res.children !== 1 ? 'ren' : ''}` : ''}</span>
                          </div>
                          <div className="bg-bg rounded-lg px-3 py-2 text-center min-w-[90px]">
                            <p className="text-xs text-muted">Check-out</p>
                            <p className="text-sm font-semibold">{res.check_out_date}</p>
                          </div>
                        </div>

                        {/* Cancel */}
                        {res.status === 'confirmed' && res.check_in_date >= today && (
                          <div className="pt-3 border-t border-border">
                            {!isCancelling ? (
                              <button className="text-xs text-red-400 hover:text-red-600 transition-colors"
                                onClick={() => { setCancellingId(res.id); setCancelError(''); }}>
                                Cancel reservation
                              </button>
                            ) : (
                              <div className="space-y-2">
                                <input className="input text-sm w-full" placeholder="Reason (optional)"
                                  value={cancelReason} onChange={e => setCancelReason(e.target.value)} />
                                {cancelError && <p className="text-xs text-red-500">{cancelError}</p>}
                                <div className="flex gap-2">
                                  <button className="btn btn--outline text-xs py-1.5"
                                    onClick={() => { setCancellingId(null); setCancelReason(''); }}>Keep Booking</button>
                                  <button className="btn btn--danger text-xs py-1.5"
                                    onClick={() => handleCancel(res.id)} disabled={cancelling}>
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

        </div>
      </div>
    </div>
  );
}