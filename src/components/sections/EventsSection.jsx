// src/components/sections/EventsSection.jsx
// Events & Venues — 2-col intro, 4-card venue grid, enquiry banner.
// Copy editable via hotelConfig.content.events.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';

const DEFAULT_VENUES = [
  { name: 'Grand Ballroom',      tag: 'Weddings & Galas',     cap: 'Up to 500 guests', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=80&auto=format&fit=crop' },
  { name: 'Conference Hall',     tag: 'Corporate Events',     cap: 'Up to 200 guests', img: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=900&q=80&auto=format&fit=crop' },
  { name: 'Executive Boardroom', tag: 'Meetings',             cap: 'Up to 30 guests',  img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&auto=format&fit=crop' },
  { name: 'Garden Terrace',      tag: 'Outdoor Celebrations', cap: 'Up to 150 guests', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80&auto=format&fit=crop' },
];

function VenueCard({ name, tag, cap, img, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4', cursor: 'pointer' }}>
      <img src={img} alt={name} loading="lazy" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        transform: hov ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.9s cubic-bezier(.16,1,.3,1)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1.25rem' }}>
        <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 5px', fontFamily: 'var(--font-body)' }}>{tag} · {cap}</p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,1.6vw,1.3rem)', fontWeight: 300, color: '#fff', margin: 0, lineHeight: 1.2 }}>{name}</h3>
      </div>
    </div>
  );
}

export default function EventsSection() {
  const hotelConfig = useHotelConfig();
  const navigate    = useNavigate();
  const content = hotelConfig.content?.events || {};

  const eyebrow     = content.eyebrow     || 'Events & Venues';
  const headline    = content.headline    || 'Host your next';
  const headlineSub = content.headlineSub || 'unforgettable event.';
  const body        = content.body        || 'From intimate boardroom meetings to grand ballroom weddings — our versatile venues and dedicated events team bring every vision to life with precision and warmth.';
  const ctaLabel    = content.ctaLabel    || 'Explore Venues & Enquire';
  const bannerText  = content.bannerText  || 'Our events team responds within 24 hours with availability and a tailored proposal.';
  const bannerCta   = content.bannerCta   || 'Send an Enquiry';

  const venues = content.venues || DEFAULT_VENUES;

  return (
    <section id="events" data-section="events" style={{ background: 'var(--bg-page)', padding: 'clamp(5rem,9vw,8rem) clamp(2rem,8vw,6rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="intro-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem,7vw,7rem)', alignItems: 'end', marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, margin: '0 0 16px', color: 'var(--accent)' }}>{eyebrow}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.9rem,3.5vw,3rem)', lineHeight: 1.1, color: 'var(--text-base)', margin: 0 }}>
              {headline}<br /><em style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{headlineSub}</em>
            </h2>
          </div>
          <div>
            <p style={{ fontSize: 13, lineHeight: 1.9, color: 'var(--text-sub)', margin: '0 0 24px', fontFamily: 'var(--font-body)' }}>{body}</p>
            <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 32px', borderRadius: 0, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, textDecoration: 'none', background: 'transparent', color: 'var(--text-base)', border: '1px solid var(--border-base)', transition: 'opacity 0.2s' }}>{ctaLabel}</Link>
          </div>
        </div>

        <div className="venues-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 3, marginBottom: 24 }}>
          {venues.map((v, i) => <VenueCard key={v.name || i} {...v} onClick={() => navigate('/events')} />)}
        </div>

        <div style={{ background: 'var(--brand)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0, fontFamily: 'var(--font-body)' }}>{bannerText}</p>
          <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 28px', borderRadius: 0, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, textDecoration: 'none', background: 'var(--accent)', color: 'var(--text-on-accent, #fff)', border: 'none', flexShrink: 0, transition: 'opacity 0.2s' }}>{bannerCta}</Link>
        </div>
      </div>
    </section>
  );
}