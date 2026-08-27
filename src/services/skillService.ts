import api from './api.js';
import { SkillAnalysisData, User } from '../types/index.js';
import { getRoleCurriculum } from '../lib/roleCurricula.js';

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

function createRoleSpecificSkillData(user: User): SkillAnalysisData {
  const config = getRoleCurriculum(user.targetRole);

  return {
    primaryAssessment: {
      category: `${config.roleName} Proficiency`,
      targetLevel: 'Beginner to Advanced',
      overallProficiency: 0,
      statusLabel: 'Baseline Assessment Pending',
      competencies: config.competencies.map((comp, idx) => ({
        id: `c-${idx + 1}`,
        name: comp.name,
        proficiencyScore: 0,
        status: 'NEEDS_PRACTICE',
        targetLevel: comp.targetLevel,
      })),
    },
    recommendedNextStep: {
      title: `Take ${config.roleName} Benchmark`,
      description:
        `Complete a quick technical assessment to calibrate your competencies in ${config.competencies.map(c => c.name).join(', ')}.`,
      estimatedHours: 'Est. 10 mins',
      typeLabel: 'Interactive Benchmark',
      courseSlug: config.heroCourse.slug,
    },
    gapAreas: [
      {
        id: `gap-${config.category.toLowerCase().replace(/\s+/g, '-')}`,
        skillName: config.competencies[0]?.name || 'Core Fundamentals',
        severity: 'Moderate',
        description: `Complete your initial technical assessment to generate a fine-grained skill gap diagnosis.`,
        targetLevel: config.competencies[0]?.targetLevel || 'Intermediate',
        recommendedCourseTitle: config.heroCourse.title,
        recommendedCourseId: config.heroCourse.slug,
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
        : createRoleSpecificSkillData(currentUser);
      return { success: true, data };
    } catch (error) {
      const data = isDevashish || !currentUser
        ? devashishSkillData
        : createRoleSpecificSkillData(currentUser);
      return { success: true, data };
    }
  },
};
