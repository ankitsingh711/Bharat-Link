'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FeedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Redirect if not authenticated (use useEffect to avoid render-time router.push)
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Show nothing while loading or redirecting
    if (loading || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}
