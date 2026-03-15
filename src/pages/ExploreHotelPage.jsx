// src/pages/ExploreHotelPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';

const FALLBACK_HERO = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1800&q=85&auto=format&fit=crop';

export default function ExploreHotelPage() {
  const hotelConfig = useHotelConfig();
  const accent = hotelConfig.brand?.secondary || hotelConfig.brand?.primary || 'var(--accent)';
  const explore = hotelConfig.explore || {};

  useEffect(() => {
    document.title = `Explore | ${hotelConfig.shortName || hotelConfig.name}`;
  }, [hotelConfig]);

  const spaces = explore.spaces || [
    {
      id: 'lobby',
      name: 'The Lobby',
      tag: 'Arrival Experience',
      description: 'Our grand lobby sets the tone from the moment you walk in — soaring ceilings, curated art, and a concierge desk ready to welcome you by name.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85&auto=format&fit=crop',
      wide: true,
    },
    {
      id: 'pool',
      name: 'The Pool',
      tag: 'Recreation',
      description: 'Resort-style outdoor pool surrounded by sun loungers, cabanas, and pool-side service. Open daily from 6 am to 10 pm.',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'restaurant',
      name: 'The Restaurant',
      tag: 'Dining',
      description: 'A light-filled all-day dining room serving West African cuisine alongside international favourites.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'rooms',
      name: 'Guest Rooms & Suites',
      tag: 'Accommodation',
      description: 'Thoughtfully furnished rooms with premium bedding, blackout curtains, and city or pool views. Every detail considered.',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80&auto=format&fit=crop',
      wide: true,
    },
    {
      id: 'gym',
      name: 'Fitness Centre',
      tag: 'Wellness',
      description: 'Fully equipped gym with cardio machines, free weights, and strength equipment. Open 24 hours for hotel guests.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'spa',
      name: 'The Spa',
      tag: 'Wellness',
      description: 'Two private treatment rooms offering massages, facials, and signature rituals. Advance booking recommended.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'bar',
      name: 'Lobby Bar & Lounge',
      tag: 'Dining',
      description: 'Signature cocktails, curated wines, and light bites in a relaxed lounge setting. Perfect for unwinding or meeting.',
      image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'meeting',
      name: 'Meeting & Event Spaces',
      tag: 'Business',
      description: 'Boardroom and flexible conference spaces with full AV, natural light, and dedicated catering support.',
      image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=900&q=80&auto=format&fit=crop',
      wide: true,
    },
    {
      id: 'parking',
      name: 'Parking & Arrival',
      tag: 'Facilities',
      description: 'Secure, on-site parking available for all hotel guests. Valet service available on request.',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'garden',
      name: 'Garden Terrace',
      tag: 'Outdoor',
      description: 'A lush outdoor terrace ideal for evening drinks, private events, or simply taking in the surroundings.',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80&auto=format&fit=crop',
    },
  ];

  const links = [
    { label: 'View Rooms & Rates', to: '/rooms' },
    { label: 'Dining',   to: '/dining' },
    { label: 'Wellness', to: '/wellness' },
    { label: 'Events',   to: '/events' },
    { label: 'Book Now', to: '/book', accent: true },
  ];

  return (
    <div style={{ background: 'var(--bg-page)', paddingTop: 'calc(var(--nav-h, 72px) + 38px)' }}>

      {/* Hero */}
      <section style={{ position: 'relative', height: 520, overflow: 'hidden' }}>
        <img src={explore.heroImage || FALLBACK_HERO} alt="Explore the hotel" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,6vw,5rem)' }}>
          <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 12px', fontFamily: 'var(--font-body)' }}>Explore the Hotel</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 300, color: '#fff', margin: '0 0 12px', lineHeight: 1 }}>
            {explore.headline || 'Every Corner, Considered.'}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: 0, fontFamily: 'var(--font-body)', maxWidth: 540 }}>
            {explore.subheadline || 'Take a look around — from our lobby to the pool, the spa to the rooftop. Everything you need is here.'}
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <nav style={{ background: 'var(--bg-subtle, #f7f5f0)', borderBottom: '1px solid var(--border-base, #e8e4dc)', padding: '0 clamp(1.5rem,6vw,5rem)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 0, maxWidth: 1200, margin: '0 auto' }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '16px 20px', whiteSpace: 'nowrap',
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              fontFamily: 'var(--font-body)', fontWeight: 500, textDecoration: 'none',
              color: l.accent ? '#fff' : 'var(--text-base)',
              background: l.accent ? accent : 'transparent',
              transition: 'background 0.2s, color 0.2s',
            }}>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Spaces — masonry-style grid */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 14px', fontFamily: 'var(--font-body)' }}>Our Spaces</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,3.5vw,3rem)', fontWeight: 300, color: 'var(--text-base)', margin: '0 0 clamp(2.5rem,5vw,4rem)', lineHeight: 1.1 }}>
            Everything in one place.
          </h2>

          {/* Lay out rows: wide cards span 2 cols */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, gridAutoRows: 'auto' }}>
            {spaces.map(space => (
              <SpaceCard key={space.id} space={space} accent={accent} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA bar */}
      <section style={{ background: accent, padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <p style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', margin: '0 0 12px', fontFamily: 'var(--font-body)' }}>Ready to experience it?</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, color: '#fff', margin: 0, lineHeight: 1 }}>Begin your stay.</h2>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/book" style={{
              display: 'inline-flex', alignItems: 'center',
              background: '#fff', color: '#111',
              fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
              padding: '14px 32px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500,
            }}>Reserve a Room</Link>
            <Link to="/contact" style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.5)',
              fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
              padding: '14px 32px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500,
            }}>Contact Us</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

function SpaceCard({ space, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        gridColumn: space.wide ? 'span 2' : 'span 1',
        position: 'relative', overflow: 'hidden',
        aspectRatio: space.wide ? '16/7' : '4/3',
        cursor: 'default',
      }}
    >
      <img src={space.image} alt={space.name} loading="lazy" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
        transform: hov ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 1s cubic-bezier(0.16,1,0.3,1)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: hov ? 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)' : 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)', transition: 'background 0.4s' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.75rem 1.5rem', transform: hov ? 'translateY(0)' : 'translateY(4px)', transition: 'transform 0.4s' }}>
        <p style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: accent, margin: '0 0 6px', fontFamily: 'var(--font-body)' }}>{space.tag}</p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem,2vw,1.5rem)', fontWeight: 300, color: '#fff', margin: 0, lineHeight: 1.2 }}>{space.name}</h3>
        <p style={{
          fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '8px 0 0', lineHeight: 1.6, fontFamily: 'var(--font-body)',
          maxHeight: hov ? '80px' : '0', overflow: 'hidden',
          transition: 'max-height 0.4s ease, opacity 0.3s',
          opacity: hov ? 1 : 0,
        }}>
          {space.description}
        </p>
      </div>
    </div>
  );
}