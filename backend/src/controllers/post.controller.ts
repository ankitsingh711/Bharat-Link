import { Request, Response } from 'express';
import { postService } from '../services/post.service';
import { notificationService } from '../services/notification.service';
import { z } from 'zod';
import { getSocketInstance } from '../config/websocket';

// Validation schemas
const createPostSchema = z.object({
    content: z.string().min(1).max(5000),
    media: z.array(z.string()).optional(),
});

const updatePostSchema = z.object({
    content: z.string().min(1).max(5000).optional(),
    media: z.array(z.string()).optional(),
});

const addCommentSchema = z.object({
    content: z.string().min(1).max(1000),
});

export const postController = {
    /**
     * GET /posts
     * Get feed posts with pagination
     */
    async getPosts(req: Request, res: Response) {
        try {
            const cursor = req.query.cursor as string | undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const userId = req.query.userId as string | undefined;

            const result = await postService.getPosts({ cursor, limit, userId });

            res.json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            console.error('Error getting posts:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch posts',
                error: error.message,
            });
        }
    },

    /**
     * GET /posts/:id
     * Get a single post
     */
    async getPost(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;

            const post = await postService.getPostById(id, userId);

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found',
                });
            }

            res.json({
                success: true,
                data: post,
            });
        } catch (error: any) {
            console.error('Error getting post:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch post',
                error: error.message,
            });
        }
    },

    /**
     * POST /posts
     * Create a new post
     */
    async createPost(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const validatedData = createPostSchema.parse(req.body);

            const post = await postService.createPost({
                ...validatedData,
                authorId: userId,
            });

            // Emit WebSocket event
            const io = getSocketInstance();
            if (io) {
                io.emit('post:created', post);
            }

            res.status(201).json({
                success: true,
                data: post,
            });
        } catch (error: any) {
            console.error('Error creating post:', error);

            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.issues,
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to create post',
                error: error.message,
            });
        }
    },

    /**
     * PUT /posts/:id
     * Update a post
     */
    async updatePost(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const validatedData = updatePostSchema.parse(req.body);

            const post = await postService.updatePost(id, userId, validatedData);

            // Emit WebSocket event
            const io = getSocketInstance();
            if (io) {
                io.emit('post:updated', post);
            }

            res.json({
                success: true,
                data: post,
            });
        } catch (error: any) {
            console.error('Error updating post:', error);

            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.issues,
                });
            }

            if (error.message === 'Post not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found',
                });
            }

            if (error.message === 'Unauthorized') {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to update this post',
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to update post',
                error: error.message,
            });
        }
    },

    /**
     * DELETE /posts/:id
     * Delete a post
     */
    async deletePost(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            await postService.deletePost(id, userId);

            // Emit WebSocket event
            const io = getSocketInstance();
            if (io) {
                io.emit('post:deleted', { postId: id });
            }

            res.json({
                success: true,
                message: 'Post deleted successfully',
            });
        } catch (error: any) {
            console.error('Error deleting post:', error);

            if (error.message === 'Post not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found',
                });
            }

            if (error.message === 'Unauthorized') {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to delete this post',
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to delete post',
                error: error.message,
            });
        }
    },

    /**
     * POST /posts/:id/like
     * Toggle like on a post
     */
    async toggleLike(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;
            const userName = (req as any).user?.name || 'Someone';

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const result = await postService.toggleLike(id, userId);

            // Emit WebSocket event for like count update
            const io = getSocketInstance();
            if (io) {
                io.emit('post:liked', {
                    postId: id,
                    likesCount: result.likesCount,
                    liked: result.liked,
                });
            }

            // Create notification for post author if liked (not if unliked)
            if (result.liked) {
                const post = await postService.getPostById(id);
                if (post && post.authorId !== userId) {
                    const notification = await notificationService.createNotification({
                        userId: post.authorId,
                        type: 'LIKE',
                        actorId: userId,
                        postId: id,
                        message: `${userName} liked your post`,
                    });

                    // Emit notification via WebSocket to post author
                    if (notification && io) {
                        io.to(`user:${post.authorId}`).emit('notification:new', notification);
                    }
                }
            }

            res.json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            console.error('Error toggling like:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to toggle like',
                error: error.message,
            });
        }
    },

    /**
     * POST /posts/:id/comments
     * Add a comment to a post
     */
    async addComment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;
            const userName = (req as any).user?.name || 'Someone';

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const { content } = addCommentSchema.parse(req.body);

            const comment = await postService.addComment(id, userId, content);

            // Emit WebSocket event for new comment
            const io = getSocketInstance();
            if (io) {
                io.emit('comment:added', {
                    postId: id,
                    comment,
                });
            }

            // Create notification for post author
            const post = await postService.getPostById(id);
            if (post && post.authorId !== userId) {
                const notification = await notificationService.createNotification({
                    userId: post.authorId,
                    type: 'COMMENT',
                    actorId: userId,
                    postId: id,
                    commentId: comment.id,
                    message: `${userName} commented on your post`,
                });

                // Emit notification via WebSocket to post author
                if (notification && io) {
                    io.to(`user:${post.authorId}`).emit('notification:new', notification);
                }
            }

            res.status(201).json({
                success: true,
                data: comment,
            });
        } catch (error: any) {
            console.error('Error adding comment:', error);

            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.issues,
                });
            }

            res.status(500).json({
                success: false,
                message: 'Failed to add comment',
                error: error.message,
            });
        }
    },

    /**
     * GET /posts/:id/comments
     * Get comments for a post
     */
    async getComments(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const comments = await postService.getComments(id);

            res.json({
                success: true,
                data: comments,
            });
        } catch (error: any) {
            console.error('Error getting comments:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch comments',
                error: error.message,
            });
        }
    },
};
