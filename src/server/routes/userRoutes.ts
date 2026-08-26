import { Router } from 'express';
import { getPreferences, updatePreferences, updateProfile } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/preferences', authenticate, getPreferences);
router.put('/preferences', authenticate, updatePreferences);
router.put('/profile', authenticate, updateProfile);

export default router;
