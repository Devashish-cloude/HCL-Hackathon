import { Request, Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { PathGenerator } from '../services/ai/pathGenerator.js';
import { ActivityService } from '../services/activityService.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, targetRole = 'Frontend Engineer', experienceLevel = 'Intermediate' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const passwordHash = await hashPassword(password);
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    // Execute in transaction
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name,
        targetRole,
        experienceLevel,
        theme: 'light',
        headline: `${targetRole} in Training`,
        learningStreak: 1,
        longestStreak: 1,
        dailyGoalMinutes: 45,
        totalHoursInvested: 0,
        onboardingCompleted: false,
        lastLoginAt: new Date(),
        lastActiveAt: new Date(),
      },
    });

    // Create session record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    // Record login history
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        isSuccessful: true,
        ipAddress,
        userAgent,
        sessionId: session.id,
      },
    });

    // Log activities
    await ActivityService.logActivity({
      userId: user.id,
      activityType: 'SIGNUP',
      entityType: 'User',
      entityId: user.id,
      metadata: { email: user.email, name: user.name, targetRole },
    });

    await ActivityService.logActivity({
      userId: user.id,
      activityType: 'LOGIN',
      entityType: 'User',
      entityId: user.id,
      metadata: { sessionId: session.id },
    });

    // Auto-generate customized learning path for new user
    await PathGenerator.generatePersonalizedPath(user.id, targetRole, experienceLevel);

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        theme: user.theme,
        headline: user.headline,
        learningStreak: user.learningStreak,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to register account.',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      // Record failed attempt
      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          isSuccessful: false,
          ipAddress,
          userAgent,
        },
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Create session record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    // Record successful login history
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        isSuccessful: true,
        ipAddress,
        userAgent,
        sessionId: session.id,
      },
    });

    // Update user login metadata
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastActiveAt: new Date(),
      },
    });

    // Log LOGIN activity
    await ActivityService.logActivity({
      userId: user.id,
      activityType: 'LOGIN',
      entityType: 'User',
      entityId: user.id,
      metadata: { sessionId: session.id },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        theme: user.theme,
        headline: user.headline,
        learningStreak: user.learningStreak,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to authenticate user.',
    });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (userId) {
      // Revoke latest active session
      await prisma.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      // Update latest login history record with logout timestamp
      const latestLogin = await prisma.loginHistory.findFirst({
        where: { userId, logoutTimestamp: null },
        orderBy: { loginTimestamp: 'desc' },
      });

      if (latestLogin) {
        await prisma.loginHistory.update({
          where: { id: latestLogin.id },
          data: { logoutTimestamp: new Date() },
        });
      }

      // Log LOGOUT activity
      await ActivityService.logActivity({
        userId,
        activityType: 'LOGOUT',
        entityType: 'User',
        entityId: userId,
      });
    }

    res.clearCookie('token');
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error: any) {
    res.clearCookie('token');
    return res.status(200).json({
      success: true,
      message: 'Logged out.',
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        headline: true,
        bio: true,
        targetRole: true,
        experienceLevel: true,
        theme: true,
        dailyGoalMinutes: true,
        learningStreak: true,
        longestStreak: true,
        totalHoursInvested: true,
        onboardingCompleted: true,
        avatarUrl: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
