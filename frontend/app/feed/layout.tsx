'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FeedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // Wait for session to load
        if (status === 'loading') {
            return;
        }

        // If not authenticated, redirect to login
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        // If authenticated, allow rendering
        if (status === 'authenticated') {
            setShouldRender(true);
        }
    }, [status, router]);

    // Show loading spinner while checking authentication
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Show nothing while redirecting
    if (!shouldRender || !session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}
