import { Router } from 'express';
import { createRide, getRides, getMyRides, getRideById, joinRide, cancelRide, confirmRide, updateMemberStatus } from '../controllers/rideController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createRideSchema, updateMemberStatusSchema } from '../validation/rideValidation';

const router = Router();

router.use(authMiddleware);
router.get('/my', getMyRides);
router.post('/', validate(createRideSchema), createRide);
router.get('/', getRides);
router.get('/:id', getRideById);
router.post('/:id/join', joinRide);
router.put('/:id/confirm', confirmRide);
router.put('/:id/members', validate(updateMemberStatusSchema), updateMemberStatus);
router.put('/:id/cancel', cancelRide);

export default router;
