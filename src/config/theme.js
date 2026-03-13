// src/config/theme.js
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for all visual tokens on the hotel website.
//
// Pattern mirrors the HMS dashboard theme.js so both systems stay consistent.
//
// HOW IT WORKS:
//   1. defaultTokens provides sensible defaults for every token.
//   2. applyTokens() writes them all to :root on app boot (no flash).
//   3. applyBrandColors() is called once the /api/v1/public/config response
//      arrives. It overrides only the tokens that the admin has configured,
//      deriving smart defaults for everything else (contrast text, hover
//      states, subtle tints) so hotels that only set 2 colors still look great.
//   4. Any token the admin hasn't set falls back to a derived or default value —
//      nothing is ever left blank.
//
// ADDING A NEW TOKEN:
//   • Add it here with a default value.
//   • Reference it in index.css as var(--token-name).
//   • Done. No other files need to change.
// ─────────────────────────────────────────────────────────────────────────────

// ── Default token set ─────────────────────────────────────────────────────────
// These are the build-time defaults (Grand Meridian palette).
// Every token that exists in this object will be written to :root on boot.
export const defaultTokens = {

  // ── Page chrome ─────────────────────────────────────────────────────────────
  '--bg-page':          '#fafaf8',   // page / outermost background
  '--bg-surface':       '#ffffff',   // cards, panels, modals
  '--bg-subtle':        '#f5f3ef',   // zebra rows, inactive tabs, well areas
  '--bg-muted':         '#eceae4',   // skeleton loaders, disabled fields

  // ── Borders ─────────────────────────────────────────────────────────────────
  '--border-soft':      '#eceae4',   // lightest — section dividers
  '--border-base':      '#e8e4dc',   // standard input / card borders

  // ── Text ────────────────────────────────────────────────────────────────────
  '--text-base':        '#1a1a1a',   // primary body text
  '--text-sub':         '#4b4b4b',   // secondary / supporting text
  '--text-muted':       '#6b6b6b',   // placeholders, captions, meta
  '--text-on-brand':    '#ffffff',   // text ON brand-colored backgrounds (auto-derived)
  '--text-on-accent':   '#ffffff',   // text ON accent-colored backgrounds (auto-derived)

  // ── Brand — overridden at runtime by applyBrandColors() ─────────────────────
  '--brand':            '#1a1a1a',   // primary brand color (nav, headings)
  '--brand-hover':      '#333333',   // primary hover state (auto-derived)
  '--brand-subtle':     '#f0f0f0',   // very light tint of brand (badges, bg highlights)

  // ── Accent — CTA buttons, highlights, prices ────────────────────────────────
  '--accent':           '#c9a96e',   // accent / secondary brand color
  '--accent-hover':     '#b8955a',   // accent hover (auto-derived)
  '--accent-subtle':    '#fdf6ec',   // very light tint of accent

  // ── Specific UI roles — override independently if needed ────────────────────

  // NOTE: btn tokens are intentionally NOT in defaultTokens.
  // They are always derived in applyBrandColors() from --brand/--accent.
  // This ensures they always reflect the live hotel color, never a stale default.


  '--input-bg':         '#ffffff',   // input background
  '--input-border':     '#e8e4dc',   // input border
  '--input-focus':      '#c9a96e',   // input focus ring color (default = accent)
  '--input-text':       '#1a1a1a',   // input text color
  '--input-placeholder':'#6b6b6b',   // input placeholder

  // ── Fonts ───────────────────────────────────────────────────────────────────
  '--font-display':     '"Cormorant Garamond", serif',
  '--font-body':        '"DM Sans", sans-serif',
  '--font-mono':        '"DM Mono", monospace',

  // ── Layout ──────────────────────────────────────────────────────────────────
  '--nav-h':            '96px',
  '--max-w':            '1280px',
  '--radius':           '4px',
  '--radius-lg':        '8px',

  // ── Elevation ───────────────────────────────────────────────────────────────
  '--shadow-xs': '0 1px 2px rgba(0,0,0,0.04)',
  '--shadow-sm': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  '--shadow-md': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
  '--shadow-lg': '0 12px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)',

  // ── Easing ──────────────────────────────────────────────────────────────────
  '--ease-out':    'cubic-bezier(0.16, 1, 0.3, 1)',
  '--ease-in-out': 'cubic-bezier(0.87, 0, 0.13, 1)',
};

// ── Utility: write token map to :root ────────────────────────────────────────
export const applyTokens = (tokens) => {
  const root = document.documentElement;
  Object.entries(tokens).forEach(([k, v]) => root.style.setProperty(k, v));
  // Wire btn tokens to follow brand/accent by default via CSS var references.
  // applyBrandColors() will override these with computed values once called.
  root.style.setProperty('--btn-primary-bg',   'var(--brand)');
  root.style.setProperty('--btn-primary-text',  'var(--text-on-brand)');
  root.style.setProperty('--btn-accent-bg',    'var(--accent)');
  root.style.setProperty('--btn-accent-text',   'var(--text-on-accent)');
  root.style.setProperty('--nav-bg',           'var(--brand)');
  root.style.setProperty('--nav-text',          'var(--text-on-brand)');
  root.style.setProperty('--footer-bg',        'var(--brand)');
  root.style.setProperty('--footer-heading',    'var(--text-on-brand)');
  root.style.setProperty('--input-focus',      'var(--accent)');
};

// ── Utility: hex luminance (0–1) ─────────────────────────────────────────────
// Used to auto-pick black or white text on any background.
export const luminance = (hex) => {
  const clean = hex.replace('#', '');
  const full  = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  const [r, g, b] = [0, 2, 4].map(i => {
    const v = parseInt(full.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Returns '#ffffff' or '#1a1a1a' — whichever has better contrast on `hex`
export const contrastText = (hex) =>
  luminance(hex) > 0.35 ? '#1a1a1a' : '#ffffff';

// Darken a hex color by `amount` (0–1)
const darken = (hex, amount = 0.12) => {
  const clean = hex.replace('#', '');
  const full  = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  const [r, g, b] = [0, 2, 4].map(i =>
    Math.max(0, Math.round(parseInt(full.slice(i, i + 2), 16) * (1 - amount)))
  );
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
};

// Mix a hex color toward white by `amount` (0–1) — for subtle tints
const tint = (hex, amount = 0.92) => {
  const clean = hex.replace('#', '');
  const full  = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  const [r, g, b] = [0, 2, 4].map(i => {
    const v = parseInt(full.slice(i, i + 2), 16);
    return Math.round(v + (255 - v) * amount);
  });
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
};

// ── Main runtime function ─────────────────────────────────────────────────────
/**
 * Called once the /api/v1/public/config response arrives.
 * Accepts the raw API data object and the optional font config.
 *
 * Priority for each token:
 *   1. Explicit admin override (e.g. nav_color, btn_color)
 *   2. Derived from primary/accent using luminance + darken helpers
 *   3. Default from defaultTokens (already applied at boot)
 */
export const applyBrandColors = (d = {}) => {
  const root = document.documentElement;
  const set  = (k, v) => { if (v) root.style.setProperty(k, v); };

  // ── Dev diagnostic — log which optional fields are present ────────────────
  if (import.meta.env?.DEV) {
    const optionals = ['nav_color','btn_color','footer_color','surface_color','bg_color'];
    const missing = optionals.filter(k => d[k] == null);
    const present = optionals.filter(k => d[k] != null);
    if (present.length) console.log('[theme] color overrides active:', Object.fromEntries(present.map(k => [k, d[k]])));
    if (missing.length) console.log('[theme] color overrides not in API response (need DB columns?):', missing);
  }

  // ── Core brand colors ──────────────────────────────────────────────────────
  const primary = d.primary_color || null;
  const accent  = d.accent_color || d.secondary_color || null;

  if (primary) {
    const onPrimary   = contrastText(primary);
    const primaryHover  = darken(primary, 0.12);
    const primarySubtle = tint(primary, 0.92);

    set('--brand',         primary);
    set('--brand-hover',   primaryHover);
    set('--brand-subtle',  primarySubtle);
    set('--text-on-brand', onPrimary);

    // Nav defaults to primary unless admin set nav_color
    const navBg   = d.nav_color || primary;
    const navText = d.nav_text_color || contrastText(navBg);
    set('--nav-bg',        navBg);
    set('--nav-text',      navText);
    set('--nav-text-muted', navText === '#ffffff'
      ? 'rgba(255,255,255,0.7)'
      : 'rgba(0,0,0,0.5)');

    // Btn-primary always follows brand
    set('--btn-primary-bg',   primary);
    set('--btn-primary-text', contrastText(primary));

    // Footer defaults to primary unless admin set footer_color
    const footerBg      = d.footer_color || primary;
    const footerOnColor = contrastText(footerBg);
    set('--footer-bg',         footerBg);
    set('--footer-text',       d.footer_text_color ||
      (footerOnColor === '#ffffff' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.6)'));
    set('--footer-heading',    footerOnColor);
    set('--footer-link',       footerOnColor === '#ffffff'
      ? 'rgba(255,255,255,0.5)'
      : 'rgba(0,0,0,0.4)');
    set('--footer-link-hover', footerOnColor);
  }

  if (accent) {
    const onAccent     = contrastText(accent);
    const accentHover  = darken(accent, 0.10);
    const accentSubtle = tint(accent, 0.90);

    set('--accent',            accent);
    set('--accent-hover',      accentHover);
    set('--accent-subtle',     accentSubtle);
    set('--text-on-accent',    onAccent);

    // Input focus ring defaults to accent
    set('--input-focus', accent);

    // Accent button — btn_color override wins, then accent
    if (!d.btn_color) {
      set('--btn-accent-bg',   accent);
      set('--btn-accent-text', onAccent);
    }
  }

  // btn_color always wins for the CTA button regardless of accent
  if (d.btn_color) {
    set('--btn-accent-bg',   d.btn_color);
    set('--btn-accent-text', contrastText(d.btn_color));
  }

  // ── Optional surface / bg overrides ───────────────────────────────────────
  if (d.surface_color) {
    set('--bg-surface',    d.surface_color);
    set('--input-bg',      d.surface_color);
  }
  if (d.bg_color) {
    set('--bg-page',   d.bg_color);
    set('--bg-subtle', darken(d.bg_color, 0.04));
    set('--bg-muted',  darken(d.bg_color, 0.08));
  }

  // ── Fonts ──────────────────────────────────────────────────────────────────
  if (d.font_display) set('--font-display', d.font_display);
  if (d.font_body)    set('--font-body',    d.font_body);
};


// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

/** Available font pairs — keyed by id stored in layout config */
export const FONT_PAIRS = {
  cormorant_dmsans: {
    label:   'Cormorant + DM Sans',
    display: '"Cormorant Garamond", serif',
    body:    '"DM Sans", sans-serif',
    google:  'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500',
  },
  playfair_lato: {
    label:   'Playfair Display + Lato',
    display: '"Playfair Display", serif',
    body:    '"Lato", sans-serif',
    google:  'Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700',
  },
  montserrat_merriweather: {
    label:   'Montserrat + Merriweather',
    display: '"Montserrat", sans-serif',
    body:    '"Merriweather", serif',
    google:  'Montserrat:wght@400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;1,300',
  },
};

/** Write font-display + font-body vars and inject Google Fonts link */
export const applyFontPair = (pairKey) => {
  const pair = FONT_PAIRS[pairKey] || FONT_PAIRS.cormorant_dmsans;
  document.documentElement.style.setProperty('--font-display', pair.display);
  document.documentElement.style.setProperty('--font-body',    pair.body);
  const id = `gf-${pairKey}`;
  if (!document.getElementById(id)) {
    const link  = document.createElement('link');
    link.id     = id;
    link.rel    = 'stylesheet';
    link.href   = `https://fonts.googleapis.com/css2?family=${pair.google}&display=swap`;
    document.head.appendChild(link);
  }
};

/** Default layout — used when the API returns nothing for layout fields */
export const DEFAULT_LAYOUT = {
  nav_style:      'transparent_scroll',  // transparent_scroll | solid | minimal
  hero_style:     'fullscreen',           // fullscreen | split | minimal
  card_style:     'portrait',             // portrait | wide | magazine
  font_pair:      'cormorant_dmsans',
  section_order:  ['hero','booking_bar','intro','rooms','why_stay','story','offers','reviews','cta'],
  section_hidden: [],
};

/** Merge a partial layout object from the API with defaults */
export const parseLayout = (raw = {}) => ({
  ...DEFAULT_LAYOUT,
  ...raw,
  section_order:  Array.isArray(raw.section_order)  ? raw.section_order  : DEFAULT_LAYOUT.section_order,
  section_hidden: Array.isArray(raw.section_hidden) ? raw.section_hidden : DEFAULT_LAYOUT.section_hidden,
});