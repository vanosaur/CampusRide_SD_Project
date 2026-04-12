import { Router } from 'express';
import { register, verifyOTP, login, getMe } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { registerSchema, loginSchema, verifyOTPSchema } from '../validation/authValidation';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/verify-otp', validate(verifyOTPSchema), verifyOTP);
router.post('/login', validate(loginSchema), login);
router.get('/me', authMiddleware, getMe);

export default router;
