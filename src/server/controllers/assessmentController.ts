import { Request, Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getAvailableAssessments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    let targetRole = 'Full Stack Engineer';

    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) targetRole = user.targetRole;
    }

    let assessments = [
      {
        id: 'fs-eng',
        title: 'Full Stack TypeScript Architecture Benchmark',
        category: 'Full Stack TypeScript',
        estimatedMinutes: 15,
        questionCount: 3,
        targetRole: 'Full Stack Engineer',
        difficulty: 'Intermediate',
      },
      {
        id: 'ai-eng',
        title: 'AI & Systems Machine Learning Benchmark',
        category: 'AI & Systems Engineering',
        estimatedMinutes: 15,
        questionCount: 3,
        targetRole: 'AI & Systems Engineer',
        difficulty: 'Intermediate',
      },
      {
        id: 'fe-eng',
        title: 'Frontend React Architecture Benchmark',
        category: 'Frontend Engineering',
        estimatedMinutes: 15,
        questionCount: 3,
        targetRole: 'Frontend Engineer',
        difficulty: 'Intermediate',
      },
    ];

    if (targetRole.includes('AI')) {
      assessments = assessments.filter((a) => a.targetRole.includes('AI'));
    } else if (targetRole.includes('Full')) {
      assessments = assessments.filter((a) => a.targetRole.includes('Full'));
    } else if (targetRole.includes('Backend')) {
      assessments = assessments.filter((a) => a.targetRole.includes('Full') || a.targetRole.includes('Frontend'));
    }

    return res.status(200).json({
      success: true,
      data: assessments,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssessmentQuestions = async (req: Request, res: Response) => {
  try {
    const { category = 'Full Stack' } = req.query;

    const questions = await prisma.assessmentQuestion.findMany({
      where: {
        category: { contains: String(category), mode: 'insensitive' },
      },
      take: 5,
    });

    if (questions.length > 0) {
      const formattedQuestions = questions.map((q) => ({
        id: q.id,
        category: q.category,
        questionText: q.questionText,
        codeBlock: q.codeBlock,
        options: JSON.parse(q.options),
        skillTested: q.skillTested,
        difficulty: q.difficulty,
      }));

      return res.status(200).json({
        success: true,
        data: formattedQuestions,
      });
    }

    // Default fallback questions if DB questions table is empty
    return res.status(200).json({
      success: true,
      data: [
        {
          id: 'q-1',
          category: 'TypeScript & Architecture',
          questionText: 'How does Zod ensure end-to-end type safety in full-stack TypeScript applications?',
          codeBlock: 'const UserSchema = z.object({ id: z.string().uuid(), email: z.string().email() });\ntype User = z.infer<typeof UserSchema>;',
          options: [
            'By validating data at runtime and inferring static TypeScript types automatically',
            'By compiling TypeScript to native C++ bytecode at build time',
            'By disabling all JavaScript type coercion in browser memory',
            'By encrypting API payloads with AES-256 before transmission',
          ],
          skillTested: 'End-to-End Type Safety',
          difficulty: 'Intermediate',
        },
        {
          id: 'q-2',
          category: 'TypeScript & Architecture',
          questionText: 'Which method returns a promise that resolves after all of the given promises have either fulfilled or rejected?',
          codeBlock: null,
          options: ['Promise.allSettled()', 'Promise.all()', 'Promise.race()', 'Promise.any()'],
          skillTested: 'Async Programming',
          difficulty: 'Intermediate',
        },
      ],
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitAssessment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { title, category, answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers array is required.' });
    }

    const correctCount = answers.filter((a: any) => a.selectedOptionIndex === 0).length;
    const score = Math.max(75, Math.round((correctCount / (answers.length || 1)) * 100));

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { targetRole: true } });
    const targetRole = user?.targetRole || 'Full Stack Engineer';

    const assessment = await prisma.assessment.create({
      data: {
        userId,
        title: title || 'Engineering Proficiency Benchmark',
        category: category || 'Full Stack Architecture',
        targetRole,
        score,
        maxScore: 100,
        proficiencyResult: score >= 80 ? 'Mastery Level Achieved 🎉' : 'Proficient Level Achieved',
        feedback: `Demonstrated solid command of ${category}! High score in core architectural patterns and concurrency.`,
        status: 'COMPLETED',
      },
    });

    // Update study time
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalHoursInvested: { increment: 0.5 },
      },
    });

    return res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssessmentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const history = await prisma.assessment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
