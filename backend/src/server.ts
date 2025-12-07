import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import prisma from './lib/prisma';

const PORT = process.env.PORT || 4000;

async function main() {
    try {
        await prisma.$connect();
        console.log('Connected to Database');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

main();
