import { Router } from 'express';
import { getRecommendations, dismissRecommendation } from '../controllers/recommendationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getRecommendations);
router.post('/:id/dismiss', authenticate, dismissRecommendation);

export default router;
