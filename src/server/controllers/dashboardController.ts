import { Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { AnalyticsService } from '../services/analyticsService.js';
import { ActivityService } from '../services/activityService.js';

interface HeroCourseConfig {
  title: string;
  slug: string;
  description: string;
  totalModules: number;
  estimatedMinutes: number;
  defaultModuleTitle: string;
}

const roleHeroMap: { [role: string]: HeroCourseConfig } = {
  'Full Stack Engineer': {
    title: 'Full Stack TypeScript Architecture',
    slug: 'fullstack-typescript',
    description: 'Master enterprise Full Stack architecture with TypeScript, React 18, Node.js, Express, PostgreSQL, Prisma, and Redis caching.',
    totalModules: 3,
    estimatedMinutes: 240,
    defaultModuleTitle: 'TypeScript Type System & Primitives',
  },
  'AI & Systems Engineer': {
    title: 'Python & Machine Learning Foundations',
    slug: 'python-ml-foundations',
    description: 'Master linear algebra, PyTorch tensors, neural network backpropagation, and transformer attention mechanisms from primitives to GPU acceleration.',
    totalModules: 2,
    estimatedMinutes: 240,
    defaultModuleTitle: 'Linear Algebra & Tensor Operations',
  },
  'Backend Engineer': {
    title: 'Node.js & Express REST APIs',
    slug: 'nodejs-express-apis',
    description: 'Build enterprise backend services, secure authentication pipelines, PostgreSQL query optimization, and connection pooling.',
    totalModules: 2,
    estimatedMinutes: 180,
    defaultModuleTitle: 'Express Request Pipeline & Middleware',
  },
  'Frontend Engineer': {
    title: 'React Fundamentals & Component Architecture',
    slug: 'react-fundamentals',
    description: 'Deep dive into React 18 component models, custom hooks, state synchronization, and Tailwind responsive design systems.',
    totalModules: 2,
    estimatedMinutes: 180,
    defaultModuleTitle: 'Component Architecture & Props Flow',
  },
};

const defaultFocusTasksByRole: { [role: string]: { title: string; typeLabel: string; durationMinutes: number }[] } = {
  'Full Stack Engineer': [
    { title: 'Complete TypeScript Generics Challenge', typeLabel: 'Coding Challenge', durationMinutes: 20 },
    { title: 'Review Zod Runtime Schema Validation', typeLabel: 'Reading', durationMinutes: 15 },
    { title: 'Practice PostgreSQL Connection Pooling', typeLabel: 'Exercise', durationMinutes: 15 },
  ],
  'AI & Systems Engineer': [
    { title: 'Implement PyTorch Tensor Reshaping Challenge', typeLabel: 'Coding Challenge', durationMinutes: 20 },
    { title: 'Review Autograd Backpropagation Graph', typeLabel: 'Reading', durationMinutes: 15 },
    { title: 'Build Multi-Layer Perceptron Forward Pass', typeLabel: 'Coding Challenge', durationMinutes: 25 },
  ],
  'Backend Engineer': [
    { title: 'Implement Express Auth Middleware Challenge', typeLabel: 'Coding Challenge', durationMinutes: 20 },
    { title: 'Review REST API Status Codes & Error Formatting', typeLabel: 'Reading', durationMinutes: 10 },
    { title: 'Design Database Indexes & Connection Pools', typeLabel: 'System Design', durationMinutes: 15 },
  ],
  'Frontend Engineer': [
    { title: 'Complete Async/Await lesson', typeLabel: 'Video & Quiz', durationMinutes: 15 },
    { title: 'Practice 5 JavaScript questions', typeLabel: 'Coding Challenge', durationMinutes: 20 },
    { title: 'Review Promises & Event Loop', typeLabel: 'Reading', durationMinutes: 10 },
  ],
};

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        focusTasks: { orderBy: { order: 'asc' } },
        learningPaths: {
          include: {
            phases: {
              include: { modules: true },
              orderBy: { order: 'asc' },
            },
          },
        },
        userSkills: { include: { skill: true } },
        enrollments: { include: { course: true } },
        skillGaps: { where: { status: 'OPEN' } },
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

    // Auto-seed daily focus tasks if none exist for user
    if (user.focusTasks.length === 0) {
      const template = defaultFocusTasksByRole[user.targetRole] || defaultFocusTasksByRole['Full Stack Engineer'];
      const todayStr = new Date().toISOString().split('T')[0];

      await prisma.dailyFocusTask.createMany({
        data: template.map((task, idx) => ({
          userId,
          title: task.title,
          typeLabel: task.typeLabel,
          durationMinutes: task.durationMinutes,
          isCompleted: false,
          order: idx + 1,
          scheduledDate: todayStr,
        })),
      });

      user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          focusTasks: { orderBy: { order: 'asc' } },
          learningPaths: {
            include: {
              phases: {
                include: { modules: true },
                orderBy: { order: 'asc' },
              },
            },
          },
          userSkills: { include: { skill: true } },
          enrollments: { include: { course: true } },
          skillGaps: { where: { status: 'OPEN' } },
          recommendations: {
            where: { isDismissed: false },
            include: { course: true },
            take: 1,
          },
        },
      });
    }

    // Dynamic metrics from PostgreSQL analytics service
    const metrics = await AnalyticsService.getUserMetrics(userId);
    const recentActivities = await ActivityService.getRecentActivities(userId, 5);

    const completedTasksCount = user!.focusTasks.filter((t) => t.isCompleted).length;
    const heroConfig = roleHeroMap[user!.targetRole] || roleHeroMap['Full Stack Engineer'];

    // Find active enrollment if any
    const activeEnrollment = user!.enrollments.find((e) => e.course.slug === heroConfig.slug);
    const heroProgress = activeEnrollment ? activeEnrollment.progressPercentage : Math.min(100, Math.round(completedTasksCount * 33));
    const currentModuleNumber = heroProgress >= 66 ? 3 : heroProgress >= 33 ? 2 : 1;
    const timeRemaining = Math.max(15, heroConfig.estimatedMinutes - Math.round(heroProgress * 1.8));

    const activeHeroCourse = {
      title: heroConfig.title,
      slug: heroConfig.slug,
      description: heroConfig.description,
      currentModuleTitle: heroConfig.defaultModuleTitle,
      currentModuleNumber,
      totalModules: heroConfig.totalModules,
      progressPercentage: heroProgress,
      timeRemainingMinutes: timeRemaining,
      tag: heroProgress > 0 ? 'Continue Learning' : 'Start Learning',
    };

    // Calculate dynamic Roadmap Steps
    const activePath = user!.learningPaths[0];
    const totalCompletedUnits = completedTasksCount + metrics.lessonsCompleted;
    const roadmapSteps = [
      { id: '1', title: '1. Foundation', status: totalCompletedUnits >= 1 ? 'COMPLETED' : 'IN_PROGRESS' },
      { id: '2', title: `2. ${user!.targetRole.split(' ')[0]} Core`, status: totalCompletedUnits >= 2 ? 'COMPLETED' : totalCompletedUnits >= 1 ? 'IN_PROGRESS' : 'LOCKED' },
      { id: '3', title: '3. Architecture', status: totalCompletedUnits >= 4 ? 'COMPLETED' : totalCompletedUnits >= 2 ? 'IN_PROGRESS' : 'LOCKED' },
      { id: '4', title: '4. Capstone System', status: totalCompletedUnits >= 6 ? 'COMPLETED' : 'LOCKED' },
    ];

    const stats = {
      overallProgress: Math.min(100, Math.round(totalCompletedUnits * 20)),
      learningStreak: metrics.currentStreak,
      longestStreak: metrics.longestStreak,
      skillsMastered: metrics.skillsMastered || Math.floor(totalCompletedUnits / 2),
      coursesCompleted: metrics.coursesCompleted,
      lessonsCompleted: metrics.lessonsCompleted,
      totalHours: metrics.totalHours,
    };

    // "What Should I Do Next?" Dynamic Recommendation
    const openGap = user!.skillGaps[0];
    const defaultRec = {
      id: `rec-${heroConfig.slug}`,
      title: openGap ? `Strengthen ${openGap.skillName}` : heroConfig.title,
      reason: openGap
        ? `Target priority skill gap identified in ${openGap.skillName} (${openGap.currentScore}% vs ${openGap.targetScore}% target).`
        : totalCompletedUnits === 0
        ? `Start your baseline curriculum for ${user!.targetRole} to calibrate your skill graph.`
        : `Continue where you left off in Module ${currentModuleNumber} to solidify key architectural patterns.`,
      course: {
        id: openGap?.recommendedCourseId || heroConfig.slug,
        title: openGap?.recommendedCourseTitle || heroConfig.title,
        slug: openGap?.recommendedCourseId || heroConfig.slug,
      },
    };

    const recommendation = user!.recommendations[0] || defaultRec;

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user!.id,
          name: user!.name,
          headline: user!.headline,
          targetRole: user!.targetRole,
        },
        heroCourse: activeHeroCourse,
        todayFocus: user!.focusTasks,
        roadmapTrack: {
          pathTitle: activePath?.title || `${user!.targetRole} Path`,
          steps: roadmapSteps,
        },
        stats,
        recommendation,
        recentActivities: recentActivities.all,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
