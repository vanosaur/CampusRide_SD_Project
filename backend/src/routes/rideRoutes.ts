import { Router } from 'express';
import {
  createRide,
  getRides,
  getMyRides,
  getRideById,
  joinRide,
  cancelRide,
  confirmRide,
  updateMemberStatus,
} from '../controllers/rideController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import {
  createRideSchema,
  updateMemberStatusSchema,
  rideIdParamSchema,
  getRidesQuerySchema,
} from '../validation/rideValidation';

const router = Router();

// All ride routes require a valid JWT
router.use(authMiddleware);

// ─── Collection routes ───────────────────────────────────────────────────────
router.get('/my', getMyRides);
router.get('/', validate(getRidesQuerySchema), getRides);
router.post('/', validate(createRideSchema), createRide);

// ─── Single-ride routes ──────────────────────────────────────────────────────
router.get('/:id',         validate(rideIdParamSchema), getRideById);
router.post('/:id/join',   validate(rideIdParamSchema), joinRide);
router.put('/:id/confirm', validate(rideIdParamSchema), confirmRide);
router.put('/:id/cancel',  validate(rideIdParamSchema), cancelRide);
router.put('/:id/members', validate(updateMemberStatusSchema), updateMemberStatus);

export default router;
