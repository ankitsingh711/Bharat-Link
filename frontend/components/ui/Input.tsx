'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        {label}
                        {props.required && <span className="text-orange-500 ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex h-11 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-base',
                        'placeholder:text-gray-400',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500',
                        'hover:border-gray-300',
                        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
                        error && 'border-red-400 focus:ring-red-500/20 focus:border-red-500',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-2 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
