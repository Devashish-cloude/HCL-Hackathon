import { Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const toggleFocusTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { taskId } = req.params;

    const task = await prisma.dailyFocusTask.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Focus task not found.' });
    }

    const updatedTask = await prisma.dailyFocusTask.update({
      where: { id: taskId },
      data: {
        isCompleted: !task.isCompleted,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLessonProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { moduleId, isCompleted = true } = req.body;

    const progress = await prisma.userProgress.upsert({
      where: {
        id: `${userId}-${moduleId}`,
      },
      update: {
        isCompleted,
        progressPercentage: isCompleted ? 100 : 50,
        lastAccessedAt: new Date(),
      },
      create: {
        id: `${userId}-${moduleId}`,
        userId,
        moduleId,
        isCompleted,
        progressPercentage: isCompleted ? 100 : 50,
      },
    });

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
