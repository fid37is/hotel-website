// src/components/layout/Layout.jsx
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useGuestAuth } from '../../hooks/useGuestAuth.jsx';
import hotelConfig from '../../config/hotel.config.js';
import './Layout.css';

export default function Layout() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { isLoggedIn, guest, logout } = useGuestAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  // Lock body scroll when menu open on mobile
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navClass = [
    'nav',
    isHome && !scrolled ? 'nav--transparent' : 'nav--solid',
    scrolled ? 'nav--scrolled' : '',
  ].filter(Boolean).join(' ');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="site-wrapper">
      <header className={navClass}>
        <div className="nav__inner">
          <Link to="/" className="nav__logo">
            <span className="nav__logo-name">{hotelConfig.shortName}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav__desktop">
            <Link to="/"      className="nav__link">Home</Link>
            <Link to="/rooms" className="nav__link">Rooms</Link>
            {isLoggedIn ? (
              <Link to="/account" className="nav__link">My Account</Link>
            ) : (
              <Link to="/login" className="nav__link">Sign In</Link>
            )}
            <Link to="/book" className="nav__link nav__link--cta">Book Now</Link>
          </nav>

          {/* Mobile right side */}
          <div className="nav__mobile-right">
            {isLoggedIn ? (
              <Link to="/account" className="nav__account-btn" aria-label="My account">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
            ) : (
              <Link to="/login" className="nav__signin-btn">Sign In</Link>
            )}
            <button
              className={`nav__burger ${menuOpen ? 'nav__burger--open' : ''}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && <div className="nav__overlay" onClick={() => setMenuOpen(false)} />}

      {/* Mobile menu drawer */}
      <div className={`nav__drawer ${menuOpen ? 'nav__drawer--open' : ''}`}>
        <div className="nav__drawer-header">
          {isLoggedIn ? (
            <div className="nav__drawer-guest">
              <span className="nav__drawer-greeting">Hello, {guest?.full_name?.split(' ')[0]}</span>
              <span className="nav__drawer-email">{guest?.email}</span>
            </div>
          ) : (
            <div className="nav__drawer-auth">
              <Link to="/login"    className="btn btn--outline" style={{ flex: 1, justifyContent: 'center' }}>Sign In</Link>
              <Link to="/register" className="btn btn--primary" style={{ flex: 1, justifyContent: 'center' }}>Register</Link>
            </div>
          )}
        </div>

        <nav className="nav__drawer-links">
          <Link to="/"      className="nav__drawer-link">Home</Link>
          <Link to="/rooms" className="nav__drawer-link">Rooms &amp; Rates</Link>
          <Link to="/book"  className="nav__drawer-link nav__drawer-link--cta">Book a Room</Link>
          {isLoggedIn && (
            <>
              <Link to="/account" className="nav__drawer-link">My Bookings</Link>
              <button className="nav__drawer-link nav__drawer-link--logout" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          )}
        </nav>

        <div className="nav__drawer-contact">
          <a href={`tel:${hotelConfig.contact.phone}`}>{hotelConfig.contact.phone}</a>
          <span>{hotelConfig.contact.address}</span>
        </div>
      </div>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <p className="footer__hotel-name">{hotelConfig.name}</p>
            <p className="footer__tagline">{hotelConfig.tagline}</p>
          </div>
          <div className="footer__cols">
            <div className="footer__col">
              <h4>Navigate</h4>
              <Link to="/">Home</Link>
              <Link to="/rooms">Rooms &amp; Rates</Link>
              <Link to="/book">Book a Room</Link>
              <Link to={isLoggedIn ? '/account' : '/login'}>
                {isLoggedIn ? 'My Account' : 'Sign In'}
              </Link>
            </div>
            <div className="footer__col">
              <h4>Contact</h4>
              <a href={`tel:${hotelConfig.contact.phone}`}>{hotelConfig.contact.phone}</a>
              <a href={`mailto:${hotelConfig.contact.email}`}>{hotelConfig.contact.email}</a>
              <p>{hotelConfig.contact.address}</p>
            </div>
            <div className="footer__col">
              <h4>Hours</h4>
              <p>Check-in: {hotelConfig.contact.checkIn}</p>
              <p>Check-out: {hotelConfig.contact.checkOut}</p>
              <p>Front Desk: 24 hours</p>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} {hotelConfig.name}. All rights reserved.</p>
        </div>
      </footer>

      {hotelConfig.features.whatsappCTA && (
        <a
          href={`https://wa.me/${hotelConfig.contact.whatsapp}`}
          className="whatsapp-fab"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </div>
  );
}