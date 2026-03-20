// src/pages/DiningPage.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';

const FALLBACK_HERO = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=85&auto=format&fit=crop';

export default function DiningPage() {
  const hotelConfig = useHotelConfig();
  const accent = hotelConfig.brand?.secondary || hotelConfig.brand?.primary || 'var(--accent)';
  const dining = hotelConfig.dining || {};

  const hero        = dining.heroImage   || FALLBACK_HERO;
  const headline    = dining.headline    || 'A Culinary Journey';
  const subheadline = dining.subheadline || 'From sunrise breakfasts to late-night cocktails — every meal is an occasion.';
  const description = dining.description || 'Our in-house restaurant celebrates West African cuisine reimagined with a contemporary kitchen. Whether you\'re starting the day with a full breakfast, enjoying a business lunch, or ending the evening with cocktails at the bar — our team is ready to make it memorable.';

  const venues = dining.venues || [
    {
      id: 'restaurant',
      name: 'The Main Restaurant',
      tag: 'All-Day Dining',
      hours: '6:30 am – 10:30 pm',
      description: 'A relaxed, light-filled space for breakfast, lunch, and dinner. Our menu changes seasonally and celebrates local producers alongside international flavours.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'bar',
      name: 'Lobby Bar & Lounge',
      tag: 'Cocktails & Light Bites',
      hours: '11:00 am – 1:00 am',
      description: 'Signature cocktails, curated wines, and a small plates menu in a sophisticated lounge setting. The perfect place to unwind after a long day or meet before dinner.',
      image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80&auto=format&fit=crop',
    },
    {
      id: 'inroom',
      name: 'In-Room Dining',
      tag: '24 Hours',
      hours: 'Available round the clock',
      description: 'Enjoy a curated selection from our kitchen, delivered directly to your room at any hour. From a midnight snack to a full three-course meal — comfort on your terms.',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80&auto=format&fit=crop',
    },
  ];

  useEffect(() => {
    document.title = `Dining | ${hotelConfig.shortName || hotelConfig.name}`;
  }, [hotelConfig]);

  return (
    <div style={{ background: 'var(--bg-page)', paddingTop: 'calc(var(--nav-h, 72px) + 38px)' }}>

      {/* Hero */}
      <section style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
        <img src={hero} alt="Dining" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,6vw,5rem)' }}>
          <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 12px', fontFamily: 'var(--font-body)' }}>Dining</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 300, color: '#fff', margin: '0 0 12px', lineHeight: 1 }}>{headline}</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: 0, fontFamily: 'var(--font-body)', maxWidth: 560 }}>{subheadline}</p>
        </div>
      </section>

      {/* Intro */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)', maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: 'var(--text-sub)', fontFamily: 'var(--font-body)', margin: 0 }}>{description}</p>
      </section>

      {/* Venues */}
      <section style={{ padding: '0 clamp(1.5rem,6vw,5rem) clamp(5rem,9vw,7rem)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {venues.map((v, i) => (
            <div key={v.id} style={{
              display: 'grid',
              gridTemplateColumns: i % 2 === 0 ? '55% 45%' : '45% 55%',
              minHeight: 380,
              direction: i % 2 === 0 ? 'ltr' : 'rtl',
            }}>
              {/* Text */}
              <div style={{
                direction: 'ltr',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: 'clamp(3rem,6vw,5rem) clamp(2.5rem,5vw,4rem)',
                background: i % 2 === 0 ? 'var(--bg-subtle, #f7f5f0)' : '#fff',
                borderTop: `3px solid ${accent}`,
              }}>
                <p style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: accent, margin: '0 0 8px', fontFamily: 'var(--font-body)' }}>{v.tag}</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,2.5vw,2.2rem)', fontWeight: 300, color: 'var(--text-base)', margin: '0 0 8px', lineHeight: 1.15 }}>{v.name}</h2>
                <p style={{ fontSize: 11, color: accent, margin: '0 0 20px', fontFamily: 'var(--font-body)', fontWeight: 500 }}>⏱ {v.hours}</p>
                <p style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--text-sub)', margin: 0, fontFamily: 'var(--font-body)' }}>{v.description}</p>
              </div>
              {/* Image */}
              <div style={{ direction: 'ltr', position: 'relative', overflow: 'hidden', minHeight: 300 }}>
                <img src={v.image} alt={v.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: accent, padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, color: '#fff', margin: '0 0 8px' }}>Reserve a Table</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: '0 0 28px', fontFamily: 'var(--font-body)' }}>Walk-ins welcome, reservations recommended for dinner service.</p>
        {hotelConfig.contact?.phone && (
          <a href={`tel:${hotelConfig.contact.phone}`} style={{
            display: 'inline-flex', alignItems: 'center',
            background: '#fff', color: '#111',
            fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
            padding: '14px 36px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500,
          }}>
            Call to Reserve
          </a>
        )}
      </section>

    </div>
  );
}