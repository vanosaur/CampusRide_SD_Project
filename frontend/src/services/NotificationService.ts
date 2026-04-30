import { Notification } from '../types';

export interface NotificationResponse {
  data: {
    notifications?: Notification[];
    status?: string;
  };
}

class NotificationService {
  private notifications: Notification[] = [];

  public async notify(type: string, payload: any): Promise<void> {
    console.log('NotificationService.notify:', type, payload);
    const newNotif: Notification = {
      id: Date.now().toString(),
      userId: payload.userId || 'u1',
      type: type as any,
      message: payload.message,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.notifications.push(newNotif);
  }

  public async markAllRead(userId: string): Promise<NotificationResponse> {
    console.log('NotificationService.markAllRead:', userId);
    this.notifications.forEach(n => { if (n.userId === userId) n.isRead = true; });
    return { data: { status: 'success' } };
  }

  public async getUnread(userId: string): Promise<NotificationResponse> {
    console.log('NotificationService.getUnread:', userId);
    return { data: { notifications: this.notifications.filter(n => n.userId === userId && !n.isRead) } };
  }

  public async dispatch(notif: Notification): Promise<void> {
    console.log('NotificationService.dispatch:', notif);
    this.notifications.push(notif);
  }
}

export const notificationService = new NotificationService();
export default NotificationService;
