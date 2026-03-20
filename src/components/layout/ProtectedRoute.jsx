// src/components/layout/ProtectedRoute.jsx


import { Navigate, useLocation } from 'react-router-dom';
import { useGuestAuth } from '../../hooks/useGuestAuth.jsx';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useGuestAuth();
  const location = useLocation();


  if (loading) {
    return (
      <div
        className="flex items-center justify-center bg-bg"
        style={{ minHeight: '100vh', paddingTop: 'var(--nav-h, 72px)' }}
      >
        <div className="w-6 h-6 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  return children;
}