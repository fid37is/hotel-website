// src/utils/currency.js
//
// Amounts are stored in kobo (smallest NGN unit, like cents).
// Always divide by 100 before displaying.

import hotelConfig from '../config/hotel.config.js';

export const fmt = (amountInKobo) => {
  if (amountInKobo === null || amountInKobo === undefined) return '—';
  return new Intl.NumberFormat('en-NG', {
    style:                 'currency',
    currency:              hotelConfig.payment.currency,
    minimumFractionDigits: 0,
  }).format(amountInKobo / 100);
};