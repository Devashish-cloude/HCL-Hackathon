import { Router } from 'express';
import {
  listConversations,
  getConversation,
  createConversation,
  deleteConversation,
} from '../controllers/conversationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, listConversations);
router.get('/:id', authenticate, getConversation);
router.post('/', authenticate, createConversation);
router.delete('/:id', authenticate, deleteConversation);

export default router;
