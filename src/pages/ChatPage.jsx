// src/pages/ChatPage.jsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuestAuth }   from '../hooks/useGuestAuth.jsx';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';
import { ChatProvider, useChat } from '../hooks/useChat.jsx';
import { chatApi } from '../services/api.js';

const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ── Department icon ─────────────────────────────────────────────────────────
function DeptIcon({ name = '', size = 20 }) {
  const n = name.toLowerCase();
  const attrs = { fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', viewBox: '0 0 24 24', width: size, height: size };
  if (n.includes('front') || n.includes('desk') || n.includes('reception'))
    return <svg {...attrs}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
  if (n.includes('house') || n.includes('clean'))
    return <svg {...attrs}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 14h6M9 18h6"/></svg>;
  if (n.includes('room') || n.includes('service') || n.includes('food'))
    return <svg {...attrs}><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>;
  if (n.includes('maint') || n.includes('repair') || n.includes('tech'))
    return <svg {...attrs}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>;
  if (n.includes('spa') || n.includes('wellness') || n.includes('gym'))
    return <svg {...attrs}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
  if (n.includes('concierge') || n.includes('bell'))
    return <svg {...attrs}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
  if (n.includes('bar') || n.includes('drink') || n.includes('lounge'))
    return <svg {...attrs}><path d="M8 22h8"/><path d="M12 11v11"/><path d="M20 2H4l6 9.46V17l4 2V11.46L20 2z"/></svg>;
  if (n.includes('security') || n.includes('guard'))
    return <svg {...attrs}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  return <svg {...attrs}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
}

// ── Message bubble ──────────────────────────────────────────────────────────
function Bubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[78%] flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && (
          <span className="text-xs text-muted px-1 font-medium">{message.sender_name}</span>
        )}
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${isOwn ? 'bg-primary text-white rounded-br-sm' : 'bg-surface border border-border text-primary rounded-bl-sm'}`}>
          {message.content}
        </div>
        <span className="text-[11px] text-muted px-1">{fmtTime(message.created_at)}</span>
      </div>
    </div>
  );
}

// ── Dept list — used in both desktop sidebar and mobile drawer ───────────────
function DeptList({ departments, conversations, messages, activeConvId, onSelect, reservation }) {
  const [showPrevious, setShowPrevious] = useState(false);

  // Build a map of dept -> most recent OPEN conv, and dept -> closed convs
  const openConvByDept   = {};
  const closedConvsByDept = {};
  const unreadByDept     = {};

  conversations.forEach(c => {
    const msgs = messages[c.id] || c.messages || [];
    const n = msgs.filter(m => m.sender_type === 'staff' && !m.read_at).length;
    if (n > 0) unreadByDept[c.department_id] = (unreadByDept[c.department_id] || 0) + n;

    if (c.status === 'open') {
      // Keep most recent open conv per dept
      if (!openConvByDept[c.department_id] ||
          new Date(c.created_at) > new Date(openConvByDept[c.department_id].created_at)) {
        openConvByDept[c.department_id] = c;
      }
    } else {
      if (!closedConvsByDept[c.department_id]) closedConvsByDept[c.department_id] = [];
      closedConvsByDept[c.department_id].push(c);
    }
  });

  const hasClosed = Object.keys(closedConvsByDept).length > 0;

  const DeptRow = ({ dept, conv, isActive }) => {
    const unread  = unreadByDept[dept.id] || 0;
    const lastMsg = conv?.messages?.slice(-1)[0];
    return (
      <button onClick={() => onSelect(dept, conv)}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left mb-1
          ${isActive ? 'bg-primary text-white' : 'hover:bg-border/50 text-primary'}`}>
        <div className={`relative shrink-0 ${isActive ? 'text-white' : 'text-muted'}`}>
          <DeptIcon name={dept.name} size={18} />
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-0.5 rounded-full
              bg-secondary text-white text-[9px] flex items-center justify-center font-bold">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-primary'}`}>
            {dept.name}
          </p>
          <p className={`text-xs truncate mt-0.5
            ${isActive ? 'text-white/70' : unread > 0 ? 'text-secondary font-medium' : 'text-muted'}`}>
            {conv ? (lastMsg?.content || 'No messages yet') : 'Tap to contact'}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-4 border-b border-border shrink-0">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Departments</p>
        <p className="text-xs text-muted mt-1">
          Room {reservation.rooms?.room_number || reservation.room_number || '—'}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {/* All departments — show open conv if exists, else no conv */}
        {departments.map(dept => {
          const conv = openConvByDept[dept.id] || null;
          const isActive = conv?.id === activeConvId;
          return <DeptRow key={dept.id} dept={dept} conv={conv} isActive={isActive} />;
        })}

        {/* Previous (closed) conversations */}
        {hasClosed && (
          <div className="mt-2">
            <button onClick={() => setShowPrevious(v => !v)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold
                text-muted hover:text-primary transition-colors">
              <span className="uppercase tracking-wider">Previous</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                width="14" height="14"
                className={`transition-transform ${showPrevious ? 'rotate-180' : ''}`}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {showPrevious && departments.map(dept => {
              const closed = closedConvsByDept[dept.id];
              if (!closed) return null;
              return closed.map(conv => (
                <button key={conv.id} onClick={() => onSelect(dept, conv)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left mb-1
                    ${conv.id === activeConvId ? 'bg-primary/10 text-primary' : 'hover:bg-border/50 text-muted'}`}>
                  <span className="shrink-0 opacity-50"><DeptIcon name={dept.name} size={16} /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{dept.name}</p>
                    <p className="text-[11px] text-muted truncate">
                      {new Date(conv.created_at).toLocaleDateString()} · Closed
                    </p>
                  </div>
                </button>
              ));
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Mobile dept picker — full screen grid shown before any chat is open ──────
function DeptPicker({ departments, conversations, onSelect }) {
  const convByDept = {};
  conversations.forEach(c => { convByDept[c.department_id] = c; });
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-border shrink-0">
        <p className="text-base font-semibold text-primary">Messages</p>
        <p className="text-sm text-muted mt-0.5">How can we help you today?</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {departments.map(dept => {
            const conv    = convByDept[dept.id];
            const lastMsg = conv?.messages?.slice(-1)[0];
            const unread  = (conv?.messages || []).filter(m => m.sender_type === 'staff' && !m.read_at).length;
            return (
              <button key={dept.id} onClick={() => onSelect(dept, conv)}
                className="relative flex flex-col items-start gap-3 p-4 rounded-xl border border-border
                  bg-surface hover:border-primary/40 hover:bg-bg transition-all text-left">
                {unread > 0 && (
                  <span className="absolute top-3 right-3 min-w-[20px] h-5 px-1 rounded-full
                    bg-secondary text-white text-[10px] flex items-center justify-center font-bold">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
                <span className="text-muted"><DeptIcon name={dept.name} size={22} /></span>
                <div>
                  <p className="text-sm font-semibold text-primary">{dept.name}</p>
                  <p className="text-xs text-muted mt-0.5 line-clamp-1">
                    {lastMsg ? lastMsg.content : 'Tap to message'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Thread ──────────────────────────────────────────────────────────────────
function Thread({ conversation, onOpenDepts, onNewConversation }) {
  const { messages, typingConvs, sendMessage, emitTyping, emitStopTyping } = useChat();
  const [input, setInput]     = useState('');
  const [sending, setSending] = useState(false);
  const typingTimer = useRef(null);

  const msgs     = messages[conversation.id] || [];
  const isTyping = typingConvs[conversation.id];

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending || conversation.status === 'closed') return;
    setInput('');
    setSending(true);
    try {
      await sendMessage(conversation.id, content);
      emitStopTyping(conversation.id);
    } catch {}
    finally { setSending(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    emitTyping(conversation.id);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => emitStopTyping(conversation.id), 2000);
  };

  return (
    <div className="flex flex-col h-full">

      {/* Thread header — always visible, never hidden */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface shrink-0">
        <button onClick={onOpenDepts} aria-label="Switch department"
          className="md:hidden shrink-0 w-9 h-9 flex items-center justify-center rounded-lg
            text-muted hover:text-primary hover:bg-bg transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <span className="shrink-0 text-muted">
          <DeptIcon name={conversation.chat_departments?.name} size={20} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary truncate">
            {conversation.chat_departments?.name}
          </p>
          <p className={`text-xs font-medium ${conversation.status === 'closed' ? 'text-muted' : 'text-green-500'}`}>
            {conversation.status === 'closed' ? 'Closed' : '● Active'}
          </p>
        </div>
      </div>

      {/* Messages — scrollable area between header and input */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4">
        {msgs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-muted">
            <span className="opacity-20"><DeptIcon name={conversation.chat_departments?.name} size={48} /></span>
            <p className="text-sm font-medium">Say hello to {conversation.chat_departments?.name}!</p>
            <p className="text-xs">We'll respond as soon as possible.</p>
          </div>
        )}
        {msgs.map(msg => <Bubble key={msg.id} message={msg} isOwn={msg.sender_type === 'guest'} />)}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
              {[0,1,2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input — always pinned to bottom */}
      {conversation.status === 'closed' ? (
        <div className="px-4 py-4 border-t border-border shrink-0 bg-surface flex flex-col items-center gap-3">
          <p className="text-sm text-muted">This conversation has been closed.</p>
          <button onClick={() => onNewConversation(conversation.chat_departments)}
            className="btn btn--primary text-sm px-5 py-2">
            Start New Conversation
          </button>
        </div>
      ) : (
        <div className="flex gap-2 items-end px-4 py-3 border-t border-border bg-surface shrink-0">
          <textarea
            className="input flex-1 resize-none text-sm py-2.5"
            rows={1}
            placeholder="Type a message…"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{ maxHeight: 96, overflowY: 'auto' }}
          />
          <button onClick={handleSend} disabled={!input.trim() || sending}
            className="btn btn--primary p-2.5 shrink-0 disabled:opacity-40">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Chat inner ──────────────────────────────────────────────────────────────
function ChatInner({ reservation, guestId }) {
  const { conversations, activeConvId, setActiveConvId,
          loadConversations, openConversation, loadMessages, messages } = useChat();

  const [loadingConvs,   setLoadingConvs]   = useState(true);
  const [departments,    setDepartments]    = useState([]);
  const [deptDrawerOpen, setDeptDrawerOpen] = useState(false);

  useEffect(() => {
    chatApi.getDepartments().then(res => setDepartments(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    loadConversations(reservation.id).finally(() => setLoadingConvs(false));
  }, [reservation.id]);

  const handleSelectDept = async (dept, existingConv) => {
    setDeptDrawerOpen(false);
    if (existingConv && existingConv.status === 'open') {
      // Open existing active conversation
      setActiveConvId(existingConv.id);
      await loadMessages(existingConv.id);
    } else if (existingConv && existingConv.status === 'closed') {
      // Viewing a closed conversation from Previous section — just show it
      setActiveConvId(existingConv.id);
      await loadMessages(existingConv.id);
    } else {
      // No conversation yet — start fresh
      try { await openConversation(reservation.id, dept.id); }
      catch (err) { alert(err.message || 'Could not start conversation.'); }
    }
  };

  // Called when guest taps "Start New Conversation" on a closed thread
  const handleNewConversation = async (dept) => {
    if (!dept) return;
    try { await openConversation(reservation.id, dept.id); }
    catch (err) { alert(err.message || 'Could not start conversation.'); }
  };

  const activeConv   = conversations.find(c => c.id === activeConvId);
  const listProps    = { departments, conversations, messages, activeConvId, onSelect: handleSelectDept, reservation };

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Desktop sidebar — always visible on md+ ── */}
      <div className="hidden md:flex flex-col border-r border-border shrink-0 bg-bg" style={{ width: 240 }}>
        {loadingConvs
          ? <div className="p-3 pt-4 flex flex-col gap-2">{[1,2,3,4,5].map(i => <div key={i} className="skeleton h-12 rounded-lg" />)}</div>
          : <DeptList {...listProps} />
        }
      </div>

      {/* ── Mobile dept drawer — TRUE overlay, rendered outside flex flow ── */}
      {deptDrawerOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeptDrawerOpen(false)} />
          {/* Drawer panel — slides from left, sits on top of everything */}
          <div className="absolute top-0 left-0 bottom-0 bg-surface flex flex-col shadow-2xl" style={{ width: '75vw', maxWidth: 300 }}>
            <div className="flex items-center justify-between px-4 py-4 border-b border-border shrink-0">
              <p className="text-sm font-semibold text-primary">Departments</p>
              <button onClick={() => setDeptDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-bg transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <DeptList {...listProps} />
          </div>
        </div>
      )}

      {/* ── Right panel — thread or picker ── */}
      <div className="flex-1 min-w-0 overflow-hidden flex flex-col">

        {/* Mobile: no active conversation → show dept grid */}
        {!activeConv && (
          <div className="flex flex-col h-full md:hidden">
            {loadingConvs
              ? <div className="p-4 grid grid-cols-2 gap-3">{[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
              : <DeptPicker departments={departments} conversations={conversations} onSelect={handleSelectDept} />
            }
          </div>
        )}

        {/* Mobile: active conversation → thread */}
        {activeConv && (
          <div className="flex flex-col h-full md:hidden">
            <Thread conversation={activeConv} guestId={guestId} onOpenDepts={() => setDeptDrawerOpen(true)} onNewConversation={handleNewConversation} />
          </div>
        )}

        {/* Desktop: active conversation → thread */}
        {activeConv && (
          <div className="hidden md:flex flex-col h-full">
            <Thread conversation={activeConv} guestId={guestId} onOpenDepts={() => setDeptDrawerOpen(true)} onNewConversation={handleNewConversation} />
          </div>
        )}

        {/* Desktop: no active conversation → placeholder */}
        {!activeConv && (
          <div className="hidden md:flex flex-col items-center justify-center h-full text-center gap-3 text-muted p-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="56" height="56" className="opacity-20">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            <p className="font-display text-xl font-medium text-primary">Select a department</p>
            <p className="text-sm">Choose from the sidebar to start a conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const hotelConfig = useHotelConfig();
  const { guest, token, isLoggedIn, loading: authLoading } = useGuestAuth();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');

  useEffect(() => { document.title = `Messages | ${hotelConfig.shortName}`; }, [hotelConfig.shortName]);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) { navigate('/login', { state: { from: '/chat' }, replace: true }); return; }
    import('../services/api.js').then(({ guestAuthApi }) => {
      guestAuthApi.myReservations(token)
        .then(res => {
          const checkedIn = (res.data || []).find(r => r.status === 'checked_in');
          if (!checkedIn) setError('Chat is only available during your stay. You must be checked in to use this feature.');
          else setReservation(checkedIn);
        })
        .catch(() => setError('Could not load your reservation.'))
        .finally(() => setLoading(false));
    });
  }, [authLoading, isLoggedIn]);

  if (authLoading || loading) return (
    <div className="fixed inset-0 bg-bg flex items-center justify-center" style={{ paddingTop: 'var(--h-nav, 64px)' }}>
      <div className="animate-pulse w-full max-w-4xl mx-4 rounded-lg border border-border overflow-hidden flex" style={{ height: 520 }}>
        <div className="bg-border/30 hidden md:block" style={{ width: 240 }} />
        <div className="flex-1 bg-border/20" />
      </div>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 bg-bg flex items-center justify-center px-4" style={{ paddingTop: 'var(--h-nav, 64px)' }}>
      <div className="text-center max-w-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" className="mx-auto mb-4 text-muted opacity-40">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <h1 className="font-display text-2xl font-medium mb-2">Not Checked In</h1>
        <p className="text-sm text-muted mb-6">{error}</p>
        <button onClick={() => navigate('/account')} className="btn btn--primary">View My Bookings</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-bg flex flex-col" style={{ paddingTop: 'var(--h-nav, 64px)' }}>
      <div className="flex-1 flex flex-col overflow-hidden md:p-4">
        <div className="flex-1 flex flex-col overflow-hidden w-full max-w-4xl mx-auto
          bg-surface border-t md:border border-border md:rounded-lg">
          <ChatProvider guestToken={token}>
            <ChatInner reservation={reservation} guestId={guest?.id} />
          </ChatProvider>
        </div>
      </div>
    </div>
  );
}