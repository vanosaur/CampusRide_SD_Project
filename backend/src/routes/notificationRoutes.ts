import { Router } from 'express';
import { getNotifications, markAllRead } from '../controllers/notificationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getNotifications);
router.put('/mark-read', markAllRead);

export default router;
