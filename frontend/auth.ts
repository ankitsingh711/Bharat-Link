import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${API_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        console.error('Backend login error:', errorData);

                        // Log specific error for debugging
                        if (errorData.code === 'EMAIL_NOT_VERIFIED') {
                            console.error('❌ Email not verified. User needs to verify email first.');
                        } else if (errorData.code === 'INVALID_CREDENTIALS') {
                            console.error('❌ Invalid email or password.');
                        }

                        // Return null to trigger CredentialsSignin error
                        // NextAuth doesn't allow custom error messages from authorize
                        return null;
                    }

                    const tokens = await res.json();

                    // Fetch user data using ID token (has email claim)
                    const userRes = await fetch(`${API_URL}/users/me`, {
                        headers: {
                            Authorization: `Bearer ${tokens.idToken}`,
                        },
                    });

                    if (!userRes.ok) {
                        console.error('Failed to fetch user data:', await userRes.text());
                        return null;
                    }

                    const userData = await userRes.json();

                    // Return user with tokens
                    return {
                        id: userData.id,
                        email: userData.email,
                        name: userData.name,
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                        idToken: tokens.idToken,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.idToken = user.idToken;
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client
            session.user = {
                ...session.user,
                id: token.id as string,
                email: token.email as string || session.user.email,
                name: token.name as string || session.user.name,
            };
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;
            session.idToken = token.idToken as string;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
});
