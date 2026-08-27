import api from './api.js';
import { LearningPathData, User } from '../types/index.js';
import { getRoleCurriculum } from '../lib/roleCurricula.js';

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('learnpath_user_data');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

const devashishLearningPath: LearningPathData = {
  id: 'path-1',
  title: 'Frontend Engineering Path',
  description:
    'Your personalized roadmap to mastering full-stack web development. Progress steadily through foundational concepts to advanced architectural patterns.',
  targetRole: 'Frontend Engineer',
  stats: {
    overallProgress: 42,
    timeInvestedHours: 38,
    estimatedRemainingHours: 52,
    currentFocus: 'Async JavaScript',
  },
  phases: [
    {
      id: 'phase-1',
      phaseNumber: 1,
      title: 'Foundation',
      description: 'Core web building blocks and language primitives.',
      estimatedHours: 15,
      status: 'COMPLETED',
      iconType: 'check',
      order: 1,
      modules: [
        {
          id: 'm-1',
          phaseId: 'phase-1',
          title: 'JavaScript Basics',
          summary: 'Variables, Data Types, Control Flow, and Loops.',
          isCurrent: false,
          status: 'COMPLETED',
          progressPercentage: 100,
          order: 1,
        },
      ],
    },
    {
      id: 'phase-2',
      phaseNumber: 2,
      title: 'Core Skills',
      description: 'Deep dive into mechanics and interacting with the browser.',
      estimatedHours: 25,
      status: 'IN_PROGRESS',
      iconType: 'academic',
      order: 2,
      modules: [
        {
          id: 'm-2',
          phaseId: 'phase-2',
          title: 'Functions & Scope',
          summary: 'Closures, Execution Contexts, and Higher-Order Functions.',
          isCurrent: false,
          status: 'COMPLETED',
          progressPercentage: 100,
          order: 1,
        },
        {
          id: 'm-3',
          phaseId: 'phase-2',
          title: 'DOM Manipulation',
          summary: 'Event listeners, tree traversal, and dynamic rendering.',
          isCurrent: false,
          status: 'COMPLETED',
          progressPercentage: 100,
          order: 2,
        },
        {
          id: 'm-4',
          phaseId: 'phase-2',
          title: 'Async JavaScript',
          summary: 'Promises, Async/Await, Event Loop',
          isCurrent: true,
          status: 'IN_PROGRESS',
          progressPercentage: 30,
          order: 3,
        },
      ],
    },
    {
      id: 'phase-3',
      phaseNumber: 3,
      title: 'Architecture & Frameworks',
      description: 'Component architecture, state management, and modern tools.',
      estimatedHours: 40,
      status: 'LOCKED',
      iconType: 'lock',
      order: 3,
      modules: [
        {
          id: 'm-5',
          phaseId: 'phase-3',
          title: 'REST APIs & Fetch',
          summary: 'Network requests and data handling.',
          isCurrent: false,
          status: 'LOCKED',
          progressPercentage: 0,
          order: 1,
        },
        {
          id: 'm-6',
          phaseId: 'phase-3',
          title: 'React Fundamentals',
          summary: 'Components, State, and Props.',
          isCurrent: false,
          status: 'LOCKED',
          progressPercentage: 0,
          order: 2,
        },
      ],
    },
    {
      id: 'phase-4',
      phaseNumber: 4,
      title: 'Advanced Application',
      description: 'Synthesize skills into a production-ready application.',
      estimatedHours: 30,
      status: 'LOCKED',
      iconType: 'trophy',
      order: 4,
      modules: [
        {
          id: 'm-7',
          phaseId: 'phase-4',
          title: 'Full Stack Capstone Project',
          summary:
            'Build, deploy, and document a complete web application integrating all previous modules.',
          isCurrent: false,
          status: 'LOCKED',
          progressPercentage: 0,
          order: 1,
        },
      ],
    },
  ],
};

function createRoleSpecificLearningPath(user: User): LearningPathData {
  const config = getRoleCurriculum(user.targetRole);

  return {
    id: `path-${Date.now()}`,
    title: `${config.roleName} Path`,
    description: `Personalized curriculum tailored for ${user.name}. Master ${config.roleName} systematically through foundational primitives to advanced production architecture.`,
    targetRole: config.roleName,
    stats: {
      overallProgress: 0,
      timeInvestedHours: 0,
      estimatedRemainingHours: config.learningPhases.reduce((acc, p) => acc + p.estimatedHours, 0),
      currentFocus: config.learningPhases[0]?.modules[0]?.title || 'Fundamentals',
    },
    phases: config.learningPhases.map((phase, idx) => ({
      id: `phase-${idx + 1}`,
      phaseNumber: phase.phaseNumber,
      title: phase.title,
      description: phase.description,
      estimatedHours: phase.estimatedHours,
      status: idx === 0 ? 'IN_PROGRESS' : 'LOCKED',
      iconType: idx === 0 ? 'academic' : idx === config.learningPhases.length - 1 ? 'trophy' : 'lock',
      order: phase.phaseNumber,
      modules: phase.modules.map((m, mIdx) => ({
        id: `mod-${idx + 1}-${mIdx + 1}`,
        phaseId: `phase-${idx + 1}`,
        title: m.title,
        summary: m.summary,
        isCurrent: idx === 0 && mIdx === 0,
        status: idx === 0 ? 'IN_PROGRESS' : 'LOCKED',
        progressPercentage: 0,
        order: mIdx + 1,
      })),
    })),
  };
}

export const learningPathService = {
  async getLearningPath(): Promise<{ success: boolean; data: LearningPathData }> {
    const currentUser = getStoredUser();
    const isDevashish =
      currentUser &&
      (currentUser.email.toLowerCase().includes('devashish') ||
        currentUser.name.toLowerCase() === 'devashish');

    try {
      const res = await api.get<{ success: boolean; data: LearningPathData }>('/learning-path');
      if (res.data && res.data.success && res.data.data) {
        return res.data;
      }
      const data = isDevashish || !currentUser
        ? devashishLearningPath
        : createRoleSpecificLearningPath(currentUser);
      return { success: true, data };
    } catch (error) {
      const data = isDevashish || !currentUser
        ? devashishLearningPath
        : createRoleSpecificLearningPath(currentUser);
      return { success: true, data };
    }
  },

  async generatePath(data: {
    targetRole: string;
    experienceLevel: string;
    goalDescription?: string;
  }): Promise<{ success: boolean; data: any }> {
    try {
      const res = await api.post('/learning-path/generate', data);
      return res.data;
    } catch (error) {
      const currentUser = getStoredUser();
      const user = currentUser
        ? { ...currentUser, targetRole: data.targetRole }
        : { ...devashishLearningPath, targetRole: data.targetRole };
      return { success: true, data: createRoleSpecificLearningPath(user as any) };
    }
  },
};
