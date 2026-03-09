// hotel-website/src/hooks/useBooking.jsx
import { createContext, useContext, useReducer } from 'react';

const BookingContext = createContext(null);

const initialState = {
  search:        { checkIn: '', checkOut: '', guests: 1, preselectedTypeId: null },
  selectedRoom:  null,
  selectedRate:  null,
  guestDetails:  { firstName: '', lastName: '', email: '', phone: '', specialRequests: '' },
  confirmation:  null,   // { reservation, guestToken, paymentMethod }
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
      return initialState;
    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
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