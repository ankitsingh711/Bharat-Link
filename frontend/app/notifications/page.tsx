'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Notification, NotificationType } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { connectSocket } from '@/lib/socket/socket';
import Link from 'next/link';

export default function NotificationsPage() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications?limit=50`, {
                    headers: {
                        'Authorization': `Bearer ${session?.idToken}`,
                    },
                });
                const data = await response.json();

                // Ensure we set an array, even if the response is unexpected
                const notificationsList = Array.isArray(data.data) ? data.data : [];
                setNotifications(notificationsList);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setNotifications([]); // Set to empty array on error
            } finally {
                setLoading(false);
            }
        };

        if (session?.idToken) {
            fetchNotifications();
        }
    }, [session]);

    // Listen for new notifications via WebSocket
    useEffect(() => {
        const socket = connectSocket();

        socket.on('notification:new', (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        return () => {
            socket.off('notification:new');
        };
    }, []);

    // Mark notification as read
    const markAsRead = async (notificationId: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session?.idToken}`,
                },
            });

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId ? { ...n, read: true } : n
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session?.idToken}`,
                },
            });

            setNotifications((prev) =>
                prev.map((n) => ({ ...n, read: true }))
            );
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.LIKE:
                return (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                    </div>
                );
            case NotificationType.COMMENT:
                return (
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case NotificationType.FOLLOW:
                return (
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    {unreadCount > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <p className="text-gray-600 font-medium">No notifications yet</p>
                        <p className="text-sm text-gray-500 mt-1">When you get notifications, they'll show up here</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {notifications.map((notification) => {
                        const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

                        return (
                            <Card
                                key={notification.id}
                                className={`transition-colors hover:shadow-md ${!notification.read ? 'bg-orange-50/50 border-l-4 border-l-orange-500' : ''
                                    }`}
                            >
                                <CardContent className="p-4">
                                    <div
                                        className="flex items-start space-x-4 cursor-pointer"
                                        onClick={() => {
                                            if (!notification.read) {
                                                markAsRead(notification.id);
                                            }
                                        }}
                                    >
                                        {/* Actor Avatar or Icon */}
                                        {notification.actor ? (
                                            <Avatar
                                                src={notification.actor.profileImage || undefined}
                                                fallback={notification.actor.name.slice(0, 2).toUpperCase()}
                                                size="md"
                                            />
                                        ) : (
                                            getNotificationIcon(notification.type)
                                        )}

                                        {/* Notification Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900">
                                                {notification.actor && (
                                                    <span className="font-semibold">{notification.actor.name}</span>
                                                )}{' '}
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
                                        </div>

                                        {/* Unread indicator */}
                                        {!notification.read && (
                                            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
