import api from './api.js';
import { Conversation, ChatMessage } from '../types/index.js';

export const aiService = {
  async getConversations(): Promise<{
    success: boolean;
    data: {
      conversations: Conversation[];
      grouped: {
        TODAY: Conversation[];
        YESTERDAY: Conversation[];
        PREVIOUS: Conversation[];
      };
    };
  }> {
    const res = await api.get('/conversations');
    return res.data;
  },

  async getConversation(id: string): Promise<{ success: boolean; data: Conversation }> {
    const res = await api.get<{ success: boolean; data: Conversation }>(`/conversations/${id}`);
    return res.data;
  },

  async createConversation(data?: { title?: string; initialMessage?: string }): Promise<{ success: boolean; data: Conversation }> {
    const res = await api.post<{ success: boolean; data: Conversation }>('/conversations', data || {});
    return res.data;
  },

  async deleteConversation(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/conversations/${id}`);
    return res.data;
  },

  async sendMessage(data: {
    conversationId?: string;
    message: string;
  }): Promise<{
    success: boolean;
    conversationId: string;
    userMessage: ChatMessage;
    aiMessage: ChatMessage;
  }> {
    const res = await api.post('/ai/chat', data);
    return res.data;
  },
};
