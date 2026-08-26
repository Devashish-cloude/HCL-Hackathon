import { Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getSkillAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
      orderBy: { proficiencyScore: 'desc' },
    });

    const skillGaps = await prisma.skillGap.findMany({
      where: { userId },
    });

    // Compute overall category proficiency
    const competencyBreakdown = userSkills.map((us) => ({
      id: us.id,
      name: us.skill.name,
      proficiencyScore: us.proficiencyScore,
      status: us.status,
      targetLevel: us.targetLevel,
    }));

    const avgProficiency =
      userSkills.length > 0
        ? Math.round(
            userSkills.reduce((sum, s) => sum + s.proficiencyScore, 0) / userSkills.length
          )
        : 78;

    const primaryAssessment = {
      category: 'JavaScript Engineering',
      targetLevel: 'Advanced',
      overallProficiency: avgProficiency || 78,
      statusLabel: avgProficiency >= 70 ? 'Proficient Level achieved' : 'Developing Level',
      competencies: competencyBreakdown.filter((c) => c.name !== 'Async Programming'),
    };

    const recommendedNextStep = {
      title: 'Advanced Asynchronous Patterns in JS',
      description:
        'Focus on Promises, Async/Await under the hood, and handling complex race conditions.',
      estimatedHours: 'Est. 4 hours',
      typeLabel: 'Video + Exercises',
      courseSlug: 'advanced-async-patterns',
    };

    return res.status(200).json({
      success: true,
      data: {
        primaryAssessment,
        recommendedNextStep,
        gapAreas: skillGaps,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
