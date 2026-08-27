import { Router } from 'express';
import { getActivities, getRecentActivities } from '../controllers/activityController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getActivities);
router.get('/recent', authenticate, getRecentActivities);

export default router;
