import { Ride, IRide, RideStatus } from '../models/Ride';
import { RideMember, MemberStatus } from '../models/RideMember';
import { NotificationService } from './NotificationService';
import mongoose from 'mongoose';

export class RideService {
  public static async createRide(data: Partial<IRide>): Promise<IRide> {
    // Create the ride
    const ride = await Ride.create(data);
    
    // Add creator as an active member
    if (data.creatorId) {
      await RideMember.create({
        rideId: ride._id,
        userId: data.creatorId,
        status: MemberStatus.ACTIVE
      });
    }
    return ride;
  }

  public static async joinRide(rideId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
    const ride = await Ride.findById(rideId);
    if (!ride) throw new Error('Ride not found');
    
    // Check if member already exists
    const existingMember = await RideMember.findOne({ rideId, userId });
    if (existingMember) throw new Error('Already requested. Wait for approval');

    const memberStatus = ride.autoAccept ? MemberStatus.ACTIVE : MemberStatus.PENDING;
    const rideMember = await RideMember.create({ rideId, userId, status: memberStatus });
    
    if (ride.autoAccept) {
      await NotificationService.notify('JOINED', { 
        userId, 
        rideName: ride.destination, 
        relatedRideId: ride._id 
      });
    } else {
      // Notify creator to accept
      await NotificationService.notify('JOINED', { 
        userId: ride.creatorId, 
        rideName: 'someone requested to join', 
        relatedRideId: ride._id 
      });
    }
    return rideMember;
  }

  public static async updateMemberStatus(rideId: mongoose.Types.ObjectId, memberUserId: mongoose.Types.ObjectId, creatorId: mongoose.Types.ObjectId, status: MemberStatus) {
    const ride = await Ride.findById(rideId);
    if (!ride) throw new Error('Ride not found');
    
    if (ride.creatorId.toString() !== creatorId.toString()) {
      throw new Error('Only the ride creator can manage members');
    }

    const member = await RideMember.findOne({ rideId, userId: memberUserId });
    if (!member) throw new Error('Member not found');

    member.status = status;
    await member.save();

    // Notify the member of the status update
    await NotificationService.notify(status === MemberStatus.ACTIVE ? 'ACCEPTED' : 'REJECTED', {
      userId: memberUserId,
      rideName: ride.destination,
      relatedRideId: ride._id
    });

    return member;
  }

  public static async confirmRide(rideId: mongoose.Types.ObjectId, creatorId: mongoose.Types.ObjectId) {
    const ride = await Ride.findById(rideId);
    if (!ride) throw new Error('Ride not found');
    
    if (ride.creatorId.toString() !== creatorId.toString()) {
      throw new Error('Unauthorized');
    }

    ride.status = RideStatus.CONFIRMED;
    await ride.save();

    // Notify all active members
    const members = await RideMember.find({ rideId, status: MemberStatus.ACTIVE });
    for (const member of members) {
      if (member.userId.toString() !== creatorId.toString()) {
        await NotificationService.notify('CONFIRMED', {
          userId: member.userId,
          rideName: ride.destination,
          relatedRideId: ride._id
        });
      }
    }

    return ride;
  }

  public static async cancelRide(rideId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
    const ride = await Ride.findById(rideId);
    if (!ride) throw new Error('Ride not found');
    
    if (ride.creatorId.toString() !== userId.toString()) {
      throw new Error('Unauthorized');
    }
    
    ride.status = RideStatus.CANCELLED;
    await ride.save();
    
    // Notify active and pending members
    const members = await RideMember.find({ rideId });
    for (const member of members) {
      if (member.userId.toString() !== userId.toString()) {
        await NotificationService.notify('CANCELLED', { 
          userId: member.userId, 
          reason: 'Creator cancelled the ride', 
          relatedRideId: ride._id 
        });
      }
    }
    return ride;
  }
}
