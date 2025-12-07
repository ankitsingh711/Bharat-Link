import prisma from '../lib/prisma';


export interface CreatePostInput {
    authorId: string;
    content: string;
    media?: string[];
}

export interface UpdatePostInput {
    content?: string;
    media?: string[];
}

export interface GetPostsOptions {
    cursor?: string; // createdAt timestamp
    limit?: number;
    userId?: string; // Optional: filter by specific user
}

export const postService = {
    /**
     * Get paginated feed posts
     */
    async getPosts(options: GetPostsOptions = {}) {
        const { cursor, limit = 10, userId } = options;

        const posts = await prisma.post.findMany({
            take: limit + 1, // Fetch one extra to check if there are more
            ...(cursor && {
                cursor: {
                    id: cursor,
                },
                skip: 1, // Skip the cursor
            }),
            where: userId ? { authorId: userId } : undefined,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        headline: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });

        const hasMore = posts.length > limit;
        const items = hasMore ? posts.slice(0, -1) : posts;
        const nextCursor = hasMore ? items[items.length - 1].id : null;

        return {
            items,
            nextCursor,
            hasMore,
        };
    },

    /**
     * Get a single post by ID
     */
    async getPostById(postId: string, userId?: string) {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        headline: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });

        if (!post) {
            return null;
        }

        // Check if the user has liked this post
        let isLiked = false;
        if (userId) {
            const like = await prisma.like.findUnique({
                where: {
                    postId_userId: {
                        postId,
                        userId,
                    },
                },
            });
            isLiked = !!like;
        }

        return {
            ...post,
            isLiked,
        };
    },

    /**
     * Create a new post
     */
    async createPost(data: CreatePostInput) {
        const post = await prisma.post.create({
            data: {
                content: data.content,
                media: data.media || [],
                authorId: data.authorId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        headline: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });

        return post;
    },

    /**
     * Update a post
     */
    async updatePost(postId: string, userId: string, data: UpdatePostInput) {
        // Verify the user owns this post
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new Error('Post not found');
        }

        if (post.authorId !== userId) {
            throw new Error('Unauthorized');
        }

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                ...(data.content && { content: data.content }),
                ...(data.media && { media: data.media }),
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        headline: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });

        return updatedPost;
    },

    /**
     * Delete a post
     */
    async deletePost(postId: string, userId: string) {
        // Verify the user owns this post
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new Error('Post not found');
        }

        if (post.authorId !== userId) {
            throw new Error('Unauthorized');
        }

        // Delete related records first (Prisma doesn't support cascade deletes for all relations)
        await prisma.$transaction([
            prisma.comment.deleteMany({ where: { postId } }),
            prisma.like.deleteMany({ where: { postId } }),
            prisma.post.delete({ where: { id: postId } }),
        ]);

        return { success: true };
    },

    /**
     * Toggle like on a post
     */
    async toggleLike(postId: string, userId: string) {
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        });

        if (existingLike) {
            // Unlike
            await prisma.$transaction([
                prisma.like.delete({
                    where: { id: existingLike.id },
                }),
                prisma.post.update({
                    where: { id: postId },
                    data: {
                        likesCount: {
                            decrement: 1,
                        },
                    },
                }),
            ]);

            const post = await prisma.post.findUnique({
                where: { id: postId },
                select: { likesCount: true },
            });

            return {
                liked: false,
                likesCount: post?.likesCount || 0,
            };
        } else {
            // Like
            await prisma.$transaction([
                prisma.like.create({
                    data: {
                        postId,
                        userId,
                    },
                }),
                prisma.post.update({
                    where: { id: postId },
                    data: {
                        likesCount: {
                            increment: 1,
                        },
                    },
                }),
            ]);

            const post = await prisma.post.findUnique({
                where: { id: postId },
                select: { likesCount: true },
            });

            return {
                liked: true,
                likesCount: post?.likesCount || 0,
            };
        }
    },

    /**
     * Add a comment to a post
     */
    async addComment(postId: string, userId: string, content: string) {
        const comment = await prisma.comment.create({
            data: {
                postId,
                authorId: userId,
                content,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
            },
        });

        return comment;
    },

    /**
     * Get comments for a post
     */
    async getComments(postId: string) {
        const comments = await prisma.comment.findMany({
            where: { postId },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
            },
        });

        return comments;
    },
};
