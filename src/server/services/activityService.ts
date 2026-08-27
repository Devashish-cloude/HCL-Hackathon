import { prisma } from './prismaClient.js';

export interface LogActivityParams {
  userId: string;
  activityType:
    | 'LOGIN'
    | 'LOGOUT'
    | 'SIGNUP'
    | 'PROFILE_UPDATED'
    | 'THEME_CHANGED'
    | 'COURSE_STARTED'
    | 'COURSE_COMPLETED'
    | 'MODULE_STARTED'
    | 'MODULE_COMPLETED'
    | 'LESSON_STARTED'
    | 'LESSON_COMPLETED'
    | 'QUIZ_STARTED'
    | 'QUIZ_COMPLETED'
    | 'ASSESSMENT_STARTED'
    | 'ASSESSMENT_COMPLETED'
    | 'AI_CHAT_STARTED'
    | 'AI_MESSAGE_SENT'
    | 'LEARNING_PATH_CREATED'
    | 'LEARNING_PATH_UPDATED'
    | 'RECOMMENDATION_VIEWED'
    | 'RECOMMENDATION_ACCEPTED'
    | 'DAILY_TASK_COMPLETED';
  entityType?: 'Course' | 'Lesson' | 'Module' | 'Assessment' | 'DailyTask' | 'Conversation' | 'User' | 'Recommendation';
  entityId?: string;
  metadata?: Record<string, any>;
}

export class ActivityService {
  public static async logActivity(params: LogActivityParams) {
    try {
      const { userId, activityType, entityType, entityId, metadata } = params;

      const activity = await prisma.userActivity.create({
        data: {
          userId,
          activityType,
          entityType,
          entityId,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });

      // Update user lastActiveAt
      await prisma.user.update({
        where: { id: userId },
        data: { lastActiveAt: new Date() },
      }).catch(() => {});

      return activity;
    } catch (err) {
      console.error('Failed to log activity:', err);
      return null;
    }
  }

  public static async getRecentActivities(userId: string, limit = 10) {
    const activities = await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const formatted = activities.map((act) => {
      let parsedMeta: any = {};
      try {
        if (act.metadata) parsedMeta = JSON.parse(act.metadata);
      } catch (e) {}

      let displayTitle = act.activityType.replace(/_/g, ' ');
      if (act.activityType === 'LESSON_COMPLETED' && parsedMeta.lessonTitle) {
        displayTitle = `Completed ${parsedMeta.lessonTitle}`;
      } else if (act.activityType === 'DAILY_TASK_COMPLETED' && parsedMeta.taskTitle) {
        displayTitle = `Completed focus task: ${parsedMeta.taskTitle}`;
      } else if (act.activityType === 'ASSESSMENT_COMPLETED') {
        displayTitle = `Completed assessment with ${parsedMeta.score ?? 80}%`;
      } else if (act.activityType === 'COURSE_STARTED' && parsedMeta.courseTitle) {
        displayTitle = `Enrolled in ${parsedMeta.courseTitle}`;
      } else if (act.activityType === 'THEME_CHANGED') {
        displayTitle = `Switched theme to ${parsedMeta.theme || 'dark'}`;
      }

      const actDateStr = act.createdAt.toISOString().split('T')[0];
      let timeGroup: 'TODAY' | 'YESTERDAY' | 'PREVIOUS' = 'PREVIOUS';
      if (actDateStr === todayStr) timeGroup = 'TODAY';
      else if (actDateStr === yesterdayStr) timeGroup = 'YESTERDAY';

      return {
        id: act.id,
        activityType: act.activityType,
        entityType: act.entityType,
        entityId: act.entityId,
        title: displayTitle,
        metadata: parsedMeta,
        timeGroup,
        createdAt: act.createdAt,
      };
    });

    return {
      all: formatted,
      grouped: {
        TODAY: formatted.filter((a) => a.timeGroup === 'TODAY'),
        YESTERDAY: formatted.filter((a) => a.timeGroup === 'YESTERDAY'),
        PREVIOUS: formatted.filter((a) => a.timeGroup === 'PREVIOUS'),
      },
    };
  }
}
