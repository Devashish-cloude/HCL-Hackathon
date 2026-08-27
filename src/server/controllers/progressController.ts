import { Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getProgressAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        focusTasks: true,
        userSkills: true,
        progress: true,
        assessments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const completedTasksCount = user.focusTasks.filter((t) => t.isCompleted).length;
    const completedLessonsCount = user.progress.filter((p) => p.isCompleted).length;
    const totalCompletedUnits = completedTasksCount + completedLessonsCount;

    const totalHours = user.totalHoursInvested > 0
      ? user.totalHoursInvested
      : totalCompletedUnits > 0
      ? Math.round((totalCompletedUnits * 0.4) * 10) / 10
      : 0;

    const skillsMastered = user.userSkills.filter(
      (s) => s.status === 'MASTERED' || s.proficiencyScore >= 80
    ).length + Math.floor(totalCompletedUnits / 2);

    // Dynamic Weekly Activity Rhythm
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayJsDay = new Date().getDay(); // 0 = Sun, 1 = Mon ...
    const todayIndex = todayJsDay === 0 ? 6 : todayJsDay - 1;

    const weekActivity = daysOfWeek.map((day, idx) => {
      const isToday = idx === todayIndex;
      const hasActivity = isToday && totalCompletedUnits > 0;
      return {
        day,
        isCompleted: hasActivity,
        isToday,
        minutes: hasActivity ? 45 : 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        totalHoursInvested: totalHours,
        learningStreak: user.learningStreak || 1,
        skillsMastered,
        weekActivity,
        assessmentHistory: user.assessments,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

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

    // Update study time in user profile
    const timeDelta = updatedTask.isCompleted ? 0.3 : -0.3;
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalHoursInvested: {
          increment: Math.max(0, timeDelta),
        },
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

    const existingProgress = await prisma.userProgress.findFirst({
      where: { userId, moduleId },
    });

    let progress;
    if (existingProgress) {
      progress = await prisma.userProgress.update({
        where: { id: existingProgress.id },
        data: {
          isCompleted,
          progressPercentage: isCompleted ? 100 : 50,
          lastAccessedAt: new Date(),
        },
      });
    } else {
      progress = await prisma.userProgress.create({
        data: {
          userId,
          moduleId,
          isCompleted,
          progressPercentage: isCompleted ? 100 : 50,
        },
      });
    }

    if (isCompleted) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalHoursInvested: {
            increment: 0.5,
          },
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
