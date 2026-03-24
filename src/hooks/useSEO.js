// src/hooks/useSEO.js
//
// Applies all SEO meta tags from the HMS API config on every page.
// All fields come from hotel_config in the DB — fully per-hotel, no hardcoding.
//
// Usage:
//   useSEO()                    → homepage title + description
//   useSEO('Rooms')             → "Rooms | Grand Meridian" 
//   useSEO('Book', 'desc...')   → custom page description

import { useEffect } from 'react';
import { useHotelConfig } from './useHotelConfig.jsx';

function setMeta(attr, attrVal, content) {
  let el = document.querySelector(`meta[${attr}="${attrVal}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content || '');
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  if (href) el.setAttribute('href', href);
  else el.remove();
}

function setJsonLd(id, data) {
  let el = document.querySelector(`script[data-id="${id}"]`);
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.setAttribute('data-id', id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export default function useSEO(pageTitle, pageDescription) {
  const config = useHotelConfig();

  useEffect(() => {
    const name        = config.name        || config.hotel_name || '';
    const city        = config.city        || '';
    const description = pageDescription
      || config.seo_description
      || config.description
      || `${name}${city ? ` in ${city}` : ''} — book directly for the best rates.`;

    // ── <title> ──────────────────────────────────────────────────────────────
    const baseTitle = config.seo_title || `${name}${city ? ` | ${city}` : ''}`;
    document.title  = pageTitle ? `${pageTitle} | ${name}` : baseTitle;

    // ── Standard meta ────────────────────────────────────────────────────────
    setMeta('name', 'description', description);
    if (config.seo_keywords) setMeta('name', 'keywords', config.seo_keywords);
    setMeta('name', 'robots', config.robots || 'index,follow');

    // ── Open Graph ───────────────────────────────────────────────────────────
    setMeta('property', 'og:type',        'website');
    setMeta('property', 'og:site_name',   name);
    setMeta('property', 'og:title',       document.title);
    setMeta('property', 'og:description', description);
    if (config.og_image)      setMeta('property', 'og:image', config.og_image);
    if (config.canonical_url) setMeta('property', 'og:url',   config.canonical_url);

    // ── Twitter Card ─────────────────────────────────────────────────────────
    setMeta('name', 'twitter:card',        'summary_large_image');
    setMeta('name', 'twitter:title',       document.title);
    setMeta('name', 'twitter:description', description);
    if (config.og_image) setMeta('name', 'twitter:image', config.og_image);

    // ── Canonical ────────────────────────────────────────────────────────────
    setLink('canonical', config.canonical_url || null);

    // ── JSON-LD Hotel structured data ────────────────────────────────────────
    // This makes Google show rich results with star ratings, address, phone.
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type':    'Hotel',
      name,
      description,
      ...(config.og_image       && { image: config.og_image }),
      ...(config.canonical_url  && { url:   config.canonical_url }),
      ...(config.contact?.phone && { telephone: config.contact.phone }),
      ...(config.contact?.email && { email:     config.contact.email }),
      address: {
        '@type':           'PostalAddress',
        streetAddress:      config.address || '',
        addressLocality:    city,
        addressRegion:      config.state   || '',
        addressCountry:     config.country || '',
      },
      ...(config.checkIn  && { checkinTime:  config.checkIn  }),
      ...(config.checkOut && { checkoutTime: config.checkOut }),
      ...(config.reviews?.average && {
        aggregateRating: {
          '@type':       'AggregateRating',
          ratingValue:    config.reviews.average,
          reviewCount:    config.reviews.count || 1,
          bestRating:     5,
          worstRating:    1,
        },
      }),
    };
    setJsonLd('hotel', jsonLd);

  }, [pageTitle, pageDescription, config]);
}