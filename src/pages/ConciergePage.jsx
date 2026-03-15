    // src/pages/ConciergePage.jsx
import { useEffect } from 'react';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';

const FALLBACK_HERO = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=85&auto=format&fit=crop';

export default function ConciergePage() {
  const hotelConfig = useHotelConfig();
  const accent = hotelConfig.brand?.secondary || hotelConfig.brand?.primary || 'var(--accent)';
  const concierge = hotelConfig.concierge || {};

  const hero        = concierge.heroImage   || FALLBACK_HERO;
  const headline    = concierge.headline    || 'Your Personal Concierge';
  const subheadline = concierge.subheadline || 'Whatever you need, wherever you want to go — we make it happen.';
  const description = concierge.description || 'Our concierge team is available around the clock to arrange everything from airport pickups and restaurant reservations to private city tours and last-minute surprises. Think of us as your local expert, travel agent, and personal assistant — all in one.';
  const phone       = concierge.phone || hotelConfig.contact?.phone || '';
  const email       = concierge.email || hotelConfig.contact?.email || '';
  const whatsapp    = concierge.whatsapp || hotelConfig.contact?.whatsapp || '';

  const services = concierge.services || [
    { id: 'transport',  name: 'Airport & City Transfers', desc: 'Private car or shuttle service, pre-arranged and waiting on arrival. Any time, any airline.' },
    { id: 'tours',      name: 'Curated City Experiences', desc: 'Private guided tours, cultural experiences, nature day trips, and bespoke itineraries built around your interests.' },
    { id: 'restaurant', name: 'Restaurant Reservations', desc: 'We know the best tables in the city — and we know the people who can get them for you.' },
    { id: 'events',     name: 'Events & Ticketing',      desc: 'Concert tickets, sporting events, cultural performances, and private event access — arranged in advance.' },
    { id: 'shopping',   name: 'Personal Shopping',       desc: 'From local markets to luxury boutiques — our team can curate a shopping experience or assist with specific requests.' },
    { id: 'business',   name: 'Business Support',        desc: 'Meeting room bookings, printing, courier, and secretarial services for our business travellers.' },
    { id: 'wellness',   name: 'Wellness Bookings',       desc: 'Spa treatments, personal training sessions, and off-site wellness experiences — arranged at your convenience.' },
    { id: 'surprise',   name: 'Special Occasions',       desc: 'Flowers, gifts, romantic setups, birthday surprises — just tell us what you have in mind.' },
  ];

  useEffect(() => {
    document.title = `Concierge | ${hotelConfig.shortName || hotelConfig.name}`;
  }, [hotelConfig]);

  return (
    <div style={{ background: 'var(--bg-page)', paddingTop: 'calc(var(--nav-h, 72px) + 38px)' }}>

      {/* Hero */}
      <section style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
        <img src={hero} alt="Concierge" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,6vw,5rem)' }}>
          <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 12px', fontFamily: 'var(--font-body)' }}>Concierge Services</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 300, color: '#fff', margin: '0 0 12px', lineHeight: 1 }}>{headline}</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: 0, fontFamily: 'var(--font-body)', maxWidth: 560 }}>{subheadline}</p>
        </div>
      </section>

      {/* Intro */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)', maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: 'var(--text-sub)', fontFamily: 'var(--font-body)', margin: 0 }}>{description}</p>
      </section>

      {/* Services grid */}
      <section style={{ background: 'var(--bg-subtle, #f7f5f0)', padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 14px', fontFamily: 'var(--font-body)' }}>What We Can Arrange</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,3.5vw,3rem)', fontWeight: 300, color: 'var(--text-base)', margin: '0 0 clamp(2.5rem,4vw,3.5rem)', lineHeight: 1.1 }}>
            Nothing is too much trouble.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {services.map((s, i) => (
              <div key={s.id} style={{ background: '#fff', padding: '1.75rem 1.5rem', borderLeft: `3px solid ${accent}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, fontFamily: 'var(--font-body)' }}>0{i + 1}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 400, color: 'var(--text-base)', margin: 0 }}>{s.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.75, fontFamily: 'var(--font-body)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact concierge */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 14px', fontFamily: 'var(--font-body)' }}>Get in Touch</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,3.5vw,3rem)', fontWeight: 300, color: 'var(--text-base)', margin: '0 0 12px' }}>
            Reach our concierge team
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 36px', fontFamily: 'var(--font-body)' }}>
            Available 24 hours, 7 days a week. We are happy to assist before, during, or after your stay.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {phone && (
              <a href={`tel:${phone}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: accent, color: '#fff',
                fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                padding: '14px 28px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500,
              }}>
                📞 Call Us
              </a>
            )}
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#25d366', color: '#fff',
                fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                padding: '14px 28px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500,
              }}>
                💬 WhatsApp
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'transparent', color: 'var(--text-base)',
                border: '1px solid var(--border-base, #e8e4dc)',
                fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                padding: '14px 28px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500,
              }}>
                ✉ Email Us
              </a>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}