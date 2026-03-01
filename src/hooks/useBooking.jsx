// src/hooks/useBooking.jsx
//
// Global booking state via React Context.
// Manages the multi-step booking flow, guest token, and search state.
// Wrap the app in <BookingProvider> — consume with useBooking().

import { createContext, useContext, useReducer } from 'react';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  // Search
  search: {
    checkIn:  '',
    checkOut: '',
    guests:   1,
    typeId:   null,
  },

  // Availability results
  availableRooms: [],
  availabilityLoading: false,
  availabilityError: null,

  // Selected room
  selectedRoom:    null,
  selectedRate:    null,

  // Guest details (step 2 of booking flow)
  guestDetails: {
    firstName: '',
    lastName:  '',
    email:     '',
    phone:     '',
    specialRequests: '',
  },

  // Confirmed booking
  confirmedReservation: null,
  guestToken:           null,   // JWT from HMS after booking
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: { ...state.search, ...action.payload } };

    case 'SET_AVAILABILITY_LOADING':
      return { ...state, availabilityLoading: action.payload, availabilityError: null };

    case 'SET_AVAILABILITY_RESULTS':
      return { ...state, availableRooms: action.payload, availabilityLoading: false };

    case 'SET_AVAILABILITY_ERROR':
      return { ...state, availabilityError: action.payload, availabilityLoading: false };

    case 'SELECT_ROOM':
      return { ...state, selectedRoom: action.payload.room, selectedRate: action.payload.rate };

    case 'SET_GUEST_DETAILS':
      return { ...state, guestDetails: { ...state.guestDetails, ...action.payload } };

    case 'BOOKING_CONFIRMED':
      return {
        ...state,
        confirmedReservation: action.payload.reservation,
        guestToken:           action.payload.guestToken,
      };

    case 'RESET_BOOKING':
      return {
        ...initialState,
        search: state.search,   // keep search so guest can search again easily
      };

    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>');
  return ctx;
};
