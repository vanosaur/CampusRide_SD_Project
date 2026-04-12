import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { sendEmailOTP } from '../utils/email';
import { User } from '../models/User';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

// Temporary store for OTPs (In-production, use Redis)
const otpStore = new Map<string, { otp: string; userData: any; expires: number }>();

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!email.endsWith('@nst.rishihood.edu.in') && !email.endsWith('.edu')) {
    return next(new AppError('Please use your university email address', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User already exists', 400));
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, {
    otp,
    userData: { name, email, password },
    expires: Date.now() + 10 * 60 * 1000 // 10 mins
  });

  await sendEmailOTP(email, otp);
  res.status(200).json({ message: 'OTP sent to your email' });
});

export const verifyOTP = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body;
  const stored = otpStore.get(email);

  if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
    return next(new AppError('Invalid or expired OTP', 400));
  }

  const { name, password } = stored.userData;
  const passwordHash = await AuthService.hashPassword(password);
  const newUser = await User.create({ name, email, passwordHash, isVerified: true });
  
  otpStore.delete(email);

  const token = AuthService.generateToken(newUser);
  res.status(201).json({ user: newUser, token });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user || !(await AuthService.comparePassword(password, user.passwordHash))) {
    return next(new AppError('Invalid credentials', 401));
  }

  const token = AuthService.generateToken(user);
  res.status(200).json({ user, token });
});

export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById((req as any).user.id).select('-passwordHash');
  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({ user });
});
