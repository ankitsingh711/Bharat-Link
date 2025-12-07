import apiClient from '../client';
import type { LoginCredentials, SignupData, AuthTokens } from '@/types';

export const authApi = {
    /**
     * Login user with email and password
     */
    async login(credentials: LoginCredentials): Promise<AuthTokens> {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },

    /**
     * Register new user
     */
    async signup(data: SignupData): Promise<AuthTokens> {
        const response = await apiClient.post('/auth/signup', data);
        return response.data;
    },

    /**
     * Logout current user
     */
    async logout(): Promise<void> {
        await apiClient.post('/auth/logout');
    },

    /**
     * Verify email with confirmation code
     */
    async verifyEmail(email: string, code: string): Promise<void> {
        await apiClient.post('/auth/verify', { email, code });
    },

    /**
     * Request password reset
     */
    async forgotPassword(email: string): Promise<void> {
        await apiClient.post('/auth/forgot-password', { email });
    },

    /**
     * Reset password with code
     */
    async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
        await apiClient.post('/auth/reset-password', { email, code, newPassword });
    },
};
