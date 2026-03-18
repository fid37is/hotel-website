// src/components/sections/RoomsSection.jsx
// Room cards grid — fetches room types, shows skeletons while loading.
// Reads card_style from hotelConfig.layout to switch between portrait / wide / magazine layouts.

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';
import { usePreview, EditableText } from '../../hooks/usePreview.jsx';
import { roomsApi } from '../../services/api.js';

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80&auto=format&fit=crop',
];

// ── Card style configs ─────────────────────────────────────────────────────────
// portrait  — 3 columns, 4:3 image ratio (default)
// wide      — 2 columns, 16:9 image ratio
// magazine  — first card spans 2 cols with tall image, rest normal
const CARD_CONFIGS = {
  portrait: { cols: 3, ratio: '4/3',  gap: 24 },
  wide:     { cols: 2, ratio: '16/9', gap: 24 },
  magazine: { cols: 3, ratio: null,   gap: 3  }, // ratio handled per-card
};

function RoomCard({ room, img, cityLine, fmt, onClick, cardStyle, index }) {
  const [hov, setHov] = useState(false);

  // Magazine: first card is tall (spans 2 cols, 3:4 image), rest are wide (16:9)
  const isMagazineHero = cardStyle === 'magazine' && index === 0;
  const ratio = cardStyle === 'magazine'
    ? (isMagazineHero ? '3/4' : '16/9')
    : (CARD_CONFIGS[cardStyle]?.ratio || '4/3');

  const colSpan = isMagazineHero ? 'span 2' : undefined;

  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{ cursor: 'pointer', background: '#fff', gridColumn: colSpan }}
    >
      <div style={{ overflow: 'hidden', aspectRatio: ratio }}>
        <img src={img} alt={room.name} loading="lazy" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          transform: hov ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.7s cubic-bezier(.16,1,.3,1)',
        }} />
      </div>
      <div style={{ padding: '18px 0 22px' }}>
        {cityLine && (
          <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 6px', fontFamily: 'var(--font-body)' }}>
            {cityLine}
          </p>
        )}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem,1.8vw,1.35rem)', fontWeight: 300, color: 'var(--text-base)', margin: '0 0 8px', lineHeight: 1.2 }}>
          {room.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {room.base_rate
            ? <span style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-body)' }}>From {fmt(room.base_rate)} / night</span>
            : <span />}
          <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>View →</span>
        </div>
      </div>
    </article>
  );
}

export default function RoomsSection() {
  const hotelConfig = useHotelConfig();
  const navigate    = useNavigate();

  const preview    = usePreview();
  const isPreview  = !!preview?.isPreview;
  const content    = preview?.content?.rooms ?? hotelConfig.content?.rooms ?? {};
  const layout     = preview?.layout ?? hotelConfig.layout ?? {};

  const cardStyle = layout.card_style || 'portrait';
  const cfg       = CARD_CONFIGS[cardStyle] || CARD_CONFIGS.portrait;

  const contact  = hotelConfig.contact || {};
  const cityLine = [contact.city, contact.country].filter(Boolean).join(', ');
  const currency = hotelConfig.payment?.currency || 'NGN';
  const fmt = n => new Intl.NumberFormat('en', { style: 'currency', currency, minimumFractionDigits: 0 }).format((n || 0) / 100);

  const eyebrow  = content.eyebrow  || 'Accommodation';
  const headline = content.headline || 'Rooms & Suites';
  const ctaLabel = content.ctaLabel || 'View All Rooms';

  const [rooms,      setRooms]      = useState([]);
  const [roomsReady, setRoomsReady] = useState(false);

  useEffect(() => {
    roomsApi.getTypes()
      .then(r => setRooms((r.data || []).slice(0, 6)))
      .catch(() => {})
      .finally(() => setRoomsReady(true));
  }, []);

  // Grid columns: magazine always uses 3-col base, portrait/wide use cfg.cols
  const gridCols = `repeat(${cfg.cols}, 1fr)`;

  const cards = !roomsReady
    ? [0,1,2,3,4,5].map(i => (
        <div key={i} style={{ background: '#f0ede8', animation: 'pulse 1.5s infinite' }}>
          <div style={{ aspectRatio: cfg.ratio || '4/3', background: '#e0ddd8' }} />
          <div style={{ padding: '18px 0' }}>
            <div style={{ height: 8, width: '55%', background: '#ddd', marginBottom: 8 }} />
            <div style={{ height: 13, width: '75%', background: '#e8e5e0' }} />
          </div>
        </div>
      ))
    : rooms.map((room, i) => {
        const img = (room.media || []).find(x => x.type === 'image')?.url || FALLBACK_IMGS[i % FALLBACK_IMGS.length];
        return (
          <RoomCard
            key={room.id}
            room={room}
            img={img}
            cityLine={cityLine}
            fmt={fmt}
            cardStyle={cardStyle}
            index={i}
            onClick={() => navigate(`/rooms/${room.id}`)}
          />
        );
      });

  return (
    <section id="rooms" data-section="rooms" style={{ background: 'var(--bg-subtle, #f7f5f0)', padding: 'clamp(4rem,8vw,7rem) clamp(2rem,8vw,6rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="rooms-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(2rem,4vw,3.5rem)', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, margin: '0 0 16px', color: 'var(--accent)' }}>
              {eyebrow}
            </p>
            <EditableText sectionId="rooms" field="headline" multiline as="h2" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.9rem,3.5vw,3rem)', lineHeight: 1.1, color: 'var(--text-base)', margin: 0 }}>{headline}</EditableText>
          </div>
          <Link to="/rooms" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 32px', borderRadius: 0, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, textDecoration: 'none', background: 'transparent', color: 'var(--text-base)', border: '1px solid var(--border-base)', transition: 'opacity 0.2s' }}>
            {ctaLabel}
          </Link>
        </div>

        <div className="rooms-grid" style={{ display: 'grid', gridTemplateColumns: gridCols, gap: cfg.gap }}>
          {cards}
        </div>
      </div>
    </section>
  );
}