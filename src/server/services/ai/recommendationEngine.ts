import { prisma } from '../prismaClient.js';

export class RecommendationEngine {
  public static async generateRecommendationsForUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skillGaps: true,
        userSkills: { include: { skill: true } },
      },
    });

    if (!user) return [];

    const existingRecs = await prisma.recommendation.findMany({
      where: { userId, isDismissed: false },
      include: { course: true },
    });

    if (existingRecs.length > 0) {
      return existingRecs;
    }

    // Generate recommendations based on critical/moderate skill gaps
    const recommendationsToCreate = [];

    for (const gap of user.skillGaps) {
      const course = await prisma.course.findFirst({
        where: {
          OR: [
            { title: { contains: gap.skillName, mode: 'insensitive' } },
            { description: { contains: gap.skillName, mode: 'insensitive' } },
          ],
        },
      });

      if (course) {
        recommendationsToCreate.push({
          userId,
          courseId: course.id,
          title: course.title,
          reason: `Recommended because you have a ${gap.severity.toLowerCase()} skill gap in ${gap.skillName}.`,
          tags: JSON.stringify([gap.skillName, user.targetRole]),
        });
      }
    }

    if (recommendationsToCreate.length === 0) {
      const featuredCourse = await prisma.course.findFirst({
        where: { isFeatured: true },
      });

      if (featuredCourse) {
        recommendationsToCreate.push({
          userId,
          courseId: featuredCourse.id,
          title: featuredCourse.title,
          reason: `Featured top-rated course for mastering ${user.targetRole}.`,
          tags: JSON.stringify(['Featured', user.targetRole]),
        });
      }
    }

    for (const rec of recommendationsToCreate) {
      await prisma.recommendation.create({ data: rec });
    }

    return prisma.recommendation.findMany({
      where: { userId, isDismissed: false },
      include: { course: true },
    });
  }
}
