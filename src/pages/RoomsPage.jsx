// src/pages/RoomsPage.jsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBooking } from '../hooks/useBooking.jsx';
import { roomsApi }   from '../services/api.js';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';
import AvailabilitySearch from '../components/booking/AvailabilitySearch.jsx';

const fmt = (n) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n);

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80&auto=format&fit=crop';

export default function RoomsPage() {
  const hotelConfig = useHotelConfig();
  const { state, dispatch } = useBooking();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // allTypes — from roomsApi.getTypes() — each item is a room type object
  // with: id, name, category, description, amenities, base_rate, images
  const [allTypes, setAllTypes] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const activeTab = searchParams.get('type') || 'All';

  // Availability state from booking context (set by AvailabilitySearch)
  const hasSearch   = !!(state.search.checkIn && state.search.checkOut);
  const isSearching = hasSearch ? state.availabilityLoading : loading;

  useEffect(() => {
    document.title = `Rooms & Suites | ${hotelConfig.shortName}`;
    roomsApi.getTypes()
      .then(res => setAllTypes(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Tabs — one per room type name (each type IS its own tab)
  const tabs = useMemo(() => {
    return ['All', ...allTypes.map(r => r.name).filter(Boolean)];
  }, [allTypes]);

  // Room types shown for the active tab
  const tabTypes = useMemo(() => {
    if (activeTab === 'All') return allTypes;
    return allTypes.filter(r => r.name === activeTab);
  }, [allTypes, activeTab]);

  // When a search has run, the availability results come back as room instances
  // Each has a room_type_id linking back to a type. Build a set of available type IDs.
  const availableTypeIds = useMemo(() => {
    if (!hasSearch) return null;
    const rooms = state.availableRooms || [];
    // availability results may return room_type_id directly or nested type
    return new Set(rooms.map(r => r.room_type_id || r.type_id || r.id).filter(Boolean));
  }, [hasSearch, state.availableRooms]);

  // Final display list — room types annotated with availability
  const displayTypes = useMemo(() => {
    if (!hasSearch || !availableTypeIds) return tabTypes;
    return tabTypes.map(t => ({
      ...t,
      available: availableTypeIds.has(t.id),
    }));
  }, [tabTypes, hasSearch, availableTypeIds]);

  const availableCount = hasSearch
    ? displayTypes.filter(t => t.available).length
    : displayTypes.length;

  // When entire active tab is unavailable, suggest other tabs that do have availability
  const suggestedTabs = useMemo(() => {
    if (!hasSearch || !availableTypeIds || activeTab === 'All') return [];
    if (displayTypes.some(t => t.available)) return [];
    return tabs.filter(tab => {
      if (tab === 'All' || tab === activeTab) return false;
      return allTypes.filter(t => t.name === tab).some(t => availableTypeIds.has(t.id));
    });
  }, [displayTypes, hasSearch, availableTypeIds, tabs, allTypes, activeTab]);

  const handleTabClick = (tab) => {
    if (tab === 'All') {
      searchParams.delete('type');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ type: tab }, { replace: true });
    }
  };

  const handleBook = (roomType) => {
    dispatch({ type: 'SELECT_ROOM', payload: { room: roomType, rate: roomType.rate_plans?.[0] || null } });
    navigate('/book');
  };

  return (
    <div style={{ background: '#f5f3ef', minHeight: '100vh' }}>

      {/* ── Dark header — same tone as homepage rooms section ─────────── */}
      <div style={{
        background: '#111',
        paddingTop:    'calc(var(--nav-h, 72px) + clamp(2.5rem, 5vw, 4rem))',
        paddingBottom: 'clamp(2rem, 4vw, 3rem)',
        paddingLeft:   'clamp(1.25rem, 5vw, 4rem)',
        paddingRight:  'clamp(1.25rem, 5vw, 4rem)',
        position:      'relative',
        overflow:      'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'linear-gradient(135deg, #c9a96e 0%, transparent 55%)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <span style={{ color: '#c9a96e', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 12 }}>
            Accommodation
          </span>
          <h1 className="font-display text-white" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1 }}>
            Rooms &amp; Suites
          </h1>
        </div>
      </div>

      {/* ── Sticky search bar ─────────────────────────────────────────── */}
      <div style={{
        background:    '#1a1a1a',
        borderBottom:  '1px solid rgba(255,255,255,0.08)',
        padding:       '1rem clamp(1.25rem, 5vw, 4rem)',
        position:      'sticky',
        top:           'var(--nav-h, 72px)',
        zIndex:        40,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <AvailabilitySearch compact />
        </div>
      </div>

      {/* ── Type tabs — only render once types are loaded ─────────────── */}
      {!loading && tabs.length > 1 && (
        <div style={{
          background:    '#f5f3ef',
          borderBottom:  '1px solid #e8e4dc',
          position:      'sticky',
          top:           'calc(var(--nav-h, 72px) + 68px)',
          zIndex:        30,
          overflowX:     'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto',
            padding:  '0 clamp(1.25rem, 5vw, 4rem)',
            display:  'flex',
            minWidth: 'max-content',
          }}>
            {tabs.map(tab => {
              const isActive = tab === activeTab;
              // Count available types for this tab when a search is active
              const badge = hasSearch && availableTypeIds
                ? (tab === 'All'
                    ? allTypes.filter(t => availableTypeIds.has(t.id)).length
                    : allTypes.filter(t => t.name === tab && availableTypeIds.has(t.id)).length)
                : null;

              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  style={{
                    padding:       '1rem 1.25rem',
                    fontSize:      11,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight:    isActive ? 600 : 400,
                    color:         isActive ? '#1a1a1a' : '#9a8c7a',
                    borderBottom:  isActive ? '2px solid #1a1a1a' : '2px solid transparent',
                    borderTop:     'none',
                    borderLeft:    'none',
                    borderRight:   'none',
                    background:    'none',
                    cursor:        'pointer',
                    transition:    'color 0.2s, border-color 0.2s',
                    whiteSpace:    'nowrap',
                    display:       'flex',
                    alignItems:    'center',
                    gap:           6,
                    fontFamily:    'inherit',
                  }}
                >
                  {tab}
                  {badge !== null && (
                    <span style={{
                      fontSize: 9,
                      background: badge > 0 ? '#c9a96e' : 'rgba(0,0,0,0.1)',
                      color:      badge > 0 ? '#fff' : '#9a8c7a',
                      borderRadius: 999, padding: '1px 6px', fontWeight: 600,
                    }}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Results ───────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Search summary */}
          {hasSearch && !isSearching && (
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #e8e4dc' }}>
              {state.availabilityError ? (
                <p style={{ color: '#dc2626', fontSize: 14 }}>{state.availabilityError}</p>
              ) : (
                <p style={{ fontSize: 13, color: '#6b6b6b' }}>
                  <strong style={{ color: '#1a1a1a' }}>{availableCount} room type{availableCount !== 1 ? 's' : ''}</strong> available
                  {' '}for{' '}
                  <strong style={{ color: '#1a1a1a' }}>{state.search.checkIn}</strong>
                  {' — '}
                  <strong style={{ color: '#1a1a1a' }}>{state.search.checkOut}</strong>
                  {' · '}{state.search.guests} guest{state.search.guests > 1 ? 's' : ''}
                  {activeTab !== 'All' && <span style={{ color: '#c9a96e' }}> · {activeTab}</span>}
                </p>
              )}
            </div>
          )}

          {/* Unavailable tab — suggest alternatives */}
          {suggestedTabs.length > 0 && (
            <div style={{
              background: '#1a1a1a', padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem', borderLeft: '3px solid #c9a96e',
            }}>
              <p style={{ fontSize: 13, color: '#fff', marginBottom: 8 }}>
                No <strong>{activeTab}</strong> rooms are available for your selected dates.
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>
                Available alternatives:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {suggestedTabs.map(t => (
                  <button
                    key={t}
                    onClick={() => handleTabClick(t)}
                    style={{
                      fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
                      border: '1px solid #c9a96e', color: '#c9a96e',
                      padding: '7px 16px', background: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#c9a96e'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#c9a96e'; }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading skeletons */}
          {isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 2 }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse" style={{ aspectRatio: '3/4', background: '#e8e4dc' }} />
              ))}
            </div>
          ) : displayTypes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 2 }}>
              {displayTypes.map((roomType, i) => (
                <RoomTypeCard
                  key={roomType.id}
                  roomType={roomType}
                  index={i}
                  hasSearch={hasSearch}
                  onBook={() => handleBook(roomType)}
                  onViewDetails={() => navigate(`/rooms/${roomType.id}`)}
                  fmt={fmt}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
              <p className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#1a1a1a', marginBottom: 12 }}>
                No rooms found
              </p>
              <p style={{ color: '#9a8c7a', fontSize: 14, marginBottom: 24 }}>
                Try different dates or{' '}
                <a href={`tel:${hotelConfig.contact.phone}`} style={{ color: '#c9a96e', textDecoration: 'underline' }}>
                  call us directly
                </a>{' '}— we may be able to help.
              </p>
              {hasSearch && (
                <button
                  onClick={() => dispatch({ type: 'RESET_BOOKING' })}
                  style={{
                    fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                    border: '1px solid #1a1a1a', color: '#1a1a1a',
                    padding: '12px 28px', background: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

/* ── Room type card ───────────────────────────────────────────────────────── */
function RoomTypeCard({ roomType, index, hasSearch, onBook, onViewDetails, fmt }) {
  const [hovered, setHovered] = useState(false);
  const img      = roomType.images?.[0] || PLACEHOLDER_IMG;
  const baseRate = roomType.rate_plans?.[0]?.base_rate || roomType.rate_plans?.[0]?.rate || roomType.base_rate;
  const isAvail  = !hasSearch || roomType.available !== false;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        aspectRatio: '3/4',
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: isAvail ? 1 : 0.5,
      }}
    >
      {/* Photo */}
      <img
        src={img}
        alt={roomType.name}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          transform: hovered && isAvail ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          filter: isAvail ? 'none' : 'grayscale(50%)',
        }}
      />

      {/* Gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)',
      }} />

      {/* Unavailable overlay */}
      {!isAvail && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.75)', padding: '10px 20px', textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <p style={{ color: '#fff', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
              Not Available
            </p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>for selected dates</p>
          </div>
        </div>
      )}

      {/* Category badge */}
      {(roomType.category || roomType.room_category) && (
        <div style={{ position: 'absolute', top: 18, left: 18, zIndex: 6 }}>
          <span style={{
            fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#c9a96e', border: '1px solid rgba(201,169,110,0.4)',
            padding: '4px 10px',
          }}>
            {roomType.category || roomType.room_category}
          </span>
        </div>
      )}

      {/* Decorative index */}
      <div style={{ position: 'absolute', top: 16, right: 18, zIndex: 6 }}>
        <span className="font-display" style={{ fontSize: 28, fontWeight: 300, color: 'rgba(255,255,255,0.1)' }}>
          0{index + 1}
        </span>
      </div>

      {/* Info */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, zIndex: 6 }}>
        <h3 className="font-display text-white" style={{ fontSize: 20, fontWeight: 300, lineHeight: 1.2, marginBottom: 6 }}>
          {roomType.name}
        </h3>

        {/* Description slides up on hover */}
        <div style={{
          maxHeight: hovered ? 72 : 0, opacity: hovered ? 1 : 0,
          overflow: 'hidden', transition: 'max-height 0.35s ease, opacity 0.3s ease',
          marginBottom: hovered ? 10 : 0,
        }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.65 }}>
            {roomType.description}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
          {baseRate && (
            <div>
              <span style={{ color: '#c9a96e', fontSize: 15, fontWeight: 300 }}>{fmt(baseRate)}</span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginLeft: 4 }}>/night</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
              style={{
                fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.7)',
                padding: '6px 12px', background: 'none', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            >
              Details
            </button>
            {isAvail && (
              <button
                onClick={(e) => { e.stopPropagation(); onBook(); }}
                style={{
                  fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                  background: '#c9a96e', color: '#fff',
                  padding: '6px 12px', cursor: 'pointer', border: 'none', fontFamily: 'inherit',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#b8965d'}
                onMouseLeave={e => e.currentTarget.style.background = '#c9a96e'}
              >
                Book
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}