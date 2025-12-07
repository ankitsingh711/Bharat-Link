import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';

export const notificationController = {
    /**
     * GET /notifications
     * Get user's notifications with pagination
     */
    async getNotifications(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const cursor = req.query.cursor as string | undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

            const result = await notificationService.getNotifications(userId, limit, cursor);

            res.json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            console.error('Error getting notifications:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch notifications',
                error: error.message,
            });
        }
    },

    /**
     * GET /notifications/unread-count
     * Get count of unread notifications
     */
    async getUnreadCount(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const count = await notificationService.getUnreadCount(userId);

            res.json({
                success: true,
                data: { count },
            });
        } catch (error: any) {
            console.error('Error getting unread count:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch unread count',
                error: error.message,
            });
        }
    },

    /**
     * PUT /notifications/:id/read
     * Mark a notification as read
     */
    async markAsRead(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const notification = await notificationService.markAsRead(id, userId);

            res.json({
                success: true,
                data: notification,
            });
        } catch (error: any) {
            console.error('Error marking notification as read:', error);

            if (error.message === 'Notification not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found',
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to mark notification as read',
                error: error.message,
            });
        }
    },

    /**
     * PUT /notifications/mark-all-read
     * Mark all user's notifications as read
     */
    async markAllAsRead(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const result = await notificationService.markAllAsRead(userId);

            res.json({
                success: true,
                data: { updated: result.count },
            });
        } catch (error: any) {
            console.error('Error marking all as read:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to mark all as read',
                error: error.message,
            });
        }
    },
};
