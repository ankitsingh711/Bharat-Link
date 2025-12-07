'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FeedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuth();
    const router = useRouter();

    // Redirect if not authenticated
    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <Link href="/feed" className="flex items-center space-x-2">
                                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    BharatLink
                                </span>
                            </Link>

                            <nav className="hidden md:flex space-x-6">
                                <Link href="/feed" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span>Home</span>
                                </Link>
                                <Link href="/jobs" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>Jobs</span>
                                </Link>
                            </nav>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link href={`/profile/${user.id}`}>
                                <Avatar src={user.profileImage} fallback={user.name} size="md" />
                            </Link>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}
