import prisma from '../lib/prisma';

export interface CreateNotificationInput {
    userId: string;
    type: 'LIKE' | 'COMMENT' | 'FOLLOW';
    actorId: string;
    postId?: string;
    commentId?: string;
    message: string;
}

export const notificationService = {
    /**
     * Create a new notification
     */
    async createNotification(data: CreateNotificationInput) {
        // Don't create notification if user is notifying themselves
        if (data.userId === data.actorId) {
            return null;
        }

        // Check if similar notification already exists (prevent spam)
        const existing = await prisma.notification.findFirst({
            where: {
                userId: data.userId,
                type: data.type,
                actorId: data.actorId,
                postId: data.postId || null,
                commentId: data.commentId || null,
                read: false,
            },
        });

        if (existing) {
            // Update timestamp of existing notification
            return await prisma.notification.update({
                where: { id: existing.id },
                data: { createdAt: new Date() },
                include: {
                    actor: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true,
                        },
                    },
                },
            });
        }

        // Create new notification
        return await prisma.notification.create({
            data: {
                userId: data.userId,
                type: data.type,
                actorId: data.actorId,
                postId: data.postId,
                commentId: data.commentId,
                message: data.message,
            },
            include: {
                actor: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
            },
        });
    },

    /**
     * Get notifications for a user with pagination
     */
    async getNotifications(userId: string, limit: number = 20, cursor?: string) {
        const notifications = await prisma.notification.findMany({
            take: limit + 1,
            ...(cursor && {
                cursor: { id: cursor },
                skip: 1,
            }),
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                actor: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
            },
        });

        const hasMore = notifications.length > limit;
        const items = hasMore ? notifications.slice(0, -1) : notifications;
        const nextCursor = hasMore ? items[items.length - 1].id : null;

        return {
            items,
            nextCursor,
            hasMore,
        };
    },

    /**
     * Get unread notification count for a user
     */
    async getUnreadCount(userId: string) {
        return await prisma.notification.count({
            where: {
                userId,
                read: false,
            },
        });
    },

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId: string, userId: string) {
        const notification = await prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId,
            },
        });

        if (!notification) {
            throw new Error('Notification not found');
        }

        return await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
    },

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId: string) {
        return await prisma.notification.updateMany({
            where: {
                userId,
                read: false,
            },
            data: { read: true },
        });
    },

    /**
     * Delete old read notifications (cleanup job)
     */
    async deleteOldNotifications(daysOld: number = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        return await prisma.notification.deleteMany({
            where: {
                read: true,
                createdAt: {
                    lt: cutoffDate,
                },
            },
        });
    },
};
