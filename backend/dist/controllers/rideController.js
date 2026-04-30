"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMemberStatus = exports.confirmRide = exports.cancelRide = exports.joinRide = exports.getRideById = exports.getMyRides = exports.getRides = exports.createRide = void 0;
const RideService_1 = require("../services/RideService");
const Ride_1 = require("../models/Ride");
const RideFilter_1 = require("../patterns/RideFilter");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
exports.createRide = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const creatorId = req.user.id;
    const rideData = { ...req.body, creatorId };
    const ride = await RideService_1.RideService.createRide(rideData);
    res.status(201).json({ ride, message: 'Ride created successfully' });
});
exports.getRides = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { destination, date, timeFrom, timeTo, genderPreference, status } = req.query;
    // When a status filter is explicitly requested, honour it; otherwise default to OPEN rides.
    const statusQuery = status ? status : 'OPEN';
    let ridesQuery = Ride_1.Ride.find({ status: statusQuery }).populate('creatorId', 'name profilePhoto gender');
    let rides = await ridesQuery.exec();
    // Apply Strategy-pattern filter chain
    if (destination) {
        rides = new RideFilter_1.DestinationFilter(destination).apply(rides);
    }
    if (date) {
        rides = new RideFilter_1.DateFilter(date).apply(rides);
    }
    if (timeFrom || timeTo) {
        rides = new RideFilter_1.TimeRangeFilter(timeFrom, timeTo).apply(rides);
    }
    if (genderPreference) {
        rides = new RideFilter_1.GenderPreferenceFilter(genderPreference).apply(rides);
    }
    res.status(200).json({ count: rides.length, rides });
});
exports.getMyRides = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.user.id;
    // Find rides where user is creator OR user is in members array
    const rides = await Ride_1.Ride.find({
        $or: [
            { creatorId: userId },
            { 'members.userId': userId }
        ]
    }).populate('creatorId', 'name profilePhoto');
    res.status(200).json({ rides });
});
exports.getRideById = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const ride = await Ride_1.Ride.findById(req.params.id).populate('creatorId', 'name profilePhoto gender');
    if (!ride)
        return next(new AppError_1.AppError('Ride not found', 404));
    res.status(200).json({ ride });
});
exports.joinRide = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.user.id;
    const member = await RideService_1.RideService.joinRide(req.params.id, userId);
    res.status(200).json({ member, message: 'Join request successful' });
});
exports.cancelRide = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.user.id;
    const ride = await RideService_1.RideService.cancelRide(req.params.id, userId);
    res.status(200).json({ ride, message: 'Ride cancelled' });
});
exports.confirmRide = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.user.id;
    const ride = await RideService_1.RideService.confirmRide(req.params.id, userId);
    res.status(200).json({ ride, message: 'Ride confirmed' });
});
exports.updateMemberStatus = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const creatorId = req.user.id;
    const { memberUserId, status } = req.body;
    if (!memberUserId || !status) {
        return next(new AppError_1.AppError('Member User ID and Status are required', 400));
    }
    const member = await RideService_1.RideService.updateMemberStatus(req.params.id, memberUserId, creatorId, status);
    res.status(200).json({ member, message: `Member ${status.toLowerCase()} successfully` });
});
