// hotel-website/src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';
import { DEFAULT_LAYOUT } from '../config/theme.js';
import { roomsApi, eventsApi } from '../services/api.js';
import HeroSection from '../components/sections/HeroSection.jsx';
import AmenitiesSection from '../components/sections/AmenitiesSection.jsx';

// ── Fallback images ───────────────────────────────────────────────────────────
const IMG = {
  hero:  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800&q=90&auto=format&fit=crop',
  pool:  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1400&q=85&auto=format&fit=crop',
  rooms: [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80&auto=format&fit=crop',
  ],
  services: [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80&auto=format&fit=crop',
  ],
};

// ── Rectangular button ────────────────────────────────────────────────────────
function Btn({ to, onClick, variant = 'dark', children, style: sx }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '14px 32px', borderRadius: 0,
    fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
    fontFamily: 'var(--font-body)', fontWeight: 500,
    textDecoration: 'none', border: 'none', cursor: 'pointer',
    transition: 'opacity 0.2s', whiteSpace: 'nowrap', ...sx,
  };
  const V = {
    dark:         { background: 'var(--brand)',          color: 'var(--text-on-brand, #fff)' },
    accent:       { background: 'var(--btn-accent-bg)',  color: 'var(--btn-accent-text, #fff)' },
    white:        { background: '#fff',                  color: '#111' },
    outline:      { background: 'transparent', color: 'var(--text-base)', border: '1px solid var(--border-base)' },
    outlineWhite: { background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.55)' },
  };
  const s = { ...base, ...(V[variant] || V.dark) };
  const ov = e => { e.currentTarget.style.opacity = '0.8'; };
  const ol = e => { e.currentTarget.style.opacity = '1'; };
  if (to) return <Link to={to} style={s} onMouseEnter={ov} onMouseLeave={ol}>{children}</Link>;
  return <button type="button" onClick={onClick} style={s} onMouseEnter={ov} onMouseLeave={ol}>{children}</button>;
}

function Eyebrow({ c, light }) {
  return <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, margin: '0 0 16px', color: light ? 'rgba(255,255,255,0.5)' : 'var(--accent)' }}>{c}</p>;
}

function H2({ c, light, sx }) {
  return <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.9rem,3.5vw,3rem)', lineHeight: 1.1, color: light ? '#fff' : 'var(--text-base)', margin: 0, ...sx }}>{c}</h2>;
}

function RoomCard({ room, img, cityLine, fmt, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <article onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}
      style={{ cursor: 'pointer', background: '#fff' }}>
      <div style={{ overflow: 'hidden', aspectRatio: '4/3' }}>
        <img src={img} alt={room.name} loading="lazy" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.7s cubic-bezier(.16,1,.3,1)',
        }} />
      </div>
      <div style={{ padding: '18px 0 22px' }}>
        {cityLine && <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 6px', fontFamily: 'var(--font-body)' }}>{cityLine}</p>}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem,1.8vw,1.35rem)', fontWeight: 300, color: 'var(--text-base)', margin: '0 0 8px', lineHeight: 1.2 }}>{room.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {room.base_rate ? <span style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-body)' }}>From {fmt(room.base_rate)} / night</span> : <span />}
          <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>View →</span>
        </div>
      </div>
    </article>
  );
}

function ServiceTile({ img, eyebrow, title, to }) {
  const [hov, setHov] = useState(false);
  return (
    <Link to={to || '/rooms'} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'block', position: 'relative', overflow: 'hidden', textDecoration: 'none', aspectRatio: '2/3' }}>
      <img src={img} alt={title} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
        transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.8s cubic-bezier(.16,1,.3,1)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.05) 55%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 22px' }}>
        <p style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', fontFamily: 'var(--font-body)' }}>{eyebrow}</p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2.2vw,1.7rem)', fontWeight: 300, color: '#fff', margin: '0 0 10px', lineHeight: 1.15 }}>{title}</h3>
        <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: hov ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'color 0.2s', fontFamily: 'var(--font-body)' }}>Explore →</span>
      </div>
    </Link>
  );
}

function VenueCard({ name, tag, cap, img, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4', cursor: 'pointer' }}>
      <img src={img} alt={name} loading="lazy" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        transform: hov ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.9s cubic-bezier(.16,1,.3,1)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1.25rem' }}>
        <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 5px', fontFamily: 'var(--font-body)' }}>{tag} · {cap}</p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,1.6vw,1.3rem)', fontWeight: 300, color: '#fff', margin: 0, lineHeight: 1.2 }}>{name}</h3>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const hotelConfig = useHotelConfig();
  const navigate    = useNavigate();
  const [rooms,      setRooms]      = useState([]);
  const [roomsReady, setRoomsReady] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [checkin,    setCheckin]    = useState('');
  const [checkout,   setCheckout]   = useState('');
  const [guests,     setGuests]     = useState('2');

  const layout        = hotelConfig.layout || DEFAULT_LAYOUT;
  const heroStyle     = layout.hero_style  || 'fullscreen';
  const sectionOrder  = (() => {
    const s = layout.section_order || DEFAULT_LAYOUT.section_order;
    if (s.includes('events')) return s;
    const ctaIdx = s.indexOf('cta');
    return ctaIdx >= 0 ? [...s.slice(0, ctaIdx), 'events', ...s.slice(ctaIdx)] : [...s, 'events'];
  })();
  const sectionHidden = layout.section_hidden || [];
  const visible = id => !sectionHidden.includes(id);

  const name        = hotelConfig.name        || 'The Grand';
  const tagline     = hotelConfig.tagline     || 'Some places you visit. Others, you feel.';
  const description = hotelConfig.description || 'A modern luxury hotel offering world-class hospitality, refined interiors, and exceptional service.';
  const city        = hotelConfig.contact?.city    || '';
  const country     = hotelConfig.contact?.country || '';
  const phone       = hotelConfig.contact?.phone   || '';
  const cityLine    = [city, country].filter(Boolean).join(', ');
  const currency    = hotelConfig.payment?.currency || 'NGN';
  const fmt = n => new Intl.NumberFormat('en', { style: 'currency', currency, minimumFractionDigits: 0 }).format((n || 0) / 100);

  const guestRating = hotelConfig.reviews?.average || 4.8;
  const guestCount  = hotelConfig.reviews?.count   || 1200;
  const offers = hotelConfig.offers || [
    { id: 1, tag: 'Leisure',   name: 'Weekend Escape',   desc: 'Arrive Friday, depart Monday — late checkout and breakfast included.',   rate: 8500000 },
    { id: 2, tag: 'Corporate', name: 'Business Stay',    desc: 'Flexible check-in, high-speed Wi-Fi, and daily laundry included.',        rate: 9000000 },
    { id: 3, tag: 'Couples',   name: 'Romantic Getaway', desc: "Champagne on arrival, couples spa treatment, and dinner for two.",       rate: 12000000 },
  ];
  const testimonials = hotelConfig.reviews?.testimonials || [
    { name: 'Chinedu A.',   role: 'Business Traveller', quote: 'Best decision for my trip — quiet rooms, flawless Wi-Fi, and a team that remembered my name.' },
    { name: 'Amara & Dele', role: 'Couple',             quote: 'Felt like a private resort in the middle of the city. We barely wanted to leave.' },
  ];

  useEffect(() => {
    document.title = hotelConfig.name || 'Welcome';
    roomsApi.getTypes().then(r => setRooms((r.data || []).slice(0, 6))).catch(() => {}).finally(() => setRoomsReady(true));
  }, []);

  const goToBook = () => {
    const p = new URLSearchParams();
    if (checkin)  p.set('checkIn',  checkin);
    if (checkout) p.set('checkOut', checkout);
    navigate('/book' + (p.toString() ? '?' + p.toString() : ''));
  };

  // ── HERO ──────────────────────────────────────────────────────────────
  const renderHero = () => (
    // Wrap in a keyed div so React can track both children in the section map
    <div key="hero">
      <HeroSection
        checkin={checkin}   setCheckin={setCheckin}
        checkout={checkout} setCheckout={setCheckout}
        guests={guests}     setGuests={setGuests}
        onSearch={goToBook}
      />
      <AmenitiesSection />
    </div>
  );

  const renderBookingBar = () => null;

  // ── INTRO ─────────────────────────────────────────────────────────────
  const renderIntro = () => (
    <section key="intro" id="explore" style={{ background: 'var(--bg-page)', padding: 'clamp(5rem,9vw,8rem) clamp(2rem,8vw,6rem)' }}>
      <div className="intro-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem,8vw,8rem)', alignItems: 'center' }}>
        <div>
          {cityLine && <Eyebrow c={cityLine} />}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem,4vw,3.8rem)', fontWeight: 300, lineHeight: 1.08, color: 'var(--text-base)', margin: 0 }}>{tagline}</h2>
        </div>
        <div>
          <p style={{ ...BODY, marginBottom: 32 }}>{description}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Btn to="/rooms" variant="dark">View Rooms</Btn>
            <Btn onClick={goToBook} variant="outline">Book Now</Btn>
          </div>
        </div>
      </div>
    </section>
  );

  // ── ROOMS ─────────────────────────────────────────────────────────────
  const renderRooms = () => {
    const cards = !roomsReady
      ? [0,1,2,3,4,5].map(i => (
          <div key={i} style={{ background: '#f0ede8', animation: 'pulse 1.5s infinite' }}>
            <div style={{ aspectRatio: '4/3', background: '#e0ddd8' }} />
            <div style={{ padding: '18px 0' }}>
              <div style={{ height: 8, width: '55%', background: '#ddd', marginBottom: 8 }} />
              <div style={{ height: 13, width: '75%', background: '#e8e5e0' }} />
            </div>
          </div>
        ))
      : rooms.map((room, i) => {
          const img = (room.media || []).find(x => x.type === 'image')?.url || IMG.rooms[i % IMG.rooms.length];
          return <RoomCard key={room.id} room={room} img={img} cityLine={cityLine} fmt={fmt} onClick={() => navigate(`/rooms/${room.id}`)} />;
        });
    return (
      <section key="rooms" style={{ background: 'var(--bg-subtle, #f7f5f0)', padding: 'clamp(4rem,8vw,7rem) clamp(2rem,8vw,6rem)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="rooms-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(2rem,4vw,3.5rem)', gap: 16, flexWrap: 'wrap' }}>
            <div><Eyebrow c="Accommodation" /><H2 c="Rooms & Suites" /></div>
            <Btn to="/rooms" variant="outline">View All Rooms</Btn>
          </div>
          <div className="rooms-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {cards}
          </div>
        </div>
      </section>
    );
  };

  // ── WHY STAY ──────────────────────────────────────────────────────────
  const renderWhyStay = () => (
    <section key="why_stay" style={{ background: 'var(--bg-page)', padding: 'clamp(4rem,8vw,7rem) clamp(2rem,8vw,6rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(2rem,4vw,3rem)', flexWrap: 'wrap', gap: 16 }}>
          <div><Eyebrow c="The Experience" /><H2 c="Life at the Hotel" /></div>
        </div>
        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4 }}>
          <ServiceTile img={IMG.services[0]} eyebrow="Wellness" title="Spa & Rejuvenation" to="/wellness" />
          <ServiceTile img={IMG.services[1]} eyebrow="Dining" title="Culinary Experiences" to="/dining" />
          <ServiceTile img={IMG.services[2]} eyebrow="Recreation" title="Pool & Leisure" to="/explore" />
        </div>
        <div className="pillars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2.5rem', marginTop: 48, borderTop: '1px solid var(--border-soft)', paddingTop: 40 }}>
          {(hotelConfig.pillars || [
            { title: 'Warm Hospitality', body: 'Our team anticipates every need — ensuring your stay is effortless from arrival to departure.' },
            { title: 'Prime Location',   body: 'Situated at the heart of the city, close to business hubs, dining, and cultural landmarks.' },
            { title: 'Curated for You',  body: 'From private events to city excursions, every moment is thoughtfully tailored to you.' },
          ]).map((p, i) => (
            <div key={p.title || i}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-base)', margin: '0 0 10px', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>{p.title}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.85, fontFamily: 'var(--font-body)' }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ── STORY ─────────────────────────────────────────────────────────────
  const renderStory = () => (
    <section key="story" className="story-grid" style={{ display: 'grid', gridTemplateColumns: '55% 45%', background: 'var(--bg-page)', minHeight: 600 }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(4rem,8vw,7rem) clamp(3rem,5vw,5rem)' }}>
        <Eyebrow c="Our Story" />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, lineHeight: 1.1, color: 'var(--text-base)', margin: '0 0 1.5rem' }}>
          Designed for those<br /><em style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>who expect more</em>
        </h2>
        <p style={{ ...BODY, maxWidth: 460, marginBottom: 36 }}>{description}</p>
        <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 28 }}>
          {[
            { label: 'Dining',    sub: 'West African cuisine, signature cocktails, and rooftop evenings.', to: '/dining' },
            { label: 'Wellness',  sub: 'Spa treatments, pool, and rituals designed to restore.', to: '/wellness' },
            { label: 'Concierge', sub: 'Private transfers, city tours, tailored itineraries.', to: '/concierge' },
          ].map(({ label, sub, to }) => (
            <Link key={label} to={to || '/explore'} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-soft)', textDecoration: 'none' }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 3px', fontFamily: 'var(--font-body)' }}>{label}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, fontFamily: 'var(--font-body)' }}>{sub}</p>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: 16, flexShrink: 0, marginLeft: 20 }}>→</span>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 36 }}><Btn to="/explore" variant="dark">Explore the Hotel</Btn></div>
      </div>
      <div className="story-img" style={{ position: 'relative', overflow: 'hidden', minHeight: 560 }}>
        <img src={IMG.pool} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.4s cubic-bezier(.16,1,.3,1)' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'} />
      </div>
    </section>
  );

  // ── OFFERS ────────────────────────────────────────────────────────────
  const renderOffers = () => (
    <section key="offers" style={{ background: 'var(--bg-subtle, #f7f5f0)', padding: 'clamp(5rem,9vw,8rem) clamp(2rem,8vw,6rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(2.5rem,4vw,4rem)', gap: 16, flexWrap: 'wrap' }}>
          <div><Eyebrow c="Special Offers" /><H2 c="Packages & Rates" /></div>
          <Btn to="/offers" variant="outline">All Offers</Btn>
        </div>
        <div className="offers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {offers.map(offer => (
            <article key={offer.id} style={{ background: '#fff', padding: '2rem 2rem 1.75rem', borderTop: '3px solid var(--accent)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--font-body)' }}>{offer.tag}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2vw,1.6rem)', fontWeight: 300, color: 'var(--text-base)', margin: 0, lineHeight: 1.2 }}>{offer.name}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-sub)', margin: 0, lineHeight: 1.8, fontFamily: 'var(--font-body)', flexGrow: 1 }}>{offer.desc || offer.description}</p>
              {offer.rate && <p style={{ fontSize: 12, color: 'var(--accent)', margin: 0, fontFamily: 'var(--font-body)' }}>From {fmt(offer.rate)} / stay</p>}
              <div style={{ marginTop: 8 }}><Btn onClick={() => navigate('/book')} variant="dark" style={{ fontSize: 9, padding: '12px 24px' }}>Book This Offer</Btn></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  // ── EVENTS & VENUES ───────────────────────────────────────────────────
  const renderEvents = () => (
    <section key="events" style={{ background: 'var(--bg-page)', padding: 'clamp(5rem,9vw,8rem) clamp(2rem,8vw,6rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="intro-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem,7vw,7rem)', alignItems: 'end', marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
          <div>
            <Eyebrow c="Events & Venues" />
            <H2 c={<>Host your next<br /><em style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>unforgettable event.</em></>} />
          </div>
          <div>
            <p style={{ ...BODY, marginBottom: 24 }}>
              From intimate boardroom meetings to grand ballroom weddings — our versatile venues and
              dedicated events team bring every vision to life with precision and warmth.
            </p>
            <Btn to="/events" variant="outline">Explore Venues &amp; Enquire</Btn>
          </div>
        </div>

        <div className="venues-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 3, marginBottom: 24 }}>
          {[
            { name: 'Grand Ballroom',      tag: 'Weddings & Galas',     cap: 'Up to 500 guests', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=80&auto=format&fit=crop' },
            { name: 'Conference Hall',     tag: 'Corporate Events',     cap: 'Up to 200 guests', img: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=900&q=80&auto=format&fit=crop' },
            { name: 'Executive Boardroom', tag: 'Meetings',             cap: 'Up to 30 guests',  img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&auto=format&fit=crop' },
            { name: 'Garden Terrace',      tag: 'Outdoor Celebrations', cap: 'Up to 150 guests', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80&auto=format&fit=crop' },
          ].map(v => <VenueCard key={v.name} {...v} onClick={() => navigate('/events')} />)}
        </div>

        <div style={{ background: 'var(--brand)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0, fontFamily: 'var(--font-body)' }}>
            Our events team responds within 24 hours with availability and a tailored proposal.
          </p>
          <Btn to="/events" variant="accent" style={{ fontSize: 9, padding: '12px 28px', flexShrink: 0 }}>
            Send an Enquiry
          </Btn>
        </div>
      </div>
    </section>
  );

  // ── REVIEWS ───────────────────────────────────────────────────────────
  const renderReviews = () => (
    <section key="reviews" style={{ background: 'var(--bg-subtle, #f7f5f0)', padding: 'clamp(5rem,9vw,8rem) clamp(2rem,8vw,6rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(2.5rem,4vw,4rem)', gap: 16, flexWrap: 'wrap' }}>
          <div><Eyebrow c="Guest Stories" /><H2 c="What Our Guests Say" /></div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>★ {guestRating.toFixed(1)} · {guestCount.toLocaleString()}+ stays</span>
        </div>
        <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 24 }}>
          {testimonials.map(t => (
            <figure key={t.name} style={{ margin: 0, padding: '2.5rem', background: 'var(--bg-page)', borderLeft: '3px solid var(--accent)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,1.5vw,1.2rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.8, color: 'var(--text-sub)', margin: '0 0 24px' }}>"{t.quote}"</p>
              <figcaption>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-base)', margin: '0 0 2px', fontFamily: 'var(--font-body)' }}>{t.name}</p>
                {t.role && <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0, fontFamily: 'var(--font-body)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.role}</p>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );

  // ── CTA ───────────────────────────────────────────────────────────────
  const renderCta = () => (
    <section key="cta" style={{ background: 'var(--btn-accent-bg)', padding: 'clamp(5rem,10vw,9rem) clamp(2rem,8vw,6rem)' }}>
      <div className="cta-inner" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3rem', flexWrap: 'wrap' }}>
        <div>
          <Eyebrow c="Direct Booking · Best Rate Guaranteed" light />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5.5vw,5rem)', fontWeight: 300, color: '#fff', lineHeight: 1.0, margin: 0 }}>
            Begin your<br /><em style={{ fontStyle: 'italic', opacity: 0.65 }}>stay.</em>
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
          <Btn onClick={goToBook} variant="white">Reserve a Room</Btn>
          {phone && (
            <a href={"tel:" + phone} style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.9)'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.45)'}>{phone}</a>
          )}
        </div>
      </div>
    </section>
  );

  const SECTIONS = { hero: renderHero, booking_bar: renderBookingBar, rooms: renderRooms, why_stay: renderWhyStay, story: renderStory, offers: renderOffers, events: renderEvents, reviews: renderReviews, cta: renderCta };

  return (
    <>
      <style>{`
        @keyframes heroKen { from{transform:scale(1.04)} to{transform:scale(1)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:0.45} 50%{opacity:0.7} }
        *::-webkit-scrollbar { display:none }

        @media(max-width:900px){
          .intro-grid    { grid-template-columns:1fr !important; gap:2.5rem !important; }
          .rooms-grid    { grid-template-columns:repeat(2,1fr) !important; }
          .services-grid { grid-template-columns:repeat(2,1fr) !important; }
          .offers-grid   { grid-template-columns:repeat(2,1fr) !important; }
          .pillars-grid  { grid-template-columns:1fr !important; gap:2rem !important; }
          .venues-grid   { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:768px){
          .hero-split    { grid-template-columns:1fr !important; }
          .story-grid    { grid-template-columns:1fr !important; }
          .story-img     { min-height:60vw !important; order:-1; }
          .rooms-grid    { grid-template-columns:1fr !important; }
          .services-grid { grid-template-columns:1fr !important; }
          .offers-grid   { grid-template-columns:1fr !important; }
          .reviews-grid  { grid-template-columns:1fr !important; }
          .cta-inner     { flex-direction:column !important; }
          .rooms-header  { flex-direction:column !important; align-items:flex-start !important; }
          .venues-grid   { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:480px){
          .venues-grid   { grid-template-columns:1fr !important; }
        }
      `}</style>
      <div>
        {sectionOrder.filter(id => id === 'hero' || visible(id)).map(id => SECTIONS[id]?.())}
      </div>
    </>
  );
}

const BODY = { fontSize: 13, lineHeight: 1.9, color: 'var(--text-sub)', margin: 0, fontFamily: 'var(--font-body)' };