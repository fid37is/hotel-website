// src/components/sections/StorySection.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useHotelConfig }    from '../../hooks/useHotelConfig.jsx';
import { useEditMode }       from '../../hooks/useEditMode.jsx';
import EditBar               from './EditBar.jsx';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1400&q=85&auto=format&fit=crop';
const BODY_STYLE   = { fontSize: 13, lineHeight: 1.9, color: 'var(--text-sub)', margin: 0, fontFamily: 'var(--font-body)' };

export default function StorySection() {
  const hotelConfig = useHotelConfig();
  const navigate    = useNavigate();
  const edit        = useEditMode();

  const sectionId = 'story';
  const isActive  = edit?.isEditMode && edit?.activeSection === sectionId;
  const saved     = hotelConfig.content?.[sectionId] || {};
  const c         = edit?.isEditMode ? { ...saved, ...edit.content?.[sectionId] } : saved;

  const eyebrow     = c.eyebrow     || 'Our Story';
  const headline    = c.headline    || 'Designed for those';
  const headlineSub = c.headlineSub || 'who expect more';
  const body        = c.body        || hotelConfig.description || 'A modern luxury hotel offering world-class hospitality.';
  const ctaLabel    = c.ctaLabel    || 'Explore the Hotel';
  const image       = c.image       || hotelConfig.storyImageUrl || FALLBACK_IMG;
  const links       = c.links       || [
    { label: 'Dining',    sub: 'West African cuisine, signature cocktails, and rooftop evenings.', to: '/dining'    },
    { label: 'Wellness',  sub: 'Spa treatments, pool, and rituals designed to restore.',           to: '/wellness'  },
    { label: 'Concierge', sub: 'Private transfers, city tours, tailored itineraries.',             to: '/concierge' },
  ];

  return (
    <section id="story" data-section="story" className="story-grid" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '55% 45%', background: 'var(--bg-page)', minHeight: 600 }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(4rem,8vw,7rem) clamp(3rem,5vw,5rem)' }}>

        {isActive
          ? <input value={c.eyebrow ?? ''} onChange={e => edit.setField(sectionId, 'eyebrow', e.target.value)} style={{ ...FIELD, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, display: 'block' }} />
          : <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, margin: '0 0 16px', color: 'var(--accent)' }}>{eyebrow}</p>}

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, lineHeight: 1.1, color: 'var(--text-base)', margin: '0 0 1.5rem' }}>
          {isActive
            ? <><input value={c.headline ?? ''} onChange={e => edit.setField(sectionId, 'headline', e.target.value)} style={{ ...FIELD, display: 'block', marginBottom: 8 }} /><input value={c.headlineSub ?? ''} onChange={e => edit.setField(sectionId, 'headlineSub', e.target.value)} style={{ ...FIELD, display: 'block', fontStyle: 'italic' }} /></>
            : <>{headline}<br /><em style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{headlineSub}</em></>}
        </h2>

        {isActive
          ? <textarea value={c.body ?? ''} onChange={e => edit.setField(sectionId, 'body', e.target.value)} rows={4} style={{ ...FIELD, ...BODY_STYLE, maxWidth: 460, marginBottom: 36, resize: 'vertical' }} />
          : <p style={{ ...BODY_STYLE, maxWidth: 460, marginBottom: 36 }}>{body}</p>}

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
          <Link to="/explore" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 32px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, textDecoration: 'none', background: 'var(--brand)', color: 'var(--text-on-brand,#fff)', border: 'none', transition: 'opacity 0.2s' }}
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

      {edit?.isEditMode && <EditBar sectionId={sectionId} label="Our Story" isActive={isActive} onEdit={() => edit.activateSection(sectionId)} onDone={() => edit.deactivateSection()} />}
    </section>
  );
}

const FIELD = { width: '100%', boxSizing: 'border-box', background: 'rgba(99,102,241,0.07)', border: '1.5px dashed rgba(99,102,241,0.6)', borderRadius: 4, padding: '4px 8px', fontFamily: 'inherit', outline: 'none', color: 'inherit', cursor: 'text', margin: 0 };