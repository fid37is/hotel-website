// src/components/sections/ReviewsSection.jsx
import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';
import { useEditMode }    from '../../hooks/useEditMode.jsx';
import EditBar            from './EditBar.jsx';

export default function ReviewsSection() {
  const hotelConfig = useHotelConfig();
  const edit        = useEditMode();

  const sectionId = 'reviews';
  const isActive  = edit?.isEditMode && edit?.activeSection === sectionId;
  const saved     = hotelConfig.content?.[sectionId] || {};
  // In edit mode, getContent() merges saved API content with live edits —
  // this keeps edits visible even after clicking Done (not just while isActive).
  const c         = edit?.getContent ? edit.getContent(sectionId, saved) : saved;

  const eyebrow      = c.eyebrow  || 'Guest Stories';
  const headline     = c.headline || 'What Our Guests Say';
  const guestRating  = hotelConfig.reviews?.average || 4.8;
  const guestCount   = hotelConfig.reviews?.count   || 1200;
  const testimonials = c.testimonials || hotelConfig.reviews?.testimonials || [
    { name: 'Chinedu A.',   role: 'Business Traveller', quote: 'Best decision for my trip — quiet rooms, flawless Wi-Fi, and a team that remembered my name.' },
    { name: 'Amara & Dele', role: 'Couple',             quote: 'Felt like a private resort in the middle of the city. We barely wanted to leave.' },
  ];

  return (
    <section id="reviews" data-section="reviews" style={{ position: 'relative', background: 'var(--bg-subtle,#f7f5f0)', padding: 'clamp(5rem,9vw,8rem) clamp(2rem,8vw,6rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(2.5rem,4vw,4rem)', gap: 16, flexWrap: 'wrap' }}>
          <div>
            {isActive
              ? <input value={c.eyebrow ?? ''} onChange={e => edit.setField(sectionId, 'eyebrow', e.target.value)} style={{ ...FIELD, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, display: 'block' }} />
              : <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, margin: '0 0 16px', color: 'var(--accent)' }}>{eyebrow}</p>}
            {isActive
              ? <textarea value={c.headline ?? ''} onChange={e => edit.setField(sectionId, 'headline', e.target.value)} rows={2} style={{ ...FIELD, fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.9rem,3.5vw,3rem)', lineHeight: 1.1, color: 'var(--text-base)', resize: 'none' }} />
              : <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.9rem,3.5vw,3rem)', lineHeight: 1.1, color: 'var(--text-base)', margin: 0 }}>{headline}</h2>}
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
      {edit?.isEditMode && <EditBar sectionId={sectionId} label="Guest Reviews" isActive={isActive} onEdit={() => edit.activateSection(sectionId)} onDone={() => edit.deactivateSection()} />}
    </section>
  );
}

const FIELD = { width: '100%', boxSizing: 'border-box', background: 'rgba(99,102,241,0.07)', border: '1.5px dashed rgba(99,102,241,0.6)', borderRadius: 4, padding: '4px 8px', fontFamily: 'inherit', outline: 'none', color: 'inherit', cursor: 'text', margin: 0 };