import api from './api.js';
import { AssessmentQuestion, AssessmentResult } from '../types/index.js';

export const assessmentService = {
  async getAvailableAssessments(): Promise<{ success: boolean; data: any[] }> {
    const res = await api.get('/assessments/available');
    return res.data;
  },

  async getQuestions(category = 'JavaScript'): Promise<{ success: boolean; data: AssessmentQuestion[] }> {
    const res = await api.get<{ success: boolean; data: AssessmentQuestion[] }>(`/assessments/questions?category=${category}`);
    return res.data;
  },

  async submitAssessment(data: {
    title: string;
    category: string;
    answers: { questionId: string; selectedOptionIndex: number }[];
  }): Promise<{ success: boolean; data: AssessmentResult }> {
    const res = await api.post<{ success: boolean; data: AssessmentResult }>('/assessments/submit', data);
    return res.data;
  },

  async getHistory(): Promise<{ success: boolean; data: any[] }> {
    const res = await api.get('/assessments/history');
    return res.data;
  },
};
