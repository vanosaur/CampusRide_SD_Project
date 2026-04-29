import mongoose from 'mongoose';
import { IRide } from '../models/Ride';
import { IUser } from '../models/User';
import { IRideMember, MemberStatus } from '../models/RideMember';

export interface IBaseRepository<T> {
  findById(id: string | mongoose.Types.ObjectId): Promise<T | null>;
  findAll(filter?: object): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  delete(id: string | mongoose.Types.ObjectId): Promise<boolean>;
}

export interface IRideRepository extends IBaseRepository<IRide> {
  save(ride: IRide): Promise<IRide>;
  findMember(rideId: string | mongoose.Types.ObjectId, userId: string | mongoose.Types.ObjectId): Promise<IRideMember | null>;
  addMember(rideId: string | mongoose.Types.ObjectId, userId: string | mongoose.Types.ObjectId, status: MemberStatus): Promise<IRideMember>;
  updateMemberStatus(rideId: string | mongoose.Types.ObjectId, userId: string | mongoose.Types.ObjectId, status: MemberStatus): Promise<IRideMember | null>;
  findActiveMembers(rideId: string | mongoose.Types.ObjectId): Promise<IRideMember[]>;
  findAllMembers(rideId: string | mongoose.Types.ObjectId): Promise<IRideMember[]>;
}

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  save(user: IUser): Promise<IUser>;
}
