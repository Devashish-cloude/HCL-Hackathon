import { Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { ActivityService } from '../services/activityService.js';

export const getPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        theme: true,
        targetRole: true,
        experienceLevel: true,
        dailyGoalMinutes: true,
        onboardingCompleted: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      preferences: user,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePreferences = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { theme, targetRole, experienceLevel, dailyGoalMinutes } = req.body;

    const previousUser = await prisma.user.findUnique({ where: { id: userId }, select: { theme: true } });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(theme && { theme }),
        ...(targetRole && { targetRole }),
        ...(experienceLevel && { experienceLevel }),
        ...(dailyGoalMinutes !== undefined && { dailyGoalMinutes: Number(dailyGoalMinutes) }),
        lastActiveAt: new Date(),
      },
      select: {
        id: true,
        theme: true,
        targetRole: true,
        experienceLevel: true,
        dailyGoalMinutes: true,
      },
    });

    if (theme && previousUser?.theme !== theme) {
      await ActivityService.logActivity({
        userId,
        activityType: 'THEME_CHANGED',
        entityType: 'User',
        entityId: userId,
        metadata: { from: previousUser?.theme, to: theme },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Preferences updated successfully.',
      preferences: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { name, headline, bio, avatarUrl, targetRole, experienceLevel, onboardingCompleted } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(headline && { headline }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(targetRole && { targetRole }),
        ...(experienceLevel && { experienceLevel }),
        ...(onboardingCompleted !== undefined && { onboardingCompleted }),
        lastActiveAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        headline: true,
        bio: true,
        avatarUrl: true,
        targetRole: true,
        experienceLevel: true,
        theme: true,
        onboardingCompleted: true,
      },
    });

    await ActivityService.logActivity({
      userId,
      activityType: 'PROFILE_UPDATED',
      entityType: 'User',
      entityId: userId,
      metadata: { targetRole: updatedUser.targetRole, headline: updatedUser.headline },
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
