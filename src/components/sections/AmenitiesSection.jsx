// hotel-website/src/components/sections/AmenitiesSection.jsx
//
// Carousel of amenity cards that overlaps the bottom of HeroSection.
// Cards are white with a coloured-border accent, icon on top, title + body below.
// Prev / Next arrow buttons sit flush on the left and right edges.

import { useState, useRef, useEffect } from 'react';
import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';

// ── Default amenities — overridden by hotelConfig.amenities if present ────────
const DEFAULT_AMENITIES = [
  {
    id: 'wifi',
    title: 'High-Speed Wi-Fi',
    body: 'Stay connected effortlessly with fast, reliable internet in every room.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 56, height: 56 }}>
        {/* Router body */}
        <rect x="14" y="42" width="36" height="10" rx="2" />
        <line x1="24" y1="42" x2="24" y2="36" />
        <line x1="40" y1="42" x2="40" y2="36" />
        {/* Antenna */}
        <line x1="32" y1="42" x2="32" y2="28" />
        {/* Wi-Fi arcs */}
        <path d="M 20 26 Q 32 14 44 26" />
        <path d="M 24 30 Q 32 22 40 30" />
        <circle cx="32" cy="34" r="1.5" fill="currentColor" stroke="none" />
        {/* Indicator dots on router */}
        <circle cx="22" cy="47" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="28" cy="47" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="34" cy="47" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'tv',
    title: 'Flat-Screen Smart TVs',
    body: 'Enjoy entertainment with crystal-clear visuals and streaming apps.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 56, height: 56 }}>
        <rect x="8" y="12" width="48" height="32" rx="3" />
        <line x1="24" y1="44" x2="20" y2="54" />
        <line x1="40" y1="44" x2="44" y2="54" />
        <line x1="18" y1="54" x2="46" y2="54" />
        {/* Screen inner */}
        <rect x="13" y="17" width="38" height="22" rx="1.5" strokeDasharray="0" />
      </svg>
    ),
  },
  {
    id: 'tea',
    title: 'Tea and Coffee-Making Facilities',
    body: 'Brew your favorite drink anytime in the comfort of your room.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 56, height: 56 }}>
        {/* Steam lines */}
        <path d="M 24 10 Q 26 6 24 2" />
        <path d="M 32 10 Q 34 6 32 2" />
        <path d="M 40 10 Q 42 6 40 2" />
        {/* Cup */}
        <path d="M 14 14 L 18 52 H 46 L 50 14 Z" />
        {/* Handle */}
        <path d="M 50 22 Q 60 22 60 32 Q 60 42 50 42" />
        {/* Saucer */}
        <ellipse cx="32" cy="54" rx="20" ry="4" />
      </svg>
    ),
  },
  {
    id: 'support',
    title: '24/7 Support',
    body: 'Our front desk and support team are available around the clock to assist you.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 56, height: 56 }}>
        {/* Headset arc */}
        <path d="M 12 32 Q 12 12 32 12 Q 52 12 52 32" />
        {/* Left ear cup */}
        <rect x="8" y="28" width="10" height="16" rx="4" />
        {/* Right ear cup */}
        <rect x="46" y="28" width="10" height="16" rx="4" />
        {/* Mic boom */}
        <path d="M 56 38 Q 56 50 44 52" />
        <circle cx="44" cy="52" r="2.5" />
        {/* Question mark */}
        <path d="M 28 26 Q 28 22 32 22 Q 36 22 36 26 Q 36 30 32 30" />
        <circle cx="32" cy="34" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'pool',
    title: 'Swimming Pool',
    body: 'Unwind in our resort-style pool, open daily from 6 am to 10 pm.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 56, height: 56 }}>
        {/* Waves */}
        <path d="M 8 36 Q 16 30 24 36 Q 32 42 40 36 Q 48 30 56 36" />
        <path d="M 8 44 Q 16 38 24 44 Q 32 50 40 44 Q 48 38 56 44" />
        {/* Ladder */}
        <line x1="20" y1="10" x2="20" y2="34" />
        <line x1="30" y1="10" x2="30" y2="34" />
        <line x1="18" y1="16" x2="32" y2="16" />
        <line x1="18" y1="22" x2="32" y2="22" />
        <line x1="18" y1="28" x2="32" y2="28" />
      </svg>
    ),
  },
  {
    id: 'parking',
    title: 'Free Parking',
    body: 'Secure, complimentary parking available for all hotel guests.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 56, height: 56 }}>
        <rect x="10" y="8" width="44" height="48" rx="4" />
        <path d="M 22 18 L 22 46" />
        <path d="M 22 18 L 34 18 Q 42 18 42 26 Q 42 34 34 34 L 22 34" />
      </svg>
    ),
  },
  {
    id: 'restaurant',
    title: 'In-House Restaurant',
    body: 'Savour locally inspired cuisine and international dishes, served all day.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 56, height: 56 }}>
        {/* Fork */}
        <line x1="18" y1="8" x2="18" y2="56" />
        <path d="M 14 8 L 14 24 Q 14 28 18 28 Q 22 28 22 24 L 22 8" />
        {/* Knife */}
        <line x1="46" y1="8" x2="46" y2="56" />
        <path d="M 38 8 Q 50 8 50 22 L 46 28" />
      </svg>
    ),
  },
  {
    id: 'spa',
    title: 'Spa & Wellness',
    body: 'Rejuvenate with our range of massage, facial, and wellness treatments.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 56, height: 56 }}>
        {/* Leaf */}
        <path d="M 32 54 Q 10 44 12 20 Q 32 8 52 20 Q 54 44 32 54 Z" />
        {/* Vein */}
        <path d="M 32 54 Q 32 36 20 22" />
        <path d="M 32 42 Q 38 36 44 28" />
        <path d="M 32 34 Q 26 28 22 20" />
      </svg>
    ),
  },
];

// ── Arrow button ──────────────────────────────────────────────────────────────
function ArrowBtn({ dir, onClick, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={dir === 'prev' ? 'Previous' : 'Next'}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [dir === 'prev' ? 'left' : 'right']: 0,
        zIndex: 4,
        width: 44,
        height: 64,
        background: hov ? accent : 'rgba(255,255,255,0.92)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke={hov ? '#fff' : '#444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, transition: 'stroke 0.2s' }}>
        {dir === 'prev'
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 6 15 12 9 18" />}
      </svg>
    </button>
  );
}

// ── Amenity card ──────────────────────────────────────────────────────────────
function AmenityCard({ item, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: '0 0 calc(25% - 12px)',
        minWidth: 220,
        background: '#fff',
        border: `1px solid ${hov ? accent : 'rgba(0,0,0,0.07)'}`,
        borderBottom: `3px solid ${accent}`,
        padding: '2rem 1.75rem 2.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'border-color 0.25s, box-shadow 0.25s',
        boxShadow: hov ? '0 8px 32px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
        userSelect: 'none',
      }}
    >
      {/* Icon */}
      <div style={{ color: accent, lineHeight: 0 }}>
        {item.icon
          ? item.icon
          : (
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: 56, height: 56 }}>
              <circle cx="32" cy="32" r="22" />
              <line x1="32" y1="20" x2="32" y2="44" />
              <line x1="20" y1="32" x2="44" y2="32" />
            </svg>
          )
        }
      </div>

      {/* Text */}
      <div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)',
          fontWeight: 400,
          color: 'var(--text-base, #1a1a1a)',
          margin: '0 0 10px',
          lineHeight: 1.25,
        }}>
          {item.title}
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--text-muted, #6b6b6b)',
          margin: 0,
          lineHeight: 1.75,
        }}>
          {item.body}
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function AmenitiesSection() {
  const hotelConfig = useHotelConfig();
  const accent = hotelConfig.brand?.secondary || hotelConfig.brand?.primary || 'var(--accent, #2a7a4f)';

  // Use config amenities if provided, else fall back to defaults
  const amenities = (hotelConfig.amenities || DEFAULT_AMENITIES).map((a, i) => ({
    ...DEFAULT_AMENITIES[i % DEFAULT_AMENITIES.length],
    ...a,
    // Keep the SVG icon from DEFAULT_AMENITIES when config doesn't supply one
    icon: a.icon ?? DEFAULT_AMENITIES.find(d => d.id === a.id)?.icon ?? DEFAULT_AMENITIES[i % DEFAULT_AMENITIES.length].icon,
  }));

  const VISIBLE = 4; // cards visible at once on desktop
  const [idx, setIdx] = useState(0);
  const maxIdx = Math.max(0, amenities.length - VISIBLE);

  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(maxIdx, i + 1));

  // Auto-scroll: advance every 4 seconds, wraps around
  useEffect(() => {
    if (maxIdx === 0) return;
    const t = setInterval(() => {
      setIdx(i => (i >= maxIdx ? 0 : i + 1));
    }, 4000);
    return () => clearInterval(t);
  }, [maxIdx]);

  return (
    <section id="amenities" style={{
      background: 'var(--bg-page, #fafaf8)',
      padding: 'clamp(4rem, 7vw, 6rem) clamp(2.5rem, 6vw, 5rem)',
    }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
          <p style={{
            fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase',
            fontFamily: 'var(--font-body)', fontWeight: 600,
            color: accent, margin: '0 0 14px',
          }}>
            What We Offer
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.9rem, 3.5vw, 3rem)',
            fontWeight: 300, lineHeight: 1.1,
            color: 'var(--text-base, #1a1a1a)',
            margin: 0,
          }}>
            Featured Amenities
          </h2>
        </div>

        {/* Prev arrow */}
        {idx > 0 && <ArrowBtn dir="prev" onClick={prev} accent={accent} />}

        {/* Cards track */}
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            gap: 16,
            transform: `translateX(calc(-${idx} * (25% + 4px)))`,
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {amenities.map(item => (
              <AmenityCard key={item.id} item={item} accent={accent} />
            ))}
          </div>
        </div>

        {/* Next arrow */}
        {idx < maxIdx && <ArrowBtn dir="next" onClick={next} accent={accent} />}

        {/* Dot indicators */}
        {amenities.length > VISIBLE && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginTop: 28,
          }}>
            {Array.from({ length: maxIdx + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                style={{
                  width: i === idx ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === idx ? accent : 'rgba(0,0,0,0.15)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 0.3s, background 0.3s',
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .amenities-track > div { flex: 0 0 calc(50% - 8px) !important; min-width: 0 !important; }
        }
        @media (max-width: 540px) {
          .amenities-track > div { flex: 0 0 calc(100% - 0px) !important; }
        }
      `}</style>
    </section>
  );
}