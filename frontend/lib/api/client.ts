import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Session cache to prevent redundant getSession calls
let sessionCache: {
    accessToken: string | null;
    timestamp: number;
} | null = null;

const SESSION_CACHE_TTL = 30000; // 30 seconds cache

// Helper function to get cached or fresh session
async function getCachedSession() {
    const now = Date.now();

    // Return cached session if still valid
    if (sessionCache && (now - sessionCache.timestamp < SESSION_CACHE_TTL)) {
        return sessionCache.accessToken;
    }

    // Fetch fresh session
    const session = await getSession();
    const accessToken = session?.accessToken as string | null;

    // Update cache
    sessionCache = {
        accessToken,
        timestamp: now,
    };

    return accessToken;
}

// Clear session cache (useful for logout)
export function clearSessionCache() {
    sessionCache = null;
}

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor to add auth token from cached session
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const accessToken = await getCachedSession();
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Clear cache and get fresh session
                clearSessionCache();
                const session = await getSession();
                const refreshToken = session?.refreshToken;

                if (refreshToken) {
                    // Attempt to refresh token
                    const response = await axios.post(`${API_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken } = response.data;

                    // Update cache with new token
                    sessionCache = {
                        accessToken,
                        timestamp: Date.now(),
                    };

                    // Retry original request with new token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, clear cache and redirect to login
                clearSessionCache();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
