import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { ActivityService } from '../services/activityService.js';
import { prisma } from '../services/prismaClient.js';

export const getActivities = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      prisma.userActivity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.userActivity.count({ where: { userId } }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        activities,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecentActivities = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const recent = await ActivityService.getRecentActivities(userId, 10);

    return res.status(200).json({
      success: true,
      data: recent,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
