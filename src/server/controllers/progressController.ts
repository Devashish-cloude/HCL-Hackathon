import { Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { AnalyticsService } from '../services/analyticsService.js';
import { ActivityService } from '../services/activityService.js';

export const getProgressAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const [user, metrics, weekActivity, assessments, recentActivities] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      AnalyticsService.getUserMetrics(userId),
      AnalyticsService.getWeeklyActivityRhythm(userId),
      prisma.assessment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      ActivityService.getRecentActivities(userId, 10),
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        totalHoursInvested: metrics.totalHours,
        learningStreak: metrics.currentStreak,
        longestStreak: metrics.longestStreak,
        skillsMastered: metrics.skillsMastered,
        coursesCompleted: metrics.coursesCompleted,
        lessonsCompleted: metrics.lessonsCompleted,
        weekActivity,
        assessmentHistory: assessments,
        recentActivities: recentActivities.all,
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

    const isNowCompleted = !task.isCompleted;
    const updatedTask = await prisma.dailyFocusTask.update({
      where: { id: taskId },
      data: {
        isCompleted: isNowCompleted,
        completedAt: isNowCompleted ? new Date() : null,
      },
    });

    if (isNowCompleted) {
      // Record LearningSession
      await prisma.learningSession.create({
        data: {
          userId: userId!,
          durationMinutes: task.durationMinutes || 15,
          activityType: 'DAILY_FOCUS_TASK',
          startedAt: new Date(Date.now() - (task.durationMinutes || 15) * 60000),
          endedAt: new Date(),
        },
      });

      // Update user total hours
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalHoursInvested: { increment: (task.durationMinutes || 15) / 60 },
          lastActiveAt: new Date(),
        },
      });

      // Log activity
      await ActivityService.logActivity({
        userId: userId!,
        activityType: 'DAILY_TASK_COMPLETED',
        entityType: 'DailyTask',
        entityId: task.id,
        metadata: { taskTitle: task.title, durationMinutes: task.durationMinutes },
      });
    }

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

    const { moduleId, isCompleted = true, courseSlug } = req.body;

    // Find module and related course
    const moduleItem = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true, lessons: true },
    });

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
      // Record LearningSession in database
      await prisma.learningSession.create({
        data: {
          userId,
          courseId: moduleItem?.courseId,
          durationMinutes: 20,
          activityType: 'LESSON_STUDY',
          startedAt: new Date(Date.now() - 20 * 60000),
          endedAt: new Date(),
        },
      });

      // Update CourseEnrollment
      if (moduleItem?.courseId) {
        await prisma.courseEnrollment.upsert({
          where: {
            userId_courseId: {
              userId,
              courseId: moduleItem.courseId,
            },
          },
          update: {
            status: 'IN_PROGRESS',
            progressPercentage: 65,
            lastAccessedAt: new Date(),
          },
          create: {
            userId,
            courseId: moduleItem.courseId,
            status: 'IN_PROGRESS',
            progressPercentage: 35,
            startedAt: new Date(),
          },
        });
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          totalHoursInvested: { increment: 0.35 },
          lastActiveAt: new Date(),
        },
      });

      // Log LESSON_COMPLETED & MODULE_COMPLETED activities
      await ActivityService.logActivity({
        userId,
        activityType: 'LESSON_COMPLETED',
        entityType: 'Module',
        entityId: moduleId,
        metadata: {
          moduleTitle: moduleItem?.title || 'Interactive Lesson',
          courseTitle: moduleItem?.course?.title || 'Course',
          timeSpent: 20,
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
