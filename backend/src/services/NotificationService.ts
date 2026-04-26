import { NotificationFactory } from '../patterns/NotificationFactory';
import { SocketManager } from '../patterns/SocketManager';
import { Notification } from '../models/Notification';
import mongoose from 'mongoose';

export class NotificationService {
  public static async notify(type: 'JOINED' | 'CONFIRMED' | 'CANCELLED' | 'ACCEPTED' | 'REJECTED' | 'FULL', payload: any): Promise<void> {
    const notificationObj = NotificationFactory.create(type, payload);
    const dbNotification = await notificationObj.send();
    
    // Emit real-time notification to the target user via SocketManager
    SocketManager.getInstance().emitToRoom(`user_${payload.userId}`, 'newNotification', dbNotification);
  }

  public static async markAllRead(userId: mongoose.Types.ObjectId): Promise<void> {
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  }

  public static async getUnread(userId: mongoose.Types.ObjectId) {
    return Notification.find({ userId, isRead: false }).sort({ createdAt: -1 });
  }
}
