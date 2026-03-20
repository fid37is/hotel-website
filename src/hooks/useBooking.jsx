// src/hooks/useBooking.jsx
//
// Global booking state shared across the multi-step BookingPage.
// State is persisted to sessionStorage so a page refresh or Paystack redirect
// does not lose the guest's room selection and form data.
// Calling dispatch({ type: 'RESET' }) clears both memory and storage.

import { createContext, useContext, useReducer, useEffect } from 'react';

const BookingContext = createContext(null);

const STORAGE_KEY = 'booking_draft';

const initialState = {
  search:        { checkIn: '', checkOut: '', guests: 1, preselectedTypeId: null },
  selectedRoom:  null,
  selectedRate:  null,
  guestDetails:  { firstName: '', lastName: '', email: '', phone: '', specialRequests: '' },
  confirmation:  null,   // { reservation, guestToken, paymentMethod }
};

// Load persisted draft (if any) — runs once at module level so it's available
// for the initial useReducer state without triggering an extra render.
const loadDraft = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const saved = JSON.parse(raw);
    // Never restore a completed confirmation — that page is a one-shot view.
    return { ...initialState, ...saved, confirmation: null };
  } catch {
    return initialState;
  }
};

const saveDraft = (state) => {
  try {
    // Don't persist the confirmation object — it's only needed on the
    // /confirmation page which is reached via navigate(), not a hard reload.
    const { confirmation, ...rest } = state;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch { /* quota exceeded or private browsing — silent */ }
};

const clearDraft = () => {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch { }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: { ...state.search, ...action.payload } };
    case 'SELECT_ROOM':
      return { ...state, selectedRoom: action.payload.room, selectedRate: action.payload.rate };
    case 'SET_GUEST_DETAILS':
      return { ...state, guestDetails: { ...state.guestDetails, ...action.payload } };
    case 'BOOKING_CONFIRMED':
      return {
        ...state,
        confirmation: {
          reservation:   action.payload.reservation,
          guestToken:    action.payload.guestToken,
          paymentMethod: action.payload.paymentMethod || 'on_arrival',
        },
      };
    case 'RESET':
      clearDraft();
      return initialState;
    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadDraft);

  // Persist every state change to sessionStorage (except after RESET which
  // calls clearDraft() itself before the state update lands).
  useEffect(() => {
    if (state !== initialState) saveDraft(state);
  }, [state]);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};