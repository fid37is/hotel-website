// src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import hotelConfig    from '../config/hotel.config.js';
import { roomsApi }   from '../services/api.js';
import AvailabilitySearch from '../components/booking/AvailabilitySearch.jsx';
import RoomCard           from '../components/ui/RoomCard.jsx';
import './HomePage.css';

const AMENITIES = [
  { icon: '✦', title: 'Complimentary Wi-Fi',    desc: 'High-speed fibre throughout the property' },
  { icon: '✦', title: '24-Hour Front Desk',      desc: 'Our team is always available for you' },
  { icon: '✦', title: 'On-site Restaurant',      desc: 'Contemporary cuisine with local flavours' },
  { icon: '✦', title: 'Secure Parking',          desc: 'Covered, monitored parking on premises' },
  { icon: '✦', title: 'Airport Transfers',        desc: 'Arranged on request, door to door' },
  { icon: '✦', title: 'Conference Facilities',   desc: 'Fully equipped meeting and event spaces' },
];

export default function HomePage() {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    document.title = hotelConfig.seo.defaultTitle;
    roomsApi.getTypes()
      .then(res => setFeaturedRooms((res.data || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__overlay" />
        <div className="hero__content container">
          <p className="hero__label">Welcome to {hotelConfig.shortName}</p>
          <h1 className="hero__title">{hotelConfig.tagline}</h1>
          <p className="hero__sub">{hotelConfig.description}</p>
        </div>
        <div className="hero__search container">
          <AvailabilitySearch />
        </div>
      </section>

      {/* ── Featured Rooms ────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <p className="section-label">Accommodation</p>
          <div className="home__rooms-header">
            <h2 className="section-title">Our Rooms &amp; Suites</h2>
            <Link to="/rooms" className="btn btn--outline">View All Rooms</Link>
          </div>

          {loading ? (
            <div className="home__rooms-grid">
              {[1,2,3].map(i => (
                <div key={i} className="skeleton" style={{ height: '420px' }} />
              ))}
            </div>
          ) : featuredRooms.length > 0 ? (
            <div className="home__rooms-grid">
              {featuredRooms.map(room => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="home__rooms-grid">
              {/* Placeholder cards when API is not yet configured */}
              {['Deluxe Room', 'Executive Suite', 'Presidential Suite'].map((name, i) => (
                <RoomCard key={i} room={{
                  id: i,
                  name,
                  description: 'Elegantly appointed room with modern amenities and stunning views.',
                  base_rate: [45000, 85000, 150000][i],
                  amenities: ['King Bed', 'Free Wi-Fi', 'Smart TV', 'Mini Bar'],
                  category: ['Standard', 'Premium', 'Luxury'][i],
                }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────── */}
      <section className="section home__amenities-section">
        <div className="container">
          <p className="section-label">The Experience</p>
          <h2 className="section-title">Crafted for Your Comfort</h2>
          <div className="home__amenities-grid">
            {AMENITIES.map((a, i) => (
              <div key={i} className="home__amenity-card">
                <span className="home__amenity-icon">{a.icon}</span>
                <h3 className="home__amenity-title">{a.title}</h3>
                <p className="home__amenity-desc">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="home__cta-section">
        <div className="home__cta-bg" />
        <div className="home__cta-overlay" />
        <div className="container home__cta-content">
          <p className="section-label" style={{ color: 'var(--clr-secondary)' }}>Ready to Stay?</p>
          <h2 className="section-title" style={{ color: '#fff' }}>
            Reserve Your Stay Today
          </h2>
          <p className="home__cta-sub">
            Best rates guaranteed when you book directly with us.
          </p>
          <div className="home__cta-actions">
            <Link to="/book" className="btn btn--gold btn--lg">Book Direct</Link>
            <a href={`tel:${hotelConfig.contact.phone}`} className="btn btn--outline" style={{ color: '#fff', borderColor: '#fff' }}>
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* ── Contact Strip ─────────────────────────────────────────── */}
      <section className="section--sm home__contact-strip">
        <div className="container home__contact-inner">
          <div className="home__contact-item">
            <span className="home__contact-label">Address</span>
            <span>{hotelConfig.contact.address}</span>
          </div>
          <div className="home__contact-item">
            <span className="home__contact-label">Phone</span>
            <a href={`tel:${hotelConfig.contact.phone}`}>{hotelConfig.contact.phone}</a>
          </div>
          <div className="home__contact-item">
            <span className="home__contact-label">Email</span>
            <a href={`mailto:${hotelConfig.contact.email}`}>{hotelConfig.contact.email}</a>
          </div>
          <div className="home__contact-item">
            <span className="home__contact-label">Check-in / Check-out</span>
            <span>{hotelConfig.contact.checkIn} / {hotelConfig.contact.checkOut}</span>
          </div>
        </div>
      </section>

    </div>
  );
}
