import api from './api.js';
import { DashboardData, User } from '../types/index.js';
import { getRoleCurriculum } from '../lib/roleCurricula.js';
import { userProgressStore } from './userProgressStore.js';

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('learnpath_user_data');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

const devashishSeededData: DashboardData = {
  user: {
    name: 'Devashish',
    headline: 'Professional Learner',
    targetRole: 'Frontend Engineer',
  },
  heroCourse: {
    title: 'JavaScript Async Programming',
    slug: 'js-async-programming',
    description: 'Master Promises, async/await, and event loops to handle complex data fetching and asynchronous streaming...',
    currentModuleTitle: 'Async / Await Mastery',
    currentModuleNumber: 3,
    totalModules: 5,
    progressPercentage: 65,
    timeRemainingMinutes: 42,
    tag: 'Continue Learning',
  },
  todayFocus: [
    {
      id: 'task-1',
      title: 'Complete Async/Await lesson',
      typeLabel: 'Video & Quiz',
      durationMinutes: 15,
      isCompleted: true,
      order: 1,
    },
    {
      id: 'task-2',
      title: 'Practice 5 JavaScript questions',
      typeLabel: 'Coding Challenge',
      durationMinutes: 20,
      isCompleted: true,
      order: 2,
    },
    {
      id: 'task-3',
      title: 'Review Promises',
      typeLabel: 'Reading',
      durationMinutes: 7,
      isCompleted: false,
      order: 3,
    },
  ],
  roadmapTrack: {
    pathTitle: 'Frontend Engineering Path',
    steps: [
      { id: '1', title: 'JS Fundamentals', status: 'COMPLETED' },
      { id: '2', title: 'DOM Manipulation', status: 'COMPLETED' },
      { id: '3', title: 'Async Programming', status: 'IN_PROGRESS' },
      { id: '4', title: 'APIs', status: 'LOCKED' },
      { id: '5', title: 'React', status: 'LOCKED' },
    ],
  },
  stats: {
    overallProgress: 42,
    learningStreak: 14,
    skillsMastered: 12,
    coursesCompleted: 3,
  },
  recommendation: {
    id: 'rec-1',
    title: 'APIs & Fetch',
    reason: "Recommended because you're currently learning asynchronous JavaScript.",
    course: {
      id: 'apis-and-fetch',
      title: 'APIs & Fetch',
      slug: 'apis-and-fetch',
    },
  },
};

function createRoleSpecificUserDashboard(user: User): DashboardData {
  const config = getRoleCurriculum(user.targetRole);
  const progress = userProgressStore.getProgress(user.id);

  // Map today's focus with persistent completed state
  const updatedFocus = config.todayFocus.map((task) => ({
    ...task,
    isCompleted: progress.completedFocusTaskIds.includes(task.id),
  }));

  const completedFocusCount = updatedFocus.filter((t) => t.isCompleted).length;
  const totalFocusCount = updatedFocus.length || 3;
  const completedLessonsCount = progress.completedLessonKeys.length;

  // Dynamic hero calculation
  let heroProgress = 0;
  let currentModNumber = config.heroCourse.currentModuleNumber;
  let currentModTitle = config.heroCourse.currentModuleTitle;
  let heroTag: 'Start Learning' | 'Continue Learning' = 'Start Learning';

  if (completedFocusCount > 0 || completedLessonsCount > 0) {
    heroTag = 'Continue Learning';
    
    // Focus tasks contribution (up to 60%) + Lessons contribution (up to 40%)
    const focusPct = Math.round((completedFocusCount / totalFocusCount) * 60);
    const lessonPct = Math.min(40, completedLessonsCount * 20);
    heroProgress = Math.min(100, focusPct + lessonPct);

    if (heroProgress >= 100) {
      currentModNumber = Math.min(config.heroCourse.totalModules, 2);
      currentModTitle = config.learningPhases[0]?.modules[1]?.title || 'Advanced Architectural Patterns';
    }
  }

  // Calculate dynamic roadmap steps
  const updatedRoadmapSteps = config.roadmapSteps.map((step, idx) => {
    if (idx === 0) {
      // Step 1 is completed if all focus tasks or 2+ lessons done
      if (completedFocusCount === totalFocusCount || completedLessonsCount >= 2 || heroProgress >= 70) {
        return { ...step, status: 'COMPLETED' as const };
      }
      return { ...step, status: 'IN_PROGRESS' as const };
    }

    if (idx === 1) {
      // Step 2 unlocks when Step 1 is completed
      if (completedFocusCount === totalFocusCount || completedLessonsCount >= 2 || heroProgress >= 70) {
        if (completedLessonsCount >= 4) {
          return { ...step, status: 'COMPLETED' as const };
        }
        return { ...step, status: 'IN_PROGRESS' as const };
      }
      return { ...step, status: 'LOCKED' as const };
    }

    return { ...step, status: 'LOCKED' as const };
  });

  // Calculate overall stats dynamically
  const dynamicOverallProgress = Math.min(
    100,
    Math.round(
      (completedFocusCount / totalFocusCount) * 30 +
      completedLessonsCount * 15
    )
  );

  const dynamicSkillsMastered = completedFocusCount + completedLessonsCount;
  const dynamicStreak = completedFocusCount > 0 || completedLessonsCount > 0 ? 2 : 1;
  const dynamicCoursesCompleted = heroProgress >= 100 ? 1 : 0;
  const remainingMinutes = Math.max(
    15,
    config.heroCourse.estimatedMinutes - (completedFocusCount * 20 + completedLessonsCount * 30)
  );

  return {
    user: {
      name: user.name,
      headline: user.headline || `${config.roleName} in Training`,
      targetRole: config.roleName,
    },
    heroCourse: {
      title: config.heroCourse.title,
      slug: config.heroCourse.slug,
      description: config.heroCourse.description,
      currentModuleTitle: currentModTitle,
      currentModuleNumber: currentModNumber,
      totalModules: config.heroCourse.totalModules,
      progressPercentage: heroProgress,
      timeRemainingMinutes: remainingMinutes,
      tag: heroTag,
    },
    todayFocus: updatedFocus,
    roadmapTrack: {
      pathTitle: `${config.roleName} Path`,
      steps: updatedRoadmapSteps,
    },
    stats: {
      overallProgress: dynamicOverallProgress,
      learningStreak: dynamicStreak,
      skillsMastered: dynamicSkillsMastered,
      coursesCompleted: dynamicCoursesCompleted,
    },
    recommendation: {
      id: `rec-${config.recommendation.slug}`,
      title: config.recommendation.title,
      reason: config.recommendation.reason,
      course: {
        id: config.recommendation.slug,
        title: config.recommendation.title,
        slug: config.recommendation.slug,
      },
    },
  };
}

export const dashboardService = {
  async getDashboardData(): Promise<{ success: boolean; data: DashboardData }> {
    const currentUser = getStoredUser();
    const isDevashish =
      currentUser &&
      (currentUser.email.toLowerCase().includes('devashish') ||
        currentUser.name.toLowerCase() === 'devashish');

    try {
      const res = await api.get<{ success: boolean; data: DashboardData }>('/dashboard');
      if (res.data && res.data.success && res.data.data) {
        if (currentUser && res.data.data.user) {
          res.data.data.user.name = currentUser.name;
        }
        return res.data;
      }
      const data = isDevashish
        ? devashishSeededData
        : createRoleSpecificUserDashboard(currentUser || {
            id: 'demo-user',
            name: 'Learner',
            email: 'user@learnpath.ai',
            role: 'STUDENT',
            targetRole: 'Full Stack Engineer',
            experienceLevel: 'BEGINNER',
            theme: 'light',
            learningStreak: 1,
          });
      return { success: true, data };
    } catch (error) {
      const data = isDevashish
        ? devashishSeededData
        : createRoleSpecificUserDashboard(currentUser || {
            id: 'demo-user',
            name: 'Learner',
            email: 'user@learnpath.ai',
            role: 'STUDENT',
            targetRole: 'Full Stack Engineer',
            experienceLevel: 'BEGINNER',
            theme: 'light',
            learningStreak: 1,
          });
      return { success: true, data };
    }
  },

  async toggleFocusTask(taskId: string): Promise<{ success: boolean; data: any }> {
    const currentUser = getStoredUser();
    userProgressStore.toggleFocusTask(taskId, currentUser?.id);

    try {
      const res = await api.patch(`/progress/focus/${taskId}/toggle`);
      return res.data;
    } catch (error) {
      return { success: true, data: { id: taskId } };
    }
  },
};
