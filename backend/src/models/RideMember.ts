import mongoose, { Document, Schema } from 'mongoose';

export enum MemberStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  LEFT = 'LEFT'
}

export interface IRideMember extends Document {
  rideId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: MemberStatus;
  joinedAt: Date;
  updatedAt: Date;
}

const RideMemberSchema: Schema = new Schema({
  rideId: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: Object.values(MemberStatus), default: MemberStatus.PENDING },
  joinedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

RideMemberSchema.pre('save', function(this: any) {
  this.updatedAt = new Date();
});

export const RideMember = mongoose.model<IRideMember>('RideMember', RideMemberSchema);
