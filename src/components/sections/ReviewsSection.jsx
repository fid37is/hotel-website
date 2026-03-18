// src/components/sections/ReviewsSection.jsx
// Guest testimonials grid.
// Copy editable via hotelConfig.content.reviews.

import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';

export default function ReviewsSection() {
  const hotelConfig = useHotelConfig();
  const content = hotelConfig.content?.reviews || {};

  const eyebrow      = content.eyebrow      || 'Guest Stories';
  const headline     = content.headline     || 'What Our Guests Say';
  const guestRating  = hotelConfig.reviews?.average || 4.8;
  const guestCount   = hotelConfig.reviews?.count   || 1200;

  const testimonials = hotelConfig.reviews?.testimonials || content.testimonials || [
    { name: 'Chinedu A.',   role: 'Business Traveller', quote: 'Best decision for my trip — quiet rooms, flawless Wi-Fi, and a team that remembered my name.' },
    { name: 'Amara & Dele', role: 'Couple',             quote: 'Felt like a private resort in the middle of the city. We barely wanted to leave.' },
  ];

  return (
    <section id="reviews" data-section="reviews" style={{ background: 'var(--bg-subtle, #f7f5f0)', padding: 'clamp(5rem,9vw,8rem) clamp(2rem,8vw,6rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(2.5rem,4vw,4rem)', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, margin: '0 0 16px', color: 'var(--accent)' }}>{eyebrow}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.9rem,3.5vw,3rem)', lineHeight: 1.1, color: 'var(--text-base)', margin: 0 }}>{headline}</h2>
          </div>
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
}