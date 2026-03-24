// src/components/sections/HeroSection.jsx
import { useState } from 'react';
import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';
import { useEditMode }    from '../../hooks/useEditMode.jsx';
import EditBar            from './EditBar.jsx';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&q=85&auto=format&fit=crop';

export default function HeroSection({ checkin, setCheckin, checkout, setCheckout, onSearch }) {
  const hotelConfig = useHotelConfig();
  const edit        = useEditMode();
  const [loaded, setLoaded] = useState(false);

  const sectionId  = 'hero';
  const isActive   = edit?.isEditMode && edit?.activeSection === sectionId;
  const saved      = hotelConfig.content?.[sectionId] || {};
  const c          = edit?.getContent ? edit.getContent(sectionId, saved) : saved;

  const name    = hotelConfig?.name         || 'The Grand Hotel';
  const heroImg = hotelConfig?.heroImageUrl || FALLBACK_IMG;
  const logoUrl = hotelConfig?.logoUrl;
  const eyebrow = c.eyebrow  || ('Welcome to ' + name);
  const tagline = c.headline || hotelConfig?.tagline || 'Where Luxury Meets Legacy';

  const HEADER_H = 'calc(var(--nav-h, 72px) + 38px)';

  return (
    // No overflow:hidden on the outer section — same pattern as StorySection.
    // The image stays contained via position:absolute inset:0 without needing clipping.
    // This lets the EditBar (position:absolute, zIndex:950) render visibly.
    <section id="hero" data-section="hero" style={{
      position: 'relative',
      marginTop: `calc(${HEADER_H} * -1)`,
      height: `calc(100vh + ${HEADER_H})`,
      minHeight: 560,
    }}>
      <img src={heroImg} alt={name} onLoad={() => setLoaded(true)} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        opacity: loaded ? 1 : 0, transition: 'opacity 1.2s ease', zIndex: 0,
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,12,18,0.5)', zIndex: 1 }} />

      {/* Center content */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', width: '100%', maxWidth: 860,
        padding: '0 1.5rem', boxSizing: 'border-box',
      }}>
        {logoUrl && (
          <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <img src={logoUrl} alt={name} style={{ height: 42, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            <span style={{ display: 'block', width: 48, height: 2, background: 'var(--accent)' }} />
          </div>
        )}

        {isActive ? (
          <>
            <input value={c.eyebrow ?? ('Welcome to ' + name)}
              onChange={e => edit.setField(sectionId, 'eyebrow', e.target.value)}
              placeholder="Eyebrow text"
              style={{ ...INPUT_STYLE, fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: 14, textAlign: 'center' }} />
            <textarea value={c.headline ?? hotelConfig?.tagline ?? ''}
              onChange={e => edit.setField(sectionId, 'headline', e.target.value)}
              placeholder="Main headline"
              rows={2}
              style={{ ...INPUT_STYLE, fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem,5.5vw,5.2rem)', fontWeight: 400, lineHeight: 1.06, color: '#fff', textAlign: 'center', resize: 'none' }} />
          </>
        ) : (
          <>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', margin: '0 0 14px' }}>
              {eyebrow}
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem,5.5vw,5.2rem)', fontWeight: 400, lineHeight: 1.06, color: '#fff', margin: 0 }}>
              {tagline}
            </h1>
          </>
        )}
      </div>

      {/* Booking bar */}
      <div style={{
        position: 'absolute', top: 'calc(50% + 170px)', left: '50%',
        transform: 'translateX(-50%)', zIndex: 2,
        width: 'min(860px,90vw)', display: 'grid',
        gridTemplateColumns: '1fr 1fr auto',
        background: '#fff', boxShadow: '0 8px 48px rgba(0,0,0,0.28)',
      }}>
        <div style={{ padding: '18px 28px', borderRight: '1px solid rgba(0,0,0,0.09)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#888' }}>Date From</span>
          <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)}
            style={{ border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 14, color: '#111', background: 'transparent', padding: 0, width: '100%', cursor: 'pointer', colorScheme: 'light', accentColor: 'var(--accent)' }} />
        </div>
        <div style={{ padding: '18px 28px', borderRight: '1px solid rgba(0,0,0,0.09)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#888' }}>Date To</span>
          <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)}
            style={{ border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 14, color: '#111', background: 'transparent', padding: 0, width: '100%', cursor: 'pointer', colorScheme: 'light', accentColor: 'var(--accent)' }} />
        </div>
        <button type="button" onClick={onSearch}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0 44px', background: 'var(--btn-accent-bg)', color: 'var(--btn-accent-text,#fff)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', minHeight: 76, transition: 'opacity 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
            <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
          Search
        </button>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '3.5vh', left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <svg viewBox="0 0 60 90" fill="none" style={{ width: 40, height: 60, opacity: 0.85 }}>
          <path d="M 30 5 C 48 5, 55 18, 45 28 C 35 38, 18 32, 22 20 C 26 8, 42 10, 42 22" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="30" y1="30" x2="30" y2="68" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          <polyline points="22,60 30,72 38,60" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,1.8vw,1.35rem)', fontWeight: 400, color: 'rgba(255,255,255,0.9)', margin: 0, textAlign: 'center' }}>
          Discover our Featured Amenities
        </p>
      </div>

      {/* EditBar — positioned at top-right of the VISIBLE hero area.
          The section has a negative marginTop so we offset by HEADER_H to stay visible. */}
      {edit?.isEditMode && !isActive && (
        <button type="button" onClick={() => edit.activateSection(sectionId)} style={{
          position: 'absolute',
          top: `calc(var(--nav-h, 72px) + 54px)`,
          right: 16,
          zIndex: 950,
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff',
          background: 'rgba(17,17,17,0.8)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 6, padding: '7px 14px', cursor: 'pointer',
          backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>
      )}
      {edit?.isEditMode && isActive && (
        <div style={{
          position: 'absolute',
          top: `calc(var(--nav-h, 72px) + 38px)`,
          left: 0, right: 0,
          zIndex: 950,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 16px',
          background: 'rgba(99,102,241,0.95)',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff' }}>
            ✎ Editing: Hero Banner
          </span>
          <button type="button" onClick={() => edit.deactivateSection()} style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
            color: '#fff', cursor: 'pointer',
            background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 5, padding: '5px 14px',
          }}>✓ Done</button>
        </div>
      )}
    </section>
  );
}

const INPUT_STYLE = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(0,0,0,0.35)',
  border: '1.5px dashed rgba(99,102,241,0.9)',
  borderRadius: 4, padding: '4px 10px',
  fontFamily: 'inherit', outline: 'none',
  color: '#fff', cursor: 'text',
};