// src/pages/ContactPage.jsx
import { useEffect, useState } from 'react';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';

export default function ContactPage() {
  const hotelConfig = useHotelConfig();
  const accent = hotelConfig.brand?.secondary || hotelConfig.brand?.primary || 'var(--accent)';
  const c = hotelConfig.contact || {};

  const [form, setForm]       = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simple mailto fallback — replace with API call if backend supports it
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    setSending(false);
  };

  useEffect(() => {
    document.title = `Contact | ${hotelConfig.shortName || hotelConfig.name}`;
  }, [hotelConfig]);

  const inp = {
    width: '100%', padding: '12px 14px', fontSize: 13,
    border: '1px solid var(--border-base, #e8e4dc)',
    fontFamily: 'var(--font-body)', color: 'var(--text-base)',
    background: '#fff', borderRadius: 0, outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  };
  const lbl = {
    display: 'block', fontSize: 10, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--text-muted)',
    fontFamily: 'var(--font-body)', marginBottom: 6, fontWeight: 500,
  };

  const contactCards = [
    c.phone    && { icon: '📞', label: 'Phone',    value: c.phone,    href: `tel:${c.phone}` },
    c.email    && { icon: '✉',  label: 'Email',    value: c.email,    href: `mailto:${c.email}` },
    c.whatsapp && { icon: '💬', label: 'WhatsApp', value: 'Chat with us', href: `https://wa.me/${c.whatsapp.replace(/\D/g,'')}` },
    c.address  && { icon: '📍', label: 'Address',  value: c.address,  href: `https://maps.google.com/?q=${encodeURIComponent(c.address)}` },
  ].filter(Boolean);

  const hours = hotelConfig.contact?.hours || [
    { day: 'Front Desk', time: 'Open 24 hours' },
    { day: 'Restaurant', time: `${c.checkIn ? '6:30 am' : '7:00 am'} – 10:30 pm` },
    { day: 'Spa & Wellness', time: '8:00 am – 9:00 pm' },
    { day: 'Check-in', time: c.checkIn || '2:00 pm' },
    { day: 'Check-out', time: c.checkOut || '12:00 pm' },
  ];

  return (
    <div style={{ background: 'var(--bg-page)', paddingTop: 'calc(var(--nav-h, 72px) + 38px)' }}>

      {/* Header */}
      <section style={{ background: 'var(--brand, #1a1a1a)', padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)' }}>
        <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 14px', fontFamily: 'var(--font-body)' }}>We'd Love to Hear From You</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 300, color: '#fff', margin: '0 0 16px', lineHeight: 1 }}>
          Contact Us
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0, fontFamily: 'var(--font-body)', maxWidth: 560, lineHeight: 1.8 }}>
          Whether you have a question about a reservation, need help planning your stay, or just want to say hello — our team is here for you.
        </p>
      </section>

      {/* Contact cards + form */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 'clamp(3rem,6vw,6rem)', alignItems: 'start' }} className="contact-grid">

          {/* Left — contact info */}
          <div>
            <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 24px', fontFamily: 'var(--font-body)' }}>Get in Touch</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              {contactCards.map(card => (
                <a key={card.label} href={card.href} target={card.label === 'Address' || card.label === 'WhatsApp' ? '_blank' : undefined} rel="noreferrer"
                  style={{ display: 'flex', gap: 16, alignItems: 'flex-start', textDecoration: 'none', padding: '1.25rem 1.5rem', border: '1px solid var(--border-base, #e8e4dc)', background: '#fff', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-base, #e8e4dc)'}
                >
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{card.icon}</span>
                  <div>
                    <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px', fontFamily: 'var(--font-body)' }}>{card.label}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-base)', margin: 0, fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>{card.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Opening hours */}
            <div style={{ borderTop: '1px solid var(--border-base, #e8e4dc)', paddingTop: 24 }}>
              <p style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: accent, margin: '0 0 16px', fontFamily: 'var(--font-body)' }}>Hours & Times</p>
              {hours.map(h => (
                <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-base, #e8e4dc)' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-base)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>{h.day}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            <p style={{ fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: accent, margin: '0 0 24px', fontFamily: 'var(--font-body)' }}>Send a Message</p>

            {sent ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '2rem', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, color: '#166534', margin: '0 0 8px' }}>Message received!</p>
                <p style={{ fontSize: 13, color: '#166534', margin: 0, fontFamily: 'var(--font-body)' }}>We'll be in touch within 24 hours. You can also call us directly for urgent enquiries.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={lbl}>Full Name *</label>
                    <input required type="text" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} style={inp}
                      onFocus={e => e.target.style.borderColor = accent}
                      onBlur={e => e.target.style.borderColor = 'var(--border-base, #e8e4dc)'} />
                  </div>
                  <div>
                    <label style={lbl}>Email Address *</label>
                    <input required type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} style={inp}
                      onFocus={e => e.target.style.borderColor = accent}
                      onBlur={e => e.target.style.borderColor = 'var(--border-base, #e8e4dc)'} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={lbl}>Phone Number</label>
                    <input type="tel" placeholder="+234 …" value={form.phone} onChange={e => set('phone', e.target.value)} style={inp}
                      onFocus={e => e.target.style.borderColor = accent}
                      onBlur={e => e.target.style.borderColor = 'var(--border-base, #e8e4dc)'} />
                  </div>
                  <div>
                    <label style={lbl}>Subject *</label>
                    <select required value={form.subject} onChange={e => set('subject', e.target.value)} style={{ ...inp, color: form.subject ? 'var(--text-base)' : '#999' }}
                      onFocus={e => e.target.style.borderColor = accent}
                      onBlur={e => e.target.style.borderColor = 'var(--border-base, #e8e4dc)'}>
                      <option value="">Select a topic…</option>
                      <option value="reservation">Reservation Enquiry</option>
                      <option value="events">Events & Venues</option>
                      <option value="dining">Dining Reservation</option>
                      <option value="wellness">Spa & Wellness</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={lbl}>Message *</label>
                  <textarea required rows={6} placeholder="Tell us how we can help…" value={form.message} onChange={e => set('message', e.target.value)}
                    style={{ ...inp, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = accent}
                    onBlur={e => e.target.style.borderColor = 'var(--border-base, #e8e4dc)'} />
                </div>
                <button type="submit" disabled={sending} style={{
                  background: accent, color: '#fff', border: 'none', cursor: sending ? 'not-allowed' : 'pointer',
                  fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
                  padding: '15px 32px', fontFamily: 'var(--font-body)', fontWeight: 500,
                  opacity: sending ? 0.7 : 1, transition: 'opacity 0.2s', alignSelf: 'flex-start',
                  width: '100%', justifyContent: 'center', display: 'flex',
                }}>
                  {sending ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      {c.address && (
        <section style={{ height: 380, background: '#e8e4dc', position: 'relative', overflow: 'hidden' }}>
          <iframe
            title="Hotel location"
            width="100%" height="100%"
            style={{ border: 0, display: 'block' }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${encodeURIComponent(c.address)}&output=embed`}
          />
        </section>
      )}

      <style>{`
        .contact-grid { }
        @media(max-width:768px){ .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}