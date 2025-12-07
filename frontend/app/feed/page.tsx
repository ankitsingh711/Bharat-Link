'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { PostCard } from '@/components/feed/PostCard';
import { CreatePostModal } from '@/components/feed/CreatePostModal';
import { Post, User } from '@/types';
import { postsApi } from '@/lib/api/endpoints/posts';
import { connectionsApi } from '@/lib/api/endpoints/connections';
import { connectSocket, disconnectSocket } from '@/lib/socket/socket';

export default function FeedPage() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

    // Fetch current user info
    useEffect(() => {
        if (session?.user) {
            setCurrentUser({
                id: session.user.id || '',
                email: session.user.email || '',
                name: session.user.name || '',
                profileImage: session.user.image || null,
                headline: null,
                createdAt: '',
                updatedAt: '',
            });
        }
    }, [session?.user?.id, session?.user?.email, session?.user?.name, session?.user?.image]);

    // Fetch posts on mount
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await postsApi.getPosts();
                const fetchedPosts = response.items || [];
                setPosts(fetchedPosts);

                // Fetch connection status for all post authors
                if (session?.user?.id) {
                    const uniqueAuthorIds = [...new Set(fetchedPosts.map(p => p.authorId))];
                    const connectionStatuses = await Promise.all(
                        uniqueAuthorIds
                            .filter(id => id !== session.user.id) // Exclude own posts
                            .map(async (authorId) => {
                                try {
                                    const status = await connectionsApi.getConnectionStatus(authorId);
                                    return { authorId, isFollowing: status.isFollowing };
                                } catch (err) {
                                    return { authorId, isFollowing: false };
                                }
                            })
                    );

                    const newFollowingMap: Record<string, boolean> = {};
                    connectionStatuses.forEach(({ authorId, isFollowing }) => {
                        newFollowingMap[authorId] = isFollowing;
                    });
                    setFollowingMap(newFollowingMap);
                }
            } catch (err: any) {
                console.error('Error fetching posts:', err);
                setError(err?.response?.data?.message || 'Failed to load posts');
            } finally {
                setLoading(false);
            }
        };

        if (session?.user) {
            fetchPosts();
        }
    }, [session?.user?.id]);

    // Initialize WebSocket connection for real-time updates
    useEffect(() => {
        const socket = connectSocket();

        // Listen for new posts
        socket.on('post:created', (newPost: Post) => {
            setPosts((prev) => {
                // Check if post already exists to prevent duplicates
                const exists = prev.some(post => post.id === newPost.id);
                if (exists) {
                    return prev;
                }
                return [newPost, ...prev];
            });
        });

        // Listen for like updates
        socket.on('post:liked', (data: { postId: string; likesCount: number; liked: boolean }) => {
            setPosts((prev) =>
                prev.map((post) =>
                    post.id === data.postId
                        ? {
                            ...post,
                            _count: {
                                ...post._count,
                                likes: data.likesCount,
                            } as { comments: number; likes: number },
                        }
                        : post
                )
            );
        });

        // Listen for comment additions
        socket.on('comment:added', (data: { postId: string; comment: any }) => {
            setPosts((prev) =>
                prev.map((post) =>
                    post.id === data.postId
                        ? {
                            ...post,
                            _count: {
                                ...post._count,
                                comments: (post._count?.comments || 0) + 1,
                            } as { comments: number; likes: number },
                        }
                        : post
                )
            );
        });

        // Listen for post deletions
        socket.on('post:deleted', (data: { postId: string }) => {
            setPosts((prev) => prev.filter(post => post.id !== data.postId));
        });

        return () => {
            disconnectSocket();
        };
    }, []);

    const handleCreatePost = async (content: string) => {
        try {
            const newPost = await postsApi.createPost({ content });
            // Add optimistically for instant feedback (WebSocket duplicate check prevents doubles)
            setPosts([newPost, ...posts]);
        } catch (err: any) {
            console.error('Error creating post:', err);
            throw err;
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            // Optimistic delete - remove from UI immediately
            const postToDelete = posts.find(p => p.id === postId);
            setPosts((prev) => prev.filter(post => post.id !== postId));

            // Make API call
            await postsApi.deletePost(postId);
        } catch (err: any) {
            console.error('Error deleting post:', err);
            // Revert optimistic delete on error - refetch posts
            try {
                const response = await postsApi.getPosts();
                setPosts(response.items || []);
            } catch (refetchErr) {
                console.error('Error refetching posts:', refetchErr);
            }
        }
    };

    const handleFollow = async (userId: string) => {
        try {
            const isCurrentlyFollowing = followingMap[userId];

            // Optimistic update
            setFollowingMap(prev => ({
                ...prev,
                [userId]: !isCurrentlyFollowing,
            }));

            if (isCurrentlyFollowing) {
                await connectionsApi.unfollowUser(userId);
            } else {
                await connectionsApi.followUser(userId);
            }
        } catch (err: any) {
            console.error('Error following/unfollowing user:', err);
            // Revert optimistic update on error
            setFollowingMap(prev => ({
                ...prev,
                [userId]: !prev[userId],
            }));
        }
    };

    const handleLike = async (postId: string) => {
        try {
            // Optimistic update
            setPosts((prev) =>
                prev.map((post) => {
                    if (post.id === postId) {
                        const isCurrentlyLiked = post.isLiked || false;
                        const currentLikes = post._count?.likes || 0;
                        return {
                            ...post,
                            isLiked: !isCurrentlyLiked,
                            _count: {
                                ...post._count,
                                likes: isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1,
                            } as { comments: number; likes: number },
                        };
                    }
                    return post;
                })
            );

            // Make API call
            await postsApi.toggleLike(postId);
        } catch (err: any) {
            console.error('Error toggling like:', err);
            // Revert optimistic update on error - refetch posts
            try {
                const response = await postsApi.getPosts();
                setPosts(response.items || []);
            } catch (refetchErr) {
                console.error('Error refetching posts:', refetchErr);
            }
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="space-y-6">
                    {/* Loading skeleton for create post */}
                    <Card className="animate-pulse">
                        <CardContent className="p-5">
                            <div className="flex space-x-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                                <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Loading skeletons for posts */}
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <div className="p-6 space-y-4">
                                <div className="flex space-x-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded" />
                                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-3 text-red-800">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <h3 className="font-semibold">Failed to load feed</h3>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6 max-w-2xl">
                {/* Create Post Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                    <div
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center space-x-3 cursor-pointer"
                    >
                        <Avatar
                            src={currentUser?.profileImage || undefined}
                            fallback={currentUser?.name?.slice(0, 2).toUpperCase() || 'U'}
                            size="md"
                        />
                        <div className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-3 transition-colors">
                            <p className="text-gray-600 text-sm">Start a post...</p>
                        </div>
                    </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4">
                    {posts.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <svg
                                    className="w-16 h-16 mx-auto text-gray-300 mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                    />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">No posts yet</h3>
                                <p className="text-gray-500">Be the first to share something!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onLike={handleLike}
                                onDelete={handleDeletePost}
                                onFollow={handleFollow}
                                currentUserId={currentUser?.id}
                                isFollowing={followingMap[post.authorId] || false}
                            />
                        ))
                    )}
                </div>

                {/* Create Post Modal */}
                <CreatePostModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreatePost}
                    currentUser={currentUser}
                />
            </div>
        </div>
    );
}
