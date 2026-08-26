import { Request, Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { AssessmentEvaluator } from '../services/ai/assessmentEvaluator.js';

export const getAvailableAssessments = async (req: Request, res: Response) => {
  try {
    const categories = [
      {
        id: 'js-eng',
        title: 'JavaScript Engineering Proficiency Benchmark',
        category: 'JavaScript Engineering',
        estimatedMinutes: 15,
        questionCount: 5,
        targetRole: 'Frontend Engineer',
        difficulty: 'Intermediate',
      },
      {
        id: 'react-arch',
        title: 'React Architecture & State Mastery',
        category: 'React Engineering',
        estimatedMinutes: 20,
        questionCount: 5,
        targetRole: 'Senior React Developer',
        difficulty: 'Advanced',
      },
      {
        id: 'async-concurrency',
        title: 'Async Patterns & Concurrency Assessment',
        category: 'Async Programming',
        estimatedMinutes: 15,
        questionCount: 5,
        targetRole: 'Full Stack Engineer',
        difficulty: 'Advanced',
      },
    ];

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssessmentQuestions = async (req: Request, res: Response) => {
  try {
    const { category = 'JavaScript' } = req.query;

    const questions = await prisma.assessmentQuestion.findMany({
      where: {
        category: { contains: String(category), mode: 'insensitive' },
      },
      take: 5,
    });

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

    const result = await AssessmentEvaluator.evaluateAssessment(
      userId,
      title || 'Skill Assessment',
      category || 'JavaScript Engineering',
      answers
    );

    return res.status(200).json({
      success: true,
      data: result,
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
