import apiClient from '../client';
import type { Post, Comment, Like } from '@/types';

export const postsApi = {
    /**
     * Get feed posts
     */
    async getFeed(page: number = 1, limit: number = 10): Promise<Post[]> {
        const response = await apiClient.get('/posts/feed', {
            params: { page, limit },
        });
        return response.data;
    },

    /**
     * Get post by ID
     */
    async getPostById(id: string): Promise<Post> {
        const response = await apiClient.get(`/posts/${id}`);
        return response.data;
    },

    /**
     * Create new post
     */
    async createPost(data: { content: string; media?: string[] }): Promise<Post> {
        const response = await apiClient.post('/posts', data);
        return response.data;
    },

    /**
     * Delete post
     */
    async deletePost(id: string): Promise<void> {
        await apiClient.delete(`/posts/${id}`);
    },

    /**
     * Like a post
     */
    async likePost(postId: string): Promise<Like> {
        const response = await apiClient.post(`/posts/${postId}/like`);
        return response.data;
    },

    /**
     * Unlike a post
     */
    async unlikePost(postId: string): Promise<void> {
        await apiClient.delete(`/posts/${postId}/like`);
    },

    /**
     * Add comment to post
     */
    async addComment(postId: string, content: string): Promise<Comment> {
        const response = await apiClient.post(`/posts/${postId}/comments`, { content });
        return response.data;
    },

    /**
     * Get comments for a post
     */
    async getComments(postId: string): Promise<Comment[]> {
        const response = await apiClient.get(`/posts/${postId}/comments`);
        return response.data;
    },
};
