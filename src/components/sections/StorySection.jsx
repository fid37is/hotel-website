// src/components/sections/StorySection.jsx
// "Our Story" — 55/45 split: text + feature links left, full-height image right.
// Copy editable via hotelConfig.content.story.

import { Link, useNavigate } from 'react-router-dom';
import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1400&q=85&auto=format&fit=crop';
const BODY_STYLE = { fontSize: 13, lineHeight: 1.9, color: 'var(--text-sub)', margin: 0, fontFamily: 'var(--font-body)' };

export default function StorySection() {
  const hotelConfig = useHotelConfig();
  const navigate    = useNavigate();
  const content = hotelConfig.content?.story || {};

  const eyebrow    = content.eyebrow    || 'Our Story';
  const headline   = content.headline   || 'Designed for those';
  const headlineSub = content.headlineSub || 'who expect more';
  const body       = content.body       || hotelConfig.description || 'A modern luxury hotel offering world-class hospitality.';
  const ctaLabel   = content.ctaLabel   || 'Explore the Hotel';
  const image      = content.image      || hotelConfig.storyImageUrl || FALLBACK_IMG;

  const links = content.links || [
    { label: 'Dining',    sub: 'West African cuisine, signature cocktails, and rooftop evenings.', to: '/dining'    },
    { label: 'Wellness',  sub: 'Spa treatments, pool, and rituals designed to restore.',            to: '/wellness'  },
    { label: 'Concierge', sub: 'Private transfers, city tours, tailored itineraries.',              to: '/concierge' },
  ];

  return (
    <section className="story-grid" style={{ display: 'grid', gridTemplateColumns: '55% 45%', background: 'var(--bg-page)', minHeight: 600 }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(4rem,8vw,7rem) clamp(3rem,5vw,5rem)' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, margin: '0 0 16px', color: 'var(--accent)' }}>{eyebrow}</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, lineHeight: 1.1, color: 'var(--text-base)', margin: '0 0 1.5rem' }}>
          {headline}<br /><em style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{headlineSub}</em>
        </h2>
        <p style={{ ...BODY_STYLE, maxWidth: 460, marginBottom: 36 }}>{body}</p>

        <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 28 }}>
          {links.map(({ label, sub, to }) => (
            <Link key={label} to={to || '/explore'} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-soft)', textDecoration: 'none' }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 3px', fontFamily: 'var(--font-body)' }}>{label}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, fontFamily: 'var(--font-body)' }}>{sub}</p>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: 16, flexShrink: 0, marginLeft: 20 }}>→</span>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 36 }}>
          <Link to="/explore" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 32px', borderRadius: 0, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, textDecoration: 'none', background: 'var(--brand)', color: 'var(--text-on-brand, #fff)', border: 'none', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            {ctaLabel}
          </Link>
        </div>
      </div>

      <div className="story-img" style={{ position: 'relative', overflow: 'hidden', minHeight: 560 }}>
        <img src={image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.4s cubic-bezier(.16,1,.3,1)' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'} />
      </div>
    </section>
  );
}