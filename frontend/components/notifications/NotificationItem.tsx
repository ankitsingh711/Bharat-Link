'use client';

import { Notification, NotificationType } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
    notification: Notification;
    onClick: () => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
    const getIcon = () => {
        switch (notification.type) {
            case NotificationType.LIKE:
                return <Heart className="w-4 h-4 text-red-500" fill="currentColor" />;
            case NotificationType.COMMENT:
                return <MessageCircle className="w-4 h-4 text-blue-500" />;
            case NotificationType.FOLLOW:
                return <UserPlus className="w-4 h-4 text-green-500" />;
            default:
                return null;
        }
    };

    return (
        <button
            onClick={onClick}
            className={`w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left flex items-start space-x-3 ${!notification.read ? 'bg-orange-50/50' : ''
                }`}
        >
            {/* Actor Avatar */}
            <div className="flex-shrink-0 pt-1">
                <Avatar
                    src={notification.actor?.profileImage}
                    fallback={notification.actor?.name?.charAt(0) || 'U'}
                    size="md"
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                    <p
                        className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'
                            }`}
                    >
                        {notification.message}
                    </p>
                    <div className="ml-2 flex-shrink-0">{getIcon()}</div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
            </div>

            {/* Unread Indicator */}
            {!notification.read && (
                <div className="flex-shrink-0 pt-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                </div>
            )}
        </button>
    );
}
