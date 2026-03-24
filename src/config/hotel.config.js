// src/config/hotel.config.js
//
// ─── WHITE-LABEL CONFIGURATION ───────────────────────────────────────────────
// Default fallback for new orgs that haven't configured their hotel website yet.
// All values are overridden at runtime by the HMS API response.
// ─────────────────────────────────────────────────────────────────────────────

const hotelConfig = {

  name:        'The Grand Meridian',
  tagline:     'Where Comfort Meets Elegance',
  shortName:   'Meridian',
  description: 'A modern luxury hotel in the heart of the city, offering world-class hospitality and exceptional comfort for business and leisure travellers.',

  brand: {
    primary:   '#1a1a1a',
    secondary: '#c9a96e',
  },

  contact: {
    address:   '14 Marina Boulevard, Victoria Island, Lagos, Nigeria',
    phone:     '+234 801 234 5678',
    email:     'reservations@grandmeridian.com',
    whatsapp:  '+2348012345678',
    checkIn:   '14:00',
    checkOut:  '12:00',
  },

  social: {
    instagram: '',
    facebook:  '',
    twitter:   '',
  },

  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1/public',
  },

  payment: {
    gateway:        'paystack',
    publicKey:      import.meta.env.VITE_PAYMENT_PUBLIC_KEY || '',
    currency:       'NGN',
    currencySymbol: '₦',
  },

  features: {
    onlineBooking:  true,
    manageBooking:  true,
    whatsappCTA:    true,
    loyaltyProgram: false,
    restaurantMenu: false,
    facilitiesPage: false,
    guestReviews:   true,
  },

  seo: {
    titleTemplate: '%s | The Grand Meridian',
    defaultTitle:  'The Grand Meridian — Lagos Luxury Hotel',
    keywords:      'luxury hotel Lagos, Victoria Island hotel, business hotel Lagos',
  },

};

export default hotelConfig;