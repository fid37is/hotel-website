// src/components/sections/CtaSection.jsx
import { useNavigate }    from 'react-router-dom';
import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';
import { useEditMode }    from '../../hooks/useEditMode.jsx';
import EditBar            from './EditBar.jsx';

export default function CtaSection() {
  const hotelConfig = useHotelConfig();
  const navigate    = useNavigate();
  const edit        = useEditMode();

  const sectionId = 'cta';
  const isActive  = edit?.isEditMode && edit?.activeSection === sectionId;
  const saved     = hotelConfig.content?.[sectionId] || {};
  const c         = edit?.isEditMode ? { ...saved, ...edit.content?.[sectionId] } : saved;

  const eyebrow     = c.eyebrow     || 'Direct Booking · Best Rate Guaranteed';
  const headline    = c.headline    || 'Begin your';
  const headlineSub = c.headlineSub || 'stay.';
  const ctaLabel    = c.ctaLabel    || 'Reserve a Room';
  const phone       = hotelConfig.contact?.phone || '';

  return (
    <section id="cta" data-section="cta" style={{ position: 'relative', background: 'var(--btn-accent-bg)', padding: 'clamp(5rem,10vw,9rem) clamp(2rem,8vw,6rem)' }}>
      <div className="cta-inner" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3rem', flexWrap: 'wrap' }}>
        <div>
          {isActive
            ? <input value={c.eyebrow ?? ''} onChange={e => edit.setField(sectionId, 'eyebrow', e.target.value)} style={{ ...FIELD, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16, display: 'block' }} />
            : <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, margin: '0 0 16px', color: 'rgba(255,255,255,0.5)' }}>{eyebrow}</p>}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5.5vw,5rem)', fontWeight: 300, color: '#fff', lineHeight: 1.0, margin: 0 }}>
            {isActive
              ? <><input value={c.headline ?? ''} onChange={e => edit.setField(sectionId, 'headline', e.target.value)} style={{ ...FIELD, display: 'block', color: '#fff', marginBottom: 8 }} /><input value={c.headlineSub ?? ''} onChange={e => edit.setField(sectionId, 'headlineSub', e.target.value)} style={{ ...FIELD, display: 'block', color: '#fff', fontStyle: 'italic' }} /></>
              : <>{headline}<br /><em style={{ fontStyle: 'italic', opacity: 0.65 }}>{headlineSub}</em></>}
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
          <button onClick={() => navigate('/book')} style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 32px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, background: '#fff', color: '#111', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            {isActive
              ? <input value={c.ctaLabel ?? ''} onChange={e => edit.setField(sectionId, 'ctaLabel', e.target.value)} onClick={ev => ev.stopPropagation()} style={{ ...FIELD, background: 'transparent', border: '1px dashed rgba(99,102,241,0.6)', color: '#111', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }} />
              : ctaLabel}
          </button>
          {phone && <a href={`tel:${phone}`} style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>{phone}</a>}
        </div>
      </div>
      {edit?.isEditMode && <EditBar sectionId={sectionId} label="Reserve CTA" isActive={isActive} onEdit={() => edit.activateSection(sectionId)} onDone={() => edit.deactivateSection()} />}
    </section>
  );
}

const FIELD = { width: '100%', boxSizing: 'border-box', background: 'rgba(99,102,241,0.07)', border: '1.5px dashed rgba(99,102,241,0.6)', borderRadius: 4, padding: '4px 8px', fontFamily: 'inherit', outline: 'none', color: 'inherit', cursor: 'text', margin: 0 };