// src/components/layout/Layout.jsx
import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useGuestAuth } from '../../hooks/useGuestAuth.jsx';
import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';
import { useFmt } from '../../utils/currency.js';
import { DEFAULT_LAYOUT } from '../../config/theme.js';
import { roomsApi } from '../../services/api.js';
import { Instagram, Facebook, Twitter, MessageCircle, User, MapPin, Phone } from 'lucide-react';
import NotificationBell from './NotificationBell.jsx';

// ── Rooms dropdown ────────────────────────────────────────────────────────────
function RoomsDropdown({ textColor, isTransparent }) {
  const fmt = useFmt();
  const [open, setOpen] = useState(false);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const ref = useRef(null);
  const closeTimer = useRef(null);

  // Fetch room types once on first hover
  const fetchTypes = () => {
    if (fetched) return;
    setLoading(true);
    roomsApi.getTypes()
      .then(res => setTypes(res.data || []))
      .catch(() => { })
      .finally(() => { setLoading(false); setFetched(true); });
  };

  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    fetchTypes();
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  // Close on outside click (for touch devices)
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const linkStyle = {
    fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 500,
    textDecoration: 'none', padding: '6px 2px', position: 'relative',
    letterSpacing: '0.02em', transition: 'color 0.2s',
    color: textColor, display: 'flex', alignItems: 'center', gap: 4,
    background: 'none', border: 'none', cursor: 'pointer',
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>

      {/* Trigger */}
      <Link
        to="/rooms"
        style={linkStyle}
        onMouseEnter={e => e.currentTarget.style.color = isTransparent ? '#fff' : 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.color = textColor}
      >
        Rooms
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          width="10" height="10"
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </Link>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 12px)', left: '50%',
          transform: 'translateX(-50%)',
          minWidth: 220,
          background: 'var(--bg-surface, #fff)',
          border: '1px solid var(--border-base, #e8e4dc)',
          borderRadius: 8,
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
          zIndex: 200,
          overflow: 'hidden',
          // Small arrow
        }}>
          {/* Arrow */}
          <div style={{
            position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)',
            width: 12, height: 12, background: 'var(--bg-surface, #fff)',
            border: '1px solid var(--border-base, #e8e4dc)',
            borderBottom: 'none', borderRight: 'none',
            rotate: '45deg',
          }} />

          {/* Header */}
          <div style={{
            padding: '10px 16px 8px',
            borderBottom: '1px solid var(--border-base, #e8e4dc)',
          }}>
            <p style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.25em',
              textTransform: 'uppercase', color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)', margin: 0,
            }}>
              Room Types
            </p>
          </div>

          {/* Room type list */}
          <div style={{ padding: '6px 0' }}>
            {loading ? (
              // Skeleton
              [1, 2, 3].map(i => (
                <div key={i} style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ height: 10, width: '60%', background: 'var(--border-base)', borderRadius: 2 }} />
                  <div style={{ height: 8, width: '40%', background: 'var(--border-base)', borderRadius: 2, opacity: 0.6 }} />
                </div>
              ))
            ) : types.length === 0 ? (
              <p style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: 0 }}>
                No room types available
              </p>
            ) : (
              types.map(type => (
                <Link
                  key={type.id}
                  to={`/rooms?type=${type.id}`}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 16px', textDecoration: 'none',
                    transition: 'background 0.15s',
                    gap: 12,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-subtle, #f7f5f0)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontSize: 13, fontWeight: 500, color: 'var(--text-base)',
                      fontFamily: 'var(--font-body)', margin: 0, lineHeight: 1.3,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {type.name}
                    </p>
                    {type.base_rate && (
                      <p style={{
                        fontSize: 11, color: 'var(--accent)',
                        fontFamily: 'var(--font-body)', margin: '2px 0 0',
                      }}>
                        From {fmt(type.base_rate)} / night
                      </p>
                    )}
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"
                    width="12" height="12" style={{ flexShrink: 0, opacity: 0.5 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))
            )}
          </div>

          {/* Footer — view all */}
          <div style={{ borderTop: '1px solid var(--border-base, #e8e4dc)', padding: '8px 16px' }}>
            <Link
              to="/rooms"
              onClick={() => setOpen(false)}
              style={{
                fontSize: 11, fontWeight: 600, color: 'var(--accent)',
                textDecoration: 'none', fontFamily: 'var(--font-body)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              View All Rooms
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                width="10" height="10">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const hotelConfig = useHotelConfig();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, guest, logout } = useGuestAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setMenuOpen(false); }, [location]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navStyleKey = hotelConfig.layout?.nav_style || DEFAULT_LAYOUT.nav_style;
  const isTransparent = navStyleKey === 'transparent_scroll' && isHome && !scrolled;

  const { contact = {}, social = {}, features = {} } = hotelConfig;
  const hasSocial = social?.instagram || social?.facebook || social?.twitter;

  const topBarBg = isTransparent ? 'rgba(0,0,0,0.45)' : 'var(--brand)';
  const mainNavBg = isTransparent ? 'transparent' : 'var(--bg-surface, #fff)';
  const mainTextCol = isTransparent ? 'rgba(255,255,255,0.9)' : 'var(--text-base)';
  const mainTextMuted = isTransparent ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)';
  const logoBrightness = isTransparent ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.6)) drop-shadow(0 0 2px rgba(0,0,0,0.4))' : 'none';

  const NAV_LINKS = [
    ['/', 'Home'],
    ['/events', 'Events'],
    ['/about', 'About Us'],
    ['/contact', 'Contact'],
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .topbar      { display: flex; }
        .nav-links   { display: flex; }
        .nav-link    { font-size: 13px; font-family: var(--font-body); font-weight: 500; text-decoration: none; padding: 6px 2px; position: relative; letter-spacing: 0.02em; transition: color 0.2s; }
        .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--accent); transform: scaleX(0); transition: transform 0.25s; transform-origin: left; }
        .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; }

        @media(max-width: 900px) {
          .topbar      { display: none !important; }
          .nav-links   { display: none !important; }
          .nav-icons   { display: none !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
        }
        @media(max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── TOP BAR ─────────────────────────────────────────────────────────── */}
      <div className="topbar" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 51,
        background: topBarBg,
        backdropFilter: isTransparent ? 'blur(6px)' : 'none',
        transition: 'background 0.4s',
        height: 38,
        alignItems: 'center',
        padding: '0 clamp(1.5rem,3.5vw,3rem)',
        gap: 24,
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
          {contact.address && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}>
              <MapPin size={12} />{contact.address}
            </span>
          )}
          {contact.phone && (
            <a href={"tel:" + contact.phone} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
              <Phone size={12} />{contact.phone}
            </a>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/manage-booking" style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500, letterSpacing: '0.05em', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}>Booking Now</Link>
          <Link to="/rooms" style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontFamily: 'var(--font-body)', letterSpacing: '0.05em', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}>About Us</Link>
          {hasSocial && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: 20 }}>
              {social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}><Facebook size={15} /></a>}
              {social.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}><Twitter size={15} /></a>}
              {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s', display: 'flex' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}><Instagram size={15} /></a>}
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN NAVBAR ─────────────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 38, left: 0, right: 0, zIndex: 50,
        height: 'var(--nav-h, 72px)',
        background: mainNavBg,
        borderBottom: isTransparent ? 'none' : '1px solid rgba(0,0,0,0.07)',
        transition: 'background 0.4s, border-color 0.4s, top 0.4s',
        backdropFilter: !isTransparent ? 'blur(12px)' : 'none',
      }}>
        <div style={{
          width: '100%', height: '100%',
          display: 'grid', gridTemplateColumns: 'auto 1fr',
          alignItems: 'center',
          padding: '0 clamp(1.5rem,3.5vw,3rem)',
          boxSizing: 'border-box', gap: 32,
        }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            {hotelConfig.logoUrl && (
              <img src={hotelConfig.logoUrl} alt={hotelConfig.name}
                style={{ height: 42, width: 'auto', objectFit: 'contain', filter: logoBrightness, transition: 'filter 0.4s' }} />
            )}
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: mainTextCol, margin: 0, lineHeight: 1.2, transition: 'color 0.4s', whiteSpace: 'nowrap' }}>
                {hotelConfig.name || 'Cierlo'}
              </p>
              {hotelConfig.tagline && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.08em', color: mainTextMuted, margin: 0, textTransform: 'uppercase', transition: 'color 0.4s' }}>
                  {hotelConfig.shortName || ''}
                </p>
              )}
            </div>
          </Link>

          {/* Nav links */}
          <div className="nav-links" style={{ justifyContent: 'flex-end', alignItems: 'center', gap: 32 }}>

            {/* Static nav links — Rooms removed, replaced by dropdown below */}
            {NAV_LINKS.map(([path, label]) => (
              <a key={path} href={path}
                className={'nav-link' + (location.pathname === path.split('#')[0] ? ' active' : '')}
                style={{ color: mainTextCol, transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = isTransparent ? '#fff' : 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = mainTextCol}>
                {label}
              </a>
            ))}

            {/* Rooms dropdown — replaces the old plain Rooms link */}
            <RoomsDropdown textColor={mainTextCol} isTransparent={isTransparent} />

            {/* Divider */}
            <span style={{ width: 1, height: 18, background: mainTextMuted, opacity: 0.4 }} />

            {/* Notification bell */}
            {isLoggedIn && <NotificationBell textColor={mainTextCol} />}

            {/* User icon */}
            <div style={{ position: 'relative' }} className="nav-icons user-icon-wrap">
              <Link
                to={isLoggedIn ? '/account' : '/login'}
                style={{ color: mainTextCol, display: 'flex', alignItems: 'center', gap: 7, padding: 4, transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = isTransparent ? '#fff' : 'var(--accent)';
                  const tip = e.currentTarget.parentNode.querySelector('.user-tooltip');
                  if (tip) tip.style.opacity = '1';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = mainTextCol;
                  const tip = e.currentTarget.parentNode.querySelector('.user-tooltip');
                  if (tip) tip.style.opacity = '0';
                }}
              >
                <User size={18} />
                {isLoggedIn && (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {guest?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                )}
              </Link>
              {isLoggedIn && (
                <div className="user-tooltip" style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  background: 'var(--bg-surface, #fff)', color: 'var(--text-base, #111)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)', padding: '10px 16px',
                  fontSize: 12, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
                  opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none',
                  zIndex: 100, borderTop: '2px solid var(--accent)',
                }}>
                  {guest?.full_name || 'My Account'}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button type="button" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 4px', display: 'none', flexDirection: 'column', gap: 5 }}
              className="mob-hamburger">
              <span style={{ display: 'block', width: 22, height: 1.5, background: mainTextCol, transition: 'transform 0.35s', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none', borderRadius: 1 }} />
              <span style={{ display: 'block', width: 22, height: 1.5, background: mainTextCol, transition: 'opacity 0.25s', opacity: menuOpen ? 0 : 1, borderRadius: 1 }} />
              <span style={{ display: 'block', width: 22, height: 1.5, background: mainTextCol, transition: 'transform 0.35s', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none', borderRadius: 1 }} />
            </button>
          </div>
        </div>
      </header>

      <style>{`
        @media(max-width:900px){
          .mob-hamburger { display: flex !important; }
          header { top: 0 !important; height: 64px !important; }
        }
      `}</style>

      {/* ── Mobile slide-in menu ─────────────────────────────────────────────── */}
      {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.4)' }} onClick={() => setMenuOpen(false)} />}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 'min(320px, 85vw)', background: 'var(--bg-page)',
        zIndex: 60, transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: menuOpen ? '4px 0 40px rgba(0,0,0,0.2)' : 'none',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-soft)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-base)' }}>{hotelConfig.name}</span>
          <button type="button" onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-muted)', lineHeight: 1 }}>✕</button>
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem 0' }}>
          {[['/', 'Home'], ['/rooms', 'Rooms & Suites'], ['/events', 'Events & Venues'], ['/offers', 'Special Offers'], ['/explore', 'Explore the Hotel'], ['/book', 'Book a Room'], ['/manage-booking', 'Manage Booking'], [isLoggedIn ? '/account' : '/login', isLoggedIn ? 'My Account' : 'Sign In']].map(([path, label]) => (
            <Link key={path} to={path} style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--text-base)', textDecoration: 'none', padding: '14px 24px', borderBottom: '1px solid var(--border-soft)', transition: 'color 0.2s, padding-left 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '32px'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-base)'; e.currentTarget.style.paddingLeft = '24px'; }}>
              {label}
            </Link>
          ))}
          {isLoggedIn && (
            <button type="button" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '16px 24px' }}>
              Sign Out
            </button>
          )}
        </nav>
        <div style={{ padding: '16px 24px 28px', borderTop: '1px solid var(--border-soft)' }}>
          {contact.phone && <a href={"tel:" + contact.phone} style={{ display: 'block', fontSize: 13, color: 'var(--accent)', textDecoration: 'none', marginBottom: 6, fontFamily: 'var(--font-body)' }}>{contact.phone}</a>}
          {contact.address && <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>{contact.address}</p>}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer style={{
        background: '#0f1929',
        color: 'rgba(255,255,255,0.75)',
        fontFamily: 'var(--font-body)',
      }}>
        {/* Main footer grid */}
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: 'clamp(3rem,6vw,5rem) clamp(2rem,6vw,5rem) clamp(2rem,4vw,3rem)',
        }}>
          <div className="footer-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr 1fr 1.2fr',
            gap: 'clamp(2rem,4vw,4rem)',
            alignItems: 'start',
          }}>

            {/* Col 1 — Brand */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Logo + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {hotelConfig.logoUrl && (
                  <img
                    src={hotelConfig.logoUrl}
                    alt={hotelConfig.name}
                    style={{ height: 44, width: 'auto', objectFit: 'contain' }}
                  />
                )}
                <span style={{
                  fontSize: 18, fontWeight: 700, color: '#fff',
                  fontFamily: 'var(--font-body)', letterSpacing: '0.03em',
                }}>
                  {hotelConfig.name || 'Cierlo'}
                </span>
              </div>

              {/* Tagline / description */}
              <p style={{
                fontSize: 13, lineHeight: 1.7, margin: 0,
                color: 'rgba(255,255,255,0.55)', maxWidth: 280,
              }}>
                {hotelConfig.description || 'A world-class hotel experience.'}
              </p>

              {/* Social icons */}
              {hasSocial && (
                <div style={{ display: 'flex', gap: 18, marginTop: 4 }}>
                  {social.facebook && (
                    <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                      style={socialIconStyle}
                      onMouseEnter={e => Object.assign(e.currentTarget.style, socialIconHover)}
                      onMouseLeave={e => Object.assign(e.currentTarget.style, socialIconStyle)}>
                      <Facebook size={18} />
                    </a>
                  )}
                  {social.instagram && (
                    <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                      style={socialIconStyle}
                      onMouseEnter={e => Object.assign(e.currentTarget.style, socialIconHover)}
                      onMouseLeave={e => Object.assign(e.currentTarget.style, socialIconStyle)}>
                      <Instagram size={18} />
                    </a>
                  )}
                  {social.twitter && (
                    <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                      style={socialIconStyle}
                      onMouseEnter={e => Object.assign(e.currentTarget.style, socialIconHover)}
                      onMouseLeave={e => Object.assign(e.currentTarget.style, socialIconStyle)}>
                      <Twitter size={18} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Col 2 — Quick Links */}
            <div>
              <h4 style={footerHeadingStyle}>Quick Links</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['/', 'Home'],
                  ['/rooms', 'Rooms & Suites'],
                  ['/events', 'Events & Venues'],
                  ['/offers', 'Special Offers'],
                  [isLoggedIn ? '/account' : '/login', isLoggedIn ? 'My Account' : 'Sign In'],
                  ['/contact', 'Contact'],
                ].map(([to, label]) => (
                  <Link key={to + label} to={to} style={footerLinkStyle}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '6px'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.paddingLeft = '0'; }}>
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Col 3 — Room / Tour Categories */}
            <div>
              <h4 style={footerHeadingStyle}>Room Categories</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['/rooms?type=standard', 'Standard Rooms'],
                  ['/rooms?type=deluxe', 'Deluxe Rooms'],
                  ['/rooms?type=suite', 'Suites'],
                  ['/rooms?type=executive', 'Executive Rooms'],
                  ['/rooms?type=villa', 'Villas'],
                ].map(([to, label]) => (
                  <Link key={to + label} to={to} style={footerLinkStyle}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '6px'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.paddingLeft = '0'; }}>
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Col 4 — Contact Info */}
            <div>
              <h4 style={footerHeadingStyle}>Contact Info</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {contact.phone && (
                  <a href={'tel:' + contact.phone} style={contactItemStyle}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}>
                    <Phone size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{contact.phone}</span>
                  </a>
                )}
                {contact.email && (
                  <a href={'mailto:' + contact.email} style={contactItemStyle}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}>
                    {/* envelope icon */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>{contact.email}</span>
                  </a>
                )}
                {contact.address && (
                  <div style={{ ...contactItemStyle, cursor: 'default' }}>
                    <MapPin size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ lineHeight: 1.6 }}>{contact.address}</span>
                  </div>
                )}
                {(contact.checkIn || contact.checkOut) && (
                  <div style={{ ...contactItemStyle, cursor: 'default' }}>
                    {/* clock icon */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>
                      {contact.checkIn ? `Check-in: ${contact.checkIn}` : ''}
                      {contact.checkIn && contact.checkOut ? ' · ' : ''}
                      {contact.checkOut ? `Check-out: ${contact.checkOut}` : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Divider + bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto',
            padding: '1.1rem clamp(2rem,6vw,5rem)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '0.75rem',
          }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0, fontFamily: 'var(--font-body)' }}>
              © {new Date().getFullYear()} {hotelConfig.name}. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              {[
                ['/privacy', 'Privacy Policy'],
                ['/terms', 'Terms & Conditions'],
                ['/cancellation', 'Cancellation Policy'],
              ].map(([to, label]) => (
                <Link key={to} to={to} style={{
                  fontSize: 12, color: 'rgba(255,255,255,0.45)',
                  textDecoration: 'none', fontFamily: 'var(--font-body)',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      {features.whatsappCTA && contact.whatsapp && (
        <a href={"https://wa.me/" + contact.whatsapp.replace(/[^0-9]/g, '')}
          target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
          style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50, width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#25D366', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <MessageCircle size={26} color="white" />
        </a>
      )}
    </div>
  );
}

function FooterHeading({ children }) {
  return <h4 style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--footer-heading)', margin: '0 0 18px', fontFamily: 'var(--font-body)' }}>{children}</h4>;
}
function FooterLinks({ links }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {links.map(([to, label]) => (
        <Link key={to + label} to={to} style={FLS}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.55'}>
          {label}
        </Link>
      ))}
    </div>
  );
}

const footerHeadingStyle = {
  fontSize: 14, fontWeight: 700, color: '#fff',
  margin: '0 0 20px', fontFamily: 'var(--font-body)',
  letterSpacing: '0.02em',
};

const footerLinkStyle = {
  fontSize: 13, color: 'rgba(255,255,255,0.6)',
  textDecoration: 'none', fontFamily: 'var(--font-body)',
  transition: 'color 0.2s, padding-left 0.2s',
  paddingLeft: 0,
};

const contactItemStyle = {
  display: 'flex', alignItems: 'flex-start', gap: 10,
  fontSize: 13, color: 'rgba(255,255,255,0.65)',
  textDecoration: 'none', fontFamily: 'var(--font-body)',
  transition: 'color 0.2s', lineHeight: 1.5,
};

const socialIconStyle = {
  color: 'rgba(255,255,255,0.55)', display: 'flex',
  transition: 'color 0.2s',
};

const socialIconHover = {
  color: '#fff',
};

const FLS = { fontSize: 13, color: 'var(--footer-link-hover)', textDecoration: 'none', opacity: 0.55, transition: 'opacity 0.2s', fontFamily: 'var(--font-body)' };