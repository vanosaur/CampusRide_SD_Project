import { NotifType } from '../types';

export abstract class BaseNotification {
  protected userId: string;
  protected isRead: boolean;
  protected createdAt: string;

  constructor(userId: string) {
    this.userId = userId;
    this.isRead = false;
    this.createdAt = new Date().toISOString();
  }

  public abstract send(): void;
  public markRead(): void {
    this.isRead = true;
  }
}

class RideJoinedNotification extends BaseNotification {
  private rideName: string;

  constructor(userId: string, rideName: string) {
    super(userId);
    this.rideName = rideName;
  }

  public send(): void {
    console.log(`Notification sent: User joined ${this.rideName}`);
  }
}

class RideConfirmedNotification extends BaseNotification {
  private confirmedAt: string;

  constructor(userId: string) {
    super(userId);
    this.confirmedAt = new Date().toISOString();
  }

  public send(): void {
    console.log(`Notification sent: Ride confirmed at ${this.confirmedAt}`);
  }
}

class RideCancelledNotification extends BaseNotification {
  private reason: string;

  constructor(userId: string, reason: string) {
    super(userId);
    this.reason = reason;
  }

  public send(): void {
    console.log(`Notification sent: Ride cancelled. Reason: ${this.reason}`);
  }
}

class NotificationFactory {
  public create(type: NotifType, payload: any): BaseNotification {
    switch (type) {
      case 'RIDE_JOINED':
        return new RideJoinedNotification(payload.userId, payload.rideName);
      case 'RIDE_CONFIRMED':
        return new RideConfirmedNotification(payload.userId);
      case 'RIDE_CANCELLED':
        return new RideCancelledNotification(payload.userId, payload.reason);
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }
}

export const notificationFactory = new NotificationFactory();
export default NotificationFactory;
