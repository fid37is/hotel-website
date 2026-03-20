// src/pages/OffersPage.jsx
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';
import { useFmt }              from '../utils/currency.js';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80&auto=format&fit=crop',
];

export default function OffersPage() {
  const hotelConfig = useHotelConfig();
  const navigate = useNavigate();
  const accent = hotelConfig.brand?.secondary || hotelConfig.brand?.primary || 'var(--accent)';
  const fmt       = useFmt();

  const offers = hotelConfig.offers || [
    {
      id: 'weekend-escape',
      tag: 'Leisure',
      name: 'Weekend Escape',
      description: 'Arrive Friday, depart Monday with late checkout included. Complimentary breakfast for two each morning and a welcome bottle of wine on arrival.',
      includes: ['Late checkout (2 pm)', 'Breakfast for two daily', 'Welcome wine on arrival', 'Free parking'],
      rate: 8500000,
      nights: '2–3 nights',
    },
    {
      id: 'business-stay',
      tag: 'Corporate',
      name: 'Business Stay',
      description: 'Everything a business traveller needs — flexible check-in and check-out, high-speed Wi-Fi, daily laundry, and a dedicated workspace in every room.',
      includes: ['Flexible check-in/check-out', 'Daily laundry', 'Breakfast included', 'Meeting room access (2 hrs/day)'],
      rate: 9000000,
      nights: 'From 1 night',
    },
    {
      id: 'romantic-getaway',
      tag: 'Couples',
      name: 'Romantic Getaway',
      description: 'A specially curated experience for couples — champagne on arrival, a couples spa treatment, candlelit dinner for two, and late checkout to make the most of your stay.',
      includes: ['Champagne on arrival', 'Couples spa treatment (90 min)', 'Dinner for two', 'Late checkout', 'Room décor on arrival'],
      rate: 12000000,
      nights: '2 nights minimum',
    },
    {
      id: 'long-stay',
      tag: 'Extended',
      name: 'Long Stay Rate',
      description: 'Ideal for extended assignments or relocations. Enjoy discounted nightly rates, weekly laundry, and a fully stocked mini-kitchen on request.',
      includes: ['Discounted rate from 7+ nights', 'Weekly laundry service', 'Mini kitchen on request', 'Grocery delivery service'],
      rate: 6500000,
      nights: '7+ nights',
    },
  ];

  useEffect(() => {
    document.title = `Special Offers | ${hotelConfig.shortName || hotelConfig.name}`;
  }, [hotelConfig]);

  return (
    <div style={{ background: 'var(--bg-page)', paddingTop: 'calc(var(--nav-h, 72px) + 38px)' }}>

      {/* Header */}
      <section style={{ background: 'var(--brand, #1a1a1a)', padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 800 }}>
          <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 14px', fontFamily: 'var(--font-body)' }}>
            Direct Booking · Best Rate Guaranteed
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 300, color: '#fff', margin: '0 0 16px', lineHeight: 1 }}>
            Special Offers & Packages
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: 0, fontFamily: 'var(--font-body)', lineHeight: 1.8 }}>
            Packages crafted to make every stay more rewarding. Book direct and receive the best available rate — guaranteed.
          </p>
        </div>
      </section>

      {/* Offers list */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {offers.map((offer, i) => (
            <article key={offer.id} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: '#fff',
              border: '1px solid var(--border-base, #e8e4dc)',
              overflow: 'hidden',
            }}>
              {/* Image */}
              <div style={{ position: 'relative', minHeight: 320, order: i % 2 === 0 ? 0 : 1 }}>
                <img
                  src={offer.image || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                  alt={offer.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: 20, left: 20 }}>
                  <span style={{ background: accent, color: '#fff', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '6px 12px', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                    {offer.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: 'clamp(2rem,4vw,3.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20, order: i % 2 === 0 ? 1 : 0 }}>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: '0 0 8px' }}>{offer.nights}</p>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,2.5vw,2.2rem)', fontWeight: 300, color: 'var(--text-base)', margin: '0 0 14px', lineHeight: 1.15 }}>{offer.name}</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-sub)', margin: 0, lineHeight: 1.85, fontFamily: 'var(--font-body)' }}>{offer.description}</p>
                </div>

                {offer.includes?.length > 0 && (
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {offer.includes.map(item => (
                      <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                        <span style={{ color: accent, flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingTop: 8, borderTop: '1px solid var(--border-base, #e8e4dc)' }}>
                  {offer.rate && (
                    <p style={{ fontSize: 13, color: accent, margin: 0, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                      From {fmt(offer.rate)} / stay
                    </p>
                  )}
                  <button type="button" onClick={() => navigate('/book')} style={{
                    background: accent, color: '#fff', border: 'none', cursor: 'pointer',
                    fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                    padding: '12px 28px', fontFamily: 'var(--font-body)', fontWeight: 500,
                    transition: 'opacity 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Book This Offer
                  </button>
                </div>
              </div>

              {/* Responsive */}
              <style>{`
                @media(max-width:768px){
                  article { grid-template-columns: 1fr !important; }
                  article > div:first-child { order: 0 !important; min-height: 240px !important; }
                  article > div:last-child  { order: 1 !important; }
                }
              `}</style>
            </article>
          ))}
        </div>
      </section>

      {/* T&Cs note */}
      <section style={{ padding: '0 clamp(1.5rem,6vw,5rem) clamp(3rem,5vw,4rem)', maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.7 }}>
          All offers are subject to availability and valid for direct bookings only. Rates shown are per stay and may vary by room type and dates selected. Contact us for group bookings or customised packages.
        </p>
      </section>

    </div>
  );
}