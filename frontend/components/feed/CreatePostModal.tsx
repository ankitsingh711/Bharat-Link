'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { User } from '@/types';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (content: string) => Promise<void>;
    currentUser?: User | null;
}

const MAX_CONTENT_LENGTH = 5000;

export function CreatePostModal({ isOpen, onClose, onSubmit, currentUser }: CreatePostModalProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!content.trim() || content.length > MAX_CONTENT_LENGTH) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content);
            setContent('');
            onClose();
        } catch (error) {
            console.error('Failed to create post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const isPostDisabled = !content.trim() || content.length > MAX_CONTENT_LENGTH || isSubmitting;
    const characterPercentage = (content.length / MAX_CONTENT_LENGTH) * 100;
    const isNearLimit = content.length > MAX_CONTENT_LENGTH * 0.9;

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in fade-in duration-200"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-white to-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">Create a post</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 mb-5">
                        <Avatar
                            size="md"
                            src={currentUser?.profileImage || undefined}
                            fallback={currentUser?.name?.slice(0, 2).toUpperCase() || 'You'}
                        />
                        <div>
                            <p className="font-semibold text-gray-900">{currentUser?.name || 'You'}</p>
                            {currentUser?.headline && (
                                <p className="text-sm text-gray-500">{currentUser.headline}</p>
                            )}
                        </div>
                    </div>

                    {/* Text Area */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What do you want to talk about?"
                        className="w-full min-h-[240px] p-0 border-0 focus:outline-none focus:ring-0 resize-none text-gray-800 placeholder:text-gray-400 text-base leading-relaxed"
                        autoFocus
                    />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-white">
                    {/* Character Count with Progress Bar */}
                    <div className="mb-4">
                        {content.length > 0 && (
                            <>
                                <div className="flex items-center justify-between mb-2">
                                    {content.length > MAX_CONTENT_LENGTH && (
                                        <span className="text-xs text-red-600 font-medium">
                                            Character limit exceeded by {content.length - MAX_CONTENT_LENGTH}
                                        </span>
                                    )}
                                    <span className={`text-xs ml-auto ${content.length > MAX_CONTENT_LENGTH
                                            ? 'text-red-600 font-semibold'
                                            : isNearLimit
                                                ? 'text-orange-600 font-medium'
                                                : 'text-gray-500'
                                        }`}>
                                        {content.length} / {MAX_CONTENT_LENGTH}
                                    </span>
                                </div>
                                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 rounded-full ${content.length > MAX_CONTENT_LENGTH
                                                ? 'bg-red-500'
                                                : isNearLimit
                                                    ? 'bg-orange-500'
                                                    : 'bg-blue-500'
                                            }`}
                                        style={{ width: `${Math.min(characterPercentage, 100)}%` }}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-3">
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isPostDisabled}
                            className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${isPostDisabled
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                                }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center space-x-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Posting...</span>
                                </span>
                            ) : (
                                'Post'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
