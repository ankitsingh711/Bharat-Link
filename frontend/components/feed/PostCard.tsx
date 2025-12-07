'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Post } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface PostCardProps {
    post: Post & { _count?: { comments: number; likes: number }; isLiked?: boolean };
    onLike: (postId: string) => void;
    onComment?: (postId: string) => void;
    onShare?: (postId: string) => void;
    onDelete?: (postId: string) => void;
    onFollow?: (userId: string) => void;
    currentUserId?: string;
    isFollowing?: boolean;
}

export function PostCard({ post, onLike, onComment, onShare, onDelete, onFollow, currentUserId, isFollowing }: PostCardProps) {
    const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
    const likesCount = post._count?.likes || 0;
    const commentsCount = post._count?.comments || 0;
    const isLiked = post.isLiked || false;
    const isAuthor = currentUserId === post.authorId;

    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = () => {
        setShowDeleteConfirm(false);
        setShowMenu(false);
        onDelete?.(post.id);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
            {/* Header */}
            <div className="p-4 pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                        <Avatar
                            size="md"
                            src={post.author?.profileImage || undefined}
                            fallback={post.author?.name?.slice(0, 2).toUpperCase() || 'U'}
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-gray-900 text-sm hover:text-orange-600 hover:underline cursor-pointer">
                                    {post.author?.name || 'Unknown User'}
                                </h3>

                                {/* Follow button (only for other users' posts) */}
                                {!isAuthor && onFollow && (
                                    <button
                                        onClick={() => onFollow(post.authorId)}
                                        className={`px-3 py-0.5 text-xs font-semibold rounded-full transition-all ${isFollowing
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {isFollowing ? 'Following' : '+ Follow'}
                                    </button>
                                )}
                            </div>
                            {post.author?.headline && (
                                <p className="text-xs text-gray-600 mt-0.5">{post.author.headline}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-0.5">{timeAgo}</p>
                        </div>
                    </div>

                    {/* Three-dot menu (only for post author) */}
                    {isAuthor && onDelete && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Post options"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </button>

                            {/* Dropdown menu */}
                            {showMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20">
                                        <button
                                            onClick={() => {
                                                setShowMenu(false);
                                                setShowDeleteConfirm(true);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>Delete post</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete confirmation dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete post?</h3>
                        <p className="text-gray-600 text-sm mb-6">
                            This can't be undone and it will be removed from your profile and the feed.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="px-4 pb-3">
                <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {post.content}
                </p>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 px-2 py-1.5 flex items-center justify-around">
                <button
                    onClick={() => onLike(post.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-colors flex-1 justify-center ${isLiked
                        ? 'text-blue-600 hover:bg-blue-50'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="text-sm font-medium">
                        {isLiked ? 'Liked' : 'Like'}
                        {likesCount > 0 && ` (${likesCount})`}
                    </span>
                </button>

                <button
                    onClick={() => onComment?.(post.id)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex-1 justify-center"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm font-medium">
                        Comment{commentsCount > 0 && ` (${commentsCount})`}
                    </span>
                </button>

                <button
                    onClick={() => onShare?.(post.id)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex-1 justify-center"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-sm font-medium">Share</span>
                </button>
            </div>
        </div>
    );
}
