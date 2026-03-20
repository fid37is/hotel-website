// src/utils/currency.js
//
// Amounts are stored in kobo/cents (smallest currency unit).
// Always divide by 100 before displaying.
//
// useFmt() — React hook that returns a formatter bound to the live hotel config.
// Use this in components so the currency symbol always reflects the current
// hotel config (which may be overridden by the HMS API after initial load).
//
// fmt() — legacy non-hook formatter using static config. Kept for use in
// non-component contexts; components should prefer useFmt().

import { useHotelConfig } from '../hooks/useHotelConfig.jsx';
import staticConfig       from '../config/hotel.config.js';

const makeFmt = (currency) => (amount) => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-NG', {
    style:                 'currency',
    currency:              currency || 'NGN',
    minimumFractionDigits: 0,
  }).format(amount / 100);
};

// Hook — always reflects the live (potentially API-overridden) currency.
export const useFmt = () => {
  const config = useHotelConfig();
  return makeFmt(config.payment?.currency);
};

// Static fallback — reads static config once. Only use outside React components.
export const fmt = makeFmt(staticConfig.payment?.currency);