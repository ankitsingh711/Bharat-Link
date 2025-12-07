'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    hoverable?: boolean;
    glass?: boolean;
}

export function Card({ children, className, hoverable = false, glass = false, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300',
                hoverable && 'hover:shadow-xl hover:-translate-y-1 cursor-pointer',
                glass && 'glass-effect border-white/20',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className, ...props }: CardProps) {
    return (
        <div
            className={cn('flex flex-col space-y-2 p-6', className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardTitle({ children, className, ...props }: CardProps) {
    return (
        <h3
            className={cn('text-2xl font-bold leading-none tracking-tight text-gray-900', className)}
            {...props}
        >
            {children}
        </h3>
    );
}

export function CardDescription({ children, className, ...props }: CardProps) {
    return (
        <p
            className={cn('text-sm text-gray-600', className)}
            {...props}
        >
            {children}
        </p>
    );
}

export function CardContent({ children, className, ...props }: CardProps) {
    return (
        <div className={cn('p-6 pt-0', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className, ...props }: CardProps) {
    return (
        <div
            className={cn('flex items-center p-6 pt-0', className)}
            {...props}
        >
            {children}
        </div>
    );
}
