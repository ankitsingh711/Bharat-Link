'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
    variant?: 'full' | 'icon';
    className?: string;
}

export function Logo({ size = 'md', variant = 'full', className }: LogoProps) {
    const sizes = {
        xxs: { height: 12, width: variant === 'full' ? 60 : 12 },
        xs: { height: 24, width: variant === 'full' ? 80 : 24 },
        sm: { height: 40, width: variant === 'full' ? 140 : 40 },
        md: { height: 48, width: variant === 'full' ? 210 : 48 },
        lg: { height: 60, width: variant === 'full' ? 280 : 60 },
    };

    const dimensions = sizes[size];

    if (variant === 'icon') {
        // Icon-only version with gradient background
        return (
            <div
                className={cn(
                    'bg-gradient-to-br from-orange-500 via-orange-600 to-green-600 rounded-lg flex items-center justify-center',
                    className
                )}
                style={{ height: dimensions.height, width: dimensions.width }}
            >
                <svg
                    className="text-white"
                    width={dimensions.height * 0.6}
                    height={dimensions.height * 0.6}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <circle cx="12" cy="10" r="2" />
                    <line x1="8" y1="2" x2="8" y2="4" />
                    <line x1="16" y1="2" x2="16" y2="4" />
                </svg>
            </div>
        );
    }

    return (
        <Image
            src="/bharat_link_logo.png"
            alt="Bharat Link"
            height={dimensions.height}
            width={dimensions.width}
            className={cn('object-contain max-h-full', className)}
            style={{ maxHeight: `${dimensions.height}px`, height: 'auto' }}
            priority
            unoptimized
        />
    );
}
