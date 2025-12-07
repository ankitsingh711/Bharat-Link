'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
    const { user, loading, logout } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Don't render navbar on auth pages
    const authPages = ['/login', '/signup', '/verify-email', '/forgot-password', '/reset-password'];
    if (authPages.includes(pathname)) {
        return null;
    }

    const isActive = (path: string) => pathname === path;

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-1.5">
                <div className="flex items-center justify-between">
                    {/* Logo and Brand */}
                    <Link href={user ? '/feed' : '/'} className="flex items-center cursor-pointer">
                        <Logo size="xs" />
                    </Link>

                    {/* Desktop Navigation */}
                    {!loading && (
                        <nav className="hidden md:flex items-center space-x-5">
                            {user ? (
                                // Authenticated Navigation
                                <>
                                    <Link
                                        href="/jobs"
                                        className={`p-2 rounded-lg transition-colors ${isActive('/jobs')
                                            ? 'text-orange-600 bg-orange-50'
                                            : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                                            }`}
                                        title="Jobs"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </Link>

                                    {/* Notification Bell */}
                                    <NotificationBell />

                                    {/* Profile Dropdown */}
                                    <div className="relative group ml-3 pl-3 border-l border-gray-200">
                                        <div className="cursor-pointer">
                                            <Avatar src={user.profileImage} fallback={user.name} size="sm" />
                                        </div>

                                        {/* Dropdown Menu */}
                                        <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 py-2 backdrop-blur-md">
                                                {/* User Info */}
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-600 truncate">{user.email}</p>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="py-1">
                                                    <Link
                                                        href={`/profile/${user.id}`}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        View Profile
                                                    </Link>

                                                    <button
                                                        onClick={logout}
                                                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Unauthenticated Navigation
                                <>
                                    <Link
                                        href="/"
                                        className={`text-sm font-medium transition-colors ${isActive('/')
                                            ? 'text-orange-600'
                                            : 'text-gray-600 hover:text-orange-600'
                                            }`}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/jobs"
                                        className={`text-sm font-medium transition-colors ${isActive('/jobs')
                                            ? 'text-orange-600'
                                            : 'text-gray-600 hover:text-orange-600'
                                            }`}
                                    >
                                        Jobs
                                    </Link>

                                    <div className="flex items-center space-x-2.5 ml-3">
                                        <Link href="/login">
                                            <Button variant="ghost" className="cursor-pointer">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href="/signup">
                                            <Button variant="gradient" className="cursor-pointer">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </nav>
                    )}

                    {/* Mobile Menu Button */}
                    {!loading && (
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>

                {/* Mobile Menu */}
                {!loading && mobileMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-gray-200 animate-fade-in">
                        <nav className="flex flex-col space-y-3">
                            {user ? (
                                <>
                                    <Link
                                        href="/jobs"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-3 ${isActive('/jobs')
                                            ? 'bg-orange-50 text-orange-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>Jobs</span>
                                    </Link>
                                    <Link
                                        href={`/profile/${user.id}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${pathname.startsWith('/profile')
                                            ? 'bg-orange-50 text-orange-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        Profile
                                    </Link>
                                    <div className="px-4 py-2 flex items-center space-x-3 border-t border-gray-200 pt-4 mt-2">
                                        <Avatar src={user.profileImage} fallback={user.name} size="sm" />
                                        <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            logout();
                                        }}
                                        className="cursor-pointer mx-4"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                // Unauthenticated Mobile Navigation
                                <>
                                    <Link
                                        href="/"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isActive('/')
                                            ? 'bg-orange-50 text-orange-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/jobs"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isActive('/jobs')
                                            ? 'bg-orange-50 text-orange-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        Jobs
                                    </Link>
                                    <div className="px-4 space-y-2 pt-2 border-t border-gray-200 mt-2">
                                        <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                                            <Button variant="ghost" className="w-full cursor-pointer">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block">
                                            <Button variant="gradient" className="w-full cursor-pointer">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
