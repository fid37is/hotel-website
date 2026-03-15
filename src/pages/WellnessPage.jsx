// src/pages/WellnessPage.jsx
import { useEffect } from 'react';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';

const FALLBACK_HERO = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1800&q=85&auto=format&fit=crop';

export default function WellnessPage() {
  const hotelConfig = useHotelConfig();
  const accent = hotelConfig.brand?.secondary || hotelConfig.brand?.primary || 'var(--accent)';
  const wellness = hotelConfig.wellness || {};

  const hero        = wellness.heroImage   || FALLBACK_HERO;
  const headline    = wellness.headline    || 'Restore. Renew. Refresh.';
  const subheadline = wellness.subheadline || 'Treatments and rituals designed to reset body and mind.';
  const description = wellness.description || 'Our wellness facilities offer a complete escape from the pace of daily life. Whether you\'re booking a deep tissue massage, unwinding by the pool, or working out in our fully-equipped gym — every facility is designed with your wellbeing in mind.';

  const treatments = wellness.treatments || [
    { id: 't1', name: 'Deep Tissue Massage', duration: '60 or 90 min', desc: 'Targeted pressure techniques to release deep muscle tension and restore mobility.' },
    { id: 't2', name: 'Aromatherapy Ritual', duration: '75 min', desc: 'A full-body treatment using warm essential oils chosen to balance your mood and senses.' },
    { id: 't3', name: 'Couples Treatment', duration: '90 min', desc: 'A shared wellness experience in our private suite — ideal for a special occasion.' },
    { id: 't4', name: 'Facial & Skin Care', duration: '50 min', desc: 'Tailored facials using premium products to cleanse, hydrate, and restore your complexion.' },
    { id: 't5', name: 'Hot Stone Therapy', duration: '75 min', desc: 'Smooth volcanic stones work with therapeutic massage to ease tension and improve circulation.' },
    { id: 't6', name: 'Express Refresh', duration: '30 min', desc: 'A focused back, neck, and shoulder massage — perfect between meetings or before travel.' },
  ];

  const facilities = wellness.facilities || [
    { id: 'spa', icon: '◈', name: 'Spa Suites', desc: 'Two private treatment rooms with ambient lighting and steam facilities.' },
    { id: 'pool', icon: '◈', name: 'Swimming Pool', desc: 'Resort-style outdoor pool open daily from 6 am to 10 pm.' },
    { id: 'gym', icon: '◈', name: 'Fitness Centre', desc: 'Fully equipped gym with cardio, free weights, and strength equipment. Open 24 hours.' },
    { id: 'sauna', icon: '◈', name: 'Sauna & Steam Room', desc: 'Finnish sauna and eucalyptus steam room — open to all hotel guests.' },
  ];

  useEffect(() => {
    document.title = `Wellness & Spa | ${hotelConfig.shortName || hotelConfig.name}`;
  }, [hotelConfig]);

  return (
    <div style={{ background: 'var(--bg-page)', paddingTop: 'calc(var(--nav-h, 72px) + 38px)' }}>

      {/* Hero */}
      <section style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
        <img src={hero} alt="Wellness" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,6vw,5rem)' }}>
          <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 12px', fontFamily: 'var(--font-body)' }}>Wellness & Spa</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 300, color: '#fff', margin: '0 0 12px', lineHeight: 1 }}>{headline}</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: 0, fontFamily: 'var(--font-body)', maxWidth: 560 }}>{subheadline}</p>
        </div>
      </section>

      {/* Intro */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)', maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: 'var(--text-sub)', fontFamily: 'var(--font-body)', margin: 0 }}>{description}</p>
      </section>

      {/* Facilities */}
      <section style={{ background: 'var(--bg-subtle, #f7f5f0)', padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 14px', fontFamily: 'var(--font-body)' }}>Facilities</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,3.5vw,3rem)', fontWeight: 300, color: 'var(--text-base)', margin: '0 0 clamp(2.5rem,4vw,3.5rem)', lineHeight: 1.1 }}>
            Everything you need to unwind.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
            {facilities.map(f => (
              <div key={f.id} style={{ borderTop: `3px solid ${accent}`, paddingTop: 20 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--text-base)', margin: '0 0 10px' }}>{f.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.75, fontFamily: 'var(--font-body)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 14px', fontFamily: 'var(--font-body)' }}>Treatments Menu</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,3.5vw,3rem)', fontWeight: 300, color: 'var(--text-base)', margin: '0 0 clamp(2.5rem,4vw,3.5rem)', lineHeight: 1.1 }}>
            Our signature treatments.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {treatments.map(t => (
              <div key={t.id} style={{ background: '#fff', border: '1px solid var(--border-base, #e8e4dc)', padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 400, color: 'var(--text-base)', margin: 0 }}>{t.name}</h3>
                  <span style={{ fontSize: 10, color: accent, fontFamily: 'var(--font-body)', fontWeight: 500, flexShrink: 0, marginLeft: 12 }}>{t.duration}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.75, fontFamily: 'var(--font-body)' }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: accent, padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, color: '#fff', margin: '0 0 8px' }}>Book a Treatment</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: '0 0 28px', fontFamily: 'var(--font-body)' }}>Advance booking recommended. Speak to our spa concierge for personalised recommendations.</p>
        {hotelConfig.contact?.phone && (
          <a href={`tel:${hotelConfig.contact.phone}`} style={{
            display: 'inline-flex', alignItems: 'center',
            background: '#fff', color: '#111',
            fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
            padding: '14px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500,
          }}>
            Call to Book
          </a>
        )}
      </section>

    </div>
  );
}