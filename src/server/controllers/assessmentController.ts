import { Request, Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { ActivityService } from '../services/activityService.js';

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
      {
        id: 'be-eng',
        title: 'Backend Systems & PostgreSQL Benchmark',
        category: 'Backend Engineering',
        estimatedMinutes: 15,
        questionCount: 3,
        targetRole: 'Backend Engineer',
        difficulty: 'Intermediate',
      },
    ];

    if (targetRole.includes('AI')) {
      assessments = assessments.filter((a) => a.targetRole.includes('AI'));
    } else if (targetRole.includes('Full')) {
      assessments = assessments.filter((a) => a.targetRole.includes('Full'));
    } else if (targetRole.includes('Backend')) {
      assessments = assessments.filter((a) => a.targetRole.includes('Backend') || a.targetRole.includes('Full'));
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
    const score = Math.max(60, Math.round((correctCount / (answers.length || 1)) * 100));

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { targetRole: true } });
    const targetRole = user?.targetRole || 'Full Stack Engineer';

    // Create Assessment record
    const assessment = await prisma.assessment.create({
      data: {
        userId,
        title: title || 'Engineering Proficiency Benchmark',
        category: category || 'Full Stack Architecture',
        targetRole,
        score,
        maxScore: 100,
        proficiencyResult: score >= 80 ? 'Mastery Level Achieved 🎉' : 'Proficient Level Achieved',
        feedback: `Demonstrated strong command of ${category}! High competency in core architectural patterns and concurrency.`,
        status: 'COMPLETED',
      },
    });

    // Create AssessmentAttempt for historical growth tracking
    await prisma.assessmentAttempt.create({
      data: {
        userId,
        assessmentId: assessment.id,
        score,
        maxScore: 100,
        percentage: score,
        passed: score >= 60,
        answers: JSON.stringify(answers),
        startedAt: new Date(Date.now() - 15 * 60000),
        submittedAt: new Date(),
      },
    });

    // Record LearningSession (15 mins)
    await prisma.learningSession.create({
      data: {
        userId,
        activityType: 'ASSESSMENT',
        durationMinutes: 15,
        startedAt: new Date(Date.now() - 15 * 60000),
        endedAt: new Date(),
      },
    });

    // Record Skill History & update SkillGap if needed
    if (score < 75) {
      await prisma.skillGap.create({
        data: {
          userId,
          skillName: category,
          currentScore: score,
          targetScore: 85,
          priority: 'CRITICAL',
          status: 'OPEN',
          severity: 'Moderate',
          description: `Score in ${category} (${score}%) indicates area for reinforcement.`,
          targetLevel: 'Advanced',
        },
      });
    } else {
      // Resolve any existing skill gaps for this category
      await prisma.skillGap.updateMany({
        where: { userId, skillName: category, status: 'OPEN' },
        data: { status: 'RESOLVED', resolvedAt: new Date() },
      });
    }

    // Update user total hours & lastActiveAt
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalHoursInvested: { increment: 0.25 },
        lastActiveAt: new Date(),
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        userId,
        title: `Assessment Completed: ${category}`,
        message: `You scored ${score}% in ${category}! Your skill graph has been updated.`,
        type: 'ASSESSMENT',
      },
    });

    // Log Activity
    await ActivityService.logActivity({
      userId,
      activityType: 'ASSESSMENT_COMPLETED',
      entityType: 'Assessment',
      entityId: assessment.id,
      metadata: { title: assessment.title, category, score },
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
