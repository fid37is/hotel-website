// hotel-website/src/pages/HomePage.jsx
// HMS Design System v3 — fully config-driven, no hardcoded city/color references

import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';
import { roomsApi } from '../services/api.js';

const FALLBACK_HERO =
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800&q=90&auto=format&fit=crop';
const FALLBACK_ROOMS = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80&auto=format&fit=crop',
];


// ── Tabbed Booking Bar ────────────────────────────────────────────────────────
function BookingBar({ navigate, accent }) {
  const [tab,      setTab]      = useState('rooms');
  const [checkIn,  setCheckIn]  = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests,   setGuests]   = useState('2');
  const [evtDate,  setEvtDate]  = useState('');
  const [evtType,  setEvtType]  = useState('');
  const [evtGuests,setEvtGuests] = useState('');

  const inpStyle = {
    width: '100%', marginTop: 4, background: '#111111',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff', padding: '8px 10px',
    fontSize: 12, fontFamily: 'var(--font-sans)',
    outline: 'none', colorScheme: 'dark',
  };
  const lblStyle = {
    fontSize: 11, color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase', letterSpacing: '0.18em',
    fontFamily: 'var(--font-sans)',
  };

  const goRooms = () => {
    const p = new URLSearchParams();
    if (checkIn)  p.set('checkIn',  checkIn);
    if (checkOut) p.set('checkOut', checkOut);
    if (guests)   p.set('guests',   guests);
    navigate(`/book${p.toString() ? '?' + p.toString() : ''}`);
  };

  const goEvents = () => {
    const p = new URLSearchParams();
    if (evtDate)   p.set('date',   evtDate);
    if (evtType)   p.set('type',   evtType);
    if (evtGuests) p.set('guests', evtGuests);
    navigate(`/events${p.toString() ? '?' + p.toString() : ''}`);
  };

  return (
    <section style={{
      background: '#050505',
      borderTop: '1px solid rgba(255,255,255,0.09)',
      borderBottom: '1px solid rgba(255,255,255,0.09)',
      position: 'sticky', top: 'calc(var(--nav-h, 72px) + 38px)', zIndex: 5,
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 clamp(1.5rem,6vw,5rem)' }}>
        {[['rooms', 'Room Booking'], ['events', 'Events & Venues']].map(([key, label]) => (
          <button key={key} type="button" onClick={() => setTab(key)} style={{
            padding: '12px 20px 11px', fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', fontFamily: 'var(--font-sans)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: tab === key ? '#fff' : 'rgba(255,255,255,0.35)',
            borderBottom: tab === key ? `2px solid ${accent}` : '2px solid transparent',
            marginBottom: -1, transition: 'color 0.2s',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Room booking fields */}
      {tab === 'rooms' && (
        <div style={{ padding: '1.1rem clamp(1.5rem,6vw,5rem)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, alignItems: 'center' }}>
            <div>
              <label style={lblStyle}>Check‑in</label>
              <input style={inpStyle} type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label style={lblStyle}>Check‑out</label>
              <input style={inpStyle} type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label style={lblStyle}>Guests</label>
              <input style={inpStyle} type="number" min="1" value={guests} onChange={e => setGuests(e.target.value)} />
            </div>
            <button type="button" onClick={goRooms} style={{
              marginTop: 18, width: '100%', background: accent, color: '#0c0c0c',
              fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
              padding: '12px 18px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}>
              Search rooms
            </button>
          </div>
        </div>
      )}

      {/* Event enquiry fields */}
      {tab === 'events' && (
        <div style={{ padding: '1.1rem clamp(1.5rem,6vw,5rem)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, alignItems: 'center' }}>
            <div>
              <label style={lblStyle}>Event Date</label>
              <input style={inpStyle} type="date" value={evtDate} onChange={e => setEvtDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label style={lblStyle}>Event Type</label>
              <select style={{ ...inpStyle, color: evtType ? '#fff' : 'rgba(255,255,255,0.4)' }} value={evtType} onChange={e => setEvtType(e.target.value)}>
                <option value="">Any type…</option>
                {[['conference','Conference / Meeting'],['wedding','Wedding'],['birthday','Birthday / Party'],['gala','Gala / Corporate Dinner'],['workshop','Workshop'],['other','Other']].map(([v,l]) => (
                  <option key={v} value={v} style={{ background: '#111', color: '#fff' }}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={lblStyle}>Expected Guests</label>
              <input style={inpStyle} type="number" min="1" placeholder="e.g. 50" value={evtGuests} onChange={e => setEvtGuests(e.target.value)} />
            </div>
            <button type="button" onClick={goEvents} style={{
              marginTop: 18, width: '100%', background: accent, color: '#0c0c0c',
              fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
              padding: '12px 18px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}>
              Check availability
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default function HomePage() {
  const hotelConfig = useHotelConfig();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [roomsReady, setRoomsReady] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const scrollRef = useRef(null);

  // ── Config-driven values ────────────────────────────────────────────────────
  const accent  = hotelConfig.brand?.primary || '#c9a96e';
  const heroImg = hotelConfig.heroImage || FALLBACK_HERO;

  // Location — built entirely from HMS contact fields, never hardcoded
  const city     = hotelConfig.contact?.city    || '';
  const state    = hotelConfig.contact?.state   || '';
  const country  = hotelConfig.contact?.country || '';
  const cityLine = [city, country].filter(Boolean).join(', ');       // e.g. "Asaba, Nigeria"
  const locationTag = [city, state].filter(Boolean).join(', ') || hotelConfig.name;

  // Currency — driven by payment config, not hardcoded to NGN
  const currency = hotelConfig.payment?.currency || 'NGN';
  const fmt = (n) =>
    new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format((n || 0) / 100);

  // Tagline — last word goes italic in hero
  const words    = (hotelConfig.tagline || 'Where Comfort Meets Elegance').split(' ');
  const lastWord = words.pop();
  const restWords = words.join(' ');

  const hotelName = hotelConfig.name || 'our hotel';

  // Marketing copy — from HMS config or sensible generic fallback
  const marketingHeadline =
    hotelConfig.heroMarketingLine ||
    `Unwind in ${locationTag}'s most serene poolside retreat${state ? `, minutes from ${state}'s business district` : ''}.`;
  const marketingSubheadline =
    hotelConfig.heroSupportingLine ||
    'Spacious rooms, business\u2011ready amenities, and resort\u2011style comforts designed for travellers who refuse to choose between work and rest.';

  const guestRating = hotelConfig.reviews?.average || 4.8;
  const guestCount  = hotelConfig.reviews?.count   || 1200;

  const offers = hotelConfig.offers || [
    {
      id: 'weekend-escape',
      name: 'Weekend Escape',
      description: 'Arrive Friday, depart Monday with late checkout and complimentary breakfast.',
      fromRate: 8500000,
      tag: 'Leisure',
    },
    {
      id: 'business-stay',
      name: 'Business Stay',
      description: 'Flexible check\u2011in, high\u2011speed Wi\u2011Fi, and daily laundry for busy corporate travellers.',
      fromRate: 9000000,
      tag: 'Corporate',
    },
    {
      id: 'romantic-getaway',
      name: 'Romantic Getaway',
      description: 'Champagne on arrival, couples\u2019 spa treatment, and dinner for two.',
      fromRate: 12000000,
      tag: 'Couples',
    },
  ];

  const testimonials = hotelConfig.reviews?.testimonials || [
    {
      name: 'Chinedu, Business Traveller',
      quote:
        '\u201cBest decision I made for my trip \u2014 quiet rooms, flawless Wi\u2011Fi, and a team that remembered my name.\u201d',
    },
    {
      name: 'Amara & Dele',
      quote:
        '\u201cFelt like a private resort in the middle of the city. We barely wanted to leave the pool.\u201d',
    },
  ];

  useEffect(() => {
    document.title = hotelConfig.seo?.defaultTitle || hotelConfig.name;
    roomsApi
      .getTypes()
      .then((r) => setRooms((r.data || []).slice(0, 6)))
      .catch(() => {})
      .finally(() => setRoomsReady(true));
  }, []);

  const scrollRooms = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 420, behavior: 'smooth' });
  };

  return (
    <>
      {/* ── DESIGN SYSTEM CSS VARS ─────────────────────────────────────── */}
      <style>{`
        :root {
          --accent: ${accent};
          --light: #faf9f7;
          --dark: #0c0c0c;
          --mid: #1a1a1a;
          --muted: rgba(255,255,255,0.35);
          --muted-dark: rgba(0,0,0,0.45);
          --font-display: 'Cormorant Garamond', 'Cormorant', Georgia, serif;
          --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
        }

        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

        .hms-page { background: var(--dark); }

        @keyframes slowReveal {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .rooms-scroll {
          display: flex; gap: 3px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          cursor: grab;
        }
        .rooms-scroll:active { cursor: grabbing; }
        .rooms-scroll::-webkit-scrollbar { display: none; }

        .room-card {
          flex: 0 0 380px;
          scroll-snap-align: start;
          position: relative; overflow: hidden;
          aspect-ratio: 3/4; cursor: pointer;
        }
        @media (max-width: 640px) { .room-card { flex: 0 0 85vw; } }
        .room-card img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.9s cubic-bezier(0.16,1,0.3,1); display: block;
        }
        .room-card:hover img { transform: scale(1.06); }
        .room-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
        }
        .room-card-body { position: absolute; bottom: 0; left: 0; right: 0; padding: 28px 24px; }
        .room-card-name { font-family: var(--font-display); font-size: 22px; font-weight: 300; color: #fff; line-height: 1.2; margin: 0 0 6px; }
        .room-card-rate { font-size: 13px; color: var(--accent); }
        .room-card-cta {
          position: absolute; top: 20px; right: 20px;
          width: 36px; height: 36px;
          border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.3s, border-color 0.3s;
        }
        .room-card:hover .room-card-cta { opacity: 1; border-color: var(--accent); }

        .section-label {
          font-size: 9px; letter-spacing: 0.45em; text-transform: uppercase;
          color: var(--accent); display: block; margin-bottom: 16px;
          font-family: var(--font-sans);
        }

        .story-img {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.16,1,0.3,1);
        }
        .story-panel:hover .story-img { transform: scale(1.03); }

        .booking-input {
          width: 100%; margin-top: 4px;
          background: #111111;
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff; padding: 8px 10px;
          font-size: 12px; font-family: var(--font-sans);
        }
        .booking-input::placeholder { color: rgba(255,255,255,0.4); }
      `}</style>

      <div className="hms-page">

        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section
          style={{
            position: 'relative', height: '100svh', minHeight: 640,
            marginTop: 'calc(var(--nav-h, 72px) * -1)',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <img
            src={heroImg} alt=""
            onLoad={() => setHeroLoaded(true)}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              animation: heroLoaded ? 'slowReveal 2s ease-out forwards' : 'none',
              opacity: heroLoaded ? 1 : 0,
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 55%, rgba(0,0,0,0.95) 100%)',
          }} />

          <div style={{
            position: 'relative', zIndex: 2, textAlign: 'center',
            padding: '0 clamp(1.5rem, 6vw, 4rem)', color: '#fff', maxWidth: 900,
          }}>
            <span className="section-label" style={{ color: 'rgba(255,255,255,0.7)', animation: 'fadeUp 0.8s 0.3s both' }}>
              {hotelConfig.name}{cityLine ? ` \u00b7 ${cityLine}` : ''}
            </span>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
              fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.01em',
              margin: '0 0 clamp(1.2rem, 3vh, 2rem)',
              animation: 'fadeUp 0.9s 0.5s both',
            }}>
              {restWords}{' '}
              <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.75)' }}>{lastWord}</em>
            </h1>

            <p style={{
              fontFamily: 'var(--font-sans)', maxWidth: 640, margin: '0 auto 0.75rem',
              fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.9)',
              animation: 'fadeUp 0.9s 0.6s both',
            }}>
              {marketingHeadline}
            </p>

            <p style={{
              fontFamily: 'var(--font-sans)', maxWidth: 640,
              margin: '0 auto clamp(1.6rem, 4vh, 2.4rem)',
              fontSize: 13, lineHeight: 1.8, color: 'var(--muted)',
              animation: 'fadeUp 0.9s 0.65s both',
            }}>
              Welcome to {hotelName}. {marketingSubheadline}
            </p>

            <div style={{
              display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap',
              animation: 'fadeUp 0.8s 0.8s both', fontFamily: 'var(--font-sans)',
            }}>
              <Link to="/book" style={{
                display: 'inline-flex', alignItems: 'center',
                background: accent, color: '#0c0c0c',
                fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                padding: '14px 32px', transition: 'opacity 0.2s, transform 0.2s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
              >
                Check availability
              </Link>
              <Link to="/rooms" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                color: 'rgba(255,255,255,0.85)',
                fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.6)', padding: '13px 28px',
                transition: 'color 0.2s, border-color 0.2s, background 0.2s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.2)'; e.currentTarget.style.borderColor = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; }}
              >
                View rooms &amp; suites
              </Link>
            </div>

            <div style={{
              marginTop: 22, display: 'flex', justifyContent: 'center',
              flexWrap: 'wrap', gap: 20, fontSize: 11, color: 'var(--muted)',
              fontFamily: 'var(--font-sans)', animation: 'fadeUp 0.8s 0.95s both',
            }}>
              <span>&#9733; {guestRating.toFixed(1)} from {guestCount.toLocaleString()} guests</span>
              <span>Best rate guaranteed when you book direct</span>
              <span>Free airport pickup on 3+ night stays</span>
            </div>
          </div>

          {locationTag && (
            <div style={{
              position: 'absolute', bottom: 28,
              left: 'clamp(1.5rem,5vw,4rem)',
              animation: 'fadeUp 0.8s 1.05s both',
            }}>
              <span style={{
                fontSize: 9, letterSpacing: '0.35em',
                color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
                fontFamily: 'var(--font-sans)',
              }}>
                {locationTag}
              </span>
            </div>
          )}
        </section>

        {/* ── BOOKING BAR (STICKY, TABBED) ───────────────────────────── */}
        <BookingBar navigate={navigate} accent={accent} />

        {/* ── INTRO / POSITIONING ──────────────────────────────────────── */}
        <section style={{ background: 'var(--light)', padding: 'clamp(4rem,9vw,7rem) clamp(1.5rem,6vw,5rem)' }}>
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(3rem, 8vw, 8rem)', alignItems: 'end',
            }}>
              <div>
                <span className="section-label" style={{ color: accent }}>Welcome to {hotelName}</span>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontWeight: 300, lineHeight: 1.15, color: '#0c0c0c', margin: 0,
                }}>
                  {marketingHeadline}
                </p>
              </div>

              <div style={{ paddingBottom: 4 }}>
                <p style={{ fontSize: 13, lineHeight: 1.9, color: 'var(--muted-dark)', marginBottom: 24, maxWidth: 420, fontFamily: 'var(--font-sans)' }}>
                  {marketingSubheadline}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                  <p style={{ fontSize: 12, color: 'var(--muted-dark)', margin: 0, fontFamily: 'var(--font-sans)' }}>
                    <strong>For business.</strong> Fast Wi\u2011Fi, quiet workspaces, meeting rooms, and seamless airport transfers make every trip efficient.
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--muted-dark)', margin: 0, fontFamily: 'var(--font-sans)' }}>
                    <strong>For leisure.</strong> Resort\u2011style pool, spa experiences, and dining that celebrates {city || 'the city'} by day and night.
                  </p>
                </div>

                <Link to="/rooms" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 16,
                  fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
                  color: '#0c0c0c', transition: 'gap 0.3s', fontFamily: 'var(--font-sans)',
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.gap = '24px')}
                  onMouseLeave={(e) => (e.currentTarget.style.gap = '16px')}
                >
                  View rooms &amp; rates
                  <span style={{ display: 'inline-block', width: 28, height: 1, background: '#0c0c0c' }} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── ROOMS ─────────────────────────────────────────────────────── */}
        <section style={{ background: 'var(--dark)', paddingTop: 'clamp(4rem,8vw,7rem)' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            padding: '0 clamp(1.5rem,6vw,5rem)', marginBottom: 'clamp(2rem,4vw,3rem)',
          }}>
            <div>
              <span className="section-label">Accommodation</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 300, color: '#fff', margin: 0, lineHeight: 1 }}>
                Rooms &amp; Suites
              </h2>
              <p style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>
                From intimate city rooms to expansive suites overlooking the pool, find the right space for your stay.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['‹', -1], ['›', 1]].map(([arrow, dir]) => (
                <button key={dir} onClick={() => scrollRooms(dir)} style={{
                  width: 44, height: 44,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'none', color: 'rgba(255,255,255,0.4)',
                  fontSize: 20, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'border-color 0.2s, color 0.2s', fontFamily: 'var(--font-sans)',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                >
                  {arrow}
                </button>
              ))}
            </div>
          </div>

          <div ref={scrollRef} className="rooms-scroll" style={{ padding: '0 clamp(1.5rem,6vw,5rem) clamp(4rem,8vw,7rem)' }}>
            {!roomsReady
              ? [0, 1, 2, 3].map((i) => <div key={i} className="room-card" style={{ background: '#1a1a1a' }} />)
              : rooms.map((room, i) => {
                  const img = (() => {
                    const m = (room.media || []).find((x) => x.type === 'image');
                    return m?.url || FALLBACK_ROOMS[i % FALLBACK_ROOMS.length];
                  })();
                  return (
                    <article key={room.id} className="room-card" onClick={() => navigate(`/rooms/${room.id}`)}>
                      <img src={img} alt={room.name} loading="lazy" />
                      <div className="room-card-overlay" />
                      <div className="room-card-body">
                        <h3 className="room-card-name">{room.name}</h3>
                        {room.base_rate && <p className="room-card-rate">From {fmt(room.base_rate)} / night</p>}
                      </div>
                      <div className="room-card-cta">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 10L10 2M10 2H4M10 2V8" stroke={accent} strokeWidth="1.2" />
                        </svg>
                      </div>
                    </article>
                  );
                })}

            <Link to="/rooms" className="room-card" style={{
              background: '#111111', border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 16, textDecoration: 'none', transition: 'border-color 0.3s',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
            >
              <span style={{ display: 'block', width: 36, height: 1, background: accent }} />
              <span style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-sans)' }}>
                All rooms
              </span>
            </Link>
          </div>
        </section>

        {/* ── WHY STAY HERE ─────────────────────────────────────────────── */}
        <section style={{ background: 'var(--light)', padding: 'clamp(5rem,9vw,8rem) clamp(1.5rem,6vw,5rem)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <span className="section-label" style={{ color: accent }}>Why stay at {hotelName}</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 300, margin: '0 0 2.5rem', color: '#0c0c0c', lineHeight: 1.1 }}>
              Made for business,<br />ready for escape.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
              {[
                { title: 'Unbeatable location',    body: `Stay in the heart of ${city || 'the city'} with quick access to banks, embassies, and nightlife.` },
                { title: 'Comfort by design',      body: 'Sound\u2011insulated rooms, plush bedding, and blackout curtains for truly restorative sleep.' },
                { title: 'Always\u2011on service', body: '24/7 concierge, in\u2011room dining, and a team that anticipates what you need next.' },
                { title: 'Resort\u2011style amenities', body: 'Infinity pool, spa treatments, and a lobby bar that turns evenings into occasions.' },
              ].map((item) => (
                <div key={item.title}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0c0c0c', margin: '0 0 6px', fontFamily: 'var(--font-sans)' }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted-dark)', margin: 0, fontFamily: 'var(--font-sans)' }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE STORY ──────────────────────────────────────────── */}
        <section style={{ background: 'var(--light)', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 600 }} className="story-section">
          <style>{`@media(max-width:768px){ .story-section { grid-template-columns: 1fr !important; } }`}</style>

          <div className="story-panel" style={{ position: 'relative', overflow: 'hidden', minHeight: 400 }}>
            <img className="story-img"
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85&auto=format&fit=crop"
              alt="The experience"
            />
            <div style={{ position: 'absolute', bottom: 40, left: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ display: 'block', width: 1, height: 48, background: accent }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(3rem,7vw,6rem) clamp(2.5rem,6vw,5rem)' }}>
            <span className="section-label" style={{ color: accent }}>The experience</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 300, color: '#0c0c0c', lineHeight: 1.1, margin: '0 0 clamp(1.5rem,3vw,2.5rem)' }}>
              Every detail,<br />
              <em style={{ color: 'rgba(0,0,0,0.45)' }}>considered.</em>
            </h2>
            <p style={{ fontSize: 13, lineHeight: 1.9, color: 'var(--muted-dark)', maxWidth: 380, margin: '0 0 clamp(2rem,4vw,3rem)', fontFamily: 'var(--font-sans)' }}>
              From the thread count of the linen to the temperature of the pool, we obsess over every detail so that you never have to think about anything except enjoying yourself.
            </p>

            {[
              ['Dining',    'West African cuisine with a contemporary kitchen and signature cocktails.'],
              ['Wellness',  'Spa, pool, and restorative treatments to reset between busy days.'],
              ['Concierge', 'Private transfers, curated city experiences, and tailored itineraries.'],
            ].map(([title, sub], i) => (
              <div key={title} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '16px 0', borderTop: i === 0 ? '1px solid rgba(0,0,0,0.08)' : 'none', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9, letterSpacing: '0.2em', color: accent, paddingTop: 2, flexShrink: 0 }}>0{i + 1}</span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#0c0c0c', margin: '0 0 2px', fontFamily: 'var(--font-sans)' }}>{title}</p>
                  <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', margin: 0, fontFamily: 'var(--font-sans)' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURED OFFERS ───────────────────────────────────────────── */}
        <section style={{ background: '#111111', padding: 'clamp(4.5rem,9vw,7.5rem) clamp(1.5rem,6vw,5rem)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <span className="section-label">Featured offers</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 300, color: '#fff', margin: '0 0 2.5rem' }}>
              Stays crafted around you.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
              {offers.map((offer) => (
                <article key={offer.id} style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '1.8rem 1.6rem', display: 'flex', flexDirection: 'column', gap: 8, background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0))' }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-sans)' }}>{offer.tag}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 300, color: '#fff', margin: 0 }}>{offer.name}</h3>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: '4px 0 10px', fontFamily: 'var(--font-sans)' }}>{offer.description}</p>
                  {offer.fromRate && <p style={{ fontSize: 12, color: accent, margin: 0, fontFamily: 'var(--font-sans)' }}>From {fmt(offer.fromRate)} / stay</p>}
                  <button type="button" onClick={() => navigate('/book')} style={{ marginTop: 10, alignSelf: 'flex-start', background: 'transparent', border: 'none', color: '#fff', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                    View offer <span style={{ display: 'inline-block', width: 22, height: 1, background: '#fff' }} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── GUEST REVIEWS ─────────────────────────────────────────────── */}
        <section style={{ background: 'var(--light)', padding: 'clamp(4.5rem,9vw,7.5rem) clamp(1.5rem,6vw,5rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <span className="section-label" style={{ color: accent }}>Guest stories</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 300, color: '#0c0c0c', margin: 0 }}>
                Loved by guests{city ? ` visiting ${city}` : ''}.
              </h2>
              <p style={{ fontSize: 12, color: 'var(--muted-dark)', margin: 0, fontFamily: 'var(--font-sans)' }}>
                &#9733; {guestRating.toFixed(1)} average from {guestCount.toLocaleString()}+ verified stays.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              {testimonials.map((t) => (
                <figure key={t.name} style={{ margin: 0, padding: '1.8rem 1.6rem', border: '1px solid rgba(0,0,0,0.06)', background: '#fff' }}>
                  <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--muted-dark)', margin: '0 0 12px', fontFamily: 'var(--font-sans)' }}>{t.quote}</p>
                  <figcaption style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.6)', fontFamily: 'var(--font-sans)' }}>{t.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── EVENTS & VENUES ──────────────────────────────────────────── */}
        <section style={{ background: 'var(--light)', padding: 'clamp(5rem,9vw,8rem) clamp(1.5rem,6vw,5rem)' }}>
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(3rem,7vw,7rem)', alignItems: 'end', marginBottom: 'clamp(3rem,6vw,5rem)' }}>
              <div>
                <span className="section-label" style={{ color: accent }}>Events & Venues</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 300, color: '#0c0c0c', margin: 0, lineHeight: 1.1 }}>
                  Host your next<br /><em style={{ color: 'rgba(0,0,0,0.35)' }}>unforgettable event.</em>
                </h2>
              </div>
              <div>
                <p style={{ fontSize: 13, lineHeight: 1.9, color: 'var(--muted-dark)', margin: '0 0 24px', fontFamily: 'var(--font-sans)' }}>
                  From boardroom meetings to grand wedding celebrations — our versatile venues and dedicated events team bring every vision to life.
                </p>
                <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: 16, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#0c0c0c', transition: 'gap 0.3s', fontFamily: 'var(--font-sans)' }}
                  onMouseEnter={e => e.currentTarget.style.gap = '24px'}
                  onMouseLeave={e => e.currentTarget.style.gap = '16px'}
                >
                  Explore venues &amp; enquire
                  <span style={{ display: 'inline-block', width: 28, height: 1, background: '#0c0c0c' }} />
                </Link>
              </div>
            </div>

            {/* Venue cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 3 }}>
              {[
                { name: 'Grand Ballroom', tag: 'Weddings & Galas', cap: 'Up to 500 guests', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=80&auto=format&fit=crop' },
                { name: 'Conference Hall', tag: 'Corporate Events', cap: 'Up to 200 guests', img: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=900&q=80&auto=format&fit=crop' },
                { name: 'Executive Boardroom', tag: 'Meetings', cap: 'Up to 30 guests', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&auto=format&fit=crop' },
                { name: 'Garden Terrace', tag: 'Outdoor Events', cap: 'Up to 150 guests', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80&auto=format&fit=crop' },
              ].map(v => (
                <div key={v.name} style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer' }}
                  onClick={() => navigate('/events')}
                  onMouseEnter={e => e.currentTarget.querySelector('img').style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.querySelector('img').style.transform = 'scale(1)'}
                >
                  <img src={v.img} alt={v.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1)', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1.25rem' }}>
                    <span style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, display: 'block', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>{v.tag} · {v.cap}</span>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: '#fff', margin: 0 }}>{v.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA strip */}
            <div style={{ marginTop: 32, padding: '1.5rem 2rem', background: '#0c0c0c', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0, fontFamily: 'var(--font-sans)' }}>
                Ready to start planning? Our events team responds within 24 hours.
              </p>
              <Link to="/events#enquiry-form" style={{ display: 'inline-flex', alignItems: 'center', background: accent, color: '#0c0c0c', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', padding: '12px 28px', transition: 'opacity 0.2s', fontFamily: 'var(--font-sans)', textDecoration: 'none', flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Send an enquiry
              </Link>
            </div>
          </div>
        </section>

        {/* ── RESERVE CTA ──────────────────────────────────────────────── */}
        <section style={{ background: accent, padding: 'clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem)' }}>
          <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '3rem' }}>
            <div>
              <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', margin: '0 0 16px', fontFamily: 'var(--font-sans)' }}>
                Direct booking \u00b7 Best rate guaranteed
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 300, color: '#0c0c0c', lineHeight: 0.95, margin: 0 }}>
                Begin your<br /><em>stay.</em>
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end' }}>
              <Link to="/book" style={{ display: 'inline-flex', alignItems: 'center', background: '#0c0c0c', color: '#fff', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', padding: '16px 44px', transition: 'opacity 0.2s', fontFamily: 'var(--font-sans)' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Reserve now
              </Link>
              {hotelConfig.contact?.phone && (
                <a href={`tel:${hotelConfig.contact.phone}`} style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(0,0,0,0.55)', transition: 'color 0.2s', fontFamily: 'var(--font-sans)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#0c0c0c')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(0,0,0,0.55)')}
                >
                  Need help with a group or long stay? Call {hotelConfig.contact.phone}
                </a>
              )}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}