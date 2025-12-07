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
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Don't render navbar on auth pages
    const authPages = ['/login', '/signup', '/verify-email', '/forgot-password', '/reset-password'];
    if (authPages.includes(pathname)) {
        return null;
    }

    const isActive = (path: string) => pathname === path;

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-[52px] py-2">{/* Left Section: Logo + Search */}
                    <div className="flex items-center space-x-2">
                        {/* Logo */}
                        <Link href={user ? '/feed' : '/'} className="flex items-center cursor-pointer h-full max-h-10">
                            <Logo size="xs" />
                        </Link>

                        {/* Search Bar - Desktop Only */}
                        {user && (
                            <div className="hidden md:block ml-2">
                                <div className="relative">
                                    <svg
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="pl-8 pr-3 py-1.5 w-64 bg-blue-50 border-0 rounded text-sm text-gray-800 placeholder:text-gray-600 focus:outline-none focus:bg-blue-100 transition-colors"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Section: Navigation */}
                    {!loading && (
                        <nav className="hidden md:flex items-center h-full">
                            {user ? (
                                <div className="flex items-center h-full">
                                    {/* Home */}
                                    <Link
                                        href="/feed"
                                        className={`flex flex-col items-center justify-center px-3 h-full min-w-[80px] border-b-[3px] pb-1 transition-all ${isActive('/feed')
                                            ? 'border-b-gray-900 text-gray-900'
                                            : 'border-b-transparent text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <svg className="w-6 h-6 mb-0.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23 9v2h-2v7c0 1.7-1.3 3-3 3h-4v-6h-4v6H6c-1.7 0-3-1.3-3-3v-7H1V9l11-7 5 3.2V2h3v5.1z" />
                                        </svg>
                                        <span className="text-xs font-normal">Home</span>
                                    </Link>

                                    {/* My Network - Placeholder */}
                                    <div className="flex flex-col items-center justify-center px-3 h-full min-w-[80px] border-b-[3px] border-b-transparent pb-1 text-gray-600 hover:text-gray-900 cursor-not-allowed opacity-60">
                                        <svg className="w-6 h-6 mb-0.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 16v6H3v-6c0-1.7 1.3-3 3-3h3c1.7 0 3 1.3 3 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2c-1.4 0-2.5 1.1-2.5 2.5V22h7v-4.5c0-1.4-1.1-2.5-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z" />
                                        </svg>
                                        <span className="text-xs font-normal">My Network</span>
                                    </div>

                                    {/* Jobs */}
                                    <Link
                                        href="/jobs"
                                        className={`flex flex-col items-center justify-center px-3 h-full min-w-[80px] border-b-[3px] pb-1 transition-all ${isActive('/jobs')
                                            ? 'border-b-gray-900 text-gray-900'
                                            : 'border-b-transparent text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <svg className="w-6 h-6 mb-0.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17 6V5c0-1.7-1.3-3-3-3h-4C8.3 2 7 3.3 7 5v1H3v15c0 1.7 1.3 3 3 3h12c1.7 0 3-1.3 3-3V6h-4zm-6-1c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v1h-4V5z" />
                                        </svg>
                                        <span className="text-xs font-normal">Jobs</span>
                                    </Link>

                                    {/* Messaging - Placeholder */}
                                    <div className="flex flex-col items-center justify-center px-3 h-full min-w-[80px] border-b-[3px] border-b-transparent pb-1 text-gray-600 hover:text-gray-900 cursor-not-allowed opacity-60">
                                        <svg className="w-6 h-6 mb-0.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M16 3H8C6.3 3 5 4.3 5 6v11c0 1.7 1.3 3 3 3h4l4 3v-3h0c1.7 0 3-1.3 3-3V6c0-1.7-1.3-3-3-3zm-4 11H8v-2h4v2zm4-4H8V8h8v2z" />
                                        </svg>
                                        <span className="text-xs font-normal">Messaging</span>
                                    </div>

                                    {/* Notifications */}
                                    <Link
                                        href="/notifications"
                                        className={`flex flex-col items-center justify-center px-3 h-full min-w-[80px] border-b-[3px] pb-1 transition-all relative ${isActive('/notifications')
                                            ? 'border-b-gray-900 text-gray-900'
                                            : 'border-b-transparent text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <NotificationBell />
                                        <span className="text-xs font-normal">Notifications</span>
                                    </Link>

                                    {/* Profile Dropdown */}
                                    <div className="relative h-full">
                                        <button
                                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                                            onBlur={() => setTimeout(() => setShowProfileMenu(false), 200)}
                                            className={`flex flex-col items-center justify-center px-3 h-full min-w-[80px] border-b-[3px] pb-1 transition-all ${showProfileMenu || pathname.startsWith('/profile')
                                                ? 'border-b-gray-900 text-gray-900'
                                                : 'border-b-transparent text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            <Avatar src={user.profileImage} fallback={user.name} size="xs" />
                                            <div className="flex items-center mt-0.5">
                                                <span className="text-xs font-normal">Me</span>
                                                <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M7 10l5 5 5-5z" />
                                                </svg>
                                            </div>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {showProfileMenu && (
                                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                                {/* User Info */}
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar src={user.profileImage} fallback={user.name} size="md" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                            <p className="text-xs text-gray-600 truncate">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="py-1">
                                                    <Link
                                                        href={`/profile/${user.id}`}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                        onClick={() => setShowProfileMenu(false)}
                                                    >
                                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        View Profile
                                                    </Link>

                                                    <button
                                                        onClick={() => {
                                                            setShowProfileMenu(false);
                                                            logout();
                                                        }}
                                                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // Unauthenticated Navigation
                                <div className="flex items-center space-x-6">
                                    <Link
                                        href="/"
                                        className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/jobs"
                                        className={`text-sm font-medium transition-colors ${isActive('/jobs') ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Jobs
                                    </Link>

                                    <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                                        <Link href="/login">
                                            <Button variant="ghost" className="cursor-pointer">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href="/signup">
                                            <Button variant="gradient" className="cursor-pointer">
                                                Join now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
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
                    <div className="md:hidden pb-4 border-t border-gray-200 mt-2 pt-4">
                        <nav className="flex flex-col space-y-2">
                            {user ? (
                                <>
                                    <Link
                                        href="/feed"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-3 ${isActive('/feed') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23 9v2h-2v7c0 1.7-1.3 3-3 3h-4v-6h-4v6H6c-1.7 0-3-1.3-3-3v-7H1V9l11-7 5 3.2V2h3v5.1z" />
                                        </svg>
                                        <span>Home</span>
                                    </Link>
                                    <Link
                                        href="/jobs"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-3 ${isActive('/jobs') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17 6V5c0-1.7-1.3-3-3-3h-4C8.3 2 7 3.3 7 5v1H3v15c0 1.7 1.3 3 3 3h12c1.7 0 3-1.3 3-3V6h-4zm-6-1c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v1h-4V5z" />
                                        </svg>
                                        <span>Jobs</span>
                                    </Link>
                                    <Link
                                        href="/notifications"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-3 ${isActive('/notifications') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M22 19h-8.3a3 3 0 01-5.4 0H2v-1c0-4.4 3.6-8 8-8h4c4.4 0 8 3.6 8 8v1zM18.6 8.6l1.4-1.4C21.9 5.3 23 3.1 23 1h-2c0 1.6-.8 3.1-2.1 4.1l-1.4 1.4-.9-.9-1.4 1.4.9.9-1.4 1.4.9.9c1.2-1.2 1.2-3.1 0-4.2l1.9-1.9zM8 6.5A2.5 2.5 0 0110.5 4h3A2.5 2.5 0 0116 6.5V8h-8V6.5z" />
                                        </svg>
                                        <span>Notifications</span>
                                    </Link>
                                    <Link
                                        href={`/profile/${user.id}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${pathname.startsWith('/profile') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        Profile
                                    </Link>
                                    <div className="px-4 py-3 flex items-center space-x-3 border-t border-gray-200 mt-2">
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
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive('/') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/jobs"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive('/jobs') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
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
                                                Join now
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
