import { PrismaClient } from '@prisma/client';

// Create a singleton Prisma client instance
// For Prisma Accelerate, we need to pass the accelerateUrl parameter
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        // For Prisma Accelerate, pass the DATABASE_URL as accelerateUrl
        accelerateUrl: process.env.DATABASE_URL,
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
