import apiClient from '../client';
import { Notification } from '@/types';

export const notificationsApi = {
    /**
     * Get user's notifications
     */
    async getNotifications(cursor?: string, limit: number = 20) {
        const params = new URLSearchParams();
        if (cursor) params.append('cursor', cursor);
        params.append('limit', limit.toString());

        const response = await apiClient.get(`/notifications?${params.toString()}`);
        return response.data.data as {
            items: Notification[];
            nextCursor: string | null;
            hasMore: boolean;
        };
    },

    /**
     * Get unread notification count
     */
    async getUnreadCount() {
        const response = await apiClient.get('/notifications/unread-count');
        return response.data.data.count as number;
    },

    /**
     * Mark a notification as read
     */
    async markAsRead(id: string) {
        const response = await apiClient.put(`/notifications/${id}/read`);
        return response.data.data as Notification;
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead() {
        const response = await apiClient.put('/notifications/mark-all-read');
        return response.data.data as { updated: number };
    },
};
