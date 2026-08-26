import api from './api.js';
import { SkillAnalysisData } from '../types/index.js';

export const skillService = {
  async getSkillAnalysis(): Promise<{ success: boolean; data: SkillAnalysisData }> {
    const res = await api.get<{ success: boolean; data: SkillAnalysisData }>('/skills');
    return res.data;
  },
};
