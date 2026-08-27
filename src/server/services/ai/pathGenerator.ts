import { prisma } from '../prismaClient.js';
import { ActivityService } from '../activityService.js';

export class PathGenerator {
  public static async generatePersonalizedPath(
    userId: string,
    targetRole: string,
    experienceLevel: string,
    goalDescription?: string
  ) {
    // Delete existing learning path if regenerating
    await prisma.learningPath.deleteMany({
      where: { userId },
    });

    const isAdvanced = experienceLevel.toLowerCase() === 'advanced';
    const isBeginner = experienceLevel.toLowerCase() === 'beginner';

    const pathTitle = `${targetRole} Path`;

    const learningPath = await prisma.learningPath.create({
      data: {
        userId,
        title: pathTitle,
        description: `Your customized AI-curated curriculum tailored to ${experienceLevel} level for mastering ${targetRole}.`,
        targetRole,
        totalProgress: isAdvanced ? 35 : isBeginner ? 10 : 25,
        totalHoursEstimated: isAdvanced ? 60 : 90,
        totalHoursInvested: 0,
        currentFocus: 'Core Foundations',
        currentPhaseIndex: 1,
        phases: {
          create: [
            {
              phaseNumber: 1,
              title: 'Foundation & Principles',
              description: 'Language semantics, design patterns, and foundational concepts.',
              estimatedHours: 20,
              status: 'IN_PROGRESS',
              iconType: 'academic',
              order: 1,
              modules: {
                create: [
                  {
                    title: 'Core Fundamentals',
                    summary: 'Variables, Scope, Types, and Control Flow.',
                    isCurrent: true,
                    status: 'IN_PROGRESS',
                    progressPercentage: 20,
                    order: 1,
                  },
                ],
              },
            },
            {
              phaseNumber: 2,
              title: 'Core Domain Specialization',
              description: `In-depth hands-on skills tailored for ${targetRole}.`,
              estimatedHours: 35,
              status: 'LOCKED',
              iconType: 'book',
              order: 2,
              modules: {
                create: [
                  {
                    title: `${targetRole} Architecture`,
                    summary: 'Component breakdown, state management, and real-time APIs.',
                    isCurrent: false,
                    status: 'LOCKED',
                    progressPercentage: 0,
                    order: 1,
                  },
                ],
              },
            },
            {
              phaseNumber: 3,
              title: 'Production Engineering & Scale',
              description: 'Optimization, security, caching, CI/CD, and monitoring.',
              estimatedHours: 25,
              status: 'LOCKED',
              iconType: 'lock',
              order: 3,
              modules: {
                create: [
                  {
                    title: 'Performance & Security',
                    summary: 'Profiling, memory management, and vulnerability hardening.',
                    isCurrent: false,
                    status: 'LOCKED',
                    progressPercentage: 0,
                    order: 1,
                  },
                ],
              },
            },
            {
              phaseNumber: 4,
              title: 'Capstone Industry Project',
              description: 'Synthesize architecture into an end-to-end deployed capstone.',
              estimatedHours: 20,
              status: 'LOCKED',
              iconType: 'trophy',
              order: 4,
              modules: {
                create: [
                  {
                    title: 'Production Capstone System',
                    summary: 'Deploy, test, and document an enterprise portfolio application.',
                    isCurrent: false,
                    status: 'LOCKED',
                    progressPercentage: 0,
                    order: 1,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        phases: {
          include: { modules: true },
        },
      },
    });

    await ActivityService.logActivity({
      userId,
      activityType: 'LEARNING_PATH_CREATED',
      entityType: 'User',
      entityId: learningPath.id,
      metadata: { targetRole, pathTitle, experienceLevel },
    });

    return learningPath;
  }
}
