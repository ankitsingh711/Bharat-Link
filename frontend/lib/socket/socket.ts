'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = () => {
    if (socket) {
        return socket;
    }

    socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
        transports: ['websocket', 'polling'],
        autoConnect: false,
    });

    socket.on('connect', () => {
        console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
    });

    socket.on'connect_error', (error) => {
        console.error('WebSocket connection error:', error);
    });

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        return initSocket();
    }
    return socket;
};

export const connectSocket = () => {
    const s = getSocket();
    if (!s.connected) {
        s.connect();
    }
    return s;
};

export const disconnectSocket = () => {
    if (socket?.connected) {
        socket.disconnect();
    }
};

export default {
    init: initSocket,
    get: getSocket,
    connect: connectSocket,
    disconnect: disconnectSocket,
};
