import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export const initializeWebSocket = (httpServer: HTTPServer) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Allow users to join their personal notification room
        socket.on('join:user', (userId: string) => {
            if (userId) {
                socket.join(`user:${userId}`);
                console.log(`User ${userId} joined their notification room`);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });

    console.log('WebSocket server initialized');
    return io;
};

export const getSocketInstance = (): SocketIOServer | null => {
    return io;
};
