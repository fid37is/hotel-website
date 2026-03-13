// src/hooks/useHotelConfig.jsx
//
// Fetches live config from the HMS API once at app startup.
// Uses theme.js as the single source of truth for all visual tokens —
// applyBrandColors() derives every CSS var from the admin's settings.
// Components never hardcode colors — they reference var(--token-name).

import { createContext, useContext, useState, useEffect } from 'react';
import staticConfig from '../config/hotel.config.js';
import { applyTokens, applyBrandColors, defaultTokens, applyFontPair, parseLayout, DEFAULT_LAYOUT } from '../config/theme.js';

const HotelConfigContext = createContext(staticConfig);

// ─── Config merger ────────────────────────────────────────────────────────────
function mergeConfig(prev, d) {
  if (!d) return prev;

  const fullAddress = [d.address, d.city, d.state, d.country]
    .filter(Boolean).join(', ');

  return {
    ...prev,

    name:        d.hotel_name  || prev.name,
    shortName:   d.hotel_name  || prev.shortName,
    tagline:     d.tagline     || prev.tagline,
    description: d.description || prev.description,
    logoUrl:     d.logo_url    || null,

    brand: {
      ...prev.brand,
      primary:   d.primary_color                     || prev.brand.primary,
      secondary: d.accent_color || d.secondary_color || prev.brand.secondary,
    },
    layout: parseLayout(d.layout ?? {}),  // always use API layout, never stale

    contact: {
      address:       fullAddress                  || prev.contact.address,
      phone:         d.phone                      || prev.contact.phone,
      email:         d.email                      || prev.contact.email,
      whatsapp:      d.whatsapp_number            || prev.contact.whatsapp,
      checkIn:       d.check_in_time  ? d.check_in_time.slice(0, 5)  : prev.contact.checkIn,
      checkOut:      d.check_out_time ? d.check_out_time.slice(0, 5) : prev.contact.checkOut,
      city:          d.city            || '',
      state:         d.state           || '',
      country:       d.country         || '',
      googleMapsUrl: d.google_maps_url || '',
    },

    social: {
      instagram: d.instagram_url || prev.social.instagram,
      facebook:  d.facebook_url  || prev.social.facebook,
      twitter:   d.twitter_url   || prev.social.twitter,
    },

    payment: {
      ...prev.payment,
      currency:          d.currency            || prev.payment.currency,
      currencySymbol:    d.currency_symbol     || prev.payment.currencySymbol,
      payOnArrival:      d.pay_on_arrival       ?? prev.payment.payOnArrival      ?? true,
      bankTransfer:      d.bank_transfer        ?? prev.payment.bankTransfer       ?? false,
      paystackEnabled:   d.paystack_enabled     ?? prev.payment.paystackEnabled    ?? false,
      bankName:          d.bank_name            || prev.payment.bankName           || '',
      bankAccountNumber: d.bank_account_number  || prev.payment.bankAccountNumber  || '',
      bankAccountName:   d.bank_account_name    || prev.payment.bankAccountName    || '',
      paystackPublicKey: d.paystack_public_key   || prev.payment.paystackPublicKey  || '',
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
    features:      prev.features,

    seo: {
      ...prev.seo,
      titleTemplate: `%s | ${d.hotel_name || prev.name}`,
      defaultTitle:  `${d.hotel_name || prev.name}${d.city ? ` — ${d.city}` : ''} Luxury Hotel`.trim(),
    },
  };
}

// ─── Cache key ────────────────────────────────────────────────────────────────
const CACHE_KEY = 'hms_config_v1';

const readCache = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)); } catch { return null; }
};
const writeCache = (d) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch {}
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export function HotelConfigProvider({ children }) {
  const [config, setConfig] = useState(() => {
    // 1. Write default tokens immediately
    applyTokens(defaultTokens);

    // 2. Apply cached API data if available — zero flash on refresh
    const cached = readCache();
    if (cached) {
      applyBrandColors(cached);
      const layout = parseLayout(cached.layout);
      applyFontPair(layout.font_pair);
      return mergeConfig(staticConfig, cached);
    }

    // 3. Fall back to static config colors if no cache yet
    applyBrandColors({
      primary_color: staticConfig.brand?.primary,
      accent_color:  staticConfig.brand?.secondary,
    });
    applyFontPair(DEFAULT_LAYOUT.font_pair);
    return staticConfig;
  });

  useEffect(() => {
    const base   = staticConfig.api.baseUrl;
    const apiKey = import.meta.env.VITE_HMS_API_KEY || '';

    fetch(`${base}/config`, { headers: { 'X-API-Key': apiKey } })
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        const d = res?.data;
        if (!d) return;

        // ── DEV: log the full config response so we can verify field names ──
        if (import.meta.env.DEV) {
          console.log('[HMS config] raw API response:', JSON.stringify(d, null, 2));
        }

        // Always write fresh API data to cache — overwrites any stale cache
        writeCache(d);

        if (d.hotel_name) document.title = d.hotel_name;
        applyBrandColors(d);
        const layout = parseLayout(d.layout);
        applyFontPair(layout.font_pair);
        // Apply layout to config — always use live API data, never stale cache
        setConfig(prev => mergeConfig(prev, d));
      })
      .catch(() => {});
  }, []);

  // ── Live preview: HMS admin posts layout/color changes into this iframe ──
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type !== 'HMS_PREVIEW') return;
      if (e.data.colors) applyBrandColors(e.data.colors);
      if (e.data.layout) {
        const layout = parseLayout(e.data.layout);
        applyFontPair(layout.font_pair);
        setConfig(prev => ({ ...prev, layout }));
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <HotelConfigContext.Provider value={config}>
      {children}
    </HotelConfigContext.Provider>
  );
}

export const useHotelConfig = () => useContext(HotelConfigContext);
export default useHotelConfig;