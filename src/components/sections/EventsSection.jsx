// src/components/sections/EventsSection.jsx
import { useState }          from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHotelConfig }    from '../../hooks/useHotelConfig.jsx';
import { useEditMode }       from '../../hooks/useEditMode.jsx';
import EditBar               from './EditBar.jsx';

const DEFAULT_VENUES = [
  { name: 'Grand Ballroom',      tag: 'Weddings & Galas',     cap: 'Up to 500 guests', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=80&auto=format&fit=crop' },
  { name: 'Conference Hall',     tag: 'Corporate Events',     cap: 'Up to 200 guests', img: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=900&q=80&auto=format&fit=crop' },
  { name: 'Executive Boardroom', tag: 'Meetings',             cap: 'Up to 30 guests',  img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&auto=format&fit=crop' },
  { name: 'Garden Terrace',      tag: 'Outdoor Celebrations', cap: 'Up to 150 guests', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80&auto=format&fit=crop' },
];

function VenueCard({ name, tag, cap, img, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4', cursor: 'pointer' }}>
      <img src={img} alt={name} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hov ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.9s cubic-bezier(.16,1,.3,1)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.08) 55%,transparent 100%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1.25rem' }}>
        <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 5px', fontFamily: 'var(--font-body)' }}>{tag} · {cap}</p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,1.6vw,1.3rem)', fontWeight: 300, color: '#fff', margin: 0, lineHeight: 1.2 }}>{name}</h3>
      </div>
    </div>
  );
}

export default function EventsSection() {
  const hotelConfig = useHotelConfig();
  const navigate    = useNavigate();
  const edit        = useEditMode();

  const sectionId = 'events';
  const isActive  = edit?.isEditMode && edit?.activeSection === sectionId;
  const saved     = hotelConfig.content?.[sectionId] || {};
  const c         = edit?.isEditMode ? { ...saved, ...edit.content?.[sectionId] } : saved;

  const eyebrow     = c.eyebrow     || 'Events & Venues';
  const headline    = c.headline    || 'Host your next';
  const headlineSub = c.headlineSub || 'unforgettable event.';
  const body        = c.body        || 'From intimate boardroom meetings to grand ballroom weddings — our versatile venues and dedicated events team bring every vision to life.';
  const ctaLabel    = c.ctaLabel    || 'Explore Venues & Enquire';
  const bannerText  = c.bannerText  || 'Our events team responds within 24 hours with availability and a tailored proposal.';
  const bannerCta   = c.bannerCta   || 'Send an Enquiry';
  const venues      = c.venues      || DEFAULT_VENUES;

  return (
    <section id="events" data-section="events" style={{ position: 'relative', background: 'var(--bg-page)', padding: 'clamp(5rem,9vw,8rem) clamp(2rem,8vw,6rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="intro-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem,7vw,7rem)', alignItems: 'end', marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
          <div>
            {isActive
              ? <input value={c.eyebrow ?? ''} onChange={e => edit.setField(sectionId, 'eyebrow', e.target.value)} style={{ ...FIELD, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, display: 'block' }} />
              : <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, margin: '0 0 16px', color: 'var(--accent)' }}>{eyebrow}</p>}
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(1.9rem,3.5vw,3rem)', lineHeight: 1.1, color: 'var(--text-base)', margin: 0 }}>
              {isActive
                ? <><input value={c.headline ?? ''} onChange={e => edit.setField(sectionId, 'headline', e.target.value)} style={{ ...FIELD, display: 'block', marginBottom: 8 }} /><input value={c.headlineSub ?? ''} onChange={e => edit.setField(sectionId, 'headlineSub', e.target.value)} style={{ ...FIELD, display: 'block', fontStyle: 'italic' }} /></>
                : <>{headline}<br /><em style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{headlineSub}</em></>}
            </h2>
          </div>
          <div>
            {isActive
              ? <textarea value={c.body ?? ''} onChange={e => edit.setField(sectionId, 'body', e.target.value)} rows={4} style={{ ...FIELD, fontSize: 13, lineHeight: 1.9, color: 'var(--text-sub)', marginBottom: 24, resize: 'vertical' }} />
              : <p style={{ fontSize: 13, lineHeight: 1.9, color: 'var(--text-sub)', margin: '0 0 24px', fontFamily: 'var(--font-body)' }}>{body}</p>}
            <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 32px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, textDecoration: 'none', background: 'transparent', color: 'var(--text-base)', border: '1px solid var(--border-base)', transition: 'opacity 0.2s' }}>{ctaLabel}</Link>
          </div>
        </div>
        <div className="venues-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 3, marginBottom: 24 }}>
          {venues.map((v, i) => <VenueCard key={v.name || i} {...v} onClick={() => navigate('/events')} />)}
        </div>
        <div style={{ background: 'var(--brand)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          {isActive
            ? <input value={c.bannerText ?? ''} onChange={e => edit.setField(sectionId, 'bannerText', e.target.value)} style={{ ...FIELD, fontSize: 13, color: 'rgba(255,255,255,0.75)', flex: 1 }} />
            : <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0, fontFamily: 'var(--font-body)' }}>{bannerText}</p>}
          <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 28px', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, textDecoration: 'none', background: 'var(--accent)', color: 'var(--text-on-accent,#fff)', border: 'none', flexShrink: 0, transition: 'opacity 0.2s' }}>{bannerCta}</Link>
        </div>
      </div>
      {edit?.isEditMode && <EditBar sectionId={sectionId} label="Events & Venues" isActive={isActive} onEdit={() => edit.activateSection(sectionId)} onDone={() => edit.deactivateSection()} />}
    </section>
  );
}

const FIELD = { width: '100%', boxSizing: 'border-box', background: 'rgba(99,102,241,0.07)', border: '1.5px dashed rgba(99,102,241,0.6)', borderRadius: 4, padding: '4px 8px', fontFamily: 'inherit', outline: 'none', color: 'inherit', cursor: 'text', margin: 0 };