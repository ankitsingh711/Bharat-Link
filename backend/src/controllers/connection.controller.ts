import { Request, Response } from 'express';
import { connectionService } from '../services/connection.service';
import { notificationService } from '../services/notification.service';
import { getSocketInstance } from '../config/websocket';

export const connectionController = {
    /**
     * POST /users/:id/follow
     * Follow a user
     */
    async followUser(req: Request, res: Response) {
        try {
            const followingId = req.params.id;
            const followerId = (req as any).user?.id;
            const followerName = (req as any).user?.name || 'Someone';

            if (!followerId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const connection = await connectionService.followUser(followerId, followingId);

            // Create notification for the user being followed
            const notification = await notificationService.createNotification({
                userId: followingId,
                type: 'FOLLOW',
                actorId: followerId,
                message: `${followerName} started following you`,
            });

            // Emit WebSocket event to the user being followed
            const io = getSocketInstance();
            if (notification && io) {
                io.to(`user:${followingId}`).emit('notification:new', notification);
            }

            res.json({
                success: true,
                data: connection,
            });
        } catch (error: any) {
            console.error('Error following user:', error);

            if (error.message === 'Cannot follow yourself') {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }

            if (error.message === 'Already following this user') {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to follow user',
                error: error.message,
            });
        }
    },

    /**
     * DELETE /users/:id/follow
     * Unfollow a user
     */
    async unfollowUser(req: Request, res: Response) {
        try {
            const followingId = req.params.id;
            const followerId = (req as any).user?.id;

            if (!followerId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            await connectionService.unfollowUser(followerId, followingId);

            res.json({
                success: true,
                message: 'Unfollowed successfully',
            });
        } catch (error: any) {
            console.error('Error unfollowing user:', error);

            if (error.message === 'Not following this user') {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to unfollow user',
                error: error.message,
            });
        }
    },

    /**
     * GET /users/:id/connection-status
     * Check if current user is following another user
     */
    async getConnectionStatus(req: Request, res: Response) {
        try {
            const followingId = req.params.id;
            const followerId = (req as any).user?.id;

            if (!followerId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const status = await connectionService.getConnectionStatus(followerId, followingId);

            res.json({
                success: true,
                data: status,
            });
        } catch (error: any) {
            console.error('Error getting connection status:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get connection status',
                error: error.message,
            });
        }
    },

    /**
     * GET /users/:id/followers
     * Get followers of a user
     */
    async getFollowers(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const followers = await connectionService.getFollowers(userId);

            res.json({
                success: true,
                data: followers,
            });
        } catch (error: any) {
            console.error('Error getting followers:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get followers',
                error: error.message,
            });
        }
    },

    /**
     * GET /users/:id/following
     * Get users that a user is following
     */
    async getFollowing(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const following = await connectionService.getFollowing(userId);

            res.json({
                success: true,
                data: following,
            });
        } catch (error: any) {
            console.error('Error getting following:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get following',
                error: error.message,
            });
        }
    },

    /**
     * GET /users/:id/follow-counts
     * Get follower and following counts
     */
    async getFollowCounts(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const counts = await connectionService.getFollowCounts(userId);

            res.json({
                success: true,
                data: counts,
            });
        } catch (error: any) {
            console.error('Error getting follow counts:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get follow counts',
                error: error.message,
            });
        }
    },
};
