import { Router } from 'express';
import { listCourses, getCourseDetails } from '../controllers/courseController.js';

const router = Router();

router.get('/', listCourses);
router.get('/:slug', getCourseDetails);

export default router;
