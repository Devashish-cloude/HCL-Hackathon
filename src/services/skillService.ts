import api from './api.js';
import { SkillAnalysisData, User } from '../types/index.js';

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('learnpath_user_data');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

const devashishSkillData: SkillAnalysisData = {
  primaryAssessment: {
    category: 'JavaScript Engineering',
    targetLevel: 'Advanced',
    overallProficiency: 78,
    statusLabel: 'Proficient Level achieved',
    competencies: [
      {
        id: 'c-1',
        name: 'DOM Manipulation',
        proficiencyScore: 90,
        status: 'MASTERED',
        targetLevel: 'Advanced',
      },
      {
        id: 'c-2',
        name: 'ES6+ Features',
        proficiencyScore: 85,
        status: 'PROFICIENT',
        targetLevel: 'Advanced',
      },
      {
        id: 'c-3',
        name: 'Data Structures',
        proficiencyScore: 80,
        status: 'PROFICIENT',
        targetLevel: 'Advanced',
      },
    ],
  },
  recommendedNextStep: {
    title: 'Advanced Asynchronous Patterns in JS',
    description:
      'Focus on Promises, Async/Await under the hood, and handling complex race conditions.',
    estimatedHours: 'Est. 4 hours',
    typeLabel: 'Video + Exercises',
    courseSlug: 'advanced-async-patterns',
  },
  gapAreas: [
    {
      id: 'gap-1',
      skillName: 'Async Programming',
      severity: 'Critical',
      description: 'Struggles observed with Promise.all and error bubbling in complex chains.',
      targetLevel: 'Advanced',
      recommendedCourseTitle: 'Advanced Asynchronous Patterns in JS',
      recommendedCourseId: 'adv-async',
    },
    {
      id: 'gap-2',
      skillName: 'API Integration',
      severity: 'Moderate',
      description:
        'Needs deeper understanding of RESTful principles and handling varied HTTP status codes gracefully.',
      targetLevel: 'Advanced',
      recommendedCourseTitle: 'APIs & Fetch',
      recommendedCourseId: 'apis-and-fetch',
    },
    {
      id: 'gap-3',
      skillName: 'Error Handling',
      severity: 'Moderate',
      description: 'Inconsistent use of try/catch blocks and custom error boundaries.',
      targetLevel: 'Advanced',
      recommendedCourseTitle: 'JavaScript Async Programming',
      recommendedCourseId: 'js-async-programming',
    },
  ],
};

function createNewUserSkillData(user: User): SkillAnalysisData {
  return {
    primaryAssessment: {
      category: `${user.targetRole || 'Frontend'} Engineering`,
      targetLevel: 'Beginner to Intermediate',
      overallProficiency: 0,
      statusLabel: 'Baseline Assessment Pending',
      competencies: [
        {
          id: 'c-1',
          name: 'DOM Manipulation',
          proficiencyScore: 0,
          status: 'NEEDS_PRACTICE',
          targetLevel: 'Beginner',
        },
        {
          id: 'c-2',
          name: 'ES6+ Features',
          proficiencyScore: 0,
          status: 'NEEDS_PRACTICE',
          targetLevel: 'Beginner',
        },
        {
          id: 'c-3',
          name: 'Data Structures',
          proficiencyScore: 0,
          status: 'NEEDS_PRACTICE',
          targetLevel: 'Beginner',
        },
      ],
    },
    recommendedNextStep: {
      title: 'Take Baseline Engineering Assessment',
      description:
        'Complete a quick 5-question technical benchmark to calibrate your skills and generate your custom roadmap.',
      estimatedHours: 'Est. 10 mins',
      typeLabel: 'Interactive Quiz',
      courseSlug: 'js-async-programming',
    },
    gapAreas: [
      {
        id: 'gap-initial',
        skillName: 'Initial Calibration',
        severity: 'Moderate',
        description: 'Take your first technical test to populate real-time skill gaps and benchmark recommendations.',
        targetLevel: 'Beginner',
        recommendedCourseTitle: 'JavaScript Fundamentals',
        recommendedCourseId: 'js-async-programming',
      },
    ],
  };
}

export const skillService = {
  async getSkillAnalysis(): Promise<{ success: boolean; data: SkillAnalysisData }> {
    const currentUser = getStoredUser();
    const isDevashish =
      currentUser &&
      (currentUser.email.toLowerCase().includes('devashish') ||
        currentUser.name.toLowerCase() === 'devashish');

    try {
      const res = await api.get<{ success: boolean; data: SkillAnalysisData }>('/skills');
      if (res.data && res.data.success && res.data.data) {
        return res.data;
      }
      const data = isDevashish || !currentUser
        ? devashishSkillData
        : createNewUserSkillData(currentUser);
      return { success: true, data };
    } catch (error) {
      const data = isDevashish || !currentUser
        ? devashishSkillData
        : createNewUserSkillData(currentUser);
      return { success: true, data };
    }
  },
};
