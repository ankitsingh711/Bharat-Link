'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { notificationsApi } from '@/lib/api/endpoints/notifications';
import { connectSocket } from '@/lib/socket/socket';

export function NotificationBell() {
    const { data: session } = useSession();
    const [unreadCount, setUnreadCount] = useState(0);

    // Connect to WebSocket and join user's notification room
    useEffect(() => {
        if (!session?.user?.id) return;

        const socket = connectSocket();

        // Join user's notification room for targeted notifications
        socket.emit('join:user', session.user.id);

        // Listen for new notifications
        const handleNewNotification = () => {
            setUnreadCount((prev) => prev + 1);
        };

        socket.on('notification:new', handleNewNotification);

        return () => {
            socket.off('notification:new', handleNewNotification);
        };
    }, [session?.user?.id]);

    // Fetch unread count on mount
    useEffect(() => {
        fetchUnreadCount();
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const count = await notificationsApi.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    return (
        <div className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 19h-8.3a3 3 0 01-5.4 0H2v-1c0-4.4 3.6-8 8-8h4c4.4 0 8 3.6 8 8v1zM18.6 8.6l1.4-1.4C21.9 5.3 23 3.1 23 1h-2c0 1.6-.8 3.1-2.1 4.1l-1.4 1.4-.9-.9-1.4 1.4.9.9-1.4 1.4.9.9c1.2-1.2 1.2-3.1 0-4.2l1.9-1.9zM8 6.5A2.5 2.5 0 0110.5 4h3A2.5 2.5 0 0116 6.5V8h-8V6.5z" />
            </svg>
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[18px]">
                    {unreadCount > 99 ? '99+' : unreadCount}
                </span>
            )}
        </div>
    );
}
