import { Router } from 'express';
import { getMessages, sendMessage, pinMessage } from '../controllers/chatController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/:rideId/messages', getMessages);
router.post('/:rideId/messages', sendMessage);
router.put('/messages/:messageId/pin', pinMessage);

export default router;
