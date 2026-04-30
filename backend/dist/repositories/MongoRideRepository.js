"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoRideRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const Ride_1 = require("../models/Ride");
const RideMember_1 = require("../models/RideMember");
class MongoRideRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Ride_1.Ride);
    }
    async save(ride) {
        return ride.save();
    }
    async findMember(rideId, userId) {
        return RideMember_1.RideMember.findOne({ rideId, userId }).exec();
    }
    async addMember(rideId, userId, status) {
        return RideMember_1.RideMember.create({ rideId, userId, status });
    }
    async updateMemberStatus(rideId, userId, status) {
        const member = await RideMember_1.RideMember.findOne({ rideId, userId });
        if (!member)
            return null;
        member.status = status;
        await member.save();
        return member;
    }
    async findActiveMembers(rideId) {
        return RideMember_1.RideMember.find({ rideId, status: RideMember_1.MemberStatus.ACTIVE }).exec();
    }
    async findAllMembers(rideId) {
        return RideMember_1.RideMember.find({ rideId }).exec();
    }
}
exports.MongoRideRepository = MongoRideRepository;
