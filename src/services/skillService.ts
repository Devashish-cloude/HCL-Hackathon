import api from './api.js';
import { SkillAnalysisData, User } from '../types/index.js';
import { getRoleCurriculum } from '../lib/roleCurricula.js';
import { userProgressStore } from './userProgressStore.js';

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
  ],
};

function createRoleSpecificSkillData(user: User): SkillAnalysisData {
  const config = getRoleCurriculum(user.targetRole);
  const progress = userProgressStore.getProgress(user.id);

  const completedFocusCount = progress.completedFocusTaskIds.length;
  const completedLessonsCount = progress.completedLessonKeys.length;
  const totalUnits = completedFocusCount + completedLessonsCount;

  // Calculate dynamic overall proficiency (aligned with progress)
  const overallProficiency = Math.min(
    100,
    Math.round(totalUnits * 20)
  );

  let statusLabel = 'Baseline Assessment Pending';
  if (overallProficiency >= 80) {
    statusLabel = 'Mastery Level Achieved 🎉';
  } else if (overallProficiency >= 50) {
    statusLabel = 'Proficient Level Achieved';
  } else if (overallProficiency > 0) {
    statusLabel = 'Developing Competency';
  }

  // Calculate dynamic competency scores
  const updatedCompetencies = config.competencies.map((comp, idx) => {
    let score = 0;
    let status: 'MASTERED' | 'PROFICIENT' | 'NEEDS_PRACTICE' = 'NEEDS_PRACTICE';

    if (idx === 0) {
      score = Math.min(100, Math.round(totalUnits * 35));
    } else if (idx === 1) {
      score = Math.min(100, Math.max(0, Math.round((totalUnits - 1) * 30)));
    } else {
      score = Math.min(100, Math.max(0, Math.round((totalUnits - 2) * 25)));
    }

    if (score >= 80) {
      status = 'MASTERED';
    } else if (score >= 40) {
      status = 'PROFICIENT';
    }

    return {
      id: `c-${idx + 1}`,
      name: comp.name,
      proficiencyScore: score,
      status,
      targetLevel: comp.targetLevel,
    };
  });

  return {
    primaryAssessment: {
      category: `${config.roleName} Proficiency`,
      targetLevel: 'Beginner to Advanced',
      overallProficiency,
      statusLabel,
      competencies: updatedCompetencies,
    },
    recommendedNextStep: {
      title: overallProficiency >= 70
        ? `Advance in ${config.heroCourse.title}`
        : `Take ${config.roleName} Benchmark`,
      description:
        `Complete hands-on engineering challenges in ${config.competencies.map((c) => c.name).join(', ')}.`,
      estimatedHours: 'Est. 15 mins',
      typeLabel: 'Interactive Practice',
      courseSlug: config.heroCourse.slug,
    },
    gapAreas: [
      {
        id: `gap-${config.category.toLowerCase().replace(/\s+/g, '-')}`,
        skillName: updatedCompetencies.find((c) => c.status === 'NEEDS_PRACTICE')?.name || config.competencies[0]?.name,
        severity: overallProficiency >= 60 ? 'Low' : 'Moderate',
        description: overallProficiency > 0
          ? `Solid foundation established! Continue solving coding challenges to achieve verified mastery.`
          : `Complete your initial technical assessment or focus tasks to benchmark your skills.`,
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
