// src/hooks/useSEO.js
//
// Applies <title> and <meta> tags from hotel.config.js seo block on every page.
//
// Usage:
//   useSEO('Rooms');              → "Rooms | The Grand Meridian"
//   useSEO();                     → "The Grand Meridian — Lagos Luxury Hotel"
//   useSEO('Book', 'description') → custom description + title

import { useEffect } from 'react';
import { useHotelConfig } from './useHotelConfig.jsx';

export default function useSEO(pageTitle, description) {
  const config = useHotelConfig();
  const { titleTemplate, defaultTitle, keywords } = config.seo || {};

  useEffect(() => {
    // ── <title> ──────────────────────────────────────────────────────────────
    if (pageTitle && titleTemplate) {
      document.title = titleTemplate.replace('%s', pageTitle);
    } else {
      document.title = defaultTitle || config.name || '';
    }

    // ── <meta name="description"> ────────────────────────────────────────────
    const desc = description || config.description || '';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);

    // ── <meta name="keywords"> ───────────────────────────────────────────────
    if (keywords) {
      let metaKeys = document.querySelector('meta[name="keywords"]');
      if (!metaKeys) {
        metaKeys = document.createElement('meta');
        metaKeys.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeys);
      }
      metaKeys.setAttribute('content', keywords);
    }

    // ── <meta property="og:title"> ───────────────────────────────────────────
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', document.title);

    // ── <meta property="og:description"> ─────────────────────────────────────
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', desc);
  }, [pageTitle, description, config]);
}