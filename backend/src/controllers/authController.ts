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
  const normalizedEmail = email.toLowerCase().trim();

  // Strict university email check restored as requested
  if (!normalizedEmail.endsWith('@nst.rishihood.edu.in') && !normalizedEmail.endsWith('.edu')) {
    return next(new AppError('Please use your university email address (@nst.rishihood.edu.in)', 400));
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return next(new AppError('User with this email already exists', 400));
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(normalizedEmail, {
    otp,
    userData: { name, email: normalizedEmail, password },
    expires: Date.now() + 10 * 60 * 1000 // 10 mins
  });

  // FIRE AND FORGET: Background email send
  sendEmailOTP(normalizedEmail, otp).catch(err => {
    console.error(`[BACKGROUND EMAIL ERROR] Failed to send to ${normalizedEmail}:`, err.message);
  });

  res.status(200).json({ 
    message: 'Security code sent to your university email',
    devNote: 'Check your spam folder or Render logs if it takes more than 30 seconds.'
  });
});

export const verifyOTP = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  const stored = otpStore.get(normalizedEmail);

  if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
    return next(new AppError('Invalid or expired security code', 400));
  }

  const { name, password } = stored.userData;
  const passwordHash = await AuthService.hashPassword(password);
  
  const newUser = await User.create({ 
    name, 
    email: normalizedEmail, 
    passwordHash, 
    isVerified: true 
  });
  
  otpStore.delete(normalizedEmail);

  const token = AuthService.generateToken(newUser);
  res.status(201).json({ user: newUser, token, message: 'Registration successful!' });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

  if (!user) {
    return next(new AppError('No account found with this email address', 401));
  }

  const isPasswordCorrect = await AuthService.comparePassword(password, user.passwordHash);
  if (!isPasswordCorrect) {
    return next(new AppError('Incorrect password. Please try again.', 401));
  }

  const token = AuthService.generateToken(user);
  res.status(200).json({ user, token, message: 'Login successful!' });
});

export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById((req as any).user.id).select('-passwordHash');
  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({ user });
});
