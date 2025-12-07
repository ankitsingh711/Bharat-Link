import apiClient from '../client';
import type { User } from '@/types';

export const usersApi = {
    /**
     * Get current user profile
     */
    async getMe(): Promise<User> {
        const response = await apiClient.get('/users/me');
        return response.data;
    },

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<User> {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    },

    /**
     * Update current user profile
     */
    async updateMe(data: Partial<User>): Promise<User> {
        const response = await apiClient.put('/users/me', data);
        return response.data;
    },

    /**
     * Search users
     */
    async searchUsers(query: string): Promise<User[]> {
        const response = await apiClient.get('/users/search', {
            params: { q: query },
        });
        return response.data;
    },
};
