import { Request, Response, NextFunction } from 'express';
import { RideService } from '../services/RideService';
import { Ride } from '../models/Ride';
import {
  DestinationFilter,
  DateFilter,
  TimeRangeFilter,
  GenderPreferenceFilter,
  StatusFilter,
} from '../patterns/RideFilter';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const createRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const creatorId = (req as any).user.id;
  const rideData = { ...req.body, creatorId };
  const ride = await RideService.createRide(rideData);
  res.status(201).json({ ride, message: 'Ride created successfully' });
});

export const getRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { destination, date, timeFrom, timeTo, genderPreference, status } = req.query as Record<string, string | undefined>;

  // When a status filter is explicitly requested, honour it; otherwise default to OPEN rides.
  const statusQuery = status ? status : 'OPEN';
  let ridesQuery = Ride.find({ status: statusQuery }).populate('creatorId', 'name profilePhoto gender');
  let rides = await ridesQuery.exec();

  // Apply Strategy-pattern filter chain
  if (destination) {
    rides = new DestinationFilter(destination).apply(rides as any) as any;
  }
  if (date) {
    rides = new DateFilter(date).apply(rides as any) as any;
  }
  if (timeFrom || timeTo) {
    rides = new TimeRangeFilter(timeFrom, timeTo).apply(rides as any) as any;
  }
  if (genderPreference) {
    rides = new GenderPreferenceFilter(genderPreference).apply(rides as any) as any;
  }

  res.status(200).json({ count: rides.length, rides });
});

export const getMyRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id;

  // Find rides where user is creator OR user is in members array
  const rides = await Ride.find({
    $or: [
      { creatorId: userId },
      { 'members.userId': userId }
    ]
  }).populate('creatorId', 'name profilePhoto');

  res.status(200).json({ rides });
});

export const getRideById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const ride = await Ride.findById(req.params.id).populate('creatorId', 'name profilePhoto gender');
  if (!ride) return next(new AppError('Ride not found', 404));
  res.status(200).json({ ride });
});

export const joinRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id;
  const member = await RideService.joinRide(req.params.id as any, userId);
  res.status(200).json({ member, message: 'Join request successful' });
});

export const cancelRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id;
  const ride = await RideService.cancelRide(req.params.id as any, userId);
  res.status(200).json({ ride, message: 'Ride cancelled' });
});

export const confirmRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id;
  const ride = await RideService.confirmRide(req.params.id as any, userId);
  res.status(200).json({ ride, message: 'Ride confirmed' });
});

export const updateMemberStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const creatorId = (req as any).user.id;
  const { memberUserId, status } = req.body;

  if (!memberUserId || !status) {
    return next(new AppError('Member User ID and Status are required', 400));
  }

  const member = await RideService.updateMemberStatus(
    req.params.id as any,
    memberUserId as any,
    creatorId,
    status
  );

  res.status(200).json({ member, message: `Member ${status.toLowerCase()} successfully` });
});
