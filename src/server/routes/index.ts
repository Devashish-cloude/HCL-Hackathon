import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import learningPathRoutes from './learningPathRoutes.js';
import courseRoutes from './courseRoutes.js';
import progressRoutes from './progressRoutes.js';
import skillRoutes from './skillRoutes.js';
import assessmentRoutes from './assessmentRoutes.js';
import recommendationRoutes from './recommendationRoutes.js';
import conversationRoutes from './conversationRoutes.js';
import aiChatRoutes from './aiChatRoutes.js';
import activityRoutes from './activityRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/learning-path', learningPathRoutes);
apiRouter.use('/courses', courseRoutes);
apiRouter.use('/progress', progressRoutes);
apiRouter.use('/skills', skillRoutes);
apiRouter.use('/assessments', assessmentRoutes);
apiRouter.use('/recommendations', recommendationRoutes);
apiRouter.use('/conversations', conversationRoutes);
apiRouter.use('/ai/chat', aiChatRoutes);
apiRouter.use('/activity', activityRoutes);
apiRouter.use('/notifications', notificationRoutes);

// Health check route
apiRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default apiRouter;
