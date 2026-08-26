import { Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { PathGenerator } from '../services/ai/pathGenerator.js';

export const getLearningPath = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let learningPath = await prisma.learningPath.findFirst({
      where: { userId },
      include: {
        phases: {
          include: {
            modules: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!learningPath) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      learningPath = await PathGenerator.generatePersonalizedPath(
        userId,
        user?.targetRole || 'Frontend Engineer',
        user?.experienceLevel || 'Intermediate'
      );
    }

    const estimatedRemainingHours = Math.max(
      0,
      learningPath.totalHoursEstimated - Math.round(learningPath.totalHoursInvested)
    );

    return res.status(200).json({
      success: true,
      data: {
        id: learningPath.id,
        title: learningPath.title,
        description: learningPath.description,
        targetRole: learningPath.targetRole,
        stats: {
          overallProgress: learningPath.totalProgress,
          timeInvestedHours: learningPath.totalHoursInvested,
          estimatedRemainingHours: estimatedRemainingHours || 52,
          currentFocus: learningPath.currentFocus,
        },
        phases: learningPath.phases,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const regeneratePath = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { targetRole, experienceLevel, goalDescription } = req.body;

    const newPath = await PathGenerator.generatePersonalizedPath(
      userId,
      targetRole || 'Full Stack Engineer',
      experienceLevel || 'Intermediate',
      goalDescription
    );

    return res.status(200).json({
      success: true,
      message: 'Learning path generated successfully.',
      data: newPath,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
