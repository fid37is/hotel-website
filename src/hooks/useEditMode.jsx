// src/hooks/useEditMode.jsx
//
// Activates when the hotel website is loaded by the HMS CustomizePage
// inside an iframe with ?hms_edit=<token> in the URL.
//
// For normal guests — isEditMode is always false, zero UI impact.
// For HMS admin — edit mode activates after parent confirms the token,
// sections show Edit buttons, text fields become inputs on demand.
//
// HOW CONTENT FLOWS:
//   1. HMS parent sends HMS_EDIT_READY with initial saved content.
//   2. Admin edits a field → setField() updates edit.content immediately.
//   3. Sections read: isEditMode ? (savedFromAPI merged with edit.content) : savedFromAPI
//   4. After Done, section stays in isEditMode=true so edit.content still applies —
//      the admin sees their changes persist visually until the HMS saves and reloads.
//   5. setField also postMessages HMS_CONTENT_UPDATE to the parent for persistence,
//      AND dispatches HMS_PREVIEW on window so useHotelConfig.content stays in sync.

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

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

// Dispatch a synthetic message event that useHotelConfig can hear.
// Kept outside of React state updaters so it always fires synchronously.
function dispatchPreview(sectionId, sectionContent) {
  try {
    window.dispatchEvent(new MessageEvent('message', {
      data: {
        type: 'HMS_PREVIEW',
        content: { [sectionId]: sectionContent },
      },
    }));
  } catch {
    // Fallback: directly mutate the hotelConfig content via a custom event
    window.dispatchEvent(new CustomEvent('hms_content_update', {
      detail: { [sectionId]: sectionContent },
    }));
  }
}

export function EditModeProvider({ children }) {
  const [isEditMode,    setIsEditMode]    = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [content,       setContent]       = useState({});
  // Keep a ref so dispatchPreview always has the latest content without stale closures
  const contentRef = useRef({});

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    const token = getEditToken();
    if (!token || !inIframe()) return;

    const handler = (e) => {
      // Parent confirms token → activate edit mode with initial content
      if (e.data?.type === 'HMS_EDIT_READY' && e.data.token === token) {
        setIsEditMode(true);
        if (e.data.content) {
          setContent(e.data.content);
          contentRef.current = e.data.content;
        }
      }
      // Parent pushes a content update (e.g. after reset to defaults)
      if (e.data?.type === 'HMS_CONTENT_SYNC' && e.data.content) {
        setContent(prev => {
          const next = { ...prev, ...e.data.content };
          contentRef.current = next;
          return next;
        });
      }

      // HMS parent signals a successful save — clear the config cache so
      // the next page load fetches fresh data from the API
      if (e.data?.type === 'HMS_CACHE_BUST') {
        try { localStorage.removeItem('hms_config_v2'); } catch {}
        // Force a full config refetch by reloading the iframe
        if (e.data.reload) window.location.reload();
      }

      // HMS parent requests scroll to a section
      if (e.data?.type === 'HMS_SCROLL_TO' && e.data.sectionId) {
        const el = document.querySelector(`[data-section="${e.data.sectionId}"], #${e.data.sectionId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // HMS_PREVIEW can also carry content (sent by CustomizePage when sidebar
      // edits happen). Merge it in so iframe reflects sidebar changes live.
      if (e.data?.type === 'HMS_PREVIEW' && e.data.content) {
        setContent(prev => {
          const next = { ...prev };
          Object.keys(e.data.content).forEach(sid => {
            next[sid] = { ...(prev[sid] || {}), ...e.data.content[sid] };
          });
          contentRef.current = next;
          return next;
        });
      }
    };

    window.addEventListener('message', handler);
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
    setContent(prev => {
      const sectionContent = { ...(prev[sectionId] || {}), [field]: value };
      const next = { ...prev, [sectionId]: sectionContent };
      contentRef.current = next;

      // Fire outside of React batching so useHotelConfig receives it synchronously.
      // Use setTimeout(0) to ensure it runs after the state update commits.
      setTimeout(() => dispatchPreview(sectionId, sectionContent), 0);

      return next;
    });

    // Notify HMS parent so it can persist the change.
    window.parent?.postMessage({ type: 'HMS_CONTENT_UPDATE', sectionId, field, value }, '*');
  }, []);

  // Expose a way for sections to get the merged content for any section,
  // regardless of whether it is the activeSection.
  // In edit mode: edit.content[sectionId] takes precedence over hotelConfig.content.
  const getContent = useCallback((sectionId, savedFromConfig) => {
    if (!isEditMode) return savedFromConfig || {};
    return { ...(savedFromConfig || {}), ...(contentRef.current[sectionId] || {}) };
  }, [isEditMode]);

  return (
    <EditModeContext.Provider value={{ isEditMode, activeSection, content, activateSection, deactivateSection, setField, getContent }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}