import { Response } from 'express';
import { prisma } from '../services/prismaClient.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { MentorService } from '../services/ai/mentorService.js';

export const sendChatMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { conversationId, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    let activeConversationId = conversationId;

    // Create a new conversation if not provided
    if (!activeConversationId) {
      const titleSummary = message.slice(0, 30) + (message.length > 30 ? '...' : '');
      const newConv = await prisma.conversation.create({
        data: {
          userId,
          title: titleSummary,
          timeGroup: 'TODAY',
        },
      });
      activeConversationId = newConv.id;
    }

    // Save user message to database
    const userMsg = await prisma.chatMessage.create({
      data: {
        conversationId: activeConversationId,
        role: 'user',
        content: message,
      },
    });

    // Fetch conversation history
    const pastMessages = await prisma.chatMessage.findMany({
      where: { conversationId: activeConversationId },
      orderBy: { createdAt: 'asc' },
      take: 12,
    });

    // User context for personalized mentoring
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { skillGaps: true, learningPaths: true },
    });

    const context = {
      userRole: user?.targetRole || 'Frontend Engineer',
      currentFocus: user?.learningPaths[0]?.currentFocus || 'Async JavaScript',
      skillGaps: user?.skillGaps.map((g) => g.skillName),
    };

    // Generate AI response
    const aiResponseText = await MentorService.generateResponse(
      message,
      pastMessages.map((m) => ({
        role: m.role as any,
        content: m.content,
      })),
      context
    );

    // Save AI message to database
    const aiMsg = await prisma.chatMessage.create({
      data: {
        conversationId: activeConversationId,
        role: 'assistant',
        content: aiResponseText,
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: activeConversationId },
      data: { updatedAt: new Date() },
    });

    return res.status(200).json({
      success: true,
      conversationId: activeConversationId,
      userMessage: userMsg,
      aiMessage: aiMsg,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
