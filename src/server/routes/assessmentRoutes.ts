import { Router } from 'express';
import {
  getAvailableAssessments,
  getAssessmentQuestions,
  submitAssessment,
  getAssessmentHistory,
} from '../controllers/assessmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/available', getAvailableAssessments);
router.get('/questions', getAssessmentQuestions);
router.post('/submit', authenticate, submitAssessment);
router.get('/history', authenticate, getAssessmentHistory);

export default router;
