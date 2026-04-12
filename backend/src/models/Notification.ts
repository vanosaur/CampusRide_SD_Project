import mongoose, { Document, Schema } from 'mongoose';

export enum NotificationType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  INFO = 'INFO',
  ERROR = 'ERROR'
}

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  message: string;
  isRead: boolean;
  relatedRideId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: Object.values(NotificationType), default: NotificationType.INFO },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  relatedRideId: { type: Schema.Types.ObjectId, ref: 'Ride' },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
