// src/components/sections/CtaSection.jsx
// Bottom call-to-action banner — large headline + Reserve button.
// Copy editable via hotelConfig.content.cta.

import { useNavigate } from 'react-router-dom';
import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';

export default function CtaSection() {
  const hotelConfig = useHotelConfig();
  const navigate    = useNavigate();
  const content = hotelConfig.content?.cta || {};
  const phone   = hotelConfig.contact?.phone || '';

  const eyebrow  = content.eyebrow  || 'Direct Booking · Best Rate Guaranteed';
  const headline = content.headline || 'Begin your';
  const headlineSub = content.headlineSub || 'stay.';
  const ctaLabel = content.ctaLabel || 'Reserve a Room';

  return (
    <section style={{ background: 'var(--btn-accent-bg)', padding: 'clamp(5rem,10vw,9rem) clamp(2rem,8vw,6rem)' }}>
      <div className="cta-inner" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3rem', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, margin: '0 0 16px', color: 'rgba(255,255,255,0.5)' }}>{eyebrow}</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5.5vw,5rem)', fontWeight: 300, color: '#fff', lineHeight: 1.0, margin: 0 }}>
            {headline}<br /><em style={{ fontStyle: 'italic', opacity: 0.65 }}>{headlineSub}</em>
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
          <button onClick={() => navigate('/book')} style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 32px', borderRadius: 0, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, background: '#fff', color: '#111', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            {ctaLabel}
          </button>
          {phone && (
            <a href={`tel:${phone}`} style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
              {phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}