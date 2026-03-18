// src/hooks/usePreview.jsx
//
// Context used by the HMS CustomizePage to render hotel sections directly
// (no iframe). When sections are rendered inside <PreviewProvider>, they
// read content/layout/colors from here instead of useHotelConfig, and
// text fields become directly editable.

import { createContext, useContext } from 'react';

export const PreviewContext = createContext(null);

// Hook for sections — returns { content, layout, hotelConfig, isPreview }
export function usePreview() {
  return useContext(PreviewContext);
}

// EditableText — renders a live <textarea> or <input> overlay when in preview
// mode and the section is active. Otherwise renders children as-is.
//
// Props:
//   sectionId  — which section this belongs to ('rooms', 'hero', etc.)
//   field      — the content key ('headline', 'eyebrow', etc.)
//   children   — the fallback display value (used when not in preview)
//   multiline  — use <textarea> instead of <input>
//   style      — styles applied to the editable input (should match the real element)
//   as         — the wrapper tag rendered around the input ('p', 'h1', 'h2', etc.)

export function EditableText({ sectionId, field, children, multiline, style, as: Tag = 'span', className }) {
  const ctx = usePreview();

  // Not in preview mode — render normally
  if (!ctx || !ctx.isPreview) {
    return <Tag style={style} className={className}>{children}</Tag>;
  }

  const { activeSection, content, setField } = ctx;
  const isActive  = activeSection === sectionId;
  const value     = content?.[sectionId]?.[field] ?? (typeof children === 'string' ? children : '');

  if (!isActive) {
    // Section exists but not focused — render static text with subtle indicator
    return (
      <Tag style={{ ...style, cursor: 'default' }} className={className}>
        {value || children}
      </Tag>
    );
  }

  // Section is active — render editable field
  const inputStyle = {
    ...style,
    display:     'block',
    width:       '100%',
    background:  'rgba(255,255,255,0.12)',
    border:      '1.5px dashed rgba(99,102,241,0.7)',
    borderRadius: 3,
    padding:     '2px 6px',
    color:       style?.color || 'inherit',
    fontFamily:  style?.fontFamily || 'inherit',
    fontSize:    style?.fontSize   || 'inherit',
    fontWeight:  style?.fontWeight || 'inherit',
    lineHeight:  style?.lineHeight || 'inherit',
    letterSpacing: style?.letterSpacing || 'inherit',
    textTransform: style?.textTransform || 'inherit',
    outline:     'none',
    resize:      'none',
    boxSizing:   'border-box',
    cursor:      'text',
    transition:  'border-color 0.15s, background 0.15s',
    margin:      0,
    boxShadow:   'none',
    WebkitAppearance: 'none',
  };

  const onFocus = e => {
    e.target.style.borderColor  = 'rgba(99,102,241,1)';
    e.target.style.background   = 'rgba(255,255,255,0.2)';
    e.target.style.borderStyle  = 'solid';
  };
  const onBlur = e => {
    e.target.style.borderColor  = 'rgba(99,102,241,0.7)';
    e.target.style.background   = 'rgba(255,255,255,0.12)';
    e.target.style.borderStyle  = 'dashed';
  };

  const onChange = e => setField(sectionId, field, e.target.value);

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        rows={Math.max(2, (value || '').split('\n').length)}
        className={className}
        style={inputStyle}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      className={className}
      style={{ ...inputStyle, height: 'auto' }}
    />
  );
}