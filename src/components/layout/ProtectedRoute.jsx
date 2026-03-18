// src/components/layout/ProtectedRoute.jsx
//
// Wraps routes that require an active guest session — specifically routes that
// need the auth token to make API calls or open a socket connection (e.g. ChatPage).
//
// This is NOT used for:
//   - /account      → AccountPage handles its own redirect internally
//   - /manage-booking → fully public; guests look up by reference + email
//   - /book         → guests can book without registering
//
// Usage in App.jsx:
//   <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

import { Navigate, useLocation } from 'react-router-dom';
import { useGuestAuth } from '../../hooks/useGuestAuth.jsx';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useGuestAuth();
  const location = useLocation();

  // While the auth hook is restoring a session from localStorage, show nothing
  // (the Layout skeleton / nav is still visible). This prevents a flash-redirect
  // to /login for guests who ARE logged in but whose token hasn't loaded yet.
  if (loading) return null;

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