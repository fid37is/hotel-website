// src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import hotelConfig from '../config/hotel.config.js';
import { roomsApi } from '../services/api.js';
import AvailabilitySearch from '../components/booking/AvailabilitySearch.jsx';

const HERO_IMG  = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800&q=85&auto=format&fit=crop';
const CTA_IMG   = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=85&auto=format&fit=crop';
const SPLIT_IMG = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=85&auto=format&fit=crop';
const ROOM_IMGS = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&q=80&auto=format&fit=crop',
];

const EXPERIENCES = [
  { num: '01', title: 'Culinary',    desc: 'Contemporary West African cuisine reimagined for the modern palate. Breakfast through late-night dining.' },
  { num: '02', title: 'Wellness',    desc: 'A sanctuary of calm. Deep-tissue massage, hydrotherapy, and restorative treatments.' },
  { num: '03', title: 'Gatherings', desc: 'Intimate boardrooms to grand ballrooms — every event orchestrated to perfection.' },
  { num: '04', title: 'Concierge',  desc: 'Your personal Asaba guide. Transfers, reservations, private tours arranged seamlessly.' },
];

const STATS = [
  { value: '147', unit: 'Rooms & Suites' },
  { value: '24',  unit: 'Hour Service' },
  { value: '3',   unit: 'Dining Venues' },
  { value: '12',  unit: 'Years of Excellence' },
];

const fmt = (n) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n);

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [heroLoaded,    setHeroLoaded]    = useState(false);

  useEffect(() => {
    document.title = hotelConfig.seo.defaultTitle;
    roomsApi.getTypes()
      .then(res => setFeaturedRooms((res.data || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayRooms = featuredRooms.length > 0 ? featuredRooms : [
    { id: 0, name: 'Deluxe Room',        base_rate: 45000,  category: 'Standard', room_type: 'Deluxe',      description: 'Sun-drenched interiors with bespoke furnishings and city skyline views.' },
    { id: 1, name: 'Executive Suite',    base_rate: 85000,  category: 'Premium',  room_type: 'Executive',   description: 'Expansive living quarters with a private terrace and dedicated butler service.' },
    { id: 2, name: 'Presidential Suite', base_rate: 150000, category: 'Luxury',   room_type: 'Presidential',description: 'Two floors of curated luxury — the pinnacle of Asaba hospitality.' },
  ];

  const handleRoomClick = (room) => {
    const typeSlug = encodeURIComponent(room.room_type || room.category || room.name);
    navigate(`/rooms?type=${typeSlug}`);
  };

  return (
    <div style={{ background: '#f5f3ef' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ height: '100svh', minHeight: 600, marginTop: 'calc(var(--nav-h, 72px) * -1)' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${HERO_IMG})`, opacity: heroLoaded ? 1 : 0 }}
        />
        <img src={HERO_IMG} alt="" className="sr-only" onLoad={() => setHeroLoaded(true)} />

        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.08) 70%, transparent 100%)'
        }} />

        {/* Location tag — desktop only */}
        <div
          className="absolute hidden md:flex flex-col items-end gap-1"
          style={{ top: 'calc(var(--nav-h, 72px) + 24px)', right: '2rem' }}
        >
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Delta State</span>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Asaba, Nigeria</span>
        </div>

        {/* Content — pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-5 md:px-12 lg:px-16" style={{ paddingBottom: '2.5rem' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>

            <div className="flex items-center gap-3 mb-4 md:mb-5">
              <div style={{ width: 28, height: 1, background: '#c9a96e', flexShrink: 0 }} />
              <span style={{ color: '#c9a96e', fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 500 }}>
                Est. 2025 · Asaba
              </span>
            </div>

            <h1
              className="font-display text-white"
              style={{
                fontSize: 'clamp(2.8rem, 9vw, 7.5rem)',
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: '-0.01em',
                marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
              }}
            >
              {hotelConfig.tagline.split(' ').map((word, i, arr) => (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    marginLeft: i % 2 === 1 ? '0.1em' : 0,
                    fontStyle: i === arr.length - 1 ? 'italic' : 'normal',
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <div style={{ maxWidth: 780 }}>
              <AvailabilitySearch />
            </div>
          </div>
        </div>

        {/* Scroll cue — desktop */}
        <div
          className="absolute hidden md:flex flex-col items-center gap-2"
          style={{ bottom: 28, right: '2rem' }}
        >
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>Scroll</span>
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.15)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', animation: 'heroScroll 2s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ── Intro + Stats ────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 lg:px-16" style={{ padding: 'clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 4rem)', background: '#f5f3ef' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12 md:mb-20">
            <div className="lg:col-span-7">
              <span style={{ color: '#c9a96e', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 16 }}>
                {hotelConfig.name}
              </span>
              <p
                className="font-display"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.8rem)', fontWeight: 400, lineHeight: 1.18, color: '#1a1a1a' }}
              >
                Where the spirit of Asaba meets<br className="hidden sm:block" />
                {' '}the art of unhurried luxury —<br className="hidden sm:block" />
                {' '}<em>a haven above the city.</em>
              </p>
            </div>

            <div className="lg:col-span-5">
              <p style={{ color: '#6b6b6b', lineHeight: 1.75, fontSize: 14, marginBottom: 24 }}>
                {hotelConfig.description}
              </p>
              <Link
                to="/rooms"
                className="group inline-flex items-center gap-3"
                style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1a1a1a' }}
              >
                <span>Explore Our Rooms</span>
                <span
                  className="transition-all duration-300 group-hover:w-14"
                  style={{ display: 'inline-block', width: 28, height: 1, background: '#1a1a1a' }}
                />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ borderTop: '1px solid #e8e4dc' }}
          >
            {STATS.map(({ value, unit }, i) => (
              <div
                key={unit}
                style={{
                  paddingTop: 24,
                  paddingRight: 24,
                  paddingBottom: 8,
                  borderRight: i < STATS.length - 1 ? '1px solid #e8e4dc' : 'none',
                  borderBottom: i < 2 ? '1px solid #e8e4dc' : 'none',
                }}
                className="md:[border-bottom:none!important]"
              >
                <p className="font-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 300, lineHeight: 1, color: '#1a1a1a', marginBottom: 6 }}>
                  {value}
                </p>
                <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9a96e' }}>{unit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rooms — dark section ─────────────────────────────────────────── */}
      <section style={{ background: '#111', padding: 'clamp(3rem, 7vw, 5rem) clamp(1.25rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <span style={{ color: '#c9a96e', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 12 }}>
                Accommodation
              </span>
              <h2
                className="font-display text-white"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3.2rem)', fontWeight: 400 }}
              >
                Rooms &amp; Suites
              </h2>
            </div>
            <Link
              to="/rooms"
              className="hidden md:inline-flex items-center gap-3 group"
              style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}
            >
              <span className="group-hover:text-[#c9a96e] transition-colors">View All</span>
              <span
                className="transition-all duration-300 group-hover:w-8"
                style={{ display: 'inline-block', width: 14, height: 1, background: 'rgba(255,255,255,0.3)' }}
              />
            </Link>
          </div>

          {/* Room cards — 1 col mobile, 3 col desktop, 2px gap for editorial feel */}
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 2 }}>
            {loading
              ? [0, 1, 2].map(i => (
                <div key={i} style={{ aspectRatio: '3/4', background: '#1a1a1a' }} className="animate-pulse" />
              ))
              : displayRooms.map((room, i) => (
                <RoomCardDark
                  key={room.id}
                  room={room}
                  index={i}
                  img={room.images?.[0] || ROOM_IMGS[i]}
                  fmt={fmt}
                  onClick={() => handleRoomClick(room)}
                />
              ))
            }
          </div>

          {/* Mobile view all link */}
          <div className="flex justify-center mt-6 md:hidden">
            <Link
              to="/rooms"
              style={{
                fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)', display: 'inline-flex', alignItems: 'center', gap: 10,
              }}
            >
              View All Rooms
              <span style={{ display: 'inline-block', width: 20, height: 1, background: 'rgba(255,255,255,0.3)' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Split — photo + experiences ─────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: 560 }}>

        <div className="relative overflow-hidden" style={{ minHeight: 340 }}>
          <img
            src={SPLIT_IMG}
            alt="Hotel experience"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.15)' }} />
          <div
            className="absolute hidden sm:block"
            style={{ bottom: 32, left: 32, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', padding: '18px 22px', maxWidth: 260 }}
          >
            <p className="font-display text-white" style={{ fontSize: 16, lineHeight: 1.35, marginBottom: 6 }}>
              "An oasis of calm above the city"
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.15em' }}>
              — The Independent Travel Review
            </p>
          </div>
        </div>

        <div
          className="flex flex-col justify-center"
          style={{ background: '#f5f3ef', padding: 'clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}
        >
          <span style={{ color: '#c9a96e', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 16 }}>
            The Experience
          </span>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.5rem)', fontWeight: 400, lineHeight: 1.1, color: '#1a1a1a', marginBottom: 32 }}
          >
            Every detail,<br /><em>considered.</em>
          </h2>
          <div>
            {EXPERIENCES.map(({ num, title, desc }) => (
              <ExperienceRow key={num} num={num} title={title} desc={desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: 'clamp(400px, 55vh, 600px)' }}
      >
        <img src={CTA_IMG} alt="Book your stay" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.1) 100%)'
        }} />

        <div
          className="relative w-full"
          style={{ padding: 'clamp(3rem, 6vw, 5rem) clamp(1.25rem, 5vw, 4rem)', maxWidth: 1280, margin: '0 auto' }}
        >
          <span style={{ color: '#c9a96e', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 16 }}>
            Ready to Stay?
          </span>
          <h2
            className="font-display text-white"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 5rem)', fontWeight: 400, lineHeight: 1, maxWidth: '13ch', marginBottom: 14 }}
          >
            Reserve Your Stay Today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.65, maxWidth: 340, marginBottom: 32 }}>
            Best rates guaranteed when you book directly with us.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/book"
              style={{
                display: 'inline-flex', alignItems: 'center',
                background: '#c9a96e', color: '#fff',
                fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
                padding: '15px 32px', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#b8965d'}
              onMouseLeave={e => e.currentTarget.style.background = '#c9a96e'}
            >
              Book Direct
            </Link>
            <a
              href={`tel:${hotelConfig.contact.phone}`}
              style={{
                display: 'inline-flex', alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.35)', color: '#fff',
                fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
                padding: '15px 32px', transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'}
            >
              {hotelConfig.contact.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ── Contact strip ────────────────────────────────────────────────── */}
      <section style={{ background: '#1a1a1a', padding: 'clamp(2.5rem, 5vw, 3.5rem) clamp(1.25rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '2.5rem', marginBottom: '2rem' }}
          >
            {[
              { label: 'Address',              value: hotelConfig.contact.address },
              { label: 'Phone',                value: hotelConfig.contact.phone, href: `tel:${hotelConfig.contact.phone}` },
              { label: 'Email',                value: hotelConfig.contact.email, href: `mailto:${hotelConfig.contact.email}` },
              { label: 'Check-in · Check-out', value: `${hotelConfig.contact.checkIn} · ${hotelConfig.contact.checkOut}` },
            ].map(({ label, value, href }) => (
              <div key={label}>
                <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: 8 }}>{label}</p>
                {href
                  ? <a href={href} style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.6, display: 'block', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                  >{value}</a>
                  : <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.6 }}>{value}</p>
                }
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="font-display" style={{ color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>{hotelConfig.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10, letterSpacing: '0.2em' }}>
              © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes heroScroll {
          0%   { transform: translateY(-100%); opacity: 0; }
          30%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ── Dark room card ──────────────────────────────────────────────────────── */
function RoomCardDark({ room, index, img, fmt, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', cursor: 'pointer', display: 'block' }}
    >
      <img
        src={img}
        alt={room.name}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
      }} />

      {(room.room_type || room.category) && (
        <div style={{ position: 'absolute', top: 20, left: 20 }}>
          <span style={{
            fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#c9a96e', border: '1px solid rgba(201,169,110,0.4)',
            padding: '4px 10px', display: 'inline-block',
          }}>
            {room.room_type || room.category}
          </span>
        </div>
      )}

      <div style={{ position: 'absolute', top: 18, right: 20 }}>
        <span className="font-display" style={{ fontSize: 32, fontWeight: 300, color: 'rgba(255,255,255,0.1)' }}>
          0{index + 1}
        </span>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 22 }}>
        <h3 className="font-display text-white" style={{ fontSize: 20, fontWeight: 300, lineHeight: 1.2, marginBottom: 8 }}>
          {room.name}
        </h3>
        <div style={{
          maxHeight: hovered ? 72 : 0, opacity: hovered ? 1 : 0,
          overflow: 'hidden', transition: 'max-height 0.35s ease, opacity 0.3s ease',
          marginBottom: hovered ? 10 : 0,
        }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.65 }}>{room.description}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          {room.base_rate && (
            <div>
              <span style={{ color: '#c9a96e', fontSize: 16, fontWeight: 300 }}>{fmt(room.base_rate)}</span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginLeft: 4 }}>/night</span>
            </div>
          )}
          <span style={{
            fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase',
            color: hovered ? '#c9a96e' : 'rgba(255,255,255,0.35)',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'color 0.3s',
          }}>
            View
            <span style={{
              display: 'inline-block', height: 1,
              background: hovered ? '#c9a96e' : 'rgba(255,255,255,0.25)',
              width: hovered ? 22 : 12, transition: 'width 0.3s, background 0.3s',
            }} />
          </span>
        </div>
      </div>
    </article>
  );
}

/* ── Experience accordion row ────────────────────────────────────────────── */
function ExperienceRow({ num, title, desc }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #e8e4dc', cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 10, letterSpacing: '0.2em', color: '#c9a96e', flexShrink: 0 }}>{num}</span>
          <span className="font-display" style={{ fontSize: 18, fontWeight: 300, color: open ? '#c9a96e' : '#1a1a1a', transition: 'color 0.2s' }}>
            {title}
          </span>
        </div>
        <span style={{ fontSize: 18, color: 'rgba(26,26,26,0.25)', transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', lineHeight: 1, flexShrink: 0 }}>+</span>
      </div>
      <div style={{
        overflow: 'hidden', maxHeight: open ? 80 : 0, opacity: open ? 1 : 0,
        transition: 'max-height 0.3s ease, opacity 0.25s ease',
        paddingBottom: open ? 14 : 0, paddingLeft: 34,
      }}>
        <p style={{ fontSize: 13, color: '#6b6b6b', lineHeight: 1.7 }}>{desc}</p>
      </div>
    </div>
  );
}