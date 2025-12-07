'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { authApi } from '@/lib/api/endpoints/auth';
import type { User, LoginCredentials, SignupData } from '@/types';
import { useRouter } from 'next/navigation';
import { showToast } from '@/lib/utils/toast';
import { clearSessionCache } from '@/lib/api/client';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    // Convert session user to app User type
    const user = session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name!,
        createdAt: '', // These will be fetched when needed
        updatedAt: '',
    } as User : null;

    const loading = status === 'loading';

    const login = async (credentials: LoginCredentials) => {
        try {
            // Use NextAuth signIn
            const result = await nextAuthSignIn('credentials', {
                email: credentials.email,
                password: credentials.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            // Session will be automatically updated by NextAuth
        } catch (error: any) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const signup = async (data: SignupData) => {
        try {
            // Signup through API (without tokens in response)
            await authApi.signup(data);

            // User needs to verify email before logging in
            // Don't auto-login after signup
        } catch (error: any) {
            console.error('Signup failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Clear session cache before signing out
            clearSessionCache();

            // Sign out using NextAuth
            await nextAuthSignOut({ redirect: false });
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const refreshUser = async () => {
        try {
            // Update the session to get fresh data
            await update();
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
