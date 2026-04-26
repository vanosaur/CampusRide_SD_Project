import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

/**
 * PUT /api/users/profile
 * Update the authenticated user's name, phone, and/or gender.
 * At least one field must be present (enforced by Zod schema).
 */
export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id;
  const { name, phone, gender } = req.body;

  // Build update object with only provided fields
  const updates: Record<string, unknown> = {};
  if (name !== undefined)   updates.name   = name;
  if (phone !== undefined)  updates.phone  = phone;
  if (gender !== undefined) updates.gender = gender;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-passwordHash');

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    message: 'Profile updated successfully',
    user: updatedUser,
  });
});

/**
 * PUT /api/users/photo
 * Update the authenticated user's profile photo URL.
 * The frontend is responsible for uploading to Cloudinary (or equivalent)
 * and providing the resulting HTTPS URL.
 */
export const updatePhoto = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id;
  const { profilePhoto } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { profilePhoto } },
    { new: true, runValidators: true }
  ).select('-passwordHash');

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    message: 'Profile photo updated successfully',
    user: updatedUser,
  });
});
