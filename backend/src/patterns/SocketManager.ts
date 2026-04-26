import { Server, Socket } from 'socket.io';
import http from 'http';
import { AuthService } from '../services/AuthService';

export class SocketManager {
  private static instance: SocketManager;
  private io: Server | null = null;
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public init(server: http.Server): void {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      const decoded = AuthService.verifyToken(token);
      if (!decoded) return next(new Error('Authentication error'));
      (socket as any).userId = decoded.id;
      next();
    });

    this.io.on('connection', (socket: Socket) => {
      const userId = (socket as any).userId;
      console.log(`User connected: ${userId} (Socket: ${socket.id})`);
      
      this.userSockets.set(userId, socket.id);
      socket.join(`user_${userId}`);
      
      // Broadcast online status
      this.io?.emit('user_status_change', { userId, status: 'online' });

      socket.on('joinRoom', (roomId: string) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
      });

      socket.on('leaveRoom', (roomId: string) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room ${roomId}`);
      });

      // Global Live Feed
      socket.on('global_update', (data: any) => {
        this.io?.emit('global_update', {
          ...data,
          senderId: userId,
          timestamp: new Date().toISOString()
        });
      });

      // Typing Indicators
      socket.on('typing_start', (roomId: string) => {
        socket.to(roomId).emit('typing_start', { userId, roomId });
      });

      socket.on('typing_stop', (roomId: string) => {
        socket.to(roomId).emit('typing_stop', { userId, roomId });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        this.userSockets.delete(userId);
        this.io?.emit('user_status_change', { userId, status: 'offline' });
      });
    });
  }

  public emitToRoom(roomId: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(roomId).emit(event, data);
    }
  }

  public isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}
