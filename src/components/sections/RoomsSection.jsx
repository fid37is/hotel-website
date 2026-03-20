// src/components/sections/RoomsSection.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate }   from 'react-router-dom';
import { useHotelConfig }      from '../../hooks/useHotelConfig.jsx';
import { useEditMode }         from '../../hooks/useEditMode.jsx';
import { roomsApi }            from '../../services/api.js';
import EditBar                 from './EditBar.jsx';
import { useFmt }              from '../../utils/currency.js';

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80&auto=format&fit=crop',
];

const CARD_CONFIGS = {
  portrait: { cols: 3, ratio: '4/3',  gap: 24 },
  wide:     { cols: 2, ratio: '16/9', gap: 24 },
  magazine: { cols: 3, ratio: null,   gap: 3  },
};

function RoomCard({ room, img, cityLine, fmt, onClick, cardStyle, index }) {
  const [hov, setHov] = useState(false);
  const isMagazineHero = cardStyle === 'magazine' && index === 0;
  const ratio = cardStyle === 'magazine' ? (isMagazineHero ? '3/4' : '16/9') : (CARD_CONFIGS[cardStyle]?.ratio || '4/3');
  return (
    <article onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}
      style={{ cursor: 'pointer', background: '#fff', gridColumn: isMagazineHero ? 'span 2' : undefined }}>
      <div style={{ overflow: 'hidden', aspectRatio: ratio }}>
        <img src={img} alt={room.name} loading="lazy" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.7s cubic-bezier(.16,1,.3,1)',
        }} />
      </div>
      <div style={{ padding: '18px 0 22px' }}>
        {cityLine && <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 6px', fontFamily: 'var(--font-body)' }}>{cityLine}</p>}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem,1.8vw,1.35rem)', fontWeight: 300, color: 'var(--text-base)', margin: '0 0 8px', lineHeight: 1.2 }}>{room.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {room.base_rate ? <span style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-body)' }}>From {fmt(room.base_rate)} / night</span> : <span />}
          <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>View →</span>
        </div>
      </div>
    </article>
  );
}

export default function RoomsSection() {
  const hotelConfig = useHotelConfig();
  const navigate    = useNavigate();
  const edit        = useEditMode();

  const sectionId = 'rooms';
  const isActive  = edit?.isEditMode && edit?.activeSection === sectionId;
  const saved     = hotelConfig.content?.[sectionId] || {};
  // In edit mode, getContent() merges saved API content with live edits —
  // this keeps edits visible even after clicking Done (not just while isActive).
  const c         = edit?.getContent ? edit.getContent(sectionId, saved) : saved;

  const layout    = hotelConfig.layout || {};
  const cardStyle = layout.card_style || 'portrait';
  const cfg       = CARD_CONFIGS[cardStyle] || CARD_CONFIGS.portrait;
  const contact   = hotelConfig.contact || {};
  const cityLine  = [contact.city, contact.country].filter(Boolean).join(', ');
  const fmt       = useFmt();

  const eyebrow  = c.eyebrow  || 'Accommodation';
  const headline = c.headline || 'Rooms & Suites';
  const ctaLabel = c.ctaLabel || 'View All Rooms';

  const [rooms, setRooms]           = useState([]);
  const [roomsReady, setRoomsReady] = useState(false);

  useEffect(() => {
    roomsApi.getTypes().then(r => setRooms((r.data || []).slice(0, 6))).catch(() => {}).finally(() => setRoomsReady(true));
  }, []);

  return (
    <section id="rooms" data-section="rooms" style={{ position: 'relative', background: 'var(--bg-subtle,#f7f5f0)', padding: 'clamp(4rem,8vw,7rem) clamp(2rem,8vw,6rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="rooms-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(2rem,4vw,3.5rem)', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, margin: '0 0 16px', color: 'var(--accent)' }}>{eyebrow}</p>
            {isActive
              ? <textarea value={c.headline ?? ''} onChange={e => edit.setField(sectionId, 'headline', e.target.value)} rows={2} style={{ ...FIELD, fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.9rem,3.5vw,3rem)', lineHeight: 1.1, color: 'var(--text-base)' }} />
              : <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.9rem,3.5vw,3rem)', lineHeight: 1.1, color: 'var(--text-base)', margin: 0 }}>{headline}</h2>}
          </div>
          <Link to="/rooms" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 32px', borderRadius: 0, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, textDecoration: 'none', background: 'transparent', color: 'var(--text-base)', border: '1px solid var(--border-base)', transition: 'opacity 0.2s' }}>{ctaLabel}</Link>
        </div>
        <div className="rooms-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${cfg.cols},1fr)`, gap: cfg.gap }}>
          {!roomsReady
            ? [0,1,2].map(i => <div key={i} style={{ background: '#f0ede8' }}><div style={{ aspectRatio: cfg.ratio || '4/3', background: '#e0ddd8' }} /></div>)
            : rooms.map((room, i) => {
                const img = (room.media || []).find(x => x.type === 'image')?.url || FALLBACK_IMGS[i % FALLBACK_IMGS.length];
                return <RoomCard key={room.id} room={room} img={img} cityLine={cityLine} fmt={fmt} cardStyle={cardStyle} index={i} onClick={() => navigate(`/rooms/${room.id}`)} />;
              })}
        </div>
      </div>
      {edit?.isEditMode && <EditBar sectionId={sectionId} label="Rooms & Suites" isActive={isActive} onEdit={() => edit.activateSection(sectionId)} onDone={() => edit.deactivateSection()} />}
    </section>
  );
}

const FIELD = { width: '100%', boxSizing: 'border-box', background: 'rgba(99,102,241,0.07)', border: '1.5px dashed rgba(99,102,241,0.6)', borderRadius: 4, padding: '4px 8px', fontFamily: 'inherit', outline: 'none', color: 'inherit', resize: 'none', cursor: 'text', margin: 0 };