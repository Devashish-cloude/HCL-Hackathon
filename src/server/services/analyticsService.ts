import { prisma } from './prismaClient.js';

export class AnalyticsService {
  public static async getUserMetrics(userId: string) {
    const [
      user,
      enrollments,
      completedLessons,
      completedTasks,
      learningSessions,
      assessments,
      userSkills,
      activities,
    ] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.courseEnrollment.findMany({ where: { userId } }),
      prisma.lessonProgress.findMany({ where: { userId, status: 'COMPLETED' } }),
      prisma.dailyFocusTask.findMany({ where: { userId, isCompleted: true } }),
      prisma.learningSession.findMany({ where: { userId } }),
      prisma.assessment.findMany({ where: { userId } }),
      prisma.userSkill.findMany({ where: { userId } }),
      prisma.userActivity.findMany({
        where: { userId },
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    if (!user) {
      throw new Error('User not found');
    }

    const coursesCompleted = enrollments.filter((e) => e.status === 'COMPLETED').length;
    const coursesInProgress = enrollments.filter((e) => e.status === 'IN_PROGRESS').length;
    const lessonsCompletedCount = completedLessons.length;

    // Calculate total learning time from LearningSessions
    const totalMinutes = learningSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10 || user.totalHoursInvested;

    // Calculate dynamic streak from distinct active days
    const activeDates = new Set(
      activities.map((a) => a.createdAt.toISOString().split('T')[0])
    );
    const todayStr = new Date().toISOString().split('T')[0];
    const hasActivityToday = activeDates.has(todayStr);

    let streak = 0;
    let checkDate = new Date();
    if (!hasActivityToday) {
      // Check if user was active yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (activeDates.has(checkDate.toISOString().split('T')[0])) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    const currentStreak = Math.max(streak, user.learningStreak || (activeDates.size > 0 ? 1 : 0));
    const longestStreak = Math.max(currentStreak, user.longestStreak || 1);

    // Mastered skills
    const skillsMastered = userSkills.filter(
      (s) => s.status === 'MASTERED' || s.proficiencyScore >= 80
    ).length;
    const skillsImproving = userSkills.filter(
      (s) => s.proficiencyScore < 80 && s.proficiencyScore > 0
    ).length;

    // Assessment averages
    const avgScore =
      assessments.length > 0
        ? Math.round(assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length)
        : 0;

    return {
      coursesCompleted,
      coursesInProgress,
      lessonsCompleted: lessonsCompletedCount,
      totalHours,
      totalMinutes,
      currentStreak,
      longestStreak,
      skillsMastered,
      skillsImproving,
      assessmentsCompleted: assessments.length,
      averageAssessmentScore: avgScore,
    };
  }

  public static async getWeeklyActivityRhythm(userId: string) {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const todayJsDay = today.getDay(); // 0 = Sun, 1 = Mon ...
    const todayIndex = todayJsDay === 0 ? 6 : todayJsDay - 1;

    // Fetch learning sessions from past 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const sessions = await prisma.learningSession.findMany({
      where: {
        userId,
        startedAt: { gte: sevenDaysAgo },
      },
    });

    const dayMinutesMap: Record<string, number> = {};
    sessions.forEach((s) => {
      const dateStr = s.startedAt.toISOString().split('T')[0];
      dayMinutesMap[dateStr] = (dayMinutesMap[dateStr] || 0) + s.durationMinutes;
    });

    return daysOfWeek.map((day, idx) => {
      const isToday = idx === todayIndex;
      const offset = idx - todayIndex;
      const d = new Date();
      d.setDate(today.getDate() + offset);
      const dStr = d.toISOString().split('T')[0];

      const mins = Math.round(dayMinutesMap[dStr] || (isToday ? 20 : 0));
      return {
        day,
        isCompleted: mins > 0,
        isToday,
        minutes: mins,
      };
    });
  }
}
