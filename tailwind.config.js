const brand = {
  primary:    '#1a1a1a',
  secondary:  '#c9a96e',
  background: '#fafaf8',
  surface:    '#ffffff',
  textMuted:  '#6b6b6b',
  border:     '#e8e4dc',
};

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   brand.primary,
        secondary: brand.secondary,
        bg:        brand.background,
        surface:   brand.surface,
        muted:     brand.textMuted,
        border:    brand.border,
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      spacing:  { nav: '72px' },
      height:   { nav: '72px' },
      maxWidth: { site: '1280px' },
    },
  },
  plugins: [],
};