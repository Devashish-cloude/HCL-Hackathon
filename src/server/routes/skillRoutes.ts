import { Router } from 'express';
import { getSkillAnalysis, getSkillHistory, getSkillGaps } from '../controllers/skillController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getSkillAnalysis);
router.get('/history', authenticate, getSkillHistory);
router.get('/gaps', authenticate, getSkillGaps);

export default router;
