// src/components/sections/OffersSection.jsx
import { useNavigate, Link } from 'react-router-dom';
import { useHotelConfig }    from '../../hooks/useHotelConfig.jsx';
import { useEditMode }       from '../../hooks/useEditMode.jsx';
import EditBar               from './EditBar.jsx';
import { useFmt }              from '../../utils/currency.js';

export default function OffersSection() {
  const hotelConfig = useHotelConfig();
  const navigate    = useNavigate();
  const edit        = useEditMode();

  const sectionId = 'offers';
  const isActive  = edit?.isEditMode && edit?.activeSection === sectionId;
  const saved     = hotelConfig.content?.[sectionId] || {};
  // In edit mode, getContent() merges saved API content with live edits —
  // this keeps edits visible even after clicking Done (not just while isActive).
  const c         = edit?.getContent ? edit.getContent(sectionId, saved) : saved;

  const fmt       = useFmt();

  const eyebrow   = c.eyebrow   || 'Special Offers';
  const headline  = c.headline  || 'Packages & Rates';
  const ctaLabel  = c.ctaLabel  || 'All Offers';
  const bookLabel = c.bookLabel || 'Book This Offer';
  const offers    = c.items || hotelConfig.offers || [
    { id: 1, tag: 'Leisure',   name: 'Weekend Escape',   desc: 'Arrive Friday, depart Monday — late checkout and breakfast included.',  rate: 8500000  },
    { id: 2, tag: 'Corporate', name: 'Business Stay',    desc: 'Flexible check-in, high-speed Wi-Fi, and daily laundry included.',      rate: 9000000  },
    { id: 3, tag: 'Couples',   name: 'Romantic Getaway', desc: 'Champagne on arrival, couples spa treatment, and dinner for two.',      rate: 12000000 },
  ];

  return (
    <section id="offers" data-section="offers" style={{ position: 'relative', background: 'var(--bg-subtle,#f7f5f0)', padding: 'clamp(5rem,9vw,8rem) clamp(2rem,8vw,6rem)' }}>
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
          <Link to="/offers" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 32px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, textDecoration: 'none', background: 'transparent', color: 'var(--text-base)', border: '1px solid var(--border-base)', transition: 'opacity 0.2s' }}>{ctaLabel}</Link>
        </div>
        <div className="offers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {offers.map((offer, i) => (
            <article key={offer.id || i} style={{ background: '#fff', padding: '2rem 2rem 1.75rem', borderTop: '3px solid var(--accent)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--font-body)' }}>{offer.tag}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2vw,1.6rem)', fontWeight: 300, color: 'var(--text-base)', margin: 0, lineHeight: 1.2 }}>{offer.name}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-sub)', margin: 0, lineHeight: 1.8, fontFamily: 'var(--font-body)', flexGrow: 1 }}>{offer.desc || offer.description}</p>
              {offer.rate && <p style={{ fontSize: 12, color: 'var(--accent)', margin: 0, fontFamily: 'var(--font-body)' }}>From {fmt(offer.rate)} / stay</p>}
              <button onClick={() => navigate('/book')} style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, background: 'var(--brand)', color: 'var(--text-on-brand,#fff)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                {bookLabel}
              </button>
            </article>
          ))}
        </div>
      </div>
      {edit?.isEditMode && <EditBar sectionId={sectionId} label="Special Offers" isActive={isActive} onEdit={() => edit.activateSection(sectionId)} onDone={() => edit.deactivateSection()} />}
    </section>
  );
}

const FIELD = { width: '100%', boxSizing: 'border-box', background: 'rgba(99,102,241,0.07)', border: '1.5px dashed rgba(99,102,241,0.6)', borderRadius: 4, padding: '4px 8px', fontFamily: 'inherit', outline: 'none', color: 'inherit', cursor: 'text', margin: 0 };