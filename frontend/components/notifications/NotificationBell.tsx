'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { notificationsApi } from '@/lib/api/endpoints/notifications';
import { NotificationDropdown } from './NotificationDropdown';

export function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

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

    const handleNotificationRead = () => {
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const handleMarkAllRead = () => {
        setUnreadCount(0);
    };

    const incrementUnreadCount = () => {
        setUnreadCount((prev) => prev + 1);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-600 rounded-full min-w-[20px]">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <NotificationDropdown
                    onClose={() => setIsOpen(false)}
                    onNotificationRead={handleNotificationRead}
                    onMarkAllRead={handleMarkAllRead}
                    onNewNotification={incrementUnreadCount}
                />
            )}
        </div>
    );
}
