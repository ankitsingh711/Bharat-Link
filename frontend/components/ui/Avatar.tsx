'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    fallback?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
    const sizes = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
    };

    // Generate fallback initials from name
    const getInitials = (name?: string) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const initials = fallback ? getInitials(fallback) : '?';

    return (
        <div
            className={cn(
                'relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white overflow-hidden',
                sizes[size],
                className
            )}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt || 'Avatar'}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        // Hide image on error and show fallback
                        e.currentTarget.style.display = 'none';
                    }}
                />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
}
