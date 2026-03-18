// src/components/sections/WhyStaySection.jsx
import { useState }       from 'react';
import { Link }           from 'react-router-dom';
import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';
import { useEditMode }    from '../../hooks/useEditMode.jsx';
import EditBar            from './EditBar.jsx';

const FALLBACK_IMGS = {
  wellness: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80&auto=format&fit=crop',
  dining:   'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
  pool:     'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80&auto=format&fit=crop',
};

function ServiceTile({ img, eyebrow, title, to }) {
  const [hov, setHov] = useState(false);
  return (
    <Link to={to || '/rooms'} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'block', position: 'relative', overflow: 'hidden', textDecoration: 'none', aspectRatio: '2/3' }}>
      <img src={img} alt={title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.8s cubic-bezier(.16,1,.3,1)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.05) 55%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 22px' }}>
        <p style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', fontFamily: 'var(--font-body)' }}>{eyebrow}</p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2.2vw,1.7rem)', fontWeight: 300, color: '#fff', margin: '0 0 10px', lineHeight: 1.15 }}>{title}</h3>
        <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: hov ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'color 0.2s', fontFamily: 'var(--font-body)' }}>Explore →</span>
      </div>
    </Link>
  );
}

export default function WhyStaySection() {
  const hotelConfig = useHotelConfig();
  const edit        = useEditMode();

  const sectionId = 'why_stay';
  const isActive  = edit?.isEditMode && edit?.activeSection === sectionId;
  const saved     = hotelConfig.content?.[sectionId] || {};
  const c         = edit?.isEditMode ? { ...saved, ...edit.content?.[sectionId] } : saved;

  const eyebrow  = c.eyebrow  || 'The Experience';
  const headline = c.headline || 'Life at the Hotel';
  const tiles    = c.tiles    || [
    { eyebrow: 'Wellness',   title: 'Spa & Rejuvenation',   to: '/wellness', img: FALLBACK_IMGS.wellness },
    { eyebrow: 'Dining',     title: 'Culinary Experiences', to: '/dining',   img: FALLBACK_IMGS.dining   },
    { eyebrow: 'Recreation', title: 'Pool & Leisure',       to: '/explore',  img: FALLBACK_IMGS.pool     },
  ];
  const pillars  = c.pillars  || hotelConfig.pillars || [
    { title: 'Warm Hospitality', body: 'Our team anticipates every need — ensuring your stay is effortless from arrival to departure.' },
    { title: 'Prime Location',   body: 'Situated at the heart of the city, close to business hubs, dining, and cultural landmarks.' },
    { title: 'Curated for You',  body: 'From private events to city excursions, every moment is thoughtfully tailored to you.' },
  ];

  return (
    <section id="why_stay" data-section="why_stay" style={{ position: 'relative', background: 'var(--bg-page)', padding: 'clamp(4rem,8vw,7rem) clamp(2rem,8vw,6rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(2rem,4vw,3rem)', flexWrap: 'wrap', gap: 16 }}>
          <div>
            {isActive
              ? <input value={c.eyebrow ?? ''} onChange={e => edit.setField(sectionId, 'eyebrow', e.target.value)} style={{ ...FIELD, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, display: 'block' }} />
              : <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, margin: '0 0 16px', color: 'var(--accent)' }}>{eyebrow}</p>}
            {isActive
              ? <textarea value={c.headline ?? ''} onChange={e => edit.setField(sectionId, 'headline', e.target.value)} rows={2} style={{ ...FIELD, fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.9rem,3.5vw,3rem)', lineHeight: 1.1, color: 'var(--text-base)', resize: 'none' }} />
              : <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.9rem,3.5vw,3rem)', lineHeight: 1.1, color: 'var(--text-base)', margin: 0 }}>{headline}</h2>}
          </div>
        </div>
        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4 }}>
          {tiles.map((t, i) => <ServiceTile key={i} img={t.img || Object.values(FALLBACK_IMGS)[i % 3]} eyebrow={t.eyebrow} title={t.title} to={t.to} />)}
        </div>
        <div className="pillars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2.5rem', marginTop: 48, borderTop: '1px solid var(--border-soft)', paddingTop: 40 }}>
          {pillars.map((p, i) => (
            <div key={p.title || i}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-base)', margin: '0 0 10px', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>{p.title}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.85, fontFamily: 'var(--font-body)' }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
      {edit?.isEditMode && <EditBar sectionId={sectionId} label="Why Stay Here" isActive={isActive} onEdit={() => edit.activateSection(sectionId)} onDone={() => edit.deactivateSection()} />}
    </section>
  );
}

const FIELD = { width: '100%', boxSizing: 'border-box', background: 'rgba(99,102,241,0.07)', border: '1.5px dashed rgba(99,102,241,0.6)', borderRadius: 4, padding: '4px 8px', fontFamily: 'inherit', outline: 'none', color: 'inherit', cursor: 'text', margin: 0 };