import { Router } from 'express';
import { sendChatMessage } from '../controllers/aiChatController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authenticate, sendChatMessage);

export default router;
