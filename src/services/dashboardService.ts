import api from './api.js';
import { DashboardData, User } from '../types/index.js';
import { getRoleCurriculum } from '../lib/roleCurricula.js';

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
      isCompleted: false,
      order: 1,
    },
    {
      id: 'task-2',
      title: 'Practice 5 JavaScript questions',
      typeLabel: 'Coding Challenge',
      durationMinutes: 20,
      isCompleted: false,
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
      currentModuleTitle: config.heroCourse.currentModuleTitle,
      currentModuleNumber: config.heroCourse.currentModuleNumber,
      totalModules: config.heroCourse.totalModules,
      progressPercentage: 0,
      timeRemainingMinutes: config.heroCourse.estimatedMinutes,
      tag: 'Start Learning',
    },
    todayFocus: config.todayFocus,
    roadmapTrack: {
      pathTitle: `${config.roleName} Path`,
      steps: config.roadmapSteps,
    },
    stats: {
      overallProgress: 0,
      learningStreak: 1,
      skillsMastered: 0,
      coursesCompleted: 0,
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
      const data = isDevashish || !currentUser
        ? devashishSeededData
        : createRoleSpecificUserDashboard(currentUser);
      return { success: true, data };
    } catch (error) {
      const data = isDevashish || !currentUser
        ? devashishSeededData
        : createRoleSpecificUserDashboard(currentUser);
      return { success: true, data };
    }
  },

  async toggleFocusTask(taskId: string): Promise<{ success: boolean; data: any }> {
    try {
      const res = await api.patch(`/progress/focus/${taskId}/toggle`);
      return res.data;
    } catch (error) {
      return { success: true, data: { id: taskId } };
    }
  },
};
