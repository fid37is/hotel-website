// src/components/ui/Button.jsx
//
// Shared button / link-button component used across all pages.
// Replaces the duplicated local `Btn` functions that existed in several pages.
//
// Props:
//   to        — renders a <Link> instead of <button> when provided
//   href      — renders an <a> instead of <button> when provided
//   variant   — 'dark' | 'accent' | 'white' | 'outline' | 'outlineWhite' | 'danger'
//   size      — 'sm' | 'md' (default) | 'lg'
//   disabled  — disables the button (no-op for links)
//   children  — button content
//   style     — extra inline style merged onto the element
//   onClick   — handler (button only)
//   className — extra CSS classes merged onto the element

import { Link } from 'react-router-dom';

const BASE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  borderRadius: 0,
  fontSize: 10,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  whiteSpace: 'nowrap',
};

const SIZES = {
  sm: { padding: '9px 20px' },
  md: { padding: '14px 32px' },
  lg: { padding: '16px 40px', fontSize: 11 },
};

const VARIANTS = {
  dark:         { background: 'var(--brand)',          color: 'var(--text-on-brand, #fff)' },
  accent:       { background: 'var(--accent)',         color: 'var(--text-on-accent, #fff)' },
  white:        { background: '#fff',                  color: '#111' },
  outline:      { background: 'transparent', color: 'var(--text-base)', border: '1px solid var(--border-base)' },
  outlineWhite: { background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.55)' },
  danger:       { background: '#dc2626',               color: '#fff' },
};

export default function Button({
  to,
  href,
  variant = 'dark',
  size = 'md',
  disabled = false,
  children,
  style: extraStyle,
  onClick,
  className,
  ...rest
}) {
  const resolved = {
    ...BASE,
    ...(SIZES[size] || SIZES.md),
    ...(VARIANTS[variant] || VARIANTS.dark),
    ...(disabled ? { opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' } : {}),
    ...extraStyle,
  };

  const hoverProps = disabled
    ? {}
    : {
        onMouseEnter: (e) => { e.currentTarget.style.opacity = '0.82'; },
        onMouseLeave: (e) => { e.currentTarget.style.opacity = '1'; },
      };

  if (to) {
    return (
      <Link to={to} style={resolved} className={className} {...hoverProps} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} style={resolved} className={className} {...hoverProps} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={resolved}
      className={className}
      {...hoverProps}
      {...rest}
    >
      {children}
    </button>
  );
}