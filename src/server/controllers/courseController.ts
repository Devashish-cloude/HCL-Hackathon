import { Request, Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { ActivityService } from '../services/activityService.js';

export const listCourses = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    const courses = await prisma.course.findMany({
      where: {
        ...(category && category !== 'ALL' && { category: String(category) }),
        ...(search && {
          OR: [
            { title: { contains: String(search), mode: 'insensitive' } },
            { description: { contains: String(search), mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { isFeatured: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    const course = await prisma.course.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let enrollment = null;
    let userProgresses: any[] = [];

    if (userId) {
      enrollment = await prisma.courseEnrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
      });

      userProgresses = await prisma.userProgress.findMany({
        where: {
          userId,
          moduleId: { in: course.modules.map((m) => m.id) },
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...course,
        enrollment,
        userProgresses,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const enrollCourse = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const course = await prisma.course.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const enrollment = await prisma.courseEnrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
      update: {
        status: 'IN_PROGRESS',
        lastAccessedAt: new Date(),
      },
      create: {
        userId,
        courseId: course.id,
        status: 'IN_PROGRESS',
        progressPercentage: 0,
        startedAt: new Date(),
      },
    });

    await ActivityService.logActivity({
      userId,
      activityType: 'COURSE_STARTED',
      entityType: 'Course',
      entityId: course.id,
      metadata: { courseTitle: course.title, courseSlug: course.slug },
    });

    return res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
