"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const Ride_1 = require("../models/Ride");
const RideMember_1 = require("../models/RideMember");
const NotificationService_1 = require("./NotificationService");
class RideService {
    static async createRide(data) {
        // Create the ride
        const ride = await Ride_1.Ride.create(data);
        // Add creator as an active member
        if (data.creatorId) {
            await RideMember_1.RideMember.create({
                rideId: ride._id,
                userId: data.creatorId,
                status: RideMember_1.MemberStatus.ACTIVE
            });
        }
        return ride;
    }
    static async joinRide(rideId, userId) {
        const ride = await Ride_1.Ride.findById(rideId);
        if (!ride)
            throw new Error('Ride not found');
        // Check if member already exists
        const existingMember = await RideMember_1.RideMember.findOne({ rideId, userId });
        if (existingMember)
            throw new Error('Already requested. Wait for approval');
        const memberStatus = ride.autoAccept ? RideMember_1.MemberStatus.ACTIVE : RideMember_1.MemberStatus.PENDING;
        const rideMember = await RideMember_1.RideMember.create({ rideId, userId, status: memberStatus });
        if (ride.autoAccept) {
            await NotificationService_1.NotificationService.notify('JOINED', {
                userId,
                rideName: ride.destination,
                relatedRideId: ride._id
            });
            // Check if ride is full
            const activeMembersCount = await RideMember_1.RideMember.countDocuments({ rideId, status: RideMember_1.MemberStatus.ACTIVE });
            if (activeMembersCount >= ride.maxSeats) {
                ride.status = Ride_1.RideStatus.FULL;
                await ride.save();
                // Notify creator
                await NotificationService_1.NotificationService.notify('FULL', {
                    userId: ride.creatorId,
                    rideName: ride.destination,
                    relatedRideId: ride._id
                });
            }
        }
        else {
            // Notify creator to accept
            await NotificationService_1.NotificationService.notify('JOINED', {
                userId: ride.creatorId,
                rideName: 'someone requested to join',
                relatedRideId: ride._id
            });
        }
        return rideMember;
    }
    static async updateMemberStatus(rideId, memberUserId, creatorId, status) {
        const ride = await Ride_1.Ride.findById(rideId);
        if (!ride)
            throw new Error('Ride not found');
        if (ride.creatorId.toString() !== creatorId.toString()) {
            throw new Error('Only the ride creator can manage members');
        }
        const member = await RideMember_1.RideMember.findOne({ rideId, userId: memberUserId });
        if (!member)
            throw new Error('Member not found');
        member.status = status;
        await member.save();
        // Notify the member of the status update
        await NotificationService_1.NotificationService.notify(status === RideMember_1.MemberStatus.ACTIVE ? 'ACCEPTED' : 'REJECTED', {
            userId: memberUserId,
            rideName: ride.destination,
            relatedRideId: ride._id
        });
        // Check if ride is full
        if (status === RideMember_1.MemberStatus.ACTIVE) {
            const activeMembersCount = await RideMember_1.RideMember.countDocuments({ rideId, status: RideMember_1.MemberStatus.ACTIVE });
            if (activeMembersCount >= ride.maxSeats) {
                ride.status = Ride_1.RideStatus.FULL;
                await ride.save();
                // Notify creator and members
                await NotificationService_1.NotificationService.notify('FULL', {
                    userId: ride.creatorId,
                    rideName: ride.destination,
                    relatedRideId: ride._id
                });
                const activeMembers = await RideMember_1.RideMember.find({ rideId, status: RideMember_1.MemberStatus.ACTIVE });
                for (const m of activeMembers) {
                    if (m.userId.toString() !== ride.creatorId.toString()) {
                        await NotificationService_1.NotificationService.notify('FULL', {
                            userId: m.userId,
                            rideName: ride.destination,
                            relatedRideId: ride._id
                        });
                    }
                }
            }
        }
        return member;
    }
    static async confirmRide(rideId, creatorId) {
        const ride = await Ride_1.Ride.findById(rideId);
        if (!ride)
            throw new Error('Ride not found');
        if (ride.creatorId.toString() !== creatorId.toString()) {
            throw new Error('Unauthorized');
        }
        ride.status = Ride_1.RideStatus.CONFIRMED;
        await ride.save();
        // Notify all active members
        const members = await RideMember_1.RideMember.find({ rideId, status: RideMember_1.MemberStatus.ACTIVE });
        for (const member of members) {
            if (member.userId.toString() !== creatorId.toString()) {
                await NotificationService_1.NotificationService.notify('CONFIRMED', {
                    userId: member.userId,
                    rideName: ride.destination,
                    relatedRideId: ride._id
                });
            }
        }
        return ride;
    }
    static async cancelRide(rideId, userId) {
        const ride = await Ride_1.Ride.findById(rideId);
        if (!ride)
            throw new Error('Ride not found');
        if (ride.creatorId.toString() !== userId.toString()) {
            throw new Error('Unauthorized');
        }
        ride.status = Ride_1.RideStatus.CANCELLED;
        await ride.save();
        // Notify active and pending members
        const members = await RideMember_1.RideMember.find({ rideId });
        for (const member of members) {
            if (member.userId.toString() !== userId.toString()) {
                await NotificationService_1.NotificationService.notify('CANCELLED', {
                    userId: member.userId,
                    reason: 'Creator cancelled the ride',
                    relatedRideId: ride._id
                });
            }
        }
        return ride;
    }
}
exports.RideService = RideService;
