'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { Notification } from '@/types';
import { notificationsApi } from '@/lib/api/endpoints/notifications';
import { NotificationItem } from './NotificationItem';
import { connectSocket } from '@/lib/socket/socket';

interface NotificationDropdownProps {
    onClose: () => void;
    onNotificationRead: () => void;
    onMarkAllRead: () => void;
    onNewNotification: () => void;
}

export function NotificationDropdown({
    onClose,
    onNotificationRead,
    onMarkAllRead,
    onNewNotification,
}: NotificationDropdownProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        fetchNotifications();

        // Listen for new notifications via WebSocket
        const socket = connectSocket();

        const handleNewNotification = (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev]);
            onNewNotification();
        };

        socket.on('notification:new', handleNewNotification);

        return () => {
            socket.off('notification:new', handleNewNotification);
        };
    }, [onNewNotification]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const result = await notificationsApi.getNotifications(undefined, 20);
            setNotifications(result.items);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        try {
            // Mark as read if not already
            if (!notification.read) {
                await notificationsApi.markAsRead(notification.id);
                setNotifications((prev) =>
                    prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
                );
                onNotificationRead();
            }

            // Navigate to the post
            if (notification.postId) {
                router.push(`/feed?postId=${notification.postId}`);
                onClose();
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsApi.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            onMarkAllRead();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-green-50">
                <h3 className="font-bold text-lg text-gray-900">Notifications</h3>
                {notifications.some((n) => !n.read) && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                        Mark all read
                    </button>
                )}
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto flex-1">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <Bell className="w-12 h-12 mb-3 opacity-30" />
                        <p className="text-sm">No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onClick={() => handleNotificationClick(notification)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
