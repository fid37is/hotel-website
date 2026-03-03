// src/components/layout/Layout.jsx — Pure Tailwind, zero scoped CSS
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useGuestAuth }   from '../../hooks/useGuestAuth.jsx';
import { useHotelConfig } from '../../hooks/useHotelConfig.jsx';

export default function Layout() {
  const hotelConfig = useHotelConfig();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, guest, logout } = useGuestAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const isHome    = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-bg/95 backdrop-blur-md shadow-sm';

  const { contact, social, features } = hotelConfig;
  const hasSocial = social?.instagram || social?.facebook || social?.twitter;

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Navbar ────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-50 h-nav transition-all duration-300 ${navBg}`}>
        <div className="container flex items-center justify-between h-full">

          {/* Logo — both if available, otherwise whichever is set */}
          <Link to="/" className={`flex items-center gap-2.5 font-display text-xl font-medium tracking-wider transition-colors ${isHome && !scrolled ? 'text-white' : 'text-primary'}`}>
            {hotelConfig.logoUrl && (
              <img src={hotelConfig.logoUrl} alt={hotelConfig.shortName} className="h-9 w-auto object-contain" />
            )}
            {hotelConfig.shortName && (
              <span>{hotelConfig.shortName}</span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['/', '/rooms'].map((path, i) => {
              const label = ['Home', 'Rooms'][i];
              const active = location.pathname === path;
              return (
                <Link key={path} to={path}
                  className={`text-sm tracking-wide transition-colors
                    ${isHome && !scrolled ? 'text-white/80 hover:text-white' : 'text-muted hover:text-primary'}
                    ${active ? (isHome && !scrolled ? '!text-white' : '!text-primary font-medium') : ''}`}
                >
                  {label}
                </Link>
              );
            })}
            {isLoggedIn ? (
              <Link to="/account"
                className={`text-sm tracking-wide transition-colors ${isHome && !scrolled ? 'text-white/80 hover:text-white' : 'text-muted hover:text-primary'}`}>
                My Account
              </Link>
            ) : (
              <Link to="/login"
                className={`text-sm tracking-wide transition-colors ${isHome && !scrolled ? 'text-white/80 hover:text-white' : 'text-muted hover:text-primary'}`}>
                Sign In
              </Link>
            )}
            <Link to="/book"
              className={`btn btn--primary text-xs tracking-widest uppercase py-2.5 px-5 ${isHome && !scrolled ? 'bg-secondary' : ''}`}>
              Book Now
            </Link>
          </nav>

          {/* Mobile right */}
          <div className="flex md:hidden items-center gap-3">
            {isLoggedIn ? (
              <Link to="/account" aria-label="My account"
                className={`p-1 transition-colors ${isHome && !scrolled ? 'text-white' : 'text-primary'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
            ) : (
              <Link to="/login"
                className={`text-xs font-medium tracking-wide transition-colors ${isHome && !scrolled ? 'text-white' : 'text-primary'}`}>
                Sign In
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
              className={`flex flex-col gap-1.5 p-1 transition-colors ${isHome && !scrolled ? 'text-white' : 'text-primary'}`}
            >
              <span className={`block h-px w-6 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`block h-px w-6 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px w-6 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-surface z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-border">
          {isLoggedIn ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Hello, {guest?.full_name?.split(' ')[0]}</span>
              <span className="text-xs text-muted">{guest?.email}</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login"    className="btn btn--outline flex-1 justify-center text-xs">Sign In</Link>
              <Link to="/register" className="btn btn--primary flex-1 justify-center text-xs">Register</Link>
            </div>
          )}
        </div>

        <nav className="flex flex-col py-4 flex-1">
          {[['/', 'Home'], ['/rooms', 'Rooms & Rates'], ['/book', 'Book a Room']].map(([path, label]) => (
            <Link key={path} to={path}
              className={`px-6 py-4 text-sm tracking-wide border-b border-border/50 transition-colors hover:bg-bg
                ${path === '/book' ? 'text-secondary font-medium' : 'text-primary'}`}>
              {label}
            </Link>
          ))}
          {isLoggedIn && (
            <>
              <Link to="/account" className="px-6 py-4 text-sm tracking-wide border-b border-border/50 hover:bg-bg">My Bookings</Link>
              <button className="px-6 py-4 text-sm text-left text-muted hover:bg-bg transition-colors" onClick={handleLogout}>Sign Out</button>
            </>
          )}
        </nav>

        <div className="p-6 border-t border-border text-xs text-muted flex flex-col gap-1">
          <a href={`tel:${contact.phone}`} className="hover:text-secondary transition-colors">{contact.phone}</a>
          <span>{contact.address}</span>
        </div>
      </div>

      {/* ── Main ──────────────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-primary text-white/70">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand — logo, name, tagline, social icons */}
            <div className="md:col-span-1 flex flex-col gap-3">
              {hotelConfig.logoUrl && (
                <img
                  src={hotelConfig.logoUrl}
                  alt={hotelConfig.name}
                  className="h-10 w-auto object-contain brightness-0 invert opacity-80"
                />
              )}
              <p className="font-display text-2xl text-white font-medium">{hotelConfig.name}</p>
              <p className="text-sm">{hotelConfig.tagline}</p>

              {hasSocial && (
                <div className="flex items-center gap-4 mt-1">
                  {social.instagram && (
                    <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                      aria-label="Instagram" className="text-white/40 hover:text-secondary transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  {social.facebook && (
                    <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                      aria-label="Facebook" className="text-white/40 hover:text-secondary transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                  {social.twitter && (
                    <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                      aria-label="X / Twitter" className="text-white/40 hover:text-secondary transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Navigate */}
            <div>
              <h4 className="text-white text-xs font-medium tracking-widest uppercase mb-4">Navigate</h4>
              <div className="flex flex-col gap-3 text-sm">
                <Link to="/"      className="hover:text-white transition-colors">Home</Link>
                <Link to="/rooms" className="hover:text-white transition-colors">Rooms &amp; Rates</Link>
                <Link to="/book"  className="hover:text-white transition-colors">Book a Room</Link>
                <Link to={isLoggedIn ? '/account' : '/login'} className="hover:text-white transition-colors">
                  {isLoggedIn ? 'My Account' : 'Sign In'}
                </Link>
              </div>
            </div>

            {/* Contact — all fields from HMS config */}
            <div>
              <h4 className="text-white text-xs font-medium tracking-widest uppercase mb-4">Contact</h4>
              <div className="flex flex-col gap-3 text-sm">
                <a href={`tel:${contact.phone}`} className="hover:text-white transition-colors">{contact.phone}</a>
                <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">{contact.email}</a>
                {contact.website && (
                  <a href={contact.website} target="_blank" rel="noopener noreferrer"
                    className="hover:text-white transition-colors">{contact.website}</a>
                )}
                <p>{contact.address}</p>
                {contact.googleMapsUrl && (
                  <a href={contact.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                    className="hover:text-white transition-colors text-xs underline underline-offset-2">
                    View on Map ↗
                  </a>
                )}
              </div>
            </div>

            {/* Hours */}
            <div>
              <h4 className="text-white text-xs font-medium tracking-widest uppercase mb-4">Hours</h4>
              <div className="flex flex-col gap-3 text-sm">
                <p>Check-in: {contact.checkIn}</p>
                <p>Check-out: {contact.checkOut}</p>
                <p>Front Desk: 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-5">
          <div className="container text-xs text-white/40">
            © {new Date().getFullYear()} {hotelConfig.name}. All rights reserved.
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      {features.whatsappCTA && contact.whatsapp && (
        <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
          target="_blank" rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" className="text-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </div>
  );
}