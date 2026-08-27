import { Router } from 'express';
import { getProgressAnalytics, toggleFocusTask, updateLessonProgress } from '../controllers/progressController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getProgressAnalytics);
router.patch('/focus/:taskId/toggle', authenticate, toggleFocusTask);
router.post('/lesson', authenticate, updateLessonProgress);

export default router;
