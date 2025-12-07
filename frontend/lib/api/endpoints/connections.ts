import apiClient from '../client';

export const connectionsApi = {
    /**
     * Follow a user
     */
    async followUser(userId: string) {
        const response = await apiClient.post(`/users/${userId}/follow`);
        return response.data.data;
    },

    /**
     * Unfollow a user
     */
    async unfollowUser(userId: string) {
        const response = await apiClient.delete(`/users/${userId}/follow`);
        return response.data;
    },

    /**
     * Check connection status with a user
     */
    async getConnectionStatus(userId: string) {
        const response = await apiClient.get(`/users/${userId}/connection-status`);
        return response.data.data;
    },

    /**
     * Get followers of a user
     */
    async getFollowers(userId: string) {
        const response = await apiClient.get(`/users/${userId}/followers`);
        return response.data.data;
    },

    /**
     * Get users that a user is following
     */
    async getFollowing(userId: string) {
        const response = await apiClient.get(`/users/${userId}/following`);
        return response.data.data;
    },

    /**
     * Get follower and following counts
     */
    async getFollowCounts(userId: string) {
        const response = await apiClient.get(`/users/${userId}/follow-counts`);
        return response.data.data;
    },
};
