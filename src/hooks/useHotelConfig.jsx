// src/hooks/useHotelConfig.jsx
//
// Fetches live config from the HMS API once at app startup.
// Merges all fields from the HMS hotel_config table over the static defaults.
// Components use the hook — never import hotel.config.js directly.

import { createContext, useContext, useState, useEffect } from 'react';
import staticConfig from '../config/hotel.config.js';

const HotelConfigContext = createContext(staticConfig);

// Maps the flat HMS DB row → the nested website config shape
function mergeConfig(prev, d) {
  if (!d) return prev;

  const fullAddress = [d.address, d.city, d.state, d.country]
    .filter(Boolean).join(', ');

  return {
    ...prev,

    // Identity
    name:        d.hotel_name     || prev.name,
    shortName:   d.hotel_name || prev.shortName,
    tagline:     d.tagline        || prev.tagline,
    description: d.description    || prev.description,
    logoUrl:     d.logo_url       || null,

    // Branding
    brand: {
      ...prev.brand,
      primary: d.primary_color || prev.brand.primary,
    },

    // Contact & location — every field from the HMS schema
    contact: {
      address:   fullAddress || prev.contact.address,
      phone:     d.phone           || prev.contact.phone,
      email:     d.email           || prev.contact.email,
      whatsapp:  d.whatsapp_number || prev.contact.whatsapp,
      checkIn:   d.check_in_time   ? d.check_in_time.slice(0, 5)  : prev.contact.checkIn,
      checkOut:  d.check_out_time  ? d.check_out_time.slice(0, 5) : prev.contact.checkOut,
      // Extra fields now available
      city:         d.city          || '',
      state:        d.state         || '',
      country:      d.country       || '',
      website:      d.website       || '',
      googleMapsUrl: d.google_maps_url || '',
    },

    // Social — all three handles
    social: {
      instagram: d.instagram_url || prev.social.instagram,
      facebook:  d.facebook_url  || prev.social.facebook,
      twitter:   d.twitter_url   || prev.social.twitter,
    },

    // Payment / financial
    payment: {
      ...prev.payment,
      currency:       d.currency        || prev.payment.currency,
      currencySymbol: d.currency_symbol || prev.payment.currencySymbol,
    },

    // Financial extras
    financial: {
      taxRate:       d.tax_rate       ?? 7.5,
      serviceCharge: d.service_charge ?? 10,
    },

    // Operations
    operations: {
      timezone: d.timezone || 'Africa/Lagos',
    },

    // Policies
    policies: {
      cancellation: d.cancellation_policy || '',
      pets:         d.pets_policy         || '',
      smoking:      d.smoking_policy      || '',
    },

    // Billing
    receiptFooter: d.receipt_footer || '',

    // Features — keep static (not managed in HMS config)
    features: prev.features,

    // SEO — update with live hotel name
    seo: {
      ...prev.seo,
      titleTemplate: `%s | ${d.hotel_name || prev.name}`,
      defaultTitle:  `${d.hotel_name || prev.name}${d.city ? ` — ${d.city}` : ''} ${d.country ? `Luxury Hotel` : ''}`.trim(),
    },
  };
}

export function HotelConfigProvider({ children }) {
  const [config, setConfig] = useState(staticConfig);

  useEffect(() => {
    // One fetch, at provider mount — all children share the result via context
    const base = staticConfig.api.baseUrl; // e.g. http://localhost:5000/api/v1/public
    const url  = `${base}/config`;

    fetch(url)
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        const d = res?.data;
        if (!d) return;
        setConfig(prev => mergeConfig(prev, d));
      })
      .catch(() => {
        // Silent fallback — static defaults remain in place
      });
  }, []); // empty dep array = runs once only

  return (
    <HotelConfigContext.Provider value={config}>
      {children}
    </HotelConfigContext.Provider>
  );
}

export const useHotelConfig = () => useContext(HotelConfigContext);
export default useHotelConfig;