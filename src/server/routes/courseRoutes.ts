import { Router } from 'express';
import { listCourses, getCourseDetails, enrollCourse } from '../controllers/courseController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listCourses);
router.get('/:slug', authenticate, getCourseDetails);
router.post('/:id/enroll', authenticate, enrollCourse);

export default router;
