// src/pages/ChatPage.jsx — Pure Tailwind
// Guest messaging — only accessible when reservation status is 'checked_in'

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGuestAuth }  from '../hooks/useGuestAuth.jsx';
import { useHotelConfig } from '../hooks/useHotelConfig.jsx';
import { ChatProvider, useChat } from '../hooks/useChat.jsx';
import { chatApi } from '../services/api.js';

// ── Department selector ────────────────────────────────────────────────────
function DeptSelector({ reservation, onSelect }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chatApi.getDepartments()
      .then(res => setDepartments(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col gap-3 p-6">
      {[1,2,3,4].map(i => <div key={i} className="skeleton h-16 rounded-lg" />)}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h2 className="font-display text-2xl font-medium mb-1">Request Service</h2>
        <p className="text-sm text-muted">Select a department to start a conversation</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {departments.map(dept => (
          <button key={dept.id} onClick={() => onSelect(dept)}
            className="w-full text-left p-4 rounded-lg border border-border hover:border-secondary/50 hover:bg-secondary/5 transition-all flex items-center gap-4">
            <span className="text-2xl w-10 text-center">{dept.icon}</span>
            <div>
              <p className="font-medium text-sm">{dept.name}</p>
              {dept.description && <p className="text-xs text-muted mt-0.5">{dept.description}</p>}
            </div>
            <svg className="ml-auto text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Message bubble ─────────────────────────────────────────────────────────
function Bubble({ message, isOwn }) {
  const time = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && <span className="text-xs text-muted px-1">{message.sender_name}</span>}
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${isOwn
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-surface border border-border text-primary rounded-bl-sm'
          }`}>
          {message.content}
        </div>
        <span className="text-[10px] text-muted px-1">{time}</span>
      </div>
    </div>
  );
}

// ── Conversation thread ────────────────────────────────────────────────────
function ConversationThread({ conversation, guestId, onBack }) {
  const { messages, typingConvs, sendMessage, emitTyping, emitStopTyping } = useChat();
  const [input, setInput]     = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

  const msgs    = messages[conversation.id] || [];
  const isTyping = typingConvs[conversation.id];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, isTyping]);

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

  const handleInputChange = (e) => {
    setInput(e.target.value);
    emitTyping(conversation.id);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => emitStopTyping(conversation.id), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <button onClick={onBack} className="p-1 text-muted hover:text-primary transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span className="text-xl">{conversation.departments?.icon}</span>
        <div className="flex-1">
          <p className="font-medium text-sm">{conversation.departments?.name}</p>
          <p className={`text-[10px] ${conversation.status === 'closed' ? 'text-muted' : 'text-green-500'}`}>
            {conversation.status === 'closed' ? 'Closed' : 'Active'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {msgs.length === 0 && (
          <div className="text-center py-12 text-muted text-sm">
            <p className="text-2xl mb-2">{conversation.departments?.icon}</p>
            <p>Say hello to {conversation.departments?.name}!</p>
            <p className="text-xs mt-1">We'll respond as soon as possible.</p>
          </div>
        )}
        {msgs.map(msg => (
          <Bubble key={msg.id} message={msg} isOwn={msg.sender_type === 'guest'} />
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border px-4 py-2.5 rounded-2xl rounded-bl-sm flex gap-1 items-center">
              {[0,1,2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {conversation.status === 'closed' ? (
        <div className="p-4 border-t border-border text-center text-xs text-muted">
          This conversation has been closed by staff.
        </div>
      ) : (
        <div className="p-4 border-t border-border flex gap-2 items-end">
          <textarea
            className="input flex-1 resize-none text-sm"
            rows={1}
            placeholder="Type a message…"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{ maxHeight: 120, overflowY: 'auto' }}
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

// ── Inner page (inside ChatProvider) ──────────────────────────────────────
function ChatInner({ reservation, guestId }) {
  const { conversations, activeConvId, setActiveConvId, loadConversations, openConversation, loadMessages } = useChat();
  const [view, setView]         = useState('list'); // 'list' | 'new' | 'thread'
  const [loadingConvs, setLoadingConvs] = useState(true);

  useEffect(() => {
    loadConversations(reservation.id).finally(() => setLoadingConvs(false));
  }, [reservation.id]);

  const handleSelectDept = async (dept) => {
    try {
      await openConversation(reservation.id, dept.id);
      setView('thread');
    } catch (err) {
      alert(err.message || 'Could not start conversation.');
    }
  };

  const handleOpenExisting = async (conv) => {
    setActiveConvId(conv.id);
    await loadMessages(conv.id);
    setView('thread');
  };

  const activeConv = conversations.find(c => c.id === activeConvId);

  if (view === 'new') {
    return (
      <DeptSelector
        reservation={reservation}
        onSelect={handleSelectDept}
      />
    );
  }

  if (view === 'thread' && activeConv) {
    return (
      <ConversationThread
        conversation={activeConv}
        guestId={guestId}
        onBack={() => setView('list')}
      />
    );
  }

  // Conversation list
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-medium mb-0.5">Messages</h2>
          <p className="text-xs text-muted">Room {reservation.rooms?.room_number || ''}</p>
        </div>
        <button onClick={() => setView('new')} className="btn btn--primary text-xs py-2 px-4">
          + New Request
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loadingConvs ? (
          <div className="p-4 flex flex-col gap-3">
            {[1,2].map(i => <div key={i} className="skeleton h-16 rounded-lg" />)}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 gap-3">
            <p className="text-4xl">💬</p>
            <p className="font-display text-xl font-medium">No messages yet</p>
            <p className="text-sm text-muted">Contact any department for assistance during your stay.</p>
            <button onClick={() => setView('new')} className="btn btn--primary mt-2">Request Service</button>
          </div>
        ) : (
          conversations.map(conv => {
            const lastMsg = conv.messages?.slice(-1)[0];
            const unread  = conv.messages?.filter(m => m.sender_type === 'staff' && !m.read_at).length || 0;
            return (
              <button key={conv.id} onClick={() => handleOpenExisting(conv)}
                className="w-full text-left px-6 py-4 border-b border-border hover:bg-bg transition-colors flex items-center gap-4">
                <span className="text-2xl w-10 text-center shrink-0">{conv.departments?.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="font-medium text-sm">{conv.departments?.name}</p>
                    {lastMsg && (
                      <span className="text-[10px] text-muted shrink-0">
                        {new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted truncate">
                    {lastMsg ? lastMsg.content : 'No messages yet'}
                  </p>
                </div>
                {unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-secondary text-white text-[10px] flex items-center justify-center shrink-0 font-medium">
                    {unread}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function ChatPage() {
  const hotelConfig = useHotelConfig();
  const { guest, token, isLoggedIn, loading: authLoading } = useGuestAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [reservation, setReservation] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');

  useEffect(() => {
    document.title = `Messages | ${hotelConfig.shortName}`;
  }, [hotelConfig.shortName]);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) { navigate('/login', { state: { from: '/chat' }, replace: true }); return; }

    // Find the guest's active checked-in reservation
    import('../services/api.js').then(({ guestAuthApi }) => {
      guestAuthApi.myReservations(token)
        .then(res => {
          const checkedIn = (res.data || []).find(r => r.status === 'checked_in');
          if (!checkedIn) {
            setError('Chat is only available during your stay. You must be checked in to use this feature.');
          } else {
            setReservation(checkedIn);
          }
        })
        .catch(() => setError('Could not load your reservation.'))
        .finally(() => setLoading(false));
    });
  }, [authLoading, isLoggedIn]);

  if (authLoading || loading) return (
    <div className="bg-bg min-h-screen pt-nav flex items-center justify-center">
      <div className="flex flex-col gap-3 w-full max-w-md p-6">
        <div className="skeleton h-12 rounded-lg" />
        <div className="skeleton h-16 rounded-lg" />
        <div className="skeleton h-16 rounded-lg" />
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-bg min-h-screen pt-nav flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-4xl mb-4">🏨</p>
        <h1 className="font-display text-2xl font-medium mb-2">Not Checked In</h1>
        <p className="text-sm text-muted mb-6">{error}</p>
        <button onClick={() => navigate('/account')} className="btn btn--primary">View My Bookings</button>
      </div>
    </div>
  );

  return (
    <div className="bg-bg min-h-screen pt-nav pb-10">
      <div className="container max-w-lg">
        <div className="bg-surface rounded-lg border border-border overflow-hidden" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
          <ChatProvider guestToken={token}>
            <ChatInner reservation={reservation} guestId={guest?.id} />
          </ChatProvider>
        </div>
      </div>
    </div>
  );
}