import { Notification, NotificationType, INotification } from '../models/Notification';
import mongoose from 'mongoose';

export abstract class BaseNotification {
  protected userId: mongoose.Types.ObjectId;
  protected relatedRideId?: mongoose.Types.ObjectId;

  constructor(userId: mongoose.Types.ObjectId, relatedRideId?: mongoose.Types.ObjectId) {
    this.userId = userId;
    this.relatedRideId = relatedRideId;
  }

  public abstract send(): Promise<INotification>;
}

export class RideJoinedNotification extends BaseNotification {
  private rideName: string;

  constructor(userId: mongoose.Types.ObjectId, rideName: string, relatedRideId?: mongoose.Types.ObjectId) {
    super(userId, relatedRideId);
    this.rideName = rideName;
  }

  public async send(): Promise<INotification> {
    return Notification.create({
      userId: this.userId,
      type: NotificationType.INFO,
      message: `You successfully joined the ride to ${this.rideName}.`,
      relatedRideId: this.relatedRideId
    });
  }
}

export class RideConfirmedNotification extends BaseNotification {
  private destination: string;

  constructor(userId: mongoose.Types.ObjectId, destination: string, relatedRideId?: mongoose.Types.ObjectId) {
    super(userId, relatedRideId);
    this.destination = destination;
  }

  public async send(): Promise<INotification> {
    return Notification.create({
      userId: this.userId,
      type: NotificationType.SUCCESS,
      message: `Your ride to ${this.destination} has been confirmed!`,
      relatedRideId: this.relatedRideId
    });
  }
}

export class RideCancelledNotification extends BaseNotification {
  private reason: string;

  constructor(userId: mongoose.Types.ObjectId, reason: string, relatedRideId?: mongoose.Types.ObjectId) {
    super(userId, relatedRideId);
    this.reason = reason;
  }

  public async send(): Promise<INotification> {
    return Notification.create({
      userId: this.userId,
      type: NotificationType.WARNING,
      message: `Ride cancelled: ${this.reason}`,
      relatedRideId: this.relatedRideId
    });
  }
}

export class RideRequestNotification extends BaseNotification {
  private rideName: string;
  private status: 'ACCEPTED' | 'REJECTED';

  constructor(userId: mongoose.Types.ObjectId, rideName: string, status: 'ACCEPTED' | 'REJECTED', relatedRideId?: mongoose.Types.ObjectId) {
    super(userId, relatedRideId);
    this.rideName = rideName;
    this.status = status;
  }

  public async send(): Promise<INotification> {
    return Notification.create({
      userId: this.userId,
      type: this.status === 'ACCEPTED' ? NotificationType.SUCCESS : NotificationType.WARNING,
      message: `Your request to join the ride to ${this.rideName} was ${this.status.toLowerCase()}.`,
      relatedRideId: this.relatedRideId
    });
  }
}

export class RideFullNotification extends BaseNotification {
  private rideName: string;

  constructor(userId: mongoose.Types.ObjectId, rideName: string, relatedRideId?: mongoose.Types.ObjectId) {
    super(userId, relatedRideId);
    this.rideName = rideName;
  }

  public async send(): Promise<INotification> {
    return Notification.create({
      userId: this.userId,
      type: NotificationType.WARNING,
      message: `The ride to ${this.rideName} is now FULL!`,
      relatedRideId: this.relatedRideId
    });
  }
}

export class NotificationFactory {
  public static create(type: 'JOINED' | 'CONFIRMED' | 'CANCELLED' | 'ACCEPTED' | 'REJECTED' | 'FULL', payload: any): BaseNotification {
    if (type === 'JOINED') {
      return new RideJoinedNotification(payload.userId, payload.rideName, payload.relatedRideId);
    } else if (type === 'CONFIRMED') {
      return new RideConfirmedNotification(payload.userId, payload.rideName || payload.destination, payload.relatedRideId);
    } else if (type === 'CANCELLED') {
      return new RideCancelledNotification(payload.userId, payload.reason, payload.relatedRideId);
    } else if (type === 'ACCEPTED' || type === 'REJECTED') {
      return new RideRequestNotification(payload.userId, payload.rideName, type, payload.relatedRideId);
    } else if (type === 'FULL') {
      return new RideFullNotification(payload.userId, payload.rideName, payload.relatedRideId);
    }
    throw new Error('Unknown notification type');
  }
}
