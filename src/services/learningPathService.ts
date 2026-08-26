import api from './api.js';
import { LearningPathData } from '../types/index.js';

export const learningPathService = {
  async getLearningPath(): Promise<{ success: boolean; data: LearningPathData }> {
    const res = await api.get<{ success: boolean; data: LearningPathData }>('/learning-path');
    return res.data;
  },

  async generatePath(data: {
    targetRole: string;
    experienceLevel: string;
    goalDescription?: string;
  }): Promise<{ success: boolean; data: any }> {
    const res = await api.post('/learning-path/generate', data);
    return res.data;
  },
};
