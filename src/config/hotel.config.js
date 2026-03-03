// src/config/hotel.config.js
//
// ─── WHITE-LABEL CONFIGURATION ───────────────────────────────────────────────
// This is the ONLY file that needs to change between hotel deployments.
// All branding, contact info, features, and API settings live here.
//
// To rebrand for a new hotel:
//   1. Change the values below
//   2. Run `npm run build` — done.
// ─────────────────────────────────────────────────────────────────────────────

const hotelConfig = {

  // ── Identity ────────────────────────────────────────────────────────────────
  name:        'The Grand Meridian',
  tagline:     'Where Comfort Meets Elegance',
  shortName:   'Meridian',
  description: 'A modern luxury hotel in the heart of the city, offering world-class hospitality and exceptional comfort for business and leisure travellers.',

  // ── Branding ────────────────────────────────────────────────────────────────
  // Change these 7 values + 3 fonts to fully rebrand for any hotel.
  brand: {
    primary:      '#1a1a1a',   // dominant — nav, headings, buttons
    secondary:    '#c9a96e',   // accent — gold CTAs, highlights, labels
    background:   '#fafaf8',   // page background
    surface:      '#ffffff',   // cards, panels
    text:         '#1a1a1a',   // body text
    textMuted:    '#6b6b6b',   // secondary text, placeholders
    border:       '#e8e4dc',   // dividers, input borders

    // Fonts — loaded from Google Fonts in index.html
    fontDisplay:  '"Cormorant Garamond", serif',
    fontBody:     '"DM Sans", sans-serif',
    fontMono:     '"DM Mono", monospace',
  },

  // ── Contact & Location ──────────────────────────────────────────────────────
  contact: {
    address:    '14 Marina Boulevard, Victoria Island, Lagos, Nigeria',
    phone:      '+234 801 234 5678',
    email:      'reservations@grandmeridian.com',
    whatsapp:   '+2348012345678',
    checkIn:    '14:00',
    checkOut:   '12:00',
  },

  // ── Social Media ────────────────────────────────────────────────────────────
  social: {
    instagram:  'https://instagram.com/grandmeridian',
    facebook:   'https://facebook.com/grandmeridian',
    twitter:    '',
  },

  // ── API ─────────────────────────────────────────────────────────────────────
  api: {
    baseUrl:    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1/public',
  },

  // ── Payment ─────────────────────────────────────────────────────────────────
  payment: {
    gateway:        'paystack',
    publicKey:      import.meta.env.VITE_PAYMENT_PUBLIC_KEY || '',
    currency:       'NGN',
    currencySymbol: '₦',
  },

  // ── Features ────────────────────────────────────────────────────────────────
  features: {
    onlineBooking:    true,
    manageBooking:    true,
    whatsappCTA:      true,
    loyaltyProgram:   false,
    restaurantMenu:   false,
    facilitiesPage:   false,
    guestReviews:     true,
  },

  // ── SEO ─────────────────────────────────────────────────────────────────────
  seo: {
    titleTemplate:  '%s | The Grand Meridian',
    defaultTitle:   'The Grand Meridian — Lagos Luxury Hotel',
    keywords:       'luxury hotel Lagos, Victoria Island hotel, business hotel Lagos',
  },

};

export default hotelConfig;
