import { Router } from 'express';
import { updateProfile, updatePhoto } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { updateProfileSchema, updatePhotoSchema } from '../validation/userValidation';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

/**
 * PUT /api/users/profile
 * Update current user's name, phone, and/or gender.
 * Body: { name?, phone?, gender? }  (at least one required)
 */
router.put('/profile', validate(updateProfileSchema), updateProfile);

/**
 * PUT /api/users/photo
 * Update current user's profile photo URL.
 * Body: { profilePhoto: "https://..." }
 */
router.put('/photo', validate(updatePhotoSchema), updatePhoto);

export default router;
