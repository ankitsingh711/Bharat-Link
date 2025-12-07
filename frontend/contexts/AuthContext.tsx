'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api/endpoints/auth';
import { usersApi } from '@/lib/api/endpoints/users';
import type { User, LoginCredentials, SignupData, AuthTokens } from '@/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const userData = await usersApi.getMe();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    // Clear invalid tokens
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('idToken');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const tokens: AuthTokens = await authApi.login(credentials);

            // Store tokens  
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('idToken', tokens.idToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);

            // Fetch user data
            const userData = await usersApi.getMe();
            setUser(userData);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const signup = async (data: SignupData) => {
        try {
            const tokens: AuthTokens = await authApi.signup(data);

            // Store tokens
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('idToken', tokens.idToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);

            // Fetch user data
            const userData = await usersApi.getMe();
            setUser(userData);
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    };

    const logout = () => {
        // Clear tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('idToken');

        // Clear user state
        setUser(null);

        // Redirect to login
        window.location.href = '/login';
    };

    const refreshUser = async () => {
        try {
            const userData = await usersApi.getMe();
            setUser(userData);
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
