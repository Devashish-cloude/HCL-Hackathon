import { Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { RecommendationEngine } from '../services/ai/recommendationEngine.js';

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const recommendations = await RecommendationEngine.generateRecommendationsForUser(userId);

    return res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const dismissRecommendation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    await prisma.recommendation.updateMany({
      where: { id, userId },
      data: { isDismissed: true },
    });

    return res.status(200).json({
      success: true,
      message: 'Recommendation dismissed.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
