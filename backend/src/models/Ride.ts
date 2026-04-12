import mongoose, { Document, Schema } from 'mongoose';

export enum RideStatus {
  OPEN = 'OPEN',
  FULL = 'FULL',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface IRide extends Document {
  creatorId: mongoose.Types.ObjectId;
  destination: string;
  pickupLocation: string;
  date: string;
  departureTime: Date;
  maxSeats: number;
  totalFare: number;
  status: RideStatus;
  autoAccept: boolean;
  createdAt: Date;
}

const RideSchema: Schema = new Schema({
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  date: { type: String, required: true },
  departureTime: { type: Date, required: true },
  maxSeats: { type: Number, required: true, min: 1 },
  totalFare: { type: Number, required: true, min: 0 },
  status: { type: String, enum: Object.values(RideStatus), default: RideStatus.OPEN },
  autoAccept: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Ride = mongoose.model<IRide>('Ride', RideSchema);
