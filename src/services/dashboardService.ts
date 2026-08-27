import api from './api.js';
import { DashboardData, User } from '../types/index.js';

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

function createNewUserDashboard(user: User): DashboardData {
  return {
    user: {
      name: user.name,
      headline: user.headline || `${user.targetRole || 'Frontend Engineer'} in Training`,
      targetRole: user.targetRole || 'Frontend Engineer',
    },
    heroCourse: {
      title: 'JavaScript Async Programming',
      slug: 'js-async-programming',
      description: 'Start your journey: Master modern JavaScript, execution contexts, and core asynchronous mechanics.',
      currentModuleTitle: 'Event Loop & Call Stack',
      currentModuleNumber: 1,
      totalModules: 5,
      progressPercentage: 0,
      timeRemainingMinutes: 180,
      tag: 'Start Learning',
    },
    todayFocus: [
      {
        id: 'task-new-1',
        title: 'Take baseline Technical Assessment',
        typeLabel: 'Assessment',
        durationMinutes: 10,
        isCompleted: false,
        order: 1,
      },
      {
        id: 'task-new-2',
        title: 'Complete Module 1: Event Loop Basics',
        typeLabel: 'Video & Reading',
        durationMinutes: 15,
        isCompleted: false,
        order: 2,
      },
      {
        id: 'task-new-3',
        title: 'Say hello to your AI Mentor',
        typeLabel: 'Interactive Chat',
        durationMinutes: 5,
        isCompleted: false,
        order: 3,
      },
    ],
    roadmapTrack: {
      pathTitle: `${user.targetRole || 'Frontend Engineering'} Path`,
      steps: [
        { id: '1', title: 'JS Fundamentals', status: 'IN_PROGRESS' },
        { id: '2', title: 'DOM Manipulation', status: 'LOCKED' },
        { id: '3', title: 'Async Programming', status: 'LOCKED' },
        { id: '4', title: 'APIs', status: 'LOCKED' },
        { id: '5', title: 'React', status: 'LOCKED' },
      ],
    },
    stats: {
      overallProgress: 0,
      learningStreak: 1,
      skillsMastered: 0,
      coursesCompleted: 0,
    },
    recommendation: {
      id: 'rec-new-1',
      title: 'JavaScript Async Programming',
      reason: 'Recommended starting point based on your selected target role.',
      course: {
        id: 'js-async-programming',
        title: 'JavaScript Async Programming',
        slug: 'js-async-programming',
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
        // If backend returned data with real user name, use it
        if (currentUser && res.data.data.user) {
          res.data.data.user.name = currentUser.name;
        }
        return res.data;
      }
      const data = isDevashish || !currentUser
        ? devashishSeededData
        : createNewUserDashboard(currentUser);
      return { success: true, data };
    } catch (error) {
      const data = isDevashish || !currentUser
        ? devashishSeededData
        : createNewUserDashboard(currentUser);
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
