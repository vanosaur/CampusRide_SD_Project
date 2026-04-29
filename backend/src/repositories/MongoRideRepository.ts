import mongoose from 'mongoose';
import { BaseRepository } from './BaseRepository';
import { IRideRepository } from './interfaces';
import { Ride, IRide } from '../models/Ride';
import { RideMember, IRideMember, MemberStatus } from '../models/RideMember';

export class MongoRideRepository extends BaseRepository<IRide> implements IRideRepository {
  constructor() {
    super(Ride);
  }

  public async save(ride: IRide): Promise<IRide> {
    return ride.save();
  }

  public async findMember(rideId: string | mongoose.Types.ObjectId, userId: string | mongoose.Types.ObjectId): Promise<IRideMember | null> {
    return RideMember.findOne({ rideId, userId }).exec();
  }

  public async addMember(rideId: string | mongoose.Types.ObjectId, userId: string | mongoose.Types.ObjectId, status: MemberStatus): Promise<IRideMember> {
    return RideMember.create({ rideId, userId, status });
  }

  public async updateMemberStatus(rideId: string | mongoose.Types.ObjectId, userId: string | mongoose.Types.ObjectId, status: MemberStatus): Promise<IRideMember | null> {
    const member = await RideMember.findOne({ rideId, userId });
    if (!member) return null;
    member.status = status;
    await member.save();
    return member;
  }

  public async findActiveMembers(rideId: string | mongoose.Types.ObjectId): Promise<IRideMember[]> {
    return RideMember.find({ rideId, status: MemberStatus.ACTIVE }).exec();
  }

  public async findAllMembers(rideId: string | mongoose.Types.ObjectId): Promise<IRideMember[]> {
    return RideMember.find({ rideId }).exec();
  }
}
