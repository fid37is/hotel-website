// src/hooks/useEditMode.jsx
//
// Activates when the hotel website is loaded by the HMS CustomizePage
// inside an iframe with ?hms_edit=<token> in the URL.
//
// For normal guests — isEditMode is always false, zero UI impact.
// For HMS admin — edit mode activates after parent confirms the token,
// sections show Edit buttons, text fields become inputs on demand.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const EditModeContext = createContext(null);

function getEditToken() {
  try {
    return new URLSearchParams(window.location.search).get('hms_edit') || null;
  } catch {
    return null;
  }
}

function inIframe() {
  try { return window.self !== window.top; } catch { return true; }
}

export function EditModeProvider({ children }) {
  const [isEditMode,    setIsEditMode]    = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [content,       setContent]       = useState({});

  useEffect(() => {
    const token = getEditToken();
    if (!token || !inIframe()) return;

    const handler = (e) => {
      // Parent confirms token → activate edit mode with initial content
      if (e.data?.type === 'HMS_EDIT_READY' && e.data.token === token) {
        setIsEditMode(true);
        if (e.data.content) setContent(e.data.content);
      }
      // Parent pushes a content update (e.g. after reset to defaults)
      if (e.data?.type === 'HMS_CONTENT_SYNC' && e.data.content) {
        setContent(prev => ({ ...prev, ...e.data.content }));
      }
    };

    window.addEventListener('message', handler);

    // Request validation from HMS parent
    window.parent.postMessage({ type: 'HMS_EDIT_REQUEST', token }, '*');

    return () => window.removeEventListener('message', handler);
  }, []);

  const activateSection = useCallback((sectionId) => {
    setActiveSection(sectionId);
    window.parent?.postMessage({ type: 'HMS_SECTION_ACTIVE', sectionId }, '*');
  }, []);

  const deactivateSection = useCallback(() => {
    setActiveSection(null);
    window.parent?.postMessage({ type: 'HMS_SECTION_DONE' }, '*');
  }, []);

  const setField = useCallback((sectionId, field, value) => {
    setContent(prev => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] || {}), [field]: value },
    }));
    window.parent?.postMessage({ type: 'HMS_CONTENT_UPDATE', sectionId, field, value }, '*');
  }, []);

  return (
    <EditModeContext.Provider value={{ isEditMode, activeSection, content, activateSection, deactivateSection, setField }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}