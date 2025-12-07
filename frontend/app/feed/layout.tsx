'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';

export default function FeedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
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
            {/* Top Navigation */}
            <header className="border-b bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Logo size="sm" />
                        <span className="text-xl font-bold gradient-text">Bharat Link</span>
                    </div>

                    <nav className="hidden md:flex space-x-6">
                        <Link href="/feed" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                            Feed
                        </Link>
                        <Link href="/jobs" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                            Jobs
                        </Link>
                        <Link href="/profile" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                            Profile
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link href={`/profile/${user.id}`}>
                            <Avatar src={user.profileImage} fallback={user.name} size="md" />
                        </Link>
                        <Button variant="ghost" size="sm" onClick={logout} className="cursor-pointer">
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}
