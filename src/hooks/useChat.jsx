// src/hooks/useChat.jsx
//
// Manages Socket.io connection + conversation state for the hotel website.
// Used by ChatPage — one instance per active conversation.

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { chatApi } from '../services/api.js';

const ChatContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1/public', '') || 'http://localhost:5000';

export function ChatProvider({ children, guestToken }) {
  const [socket,        setSocket]        = useState(null);
  const [connected,     setConnected]     = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConvId,  setActiveConvId]  = useState(null);
  const [messages,      setMessages]      = useState({});   // { [convId]: Message[] }
  const [typingConvs,   setTypingConvs]   = useState({});   // { [convId]: boolean }
  const typingTimerRef = useRef({});
  const socketRef      = useRef(null);  // stable ref so callbacks always see latest socket

  // ── Connect socket ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!guestToken) return;

    const s = io(SOCKET_URL, {
      auth:              { token: guestToken },
      transports:        ['websocket'],
      reconnectionDelay: 1000,
    });

    s.on('connect',    () => setConnected(true));
    s.on('disconnect', () => setConnected(false));

    // Deduplicate — sendMessage already adds the message optimistically,
    // so ignore the socket echo if the message id is already in state.
    s.on('new_message', ({ conversationId, message }) => {
      setMessages(prev => {
        const existing = prev[conversationId] || [];
        if (existing.find(m => m.id === message.id)) return prev;
        return { ...prev, [conversationId]: [...existing, message] };
      });
      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, last_message_at: message.created_at } : c
      ));
    });

    s.on('typing', ({ conversationId }) => {
      setTypingConvs(prev => ({ ...prev, [conversationId]: true }));
      clearTimeout(typingTimerRef.current[conversationId]);
      typingTimerRef.current[conversationId] = setTimeout(() => {
        setTypingConvs(prev => ({ ...prev, [conversationId]: false }));
      }, 3000);
    });

    s.on('stop_typing', ({ conversationId }) => {
      setTypingConvs(prev => ({ ...prev, [conversationId]: false }));
    });

    s.on('conversation_closed', ({ conversationId }) => {
      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, status: 'closed' } : c
      ));
    });

    socketRef.current = s;
    setSocket(s);
    return () => { s.disconnect(); socketRef.current = null; };
  }, [guestToken]);

  // ── Load conversations for a stay ───────────────────────────────────────
  const loadConversations = useCallback(async (reservationId) => {
    try {
      const res = await chatApi.getConversations(reservationId, guestToken);
      setConversations(res.data || []);
    } catch {}
  }, [guestToken]);

  // ── Open / create a conversation with a department ──────────────────────
  const openConversation = useCallback(async (reservationId, departmentId) => {
    const res = await chatApi.startConversation(reservationId, departmentId, guestToken);
    const convo = res.data;

    setConversations(prev => {
      const exists = prev.find(c => c.id === convo.id);
      return exists ? prev : [convo, ...prev];
    });

    // Join the socket room so we receive real-time messages
    socketRef.current?.emit('join_conversation', { conversationId: convo.id });

    // Load messages for the new conversation
    await loadMessages(convo.id);
    setActiveConvId(convo.id);

    return convo;
  }, [guestToken]);

  // ── Load message thread ─────────────────────────────────────────────────
  // Always emit join_conversation when loading a thread so the guest
  // is in the socket room and receives real-time messages — this covers
  // both new conversations and existing ones selected after page load/reload.
  const loadMessages = useCallback(async (conversationId) => {
    try {
      // Join the room before fetching so no messages are missed
      socketRef.current?.emit('join_conversation', { conversationId });

      const res = await chatApi.getMessages(conversationId, guestToken);
      setMessages(prev => ({ ...prev, [conversationId]: res.data || [] }));
    } catch {}
  }, [guestToken]);

  // ── Send a message ──────────────────────────────────────────────────────
  const sendMessage = useCallback(async (conversationId, content) => {
    const res = await chatApi.sendMessage(conversationId, content, guestToken);
    const message = res.data;
    // Add optimistically — socket echo will be ignored due to dedup above
    setMessages(prev => {
      const existing = prev[conversationId] || [];
      if (existing.find(m => m.id === message.id)) return prev;
      return { ...prev, [conversationId]: [...existing, message] };
    });
    return message;
  }, [guestToken]);

  // ── Typing indicators ───────────────────────────────────────────────────
  const emitTyping     = (conversationId) => socketRef.current?.emit('typing',      { conversationId });
  const emitStopTyping = (conversationId) => socketRef.current?.emit('stop_typing', { conversationId });

  return (
    <ChatContext.Provider value={{
      connected, conversations, activeConvId, setActiveConvId,
      messages, typingConvs,
      loadConversations, openConversation, loadMessages,
      sendMessage, emitTyping, emitStopTyping,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
};