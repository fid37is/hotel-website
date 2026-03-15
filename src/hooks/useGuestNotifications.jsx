// src/hooks/useGuestNotifications.jsx
//
// Manages guest-facing notifications via:
// 1. Socket.io — real-time chat messages + reservation updates from HMS
// 2. Local state — persisted in sessionStorage so they survive page nav
//
// Used by NotificationBell in Layout — works globally, not just on ChatPage.

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1/public', '') || 'http://localhost:5000';
const STORAGE_KEY = 'guest_notifications';

const GuestNotificationsContext = createContext(null);

const loadStored = () => {
    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
    } catch { return []; }
};

const saveStored = (items) => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50))); } catch { }
};

export function GuestNotificationsProvider({ children, guestToken }) {
    const [notifications, setNotifications] = useState(loadStored);
    const [connected, setConnected] = useState(false);
    const socketRef = useRef(null);

    const addNotification = useCallback((n) => {
        setNotifications(prev => {
            if (prev.find(p => p.id === n.id)) return prev;
            const next = [n, ...prev].slice(0, 50);
            saveStored(next);
            return next;
        });
    }, []);

    // ── Connect socket when guest is logged in ──────────────────────────────
    useEffect(() => {
        if (!guestToken) {
            socketRef.current?.disconnect();
            socketRef.current = null;
            return;
        }

        console.log('[socket] attempting connect to:', SOCKET_URL);

        const s = io(SOCKET_URL, {
            auth: { token: guestToken },
            transports: ['websocket'],
            reconnectionDelay: 2000,
        });

        s.on('connect', () => {
            setConnected(true);
            console.log('[socket] connected, id:', s.id);
        });

        s.on('connect_error', (err) => {
            console.error('[socket] connect_error:', err.message);
        });

        s.on('disconnect', (reason) => {
            setConnected(false);
            console.log('[socket] disconnected:', reason);
        });

        // Log every incoming event for debugging
        s.onAny((event, ...args) => {
            console.log('[socket] event received:', event, args);
        });

        // ── Chat: new message from staff ──────────────────────────────────────
        s.on('new_chat_message', ({ conversationId, senderName, deptName, preview }) => {
            addNotification({
                id: `msg-${conversationId}-${Date.now()}`,
                type: 'chat',
                title: `New message from ${senderName || deptName || 'Hotel Team'}`,
                body: preview || '',
                link: '/chat',
                read: false,
                createdAt: new Date().toISOString(),
            });
        });

        // ── Reservation update from HMS ───────────────────────────────────────
        s.on('reservation_updated', ({ reservation, event }) => {
            const messages = {
                checked_in: { title: 'You\'re checked in!', body: `Welcome — Room ${reservation.rooms?.number || reservation.room_number || ''} is ready.` },
                checked_out: { title: 'Check-out complete', body: 'Thank you for your stay. We hope to see you again.' },
                cancelled: { title: 'Reservation cancelled', body: `Booking ${reservation.reservation_no} has been cancelled.` },
                confirmed: { title: 'Booking confirmed', body: `Your reservation ${reservation.reservation_no} is confirmed.` },
            };
            const m = messages[event] || { title: 'Reservation update', body: `Your booking ${reservation.reservation_no || ''} has been updated.` };
            addNotification({
                id: `res-${reservation.id}-${event}-${Date.now()}`,
                type: 'reservation',
                title: m.title,
                body: m.body,
                link: '/account',
                read: false,
                createdAt: new Date().toISOString(),
            });
        });

        // ── Generic guest notification from HMS ───────────────────────────────
        s.on('guest_notification', (payload) => {
            addNotification({
                id: payload.id || `notif-${Date.now()}`,
                type: payload.type || 'info',
                title: payload.title || 'Notification',
                body: payload.body || '',
                link: payload.link || null,
                read: false,
                createdAt: payload.createdAt || new Date().toISOString(),
            });
        });

        socketRef.current = s;
        return () => { s.disconnect(); socketRef.current = null; };
    }, [guestToken, addNotification]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markRead = useCallback((id) => {
        setNotifications(prev => {
            const next = prev.map(n => n.id === id ? { ...n, read: true } : n);
            saveStored(next);
            return next;
        });
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications(prev => {
            const next = prev.map(n => ({ ...n, read: true }));
            saveStored(next);
            return next;
        });
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
        saveStored([]);
    }, []);

    const joinConversation = useCallback((conversationId) => {
        socketRef.current?.emit('join_conversation', { conversationId });
    }, []);

    return (
        <GuestNotificationsContext.Provider value={{
            notifications, unreadCount, connected,
            markRead, markAllRead, clearAll, joinConversation,
        }}>
            {children}
        </GuestNotificationsContext.Provider>
    );
}

export const useGuestNotifications = () => {
    const ctx = useContext(GuestNotificationsContext);
    if (!ctx) throw new Error('useGuestNotifications must be used inside GuestNotificationsProvider');
    return ctx;
};