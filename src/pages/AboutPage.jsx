// src/pages/AboutPage.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';

export default function AboutPage() {
  const hotelConfig = useHotelConfig();
  const accent = hotelConfig.brand?.secondary || hotelConfig.brand?.primary || 'var(--accent)';
  const about = hotelConfig.about || {};

  const heroImage   = about.heroImage   || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800&q=85&auto=format&fit=crop';
  const headline    = about.headline    || `About ${hotelConfig.name || 'Us'}`;
  const story       = about.story       || [
    `${hotelConfig.name || 'Our hotel'} was founded with a simple belief — that hospitality should be felt, not just delivered. From the very first day, our goal has been to create a space where every guest feels genuinely welcomed, cared for, and at home.`,
    'We designed every inch of this property with intention — from the quality of the linen to the temperature of the pool. Our team is chosen not just for skill, but for warmth. We believe the small things make the biggest difference.',
    'Today, we serve guests from all over the world — business travellers, families, honeymooners, and everyone in between. Whatever brings you here, we are committed to making your stay one you remember.',
  ];

  const values = about.values || [
    { title: 'Genuine Warmth',    body: 'Hospitality is a feeling. We hire for kindness first, and train for everything else.' },
    { title: 'Attention to Detail', body: 'Every request matters. Every preference is noted. Nothing is too small.' },
    { title: 'Local Pride',       body: 'We celebrate where we are — in our food, our design, our partnerships, and our people.' },
    { title: 'Continuous Improvement', body: 'We actively seek feedback and use it to get better — every day, every stay.' },
  ];

  const team = about.team || [
    { name: 'General Manager', role: 'Leads the property with 15 years in luxury hospitality across West Africa and Europe.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&face' },
    { name: 'Head of Guest Experience', role: 'Oversees every touchpoint from arrival to departure — ensuring consistency and warmth at every step.', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&q=80&auto=format&fit=crop&face' },
    { name: 'Executive Chef', role: 'Trained in Lagos and London, our chef brings local flavours to a contemporary kitchen.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop&face' },
  ];

  const stats = about.stats || [
    { value: hotelConfig.reviews?.count ? `${(hotelConfig.reviews.count / 1000).toFixed(0)}k+` : '5,000+', label: 'Guests welcomed' },
    { value: hotelConfig.reviews?.average ? `${hotelConfig.reviews.average.toFixed(1)}/5` : '4.8/5',         label: 'Average guest rating' },
    { value: '24/7',                                                                                          label: 'Concierge support' },
    { value: '100%',                                                                                          label: 'Direct booking guarantee' },
  ];

  useEffect(() => {
    document.title = `About | ${hotelConfig.shortName || hotelConfig.name}`;
  }, [hotelConfig]);

  return (
    <div style={{ background: 'var(--bg-page)', paddingTop: 'calc(var(--nav-h, 72px) + 38px)' }}>

      {/* Hero */}
      <section style={{ position: 'relative', height: 500, overflow: 'hidden' }}>
        <img src={heroImage} alt="About us" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 65%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'calc(var(--nav-h,72px) + 38px + 2rem) clamp(1.5rem,6vw,5rem) 4rem' }}>
          <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 14px', fontFamily: 'var(--font-body)' }}>Our Story</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 300, color: '#fff', margin: 0, lineHeight: 1, maxWidth: 700 }}>{headline}</h1>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: 'clamp(5rem,9vw,7rem) clamp(1.5rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(4rem,8vw,8rem)', alignItems: 'start' }} className="about-grid">
          <div>
            <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 16px', fontFamily: 'var(--font-body)' }}>Who We Are</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,3.5vw,3rem)', fontWeight: 300, lineHeight: 1.1, color: 'var(--text-base)', margin: '0 0 clamp(2rem,4vw,3rem)' }}>
              Built on the belief that <em style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>hospitality is a feeling.</em>
            </h2>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {stats.map(s => (
                <div key={s.label} style={{ borderTop: `3px solid ${accent}`, paddingTop: 16 }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.5rem)', fontWeight: 300, color: 'var(--text-base)', margin: '0 0 4px' }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            {story.map((para, i) => (
              <p key={i} style={{ fontSize: 14, lineHeight: 1.9, color: 'var(--text-sub)', margin: i < story.length - 1 ? '0 0 20px' : 0, fontFamily: 'var(--font-body)' }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: 'var(--bg-subtle, #f7f5f0)', padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 14px', fontFamily: 'var(--font-body)' }}>What Guides Us</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,3.5vw,3rem)', fontWeight: 300, lineHeight: 1.1, color: 'var(--text-base)', margin: '0 0 clamp(2.5rem,4vw,3.5rem)' }}>
            Our values.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
            {values.map((v, i) => (
              <div key={v.title}>
                <p style={{ fontFamily: 'ui-monospace,monospace', fontSize: 9, letterSpacing: '0.2em', color: accent, margin: '0 0 12px' }}>0{i + 1}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--text-base)', margin: '0 0 10px' }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.75, fontFamily: 'var(--font-body)' }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {team?.length > 0 && (
        <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 14px', fontFamily: 'var(--font-body)' }}>Our People</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,3.5vw,3rem)', fontWeight: 300, lineHeight: 1.1, color: 'var(--text-base)', margin: '0 0 clamp(2.5rem,4vw,3.5rem)' }}>
              The team behind your experience.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
              {team.map((m, i) => (
                <div key={i}>
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden', marginBottom: 20 }}>
                    <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 400, color: 'var(--text-base)', margin: '0 0 6px' }}>{m.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.75, fontFamily: 'var(--font-body)' }}>{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: accent, padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, color: '#fff', margin: '0 0 24px' }}>Come and experience it.</h2>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/book" style={{ display: 'inline-flex', alignItems: 'center', background: '#fff', color: '#111', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '14px 32px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            Book a Room
          </Link>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '14px 32px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            Get in Touch
          </Link>
        </div>
      </section>

      <style>{`.about-grid { @media(max-width:768px){ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}