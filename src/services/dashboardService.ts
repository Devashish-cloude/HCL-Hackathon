import api from './api.js';
import { DashboardData } from '../types/index.js';

const fallbackDashboardData: DashboardData = {
  user: {
    name: 'Devashish',
    headline: 'Professional Learner',
    targetRole: 'Frontend Engineer',
  },
  heroCourse: {
    title: 'JavaScript Async Programming',
    slug: 'js-async-programming',
    description: 'Master Promises, async/await, and event loops to handle complex data fetching an...',
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

export const dashboardService = {
  async getDashboardData(): Promise<{ success: boolean; data: DashboardData }> {
    try {
      const res = await api.get<{ success: boolean; data: DashboardData }>('/dashboard');
      if (res.data && res.data.success && res.data.data) {
        return res.data;
      }
      return { success: true, data: fallbackDashboardData };
    } catch (error) {
      // Graceful fallback for static deployments (Vercel)
      return { success: true, data: fallbackDashboardData };
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
