// src/pages/NotFoundPage.jsx — Pure Tailwind
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <p className="font-display text-[8rem] font-light leading-none text-border">404</p>
      <h1 className="font-display text-3xl font-medium mb-3">Page Not Found</h1>
      <p className="text-muted mb-8">The page you're looking for doesn't exist.</p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link to="/"      className="btn btn--primary">Go Home</Link>
        <Link to="/rooms" className="btn btn--outline">View Rooms</Link>
      </div>
    </div>
  );
}
