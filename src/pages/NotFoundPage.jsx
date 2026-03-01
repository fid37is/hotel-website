// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import hotelConfig from '../config/hotel.config.js';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '2rem', paddingTop: 'var(--nav-h)',
    }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '8rem', fontWeight: 300, lineHeight: 1, color: 'var(--clr-border)' }}>
        404
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 500, marginBottom: '1rem' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--clr-muted)', marginBottom: '2rem' }}>
        The page you're looking for doesn't exist.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn--primary">Go Home</Link>
        <Link to="/rooms" className="btn btn--outline">View Rooms</Link>
      </div>
    </div>
  );
}
