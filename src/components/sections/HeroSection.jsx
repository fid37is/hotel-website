// hotel-website/src/components/HeroSection.jsx
import { useState } from 'react';
import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&q=85&auto=format&fit=crop';

export default function HeroSection({ checkin, setCheckin, checkout, setCheckout, onSearch }) {
  const hotelConfig = useHotelConfig();
  const [loaded, setLoaded] = useState(false);

  const name    = hotelConfig?.name    || 'The Grand Hotel';
  const tagline = hotelConfig?.tagline || 'Where Luxury Meets Legacy';
  const heroImg = hotelConfig?.heroImageUrl || FALLBACK_IMG;
  const logoUrl = hotelConfig?.logoUrl;

  const HEADER_H = 'calc(var(--nav-h, 72px) + 38px)';

  return (
    <section style={{
      position: 'relative',
      marginTop: `calc(${HEADER_H} * -1)`,
      height: `calc(100vh + ${HEADER_H})`,
      minHeight: 560,
      overflow: 'hidden',
    }}>

      {/* ── Background image ── */}
      <img
        src={heroImg}
        alt={name}
        onLoad={() => setLoaded(true)}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1.2s ease',
          zIndex: 0,
        }}
      />

      {/* ── Dark overlay ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(8, 12, 18, 0.5)',
        zIndex: 1,
      }} />

      {/* ── LAYER 1: Logo + eyebrow + headline — absolute dead-center of the full section ── */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        maxWidth: 860,
        padding: '0 1.5rem',
        boxSizing: 'border-box',
      }}>
        {/* Logo + accent underline */}
        {logoUrl && (
          <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <img
              src={logoUrl} alt={name}
              style={{ height: 42, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
            />
            <span style={{ display: 'block', width: 48, height: 2, background: 'var(--accent, #2a7a4f)' }} />
          </div>
        )}

        {/* Eyebrow */}
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.85)', margin: '0 0 14px',
        }}>
          Welcome to {name}
        </p>

        {/* Main headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.4rem, 5.5vw, 5.2rem)',
          fontWeight: 400, lineHeight: 1.06,
          color: '#fff', margin: 0,
        }}>
          {tagline}
        </h1>
      </div>

      {/* ── LAYER 2: Search bar — sits below the center group, above bottom area ── */}
      <div style={{
        position: 'absolute',
        top: 'calc(50% + 170px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        width: 'min(860px, 90vw)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr auto',
        background: '#fff',
        boxShadow: '0 8px 48px rgba(0,0,0,0.28)',
      }}>
        {/* DATE FROM */}
        <div style={{
          padding: '18px 28px',
          borderRight: '1px solid rgba(0,0,0,0.09)',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.28em', textTransform: 'uppercase', color: '#888',
          }}>Date From</span>
          <input
            type="date" value={checkin}
            onChange={e => setCheckin(e.target.value)}
            style={{
              border: 'none', outline: 'none',
              fontFamily: 'var(--font-body)', fontSize: 14,
              color: '#111', background: 'transparent',
              padding: 0, width: '100%', cursor: 'pointer',
              colorScheme: 'light',
              accentColor: 'var(--accent, #2a7a4f)',
            }}
          />
        </div>

        {/* DATE TO */}
        <div style={{
          padding: '18px 28px',
          borderRight: '1px solid rgba(0,0,0,0.09)',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.28em', textTransform: 'uppercase', color: '#888',
          }}>Date To</span>
          <input
            type="date" value={checkout}
            onChange={e => setCheckout(e.target.value)}
            style={{
              border: 'none', outline: 'none',
              fontFamily: 'var(--font-body)', fontSize: 14,
              color: '#111', background: 'transparent',
              padding: 0, width: '100%', cursor: 'pointer',
              colorScheme: 'light',
              accentColor: 'var(--accent, #2a7a4f)',
            }}
          />
        </div>

        {/* SEARCH button */}
        <button
          type="button" onClick={onSearch}
          style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '0 44px',
            background: 'var(--btn-accent-bg, #2a7a4f)',
            color: 'var(--btn-accent-text, #fff)',
            border: 'none', cursor: 'pointer', borderRadius: 0,
            fontFamily: 'var(--font-body)', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
            minHeight: 76, transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
            strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
          Search
        </button>
      </div>

      {/* ── LAYER 3: Arrow + Discover text — pinned to bottom ── */}
      <div style={{
        position: 'absolute',
        bottom: '3.5vh',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}>
        <svg viewBox="0 0 60 90" fill="none" style={{ width: 40, height: 60, opacity: 0.85 }}>
          <path
            d="M 30 5 C 48 5, 55 18, 45 28 C 35 38, 18 32, 22 20 C 26 8, 42 10, 42 22"
            stroke="white" strokeWidth="1.6" fill="none"
            strokeLinecap="round" strokeLinejoin="round"
          />
          <line x1="30" y1="30" x2="30" y2="68" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          <polyline points="22,60 30,72 38,60"
            stroke="white" strokeWidth="1.6" fill="none"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>

        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1rem, 1.8vw, 1.35rem)',
          fontWeight: 400, color: 'rgba(255,255,255,0.9)',
          margin: 0, textAlign: 'center',
        }}>
          Discover our Featured Amenities
        </p>
      </div>

    </section>
  );
}