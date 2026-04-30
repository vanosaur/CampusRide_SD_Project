"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
const socket_io_1 = require("socket.io");
const AuthService_1 = require("../services/AuthService");
class SocketManager {
    constructor() {
        this.io = null;
        this.userSockets = new Map(); // userId -> socketId
    }
    static getInstance() {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }
        return SocketManager.instance;
    }
    init(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token)
                return next(new Error('Authentication error'));
            const decoded = AuthService_1.AuthService.verifyToken(token);
            if (!decoded)
                return next(new Error('Authentication error'));
            socket.userId = decoded.id;
            next();
        });
        this.io.on('connection', (socket) => {
            const userId = socket.userId;
            console.log(`User connected: ${userId} (Socket: ${socket.id})`);
            this.userSockets.set(userId, socket.id);
            socket.join(`user_${userId}`);
            // Broadcast online status
            this.io?.emit('user_status_change', { userId, status: 'online' });
            socket.on('joinRoom', (roomId) => {
                socket.join(roomId);
                console.log(`Socket ${socket.id} joined room ${roomId}`);
            });
            socket.on('leaveRoom', (roomId) => {
                socket.leave(roomId);
                console.log(`Socket ${socket.id} left room ${roomId}`);
            });
            // Global Live Feed
            socket.on('global_update', (data) => {
                this.io?.emit('global_update', {
                    ...data,
                    senderId: userId,
                    timestamp: new Date().toISOString()
                });
            });
            // Typing Indicators
            socket.on('typing_start', (roomId) => {
                socket.to(roomId).emit('typing_start', { userId, roomId });
            });
            socket.on('typing_stop', (roomId) => {
                socket.to(roomId).emit('typing_stop', { userId, roomId });
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
                this.userSockets.delete(userId);
                this.io?.emit('user_status_change', { userId, status: 'offline' });
            });
        });
    }
    emitToRoom(roomId, event, data) {
        if (this.io) {
            this.io.to(roomId).emit(event, data);
        }
    }
    isUserOnline(userId) {
        return this.userSockets.has(userId);
    }
}
exports.SocketManager = SocketManager;
