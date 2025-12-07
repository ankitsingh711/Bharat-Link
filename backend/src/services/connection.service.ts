import prisma from '../lib/prisma';

export const connectionService = {
    /**
     * Follow a user (creates a connection with ACCEPTED status)
     */
    async followUser(followerId: string, followingId: string) {
        // Can't follow yourself
        if (followerId === followingId) {
            throw new Error('Cannot follow yourself');
        }

        // Check if already following
        const existing = await prisma.connection.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        if (existing) {
            throw new Error('Already following this user');
        }

        // Create connection with ACCEPTED status (auto-accept)
        return await prisma.connection.create({
            data: {
                followerId,
                followingId,
                status: 'ACCEPTED',
            },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        headline: true,
                    },
                },
            },
        });
    },

    /**
     * Unfollow a user (deletes the connection)
     */
    async unfollowUser(followerId: string, followingId: string) {
        const connection = await prisma.connection.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        if (!connection) {
            throw new Error('Not following this user');
        }

        return await prisma.connection.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });
    },

    /**
     * Get connection status between two users
     */
    async getConnectionStatus(followerId: string, followingId: string) {
        const connection = await prisma.connection.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        return {
            isFollowing: !!connection,
            status: connection?.status || null,
        };
    },

    /**
     * Get followers of a user
     */
    async getFollowers(userId: string) {
        const connections = await prisma.connection.findMany({
            where: {
                followingId: userId,
                status: 'ACCEPTED',
            },
            include: {
                follower: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        headline: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return connections.map((c) => c.follower);
    },

    /**
     * Get users that a user is following
     */
    async getFollowing(userId: string) {
        const connections = await prisma.connection.findMany({
            where: {
                followerId: userId,
                status: 'ACCEPTED',
            },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        headline: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return connections.map((c) => c.following);
    },

    /**
     * Get follower and following counts
     */
    async getFollowCounts(userId: string) {
        const [followersCount, followingCount] = await Promise.all([
            prisma.connection.count({
                where: {
                    followingId: userId,
                    status: 'ACCEPTED',
                },
            }),
            prisma.connection.count({
                where: {
                    followerId: userId,
                    status: 'ACCEPTED',
                },
            }),
        ]);

        return {
            followers: followersCount,
            following: followingCount,
        };
    },
};
