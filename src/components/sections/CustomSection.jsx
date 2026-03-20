// src/components/sections/CustomSection.jsx
//
// A free-form section that hotels can configure entirely from the HMS.
// Supports any combination of: headline, subheading, body text, CTA button,
// and a background colour — all positioned via a simple layout option.
//
// Two instances are registered: custom_1 and custom_2, allowing hotels to
// add up to two extra fully-custom sections to their home page.

import { useNavigate } from 'react-router-dom';
import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';

const DEFAULTS = {
  headline:   'Your Custom Section',
  subheading: 'Add a subheading here',
  body:       'Use this section to highlight anything important — a promotion, a special announcement, or a unique aspect of your hotel.',
  ctaLabel:   '',
  ctaLink:    '/book',
  bgColor:    'var(--bg-subtle, #f7f5f0)',
  textAlign:  'center',   // center | left | right
  layout:     'centered', // centered | split-left | split-right
};

function Block({ content, navigate }) {
  const d = { ...DEFAULTS, ...content };
  const isCenter   = d.layout === 'centered';
  const isSplitL   = d.layout === 'split-left';

  return (
    <div style={{
      maxWidth: isCenter ? 760 : 1200,
      margin: '0 auto',
      display: isCenter ? 'block' : 'grid',
      gridTemplateColumns: isCenter ? undefined : '1fr 1fr',
      gap: isCenter ? undefined : 'clamp(3rem,8vw,7rem)',
      alignItems: 'center',
      textAlign: isCenter ? 'center' : 'left',
    }}>
      {/* Text side */}
      <div style={{ order: isSplitL ? 0 : 1 }}>
        {d.eyebrow && (
          <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
            fontFamily: 'var(--font-body)', fontWeight: 500, margin: '0 0 16px', color: 'var(--accent)' }}>
            {d.eyebrow}
          </p>
        )}
        {d.headline && (
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(1.9rem,3.5vw,3rem)', lineHeight: 1.1,
            color: 'var(--text-base)', margin: '0 0 1rem' }}>
            {d.headline}
          </h2>
        )}
        {d.subheading && (
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(1rem,1.8vw,1.4rem)', color: 'var(--text-muted)',
            margin: '0 0 1.25rem', fontStyle: 'italic' }}>
            {d.subheading}
          </p>
        )}
        {d.body && (
          <p style={{ fontSize: 13, lineHeight: 1.9, color: 'var(--text-sub)',
            margin: '0 0 2rem', fontFamily: 'var(--font-body)' }}>
            {d.body}
          </p>
        )}
        {d.ctaLabel && (
          <button onClick={() => navigate(d.ctaLink || '/book')} style={{
            display: 'inline-flex', alignItems: 'center', padding: '14px 32px',
            borderRadius: 0, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            fontFamily: 'var(--font-body)', fontWeight: 500,
            background: 'var(--brand)', color: 'var(--text-on-brand, #fff)',
            border: 'none', cursor: 'pointer', transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            {d.ctaLabel}
          </button>
        )}
      </div>

      {/* Optional image side for split layouts */}
      {!isCenter && d.image && (
        <div style={{ order: isSplitL ? 1 : 0, overflow: 'hidden', aspectRatio: '4/3' }}>
          <img src={d.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      )}
    </div>
  );
}

// Shared factory — id is 'custom_1' or 'custom_2'
export function makeCustomSection(id) {
  return function CustomSection() {
    const hotelConfig = useHotelConfig();
    const navigate    = useNavigate();
    const content     = hotelConfig.content?.[id] || {};
    const bg          = content.bgColor || DEFAULTS.bgColor;

    return (
      <section id={id} data-section={id} style={{
        background: bg,
        padding: 'clamp(5rem,9vw,8rem) clamp(2rem,8vw,6rem)',
      }}>
        <Block content={content} navigate={navigate} />
      </section>
    );
  };
}

export const CustomSection1 = makeCustomSection('custom_1');
export const CustomSection2 = makeCustomSection('custom_2');