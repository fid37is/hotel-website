// hotel-website/src/hooks/useHotelConfig.jsx
//
// Fetches live config from the HMS API once at app startup.
// Merges all fields from the HMS hotel_config table over the static defaults.
// Also injects CSS custom properties into :root so Tailwind classes like
// bg-primary, text-secondary, bg-bg etc. reflect the hotel's live branding.
// Components use the hook — never import hotel.config.js directly.

import { createContext, useContext, useState, useEffect } from 'react';
import staticConfig from '../config/hotel.config.js';

const HotelConfigContext = createContext(staticConfig);

// ─── CSS variable injection ───────────────────────────────────────────────────
// Called every time config changes. Updates :root CSS vars so every Tailwind
// utility that references var(--clr-*) picks up the live hotel branding.
function applyBrandToDOM(brand, logoUrl, hotelName) {
  const root = document.documentElement;

  // The hotel website tailwind.config.js uses var(--clr-*) names
  // AND the index.css defines them via theme() at build time.
  // We override both the --clr-* vars (used by index.css components)
  // AND the direct Tailwind color vars the config references.
  if (brand.primary) {
    root.style.setProperty('--clr-primary',  brand.primary);
    root.style.setProperty('--brand',        brand.primary);
    root.style.setProperty('--brand-hover',  brand.primary);
  }
  if (brand.secondary) {
    root.style.setProperty('--clr-secondary', brand.secondary);
    root.style.setProperty('--accent',        brand.secondary);
  }
  if (brand.background) {
    root.style.setProperty('--clr-bg',   brand.background);
    root.style.setProperty('--bg-page',  brand.background);
  }
  if (brand.surface) {
    root.style.setProperty('--clr-surface',  brand.surface);
    root.style.setProperty('--bg-surface',   brand.surface);
  }
  if (brand.text) {
    root.style.setProperty('--clr-text',   brand.text);
    root.style.setProperty('--text-base',  brand.text);
  }
  if (brand.textMuted) {
    root.style.setProperty('--clr-muted',  brand.textMuted);
    root.style.setProperty('--text-muted', brand.textMuted);
  }
  if (brand.border) {
    root.style.setProperty('--clr-border',   brand.border);
    root.style.setProperty('--border-base',  brand.border);
    root.style.setProperty('--border-soft',  brand.border);
  }

  // Fonts
  if (brand.fontDisplay) root.style.setProperty('--font-display', brand.fontDisplay);
  if (brand.fontBody)    root.style.setProperty('--font-body',    brand.fontBody);
  if (brand.fontMono)    root.style.setProperty('--font-mono',    brand.fontMono);

  // Page title
  if (hotelName) document.title = hotelName;

  // Logo
  if (logoUrl) root.setAttribute('data-logo', logoUrl);
}

// ─── Config merger ────────────────────────────────────────────────────────────
function mergeConfig(prev, d) {
  if (!d) return prev;

  const fullAddress = [d.address, d.city, d.state, d.country]
    .filter(Boolean).join(', ');

  return {
    ...prev,

    // Identity
    name:        d.hotel_name  || prev.name,
    shortName:   d.hotel_name  || prev.shortName,
    tagline:     d.tagline     || prev.tagline,
    description: d.description || prev.description,
    logoUrl:     d.logo_url    || null,

    brand: {
      ...prev.brand,
      primary:   d.primary_color   || prev.brand.primary,
      secondary: d.secondary_color || prev.brand.secondary,
    },

    // Contact & location
    contact: {
      address:      fullAddress           || prev.contact.address,
      phone:        d.phone               || prev.contact.phone,
      email:        d.email               || prev.contact.email,
      whatsapp:     d.whatsapp_number     || prev.contact.whatsapp,
      checkIn:      d.check_in_time       ? d.check_in_time.slice(0, 5)  : prev.contact.checkIn,
      checkOut:     d.check_out_time      ? d.check_out_time.slice(0, 5) : prev.contact.checkOut,
      city:         d.city                || '',
      state:        d.state               || '',
      country:      d.country             || '',
      googleMapsUrl: d.google_maps_url    || '',
    },

    // Social
    social: {
      instagram: d.instagram_url || prev.social.instagram,
      facebook:  d.facebook_url  || prev.social.facebook,
      twitter:   d.twitter_url   || prev.social.twitter,
    },

    // Payment / financial
    payment: {
      ...prev.payment,
      currency:          d.currency           || prev.payment.currency,
      currencySymbol:    d.currency_symbol    || prev.payment.currencySymbol,
      payOnArrival:      d.pay_on_arrival      ?? prev.payment.payOnArrival      ?? true,
      bankTransfer:      d.bank_transfer       ?? prev.payment.bankTransfer       ?? false,
      paystackEnabled:   d.paystack_enabled    ?? prev.payment.paystackEnabled    ?? false,
      bankName:          d.bank_name           || prev.payment.bankName           || '',
      bankAccountNumber: d.bank_account_number || prev.payment.bankAccountNumber  || '',
      bankAccountName:   d.bank_account_name   || prev.payment.bankAccountName    || '',
      paystackPublicKey: d.paystack_public_key  || prev.payment.paystackPublicKey  || '',
    },

    financial: {
      taxRate:       d.tax_rate       ?? 7.5,
      serviceCharge: d.service_charge ?? 10,
    },

    operations: {
      timezone: d.timezone || 'Africa/Lagos',
    },

    policies: {
      cancellation: d.cancellation_policy || '',
      pets:         d.pets_policy         || '',
      smoking:      d.smoking_policy      || '',
    },

    receiptFooter: d.receipt_footer || '',

    // Features — kept static, not managed in HMS config
    features: prev.features,

    seo: {
      ...prev.seo,
      titleTemplate: `%s | ${d.hotel_name || prev.name}`,
      defaultTitle:  `${d.hotel_name || prev.name}${d.city ? ` — ${d.city}` : ''} Luxury Hotel`.trim(),
    },
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function HotelConfigProvider({ children }) {
  const [config, setConfig] = useState(() => {
    // Apply static brand immediately so there's no flash of unstyled content
    applyBrandToDOM(staticConfig.brand, staticConfig.logoUrl, null);
    return staticConfig;
  });

  useEffect(() => {
    const base = staticConfig.api.baseUrl;
    const apiKey = import.meta.env.VITE_HMS_API_KEY || '';

    fetch(`${base}/config`, {
      headers: { 'X-API-Key': apiKey },
    })
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        const d = res?.data;
        if (!d) return;

        setConfig(prev => {
          const next = mergeConfig(prev, d);
          // Inject CSS variables into :root as soon as config arrives
          applyBrandToDOM(next.brand, next.logoUrl, next.name);
          return next;
        });
      })
      .catch(() => {
        // Silent fallback — static defaults remain in place
      });
  }, []);

  return (
    <HotelConfigContext.Provider value={config}>
      {children}
    </HotelConfigContext.Provider>
  );
}

export const useHotelConfig = () => useContext(HotelConfigContext);
export default useHotelConfig;