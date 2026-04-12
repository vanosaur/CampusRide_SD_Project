import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  rideId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  isPinned: boolean;
  sentAt: Date;
}

const MessageSchema: Schema = new Schema({
  rideId: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isPinned: { type: Boolean, default: false },
  sentAt: { type: Date, default: Date.now }
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
