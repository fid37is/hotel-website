// src/components/layout/ErrorBoundary.jsx
//
// Top-level React error boundary. Catches unhandled render errors and shows a
// friendly fallback instead of a white screen. Uses a class component because
// the error boundary lifecycle (componentDidCatch / getDerivedStateFromError)
// is not yet available as hooks.

import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production, pipe to your error tracking service here, e.g. Sentry.
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-page, #fafaf8)',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 480 }}>
          {/* Icon */}
          <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="var(--accent, #c9a96e)"
            strokeWidth="2"
            width="56"
            height="56"
            style={{ margin: '0 auto 1.5rem' }}
          >
            <circle cx="32" cy="32" r="28" />
            <line x1="32" y1="20" x2="32" y2="36" />
            <circle cx="32" cy="44" r="2" fill="var(--accent, #c9a96e)" stroke="none" />
          </svg>

          <h1
            style={{
              fontFamily: 'var(--font-display, serif)',
              fontWeight: 300,
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              color: 'var(--text-base, #1a1a1a)',
              marginBottom: '0.75rem',
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted, #6b6b6b)',
              lineHeight: 1.6,
              marginBottom: '2rem',
            }}
          >
            An unexpected error occurred. Our team has been notified.
            {import.meta.env.DEV && this.state.error && (
              <span
                style={{
                  display: 'block',
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-subtle, #f5f3ef)',
                  borderRadius: 6,
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  textAlign: 'left',
                  wordBreak: 'break-word',
                  color: '#c0392b',
                }}
              >
                {this.state.error.message}
              </span>
            )}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '10px 24px',
                background: 'var(--brand, #1a1a1a)',
                color: '#fff',
                border: 'none',
                borderRadius: 0,
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'var(--font-body, sans-serif)',
              }}
            >
              Try Again
            </button>
            <Link
              to="/"
              onClick={this.handleReset}
              style={{
                padding: '10px 24px',
                background: 'transparent',
                color: 'var(--text-base, #1a1a1a)',
                border: '1px solid var(--border-base, #e8e4dc)',
                borderRadius: 0,
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontFamily: 'var(--font-body, sans-serif)',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}