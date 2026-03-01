// src/config/hotel.config.js
//
// ─── WHITE-LABEL CONFIGURATION ───────────────────────────────────────────────
// This is the ONLY file that needs to change between hotel deployments.
// All branding, contact info, features, and API settings live here.
// ─────────────────────────────────────────────────────────────────────────────

const hotelConfig = {

  // ── Identity ────────────────────────────────────────────────────────────────
  name:        'The Grand Meridian',
  tagline:     'Where Comfort Meets Elegance',
  shortName:   'Meridian',                        // used in page titles, breadcrumbs
  description: 'A modern luxury hotel in the heart of the city, offering world-class hospitality and exceptional comfort for business and leisure travellers.',

  // ── Branding ────────────────────────────────────────────────────────────────
  brand: {
    // Primary palette — change these to match the hotel's brand
    primary:      '#1a1a1a',       // almost black — dominant
    secondary:    '#c9a96e',       // warm gold — accent
    background:   '#fafaf8',       // warm off-white
    surface:      '#ffffff',
    text:         '#1a1a1a',
    textMuted:    '#6b6b6b',
    border:       '#e8e4dc',

    // Fonts — loaded from Google Fonts in index.html
    fontDisplay:  '"Cormorant Garamond", serif',   // headings — editorial, refined
    fontBody:     '"DM Sans", sans-serif',          // body — clean, modern
    fontMono:     '"DM Mono", monospace',           // booking refs, codes
  },

  // ── Contact & Location ──────────────────────────────────────────────────────
  contact: {
    address:    '14 Marina Boulevard, Victoria Island, Lagos, Nigeria',
    phone:      '+234 801 234 5678',
    email:      'reservations@grandmeridian.com',
    whatsapp:   '+2348012345678',                  // optional — shown as WhatsApp CTA
    checkIn:    '14:00',
    checkOut:   '12:00',
  },

  // ── Social Media ────────────────────────────────────────────────────────────
  social: {
    instagram:  'https://instagram.com/grandmeridian',
    facebook:   'https://facebook.com/grandmeridian',
    twitter:    '',                                // leave empty to hide
  },

  // ── API ─────────────────────────────────────────────────────────────────────
  api: {
    baseUrl:    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1/public',
  },

  // ── Payment ─────────────────────────────────────────────────────────────────
  payment: {
    gateway:    'paystack',                        // 'paystack' | 'flutterwave'
    publicKey:  import.meta.env.VITE_PAYMENT_PUBLIC_KEY || '',
    currency:   'NGN',
    currencySymbol: '₦',
  },

  // ── Features (module toggles) ───────────────────────────────────────────────
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
    keywords:       'luxury hotel Lagos, Victoria Island hotel, business hotel Lagos, weekend getaway Nigeria',
  },

};

export default hotelConfig;
