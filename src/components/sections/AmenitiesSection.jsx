// hotel-website/src/components/sections/AmenitiesSection.jsx
import { useState, useEffect } from 'react';
import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';
import { useEditMode }    from '../../hooks/useEditMode.jsx';
import EditBar            from './EditBar.jsx';

const DEFAULT_AMENITIES = [
  { id: 'wifi',       title: 'High-Speed Wi-Fi',               body: 'Stay connected effortlessly with fast, reliable internet in every room.' },
  { id: 'tv',         title: 'Flat-Screen Smart TVs',          body: 'Enjoy entertainment with crystal-clear visuals and streaming apps.' },
  { id: 'tea',        title: 'Tea and Coffee-Making',          body: 'Brew your favourite drink anytime in the comfort of your room.' },
  { id: 'support',    title: '24/7 Support',                   body: 'Our front desk and support team are available around the clock.' },
  { id: 'pool',       title: 'Swimming Pool',                  body: 'Unwind in our resort-style pool, open daily from 6 am to 10 pm.' },
  { id: 'parking',    title: 'Free Parking',                   body: 'Secure, complimentary parking available for all hotel guests.' },
  { id: 'restaurant', title: 'In-House Restaurant',            body: 'Savour locally inspired cuisine and international dishes, served all day.' },
  { id: 'spa',        title: 'Spa & Wellness',                 body: 'Rejuvenate with our range of massage, facial, and wellness treatments.' },
];

// SVG icons keyed by amenity id
const ICONS = {
  wifi: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
      <rect x="14" y="42" width="36" height="10" rx="2" /><line x1="24" y1="42" x2="24" y2="36" /><line x1="40" y1="42" x2="40" y2="36" />
      <line x1="32" y1="42" x2="32" y2="28" /><path d="M 20 26 Q 32 14 44 26" /><path d="M 24 30 Q 32 22 40 30" />
      <circle cx="32" cy="34" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  tv: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
      <rect x="8" y="12" width="48" height="32" rx="3" /><line x1="24" y1="44" x2="20" y2="54" /><line x1="40" y1="44" x2="44" y2="54" />
      <line x1="18" y1="54" x2="46" y2="54" /><rect x="13" y="17" width="38" height="22" rx="1.5" />
    </svg>
  ),
  tea: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
      <path d="M 24 10 Q 26 6 24 2" /><path d="M 32 10 Q 34 6 32 2" /><path d="M 40 10 Q 42 6 40 2" />
      <path d="M 14 14 L 18 52 H 46 L 50 14 Z" /><path d="M 50 22 Q 60 22 60 32 Q 60 42 50 42" />
      <ellipse cx="32" cy="54" rx="20" ry="4" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
      <path d="M 12 32 Q 12 12 32 12 Q 52 12 52 32" /><rect x="8" y="28" width="10" height="16" rx="4" />
      <rect x="46" y="28" width="10" height="16" rx="4" /><path d="M 56 38 Q 56 50 44 52" /><circle cx="44" cy="52" r="2.5" />
    </svg>
  ),
  pool: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
      <path d="M 8 36 Q 16 30 24 36 Q 32 42 40 36 Q 48 30 56 36" /><path d="M 8 44 Q 16 38 24 44 Q 32 50 40 44 Q 48 38 56 44" />
      <line x1="20" y1="10" x2="20" y2="34" /><line x1="30" y1="10" x2="30" y2="34" />
      <line x1="18" y1="16" x2="32" y2="16" /><line x1="18" y1="22" x2="32" y2="22" /><line x1="18" y1="28" x2="32" y2="28" />
    </svg>
  ),
  parking: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
      <rect x="10" y="8" width="44" height="48" rx="4" /><path d="M 22 18 L 22 46" />
      <path d="M 22 18 L 34 18 Q 42 18 42 26 Q 42 34 34 34 L 22 34" />
    </svg>
  ),
  restaurant: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
      <line x1="18" y1="8" x2="18" y2="56" /><path d="M 14 8 L 14 24 Q 14 28 18 28 Q 22 28 22 24 L 22 8" />
      <line x1="46" y1="8" x2="46" y2="56" /><path d="M 38 8 Q 50 8 50 22 L 46 28" />
    </svg>
  ),
  spa: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
      <path d="M 32 54 Q 10 44 12 20 Q 32 8 52 20 Q 54 44 32 54 Z" />
      <path d="M 32 54 Q 32 36 20 22" /><path d="M 32 42 Q 38 36 44 28" /><path d="M 32 34 Q 26 28 22 20" />
    </svg>
  ),
};

const GENERIC_ICON = (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: 48, height: 48 }}>
    <circle cx="32" cy="32" r="22" /><line x1="32" y1="20" x2="32" y2="44" /><line x1="20" y1="32" x2="44" y2="32" />
  </svg>
);

function ArrowBtn({ dir, onClick, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      aria-label={dir === 'prev' ? 'Previous' : 'Next'}
      style={{
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        [dir === 'prev' ? 'left' : 'right']: 0, zIndex: 4,
        width: 44, height: 64, border: 'none', cursor: 'pointer',
        background: hov ? accent : 'rgba(255,255,255,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s', boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
      }}>
      <svg viewBox="0 0 24 24" fill="none" stroke={hov ? '#fff' : '#444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, transition: 'stroke 0.2s' }}>
        {dir === 'prev' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 6 15 12 9 18" />}
      </svg>
    </button>
  );
}

function AmenityCard({ item, accent }) {
  const [hov, setHov] = useState(false);
  const icon = ICONS[item.id] || GENERIC_ICON;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      flex: '0 0 calc(25% - 12px)', minWidth: 220, background: '#fff',
      borderTop: `1px solid ${hov ? accent : 'rgba(0,0,0,0.07)'}`,
      borderRight: `1px solid ${hov ? accent : 'rgba(0,0,0,0.07)'}`,
      borderLeft: `1px solid ${hov ? accent : 'rgba(0,0,0,0.07)'}`,
      borderBottom: `3px solid ${accent}`,
      padding: '2rem 1.75rem 2.25rem', display: 'flex', flexDirection: 'column', gap: 16,
      transition: 'border-color 0.25s, box-shadow 0.25s',
      boxShadow: hov ? '0 8px 32px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      <div style={{ color: accent, lineHeight: 0 }}>{icon}</div>
      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.05rem,1.6vw,1.25rem)', fontWeight: 400, color: 'var(--text-base)', margin: '0 0 10px', lineHeight: 1.25 }}>{item.title}</h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.75 }}>{item.body}</p>
      </div>
    </div>
  );
}

function EditableCard({ item, index, onChange, onRemove, accent }) {
  return (
    <div style={{ flex: '0 0 calc(25% - 12px)', minWidth: 220, background: '#fff', border: `2px dashed rgba(99,102,241,0.5)`, borderBottom: `3px solid ${accent}`, padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ color: accent, lineHeight: 0 }}>{ICONS[item.id] || GENERIC_ICON}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={LABEL}>Title</label>
        <input value={item.title || ''} onChange={e => onChange(index, 'title', e.target.value)} style={FIELD} />
        <label style={LABEL}>Description</label>
        <textarea value={item.body || ''} onChange={e => onChange(index, 'body', e.target.value)} rows={3} style={{ ...FIELD, resize: 'vertical' }} />
      </div>
      <button type="button" onClick={() => onRemove(index)} style={{ alignSelf: 'flex-start', background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.2)', color: 'rgba(200,0,0,0.7)', borderRadius: 4, padding: '3px 10px', fontSize: 11, cursor: 'pointer' }}>
        Remove
      </button>
    </div>
  );
}

export default function AmenitiesSection() {
  const hotelConfig = useHotelConfig();
  const edit        = useEditMode();
  const accent      = hotelConfig.brand?.secondary || hotelConfig.brand?.primary || 'var(--accent)';

  const sectionId = 'amenities';
  const isActive  = edit?.isEditMode && edit?.activeSection === sectionId;
  const saved     = hotelConfig.content?.[sectionId] || {};
  const c         = edit?.getContent ? edit.getContent(sectionId, saved) : saved;

  // Amenities: from content, then hotelConfig.amenities, then defaults
  // Strip icons (non-serializable) from config amenities, use ICONS lookup instead
  const amenities = (c.items || hotelConfig.amenities || DEFAULT_AMENITIES).map(a => ({
    id:    a.id    || 'custom',
    title: a.title || '',
    body:  a.body  || '',
  }));

  const setAmenities = (next) => edit.setField(sectionId, 'items', next);
  const changeItem   = (i, key, val) => setAmenities(amenities.map((a, idx) => idx === i ? { ...a, [key]: val } : a));
  const removeItem   = (i) => setAmenities(amenities.filter((_, idx) => idx !== i));
  const addItem      = () => setAmenities([...amenities, { id: `custom_${Date.now()}`, title: 'New Amenity', body: 'Description of this amenity.' }]);

  const VISIBLE = 4;
  const [idx, setIdx] = useState(0);
  const maxIdx = Math.max(0, amenities.length - VISIBLE);

  useEffect(() => {
    if (isActive || maxIdx === 0) return;
    const t = setInterval(() => setIdx(i => (i >= maxIdx ? 0 : i + 1)), 4000);
    return () => clearInterval(t);
  }, [maxIdx, isActive]);

  return (
    <section id="amenities" data-section="amenities" style={{ position: 'relative', background: 'var(--bg-page)', padding: 'clamp(4rem,7vw,6rem) clamp(2.5rem,6vw,5rem)' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>

        <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem,4vw,3.5rem)' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 600, color: accent, margin: '0 0 14px' }}>
            {isActive
              ? <input value={c.eyebrow ?? 'What We Offer'} onChange={e => edit.setField(sectionId, 'eyebrow', e.target.value)} style={{ ...FIELD, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', textAlign: 'center' }} />
              : (c.eyebrow || 'What We Offer')}
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,3.5vw,3rem)', fontWeight: 300, lineHeight: 1.1, color: 'var(--text-base)', margin: 0 }}>
            {isActive
              ? <input value={c.headline ?? 'Featured Amenities'} onChange={e => edit.setField(sectionId, 'headline', e.target.value)} style={{ ...FIELD, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,3.5vw,3rem)', fontWeight: 300, textAlign: 'center' }} />
              : (c.headline || 'Featured Amenities')}
          </h2>
        </div>

        {isActive ? (
          <>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {amenities.map((item, i) => (
                <EditableCard key={item.id + i} item={item} index={i} onChange={changeItem} onRemove={removeItem} accent={accent} />
              ))}
              <div style={{ flex: '0 0 calc(25% - 12px)', minWidth: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button type="button" onClick={addItem} style={{ border: '2px dashed rgba(99,102,241,0.4)', background: 'none', borderRadius: 8, padding: '2rem', color: 'rgba(99,102,241,0.7)', cursor: 'pointer', fontSize: 13, width: '100%', height: '100%', minHeight: 180 }}>
                  + Add Amenity
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {idx > 0 && <ArrowBtn dir="prev" onClick={() => setIdx(i => Math.max(0, i - 1))} accent={accent} />}
            <div style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: 16, transform: `translateX(calc(-${idx} * (25% + 4px)))`, transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)' }}>
                {amenities.map((item, i) => <AmenityCard key={item.id + i} item={item} accent={accent} />)}
              </div>
            </div>
            {idx < maxIdx && <ArrowBtn dir="next" onClick={() => setIdx(i => Math.min(maxIdx, i + 1))} accent={accent} />}
            {amenities.length > VISIBLE && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
                {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                  <button key={i} type="button" onClick={() => setIdx(i)} style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, background: i === idx ? accent : 'rgba(0,0,0,0.15)', border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.3s, background 0.3s' }} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {edit?.isEditMode && <EditBar sectionId={sectionId} label="Amenities" isActive={isActive} onEdit={() => edit.activateSection(sectionId)} onDone={() => edit.deactivateSection()} />}
    </section>
  );
}

const FIELD = { width: '100%', boxSizing: 'border-box', background: 'rgba(99,102,241,0.07)', border: '1.5px dashed rgba(99,102,241,0.6)', borderRadius: 4, padding: '4px 8px', fontFamily: 'inherit', outline: 'none', color: 'inherit', cursor: 'text', margin: 0 };
const LABEL = { fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(99,102,241,0.8)', fontFamily: 'var(--font-body)' };