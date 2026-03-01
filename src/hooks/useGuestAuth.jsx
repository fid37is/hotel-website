// src/hooks/useGuestAuth.jsx
//
// Global guest authentication state.
// Persists access token in memory, refresh token in localStorage.
// Wrap app in <GuestAuthProvider> — consume with useGuestAuth().

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { guestAuthApi } from '../services/api.js';

const GuestAuthContext = createContext(null);

export const GuestAuthProvider = ({ children }) => {
  const [guest,   setGuest]   = useState(null);   // { id, full_name, email, phone }
  const [token,   setToken]   = useState(null);   // access token (memory only)
  const [loading, setLoading] = useState(true);   // restoring session

  // ── Restore session on mount ───────────────────────────────────────────────
  useEffect(() => {
    const restore = async () => {
      const refreshToken = localStorage.getItem('guest_refresh_token');
      if (!refreshToken) { setLoading(false); return; }

      try {
        const res = await guestAuthApi.refresh(refreshToken);
        setToken(res.data.access_token);

        // Get profile with new access token
        const profile = await guestAuthApi.me(res.data.access_token);
        setGuest(profile.data);
      } catch {
        localStorage.removeItem('guest_refresh_token');
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const res = await guestAuthApi.login({ email, password });
    setToken(res.data.access_token);
    setGuest(res.data.guest);
    localStorage.setItem('guest_refresh_token', res.data.refresh_token);
    return res.data;
  }, []);

  // ── Register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (payload) => {
    const res = await guestAuthApi.register(payload);
    setToken(res.data.access_token);
    setGuest(res.data.guest);
    localStorage.setItem('guest_refresh_token', res.data.refresh_token);
    return res.data;
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setGuest(null);
    setToken(null);
    localStorage.removeItem('guest_refresh_token');
  }, []);

  const isLoggedIn = !!guest && !!token;

  return (
    <GuestAuthContext.Provider value={{ guest, token, loading, isLoggedIn, login, register, logout }}>
      {children}
    </GuestAuthContext.Provider>
  );
};

export const useGuestAuth = () => {
  const ctx = useContext(GuestAuthContext);
  if (!ctx) throw new Error('useGuestAuth must be used inside <GuestAuthProvider>');
  return ctx;
};