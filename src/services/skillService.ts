import api from './api.js';
import { SkillAnalysisData } from '../types/index.js';

const fallbackSkillData: SkillAnalysisData = {
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

export const skillService = {
  async getSkillAnalysis(): Promise<{ success: boolean; data: SkillAnalysisData }> {
    try {
      const res = await api.get<{ success: boolean; data: SkillAnalysisData }>('/skills');
      if (res.data && res.data.success && res.data.data) {
        return res.data;
      }
      return { success: true, data: fallbackSkillData };
    } catch (error) {
      return { success: true, data: fallbackSkillData };
    }
  },
};
