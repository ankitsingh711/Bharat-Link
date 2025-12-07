'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
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

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Create a post</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 mb-4">
                        <Avatar
                            size="md"
                            src={currentUser?.profileImage || undefined}
                            fallback={currentUser?.name?.slice(0, 2).toUpperCase() || 'You'}
                        />
                        <div>
                            <p className="font-semibold text-gray-900">{currentUser?.name || 'You'}</p>
                            {currentUser?.headline && (
                                <p className="text-sm text-gray-600">{currentUser.headline}</p>
                            )}
                        </div>
                    </div>

                    {/* Text Area */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What do you want to talk about?"
                        className="w-full min-h-[200px] p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none text-gray-800"
                        autoFocus
                    />

                    {/* Character Count */}
                    <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-gray-500">
                            {content.length > MAX_CONTENT_LENGTH && (
                                <span className="text-red-600 font-medium">
                                    Character limit exceeded by {content.length - MAX_CONTENT_LENGTH}
                                </span>
                            )}
                        </div>
                        <span className={`text-sm ${content.length > MAX_CONTENT_LENGTH
                                ? 'text-red-600 font-medium'
                                : 'text-gray-500'
                            }`}>
                            {content.length} / {MAX_CONTENT_LENGTH}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-end space-x-3">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!content.trim() || content.length > MAX_CONTENT_LENGTH || isSubmitting}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
