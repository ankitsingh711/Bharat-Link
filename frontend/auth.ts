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
                        return null;
                    }

                    const tokens = await res.json();

                    // Fetch user data
                    const userRes = await fetch(`${API_URL}/users/me`, {
                        headers: {
                            Authorization: `Bearer ${tokens.accessToken}`,
                        },
                    });

                    if (!userRes.ok) {
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
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client
            session.user = {
                id: token.id as string,
                email: token.email as string,
                name: token.name as string,
            };
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;
            session.idToken = token.idToken as string;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
});
