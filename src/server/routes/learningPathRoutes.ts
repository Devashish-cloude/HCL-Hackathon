import { Router } from 'express';
import { getLearningPath, regeneratePath } from '../controllers/learningPathController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getLearningPath);
router.post('/generate', authenticate, regeneratePath);

export default router;
