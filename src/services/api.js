// src/services/api.js
//
// Centralised API client for all HMS public endpoints.
// All website components import from here — never fetch directly.

import hotelConfig from '../config/hotel.config.js';

const BASE_URL = hotelConfig.api.baseUrl;

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
const request = async (method, path, { body, params, token } = {}) => {
  // BASE_URL is always an absolute URL (http://... or https://...) so
  // new URL() works without a base argument.
  const url = new URL(`${BASE_URL}${path}`);

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, v);
      }
    });
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-API-Key': import.meta.env.VITE_HMS_API_KEY || '',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || 'Something went wrong.');
    error.status  = res.status;
    error.details = data.errors || null;
    throw error;
  }

  return data;
};

// ─── Rooms ────────────────────────────────────────────────────────────────────
// Module-level cache — getTypes() hits the network at most once per 5 minutes.
// All calls within that window get the same resolved promise.
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let _roomTypesCache    = null;
let _roomTypesCachedAt = 0;
let _roomsCache        = null;
let _roomsCachedAt     = 0;

const isFresh = (cachedAt) => cachedAt > 0 && (Date.now() - cachedAt) < CACHE_TTL_MS;

export const roomsApi = {
  getTypes: () => {
    if (!_roomTypesCache || !isFresh(_roomTypesCachedAt)) {
      _roomTypesCache    = request('GET', '/rooms/types');
      _roomTypesCachedAt = Date.now();
    }
    return _roomTypesCache;
  },

  // All individual rooms (for browsing — no date filter)
  getAllRooms: ({ typeId } = {}) => {
    if (!typeId) {
      if (!_roomsCache || !isFresh(_roomsCachedAt)) {
        _roomsCache    = request('GET', '/rooms');
        _roomsCachedAt = Date.now();
      }
      return _roomsCache;
    }
    return request('GET', '/rooms', { params: { type_id: typeId } });
  },

  clearTypesCache: () => {
    _roomTypesCache = null; _roomTypesCachedAt = 0;
    _roomsCache     = null; _roomsCachedAt     = 0;
  },

  getTypeById: (id) =>
    request('GET', `/rooms/types/${id}`),

  getRates: (roomTypeId) =>
    request('GET', `/rooms/types/${roomTypeId}/rates`),

  getAvailability: ({ checkIn, checkOut, guests, typeId } = {}) =>
    request('GET', '/rooms/availability', {
      params: {
        check_in:  checkIn,
        check_out: checkOut,
        guests,
        type_id:   typeId,
      },
    }),
};

// ─── Reservations ─────────────────────────────────────────────────────────────
export const reservationsApi = {
  create: (payload) =>
    request('POST', '/reservations', { body: payload }),

  getById: (id, token) =>
    request('GET', `/reservations/${id}`, { token }),

  cancel: (id, reason, token) =>
    request('PATCH', `/reservations/${id}/cancel`, {
      body:  { reason },
      token,
    }),
};

// ─── Folio & Payments ─────────────────────────────────────────────────────────
export const folioApi = {
  getByReservation: (reservationId, token) =>
    request('GET', `/folio/reservation/${reservationId}`, { token }),

  getSummary: (folioId, token) =>
    request('GET', `/folio/${folioId}/summary`, { token }),

  addPayment: (folioId, payload, token) =>
    request('POST', `/folio/${folioId}/payments`, { body: payload, token }),
};

// ─── Guest Auth ───────────────────────────────────────────────────────────────
export const guestAuthApi = {
  register: (payload) =>
    request('POST', '/auth/register', { body: payload }),

  login: (payload) =>
    request('POST', '/auth/login', { body: payload }),

  refresh: (refreshToken) =>
    request('POST', '/auth/refresh', { body: { refresh_token: refreshToken } }),

  me: (token) =>
    request('GET', '/auth/me', { token }),

  myReservations: (token) =>
    request('GET', '/auth/my-reservations', { token }),

  myReservationById: (id, token) =>
    request('GET', `/auth/my-reservations/${id}`, { token }),

  cancelReservation: (id, reason, token) =>
    request('PATCH', `/reservations/${id}/cancel`, { body: { reason }, token }),


  // Public booking lookup — no login required.
  // Matches a reservation by reference number + email and returns a
  // short-lived token scoped to that single reservation.
  lookupBooking: ({ reservation_no, email }) =>
    request('POST', '/reservations/lookup', { body: { reservation_no, email } }),

  // Update the logged-in guest's own profile fields
  updateMe: (payload, token) =>
    request('PATCH', '/auth/me', { body: payload, token }),

  forgotPassword: (email) =>
    request('POST', '/auth/forgot-password', { body: { email } }),

  resetPassword: ({ token, password }) =>
    request('POST', '/auth/reset-password', { body: { token, password } }),
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const chatApi = {
  getDepartments: () =>
    request('GET', '/chat-departments'),

  startConversation: (reservationId, departmentId, token) =>
    request('POST', '/conversations', {
      body: { reservation_id: reservationId, department_id: departmentId },
      token,
    }),

  getConversations: (reservationId, token) =>
    request('GET', '/conversations', {
      params: { reservation_id: reservationId },
      token,
    }),

  getMessages: (conversationId, token) =>
    request('GET', `/conversations/${conversationId}/messages`, { token }),

  sendMessage: (conversationId, content, token) =>
    request('POST', `/conversations/${conversationId}/messages`, {
      body: { content },
      token,
    }),
};

// ─── Events ───────────────────────────────────────────────────────────────────
export const eventsApi = {
  submitEnquiry: (payload) =>
    request('POST', '/events/enquiry', { body: payload }),

  getVenues: () =>
    request('GET', '/events/venues'),
};