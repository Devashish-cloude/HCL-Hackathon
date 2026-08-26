import { Request, Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const listCourses = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    const courses = await prisma.course.findMany({
      where: {
        ...(category && { category: String(category) }),
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

export const getCourseDetails = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

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

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
