import { describe, it, expect, beforeAll, afterEach, jest } from '@jest/globals';
import { RideService } from '../../src/services/RideService';
import { NotificationService } from '../../src/services/NotificationService';
import { Ride, RideStatus } from '../../src/models/Ride';
import { RideMember, MemberStatus } from '../../src/models/RideMember';
import { User } from '../../src/models/User';
import mongoose from 'mongoose';

// Mock the notification service to prevent socket connections during tests
jest.mock('../../src/services/NotificationService', () => ({
  NotificationService: {
    notify: jest.fn().mockReturnValue(Promise.resolve()),
  }
}));

describe('RideService', () => {
  let mockUserId: mongoose.Types.ObjectId;
  let mockPassengerId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    const creator = await User.create({
      name: 'Host',
      email: 'host@nst.rishihood.edu.in',
      passwordHash: 'hash',
      isVerified: true
    });
    mockUserId = creator._id;

    const passenger = await User.create({
      name: 'Passenger',
      email: 'passenger@nst.rishihood.edu.in',
      passwordHash: 'hash',
      isVerified: true
    });
    mockPassengerId = passenger._id;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRide', () => {
    it('should create a new ride and add creator as ACTIVE member', async () => {
      const rideData = {
        creatorId: mockUserId,
        destination: 'Campus Gate',
        pickupLocation: 'Hostel',
        date: '2026-05-01',
        departureTime: new Date(),
        maxSeats: 4,
        totalFare: 500,
        autoAccept: false
      };

      const ride = await RideService.createRide(rideData);
      
      expect(ride).toBeDefined();
      expect(ride.destination).toBe('Campus Gate');
      expect(ride.creatorId.toString()).toBe(mockUserId.toString());

      // Check if creator is an active member
      const member = await RideMember.findOne({ rideId: ride._id, userId: mockUserId });
      expect(member).toBeDefined();
      expect(member?.status).toBe(MemberStatus.ACTIVE);
    });
  });

  describe('joinRide', () => {
    it('should allow a user to request to join a ride (PENDING when autoAccept is false)', async () => {
      const ride = await Ride.create({
        creatorId: mockUserId,
        destination: 'City Center',
        pickupLocation: 'Hostel',
        date: '2026-05-01',
        departureTime: new Date(),
        maxSeats: 4,
        totalFare: 500,
        autoAccept: false,
        status: RideStatus.OPEN
      });

      const rideMember = await RideService.joinRide(ride._id, mockPassengerId);

      expect(rideMember.status).toBe(MemberStatus.PENDING);
      expect(NotificationService.notify).toHaveBeenCalledWith('JOINED', expect.any(Object));
    });

    it('should auto-accept user and make them ACTIVE when autoAccept is true', async () => {
      const ride = await Ride.create({
        creatorId: mockUserId,
        destination: 'Mall',
        pickupLocation: 'Campus',
        date: '2026-05-01',
        departureTime: new Date(),
        maxSeats: 4,
        totalFare: 500,
        autoAccept: true,
        status: RideStatus.OPEN
      });

      const rideMember = await RideService.joinRide(ride._id, mockPassengerId);

      expect(rideMember.status).toBe(MemberStatus.ACTIVE);
    });

    it('should mark ride as FULL if maxSeats is reached on autoAccept', async () => {
      const ride = await Ride.create({
        creatorId: mockUserId,
        destination: 'Airport',
        pickupLocation: 'Campus',
        date: '2026-05-01',
        departureTime: new Date(),
        maxSeats: 1, // Max capacity 1
        totalFare: 100,
        autoAccept: true,
        status: RideStatus.OPEN
      });

      await RideService.joinRide(ride._id, mockPassengerId);

      // Fetch the updated ride
      const updatedRide = await Ride.findById(ride._id);
      expect(updatedRide?.status).toBe(RideStatus.FULL);
      expect(NotificationService.notify).toHaveBeenCalledWith('FULL', expect.any(Object));
    });

    it('should reject a join request if the user is already a member', async () => {
      const ride = await Ride.create({
        creatorId: mockUserId,
        destination: 'Station',
        pickupLocation: 'Campus',
        date: '2026-05-01',
        departureTime: new Date(),
        maxSeats: 4,
        totalFare: 100,
        autoAccept: true,
        status: RideStatus.OPEN
      });

      await RideService.joinRide(ride._id, mockPassengerId);
      
      // Attempt to join again
      await expect(RideService.joinRide(ride._id, mockPassengerId)).rejects.toThrow('Already requested. Wait for approval');
    });
  });

  describe('updateMemberStatus', () => {
    it('should allow creator to accept a pending member', async () => {
      const ride = await Ride.create({
        creatorId: mockUserId,
        destination: 'Station',
        pickupLocation: 'Campus',
        date: '2026-05-01',
        departureTime: new Date(),
        maxSeats: 4,
        totalFare: 100,
        autoAccept: false,
        status: RideStatus.OPEN
      });

      await RideMember.create({ rideId: ride._id, userId: mockPassengerId, status: MemberStatus.PENDING });

      const updatedMember = await RideService.updateMemberStatus(ride._id, mockPassengerId, mockUserId, MemberStatus.ACTIVE);
      
      expect(updatedMember.status).toBe(MemberStatus.ACTIVE);
      expect(NotificationService.notify).toHaveBeenCalledWith('ACCEPTED', expect.any(Object));
    });

    it('should throw an error if a non-creator attempts to accept a member', async () => {
       const ride = await Ride.create({
        creatorId: mockUserId,
        destination: 'Station',
        pickupLocation: 'Campus',
        date: '2026-05-01',
        departureTime: new Date(),
        maxSeats: 4,
        totalFare: 100,
        autoAccept: false,
        status: RideStatus.OPEN
      });

      await RideMember.create({ rideId: ride._id, userId: mockPassengerId, status: MemberStatus.PENDING });

      // Unauthorized user (mockPassengerId trying to act as creator)
      await expect(RideService.updateMemberStatus(ride._id, mockPassengerId, mockPassengerId, MemberStatus.ACTIVE))
        .rejects.toThrow('Only the ride creator can manage members');
    });
  });
});
