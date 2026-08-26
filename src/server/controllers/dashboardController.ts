import { Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        focusTasks: {
          orderBy: { order: 'asc' },
        },
        learningPaths: {
          include: {
            phases: {
              include: { modules: true },
              orderBy: { order: 'asc' },
            },
          },
        },
        userSkills: {
          include: { skill: true },
        },
        recommendations: {
          where: { isDismissed: false },
          include: { course: true },
          take: 1,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Active hero course info
    const activeHeroCourse = {
      title: 'JavaScript Async Programming',
      slug: 'js-async-programming',
      description: 'Master Promises, async/await, and event loops to handle complex data fetching an...',
      currentModuleTitle: 'Async / Await Mastery',
      currentModuleNumber: 3,
      totalModules: 5,
      progressPercentage: 65,
      timeRemainingMinutes: 42,
      tag: 'Continue Learning',
    };

    // Roadmap track overview for the visual progress tracker bar
    const activePath = user.learningPaths[0];
    const roadmapTrack = [
      { id: '1', title: 'JS Fundamentals', status: 'COMPLETED' },
      { id: '2', title: 'DOM Manipulation', status: 'COMPLETED' },
      { id: '3', title: 'Async Programming', status: 'IN_PROGRESS' },
      { id: '4', title: 'APIs', status: 'LOCKED' },
      { id: '5', title: 'React', status: 'LOCKED' },
    ];

    // Stats metrics
    const masteredSkillsCount = user.userSkills.filter((s) => s.status === 'MASTERED' || s.proficiencyScore >= 80).length || 12;

    const stats = {
      overallProgress: activePath?.totalProgress ?? 42,
      learningStreak: user.learningStreak ?? 14,
      skillsMastered: masteredSkillsCount,
      coursesCompleted: 3,
    };

    // Primary recommendation
    const recommendation = user.recommendations[0] || {
      id: 'default-rec',
      title: 'APIs & Fetch',
      reason: "Recommended because you're currently learning asynchronous JavaScript.",
      course: {
        id: 'apis-and-fetch',
        title: 'APIs & Fetch',
        slug: 'apis-and-fetch',
      },
    };

    return res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          headline: user.headline,
          targetRole: user.targetRole,
        },
        heroCourse: activeHeroCourse,
        todayFocus: user.focusTasks,
        roadmapTrack: {
          pathTitle: activePath?.title || 'Frontend Engineering Path',
          steps: roadmapTrack,
        },
        stats,
        recommendation,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
