import api from './api.js';
import { DashboardData } from '../types/index.js';

export const dashboardService = {
  async getDashboardData(): Promise<{ success: boolean; data: DashboardData }> {
    const res = await api.get<{ success: boolean; data: DashboardData }>('/dashboard');
    return res.data;
  },

  async toggleFocusTask(taskId: string): Promise<{ success: boolean; data: any }> {
    const res = await api.patch(`/progress/focus/${taskId}/toggle`);
    return res.data;
  },
};
