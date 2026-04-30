"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePhoto = exports.updateProfile = void 0;
const User_1 = require("../models/User");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
/**
 * PUT /api/users/profile
 * Update the authenticated user's name, phone, and/or gender.
 * At least one field must be present (enforced by Zod schema).
 */
exports.updateProfile = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.user.id;
    const { name, phone, gender } = req.body;
    // Build update object with only provided fields
    const updates = {};
    if (name !== undefined)
        updates.name = name;
    if (phone !== undefined)
        updates.phone = phone;
    if (gender !== undefined)
        updates.gender = gender;
    const updatedUser = await User_1.User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true }).select('-passwordHash');
    if (!updatedUser) {
        return next(new AppError_1.AppError('User not found', 404));
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
exports.updatePhoto = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.user.id;
    const { profilePhoto } = req.body;
    const updatedUser = await User_1.User.findByIdAndUpdate(userId, { $set: { profilePhoto } }, { new: true, runValidators: true }).select('-passwordHash');
    if (!updatedUser) {
        return next(new AppError_1.AppError('User not found', 404));
    }
    res.status(200).json({
        message: 'Profile photo updated successfully',
        user: updatedUser,
    });
});
