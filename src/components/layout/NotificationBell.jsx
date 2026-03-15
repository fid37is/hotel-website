// src/components/layout/NotificationBell.jsx
//
// Guest-facing notification bell — sits in the navbar.
// Shows unread count badge, dropdown with notification list.

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuestNotifications } from '../../hooks/useGuestNotifications.jsx';

const fmtTime = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000)  return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString();
};

const typeIcon = (type, color) => {
  // flexShrink must be in style={} — it is not a valid SVG attribute
  const a = { viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '1.8', width: 16, height: 16, style: { flexShrink: 0 } };
  if (type === 'chat')
    return <svg {...a}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
  if (type === 'reservation')
    return <svg {...a}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
  return <svg {...a}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
};

export default function NotificationBell({ textColor = '#1a1a1a' }) {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useGuestNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const accent = 'var(--accent, #2a7a4f)';

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleClick = (n) => {
    markRead(n.id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>

      {/* Bell button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        style={{
          position: 'relative', background: 'none', border: 'none',
          cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center',
          color: textColor, transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            minWidth: 16, height: 16, borderRadius: 8,
            background: 'var(--btn-accent-bg, #e53e3e)',
            color: '#fff', fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px', fontFamily: 'var(--font-body)',
            lineHeight: 1, boxShadow: '0 0 0 2px var(--bg-surface, #fff)',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          width: 340, maxHeight: 440,
          background: 'var(--bg-surface, #fff)',
          border: '1px solid var(--border-base, #e8e4dc)',
          borderRadius: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column',
          zIndex: 200, overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderBottom: '1px solid var(--border-base, #e8e4dc)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-body)', margin: 0 }}>
                Notifications
              </p>
              {unreadCount > 0 && (
                <span style={{
                  background: accent, color: '#fff',
                  fontSize: 9, fontWeight: 700, padding: '2px 6px',
                  borderRadius: 10, fontFamily: 'var(--font-body)',
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {unreadCount > 0 && (
                <button type="button" onClick={markAllRead} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11, color: accent, fontFamily: 'var(--font-body)',
                  padding: '2px 4px',
                }}>
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button type="button" onClick={clearAll} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-body)',
                  padding: '2px 4px',
                }}>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"
                  width="32" height="32" style={{ margin: '0 auto 10px', display: 'block', opacity: 0.4 }}>
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: 0 }}>
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleClick(n)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '12px 16px', border: 'none',
                    borderBottom: '1px solid var(--border-base, #e8e4dc)',
                    background: n.read ? 'transparent' : 'var(--bg-subtle, #f7f5f0)',
                    cursor: n.link ? 'pointer' : 'default',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (n.link) e.currentTarget.style.background = 'var(--bg-subtle, #f7f5f0)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = n.read ? 'transparent' : 'var(--bg-subtle, #f7f5f0)'; }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: n.type === 'chat' ? 'rgba(42,122,79,0.1)' : 'rgba(66,153,225,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {typeIcon(n.type, n.type === 'chat' ? accent : '#4299e1')}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 12, fontWeight: n.read ? 400 : 600,
                      color: 'var(--text-base)', fontFamily: 'var(--font-body)',
                      margin: '0 0 2px', lineHeight: 1.4,
                    }}>
                      {n.title}
                    </p>
                    {n.body && (
                      <p style={{
                        fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-body)',
                        margin: '0 0 4px', lineHeight: 1.5,
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {n.body}
                      </p>
                    )}
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: 0 }}>
                      {fmtTime(n.createdAt)}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!n.read && (
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: accent, flexShrink: 0, marginTop: 4,
                    }} />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}