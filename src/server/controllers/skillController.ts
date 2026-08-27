import { Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const roleSkillsTemplate: { [role: string]: { name: string; targetLevel: string }[] } = {
  'Full Stack Engineer': [
    { name: 'TypeScript Architecture', targetLevel: 'Advanced' },
    { name: 'React 18 & State Sync', targetLevel: 'Advanced' },
    { name: 'Node.js & Database Systems', targetLevel: 'Advanced' },
    { name: 'REST & GraphQL Contracts', targetLevel: 'Intermediate' },
  ],
  'AI & Systems Engineer': [
    { name: 'PyTorch & Tensor Operations', targetLevel: 'Advanced' },
    { name: 'Autograd & Backpropagation', targetLevel: 'Advanced' },
    { name: 'Neural Network Architectures', targetLevel: 'Advanced' },
    { name: 'Vector DBs & RAG Pipelines', targetLevel: 'Intermediate' },
  ],
  'Backend Engineer': [
    { name: 'Express Server Architecture', targetLevel: 'Advanced' },
    { name: 'PostgreSQL & Query Optimization', targetLevel: 'Advanced' },
    { name: 'Auth & JWT Middleware Chains', targetLevel: 'Advanced' },
    { name: 'Caching & Connection Pools', targetLevel: 'Intermediate' },
  ],
  'Frontend Engineer': [
    { name: 'DOM & Component Architecture', targetLevel: 'Advanced' },
    { name: 'ES6+ & Asynchronous Mechanics', targetLevel: 'Advanced' },
    { name: 'State Management & Custom Hooks', targetLevel: 'Advanced' },
    { name: 'Tailwind & Responsive Systems', targetLevel: 'Intermediate' },
  ],
};

export const getSkillAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        focusTasks: true,
        progress: true,
        userSkills: {
          include: { skill: true },
          orderBy: { proficiencyScore: 'desc' },
        },
        skillGaps: true,
        assessments: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const completedTasksCount = user.focusTasks.filter((t) => t.isCompleted).length;
    const completedProgressCount = user.progress.filter((p) => p.isCompleted).length;
    const totalUnits = completedTasksCount + completedProgressCount + user.assessments.length;

    const overallProficiency = Math.min(100, Math.round(totalUnits * 20));

    let statusLabel = 'Baseline Assessment Pending';
    if (overallProficiency >= 80) {
      statusLabel = 'Mastery Level Achieved 🎉';
    } else if (overallProficiency >= 50) {
      statusLabel = 'Proficient Level Achieved';
    } else if (overallProficiency > 0) {
      statusLabel = 'Developing Competency';
    }

    const template = roleSkillsTemplate[user.targetRole] || roleSkillsTemplate['Full Stack Engineer'];

    const competencies = template.map((tmpl, idx) => {
      let score = 0;
      let status = 'NEEDS_PRACTICE';

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
        name: tmpl.name,
        proficiencyScore: score,
        status,
        targetLevel: tmpl.targetLevel,
      };
    });

    const primaryAssessment = {
      category: `${user.targetRole} Proficiency`,
      targetLevel: 'Beginner to Advanced',
      overallProficiency,
      statusLabel,
      competencies,
    };

    const recommendedCourseSlug = user.targetRole.includes('AI')
      ? 'python-ml-foundations'
      : user.targetRole.includes('Full')
      ? 'fullstack-typescript'
      : user.targetRole.includes('Backend')
      ? 'nodejs-express-apis'
      : 'react-fundamentals';

    const recommendedNextStep = {
      title: overallProficiency >= 70
        ? `Advance to Next Module in ${user.targetRole}`
        : `Take ${user.targetRole} Benchmark Assessment`,
      description: `Complete technical exercises in ${competencies.map((c) => c.name).join(', ')}.`,
      estimatedHours: 'Est. 15 mins',
      typeLabel: 'Interactive Practice',
      courseSlug: recommendedCourseSlug,
    };

    const gapAreas = user.skillGaps.length > 0 ? user.skillGaps : [
      {
        id: `gap-${user.id}-1`,
        skillName: competencies.find((c) => c.status === 'NEEDS_PRACTICE')?.name || template[0].name,
        severity: overallProficiency >= 60 ? 'Low' : 'Moderate',
        description: overallProficiency > 0
          ? 'Solid foundational progress! Continue interactive coding challenges to achieve verified mastery.'
          : 'Complete your initial technical assessment or focus tasks to benchmark your skills.',
        targetLevel: 'Advanced',
        recommendedCourseTitle: user.targetRole,
        recommendedCourseId: recommendedCourseSlug,
      },
    ];

    return res.status(200).json({
      success: true,
      data: {
        primaryAssessment,
        recommendedNextStep,
        gapAreas,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSkillHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const history = await prisma.skillHistory.findMany({
      where: { userId },
      include: { skill: true },
      orderBy: { recordedAt: 'asc' },
    });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSkillGaps = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const gaps = await prisma.skillGap.findMany({
      where: { userId },
      orderBy: { detectedAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: gaps,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
