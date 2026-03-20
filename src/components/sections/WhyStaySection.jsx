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
const FALLBACK_IMGS_LIST = Object.values(FALLBACK_IMGS);

const DEFAULT_TILES = [
  { eyebrow: 'Wellness',   title: 'Spa & Rejuvenation',   description: 'Holistic treatments and therapeutic rituals.', to: '/wellness', img: FALLBACK_IMGS.wellness },
  { eyebrow: 'Dining',     title: 'Culinary Experiences', description: 'West African cuisine and signature cocktails.', to: '/dining',   img: FALLBACK_IMGS.dining   },
  { eyebrow: 'Recreation', title: 'Pool & Leisure',       description: 'Rooftop pool, gym, and open-air lounges.',     to: '/explore',  img: FALLBACK_IMGS.pool     },
];

const DEFAULT_PILLARS = [
  { title: 'Warm Hospitality', body: 'Our team anticipates every need — ensuring your stay is effortless from arrival to departure.' },
  { title: 'Prime Location',   body: 'Situated at the heart of the city, close to business hubs, dining, and cultural landmarks.' },
  { title: 'Curated for You',  body: 'From private events to city excursions, every moment is thoughtfully tailored to you.' },
];

function ServiceTile({ img, eyebrow, title, description, to }) {
  const [hov, setHov] = useState(false);
  return (
    <Link to={to || '/rooms'} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'block', position: 'relative', overflow: 'hidden', textDecoration: 'none', aspectRatio: '2/3' }}>
      <img src={img} alt={title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.8s cubic-bezier(.16,1,.3,1)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.05) 55%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 22px' }}>
        <p style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', fontFamily: 'var(--font-body)' }}>{eyebrow}</p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2.2vw,1.7rem)', fontWeight: 300, color: '#fff', margin: '0 0 6px', lineHeight: 1.15 }}>{title}</h3>
        {description && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', margin: '0 0 10px', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>{description}</p>}
        <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: hov ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'color 0.2s', fontFamily: 'var(--font-body)' }}>Explore →</span>
      </div>
    </Link>
  );
}

// Editable tile card — shown in edit mode instead of ServiceTile
function EditableTile({ tile, index, onChange }) {
  return (
    <div style={{ border: '1.5px dashed rgba(99,102,241,0.5)', borderRadius: 6, overflow: 'hidden', background: 'var(--bg-muted)' }}>
      {/* Preview thumbnail */}
      <div style={{ position: 'relative', aspectRatio: '2/1', overflow: 'hidden' }}>
        <img src={tile.img || FALLBACK_IMGS_LIST[index % 3]} alt={tile.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(99,102,241,0.15)' }} />
      </div>
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: '0 0 4px' }}>Eyebrow label</p>
          <input value={tile.eyebrow || ''} onChange={e => onChange(index, 'eyebrow', e.target.value)}
            placeholder="e.g. Wellness" style={FIELD} />
        </div>
        <div>
          <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: '0 0 4px' }}>Tile title</p>
          <input value={tile.title || ''} onChange={e => onChange(index, 'title', e.target.value)}
            placeholder="e.g. Spa & Rejuvenation" style={FIELD} />
        </div>
        <div>
          <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: '0 0 4px' }}>Description</p>
          <input value={tile.description || ''} onChange={e => onChange(index, 'description', e.target.value)}
            placeholder="Short description shown on the tile" style={FIELD} />
        </div>
        <div>
          <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: '0 0 4px' }}>Link to</p>
          <input value={tile.to || ''} onChange={e => onChange(index, 'to', e.target.value)}
            placeholder="/wellness" style={FIELD} />
        </div>
        <div>
          <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: '0 0 4px' }}>Image URL</p>
          <input value={tile.img || ''} onChange={e => onChange(index, 'img', e.target.value)}
            placeholder="https://..." style={{ ...FIELD, fontSize: 10 }} />
        </div>
      </div>
    </div>
  );
}

export default function WhyStaySection() {
  const hotelConfig = useHotelConfig();
  const edit        = useEditMode();

  const sectionId = 'why_stay';
  const isActive  = edit?.isEditMode && edit?.activeSection === sectionId;
  const saved     = hotelConfig.content?.[sectionId] || {};
  // In edit mode, getContent() merges saved API content with live edits —
  // this keeps edits visible even after clicking Done (not just while isActive).
  const c         = edit?.getContent ? edit.getContent(sectionId, saved) : saved;

  const eyebrow  = c.eyebrow  || 'The Experience';
  const headline = c.headline || 'Life at the Hotel';
  const tiles    = c.tiles    || DEFAULT_TILES;
  const pillars  = c.pillars  || hotelConfig.pillars || DEFAULT_PILLARS;

  const setTileField = (i, key, val) => {
    const updated = tiles.map((t, idx) => idx === i ? { ...t, [key]: val } : t);
    edit.setField(sectionId, 'tiles', updated);
  };

  const setPillarField = (i, key, val) => {
    const updated = pillars.map((p, idx) => idx === i ? { ...p, [key]: val } : p);
    edit.setField(sectionId, 'pillars', updated);
  };

  return (
    <section id="why_stay" data-section="why_stay" style={{ position: 'relative', background: 'var(--bg-page)', padding: 'clamp(4rem,8vw,7rem) clamp(2rem,8vw,6rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
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

        {/* Experience tiles */}
        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: isActive ? 16 : 4 }}>
          {isActive
            ? tiles.map((t, i) => <EditableTile key={i} tile={t} index={i} onChange={setTileField} />)
            : tiles.map((t, i) => <ServiceTile key={i} img={t.img || FALLBACK_IMGS_LIST[i % 3]} eyebrow={t.eyebrow} title={t.title} description={t.description} to={t.to} />)
          }
        </div>

        {/* Pillars */}
        <div className="pillars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2.5rem', marginTop: 48, borderTop: '1px solid var(--border-soft)', paddingTop: 40 }}>
          {pillars.map((p, i) => (
            <div key={i}>
              {isActive ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input value={p.title || ''} onChange={e => setPillarField(i, 'title', e.target.value)}
                    placeholder="Pillar title"
                    style={{ ...FIELD, fontSize: 11, fontWeight: 600, color: 'var(--text-base)', letterSpacing: '0.05em' }} />
                  <textarea value={p.body || ''} onChange={e => setPillarField(i, 'body', e.target.value)}
                    rows={3} placeholder="Pillar description"
                    style={{ ...FIELD, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.85, resize: 'vertical' }} />
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-base)', margin: '0 0 10px', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>{p.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.85, fontFamily: 'var(--font-body)' }}>{p.body}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {edit?.isEditMode && <EditBar sectionId={sectionId} label="The Experience" isActive={isActive} onEdit={() => edit.activateSection(sectionId)} onDone={() => edit.deactivateSection()} />}
    </section>
  );
}

const FIELD = { width: '100%', boxSizing: 'border-box', background: 'rgba(99,102,241,0.07)', border: '1.5px dashed rgba(99,102,241,0.6)', borderRadius: 4, padding: '4px 8px', fontFamily: 'inherit', outline: 'none', color: 'inherit', cursor: 'text', margin: 0 };