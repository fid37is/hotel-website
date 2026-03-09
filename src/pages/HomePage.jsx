// hotel-website/src/pages/HomePage.jsx
// HMS Design System v1 — "Negative Space Luxury"
// Fully driven by hotelConfig. One footer. Zero clutter.

import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';
import { roomsApi } from '../services/api.js';

const FALLBACK_HERO = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800&q=90&auto=format&fit=crop';
const FALLBACK_ROOMS = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=900&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80&auto=format&fit=crop',
];

const fmt = (n) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format((n || 0) / 100);

export default function HomePage() {
  const hotelConfig  = useHotelConfig();
  const navigate     = useNavigate();
  const [rooms,      setRooms]      = useState([]);
  const [roomsReady, setRoomsReady] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const scrollRef    = useRef(null);

  const accent = hotelConfig.primaryColor || '#c9a96e';
  const heroImg = hotelConfig.heroImage || FALLBACK_HERO;

  useEffect(() => {
    document.title = hotelConfig.seo?.defaultTitle || hotelConfig.name;
    roomsApi.getTypes()
      .then(r => setRooms((r.data || []).slice(0, 6)))
      .catch(() => {})
      .finally(() => setRoomsReady(true));
  }, []);

  // Split tagline: last word gets accent treatment
  const words = (hotelConfig.tagline || 'Where Luxury Lives').split(' ');
  const lastWord = words.pop();
  const restWords = words.join(' ');

  const scrollRooms = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 420, behavior: 'smooth' });
  };

  return (
    <>
      {/* ── DESIGN SYSTEM CSS VARS ─────────────────────────────────────── */}
      <style>{`
        :root {
          --accent: ${accent};
          --light: #faf9f7;
          --dark: #0c0c0c;
          --mid: #1a1a1a;
          --muted: rgba(255,255,255,0.35);
          --muted-dark: rgba(0,0,0,0.35);
          --font-display: 'Cormorant Garamond', 'Cormorant', Georgia, serif;
        }

        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

        .hms-page { background: var(--dark); }

        /* Hero */
        @keyframes slowReveal {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Room scroll */
        .rooms-scroll {
          display: flex;
          gap: 3px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          cursor: grab;
        }
        .rooms-scroll:active { cursor: grabbing; }
        .rooms-scroll::-webkit-scrollbar { display: none; }
        .room-card {
          flex: 0 0 380px;
          scroll-snap-align: start;
          position: relative;
          overflow: hidden;
          aspect-ratio: 3/4;
          cursor: pointer;
        }
        @media (max-width: 640px) {
          .room-card { flex: 0 0 85vw; }
        }
        .room-card img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.9s cubic-bezier(0.16,1,0.3,1);
          display: block;
        }
        .room-card:hover img { transform: scale(1.06); }
        .room-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%);
        }
        .room-card-body {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 28px 24px;
        }
        .room-card-name {
          font-family: var(--font-display);
          font-size: 22px; font-weight: 300;
          color: #fff; line-height: 1.2;
          margin: 0 0 6px;
        }
        .room-card-rate {
          font-size: 13px;
          color: var(--accent);
        }
        .room-card-cta {
          position: absolute; top: 20px; right: 20px;
          width: 36px; height: 36px;
          border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity 0.3s, border-color 0.3s;
        }
        .room-card:hover .room-card-cta {
          opacity: 1;
          border-color: var(--accent);
        }

        /* Section label */
        .section-label {
          font-size: 9px;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--accent);
          display: block;
          margin-bottom: 16px;
        }

        /* Divider line */
        .accent-line {
          width: 32px; height: 1px;
          background: var(--accent);
          display: block;
        }

        /* Story section */
        .story-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.16,1,0.3,1);
        }
        .story-panel:hover .story-img {
          transform: scale(1.03);
        }
      `}</style>

      <div className="hms-page">

        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section style={{
          position: 'relative',
          height: '100svh', minHeight: 640,
          marginTop: 'calc(var(--nav-h, 72px) * -1)',
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Photo */}
          <img
            src={heroImg}
            alt=""
            onLoad={() => setHeroLoaded(true)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              animation: heroLoaded ? 'slowReveal 2s ease-out forwards' : 'none',
              opacity: heroLoaded ? 1 : 0,
            }}
          />

          {/* Vignette — subtle, not dramatic */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.65) 100%)',
          }} />

          {/* Centered hero text */}
          <div style={{
            position: 'relative', zIndex: 2,
            textAlign: 'center',
            padding: '0 clamp(1.5rem, 6vw, 4rem)',
          }}>
            {/* Hotel name — small, spaced */}
            <span className="section-label" style={{
              color: 'rgba(255,255,255,0.5)',
              animation: 'fadeUp 0.8s 0.3s both',
            }}>
              {hotelConfig.name}
            </span>

            {/* Tagline — large serif, last word in accent */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 9vw, 8rem)',
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: '-0.01em',
              color: '#fff',
              margin: '0 0 clamp(2rem, 5vh, 3.5rem)',
              animation: 'fadeUp 0.9s 0.5s both',
            }}>
              {restWords}{' '}
              <em style={{ color: accent, fontStyle: 'italic' }}>{lastWord}</em>
            </h1>

            {/* Two CTAs */}
            <div style={{
              display: 'flex', gap: 16,
              justifyContent: 'center', flexWrap: 'wrap',
              animation: 'fadeUp 0.8s 0.8s both',
            }}>
              <Link to="/book" style={{
                display: 'inline-flex', alignItems: 'center',
                background: accent, color: '#fff',
                fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
                padding: '14px 36px',
                transition: 'opacity 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
              >
                Reserve
              </Link>
              <Link to="/rooms" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                color: 'rgba(255,255,255,0.6)',
                fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '14px 28px',
                transition: 'color 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              >
                Explore Rooms
              </Link>
            </div>
          </div>

          {/* Bottom-left location */}
          <div style={{
            position: 'absolute', bottom: 32, left: 'clamp(1.5rem,5vw,4rem)',
            animation: 'fadeUp 0.8s 1s both',
          }}>
            <span style={{
              fontSize: 9, letterSpacing: '0.4em',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
            }}>
              {hotelConfig.contact?.address?.split(',').slice(-2).join(',').trim()}
            </span>
          </div>

          {/* Bottom-right scroll hint */}
          <div style={{
            position: 'absolute', bottom: 28, right: 'clamp(1.5rem,5vw,4rem)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            animation: 'fadeUp 0.8s 1.2s both',
          }}>
            <div style={{
              width: 1, height: 52,
              background: 'rgba(255,255,255,0.12)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(255,255,255,0.45)',
                animation: 'fadeUp 2s ease-in-out infinite',
              }} />
            </div>
          </div>
        </section>

        {/* ── INTRO — light section ───────────────────────────────────────── */}
        <section style={{
          background: 'var(--light)',
          padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,6vw,5rem)',
        }}>
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(3rem, 8vw, 8rem)',
              alignItems: 'end',
            }}>
              {/* Left — big editorial statement */}
              <div>
                <span className="section-label" style={{ color: accent }}>
                  {hotelConfig.name}
                </span>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontWeight: 300,
                  lineHeight: 1.15,
                  color: '#0c0c0c',
                  margin: 0,
                }}>
                  {hotelConfig.description?.split('.')[0] || 'A curated collection of spaces designed for those who seek more than accommodation.'}
                  <em style={{ fontStyle: 'italic', color: 'rgba(0,0,0,0.4)' }}>.</em>
                </p>
              </div>

              {/* Right — two details + CTA */}
              <div style={{ paddingBottom: 4 }}>
                <p style={{
                  fontSize: 13, lineHeight: 1.9,
                  color: 'rgba(0,0,0,0.45)',
                  marginBottom: 40,
                  maxWidth: 380,
                }}>
                  {hotelConfig.description || 'Every space is a sanctuary. Every moment is considered. Discover what it means to stay somewhere that remembers you.'}
                </p>
                <Link to="/rooms" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 16,
                  fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
                  color: '#0c0c0c',
                  transition: 'gap 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.gap = '24px'}
                  onMouseLeave={e => e.currentTarget.style.gap = '16px'}
                >
                  View Rooms
                  <span style={{ display: 'inline-block', width: 28, height: 1, background: '#0c0c0c' }} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── ROOMS — dark, horizontal scroll ────────────────────────────── */}
        <section style={{ background: 'var(--dark)', paddingTop: 'clamp(4rem,8vw,7rem)' }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            padding: '0 clamp(1.5rem,6vw,5rem)',
            marginBottom: 'clamp(2rem,4vw,3rem)',
          }}>
            <div>
              <span className="section-label">Accommodation</span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem,3.5vw,3rem)',
                fontWeight: 300,
                color: '#fff',
                margin: 0, lineHeight: 1,
              }}>
                Rooms &amp; Suites
              </h2>
            </div>

            {/* Scroll arrows — desktop */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[['‹', -1], ['›', 1]].map(([arrow, dir]) => (
                <button
                  key={dir}
                  onClick={() => scrollRooms(dir)}
                  style={{
                    width: 44, height: 44,
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'none', color: 'rgba(255,255,255,0.4)',
                    fontSize: 20, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                >
                  {arrow}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable strip — bleeds to edges */}
          <div
            ref={scrollRef}
            className="rooms-scroll"
            style={{ padding: '0 clamp(1.5rem,6vw,5rem) clamp(4rem,8vw,7rem)' }}
          >
            {!roomsReady
              ? [0,1,2,3].map(i => (
                <div key={i} className="room-card" style={{ background: '#1a1a1a' }} />
              ))
              : rooms.map((room, i) => {
                const img = (() => {
                  const m = (room.media || []).find(x => x.type === 'image');
                  return m?.url || FALLBACK_ROOMS[i % FALLBACK_ROOMS.length];
                })();
                return (
                  <article
                    key={room.id}
                    className="room-card"
                    onClick={() => navigate(`/rooms/${room.id}`)}
                  >
                    <img src={img} alt={room.name} loading="lazy" />
                    <div className="room-card-overlay" />
                    <div className="room-card-body">
                      <h3 className="room-card-name">{room.name}</h3>
                      {room.base_rate && (
                        <p className="room-card-rate">
                          From {fmt(room.base_rate)} / night
                        </p>
                      )}
                    </div>
                    <div className="room-card-cta">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 10L10 2M10 2H4M10 2V8" stroke={accent} strokeWidth="1.2"/>
                      </svg>
                    </div>
                  </article>
                );
              })
            }

            {/* "View all" end card */}
            <Link
              to="/rooms"
              className="room-card"
              style={{
                background: '#111',
                border: `1px solid rgba(255,255,255,0.06)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                textDecoration: 'none',
                transition: 'border-color 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <span style={{ display: 'block', width: 36, height: 1, background: accent }} />
              <span style={{
                fontSize: 10, letterSpacing: '0.35em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
              }}>
                All Rooms
              </span>
            </Link>
          </div>
        </section>

        {/* ── STORY — light, asymmetric ────────────────────────────────────── */}
        <section style={{
          background: 'var(--light)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: 600,
        }} className="story-section">
          <style>{`.story-section { } @media(max-width:768px){ .story-section { grid-template-columns: 1fr !important; } }`}</style>

          {/* Photo panel */}
          <div
            className="story-panel"
            style={{ position: 'relative', overflow: 'hidden', minHeight: 400 }}
          >
            <img
              className="story-img"
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85&auto=format&fit=crop"
              alt="The experience"
            />
            {/* Accent line overlay — bottom left */}
            <div style={{
              position: 'absolute', bottom: 40, left: 40,
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <span style={{
                display: 'block', width: 1, height: 48,
                background: accent,
              }} />
            </div>
          </div>

          {/* Copy panel */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(3rem,7vw,6rem) clamp(2.5rem,6vw,5rem)',
          }}>
            <span className="section-label" style={{ color: accent }}>The Experience</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem,3.5vw,3rem)',
              fontWeight: 300,
              color: '#0c0c0c',
              lineHeight: 1.1,
              margin: '0 0 clamp(1.5rem,3vw,2.5rem)',
            }}>
              Every detail,<br />
              <em style={{ color: 'rgba(0,0,0,0.35)' }}>considered.</em>
            </h2>
            <p style={{
              fontSize: 13, lineHeight: 1.9,
              color: 'rgba(0,0,0,0.45)',
              maxWidth: 380,
              margin: '0 0 clamp(2rem,4vw,3rem)',
            }}>
              From the thread count of the linen to the temperature of the pool — we obsess over every detail so that you never have to think about anything except enjoying yourself.
            </p>

            {/* Three quiet pillars */}
            {[
              ['Dining',    'West African cuisine, contemporary kitchen'],
              ['Wellness',  'Spa, pool, restorative treatments'],
              ['Concierge', 'Private transfers, curated city experiences'],
            ].map(([title, sub], i) => (
              <div key={title} style={{
                display: 'flex', gap: 20, alignItems: 'flex-start',
                padding: '16px 0',
                borderTop: i === 0 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
              }}>
                <span style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 9, letterSpacing: '0.2em',
                  color: accent, paddingTop: 2, flexShrink: 0,
                }}>
                  0{i + 1}
                </span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#0c0c0c', margin: '0 0 2px' }}>{title}</p>
                  <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', margin: 0 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── RESERVE CTA — full bleed, accent color ──────────────────────── */}
        <section style={{
          background: accent,
          padding: 'clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem)',
        }}>
          <div style={{
            maxWidth: 1300, margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '3rem',
          }}>
            <div>
              <p style={{
                fontSize: 9, letterSpacing: '0.45em',
                textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.4)',
                margin: '0 0 16px',
              }}>
                Direct booking · Best rate guaranteed
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem,5vw,4.5rem)',
                fontWeight: 300,
                color: '#0c0c0c',
                lineHeight: 0.95,
                margin: 0,
              }}>
                Begin your<br /><em>stay.</em>
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end' }}>
              <Link to="/book" style={{
                display: 'inline-flex', alignItems: 'center',
                background: '#0c0c0c', color: '#fff',
                fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
                padding: '16px 44px',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Reserve Now
              </Link>
              {hotelConfig.contact?.phone && (
                <a href={`tel:${hotelConfig.contact.phone}`} style={{
                  fontSize: 11, letterSpacing: '0.1em',
                  color: 'rgba(0,0,0,0.45)',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#0c0c0c'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.45)'}
                >
                  {hotelConfig.contact.phone}
                </a>
              )}
            </div>
          </div>
        </section>



      </div>
    </>
  );
}