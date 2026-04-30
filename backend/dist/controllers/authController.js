"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.verifyOTP = exports.register = void 0;
const AuthService_1 = require("../services/AuthService");
const email_1 = require("../utils/email");
const User_1 = require("../models/User");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
// Temporary store for OTPs (In-production, use Redis)
const otpStore = new Map();
exports.register = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!email.endsWith('@nst.rishihood.edu.in') && !email.endsWith('.edu')) {
        return next(new AppError_1.AppError('Please use your university email address', 400));
    }
    const existingUser = await User_1.User.findOne({ email });
    if (existingUser) {
        return next(new AppError_1.AppError('User already exists', 400));
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, {
        otp,
        userData: { name, email, password },
        expires: Date.now() + 10 * 60 * 1000 // 10 mins
    });
    await (0, email_1.sendEmailOTP)(email, otp);
    res.status(200).json({ message: 'OTP sent to your email' });
});
exports.verifyOTP = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { email, otp } = req.body;
    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
        return next(new AppError_1.AppError('Invalid or expired OTP', 400));
    }
    const { name, password } = stored.userData;
    const passwordHash = await AuthService_1.AuthService.hashPassword(password);
    const newUser = await User_1.User.create({ name, email, passwordHash, isVerified: true });
    otpStore.delete(email);
    const token = AuthService_1.AuthService.generateToken(newUser);
    res.status(201).json({ user: newUser, token });
});
exports.login = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User_1.User.findOne({ email }).select('+passwordHash');
    if (!user || !(await AuthService_1.AuthService.comparePassword(password, user.passwordHash))) {
        return next(new AppError_1.AppError('Invalid credentials', 401));
    }
    const token = AuthService_1.AuthService.generateToken(user);
    res.status(200).json({ user, token });
});
exports.getMe = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const user = await User_1.User.findById(req.user.id).select('-passwordHash');
    if (!user)
        return next(new AppError_1.AppError('User not found', 404));
    res.status(200).json({ user });
});
