import apiClient from '../client';

export interface CreatePostData {
    content: string;
    media?: string[];
}

export interface UpdatePostData {
    content?: string;
    media?: string[];
}

export const postsApi = {
    /**
     * Get feed posts with cursor-based pagination
     */
    async getPosts(cursor?: string, limit: number = 10) {
        const params = new URLSearchParams();
        if (cursor) params.append('cursor', cursor);
        params.append('limit', limit.toString());

        const response = await apiClient.get(`/posts?${params.toString()}`);
        return response.data.data; // Backend wraps in success: true, data: {...}
    },

    /**
     * Get post by ID
     */
    async getPostById(id: string) {
        const response = await apiClient.get(`/posts/${id}`);
        return response.data.data;
    },

    /**
     * Create new post
     */
    async createPost(data: CreatePostData) {
        const response = await apiClient.post('/posts', data);
        return response.data.data;
    },

    /**
     * Update post
     */
    async updatePost(id: string, data: UpdatePostData) {
        const response = await apiClient.put(`/posts/${id}`, data);
        return response.data.data;
    },

    /**
     * Delete post
     */
    async deletePost(id: string) {
        const response = await apiClient.delete(`/posts/${id}`);
        return response.data;
    },

    /**
     * Toggle like on a post (like/unlike in one endpoint)
     */
    async toggleLike(postId: string) {
        const response = await apiClient.post(`/posts/${postId}/like`);
        return response.data.data;
    },

    /**
     * Add comment to post
     */
    async addComment(postId: string, content: string) {
        const response = await apiClient.post(`/posts/${postId}/comments`, { content });
        return response.data.data;
    },

    /**
     * Get comments for a post
     */
    async getComments(postId: string) {
        const response = await apiClient.get(`/posts/${postId}/comments`);
        return response.data.data;
    },
};
