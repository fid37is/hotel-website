// src/components/sections/EditBar.jsx
//
// Floating overlay on a section that shows:
//   - An "Edit" button when the section is not active
//   - A toolbar with section label + "Done" when active
//
// Only rendered when isEditMode is true — completely absent for guests.

export default function EditBar({ sectionId, label, isActive, onEdit, onDone }) {
  if (isActive) {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 950,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px',
        background: 'rgba(99,102,241,0.95)',
        backdropFilter: 'blur(8px)',
      }}>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff',
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          <PencilIcon /> Editing: {label}
        </span>
        <button type="button" onClick={onDone} style={{
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.06em', color: '#fff', cursor: 'pointer',
          background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.35)',
          borderRadius: 5, padding: '5px 14px', transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}>
          ✓ Done
        </button>
      </div>
    );
  }

  return (
    <button type="button" onClick={onEdit} style={{
      position: 'absolute', top: 16, right: 16, zIndex: 950,
      display: 'flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff',
      background: 'rgba(17,17,17,0.8)', border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: 6, padding: '7px 14px', cursor: 'pointer',
      backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      transition: 'background 0.15s, border-color 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.92)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,1)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(17,17,17,0.8)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}>
      <PencilIcon /> Edit
    </button>
  );
}

function PencilIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}