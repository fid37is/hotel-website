// src/pages/EventsPage.jsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';
import { eventsApi } from '../services/api.js';

const EVENT_TYPES = [
  { value: 'conference',   label: 'Conference / Meeting' },
  { value: 'wedding',      label: 'Wedding' },
  { value: 'birthday',     label: 'Birthday / Private Party' },
  { value: 'gala',         label: 'Gala / Corporate Dinner' },
  { value: 'workshop',     label: 'Workshop / Training' },
  { value: 'funeral',      label: 'Funeral / Memorial' },
  { value: 'other',        label: 'Other' },
];

const SPACES = [
  {
    id: 'ballroom',
    name: 'Grand Ballroom',
    tag: 'Weddings & Galas',
    capacity: '50 – 500 guests',
    description: 'Our flagship venue — soaring ceilings, crystal chandeliers, and a dedicated bridal suite. Configurable for banquets, receptions, or theatre-style presentations.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'boardroom',
    name: 'Executive Boardroom',
    tag: 'Meetings & Conferences',
    capacity: '8 – 30 guests',
    description: 'A sleek, tech-equipped boardroom with 4K screen, video conferencing, and catering service. Ideal for executive meetings, board sessions, and strategy offsites.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'conference',
    name: 'Conference Hall',
    tag: 'Corporate Events',
    capacity: '30 – 200 guests',
    description: 'Flexible hall divisible into breakout rooms. Full AV setup, natural light, and direct access to outdoor terrace. Perfect for seminars, product launches, and training.',
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'garden',
    name: 'Garden Terrace',
    tag: 'Outdoor Celebrations',
    capacity: '20 – 150 guests',
    description: 'A lush, open-air terrace wrapped in tropical greenery. Magical at dusk with string lighting. Ideal for cocktail receptions, outdoor ceremonies, and private dinners.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80&auto=format&fit=crop',
  },
];

const PACKAGES = [
  {
    name: 'Half-Day Meeting',
    tag: 'Corporate',
    includes: ['Up to 4 hours', 'AV equipment', 'Coffee & refreshments', 'Stationery & notepad'],
  },
  {
    name: 'Full-Day Conference',
    tag: 'Corporate',
    includes: ['8 hours access', 'Full AV & projector', 'Buffet lunch', 'Morning & afternoon tea', 'On-site coordinator'],
  },
  {
    name: 'Wedding Package',
    tag: 'Celebration',
    includes: ['Venue for 8–12 hours', 'Dedicated events manager', 'Table décor & setup', 'Welcome drinks', 'Catering options available'],
  },
  {
    name: 'Private Dinner',
    tag: 'Celebration',
    includes: ['3-course set menu', 'Private dining room', 'Dedicated waiter', 'Wine & beverage service', 'Customisable menu'],
  },
];

export default function EventsPage() {
  const hotelConfig = useHotelConfig();
  const [searchParams] = useSearchParams();
  const accent = hotelConfig.brand?.secondary || hotelConfig.brand?.primary || '#c9a96e';

  // Form state — pre-fill from URL params if coming from homepage
  const [form, setForm] = useState({
    event_type:    searchParams.get('type')  || '',
    event_date:    searchParams.get('date')  || '',
    start_time:    searchParams.get('start') || '',
    end_time:      searchParams.get('end')   || '',
    guest_count:   searchParams.get('guests')|| '',
    client_name:   '',
    client_email:  '',
    client_phone:  '',
    special_requests: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState('');

  useEffect(() => {
    document.title = `Events & Venues | ${hotelConfig.shortName || hotelConfig.name}`;
  }, [hotelConfig]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      await eventsApi.submitEnquiry({
        ...form,
        guest_count: form.guest_count ? parseInt(form.guest_count) : 0,
        title: `${EVENT_TYPES.find(t => t.value === form.event_type)?.label || 'Event'} Enquiry`,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to submit. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const inp = {
    width: '100%', padding: '10px 12px',
    background: 'var(--bg-surface, #fff)',
    border: '1px solid var(--border-base, #e8e4dc)',
    borderRadius: 2, fontSize: 13,
    color: 'var(--text-base, #1a1a1a)',
    fontFamily: 'inherit', outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ background: 'var(--bg-page, #fafaf8)', minHeight: '100vh', paddingTop: 'calc(var(--nav-h, 72px) + 38px)' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: 480, overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&q=85&auto=format&fit=crop"
          alt="Events at the hotel"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,6vw,5rem)', maxWidth: 800 }}>
          <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, marginBottom: 14, fontFamily: 'var(--font-body)' }}>
            Events & Venues
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 300, color: '#fff', lineHeight: 1, margin: '0 0 16px' }}>
            Unforgettable moments,<br /><em style={{ color: 'rgba(255,255,255,0.65)' }}>flawlessly hosted.</em>
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.8, fontFamily: 'var(--font-body)' }}>
            From intimate boardroom meetings to grand ballroom weddings — our dedicated events team handles every detail.
          </p>
        </div>
      </section>

      {/* ── SUCCESS MESSAGE ───────────────────────────────────────────────── */}
      {submitted && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '2rem clamp(1.5rem,6vw,5rem)', textAlign: 'center' }}>
          <p style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 300, color: '#166534', margin: '0 0 8px' }}>
            Enquiry received — thank you!
          </p>
          <p style={{ fontSize: 13, color: '#166534', margin: '0 0 16px', fontFamily: 'var(--font-body)' }}>
            Our events team will contact you within 24 hours to discuss your requirements.
          </p>
          <Link to="/" style={{ fontSize: 12, color: '#166534', textDecoration: 'underline', fontFamily: 'var(--font-body)' }}>
            Back to home
          </Link>
        </div>
      )}

      {/* ── SPACES GRID ──────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)', background: '#0c0c0c' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, marginBottom: 14, fontFamily: 'var(--font-body)' }}>
            Our Venues
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 300, color: '#fff', margin: '0 0 clamp(2.5rem,5vw,4rem)', lineHeight: 1.1 }}>
            Spaces for every occasion.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
            {SPACES.map((space) => (
              <article key={space.id} style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/5', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.querySelector('img').style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.querySelector('img').style.transform = 'scale(1)'}
              >
                <img src={space.image} alt={space.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1)', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.75rem 1.5rem' }}>
                  <span style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, display: 'block', marginBottom: 6, fontFamily: 'var(--font-body)' }}>
                    {space.tag} · {space.capacity}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 300, color: '#fff', margin: '0 0 8px' }}>
                    {space.name}
                  </h3>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
                    {space.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ─────────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)', background: 'var(--bg-page, #fafaf8)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, marginBottom: 14, fontFamily: 'var(--font-body)' }}>
            Packages
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 300, color: '#0c0c0c', margin: '0 0 clamp(2rem,4vw,3.5rem)', lineHeight: 1.1 }}>
            Everything included,<br /><em style={{ color: 'rgba(0,0,0,0.35)' }}>nothing overlooked.</em>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {PACKAGES.map((pkg) => (
              <div key={pkg.name} style={{ border: '1px solid var(--border-base, #e8e4dc)', padding: '1.75rem 1.5rem', background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: accent, fontFamily: 'var(--font-body)' }}>
                  {pkg.tag}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 400, color: '#0c0c0c', margin: 0 }}>
                  {pkg.name}
                </h3>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                  {pkg.includes.map(item => (
                    <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12, color: 'var(--text-muted, #6b6b6b)', fontFamily: 'var(--font-body)' }}>
                      <span style={{ color: accent, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => { document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                  style={{ marginTop: 4, alignSelf: 'flex-start', background: 'none', border: 'none', padding: 0, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0c0c0c', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-body)' }}
                >
                  Enquire <span style={{ display: 'inline-block', width: 20, height: 1, background: '#0c0c0c' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENQUIRY FORM ─────────────────────────────────────────────────── */}
      {!submitted && (
        <section id="enquiry-form" style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)', background: '#0c0c0c' }}>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, marginBottom: 14, fontFamily: 'var(--font-body)' }}>
              Send an Enquiry
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 300, color: '#fff', margin: '0 0 8px', lineHeight: 1.1 }}>
              Tell us about your event.
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 clamp(2rem,4vw,3rem)', fontFamily: 'var(--font-body)' }}>
              Our events team will respond within 24 hours with availability, pricing, and a tailored proposal.
            </p>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 16px', marginBottom: 24, fontSize: 13, fontFamily: 'var(--font-body)', borderRadius: 2 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Event details */}
              <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 16px', fontFamily: 'var(--font-body)' }}>
                Event Details
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.05em', fontFamily: 'var(--font-body)' }}>
                    Event Type *
                  </label>
                  <select required value={form.event_type} onChange={e => set('event_type', e.target.value)}
                    style={{ ...inp, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', color: form.event_type ? '#fff' : 'rgba(255,255,255,0.35)' }}>
                    <option value="">Select type…</option>
                    {EVENT_TYPES.map(t => <option key={t.value} value={t.value} style={{ color: '#fff', background: '#1a1a1a' }}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.05em', fontFamily: 'var(--font-body)' }}>
                    Event Date *
                  </label>
                  <input required type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ ...inp, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', colorScheme: 'dark' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.05em', fontFamily: 'var(--font-body)' }}>
                    Start Time *
                  </label>
                  <input required type="time" value={form.start_time} onChange={e => set('start_time', e.target.value)}
                    style={{ ...inp, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', colorScheme: 'dark' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.05em', fontFamily: 'var(--font-body)' }}>
                    End Time *
                  </label>
                  <input required type="time" value={form.end_time} onChange={e => set('end_time', e.target.value)}
                    style={{ ...inp, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', colorScheme: 'dark' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.05em', fontFamily: 'var(--font-body)' }}>
                    Expected Guests
                  </label>
                  <input type="number" min="1" placeholder="e.g. 80" value={form.guest_count} onChange={e => set('guest_count', e.target.value)}
                    style={{ ...inp, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }} />
                </div>
              </div>

              {/* Contact */}
              <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '24px 0 16px', fontFamily: 'var(--font-body)' }}>
                Your Contact Details
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.05em', fontFamily: 'var(--font-body)' }}>
                    Full Name *
                  </label>
                  <input required type="text" placeholder="Your name" value={form.client_name} onChange={e => set('client_name', e.target.value)}
                    style={{ ...inp, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.05em', fontFamily: 'var(--font-body)' }}>
                    Email Address *
                  </label>
                  <input required type="email" placeholder="you@example.com" value={form.client_email} onChange={e => set('client_email', e.target.value)}
                    style={{ ...inp, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.05em', fontFamily: 'var(--font-body)' }}>
                    Phone Number
                  </label>
                  <input type="tel" placeholder="+234 …" value={form.client_phone} onChange={e => set('client_phone', e.target.value)}
                    style={{ ...inp, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }} />
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.05em', fontFamily: 'var(--font-body)' }}>
                  Special Requests / Additional Notes
                </label>
                <textarea rows={4} placeholder="Catering preferences, décor, AV needs, accessibility requirements…"
                  value={form.special_requests} onChange={e => set('special_requests', e.target.value)}
                  style={{ ...inp, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', resize: 'vertical' }} />
              </div>

              <button type="submit" disabled={submitting} style={{
                width: '100%', padding: '15px 24px', textAlign: 'center',
                background: accent, color: '#0c0c0c', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
                fontFamily: 'var(--font-body)', opacity: submitting ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}>
                {submitting ? 'Submitting…' : 'Send Enquiry'}
              </button>

              <p style={{ marginTop: 16, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>
                Or call us directly: <a href={`tel:${hotelConfig.contact?.phone}`} style={{ color: 'rgba(255,255,255,0.5)' }}>{hotelConfig.contact?.phone}</a>
              </p>
            </form>
          </div>
        </section>
      )}

    </div>
  );
}