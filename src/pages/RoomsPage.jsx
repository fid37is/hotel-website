// src/pages/RoomsPage.jsx — mobile-first, rotating card images, scrollable tabs
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBooking }     from '../hooks/useBooking.jsx';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';
import { roomsApi }       from '../services/api.js';
import { useFmt }          from '../utils/currency.js';
import AvailabilitySearch from '../components/booking/AvailabilitySearch.jsx';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80&auto=format&fit=crop';

// All images for a room (for rotation)
const getRoomImages = (room) => {
  const media = (room.media || [])
    .filter(m => m.type === 'image' || m.type === 'gif')
    .map(m => m.url);
  return media.length > 0 ? media : [PLACEHOLDER_IMG];
};

// ─── Rotating image hook ──────────────────────────────────────────────────────
// Each card gets its own interval, staggered by index so they don't all flip at once
function useRotatingImage(images, index) {
  const [imgIdx, setImgIdx] = useState(0);
  const total = images.length;

  useEffect(() => {
    if (total <= 1) return;
    // Stagger start by index so cards don't all rotate simultaneously
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        setImgIdx(i => (i + 1) % total);
      }, 3200);
      return () => clearInterval(interval);
    }, index * 600);
    return () => clearTimeout(delay);
  }, [total, index]);

  return imgIdx;
}

export default function RoomsPage() {
  const fmt = useFmt();
  const hotelConfig           = useHotelConfig();
  const { state, dispatch }   = useBooking();
  const navigate              = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabsRef = useRef(null);

  const [allTypes,     setAllTypes]     = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [rooms,        setRooms]        = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [activeTypeId, setActiveTypeId] = useState(() => searchParams.get('type') || null);

  // Fetch all types once
  useEffect(() => {
    document.title = `Rooms & Suites | ${hotelConfig.shortName}`;
    roomsApi.getTypes()
      .then(res => {
        const seen  = new Set();
        const types = (res.data || []).filter(t => {
          if (seen.has(t.id)) return false;
          seen.add(t.id);
          return true;
        });
        setAllTypes(types);
        if (!searchParams.get('type') && types.length > 0) {
          setActiveTypeId(types[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setTypesLoading(false));
  }, []);

  // Fetch rooms for active type
  useEffect(() => {
    if (!activeTypeId) return;
    setRoomsLoading(true);
    setRooms([]);
    roomsApi.getAllRooms({ typeId: activeTypeId })
      .then(res => setRooms(res.data || []))
      .catch(() => {})
      .finally(() => setRoomsLoading(false));
  }, [activeTypeId]);

  const handleTabChange = (typeId) => {
    setActiveTypeId(typeId);
    setSearchParams({ type: typeId });
    // Scroll the active tab into view on mobile
    setTimeout(() => {
      const active = tabsRef.current?.querySelector('[data-active="true"]');
      active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, 50);
  };

  const activeType      = allTypes.find(t => t.id === activeTypeId) || null;
  const hasSearch       = !!(state.search.checkIn && state.search.checkOut);

  const availableRoomIds = useMemo(() => {
    if (!hasSearch) return null;
    return new Set((state.availableRooms || []).map(r => r.id).filter(Boolean));
  }, [hasSearch, state.availableRooms]);

  const handleBook = (room) => {
    dispatch({ type: 'SET_SEARCH', payload: {
      checkIn:           state.search.checkIn  || '',
      checkOut:          state.search.checkOut || '',
      guests:            state.search.guests   || 1,
      preselectedTypeId: room.type_id || activeTypeId,
    }});
    navigate('/book');
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* ── Dark header ─────────────────────────────────────────────── */}
      <div style={{
        background: 'var(--brand)',
        paddingTop:    'calc(var(--nav-h, 72px) + 38px + clamp(1.75rem, 5vw, 4rem))',
        paddingBottom: 'clamp(1.5rem, 4vw, 3rem)',
        paddingLeft:   'clamp(1rem, 5vw, 4rem)',
        paddingRight:  'clamp(1rem, 5vw, 4rem)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'linear-gradient(135deg, var(--accent) 0%, transparent 55%)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <span style={{ color: 'var(--accent)', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 10 }}>
            Accommodation
          </span>
          <h1 className="font-display text-white" style={{ fontSize: 'clamp(1.9rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1 }}>
            Rooms &amp; Suites
          </h1>
        </div>
      </div>

      {/* ── Sticky search bar ───────────────────────────────────────── */}
      <div style={{
        background: 'var(--brand)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0.75rem clamp(1rem, 5vw, 4rem)',
        position: 'sticky', top: 'calc(var(--nav-h, 72px) + 38px)', zIndex: 40,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <AvailabilitySearch compact />
        </div>
      </div>

      {/* ── Type tabs — horizontally scrollable, no wrap ─────────────── */}
      {!typesLoading && allTypes.length > 1 && (
        <div style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-base)',
          position: 'sticky',
          top: 'calc(var(--nav-h, 72px) + 38px + 58px)',
          zIndex: 30,
          // Fade edges to hint at scroll
          WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)',
        }}>
          <div
            ref={tabsRef}
            style={{
              maxWidth: 1280,
              margin: '0 auto',
              display: 'flex',
              overflowX: 'auto',
              scrollbarWidth: 'none',       // Firefox
              msOverflowStyle: 'none',      // IE/Edge
              padding: '0 clamp(1rem, 5vw, 4rem)',
              gap: 0,
            }}
            // Hide webkit scrollbar
            className="hide-scrollbar"
          >
            {allTypes.map(type => {
              const isActive = type.id === activeTypeId;
              return (
                <button
                  key={type.id}
                  data-active={isActive}
                  onClick={() => handleTabChange(type.id)}
                  style={{
                    flexShrink: 0,
                    padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 24px)',
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive
                      ? '2px solid var(--accent)'
                      : '2px solid transparent',
                    color: isActive ? 'var(--text-base)' : 'var(--text-muted)',
                    fontSize: 'clamp(10px, 1.5vw, 12px)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'color 0.2s, border-color 0.2s',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {type.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Active type info ─────────────────────────────────────────── */}
      {activeType && !typesLoading && (
        <div style={{ padding: 'clamp(1.25rem, 4vw, 2.5rem) clamp(1rem, 5vw, 4rem) 0' }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto',
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 className="font-display" style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 400, color: 'var(--text-base)', marginBottom: 6 }}>
                {activeType.name}
              </h2>
              {activeType.description && (
                <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(13px, 1.5vw, 14px)', lineHeight: 1.75, maxWidth: 580 }}>
                  {activeType.description}
                </p>
              )}
            </div>
            {activeType.base_rate && (
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>From</span>
                <p style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 300, color: 'var(--text-base)', margin: '2px 0 0' }}>
                  {fmt(activeType.base_rate)}
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}> /night</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Rooms grid ──────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 5vw, 4rem) clamp(3rem, 6vw, 5rem)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Search summary */}
          {hasSearch && !roomsLoading && (
            <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-base)' }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Availability for{' '}
                <strong style={{ color: 'var(--text-base)' }}>{state.search.checkIn}</strong>
                {' — '}
                <strong style={{ color: 'var(--text-base)' }}>{state.search.checkOut}</strong>
                {' · '}{state.search.guests} guest{state.search.guests > 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Skeleton */}
          {(typesLoading || roomsLoading) ? (
            <RoomsGrid>
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse" style={{ borderRadius: 4, overflow: 'hidden', background: 'var(--bg-surface)' }}>
                  <div style={{ aspectRatio: '4/3', background: 'var(--border-base)' }} />
                  <div style={{ padding: 16 }}>
                    <div style={{ height: 18, background: 'var(--border-base)', borderRadius: 2, marginBottom: 8, width: '60%' }} />
                    <div style={{ height: 12, background: 'var(--border-base)', borderRadius: 2, width: '40%' }} />
                  </div>
                </div>
              ))}
            </RoomsGrid>
          ) : rooms.length > 0 ? (
            <RoomsGrid>
              {rooms.map((room, i) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  index={i}
                  isAvailable={!hasSearch || !availableRoomIds || availableRoomIds.has(room.id)}
                  onBook={() => handleBook(room)}
                  onViewDetails={() => navigate(`/rooms/${room.type_id || activeTypeId}`)}
                />
              ))}
            </RoomsGrid>
          ) : (
            <div style={{ textAlign: 'center', padding: 'clamp(3rem,8vw,5rem) 1rem' }}>
              <p className="font-display" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', color: 'var(--text-base)', marginBottom: 10 }}>
                No rooms found
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                {hasSearch ? 'Try different dates or ' : 'Nothing here yet. '}
                <a href={`tel:${hotelConfig.contact?.phone}`} style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                  call us
                </a>
                {' '}— we can help.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Hide scrollbar globally for this page's tab strip */}
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}

/* ── Responsive grid wrapper ─────────────────────────────────────────────── */
function RoomsGrid({ children }) {
  return (
    <div style={{
      display: 'grid',
      // 1 col on phones, 2 on tablets, 3 on desktop, auto-fill so more rooms just wrap
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
      gap: 'clamp(12px, 2.5vw, 20px)',
    }}>
      {children}
    </div>
  );
}

/* ── Room card with rotating images ─────────────────────────────────────── */
function RoomCard({ room, index, isAvailable, onBook, onViewDetails }) {
  const [hovered,   setHovered]   = useState(false);
  const [touched,   setTouched]   = useState(false); // mobile tap state
  const images  = getRoomImages(room);
  const imgIdx  = useRotatingImage(images, index);
  const total   = images.length;

  // On mobile, first tap = show actions, second tap = navigate
  const handleCardClick = () => {
    if (!isAvailable) return;
    if (window.innerWidth < 768 && !touched) {
      setTouched(true);
      return;
    }
    onViewDetails();
  };

  // Reset touch state when user taps elsewhere
  useEffect(() => {
    if (!touched) return;
    const reset = () => setTouched(false);
    document.addEventListener('touchstart', reset, { passive: true });
    return () => document.removeEventListener('touchstart', reset);
  }, [touched]);

  const showActions = hovered || touched;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: isAvailable ? 'pointer' : 'default',
        opacity: isAvailable ? 1 : 0.55,
        borderRadius: 4,
        background: 'var(--bg-surface)',
        boxShadow: showActions && isAvailable
          ? '0 16px 48px rgba(0,0,0,0.16)'
          : '0 2px 12px rgba(0,0,0,0.07)',
        transform: showActions && isAvailable ? 'translateY(-4px)' : 'none',
        transition: 'box-shadow 0.35s ease, transform 0.35s ease',
        // Ensure card doesn't overflow on very small screens
        minWidth: 0,
      }}
    >
      {/* ── Photo with cross-fade rotation ── */}
      <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative', background: 'var(--border-base)' }}>
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={room.name || `Room ${room.number || index + 1}`}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: i === imgIdx ? 1 : 0,
              transform: i === imgIdx && showActions ? 'scale(1.06)' : 'scale(1)',
              transition: 'opacity 0.9s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1)',
              filter: isAvailable ? 'none' : 'grayscale(55%)',
            }}
          />
        ))}

        {/* Image counter dot strip — only show if > 1 image */}
        {total > 1 && (
          <div style={{
            position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 4, zIndex: 3,
          }}>
            {images.map((_, i) => (
              <span key={i} style={{
                display: 'block',
                width: i === imgIdx ? 16 : 5, height: 5, borderRadius: 3,
                background: i === imgIdx ? 'var(--accent)' : 'rgba(255,255,255,0.55)',
                transition: 'width 0.4s ease, background 0.3s',
              }} />
            ))}
          </div>
        )}

        {/* Index watermark */}
        <span className="font-display" style={{
          position: 'absolute', top: 10, right: 12, zIndex: 2,
          fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.22)',
          textShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Unavailable overlay */}
        {!isAvailable && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.42)',
          }}>
            <div style={{ background: 'rgba(0,0,0,0.82)', padding: '8px 16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <p style={{ color: 'var(--bg-surface)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Unavailable</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 2 }}>for these dates</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Info panel ── */}
      <div style={{ padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2vw, 18px) clamp(14px, 2vw, 18px)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <div style={{ minWidth: 0 }}>
            <h3 className="font-display" style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              fontWeight: 400, color: 'var(--text-base)', lineHeight: 1.2, marginBottom: 2,
              // Prevent very long names from overflowing
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {room.name || `Room ${room.number || (index + 1)}`}
            </h3>
            {(room.number || room.floor) && (
              <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                {[room.number ? `Room ${room.number}` : '', room.floor ? `Floor ${room.floor}` : ''].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          {room.base_rate && (
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ color: 'var(--accent)', fontSize: 'clamp(13px, 2vw, 15px)', fontFamily: 'var(--font-display, serif)', fontWeight: 400 }}>
                {fmt(room.base_rate)}
              </p>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>/night</span>
            </div>
          )}
        </div>

        {/* Amenity chips */}
        {room.amenities?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
            {room.amenities.slice(0, 3).map((a, j) => (
              <span key={j} style={{
                fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-page)',
                padding: '3px 7px', borderRadius: 2, letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}>
                {a}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span style={{ fontSize: 10, color: 'var(--text-muted)', padding: '3px 0' }}>
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action buttons — always visible on mobile, hover-revealed on desktop */}
        <div style={{
          display: 'flex', gap: 8,
          maxHeight: showActions || window.innerWidth < 768 ? 48 : 0,
          opacity:   showActions || window.innerWidth < 768 ? 1  : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, opacity 0.25s ease',
        }}>
          <button
            onClick={e => { e.stopPropagation(); onViewDetails(); }}
            style={{
              flex: 1, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
              border: '1px solid var(--border-base)', color: 'var(--text-base)',
              padding: '10px 8px', background: 'none', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'border-color 0.2s',
              // Large enough touch target on mobile
              minHeight: 44,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-base)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-base)'; }}
          >
            Details
          </button>
          {isAvailable && (
            <button
              onClick={e => { e.stopPropagation(); onBook(); }}
              style={{
                flex: 1, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
                background: 'var(--accent)', color: 'var(--bg-surface)',
                padding: '10px 8px', cursor: 'pointer', border: 'none',
                fontFamily: 'inherit', transition: 'opacity 0.2s',
                minHeight: 44,
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </article>
  );
}